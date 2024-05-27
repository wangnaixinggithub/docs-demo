# 案例：ArkTS基础知识

## 介绍

> 本课程使用声明式语法和组件化基础知识，搭建一个可刷新的排行榜页面。在排行榜页面中，使用循环渲染控制语法来实现列表数据渲染，使用`@Builder`创建排行列表布局内容，使用装饰器`@State`、`@Prop`、`@Link`来管理组件状态。
>
> 最后我们点击系统返回按键，来学习自定义组件生命周期函数。完成效果如图所示：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%B0%B4%E6%9E%9C%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%95%88%E6%9E%9C%E5%9B%BE.gif)



## 相关概念



1.渲染控制语法：

- [条件渲染](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-rendering-control-ifelse-0000001524177637-V3)：使用`if/else`进行条件渲染。
- [循环渲染](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-rendering-control-foreach-0000001524537153-V3)：开发框架提供循环渲染（`ForEach`组件）来迭代数组，并为每个数组项创建相应的组件。



2.组件状态管理装饰器和`@Builde`r装饰器：



组件状态管理装饰器用来管理组件中的状态，它们分别是：`@State`、`@Prop`、`@Link`。

- [@State](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-state-0000001474017162-V3)装饰的变量是组件内部的状态数据，当这些状态数据被修改时，将会调用所在组件的build方法进行UI刷新。
- [@Prop](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-prop-0000001473537702-V3)与@State有相同的语义，但初始化方式不同。@Prop装饰的变量必须使用其父组件提供的@State变量进行初始化，允许组件内部修改@Prop变量，但更改不会通知给父组件，即@Prop属于单向数据绑定。
- [@Link](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-link-0000001524297305-V3)装饰的变量可以和父组件的@State变量建立双向数据绑定，需要注意的是：@Link变量不能在组件内部进行初始化。
- [@Builder](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-builder-0000001524176981-V3)装饰的方法用于定义组件的声明式UI描述，在一个自定义组件内快速生成多个布局内容。



@State、@Prop、@Link三者关系如图所示：





3.组件生命周期函数：



[自定义组件的生命周期函数](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/arkts-custom-component-lifecycle-0000001482395076-V3)用于通知用户该自定义组件的生命周期，这些回调函数是私有的，在运行时由开发框架在特定的时间进行调用，不能从应用程序中手动调用这些回调函数。 右图是自定义组件生命周期的简化图示：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240127224849823-17063669309832.png)





> 需要注意的是，部分生命周期回调函数仅对@Entry修饰的自定义组件生效，它们分别是：`onPageShow`、`onPageHide`、`onBackPress`。



## 代码结构解读

> 本篇`Codelab`只对核心代码进行讲解，对于完整代码，我们会在源码下载或`gitee`中提供。

```c
├──entry/src/main/ets               // 代码区    
│  ├──common                        // 公共文件目录
│  │  └──constants                  
│  │     └──Constants.ets           // 常量
│  ├──entryability
│  │  └──EntryAbility.ts            // 应用的入口
│  ├──model                         
│  │  └──DataModel.ets              // 模拟数据
│  ├──pages
│  │  └──RankPage.ets               // 入口页面
│  ├──view                          // 自定义组件目录
│  │  ├──ListHeaderComponent.ets
│  │  ├──ListItemComponent.ets
│  │  └──TitleComponent.ets
│  └──viewmodel        
│     ├──RankData.ets               // 实体类
│     └──RankViewModel.ets          // 视图业务逻辑类
└──entry/src/main/resources	    // 资源文件目录
```

## 使用@Link封装标题组件TitleComponent

在`TitleComponent`文件中，首先使用struct对象创建自定义组件，然后使用`@Link`修饰器管理`TitleComponent`组件内的状态变量`isRefreshData`，状态变量`isRefreshData`值发生改变后，通过`@Link`装饰器通知页面刷新List中的数据。



:::details `TitleComponent.ets`

