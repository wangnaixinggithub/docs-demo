#  常用视图容器类组件介绍 view、scroll-view和swiper

## 一、小程序中组件的分类

  前面几期已经大致介绍完了小程序项目整体框架了，具体更详细的内容可以看一下 [官网文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/) 。这个时候终于可以说出那句话了



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417222918983.png)



  搞错了，应该敲代码😀才对。那话不多说，赶紧书接上回。



  小程序中的组件也是由宿主环境提供的，开发者可以基于组件快速搭建出漂亮的页面结构。官方把小程序的组件分为了 9大类，分别是：视图容器、基础内容、表单组件、导航组件、媒体组件、map 地图组件、canvas 画布组件、开放能力、无障碍访问。



  其中比较常用的是视图容器、基础内容、表单组件、导航组件这四种。

## 二、视图容器

#### 1、常用的视图容器类组件

  比较常用的视图组件有view、scroll-view和swiper 和 swiper-item，其作用和使用场景如下所示：

| 组件                  | 作用                                                         |
| --------------------- | ------------------------------------------------------------ |
| view                  | 普通视图区域 类似于 HTML 中的 div，是一个块级元素 常用来实现页面的布局效 |
| scroll-view           | 可滚动的视图区域 常用来实现滚动列表效果                      |
| swiper 和 swiper-item | 轮播图容器组件 和 轮播图 item 组件                           |

#### 2、 view 组件的基本使用

  首先要找到对应的页面来使用view组件，这里以 `CshPage1` 页面为例，在 `CshPage1.wxml` 里写页面的结构，`CshPage1.wxss` 里写页面的样式。



**CshPage1.wxml：**

```javascript
<view class="containerCsh1">
  <view>刻晴</view>
  <view>琪亚娜</view>
  <view>李信</view>
</view>
```

**CshPage1.wxss：**

  用类名选择器来选中父元素，再用后代选择器来选择子元素来统一设置其宽高等内容，当然如果想单独对一个子元素进行设置，可以通过C3选择器 `nth-child(1)` 来选中子元素，并对其进行添加样式，通过改变父元素的布局就能实现子元素之间的排列了。

```javascript
/* pages/CshPage1/CshPage1.wxss */
/* 给子元素设置大小 */
.containerCsh1 view{
  width: 100px;
  height: 100px;
  text-align: center; 
  line-height: 100px;
}
/* 给子元素添加背景颜色 */
.containerCsh1 view:nth-child(1){
  background-color: lightcoral;
}
.containerCsh1 view:nth-child(2){
  background-color: lightgreen;
}
.containerCsh1 view:nth-child(3){
  background-color: lightslategrey;
}

/* 给父元素加布局样式 */
.containerCsh1{
  display: flex;
  justify-content: space-around;
}
```

  编写完成之后就实现如图的 `flex` 横向布局效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417223039861.png)

#### 3、scroll-view 组件的基本使用

  可以基于刚才的效果来实现元素纵向滚动效果。注意：这里要使用纵向滚动时，必须给 `scroll-view `一个固定高度，同理横向滚动也是需要一个固定宽度。

- `scroll-y` 属性：允许纵向滚动；
- `scroll-x` 属性：允许横向滚动；

**CshPage1.wxml：**

```javascript
<scroll-view class="containerCsh1" scroll-y>
  <view>刻晴</view>
  <view>琪亚娜</view>
  <view>李信</view>
</scroll-view>
```

**CshPage1.wxss：**

```javascript
/* pages/CshPage1/CshPage1.wxss */
/* 给子元素设置大小 */
.containerCsh1 view{
  width: 100px;
  height: 100px;
  text-align: center; 
  line-height: 100px;
}
/* 给子元素添加背景颜色 */
.containerCsh1 view:nth-child(1){
  background-color: lightcoral;
}
.containerCsh1 view:nth-child(2){
  background-color: lightgreen;
}
.containerCsh1 view:nth-child(3){
  background-color: lightslategrey;
}

/* 给父元素加布局样式 */
.containerCsh1{
  border: 1px solid red;
  height: 120px;
  width: 100px;
}
```

  编写完成之后就实现如图的纵向滚动效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E7%BA%B5%E5%90%91%E6%BB%9A%E5%8A%A8%E6%95%88%E6%9E%9C.gif)

#### 4、 swiper 和 swiper-item 组件的基本使用

  当想要轮播图效果的时候，需要配合 `swiper` 和 `swiper-item` 组件就能实现出轮播图效果，`indicator-dots` 属性是显示面板上指示点。里面有几个轮播图就用几个 `swiper-item` 项。
  先来介绍 `swiper` 组件的常用属性吧

| 属性                   | 类型    | 默认值            | 说明                 |
| ---------------------- | ------- | ----------------- | -------------------- |
| indicator-dots         | boolean | false             | 是否显示面板指示点   |
| indicator-color        | color   | rgba(0, 0, 0, .3) | 指示点颜色           |
| indicator-active-color | color   | #000000           | 当前选中的指示点颜色 |
| autoplay               | boolean | false             | 是否自动切换         |
| interval               | number  | 5000              | 自动切换时间间隔     |
| circular               | boolean | false             | 是否采用衔接滑动     |

**cshPageSwiper.wxml：**

```javascript
<!-- 轮播图结构 -->
<swiper class="swiper-containercsh" indicator-dots indicator-color="white" 
indicator-active-color="gray" autoplay interval="2000" circular>
  <!-- 第一张轮播图-->
  <swiper-item>
    <view class="item">刻晴</view>
  </swiper-item>
  <!-- 第二张轮播图-->
  <swiper-item>
    <view class="item">琪亚娜</view>
  </swiper-item>
  <!-- 第三张轮播图-->
  <swiper-item>
    <view class="item">李信</view>
  </swiper-item>
</swiper>
```

**cshPageSwiper.wxss：**

  设置轮播图容器高度，再对各个轮播项进行属性赋值。

```javascript
.swiper-container {
  height: 150px;
}
.item{
  height: 100%;
  line-height: 150px;
  text-align: center;
}
/* 给轮播设置属性 */
swiper-item:nth-child(1) .item{
  background-color: lightseagreen;
}
swiper-item:nth-child(2) .item{
  background-color: limegreen;
}
swiper-item:nth-child(3) .item{
  background-color: lightsalmon;
}
```

  编写完成之后就实现出轮播图效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%BD%AE%E6%92%AD%E5%9B%BE%E6%95%88%E6%9E%9C.gif)

