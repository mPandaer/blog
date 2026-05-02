import { defineConfig } from 'vitepress'
import { generateSiteNavigation } from '../scripts/generate-nav.js'

const { nav, sidebar } = generateSiteNavigation()

function resolveBase() {
  const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]

  if (!repository || repository.endsWith('.github.io')) {
    return '/'
  }

  return `/${repository}/`
}

export default defineConfig({
  title: '我的博客',
  description: '个人博客与作品集网站',
  base: resolveBase(),
  srcDir: 'content',

  themeConfig: {
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})
