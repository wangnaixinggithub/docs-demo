# WXSS 模板样式-全局样式和局部样式

## 一、全局样式和局部样式

  前面已经介绍了WXSS模板语法-rpx & import，通过栗子学习了WXSS模板语法如何导入公共样式。接下来就来讲解一下另外一个WXSS模板语法–全局样式和局部样式。话不多说，让我们原文再续，书接上回吧。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8bde1a1ee5e49b89554490a67e354bf.gif)

#### 1、全局样式

  定义在 `app.wxss` 中的样式为全局样式，作用于每一个页面。通过下面的栗子来学习一下：

**app.wxss**

  对全部的view组件进行样式设置，注意这里要换算单位的，比如要设置5 px，对应就是10 rpx。

```javascript
view{
  padding: 10rpx;
  margin: 10rpx;
  background-color: darksalmon;
}
```

  可以来看一下运行效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9134567d9c4c4ac7b09259185d01e68d%5B1%5D.png)

#### 2、局部样式

  在页面的 `.wxss `文件中定义的样式为局部样式，只作用于当前页面。通过下面的栗子来学习一下：

**全局样式 app.wxss**

```javascript
view{
  padding: 10rpx;
  margin: 10rpx;
  background-color: darksalmon;
}
```

**局部样式 cshPageTab.wxss**

```javascript
view{
  background-color: lightpink;
}
```

  这样的话，局部样式的 view 背景颜色会覆盖全局样式，可以来看一下实际效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5da48950cf034a8a90cb8566ceb67098%5B1%5D.png)



**注意：**

- 当局部样式和全局样式冲突时，根据就近原则，局部样式会覆盖全局样式
- 当局部样式的权重大于或等于全局样式的权重时，才会覆盖全局的样式

#### 3、样式权重

  每个样式都有自己的权重，对于局部样式和全局样式权重极其重要，因为样式之间的覆盖是根据权重大小来的。
  只要把鼠标放在样式上就会有出权重页面，下面以上面的栗子来查看全局样式和局部样式的权重：

**全局样式 app.wxss：**

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240421223747402.png" style="zoom: 33%;" />



**局部样式 cshPageTab.wxss：**

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240421223729833.png" style="zoom: 33%;" />



   可以通过查看上面栗子中全局样式和局部样式权重比都是一样的，所以局部样式能覆盖全局样式。



   那么问题来了，如果全局样式的权重比局部样式高会是怎么样的效果呢？接下来就通过下面的栗子来看一下吧

**全局样式 app.wxss：**

```javascript
view{
  padding: 10rpx;
  margin: 10rpx;
  background-color: darksalmon;
}

view:nth-child(3){
  background-color: lightskyblue;
}
```

**局部样式 cshPageTab.wxss：**

```javascript
view{
  background-color: lightpink;
}
```

  从前面的栗子可以知道局部样式和全局样式 view 的权重比都是 `Selector Specificity: (0, 0, 1)`，这里只需要看一下 `view:nth-child(3)` 的权重比即可。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/af577669266849c2b1e09f2715c3b64a%5B1%5D.png)



  上图中可以看出`view:nth-child(3)` 的权重比为 `Selector Specificity: (0, 1, 1)`，局部权重还要大，所以按理局部样式无法覆盖，来看一下运行效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/801a6be06c4d41de9159a709f57e1df1%5B1%5D.png)