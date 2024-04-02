import { defineConfig } from 'vitepress';
import { sidebar, nav } from './realConf';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //base: '/docs-demo/',
 
  title: 'JacksonWangBlog',
  description: 'A VitePress Site',
  head: [["link", { rel: "icon", href: "/avatar.png" }]],
  
  // 配置markdown写作风格
  // markdown: {
  //   toc: {
  //     level: [1, 2, 3, 4]
  //   },
  //   headers: {
  //     level: [1, 2, 3, 4]
  //   },
  //   // https://github.com/valeriangalliat/markdown-it-anchor#usage
  //   anchor: {
  //     // permalink: anchor.permalink.headerLink()
  //   },
  //   lineNumbers: true // 让代码块中实现行号

  //   // config: (md) => {
  //   //   md.use(demoBlockPlugin, {
  //   //     cssPreprocessor: 'less'
  //   //   });
  //   // }
  // },

  themeConfig: {
    logo: '/avatar.png', // 表示docs/public/avartar.png
    nav: nav,
    sidebar: sidebar,

    //search: {
    //  provider: 'local'
    //},



    
    outline: {
      label: '目录',
      level: [2, 6],
  
    },



    i18nRouting: true,

   // carbonAds: {
     // code: 'your-carbon-code',
     // placement: 'your-carbon-placement'
    //},

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer:{
      copyright:'Copyright@ 2024 Jackson Wang'
    }
  },

});
