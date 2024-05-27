# switch、chart组件的使用

基于switch组件和chart组件，实现线形图、占比图、柱状图，并通过switch切换chart组件数据的动静态显示。要求实现以下功能：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/SwitchChar%E7%BB%84%E4%BB%B6%E6%A1%88%E4%BE%8B.gif)

## 代码结构解读

```js
├──entry/src/main/js	     // 代码区
│  └──MainAbility
│     ├──common
│     │  └──images           // 图片资源
│     ├──i18n		     // 国际化中英文
│     │  ├──en-US.json			
│     │  └──zh-CN.json			
│     ├──pages
│     │  └──index
│     │     ├──index.css     // 首页样式文件	
│     │     ├──index.hml     // 首页布局文件
│     │     └──index.js      // 首页业务处理文件
│     └──app.js              // 程序入口
└──entry/src/main/resources  // 应用资源目录
```

## 构建主界面



本章节将介绍应用主页面的实现，页面从上至下分为两个部分：

- 使用switch组件实现切换按钮，用于控制chart组件数据的动静态显示。
- 使用chart组件依次实现线形图、占比图、柱状图。



本应用使用div组件用作外层容器，嵌套text、chart、switch等基础组件，共同呈现图文显示的效果。



在线形图中，lineOps用于设置线形图参数，包括曲线的样式、端点样式等。lineData为线形图的数据。



相对于线形图，占比图添加了自定义图例。其中rainBowData为占比图的数据。



在柱状图中，barOps用于设置柱状图参数，barData为柱状图数据。



:::details `page/index.html`

```html{6,11,19,20,68}
<div class="container">
    <div class="sub-container">
        <div class="switch-block">
            <text class="title">Switch_Chart</text>
            <text class="switch-info">{{ $t('strings.switch_info') }}</text>
            <switch onchange="change"></switch>
        </div>
        <div class="chart-block">
            <stack class="full-size">
                <image class="background-image" src="common/images/ic_line_bg.png"></image>
                <chart class="chart-data" type="line" options="{{ lineOps }}" datasets="{{ lineData }}">
                </chart>
            </stack>
            <text class="text-vertical">{{ $t('strings.line_title') }}</text>
        </div>
        <div class="gauge-block">
            <div class='flex-row-center full-size'>
                <stack class="flex-row-center rainbow-size">
                    <chart class="data-gauge" type="rainbow" segments="{{ rainBowData }}" effects="true"
                           animationduration="2000"></chart>
                    <div class="flex-column">
                        <div class="flex-row-center">
                            <text class="rainbow-percent">{{ percent }}</text>
                            <text class="rainbow-text">%</text>
                        </div>
                        <text class="rainbow-total">{{ $t('strings.rainbow_used') }}{{ used }}GB/128GB</text>
                    </div>
                </stack>
                <div class='flex-column'>
                    <div class="chart-legend-item">
                        <div class="chart-legend-icon rainbow-color-photo"></div>
                        <text class="chart-legend-text">{{ this.$t('strings.legend_photo') }} 64GB</text>
                    </div>
                    <div class="chart-legend-item">
                        <div class="chart-legend-icon rainbow-color-app"></div>
                        <text class="chart-legend-text">{{ this.$t('strings.legend_app') }} 15.6GB</text>
                    </div>
                    <div class="chart-legend-item">
                        <div class="chart-legend-icon rainbow-color-book"></div>
                        <text class="chart-legend-text">{{ $t('strings.legend_book') }} 10GB</text>
                    </div>
                    <div class="chart-legend-item">
                        <div class="chart-legend-icon rainbow-color-data"></div>
                        <text class="chart-legend-text">{{ $t('strings.legend_data') }} {{ systemDataSize }}GB</text>
                    </div>
                </div>
            </div>
            <text class="text-vertical">{{ $t('strings.rainbow_title') }}</text>
        </div>
        <div class="bar-block">
            <div class="flex-column full-size">
                <div class="flex-row-end bar-legend-margin">
                    <div class="flex-row-center">
                        <div class="bar-legend-icon bar-color-phone"></div>
                        <text class="chart-legend-text">{{ $t('strings.legend_phone') }}</text>
                    </div>
                    <div class="flex-row-center legend-item-space">
                        <div class="bar-legend-icon bar-color-pc "></div>
                        <text class="chart-legend-text">{{ $t('strings.legend_pc') }}</text>
                    </div>
                    <div class="flex-row-center">
                        <div class="bar-legend-icon bar-color-sport"></div>
                        <text class="chart-legend-text">{{ $t('strings.legend_sport') }}</text>
                    </div>
                </div>
                <stack class="full-size bar-height">
                    <image class="background-image" src="common/images/ic_bar_bg.png"></image>
                    <chart class="data-bar" type="bar" id="bar-chart1" options="{{ barOps }}" datasets="{{ barData }}">
                    </chart>
                </stack>
            </div>
            <text class="text-vertical">{{ $t('strings.bar_title') }}</text>
        </div>
    </div>
</div>
```

:::





## 动态显示数据



在上一章节讲解了switch组件实现切换按钮，接下来实现switch组件的点击事件。在回调方法中设置chart组件静态或动态显示，静态时chart组件显示静态数据，动态时利用interval定时器动态生成并显示随机数据。





实现changeLine方法更新线形图数据。遍历所有数据，重新生成随机数并设置每个点的数据、形状、大小和颜色，最后为lineData重新赋值。





