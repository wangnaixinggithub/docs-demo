# List组件和Grid组件的使用

## 简介

在我们常用的手机应用中，经常会见到一些数据列表，如设置页面、通讯录、商品列表等。下图中两个页面都包含列表，“首页”页面中包含两个网格布局，`"商城"`页面中包含一个商品列表。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519092215492.png)



上图中的列表中都包含一系列相同宽度的列表项，连续、多行呈现同类数据，例如图片和文本。常见的列表有线性列表（List列表）和网格布局（Grid列表）：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519092608601.png)





为了帮助开发者构建包含列表的应用，ArkUI提供了List组件和Grid组件，开发者使用List和Grid组件能够很轻松的完成一些列表页面。

## List组件的使用

### List组件简介

List是很常用的滚动类容器组件，一般和子组件`ListItem`一起使用，List列表中的每一个列表项对应一个`ListItem`组件。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519092800420.png)

### 使用ForEach渲染列表

列表往往由多个列表项组成，所以我们需要在List组件中使用多个ListItem组件来构建列表，这就会导致代码的冗余。使用循环渲染（ForEach）遍历数组的方式构建列表，可以减少重复代码，示例代码如下：

```js
@Entry
@Component
struct ListDemo {
  private arr: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  build() {
    Column() {
      List({ space: 10 }) {
        ForEach(this.arr, (item: number) => {
          ListItem() {
            Text(`${item}`)
              .width('100%')
              .height(100)
              .fontSize(20)
              .fontColor(Color.White)
              .textAlign(TextAlign.Center)
              .borderRadius(10)
              .backgroundColor(0x007DFF)
          }
        }, item => item)
      }
    }
    .padding(12)
    .height('100%')
    .backgroundColor(0xF1F3F5)
  }
}
```

效果图如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519092919777.png)

### 设置列表分割线

List组件子组件ListItem之间默认是没有分割线的，部分场景子组件ListItem间需要设置分割线，这时候您可以使用List组件的divider属性。divider属性包含四个参数：



- `strokeWidth`: 分割线的线宽。
- `color`: 分割线的颜色。
- `startMargin`：分割线距离列表侧边起始端的距离。
- `endMargin`: 分割线距离列表侧边结束端的距离。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519093044348.png)

### List列表滚动事件监听

List组件提供了一系列事件方法用来监听列表的滚动，您可以根据需要，监听这些事件来做一些操作：

- `onScroll`：列表滑动时触发，返回值`scrollOffset`为滑动偏移量，`scrollState`为当前滑动状态。
- `onScrollIndex`：列表滑动时触发，返回值分别为滑动起始位置索引值与滑动结束位置索引值。
- `onReachStart`：列表到达起始位置时触发。
- `onReachEnd`：列表到底末尾位置时触发。
- `onScrollStop`:列表滑动停止时触发。

使用示例代码如下：

```js
List({ space: 10 }) {
  ForEach(this.arr, (item) => {
    ListItem() {
      Text(`${item}`)
        ...
    }
  }, item => item)
}
.onScrollIndex((firstIndex: number, lastIndex: number) => {
  console.info('first' + firstIndex)
  console.info('last' + lastIndex)
})
.onScroll((scrollOffset: number, scrollState: ScrollState) => {
  console.info('scrollOffset' + scrollOffset)
  console.info('scrollState' + scrollState)
})
.onReachStart(() => {
  console.info('onReachStart')
})
.onReachEnd(() => {
  console.info('onReachEnd')
})
.onScrollStop(() => {
  console.info('onScrollStop')
})
```

### 设置List排列方向

List组件里面的列表项默认是按垂直方向排列的，如果您想让列表沿水平方向排列，您可以将List组件的`listDirection`属性设置为`Axis.Horizontal`。



`listDirection`参数类型是[Axis](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-appendix-enums-0000001478061741-V3?catalogVersion=V3#ZH-CN_TOPIC_0000001478061741__axis)，定义了以下两种类型：

- Vertical（默认值）：子组件`ListItem`在List容器组件中呈纵向排列。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519093352115.png)

- Horizontal：子组件`ListItem`在List容器组件中呈横向排列。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519093408398.png)



### Grid组件的使用

#### Grid组件简介

Grid组件为网格容器，是一种网格列表，由“行”和“列”分割的单元格所组成，通过指定“项目”所在的单元格做出各种各样的布局。`Grid`组件一般和子组件`GridItem`一起使用，`Grid`列表中的每一个条目对应一个`GridItem`组件。
![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519093551155.png)





#### 使用ForEach渲染网格布局

和List组件一样，Grid组件也可以使用`ForEach`来渲染多个列表项`GridItem`，我们通过下面的这段示例代码来介绍Grid组件的使用。

```js
@Entry
@Component
struct GridExample {
  // 定义一个长度为16的数组
  private arr: string[] = new Array(16).fill('').map((_, index) => `item ${index}`);

  build() {
    Column() {
      Grid() {
        ForEach(this.arr, (item: string) => {
          GridItem() {
            Text(item)
              .fontSize(16)
              .fontColor(Color.White)
              .backgroundColor(0x007DFF)
              .width('100%')
              .height('100%')
              .textAlign(TextAlign.Center)
          }
        }, item => item)
      }
      .columnsTemplate('1fr 1fr 1fr 1fr')
      .rowsTemplate('1fr 1fr 1fr 1fr')
      .columnsGap(10)
      .rowsGap(10)
      .height(300)
    }
    .width('100%')
    .padding(12)
    .backgroundColor(0xF1F3F5)
  }
}
```

示例代码中创建了16个GridItem列表项。同时设置columnsTemplate的值为'1fr 1fr 1fr 1fr'，表示这个网格为4列，将Grid允许的宽分为4等分，每列占1份；rowsTemplate的值为'1fr 1fr 1fr 1fr'，表示这个网格为4行，将Grid允许的高分为4等分，每行占1份。这样就构成了一个4行4列的网格列表，然后使用columnsGap设置列间距为10vp，使用rowsGap设置行间距也为10vp。示例代码效果图如下：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519093716328.png)



上面构建的网格布局使用了固定的行数和列数，所以构建出的网格是不可滚动的。然而有时候因为内容较多，我们通过滚动的方式来显示更多的内容，就需要一个可以滚动的网格布局。我们只需要设置rowsTemplate和columnsTemplate中的一个即可。



将示例代码中GridItem的高度设置为固定值，例如100；仅设置columnsTemplate属性，不设置rowsTemplate属性，就可以实现Grid列表的滚动：

```js
Grid() {
  ForEach(this.arr, (item: string) => {
    GridItem() {
      Text(item)
        .height(100)
        ...
    }
  }, item => item)
}
.columnsTemplate('1fr 1fr 1fr 1fr')
.columnsGap(10)
.rowsGap(10)
.height(300)
```

此外，Grid像List一样也可以使用`onScrollIndex`来监听列表的滚动。

#### 列表性能优化

开发者在使用长列表时，如果直接采用循环渲染方式，会一次性加载所有的列表元素，从而导致页面启动时间过长，影响用户体验，推荐通过以下方式来进行列表性能优化：



[使用数据懒加载](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/ui-ts-performance-improvement-recommendation-0000001477981001-V2#ZH-CN_TOPIC_0000001523648418__推荐使用数据懒加载)



[设置list组件的宽高](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/ui-ts-performance-improvement-recommendation-0000001477981001-V2#section637765124414)

