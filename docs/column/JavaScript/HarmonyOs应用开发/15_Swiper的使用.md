# Swiper的使用

## 相关概念

- [Swiper](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-swiper-0000001427744844-V3?catalogVersion=V3)：滑动容器，提供子组件切换滑动的能力。
- [Stack](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-stack-0000001427584888-V3?catalogVersion=V3)：堆叠容器，子组件按照顺序依次入栈，后一个子组件覆盖前一个子组件。
- [Video](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-media-components-video-0000001427902484-V3?catalogVersion=V3)：用于播放视频文件并控制其播放状态的组件。
- [Observed和ObjectLink装饰器](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/arkts-observed-and-objectlink-0000001473697338-V3?catalogVersion=V3)：用于在涉及嵌套对象或数组的场景中进行双向数据同步。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/Swiper%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8.gif)

## 代码结构解读

```js
├──entry/src/main/ets                 // 代码区
│  ├──common                                                  
│  │  └──constants                    
│  │     ├──CommonConstant.ets        // 公共常量 
│  │     ├──PictureConstants.ets      // 图片所使用的常量
│  │     ├──TopBarConstants.ets       // TopBar使用的常量
│  │     └──VideoConstants.ets        // Video使用的常量                       
│  ├──entryability                      
│  │  └──EntryAbility.ts              // 程序入口类                          
│  ├──pages                            
│  │  ├──PageVideo.ets                // 视频播放页
│  │  └──SwiperIndex.ets              // 应用首页                          
│  ├──view                             
│  │  ├──all                          
│  │  │  └──PictureSort.ets           // “全部”tab页图片类别组件                           
│  │  ├──common                        
│  │  │  ├──Banner.ets                // 轮播图组件
│  │  │  ├──PictureView.ets           // 图片组件
│  │  │  └──TopBar.ets                // 顶部导航组件                           
│  │  ├──movie                         
│  │  │  └──MovieSort.ets             // “电影”tab页图片类别组件                        
│  │  ├──play                         // 视频播放组件目录 
│  │  │  ├──CommentView.ets           // 评论模块组件
│  │  │  ├──DescriptionView.ets       // 视频描述信息组件
│  │  │  ├──NavigationView.ets        // 顶部返回导航组件
│  │  │  └──PlayView.ets              // 视频滑动播放组件                         
│  │  └──tabcontent                   // tab内容组件 
│  │     ├──PageAll.ets               // 全部tab页
│  │     ├──PageEntertainment.ets     // 娱乐tab页
│  │     ├──PageGame.ets              // 游戏tab页
│  │     ├──PageLive.ets              // 直播tab页
│  │     ├──PageMovie.ets             // 电影tab页
│  │     └──PageTV.ets                // 电视tab页                        
│  └──viewmodel                        
│     ├──PictureItem.ets              // 图片实体 
│     ├──PictureViewModel.ets         // 图片模型
│     ├──TopBarItem.ets               // 顶部导航实体
│     ├──TopBarViewModel.ets          // 顶部导航模型    
│     ├──VideoItem.ets                // 视频实体 
│     └──VideoViewModel.ets           // 视频模型
└──entry/src/main/resources           // 应用资源目录
```

## 顶部导航场景



应用首页使用Swiper组件实现了顶部导航的应用场景。用户点击不同的分类标题，会切换展示不同的界面内容。同时也支持用户左右滑动界面，对应导航标题联动变化的效果。界面效果图如图：



实现这种效果，我们只需将界面划分为两部分：导航栏与内容区。导航栏使用自定义组件`TopBar`实现，内容区使用`Swiper`组件实现。





`@State`和`@Link`装饰符配合使用，实现`TopBar`组件标题与`Swiper`组件索引的双向绑定。内容区内容滑动时，会触发Swiper的`onChange`事件，并改变索引`index`的值。前面已经通过特定修饰符实现了索引的双向绑定。因此该索引值的变化会使`TopBar`的索引值同步变化，实现`TopBar`和`Swiper`的联动效果。



点击导航栏中的不同标题时，会触发TopBar中的onClick事件，并改变对应的索引值。同理，该索引的变化会使Swiper的索引值同步变化，实现Swiper和TopBar的联动效果。







最终实现导航栏与内容区的双向联动效果。





:::details  `common/TopBar.ets`

