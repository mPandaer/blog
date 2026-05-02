import { defineConfig } from 'vitepress'
import { generateSiteNavigation } from '../scripts/generate-nav.js'

const { nav, sidebar } = generateSiteNavigation()

export default defineConfig({
  title: 'Pandaer写东西的地方',
  description: '个人博客与作品集网站',
  base: '/',
  srcDir: 'content',

  themeConfig: {
    nav,
    sidebar,
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})
