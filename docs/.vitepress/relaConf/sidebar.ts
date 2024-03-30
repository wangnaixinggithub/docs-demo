import { DefaultTheme } from 'vitepress';
export const sidebar: DefaultTheme.Sidebar = {
  '/column/Algorithm/': [
    {
      text: '栈和队列',
      items: [
        {
          text: '栈-深拷贝和浅拷贝',
          link: '/column/Algorithm/001_Stack'
        },
        {
          text: '队列-事件循环',
          link: '/column/Algorithm/002_Queue'
        }
      ]
    },
    {
      text: '字典和树',
      items: [
        {
          text: '字典和集合-Set和Map',
          link: '/column/Algorithm/003_Dictionary'
        },
        {
          text: '树-深/广度优先遍历',
          link: '/column/Algorithm/004_Tree'
        }
      ]
    }
  ],
  '/column/CPlusPlus/C++基础不牢地动山摇':
  [
    {
      text: 'C++基础不牢地动山摇',
      items: [
        {
          text: 'C++ Boost 文件目录操作库',
          link: '/column/CPlusPlus/C++基础不牢地动山摇/28-C++ Boost 文件目录操作库'
        },
        {
          text: 'C++ Boost 应用JSON解析库',
          link: '/column/CPlusPlus/C++基础不牢地动山摇/30-C++ Boost 应用JSON解析库'
        }
      ]
    },

  ]
};