```js{10}
import { TopBarItem } from '../../viewmodel/TopBarItem';
import { initializeOnStartup } from '../../viewmodel/TopBarViewModel';
import { CommonConstants } from '../../common/constants/CommonConstant';
/**
 * TopBar component.
 */
@Component
export struct TopBar {
  // Double binding of index values to achieve linkage effect.
  @Link index: number;
  private tabArray: Array<TopBarItem> = initializeOnStartup();

  build() {
    Row({ space: CommonConstants.SPACE_TOP_BAR }) {
      ForEach(this.tabArray,
        (item: TopBarItem) => {
          Text(item.name)
            .fontSize(this.index === item.id ? CommonConstants.FONT_SIZE_CHECKED : CommonConstants.FONT_SIZE_UNCHECKED)
            .fontColor(Color.Black)
            .textAlign(TextAlign.Center)
            .fontWeight(this.index === item.id ? FontWeight.Bold : FontWeight.Regular)
            .onClick(() => {
              this.index = item.id;
            })
        }, (item: TopBarItem) => JSON.stringify(item))
    }
    .margin({ left: CommonConstants.ADS_LEFT })
    .width(CommonConstants.FULL_WIDTH)
    .height(CommonConstants.TOP_BAR_HEIGHT)
  }
}
```

:::



:::details  `数据`



`/viewmodel/TopBarViewModel.ets`

```js
import { TopBarItem } from './TopBarItem';
import { TOP_BAR_DATA } from '../common/constants/TopBarConstants';
/**
 * Init topBar data.
 */
export function initializeOnStartup(): Array<TopBarItem> {
  let tabDataArray: Array<TopBarItem> = []
  TOP_BAR_DATA.forEach((item: TopBarItem) => {
    tabDataArray.push(new TopBarItem(item.id, item.name));
  })
  return tabDataArray;
}
```

`/viewmodel/TopBarItem.ets`

```js
/**
 * TopBar entity class.
 */
export class TopBarItem {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
```

 `constants/TopBarConstants.ets`

```js
import { TopBarItem } from '../../viewmodel/TopBarItem';

/**
 * Data of top bar.
 */
export const TOP_BAR_DATA: TopBarItem[] = [
  new TopBarItem(0, '全部'),
  new TopBarItem(1, '电影'),
  new TopBarItem(2, '电视剧'),
  new TopBarItem(3, '综艺'),
  new TopBarItem(4, '直播'),
  new TopBarItem(5, '游戏')
]
```

:::



:::details  `pages/SwiperIndex.ets`

```js{33-35,20}
import { TopBar } from '../view/common/TopBar';
import { PageAll } from '../view/tabcontent/PageAll';
import { CommonConstants } from '../common/constants/CommonConstant';
import { PageLive } from '../view/tabcontent/PageLive';
import { PageGame } from '../view/tabcontent/PageGame';
import { PageEntertainment } from '../view/tabcontent/PageEntertainment';
import { PageTV } from '../view/tabcontent/PageTV';
import { PageMovie } from '../view/tabcontent/PageMovie';
/**
 * Application home page.
 */
@Entry
@Component
struct SwiperIndex {
  // Double binding of index values to achieve linkage effect.
  @State index: number = 0;

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Start }) {
      TopBar({ index: $index })
      Swiper() {
        PageAll()
        PageMovie()
        PageTV()
        PageEntertainment()
        PageLive()
        PageGame()
      }
      .index(this.index)
      .indicator(false)
      .loop(false)
      .duration(CommonConstants.DURATION_PAGE)
      .onChange((index: number) => {
        this.index = index;
      })
    }
    .backgroundColor($r('app.color.start_window_background'))
  }
}
```

:::

## 轮播图场景



轮播图常见于各种应用首页，用于各类信息、资讯的轮流展示。本应用使用Swiper组件，同样实现了这一能力。`"全部"`页签的`"电影精选"`部分，既为一个电影内容的轮播模块。它可以切换展示不同电影内容。界面效果图如图：





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/Swiper%E8%BD%AE%E6%92%AD%E5%9B%BE%E5%9C%BA%E6%99%AF.gif)





轮播图常见于各种应用首页，用于各类信息、资讯的轮流展示。本应用使用Swiper组件，同样实现了这一能力。`"全部"`页签的`"电影精选"`部分，既为一个电影内容的轮播模块。它可以切换展示不同电影内容。界面效果图如图：







我们将轮播图模块定义为一个自定义组件Banner。在Banner组件创建新实例时，会初始化轮播内容并开启定时任务。定时任务通过调用`swiperController.showNext()`方法，控制Swiper组件切换内容展示。







在Swiper组件内，将初始化数据进行循环渲染。配合开启的定时任务，循环播放。



:::details `pages/SwiperIndex.ets`

