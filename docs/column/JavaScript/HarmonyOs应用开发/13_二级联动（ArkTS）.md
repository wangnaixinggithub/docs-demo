# 二级联动（ArkTS）

如何基于List组件实现一个导航和内容的二级联动效果。样例主要包含以下功能：

- 切换左侧导航，右侧滚动到对应的内容。
- 滚动右侧的内容，左侧会切换对应的导航。

## 相关概念

- [List](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-list-0000001477981213-V3?catalogVersion=V3)：列表包含一系列相同宽度的列表项。适合连续、多行呈现同类数据，例如图片和文本。
- [ListItemGroup](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-container-listitemgroup-0000001428061756-V3?catalogVersion=V3)：该组件用来展示列表item分组，宽度默认充满List组件，必须配合List组件来使用。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E4%BA%8C%E7%BA%A7%E8%81%94%E5%8A%A8ArkTs%E6%A1%88%E4%BE%8B.gif)

## 代码结构解读

```js
├──entry/src/main/ets                // 代码区
│  ├──common
│  │  └──constants
│  │     └──Constants.ets            // 常量类
│  ├──entryability
│  │  └──EntryAbility.ts             // 程序入口类
│  ├──pages
│  │  └──IndexPage.ets               // 二级联动页面入口
│  ├──view
│  │  ├──ClassifyItem.ets            // 课程分类组件
│  │  └──CourseItem.ets              // 课程信息组件
│  └──viewmodel                          
│     ├──ClassifyModel.ets           // 导航model
│     ├──ClassifyViewModel.ets       // 导航ViewModel
│     ├──CourseModel.ets             // 课程内容model
│     └──LinkDataModel.ets           // 数据源model
└──entry/src/main/resources          // 资源文件
```

## 二级联动实现

界面整体使用Row组件实现横向布局，分为左右两部分。均使用List组件实现对导航和内容的数据展示，导航部分固定宽度，内容部分自适应屏幕剩余宽度并用`ListItemGroup`完成每个导航下的内容布局。





点击左侧导航时，右侧内容区域通过`scrollToIndex`方法跳转到对应的内容页面，并改变导航的选中状态。



同理在滚动右侧内容的过程中，如果当前展示的`ListItemGroup`发生改变时，修改左侧导航的选中状态，并滚到到对应的导航item。





:::details `view/ClassityItem.ets`

```js{17}
import Constants from '../common/constants/Constants';
@Component
export default struct ClassifyItem {
  classifyName?: string;
  @Prop isSelected: boolean = false;
  onClickAction = () => {}
  build() {
    Text(this.classifyName)
      .fontSize($r('app.float.normal_font_size'))
      .fontColor(this.isSelected ? $r('app.color.base_font_color') : $r('app.color.normal_font_color'))
      .fontFamily(this.isSelected ? $r('app.string.hei_ti_medium') : $r('app.string.hei_ti'))
      .fontWeight(this.isSelected ? Constants.TITLE_FONT_WEIGHT : Constants.LABEL_FONT_WEIGHT)
      .textAlign(TextAlign.Center)
      .backgroundColor(this.isSelected ? $r('app.color.base_background') : '')
      .width(Constants.FULL_PERCENT)
      .height($r('app.float.classify_item_height'))
      .onClick(this.onClickAction)
  }
}
```

:::



::: details `view/CourseItem.ets`

