# 案例：UIAbility内页面间的跳转

```js

├──entry/src/main/ets                // ArkTS代码区
│  ├──common
│  │  ├──constants
│  │  │  └──CommonConstants.ets      // 公共常量类
│  │  └──utils
│  │     └──Logger.ets               // 日志工具类
│  ├──entryability
│  │  └──EntryAbility.ets            // 程序入口类
│  └──pages
│     ├──IndexPage.ets               // 入口页面
│     └──SecondPage.ets              // 跳转页
└──entry/src/main/resources	     // 资源文件目录
```

## 创建两个页面



> 启动DevEco Studio，[创建一个新工程](https://developer.harmonyos.com/cn/docs/documentation/doc-guides-V3/start-with-ets-stage-0000001477980905-V3?catalogVersion=V3)。在工程pages目录中，选中Index.ets，点击鼠标右键 > Refactor > Rename，改名为IndexPage.ets。改名后，修改工程entryability目录下EntryAbility.ets文件中windowStage.loadContent方法第一个参数为pages/IndexPage，修改后，启动应用会自动加载IndexPage页。



:::details  `entryability/EntryAbility.ets`

```js{15-21}
import UIAbility from '@ohos.app.ability.UIAbility'
import Want from '@ohos.app.ability.Want';
import AbilityConstant from '@ohos.app.ability.AbilityConstant';
import window from '@ohos.window';
import Logger from '../common/utils/Logger';
const TAG = '[EntryAbility]';
export default class EntryAbility extends UIAbility {
  onCreate(want: Want, launchParam: AbilityConstant.LaunchParam) {
    Logger.info(TAG, 'onCreate');
    AppStorage.SetOrCreate('abilityWant', want);
  }
  onWindowStageCreate(windowStage: window.WindowStage) {
    // Main window is created, set main page for this ability
    Logger.info(TAG, 'onWindowStageCreate');
    windowStage.loadContent('pages/IndexPage', (err, data) => {
      if (err.code) {
        Logger.info(TAG, 'Failed to load the content. Cause:' + JSON.stringify(err));
        return;
      }
      Logger.info(TAG, 'Succeeded in loading the content. Data: ' + JSON.stringify(data));
    });
  }
};

```

:::



选中工程entry > src > main > ets > pages目录，点击鼠标右键 > New > Page，新建命名为SecondPage的page页。此时DevEco Studio会自动在工程目录entry > src > main > resources > base > profile > main_pages.json文件中添加pages/SecondPage。

:::details `profile/ main_pages.json`

```js{4}
{
  "src": [
    "pages/IndexPage",
    "pages/SecondPage"
  ]
}
```

:::

## 页面跳转



> 从IndexPage页面跳转到SecondPage页面，并进行数据传递，需要如下几个步骤：
>
> - 给两个页面导入router路由模块。
> - 在IndexPage页面中给Button组件添加点击事件，使用router.pushUrl()方法将SecondPage页面路径添加到url中，params为自定义参数。
> - SecondPage页面通过router.getParams()方法获取IndexPage页面传递过来的自定义参数。



IndexPage页面有一个Text文本和Button按钮，点击按钮跳转到下一个页面，并传递数据。

SecondPage页面有两个Text文本，其中一个文本展示从IndexPage页面传递过来的数据。

在SecondPage页面中，Button按钮添加onClick()事件，调用router.back()方法，实现返回上一页面的功能。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/routerGo.gif)

:::details `pages/IndexPage.ets`

```js{23-32}
import router from '@ohos.router';
import CommonConstants from '../common/constants/CommonConstants';
import Logger from '../common/utils/Logger';
const TAG = '[IndexPage]';

@Entry
@Component
struct IndexPage {
  @State message: string = CommonConstants.INDEX_MESSAGE;

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(CommonConstants.FONT_SIZE)
          .fontWeight(FontWeight.Bold)
        Blank()
        Button($r('app.string.next'))
          .fontSize(CommonConstants.BUTTON_FONT_SIZE)
          .width(CommonConstants.BUTTON_WIDTH)
          .height(CommonConstants.BUTTON_HEIGHT)
          .backgroundColor($r('app.color.button_bg'))
          .onClick(() => {
            router.pushUrl({
              url: CommonConstants.SECOND_URL,
              params: {
                src: CommonConstants.SECOND_SRC_MSG
              }
            }).catch((error: Error) => {
              Logger.info(TAG, 'IndexPage push error' + JSON.stringify(error));
            });
          })
      }
      .width(CommonConstants.FULL_WIDTH)
      .height(CommonConstants.LAYOUT_HEIGHT)
    }
    .height(CommonConstants.FULL_HEIGHT)
    .backgroundColor($r('app.color.page_bg'))
  }
}
```

:::



:::details  `pages/SecondPage.ets`

```js{7,24-26}
import router from '@ohos.router';
import CommonConstants from '../common/constants/CommonConstants';
@Entry
@Component
struct SecondPage {
  @State message: string = CommonConstants.SECOND_MESSAGE;
  @State src: string = (router.getParams() as Record<string, string>)[CommonConstants.SECOND_SRC_PARAM];

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(CommonConstants.FONT_SIZE)
          .fontWeight(FontWeight.Bold)
        Text(this.src)
          .fontSize(CommonConstants.PARAMS_FONT_SIZE)
          .opacity(CommonConstants.PARAMS_OPACITY)
        Blank()
        Button($r('app.string.back'))
          .fontSize(CommonConstants.BUTTON_FONT_SIZE)
          .width(CommonConstants.BUTTON_WIDTH)
          .height(CommonConstants.BUTTON_HEIGHT)
          .backgroundColor($r('app.color.button_bg'))
          .onClick(() => {
            router.back();
          })
      }
      .width(CommonConstants.FULL_WIDTH)
      .height(CommonConstants.LAYOUT_HEIGHT)
    }
    .height(CommonConstants.FULL_HEIGHT)
    .backgroundColor($r('app.color.page_bg'))
  }
}
```



:::





