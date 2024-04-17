# 其它常用组件介绍button&image

## 一、基础内容组件

#### 1、常用的基础内容组件

  比较常用组件有 `button` 、 `image` 和 `navigator`（后续讲解），其作用和使用场景如下所示：

| 组件      | 作用                                                         |
| --------- | ------------------------------------------------------------ |
| button    | 按钮组件 功能比 HTML 中的 button 按钮丰富 通过 open-type 属性可以调用微信提供的各种功能（客服、转发、获取用户授权、获取用户信息等） |
| image     | 图片组件 image 组件默认宽度约 300px、高度约 240px            |
| navigator | 页面导航组件 类似于 HTML 中的 a 链接                         |

#### 2、 button 组件的基本使用

  首先要找到对应的页面来使用 `button `组件，这里以 `cshPageButton` 页面为例，在 `cshPageButton.wxml` 里写页面的结构，在 `cshPageButton.wxss` 里写页面的样式。下面是 `button `组件常用的属性：

| 属性    | 类型    | 默认值  | 说明                      | 最低版本 |
| ------- | ------- | ------- | ------------------------- | -------- |
| size    | string  | default | 按钮的大小                | 1.0.0    |
| type    | string  | default | 按钮的样式类型            | 1.0.0    |
| plain   | boolean | false   | 按钮是否镂空，背景色透明  | 1.0.0    |
| loading | boolean | false   | 名称前是否带 loading 图标 | 1.0.0    |

**cshPageButton.wxml：**

  通过 `type`、`size`属性可以改变按钮的样式.

```javascript
<button>单抽一次试试</button>
<button type="primary">没出货？直接十连</button>
<button type="warn" loading>歪了？氪金</button>
<!-- 小尺寸按钮 --><!-- 默认尺寸按钮 -->
<button>单抽一次试试</button>
<button type="primary">没出货？直接十连</button>
<button type="warn" loading>歪了？氪金</button>
<!-- 小尺寸按钮 -->
<button size="mini">单抽一次试试</button>
<button size="mini"  type="primary">直接十连</button>
<button size="mini"  type="warn" loading >歪了？氪金</button>
<!-- 镂空按钮 -->
<button size="mini" plain>单抽一次试试</button>
<button size="mini" type="primary" plain>直接十连</button>
<button size="mini" type="warn" loading  plain>歪了？氪金</button>
<button size="mini">单抽一次试试</button>
<button type="primary" size="mini">直接十连</button>
<button type="warn" loading size="mini">歪了？氪金</button>
<!-- 镂空按钮 -->
<button size="mini" plain>单抽一次试试</button>
<button type="primary" size="mini" plain>直接十连</button>
<button type="warn" loading size="mini" plain>歪了？氪金</button>
```

**cshPageButton.wxss：**

  对 `button` 标签进行样式选择。

```javascript
button{
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
```

  可以看一下多种按钮实现效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417225840905.png)

#### 3、image 组件的基本使用

   如果想显示图片，就可以使用 `image` 组件，先来介绍 `image` 组件的常用属性吧。

| 属性 | 类型   | 默认值       | 说明                 | 最低版本 |
| ---- | ------ | ------------ | -------------------- | -------- |
| src  | string | 图片资源地址 | 1.0.0                |          |
| mode | string | scaleToFill  | 图片裁剪、缩放的模式 | 1.0.0    |

   其中 `image` 组件的 `mode`属性用来指定图片的裁剪和缩放模式，常用的 `mode` 属性值如下：



| mode值      | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| scaleToFill | （默认值）缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素 |
| aspectFit   | 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。 |
| aspectFill  | 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说， 图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 |
| widthFix    | 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变         |
| heightFix   | 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变         |

显示详细信息

**cshPageButton.wxml：**
  注意这里 `style` 后面要用单引号‘’，不能使用双引号，因为外面已经使用了。

```javascript
<image></image>
<image src="/images/cshTest2.jpg" ></image>
<image src="/images/cshTest2.jpg" mode="aspectFit"></image>
<image src="/images/cshTest2.jpg" mode="aspectFill"></image>
<image src="/images/cshTest2.jpg" mode="widthFix"></image>
<image src="/images/cshTest2.jpg" mode="heightFix"></image>
```

**cshPageButton.wxss：**

  对标签进行样式选择。

```css
button{
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
image {
  border: 1px solid red;
}
```



  可以来看一下图片效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/68dcb945858047b6b135cd8209f7f0e8%5B1%5D.gif)