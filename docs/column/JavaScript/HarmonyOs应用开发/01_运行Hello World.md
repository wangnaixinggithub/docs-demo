# 运行Hello World

## 下载与安装DevEco Studio

在HarmonyOS应用开发学习之前，需要进行一些准备工作，首先需要完成开发工具DevEco Studio的下载与安装以及环境配置。

进入[DevEco Studio下载官网](https://developer.harmonyos.com/cn/develop/deveco-studio)，单击“立即下载”进入下载页面。



DevEco Studio提供了Windows版本和Mac版本选择，可以根据操作系统选择对应的版本进行下载。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240511111724136.png)



下载完成后，双击下载的“deveco-studio-xxxx.exe”，进入DevEco Studio安装向导，在如下界面选择安装路径，默认安装于`"C:\Program Files"`下，也可以单击`"Browse..."`指定其他安装路径，然后单击`"Next"`。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212310855.png)



如下安装选项界面勾选DevEco Studio后，单击`"Next"`，直至安装完成。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212326304.png)





安装完成后，单击`"Finish"`完成安装。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212345319.png)



## 配置环境

双击已安装的DevEco Studio快捷方式进入配置页面，IDE会进入配置向导，选择Agree，同意相应的条款，进入配置页。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212410744.png)



进入DevEco Studio配置页面，首先需要进行基础配置，包括Node.js与Ohpm的安装路径设置，选择从华为镜像下载至合适的路径。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212428199.png)

单击`"Next"`进入SDK配置，设置为合适的路径。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212455606.png)



点击`"Next"`后会显示`"SDK License Agreement"`，阅读相关协议后，勾选`"Accept"`。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212514223.png)



确认完成后，单击`"Next"`，进入下一步。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212531512.png)



等待配置自动下载完成，完成后，单击`"Finish"`，IDE会进入欢迎页，我们也就成功配置好了开发环境。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212553647.png)



准备工作完成后，接下来将进入DevEco Studio进行工程创建和运行。

## 创建项目

如果你是首次打开DevEco Studio，那么首先会进入欢迎页。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212635397.png)

在欢迎页中单击Create Project，进入项目创建页面。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212653622.png)



选择`"Application"`，然后选择`"Empty Ability"`，单击‘Next’进入工程配置页。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125212830717.png)

配置页中，详细信息如下：

- Project name是开发者可以自行设置的项目名称，这里根据自己选择修改为自己项目名称。
- Bundle name是包名称，默认情况下应用ID也会使用该名称，应用发布时对应的ID需要保持一致。
- Save location为工程保存路径，建议用户自行设置相应位置。
- Compile SDK是编译的API版本，这里默认选择API9。
- Model选择Stage模型，其他保持默认即可。

然后单击`"Finish"`完成工程创建，等待工程同步完成。



## 认识DevEco Studio界面

进入IDE后，我们首先了解一下基础的界面。整个IDE的界面大致上可以分为四个部分，分别是代码编辑区、通知栏、工程目录区以及预览区。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213144741-170618950606112.png)



- 代码编辑区

中间的是代码编辑区，你可以在这里修改你的代码，以及切换显示的文件。通过按住Ctrl加鼠标滚轮，可以实现界面的放大与缩小。

- 通知栏

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213231364-170618955248413.png)



在编辑器底部有一行工具栏，主要介绍常用信息栏，其中Run是项目运行时的信息栏，Problems是当前工程错误与提醒信息栏，Terminal是命令行终端，在这里执行命令行操作，PreviewerLog是预览器日志输出栏，Log是模拟器和真机运行时的日志输出栏。在后续使用中会陆续接触。

- 工程目录区

  左侧为工程目录区，后续章节会详细介绍。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213320582.png)

- 预览区

单击右上角Previewer，可以预览相应的文件UI展示效果。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213454710.png)



预览器提供了一些基本功能，包括旋转屏幕，切换显示设备及多设备预览等。单击旋转按钮，可以切换竖屏和横屏显示的效果。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213540492-170618974152617.png)



也可以单击如下列表按钮，切换显示的设备类型。弹出框内会显示Available Profiles，即可用的设备类型。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213647495.png)

如单击Foldable切换设备，也可以单击旋转按钮切换Foldable的横竖屏显示模式。

打开Muti-profile preview开关，可以实现多个尺寸设备的实时预览。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213736143.png)

单击预览器右上角组件预览按钮，可以进入组件预览界面。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213821766.png)

点击相应组件，代码文件中会框选对应的组件代码部分，下方则对应当前组件的基本属性。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213846545.png)



## 运行Hello World

IDE提供了本地模拟器供开发者使用，我们首先需要下载安装本地模拟器，然后进行运行工程。

- 单击顶部工具栏Tools>Device Manager。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125213921642-170618996251622.png)

- 选择Local Emulator，设置合适的Local Emulator Location存储地址，然后单击 +New Emulator。

  ![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125214302152-170619018359423.png)

选择Huawei_Phone手机模拟器，单击`'Next'`，进入模拟器系统下载页。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125214403152.png)



选择下载api9的系统镜像，然后单击`'Next'`，等待下载完成。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125215424891.png)



下载完成后，进行创建相应的手机模拟器，单击Finish完成创建。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125215518314.png)



下载完成后，在Local Emulator页面中会出现创建的手机模拟器，点击Actions按钮，就能够启动模拟器。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125215553871-170619095469726.png)



模拟器启动后，点击上方启动按钮，将Hello World工程运行到模拟器上

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125215707471-170619102828027.png)



