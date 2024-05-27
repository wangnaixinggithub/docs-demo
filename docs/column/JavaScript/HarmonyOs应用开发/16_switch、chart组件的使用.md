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





## 动态显示数据



在上一章节讲解了switch组件实现切换按钮，接下来实现switch组件的点击事件。在回调方法中设置chart组件静态或动态显示，静态时chart组件显示静态数据，动态时利用interval定时器动态生成并显示随机数据。





实现changeLine方法更新线形图数据。遍历所有数据，重新生成随机数并设置每个点的数据、形状、大小和颜色，最后为lineData重新赋值。





实现changeGauge方法更新占比图数据，每三秒增长5%的数据。





实现changeBar方法更新柱状图数据。遍历柱状图所有的数据组，获取每组的数据后，再次遍历每组数据，生成随机数并为barData重新赋值。