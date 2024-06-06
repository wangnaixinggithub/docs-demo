GDI绘图

:::details `首先，什么是GDI绘图?`

GDI (Graphics Device Interface)是图形设备接口的英文缩写，处理Windows程序的图形和图像输出。程序员不需要关心硬件设备及设备驱动，就可以将应用程序的输出转换为硬件设备上的输出，实现应用程序与硬件设备的隔离，大大简化程序开发工作。在Windows操作系统中，图形界面应用程序通常离不开GDI，利用GDI所提供的众多函数可以方便地在屏幕、打印机以及其他输出设备上实现输出文本、图形等操作。

:::



几个基本概念需要了解

:::details `设备环境(DC) `

设备无关性（也称设备独立性)是Windows的主要功能之一。应用程序可以在各种设备上进行绘制和打印输出，系统统一把所有外部设备都`当作文件`来看待，只要安装了它们的驱动程序，应用程序就可以像`使用文件一样操纵、使用这些设备`

GDI代表应用程序和设备驱动程序进行交互。为了实现设备无关性，引入了`逻辑设备`和`物理设备`这两个概念。

在应用程序中，使用逻辑设备名称来请求使用某类设备，而系统在实际执行时，使用的是物理设备名称。

设备无关性的支持包含在两个动态链接库中，第一个是GDI相关动态链接库，称为图形设备接口第二个是设备驱动程序，设备驱动程序的名称取决于应用程序绘制输出的设备。

:::



当程序在客户区中显示文本或图形时，我们通常称程序在`"绘制"`客户区。GDI在加载驱动程序后，准备设备进行绘制操作，例如选择线条颜色和宽度、画刷颜色和图案、字体名称、裁剪区域等。这些任务是通过创建和维护设备环境(DC)来完成的。**DC是定义一组图形对象及其关联属性以及影响输出的图形模式的结构体。**



:::details  `与DC相关的部分图形对象及属性`



**图形对象属性**

- 画笔样式、宽度和颜色
- 画刷样式、颜色、图案和原点
- 字体字体名称、字体大小、字符宽度、字符高度、字符集等
- 位图大小(以字节为单位)，尺寸(以像素为单位)、颜色格式、压缩方案等
- 路径形状
- 区域位置和尺寸

> 应用程序不能直接访问DC，而是通过调用各种函数间接地对DC结构进行操作。

**图形模式描述**

Windows支持5种图形模式，允许应用程序指定颜色的混合方式、输出的位置、输出的缩放方式等。下表描述了存储在DC中的这些模式。

|    背景模式  文本的背景色与现有窗口或屏幕颜色的混合方式等    |
| :----------------------------------------------------------: |
| **绘图模式 画笔、画刷的颜色与目标显示区域颜色的混合方式等**  |
| **映射模式 如何将图形输出从逻辑坐标映射到客户区、屏幕或打印机纸张** |
|      **多边形填充模式  如何使用画刷填充复杂区域的内部**      |
|       **拉伸模式  当位图被放大或缩小时如何计算新位图**       |
|                                                              |

**DC类型描述**

Windows有4种类型的DC，分别是显示设备DC、打印DC、内存DC、信息DC，每种类型的DC都有特定的用途，如下表所述。

|       显示设备DC 在显示器上进行绘图操作        |
| :--------------------------------------------: |
|   **打印DC  在打印机或绘图仪上进行绘图操作**   |
| **内存DC  通常是在内存中的位图上进行绘图操作** |
|          **信息DC  获取设备环境信息**          |

> 也就是说，通过设备环境，不仅可以在屏幕窗口进行绘图，也可以在打印机或绘图仪上进行绘图，还可以在内存中的位图上进行绘图。



**获取显示设备DC句柄**

DC句柄是程序使用GDI函数的通行证，几乎所有的GDI绘图函数都需要一个DC句柄参数，有了DC句柄，便能随心所欲地绘制窗口客户区。



当窗口客户区的部分或全部变为`"无效"`且必须`"更新"`时，比如说改变窗口大小、最小化/最大化窗口、拖动窗口一部分到屏幕外再拖动回来时，应用程序将会获取到WM_PAINT消息。窗口过程的大部分绘图操作是在处理WM_PAINT消息期间进行的，可以通过调用`BeginPaint`函数来获取显示DC句柄。

`WM_PAINT`消息的处理逻辑一般如下∶

```c
 HDC hdc;//显示设备DC句柄
 PAINTSTRUCT ps;//绘图结构体

 hdc = ::BeginPaint(hwnd, &ps);

 //TODO:在这里开始你的 绘图代码 编写

 ::EndPaint(hwnd, &ps);

```

`BeginPaint`函数的返回值就是需要更新区域的DC句柄`hdc`。



`BeginPaint`返回的`hdc`对应的尺寸仅是无效区域，程序无法通过该句柄绘制到这个区域以外的地方。由于窗口过程每次接收到`WM_PAINT`消息时的无效区域可能不同，因此这个`hdc`值仅在当次`WM_PAINT`消息中有效，程序不应该保存它并把它，用在`WM_PAINT`消息以外的代码中。`BeginPaint`和`EndPaint`函数只能用在WM_PAINT消息中，因为只有这时才存在无效区域。`BeginPaint`函数还有一个作用就是把无效区域有效化，如果不调用`BeginPaint`，那么窗口的无效区域就一直不为空，系统会一直发送`WM_PAINT`消息。







当窗口客户区中存在一个无效区域，这将导致Windows在应用程序的消息队列中放置一条`WM_PAINT`消息，即只有当程序客户区的一部分或全部无效时，窗口过程才会接收到`WM_PATNT`消息。Windows在内部为每个窗口都保存了一个绘制信息结构`PAINTSTRUCT`，这个结构保存着一个可以覆盖该无效区域的最小矩形的坐标和一些其他信息，这个最小矩形称为无效矩形。如果在窗口过程处理一条WM_PAINT消息之前，窗口客户区中又出现了另一个无效区域，那么Windows将计算出一个可以覆盖这两个无效区域的新的无效区域，并更新`PAINTSTRUCT`结构。Windows不会在消息队列中放置多条`WM_PAINT`消息。



因为`WM_PAINT`消息是一个低优先级的消息，Windows总是在消息循环为空的时候才把`WM_PAINT`消息放入消息队列。每当消息循环为空的时候，如果Windows发现存在一个无效区域，就会在程序的消息队列中放入一个`WM_PAINT`消息。



:::info`为啥调用UpdateWindow()? 目的为了快速给窗口应用发送 WM_PAINT消息`

前面说过`"当程序窗口被首次创建时，整个客户区都是无效的"`，因为此时应用程序尚未在该窗口上绘制任何东西。在`WinMain`中调用`UpdateWindow`函数时会发送第一条`WM_PAINT`消息，指示窗口过程在窗口客户区进行绘制，`UpdateWindow`函数将`WM_PAINT`消息直接发送到指定窗口的窗口过程，绕过应用程序的消息队列。现在大家应该明白，`UpdateWindow`函数只不过是让窗口过程尽快更新窗口，`HelloWindows`程序去掉`UpdateWindow`函数调用也可以正常运行。





如果应用程序在其他任何时间(例如在处理键盘或鼠标消息期间)需要进行绘制，可以调用`GetDC`或`GetDCEx()`函数来获取显示DC句柄∶

```c
hdc = GetDC(hwnd);
//绘图代码
ReleaseDC(hwnd, hdc);
```

`GetDC`函数返回的`hdc`对应指定窗口的整个客户区，通过`GetDC` 函数返回的`hdc`可以在客户区的任何位置进行绘制操作，不存在无效矩形的概念，无效矩形和`BeginPaint`才是原配。





当使用完毕时，必须调用`ReleaseDC`函数释放`DC`。对于用`GetDC`获取的`hdc`，Windows建议使用的范围限于单条消息内。当程序处理某条消息的时候，如果需要绘制客户区，可以调用`GetDC`函数获取`hdc`，但在消息返回前，必须调用`ReleaseDC`函数将它释放掉。如果在下一条消息中还需要用到`hdc`，那么可以重新调用`GetDC`函数获取。如果将`GetDC`的`hwnd`参数设置为**NULL**，那么函数获取的是整个屏幕的DC句柄。

:::



:::details `提出一个问题`

按下鼠标左键时将会产生`WM_LBUTTONDOWN`消息，鼠标在客户区中移动的时候会不断产生`WM_MOUSEMOVE`消息，这两个消息的`IParam`参数中都含有鼠标坐标信息。按住鼠标左键不放拖动鼠标会产生`WM_LBUTTONDOWN`消息和一系列`WM_MOUSEMOVE`消息，我们在窗口过程中处理`WM_LBUTTONDOWN`和`WM_MOUSEMOVE`消息，利用`GetDC`函数获取`DC`句柄进行绘图，连接
`WM_LBUTTONDOWN`消息和一系列`WM_MOUSEMOVE`消息的这些坐标点就会形成一条线，**但是当改变窗口大小、最小化然后最大化窗口、拖动窗口一部分到屏幕外再拖回来时，读者会发现这条线没有了，**因为在需要重绘的时候**Windows会使用指定的背景画刷擦除背景。**

