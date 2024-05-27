# C++ Qt开发：Qt的安装与配置

Qt是一种C++编程框架，用于构建图形用户界面（GUI）应用程序和嵌入式系统。Qt由Qt公司（前身为Nokia）开发，提供了一套跨平台的工具和类库，使开发者能够轻松地创建高效、美观、可扩展的应用程序。其被广泛用于开发桌面应用程序、嵌入式系统、移动应用程序等。无论是初学者还是经验丰富的开发者，Qt都为构建高质量、可维护的应用程序提供了丰富的工具和支持。

关于C++ Qt的一些关键特点和用途：

1. **跨平台性：** Qt是一个跨平台的框架，支持主流的操作系统，包括Windows、macOS、Linux以及一些嵌入式系统。这使得开发者能够编写一次代码，然后在多个平台上运行，大大简化了跨平台应用程序的开发。
2. **图形用户界面（GUI）设计：** Qt提供了强大的GUI工具包，允许开发者通过可视化设计工具创建用户界面。Qt的设计哲学注重直观性和易用性，使得创建各种复杂的GUI应用程序变得相对容易。
3. **信号与槽机制：** Qt引入了一种灵活的信号与槽机制，用于处理对象之间的通信。这种机制使得对象能够在不直接了解其他对象的情况下相互通信，提高了代码的可维护性和可扩展性。
4. **模块化设计：** Qt采用了模块化的设计，提供了丰富的类库覆盖了诸如图形渲染、文件I/O、网络通信、数据库访问等多个领域。这使得开发者能够在项目中选择需要的模块，避免不必要的代码冗余。
5. **国际化支持：** Qt支持国际化和本地化，使得应用程序能够轻松地适应不同的语言和文化环境。
6. **开放源代码：** Qt是一款开源框架，拥有活跃的社区支持。开发者可以自由使用、修改和分发Qt的源代码，也可以根据需要选择商业许可证。
7. **Qt Creator集成开发环境（IDE）：** Qt Creator是专为Qt设计的集成开发环境，提供了强大的代码编辑、调试和可视化设计工具，使得开发过程更加高效。

#  如何安装与配置

安装和配置Qt通常涉及以下步骤。请注意，这里提供的步骤基于一般情况，具体步骤可能会有所不同，具体取决于您使用的操作系统。以下是一个基本的指南：

Qt的下载可以去官方网站，这里我就以`5.14.2`这个版本为例，请读者也和我使用相同的版本，如下结果是Qt下载页面；

- 下载地址：https://download.qt.io/archive/qt/5.14/5.14.2/

![image-20231209232252151](01_C++ Qt开发：Qt的安装与配置.assets/image-20231209232252151-17021353735382.png)

这里我认为有必要说一下这些目录分别代表了什么，这个解释我将其归纳为了如下表所示的说明信息，读者可自行参考学习；

|       **目录**       |                           **说明**                           |
| :------------------: | :----------------------------------------------------------: |
|       archive        | 各个Qt版本的安装包、配套工具包等（注意，清华站相比主站做了裁剪，只能看到5.9之后的版本） |
|  community_releases  |                  社区定制的Qt 库，不用理会                   |
| development_releases | 开发版，有新的和旧的不稳定版本，在Qt 开发过程中的非正式版本。 |
|       learning       |                         一些学习资料                         |
|  linguist_releases   |              一款软件，目前我没用到，未仔细研究              |
|       ministro       |              迷你版，目前是针对Android的版本。               |
|  official_releases   | 正式发布版，是与开发版相对的稳定版Qt库和开发工具，我们选择时，应选择此处的版本 |
|        online        |                        Qt 在线安装源                         |
|      snapshots       |         预览版，最新的开发测试中的 Qt 库和开发工具。         |

当下载好对应的安装程序之后就可以安装了，直接`qt-opensource-windows-x86-5.14.2.exe`运行程序，会出下如下界面，直接点击下一步跳转到登录页面，这个登陆页面可以直接输入一个错误的账号密码，然后点击返回按钮，之后就可以跳转到安装页面，此页面并不是强制的。笔者这里将QT软件安装在D盘：

```
D:\Qt\Qt5.14.2
```

![image-20231209234218870](01_C++ Qt开发：Qt的安装与配置.assets/image-20231209234218870.png)





为了保证安装组件的齐全，这里读者务必全部打勾，完全充分安装需要10GB的空间，此时应做好准备，如下图所示；

![image-20231209234317307](01_C++ Qt开发：Qt的安装与配置.assets/image-20231209234317307-17021365991453.png)



安装结束后就可以看到开始菜单的，`Qt Creator 4.11.1 (Community)`程序，直接打开该程序就可以进入到Qt的开发页面中，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210004311126.png)





