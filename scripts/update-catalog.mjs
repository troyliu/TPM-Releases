import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const products = {
  TPMSmokeTest: { kind: 'VSIX', description: '官網與據點叫車自動化測試工具', requirement: 'macOS、VS Code 1.96+', asset: v => `tpm-smoke-test-${v}.vsix` },
  TPMAzureAssist: { kind: 'VSIX', description: 'Azure DevOps 工作項目與報表工具', requirement: 'VS Code 1.75+', asset: v => `tpm-azure-assist-${v}.vsix` },
  TPMMongoDB: { kind: 'VSIX', description: 'MongoDB 連線與文件查詢工具', requirement: 'VS Code 1.95+', asset: v => `tpmmongodb-${v}.vsix` },
  TPMRedis: { kind: 'VSIX', description: 'Redis 連線與資料瀏覽工具', requirement: 'VS Code 1.95+', asset: v => `tpmredis-${v}.vsix` },
  TPMAzureAssistCLI: { kind: 'CLI', description: 'Azure DevOps 命令列工具', requirement: 'macOS ARM64、Node.js 26.5+', asset: v => `tpm-azure-assist-macos-arm64-v${v}` },
};

export function selectRelease(releases, product) {
  const prefix = `${product}-v`;
  return releases.filter(r => !r.draft && !r.prerelease && r.tag_name.startsWith(prefix))
    .map(r => ({ ...r, version: r.tag_name.slice(prefix.length) }))
    .filter(r => /^\d+\.\d+\.\d+$/.test(r.version))
    .filter(r => [products[product].asset(r.version), 'checksums.txt', ...(product === 'TPMAzureAssistCLI' ? ['manifest.json'] : [])]
      .every(name => r.assets.some(a => a.name === name && a.state === 'uploaded')))
    .sort((a, b) => {
      const av = a.version.split('.').map(Number), bv = b.version.split('.').map(Number);
      for (let i = 0; i < 3; i++) if (av[i] !== bv[i]) return bv[i] - av[i];
      return 0;
    })[0];
}

export function updateCatalog(releases) {
  fs.mkdirSync('catalog', { recursive: true });
  fs.mkdirSync('tools', { recursive: true });
  const rows = [];
  for (const [product, info] of Object.entries(products)) {
    const release = selectRelease(releases, product);
    const file = `catalog/${product}.json`;
    if (!release) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
      rows.push(`| ${product} | ${info.description} | ${info.requirement} | 尚未發布 |`);
      fs.writeFileSync(`tools/${product}.md`, `# ${product}\n\n尚未發布。\n`);
      continue;
    }
    const catalog = {
      product, version: release.version, tagName: release.tag_name, url: release.html_url,
      assets: release.assets.map(a => ({ name: a.name, url: a.browser_download_url, size: a.size, digest: a.digest })),
    };
    fs.writeFileSync(file, JSON.stringify(catalog, null, 2) + '\n');
    const asset = catalog.assets.find(a => a.name === info.asset(release.version));
    rows.push(`| [${product}](tools/${product}.md) | ${info.description} | ${info.requirement} | [${release.version}](${release.html_url}) · [下載](${asset.url}) |`);
    const installation = info.kind === 'VSIX'
      ? '在 VS Code 命令面板執行 `Extensions: Install from VSIX...`，選擇下載的檔案。\n'
      : `CLI 是 Node.js bundle，沒有內含 Node runtime。先安裝 Node.js 26.5.0 以上。\n\n\`\`\`bash\nmkdir -p /tmp/tpm-install ~/.local/bin\ncurl -fL '${asset.url}' -o /tmp/tpm-install/tpm\ncurl -fL '${release.html_url.replace('/tag/', '/download/')}/checksums.txt' -o /tmp/tpm-install/checksums.txt\nexpected=$(awk '$2 == "${asset.name}" {print $1}' /tmp/tpm-install/checksums.txt)\ntest -n "$expected" && printf '%s  %s\\n' "$expected" /tmp/tpm-install/tpm | shasum -a 256 -c - && install -m 755 /tmp/tpm-install/tpm ~/.local/bin/tpm\nexport PATH="$HOME/.local/bin:$PATH"\ntpm --version\n\`\`\`\n\n將上述 PATH 設定加入 shell 啟動設定檔，之後以 \`tpm update\` 更新；公開下載與更新不需要 GitHub 登入。舊版使用者請先依上方指令安裝一次。\n`;
    fs.writeFileSync(`tools/${product}.md`, `# ${product}\n\n${info.description}。需求：${info.requirement}。\n\n最新版：[${release.version}](${release.html_url}) · [下載 ${asset.name}](${asset.url})\n\n${installation}\n${product === 'TPMSmokeTest' ? '首次使用請在側邊欄按「準備瀏覽器」。Apple Silicon 已實測；Intel Mac 尚待實機驗證。舊版 0.1.0 使用者請先解除安裝，再安裝重新編號的 0.0.1。\n\n' : ''}${product === 'TPMAzureAssist' ? '公開版不含團隊成員清單。需要人員報表時，在 VS Code 的 `tpmAzureAssist.membersFilePath` 指定本機 JSON 清單的絕對路徑，格式為 `[{"name":"Example","email":"user@example.com","team":"Example"}]`。\n' : ''}`);
  }
  fs.writeFileSync('README.md', `# TPM Releases\n\nTPM 工具的公開下載入口。原始碼專案保持私有；此 repo 只保存下載說明、版本索引及發布工具。\n\n| 工具 | 用途 | 系統需求 | 最新穩定版 |\n| --- | --- | --- | --- |\n${rows.join('\n')}\n\n每個工具獨立發版，請使用上表的專屬下載入口。\n\n所有版本附有 \`checksums.txt\`。VSIX 可用 VS Code 的 Install from VSIX 安裝。CLI 的安裝指令見專屬頁面。\n\nRelease 中 GitHub 自動提供的 Source code 壓縮檔是本下載 repo 的內容，不是工具的原始碼。已打包的 JavaScript 仍可被讀取。\n\n[發布維護說明](MAINTAINING.md)\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const pages = JSON.parse(execFileSync('gh', ['api', '--paginate', '--slurp', 'repos/troyliu/TPM-Releases/releases?per_page=100'], { encoding: 'utf8' }));
  updateCatalog(pages.flat());
}
