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
      { icon: 'github', link: 'https://github.com/mpandaer' },
      { icon: 'gmail', link: 'mailto:liwenhaolx@gmail.com' },
      { icon: 'wechat', link: '/004-联系我/001-联系我' }
    ]
  }
})
