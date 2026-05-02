# Blog Project Agent Instructions (AGENTS.md)

## 项目概述
本项目是一个高度自动化、完全基于 Markdown 的个人博客与作品集网站。
核心理念是：**“万物皆 Markdown”**、**“目录即菜单，文件即文章”**。

## 技术栈
- **核心框架**: [VitePress](https://vitepress.dev/)
- **脚本语言**: Node.js (用于构建前自动生成目录架构)
- **CI/CD**: GitHub Actions
- **部署平台**: GitHub Pages

## 核心架构与设计规范

### 1. 内容组织原则
- 所有的博客内容均放置在 `content/` 目录下。
- **首页/简历**：位于 `content/index.md`。必须使用**纯 Markdown 语法**（通过标题、列表等形式书写工作经历、作品集），禁止将大段内容写入 Frontmatter。通过在 Markdown 文件内混编 `<style scoped>` 来进行页面的美化和布局自定义。
- **路由与菜单**：通过读取 `content/` 下的物理文件夹层级，自动映射为网站的顶部导航栏（Nav）和侧边栏（Sidebar）。

### 2. 自动化排序与前缀隐藏规则
- 允许在文件夹和 Markdown 文件名前添加数字前缀（如 `001-`、`002-`）来控制展示顺序。
- 在 `scripts/generate-nav.js` 脚本中处理时：
  1. 必须根据数字前缀进行升序排列。
  2. 无前缀的按默认字母顺序排列，跟在有前缀的后面。
  3. 注入到 VitePress 配置时，必须剔除文件显示名称中的前缀和扩展名（例如 `001-后端开发/002-Java.md` 在菜单中显示为 `后端开发 -> Java`）。

### 3. 项目结构说明
```text
.
├── .github/workflows/deploy.yml # GitHub Actions 自动部署配置
├── .vitepress/                  # VitePress 配置目录
│   └── config.mjs               # 主配置文件（会动态引入 generate-nav 脚本的生成结果）
├── content/                     # [核心] Markdown 数据源目录
│   ├── index.md                 # 简历首页
│   └── ...                      # 博客文章与分类目录
├── scripts/
│   └── generate-nav.js          # [核心] 解析 content 目录生成路由配置的脚本
├── specs/                       # 需求与设计文档目录
└── package.json                 # 项目依赖
```

## AI Agent 开发规范（Rules）

1. **严格遵循技术选型**：本项目已经确定使用 VitePress，**禁止**引入 Astro、Next.js 或其他同类 SSG 框架。
2. **遵守实现计划**：开发时请参照 `specs/business/002-博客网站-实现计划.md` 中的阶段划分进行，当前阶段验收通过后才进入下一阶段。
3. **保持极简风格**：尽量利用 VitePress 自带的样式和组件。在做首页自定义时，不要引入庞大的第三方 UI 库，优先使用原生 CSS ( `<style scoped>` ) 进行样式覆盖。
4. **代码与产物分离**：生成的站点内容（如 `.vitepress/dist`、`.vitepress/cache`）必须被 `.gitignore` 忽略，绝对不要提交到代码仓库。
5. **增量文件操作**：在修改已有文档或配置时，优先使用局部编辑工具 (`edit`)，而不是重写整个文件。