```js
import Constants from '../common/constants/Constants';
import CourseModel from '../viewmodel/CourseModel';
@Component
export default struct CourseItem {
  @Prop itemStr: string = '';
  item?: CourseModel;
  aboutToAppear() {
    this.item = JSON.parse(this.itemStr);
  }
  build() {
    Row() {
      Image(this.item !== undefined ? this.item?.imageUrl : '')
        .height(Constants.FULL_PERCENT)
        .aspectRatio(1)
      Column() {
        Text(this.item?.courseName)
          .fontSize($r('app.float.normal_font_size'))
          .fontColor($r('app.color.base_font_color'))
          .fontFamily($r('app.string.hei_ti_medium'))
          .maxLines(Constants.TITLE_LINE_NUMBER)
          .textOverflow({ overflow: TextOverflow.Clip })
          .lineHeight($r('app.float.title_line_height'))
          .width(Constants.FULL_PERCENT)
        Text(this.item?.price === 0 ? $r('app.string.free_price') : $r('app.string.price_str', this.item?.price))
          .fontSize($r('app.float.header_font_size'))
          .fontColor($r('app.color.price_color'))
          .fontFamily($r('app.string.hei_ti_medium'))
      }
      .padding($r('app.float.course_item_padding'))
      .layoutWeight(1)
      .alignItems(HorizontalAlign.Start)
      .justifyContent(FlexAlign.SpaceBetween)
      .height(Constants.FULL_PERCENT)
    }
    .clip(true)
    .borderRadius($r('app.float.normal_border_radius'))
    .backgroundColor($r('app.color.start_window_background'))
    .width('100%')
    .height($r('app.float.course_item_height'))
  }
}
```

:::



:::details   `page/IndexPage.ets`

```js{42,45,90}
import Constants from '../common/constants/Constants';
import ClassifyModel from '../viewmodel/ClassifyModel';
import CourseModel from '../viewmodel/CourseModel';
import CourseItem from '../view/CourseItem';
import ClassifyItem from '../view/ClassityItem';
import ClassifyViewModel from '../viewmodel/ClassifyViewModel';
@Entry
@Component
struct IndexPage {
  @State currentClassify: number = 0; // selected classify index.
  @State requestSuccess: boolean = false; // is loading data.
  private classifyList: Array<ClassifyModel> = [];
  private classifyScroller: Scroller = new Scroller();
  private scroller: Scroller = new Scroller();
  aboutToAppear() {
    // loading data.
    setTimeout(() => {
      this.classifyList = ClassifyViewModel.getLinkData();
      this.requestSuccess = true;
    }, Constants.LOADING_DURATION);
  }
  @Builder ClassifyHeader(classifyName: string) {
    Row() {
      Text(classifyName)
        .fontSize($r('app.float.header_font_size'))
        .fontColor($r('app.color.base_font_color'))
        .fontFamily($r('app.string.hei_ti_medium'))
        .fontWeight(Constants.TITLE_FONT_WEIGHT)
    }
    .padding({ left: $r('app.float.item_padding_left') })
    .height($r('app.float.classify_item_height'))
    .width(Constants.FULL_PERCENT)
    .backgroundColor($r('app.color.base_background'))
  }

  classifyChangeAction(index: number, isClassify: boolean) {
    if (this.currentClassify !== index) {
      // change the classify status.
      this.currentClassify = index;
      if (isClassify) {
        // scroll the course scroll.
        this.scroller.scrollToIndex(index);
      } else {
        // scroll the classify scroll.
        this.classifyScroller.scrollToIndex(index);
      }
    }
  }
  build() {
    Row() {
      if (this.requestSuccess) {
        List({ scroller: this.classifyScroller }) {
          ForEach(this.classifyList, (item: ClassifyModel, index?: number) => {
            ListItem() {
              ClassifyItem({
                classifyName: item.classifyName,
                isSelected: this.currentClassify === index,
                onClickAction: () => {
                  if (index !== undefined) {
                    this.classifyChangeAction(index, true);
                  }
                }
              })
            }
          }, (item: ClassifyModel) => item.classifyName + this.currentClassify)
        }
        .height(Constants.FULL_PERCENT)
        .width($r('app.float.classify_item_width'))
        .backgroundColor($r('app.color.classify_background'))
        .scrollBar(BarState.Off)

        List({ scroller: this.scroller }) {
          ForEach(this.classifyList, (classifyItem: ClassifyModel) => {
            ListItemGroup({
              header: this.ClassifyHeader(classifyItem.classifyName),
              space: Constants.COURSE_ITEM_PADDING
            }) {
              ForEach(classifyItem.courseList, (courseItem: CourseModel) => {
                ListItem() {
                  CourseItem({ itemStr: JSON.stringify(courseItem) })
                }
              }, (courseItem: CourseModel) => `${courseItem.courseId}`)
            }
          }, (item: ClassifyModel) => `${item.classifyId}`)
        }
        .padding({ left: $r('app.float.item_padding_left'), right: $r('app.float.course_item_padding') })
        .sticky(StickyStyle.Header)
        .layoutWeight(1)
        .edgeEffect(EdgeEffect.None)
        .onScrollIndex((start: number) => this.classifyChangeAction(start, false))
      } else {
        Text($r('app.string.loading'))
          .fontFamily($r('app.string.hei_ti_medium'))
          .textAlign(TextAlign.Center)
          .height(Constants.FULL_PERCENT)
          .width(Constants.FULL_PERCENT)
      }
    }
    .backgroundColor($r('app.color.base_background'))
  }
}
```

