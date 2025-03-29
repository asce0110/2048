#!/bin/bash
set -e

echo "===== 开始构建过程 ====="

# 显示Node版本和位置
echo "Node版本:"
node -v
echo "Node路径:"
which node

# 显示PNPM版本和位置
echo "PNPM版本:"
pnpm -v
echo "PNPM路径:"
which pnpm

# 安装依赖
echo "===== 安装依赖 ====="
pnpm install

# 创建.env文件(如果需要)
echo "===== 创建环境变量 ====="
echo "NODE_ENV=production" > .env

# 修改next.config.mjs以便在Cloudflare上运行
echo "===== 调整Next.js配置 ====="
cat > next.config.mjs << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  reactStrictMode: true,
}

export default nextConfig
EOL

# 执行Next.js构建
echo "===== 执行Next.js构建 ====="
pnpm next build

# 显示构建输出目录内容
echo "===== 构建输出目录内容 ====="
ls -la .next

echo "===== 构建完成 =====" 