以上步骤是一个基本的安装和配置过程，具体步骤可能因Qt版本和操作系统而异。在安装和配置过程中，可以参考Qt的官方文档和安装向导，这将提供更详细和特定的说明。

# 配置Visual Studio

Qt 提供了 Visual Studio 插件，以便更方便地在 Visual Studio 中进行 Qt 项目的开发。以下是配置 Qt Visual Studio 插件的一般步骤：

首先要下载对应的插件文件，根据读者自己安装的Visual Studio版本来选择不同的插件，由于我使用的是`VS2013`所以这里选择`2.3.0`的版本，如下图读者可自行选择对应的版本下载使用。

- 插件下载：https://download.qt.io/development_releases/vsaddin/2.3.0/

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231209235621077-17021373828905.png)





读者首先需要安装好`Visual Studio`开发环境并确保`Qt`已安装，只需要双击运行`qt-vsaddin-msvc2013-2.3.0.vsix`等待初始化并直接点击下一步即可完成，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231209235847626-17021375285097.png)

如果发现用不了，那就下载补丁包再次安装试试把。

```c
https://marketplace.visualstudio.com/items?itemName=TheQtCompany.QtVisualStudioTools
```

如果安装了没有出来插件，就就到Visual Studio 的插件商店 搜索 `QT` 进行直接安装。



注意，如果说 `vs2013` 出现未能建立到[服务器](https://so.csdn.net/so/search?q=服务器&spm=1001.2101.3001.7020)的连接的错误框，且错误信息如下。
请求被中止：未能创建SSL/TLS安全通道。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210003248630-17021395702541.png)





那我们可以通过下`工具 -- 库程序包管理器(N) -- 程序包管理器控制台(o) -- 底部弹出控制台输入界面` ,输入如下命令解决问题。

```
[Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol-bOR [Net.SecurityProtocolType]::Tls12
```

原因排查：[Nuget](https://so.csdn.net/so/search?q=Nuget&spm=1001.2101.3001.7020)官方网站已经不支持http访问， 只支持https，但是VS2013访问https默认使用的协议为Tls1.1，但是`Nuget`官方网站只支持Tls1.2，这是两边不匹配导致的问题。



打开QT的安装目录，我们可以看到如下图所示的开发库，这里由于最低版本是`VS2015`的，所以就以该案例为例子讲解配置流程，读者需要安装最低版本为`Visual Studio 2015`才可以正常配置，即使用`MVSC2015_64` C++编译器，进行编译QT工程。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231209235824243-17021375061686.png)



这里我们需要将QT和VS Studio 做整合，所以此处的头文件和库目录`MVSC`编译器 需要感知到的头文件和库文件。如果是和`QT Creator`做整合，则这里指定的头文件和库文件，应该`mingw73_32目录下`，即使用`Mingw` C++编译器，进行编译QT工程。

现在我们打开环境变量，并依次配置如下两个头文件到操作系统中,建议，系统变量和环境变量都设置注入进来！

- 头文件目录：D:\Qt\Qt5.14.2\5.14.2\msvc2015_64\include
- 库目录：D:\Qt\Qt5.14.2\5.14.2\msvc2015_64\lib

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210004018155-17021400192713.png)



接着打开`visual studio 2013`，点击`Qt VS Tools>Qt Options>add new Qt version`，点击`Path`选择位置，当配置好以后那么就可以使用这个环境变量了，如下图所示；

