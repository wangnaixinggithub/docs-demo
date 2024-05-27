# Video组件的使用



## 概述

在手机、平板或是智慧屏这些终端设备上，媒体功能可以算作是我们最常用的场景之一。无论是实现音频的播放、录制、采集，还是视频的播放、切换、循环，亦或是相机的预览、拍照等功能，媒体组件都是必不可少的。以视频功能为例，在应用开发过程中，我们需要通过ArkUI提供的Video组件为应用增加基础的视频播放功能。借助Video组件，我们可以实现视频的播放功能并控制其播放状态。常见的视频播放场景包括观看网络上的较为流行的短视频，也包括查看我们存储在本地的视频内容



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/Video%E7%BB%84%E4%BB%B6%E7%A4%BA%E4%BE%8B.png)

## Video组件用法介绍

### Video组件参数介绍

Video组件的接口表达形式为：

```js
Video(value: {src?: string | Resource, currentProgressRate?: number | string |PlaybackSpeed, previewUri?: string |PixelMap | Resource, controller?: VideoController})
```

其中包含四个可选参数，`src`、`currentProgressRate`、`previewUri`和`controller`。



- `src`表示视频播放源的路径，可以支持本地视频路径和网络路径。使用网络地址时，如`https`，需要注意的是需要在`module.json5`文件中申请网络权限。在使用本地资源播放时，当使用本地视频地址我们可以使用媒体库管理模块`medialibrary`来查询公共媒体库中的视频文件，示例代码如下：

```js
import mediaLibrary from '@ohos.multimedia.mediaLibrary';

async queryMediaVideo() {
  let option = {
    // 根据媒体类型检索
    selections: mediaLibrary.FileKey.MEDIA_TYPE + '=?',
    // 媒体类型为视频
    selectionArgs: [mediaLibrary.MediaType.VIDEO.toString()]
  };
  let media = mediaLibrary.getMediaLibrary(getContext(this));
  // 获取资源文件
  const fetchFileResult = await media.getFileAssets(option);
  // 以获取的第一个文件为例获取视频地址
  let fileAsset = await fetchFileResult.getFirstObject();
  this.source = fileAsset.uri
}
```

为了方便功能演示，示例中媒体资源需存放在resources下的`rawfile`文件夹里。



- `currentProgressRate`表示视频播放倍速，其参数类型为number，取值支持0.75，1.0，1.25，1.75，2.0，默认值为1.0倍速；
- `previewUri`表示视频未播放时的预览图片路径；
- `controller`表示视频控制器。



参数的具体描述如下表：



|      **参数名**       |          **参数类型**           | **必填** |
| :-------------------: | :-----------------------------: | :------: |
|         `src`         |        `string|Resource`        |    否    |
| `currentProgressRate` | `number|string|PlaybackSpeed8+` |    否    |
|     `previewUri`      |    `string|PlaybackSpeed8+`     |    否    |
|     `controller`      |        `VideoController`        |    否    |

:::info 说明

视频支持的规格是：`mp4`、`mkv`、`webm`、`TS`。

:::





下面我们通过具体的例子来说明参数的使用方法，我们选择播放本地视频，视频未播放时的预览图片路径也为本地，代码实现如下：



```js
@Component
export struct VideoPlayer {
  private source: string | Resource;
  private controller: VideoController;
  private previewUris: Resource = $r('app.media.preview');
  ...

  build() {
    Column() {
      Video({
        src: this.source,
        previewUri: this.previewUris,
        controller: this.controller
      })
        ...
      VideoSlider({ controller: this.controller })
    }
  }
}
```

效果如下：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/Video%E7%BB%84%E4%BB%B6%E6%9E%84%E9%80%A0%E5%8F%82%E6%95%B0.png)



### Video组件属性介绍



除了支持组件的尺寸设置、位置设置等通用属性外，Video组件还支持是否静音、是否自动播放、控制栏是否显示、视频显示模式以及单个视频是否循环播放五个私有属性。



