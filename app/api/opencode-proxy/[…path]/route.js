// 文件路径: app/api/opencode-proxy/[...path]/route.js
export default async (req, context) => {
  // 1. 处理预检请求 (OPTIONS)
  if (req.method === "OPTIONS") {
    const res = new Response(null, { status: 204 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return res;
  }

  try {
    // 2. 构建目标 URL (转发到 OpenCodeGo)
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/api\/opencode-proxy/, '');
    const targetUrl = `https://opencode.ai/zen/v1${path}${url.search}`;

    // 3. 转发请求
    const headers = new Headers(req.headers);
    headers.delete("host");
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? await req.text() : null,
    });

    // 4. 构建返回响应并添加 CORS 头
    const res = new Response(response.body, response);
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    return res;

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};

// Netlify Functions 的配置
export const config = {
  path: "/api/opencode-proxy/*"
};
