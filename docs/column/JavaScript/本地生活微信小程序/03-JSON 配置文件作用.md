# JSON 配置文件作用

## 一、 JSON 配置文件的作用

  上期讲解如何用微信开发者工具创建小程序项目，这时候可能就想着可以开始写代码了吧。



正所谓慢工出细活，在写代码之前应该先了解一下整体框架布局，还有各个文件的作用，知己知彼才能百"敲"不殆。



那就赶紧开始书接上回。`JSON` 是一种数据格式，在实际开发中，`JSON` 总是以配置文件的形式出现。小程序项目中也不例外：通过不同
的 `.json` 配置文件，可以对小程序项目进行不同级别的配置。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417215411411.png)



从上面图中可以看出，小程序项目中有 5 种 `json` 配置文件，分别是：

- 项目根目录中的 app.json 配置文件
- 项目根目录中的 project.config.json 配置文件
- 项目根目录中的 project.private.config.json 配置文件
- 项目根目录中的 sitemap.json 配置文件
- 每个页面文件夹中的 .json 配置文件

## 二、app.json 文件

  `app.json` 是当前小程序的全局配置，同时也是小程序项目的入口文件（可见其重要程度不亚于洛阳虎牢关），里面包括了小程序的所有页面路径、窗口外观、界面表现、底部 tab 等。
  Demo 项目里边的 `app.json` 配置内容如下：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417215633621.png)



  当创建小程序项目的时候，`style`默认是v2，代表着使用最新的样式版本，如果希望使用旧的样式版本，把`style`删除即可，现在来简单了解下这 4 个配置项的作用：

| 配置项          | 作用                                       |
| --------------- | ------------------------------------------ |
| pages           | 用来记录当前小程序所有页面的路径           |
| window          | 全局定义小程序所有页面的背景色、文字颜色等 |
| style           | 全局定义小程序组件所使用的样式版本         |
| sitemapLocation | 用来指明 sitemap.json 的位置               |

## 三、project.config.json & project.private.config 文件

- **project.config.json**

  `project.config.json` 是项目公共配置文件，用来记录对小程序开发工具所做的个性化配置，例如：

| 配置项      | 作用            |
| ----------- | --------------- |
| description | 文件描述        |
| setting     | 编译相关的配置  |
| projectname | 项目名称        |
| appid       | 小程序的账号 ID |

   这里项目名称不等于小程序名称。

- **project.private.config**

  `project.private.config` 是项目个人配置文件，相同设置优先级高于公共配置文件，也就是运行的时候个人配置文件里相同设置会覆盖公共配置文件。

| 配置项      | 作用           |
| ----------- | -------------- |
| description | 文件描述       |
| setting     | 编译相关的配置 |
| projectname | 小程序名称     |

## 四、sitemap.json

`sitemap.json` 文件用来配置小程序页面是否允许微信索引。当用户的搜索关键字和页面的索引匹配成功的时候，小程序的页面将可能展示在搜索结果中。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417215816449.png)





`action` 默认是开启的，如果不想被索引就将参数改为 `disallow` 即可。`page` 可以指定索引页面，`*` 默认为全部页面都能被索引。

| 配置项 | 作用           |
| ------ | -------------- |
| action | 页面是否被索引 |
| page   | 索引页面       |

:::tip  **注意**：



`sitemap` 的索引提示是默认开启的，如需要关闭 `sitemap` 的索引提示，可在小程序项目配置文件project.config.json 的 `setting `中配置字段 `checkSiteMap` 为 false。





如果没有这个`checkSiteMap`，补全就可以了。不过我这个微信开发工具好像就没有这个索引提示😂。

:::

## 五、页面的 .json 配置文件

小程序中的每一个页面，可以使用 `.json` 文件来对本页面的窗口外观进行配置，页面中的配置项会覆盖 `app.json` 的 `window` 中相同的配置项。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240417220714386-17133628705491.png)



动手测试了一下，确实会被覆盖。到了这里基本上把全部 `json` 文件全梳理了一遍。