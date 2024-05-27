# Tabs组件的使用

## 概述

在我们常用的应用中，经常会有视图内容切换的场景，来展示更加丰富的内容。比如下面这个页面，点击底部的页签的选项，可以实现`"首页"`和`"我的"`两个内容视图的切换。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/tabChange.png)



ArkUI开发框架提供了一种页签容器组件Tabs，开发者通过Tabs组件可以很容易的实现内容视图的切换。页签容器Tabs的形式多种多样，不同的页面设计页签不一样，可以把页签设置在底部、顶部或者侧边。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/tabBarExample.png)



本文将详细介绍Tabs组件的使用。



## Tabs组件的简单使用

Tabs组件仅可包含子组件`TabContent`，每一个页签对应一个内容视图即`TabContent`组件。下面的示例代码构建了一个简单的页签页面：



```js
@Entry
@Component
struct TabsExample {
  private controller: TabsController = new TabsController()

  build() {
    Column() {
      Tabs({ barPosition: BarPosition.Start, controller: this.controller }) {
        TabContent() {
          Column().width('100%').height('100%').backgroundColor(Color.Green)
        }
        .tabBar('green')

        TabContent() {
          Column().width('100%').height('100%').backgroundColor(Color.Blue)
        }
        .tabBar('blue')

        TabContent() {
          Column().width('100%').height('100%').backgroundColor(Color.Yellow)
        }
        .tabBar('yellow')

        TabContent() {
          Column().width('100%').height('100%').backgroundColor(Color.Pink)
        }
        .tabBar('pink')
      }
      .barWidth('100%') // 设置TabBar宽度
      .barHeight(60) // 设置TabBar高度
      .width('100%') // 设置Tabs组件宽度
      .height('100%') // 设置Tabs组件高度
      .backgroundColor(0xF5F5F5) // 设置Tabs组件背景颜色
    }
    .width('100%')
    .height('100%')
  }
}
```

效果图如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240519094415883.png)



上面示例代码中，Tabs组件中包含4个子组件TabContent，通过TabContent的tabBar属性设置TabBar的显示内容。使用通用属性width和height设置了Tabs组件的宽高，使用barWidth和barHeight设置了TabBar的宽度和高度。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/barWidth.png)





::: info

- TabContent组件不支持设置通用宽度属性，其宽度默认撑满Tabs父组件。
- TabContent组件不支持设置通用高度属性，其高度由Tabs父组件高度与TabBar组件高度决定。



:::





## 设置TabBar布局模式

因为Tabs的布局模式默认是Fixed的，所以Tabs的页签是不可滑动的。当页签比较多的时候，可能会导致页签显示不全，将布局模式设置为Scrollable的话，可以实现页签的滚动。



Tabs的布局模式有Fixed（默认）和Scrollable两种：

 

- BarMode.Fixed：所有TabBar平均分配barWidth宽度（纵向时平均分配barHeight高度）,页签不可滚动，效果图如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/BarModeFixed.png)

- BarMode.Scrollable：每一个TabBar均使用实际布局宽度，超过总长度（横向Tabs的barWidth，纵向Tabs的barHeight）后可滑动。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/BarModeScrollable.png)



- 当页签比较多的时候，可以滑动页签，下面的示例代码将barMode设置为BarMode.Scrollable，实现了可滚动的页签：

```js{28}
@Entry
@Component
struct TabsExample {
  private controller: TabsController = new TabsController()

  build() {
    Column() {
      Tabs({ barPosition: BarPosition.Start, controller: this.controller }) {
        TabContent() {
          Column()
            .width('100%')
            .height('100%')
            .backgroundColor(Color.Green)
        }
        .tabBar('green')

        TabContent() {
          Column()
            .width('100%')
            .height('100%')
            .backgroundColor(Color.Blue)
        }
        .tabBar('blue')

        ...

      }
      .barMode(BarMode.Scrollable)
      .barWidth('100%')
      .barHeight(60)
      .width('100%')
      .height('100%')
    }
  }
}
```



## 设置TabBar位置和排列方向

