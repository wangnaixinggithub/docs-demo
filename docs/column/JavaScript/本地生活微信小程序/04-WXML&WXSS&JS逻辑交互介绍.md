# WXML & WXSS & JS 逻辑交互介绍

## 一、小程序页面

- **新建小程序页面**

  小程序页面创建是非常简单的，只需要在 `app.json` -> `pages` 中新增页面的存放路径，微信开发者工具就会帮我们自动创建对应的页面文件🥰。

```js
{
  "pages":[
    "pages/index/index",
    "pages/logs/logs",
    "pages/CshPage1/CshPage1" //只要添加页面存放路径，就会自动创建
  ],
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "Weixin",
    "navigationBarTextStyle":"black"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

保存文件之后就能看到新建立的页面文件，整个过程还是非常便捷的，这里就有个想法了，如果把配置文件里路径删除呢，会不会把页面文件也删除，试一下发现是不行。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417221319450.png)



- **修改项目首页**

  有时候我们不想用 `index` 来当首页，（那就把 `index` 页面改成想要的首页，也不是不行，但是还有其他简单的方法）只需要调整 `app.json` -> `pages` 数组中页面路径的前后顺序，即可修改项目的首页。小程序会把排在第一位的页面，当作项目首页进行渲染.

```js
{
  "pages":[
  	"pages/CshPage1/CshPage1", //放在第一位
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "Weixin",
    "navigationBarTextStyle":"black"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

   修改之后编译就能看模拟器将 `CshPage1` 变成了首页。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417221456989.png)

## 二、WXML模板

- **WXML**

  WXML（WeiXin Markup Language）是小程序框架设计的一套标签语言，用来构建小程序页面的结构，其作用类似于网页开发中的 HTML。

- **WXML 和 HTML 的区别**

  虽然 `WXML` 和 `HTML` 作用很相似，都是由标签、属性等等构成。但是很多地方不一样的地方。从下面表格就可以看得出来 `WXML` 用起来比较有 `Vue` 的感觉，双向数据绑定更好利于开发。

| 不同点   | WXML                                                         | HTML                    |
| -------- | ------------------------------------------------------------ | ----------------------- |
| 标签名称 | view, text, image, navigator                                 | div, span, img, a       |
| 属性节点 | `<navigator url="/pages/home/home"> </navigator>`            | `<a href="#"超链接</a>` |
| 模板语法 | 提供了类似于 Vue 中的模板语法： 数据绑定、列表渲染、条件渲染等 | 无                      |

## 三、WXSS样式

- **WXSS**

  WXSS (WeiXin Style Sheets)是一套样式语言，用于描述 WXML 的组件样式，看这名字不难猜出其作用类似于网页开发中的 CSS。

- **WXSS 和 CSS 的区别**

   `WXSS` 具有 `CSS` 大部分的特性，小程序在 `WXSS` 也做了一些扩充和修改。比如新增了 `rpx` 尺寸单位、样式作用域等。

| 不同点   |                             WXSS                             | CSS                                      |
| -------- | :----------------------------------------------------------: | ---------------------------------------- |
| 尺寸单位 |                 view, text, image, navigator                 | CSS 中需要手动进行像素单位换算，例如 rem |
| 属性节点 | 提供了全局的样式和局部样式 app.wxss 作为全局样式，会作用于当前小程序的所有页面， 局部页面样式 page.wxss 仅对当前页面生效。 | 无                                       |
| 模板语法 | WXSS 仅支持部分 CSS 选择器 .class 和 #id element 并集选择器、后代选择器 | 全支持                                   |



## 四、JS 逻辑交互

  一个项目仅仅只有界面展示是不够的，还需要和用户做交互：响应用户的点击、获取用户的位置等等。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417221818830.png)



  在小程序里边，我们就通过编写 JS 脚本文件来处理用户的操作。这样就可以小程序中的 JS 文件分为三大类：

| 文件        | 作用                                                         |
| ----------- | ------------------------------------------------------------ |
| app.js      | 整个小程序项目的入口文件，通过调用 App() 函数来启动整个小程序; |
| page.js     | 页面的入口文件，通过调用 Page() 函数来创建并运行页面         |
| function.js | 普通的功能模块文件，用来封装公共的函数或属性供页面使用;      |

