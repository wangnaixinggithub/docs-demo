# image、image-animator组件的使用



HarmonyOS提供了常用的图片、图片帧动画播放器组件，开发者可以根据实际场景和开发需求，实现不同的界面交互效果，包括：点击阴影效果、点击切换状态、点击动画效果、点击切换动效。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image%E5%92%8Cimage-animator%E7%BB%84%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8.gif)

## 相关概念

- [image组件](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-components-basic-image-0000001427744884-V3?catalogVersion=V3)：图片组件，用于图片资源的展示。
- [image-animator组件](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-components-basic-image-animator-0000001478181473-V3?catalogVersion=V3)：帧动画播放器，用以播放一组图片，可以设置播放时间、次数等参数。
- [通用事件](https://developer.harmonyos.com/cn/docs/documentation/doc-references-V3/js-components-common-events-0000001478341193-V3?catalogVersion=V3)：事件绑定在组件上，当组件达到事件触发条件时，会执行JS中对应的事件回调函数，实现页面UI视图和页面JS逻辑层的交互。



## 代码结构解读

```js
├──entry/src/main/js	               // 代码区
│  └──MainAbility
│     ├──common
│     │  ├──constants
│     │  │  └──commonConstants.js     // 帧动画数据常量
│     │  └──images
│     ├──i18n		              // 中英文	
│     │  ├──en-US.json			
│     │  └──zh-CN.json			
│     └──pages
│        └──index
│           ├──index.css              // 首页样式文件	
│           ├──index.hml              // 首页布局文件
│           └──index.js               // 首页脚本文件
└──entry/src/main/resources           // 应用资源目录
```

## 界面布局

本示例使用卡片布局，将四种实现以四张卡片的形式呈现在主界面。每张卡片都使用图文结合的方式直观地向开发者展示所实现效果。



:::details `index/index.html`

```js
<div class="container">
    <!-- Clicking effect of the image component. -->
    <div class="card-container" for="item in imageCards">
        <div class="text-container">
            <text class="text-operation">{{ contentTitle }}</text>
            <text class="text-description">{{ item.description }}</text>
        </div>
        <image class="{{ item.classType }}" src="{{ item.src }}" onclick="changeHookState({{ item.eventType }})"
               ontouchstart="changeShadow({{ item.eventType }}, true)"
               ontouchend="changeShadow({{ item.eventType }}, false)"/>
    </div>

    <!-- Clicking effect of the image-animator component. -->
    <div class="card-container" for="item in animationCards">
        <div class="text-container">
            <text class="text-operation">{{ contentTitle }}</text>
            <text class="text-description">{{ item.description }}</text>
        </div>
        <image-animator id="{{ item.id }}" class="animator" images="{{ item.frames }}" iteration="1"
                        duration="{{ item.durationTime }}" onclick="handleStartFrame({{ item.type }})"/>
    </div>
</div>
```

:::





每张卡片对应一个div容器组件，以水平形式分为左侧文本和右侧图片两部分。左侧文本同样是一个div容器组件，以垂直形式分为操作文本与效果描述文本。右侧图片则根据需要使用image组件或image-animator组件。当前示例中，前两张卡片右侧使用的是image组件，剩余两张卡片使用的是image-animator组件。





## 事件交互

为image组件添加`touchstart`和`touchend`事件，实现点击图片改变边框阴影的效果，点击触碰结束时，恢复初始效果。





为image组件添加click事件，实现点击切换状态并变换显示图片的效果。





为image-animator组件添加click事件，实现点击播放帧动画效果。





:::details `index/index.js`

```js
import CommonConstants from '../../common/constants/commonConstants';

export default {
  data: {
    contentTitle: '',
    hook: true,
    imageCards: [
      {
        src: '/common/images/ic_heart_rate.png',
        classType: 'img-normal',
        eventType: 'touch',
        description: ''
      },
      {
        src: '/common/images/ic_hook.png',
        eventType: 'click',
        classType: 'img-normal',
        description: ''
      },
    ],
    animationCards: [
      {
        id: 'dialAnimation',
        type: 'dial',
        frames: CommonConstants.DIAL_FRAMES,
        description: '',
        durationTime: 0
      },
      {
        id: 'toggleAnimation',
        type: 'toggle',
        frames: [],
        description: '',
        durationTime: 0,
        flag: true
      }
    ],
    durationTimeArray: [CommonConstants.DURATION_TIME, CommonConstants.DURATION_TIME],
    arrow: CommonConstants.ARROW_FRAMES,
    collapse: CommonConstants.COLLAPSE_FRAMES
  },
  onInit() {
    this.contentTitle = this.$t('strings.content_title');
    this.imageCards[0].description = this.$t('strings.normal_description');
    this.imageCards[1].description = this.$t('strings.select_description');
    this.animationCards[0].description = this.$t('strings.phone_description');
    this.animationCards[1].description = this.$t('strings.state_description');
    this.animationCards[1].frames = this.arrow;
    this.animationCards[1].durationTime = 0;
    this.animationCards[0].durationTime = 0;
  },
  changeHookState(eventType) {
    if (eventType === 'touch') {
      return;
    }
    if (this.hook) {
      this.imageCards[1].src = '/common/images/ic_fork.png';
      this.hook = false;
    } else {
      this.imageCards[1].src = '/common/images/ic_hook.png';
      this.hook = true;
    }
  },
  changeShadow(eventType, shadowFlag) {
    if (eventType === 'click') {
      return;
    }
    if (shadowFlag) {
      this.imageCards[0].classType = 'main-img-touch';
    } else {
      this.imageCards[0].classType = 'img-normal';
    }
  },
  handleStartFrame(type) {
    if (type === 'dial') {
      this.animationCards[0].durationTime = CommonConstants.DURATION_TIME;
      this.$element('dialAnimation').start();
    } else {
      if (this.animationCards[1].flag) {
        this.animationCards[1].frames = this.collapse;
        this.animationCards[1].durationTime = this.durationTimeArray[0];
        this.$element('toggleAnimation').start();
        this.animationCards[1].flag = false;
        this.$element('toggleAnimation').stop();
      } else {
        this.animationCards[1].frames = this.arrow;
        this.animationCards[1].durationTime = this.durationTimeArray[1];
        this.$element('toggleAnimation').start();
        this.animationCards[1].flag = true;
        this.$element('toggleAnimation').stop();
      }
    }
  }
}
```

:::