|    名称     |  参数类型   |                  **描述**                  |
| :---------: | :---------: | :----------------------------------------: |
|   `muted`   |  `boolean`  |          是否静音。默认值：false           |
| `autoPlay`  | ` boolean`  |        是否自动播放。默认值：false         |
| `controls`  | ` boolean`  | 控制视频播放的控制栏是否显示。默认值：true |
| `objectFit` | ` ImageFit` |      设置视频显示模式。默认值：Cover       |
|   `loop`    |  `boolean`  |    是否单个视频循环播放。默认值：false     |

其中，`objectFit `中视频显示模式包括Contain、Cover、Auto、Fill、ScaleDown、None 6种模式，默认情况下使用`ImageFit.Cover`（保持宽高比进行缩小或者放大，使得图片两边都大于或等于显示边界），其他效果（如自适应显示、保持原有尺寸显示、不保持宽高比进行缩放等）可以根据具体使用场景/设备来进行选择。





在`Codelab`示例中体现了`controls`、`autoplay`和`loop`属性的配置，示例代码如下：

```js
@Component
export struct VideoPlayer {
  private source: string | Resource;
  private controller: VideoController;
  ...
  build() {
    Column() {
      Video({
        controller: this.controller
      })
        .controls(false) //不显示控制栏 
        .autoPlay(false) // 手动点击播放 
        .loop(false) // 关闭循环播放 
        ...
    }
  }
}
```

效果如下:

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/Video%E7%A7%81%E6%9C%89%E5%B1%9E%E6%80%A7%E7%A4%BA%E4%BE%8B.png)



### Video组件回调事件介绍

Video组件能够支持常规的点击、触摸等通用事件，同时也支持`onStart`、`onPause、onFinish`、`onError`等事件，具体事件的功能描述见下表：



|                           事件名称                           |                           功能描述                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|                 `onStart(event:() => void)`                  |                      播放时触发该事件。                      |
|                 `onPause(event:() => void)`                  |                      暂停时触发该事件。                      |
|                 `onFinish(event:() => void)`                 |                    播放结束时触发该事件。                    |
|                 `onError(event:() => void)`                  |                    播放失败时触发该事件。                    |
| `onPrepared(callback:(event?: { duration: number }) => void)` | 视频准备完成时触发该事件，通过duration可以获取视频时长，单位为s。 |
|   `onSeeking(callback:(event?: { time: number }) => void)`   |           操作进度条过程时上报时间信息，单位为s。            |
|   `onSeeked(callback:(event?: { time: number }) => void)`    |        操作进度条完成后，上报播放时间信息，单位为s。         |
|   `onUpdate(callback:(event?: { time: number }) => void)`    |   播放进度变化时触发该事件，单位为s，更新时间间隔为250ms。   |
| `onFullscreenChange(callback:(event?: { fullscreen: boolean }) => void)` |        在全屏播放与非全屏播放状态之间切换时触发该事件        |

在Codelab中我们以更新事件、准备事件、失败事件以及点击事件为回调为例进行演示，代码实现如下：

```js
Video({ ... })
  .onUpdate((event) => {
    this.currentTime = event.time;
    this.currentStringTime = changeSliderTime(this.currentTime); //更新事件 
  })
  .onPrepared((event) => {
    prepared.call(this, event); //准备事件 
  })
  .onError(() => {
    prompt.showToast({
      duration: COMMON_NUM_DURATION, //播放失败事件 
      message: MESSAGE
    });
  ...
  })
```

其中，`onUpdate`更新事件在播放进度变化时触发，从event中可以获取当前播放进度，从而更新进度条显示事件，比如视频播放时间从24秒更新到30秒。onError事件在视频播放失败时触发，在`CommonConstants.ets`中定义了常量类MESSAGE，所以在视频播放失败时会显示“请检查网络”。





## 自定义控制器的组成与实现



### 自定义控制器的组成



Video组件的原生控制器样式相对固定，当我们对页面的布局色调的一致性有所要求，或者在拖动进度条的同时需要显示其百分比进度时，原生控制器就无法满足需要了。如下图右侧的效果需要使用自定义控制器实现，接下来我们看一下自定义控制器的组成。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8E%A7%E5%88%B6%E5%99%A8%E7%BB%84%E6%88%90%E7%A4%BA%E4%BE%8B.png)