实现changeGauge方法更新占比图数据，每三秒增长5%的数据。





实现changeBar方法更新柱状图数据。遍历柱状图所有的数据组，获取每组的数据后，再次遍历每组数据，生成随机数并为barData重新赋值。





:::details `pages\index\index.js`



```js
import CommonConstants from '../../common/constants/CommonConstants';

const coefficients = CommonConstants.PRECISION_COEFFICIENT;
const addSize = CommonConstants.RAINBOW_ADD_SIZE;
const addPercent = CommonConstants.RAINBOW_PERCENT_ADD;

export default {
  data: {
    // Line and bar interval.
    interval: null,

    // rainbow interval.
    rainbowInterval: null,

    // Used memory.
    used: CommonConstants.RAINBOW_USED_SIZE,

    // Percentage used.
    percent: CommonConstants.RAINBOW_USED_PERCENT,

    // Data length.
    dataLength: CommonConstants.LINE_DATA_LENGTH,

    // Number of bar chart groups.
    barGroup: CommonConstants.BAR_DEFAULT_DATA.length,

    // Line chart data.
    lineData: null,

    // Proportion system data.
    systemDataSize: CommonConstants.RAINBOW_SYSTEM_SIZE,

    // Proportion chart data.
    rainBowData: CommonConstants.RAINBOW_DEFAULT_DATA,

    // Bar chart data.
    barData: CommonConstants.BAR_DEFAULT_DATA,

    // Line chart style.
    lineOps: {
      xAxis: {
        min: 0,
        max: CommonConstants.LINE_X_MAX,
        display: false
      },
      yAxis: {
        min: 0,
        max: CommonConstants.LINE_Y_MAX,
        display: false
      },
      series: {
        lineStyle: {
          width: '1px',
          smooth: true
        },
        headPoint: {
          shape: 'circle',
          size: CommonConstants.LINE_POINT_SIZE,
          strokeWidth: CommonConstants.LINE_POINT_WIDTH,
          fillColor: '#FFFFFF',
          strokeColor: '#0A59F7',
          display: true
        },
        loop: {
          margin: CommonConstants.LINE_MARGIN,
          gradient: true
        }
      }
    },

    // Bar chart style.
    barOps: {
      xAxis: {
        min: 0,
        max: CommonConstants.BAR_X_MAX,
        display: false,
        axisTick: CommonConstants.BAR_X_TICK
      },
      yAxis: {
        min: 0,
        max: CommonConstants.BAR_Y_MAX,
        display: false
      }
    }
  },

  /**
   * Initialize
   */
  onInit() {
    this.changeLine();
  },

  /**
   * Callback for switching the status of the switch button.
   */
  change(event) {
    if (event.checked) {
      this.interval = setInterval(() => {
        // Update line chart data.
        this.changeLine();
        // Updating bar chart Data.
        this.changeBar();
      }, CommonConstants.LINE_INTERVAL_TIME);
      this.rainbowInterval = setInterval(() => {
        // Update the proportion chart data.
        this.changeGauge();
      }, CommonConstants.RAINBOW_INTERVAL_TIME);
    } else {
      clearInterval(this.interval);
      clearInterval(this.rainbowInterval);
    }
  },

  /**
   * Update line chart data.
   */
  changeLine() {
    const dataArray = [];
    for (let i = 0; i < this.dataLength; i++) {
      const nowValue = Math.floor(Math.random() * CommonConstants.LINE_RANDOM_MAX + 1);
      const obj = {
        'value': nowValue, // Y coordinate
        'pointStyle': {
          'shape': 'circle', // Node shape
          'size': CommonConstants.LINE_POINT_SIZE,
          'fillColor': '#FFFFFF',
          'strokeColor': '#0A59F7'
        }
      };
      dataArray.push(obj);
    }
    this.lineData = [
      {
        // The color of the line.
        strokeColor: '#0A59F7',
        // Gradient fill color.
        fillColor: '#0A59F7',
        data: dataArray,
        gradient: true
      }
    ];
  },

  /**
   * Update the proportion chart data.
   */
  changeGauge() {
    const sysData = this.rainBowData[this.rainBowData.length - 2];
    sysData.value += addPercent;
    this.percent += addPercent;
    // Avoid loss of precision when adding decimals.
    this.used = (this.used * coefficients + addSize * coefficients) / coefficients;
    this.systemDataSize = (this.systemDataSize * coefficients + addSize * coefficients) / coefficients;
    if (sysData.value + CommonConstants.RAINBOW_OTHER_PERCENT > CommonConstants.RAINBOW_ALL_PERCENT) {
      sysData.value = CommonConstants.RAINBOW_SYSTEM_PERCENT;
      this.percent = CommonConstants.RAINBOW_USED_PERCENT;
      this.used = CommonConstants.RAINBOW_USED_SIZE;
      this.systemDataSize = CommonConstants.RAINBOW_SYSTEM_SIZE;
    }
    this.rainBowData = this.rainBowData.splice(0, this.rainBowData.length);
  },

  /**
   * Updating bar chart data.
   */
  changeBar() {
    for (let i = 0; i < this.barGroup; i++) {
      const dataArray = this.barData[i].data;
      for (let j = 0; j < this.dataLength; j++) {
        dataArray[j] = Math.floor(Math.random() * CommonConstants.BAR_RANDOM_MAX + 1);
      }
    }
    this.barData = this.barData.splice(0, this.barGroup + 1);
  }
};
```

:::