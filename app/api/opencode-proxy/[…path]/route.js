// app/api/opencode-proxy/[...path]/route.js
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req, { params }) {
  const path = params.path?.join('/') || '';
  const targetUrl = `https://opencodego.com/${path}`; // 替换成你实际的代理目标
  
  const headers = new Headers(req.headers);
  headers.delete('host'); // 避免冲突

  const response = await fetch(targetUrl, {
    method: 'POST',
    headers,
    body: req.body,
  });

  const data = await response.text();
  return new Response(data, {
    status: response.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}
