import { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.NavItem[] = [

  {
    text: 'Index',
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
          // {
          //   text:'✍️第三方库整合笔记✍️',
          //   link:'column/CPlusPlus/第三方库整合笔记'
          // },
        ]
      },
      {
        text:'❤️Linux 操作系统应用开发❤️',
        items:[
          {
            text: '✍️C++Linux编程✍️',
            link: '/column/CPlusPlus/C++Linux编程/'
          },
        ]
      },
      {
        text:'❤️Windows 操作系统应用开发❤️',
        items:[
          {
            text:'✍️深入浅出QT程序设计✍️',
            link:'/column/CPlusPlus/深入浅出QT程序设计/'
          },
          {
            text:'✍️C++Windows编程✍️',
            link:'/column/CPlusPlus/C++Windows编程/'
          },
        ]
      },
      // {
      //   text:'❤️计算机图形视觉开发❤️',
      //   items:[
      //     {
      //       text:'✍️嵌入式开发笔记✍️',
      //       link:'column/CPlusPlus/嵌入式开发笔记'
      //     },
      //     {
      //       text:'✍️深入浅出OpenGL✍️',
      //       link:'column/CPlusPlus/深入浅出OpenGL'
      //     },
      //     {
      //       text:'✍️OpenCV学习笔记✍️',
      //       link:'column/CPlusPlus/OpenCV学习笔记/'
      //     },
      //   ]
      // },
    ]
  },
  //===================CPlusPlus======================

  //===================CSharp=========================
  // {
  //   text: 'CSharp',
  //   items: [
  //     {
  //       text: 'CSharp程序设计基础入门教程',
  //       link: 'column/CSharp/CSharp程序设计基础入门教程'
  //     },
  //     {
  //       text: 'CSharp基础不牢地动山摇',
  //       link: 'column/CSharp/CSharp基础不牢地动山摇'
  //     },
  //   ]
  // },
   //===================CSharp=========================

   //===================JavaScript======================
    {
      text: 'JavaScript',
      items: [
        {
          text: '✍️小兔鲜电商VUE3项目实战✍️',
          link: '/column/JavaScript/小兔鲜电商项目实战/'
        },
        {
          text: '✍️本地生活微信小程序项目实战✍️',
          link: '/column/JavaScript/本地生活微信小程序/'
        },
        {
          text: '✍️HarmonyOs应用开发✍️',
          link: '/column/JavaScript/HarmonyOs应用开发/'
        },
        // {
        //   text: '开源项目学习',
        //   link: 'column/JavaScript/开源项目学习/'
        // },
      ]
    },
   //===================JavaScript======================


   //===================Java======================
   {
    text: 'Java',
    items: [
      // {
      //   text: 'Java基础不牢地动山摇！',
      //   link: 'column/Java/Java基础不牢地动山摇！'
      // },
      // {
      //   text: 'Java开源项目学习',
      //   link: 'column/Java/Java开源项目学习'
      // },
      {
        text: '✍️SpringBoot整合第三方库✍️',
        link: '/column/Java/SpringBoot整合第三方库/'
      },
    ]
   },
   //===================Java======================
   

  //===================Python======================
  // {
  //   text: 'Python',
  //   items: [
  //     {
  //       text: 'Python玩OpenCV也是有一手的！',
  //       link: 'column/Python/Python玩OpenCV也是有一手的！'
  //     },
  //     {
  //       text: '你对象不会也在学测试吧',
  //       link: 'column/Python/你对象不会也在学测试吧'
  //     },
  //   ]
  // },
  //===================Python======================
  // {
  //   text: '设计模式',
  //   link: 'column/设计模式'
  
  // },
  // {
  //   text: '算法',
  //   link: 'column/算法'
  // },


  //===================Link======================
   {
    text: 'About Me',
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
