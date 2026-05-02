import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '我的博客',
  description: '个人博客与作品集网站',
  
  srcDir: 'content',

  themeConfig: {
    nav: [
      { text: '首页', link: '/' }
    ],
    
    sidebar: {},
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ]
  }
})
