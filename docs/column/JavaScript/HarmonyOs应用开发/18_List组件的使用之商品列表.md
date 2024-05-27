# List组件的使用之商品列表

我们使用Scroll组件、List组件以及LazyForEach组件实现一个商品列表的页面，并且拥有下拉刷新、懒加载和到底提示的效果。



## 相关概念

- [Scroll](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-scroll-0000001427902480-V3?catalogVersion=V3)：可滚动的容器组件，当子组件的布局尺寸超过父组件的视口时，内容可以滚动。
- [List](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-list-0000001477981213-V3?catalogVersion=V3)：列表包含一系列相同宽度的列表项。适合连续、多行呈现同类数据，例如图片和文本。
- [Tabs](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-tabs-0000001478181433-V3?catalogVersion=V3)：一种可以通过页签进行内容视图切换的容器组件，每个页签对应一个内容视图。
- [LazyForEach](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-rendering-control-lazyforeach-0000001524417213-V3?catalogVersion=V3)：开发框架提供数据懒加载（LazyForEach组件）从提供的数据源中按需迭代数据，并在每次迭代过程中创建相应的组件。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/List%E7%BB%84%E4%BB%B6%E4%B9%8B%E5%95%86%E5%93%81%E5%88%97%E8%A1%A8.gif)



## 代码结构解读

```js
├──entry/src/main/ets                      // 代码区
│  ├──common
│  │  └──CommonConstants.ets               // 常量集合文件
│  ├──entryability
│  │  └──EntryAbility.ts                   // 应用入口，承载应用的生命周期
│  ├──pages
│  │  └──ListIndex.ets                     // 页面入口
│  ├──view
│  │  ├──GoodsListComponent.ets            // 商品列表组件
│  │  ├──PutDownRefreshLayout.ets          // 下拉刷新组件
│  │  └──TabBarsComponent.ets              // Tabs组件
│  └──viewmodel
│     ├──InitialData.ets                   // 初始化数据
│     └──ListDataSource.ets                // List使用的相关数据加载
└──entry/src/main/resources                // 资源文件目录
```



## 页面布局

页面使用Navigation与Tabs做页面布局，使用Navigation的title属性实现页面的标题，Tabs做商品内容的分类。



页面分为`"精选"`、`"手机"`、`"服饰"`、`"穿搭"`、`"家居"`五个模块，由于本篇CodeLab的主要内容在“精选”部分，故将“精选”部分单独编写代码，其余模块使用ForEach遍历生成。



:::details `pages/ListIndex.ets`

```js
import TabBar from '../view/TabBarsComponent';
import { LAYOUT_WIDTH_OR_HEIGHT, STORE } from '../common/CommonConstants';

@Entry
@Component
struct ListIndex {
  build() {
    Row() {
      Navigation() {
        Column() {
          TabBar()
        }
        .width(LAYOUT_WIDTH_OR_HEIGHT)
        .justifyContent(FlexAlign.Center)
      }
      .size({ width: LAYOUT_WIDTH_OR_HEIGHT, height: LAYOUT_WIDTH_OR_HEIGHT })
      .title(STORE)
      .titleMode(NavigationTitleMode.Mini)
    }
    .height(LAYOUT_WIDTH_OR_HEIGHT)
    .backgroundColor($r('app.color.primaryBgColor'))
  }
}
```

:::





## 商品列表的懒加载

使用Scroll嵌套List做长列表，实现Scroll与List的联动。



商品列表往往数据量很多，如果使用ForEach一次性遍历生成的话，性能不好，所以这里使用LazyForEach进行数据的懒加载。



当向下滑动时，需要加载新的数据的时候，再将新的数据加载出来，生成新的列表。通过onTouch事件来触发懒加载行为，当商品列表向下滑动，加载新的数据。



:::details `page/TabBarsComponent.ets`

```js{88-90}
import { initTabBarData } from '../viewmodel/InitialData';
import {
  LAYOUT_WIDTH_OR_HEIGHT,
  NORMAL_FONT_SIZE,
  BIGGER_FONT_SIZE,
  MAX_FONT_SIZE,
  MAX_OFFSET_Y,
  REFRESH_TIME
} from '../common/CommonConstants';
import GoodsList from './GoodsListComponent';
import PutDownRefresh from './PutDownRefreshLayout';
@Component
export default struct TabBar {
  private currentOffsetY: number = 0;
  private timer: number = 0;
  @State tabsIndex: number = 0;
  @State refreshStatus: boolean = false;
  @State refreshText: Resource = $r('app.string.refresh_text');

  @Builder
  firstTabBar() {
    Column() {
      Text($r('app.string.selected'))
        .fontSize(this.tabsIndex === 0 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE)
        .fontColor(this.tabsIndex === 0 ? Color.Black : $r('app.color.gray'))
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .height(LAYOUT_WIDTH_OR_HEIGHT)
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  otherTabBar(content: Resource, index: number) {
    Column() {
      Text(content)
        .fontSize(this.tabsIndex === index + 1 ? BIGGER_FONT_SIZE : NORMAL_FONT_SIZE)
        .fontColor(this.tabsIndex === index + 1 ? Color.Black : $r('app.color.gray'))
    }
    .width(LAYOUT_WIDTH_OR_HEIGHT)
    .height(LAYOUT_WIDTH_OR_HEIGHT)
    .justifyContent(FlexAlign.Center)
  }

  putDownRefresh(event?: TouchEvent): void {
    if (event === undefined) {
      return;
    }
    switch (event.type) {
      case TouchType.Down:
        this.currentOffsetY = event.touches[0].y;
        break;
      case TouchType.Move:
        this.refreshStatus = event.touches[0].y - this.currentOffsetY > MAX_OFFSET_Y;
        break;
      case TouchType.Cancel:
        break;
      case TouchType.Up:

      // Only simulation effect, no data request
        this.timer = setTimeout(() => {
          this.refreshStatus = false;
        }, REFRESH_TIME);
        break;
    }
  }

  aboutToDisappear() {
    clearTimeout(this.timer);
  }

  build() {
    Tabs() {
      TabContent() {
        Scroll() {
          Column() {
            if (this.refreshStatus) {
              PutDownRefresh({ refreshText: $refreshText })
            }
            GoodsList()
            Text($r('app.string.to_bottom')).fontSize(NORMAL_FONT_SIZE).fontColor($r('app.color.gray'))
          }
          .width(LAYOUT_WIDTH_OR_HEIGHT)
        }
        .scrollBar(BarState.Off)
        .edgeEffect(EdgeEffect.Spring)
        .width(LAYOUT_WIDTH_OR_HEIGHT)
        .height(LAYOUT_WIDTH_OR_HEIGHT)
        .onTouch((event?: TouchEvent) => {
          this.putDownRefresh(event);
        })
      }
      .tabBar(this.firstTabBar)

      ForEach(initTabBarData, (item: Resource, index?: number) => {
        TabContent() {
          Column() {
            Text(item).fontSize(MAX_FONT_SIZE)
          }
          .justifyContent(FlexAlign.Center)
          .width(LAYOUT_WIDTH_OR_HEIGHT)
          .height(LAYOUT_WIDTH_OR_HEIGHT)
        }
        .tabBar(this.otherTabBar(item, index !== undefined ? index : 0))
      })
    }
    .onChange((index: number) => {
      this.tabsIndex = index;
    })
    .vertical(false)
  }
}
```

