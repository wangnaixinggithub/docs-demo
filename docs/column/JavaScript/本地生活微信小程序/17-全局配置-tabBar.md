# 全局配置-tabBar

## 一、全局配置 – tabBar

  前面已经学习完了全局配置–window，通过栗子了解到如何修改导航栏、下拉刷新和上拉触底。接下来就来讲解一下全局配置另外一个配置项–tabBar。话不多说，让我们原文再续，书接上回吧。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf.gif)

#### 1、什么是 tabBar

  tabBar 是移动端应用常见的页面效果，用于实现多页面的快速切换。小程序中通常将其分为：

- 底部 tabBar
- 顶部 tabBar

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/543796e9b8034e5d80a0a356badfdf22%5B1%5D.png)



  注意： tabBar中只能配置最少 2 个、最多 5 个 tab 页签，当渲染顶部 tabBar 时，不显示 icon，只显示文本

#### 2、tabBar 的 6 个组成部分

  接下来将对 tabBar 的 6 个部分进行学习,如下图所示，：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/2573060c18c24b5698c22ecb86723e56%5B1%5D.png)



- backgroundColor：tabBar 的背景色；
- selectedIconPath：选中时的图片路径；
- borderStyle：tabBar 上边框的颜色；
- iconPath：未选中时的图片路径；
- selectedColor：tab 上的文字选中时的颜色；
- color：tab 上文字的默认（未选中）颜色

#### 3、tabBar 节点的配置项

  接下来介绍 tabBar 的基本属性，在 [官方文档](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html#tabBar) 中，除了 borderStyle，position 属性之外，其他都是必填属性，不过只是为了做测试的话，只有 list 属性是必填的，如下表所示：

| 属性            | 类型     | 必填 | 默认值                                                    | 说明                                        |
| --------------- | -------- | ---- | --------------------------------------------------------- | ------------------------------------------- |
| color           | HexColor | 是   | tab 上的文字默认颜色，仅支持十六进制颜色                  |                                             |
| selectedColor   | HexColor | 是   | tab 上的文字选中时的颜色，仅支持十六进制颜色              |                                             |
| backgroundColor | HexColor | 是   | tab 的背景色，仅支持十六进制颜色                          |                                             |
| borderStyle     | string   | 否   | black                                                     | tabbar 上边 框的颜色， 仅支持 black / white |
| list            | Array    | 是   | tab 的列表，详见 list 属性说明， 最少 2 个、最多 5 个 tab |                                             |
| position        | string   | 否   | bottom                                                    | tabBar 的位置，仅支持 bottom / top          |

  其中 list 接受一个数组，只能配置最少 2 个、最多 5 个 tab。tab 按数组的顺序排序，每个项都是一个对象，其属性值如下：

| 属性             | 类型   | 必填 | 说明                                                         |
| ---------------- | ------ | ---- | ------------------------------------------------------------ |
| pagePath         | string | 是   | 页面路径，必须在 pages 中先定义                              |
| text             | string | 是   | tab 上按钮文字                                               |
| iconPath         | string | 否   | 图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。 当 position 为 top 时，不显示 icon。 |
| selectedIconPath | string | 否   | 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px * 81px，不支持网络图片。 当 position 为 top 时，不显示 icon。 |

  如果在小程序中配置 `tabBar` 效果，需要打开 `app.json` 文件，创建与 `pages` 和 `window` 同级的节点，在里面添加需要的属性，具体代码如下所示：

**app.json**

```javascript
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/cshPageTab/cshPageTab",
        "text": "Tab"
      },
      {
        "pagePath": "pages/cshPageButton/cshPageButton",
        "text": "Button"
      },
      {
        "pagePath": "pages/cshPageData/cshPageData",
        "text": "Data"
      }
    ]
  },
}
```

   创建了三个tab进行显示，并没有对其他属性进行设置，比较简洁，来看一下实际显示效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/45efe1d7b9474273a9d15393aeaaa6f2%5B1%5D.gif)

## 二、配置 tabBar

   前面简单的配置tabBar，成功实现跳转，但是样式比较简陋。接下来完整配置一下 tabBar。

#### 1. 需求描述

   根据前面的栗子，在此基础对tabBar进行优化成以下页面。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/a03efcc13eb84d68bb946266b11f404f%5B1%5D.png)

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/8b349e63259c4702b04afc6813bcc4b6%5B1%5D.png)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c250d04c0a154897ac5ba885c2624c32%5B1%5D.png)



#### 2. 实现步骤

  在实际开发过程中，完成配置 `tabBar` 可分为三步：

- **Step 1**、拷贝图标资源

  把下载好的 `images` 资源，拷贝到小程序项目根目录中，将需要用到的小图标分为 3 组，每组两个，其中：

   （1）图片名称中包含 `-active` 的是选中之后的图标。

   （2）图片名称中不包含 -`active` 的是默认图标。

  如下图所示：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c6ddc32a2bc74699a761e2ce5dc54f10%5B1%5D.png)



- **Step 2**、新建 3 个对应的 tab 页面

  通过 `app.jso`n 文件的 `pages` 节点，快速新建 3 个对应的 tab 页面，这里为了方便，使用前面栗子的三个页面，示例代码如下：

**app.json**

```javascript
{
  "pages":[
    "pages/cshPageTab/cshPageTab",
    "pages/cshPageData/cshPageData",
    "pages/cshPageButton/cshPageButton",
    "pages/index/index",
    "pages/logs/logs"
  ],
}
```

  其中，`cshPageTab` 是首页，`cshPageData` 是消息页面，`cshPageButton` 是联系我们页面。

  **注意：tab页签对应页面必须放在 pages 页面数组最开始的位置，不能往后放，否则无法生效。**

- **Step 3**、配置 tabBar 选项

  首先打开 `app.json` 配置文件，和 `pages` 、`window` 平级，新增 `tabBar` 节点，其次 `tabBar` 节点中，新增 list 数组，这个数组中存放的，是每个 tab 项的配置对象，最后在 `list` 数组中，新增每一个 tab 项的配置对象。对象中包含的属性如下：

   （1） `pagePath` 指定当前 tab 对应的页面路径【必填】

   （2） `text` 指定当前 tab 上按钮的文字【必填】

   （3） `iconPath` 指定当前 tab 未选中时候的图片路径【可选】

   （4） `selectedIconPath` 指定当前 tab 被选中后高亮的图片路径【可选】

  为了页面的美观性，这四个都要进行设置。具体代码如下所示：

**app.json**

```javascript
{
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/cshPageTab/cshPageTab",
        "text": "Tab",
        "iconPath": "/images/home.png",
        "selectedIconPath": "/images/home-active.png"
      },
      {
        "pagePath": "pages/cshPageButton/cshPageButton",
        "text": "Button",
        "iconPath": "/images/message.png",
        "selectedIconPath": "/images/message-active.png"
      },
      {
        "pagePath": "pages/cshPageData/cshPageData",
        "text": "Data",
        "iconPath": "/images/contact.png",
        "selectedIconPath": "/images/contact-active.png"
      }
    ]
  },
}
```

  到这里就完成完整的 tabBar 配置，来看下实际效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/a984080fcc9a4917a051352d4a89da0a%5B1%5D.gif)