```js{22}
import { TopBar } from '../view/common/TopBar';
import { PageAll } from '../view/tabcontent/PageAll';
import { CommonConstants } from '../common/constants/CommonConstant';
import { PageLive } from '../view/tabcontent/PageLive';
import { PageGame } from '../view/tabcontent/PageGame';
import { PageEntertainment } from '../view/tabcontent/PageEntertainment';
import { PageTV } from '../view/tabcontent/PageTV';
import { PageMovie } from '../view/tabcontent/PageMovie';
/**
 * Application home page.
 */
@Entry
@Component
struct SwiperIndex {
  // Double binding of index values to achieve linkage effect.
  @State index: number = 0;

  build() {
    Flex({ direction: FlexDirection.Column, alignItems: ItemAlign.Start }) {
      TopBar({ index: $index })
      Swiper() {
        PageAll()
        PageMovie()
        PageTV()
        PageEntertainment()
        PageLive()
        PageGame()
      }
      .index(this.index)
      .indicator(false)
      .loop(false)
      .duration(CommonConstants.DURATION_PAGE)
      .onChange((index: number) => {
        this.index = index;
      })
    }
    .backgroundColor($r('app.color.start_window_background'))
  }
}
```

:::



:::details `/tabcontent/PageAll`

```js{13}
import { Banner } from '../common/Banner';
import { PictureSort } from '../all/PictureSort';
import { CommonConstants } from '../../common/constants/CommonConstant';
import { PictureType } from '../../common/constants/PictureConstants';
/**
 * Tab content of all.
 */
@Component
export struct PageAll {
  build() {
    Scroll() {
      Column() {
        Banner()
        PictureSort({ initType: PictureType.RECENTLY })
        PictureSort({ initType: PictureType.PHOTO })
      }
      .width(CommonConstants.FULL_WIDTH)
    }
    .scrollable(ScrollDirection.Vertical).scrollBar(BarState.Off)
  }
}
```

:::





:::details `common/Banner.ets`

```js{27,41,31,33,37}
import router from '@ohos.router';
import { PictureItem } from '../../viewmodel/PictureItem';
import { PictureType } from '../../common/constants/PictureConstants';
import { initializePictures, startPlay, stopPlay } from '../../viewmodel/PictureViewModel';
import { CommonConstants } from '../../common/constants/CommonConstant';
/**
 * text style.
 *
 * @param fontSize Font size.
 * @param fontWeight Font weight.
 */
@Extend(Text)
function textStyle(fontSize: number, fontWeight: number) {
  .fontSize(fontSize)
  .fontColor($r('app.color.start_window_background'))
  .fontWeight(fontWeight)
}

/**
 * Carousel banner.
 */
@Component
export struct Banner {
  // Change the index value through a scheduled task to perform a round robin.
  @State index: number = 0;
  private imageArray: Array<PictureItem> = [];
  private swiperController: SwiperController = new SwiperController();

  aboutToAppear() {
    // Data Initialization.
    this.imageArray = initializePictures(PictureType.BANNER);
    // Turn on scheduled task.
    startPlay(this.swiperController);
  }

  aboutToDisappear() {
    stopPlay();
  }

  build() {
    Swiper(this.swiperController) {
      ForEach(this.imageArray, (item: PictureItem) => {
        Stack({ alignContent: Alignment.TopStart }) {
          Image(item.image)
            .objectFit(ImageFit.Fill)
            .height(CommonConstants.FULL_HEIGHT)
            .width(CommonConstants.FULL_WIDTH)
            .borderRadius(CommonConstants.BORDER_RADIUS)
            .align(Alignment.Center)
            .onClick(() => {
              router.pushUrl({ url: CommonConstants.PLAY_PAGE });
            })

          Column() {
            Text($r('app.string.movie_classic'))
              .textStyle(CommonConstants.FONT_SIZE_DESCRIPTION, CommonConstants.FONT_WEIGHT_LIGHT)
              .opacity($r('app.float.opacity_deep'))
              .margin({ bottom: CommonConstants.BOTTOM_TEXT })
            Text(item.name)
              .textStyle(CommonConstants.FONT_SIZE_TITLE, CommonConstants.FONT_WEIGHT_BOLD)
          }
          .alignItems(HorizontalAlign.Start)
          .height(CommonConstants.HEIGHT_CAROUSEL_TITLE)
          .margin({ top: CommonConstants.TOP_ADS, left: CommonConstants.ADS_LEFT })
        }
        .height(CommonConstants.FULL_HEIGHT)
        .width(CommonConstants.FULL_WIDTH)
      }, (item: PictureItem) => JSON.stringify(item))
    }
    .width(CommonConstants.PAGE_WIDTH)
    .height(CommonConstants.HEIGHT_BANNER)
    .index(this.index)
    .indicatorStyle({ selectedColor: $r('app.color.start_window_background') })
    .indicator(true)
    .duration(CommonConstants.DURATION_ADS)
  }
}
```

:::





:::details `viewmodel/PictureViewModel.ets`

