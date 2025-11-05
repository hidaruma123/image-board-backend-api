# Image Board Backend API (Vercel)

Image BoardアプリケーションのバックエンドAPI（Vercel Serverless Functions版）

## 概要

このプロジェクトは、Image Boardアプリケーションのデータをサーバー側に保存・読み込みするためのRESTful APIをVercel Serverless Functionsで提供します。

## 機能

- ✅ キャンバスデータの保存
- ✅ キャンバスデータの読み込み
- ✅ キャンバス一覧の取得
- ✅ キャンバスの削除
- ✅ CORS対応

## 技術スタック

- **Vercel Serverless Functions**: サーバーレスAPI
- **Node.js**: ランタイム
- **データストア**: インメモリ（一時的）

## API エンドポイント

### ヘルスチェック

```
GET /api/health
```

**レスポンス:**

```json
{
  "success": true,
  "message": "サーバーは正常に動作しています",
  "timestamp": "2025-11-05T02:00:00.000Z"
}
```

### キャンバスデータを保存

```
POST /api/canvas/save
```

**リクエストボディ:**

```json
{
  "id": "canvas-id",
  "data": {
    "canvasImages": [...],
    "canvasGroups": [...],
    "canvasZoom": 1,
    "canvasOffset": { "x": 0, "y": 0 }
  }
}
```

**レスポンス:**

```json
{
  "success": true,
  "message": "サーバーに保存しました",
  "id": "canvas-id"
}
```

### キャンバスデータを読み込み

```
GET /api/canvas/load/:id
```

**レスポンス:**

```json
{
  "success": true,
  "data": {
    "canvasImages": [...],
    "canvasGroups": [...],
    "canvasZoom": 1,
    "canvasOffset": { "x": 0, "y": 0 }
  },
  "updatedAt": "2025-11-05T02:00:00.000Z"
}
```

### キャンバス一覧を取得

```
GET /api/canvas/list
```

**レスポンス:**

```json
{
  "success": true,
  "canvases": [
    {
      "id": "canvas-1",
      "updatedAt": "2025-11-05T02:00:00.000Z",
      "imageCount": 5,
      "groupCount": 2
    }
  ]
}
```

### キャンバスを削除

```
DELETE /api/canvas/delete/:id
```

**レスポンス:**

```json
{
  "success": true,
  "message": "削除しました"
}
```

## デプロイ

### Vercelにデプロイ

1. Vercel CLIをインストール（オプション）

```bash
npm install -g vercel
```

2. デプロイ

```bash
vercel --prod
```

または、GitHubリポジトリをVercelに接続して自動デプロイ。

## 制限事項

- **データ永続化**: 現在はインメモリストレージを使用しているため、デプロイごとにデータがリセットされます
- **永続化オプション**: Vercel KVまたは外部データベース（MongoDB、PostgreSQLなど）を使用することで永続化可能

## ライセンス

MIT License
