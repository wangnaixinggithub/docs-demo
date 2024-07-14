import { defineConfig  } from 'vitepress';
import { sidebar, nav } from './realConf/index.mts';



// https://vitepress.dev/reference/site-config
export default defineConfig({
  //base: '/docs-demo/',
 
  title: 'JacksonBlog',
  description: 'A VitePress Site',
  head: [
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }
    ],
    [
      "link", 
      { rel: "icon", href: "/avatar.png" }]
  
  ],




  chunkSizeWarningLimit:1500,
  rollupOptions: {
    output:{
        manualChunks(id) {
          if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
      } 
    },
    chunkFileNames: (chunkInfo) => {
      const facadeModuleId = chunkInfo.facadeModuleId
        ? chunkInfo.facadeModuleId.split('/')
        : [];
      const fileName =
        facadeModuleId[facadeModuleId.length - 2] || '[name]';
      return `js/${fileName}/[name].[hash].js`;
    }

},


  markdown: {
 
    theme: { light: 'one-dark-pro', dark: 'one-dark-pro' } ,
    toc: {
       level: [1, 2, 3, 4]
     },
     headers: {
       level: [1, 2, 3, 4]
     },
     lineNumbers: true, // 让代码块中实现行号
     
   },

  themeConfig: {
    logo: '/avatar.png', // 表示docs/public/avartar.png
    nav: nav,
    sidebar: sidebar,

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除查询条件',
                  resetButtonAriaLabel: '清除查询条件',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '没有搜索历史',
                  saveRecentSearchButtonTitle: '保存至搜索历史',
                  removeRecentSearchButtonTitle: '从搜索历史中移除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
                noResultsScreen: {
                  noResultsText: '无法找到相关结果',
                  suggestedQueryText: '你可以尝试查询',
                  reportMissingResultsText: '你认为该查询应该有结果？',
                  reportMissingResultsLinkText: '点击反馈'
                }
              }
            }
              }
            }
          }
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    //appearance:'dark',
    


    
    outline: {
      label: '目录',
      level: [2, 6],
  
    },

    docFooter: {
      prev: '上一节',
      next: '下一节'
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
      message: 'Released under the MIT License.',
      copyright:'Copyright@ 2024 Jackson Wang'
    }
  },

});