```js
import { PictureItem } from './PictureItem';
import { PICTURE_RECENTLY, PICTURE_PHOTO, PICTURE_LATEST, PICTURE_BANNER } from '../common/constants/PictureConstants';
import { PictureType } from '../common/constants/PictureConstants';
import { CommonConstants } from '../common/constants/CommonConstant';

/**
 * Initialize picture data according to type.
 *
 * @param initType Init type.
 */
export function initializePictures(initType: string): Array<PictureItem> {
  let imageDataArray: Array<PictureItem> = [];
  switch (initType) {
    case PictureType.BANNER:
      PICTURE_BANNER.forEach((item: PictureItem) => {
        imageDataArray.push(item);
      })
      break;
    case PictureType.RECENTLY:
      PICTURE_RECENTLY.forEach((item: PictureItem) => {
        imageDataArray.push(item);
      })
      break;
    case PictureType.PHOTO:
      PICTURE_PHOTO.forEach((item: PictureItem) => {
        imageDataArray.push(item);
      })
      break;
    case PictureType.LATEST:
      PICTURE_LATEST.forEach((item: PictureItem) => {
        imageDataArray.push(item);
      })
      break;
    default:
      break;
  }
  return imageDataArray;
}

let timerIds: number[] = [];

/**
 * start scheduled task.
 *
 * @param swiperController Controller.
 */
export function startPlay(swiperController: SwiperController): void {
  let timerId = setInterval(() => {
    swiperController.showNext();
  }, CommonConstants.SWIPER_TIME);
  timerIds.push(timerId);
}

/**
 * stop scheduled task.
 */
export function stopPlay(): void {
  timerIds.forEach((item: number) => {
    clearTimeout(item);
  })
}
```

:::







## 视频滑动播放场景

视频滑动播放是Swiper组件的另一个常见应用场景。点击应用首页中的视频图片，会跳转至视频播放界面。我们可以通过上下滑动，切换播放的视频内容。界面效果如图：





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%A7%86%E9%A2%91%E6%BB%91%E5%8A%A8%E6%92%AD%E6%94%BE%E5%9C%BA%E6%99%AF.gif)



视频播放界面通过函数`initializeOnStartup`初始化视频内容。在`Swiper`组件内通过循环渲染的方式，将各个视频内容渲染成自定义组件`PlayView`。这样每一个视频内容就是一个Swiper的子组件，可以通过滑动的方式切换播放内容。





在自定义组件`PlayView`中，通过Video来控制视频播放。结合Stack容器组件，在视频内容上叠加点赞、评论、转发等内容。



:::details `play/playView.ets`

```js{34-41}
import { VideoItem } from '../../viewmodel/VideoItem';
import { CommonConstants } from '../../common/constants/CommonConstant';
import { PlayState } from '../../common/constants/VideoConstants';
import { NavigationView } from './NavigationView';
import { CommentView } from './CommentView';
import { DescriptionView } from './DescriptionView';

/**
 * Video play view.
 */
@Component
export struct PlayView {
  private isShow: boolean = false;
  // Change the video playing state according to the index and pageShow changes.
  @Link @Watch('needPageShow') index: number;
  @Link @Watch('needPageShow') pageShow: boolean;
  @State item: VideoItem = new VideoItem();
  private barPosition: number = 0;
  @State private playState: number = PlayState.STOP;
  private videoController: VideoController = new VideoController();

  build() {
    Stack({ alignContent: Alignment.End }) {
      Video({
        src: this.item.src,
        controller: this.videoController
      })
        .controls(false)
        .autoPlay(this.playState === PlayState.START ? true : false)
        .objectFit(ImageFit.Fill)
        .loop(true)
        .height(CommonConstants.WIDTH_VIDEO)
        .width(CommonConstants.FULL_WIDTH)
        .onClick(() => {
          if (this.playState === PlayState.START) {
            this.playState = PlayState.PAUSE;
            this.videoController.pause();
          } else if (this.playState === PlayState.PAUSE) {
            this.playState = PlayState.START;
            this.videoController.start();
          }
        })

      NavigationView()
      CommentView({ item: this.item })
      DescriptionView()
    }
    .backgroundColor(Color.Black)
    .width(CommonConstants.FULL_WIDTH)
    .height(CommonConstants.FULL_HEIGHT)
  }

  onPageSwiperShow(): void {
    if (this.playState != PlayState.START) {
      this.playState = PlayState.START;
      this.videoController.start();
    }
  }

  onPageSwiperHide(): void {
    if (this.playState != PlayState.STOP) {
      this.playState = PlayState.STOP;
      this.videoController.stop();
    }
  }

  needPageShow(): void {
    if (this.pageShow === true) {
      if (this.barPosition === this.index) { // Judge whether the index is the same as the current location.
        this.isShow = true;
        this.onPageSwiperShow();
      } else {
        if (this.isShow === true) { // The already visible status is changed to invisible, and the invisible method callback is triggered.
          this.isShow = false;
          this.onPageSwiperHide();
        }
      }
    } else { // Stop when the page goes back to the background.
      this.isShow = false;
      this.onPageSwiperHide();
    }
  }
}
```

:::

