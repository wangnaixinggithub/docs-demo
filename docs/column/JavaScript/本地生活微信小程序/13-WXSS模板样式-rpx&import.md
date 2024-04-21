# WXSS模板样式-rpx&import 

## 一、WXSS 模板样式

  前面已经介绍完了WXML模板语法，通过栗子学习了WXML模板语法：数据绑定、条件渲染和列表渲染。接下来就来讲解一下另外一个模板样式–WXSS。话不多说，让我们原文再续，书接上回吧。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf.gif)

#### 1、什么是 WXSS

   WXSS (WeiXin Style Sheets)是一套样式语言，用于美化 WXML 的组件样式，类似于网页开发中的 CSS。

#### 2、 WXSS 和 CSS 的联系

  WXSS 用来决定 WXML 的组件应该怎么显示。为了适应广大的前端开发者，WXSS 具有 CSS 大部分特性。同时为了更适合开发微信小程序，WXSS 对 CSS 进行了扩充以及修改。
  与 CSS 相比，WXSS 扩展的特性有：

- `rpx` 尺寸单位；
- `@import` 样式导入；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6a08f1de307f4c19ac1de3b08139d323%5B1%5D.png)



## 二、rpx

#### 1、rpx 尺寸单位

   `rpx`（responsive pixel）是微信小程序独有的，用来解决屏适配的尺寸单位。

#### 2、实现原理

   `rpx` 的实现原理非常简单：鉴于不同设备屏幕的大小不同，为了实现屏幕的自动适配，rpx 把所有设备的屏幕，
在宽度上等分为 `750` 份（即：当前屏幕的总宽度为 750rpx ）。

- 在较小的设备上，1rpx 所代表的宽度较小。
- 在较大的设备上，1rpx 所代表的宽度较大。

  小程序在不同设备上运行的时候，会自动把 `rpx` 的样式单位换算成对应的像素单位来渲染，从而实现屏幕适配。

#### 3、rpx 与 px 之间的单位换算

  在 `iPhone6` 上，屏幕宽度为375px，共有 750 个物理像素，等分为 750 rpx。则：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240421223057322.png)

| 设备         | rpx换算px (屏幕宽度/750) | px换算rpx (750/屏幕宽度) |
| ------------ | ------------------------ | ------------------------ |
| iPhone5      | 1rpx = 0.42px            | 1px = 2.34rpx            |
| iPhone6      | 1rpx = 0.5px             | 1px = 2rpx               |
| iPhone6 Plus | 1rpx = 0.552px           | 1px = 1.81rpx            |

  **官方建议**： 开发微信小程序时设计师可以用 iPhone6 作为视觉稿的标准。例如：在 iPhone6 上如果要绘制宽100px，高20px的盒子，换算成rpx单位，宽高分别为 200rpx 和 40rpx。

  **注意**： 在较小的屏幕上不可避免的会有一些毛刺，请在开发时尽量避免这种情况。

## 三、样式导入

#### 1、样式导入是什么

  在实际开发过程中，可以把多个页面使用相同的样式抽离成一个公共的样式，这样简化整体代码，使整个工程更加简洁。通过使用 WXSS 提供的 `@import` 语法，可以导入外联的样式表。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/4896c03178d348b5b1492514cb13836f%5B1%5D.jpeg)



#### 2、@import 的语法格式

   `@import` 后跟需要导入的外联样式表的相对路径，用 `;` 表示语句结束。具体代码如下：

**common.wxss：**

  定义公共样式。

```javascript
.usercsh {
  color: green;
}
```

**cshPageTab.wxss：**

  导入公共样式并进行调用。

```javascript
@import "/common/common.wxss";
```

**cshPageTab.wxml：**

  公共样式进行调用。

```javascript
<view wx:for="{{userList}}" wx:key="id" class="usercsh">{{item.name}}</view>
```

  此时就完成了样式的导入和调用，可以来看一下字体颜色是否改变：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/b3e86ed1be5b40f2966074d16c58be58%5B1%5D.png)