为了实现自定义控制器的进度显示等功能，我们需要通过Row容器实现控制器的整体布局，然后借由Text组件来显示视频的播放起始时间、进度时间以及视频总时长，最后通过滑动进度条Slider组件来实现视频进度条的效果，代码如下：

```js
@Component
export struct VideoSlider {
  ...
  build() {
    Row(...) {
      Image(...)
      Text(...)
      Slider(...)
      Text(...)
    }
    ...
  }
}
```

### 自定义控制器的实现

自定义控制器容器内嵌套了视频播放时间Text组件、滑动器Slider组件以及视频总时长Text组件 3个横向排列的组件，其中Text组件在之前的基础组件课程中已经有过详细介绍，这里就不再进行赘述。需要强调的是两个Text组件显示的时长是由Slider组件的`onChange(callback: (value: number, mode: SliderChangeMode) => void)`回调事件来进行传递的，而Text组件的数值与视频播放进度数值value则是通过@Provide与 @Consume装饰器进行的数据联动，实现效果可见图片下方黑色控制栏部分，具体代码步骤及代码如下：



**获取/计算视频时长**

```js
export function prepared(event) {
  this.durationTime = event.duration;
  let second: number = event.duration % COMMON_NUM_MINUTE;
  let min: number = parseInt((event.duration / COMMON_NUM_MINUTE).toString());
  let head = min < COMMON_NUM_DOUBLE ? `${ZERO_STR}${min}` : min;
 let end = second < COMMON_NUM_DOUBLE ? `${ZERO_STR}${second}` : second;
 
 this.durationStringTime = `${head}${SPLIT}${end}`;
  ...
};
```



**设置进度条参数及属性**

```js
Slider({
  value: this.currentTime,
  min: 0,
  max: this.durationTime,
  step: 1,
  style: SliderStyle.OutSet
})
  .blockColor($r('app.color.white'))
  .width(STRING_PERCENT.SLIDER_WITH)
  .trackColor(Color.Gray)
  .selectedColor($r('app.color.white'))
  .showSteps(true)
  .showTips(true)
  .trackThickness(this.isOpacity ? SMALL_TRACK_THICK_NESS : BIG_TRACK_THICK_NESS)
  .onChange((value: number, mode: SliderChangeMode) => {...})
```

**计算当前进度播放时间及添加onUpdate回调**



最后，在我们播放视频时还需要更新显示播放的时间进度，也就是左侧的Text组件。在视频开始播放前，播放时间默认为00:00，随着视频播放，时间需要不断更新为当前进度时间。所以左侧的Text组件我们不仅需要读取时间，还需要为其添加数据联动。这里，我们就是通过为Video组件添加onUpdate事件来实现的，在视频播放过程中会不断调用`changeSliderTime`方法获取当前的播放时间并进行计算及单位转化，从而不断刷新进度条的值，也就是控制器左侧的播放进度时间Text组件。

```js
Video({...})
  ...
  .onUpdate((event) => {
    this.currentTime = event.time;
    this.currentStringTime = changeSliderTime(this.currentTime)
  }) 
```

```js
export function changeSliderTime(value: number): string {
  let second: number = value % COMMON_NUM_MINUTE;
  let min: number = parseInt((value / COMMON_NUM_MINUTE).toString());
  let head = min < COMMON_NUM_DOUBLE ? `${ZERO_STR}${min}` : min;
  let end = second < COMMON_NUM_DOUBLE ? `${ZERO_STR}${second}` : second;
  let nowTime = `${head}${SPLIT}${end}`;
  return nowTime;
}; 
```

到这里我们就实现了自定义控制器的构建，两个Text组件显示的时长是由Slider组件的`onChange`回调事件来进行传递的，而Text组件的数值与视频播放进度数值value则通过是`onUpdate`与`onChange`事件并借由`@Provide @Consume`装饰器进行的数据联动。



## 参考链接

- Video组件的更多属性和参数的使用，可以参考API：[Video](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/ts-media-components-video-0000001427902484-V3?catalogVersion=V3)。





