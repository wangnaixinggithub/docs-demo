# Column&Row组件的使用

## 概述



一个丰富的页面需要很多组件组成，那么，我们如何才能让这些组件有条不紊地在页面上布局呢？这就需要借助容器组件来实现。



容器组件是一种比较特殊的组件，它可以包含其他的组件，而且按照一定的规律布局，帮助开发者生成精美的页面。容器组件除了放置基础组件外，也可以放置容器组件，通过多层布局的嵌套，可以布局出更丰富的页面。



ArkTS为我们提供了丰富的容器组件来布局页面，本文将以构建登录页面为例，介绍Column和Row组件的属性与使用。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519085559121.png)



## 组件介绍

### 布局容器概念

线性布局容器表示按照垂直方向或者水平方向排列子组件的容器，ArkTS提供了Column和Row容器来实现线性布局。



- Column表示沿垂直方向布局的容器。
- Row表示沿水平方向布局的容器。

### 主轴和交叉轴概念

在布局容器中，默认存在两根轴，分别是主轴和交叉轴，这两个轴始终是相互垂直的。不同的容器中主轴的方向不一样的。

- **主轴**：在Column容器中的子组件是按照从上到下的垂直方向布局的，其主轴的方向是垂直方向；在Row容器中的组件是按照从左到右的水平方向布局的，其主轴的方向是水平方向。

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519085809320.png" style="zoom:50%;" />

- **交叉轴**：与主轴垂直相交的轴线，如果主轴是垂直方向，则交叉轴就是水平方向；如果主轴是水平方向，则交叉轴是垂直方向。

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519085907450.png" style="zoom:50%;" />



### 属性介绍

了解布局容器的主轴和交叉轴，主要是为了让大家更好地理解子组件在主轴和交叉轴的排列方式。



接下来，我们将详细讲解Column和Row容器的两个属性`justifyContent`和`alignItems`。

|     属性名称     |                 描述                 |
| :--------------: | :----------------------------------: |
| `justifyContent` |  设置子组件在主轴方向上的对齐格式。  |
|   `alignItems`   | 设置子组件在交叉轴方向上的对齐格式。 |

主轴方向的对齐`（justifyContent）`



子组件在主轴方向上的对齐使用`justifyContent`属性来设置，其参数类型是[FlexAlign](https://developer.harmonyos.com/cn/docs/documentation/doc-references/ts-appendix-enums-0000001281201130#ZH-CN_TOPIC_0000001281201130__flexalign)。`FlexAlign`定义了以下几种类型：



- `Start`：元素在主轴方向首端对齐，第一个元素与行首对齐，同时后续的元素与前一个对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519090514455.png)

- `Center`：元素在主轴方向中心对齐，第一个元素与行首的距离以及最后一个元素与行尾距离相同。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519090557432.png)

- `End`：元素在主轴方向尾部对齐，最后一个元素与行尾对齐，其他元素与后一个对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519090655660.png)

- `SpaceBetween`：元素在主轴方向均匀分配弹性元素，相邻元素之间距离相同。 第一个元素与行首对齐，最后一个元素与行尾对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519090735466.png)

- `SpaceAround`：元素在主轴方向均匀分配弹性元素，相邻元素之间距离相同。 第一个元素到行首的距离和最后一个元素到行尾的距离是相邻元素之间距离的一半。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519090812381.png)

- `SpaceEvenly`：元素在主轴方向等间距布局，无论是相邻元素还是边界元素到容器的间距都一样。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519090858686.png)



交叉轴方向的对齐`（alignItems）`

子组件在交叉轴方向上的对齐方式使用`alignItems`属性来设置。



Column容器的主轴是垂直方向，交叉轴是水平方向，其参数类型为HorizontalAlign（水平对齐），HorizontalAlign定义了以下几种类型：



- `Start`：设置子组件在水平方向上按照起始端对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091142948.png)

- `Center`（默认值）：设置子组件在水平方向上居中对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091206446.png)

- `End`：设置子组件在水平方向上按照末端对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091224307.png)

Row容器的主轴是水平方向，交叉轴是垂直方向，其参数类型为`VerticalAlign`（垂直对齐），`VerticalAlign`定义了以下几种类型：

- Top：设置子组件在垂直方向上居顶部对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091314686.png)

- Center（默认值）：设置子组件在竖直方向上居中对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091328771.png)

- Bottom：设置子组件在竖直方向上居底部对齐。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091343277.png)

### 接口介绍

接下来，我们介绍Column和Row容器的接口。

| 容器组件 |                  **接口**                  |
| :------: | :----------------------------------------: |
| `Column` | `Column(value?:{space?: string | number})` |
|  `Row`   |  `Row(value?:{space?: string | number})`   |

Column和Row容器的接口都有一个可选参数space，表示子组件在主轴方向上的间距。

效果如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091704898.png)

## 组件使用

我们来具体讲解如何高效的使用Column和Row容器组件来构建这个登录页面。

当我们从设计同学那拿到一个页面设计图时，我们需要对页面进行拆解，先确定页面的布局，再分析页面上的内容分别使用哪些组件来实现。



我们仔细分析这个登录页面。在静态布局中，组件整体是从上到下布局的，因此构建该页面可以使用Column来构建。在此基础上，我们可以看到有部分内容在水平方向上由几个基础组件构成，例如页面中间的短信验证码登录与忘记密码以及页面最下方的其他方式登录，那么构建这些内容的时候，可以在Column组件中嵌套Row组件，继而在Row组件中实现水平方向的布局。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519091843282.png)

根据上述页面拆解，在Column容器里，依次是Image、Text、TextInput、Button等基础组件，还有两组组件是使用Row容器组件来实现的，主要代码如下：

```js
@Entry
@Component
export struct LoginPage {
  build() {
    Column() {
      Image($r('app.media.logo'))
        ...
      Text($r('app.string.login_page'))
        ...
      Text($r('app.string.login_more'))
        ...
      TextInput({ placeholder: $r('app.string.account') })
        ...
      TextInput({ placeholder: $r('app.string.password') })
        ...
      Row() {
        Text($r(…)) 
        Text($r(…)) 
      }
      Button($r('app.string.login'), { type: ButtonType.Capsule, stateEffect: true })
        ...
      Row() {
        this.imageButton($r(…))
        this.imageButton($r(…))
        this.imageButton($r(…))
      }
      ...
    }
    ...
  }
}
```

我们详细看一下使用Row容器的两组组件。

两个文本组件展示的内容是按水平方向布局的，使用两端对齐的方式。这里我们使用Row容器组件，并且需要配置主轴上（水平方向）的对齐格式justifyContent为FlexAlign.SpaceBetween（两端对齐）。

```js
Row() {
  Text($r(…)) 
  Text($r(…)) 
  }
  .justifyContent(FlexAlign.SpaceBetween)
  .width('100%')
```

其他登录方式的三个按钮也是按水平方向布局的，同样使用Row容器组件。这里按钮的间距是一致的，我们可以通过配置可选参数space来设置按钮间距，使子组件间距一致。

```js
Row({ space: CommonConstants.LOGIN_METHODS_SPACE }) {
  this.imageButton($r(…))
  this.imageButton($r(…))
  this.imageButton($r(…))
}
```



## 参考链接

- Column组件的相关API参考：[Column组件](https://developer.harmonyos.com/cn/docs/documentation/doc-references/ts-container-column-0000001333641085)。
- Row组件的相关API参考：[Row组件](https://developer.harmonyos.com/cn/docs/documentation/doc-references/ts-container-row-0000001281480714)。