# WXML模板语法-事件绑定 tap & input 

## 一、事件

  前面已经介绍完了WXML模板语法–数据绑定，基本上了解到了如何在WXML页面上动态的显示数据以及组件上的属性控制等。接下来就来讲解一下另外一个模板语法–事件绑定。话不多说，让我们原文再续，书接上回吧。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf%5B1%5D.gif)

#### 1、事件的定义

  在一起学习小程序里事件怎么绑定之前，首先先来了解一下什么是事件？事件是渲染层到逻辑层的通讯方式。通过事件可以将用户在渲染层产生的行为，反馈到逻辑层进行业务的处理。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417232359050.png)



  当用户在页面上触发按钮点击事件的时候，渲染层将触发的事件通过微信客户端传给逻辑层（JS端）进行处理。

#### 2、小程序中常用的事件

  在小程序中常用的事件三种，分别是 `tap`、`input` 和 `change` 事件，相信大家对这些事件应该都不会陌生，其中 `tap` 为点击事件一般用得比较多。

| 类型   | 绑定方式                  | 事件描述                                       |
| ------ | ------------------------- | ---------------------------------------------- |
| tap    | bindtap 或 bind:tap       | 手指触摸后马上离开 类似于 HTML 中的 click 事件 |
| input  | bindinput 或 bind:input   | 文本框的输入事件                               |
| change | bindchange 或 bind:change | 状态改变时触发                                 |

  事件绑定方式有两种，第一种是 `bind + 类型`，第二种是 `bind: + 类型`。但平时用最多的是第一种方式。

#### 3、事件对象的属性列表

  当事件回调触发的时候，会收到一个事件对象 `event`，它的详细属性如下表所示：

| 属性           | 类型       | 说明                                         |
| -------------- | ---------- | -------------------------------------------- |
| type           | String     | 事件类型                                     |
| timeStamp      | Integer    | 页面打开到触发事件所经过的毫秒数             |
| **target**     | **Object** | **触发事件的组件的一些属性值集合**           |
| currentTarget  | Object     | 当前组件的一些属性值集合                     |
| **detail**     | **Object** | **额外的信息**                               |
| touches        | Array      | 触摸事件，当前停留在屏幕中的触摸点信息的数组 |
| changedTouches | Array      | 触摸事件，当前变化的触摸点信息的数组         |

  在实际开发过程中，会经常用到 `event.target` ，基本用得比较多的属性都给加粗了。

#### 4、 target 和 currentTarget 的区别

   在对象 `event` 中，`target` 是触发该事件的源头组件，而 `currentTarget` 则是当前事件所绑定的组件。通过下面的栗子来进行详细了解：

![在这里插入图片描述](https://img-blog.csdnimg.cn/890ae31e63ee4eddbe3edaa49ede9351.png#pic_center)
  在WXML中在 `view` 组件内部添加按钮 `button`，当点击内部的按钮时，点击事件以冒泡的方式向外扩散，也会触发外层 `view` 的 `tap` 事件处理函数，简而言之就是当父元素设置了点击事件时，子元素也能触发。具体来看一下运行效果：

![在这里插入图片描述](https://img-blog.csdnimg.cn/fdf8a7a55c7e48969d72d37572b399b5.png#pic_center)

  此时这两个属性就会有区别，对于内部的 `button` 来说：

- `event.target` 指向的是触发事件的源头组件，因此，`event.target` 是指向当前组件 `button`；
- `event.currentTarget` 指向的是当前正在触发事件的那个组件，也就是绑定触发事件的，因此，`event.currentTarget` 是指向外部组件 `view` ；

## 二、tap 事件

#### 1、bindtap 的语法格式

  在小程序中，不存在 `HTML` 中的 `onclick` 鼠标点击事件，而是通过 `tap` 事件来响应用户的触摸行为。结合上一个栗子，就会有个疑问：假设外内部都设置有 `tap` 事件，实际效果会使怎么样的呢？下面来进行实践一下。

**cshPageTab.js：**



  在页面的 `.js` 文件中定义对应的事件处理函数，事件参数通过形参 `event`（可以简写成 e） 来接收：

```javascript
Page({
  tabHandler(event){
    console.log("event.target =====>",event.target);
    console.log("event.currentTarget =====>",event.currentTarget);
  },
  btnTabHandler(event){
    console.log("button event.target =====>",event.target);
    console.log("button event.currentTarget =====>",event.currentTarget);
  }
})
```

**cshPageTab.wxml：**

  通过 `bindtap` 方式，可以为组件绑定 `tap` 触摸事件，语法如下：

```javascript
<view id="thisOut" class="view-click" bindtap="tabHandler">
  <button id="thisIn" type="primary" bindtap="btnTabHandler">CSH</button>
</view>
```

  这样就实现了 tap 事件绑定了。

- 点击外部组件：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417232752512.png)

- 点击内部组件：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417232854494.png)
  对比两次点击结果，可以发现，内外组件都设置了 `tap` 事件，点击内部按钮都会一起触发。

#### 2、在事件处理函数中为 data 中的数据赋值

  当我们想通过点击来改变某个数值时，就可以调用 `this.setData(dataObject)` 方法，可以给页面 `data` 中的数据重新赋值，可以通过下面的🌰来学习一下：



**cshPageTab.js：**

  通过 `this.data` 就能获取当前 data 里面的数据，在刷新数值即可。

```javascript{8}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
  },
  // count + 6 的点击事件处理函数
  btnCount(event){
    this.setData({
      count: this.data.count + 6
    })
  }
})
```

**cshPageTab.wxml：**