```js{5,29-31}
import AppContext from '@ohos.app.ability.common';
import { FontSize, TitleBarStyle, WEIGHT } from '../common/constants/Constants';
@Component
export struct TitleComponent {
  @Link isRefreshData: boolean;
  @State title: Resource = $r('app.string.title_default');
  build() {
    Row() {
      Row() {
        Image($r('app.media.ic_public_back'))
          .height(TitleBarStyle.IMAGE_BACK_SIZE)
          .width(TitleBarStyle.IMAGE_BACK_SIZE)
          .margin({ right: TitleBarStyle.IMAGE_BACK_MARGIN_RIGHT })
          .onClick(() => {
            let handler = getContext(this) as AppContext.UIAbilityContext;
            handler.terminateSelf();
          })
        Text(this.title)
          .fontSize(FontSize.LARGE)
      }
      .width(TitleBarStyle.WEIGHT)
      .height(WEIGHT)
      .justifyContent(FlexAlign.Start)

      Row() {
        Image($r('app.media.loading'))
          .height(TitleBarStyle.IMAGE_LOADING_SIZE)
          .width(TitleBarStyle.IMAGE_LOADING_SIZE)
          .onClick(() => {
            this.isRefreshData = !this.isRefreshData;
          })
      }
      .width(TitleBarStyle.WEIGHT)
      .height(WEIGHT)
      .justifyContent(FlexAlign.End)
    }
    .width(WEIGHT)
    .padding({ left: TitleBarStyle.BAR_MARGIN_HORIZONTAL,
      right: TitleBarStyle.BAR_MARGIN_HORIZONTAL })
    .margin({ top: TitleBarStyle.BAR_MARGIN_TOP })
    .height(TitleBarStyle.BAR_HEIGHT)
    .justifyContent(FlexAlign.SpaceAround)
  }
}
```

:::



:::details ` RankPage.ets`

```js{5,16,47,71}
import prompt from '@ohos.promptAction';
import { RankViewModel } from '../viewmodel/RankViewModel';
import { RankData } from '../viewmodel/RankData';
import { ListHeaderComponent } from '../view/ListHeaderComponent';
import { TitleComponent } from '../view/TitleComponent';
import { ListItemComponent } from '../view/ListItemComponent';
import { APP_EXIT_INTERVAL, Style, TIME, TITLE, WEIGHT } from '../common/constants/Constants';
let rankModel: RankViewModel = new RankViewModel();

@Entry
@Component
struct RankPage {

  @State dataSource1: RankData[] = [];
  @State dataSource2: RankData[] = [];
  @State isSwitchDataSource: boolean = true;
  private clickBackTimeRecord: number = 0;  //记录用户点击返回时的时间戳


  aboutToAppear() {
    //页面组件初始化时激活该生命周期函数，完成调接口的工作 以获取到数据
    this.dataSource1 = rankModel.loadRankDataSource1();
    this.dataSource2 = rankModel.loadRankDataSource2();
  }

  onBackPress() {
    if (this.isShowToast()) {
      prompt.showToast(
        {
        message: $r('app.string.prompt_text'),
        duration: TIME
      });
      this.clickBackTimeRecord = new Date().getTime();
      return true;
    }
    return false;
  }

  //针对用户点击了退出操作，计时等待，如果时间超过程序阈值，继续弹出toast.
  isShowToast(): boolean {
    return new Date().getTime() - this.clickBackTimeRecord > APP_EXIT_INTERVAL;
  }

  build() {
    Column()
    {
      TitleComponent({ isRefreshData: $isSwitchDataSource, title: TITLE })
      ListHeaderComponent({
        paddingValue: {
          left: Style.RANK_PADDING,
          right: Style.RANK_PADDING
        },
        widthValue: Style.CONTENT_WIDTH
      })
        .margin({
          top: Style.HEADER_MARGIN_TOP,
          bottom: Style.HEADER_MARGIN_BOTTOM
        })
      this.RankList(Style.CONTENT_WIDTH)
    }
    .backgroundColor($r('app.color.background'))
    .height(WEIGHT)
    .width(WEIGHT)
  }



  @Builder RankList(widthValue: Length) {
    Column() {
      List() {
        ForEach(this.isSwitchDataSource ? this.dataSource1 : this.dataSource2,
          (item: RankData, index?: number) => {
            ListItem() {
              ListItemComponent(
                {
                  index: (Number(index) + 1),
                   name: item.name,
                   vote: item.vote,
                  isSwitchDataSource: this.isSwitchDataSource
              })
            }
          },
          (item: RankData) => JSON.stringify(item))
      }
      .width(WEIGHT)
      .height(Style.LIST_HEIGHT)
      .divider({ strokeWidth: Style.STROKE_WIDTH })
    }
    .padding({
      left: Style.RANK_PADDING,
      right: Style.RANK_PADDING
    })
    .borderRadius(Style.BORDER_RADIUS)
    .width(widthValue)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(Color.White)
  }
}
```

:::





## 封装列表头部组件ListHeaderComponent

在`ListHeaderComponent`文件中，我们使用常规成员变量来设置自定义组件`ListHeaderComponent`的`widthValue`和`paddingValue`。



:::details `ListHeaderComponent.ets`

