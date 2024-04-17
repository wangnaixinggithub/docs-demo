# WXML 模板语法-数据绑定



## 一、数据绑定的基本原则

  前面已经介绍完了小程序的一些常用组件，剩下组件的讲解会在后续讲解。不过接下来先来讲解一下WXML模板语法，让我们原文再续，书接上回。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/d2fb3cf23f954c149fbc2ccbffd7b562%5B1%5D.jpeg)

#### 1、数据绑定的基本原则

  之前学过 `Vue` 的都知道 `Vue` 语法里也有数据绑定这个概念，而 `WXML` 里的数据绑定也是跟他类似的，也可以实现数据的单向或双向绑定。 数据绑定的基本原则有两点：

> - 在JS文件中的data中定义数据；
> - 页面的wxml文件中使用数据；

  基本上就是在 `JS` 端操作数据，`WXML` 端进行绑定并显示，其中 `WXML` 中的动态数据均来自对应 `Page` 的 `data`。下面就来讲解一下怎么实现这个数据绑定的过程。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf%5B1%5D.gif)

#### 2、在data中定义页面的数据

  在页面对应的 `.js` 文件中，前面讲到了 WXML 的动态数据来自于 JS 端中的 data 对象，所以把数据定义到 `data `对象中即可;

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 字符串类型的数据
    info: 'Nice 十连双黄',
  },
})
```

#### 3、Mustache语法的格式

  把data中的数据绑定到页面中渲染，使用 Mustache 语法（简单点就两大括号）将变量包起来即可。语法格式为

```javascript
<view>{{info}}</view>
```

  也可以称为插值表达式，自此，就可以在页面动态控制显示的数据，效果如下所示：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A.gif)



## 二、应用场景

   `Mustache` 语法的主要应用场景如下：绑定内容、绑定属性、运算（三元运算、算术运算等）；

#### 1、绑定内容

  上面刚刚讲解的栗子就是动态绑定内容，这里还是简单讲一下具体结构吧：

**cshPageData.js：**

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 字符串类型的数据
    info: 'Nice 十连双黄',
  },
})
```

**cshPageData.wxml：**

```javascript
<view>{{info}}</view>
```

  运行结果就不做展示了。

#### 2、绑定属性

  除了可以动态绑定内容以外，还可以绑定组件中的属性，这里就以 `image `组件为例来讲解。

**cshPageData.js：**

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 字符串类型的数据
    info: 'Nice 十连双黄',
    // 图片路径
     imgSrc:'/images/awesomeface.jpg'
  },
})
```

**cshPageData.wxml：**

```javascript
<view>{{info}}</view>
<image src="{{imgSrc}}" mode="widthFix"></image>
```

这样就实现了动态绑定属性了。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417231638731.png)



#### 3、运算

  `Mustache` 语法中还可以进行运算，也就是在 `WXML`中获取到 `JS` 端的数据时，可以对其进行运算在显示或者做判断。 比如常见的三元运算和算术运算。

- 三元运算

  语法结构：表达式1 ? 表达式2 ：表达式3，接下来可以来围绕着当前数是否大于等于50来讲解来该操作；

**cshPageData.js：**

  使用 `Math.random()` 函数来随机生成0到99的数；

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: 'Nice 十连双黄 加油',  
    imgSrc:'/images/awesomeface.jpg',
	randomNum: Math.random() * 100
  },
})
```

**cshPageData.wxml：**
   在WXML 处理数据；

```javascript
<view>{{randomNum >= 50 ? '当前数大于等于50' : '当前数小于50'}}</view>
<view>{{info}}</view>
<image src="{{imgSrc}}" mode="widthFix"></image>
```

   可以来看一下效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E7%AE%97%E6%95%B0%E8%BF%90%E7%AE%97%E7%AC%A6%E7%94%A8%E6%B3%95.gif)



- 算术运算

  在WXML中对数据进行算术运算更加方便地实现数据的操控输出。

**cshPageData.js：**

  使用 `Math.random()` 函数来随机生成0到99的数；

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: 'Nice 十连双黄 加油',
    randomNum: Math.random() * 100,   // 生成随机数
    imgSrc:'/images/awesomeface.jpg'
  },
})
```

**cshPageData.wxml：**

   在WXML 处理数据；

```javascript
<view>生成100以内的随机数：{{randomNum}}</view>
<view>{{randomNum >= 50 ? '当前数大于等于50' : '当前数小于50'}}</view>
<view>{{info}}</view>
<image src="{{imgSrc}}" mode="widthFix"></image>
```

   可以来看一下效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417231724421.png)