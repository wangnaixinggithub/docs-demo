# 常用的基础内容组件 text & rich-text & progress & icon

## 一、基础内容组件

#### 1、常用的基础内容组件

  比较常用的基础内容组件有 `text` 和 `rich-text`，其作用和使用场景如下所示：

| 组件      | 作用                                                |
| --------- | --------------------------------------------------- |
| text      | 文本组件 类似于 HTML 中的 span 标签，是一个行内元素 |
| rich-text | 富文本组件 支持把 HTML 字符串渲染为 WXML 结构       |
| progress  | 进度条 可实现动画进度或者下载进度等                 |
| icon      | 图标组件 常用于表示信息提示                         |

#### 2、 text 组件的基本使用

  首先要找到对应的页面来使用 `text` 组件，这里以 `cshPageText` 页面为例，在 `cshPageText.wxml` 里写页面的结构。下面是 `text` 组件的属性：

| 属性        | 类型    | 默认值       | 说明                                                | 最低版本 |
| ----------- | ------- | ------------ | --------------------------------------------------- | -------- |
| selectable  | boolean | false        | 文本是否可选 (已废弃)                               | 1.1.0    |
| user-select | boolean | false        | 文本是否可选，该属性会使文本节点显示为 inline-block | 2.12.1   |
| space       | string  | 显示连续空格 | 1.4.0                                               |          |
| decode      | boolean | false        | 是否解码                                            | 1.4.0    |

**cshPageText.wxml：**

```js{3}
<view>
  我是夜阑的狗 60级萌新 UID:
  <text selectable space="emsp">131338582     忘放孜然</text>
</view>
```

  通过 `text` 组件的 `selectable` 属性，实现长按选中文本内容的效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E9%95%BF%E6%8C%89%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9.gif)

#### 3、 rich-text 组件的基本使用

  如果想把 `HTML`字符串渲染为对应的 UI 结构，就要通过 `rich-text` 组件的 `nodes` 属性节点，先来看一下`rich-text`有哪些属性吧。

| 属性        | 类型         | 默认值       | 说明                                     | 最低版本 |
| ----------- | ------------ | ------------ | ---------------------------------------- | -------- |
| nodes       | array/string | []           | 节点列表/HTML String                     | 1.4.0    |
| space       | string       | 显示连续空格 | 2.4.1                                    |          |
| user-select | boolean      | false        | 文本是否可选，该属性会使节点显示为 block | 2.24.0   |

  其中 `nodes` 现支持两种节点，通过 `type` 来区分，分别是元素节点和文本节点，默认是元素节点，在富文本区域里显示的 `HTML` 节点。

| 属性     | 类型   | 说明       | 必填 | 备注                                     |
| -------- | ------ | ---------- | ---- | ---------------------------------------- |
| name     | string | 标签名     | 是   | 支持部分受信任的 HTML 节点               |
| attrs    | object | 属性       | 否   | 支持部分受信任的属性，遵循 Pascal 命名法 |
| children | array  | 子节点列表 | 否   | 结构和 nodes 一致                        |

**cshPageText.wxml：**
  注意这里 `style` 后面要用单引号`''`，不能使用双引号，因为外面已经使用了。

```js{2}
<view>
  <rich-text nodes="<h1 style = 'color: red;'> CSH <h1>"></rich-text>
  我是JacksonWang 60级萌新 UID:
  <text selectable space="emsp">131338582     忘放孜然</text>
</view>
```

  可以来看一下标题效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417224305291.png)



#### 4、 progress 组件的基本使用

   如果想要实现进度条，就可以使用 `progress` 组件，先来介绍 `progress` 组件的常用属性吧。

| 属性         | 类型          | 默认值      | 说明                   | 最低版本 |
| ------------ | ------------- | ----------- | ---------------------- | -------- |
| percent      | number        | 百分比0~100 | 1.0.0                  |          |
| show-info    | boolean       | false       | 在进度条右侧显示百分比 | 1.0.0    |
| stroke-width | number/string | 6           | 进度条线的宽度         | 1.0.0    |
| active       | boolean       | false       | 进度条从左往右的动画   | 1.0.0    |

**cshPageText.wxml：**

```js{7,10}
<view>
  <rich-text nodes="<h1 style = 'color: red;'> CSH <h1>"></rich-text>
  我是夜阑的狗 60级萌新 UID:
  <text selectable space="emsp">131338582     忘放孜然</text>
</view>
<view>
  <progress percent="80" show-info stroke-width="8" />
</view>
<view>
  <progress percent="90" show-info active stroke-width="8"/>
</view>
```

  可以来看一下进度条效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%BF%9B%E5%BA%A6%E6%9D%A1%E6%95%88%E6%9E%9C.gif)

#### 5、 icon组件的基本使用

   `icon` 组件常用于表示信息提示，先来介绍 `icon` 组件的常用属性吧。

| 属性  | 类型          | 默认值                                                       | 说明                                                         | 最低版本 |
| ----- | ------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | -------- |
| type  | string        | icon的类型，有效值：success, success_no_circle, info, warn, waiting, cancel, download, search, clear | 1.0.0                                                        |          |
| size  | number/string | 23                                                           | icon的大小，单位默认为px，2.4.0起支持传入 单位(rpx/px)，2.21.3起支持传入其余单位(rem 等)。 | 1.0.0    |
| color | string        | icon的颜色，同 css 的color                                   | 1.0.0                                                        |          |

显示详细信息

**cshPageText.wxml：**

```js{12-23}
<view>
  <rich-text nodes="<h1 style = 'color: red;'> CSH <h1>"></rich-text>
  我是JacksonWang 60级萌新 UID:
  <text selectable space="emsp">131338582     忘放孜然</text>
</view>
<view>
  <progress percent="80" show-info stroke-width="8" />
</view>
<view>
  <progress percent="90" show-info active stroke-width="8"/>
</view>
<view class="icon-box">
    <icon class="icon-box-img" type="success" size="93"></icon>
    <view class="icon-box-ctn">
      <view class="icon-box-title">成功</view>
      <view class="icon-box-desc">用于表示操作顺利完成</view>
    </view>
    <icon class="icon-box-img" type="info" size="93"></icon>
    <view class="icon-box-ctn">
      <view class="icon-box-title">提示</view>
      <view class="icon-box-desc">用于表示信息提示；也常用于缺乏条件的操作拦截，提示用户所需信息</view>
    </view>
</view>
```

**cshPageText.wxss：**

```css
.icon-box {
  text-align: center;
}
```

  可以来看一下图标显示效果：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417224729681.png)