:::





**假数据清洗封装**



:::details  `viewmodel\ClassifyModel.ets`

```js
import CourseModel from './CourseModel';
/**
 * course classity model
 */
export default class ClassifyModel {
  /**
   * classify id
   */
  classifyId: number;
  /**
   * classify name
   */
  classifyName: string;
  /**
   * course list of the classify.
   */
  courseList: Array<CourseModel>;

  constructor(classifyId: number, classifyName: string, courseList: Array<CourseModel>) {
    this.classifyId = classifyId;
    this.classifyName = classifyName;
    this.courseList = courseList;
  }
}
```

:::



:::details `viewmodel\CourseModel.ets`

```js
/**
 * Course Model
 */
export default class CourseModel {
  classifyId: number;
  courseId: number;
  courseName: string;
  imageUrl: Resource;
  price: number;

  constructor(classifyId: number, courseId: number, courseName: string, imageUrl: Resource, price: number) {
    this.classifyId = classifyId;
    this.courseId = courseId;
    this.courseName = courseName;
    this.imageUrl = imageUrl;
    this.price = price;
  }
}
```

:::



:::details `viewmodel/ClassifyViewModel.ets`

```js
/**
 * initial data model.
 */
export default class LinkDataModel {
  /**
   * parentId
   */
  superId: number;
  /**
   * ParentName
   */
  superName: string;
  id: number;
  courseName: string;
  imageUrl: Resource;
  price: number;
  constructor(superId: number, superName: string, id: number, courseName: string, imageUrl: Resource, price: number) {
    this.superId = superId;
    this.superName = superName;
    this.id = id;
    this.courseName = courseName;
    this.imageUrl = imageUrl;
    this.price = price;
  }
}
```

:::



:::details `viewmodel/LinkDataModel.ets`

```js
/**
 * initial data model.
 */
export default class LinkDataModel {
  /**
   * parentId
   */
  superId: number;
  /**
   * ParentName
   */
  superName: string;
  id: number;
  courseName: string;
  imageUrl: Resource;
  price: number;
  constructor(superId: number, superName: string, id: number, courseName: string, imageUrl: Resource, price: number) {
    this.superId = superId;
    this.superName = superName;
    this.id = id;
    this.courseName = courseName;
    this.imageUrl = imageUrl;
    this.price = price;
  }
}
```

:::



:::details `viewmodel/ClassifyViewModel.ets`