:::





:::details `view/GoodsListComponent.ets`

```js{14,52-69}
import * as commonConst from '../common/CommonConstants';
import { GoodsListItemType } from '../viewmodel/InitialData';
import { ListDataSource } from '../viewmodel/ListDataSource';

@Component
export default struct GoodsList {
  @Provide goodsListData: ListDataSource = new ListDataSource();
  private startTouchOffsetY: number = 0;
  private endTouchOffsetY: number = 0;

  build() {
    Row() {
      List({ space: commonConst.LIST_ITEM_SPACE }) {
        LazyForEach(this.goodsListData, (item: GoodsListItemType) => {
          ListItem() {
            Row() {
              Column() {
                Image(item?.goodsImg)
                  .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
                  .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
              }
              .width(commonConst.GOODS_IMAGE_WIDTH)
              .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)

              Column() {
                Text(item?.goodsName)
                  .fontSize(commonConst.NORMAL_FONT_SIZE)
                  .margin({ bottom: commonConst.BIGGER_FONT_SIZE })

                Text(item?.advertisingLanguage)
                  .fontColor($r('app.color.gray'))
                  .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
                  .margin({ right: commonConst.MARGIN_RIGHT, bottom: commonConst.BIGGER_FONT_SIZE })

                Row() {
                  Text(item?.evaluate)
                    .fontSize(commonConst.GOODS_EVALUATE_FONT_SIZE)
                    .fontColor($r('app.color.deepGray'))
                  Text(item?.price).fontSize(commonConst.NORMAL_FONT_SIZE).fontColor($r('app.color.freshRed'))
                }
                .justifyContent(FlexAlign.SpaceAround)
                .width(commonConst.GOODS_LIST_WIDTH)
              }
              .padding(commonConst.GOODS_LIST_PADDING)
              .width(commonConst.GOODS_FONT_WIDTH)
              .height(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
            }
            .justifyContent(FlexAlign.SpaceBetween)
            .height(commonConst.GOODS_LIST_HEIGHT)
            .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
          }
          .onTouch((event?: TouchEvent) => {
            if (event === undefined) {
              return;
            }
            switch (event.type) {
              case TouchType.Down:
                this.startTouchOffsetY = event.touches[0].y;
                break;
              case TouchType.Up:
                this.startTouchOffsetY = event.touches[0].y;
                break;
              case TouchType.Move:
                if (this.startTouchOffsetY - this.endTouchOffsetY > 0) {
                  this.goodsListData.pushData();
                }
                break;
            }
          })
        })
      }
      .width(commonConst.GOODS_LIST_WIDTH)
    }
    .justifyContent(FlexAlign.Center)
    .width(commonConst.LAYOUT_WIDTH_OR_HEIGHT)
  }
}
```

:::

## 下拉刷新与到底提示

下拉刷新同样使用TouchEvent做下拉的判断，当下拉的偏移量超出将要刷新的偏移量时，就展示下拉刷新的布局，同时使用条件渲染判断是否显示下拉刷新布局，具体实现效果：





列表到底提示“已经到底了”并回弹的效果使用了Scroll的edgeEffect来控制回弹，具体实现效果：





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%B0%E5%BA%95%E6%8F%90%E7%A4%BA.png)

:::details `view/PutDownRefreshLayout.ets`

```js
import * as commonConst from '../common/CommonConstants';

@Component
export default struct PutDownRefresh {
  @Link refreshText: Resource;

  build() {
    Row() {
      Image($r('app.media.refreshing'))
        .width(commonConst.ICON_WIDTH)
        .height(commonConst.ICON_HEIGHT)
      Text(this.refreshText).fontSize(commonConst.NORMAL_FONT_SIZE)
    }
    .justifyContent(FlexAlign.Center)
    .width(commonConst.GOODS_LIST_WIDTH)
    .height(commonConst.GOODS_LIST_HEIGHT)
  }
}
```

:::