```tsx{4,5}
import { FontSize, ListHeaderStyle } from '../common/constants/Constants';
@Component
export struct ListHeaderComponent {
  paddingValue: Padding | Length = 0; /*左右间隔量*/
  widthValue: Length = 0; /*表头宽度*/

  build() {
    Row() {
      Text($r('app.string.page_number'))
        .fontSize(FontSize.SMALL)
        .width(ListHeaderStyle.LAYOUT_WEIGHT_LEFT)
        .fontWeight(ListHeaderStyle.FONT_WEIGHT)
        .fontColor($r('app.color.font_description'))
      Text($r('app.string.page_type'))
        .fontSize(FontSize.SMALL)
        .width(ListHeaderStyle.LAYOUT_WEIGHT_CENTER)
        .fontWeight(ListHeaderStyle.FONT_WEIGHT)
        .fontColor($r('app.color.font_description'))
      Text($r('app.string.page_vote'))
        .fontSize(FontSize.SMALL)
        .width(ListHeaderStyle.LAYOUT_WEIGHT_RIGHT)
        .fontWeight(ListHeaderStyle.FONT_WEIGHT)
        .fontColor($r('app.color.font_description'))
    }
    .width(this.widthValue)
    .padding(this.paddingValue)
  }
}
```

:::



:::details `RankPage.ets`

```js{4,48-54}
import prompt from '@ohos.promptAction';
import { RankViewModel } from '../viewmodel/RankViewModel';
import { RankData } from '../viewmodel/RankData';
import { ListHeaderComponent } from '../view/ListHeaderComponent';
import { TitleComponent } from '../view/TitleComponent';
import { ListItemComponent } from '../view/ListItemComponent';
import { APP_EXIT_INTERVAL, Style, TIME, TITLE, WEIGHT } from '../common/constants/Constants';
let rankModel: RankViewModel = new RankViewModel();

@Entry
@Component
struct RankPage {

  @State dataSource1: RankData[] = [];
  @State dataSource2: RankData[] = [];
  @State isSwitchDataSource: boolean = true;
  private clickBackTimeRecord: number = 0;  //记录用户点击返回时的时间戳


  aboutToAppear() {
    //页面组件初始化时激活该生命周期函数，完成调接口的工作 以获取到数据
    this.dataSource1 = rankModel.loadRankDataSource1();
    this.dataSource2 = rankModel.loadRankDataSource2();
  }

  onBackPress() {
    if (this.isShowToast()) {
      prompt.showToast(
        {
        message: $r('app.string.prompt_text'),
        duration: TIME
      });
      this.clickBackTimeRecord = new Date().getTime();
      return true;
    }
    return false;
  }

  //针对用户点击了退出操作，计时等待，如果时间超过程序阈值，继续弹出toast.
  isShowToast(): boolean {
    return new Date().getTime() - this.clickBackTimeRecord > APP_EXIT_INTERVAL;
  }

  build() {
    Column()
    {
      TitleComponent({ isRefreshData: $isSwitchDataSource, title: TITLE })
      ListHeaderComponent({
        paddingValue: {
          left: Style.RANK_PADDING,
          right: Style.RANK_PADDING
        },
        widthValue: Style.CONTENT_WIDTH
      })
        .margin({
          top: Style.HEADER_MARGIN_TOP,
          bottom: Style.HEADER_MARGIN_BOTTOM
        })
      this.RankList(Style.CONTENT_WIDTH)
    }
    .backgroundColor($r('app.color.background'))
    .height(WEIGHT)
    .width(WEIGHT)
  }



  @Builder RankList(widthValue: Length) {
    Column() {
      List() {
        ForEach(this.isSwitchDataSource ? this.dataSource1 : this.dataSource2,
          (item: RankData, index?: number) => {
            ListItem() {
              ListItemComponent(
                {
                  index: (Number(index) + 1),
                   name: item.name,
                   vote: item.vote,
                  isSwitchDataSource: this.isSwitchDataSource
              })
            }
          },
          (item: RankData) => JSON.stringify(item))
      }
      .width(WEIGHT)
      .height(Style.LIST_HEIGHT)
      .divider({ strokeWidth: Style.STROKE_WIDTH })
    }
    .padding({
      left: Style.RANK_PADDING,
      right: Style.RANK_PADDING
    })
    .borderRadius(Style.BORDER_RADIUS)
    .width(widthValue)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(Color.White)
  }
}
```

:::

## 封装列表项组件ListItemComponent



在代码中，我们使用@State管理`ListItemComponent`中的 `isChange` 状态，当用户点击`ListItemComponent`时，`ListItemComponent`组件中的文本颜色发生变化。

最后我们使用条件渲染控制语句，来依据我们给定的条件渲染创建出来圆型文本组件。