```js{17,22,21}
import ClassifyModel from './ClassifyModel';
import CourseModel from './CourseModel';
import LinkDataModel from './LinkDataModel';
class ClassifyViewModel {
  /**
   * Get Classify list data
   *
   * @returns Array<ClassifyModel> linkDataList
   */
  getLinkData(): Array<ClassifyModel> {
    let linkDataList: Array<ClassifyModel> = [];
    let superId: number = 0;
    LINK_DATA.forEach((item: LinkDataModel) => {
      if (superId !== item.superId) {
        // add the course classify model.
        let classifyItem: ClassifyModel = new ClassifyModel(item.superId, item.superName, []);
        linkDataList.push(classifyItem);
      }
      // add the course model.
      let courseItem: CourseModel = new CourseModel(superId, item.id, item.courseName, item.imageUrl, item.price);
      linkDataList[linkDataList.length-1].courseList.push(courseItem);
      superId = item.superId;
    });
    return linkDataList;
  }
}

let classifyViewModel = new ClassifyViewModel();

export default classifyViewModel as ClassifyViewModel;

const LINK_DATA: LinkDataModel[] = [
  new LinkDataModel(1, '热门课程', 1, '应用市场介绍', $r('app.media.ic_img_1'), 0),
  new LinkDataModel(1, '热门课程', 2, '上架流程', $r('app.media.ic_img_2'), 100),
  new LinkDataModel(1, '热门课程', 3, '应用出海', $r('app.media.ic_img_3'), 50),
  new LinkDataModel(1, '热门课程', 4, '审核政策', $r('app.media.ic_img_4'), 222),
  new LinkDataModel(1, '热门课程', 5, 'CaaS Kit - HMS Core精品实战课', $r('app.media.ic_img_5'), 256),
  new LinkDataModel(1, '热门课程', 6, '机器学习在图像分割场景中的应用', $r('app.media.ic_img_6'), 0),
  new LinkDataModel(1, '热门课程', 7, '一分钟了解华为应用内支付服务', $r('app.media.ic_img_7'), 0),
  new LinkDataModel(1, '热门课程', 8, '一分钟了解华为位置服务', $r('app.media.ic_img_8'), 400),
  new LinkDataModel(2, '最新课程', 9, 'Excel函数在商业中的应用', $r('app.media.ic_img_9'), 65),
  new LinkDataModel(2, '最新课程', 10, '“震动”手机锁屏制作', $r('app.media.ic_img_10'), 0),
  new LinkDataModel(2, '最新课程', 11, '“流体动效”手机锁屏制作', $r('app.media.ic_img_11'), 50),
  new LinkDataModel(2, '最新课程', 12, 'HUAWEI GT自定义表盘制作', $r('app.media.ic_img_12'), 70),
  new LinkDataModel(2, '最新课程', 13, '商务表盘制作', $r('app.media.ic_img_13'), 0),
  new LinkDataModel(2, '最新课程', 14, '5分钟了解跨应用、跨形态无缝登录', $r('app.media.ic_img_14'), 80),
  new LinkDataModel(2, '最新课程', 15, 'oCPC进阶功能及最新政策解读', $r('app.media.ic_img_15'), 120),
  new LinkDataModel(2, '最新课程', 16, 'HUAWEI Ads 游戏行业投放指南', $r('app.media.ic_img_16'), 160),
  new LinkDataModel(3, 'HarmonyOS', 17, 'HarmonyOS物联网开发课程', $r('app.media.ic_img_17'), 0),
  new LinkDataModel(3, 'HarmonyOS', 18, '【Hello系列直播课】第1期：手把手教你搭建开发环境', $r('app.media.ic_img_18'), 0),
  new LinkDataModel(3, 'HarmonyOS', 19, 'HarmonyOS技术训练营-10分钟快速体验HarmonyOS分布式应用', $r('app.media.ic_img_9'), 0),
  new LinkDataModel(3, 'HarmonyOS', 20, '应用开发基础：JS FA开发基础（第一期）', $r('app.media.ic_img_10'), 0),
  new LinkDataModel(3, 'HarmonyOS', 21, 'HarmonyOS Connect设备开发基础：OpenHarmony基础', $r('app.media.ic_img_1'), 60),
  new LinkDataModel(3, 'HarmonyOS', 22, '组件开发和集成：SDK集成指南（第五期）', $r('app.media.ic_img_2'), 120),
  new LinkDataModel(4, '精彩活动', 23, 'HUAWEI Developer Day•2018北京精彩回顾', $r('app.media.ic_img_3'), 0),
  new LinkDataModel(4, '精彩活动', 24, '华为AR帮你轻松打造酷炫应用', $r('app.media.ic_img_4'), 99),
  new LinkDataModel(4, '精彩活动', 25, 'AR VR应用创新大赛获奖作品', $r('app.media.ic_img_5'), 30),
  new LinkDataModel(4, '精彩活动', 26, '华为HiLink智能家居生态介绍', $r('app.media.ic_img_6'), 80),
  new LinkDataModel(4, '精彩活动', 27, '华为校园千帆行丨武汉站', $r('app.media.ic_img_7'), 160),
  new LinkDataModel(4, '精彩活动', 28, 'HUAWEI Developer Day•杭州站精彩回顾', $r('app.media.ic_img_8'), 0),
  new LinkDataModel(5, '开发者说', 29, '优秀实践分享 - 掌阅科技', $r('app.media.ic_img_9'), 0),
  new LinkDataModel(5, '开发者说', 30, '极限试驾', $r('app.media.ic_img_10'), 130),
  new LinkDataModel(5, '开发者说', 31, 'AR狙击手', $r('app.media.ic_img_11'), 100),
  new LinkDataModel(5, '开发者说', 32, '宇宙解码', $r('app.media.ic_img_12'), 100),
  new LinkDataModel(5, '开发者说', 33, 'Wars of Stone', $r('app.media.ic_img_13'), 1200),
  new LinkDataModel(5, '开发者说', 34, 'ROCK ME', $r('app.media.ic_img_14'), 156),
  new LinkDataModel(5, '开发者说', 35, '神奇AR智能宝宝', $r('app.media.ic_img_15'), 130),
  new LinkDataModel(6, '后端开发', 36, '从零开始学架构', $r('app.media.ic_img_16'), 120),
  new LinkDataModel(6, '后端开发', 37, '架构设计之异步化技术', $r('app.media.ic_img_17'), 0),
  new LinkDataModel(6, '后端开发', 38, '架构设计之页面静态化技术', $r('app.media.ic_img_18'), 0),
  new LinkDataModel(6, '后端开发', 39, 'Python极简入门', $r('app.media.ic_img_9'), 0),
  new LinkDataModel(6, '后端开发', 40, 'Python实践指南', $r('app.media.ic_img_10'), 2001),
  new LinkDataModel(6, '后端开发', 41, 'Java高级特性', $r('app.media.ic_img_1'), 30),
  new LinkDataModel(6, '后端开发', 42, 'C++核心编程', $r('app.media.ic_img_2'), 50),
  new LinkDataModel(7, '移动开发', 43, 'EMUI 9.1主题转10.0主题适配指导', $r('app.media.ic_img_3'), 0),
  new LinkDataModel(7, '移动开发', 44, '“流体动效”手机锁屏制作', $r('app.media.ic_img_4'), 0),
  new LinkDataModel(7, '移动开发', 45, '“震动”手机锁屏制作', $r('app.media.ic_img_5'), 0),
  new LinkDataModel(8, '前端开发', 46, 'DevOps新技术入门', $r('app.media.ic_img_6'), 50),
  new LinkDataModel(8, '前端开发', 47, 'Vue.js 框架开发系列课程', $r('app.media.ic_img_16'), 60),
  new LinkDataModel(8, '前端开发', 48, 'jQuery实例精讲', $r('app.media.ic_img_8'), 80),
  new LinkDataModel(8, '前端开发', 49, 'JavaScript 编程技巧与实战', $r('app.media.ic_img_9'), 300),
  new LinkDataModel(8, '前端开发', 50, '基于 Bootstrap 框架开发技巧实战', $r('app.media.ic_img_10'), 150),
  new LinkDataModel(8, '前端开发', 51, 'Java Web开发课程', $r('app.media.ic_img_11'), 200),
  new LinkDataModel(8, '前端开发', 52, 'JavaScript 设计模式', $r('app.media.ic_img_12'), 0),
  new LinkDataModel(8, '前端开发', 53, 'HTML入门基础系列课程', $r('app.media.ic_img_13'), 0),
  new LinkDataModel(8, '前端开发', 54, '前端系列第7期-微前端–架构介绍篇', $r('app.media.ic_img_14'), 0),
  new LinkDataModel(8, '前端开发', 55, 'Web安全系列课程', $r('app.media.ic_img_15'), 0)
]
```

:::