如果希望这条线继续存在，就必须在WM_PAINT消息中重新绘制(**可以事先保存好那些点**)。如果可能，我们最好是在`WM_PAINT`消息中处理所有绘制工作。

:::



`GetWindowDC`函数可以获取整个窗口的DC句柄，包括非客户区(例如标题栏、菜单和滚动条)。使用`GetWindowDC`函数返回的`hdc`可以在窗口的任何位置进行绘制，因为这个DC的原点是窗口的左上角，而不是窗口客户区的左上角。



例如，程序可以使用`GetWindowDC`函数返回的`hdc`在窗口的标题栏上进行绘制，这时程序需要处理`WM_NCPAINT`(非客户区绘制）消息。



```c
HDC GetWindowDC( _In_ HWND hWnd);
```

函数执行成功，返回值是指定窗口的DC句柄。同样的，完成绘制后必须调用`ReleaseDC`函数来释放DC。如果将参数`hWnd`参数设置为NULL，`GetWindowDC`函数获取的是整个屏幕的DC句柄。



Windows有4种类型的DC，关于其他类型DC句柄的获取，后面用到的时候再讲解。理论知识讲解太多实在乏味，接下来先实现一个`输出(绘制)`文本的示例，并实现滚动条功能。



## 绘制文本

`GetSystemMetrics`函数用于**获取系统配置信息**，例如可以获取屏幕分辨率、全屏窗口客户区的宽度和高度、**滚动条的宽度和高度**等，该函数获取到的相关度量信息均以<u>像素为单位</u>。

```c
int WINAPI GetSystemMetrics(_In_ int nlndex);
```

该函数只有一个参数，称之为索引，这个索引有95个标识符可以使用。



例如: `GetSystemMetrics(SM_CXSCREEN)`获取的是屏幕的宽度(`Cx`表示 `Count X`，X轴像素数),



`SystemMetrics`程序根据95个索引在客户区中输出95行，每行的格式类似下面的样子∶

```c
SM_CXSCREEN	屏幕的宽度	1366
```

通过`TextOut`函数输出`METRICS`结构数组的每个数组元素很简单。这里列举下笔者的实现。



:::details `Metrics.h`

```c
#pragma once

struct
{
    int     m_nIndex;
    PTSTR   m_pLabel;
    PTSTR   m_pDesc;
}METRICS[] = {
    SM_CXSCREEN,                    TEXT("SM_CXSCREEN"),                    TEXT("屏幕的宽度"),
    SM_CYSCREEN,                    TEXT("SM_CYSCREEN"),                    TEXT("屏幕的高度"),
    SM_CXFULLSCREEN,                TEXT("SM_CXFULLSCREEN"),                TEXT("全屏窗口的客户区宽度"),
    SM_CYFULLSCREEN,                TEXT("SM_CYFULLSCREEN"),                TEXT("全屏窗口的客户区高度"),
    SM_ARRANGE,                     TEXT("SM_ARRANGE"),                     TEXT("如何排列最小化窗口"),
    SM_CLEANBOOT,                   TEXT("SM_CLEANBOOT"),                   TEXT("系统启动方式"),
    SM_CMONITORS,                   TEXT("SM_CMONITORS"),                   TEXT("监视器的数量"),
    SM_CMOUSEBUTTONS,               TEXT("SM_CMOUSEBUTTONS"),               TEXT("鼠标上的按钮数"),
    SM_CONVERTIBLESLATEMODE,        TEXT("SM_CONVERTIBLESLATEMODE"),        TEXT("笔记本电脑或平板电脑模式"),
    SM_CXBORDER,                    TEXT("SM_CXBORDER"),                    TEXT("窗口边框的宽度"),
    SM_CYBORDER,                    TEXT("SM_CYBORDER"),                    TEXT("窗口边框的高度"),
    SM_CXCURSOR,                    TEXT("SM_CXCURSOR"),                    TEXT("光标的宽度"),
    SM_CYCURSOR,                    TEXT("SM_CYCURSOR"),                    TEXT("光标的高度"),
    SM_CXDLGFRAME,                  TEXT("SM_CXDLGFRAME"),                  TEXT("同SM_CXFIXEDFRAME，有标题但不可调整大小的窗口边框的宽度"),
    SM_CYDLGFRAME,                  TEXT("SM_CYDLGFRAME"),                  TEXT("同SM_CYFIXEDFRAME，有标题但不可调整大小的窗口边框的高度"),
    SM_CXDOUBLECLK,                 TEXT("SM_CXDOUBLECLK"),                 TEXT("鼠标双击事件两次点击的X坐标不可以超过这个值"),
    SM_CYDOUBLECLK,                 TEXT("SM_CYDOUBLECLK"),                 TEXT("鼠标双击事件两次点击的Y坐标不可以超过这个值"),
    SM_CXDRAG,                      TEXT("SM_CXDRAG"),                      TEXT("拖动操作开始之前，鼠标指针可以移动的鼠标下方点的任意一侧的像素数"),
    SM_CYDRAG,                      TEXT("SM_CYDRAG"),                      TEXT("拖动操作开始之前，鼠标指针可以移动的鼠标下移点上方和下方的像素数"),
    SM_CXEDGE,                      TEXT("SM_CXEDGE"),                      TEXT("三维边框的宽度"),
    SM_CYEDGE,                      TEXT("SM_CYEDGE"),                      TEXT("三维边框的高度"),
    SM_CXFIXEDFRAME,                TEXT("SM_CXFIXEDFRAME"),                TEXT("同SM_CXDLGFRAME，有标题但不可调整大小的窗口边框的宽度"),
    SM_CYFIXEDFRAME,                TEXT("SM_CYFIXEDFRAME"),                TEXT("同SM_CYDLGFRAME，有标题但不可调整大小的窗口边框的高度"),
    SM_CXFOCUSBORDER,               TEXT("SM_CXFOCUSBORDER"),               TEXT("DrawFocusRect绘制的焦点矩形的左边缘和右边缘的宽度"),
    SM_CYFOCUSBORDER,               TEXT("SM_CYFOCUSBORDER"),               TEXT("DrawFocusRect绘制的焦点矩形的上边缘和下边缘的高度"),
    SM_CXFRAME,                     TEXT("SM_CXFRAME"),                     TEXT("同SM_CXSIZEFRAME，可调大小窗口边框的宽度"),
    SM_CYFRAME,                     TEXT("SM_CYFRAME"),                     TEXT("同SM_CYSIZEFRAME，可调大小窗口边框的高度"),
    SM_CXHSCROLL,                   TEXT("SM_CXHSCROLL"),                   TEXT("水平滚动条中箭头位图的宽度"),
    SM_CYHSCROLL,                   TEXT("SM_CYHSCROLL"),                   TEXT("水平滚动条中箭头位图的高度"),
    SM_CXVSCROLL,                   TEXT("SM_CXVSCROLL"),                   TEXT("垂直滚动条中箭头位图的宽度"),
    SM_CYVSCROLL,                   TEXT("SM_CYVSCROLL"),                   TEXT("垂直滚动条中箭头位图的高度"),
    SM_CXHTHUMB,                    TEXT("SM_CXHTHUMB"),                    TEXT("水平滚动条中滚动框(滑块)的高度"),
    SM_CYVTHUMB,                    TEXT("SM_CYVTHUMB"),                    TEXT("垂直滚动条中滚动框(滑块)的宽度"),
    SM_CXICON,                      TEXT("SM_CXICON"),                      TEXT("图标的默认宽度"),
    SM_CYICON,                      TEXT("SM_CYICON"),                      TEXT("图标的默认高度"),
    SM_CXICONSPACING,               TEXT("SM_CXICONSPACING"),               TEXT("大图标视图中项目的网格单元格宽度"),
    SM_CYICONSPACING,               TEXT("SM_CYICONSPACING"),               TEXT("大图标视图中项目的网格单元格高度"),
    SM_CXMAXIMIZED,                 TEXT("SM_CXMAXIMIZED"),                 TEXT("最大化顶层窗口的默认宽度"),
    SM_CYMAXIMIZED,                 TEXT("SM_CYMAXIMIZED"),                 TEXT("最大化顶层窗口的默认高度"),
    SM_CXMAXTRACK,                  TEXT("SM_CXMAXTRACK"),                  TEXT("具有标题和大小调整边框的窗口可以拖动的最大宽度"),
    SM_CYMAXTRACK,                  TEXT("SM_CYMAXTRACK"),                  TEXT("具有标题和大小调整边框的窗口可以拖动的最大高度"),
    SM_CXMENUCHECK,                 TEXT("SM_CXMENUCHECK"),                 TEXT("菜单项前面复选框位图的宽度"),
    SM_CYMENUCHECK,                 TEXT("SM_CYMENUCHECK"),                 TEXT("菜单项前面复选框位图的高度"),
    SM_CXMENUSIZE,                  TEXT("SM_CXMENUSIZE"),                  TEXT("菜单栏按钮的宽度"),
    SM_CYMENUSIZE,                  TEXT("SM_CYMENUSIZE"),                  TEXT("菜单栏按钮的高度"),
    SM_CXMIN,                       TEXT("SM_CXMIN"),                       TEXT("窗口的最小宽度"),
    SM_CYMIN,                       TEXT("SM_CYMIN"),                       TEXT("窗口的最小高度"),
    SM_CXMINIMIZED,                 TEXT("SM_CXMINIMIZED"),                 TEXT("最小化窗口的宽度"),
    SM_CYMINIMIZED,                 TEXT("SM_CYMINIMIZED"),                 TEXT("最小化窗口的高度"),
    SM_CXMINSPACING,                TEXT("SM_CXMINSPACING"),                TEXT("最小化窗口的网格单元宽度"),
    SM_CYMINSPACING,                TEXT("SM_CYMINSPACING"),                TEXT("最小化窗口的网格单元高度"),
    SM_CXMINTRACK,                  TEXT("SM_CXMINTRACK"),                  TEXT("窗口的最小拖动宽度，用户无法将窗口拖动到小于这些尺寸"),
    SM_CYMINTRACK,                  TEXT("SM_CYMINTRACK"),                  TEXT("窗口的最小拖动高度，用户无法将窗口拖动到小于这些尺寸"),
    SM_CXPADDEDBORDER,              TEXT("SM_CXPADDEDBORDER"),              TEXT("标题窗口的边框填充量"),
    SM_CXSIZE,                      TEXT("SM_CXSIZE"),                      TEXT("窗口标题或标题栏中按钮的宽度"),
    SM_CYSIZE,                      TEXT("SM_CYSIZE"),                      TEXT("窗口标题或标题栏中按钮的高度"),
    SM_CXSIZEFRAME,                 TEXT("SM_CXSIZEFRAME"),                 TEXT("同SM_CXFRAME，可调大小窗口边框的宽度"),
    SM_CYSIZEFRAME,                 TEXT("SM_CYSIZEFRAME"),                 TEXT("同SM_CYFRAME，可调大小窗口边框的厚度"),
    SM_CXSMICON,                    TEXT("SM_CXSMICON"),                    TEXT("小图标的建议宽度"),
    SM_CYSMICON,                    TEXT("SM_CYSMICON"),                    TEXT("小图标的建议高度"),
    SM_CXSMSIZE,                    TEXT("SM_CXSMSIZE"),                    TEXT("小标题按钮的宽度"),
    SM_CYSMSIZE,                    TEXT("SM_CYSMSIZE"),                    TEXT("小标题按钮的高度"),
    SM_CXVIRTUALSCREEN,             TEXT("SM_CXVIRTUALSCREEN"),             TEXT("虚拟屏幕的宽度"),
    SM_CYVIRTUALSCREEN,             TEXT("SM_CYVIRTUALSCREEN"),             TEXT("虚拟屏幕的高度"),
    SM_CYCAPTION,                   TEXT("SM_CYCAPTION"),                   TEXT("标题区域的高度"),
    SM_CYKANJIWINDOW,               TEXT("SM_CYKANJIWINDOW"),               TEXT("屏幕底部的日文汉字窗口的高度"),
    SM_CYMENU,                      TEXT("SM_CYMENU"),                      TEXT("单行菜单栏的高度"),
    SM_CYSMCAPTION,                 TEXT("SM_CYSMCAPTION"),                 TEXT("小标题的高度"),
    SM_DBCSENABLED,                 TEXT("SM_DBCSENABLED"),                 TEXT("User32.dll是否支持DBCS"),
    SM_DEBUG,                       TEXT("SM_DEBUG"),                       TEXT("是否安装了User.exe的调试版本"),
    SM_DIGITIZER,                   TEXT("SM_DIGITIZER"),                   TEXT("设备支持的数字转换器输入类型"),
    SM_IMMENABLED,                  TEXT("SM_IMMENABLED"),                  TEXT("是否启用了输入法管理器／输入法编辑器功能"),
    SM_MAXIMUMTOUCHES,              TEXT("SM_MAXIMUMTOUCHES"),              TEXT("系统中是否有数字化仪"),
    SM_MEDIACENTER,                 TEXT("SM_MEDIACENTER"),                 TEXT("当前操作系统是不是Windows XP Media Center"),
    SM_MENUDROPALIGNMENT,           TEXT("SM_MENUDROPALIGNMENT"),           TEXT("下拉菜单是否与相应的菜单栏项右对齐"),
    SM_MIDEASTENABLED,              TEXT("SM_MIDEASTENABLED"),              TEXT("系统是否启用希伯来语和阿拉伯语"),
    SM_MOUSEHORIZONTALWHEELPRESENT, TEXT("SM_MOUSEHORIZONTALWHEELPRESENT"), TEXT("是否安装了带有水平滚轮的鼠标"),
    SM_MOUSEPRESENT,                TEXT("SM_MOUSEPRESENT"),                TEXT("是否安装了鼠标"),
    SM_MOUSEWHEELPRESENT,           TEXT("SM_MOUSEWHEELPRESENT"),           TEXT("是否安装了带有垂直滚轮的鼠标"),
    SM_NETWORK,                     TEXT("SM_NETWORK"),                     TEXT("是否存在网络"),
    SM_PENWINDOWS,                  TEXT("SM_PENWINDOWS"),                  TEXT("是否安装了Microsoft Windows for Pen Computing扩展"),
    SM_REMOTECONTROL,               TEXT("SM_REMOTECONTROL"),               TEXT("当前终端服务器会话是否被远程控制"),
    SM_REMOTESESSION,               TEXT("SM_REMOTESESSION"),               TEXT("调用进程是否与终端服务客户机会话关联"),
    SM_SAMEDISPLAYFORMAT,           TEXT("SM_SAMEDISPLAYFORMAT"),           TEXT("所有显示器的颜色格式是否相同"),
    SM_SECURE,                      TEXT("SM_SECURE"),                      TEXT("始终返回0"),
    SM_SERVERR2,                    TEXT("SM_SERVERR2"),                    TEXT("系统是否是Windows Server 2003 R2"),
    SM_SHOWSOUNDS,                  TEXT("SM_SHOWSOUNDS"),                  TEXT("用户是否要求应用程序在其他情况下以可视方式呈现信息"),
    SM_SHUTTINGDOWN,                TEXT("SM_SHUTTINGDOWN"),                TEXT("当前会话是否正在关闭"),
    SM_SLOWMACHINE,                 TEXT("SM_SLOWMACHINE"),                 TEXT("计算机是否具有低端(慢速)处理器"),
    SM_STARTER,                     TEXT("SM_STARTER"),                     TEXT("当前操作系统版本"),
    SM_SWAPBUTTON,                  TEXT("SM_SWAPBUTTON"),                  TEXT("鼠标左键和右键的功能是否互换了"),
    SM_SYSTEMDOCKED,                TEXT("SM_SYSTEMDOCKED"),                TEXT("停靠模式的状态"),
    SM_TABLETPC,                    TEXT("SM_TABLETPC"),                    TEXT("是否启动了Tablet PC输入服务"),
    SM_XVIRTUALSCREEN,              TEXT("SM_XVIRTUALSCREEN"),              TEXT("虚拟屏幕左侧的坐标"),
    SM_YVIRTUALSCREEN,              TEXT("SM_YVIRTUALSCREEN"),              TEXT("虚拟屏幕顶部的坐标")
};
```

:::



:::details `SystemMetrics.cpp`

```c{5,49-58}
#include <Windows.h>
#include <tchar.h>
#include "Metrics.h"

const int NUMLINES = sizeof(METRICS) / sizeof(METRICS[0]); //写入文本的行数
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;                            
    TCHAR szClassName[] = TEXT("MyWindow");       
    TCHAR szAppName[] = TEXT("GetSystemMetrics");  
    HWND hwnd;                                     
    MSG msg;                                      
    wndclass.cbSize = sizeof(WNDCLASSEX);
    wndclass.style = CS_HREDRAW | CS_VREDRAW;
    wndclass.lpfnWndProc = WindowProc;
    wndclass.cbClsExtra = 0;
    wndclass.cbWndExtra = 0;
    wndclass.hInstance = hInstance;
    wndclass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);
    wndclass.hbrBackground = (HBRUSH)(COLOR_3DFACE + 1); // 窗口背景使用标准系统颜色
    wndclass.lpszMenuName = NULL;
    wndclass.lpszClassName = szClassName;
    wndclass.hIconSm = NULL;
    
    ::RegisterClassEx(&wndclass);
    hwnd = ::CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ::ShowWindow(hwnd, nCmdShow);
    ::UpdateWindow(hwnd);
    while (::GetMessage(&msg, NULL, 0, 0) != 0)
    {
        ::TranslateMessage(&msg);
        ::DispatchMessage(&msg);
    }
    return msg.wParam;
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TCHAR szBuf[10];
    int y;

    if (uMsg == WM_PAINT)
    {
        hdc = ::BeginPaint(hwnd, &ps);
        for (int i = 0; i < NUMLINES; i++)
        {
            y = 18 * i; //行间距
            ::TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            ::TextOut(hdc, 240, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            ::TextOut(hdc, 760, y, szBuf,
                wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        ::EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        ::PostQuitMessage(0);
        return 0;
    }
    return ::DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

:::



::: details `程序执行效果`

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/TextOut%E5%87%BD%E6%95%B0%E7%BB%98%E5%88%B6%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9%E6%98%BE%E7%A4%BA%E5%88%B0%E5%AE%A2%E6%88%B7%E5%8C%BA.png)



程序使用`wndclass.hbrBackground =(HBRUSH)(COLOR_BTNFACE+ 1)`

把窗口背景设置为标准系统颜色（浅灰色)，所以很容易发现文本其实是有背景色的。



默认是白色背景字体是系统字体(字体，标题栏、菜单、对话框默认情况下使用系统字体);



对于每一行的行间距以及每一列的距离，我们大体设置了一个数值，这并不准确;`客户区一共输出了95行`，但是由于屏幕分辨率的原因，无法完整显示出来，很明显**程序需要一个垂直滚动条**。


:::



## 格式化文本

文本输出是程序客户区中最常见的图形输出类型，有一些函数可以格式化和绘制文本。



格式化函数可以设置背景模式、背景颜色、对齐方式、文本颜色、字符间距等，这些都是DC的文本格式属性。



背景模式不透明、背景颜色为白色、对齐方式为左对齐、文本颜色为黑色等都是默认的DC文本格式属性。



格式函数可以分为三类∶

- 获取或设置DC的**文本格式属性**的函数
- 获取**字符宽度和高度**的函数
- 获取**字符串宽度和高度**的函数



:::details `文本格式属性`

- 文本对齐方式

`SetTextAlign`函数为指定的DC设置文本对齐方式∶

```c
/// <summary>
/// 设置文本对齐方式
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="fMode">文本对齐方式</param>
/// <returns></returns>
UINT SetTextAlign(_In_ HDC hdc, _In_ UINT fMode);
```

`fMode`参数指定文本对齐方式，可用的值及含义如下表所示。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240606230903717.png)



默认值为	`TA_LEFT|TA_TOP |TA_NOUPDATECP`



调用`SetTextAlign`函数可以改变`TextOutExt` `TextOut` `TabbedTextOut`等函数中`nXStart`和`nYStart`参数表示的含义

- 使用`TA_LEFT` `TA_RIGHT`和`TA_CENTER`标志会影响`nXStart`表示的水平坐标值。
- 使用`TA_TOP` `TA_BOTTOM`和`TA_BASELINE`标志会影响`nYStart`表示的垂直坐标值。



例如在`SetTextAlign`函数中指定`TA_RIGHT`标志，那么`TextOut`函数的`nXStart`表示字符串中最后一个字符右侧的水平坐标。如果指定`TA_TOP`，则`nYStart`表示字符串中所有字符的最高点，即所有字符都在`nYStart`指定的位置之下﹔如果指定`TA_BOTTOM`则表示字符串中所有字符都会在`nYStart`指定的位置之上。


如果设置了`TA_UPDATECP`标志，Windows会忽略`TextOut`函数的`nXStart`和`nYStart`参数指定的值，而是将由先前调用的`MoveToEx`或`LineTo`函数(或其他一些可以改变当前位置的函数)指定的当前位置坐标值作为起始点。



如果没有调用改变当前位置的函数，那么默认情况下当前位置的坐标为(0，0)，相对于客户区左上角;设置`TA_UPDATECP`标志以后，对`TextOut`函数的每次调用也会更新当前位置。



例如，如果设置为`TA_LEFT|TA_UPDATECP`，`TextOut`函数返回后新的当前位置就是该字符串的结束位置，下次调用`TextOut`函数时就会从上一个字符串的结束位置开始绘制，有时候可能需要这个特性。



如果函数执行成功，则返回值是原来的文本对齐设置 如果函数执行失败，则返回值为`GDI_ERROR`.





大家可以把SystemMetrics程序的最后一个TextOut改为∶

::: info `验证SetTextAlign函数`

```c{52-56}
#include <Windows.h>
#include <tchar.h>
#include "Metrics.h"
const int NUMLINES = sizeof(METRICS) / sizeof(METRICS[0]);
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;                            
    TCHAR szClassName[] = TEXT("MyWindow");         
    TCHAR szAppName[] = TEXT("GetSystemMetrics");   
    HWND hwnd;                                     
    MSG msg;                                      
    wndclass.cbSize = sizeof(WNDCLASSEX);
    wndclass.style = CS_HREDRAW | CS_VREDRAW;
    wndclass.lpfnWndProc = WindowProc;
    wndclass.cbClsExtra = 0;
    wndclass.cbWndExtra = 0;
    wndclass.hInstance = hInstance;
    wndclass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);
    wndclass.hbrBackground = (HBRUSH)(COLOR_3DFACE + 1);   
    wndclass.lpszMenuName = NULL;
    wndclass.lpszClassName = szClassName;
    wndclass.hIconSm = NULL;
    ::RegisterClassEx(&wndclass);
    hwnd = ::CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ::ShowWindow(hwnd, nCmdShow);
    ::UpdateWindow(hwnd);
    while (::GetMessage(&msg, NULL, 0, 0) != 0)
    {
        ::TranslateMessage(&msg);
        ::DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TCHAR szBuf[10];
    int y;

    if (uMsg == WM_PAINT)
    {
        hdc = ::BeginPaint(hwnd, &ps);
        for (int i = 0; i < NUMLINES; i++)
        {
            y = 18 * i;
            ::TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            ::TextOut(hdc, 240, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            //设置最后一列右对齐
            ::SetTextAlign(hdc, TA_RIGHT | TA_TOP | TA_NOUPDATECP);
            ::TextOut(hdc, 760, y, szBuf, wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
            //渲染完毕之后，恢复预设
            ::SetTextAlign(hdc, TA_LEFT | TA_TOP | TA_NOUPDATECP);
        }
        ::EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        ::PostQuitMessage(0);
        return 0;
    }
    return ::DefWindowProc(hwnd, uMsg, wParam, lParam);
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240606233017254.png)

将fMode参数设置为TA_RIGHT，那么TextOut的nXStart参数指定的就是字符串中最后一个字符右侧的X坐标。

可以看到数据从右开始变得对齐了。





可以通过调用`GetTextAlign`函数来获取指定DC的当前文本对齐设置∶

```c
/// <summary>
/// 获取指定DC当前文本对齐设置
/// </summary>
/// <param name="hdc"></param>
/// <returns></returns>
UINT GetTextAlign(_In_ HDC hdc)
```

调用`SetTextAlign`函数的时候通常使用`按位或`运算符组合几个标志，调用`GetTextAlign`函数的时候可以使用`按位与`运算符检测返回值是否包含某标志。

:::





:::details `字符间距`



可以通过调用`SetTextCharacterExtra`函数设置指定DC中文本输出的字符间距︰

```c
/// <summary>
/// 设置文本字符间距
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="nCharExtra">字符间距，逻辑单位</param>
/// <returns></returns>
int SetTextCharacterExtra(HDC hdc,int nCharExtra);
```

大家可以在`SystemMetrics`程序的3个`TextOut`前调用`SetTextCharacterExtra`函数设置一下字符间距，看一下效果，比如说:

:::details `设置字符间距5`

```c
#include <Windows.h>
#include <tchar.h>
struct
{
    int     m_nIndex;
    PCTSTR   m_pLabel;
    PCTSTR   m_pDesc;
}METRICS[] = {
    SM_CXSCREEN,                    TEXT("SM_CXSCREEN"),                    TEXT("屏幕的宽度"),
    SM_CYSCREEN,                    TEXT("SM_CYSCREEN"),                    TEXT("屏幕的高度"),
    SM_CXFULLSCREEN,                TEXT("SM_CXFULLSCREEN"),                TEXT("全屏窗口的客户区宽度"),
    SM_CYFULLSCREEN,                TEXT("SM_CYFULLSCREEN"),                TEXT("全屏窗口的客户区高度"),
    SM_ARRANGE,                     TEXT("SM_ARRANGE"),                     TEXT("如何排列最小化窗口"),
    SM_CLEANBOOT,                   TEXT("SM_CLEANBOOT"),                   TEXT("系统启动方式"),
    SM_CMONITORS,                   TEXT("SM_CMONITORS"),                   TEXT("监视器的数量"),
    SM_CMOUSEBUTTONS,               TEXT("SM_CMOUSEBUTTONS"),               TEXT("鼠标上的按钮数"),
    SM_CXBORDER,                    TEXT("SM_CXBORDER"),                    TEXT("窗口边框的宽度"),
    SM_CYBORDER,                    TEXT("SM_CYBORDER"),                    TEXT("窗口边框的高度"),
    SM_CXCURSOR,                    TEXT("SM_CXCURSOR"),                    TEXT("光标的宽度"),
    SM_CYCURSOR,                    TEXT("SM_CYCURSOR"),                    TEXT("光标的高度"),
    SM_CXDLGFRAME,                  TEXT("SM_CXDLGFRAME"),                  TEXT("同SM_CXFIXEDFRAME，有标题但不可调整大小的窗口边框的宽度"),
    SM_CYDLGFRAME,                  TEXT("SM_CYDLGFRAME"),                  TEXT("同SM_CYFIXEDFRAME，有标题但不可调整大小的窗口边框的高度"),
    SM_CXDOUBLECLK,                 TEXT("SM_CXDOUBLECLK"),                 TEXT("鼠标双击事件两次点击的X坐标不可以超过这个值"),
    SM_CYDOUBLECLK,                 TEXT("SM_CYDOUBLECLK"),                 TEXT("鼠标双击事件两次点击的Y坐标不可以超过这个值"),
    SM_CXDRAG,                      TEXT("SM_CXDRAG"),                      TEXT("拖动操作开始之前，鼠标指针可以移动的鼠标下方点的任意一侧的像素数"),
    SM_CYDRAG,                      TEXT("SM_CYDRAG"),                      TEXT("拖动操作开始之前，鼠标指针可以移动的鼠标下移点上方和下方的像素数"),
    SM_CXEDGE,                      TEXT("SM_CXEDGE"),                      TEXT("三维边框的宽度"),
    SM_CYEDGE,                      TEXT("SM_CYEDGE"),                      TEXT("三维边框的高度"),
    SM_CXFIXEDFRAME,                TEXT("SM_CXFIXEDFRAME"),                TEXT("同SM_CXDLGFRAME，有标题但不可调整大小的窗口边框的宽度"),
    SM_CYFIXEDFRAME,                TEXT("SM_CYFIXEDFRAME"),                TEXT("同SM_CYDLGFRAME，有标题但不可调整大小的窗口边框的高度"),
    SM_CXFOCUSBORDER,               TEXT("SM_CXFOCUSBORDER"),               TEXT("DrawFocusRect绘制的焦点矩形的左边缘和右边缘的宽度"),
    SM_CYFOCUSBORDER,               TEXT("SM_CYFOCUSBORDER"),               TEXT("DrawFocusRect绘制的焦点矩形的上边缘和下边缘的高度"),
    SM_CXFRAME,                     TEXT("SM_CXFRAME"),                     TEXT("同SM_CXSIZEFRAME，可调大小窗口边框的宽度"),
    SM_CYFRAME,                     TEXT("SM_CYFRAME"),                     TEXT("同SM_CYSIZEFRAME，可调大小窗口边框的高度"),
    SM_CXHSCROLL,                   TEXT("SM_CXHSCROLL"),                   TEXT("水平滚动条中箭头位图的宽度"),
    SM_CYHSCROLL,                   TEXT("SM_CYHSCROLL"),                   TEXT("水平滚动条中箭头位图的高度"),
    SM_CXVSCROLL,                   TEXT("SM_CXVSCROLL"),                   TEXT("垂直滚动条中箭头位图的宽度"),
    SM_CYVSCROLL,                   TEXT("SM_CYVSCROLL"),                   TEXT("垂直滚动条中箭头位图的高度"),
    SM_CXHTHUMB,                    TEXT("SM_CXHTHUMB"),                    TEXT("水平滚动条中滚动框(滑块)的高度"),
    SM_CYVTHUMB,                    TEXT("SM_CYVTHUMB"),                    TEXT("垂直滚动条中滚动框(滑块)的宽度"),
    SM_CXICON,                      TEXT("SM_CXICON"),                      TEXT("图标的默认宽度"),
    SM_CYICON,                      TEXT("SM_CYICON"),                      TEXT("图标的默认高度"),
    SM_CXICONSPACING,               TEXT("SM_CXICONSPACING"),               TEXT("大图标视图中项目的网格单元格宽度"),
    SM_CYICONSPACING,               TEXT("SM_CYICONSPACING"),               TEXT("大图标视图中项目的网格单元格高度"),
    SM_CXMAXIMIZED,                 TEXT("SM_CXMAXIMIZED"),                 TEXT("最大化顶层窗口的默认宽度"),
    SM_CYMAXIMIZED,                 TEXT("SM_CYMAXIMIZED"),                 TEXT("最大化顶层窗口的默认高度"),
    SM_CXMAXTRACK,                  TEXT("SM_CXMAXTRACK"),                  TEXT("具有标题和大小调整边框的窗口可以拖动的最大宽度"),
    SM_CYMAXTRACK,                  TEXT("SM_CYMAXTRACK"),                  TEXT("具有标题和大小调整边框的窗口可以拖动的最大高度"),
    SM_CXMENUCHECK,                 TEXT("SM_CXMENUCHECK"),                 TEXT("菜单项前面复选框位图的宽度"),
    SM_CYMENUCHECK,                 TEXT("SM_CYMENUCHECK"),                 TEXT("菜单项前面复选框位图的高度"),
    SM_CXMENUSIZE,                  TEXT("SM_CXMENUSIZE"),                  TEXT("菜单栏按钮的宽度"),
    SM_CYMENUSIZE,                  TEXT("SM_CYMENUSIZE"),                  TEXT("菜单栏按钮的高度"),
    SM_CXMIN,                       TEXT("SM_CXMIN"),                       TEXT("窗口的最小宽度"),
    SM_CYMIN,                       TEXT("SM_CYMIN"),                       TEXT("窗口的最小高度"),
    SM_CXMINIMIZED,                 TEXT("SM_CXMINIMIZED"),                 TEXT("最小化窗口的宽度"),
    SM_CYMINIMIZED,                 TEXT("SM_CYMINIMIZED"),                 TEXT("最小化窗口的高度"),
    SM_CXMINSPACING,                TEXT("SM_CXMINSPACING"),                TEXT("最小化窗口的网格单元宽度"),
    SM_CYMINSPACING,                TEXT("SM_CYMINSPACING"),                TEXT("最小化窗口的网格单元高度"),
    SM_CXMINTRACK,                  TEXT("SM_CXMINTRACK"),                  TEXT("窗口的最小拖动宽度，用户无法将窗口拖动到小于这些尺寸"),
    SM_CYMINTRACK,                  TEXT("SM_CYMINTRACK"),                  TEXT("窗口的最小拖动高度，用户无法将窗口拖动到小于这些尺寸"),
    SM_CXPADDEDBORDER,              TEXT("SM_CXPADDEDBORDER"),              TEXT("标题窗口的边框填充量"),
    SM_CXSIZE,                      TEXT("SM_CXSIZE"),                      TEXT("窗口标题或标题栏中按钮的宽度"),
    SM_CYSIZE,                      TEXT("SM_CYSIZE"),                      TEXT("窗口标题或标题栏中按钮的高度"),
    SM_CXSIZEFRAME,                 TEXT("SM_CXSIZEFRAME"),                 TEXT("同SM_CXFRAME，可调大小窗口边框的宽度"),
    SM_CYSIZEFRAME,                 TEXT("SM_CYSIZEFRAME"),                 TEXT("同SM_CYFRAME，可调大小窗口边框的厚度"),
    SM_CXSMICON,                    TEXT("SM_CXSMICON"),                    TEXT("小图标的建议宽度"),
    SM_CYSMICON,                    TEXT("SM_CYSMICON"),                    TEXT("小图标的建议高度"),
    SM_CXSMSIZE,                    TEXT("SM_CXSMSIZE"),                    TEXT("小标题按钮的宽度"),
    SM_CYSMSIZE,                    TEXT("SM_CYSMSIZE"),                    TEXT("小标题按钮的高度"),
    SM_CXVIRTUALSCREEN,             TEXT("SM_CXVIRTUALSCREEN"),             TEXT("虚拟屏幕的宽度"),
    SM_CYVIRTUALSCREEN,             TEXT("SM_CYVIRTUALSCREEN"),             TEXT("虚拟屏幕的高度"),
    SM_CYCAPTION,                   TEXT("SM_CYCAPTION"),                   TEXT("标题区域的高度"),
    SM_CYKANJIWINDOW,               TEXT("SM_CYKANJIWINDOW"),               TEXT("屏幕底部的日文汉字窗口的高度"),
    SM_CYMENU,                      TEXT("SM_CYMENU"),                      TEXT("单行菜单栏的高度"),
    SM_CYSMCAPTION,                 TEXT("SM_CYSMCAPTION"),                 TEXT("小标题的高度"),
    SM_DBCSENABLED,                 TEXT("SM_DBCSENABLED"),                 TEXT("User32.dll是否支持DBCS"),
    SM_DEBUG,                       TEXT("SM_DEBUG"),                       TEXT("是否安装了User.exe的调试版本"),
    SM_DIGITIZER,                   TEXT("SM_DIGITIZER"),                   TEXT("设备支持的数字转换器输入类型"),
    SM_IMMENABLED,                  TEXT("SM_IMMENABLED"),                  TEXT("是否启用了输入法管理器／输入法编辑器功能"),
    SM_MAXIMUMTOUCHES,              TEXT("SM_MAXIMUMTOUCHES"),              TEXT("系统中是否有数字化仪"),
    SM_MEDIACENTER,                 TEXT("SM_MEDIACENTER"),                 TEXT("当前操作系统是不是Windows XP Media Center"),
    SM_MENUDROPALIGNMENT,           TEXT("SM_MENUDROPALIGNMENT"),           TEXT("下拉菜单是否与相应的菜单栏项右对齐"),
    SM_MIDEASTENABLED,              TEXT("SM_MIDEASTENABLED"),              TEXT("系统是否启用希伯来语和阿拉伯语"),
    SM_MOUSEHORIZONTALWHEELPRESENT, TEXT("SM_MOUSEHORIZONTALWHEELPRESENT"), TEXT("是否安装了带有水平滚轮的鼠标"),
    SM_MOUSEPRESENT,                TEXT("SM_MOUSEPRESENT"),                TEXT("是否安装了鼠标"),
    SM_MOUSEWHEELPRESENT,           TEXT("SM_MOUSEWHEELPRESENT"),           TEXT("是否安装了带有垂直滚轮的鼠标"),
    SM_NETWORK,                     TEXT("SM_NETWORK"),                     TEXT("是否存在网络"),
    SM_PENWINDOWS,                  TEXT("SM_PENWINDOWS"),                  TEXT("是否安装了Microsoft Windows for Pen Computing扩展"),
    SM_REMOTECONTROL,               TEXT("SM_REMOTECONTROL"),               TEXT("当前终端服务器会话是否被远程控制"),
    SM_REMOTESESSION,               TEXT("SM_REMOTESESSION"),               TEXT("调用进程是否与终端服务客户机会话关联"),
    SM_SAMEDISPLAYFORMAT,           TEXT("SM_SAMEDISPLAYFORMAT"),           TEXT("所有显示器的颜色格式是否相同"),
    SM_SECURE,                      TEXT("SM_SECURE"),                      TEXT("始终返回0"),
    SM_SERVERR2,                    TEXT("SM_SERVERR2"),                    TEXT("系统是否是Windows Server 2003 R2"),
    SM_SHOWSOUNDS,                  TEXT("SM_SHOWSOUNDS"),                  TEXT("用户是否要求应用程序在其他情况下以可视方式呈现信息"),
    SM_SHUTTINGDOWN,                TEXT("SM_SHUTTINGDOWN"),                TEXT("当前会话是否正在关闭"),
    SM_SLOWMACHINE,                 TEXT("SM_SLOWMACHINE"),                 TEXT("计算机是否具有低端(慢速)处理器"),
    SM_STARTER,                     TEXT("SM_STARTER"),                     TEXT("当前操作系统版本"),
    SM_SWAPBUTTON,                  TEXT("SM_SWAPBUTTON"),                  TEXT("鼠标左键和右键的功能是否互换了"),
    SM_TABLETPC,                    TEXT("SM_TABLETPC"),                    TEXT("是否启动了Tablet PC输入服务"),
    SM_XVIRTUALSCREEN,              TEXT("SM_XVIRTUALSCREEN"),              TEXT("虚拟屏幕左侧的坐标"),
    SM_YVIRTUALSCREEN,              TEXT("SM_YVIRTUALSCREEN"),              TEXT("虚拟屏幕顶部的坐标")
};

const int NUMLINES = sizeof(METRICS) / sizeof(METRICS[0]);
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("GetSystemMetrics");
    HWND hwnd;
    MSG msg;
    wndclass.cbSize = sizeof(WNDCLASSEX);
    wndclass.style = CS_HREDRAW | CS_VREDRAW;
    wndclass.lpfnWndProc = WindowProc;
    wndclass.cbClsExtra = 0;
    wndclass.cbWndExtra = 0;
    wndclass.hInstance = hInstance;
    wndclass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);
    wndclass.hbrBackground = (HBRUSH)(COLOR_3DFACE + 1);
    wndclass.lpszMenuName = NULL;
    wndclass.lpszClassName = szClassName;
    wndclass.hIconSm = NULL;
    ::RegisterClassEx(&wndclass);
    hwnd = ::CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ::ShowWindow(hwnd, nCmdShow);
    ::UpdateWindow(hwnd);
    while (::GetMessage(&msg, NULL, 0, 0) != 0)
    {
        ::TranslateMessage(&msg);
        ::DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TCHAR szBuf[10];
    int y;

    if (uMsg == WM_PAINT)
    {
        hdc = ::BeginPaint(hwnd, &ps);
        for (int i = 0; i < NUMLINES; i++)
        {
            y = 18 * i;
            SetTextCharacterExtra(hdc,5);
            ::TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            ::TextOut(hdc, 240, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            ::TextOut(hdc, 760, y, szBuf, wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
            SetTextCharacterExtra(hdc, 0);
        }
        ::EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        ::PostQuitMessage(0);
        return 0;
    }
    return ::DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240606233840072.png)

可以通过调用`GetTextCharacterExtra`函数来获取指定DC的当前字符间距∶

```c
int GetTextCharacterExtra(HDC hdc);
```

:::





:::details `文本颜色和背景颜色、背景模式`



- 可以通过调用`SetTextColor`函数设置绘制的文本颜色，以及在彩色打印机上绘制的文本颜色;

- 可以通过调用`SetBkColor`函数设置每个字符后显示的颜色（也就是背景颜色);
- 可以通过调用`SetBkMode`函数设置背景模式为透明或不透明。

```c
/// <summary>
/// 设置绘制文本的颜色
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="crColor">文本颜色值</param>
/// <returns>如果函数执行成功，则返回原来的背景颜色值;如果函数执行失败，则返回值为CLR_INVALID.</returns>
COLORREF SetTextColor(HDC hdc,COLORREF crColor);
```

```c

/// <summary>
/// 设置每个字符后显示的颜色
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="color">背景颜色值</param>
/// <returns>如果函数执行成功，则返回原来的背景颜色值;如果函数执行失败，则返回值为CLR_INVALID.</returns>
COLORREF SetBkColor(HDC hdc,COLORREF color);
```

```c
/// <summary>
/// 设置背景模式为透明或不透明
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="iBkMode">背景模式 OPAQUE-不透明背景 TRANSPARENT-透明背景</param>
/// <returns>如果函数执行成功，则返回原来的的背景模式﹔如果函数执行失败，则返回值为0。</returns>
int SetBkMode(HDC hdc,int iBkMode);
```

`COLORREF`用于指定RGB颜色值:

```c
typedef DWORD COLORREF;
typedef DWORD *LPCOLORREF;
```

`COLORREF`值的十六进制为`"Ox00BBGGRR"`的形式，低位字节包含红色值，倒数第2字节包含绿色值，倒数第3字节包含蓝色值，高位字节必须为0，单字节的最大值为255.



要**创建COLORREF颜色值**，可以使用<u>RGB宏分别指定红色、绿色、蓝色的值</u>



要**提取**COLORREF颜色值中的的红色、绿色和蓝色值，可以分别使用**GetRValue GetGValue和GetBValue宏。**

```c
#define RGB(r,g,b)
((COLORREF)(((BYTE)(r)|((WORD)((BYTE)(g))<<8))|(DWORD)(BYTE)(b))<<16)))
#define GetRValue(rgb)(LOBYTE(rgb))
#define GetGValue(rgb)(LOBYTE((WORD)(rgb)) >>8))
#define GetBValue(rgb)(LOBYTE((rgb)>>16))
```

:::details `设置文本颜色和背景颜色、背景模式`

```c
#include <Windows.h>
#include <tchar.h>
struct
{
    int     m_nIndex;
    PCTSTR   m_pLabel;
    PCTSTR   m_pDesc;
}METRICS[] = {
    SM_CXSCREEN,                    TEXT("SM_CXSCREEN"),                    TEXT("屏幕的宽度"),
    SM_CYSCREEN,                    TEXT("SM_CYSCREEN"),                    TEXT("屏幕的高度"),
    SM_CXFULLSCREEN,                TEXT("SM_CXFULLSCREEN"),                TEXT("全屏窗口的客户区宽度"),
    SM_CYFULLSCREEN,                TEXT("SM_CYFULLSCREEN"),                TEXT("全屏窗口的客户区高度"),
    SM_ARRANGE,                     TEXT("SM_ARRANGE"),                     TEXT("如何排列最小化窗口"),
    SM_CLEANBOOT,                   TEXT("SM_CLEANBOOT"),                   TEXT("系统启动方式"),
    SM_CMONITORS,                   TEXT("SM_CMONITORS"),                   TEXT("监视器的数量"),
    SM_CMOUSEBUTTONS,               TEXT("SM_CMOUSEBUTTONS"),               TEXT("鼠标上的按钮数"),
    SM_CXBORDER,                    TEXT("SM_CXBORDER"),                    TEXT("窗口边框的宽度"),
    SM_CYBORDER,                    TEXT("SM_CYBORDER"),                    TEXT("窗口边框的高度"),
    SM_CXCURSOR,                    TEXT("SM_CXCURSOR"),                    TEXT("光标的宽度"),
    SM_CYCURSOR,                    TEXT("SM_CYCURSOR"),                    TEXT("光标的高度"),
    SM_CXDLGFRAME,                  TEXT("SM_CXDLGFRAME"),                  TEXT("同SM_CXFIXEDFRAME，有标题但不可调整大小的窗口边框的宽度"),
    SM_CYDLGFRAME,                  TEXT("SM_CYDLGFRAME"),                  TEXT("同SM_CYFIXEDFRAME，有标题但不可调整大小的窗口边框的高度"),
    SM_CXDOUBLECLK,                 TEXT("SM_CXDOUBLECLK"),                 TEXT("鼠标双击事件两次点击的X坐标不可以超过这个值"),
    SM_CYDOUBLECLK,                 TEXT("SM_CYDOUBLECLK"),                 TEXT("鼠标双击事件两次点击的Y坐标不可以超过这个值"),
    SM_CXDRAG,                      TEXT("SM_CXDRAG"),                      TEXT("拖动操作开始之前，鼠标指针可以移动的鼠标下方点的任意一侧的像素数"),
    SM_CYDRAG,                      TEXT("SM_CYDRAG"),                      TEXT("拖动操作开始之前，鼠标指针可以移动的鼠标下移点上方和下方的像素数"),
    SM_CXEDGE,                      TEXT("SM_CXEDGE"),                      TEXT("三维边框的宽度"),
    SM_CYEDGE,                      TEXT("SM_CYEDGE"),                      TEXT("三维边框的高度"),
    SM_CXFIXEDFRAME,                TEXT("SM_CXFIXEDFRAME"),                TEXT("同SM_CXDLGFRAME，有标题但不可调整大小的窗口边框的宽度"),
    SM_CYFIXEDFRAME,                TEXT("SM_CYFIXEDFRAME"),                TEXT("同SM_CYDLGFRAME，有标题但不可调整大小的窗口边框的高度"),
    SM_CXFOCUSBORDER,               TEXT("SM_CXFOCUSBORDER"),               TEXT("DrawFocusRect绘制的焦点矩形的左边缘和右边缘的宽度"),
    SM_CYFOCUSBORDER,               TEXT("SM_CYFOCUSBORDER"),               TEXT("DrawFocusRect绘制的焦点矩形的上边缘和下边缘的高度"),
    SM_CXFRAME,                     TEXT("SM_CXFRAME"),                     TEXT("同SM_CXSIZEFRAME，可调大小窗口边框的宽度"),
    SM_CYFRAME,                     TEXT("SM_CYFRAME"),                     TEXT("同SM_CYSIZEFRAME，可调大小窗口边框的高度"),
    SM_CXHSCROLL,                   TEXT("SM_CXHSCROLL"),                   TEXT("水平滚动条中箭头位图的宽度"),
    SM_CYHSCROLL,                   TEXT("SM_CYHSCROLL"),                   TEXT("水平滚动条中箭头位图的高度"),
    SM_CXVSCROLL,                   TEXT("SM_CXVSCROLL"),                   TEXT("垂直滚动条中箭头位图的宽度"),
    SM_CYVSCROLL,                   TEXT("SM_CYVSCROLL"),                   TEXT("垂直滚动条中箭头位图的高度"),
    SM_CXHTHUMB,                    TEXT("SM_CXHTHUMB"),                    TEXT("水平滚动条中滚动框(滑块)的高度"),
    SM_CYVTHUMB,                    TEXT("SM_CYVTHUMB"),                    TEXT("垂直滚动条中滚动框(滑块)的宽度"),
    SM_CXICON,                      TEXT("SM_CXICON"),                      TEXT("图标的默认宽度"),
    SM_CYICON,                      TEXT("SM_CYICON"),                      TEXT("图标的默认高度"),
    SM_CXICONSPACING,               TEXT("SM_CXICONSPACING"),               TEXT("大图标视图中项目的网格单元格宽度"),
    SM_CYICONSPACING,               TEXT("SM_CYICONSPACING"),               TEXT("大图标视图中项目的网格单元格高度"),
    SM_CXMAXIMIZED,                 TEXT("SM_CXMAXIMIZED"),                 TEXT("最大化顶层窗口的默认宽度"),
    SM_CYMAXIMIZED,                 TEXT("SM_CYMAXIMIZED"),                 TEXT("最大化顶层窗口的默认高度"),
    SM_CXMAXTRACK,                  TEXT("SM_CXMAXTRACK"),                  TEXT("具有标题和大小调整边框的窗口可以拖动的最大宽度"),
    SM_CYMAXTRACK,                  TEXT("SM_CYMAXTRACK"),                  TEXT("具有标题和大小调整边框的窗口可以拖动的最大高度"),
    SM_CXMENUCHECK,                 TEXT("SM_CXMENUCHECK"),                 TEXT("菜单项前面复选框位图的宽度"),
    SM_CYMENUCHECK,                 TEXT("SM_CYMENUCHECK"),                 TEXT("菜单项前面复选框位图的高度"),
    SM_CXMENUSIZE,                  TEXT("SM_CXMENUSIZE"),                  TEXT("菜单栏按钮的宽度"),
    SM_CYMENUSIZE,                  TEXT("SM_CYMENUSIZE"),                  TEXT("菜单栏按钮的高度"),
    SM_CXMIN,                       TEXT("SM_CXMIN"),                       TEXT("窗口的最小宽度"),
    SM_CYMIN,                       TEXT("SM_CYMIN"),                       TEXT("窗口的最小高度"),
    SM_CXMINIMIZED,                 TEXT("SM_CXMINIMIZED"),                 TEXT("最小化窗口的宽度"),
    SM_CYMINIMIZED,                 TEXT("SM_CYMINIMIZED"),                 TEXT("最小化窗口的高度"),
    SM_CXMINSPACING,                TEXT("SM_CXMINSPACING"),                TEXT("最小化窗口的网格单元宽度"),
    SM_CYMINSPACING,                TEXT("SM_CYMINSPACING"),                TEXT("最小化窗口的网格单元高度"),
    SM_CXMINTRACK,                  TEXT("SM_CXMINTRACK"),                  TEXT("窗口的最小拖动宽度，用户无法将窗口拖动到小于这些尺寸"),
    SM_CYMINTRACK,                  TEXT("SM_CYMINTRACK"),                  TEXT("窗口的最小拖动高度，用户无法将窗口拖动到小于这些尺寸"),
    SM_CXPADDEDBORDER,              TEXT("SM_CXPADDEDBORDER"),              TEXT("标题窗口的边框填充量"),
    SM_CXSIZE,                      TEXT("SM_CXSIZE"),                      TEXT("窗口标题或标题栏中按钮的宽度"),
    SM_CYSIZE,                      TEXT("SM_CYSIZE"),                      TEXT("窗口标题或标题栏中按钮的高度"),
    SM_CXSIZEFRAME,                 TEXT("SM_CXSIZEFRAME"),                 TEXT("同SM_CXFRAME，可调大小窗口边框的宽度"),
    SM_CYSIZEFRAME,                 TEXT("SM_CYSIZEFRAME"),                 TEXT("同SM_CYFRAME，可调大小窗口边框的厚度"),
    SM_CXSMICON,                    TEXT("SM_CXSMICON"),                    TEXT("小图标的建议宽度"),
    SM_CYSMICON,                    TEXT("SM_CYSMICON"),                    TEXT("小图标的建议高度"),
    SM_CXSMSIZE,                    TEXT("SM_CXSMSIZE"),                    TEXT("小标题按钮的宽度"),
    SM_CYSMSIZE,                    TEXT("SM_CYSMSIZE"),                    TEXT("小标题按钮的高度"),
    SM_CXVIRTUALSCREEN,             TEXT("SM_CXVIRTUALSCREEN"),             TEXT("虚拟屏幕的宽度"),
    SM_CYVIRTUALSCREEN,             TEXT("SM_CYVIRTUALSCREEN"),             TEXT("虚拟屏幕的高度"),
    SM_CYCAPTION,                   TEXT("SM_CYCAPTION"),                   TEXT("标题区域的高度"),
    SM_CYKANJIWINDOW,               TEXT("SM_CYKANJIWINDOW"),               TEXT("屏幕底部的日文汉字窗口的高度"),
    SM_CYMENU,                      TEXT("SM_CYMENU"),                      TEXT("单行菜单栏的高度"),
    SM_CYSMCAPTION,                 TEXT("SM_CYSMCAPTION"),                 TEXT("小标题的高度"),
    SM_DBCSENABLED,                 TEXT("SM_DBCSENABLED"),                 TEXT("User32.dll是否支持DBCS"),
    SM_DEBUG,                       TEXT("SM_DEBUG"),                       TEXT("是否安装了User.exe的调试版本"),
    SM_DIGITIZER,                   TEXT("SM_DIGITIZER"),                   TEXT("设备支持的数字转换器输入类型"),
    SM_IMMENABLED,                  TEXT("SM_IMMENABLED"),                  TEXT("是否启用了输入法管理器／输入法编辑器功能"),
    SM_MAXIMUMTOUCHES,              TEXT("SM_MAXIMUMTOUCHES"),              TEXT("系统中是否有数字化仪"),
    SM_MEDIACENTER,                 TEXT("SM_MEDIACENTER"),                 TEXT("当前操作系统是不是Windows XP Media Center"),
    SM_MENUDROPALIGNMENT,           TEXT("SM_MENUDROPALIGNMENT"),           TEXT("下拉菜单是否与相应的菜单栏项右对齐"),
    SM_MIDEASTENABLED,              TEXT("SM_MIDEASTENABLED"),              TEXT("系统是否启用希伯来语和阿拉伯语"),
    SM_MOUSEHORIZONTALWHEELPRESENT, TEXT("SM_MOUSEHORIZONTALWHEELPRESENT"), TEXT("是否安装了带有水平滚轮的鼠标"),
    SM_MOUSEPRESENT,                TEXT("SM_MOUSEPRESENT"),                TEXT("是否安装了鼠标"),
    SM_MOUSEWHEELPRESENT,           TEXT("SM_MOUSEWHEELPRESENT"),           TEXT("是否安装了带有垂直滚轮的鼠标"),
    SM_NETWORK,                     TEXT("SM_NETWORK"),                     TEXT("是否存在网络"),
    SM_PENWINDOWS,                  TEXT("SM_PENWINDOWS"),                  TEXT("是否安装了Microsoft Windows for Pen Computing扩展"),
    SM_REMOTECONTROL,               TEXT("SM_REMOTECONTROL"),               TEXT("当前终端服务器会话是否被远程控制"),
    SM_REMOTESESSION,               TEXT("SM_REMOTESESSION"),               TEXT("调用进程是否与终端服务客户机会话关联"),
    SM_SAMEDISPLAYFORMAT,           TEXT("SM_SAMEDISPLAYFORMAT"),           TEXT("所有显示器的颜色格式是否相同"),
    SM_SECURE,                      TEXT("SM_SECURE"),                      TEXT("始终返回0"),
    SM_SERVERR2,                    TEXT("SM_SERVERR2"),                    TEXT("系统是否是Windows Server 2003 R2"),
    SM_SHOWSOUNDS,                  TEXT("SM_SHOWSOUNDS"),                  TEXT("用户是否要求应用程序在其他情况下以可视方式呈现信息"),
    SM_SHUTTINGDOWN,                TEXT("SM_SHUTTINGDOWN"),                TEXT("当前会话是否正在关闭"),
    SM_SLOWMACHINE,                 TEXT("SM_SLOWMACHINE"),                 TEXT("计算机是否具有低端(慢速)处理器"),
    SM_STARTER,                     TEXT("SM_STARTER"),                     TEXT("当前操作系统版本"),
    SM_SWAPBUTTON,                  TEXT("SM_SWAPBUTTON"),                  TEXT("鼠标左键和右键的功能是否互换了"),
    SM_TABLETPC,                    TEXT("SM_TABLETPC"),                    TEXT("是否启动了Tablet PC输入服务"),
    SM_XVIRTUALSCREEN,              TEXT("SM_XVIRTUALSCREEN"),              TEXT("虚拟屏幕左侧的坐标"),
    SM_YVIRTUALSCREEN,              TEXT("SM_YVIRTUALSCREEN"),              TEXT("虚拟屏幕顶部的坐标")
};
const int NUMLINES = sizeof(METRICS) / sizeof(METRICS[0]);
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("GetSystemMetrics");
    HWND hwnd;
    MSG msg;
    wndclass.cbSize = sizeof(WNDCLASSEX);
    wndclass.style = CS_HREDRAW | CS_VREDRAW;
    wndclass.lpfnWndProc = WindowProc;
    wndclass.cbClsExtra = 0;
    wndclass.cbWndExtra = 0;
    wndclass.hInstance = hInstance;
    wndclass.hIcon = LoadIcon(NULL, IDI_APPLICATION);
    wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);
    wndclass.hbrBackground = (HBRUSH)(COLOR_3DFACE + 1);
    wndclass.lpszMenuName = NULL;
    wndclass.lpszClassName = szClassName;
    wndclass.hIconSm = NULL;
    ::RegisterClassEx(&wndclass);
    hwnd = ::CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ::ShowWindow(hwnd, nCmdShow);
    ::UpdateWindow(hwnd);
    while (::GetMessage(&msg, NULL, 0, 0) != 0)
    {
        ::TranslateMessage(&msg);
        ::DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TCHAR szBuf[10];
    int y;

    if (uMsg == WM_PAINT)
    {
        int preSetBkMode;
        COLORREF preSetTextColor;
        COLORREF preSetBkColor;
        hdc = ::BeginPaint(hwnd, &ps);
        for (int i = 0; i < NUMLINES; i++)
        {
            y = 18 * i;
            //设置背景模式是不透明的，文本颜色为红色、字符背景颜色为绿色
            preSetBkMode = ::SetBkMode(hdc, OPAQUE);
            preSetTextColor =  ::SetTextColor(hdc, RGB(255, 0, 0));
            preSetBkColor =  ::SetBkColor(hdc, RGB(0, 255, 0));


            ::TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            ::TextOut(hdc, 240, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            ::TextOut(hdc, 760, y, szBuf, wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        ::SetBkMode(hdc, preSetBkMode);
        ::SetTextColor(hdc, preSetTextColor);
        ::SetBkColor(hdc, preSetBkColor);
        ::EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        ::PostQuitMessage(0);
        return 0;
    }
    return ::DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240607000411913.png)

可以看到，背景模式不是透明的了，并且文本颜色变成了红色，字符背景变成了绿色。



显示DC的默认文本颜色TextColor为黑色，默认背景颜色BkColor为白色，默认背景模式BkMode为不透明。



程序可以通过调用`GetTextColor`函数获取DC的当前文本颜色。

```c
/// <summary>
///  获取绘制的文本颜色
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <returns>文本颜色值</returns>
COLORREF  GetTextColor(HDC hdc);
```

可以通过调用GetBkColor函数获取DC的当前背景颜色。

```c
/// <summary>
/// 获取每个字符后显示的颜色，即背景颜色
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <returns></returns>
COLORREF  GetBkColor(HDC hdc)
```

可以通过调用GetBkMode函数获取DC的当前背景模式。

```c
/// <summary>
/// 获取背景模式是透明还是不透明
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <returns>背景模式</returns>
int GetBkMode(HDC hdc);
```

:::



:::details `获取字符串的宽度和高度`

```
1
```

:::

