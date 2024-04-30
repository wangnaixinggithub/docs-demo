# WXS 脚本

## 一、WXS 脚本

  前面已经大致了解小程序中生命周期，分别是应用生命周期和页面生命周期，在实际开发过程中，一般初始化数据的操作都会放在 onLoad 或者 onLaunch 里。所以了解生命周期的执行顺序与作用对后续的开发很有帮助。接下来就来学习一下小程序中的 WXS 脚本。话不多说，让我们原文再续，书接上回吧。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf.gif)

#### 1、什么是 wxs

  WXS（WeiXin Script）是小程序独有的一套脚本语言，结合 WXML，可以构建出页面的结构。

#### 2、wxs 的应用场景

  wxml 中无法调用在页面的 .js 中定义的函数，但是，wxml 中可以调用 wxs 中定义的函数。因此，小程序中
wxs 的典型应用场景就是“过滤器”，这一点跟 Vue 有点类似。

#### 3、. wxs 和 JavaScript 的关系

  虽然 wxs 的语法类似于 JavaScript，但是 wxs 和 JavaScript 是完全不同的两种语言：

| wxs                               | 作用                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| 有自己的数据类型                  | number 数值类型、string 字符串类型、boolean 布尔类型、object 对象类型 function 函数类型、array 数组类型、 date 日期类型、 regexp 正则 |
| 不支持类似于 ES6 及以上的语法形式 | 不支持：let、const、解构赋值、展开运算符、箭头函数、对象属性简写、etc… 支持：var 定义变量、普通 function 函数等类似于 ES5 的语法 |
| 遵循 CommonJS 规范                | module 对象、require() 函数、module.exports 对象             |

## 二、WXS 脚本 - 基础语法

#### 1、内嵌 wxs 脚本

  `wxs` 代码可以编写在 wxml 文件中的 `<wxs>` 标签内，就像 Javascript 代码可以编写在 html 文件中的 `<script>` 标签内一样。
  `wxm`l 文件中的每个 `<wxs></wxs>` 标签，必须提供 `module` 属性，用来指定当前 wxs 的模块名称，方便在 wxml 中访问模块中的成员，这里可以看下下面栗子，具体代码如下：

**message.js**

  首先在js端定义好变量。

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    userName: "csh",
  },
})
```

**message.wxml**

  将文本转成大写。

```html
<view>{{test1.toUpper(userName)}}</view>

<wxs module="test1">
  // 将文本转成大写
  module.exports.toUpper = function (str) {
    return str.toUpperCase();
  }
</wxs>
```

  不出意外的话，在页面会出 csh 的大写形式，看一下实际效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/470971cf90704dbb886b3ca8593ab681%5B1%5D.png)



#### 2、定义外联的 wxs 脚本

   wxs 代码还可以编写在以 `.wxs` 为后缀名的文件内，就像 javascript 代码可以编写在以 `.js` 为后缀名的文件中
一样。示例代码如下：

  创建 .wxs 文件

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/59fd433978404017b85867d35270197b%5B1%5D.png)



**tool.wxs**

```javascript
function toLower(str){
  return str.toLowerCase();
}

module.exports = {
  toLower: toLower
}
```

  到这里就定义好模块里的函数。

#### 3、使用外联的 wxs 脚本

  前面定义好了外联的 wxs 脚本，接下来就要去使用了。在 wxml 中引入外联的 wxs 脚本时，必须为 标签添加 module 和 src 属性，其中：

| 属性   | 说明                                         |
| ------ | -------------------------------------------- |
| module | 用来指定模块的名称                           |
| src    | 用来指定要引入的脚本的路径，且必须是相对路径 |

  通过下面的栗子来学习一下，具体代码如下：

**message.js**

  在js端定义好变量。

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    userName: "csh",
    country: 'CHINA',
  },
})
```

**message.wxml**

  引用外联的tool.wxs 脚本，并命名为 test2，将文本转成小写。

```html
<view>{{test2.toLower(country)}}</view>

<wxs src="../../utils/tool.wxs" module="test2"></wxs>
```

  可以来看一下实际效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/64301139e759440da1c0be53d6c0d0b9%5B1%5D.png)

## 三、WXS 的特点

#### 1、与 JavaScript 不同

  为了降低 wxs（WeiXin Script）的学习成本， wxs 语言在设计时借大量鉴了 JavaScript 的语法。但是本质上，wxs 和 JavaScript 是完全不同的两种语言！

#### 2、不能作为组件的事件回调

  wxs 典型的应用场景就是“过滤器”，经常配合 `Mustache` 语法进行使用，例如：

```html
<view>{{test1.toUpper(userName)}}</view>
```

  但是，在 wxs 中定义的函数不能作为组件的事件回调函数。例如，下面的用法是错误的：

```html
<button bindtap="test2.toLower">按钮</button>
```

#### 3、隔离性

  隔离性指的是 wxs 的运行环境和其他 JavaScript 代码是隔离的。体现在如下两方面：

- wxs 不能调用 js 中定义的函数
- wxs 不能调用小程序提供的 API

#### 4、性能好

  在 iOS 设备上，小程序内的 WXS 会比 JavaScript 代码快 2 ~ 20 倍。
  在 android 设备上，二者的运行效率无差异