Tabs组件页签默认显示在顶部，某些场景下您可能希望Tabs页签出现在底部或者侧边，您可以使用Tabs组件接口中的参数`barPosition`设置页签位置。此外页签显示位置还与vertical属性相关联，vertical属性用于设置页签的排列方向，当vertical的属性值为false（默认值）时页签横向排列，为true时页签纵向排列。





`barPosition`的值可以设置为`BarPosition.Start`（默认值）和`BarPosition.End`：



- `BarPosition.Start`

vertical属性方法设置为false（默认值）时，页签位于容器顶部。

```js
Tabs({ barPosition: BarPosition.Start }) {
  ...
}
.vertical(false) 
.barWidth('100%') 
.barHeight(60)  
```

效果图如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/BarPositionStart.png)





vertical属性方法设置为true时，页签位于容器左侧。

```js
Tabs({ barPosition: BarPosition.Start }) {
  ...
}
.vertical(true) 
.barWidth(100) 
.barHeight(200)  
```

效果图如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/BarPostionVertical.png)



- `BarPosition.End`

vertical属性方法设置为false时，页签位于容器底部。

```js
Tabs({ barPosition: BarPosition.End }) {
  ...
}
.vertical(false) 
.barWidth('100%') 
.barHeight(60)
```

效果图如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/BarPositionEnd.png)



vertical属性方法设置为true时，页签位于容器右侧。

```js
Tabs({ barPosition: BarPosition.End}) {
  ...
}
.vertical(true) 
.barWidth(100) 
.barHeight(200)
```

效果图如下：
![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/BarPositionEndVertical.png)

## 自定义TabBar样式



TabBar的默认显示效果如下所示：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/CustomBarDemo.png)





往往开发过程中，UX给我们的设计效果可能并不是这样的，比如下面的这种底部页签效果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/CustomDemo2.png)



`TabContent`的`tabBar`属性除了支持string类型，还支持使用`@Builder`装饰器修饰的函数。您可以使用@Builder装饰器，构造一个生成自定义`TabBar`样式的函数，实现上面的底部页签效果，示例代码如下：

```js{7-21,28,33,37-39}
@Entry
@Component
struct TabsExample {
  @State currentIndex: number = 0;
  private tabsController: TabsController = new TabsController();

  @Builder TabBuilder(title: string, targetIndex: number, selectedImg: Resource, normalImg: Resource) {
    Column() {
      Image(this.currentIndex === targetIndex ? selectedImg : normalImg)
        .size({ width: 25, height: 25 })
      Text(title)
        .fontColor(this.currentIndex === targetIndex ? '#1698CE' : '#6B6B6B')
    }
    .width('100%')
    .height(50)
    .justifyContent(FlexAlign.Center)
    .onClick(() => {
      this.currentIndex = targetIndex;
      this.tabsController.changeIndex(this.currentIndex);
    })
  }

  build() {
    Tabs({ barPosition: BarPosition.End, controller: this.tabsController }) {
      TabContent() {
        Column().width('100%').height('100%').backgroundColor('#00CB87')
      }
      .tabBar(this.TabBuilder('首页', 0, $r('app.media.home_selected'), $r('app.media.home_normal')))

      TabContent() {
        Column().width('100%').height('100%').backgroundColor('#007DFF')
      }
      .tabBar(this.TabBuilder('我的', 1, $r('app.media.mine_selected'), $r('app.media.mine_normal')))
    }
    .barWidth('100%')
    .barHeight(50)
    .onChange((index: number) => {
      this.currentIndex = index;
    })
  }
}
```

示例代码中将barPosition的值设置为BarPosition.End，使页签显示在底部。使用@Builder修饰`TabBuilder`函数，生成由Image和Text组成的页签。同时也给Tabs组件设置了`TabsController`控制器，当点击某个页签时，调用`changeIndex`方法进行页签内容切换。



最后还需要给Tabs添加onChange事件，Tab页签切换后触发该事件，这样当我们左右滑动内容视图的时候，页签样式也会跟着改变。



## 参考

- Tabs组件的更多属性和参数的使用，可以参考API：[Tabs](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-tabs-0000001478181433-V3?catalogVersion=V3)。
- @Builder装饰器的使用，可以参考：[@Builder](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V2/arkts-builder-0000001524176981-V2)。