# TPMAzureAssistCLI

Azure DevOps 命令列工具。需求：macOS ARM64、Node.js 26.5+。

最新版：[0.3.6](https://github.com/troyliu/TPM-Releases/releases/tag/TPMAzureAssistCLI-v0.3.6) · [下載 tpm-azure-assist-macos-arm64-v0.3.6](https://github.com/troyliu/TPM-Releases/releases/download/TPMAzureAssistCLI-v0.3.6/tpm-azure-assist-macos-arm64-v0.3.6)

CLI 是 Node.js bundle，沒有內含 Node runtime。先安裝 Node.js 26.5.0 以上。

```bash
mkdir -p /tmp/tpm-install ~/.local/bin
curl -fL 'https://github.com/troyliu/TPM-Releases/releases/download/TPMAzureAssistCLI-v0.3.6/tpm-azure-assist-macos-arm64-v0.3.6' -o /tmp/tpm-install/tpm
curl -fL 'https://github.com/troyliu/TPM-Releases/releases/download/TPMAzureAssistCLI-v0.3.6/checksums.txt' -o /tmp/tpm-install/checksums.txt
expected=$(awk '$2 == "tpm-azure-assist-macos-arm64-v0.3.6" {print $1}' /tmp/tpm-install/checksums.txt)
test -n "$expected" && printf '%s  %s\n' "$expected" /tmp/tpm-install/tpm | shasum -a 256 -c - && install -m 755 /tmp/tpm-install/tpm ~/.local/bin/tpm
export PATH="$HOME/.local/bin:$PATH"
tpm --version
```

將上述 PATH 設定加入 shell 啟動設定檔，之後以 `tpm update` 更新；公開下載與更新不需要 GitHub 登入。舊版使用者請先依上方指令安裝一次。

