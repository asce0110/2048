export default {
  async fetch(request, env) {
    // 从 KV 存储获取静态资源
    const url = new URL(request.url);
    
    // 获取资源路径
    const path = url.pathname;
    
    // 检查是否为API请求
    if (path.startsWith('/api/')) {
      // 处理API请求
      return await handleApiRequest(request, env);
    }
    
    // 处理静态资源或页面请求
    return await handlePageRequest(request, env);
  }
};

async function handleApiRequest(request, env) {
  // 实际的API处理逻辑
  return new Response(JSON.stringify({ error: "Not implemented" }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handlePageRequest(request, env) {
  // 让Cloudflare Pages自动处理静态资源和页面请求
  try {
    const response = await env.ASSETS.fetch(request);
    return response;
  } catch (e) {
    return new Response("Page not found", { status: 404 });
  }
} 