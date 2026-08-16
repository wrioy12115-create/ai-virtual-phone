// 文件路径：在你的项目根目录下，创建 app/api/opencode-proxy/[...path]/route.js

export const runtime = 'nodejs'; // 或 'edge'，取决于你的部署环境

// 1. 配置目标 API 的基础地址
const TARGET_API = '​​https://opencode.ai/zen/go/v1'; // 请替换为 OpenCodeGo 的实际 API 地址

export async function handler(req, context) {
  // 2. 处理预检请求 (OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No Content
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // 3. 构建转发请求的 URL
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api\/opencode-proxy/, '');
  const targetUrl = `${TARGET_API}${path}${url.search}`;

  // 4. 转发请求到目标 API
  const response = await fetch(targetUrl, {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  // 5. 获取响应数据
  const data = await response.text();

  // 6. 返回响应并添加 CORS 头
  return new Response(data, {
    status: response.status,
    statusText: response.statusText,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}

// 配置 Next.js App Router 的导出
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const OPTIONS = handler;