:::details `ListItemComponent.ets`

```js{7,11-22,40-42,31,36}
import { FontSize, FontWeight, ItemStyle, WEIGHT } from '../common/constants/Constants';
@Component
export struct ListItemComponent {
  private  index?: number;
  private name?: Resource;
  private vote: string ;
  @State isChange: boolean = false;
  build() {
    Row() {
      Column() {
        if (this.isRenderCircleText()) {
          if (this.index !== undefined) {
            this.CircleText(this.index);
          }
        } else {
          Text(this.index?.toString())
            .lineHeight(ItemStyle.TEXT_LAYOUT_SIZE)
            .textAlign(TextAlign.Center)
            .width(ItemStyle.TEXT_LAYOUT_SIZE)
            .fontWeight(FontWeight.BOLD)
            .fontSize(FontSize.SMALL)
        }
      }
      .width(ItemStyle.LAYOUT_WEIGHT_LEFT)
      .alignItems(HorizontalAlign.Start)

      Text(this.name)
        .width(ItemStyle.LAYOUT_WEIGHT_CENTER)
        .fontWeight(FontWeight.BOLDER)
        .fontSize(FontSize.MIDDLE)
        .fontColor(this.isChange ? ItemStyle.COLOR_BLUE : ItemStyle.COLOR_BLACK)
      Text(this.vote)
        .width(ItemStyle.LAYOUT_WEIGHT_RIGHT)
        .fontWeight(FontWeight.BOLD)
        .fontSize(FontSize.SMALL)
        .fontColor(this.isChange ? ItemStyle.COLOR_BLUE : ItemStyle.COLOR_BLACK)
    }
    .height(ItemStyle.BAR_HEIGHT)
    .width(WEIGHT)
    .onClick(() => {
      this.isChange = !this.isChange;
    })
  }

  @Builder CircleText(index: number) {
    Row() {
      Text(this.index?.toString())
        .fontWeight(FontWeight.BOLD)
        .fontSize(FontSize.SMALL)
        .fontColor(Color.White);
    }
    .justifyContent(FlexAlign.Center)
    .borderRadius(ItemStyle.CIRCLE_TEXT_BORDER_RADIUS)
    .size({ width: ItemStyle.CIRCLE_TEXT_SIZE,
      height: ItemStyle.CIRCLE_TEXT_SIZE })
    .backgroundColor($r('app.color.circle_text_background'))
  }

  isRenderCircleText(): boolean {
    return this.index === 1 || this.index === 2 || this.index === 3;
  }
}
```

:::



## 创建RankList

为了简化代码，提高代码的可读性，我们使用`@Builder`描述排行列表布局内容，使用循环渲染组件`ForEach`创建`ListItem`。



:::details  `RankPage.ets`

```js{68-81}
import prompt from '@ohos.promptAction';
import { RankViewModel } from '../viewmodel/RankViewModel';
import { RankData } from '../viewmodel/RankData';
import { ListHeaderComponent } from '../view/ListHeaderComponent';
import { TitleComponent } from '../view/TitleComponent';
import { ListItemComponent } from '../view/ListItemComponent';
import { APP_EXIT_INTERVAL, Style, TIME, TITLE, WEIGHT } from '../common/constants/Constants';
let rankModel: RankViewModel = new RankViewModel();

@Entry
@Component
struct RankPage {

  @State dataSource1: RankData[] = [];
  @State dataSource2: RankData[] = [];
  @State isSwitchDataSource: boolean = true;
  private clickBackTimeRecord: number = 0;  //记录用户点击返回时的时间戳


  aboutToAppear() {
    //页面组件初始化时激活该生命周期函数，完成调接口的工作 以获取到数据
    this.dataSource1 = rankModel.loadRankDataSource1();
    this.dataSource2 = rankModel.loadRankDataSource2();
  }

  onBackPress() {
    if (this.isShowToast()) {
      prompt.showToast(
        {
        message: $r('app.string.prompt_text'),
        duration: TIME
      });
      this.clickBackTimeRecord = new Date().getTime();
      return true;
    }
    return false;
  }

  //针对用户点击了退出操作，计时等待，如果时间超过程序阈值，继续弹出toast.
  isShowToast(): boolean {
    return new Date().getTime() - this.clickBackTimeRecord > APP_EXIT_INTERVAL;
  }

  build() {
    Column()
    {
      TitleComponent({ isRefreshData: $isSwitchDataSource, title: TITLE })
      ListHeaderComponent({
        paddingValue: {
          left: Style.RANK_PADDING,
          right: Style.RANK_PADDING
        },
        widthValue: Style.CONTENT_WIDTH
      })
        .margin({
          top: Style.HEADER_MARGIN_TOP,
          bottom: Style.HEADER_MARGIN_BOTTOM
        })
      this.RankList(Style.CONTENT_WIDTH)
    }
    .backgroundColor($r('app.color.background'))
    .height(WEIGHT)
    .width(WEIGHT)
  }

  @Builder RankList(widthValue: Length) {
    Column() {
      List() {
        ForEach(this.isSwitchDataSource ? this.dataSource1 : this.dataSource2,
          (item: RankData, index?: number) => {
            ListItem() {
              ListItemComponent(
                {
                  index: (Number(index) + 1),
                   name: item.name,
                   vote: item.vote,
              })
            }
          },
          (item: RankData) => JSON.stringify(item))
      }
      .width(WEIGHT)
      .height(Style.LIST_HEIGHT)
      .divider({ strokeWidth: Style.STROKE_WIDTH })
    }
    .padding({
      left: Style.RANK_PADDING,
      right: Style.RANK_PADDING
    })
    .borderRadius(Style.BORDER_RADIUS)
    .width(widthValue)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(Color.White)
  }
}
```

