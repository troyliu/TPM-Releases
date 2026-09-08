# TPM Releases

TPM 工具的公開下載入口。原始碼專案保持私有；此 repo 只保存下載說明、版本索引及發布工具。

| 工具 | 用途 | 系統需求 | 最新穩定版 |
| --- | --- | --- | --- |
| [TPMAzureAssist](tools/TPMAzureAssist.md) | Azure DevOps 工作項目與報表工具 | VS Code 1.75+ | [1.3.4](https://github.com/troyliu/TPM-Releases/releases/tag/TPMAzureAssist-v1.3.4) · [下載](https://github.com/troyliu/TPM-Releases/releases/download/TPMAzureAssist-v1.3.4/tpm-azure-assist-1.3.4.vsix) |
| [TPMMongoDB](tools/TPMMongoDB.md) | MongoDB 連線與文件查詢工具 | VS Code 1.95+ | [0.1.1](https://github.com/troyliu/TPM-Releases/releases/tag/TPMMongoDB-v0.1.1) · [下載](https://github.com/troyliu/TPM-Releases/releases/download/TPMMongoDB-v0.1.1/tpmmongodb-0.1.1.vsix) |
| [TPMRedis](tools/TPMRedis.md) | Redis 連線與資料瀏覽工具 | VS Code 1.95+ | [1.0.1](https://github.com/troyliu/TPM-Releases/releases/tag/TPMRedis-v1.0.1) · [下載](https://github.com/troyliu/TPM-Releases/releases/download/TPMRedis-v1.0.1/tpmredis-1.0.1.vsix) |
| TPMAzureAssistCLI | Azure DevOps 命令列工具 | macOS ARM64、Node.js 26.5+ | 尚未發布 |

每個工具獨立發版，請使用上表的專屬下載入口。

所有版本附有 `checksums.txt`。VSIX 可用 VS Code 的 Install from VSIX 安裝。CLI 的安裝指令見專屬頁面。

Release 中 GitHub 自動提供的 Source code 壓縮檔是本下載 repo 的內容，不是工具的原始碼。已打包的 JavaScript 仍可被讀取。

[發布維護說明](MAINTAINING.md)
