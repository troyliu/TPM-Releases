# 發布維護

來源 repo 保持 private。已設定發布 workflow 的 repo 推送 `vX.Y.Z` 後執行測試、打包，再發布到本 repo 的 `<專案>-vX.Y.Z` Release。

來源 repo 的 Actions 設定：

- Variable `TPM_RELEASE_APP_CLIENT_ID`：發布 GitHub App 的 Client ID。
- Secret `TPM_RELEASE_APP_PRIVATE_KEY`：該 App 的 PEM private key。
- App 僅安裝在 `TPM-Releases`，授予 Contents: Read and write；其他權限維持預設。

Release tag 指向本下載 repo 的 main，不會複製來源 repo 的 Git 歷史。發布內容使用各來源 repo 的 `docs/public-release.md`，避免自動引用私人 commits 或 PR。

`Update download catalog` 在 Release 發布、編輯或刪除後更新 README、tools 頁面和 catalog JSON。它會讀取所有頁面的 Release，依專案及語意版本選取附件完整的穩定版。需要時可從 Actions 手動執行。

每個來源 workflow 可從 Actions 手動執行並指定既有 tag，用於重新打包或補傳。既有正式 Release 的同名附件不覆蓋，以免下載內容在同版本下改變。失敗的 draft Release 可補傳後再發布。

公開下載頁中的範例與索引不應包含公司成員清單、連線憑證或私人工作項目內容。

TPMSmokeTest 初版透過 `gh` 手動發布：來源 repo 使用 `v0.0.1`，本下載 repo 使用 `TPMSmokeTest-v0.0.1`，兩邊附上相同 VSIX 與 `checksums.txt`。新增工具須同步維護 `scripts/update-catalog.mjs` 的產品設定。
