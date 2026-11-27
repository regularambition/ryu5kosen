# Windowsの「システムの復元」実行後、Cloud Functionsへのデプロイで失敗

```
npx firebase deploy --only functions --project ryu5kosen
```

上記コマンド実行後、以下のようなエラーが出てデプロイに失敗

```
Error: Cannot find module '{XXXXXXXX}\ryu5kosen\functions\node_modules\firebase-admin\lib\app\index.js'
    at createEsmNotFoundErr (node:internal/modules/cjs/loader:1611:15)
    at finalizeEsmResolution (node:internal/modules/cjs/loader:1600:9)
    at resolveExports (node:internal/modules/cjs/loader:754:14)
    at Module._findPath (node:internal/modules/cjs/loader:821:31)
    at Module._resolveFilename (node:internal/modules/cjs/loader:1557:27)
    at wrapResolveFilename (node:internal/modules/cjs/loader:1118:27)
    at defaultResolveImplForCJSLoading (node:internal/modules/cjs/loader:1142:10)
    at resolveForCJSWithHooks (node:internal/modules/cjs/loader:1169:12)
    at Module._load (node:internal/modules/cjs/loader:1341:5)
    at wrapModuleLoad (node:internal/modules/cjs/loader:261:19) {
  code: 'MODULE_NOT_FOUND',
  path: '{XXXXXXXX}\\ryu5kosen\\functions\\node_modules\\firebase-admin'
}


Error: Functions codebase could not be analyzed successfully. It may have a syntax or runtime error
```

## 原因

`functions/node_modules` にある firebase-admin@13.10.0 の実行用 JavaScript が欠けていること

## 解決策

以下の2コマンドを実行

```
npm.cmd --prefix functions ci
npm.cmd --prefix functions run build
```

その後、以下のコマンドを実行して`updateUserName`の表示を確認したため解消成功

```
node -e "console.log(Object.keys(require('./functions/lib/index.js')))"
```
