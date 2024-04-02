import { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.NavItem[] = [

  {
    text: '首页',
    link: '/'
  },
  //===================CPlusPlus======================
  {
    text: 'C++',
    items: [
      {
        text: '❤️C++内功心法❤️',
        items:[
          {
            text: '✍️C++基础不牢地动山摇✍️',
            link: '/column/CPlusPlus/C++基础不牢地动山摇/'
          },
          {
            text: '✍️C++并发编程实战✍️',
            link: '/column/CPlusPlus/C++并发编程实战'
          },
          {
            text:'✍️第三方库整合笔记✍️',
            link:'column/CPlusPlus/第三方库整合笔记'
          },
        ]
      },
      {
        text:'❤️Linux 操作系统应用开发❤️',
        items:[
          {
            text: '✍️C++Linux编程✍️',
            link: '/column/CPlusPlus/C++Linux编程/'
          },
          {
            text:'✍️UNIX环境高级编程✍️',
            link:'column/CPlusPlus/UNIX环境高级编程'
          },
        ]
      },
      {
        text:'❤️Windows 操作系统应用开发❤️',
        items:[
          {
            text:'✍️VC++深入详解✍️',
            link:'column/CPlusPlus/VC++深入详解/'
          },
          {
            text:'✍️Win32开发笔记✍️',
            link:'column/CPlusPlus/Win32开发笔记'
          },
          {
            text:'✍️Window内核编程✍️',
            link:'column/CPlusPlus/Window内核编程'
          },
          {
            text:'✍️深入浅出QT程序设计✍️',
            link:'column/CPlusPlus/深入浅出QT程序设计/'
          },
          {
            text:'✍️深入浅出WINDOWS程序设计✍️',
            link:'column/CPlusPlus/深入浅出WINDOWS程序设计'
          },
          {
            text:'✍️深入浅出WINDOW驱动程序开发✍️',
            link:'column/CPlusPlus/深入浅出WINDOW驱动程序开发'
          }
        ]
      },
      {
        text:'❤️计算机图形视觉开发❤️',
        items:[
          {
            text:'✍️嵌入式开发笔记✍️',
            link:'column/CPlusPlus/嵌入式开发笔记'
          },
          {
            text:'✍️深入浅出OpenGL✍️',
            link:'column/CPlusPlus/深入浅出OpenGL'
          },
          {
            text:'✍️OpenCV学习笔记✍️',
            link:'column/CPlusPlus/OpenCV学习笔记/'
          },
        ]
      },
    ]
  },
  //===================CPlusPlus======================

  //===================CSharp=========================
  {
    text: 'CSharp',
    items: [
      {
        text: 'CSharp程序设计基础入门教程',
        link: 'column/CSharp/CSharp程序设计基础入门教程'
      },
      {
        text: 'CSharp基础不牢地动山摇',
        link: 'column/CSharp/CSharp基础不牢地动山摇'
      },
    ]
  },
   //===================CSharp=========================

   //===================JavaScript======================
    {
      text: 'JavaScript',
      items: [
        {
          text: '吃螃蟹咯HarmonyOs真香',
          link: 'column/CPlusPlus/吃螃蟹咯HarmonyOs真香'
        },
        {
          text: '开源项目学习',
          link: 'column/CPlusPlus/开源项目学习'
        },
        {
          text: '小兔鲜电商项目实战',
          link: 'column/CPlusPlus/小兔鲜电商项目实战'
        },
      ]
    },
   //===================JavaScript======================


   //===================Java======================
   {
    text: 'Java',
    items: [
      {
        text: 'Java基础不牢地动山摇！',
        link: 'column/Java/Java基础不牢地动山摇！'
      },
      {
        text: 'Java开源项目学习',
        link: 'column/Java/Java开源项目学习'
      },
      {
        text: 'SpringBoot整合第三方库',
        link: 'column/Java/SpringBoot整合第三方库'
      },
    ]
   },
   //===================Java======================
   

  //===================Python======================
  {
    text: 'Python',
    items: [
      {
        text: 'Python玩OpenCV也是有一手的！',
        link: 'column/Python/Python玩OpenCV也是有一手的！'
      },
      {
        text: '你对象不会也在学测试吧',
        link: 'column/Python/你对象不会也在学测试吧'
      },
    ]
  },
  //===================Python======================
  {
    text: '设计模式',
    link: 'column/设计模式'
  
  },
  {
    text: '算法',
    link: 'column/算法'
  },


  //===================Link======================
   {
    text: '关于我',
    items: [
      { text: 'Github', link: 'https://github.com/Jacqueline712' },
      {
        text: '掘金',
        link: 'https://juejin.cn/user/3131845139247960/posts'
      },
      {
        text: '飞书社区',
        link: 'https://pzfqk98jn1.feishu.cn/wiki/space/7193915595975491587?ccm_open_type=lark_wiki_spaceLink'
      },
      {
        text: '知乎',
        link: 'https://www.zhihu.com/people/zheng-zi-ji-67-89/posts'
      }
    ]
   }
  //===================Link======================
];
