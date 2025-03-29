export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
};

export default function middleware(request) {
  const url = new URL(request.url);
  
  // 记录请求信息，帮助调试
  console.log(`处理请求: ${url.pathname}`);
  
  // 默认返回 Response.next()，让请求继续处理
  return Response.next();
} 