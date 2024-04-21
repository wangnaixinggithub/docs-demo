# WXML 模板语法 - 条件渲染 -wx:if&hidden 

## 一、条件渲染

  前面已经介绍完了WXML模板语法–事件绑定，通过栗子学习到了如何在WXML页面上进行事件绑定。接下来就来讲解一下另外一个模板语法–条件渲染。话不多说，让我们原文再续，书接上回吧。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf.gif)



#### 1、wx:if

  在小程序中，使用 `wx:if="{{condition}}"` 来判断是否需要渲染该代码块，如果里面的 `condition` 为 `true`的时候就会显示 `view` 组件，反之则不显示，示例代码如下所示：

```javascript
<view wx:if="{{condition}}"> 我是夜阑的狗 </view>
```

  这里看到 `if` 语句肯定会联想到 `else` 和 `elif`，同样这里也是有 `wx:else` 和 `wx:elif` ，可以用来添加 else 判断：

```javascript
<view wx:if="{{type === 1}}"> 夜兰 </view>
<view wx:elif="{{type === 2}}"> 高启强 </view>
<view wx:else> 老默不想吃鱼 </view>
```

当改变type属性时，页面显示的文本也是随着改变。可以来看一下实际效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/02d864be362a43918550b485c8a44519.png)

#### 2、` <block>` 使用 wx:if

  如果想要控制多个组件一起展示和隐藏的话，就可以使用一个 `<block></block>` 标签将多个组件包装起来，并在标签上使用 wx:if 控制属性，具体代码如下：

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

  注意： 并不是一个组件，它只是一个包裹性质的容器，不会在页面中做任何渲染，所以只会显示该组件内部的组件。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/e6ce3823b73e42bd92bf146f1a755696.png)



  看到这里，估计有疑惑了，好像这种操作在两个 `view` 组件外面再加一个 `view + wx:if` 不也是可行的吗？确实是可行，但是实际运行过程中，最外部的 view 组件也会被一起渲染出来，而使用 组件不会被渲染，只起到一个包裹的作用，所以使用 组件可以避免渲染不必要的元素，以此来提高页面渲染性能。

#### 3、hidden

  在小程序中，除了使用 `wx:if` 来控制元素的显示与隐藏外，还可以直接使用 `hidden="{{ condition }}"` 完成此操作。

**cshPageTab.js：**

```javascript
Page({
  /**
   * 页面的初始数据
   */
  data: {
	flag: true,
  },

})
```

**cshPageTab.wxml：**

```javascript
<block wx:if="{{true}}">
  <view hidden="{{flag}}">狂飙</view>
  <view>我也要去卖鱼了</view>
</block>
```

   当条件为 true 时隐藏元素，条件为 false 时则显示，来看一下实际效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/afbfa4ee90e241b381a948d7a98c103c.gif)

#### 4、wx:if 与 hidden 的区别

   前面介绍了 wx:if 和 hidden 这两种隐藏显示元素的方法，虽然这种方法实现功能是相似的，但本质上还是有区别的，如下表格所示：

| 属性     | wx:if                                                        | hidden                                                       |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 运行方式 | wx:if 以动态创建和移除元素 的方式控制元素的展示与隐藏        | hidden 以切换样式的方式（display: none/block;），控制元素的显示与隐藏 |
| 使用建议 | 控制条件复杂时，建议使用 wx:if 搭配 wx:elif、wx:else 进行展示与隐藏的切换 | 频繁切换时，建议使用 hidden                                  |

  因为 `wx:if` 之中的模板也可能包含数据绑定，所以当 `wx:if` 的条件值切换时，框架有一个局部渲染的过程，因为它会确保条件块在切换时销毁或重新渲染。
  同时 `wx:if` 也是惰性的，如果在初始渲染条件为 false，框架什么也不做，在条件第一次变成真的时候才开始局部渲染。相比之下，`hidden` 就简单的多，组件始终会被渲染，只是简单的控制显示与隐藏。
  这里通过下面的栗子来学习一下两者的不同，具体代码如下：
**cshPageTab.wxml：**

```javascript
<block wx:if="{{true}}">
  <view hidden="{{flag}}">狂飙</view>
  <view>我也要去卖鱼了</view>
</block>
```

  这两者的运行原理是不同的，想要一起显示出来 hidden 属性 flag 就要取反置为 false才可以显示，实现效果如下所示：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/b617e3948faa457ea860a1b7b567cf46.png)



  一般来说，`wx:if` 有更高的切换消耗而 `hidden` 有更高的初始渲染消耗。因此，如果需要频繁切换的情景下，用 `hidden` 更好，如果在运行时条件不大可能改变则 `wx:if` 较好。

