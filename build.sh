#!/bin/bash

# 安装依赖
echo "安装项目依赖..."
pnpm install

# 执行Next.js构建
echo "执行Next.js构建..."
pnpm next build

# 输出信息
echo "构建完成，输出目录为.next" 