```javascript{4}
<view id="thisOut" class="view-click" bindtap="tabHandler">
  <button id="thisIn" type="primary" bindtap="btnTabHandler">CSH</button>
  <button type="primary" bindtap="btnCount">+6</button>
</view>
```

  可以来看一下实际效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/setData%E6%96%B9%E6%B3%95%E4%BF%AE%E6%94%B9%E6%95%B0%E6%8D%AE%E6%A8%A1%E5%9E%8B.gif)

#### 3、事件传参

  小程序中的事件传参比较特殊，不能在绑定事件的同时为事件处理函数传递参数。比如下面的代码是不能正常运行，在 Vue 里面这样写是没有问题，但在小程序中是不行的。

```javascript
  <button type="primary" bindtap="btnCount(123)">事件传参</button>
```

  因为小程序 bindtap 后面引号内容代表的是事件处理函数的名字，相当于要调用一个名称为 `btnCount(123)` 的事件处理函数。

- **传递参数**

  那小程序怎么传递参数呢？这里就可以通过组件提供 `data-*` 自定义属性传参，其中 * 代表的是参数的名字，具体实现代码如下：

```javascript
  <button type="primary" bindtap="btnCountEvent" data-info="{{2}}">事件传参</button>
```

  其中，`info` 会被解析为参数的名字，数值 `2` 会被解析为参数的值，如果这里不用双括号，那接收到的参数会是字符串类型。

- **获取参数**

  在事件处理函数中，通过 `event.target.dataset.参数名` 即可获取到具体参数的值，具体实现代码如下：

```javascript
Page({
  btnCountEvent(event){
    // 通过 dataset 可以访问到具体参数的值
    console.dir(event.target.dataset.info);
  },
})
```

  其中 dataset 是一个对象，里面包含了所有通过 data-* 传递过来的参数项。可以来看一下实际效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417233830821.png)



## 三、input 事件

#### 1、bindinput 的语法格式

  在小程序中，也可以对文本输入框进行绑定事件，通过 `input` 事件来响应文本框的输入事件，语法格式如下：

**cshPageTab.js：**

  在页面的 .js 文件中定义事件处理函数：

```javascript{10}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
  },
  // count + 6 的点击事件处理函数
  btnCount(event){
    this.setData({
      count: this.data.count + 6
    })
  },
  btnCountEvent(event){
      console.dir(event.target.dataset.info);      // 通过 dataset 可以访问到具体参数的值
  },
  btnInput(event){
    // event.detail.value 是变化后的值，文本框里最新的值
    console.dir("event.detail.value = " + event.detail.value);
  },

})
```

**cshPageTab.wxml：**
  在小程序中，通过 input 事件来响应文本框的输入事件，语法格式如下：

```javascript{7}
<view id="thisOut" class="view-click" bindtap="tabHandler">
  <button id="thisIn" type="primary" bindtap="btnTabHandler">CSH</button>
  <button type="primary" bindtap="btnCount">+6</button>
  <button type="primary" bindtap="btnCountEvent" data-info="{{2}}">事件传参</button>
  <input bindinput="btnInput"></input>
</view>
```

  可以来看一下实际效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%8E%B7%E5%8F%96%E8%BE%93%E5%85%A5%E6%A1%86%E4%B8%AD%E8%BE%93%E5%85%A5%E7%9A%84%E5%80%BC.gif)

#### 2、实现文本框和 data 之间的数据同步

  在实际开发过程中，文本框里的数据只要与data的数据要进行同步。其实现流程可分为以下步骤：

- **Step 1**、定义数据

**cshPageTab.js：**

```javascript{5}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count: 0,
    msg: "我是JacksonWang，你好呀！",
  },
  // count + 6 的点击事件处理函数
  btnCount(event){
    this.setData({
      count: this.data.count + 6
    })
  },
  btnCountEvent(event){
      console.dir(event.target.dataset.info);      // 通过 dataset 可以访问到具体参数的值
  },
  btnInput(event){
    // event.detail.value 是变化后的值，文本框里最新的值
    console.dir("event.detail.value = " + event.detail.value);
  },
  
})
```

- **Step 2**、渲染结构

**cshPageTab.wxml：**

```javascript
<view id="thisOut" class="view-click" bindtap="tabHandler">
  <button id="thisIn" type="primary" bindtap="btnTabHandler">CSH</button>
  <button type="primary" bindtap="btnCount">+6</button>
  <button type="primary" bindtap="btnCountEvent" data-info="{{2}}">事件传参</button>
  <input value="{{msg}}" bindinput="btnInput"></input>
</view>
```

- **Step 3**、美化样式

**cshPageTab.wxss：**

```javascript
/* pages/cshPageData/cshPageData.wxss */
button{
  margin-top: 20px;
}
input{
  border: 1px solid rgb(161, 153, 153);
  padding: 5px;
  margin: 5px;
  border-radius: 3px;
}
```

- **Step 4**、绑定 input 事件处理函数

**cshPageTab.js：**

  在页面的 .`js` 文件中定义事件处理函数，通过前面的栗子可以知道怎么刷新 `data` 里的值，所以只要获取到文本框里最新的值，在将其重新给 `msg` 赋值即可。

```javascript
Page({
  btnInput(event){
    // event.detail.value 是变化后的值，文本框里最新的值
    console.dir("event.detail.value = " + event.detail.value);
    // 通过event.detail.value获取文本框最新的值,再给msg赋值
    this.setData({
      msg: event.detail.value,
    });
  },
})
```

  可以来看一下实际效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%BE%93%E5%85%A5%E6%A1%86%E5%92%8C%E6%A8%A1%E5%9E%8B%E6%95%B0%E6%8D%AE%E5%8F%8C%E5%90%91%E7%BB%91%E5%AE%9A.gif)



  我的周末就这么没了，啊啊啊啊