:::

## 使用自定义组件生命周期函数

我们通过点击系统导航返回按钮来演示`onBackPress`回调方法的使用，在指定的时间段内，如果满足退出条件，`onBackPress`将返回false，系统默认关闭当前页面。否则，提示用户需要再点击一次才能退出，同时`onBackPress`返回true，表示用户自己处理导航返回事件。



:::details `RankPage.ets`

```js{26-37}
import prompt from '@ohos.promptAction';
import { RankViewModel } from '../viewmodel/RankViewModel';
import { RankData } from '../viewmodel/RankData';
import { ListHeaderComponent } from '../view/ListHeaderComponent';
import { TitleComponent } from '../view/TitleComponent';
import { ListItemComponent } from '../view/ListItemComponent';
import { APP_EXIT_INTERVAL, Style, TIME, TITLE, WEIGHT } from '../common/constants/Constants';
let rankModel: RankViewModel = new RankViewModel();

@Entry
@Component
struct RankPage {

  @State dataSource1: RankData[] = [];
  @State dataSource2: RankData[] = [];
  @State isSwitchDataSource: boolean = true;
  private clickBackTimeRecord: number = 0;  //记录用户点击返回时的时间戳


  aboutToAppear() {
    //页面组件初始化时激活该生命周期函数，完成调接口的工作 以获取到数据
    this.dataSource1 = rankModel.loadRankDataSource1();
    this.dataSource2 = rankModel.loadRankDataSource2();
  }

  onBackPress() {
    if (this.isShowToast()) {
      prompt.showToast(
        {
        message: $r('app.string.prompt_text'),
        duration: TIME
      });
      this.clickBackTimeRecord = new Date().getTime();
      return true;
    }
    return false;
  }

  //针对用户点击了退出操作，计时等待，如果时间超过程序阈值，继续弹出toast.
  isShowToast(): boolean {
    return new Date().getTime() - this.clickBackTimeRecord > APP_EXIT_INTERVAL;
  }

  build() {
    Column()
    {
      TitleComponent({ isRefreshData: $isSwitchDataSource, title: TITLE })
      ListHeaderComponent({
        paddingValue: {
          left: Style.RANK_PADDING,
          right: Style.RANK_PADDING
        },
        widthValue: Style.CONTENT_WIDTH
      })
        .margin({
          top: Style.HEADER_MARGIN_TOP,
          bottom: Style.HEADER_MARGIN_BOTTOM
        })
      this.RankList(Style.CONTENT_WIDTH)
    }
    .backgroundColor($r('app.color.background'))
    .height(WEIGHT)
    .width(WEIGHT)
  }



  @Builder RankList(widthValue: Length) {
    Column() {
      List() {
        ForEach(this.isSwitchDataSource ? this.dataSource1 : this.dataSource2,
          (item: RankData, index?: number) => {
            ListItem() {
              ListItemComponent(
                {
                  index: (Number(index) + 1),
                   name: item.name,
                   vote: item.vote,
              })
            }
          },
          (item: RankData) => JSON.stringify(item))
      }
      .width(WEIGHT)
      .height(Style.LIST_HEIGHT)
      .divider({ strokeWidth: Style.STROKE_WIDTH })
    }
    .padding({
      left: Style.RANK_PADDING,
      right: Style.RANK_PADDING
    })
    .borderRadius(Style.BORDER_RADIUS)
    .width(widthValue)
    .alignItems(HorizontalAlign.Center)
    .backgroundColor(Color.White)
  }
}
```

:::