IDE构建完成后，即可在模拟器上看到运行效果，我们也就完成了Hello World工程在模拟器上的运行。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125220131794.png)

## 了解基本工程目录

### 工程级目录

工程的目录结构如下。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125220207774.png)

其中详细如下：

- AppScope中存放应用全局所需要的资源文件。
- entry是应用的主模块，存放HarmonyOS应用的代码、资源等。
- oh_modules是工程的依赖包，存放工程依赖的源文件。
- build-profile.json5是工程级配置信息，包括签名、产品配置等。
- hvigorfile.ts是工程级编译构建任务脚本，hvigor是基于任务管理机制实现的一款全新的自动化构建工具，主要提供任务注册编排，工程模型管理、配置管理等核心能力。
- oh-package.json5是工程级依赖配置文件，用于记录引入包的配置信息。

在AppScope，其中有resources文件夹和配置文件app.json5。AppScope>resources>base中包含element和media两个文件夹,

- 其中element文件夹主要存放公共的字符串、布局文件等资源。
- media存放全局公共的多媒体资源文件。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125220351201-170619143237530.png)

### 模块级目录



entry>src目录中主要包含总的main文件夹，单元测试目录ohosTest，以及模块级的配置文件。

- main文件夹中，ets文件夹用于存放ets代码，resources文件存放模块内的多媒体及布局文件等，module.json5文件为模块的配置文件。
- ohosTest是单元测试目录。
- build-profile.json5是模块级配置信息，包括编译构建配置项。
- hvigorfile.ts文件是模块级构建脚本。
- oh-package.json5是模块级依赖配置信息文件。

进入src>main>ets目录中，其分为entryability、pages两个文件夹。

- entryability存放ability文件，用于当前ability应用逻辑和生命周期管理。
- pages存放UI界面相关代码文件，初始会生成一个Index页面。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125220405621.png)



resources目录下存放模块公共的多媒体、字符串及布局文件等资源，分别存放在element、media文件夹中。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125220638046.png)

### app.json5

AppScope>app.json5是应用的全局的配置文件，用于存放应用公共的配置信息。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125220723180.png)



其中配置信息如下：

- bundleName是包名。
- vendor是应用程序供应商。
- versionCode是用于区分应用版本。
- versionName是版本号。
- icon对应于应用的显示图标。
- label是应用名。

### module.json5

entry>src>main>module.json5是模块的配置文件，包含当前模块的配置信息。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125220853664.png)



其中module对应的是模块的配置信息，一个模块对应一个打包后的hap包，hap包全称是HarmonyOS Ability Package，其中包含了ability、第三方库、资源和配置文件。其具体属性及其描述可以参照下表.



**module.json5默认配置属性及描述**



|       **属性**        |                           **描述**                           |
| :-------------------: | :----------------------------------------------------------: |
|        `name`         | 该标签标识当前module的名字，module打包成hap后，表示hap的名称，标签值采用字符串表示（最大长度31个字节），该名称在整个应用要唯一。 |
|        `type`         |   表示模块的类型，类型有三种，分别是entry、feature和har。    |
|      `srcEntry`       |                   当前模块的入口文件路径。                   |
|     `description`     |                     当前模块的描述信息。                     |
|     `mainElement`     | 该标签标识hap的入口ability名称或者extension名称。只有配置为mainElement的ability或者extension才允许在服务中心露出。 |
|     `deviceTypes`     | 该标签标识hap可以运行在哪类设备上，标签值采用字符串数组的表示。 |
| `deliveryWithInstall` | 标识当前Module是否在用户主动安装的时候安装，表示该Module对应的HAP是否跟随应用一起安装。- true：主动安装时安装。- false：主动安装时不安装。 |
|  `installationFree`   | 标识当前Module是否支持免安装特性。- true：表示支持免安装特性，且符合免安装约束。- false：表示不支持免安装特性。 |
|        `pages`        | 对应的是main_pages.json文件，用于配置ability中用到的page信息。 |
|      `abilities`      | 是一个数组，存放当前模块中所有的ability元能力的配置信息，其中可以有多个ability。 |

对于abilities中每一个ability的属性项，其描述信息如下表



**abilities中对象的默认配置属性及描述**

|        **属性**         |                           **描述**                           |
| :---------------------: | :----------------------------------------------------------: |
|         `name`          | 该标签标识当前ability的逻辑名，该名称在整个应用要唯一，标签值采用字符串表示（最大长度127个字节）。 |
|       `srcEntry`        |                   ability的入口代码路径。                    |
|      `description`      |                     ability的描述信息。                      |
|         `icon`          | ability的图标。该标签标识ability图标，标签值为资源文件的索引。该标签可缺省，缺省值为空。如果ability被配置为MainElement，该标签必须配置。 |
|         `label`         |                      ability的标签名。                       |
|    `startWindowIcon`    |                       启动页面的图标。                       |
| `startWindowBackground` |                      启动页面的背景色。                      |
|        `visible`        | ability是否可以被其他应用程序调用，true表示可以被其它应用调用， false表示不可以被其它应用调用。 |
|        `skills`         | 标识能够接收的意图的action值的集合，取值通常为系统预定义的action值，也允许自定义。 |
|       `entities`        |              标识能够接收Want的Entity值的集合。              |
|        `actions`        | 标识能够接收的Want的Action值的集合，取值通常为系统预定义的action值，也允许自定义。 |

### main_pages.json

src/main/resources/base/profile/main_pages.json文件保存的是页面page的路径配置信息，所有需要进行路由跳转的page页面都要在这里进行配置。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240125221941442-170619238238036.png)