```
D:\Qt\Qt5.14.2\5.14.2\msvc2015_64\
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210003920026-17021399615172.png)





此时读者可以新建一个项目，在项目选项卡中就会出现Qt的相关程序创建流程，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210004127636-17021400888924.png)



以上步骤是一个通用的配置过程，具体步骤可能会因使用的 Qt 和 Visual Studio 版本而有所不同。在进行配置时，请确保参考 Qt 和 Visual Studio 的官方文档，以获取最准确和详细的说明。



# 如何打包Qt程序

Qt Creator是由Qt公司开发的一个集成开发环境（IDE），专门用于Qt应用程序的设计、开发和调试。它提供了一套工具，使得开发者能够更轻松地创建跨平台的图形用户界面（GUI）应用程序以及其他类型的应用程序。Qt Creator作为Qt应用程序的首选IDE，提供了全面的开发工具，使得开发者能够高效、便捷地进行Qt项目的开发。其友好的用户界面和强大的功能集成，使得它成为许多开发者选择的首选工具之一。

Qt程序的创建非常简单，只需要打开Qt Creator主页面，选中文件并新建，在弹出的选择菜单中Qt Widgets Application用于新建窗体应用程序，而Qt Console Application则用于新建命令行程序，我们以窗体程序为例，直接点击Choose按钮创建新程序，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210004409912-17021402513425.png)

读者只需要根据提示信息选择对应的创建位置其他参数保持默认即可，需要注意在`Kit`选项卡中，读者最好选择MinGW编译器以方便课程的跟进，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210004553646-17021403550676.png)



此时我们只需要点击运行按钮，程序就可以被启动，如下图所示就是一个启动后的案例；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210013515335-170214331623317.png)





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210013538384.png)



当您在Qt程序编译完成后，需要将其独立于开发环境并在其他机器上正常运行时，可以通过手动拷贝所需文件或使用Qt提供的工具进行自动打包。以下是手动拷贝所需文件的步骤以及使用`windeployqt`工具进行自动打包的说明：

打开`Qt自带的命令终端程序`，此处的终端程序在开始菜单中可以找到。笔者的在如下这个路径中。

```
C:\Users\82737\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Qt\5.15.2\MinGW 8.1.0 (32-bit)
```

然后，跳转到编译好的程序中去。此时如果运行程序则会提示找不到库，这就是没有打包造成的，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210011747474-170214226907915.png)



执行`windeployqt untitled.exe`命令进行自动打包。如果是自动打包我们可以进入Qt提供的命令行页面，跳转到需要打包程序的目录下，执行命令即可打包出所有的依赖文件，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210092554595-17021715564971.png)

操作期间如果报错！说`windeployqt`  不是内部或外部命令，也不是可运行的程序 或批处理文件。我们可以通过设置环境变量来处理。



新增系统Path变量值`D:\Qt\Qt5.14.2\5.14.2\mingw73_32\bin`，并**重新打开命令窗口**。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210013152576-170214311379016.png)



如果说，在此之前的环境变量，用的可能是`mvsc`编译器，并且对项目已经进行了打包编译成Release了。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210010603824-170214156545711.png)



则可能会出现如下错误：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210014359942-170214384126218.png)



我们需要在修改环境变量之后，对`QT Creator` 做一次重启，甚至对电脑做一次重启，再次重新编译! 



**原因排查**：

因为之前已经正确编译，并进行了打包，可以放到其他未配置编程环境的电脑运行，而且从未对工程文件进行移动（如果对工程文件进行了移动，一些动态链接库的地址可能会发生改变），因此很大可能是电脑环境配置发生了改变。

再如果发现重启编译不行，请参照该篇博客进行处理：

```
https://blog.csdn.net/hanhui22/article/details/109595193
```

处理核心流程为替换掉`libstdc++-6.dll` 替换成该`mingw`编译器的`同名dll.`

```
D:\Qt\Qt5.14.2\5.14.2\mingw73_32\bin\libstdc++-6.dll
```

再将Path环境变量，指向的头文件目录，库文件目录，编译器目录。全部都使用`QT Creator`的 `mingw`编译器所依赖的环境。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210093025832-17021718270342.png)



**原因排查**：

仔细观察之后发现 这个命令生成`libstdc++-6.dll`文件和我们`mingw`下的`libstdc++-6.dll`文件 大小不一样。此时再双击.exe文件即可打开，将这个文件夹发给一个没有安装过Qt 的电脑，也可以打开。



如果需要去掉不必要的库文件，可以使用`--no-`参数排除多余的动态链接库。例如，去掉ANGLE和OpenGL Software支持：

```c
windeployqt --no-angle --no-opengl-sw untitled.exe
```

打包完成后，手动删除多余文件，只保留以下文件即可：

- `untitled.exe`（或您的程序名称）
- `libgcc_s_dw2-1.dll`
- `libstdc++-6.dll`
- `libwinpthread-1.dll`
- `Qt5Core.dll`
- `Qt5Gui.dll`
- `Qt5Widgets.dll`
- `platforms/qwindows.dll`

此时再双击.exe文件即可打开，将这个文件夹发给一个没有安装过Qt 的电脑，也可以打开。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210093501308-17021721026423.png)



当然，如果是您是手动拷贝文件而不使用打包命令，则只需要从Qt安装目录下对应的编译器`bin`目录中复制以下文件到您的程序目录：

- `libgcc_s_dw2-1.dll`
- `libstdc++-6.dll`
- `libwinpthread-1.dll`
- `Qt5Core.dll`
- `Qt5Gui.dll`
- `Qt5Widgets.dll`

从`D:\Qt\Qt5.14.2\5.14.2\mingw73_32`目录中复制`platforms`文件夹，仅保留其中的`qwindows.dll`文件。

通过执行这些步骤，您将能够将Qt程序独立于开发环境，并在其他机器上运行。确保使用正确的Qt版本和编译工具，以确保库和依赖项的正确匹配。



当我们打包完成后，直接运行主程序将可以脱离Qt环境直接使用，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210094103657-17021724652654.png)
