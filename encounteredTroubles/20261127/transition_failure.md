# Cloud Functionsへのデプロイ完了後、GameTitleScreen画面をクリックしても動かない

## 原因

`.env.local`がWindowsの「システムの復元」により古い状態となり<br>
`VITE_FIREBASE_DATABASE_URL`の定義が消えていた

## 解決策

該当ファイルに値の定義を追加して再度デプロイし、解消を確認
