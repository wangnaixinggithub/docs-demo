# 全局配置-window-导航栏

## 一、全局配置

  前面已经介绍了WXSS模板语法-全局样式和局部样式，通过栗子学习了WXSS模板语法样式之间的覆盖。接下来就来讲解一下小程序的全局配置。话不多说，让我们原文再续，书接上回吧。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf.gif)

#### 1、全局配置文件及常用的配置项

&ems; 小程序根目录下的 app.json 文件是小程序的全局配置文件，决定页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等。常用的配置项如下：

| 配置项 | 说明                             |
| ------ | -------------------------------- |
| pages  | 记录当前小程序所有页面的存放路径 |
| window | 全局设置小程序窗口的外观         |
| tabBar | 设置小程序底部的 tabBar 效果     |
| style  | 是否启用新版的组件样式           |

&ems;  前面已经学习过了pages和style属性，现在就来学习另外两个重要属性：window、tabBar。

## 二、window

  用于设置小程序的状态栏、导航条、标题、窗口背景色。

#### 1、小程序窗口的组成部分

  小程序窗口一般由导航栏区域和页面主体区域组成，如下图所示:

- 1 部分表示为导航栏区域，
- 2 部分表示为页面的主体区域，用来显示wxml中的布局，
- 1 和 2 之间还有一个背景区域，默认不可见，只有下拉才能显示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/e9edc25575c346ee809a46c07e2118cf%5B1%5D.png)





   window配置项只能对导航栏和背景区域进行配置，不能对页面的主体区域进行配置。

#### 2、window 节点常用的配置项

   根据 window 节点配置项的作用，可以对 window 中的属性进行分类：

- 第一类、配置导航栏相关样式，以 `navigation` 开头；
- 第二类、配置窗口背景相关样式，以 `background` 开头；
- 第三类、控制页面效果；

   常用配置项如下表所示：

| 属性名                       | 类型     | 默认值                                         | 说明                                     |
| ---------------------------- | -------- | ---------------------------------------------- | ---------------------------------------- |
| navigationBarTitleText       | String   | 字符串                                         | 导航栏标题文字内容                       |
| navigationBarBackgroundColor | HexColor | #000000                                        | 导航栏背景颜色，如 #000000               |
| navigationBarTextStyle       | String   | white                                          | 导航栏标题颜色，仅支持 black / white     |
| backgroundColor              | HexColor | #ffffff                                        | 窗口的背景色                             |
| backgroundTextStyle          | String   | dark                                           | 下拉 loading 的样式，仅支持 dark / light |
| enablePullDownRefresh        | Boolean  | false                                          | 是否全局开启下拉刷新                     |
| onReachBottomDistance Number | 50       | 页面上拉触底事件触发时距页面底部距离，单位为px |                                          |

显示详细信息

#### 3、设置导航栏的标题

   刚创建微信小程序的时候，导航栏上的标题都是默认为 `WeChat`。现在要将默认标题修改为 `我是夜阑的狗 `，具体操作为

> app.json -> window -> navigationBarTitleText

**app.json**

```javascript
{
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "我是夜阑的狗", 
    "navigationBarTextStyle":"black"
  },
}
```

   通过修改 window 中的属性来修改导航栏上的标题，实际效果如下图所示：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/d2ddd18ca22b40739fed2323f7e045b7%5B1%5D.png)

#### 4、设置导航栏的背景色

   修改完导航栏上的标题之后，接下来还可以对导航栏的背景颜色进行修改。现在要将导航栏背景色从默认颜色 `#fff` 修改为 `#2b4b6b`，具体操作为

> app.json -> window -> navigationBarBackgroundColor

**app.json**

```javascript
{
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#ff0000",
    "navigationBarTitleText": "我是夜阑的狗", 
    "navigationBarTextStyle":"black"
  },
}
```

   通过修改 window 中的属性来修改导航栏背景颜色，实际效果如下图所示：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/72114115f99a4500bd06487718abc6d4%5B1%5D.png)



   **注意：这个导航栏背景颜色只支持十六进制的颜色值，不支持文本颜色值，例如：red、green等。**

#### 5、设置导航栏的标题颜色

   看到上面的效果图，红色背景黑色标题看起来很不美观，所以可以对导航栏的标题文本颜色进行修改。现在要将导航栏标题颜色从默认 `black` 修改为 `white`，具体操作为

> app.json -> window -> navigationBarTextStyle

**app.json**

```javascript
{
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#ff0000",
    "navigationBarTitleText": "我是夜阑的狗", 
    "navigationBarTextStyle":"white"
  },
}
```

   通过修改 window 中的属性来修改导航栏标题颜色，很明显视觉效果好了很多（个人观感），实际效果如下图所示：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/d3f4b59ccb464be98455c95e22b2b529%5B1%5D.png)



   **注意： navigationBarTextStyle 的可选值只有 black 和 white**