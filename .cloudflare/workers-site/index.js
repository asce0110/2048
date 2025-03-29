import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const DEBUG = false;

addEventListener('fetch', event => {
  try {
    event.respondWith(handleEvent(event));
  } catch (e) {
    if (DEBUG) {
      return event.respondWith(
        new Response(e.message || e.toString(), {
          status: 500,
        }),
      );
    }
    event.respondWith(new Response('Internal Error', { status: 500 }));
  }
});

async function handleEvent(event) {
  const url = new URL(event.request.url);
  let options = {};

  try {
    return await getAssetFromKV(event, options);
  } catch (e) {
    // 如果文件没有找到，可能是因为是SPA路由
    // 在这种情况下，尝试提供index.html
    if (e.status === 404) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: req => new Request(`${new URL(req.url).origin}/index.html`, req),
        });

        // 确保状态码是200
        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 200,
          headers: {
            ...notFoundResponse.headers,
            'content-type': 'text/html; charset=UTF-8',
          },
        });
      } catch (e) {
        // 如果仍然失败，返回404
        return new Response('Page not found', { status: 404 });
      }
    } else {
      return new Response(e.message || e.toString(), { status: 500 });
    }
  }
} 