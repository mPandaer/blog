# GitHub Pages 部署说明

本文档对应实现计划中的“阶段 3：Git 工作流与 GitHub Actions 自动部署”。

## 已完成内容

1. 已配置 `.gitignore` 忽略以下内容：
   - `node_modules/`
   - `.vitepress/dist/`
   - `.vitepress/cache/`
2. 已创建 GitHub Actions 工作流文件：
   - `.github/workflows/deploy.yml`
3. 已在 VitePress 配置中加入 GitHub Pages `base` 自动推导逻辑：
   - GitHub 仓库名为 `<repo-name>` 时，构建产物将使用 `/<repo-name>/`
   - 若仓库名以 `.github.io` 结尾，则自动使用根路径 `/`

## 工作流行为

工作流会在以下场景触发：

1. 推送到 `main` 分支
2. 在 GitHub Actions 页面手动触发

执行步骤如下：

1. 检出仓库代码
2. 安装 Node.js 20
3. 执行 `npm ci`
4. 执行 `npm run build`
5. 上传 `.vitepress/dist` 产物
6. 发布到 GitHub Pages

## 仓库需要手动确认的设置

首次启用 GitHub Pages 时，请在 GitHub 仓库设置中确认：

1. `Settings -> Pages -> Build and deployment`
   - Source 选择 `GitHub Actions`
2. `Settings -> Actions -> General -> Workflow permissions`
   - 确保工作流具备读取仓库内容的权限
3. 如果仓库启用了更细粒度的策略，请确认以下权限未被阻断：
   - `contents: read`
   - `pages: write`
   - `id-token: write`

## 发布结果

1. 用户站点仓库：`https://<username>.github.io/`
2. 项目站点仓库：`https://<username>.github.io/<repo-name>/`

## 本地验证命令

```bash
npm run build
```
