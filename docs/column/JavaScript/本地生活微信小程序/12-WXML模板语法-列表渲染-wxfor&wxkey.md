# WXML模板语法-列表渲染-wx:for&wx:key



## 一、列表渲染

  前面已经介绍完了WXML模板语法–条件渲染，通过栗子学习到了如何在WXML页面上进行条件渲染，也了解到两中渲染方式。接下来就来讲解一下另外一个模板语法–列表渲染。话不多说，让我们原文再续，书接上回吧。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf.gif)

#### 1、wx:for

   在实际开发过程中，会需要显示多个相同的组件，此时只要在组件上使用 `wx:for` 控制属性绑定一个数组，即可使用数组中各项的数据重复渲染该组件。这里对数组的引用都是用 `Mustache` 语法（双花括号）来表示， 具体代码如下所示：

**cshPageTab.wxml：**

```javascript
<view wx:for="{{array}}">
  当前篇数：{{index}} 当前学习天数：{{item}} 
</view> 
```

   默认数组的当前项的下标变量名默认为 `index`，数组当前项的变量名默认为 `item`。

**cshPageTab.js：**

```javascript
Page({
  data: {
	array:["1","2","3","4","5","6","7","8"],
  },
})
```

  此时就完成将数组每项数据都渲染到组件上，实际效果如下所示：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/46c38a0b315d4eed9e8b3e212d79cf93%5B1%5D.png)

#### 2、指定索引和当前项的变量名

  在列表渲染的过程中，可以通过使用 `wx:for-index` 可以指定当前循环项的索引的变量名 ，使用 `wx:for-item` 可以指定当前项的变量名，不过在开发过程这种用法比较少用到，具体代码如下：

**cshPageTab.wxml：**
  可以在上面栗子的基础进行改动，看是否能改动成功。

```javascript
<view wx:for="{{array}}">
  当前篇数：{{index}} 当前学习天数：{{item}} 
</view>
<view>----------------</view>
<view wx:for="{{array}}" wx:for-index="ids" wx:for-item="ids">
  当前篇数：{{ids}} 当前学习天数：{{ids}} 
</view>
```

  可以看出这两者的渲染效果是一样的，来看下实际运行效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/3115f9746ee241b9a126f46fa51cc1e5%5B1%5D.png)



#### 3、`<block>` 使用 wx:for

  前面再讲 `wx:if` 条件渲染的时候就用到了 `<block>` 标签，同样该标签也适用于 `wx:for` ，以渲染一个包含多节点的结构块。具体代码如下：

**cshPageTab.wxml：**

```javascript
<block wx:for="{{['好好学习','天天向上','各位大佬好']}}">
  <view>{{index}}</view>
  <view>{{item}}</view>
</block>
```

   可以来看一下运行效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5af03e4f449a4b688b93fb3782de8f4b%5B1%5D.png)

#### 4、wx:key 的使用

  当数据改变触发渲染层重新渲染的时候，不带有 key 的组件会被重新创建，而不会重新排序，所以需要使用 wx:key 来指定列表中项目的唯一的标识符。`wx:key` 的值以两种形式提供：

- 在 for 循环的 `array` 中 `item` 的某个 `property`，该 `property` 的值需要是列表中唯一的字符串或数字，且不能动态改变。
- 可以当前数组的索引 `index` 来当其 `key`。

  在实际开发过程中，建议只要使用到 `wx:for` 都要加 `key`，具体代码如下：

**cshPageTab.wxml：**

  wx:key 外面是可以不用 `Mustache` 语法来表示的

```javascript
<view wx:for="{{userList}}" wx:key="id">{{item.name}}</view>
```

  类似于 `Vue` 列表渲染中的 `:key`，小程序在实现列表渲染时，也建议为渲染出来的列表项指定唯一的 key 值，从而提高渲染的效率。如果没有 `id` ，也可以使用索引来当 key 值。

**cshPageTab.js：**

```javascript
Page({
  data: {
	userList:[
      {id: 1, name: '狂飙'},
      {id: 2, name: '安欣'},
      {id: 3, name: '高启强'},
      {id: 4, name: '孙子兵法'}
    ],
  },
})
```

  此时就可以成功的把数组里的数据渲染出来，可以来看下实际运行效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/66e37e462f554e65b9e90ca291cd37e2%5B1%5D.png)



  接下来可以切换到 `Console` 面板，如果我们在循环时候不使用 `key` 会显示出警告，提示可以给循环提供 `key`，前面的循环都没有使用 key 。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240421222802229.png)

