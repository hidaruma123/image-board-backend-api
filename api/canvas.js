// Vercel Serverless Function for Image Board API
import { createClient } from '@vercel/kv';

// Initialize KV store (optional, for persistent storage)
// const kv = createClient({
//   url: process.env.KV_REST_API_URL,
//   token: process.env.KV_REST_API_TOKEN,
// });

// In-memory storage (temporary solution)
const canvasStore = new Map();

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, query, body } = req;
  const { action, id } = query;

  try {
    // Health check
    if (action === 'health') {
      return res.status(200).json({
        success: true,
        message: 'サーバーは正常に動作しています',
        timestamp: new Date().toISOString()
      });
    }

    // Save canvas data
    if (action === 'save' && method === 'POST') {
      const { id: canvasId, data } = body;
      
      if (!canvasId || !data) {
        return res.status(400).json({
          success: false,
          message: 'IDとデータが必要です'
        });
      }

      const canvasData = {
        id: canvasId,
        data,
        updatedAt: new Date().toISOString()
      };

      canvasStore.set(canvasId, canvasData);

      return res.status(200).json({
        success: true,
        message: 'サーバーに保存しました',
        id: canvasId
      });
    }

    // Load canvas data
    if (action === 'load' && method === 'GET') {
      const canvasId = id;

      if (!canvasId) {
        return res.status(400).json({
          success: false,
          message: 'IDが必要です'
        });
      }

      const canvasData = canvasStore.get(canvasId);

      if (!canvasData) {
        return res.status(404).json({
          success: false,
          message: 'データが見つかりません'
        });
      }

      return res.status(200).json({
        success: true,
        data: canvasData.data,
        updatedAt: canvasData.updatedAt
      });
    }

    // List all canvases
    if (action === 'list' && method === 'GET') {
      const canvases = Array.from(canvasStore.values()).map(canvas => ({
        id: canvas.id,
        updatedAt: canvas.updatedAt,
        imageCount: canvas.data.canvasImages?.length || 0,
        groupCount: canvas.data.canvasGroups?.length || 0
      }));

      return res.status(200).json({
        success: true,
        canvases
      });
    }

    // Delete canvas
    if (action === 'delete' && method === 'DELETE') {
      const canvasId = id;

      if (!canvasId) {
        return res.status(400).json({
          success: false,
          message: 'IDが必要です'
        });
      }

      const deleted = canvasStore.delete(canvasId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'データが見つかりません'
        });
      }

      return res.status(200).json({
        success: true,
        message: '削除しました'
      });
    }

    // Unknown action
    return res.status(400).json({
      success: false,
      message: '不明なアクションです'
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'サーバーエラーが発生しました',
      error: error.message
    });
  }
}
