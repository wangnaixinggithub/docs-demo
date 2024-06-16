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



## 从绘制文本开始

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



:::details `文本格式属性 S/GettTextAlign`

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

::: details `SetTextAlign`

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





:::details `字符间距 G/SetTextCharacterExtra`



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





:::details `文本颜色和背景颜色、背景模式 S/GetTextColor S/GetBkColor S/GetBkMode `  



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

:::details `设置文本颜色和背景颜色、背景模式 G/SetBkMode G/SetBkColor G/SetTextColor`

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



:::details `获取字符串的宽度和高度 GetCharWidth32 GetTextExtentPoint32`

```c
/// <summary>
/// 获取字符串的宽度和高度
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="iFirstChar">连续字符中的第一个字符</param>
/// <param name="lpBuffer">连续字符中的最后一个字符，不得位于指定的第一个字符之前</param>
/// <returns>接收每个字符宽度的INT数组，字符宽度是逻辑单位</returns>
BOOL GetCharWidth32(HDC hdc,UINT iFirstChar,UINT iLastChar,LPINT lpBuffer);
```

可以把`iFirstChar`和`iLastChar`参数指定为相同的值，只获取一个字符的宽度。



`GetTextExtentPoint32`函数用于获取指定DC中一个字符串的宽度和高度值︰

```c
/// <summary>
/// 获取指定DC中一个字符串的宽度和高度值
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lpString">字符串指针，不要求以零结尾，因为参数c可以指定字符串长度</param>
/// <param name="c">字符串长度，可以使用_tcslen</param>
/// <param name="lpSize">在这个SIZE结构中返回字符串的宽度和高度，逻辑单位</param>
/// <returns></returns>
BOOL GetTextExtentPoint32(HDC hdc,LPCTSTR lpString,int c,LPSIZE lpSize);
```

`lpSize`是一个指向SIZE结构的指针，在这个SIZE结构中返回字符串的宽度和高度

```c
typedef struct tagSIZE
{
	LONG	cx;
	LONG	cy;
}SIZE，*PSIZE，*LPSIZE;
```

前面说过∶`WM_CREATE`消息是窗口过程较早收到的消息之一，程序通常会在这里做一些初始化的工作”。对于`SystemMetrics`程序，我们可以在`WM_CREATE`消息中获取字符串高度，用于在`TextOut`函数中指定y坐标值︰

```c{149-151,160}
#include <Windows.h>
#include <tchar.h>
#include<strsafe.h>
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
	static SIZE size = { 0 }; //存当前当前字符宽度和高度
	TCHAR szBuf[10] = {0};
	int y;

	if (uMsg == WM_CREATE)
	{
		hdc = GetDC(hwnd);
		GetTextExtentPoint32(hdc, METRICS[0].m_pLabel, _tcslen(METRICS[0].m_pLabel), &size);
		ReleaseDC(hwnd, hdc);
		return 0;
	}
	else if (uMsg == WM_PAINT)
	{
		hdc = ::BeginPaint(hwnd, &ps);
		for (int i = 0; i < NUMLINES; i++)
		{
			//计算行间距,可以采用字符高度来
			y = size.cy * i; 
			::TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
			::TextOut(hdc, 240, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
			::TextOut(hdc, 760, y, szBuf, wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
			::SetTextCharacterExtra(hdc, 0);
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

`GetTextExtentPoint32`函数适用于字符串中不包含制表符的情况，如果字符串中包含制表符，则应该调用`GetTabbedTextExtent`函数︰

```c
/// <summary>
/// 获取字符串的宽度和高度
/// </summary>
/// <param name="hDC">设备环境句柄</param>
/// <param name="lpString">字符串指针，不要求以需结尾，因为nCount指定字符串长度</param>
/// <param name="nCount">字符串长度，可以使用_tcslen</param>
/// <param name="nTabPositions">lpnTabStopPositions数组中元素的个数</param>
/// <param name="lpnTabStopPositions">指向包含制表符位置的数组</param>
/// <returns></returns>
DWORD GetTabbedTextExtent(HDC hDC, LPCTSTR lpString, int	nCount, int nTabPositions, const LPINT lpnTabStopPositions);
```

- 如果将`nTabPositions`参数设置为0，并将`lpnTabStopPositions`参数设置为NULL，制表符会自动按平均字符宽度的8倍来扩展。
- 如果将`nTabPositions`参数设置为1，则所有制表符按`lpnTabStopPositions`参数指向的数组中的第一个数组元素指定的距离来分隔。
- 如果函数执行成功，则返回值是字符串的宽度和高度（逻辑单位)，高度值在高位字中，宽度值在低位字中;如果函数执行失败，则返回值为0。

:::





:::details `获取指定为的宏 HIWORD/LOWORD  HIBYTE/LOBYTE`



- `HIWORD`宏可以得到一个32位数的高16位;

- `LOWORD`宏可以得到一个32位数的低16位;

- `HIBYTE`宏可以得到一个16位数的高字节;

- `LOBYTE`宏可以得到一个16位数的低字节。

- `MAKELONG`宏可以将两个16位的数合成为一个32位的LONG型

- `MAKEWORD`宏可以将两个8位的数合成为一个16位的WORD型

```c
#define MAKEWORD(a, b)      ((WORD)(((BYTE)(((DWORD_PTR)(a)) & 0xff)) | ((WORD)((BYTE)(((DWORD_PTR)(b)) & 0xff))) << 8))
#define MAKELONG(a, b)      ((LONG)(((WORD)(((DWORD_PTR)(a)) & 0xffff)) | ((DWORD)((WORD)(((DWORD_PTR)(b)) & 0xffff))) << 16))
#define LOWORD(l)           ((WORD)(((DWORD_PTR)(l)) & 0xffff))
#define HIWORD(l)           ((WORD)((((DWORD_PTR)(l)) >> 16) & 0xffff))
#define LOBYTE(w)           ((BYTE)(((DWORD_PTR)(w)) & 0xff))
#define HIBYTE(w)           ((BYTE)((((DWORD_PTR)(w)) >> 8) & 0xff))
```



:::



## 选择字体

系统提供了6种备用字体，前面说过`GetStockObject`函数用于获取备用画笔、画刷、字体等的[句柄](https://so.csdn.net/so/search?q=句柄&spm=1001.2101.3001.7020)，比如说基于`GetStockObject`获取字体句柄以后，可以通过调用`SelectObject`函数把字体选入DC中，以后通过GDI函数进行文本绘制就会使用新的DC属性。一些备用字体如下表所示。

|        宏含义         |                             值                             |
| :-------------------: | :--------------------------------------------------------: |
|   `ANSI_FIXED_FONT`   |                        等宽系统字体                        |
|    `ANSI_VAR_FONT`    |                        变宽系统字体                        |
| `DEVICE_DEFAULT_FONT` |                        设备默认字体                        |
|  `OEM_FIXED_FONTOEM`  |                 (原始设备制造商）等宽字体                  |
|     `SYSTEM_FONT`     | 系统字体，默认情况下使用系统字体绘制菜单、对话框控件和文本 |
|  `SYSTEM_FIXED_FONT`  |                        等宽系统字体                        |

:::details `SelectObject 函数说明`

`SelectObject`函数可以把一个GDI对象选入指定的DC中∶

```c
/// <summary>
/// 将一个GDI对象 选入指定的DC中
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="h"> GDI对象句柄</param>
/// <returns>上一个GDI对象句柄</returns>
HGDIOBJ SelectObject(HDC hdc,HGDIOBJ h);
```

函数执行成功，返回原来（也就是被替换掉的）对象的句柄。通常需要保存一下返回值，在用新对象完成绘制操作以后，应该再调用一次`SelectObject`函数，用原来的对象替换掉新对象，也就是恢复DC属性。

:::



:::details `为当前设备DC选定等宽字体(OEM_FIXED_FONT)后 绘制文本 `

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
    wndclass.hbrBackground = (HBRUSH)(COLOR_3DFACE + 1);    // 窗口背景使用标准系统颜色
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
    static SIZE size = { 0 };
    TCHAR szBuf[10];
    int y;
    if (uMsg == WM_CREATE)
    {
        //查字符串高度和宽度
        hdc = GetDC(hwnd);
        GetTextExtentPoint32(hdc, METRICS[0].m_pLabel, _tcslen(METRICS[0].m_pLabel), &size);
        ReleaseDC(hwnd, hdc);
        return 0;
    }
    else if (uMsg == WM_PAINT)
    {
        hdc = ::BeginPaint(hwnd, &ps);
        //为当前DC设置等宽字体
        HGDIOBJ preSetFont = SelectObject(hdc, GetStockObject(OEM_FIXED_FONT)); 
        for (int i = 0; i < NUMLINES; i++)
        {
            y = size.cy * i;
            ::TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            ::TextOut(hdc, 240, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            ::TextOut(hdc, 760, y, szBuf, wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        SelectObject(hdc, preSetFont);
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240607225315255.png)

:::



::: tip

重新编译运行，效果稍微好看了一些，但是备用字体比较少。接下来我们学习创建自己喜欢的逻辑字体。用`CreateFont`函数创建具有指定特征的逻辑字体。

:::



:::details `CreateFont 函数定义`

```c
/// <summary>
/// 创建具有指定特征的逻辑字体
/// </summary>
/// <param name="nHeight">字符高度，设置为0表示使用默认的字符高度</param>
/// <param name="nWidth">字符宽度,通常设置为0，表示根据字符的高度来选择合适的字体</param>
/// <param name="nEscapement">字符串的倾斜角度，以0.1度为单位，没有特殊需要一般设置为0</param>
/// <param name="nOrientation">单个字符的倾斜角度，以0.1度为单位，通常这个字段会被忽略</param>
/// <param name="fnWeight">字体粗细，如果设置为0，则使用默认粗细</param>
/// <param name="fdwltalic">是否斜体，设置为TRUE表示使用斜体</param>
/// <param name="fdwUnderline">是否有下划线，设置为TRUE表示使用下划线</param>
/// <param name="fdwStrikeOut">是否有删除线，设置为TRUE表示使用删除线</param>
/// <param name="fdwCharSet">字符集</param>
/// <param name="fdwOutputPrecision">指定Windows通过字体的大小特征来匹配真实字体的方式</param>
/// <param name="fdwClipPrecision">指定裁剪方式，也就是当字符在显示区域以外时,如何只显示部分字符</param>
/// <param name="fdwQuality">指定如何将逻辑字体属性与实际物理字体属性匹配</param>
/// <param name="fdwPitchAndFamily">指定字符间距和字体系列</param>
/// <param name="lpszFace">字体名称，字符串长度不得超过LF_FACESIZE(32)个字符</param>
/// <returns></returns>
HFONT CreateFont(int nHeight,int nWidth,int nEscapement, int nOrientation, int fnWeight,DWORD fdwltalic, DWORD fdwUnderline, DWORD fdwStrikeOut,  DWORD fdwCharSet,DWORD fdwOutputPrecision,DWORD fdwClipPrecision,DWORD fdwQuality,  DWORD fdwPitchAndFamily,LPCTSTR lpszFace );
```

- 前两个参数`nHeight`和`nWidth`均是逻辑单位。

- 第5个参数`fnWeight`指定字体的粗细，字体的粗细在0～1000,400是正常粗细，700是粗体的，如果该参数设置为0，则使用默认粗细。`wingdi.h`头文件中定义了常量用于表示字体粗细，如下表所示。

  |     宏常量      |  值  |
  | :-------------: | :--: |
  |  `FW_DONTCARE`  |  0   |
  |    `FW_THIN`    | 100  |
  | `FW_EXTRALIGHT` | 200  |
  | `FW_ULTRALIGHT` | 200  |
  |   `FW_LIGHT`    | 300  |
  |   `FW_NORMAL`   | 400  |
  |  `FW_REGULAR`   | 400  |
  |   `FW_MEDIUM`   | 500  |
  |  `FW_SEMIBOLD`  | 600  |
  |  `FW_DEMIBOLD`  | 600  |
  | `FW_EXTRABOLD`  | 800  |
  | `FW_ULTRABOLD`  | 800  |
  |   `FW_HEAVY`    | 900  |
  |   `FW_BLACK`    | 900  |

- 第9个参数`fdwCharSet`指定字体的字符集，`OEM_CHARSET`表示`OEM`字符集，`DEFAULT_CHARSET`表示基于当前系统区域的字符集。一些可用的预定义值如下表所示。

|        宏常量         |  值  |        含义        |
| :-------------------: | :--: | :----------------: |
|    `ANSI_CHARSET`     |  0   |  ANSI(美国、西欧)  |
|   `GB2312_CHARSET`    | 134  |      简体中文      |
| `CHINESEBIG5_CHARSET` | 136  |      繁体中文      |
|   `DEFAULT_CHARSET`   |  1   |     默认字符集     |
|     `OEM_CHARSET`     | 255  | 原始设备制造字符集 |
|   `SYMBOL_CHARSET`    |  2   |      标准符号      |
| `EASTEUROPE_CHARSET`  | 238  |     东欧字符集     |
|    `GREEK_CHARSET`    | 161  |    希腊语字符集    |
|     `MAC_CHARSET`     |  77  |  Apple Macintosh   |
|   `RUSSIAN_CHARSET`   | 204  |     俄语字符集     |

- 第10个参数 `fdwOutputPrecision`指定输出精度，也就是指定实际获得的字体与所请求字体的高度、宽度、字符方向、转义、间距和字体类型匹配的程度，一般不使用这个参数。
- 第12个参数`fdwQuality`指定如何将逻辑字体属性与实际物理字体属性匹配。值的含义如下表所示。

|          宏常量          |                             含义                             |
| :----------------------: | :----------------------------------------------------------: |
|   `ANTIALIASED_QUALIT`   | 如果字体支持，并且字体大小不太小或太大，则字体是抗锯齿的或平滑的。 |
|   `CLEARTYPE_QUALITY`    |               使用Clearlype抗锯齿方法显示文本                |
|    `DEFAULT QUALITY`     |                      字体的外观并不重要                      |
|     `DRAFT_QUALITY`      | 对于GDI光栅字体后用缩放,这意味着可以使用更多的字体大小，但质量可能更低 |
| `NONANTIALIASED_QUALITY` |                       字体不会消除锯齿                       |
|     `PROOF_QUALITY`      | 字体的字符质量比逻辑字体属性的精确匹配更重要。对于GDI光栅字体，禁用缩放，并选择最接近大小的字体，虽然使用PROOF_QUALITY时所选字体大小可能无法精确映射，但字体质量高，外观无变形 |

- 第13个参数`fdwPitchAndFamily`指定字符间距和字体系列。其中最低两个位表示该字体是否是一个等宽字体(所有字符的宽度都相同)或是一个变宽字体。`wingdi.h`头文件中定义了下表所列的常量。

|      宏常量       |   含义   |
| :---------------: | :------: |
| `DEFAULT PITCHO`  | 默认间距 |
|  `FIXED PITCH1`   |   等宽   |
| `VARIABLE_PITCH2` |   变宽   |

其中，4～7位指定字体系列，值的含义如下表所示。

|        宏常量         | 含义                                 |
| :-------------------: | ------------------------------------ |
|  `FF_DONTCARE(0<<4)`  | 使用默认字体                         |
|   `FF_ROMAN(1<<4)`    | 具有可变笔画宽度和衬线的字体         |
|   `FF _SWISS(2<<4)`   | 笔画宽度可变且不带衬线的字体         |
|   `FF_MODERN(3<<4)`   | 具有恒定笔画宽度、带或不带衬线的字体 |
|   `FF_SCRIPT(4<<4)`   | 字体看起来像手写，草书就是例子       |
| `FF_DECORATIVE(5<<4)` | 古英语                               |

`CreateFont`函数虽然参数比较多，但是除了字符高度、字符集和字体名称以外，其他参数通常均可以指定为0。` HFONT`是逻辑字体句柄类型，如果函数执行成功，则返回值是所创建逻辑字体的句柄;如果函数执行失败，则返回值为NULL。



:::







当不再需要创建字体时，需要调用`DeleteObject`函数将其删除。`DeleteObject`函数用于删除创建的逻辑画笔、逻辑画刷、逻辑字体、位图、区域等，释放与对象相关联的所有系统资源，对象删除后，指定的句柄不再有效。



:::details `DeleteObject函数说明`

```c
/// <summary>
/// 用于删除创建的逻辑画笔、逻辑画刷、逻辑字体、位图、区域
/// </summary>
/// <param name="hObject">GDI对象句柄 </param>
/// <returns></returns>
BOOL DeleteObject( HGDIOBJ hObject);
```

:::





:::details `使用自定义字体 CreateFont、SelectObject`

```c{154-156}
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
    static SIZE size = { 0 };
    TCHAR szBuf[10];
    int y = 0;
    if (uMsg == WM_CREATE)
    {
        hdc = GetDC(hwnd);
        GetTextExtentPoint32(hdc, METRICS[0].m_pLabel, _tcslen(METRICS[0].m_pLabel), &size);
        ReleaseDC(hwnd, hdc);
        return 0;
    }
    else if (uMsg == WM_PAINT)
    {
        hdc = ::BeginPaint(hwnd, &ps);
        //设置DC使用的逻辑字体 宋体
        HGDIOBJ preSetFont = SelectObject(hdc, 
            ::CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"))); 
        for (int i = 0; i < NUMLINES; i++)
        {
            y = size.cy * i; //计算行间距
            ::TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            ::TextOut(hdc, 240, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            ::TextOut(hdc, 760, y, szBuf, wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        SelectObject(hdc, preSetFont);
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240607231533658.png)

:::



:::tip

`CreateFontIndirect`函数的功能与`CreateFont`函数用途完全相同，不同的是`CreateFontIndirect`函数只需要一个`LOGFONT`结构参数。

:::



:::details `CreateFontIndirect 函数说明`

```c
/// <summary>
/// 创建逻辑字体
/// </summary>
/// <param name="lplf">指定LOGFONT结构的指针</param>
/// <returns></returns>
HFONT CreateFontlndirect(const LOGFONT* lplf);
```

`LOGFONT`结构的字段与`CreateFont`函数的14个参数是一一对应的

```c
typedef struct tagLOGFONT 
{
	LONG lfHeight;
	LONG lfWidth;
	LONG lfEscapement;
	LONG lfOrientation;
    LONG lfWeight;
    BYTE lfltalic;
	BYTE lfUnderline;
	BYTE lfStrikeOut;
	BYTE lfCharSet;
	BYTE lfOutPrecision;
	BYTE lIfClipPrecision;
	BYTE lfQuality;
	BYTE lfPitchAndFamily;
	TCHAR lfFaceName[LF_FACESIZE];
}LOGFONT，*PLOGFONT;
```

:::



`EnumFontFamiliesEx`函数可以根据提供的LOGFONT结构枚举系统中的字体。



:::details `EnumFontFamiliesEx 函数说明`

```c
/// <summary>
/// 枚举系统中所有字体
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lpLogfont">指定字体特征的LOGFONT结构</param>
/// <param name="lpEnumFontFamExProc">回调函数</param>
/// <param name="lParam">传递给回调函数的参数</param>
/// <param name="dwFlags">未使用，必须为0</param>
/// <returns></returns>
int EnumFontFamiliesEx(HDC hdc,LPLOGFONT lpLogfont, FONTENUMPROC lpEnumFontFamExProc,LPARAM lParam,DWORD dwFlags);
```

参数`lpLogfont`是指定字体特征的LOGFONT结构，函数只使用`lfCharSet`  `lfFaceName`和`lfPitchAndFamily`共3个字段。

- `lfCharSet`如果设置为`DEFAULT_CHARSET`，函数将枚举所有字符集中指定名称的字体。如果有两种字体同名，则只枚举一种字体。如果设置为其他有效的字符集，则函数仅枚举指定字符集中的字体 简单的说就是通过字符集进行过滤。
- `lfFaceName`如果设置为空字符串，则函数将在所有字体名称中枚举一种字体;如果设置为有效的字体名称，则函数将枚举具有指定名称的字体。 简单的说就是通过字体名称进行过滤。
- `lfPitchAndFamily` 必须设置为0

也就是说函数是基于字体名称或字符集或两者共同来枚举字体。



参数`lpEnumFontFamExProc`是`EnumFontFamiliesEx`函数的回调函数，对于枚举到的每个字体，都会调用一次这个回调函数。回调函数的格式如下:

```c
/// <summary>
/// EnumFontFamiliesEx函数的回调函数，对于枚举到的每个字体，都会调用一次这个回调函数。
/// </summary>
/// <param name="lpelfe">有关字体逻辑属性信息的LOGFONT结构</param>
/// <param name="lpntme">有关字体物理属性信息的TEXTMETRIC结构</param>
/// <param name="FontType">字体类型，例如DEVICE_FONTTYPE RASTER_ FONTTYPE TRUETYPE_FONTTYPE</param>
/// <param name="lParam">EnumFontFamiliesEx函数的lParam参数</param>
/// <returns></returns>
int CALLBACK EnumFontFamExProc(const LOGFONT* lpelfe, const TEXTMETRIC* lpntme,DWORD FontType, LPARAM lParam);
```

如果需要继续枚举，则回调函数应返回非0,如果需要停止枚举，则返回0

`EnumFontFamiliesEx`函数的返回值是最后一次回调函数调用返回的值。

:::



这样我们很轻易的遍历得到操作系统所有可用的字体了。

```c
#include<Windows.h>
#include<iostream>
int CALLBACK EnumFontFamExProc(const LOGFONT* lpFont, const TEXTMETRIC* lpntme, DWORD FontType, LPARAM lParam)
{
	std::cout << lpFont->lfFaceName  << "\n";
	return 1;
}
int main()
{
	HDC hdc = ::GetDC(NULL);
	LOGFONT  fontInfo;
	ZeroMemory(&fontInfo, sizeof(LOGFONT));
	fontInfo.lfCharSet = DEFAULT_CHARSET;
	fontInfo.lfPitchAndFamily = 0;
	::EnumFontFamiliesEx(hdc, &fontInfo, EnumFontFamExProc,NULL,NULL);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240607235144300.png)

好像是`GDI API `不是很人性化，后面微软迭代更新推出了`GDI Plus` 已增强其GDI操作使用。

:::details `fontCollection->GetFamilies`

```c
#include<Windows.h>
#include<vector>
#include <gdiplus.h>
#include<wchar.h>
#include<iostream>
#pragma comment(lib, "gdiplus.lib") // 添加GDI+库的链接
using namespace Gdiplus;
int main()
{
	ULONG_PTR gdiplusToken; //GDI+ 进入环境时得到的TOKEN
	InstalledFontCollection* fontCollection = nullptr;
	Gdiplus::Status gdiStatus;
	int fontCount = 0; 
	FontFamily* fontFamily  = nullptr;
	int nNumFound = 0;
	Gdiplus::GdiplusStartupInput input;
	

	// 初始化GDI+
	if (GdiplusStartup(&gdiplusToken,&input, NULL) != Gdiplus::Ok)
		return FALSE;

	//创建已安装字体集合对象
	fontCollection = new InstalledFontCollection();

	//查在此字体对象中已经安装的字体系列总数
	fontCount = fontCollection->GetFamilyCount();
	if (fontCount <= 0)
		return FALSE;
	fontFamily = new Gdiplus::FontFamily[fontCount];

	//获取所有字体
	fontCollection->GetFamilies(fontCount, fontFamily, &nNumFound);
	for (size_t i = 0; i < fontCount; i++)
	{
		WCHAR wszFontName[32] = { 0 };
		(fontFamily+i)->GetFamilyName(wszFontName);
		printf("%ws\n", wszFontName);
	}
	//释放资源
	if (fontFamily)
	{
		delete[] fontFamily;
		fontFamily = nullptr;
	}
	if (fontCollection)
	{
		delete fontCollection;
		fontCollection = nullptr;
	}
	//退出GDI+ 环境
	Gdiplus::GdiplusShutdown(gdiplusToken);
}
```

:::



## 获取字体的度量值

:::details `GetTextMetrics 函数说明`

`GetTextMetrics`函数可以获取当前选定字体的度量值，该函数通常用于英文字体。

```c
/// <summary>
/// 获取字体的度量值
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lptm">out,在这个TEXTMETRIC结构中返回字体度量值，逻辑单位</param>
/// <returns></returns>
BOOL GetTextMetrics(HDC	hdc, LPTEXTMETRIC lptm);
```

函数执行成功，返回参数lptm指定的`TEXTMETRIC`结构中返回字体的信息。`TEXTMETRIC`结构的定义如下∶

```c
typedef struct tagTEXTMETRIC 
{
    LONG tmHeight; //字符高度(等于tmAscent + tmDescent)
    LONG tmAscent; //字符基线以上的高度
    LONG tmDescent; //字符基线以下的高度
    LONG tmInternalLeading; //字符高度范围内的一部分顶部空间，可用于重音符号和其他音调符号
    LONG tmExternalLeading; //在行之间添加的额外高度空间
    LONG tmAveCharWidth; //字体中字符(小写字母)的平均宽度(通常定义为字母x的宽度)
    LONG tmMaxCharWidth; //字体中最宽字符的宽度
    LONG tmWeight; //字体的粗细
    LONG tmOverhang; //添加到某些合成字体中的额外宽度
    LONG tmDigitizedAspectx;
    LONG tmDigitizedAspectY;
    TCHAR tmFirstChar; //字体中定义的第一个字符
    TCHAR tmLastChar; //字体中定义的最后一个字符
    TCHAR tmDefaultChar;//字体中所没有字符的替代字符
    TCHAR tmBreakChar; //单词之间的分隔字符，通常是空格
    BYTE tmltalic; //字体为斜体时非零
    BYTE tmUnderlined; //字体有下划线时非零
    BYTE tmStruckOut; //字体有删除线时非雩
    BYTE tmPitchAndFamily; //字体间距(低4位)和字体系列(高4位)
    BYTE tmCharSet; //字体的字符集
}TEXTMETRIC，*PTEXTMETRIC;
```

`tmOverhang`字段表示添加到某些合成字体中(例如粗体或斜体)的每个字符串的额外宽度，例如，GDI通过扩展每个字符的间距并用偏移量值重写字符串，使字符串变为粗体。



TEXTMETRIC结构虽然字段比较多，但是常用的也就是前面几个。字段`tmHeight`  `tmAscent ` `tmDescent`和`tmInternalLeading`之间的关系如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240122213348012-17177757239181.png)



对于等宽字体，大写字母宽度等于字符的平均宽度﹔对于变宽字体，大写字母宽度通常是字符平均宽度的1.5倍。对于变宽字体，TEXTMETRIC结构中的`tmPitchAndFamily`字段的低4位为1，对于等宽字体则为0。计算大写字母宽度的方式为:

```c
cxCaps = (tm.tmPitchAndFamily & 1 ? 3: 2) cxChar / 2;
```

:::



## 绘制文本函数

在选择了适当的字体和所需的文本格式选项后，可以通过调用相关函数来绘制字符或字符串，常用的文本绘制函数有:

- `DrawText`
- `DrawTextEx`
- `TextOut` 
- `ExtTextOut-Poly` 
- `ExtTextOut` 
- `TabbedTextOut`

当调用其中一个函数时，操作系统将此调用传递给GDI图形引擎，而GDI图形引擎又将调用传递给相应的设备驱动程序。其中`ExtTextOut`函数执行速度最快，该调用将快速转换为设备的
`ExtTextOut`调用。但是，有时程序可能更适合调用其他函数，例如，要在指定的矩形区域范围内绘制文本，可以调用`DrawText`函数，要创建具有对齐列的多列文本，可以调用`TabbedTextOut`函数。





:::details `DrawText 函数说明`

```c
/// <summary>
/// 绘制文本
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lpchText">指向字符串内容的指针</param>
/// <param name="cchText">字符串长度，以字符为单位</param>
/// <param name="lpRect">所绘制的文本限定在这个矩形范围内</param>
/// <param name="uFormat">绘制格式选项</param>
/// <returns></returns>
int DrawText(HDC hdc, LPCTSTR lpchText,int cchText, LPRECT lpRect, UINT uFormat);
```

- 参数cchText指定字符串的长度。如果`lpchText`参数指定的字符串是**以零结尾的**，那么`cchText`参数可以设置为-1，**函数会自动计算字符个数**;否则需要指定字符个数。
- 参数uFormat指定格式化文本的方法，常用的值及含义如下表所示。

|     宏常量      |                             含义                             |
| :-------------: | :----------------------------------------------------------: |
|    `DT_TOP`     |                    将文本对齐到矩形的顶部                    |
|   `DT_BUTTON`   | 将文本对齐到矩形的底部，该标志仅与`DT_SINGLELINE`单行文本一起使用 |
|  `DT_VCENTER`   | 文本在矩形内垂直居中，该标志仅与`DT_SINGLELINE`单行文本一起使用 |
|    `DT_LEFT`    |                      文本在矩形内左对齐                      |
|   `DT_RIGHT`    |                      文本在矩形内右对齐                      |
|   `DT_CENTER`   |                     文本在矩形内水平居中                     |
| `DT_SINGLELINE` |          在单行上显示文本，回车和换行符也不能打断行          |
| `DT_WORDBREAK`  |        如果一个单词超过矩形的边界，则自动断开到下一行        |
| `DT_EXPANDTABS` |          展开制表符`\t`，每个制表符的默认字符数是8           |

:::



:::details `DrawTextEx 函数说明`

```c

/// <summary>
/// 绘制文本
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lpchText">字符串指针</param>
/// <param name="cchText">字符串长度，以字符为单位</param>
/// <param name="lpRect">所绘制的文本限定在这个矩形范围内</param>
/// <param name="uFormat">绘制格式选项</param>
/// <param name="lpDTParams">指定扩展格式选项的DRAWTEXTPARAMS结构，可以为NULL</param>
/// <returns></returns>
int DrawTextEx(HDC hdc,LPTSTR lpchText,int cchText, LPRECT lpRect,UINT uFormat, LPDRAWTEXTPARAMS lpDTParams);
```

`DrawTextEx`函数的`lpDTParams`参数是用于指定扩展格式选项的`DRAWTEXTPARAMS`结构，可为NULL。

```c
typedef struct tagDRAWTEXTPARAMS
{
	UINT	cbSize; //该结构的大小
	int iTabLength; //每个制表符的大小，单位等于平均字符宽度
	int	iLeftMargin; //左边距，逻辑单位
	int iRightMargin; //右边距，逻辑单位
	UINT	uiLengthDrawn; //返回函数处理的字符个数，包括空格字符，不包括字符串结束标志
}
DRAWTEXTPARAMS,FAR*LPDRAWTEXTPARAMS;
```

如果函数执行成功，则返回值是以逻辑单位表示的文本高度，如果指定了DT_VCENTER 或DT_BOTTOM，则返回值是从`lpRect->top`到所绘制文本底部的偏移量;如果函数执行失败，则返回值为0。



:::



下面使用`DrawTextEx`函数输出一个字符串看一下效果。

:::details `DrawTextEx 演示`

```c
#include <Windows.h>
#include <tchar.h>
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


    TCHAR szText[] =
        TEXT("For displayed text, if the end of a string does not fit in the rectangle,"
            "it is truncated and ellipses are added.lf a word that is not at the end of"
            "the string goes beyond the limits of the rectangle, it is truncated without ellipses.");
    
    DRAWTEXTPARAMS dtp = { sizeof(DRAWTEXTPARAMS) };
    dtp.iLeftMargin = 10;
    dtp.iRightMargin = 10;
    RECT rect = {0};
    if (uMsg == WM_PAINT)
    {
        hdc = ::BeginPaint(hwnd, &ps);
        ::SetBkMode(hdc, TRANSPARENT);
        ::SetTextColor(hdc, RGB(0,0,255));
        ::GetClientRect(hwnd,&rect);
        //DT_WORDBREAK 如果一个单词超过矩形的边界，则自动断开到下一行
        ::DrawTextEx(hdc,szText,-1,&rect, DT_WORDBREAK,&dtp);
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240610105011075.png)

说明一下 `GetClientRect`函数用于获取客户区的矩形坐标

```c
/// <summary>
/// 获取客户区的矩形坐标
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="lpRect">在这个RECT中返回客户区的坐标，以像素为单位</param>
/// <returns></returns>
BOOL GetClientRect(HWND hWnd,LPRECT lpRect);
```

参数`lpRect`指向的RECT结构返回客户区的左上角和右下角坐标。因为客户区坐标是相对于窗口客户区左上角的，所以获取到的左上角的坐标是(0,0)，即`lpRect->right`等于客户区宽度，`lpRect->bottom`等于客户区高度。

:::



:::details `TabbedTextOut 函数说明`

`TabbedTextOut`函数在指定位置绘制字符串，并将制表符扩展到制表符位置数组中指定的位置。

```c
/// <summary>
/// 绘制文本
/// </summary>
/// <param name="hDC">设备坏境句柄</param>
/// <param name="X">字符串起点的X坐标，逻辑单位</param>
/// <param name="Y">字符串起点的Y坐标，逻辑单位</param>
/// <param name="lpString">字符串指针，不要求以零结尾，参数nCount可以指定字符串长度</param>
/// <param name="nCount">字符串长度，可以使用_tcslen</param>
/// <param name="nTabPositions">lpnTabStopPositions数组中数组元素的个数</param>
/// <param name="lpnTabStopPositions">指向包含制表符位置的数组，逻辑单位</param>
/// <param name="nTabOrigin">制表符开始位置的X坐标，逻辑单位，制表符的位置等于nTabOrigin + lpnTabStopPositions[x]</param>
/// <returns></returns>
LONG TabbedTextOut(HDC hDC, int X,int Y,LPCTSTR lpString,int nCount,int nTabPositions, const LPINT lpnTabStopPositions, int nTabOrigin);
```

- 如果将`nTabPositions`参数设置为0，并将`lpnTabStopPositions`参数设置为NULL，制表符将会按平均字符宽度的8倍来扩展。
- 如果将`nTabPositions`参数设置为1，则所有制表符按l`pnTabStopPositions`指向的数组中的第一个数组元素指定的距离来分隔。

最终， 如果函数执行成功，则返回值是字符串的宽度和高度（逻辑单位)，高度值在高位字中，宽度值在低位字中﹔如果函数执行失败，则返回值为0。

:::



:::details `TabbedTextOut() 示例:`

```c
#include <Windows.h>
#include <tchar.h>
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


    if (uMsg == WM_PAINT)
    {
        TCHAR szText[] = TEXT("姓名\t工作地点\t年龄");
        TCHAR szText2[] = TEXT("小王\t山东省济南市\t18");
        TCHAR szText3[] = TEXT("弗拉基米尔·弗拉基米罗维奇·科夫\t俄罗斯莫斯科\t68");
        LONG iRet = 0;
        INT nTabStopPosition[] = { 260,370 };
        hdc = ::BeginPaint(hwnd, &ps);
        ::SetBkMode(hdc, TRANSPARENT);
        ::SetTextColor(hdc, RGB(0, 0, 255));
        iRet = ::TabbedTextOut(hdc, 0, 0, szText, _tcslen(szText), 2, nTabStopPosition, 0);
        iRet = ::TabbedTextOut(hdc, 0, HIWORD(iRet), szText2, _tcslen(szText2), 2, nTabStopPosition, 0);
        iRet = ::TabbedTextOut(hdc, 0, HIWORD(iRet) * 2, szText3, _tcslen(szText3), 2, nTabStopPosition, 0);
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240201204646769.png)

:::



:::details `ExtTextOut() 函数说明`

`ExtTextOut`函数和`TextOut`一样可以输出文本，区别在于该函数可以指定一个矩形用于裁剪或作为背景。

```c
/// <summary>
///  输出文本
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="x">字符串的开始位置X坐标，相对于客户区左上角，逻辑单位</param>
/// <param name="y">字符串的开始位置Y坐标，相对于客户区左上角，逻辑单位</param>
/// <param name="fuOptions">指定如何使用lprc参数指定的矩形，可以设置为0</param>
/// <param name="prc">指向可选RECT结构的指针，用于裁剪或作为背景，可为NULL</param>
/// <param name="lpString">要绘制的字符串,因为有cbCount参数指定长度，所以不要求以零结尾</param>
/// <param name="cbCount">lpString指向的字符串长度，可以使用_tcslen，不得超过8192</param>
/// <param name="lpDx">指向可选整型数组的指针，该数组指定相邻字符之间的间距</param>
/// <returns></returns>
BOOL ExtTextOut(HDC hdc,int x,int y,UINT fuOptions,const RECT* prc,LPCTSTR lpString,UINT cbCount,const INT* lpDx); 
```

- 参数`fuOptions`指定如何使用`lprc`参数定义的矩形，常用的值如下表所示。

|    宏常量     |                            含义                            |
| :-----------: | :--------------------------------------------------------: |
| `ETO_CLIPPED` | 文本将被裁剪到矩形范围内，就是说矩形范围以外的文本不会显示 |
| `ETO_OPAQUE`  |                  使用当前背景色来填充矩形                  |

- 参数`lpDx`是指向可选数组的指针，该数组指定相邻字符之间的间距。如果设置为NULL，表示使用默认字符间距。

:::



:::details `ExtTextOut() 函数实例:`

```c
#include <Windows.h>
#include <tchar.h>
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
    if (uMsg == WM_PAINT)
    {
        TCHAR szText[] = TEXT("这是一个晴朗的早晨,鸽哨中伴着起床号音~~~");
        LONG iRet = 0;
        INT nTabStopPosition[] = { 260,370 };
        hdc = ::BeginPaint(hwnd, &ps);
        RECT rect = { 0 };
        SIZE size = { 0 };
        ::GetClientRect(hwnd, &rect);
        ::GetTextExtentPoint32(hdc, szText, _tcslen(szText), &size);
        ::ExtTextOut(hdc, rect.right/2 - size.cx/2, rect.bottom/2 - size.cy/2, ETO_OPAQUE, &rect, szText, _tcslen(szText), 0);
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240610112726821.png)

:::

## 加入标准滚动条



在窗口中加入一个标准滚动条比较简单，只需要在`CreateWindow`Ex函数的`dwStyle`参数中指定`WS_HSCROLL/WS_VSCROLL`样式即可。

- WS_HSCROLL表示加入一个水平滚动条.
- WS_VSCROLL表示加入一个垂直滚动条。

:::tip

之所以叫标准滚动条，是因为与之对应的还有一个滚动条控件。滚动条控件是子窗口，可以出现在父窗口客户区的任何位置，后面会讲滚动条控件。

:::



每个滚动条都有相应的"范围"和"位置"。

- 滚动条的范围是一对整数，分别代表滚动条的最小值和最大值。
- 位置是指滑块在范围中所处的值。当滑块在滚动条的最顶端（或最左)时，滑块的位置是范围的最小值,当滑块在滚动条的最底部（(或最右)时，滑块的位置是范围的最大值。

标准滚动条的默认范围是`[0,100]`，滚动条控件的默认范围为空(最小值和最大值均为0)。



通过调用`SetScrollRange`函数，可以把范围改成对程序更有意义的值。



:::details `SetScrollRange 函数说明`

```c
/// <summary>
///  设置滚动条的范围
/// </summary>
/// <param name="hWnd">滚动条所在窗口的窗口句柄</param>
/// <param name="nBar">指定要设置的滚动条</param>
/// <param name="nMinPos">最小滚动位置</param>
/// <param name="nMaxPos">最大滚动位置</param>
/// <param name="bRedraw">是否应该重新绘制滚动条以反映更改</param>
/// <returns></returns>
BOOL SetScrollRange(HWND hWnd,int nBar,int nMinPos,int nMaxPos,BOOL bRedraw);
```

- 参数`nBar`指定要设置的滚动条，该参数如下表所示。

|  宏常量   |                             含义                             |
| :-------: | :----------------------------------------------------------: |
| `SR_HORZ` |                   设置标准水平滚动条的范围                   |
| `SR_VERT` |                   设置标准垂直滚动条的范围                   |
| `SR_CTL`  | 设置滚动条控件的范围，这种情况下`hWnd`参数必须设置为滚动条控件的句柄 |

`nMinPos`和 `nMaxPos`参数指定的值之间的差异不得大于MAXLONG(OX7FFFFFFF)。

:::



:::details `SetScrollPos() 函数说明`



`SetScrollPos`函数用于设置滑块在滚动条中的位置

```c
/// <summary>
/// 设置滑块滚动条中的位置
/// </summary>
/// <param name="hWnd">滚动条所属窗口的窗口句柄</param>
/// <param name="nBar">指定要设置的滚动条，含义同SetScrollRange函数的nBar参数</param>
/// <param name="nPos">滑块的新位置</param>
/// <param name="bRedraw">是否重新绘制滚动条以反映新的滑块位置</param>
/// <returns></returns>
int SetScrollPos(HWND hWnd,int nBar,int nPos,BOOL bRedraw);
```

如果函数执行成功，则返回值是滑块的前一个位置。如果函数执行失败，则返回值为0。

:::



## WM_SIZE消息

在`WinMain`调用`ShowWindow`函数时、在窗口大小更改后、在窗口最小化到任务栏或从任务栏恢复时， Windows都会发送WM_SIZE消息到窗口过程。



- `WM_SIZE`消息的`wParam`参数表示请求的大小调整类型，常用的值如下表所示。

|      宏常量      |                            含义                            |
| :--------------: | :--------------------------------------------------------: |
| `SIZE_RESTORED`  | 窗口的大小已发生变化，包括从最小化或最大化恢复到原来的状态 |
| `SIZE_MINIMIZED` |                        窗口已最大化                        |
| `SIZE MAXIMIZED` |                        窗口已最大化                        |

- `WM_SIZE`消息的`IParam`参数表示窗口客户区的新尺寸，`lParam`的低位字指定客户区的新宽度，`IParam`的高位字指定客户区的新高度。通常这样使用`IParam`参数∶

```c
cxClient = LoWORD(IParam);//客户区的新宽度
cyClient = HIWORD(IParam);//客户区的新高度
```

随着窗口大小的改变，子窗口或子窗口控件通常也需要随之改变位置和大小，以适应新的客户区大小。



例如，记事本程序客户区中用于编辑文本的部件就是一个编辑控件，如果窗口大小改变，程序就需要响应`WM_SIZE`消息，重新计算客户区大小，对编辑控件的大小作出改变。



窗口过程处理完`WM_SIZE`消息以后，应返回0。



如果不是在`WM_SIZE`消息中，可以通过调用`GetClientRect`函数获取客户区尺寸。

## `WM_HSCROLL消息`



当窗口的标准水平滚动条中发生滚动事件时，窗口过程会收到`WM_HSCROLL`消息。



WM_HSCROLL消息的`wParam`	参数表示滑块的当前位置和用户的滚动请求。`wParam`的低位字表示用户的滚动请求，值如下表所示。

|       宏常量       |                             含义                             |
| :----------------: | :----------------------------------------------------------: |
|   `SB_LINELEFT`    |                       向左滚动一个单位                       |
|   `SB_LINERIGHT`   |                       向右滚动一个单位                       |
|   `SB_PAGELEFT`    |                 向左滚动一页(一个客户区宽度)                 |
|   `SB_PAGERIGHT`   |                 向右滚动一页(一个客户区宽度)                 |
| `SB_THUMBPOSITION` | 用户拖动滑块并已释放鼠标，wParam的高位字指示拖动操作结束时滑块的新位置 |
|  `SB_THUMBTRACK`   | 用户正在拖动滑块，该消息会不断发送，直到用户释放鼠标，wParam的高位字实时指示滑块被拖动到的新位置 |
|     `SB_LEFT`      |                 滚动到最左侧，这个暂时用不到                 |
|     `SB_RIGHT`     |                 滚动到最右侧，这个暂时用不到                 |
|   `SB_ENDSCROLL`   |                    滚动已结束，通常不使用                    |

- 如果`wParam`参数的低位字是`SB_THUMBPOSITION`或`SB_THUMBTRACK`，则`wParam`参数的高位字表示滑块的当前位置，在其他情况下无意义。

- 如果消息是由滚动条控件发送的，则`lParam`参数是滚动条控件的句柄如果消息是由标准滚动条发送的，则`lParam`参数为NULL.
- 窗口过程处理完`WM_HSCROLL`消息以后，应返回0.



## `WM_VSCROLL消息`

当窗口的标准垂直滚动条中发生滚动事件时，窗口过程会收到`WM_VSCROLL`消息。



`WM_VSCROLL`消息的`wParam`参数表示滑块的当前位置和用户的滚动请求。`wParam`的低位字表示用户的滚动请求，值如下表所示。



|       宏常量       |                             含义                             |
| :----------------: | :----------------------------------------------------------: |
|   `SB_LINEDOWN`    |                       向下滚动一个单位                       |
|    `SB_LINEUP`     |                       向上滚动一个单位                       |
|   `SB_PAGEDOWN`    |                向下滚动一页（一个客户区高度)                 |
|    `SB_PAGEUP`     |                向上滚动一页（一个客户区高度)                 |
| `SB_THUMBPOSITION` | 用户拖动滑块并已释放鼠标，wParam的高位字指示拖动操作结束时滑块的新位置 |
|  `SB_THUMBTRACK`   | 用户正在拖动滑块，该消息会不断发送，直到用户释放鼠标，wParam的高位字实时指示滑块被拖动到的新位置 |
|      `SB_TOP`      |                 滚动到最上部，这个暂时用不到                 |
|    `SB_BOTTOM`     |                 滚动到最底部，这个暂时用不到                 |
|   `SB_ENDSCROLL`   |              SB_ENDSCROLL滚动已结束，通常不使用              |

- 如果`wParam`参数的低位字是`SB_THUMBPOSITION`或`SB_THUMBTRACK`，则`wParam`参数的高位字表示滑块的当前位置，在其他情况下无意义。

- 如果消息是由滚动条控件发送的，则`IParam`参数是滚动条控件的句柄;如果消息是由标准滚动条发送的，则`IParam`参数为NULL

- 窗口过程处理完`WM_VSCROLL`消息以后，应返回0。





当用户按住水平或垂直滑块进行滑动时，程序通常处理的是`SB_THUMBTRACK`请求，而不是`SB_THUMBPOSITION`请求，以便用户拖动过程中，客户区的内容可以实时发生改变。





用户单击或拖动滚动条的不同位置时的滚动请求如下图所示。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240201211255213-17067931764363.png)



:::details `是时候给下面的SystemMetrics2程序添加标准滚动条了，先添加一个垂直滚动条`

```c{150-151,157-158,185}
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW | WS_VSCROLL,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc = NULL;
    PAINTSTRUCT ps = {0};
    HFONT hFont, hFontOld = NULL;
    static BOOL bIsCalcStrHW = TRUE;           // 只在第一次WM_PAINT消息中计算s_iCol1、s_iCol2、s_iHeight
    static int s_iCol1, s_iCol2, s_iHeight = 0; // 第一列、第二列字符串的最大宽度，字符串高度
    static int s_cxClient, s_cyClient = 0;      // 客户区宽度、高度
    static int s_iVscrollPos = 0;               // 垂直滚动条当前位置
    TCHAR szBuf[10];
    int y;
    if (WM_CREATE == uMsg)
    {
        // 设置垂直滚动条的范围和初始位置
        ::SetScrollRange(hwnd, SB_VERT, 0, NUMLINES - 1, FALSE);
        ::SetScrollPos(hwnd, SB_VERT, s_iVscrollPos, TRUE);
        return 0;
    }
    else if (WM_SIZE == uMsg)
    {
        //查窗口尺寸变化后，新的客户区宽高
        s_cxClient = LOWORD(lParam);
        s_cyClient = HIWORD(lParam);
    }
    else if (WM_VSCROLL == uMsg)
    {
        switch (LOWORD(wParam))
        {
        case SB_LINEUP:
            s_iVscrollPos -= 1;
            break;
        case SB_LINEDOWN:
            s_iVscrollPos += 1;
            break;
        case SB_PAGEUP:
            s_iVscrollPos -= s_cyClient / s_iHeight;
            break;
        case SB_PAGEDOWN:
            s_iVscrollPos += s_cyClient / s_iHeight;
            break;
        case SB_THUMBTRACK:
            s_iVscrollPos = HIWORD(wParam);
            break;
        }
        s_iVscrollPos = min(s_iVscrollPos, NUMLINES - 1);
        s_iVscrollPos = max(0, s_iVscrollPos);
        //查一下，如果当前位置不是开始，则更新滑块位置，并重绘客户区
        if (s_iVscrollPos != GetScrollPos(hwnd, SB_VERT))
        {
            SetScrollPos(hwnd, SB_VERT, s_iVscrollPos, TRUE);

            //产生一个无效区域，创建产生出来WM_PAINT消息，
            InvalidateRect(hwnd, NULL, TRUE);
            //直接把这个消息给到窗口过程
            UpdateWindow(hwnd);
        }
        return 0;
    }
    else if (WM_PAINT == uMsg)
    {
        hdc = BeginPaint(hwnd, &ps);
        ::SetBkMode(hdc, TRANSPARENT);
        hFont = ::CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);
        if (bIsCalcStrHW)
        {
            SIZE size = { 0 };
            //查每一行，对应列的最大cx,以便算出来文本最佳宽度
            for (int i = 0; i < NUMLINES; i++)
            {
                ::GetTextExtentPoint32(hdc, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel), &size);
                if (size.cx > s_iCol1)
                    s_iCol1 = size.cx;
                ::GetTextExtentPoint32(hdc, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc), &size);
                if (size.cx > s_iCol2)
                    s_iCol2 = size.cx;
            }
            // 留一点行间距（高度）
            s_iHeight = size.cy + 2;   
            bIsCalcStrHW = FALSE;
        }
        //针对每一次拖动之后，重新绘制整个客户区文本
        for (int i = 0; i < NUMLINES; i++)
        {
            y = s_iHeight * (i - s_iVscrollPos);
            TextOut(hdc, 0, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            TextOut(hdc, s_iCol1, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            TextOut(hdc, s_iCol1 + s_iCol2, y, szBuf, wsprintf(szBuf, TEXT("%d"), ::GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        SelectObject(hdc, hFontOld);
        DeleteObject(hFont);
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (WM_DESTROY == uMsg)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

程序中有几个变量被定义为静态变量。静态变量保存在全局数据区，而不是保存在堆栈中，不会因为`WindowProc`函数的退出而被销毁，下一次消息处理的时候还可以继续使用上次保存的值。也可以定义为全局变量，但是原则上还是少使用全局变量。



程序需要初始化滚动条的范围和位置。处理滚动请求并更新滑块的位置，否则滑块会在用户松开鼠标以后回到原来的位置。并根据滚动条的变化更新客户区的内容。



在`WM_CREATE`消息中我们设置垂直滚动条的范围和初始位置，把垂直滚动条的范围设置为`[0,NUMLINES -1]`，也就是总行数。然后把滑块初始位置设置为0，`s_iVscrollPos`是静态变量，系统会自动设置未初始化的静态变量初始值为0。



- 如果滚动条的位置是0，则第一行文字显示在客户区的顶部

- 如果位置是其他值，则其他行会显示在顶部。
- 如果位置是NUMLINES -1则最后一行显示在客户区的顶部。



看一下对`WM_PAINT`消息的处理。如果是第一次执行`WM_PAINT`，则需要分别计算出第一列和第二列中最宽的字符串，这个宽度用于`TextOut`函数的X坐标，对于每一行Y坐标的计算如下：

```c
y = s_iHeight * (i - s_iVscrollPos)
```

令`i = 0`(也就是输出第一行) 时，假设垂直滚动条向下滚动了2行也就是`s_iVscrollPos`的值等于2。因为客户区左上角的坐标是`(0，0)`,所以第一行和第二行实际上是跑到了客户区上部，只不过在客户区以外的内容是不可见的。





再看一下对`WM _VSCROLL`消息的处理，我们分别处理了向上滚动一行`SB_LINEUP`、向下滚动一行`SB_LINEDOWN`、向上滚动一页`SB_PAGEUP`、向下滚动一页`SB_PAGEDOWN`和按住滑块拖动。



`SB_THUMBTRACK`的情况。然后需要对滑块新位置`s_iVscrollPos`进行合理范围的判断，否则`s iVscrollPos值会出现小于0或大于NUMLINES -1`的情况。





虽然滑块新位置`s_iVscrollPos`值已经计算好了，但是滑块真正的位置还没有变化，我们应该判断一下`s_iVscrollPos`和滑块的当前位置这两个值是否相等，如果不相等，再调用`SetScrollPos`函数设置滑块位置。



:::





去掉对`InvalidateRect`函数的调用，看一下会是什么现象，是不是存在滚动条可以正常工作，但是客户区内容没有随之滚动的情况?



如果最小化程序窗口，再将窗口恢复到原先的尺寸，导致客户区无效重绘，那么是不是客户区内容就更新过来了呢?



:::details `InvalidateRect函数向指定窗口的更新区域添加一个无效矩形`

```c
/// <summary>
/// 向指定窗口的更新区域添加一个无效矩形
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="pRect">无效矩形，如果设置为NULL，表示整个客户区是无效矩形</param>
/// <param name="bErase">是否擦除更新区域的背景</param>
/// <returns></returns>
BOOL InvalidateRect(HWND hWnd,const RECT pRect,BOOL bErase);
```

`InvalidateRect`函数会导致客户区出现一个无效区域。如果客户区存在无效区域，Windows会发送`WM_PAINT`消息到窗口过程。



这个时候，我们在通过调用`UpdateWindow`函数，主动触发让`Windows`操作系统去检查客户区是否存在无效区域。如果存在，就把`WM_PAINT`消息直接发送到指定窗口的窗口过程，绕过应用程序的消息队列.



即`UpdateWindow`函数导致窗口过程`WindowProc`立即执行`case WM_PAINT`的逻辑，所以可以在`InvalidateRect`函数调用以后紧接着调用`UpdateWindow`函数 达到立即刷新客户区的目的。

:::





:::details `与InvalidateRect函数对应的，还有一个ValidateRect函数，该函数可以从指定窗口的更新区域中删除一个矩形区域:`



```c
/// <summary>
/// 从指定窗口的更新区域中删除一个矩形区域
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="pRect">使之有效的矩形，如果设置为NULL，表示整个客户区变为有效</param>
/// <returns></returns>
BOOL ValidateRect(HWND hWnd,const RECT* pRect);
```

:::



曾经提及，如果可能，我们最好是在`WM_PAINT`消息中处理绘制工作。SystemMetrics2程序就是这
样，绕了个弯，没有在WM VSCROLL消息中进行重绘，而是通过调
用`InvalidateRect`函数生成一个无效区域进而生成`WM_PAINT`消息 在`WM_PAINT`消息中统一进行重绘。这不是舍近求远，而是一举两得。



在学习Windows以前，我以为滚动条是自动的，但实际上需要我们自己处理各种滚动请求并作出更新、重绘，可以理解，Windows程序设计本来就是比较底层的东西。





## `SetScrolllnfo和GetScrolllnfo函数`

SystemMetrics2程序工作正常，但是滑块的大小不能反映一页内容占据总内容的比例。假设总内容总共是3页，那么滑块大小应该是滚动条长度的1/3才可以。实际上,`SetScrollRange`和`SetScrollPos`函数是Windows向后兼容Win16的产物，微软建议我们使用新函数`SetScrolllnfo`。之所以介绍一些老函数，一方面是因为这些函数简单易用，很多资深的程序员还在使用。另一方面，我的目标是既能做开发，又能做逆向，所以有些过时的东西我们还需要去了解。



:::details `SetScrolllnfo 函数说明`

```c
/// <summary>
/// 设置滚动条信息
/// </summary>
/// <param name="hwnd">滚动条所属窗口的句柄，如果fnBar 指定为SB_CTL、则是滚动条控件句柄</param>
/// <param name="fnBar">指定要设置的滚动条，含义同SetScrollRange函数的nBar参数</param>
/// <param name="lpsi">在这个SCROLLINFO结构中指定滚动条的参数</param>
/// <param name="fRedraw">是否重新绘制滚动条以反映对滚动条的更改</param>
/// <returns></returns>
int SetScrolllnfo(HWND hwnd,int fnBar,LPCSCROLLINFO lpsi,BOOL fRedraw);
```

lpsi参数是一个指向SCROLLINFO结构的指针，在这个结构中指定滚动条的参数。

```c
typedef struct tagSCROLLINFO
{
	UINT cbSize; // 该结构的大小，sizeof( SCROLLINFO)
	UINT fMask; //要设置或获取哪些滚动条参数
	int nMin; //最小滚动位置
	int nMax; //最大滚动位置
	UINT nPage; // 页面大小(客户区高度或宽度)，滚动条使用这个字段确定滑块的适当大小
	int nPos;	// 滑块的位置
	int nTrackPos; // 用户正在拖动滑块时的即时位置，可以在处理SB_THUMBTRACK请求时使用该字段
} SCROLLINFO，FAR *LPSCROLLINFO:
```

- fMask字段指定要设置 (SetScrolllnfo) 或获取 (GetScrolllnfo) 哪些滚动条参数，值如下表所示。

|        常量宏         |                             含义                             |
| :-------------------: | :----------------------------------------------------------: |
|      `SIF_PAGE`       |           **nPage** 成员包含比例滚动条的页面大小。           |
|       `SIF_POS`       | **nPos** 成员包含滚动框位置，当用户拖动滚动框时不会更新该位置。 |
|      `SIF_RANGE`      |   **nMin** 和 **nMax** 成员包含滚动范围的最小值和最大值。    |
|       `SIF_ALL`       |      SIF_PAGE、SIF_POS、SIF_RANGE和SIF_TRACKPOS的组合。      |
| `SIF_DISABLENOSCROLL` | 此值仅在设置滚动条的参数时使用。 如果滚动条的新参数使滚动条变得不必要，请禁用滚动条，而不是将其删除。 |
|    `SIF_TRACKPOS`     |       `nTrackPos`成员包含用户拖动滚动框时的当前位置。        |

调用`SetScrolllnfo`函数设置滚动条参数的时候,把`fMask`字段设置为需要设置的标志，并在相应的字段中指定新的参数值，函数返回值是滑块的当前位置。



`SetScrolllnfo`函数会对`SCROLLINFO`结构的`nPage`和`nPos`字段指定的值进行范围检查。

- `nPage`字段必须指定为`[0,nMax-nMin + 1]`的值;

- `nPos`字段必须指定为介于`[nMin,nMax-nPage+1]`的值。

假设一共有95行,我们把范围设置为`[0,94]`，设置`nPage` 字段为一页可以显示35行。计算`nPos` 字段最大值为94 - 35 + 1 = 60。 如果`nPos = 60`,客户区显示`61~95`行，那么最后一行在最底部，而不是最顶部。如果上述字段的值超出范围，则函数会将其设置为刚好在范围内的值。

:::





:::details `GetScrolllnfo 函数说明`

```c

/// <summary>
/// 获取滚动条信息
/// </summary>
/// <param name="hwnd">滚动条所属窗口的句柄，如果fnBar 指定为SB_CTL、则是滚动条控件句柄</param>
/// <param name="fnBar">指定要设置的滚动条，含义同SetScrollRange函数的nBar参数</param>
/// <param name="Ipsi">SCROLLINFO结构中获取滚动条的参数</param>
/// <returns></returns>
BOOL GetScrolllnfo(HWND hwnd,int fnBar,LPSCROLLINFO Ipsi);
```

调用`GetScrolllnfo`函数获取滚动条参数时，`SCROLLINFO.fMask`字段只能使用`SIF_PAGE` `SIF_POS` `SIF_RANGE`和`SIF_TRACKPOS`这几个标志。为了简洁，通常直接指定为`SIF_ALL`标志。函数执行成功，会将指定的滚动条参数复制到SCROLLINFO结构的相关字段中。



在处理`WM_HSCROLL/WM_VSCROLL`消息时，对于`SB_THUMBPOSITIONI`  `SB_THUMBTRACK`滚动请求使用`HIWORD(wParam)`获取到的是16位位置数据，即说最大值为65535。而使用`SetScrolllnfo /GetScrolllnfo`可以设置/获取的范围是32位数据，因为SCROLLINFO结构的范围和位置参数都是int类型.

:::



:::details 接下来，我们使用`SetScrolllnfo`和`GetScrolllnfo`函数改写SystemMetrics2项目。



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
    RegisterClassEx(&wndclass); //采用水平滚动条、垂直滚动条
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW | WS_VSCROLL| WS_HSCROLL,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TEXTMETRIC tm;
    SCROLLINFO si;
    HFONT hFont, hFontOld;
    static int s_iCol1, s_iCol2, s_iCol3, s_iHeight;
    static int s_cxClient, s_cyClient;           
    static int s_cxChar;                          
    int iVertPos, iHorzPos;                        
    SIZE size = { 0 };
    int x, y;
    TCHAR szBuf[10];

    if (uMsg == WM_CREATE)
    {
        hdc = GetDC(hwnd);
        hFont = CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);
        for (int i = 0; i < NUMLINES; i++)
        {
            GetTextExtentPoint32(hdc, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel), &size);
            if (size.cx > s_iCol1)
                s_iCol1 = size.cx;
            GetTextExtentPoint32(hdc, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc), &size);
            if (size.cx > s_iCol2)
                s_iCol2 = size.cx;
            GetTextExtentPoint32(hdc, szBuf,wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)), &size);
            if (size.cx > s_iCol3)
                s_iCol3 = size.cx;
        }
        //高度，加2px，搞多一点点行间距 
        s_iHeight = size.cy + 2;

        //查文本的水平宽度
        GetTextMetrics(hdc, &tm);
        s_cxChar = tm.tmAveCharWidth;
        SelectObject(hdc, hFontOld);
        DeleteObject(hFont);
        ReleaseDC(hwnd, hdc);
        return 0;
    }
    else if (uMsg == WM_SIZE)
    {
        // 查客户区宽度、高度
        s_cxClient = LOWORD(lParam);
        s_cyClient = HIWORD(lParam);

        // 设置垂直滚动条的范围和页面大小
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = NUMLINES - 1;
        si.nPage = s_cyClient / s_iHeight;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);

        // 设置水平滚动条的范围和页面大小
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = (s_iCol1 + s_iCol2 + s_iCol3) / s_cxChar - 1;
        si.nPage = s_cxClient / s_cxChar;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);
        return 0;
    }
    else if (uMsg == WM_VSCROLL)
    {
        //查垂直滚动条的当前位置
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;
        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;
        //根据用户行为先更新一波垂直滚动条的当前位置
        switch (LOWORD(wParam))
        {
        case SB_LINEUP:
            si.nPos -= 1;
            break;
        case SB_LINEDOWN:
            si.nPos += 1;
            break;
        case SB_PAGEUP:
            si.nPos -= si.nPage;
            break;
        case SB_PAGEDOWN:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }
        // 设置位置，然后获取位置，如果si.nPos越界，Windows不会设置
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);
        //再查位置 如果Windows更新了滚动条位置，我们更新客户区
        GetScrollInfo(hwnd, SB_VERT, &si);
        if (iVertPos != si.nPos)
        {
            InvalidateRect(hwnd, NULL, TRUE);
            UpdateWindow(hwnd);
        }
    
        return 0;
    }
    else if (uMsg == WM_HSCROLL)
    {
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;
        switch (LOWORD(wParam))
        {
        case SB_LINELEFT:
            si.nPos -= 1;
            break;
        case SB_LINERIGHT:
            si.nPos += 1;
            break;
        case SB_PAGELEFT:
            si.nPos -= si.nPage;
            break;
        case SB_PAGERIGHT:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);
        GetScrollInfo(hwnd, SB_HORZ, &si);
        if (iHorzPos != si.nPos)
        {
            InvalidateRect(hwnd, NULL, TRUE);
            UpdateWindow(hwnd);
        }
        return 0;
    }
    else if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);

        // 获取垂直滚动条、水平滚动条位置
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;

        //DC模式设置
        SetBkMode(hdc, TRANSPARENT);
        hFont = CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);

        for (int i = 0; i < NUMLINES; i++)
        {
            x = s_cxChar * (-iHorzPos);
            y = s_iHeight * (i - iVertPos);
            TextOut(hdc, x, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            TextOut(hdc, x + s_iCol1, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            TextOut(hdc, x + s_iCol1 + s_iCol2, y, szBuf, wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        SelectObject(hdc, hFontOld);
        DeleteObject(hFont);
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E4%BC%98%E5%8C%96%E5%90%8E%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1.gif)



编译运行，可以发现，因为`WM_SIZE`消息中`SetScrolllnfo`函数的`SCROLLINFO`结构的`fMask`字段没有指定`SIF_DISABLENOSCROLL`标志，所以在不需要水平滚动条的时候，水平滚动条是不显示的。





SystemMetrics3程序最先执行的是`WM_CREATE`消息，然后是`WM_SIZE`和`WM_PAINT`。因为在`WM_SIZE`消息中需要使用`s_iCol1` `s_iCol2s`  `s_iCol3`  `s_iHeight`  `s_cxChar`这些变量，所以我们需要在`WM_CREATE`消息中提前获取这些值。





看一下`WM_VSCROLL`消息的处理，首先调用`GetScrolllnfo`函数获取滚动以前的位置。然后根据滚动请求更新`si.nPos`的值，调用`SetScrolllnfo`函数更新滚动条位置，再次调用`GetScrolllnfo`函数看一下滚动条位置是否真的变化了，如果变化了，就调用`InvalidateRect`函数使整个客户区无效。



为什么绕这么大一个弯呢?前面说过，`SetScrolllnfo`函数会对`SCROLLINFO`结构的`nPage`和`nPos`字段指定的值进行范围检查。





`nPage`字段必须指定为介于`[0,nMax - nMin + 1]`的值 `nPos`字段必须指定为介于`[nMin,nMax - max(nPage -1,0)]`的值。如果任一值超出其范围，则函数将其设置为刚好在范围内的值。





举例：现在垂直滚动条滑块在位置0处则向上滚动一个单位，执行`SB_LINEUP`请求，`si.nPos`的值变为`-1`  `SetScrolllnfo`函数是不会向上滚动一个单位的，就是说滑块位置不会变化。

:::



## 只刷新无效区域

前面的SystemMetrics2和SystemMetrics3程序，不管客户区是滚动了一行还是一页，都统统宣布整个客户区无效。如果刷新客户区的代码很麻烦且耗时的话，就会造成程序界面卡顿。前面曾多次提及无效区域的概念，发生滚动条滚动请求以后，我们可以仅让新出现的那些行无效，WM PAINT只需要刷新这些行所占的区域即可，这样的逻辑无疑会更高效。当然了，对于代码逻辑很简单的情况，在当今强大的CPU面前，我们应该更注重代码简洁与易于理解。下面我们就只刷新无效区域，仅列出`WindowProc`中代码发生变化的几个消息 。



:::details `ScrollWindow 函数说明`

```c
/// <summary>
/// 滚动指定窗口的客户区
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="XAmount">水平滚动的量</param>
/// <param name="YAmount">垂直滚动的量</param>
/// <param name="pRect">将要滚动的客户区部分的RECT结构设置为NULL，则滚动整个客户区</param>
/// <param name="">裁剪矩形RECT结构，矩形外部的区域不会被绘制</param>
/// <returns></returns>
BOOL ScrollWindow(HWND hWnd,int XAmount,int YAmount,const RECT* pRect,const RECT pClipRect);
```

`lpRect`和`lpClipRect`这两个参数挺有意思的，读者可以试着设置一下这两个参数看一看效果。
Windows会自动将新滚动出现的区域无效化，从而产生一条`WM_PAINT`消息，因此不需要调用`InvalidateRect`函数。

:::





:::details `ScrollWindow 只刷新无效区域`

```c{286-297,228,263}
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
    RegisterClassEx(&wndclass); //采用水平滚动条、垂直滚动条
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW | WS_VSCROLL| WS_HSCROLL,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TEXTMETRIC tm;
    SCROLLINFO si;
    HFONT hFont, hFontOld;
    static int s_iCol1, s_iCol2, s_iCol3, s_iHeight;
    static int s_cxClient, s_cyClient;              // 客户区宽度、高度
    static int s_cxChar;                            // 平均字符宽度，用于水平滚动条滚动单位
    int iVertPos, iHorzPos;                         // 垂直、水平滚动条的当前位置
    SIZE size = { 0 };
    int x, y;
    TCHAR szBuf[10];

    if (uMsg == WM_CREATE)
    {
        hdc = GetDC(hwnd);
        hFont = CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);    
        for (int i = 0; i < NUMLINES; i++)
        {
            GetTextExtentPoint32(hdc, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel), &size);
            if (size.cx > s_iCol1)
                s_iCol1 = size.cx;
            GetTextExtentPoint32(hdc, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc), &size);
            if (size.cx > s_iCol2)
                s_iCol2 = size.cx;
            GetTextExtentPoint32(hdc, szBuf,wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)), &size);
            if (size.cx > s_iCol3)
                s_iCol3 = size.cx;
        }
        s_iHeight = size.cy + 2;             
        GetTextMetrics(hdc, &tm);
        s_cxChar = tm.tmAveCharWidth;     
        SelectObject(hdc, hFontOld);
        DeleteObject(hFont);
        ReleaseDC(hwnd, hdc);
        return 0;
    }
    else if (uMsg == WM_SIZE)
    {

        s_cxClient = LOWORD(lParam);
        s_cyClient = HIWORD(lParam); 
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = NUMLINES - 1;
        si.nPage = s_cyClient / s_iHeight;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);        
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = (s_iCol1 + s_iCol2 + s_iCol3) / s_cxChar - 1;
        si.nPage = s_cxClient / s_cxChar;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);         
        return 0;
    }
    else if (uMsg == WM_VSCROLL)
    {

        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;

        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;
        switch (LOWORD(wParam))
        {
        case SB_LINEUP:
            si.nPos -= 1;
            break;
        case SB_LINEDOWN:
            si.nPos += 1;
            break;
        case SB_PAGEUP:
            si.nPos -= si.nPage;
            break;
        case SB_PAGEDOWN:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);
        GetScrollInfo(hwnd, SB_VERT, &si);
        // 如果Windows更新了滚动条位置，我们更新客户区
        if (iVertPos != si.nPos)
        {
            ::ScrollWindow(hwnd, 0, s_iHeight * (iVertPos - si.nPos), NULL, NULL);
            ::UpdateWindow(hwnd);
        }
        return 0;
    }
    else if (uMsg == WM_HSCROLL)
    {
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;
        switch (LOWORD(wParam))
        {
        case SB_LINELEFT:
            si.nPos -= 1;
            break;
        case SB_LINERIGHT:
            si.nPos += 1;
            break;
        case SB_PAGELEFT:
            si.nPos -= si.nPage;
            break;
        case SB_PAGERIGHT:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS | SIF_DISABLENOSCROLL;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);
        GetScrollInfo(hwnd, SB_HORZ, &si);
        if (iHorzPos != si.nPos)
        {
            ::ScrollWindow(hwnd, s_cxChar * (iHorzPos - si.nPos), 0, NULL, NULL);
            ::UpdateWindow(hwnd);
        }
        return 0;
    }
    else if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);

        // 获取垂直滚动条、水平滚动条位置
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;

        SetBkMode(hdc, TRANSPARENT);
        hFont = CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);

        //获取无效区域
        int  nPaintBeg = max(0, iVertPos + ps.rcPaint.top / s_iHeight);
        int nPaintEnd = min(NUMLINES - 1, iVertPos + ps.rcPaint.bottom / s_iHeight);
        //只对无效区域做重绘。
        for (int i = nPaintBeg; i <= nPaintEnd; i++)
        {
            x = s_cxChar * (-iHorzPos);
            y = s_iHeight * (i - iVertPos);
            TextOut(hdc, x, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            TextOut(hdc, x + s_iCol1, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            TextOut(hdc, x + s_iCol1 + s_iCol2, y, szBuf, wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        SelectObject(hdc, hFontOld);
        DeleteObject(hFont);
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

:::



## 根据客户区内容调整程序窗口大小

在我的1920 1080分辨率的笔记本上，`CreateWindowEx`函数的宽度和高度参数指定为`CW_USEDEFAULT`，SystemMetrics3程序运行效果如图3下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240202225627306-17068857886004.png)



可以看到客户区右边还有一大块空白，不是很美观。我们希望窗口宽度正好容纳3列文本，即根据3列文本的宽度之和计算窗口宽度。窗口宽度包括客户区宽度、滚动条宽度和边框宽度等，计算起来不是很方便。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240202225654571-17068858159155.png)



为了让显示内容铺满整个客户区，我先要先介绍一下`GetWindowLongPtr`  `AdjustWindowRectEx`
和`SetWindowPos`这3个函数。





:::details `G/SetWindowLongPtr 函数定义`



`SetWindowLongPtr`函数设置窗口类中与每个窗口关联的额外内存的数据(`wndclass.cbWndExtra`),  或设置指定窗口的属性（重点）

```c

/// <summary>
/// 设置指定窗口的属性
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="nIndex">要设置哪一项</param>
/// <param name="dwNewLong">新值</param>
/// <returns></returns>
LONG_PTR  SetWindowLongPtr(HWND hWnd,int nIndex,LONG_PTR dwNewLong);
```

- 参数`nIndex`指定要设置哪一项。如果要设置窗口的一些属性，值如下表所示。

|      常用宏      |           含义           |
| :--------------: | :----------------------: |
|  `GWL_EXSTYLE`   |     设置扩展窗口样式     |
|   `GWL_STYLE`    |       设置窗口样式       |
| `GWLP_HINSTANCE` |  设置应用程序的实例句柄  |
|    `GWLP_ID`     | 设置窗口的ID，用于子窗口 |
| `GWLP_USERDATA`  | 设置与窗口关联的用户数据 |
|  `GWLP_WNDPROC`  |  设置指向窗口过程的指针  |

如果函数执行成功，则返回值是指定偏移量处或窗口属性的先前值,如果函数执行失败，则返回值为0。



`GetWindowLong`和`GetWindowLongPtr`函数可以获取指定窗口的自定义数据或窗口的一些属性:

```c
/// <summary>
/// 获取指定窗口的自定义数据或窗口的属性
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="nlndex">要获取哪一项</param>
/// <returns></returns>
LONG_PTR GetWindowLongPtr(HWND hWnd,int nlndex);
```

如果函数执行成功，则返回所请求的值。如果函数执行失败，则返回值为0。





:::tip

SetWindowLongPtr是SetWindowLong函数的升级版本，指针和句柄在32位Windows上为32位，在64位Windows上为64位。使用SetWindowLong函数设置指针或句柄只能设置32位的，要编写32位和64位版本兼容的代码，应该使用
SetWindowLongPtr函数。如果编译为32位程序，则对SetWindowLongPtr函数的调用实际上还是调用SetWindowLong。

:::

:::



:::details `AdjustWindowRectEx 函数说明`

```c
/// <summary>
/// 根据客户区的大小计算所需的窗口大小
/// </summary>
/// <param name="lpRect">out,提供客户区坐标的RECT结构，函数在这个结构中返回所需的窗口坐标</param>
/// <param name="dwStyle">窗口的窗口样式</param>
/// <param name="bMenu">窗口是否有菜单</param>
/// <param name="dwExStyle">窗口的扩展窗口样式</param>
/// <returns></returns>
BOOL AdjustWindowRectEx(LPRECT lpRect,DWORD dwStyle,BOOL bMenu,DWORD dwExStyle);
```

:::



:::details `SetWindowPos 函数说明`

```c

/// <summary>
/// 更改一个子窗口、顶级窗口的大小、位置和Z顺序
/// </summary>
/// <param name="hWnd">要调整大小、位置或顺序的窗口的窗口句柄</param>
/// <param name="hWndInsertAfter">指定一个窗口句柄或一些预定义值</param>
/// <param name="X">窗口新位置的X坐标，以像素为单位</param>
/// <param name="Y">窗口新位置的Y坐标，以像素为单位</param>
/// <param name="cx">窗口的新宽度，以像素为单位</param>
/// <param name="cy">窗口的新高度，以像素为单位</param>
/// <param name="uFlags">窗口的大小和定位标志</param>
/// <returns></returns>
BOOL WINAPI SetWindowPos(HWND hWnd,HWND hWndInsertAfter,int X,int Y,int cx,int cy, UINT uFlags);
```

- 参数`hWndInsertAfter`指定一个窗口句柄，`hWnd`窗口将位于这个窗口之前，即`hWndlnsertAfter`窗口作为定位窗口，可以设置为NULL。参数`hWndlnsertAfter`也可以指定为下表所示的值。

|      宏常量      |                       含义                       |
| :--------------: | :----------------------------------------------: |
|    `HWND_TOP`    |             把窗口放置在Z顺序的顶部              |
|  `HWND_BOTTOM`   |             把窗口放置在Z顺序的底部              |
|  `HWND_TOPMOST`  | 窗口始终保持为最顶部的窗口，即使该窗口没有被激活 |
| `HWND_NOTOPMOST` |            取消始终保持为最顶部的窗口            |

- 参数X和Y指定窗口新位置的X和Y坐标。如果`hWnd`参数指定的窗口是顶级窗口，则相对于屏幕左上角;如果是子窗口，则相对于父窗口客户区的左上角。
- 参数`uFlags`指定窗口的大小和定位标志，常用的值如下表所示

|      宏定义      |                  含义                  |
| :--------------: | :------------------------------------: |
|  `SWP_NOZORDER`  | 维持当前Z序 (忽略hWndInsertAfter参数） |
|   `SWP_NOMOVE`   |       维持当前位置(忽略X和Y参数)       |
|   `SWP_NOSIZE`   |      维持当前尺寸(忽略cx和cy参数)      |
| `SWP_HIDEWINDOW` |                隐藏窗口                |
| `SWP_SHOWWINDOW` |                显示窗口                |

例如下面的示例使用`SWP_NOZORDERISWP_NOMOVE`标志，表示忽略`hWndInsertAfter` X和Y参数，保持Z顺序和窗口位置不变，仅改变窗口大小。





有时候我们希望把一个窗口设置为始终保持为最顶部,可以这样使用:

```c
SetWindowPos(hwnd, HWND_TOPMOST,0,0,0,0,SWP_NOMOVE|SWP_NOSIZE);
```

:::





:::details `MoveWindow 函数说明`



```c
/// <summary>
/// 更改一个子窗口、顶级窗口的位置和尺寸 通常用于子窗口
/// </summary>
/// <param name="hWnd">要调整大小、位置的窗口的窗口句柄</param>
/// <param name="X"> 窗口新位置的X坐标，以像素为单位</param>
/// <param name="Y">窗口新位置的Y坐标，以像素为单位</param>
/// <param name="nWidth">窗口的新宽度，以像素为单位</param>
/// <param name="nHeight">窗口的新高度，以像素为单位</param>
/// <param name="bRepaint">是否要重新绘制窗口，通常指定为TRUE</param>
/// <returns></returns>
BOOL WINAPI MoveWindow(HWND hWnd,int X, int Y, int nWidth, int nHeight,BOOL bRepaint);
```

:::



:::details `实现依据客户区内容调整程序窗口大小 `

```c{173-177}
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
    RegisterClassEx(&wndclass); //采用水平滚动条、垂直滚动条
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW | WS_VSCROLL| WS_HSCROLL,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TEXTMETRIC tm;
    SCROLLINFO si;
    HFONT hFont, hFontOld;
    static int s_iCol1, s_iCol2, s_iCol3, s_iHeight;
    static int s_cxClient, s_cyClient;              // 客户区宽度、高度
    static int s_cxChar;                            // 平均字符宽度，用于水平滚动条滚动单位
    int iVertPos, iHorzPos;                         // 垂直、水平滚动条的当前位置
    SIZE size = { 0 };
    int x, y;
    TCHAR szBuf[10];
    RECT rect;

    if (uMsg == WM_CREATE)
    {
        hdc = GetDC(hwnd);
        hFont = CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);    
        for (int i = 0; i < NUMLINES; i++)
        {
            GetTextExtentPoint32(hdc, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel), &size);
            if (size.cx > s_iCol1)
                s_iCol1 = size.cx;
            GetTextExtentPoint32(hdc, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc), &size);
            if (size.cx > s_iCol2)
                s_iCol2 = size.cx;
            GetTextExtentPoint32(hdc, szBuf,wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)), &size);
            if (size.cx > s_iCol3)
                s_iCol3 = size.cx;
        }
        s_iHeight = size.cy + 2;             
        GetTextMetrics(hdc, &tm);
        s_cxChar = tm.tmAveCharWidth;     
        
        //根据显示内容,更新客户区大小
        GetClientRect(hwnd, &rect);
        rect.right = s_iCol1 + s_iCol2 + s_iCol3 + GetSystemMetrics(SM_CXVSCROLL);
        AdjustWindowRectEx(&rect, GetWindowLongPtr(hwnd, GWL_STYLE), GetMenu(hwnd) != NULL, GetWindowLongPtr(hwnd, GWL_EXSTYLE));
        SetWindowPos(hwnd, NULL, 0, 0, rect.right - rect.left, rect.bottom - rect.top, SWP_NOZORDER | SWP_NOMOVE);


        SelectObject(hdc, hFontOld);
        DeleteObject(hFont);
        ReleaseDC(hwnd, hdc);
        return 0;
    }
    else if (uMsg == WM_SIZE)
    {

        s_cxClient = LOWORD(lParam);
        s_cyClient = HIWORD(lParam); 
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = NUMLINES - 1;
        si.nPage = s_cyClient / s_iHeight;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);        
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = (s_iCol1 + s_iCol2 + s_iCol3) / s_cxChar - 1;
        si.nPage = s_cxClient / s_cxChar;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);         
        return 0;
    }
    else if (uMsg == WM_VSCROLL)
    {

        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;

        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;
        switch (LOWORD(wParam))
        {
        case SB_LINEUP:
            si.nPos -= 1;
            break;
        case SB_LINEDOWN:
            si.nPos += 1;
            break;
        case SB_PAGEUP:
            si.nPos -= si.nPage;
            break;
        case SB_PAGEDOWN:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);
        GetScrollInfo(hwnd, SB_VERT, &si);
        if (iVertPos != si.nPos)
        {
            ::ScrollWindow(hwnd, 0, s_iHeight * (iVertPos - si.nPos), NULL, NULL);
            ::UpdateWindow(hwnd);
        }
        return 0;
    }
    else if (uMsg == WM_HSCROLL)
    {
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;
        switch (LOWORD(wParam))
        {
        case SB_LINELEFT:
            si.nPos -= 1;
            break;
        case SB_LINERIGHT:
            si.nPos += 1;
            break;
        case SB_PAGELEFT:
            si.nPos -= si.nPage;
            break;
        case SB_PAGERIGHT:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS | SIF_DISABLENOSCROLL;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);
        GetScrollInfo(hwnd, SB_HORZ, &si);
        if (iHorzPos != si.nPos)
        {
            ::ScrollWindow(hwnd, s_cxChar * (iHorzPos - si.nPos), 0, NULL, NULL);
            ::UpdateWindow(hwnd);
        }
        return 0;
    }
    else if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;

        SetBkMode(hdc, TRANSPARENT);
        hFont = CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);

        //获取无效区域做重绘
        int  nPaintBeg = max(0, iVertPos + ps.rcPaint.top / s_iHeight);
        int nPaintEnd = min(NUMLINES - 1, iVertPos + ps.rcPaint.bottom / s_iHeight);
        for (int i = nPaintBeg; i <= nPaintEnd; i++)
        {
            x = s_cxChar * (-iHorzPos);
            y = s_iHeight * (i - iVertPos);
            TextOut(hdc, x, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            TextOut(hdc, x + s_iCol1, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            TextOut(hdc, x + s_iCol1 + s_iCol2, y, szBuf, wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        SelectObject(hdc, hFontOld);
        DeleteObject(hFont);
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240202230449041.png)

窗口高度我们没有改变。首先通过调用GetClientRect函数获取客户区坐标，客户区坐标是相对于窗口客户区左上角的，因此获取到的左上角的坐标是(0,0)，即rect.right等于客户区宽度，rect.bottom等于客户区高度。



把客户区的宽度重新设置为三列文本宽度之和再加上垂直滚动条的宽度。



为AdjustWindowRectEx函数指定窗口样式、扩展窗口样式以及是否有菜单栏，该函数可以根据客户区坐标计算窗口坐标，但是计算出的窗口坐标不包括滚动条，所以前面客户区的宽度我们又加上了一个垂直滚动条的宽度，需要注意的是，计算出来的窗口坐标是相对于客户区左上角的。窗口坐标的左上角并不是(0,0)，所以
窗口宽度等于rect.right-rect.left，窗口高度等于rect.bottom-rect.top;最后调用SetWindowPos函数设置窗口大小。



`GetMenu`函数获取指定窗口的菜单句柄，如果函数执行成功，则返回值是菜单的句柄;如果这个窗口没有菜单，则返回NULL，这个函数很简单。

:::





总结一下，窗口过程在什么时候会收到**WM_PAINT**消息?

- 当程序窗口被首次创建时，整个客户区都是无效的，因为此时应用程序尚未在该窗口上绘制任何东西，此时窗口过程会收到第一条 `WM_PAINT`消息。
- 在调整程序窗口的尺寸时，客户区也会变为无效。我们把WNDCLASSEX结构的style字段设置为
  `CS_HREDRAW|CS_VREDRAW`，表示当程序窗口尺寸发生变化时整个窗口客户区都应宣布无效，窗口过程会接收到一条`WM_PAINT`消息。

- 如果先最小化程序窗口，然后将窗口恢复到原先的尺寸，那么Windows并不会保存原先客户区的内容，窗口过程接收到`WM_PAINT`消息后需要自行恢复客户区的内容。

- 程序调用InvalidateRect或InvalidateRgn函数向客户区添加无效区域，会生成`WM_PAINT`消息。

- 在屏幕中拖动程序窗口的全部或一部分到屏幕以外，然后又拖动回屏幕中的时候，窗口被标记为无效，窗口过程会收到一条`WM_PAINT` 消息，并对客户区的内容进行重绘.

- 程序调用`ScrollWindow`或`ScrollDC`函数滚动客户区。



## 保存设备环境

调用`GetDC`或`BeginPaint`函数以后，会返回一个DC句柄，DC的所有属性都被设定为默认值。如果程序需要使用非默认的DC属性，可以在获取到DC句柄以后设置相关DC属性;在调用`ReleaseDC`或`EndPaint`函数以后，系统将恢复DC属性的默认值，对属性所做的任何改变都会丢失。例如:

```c
case WM_PAINT:
    hdc = BeginPaint(hwnd, &ps);
    //设置设备环境属性
    // 绘制代码
    EndPaint(hwnd, &ps);
    return 0;
```

有没有办法在释放DC时保存对属性所做的更改，以便在下次调用GetDC或BeginPaint函数时这些属性仍然有效呢?



:::tip

还记得WNDCLASSEX结构的第2个字段style吗?这个字段指定窗口类样式，其中`CS_OWNDC`表示为窗口类的每个窗口分配唯一的DC。可以按如下方式设置style字段

```c
wndclass.style = CS_HREDRAWI|CS_VREDRAWI|CS_OWNDC:
```

现在，每个基于这个窗口类创建的窗口都有它私有的专用DC。使用`CS_OWNDC`样式以后，只需要初始化DC属性一次，例如，在处理`WM_CREATE`消息时:

```c
case WM_CREATE:
    hdc = GetDC(hwnd);
    //设置设备环境属性
    ReleaseDC(hwnd, hdc);
	return 0;
```



在窗口的生命周期内，除非再次改变DC的属性值，原DC属性会一直有效。对于`SystemMetrics`程序，我们可以在`WM_CREATE`消息中设置背景模式和字体，这样一来就不需要每一次都在`WM_PAINT`消息中
设置了。对于客户区需要大量绘图操作的情况，指定`CS_OWNDC`样式可以提高程序性能。
需要注意的是，指定`CS_OWNDC`样式仅影响通过`GetDC`和`BeginPaint`函数获取的DC句柄，通过其他函数 (例如`GetWindowDC`) 获取的DC是不受影响的。

:::



:::details `保存设备环境示例:`

```c{116,155-184}
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
// 函数声明，窗口过程
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;                            
    TCHAR szClassName[] = TEXT("MyWindow");        
    TCHAR szAppName[] = TEXT("GetSystemMetrics");   
    HWND hwnd;                                      
    MSG msg;                    
    wndclass.cbSize = sizeof(WNDCLASSEX);
    wndclass.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC; //激活~~~~令窗口分配唯一的DC实例，而不是每一次都创建新的
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW | WS_VSCROLL | WS_HSCROLL,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    TEXTMETRIC tm;
    SCROLLINFO si;
    HFONT hFont, hFontOld;
    static int s_iCol1, s_iCol2, s_iCol3, s_iHeight;
    static int s_cxClient, s_cyClient;             
    static int s_cxChar;                          
    int iVertPos, iHorzPos;                      
    SIZE size = { 0 };
    int x, y;
    RECT rect;
    TCHAR szBuf[10];
    if (uMsg == WM_CREATE)
    {
        hdc = GetDC(hwnd);
        hFont = CreateFont(12, 0, 0, 0, 0, 0, 0, 0, GB2312_CHARSET, 0, 0, 0, 0, TEXT("宋体"));
        hFontOld = (HFONT)SelectObject(hdc, hFont);        
        SetBkMode(hdc, TRANSPARENT);
        for (int i = 0; i < NUMLINES; i++)
        {
            GetTextExtentPoint32(hdc, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel), &size);
            if (size.cx > s_iCol1)
                s_iCol1 = size.cx;
            GetTextExtentPoint32(hdc, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc), &size);
            if (size.cx > s_iCol2)
                s_iCol2 = size.cx;
            GetTextExtentPoint32(hdc, szBuf,wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)), &size);
            if (size.cx > s_iCol3)
                s_iCol3 = size.cx;
        }
        s_iHeight = size.cy + 2;             //高度，加2px，搞多一点点行间距 
        GetTextMetrics(hdc, &tm);
        s_cxChar = tm.tmAveCharWidth;       

        GetClientRect(hwnd, &rect);
        rect.right = s_iCol1 + s_iCol2 + s_iCol3 + GetSystemMetrics(SM_CXVSCROLL);
        AdjustWindowRectEx(&rect, GetWindowLongPtr(hwnd, GWL_STYLE), GetMenu(hwnd) != NULL, GetWindowLongPtr(hwnd, GWL_EXSTYLE));
        SetWindowPos(hwnd, NULL, 0, 0, rect.right - rect.left, rect.bottom - rect.top, SWP_NOZORDER | SWP_NOMOVE);
        DeleteObject(hFont);
        ReleaseDC(hwnd, hdc);
        return 0;
    }
    else if (uMsg == WM_SIZE)
    {

        s_cxClient = LOWORD(lParam);
        s_cyClient = HIWORD(lParam); 
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = NUMLINES - 1;
        si.nPage = s_cyClient / s_iHeight;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_RANGE | SIF_PAGE;
        si.nMin = 0;
        si.nMax = (s_iCol1 + s_iCol2 + s_iCol3) / s_cxChar - 1;
        si.nPage = s_cxClient / s_cxChar;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);        
        return 0;

    }
    else if (uMsg == WM_VSCROLL)
    {

        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;
        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;
        //根据用户行为先更新一波垂直滚动条的当前位置
        switch (LOWORD(wParam))
        {
        case SB_LINEUP:
            si.nPos -= 1;
            break;
        case SB_LINEDOWN:
            si.nPos += 1;
            break;
        case SB_PAGEUP:
            si.nPos -= si.nPage;
            break;
        case SB_PAGEDOWN:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }

        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        SetScrollInfo(hwnd, SB_VERT, &si, TRUE);
        GetScrollInfo(hwnd, SB_VERT, &si);
        if (iVertPos != si.nPos)
        {
            ::ScrollWindow(hwnd, 0, s_iHeight * (iVertPos - si.nPos), NULL, NULL);
            ::UpdateWindow(hwnd);
        }
        return 0;

    }
    else if (uMsg == WM_HSCROLL)
    {
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_ALL;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;
        switch (LOWORD(wParam))
        {
        case SB_LINELEFT:
            si.nPos -= 1;
            break;
        case SB_LINERIGHT:
            si.nPos += 1;
            break;
        case SB_PAGELEFT:
            si.nPos -= si.nPage;
            break;
        case SB_PAGERIGHT:
            si.nPos += si.nPage;
            break;
        case SB_THUMBTRACK:
            si.nPos = si.nTrackPos;
            break;
        }
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS | SIF_DISABLENOSCROLL;
        SetScrollInfo(hwnd, SB_HORZ, &si, TRUE);
        GetScrollInfo(hwnd, SB_HORZ, &si);
        if (iHorzPos != si.nPos)
        {
            ::ScrollWindow(hwnd, s_cxChar * (iHorzPos - si.nPos), 0, NULL, NULL);
            ::UpdateWindow(hwnd);

        }
        return 0;
    }
    else if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_VERT, &si);
        iVertPos = si.nPos;

        si.cbSize = sizeof(SCROLLINFO);
        si.fMask = SIF_POS;
        GetScrollInfo(hwnd, SB_HORZ, &si);
        iHorzPos = si.nPos;


        //只对无效区域做重绘
        int nPaintBeg = max(0, iVertPos + ps.rcPaint.top / s_iHeight);
        int nPaintEnd = min(NUMLINES - 1, iVertPos + ps.rcPaint.bottom / s_iHeight);
        for (int i = nPaintBeg; i <= nPaintEnd; i++)
        {
            x = s_cxChar * (-iHorzPos);
            y = s_iHeight * (i - iVertPos);
            TextOut(hdc, x, y, METRICS[i].m_pLabel, _tcslen(METRICS[i].m_pLabel));
            TextOut(hdc, x + s_iCol1, y, METRICS[i].m_pDesc, _tcslen(METRICS[i].m_pDesc));
            TextOut(hdc, x + s_iCol1 + s_iCol2, y, szBuf, wsprintf(szBuf, TEXT("%d"), GetSystemMetrics(METRICS[i].m_nIndex)));
        }
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

:::



有时候可能想改变某些DC属性，然后使用改变后的属性进行绘制，接着再恢复原来的DC属性，可以使用`SaveDC`和`RestoreDC`函数来保存和恢复DC状态。



:::details `SaveDC 函数说明`

`SaveDC`函数通过把DC属性压入DC堆栈来保存指定DC的当前状态

```c
/// <summary>
/// 保存设备DC
/// </summary>
/// <param name="hdc">要保存其状态的设备环境句柄</param>
/// <returns></returns>
int SaveDC(HDC hdc); 
```

如果函数执行成功，则返回值将标识保存的状态; 如果函数执行失败，则返回值为0。

:::



:::details `RestoreDC 函数说明`

```c
/// <summary>
/// 从DC堆栈中弹出状态信息来恢复DC到指定状态
/// </summary>
/// <param name="hdc">要恢复其状态的设备环境句柄</param>
/// <param name="nSavedDC">要还原的保存状态</param>
/// <returns></returns>
BOOL RestoreDC(HDC hdc,int nSavedDC);
```

- 参数nSavedDC指定要还原的保存状态，可以指定为SaveDC函数的返回值，或者指定为负数，例如-1表示最近保存的状态，-2表示最近保存的状态的前一次。
- 同一状态不能多次恢复，恢复状态后保存的所有状态将被弹出销毁。请看违规操作代码:

```c
//设置设备环境属性，然后保存
nDC1 = SaveDC(hdc);

//再次设置设备环境属性，然后保存
nDC2 = SaveDC(hdc):
...........
RestoreDC(hdc, nDC1);

//使用状态1进行绘图
RestoreDC(hdc,nDC2); // 恢复失败

//使用状态2进行绘图
```

调用RestoreDC函数把DC状态恢复到nDC1，DC堆栈会弹出nDC1及以后压入堆栈的内容。

:::



## 绘制直线和曲线

并且实际上，许多应用程序经常需要绘制直线和曲线，例如CAD和绘图程序会使用直线和曲线来绘制对象的轮廓、指定对象的中心，电子表格程序会使用直线和曲线绘制单元格、图表等。



### 绘制像素点

:::details `SetPixel 函数说明`

```c
/// <summary>
/// 将指定坐标处的像素设置为指定的颜色
/// </summary>
/// <param name="hdc">设备上下文的句柄/param>
/// <param name="X">要设置的点的x坐标（以逻辑单位为单位）</param>
/// <param name="Y">要设置的点的 y 坐标（以逻辑单位为单位）</param>
/// <param name="crColor">用于绘制点的颜色。若要创建COLORREF颜色值，请使用 RGB 宏</param>
/// <returns></returns>
COLORREF SetPixel(HDC hdc,int X,int Y,COLORREF crColor);
```

:::



:::details `GetPixel 函数说明`

```c
/// <summary>
/// GetPixel 函数检索指定坐标处像素的红色、绿色、蓝色 (RGB) 颜色值。
/// </summary>
/// <param name="hdc">设备上下文的句柄</param>
/// <param name="x">要检查的像素的 x 坐标（以逻辑单位为单位）</param>
/// <param name="Y">要检查的像素的 y 坐标（以逻辑单位为单位）</param>
/// <returns></returns>
COLORREF GetPixel(HDC hdc, int x, int Y);
```

GetPixel函数返回一个COLORREF颜色值，可以分别使用`GetRValue GetGValue和GetBValue`宏提取COLORREF颜色值中的的红色，绿色和蓝色值.

:::





:::details  `SetPixel函数可以绘制任意复杂的图形，例如画一条线`

```c{42-45}
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;                            
    TCHAR szClassName[] = TEXT("MyWindow");        
    TCHAR szAppName[] = TEXT("直线");   
    HWND hwnd;                                      
    MSG msg;                    
    wndclass.cbSize = sizeof(WNDCLASSEX);
    wndclass.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC;
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW | WS_VSCROLL | WS_HSCROLL,
        CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
     if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        for (size_t i = 0; i < 100; i++)
        {
            SetPixel(hdc,i,10,RGB(255,0,0));
        }
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240203225823200.png)



虽然绘制像素是最基本的绘图操作方法，但是在程序中一般很少使用`SetPixel`函数，因为它的开销很大，只适合用在需要绘制少量像素的地方。如果需要绘制一个线条或者一片区域，那么推荐使用后面介绍的画线函数或填充图形函数，因为这些函数是在驱动程序级别上完成的，用到了硬件加速功能。



我们也经常需要获取某个坐标处像素的颜色值，但是不应该通过`GetPixel`函数来获取一大块像素数据。如果需要分析一片区域的像素数据，可以把全部像素数据复制到内存中再进行处理。

:::

### 绘制直线

常用的绘制直线的函数有`LineTo`  `Polyline`  `PolylineTo`和`PolyPolyline`。绘制直线的函数比较简单：

- `LineTo`函数从当前位置到指定的点之间绘制一条直线 (线段) 
- `Polyline` `PolylineTo`函数通过连接指定数组中的点来绘制一系列线段
- `PolyPolyline`函数相当于多次调用多个`Polyline`



:::details `LineTo 函数说明`

```c
/// <summary>
/// 以当前位置为起点，以指定的点为终点，画一条线段
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="nXEnd">终点的X坐标，逻辑单位</param>
/// <param name="nYEnd">终点的Y坐标，逻辑单位</param>
/// <returns></returns>
BOOL LineTo(HDC hdc,int nXEnd,int nYEnd);
```

函数执行成功，指定的终点 `(nXEnd,nYEnd)`会被设置为新的当前位置。



当前位置作为某些GDI函数绘制的起点，DC中的默认当前位置是客户区坐标(0,0)处。以`LineTo`函数为例，如果没有设置当前位置，那么调用`LineTo`函数就会从客户区的左上角开始到指定的终点之间画一条线。

:::





:::details `MoveToEx 函数说明`

```c
/// <summary>
/// 将当前位置更新为指定的点，并可以返回上一个当前位置
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="X">新当前位置的X坐标，逻辑单位</param>
/// <param name="Y">新当前位置的Y坐标，逻辑单位</param>
/// <param name="IpPoint">out 在这个POINT结构中返回上一个当前位置，可以设置为NULL</param>
/// <returns></returns>
BOOL MoveToEx(HDC hdc,int X,int Y,LPPOINT IpPoint); 
```

在调用需要使用当前位置的GDI函数进行绘制以前，通常需要先调用MoveToEx设置DC的当前位置。

:::





:::details `Polyline 函数说明`

Polyline函数通过连接指定数组中的点来绘制一系列线段

```c
/// <summary>
/// 通过连接指定数组中的点来绘制一系列线段
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="Ippt">点结构数组，逻辑单位</param>
/// <param name="cPoints"> lppt数组中点的个数，必须大于或等于2</param>
/// <returns></returns>
BOOL Polyline(HDC hdc,const POINT* Ippt,int cPoints); 
```

需要注意的是 `Polyline ` 既不使用页不更新当前位置。

:::



:::details `PolylineTo 函数声明`

```c

/// <summary>
/// PolylineTo 函数绘制一条或多条直线
/// </summary>
/// <param name="hdc">设备上下文的句柄</param>
/// <param name="apt">指向 POINT 结构的数组的指针，该数组包含线条的顶点（以逻辑单元为单位）。</param>
/// <param name="cpt">数组中的点数</param>
/// <returns>如果该函数成功，则返回值为非零值。如果函数失败，则返回值为零。</returns>
BOOL PolylineTo(HDC  hdc,const POINT* apt, DWORD cpt)
```

唯一不同的是，`PolylineTo`函数会使用并更新当前位置。函数从当前位置到lppt参数指定数组中的第一个点绘制第一条线，然后从上一条线段的终点到Ippt数组指定的下一点画第二条线，直到最后一个点。绘制结束时PolylineTo函数会将当前位置设置为最后一条线的终点。

:::





:::details `PolyPolyline 函数说明`

```c
/// <summary>
/// 绘制多个连接的线段系列
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="apt">点结构数组，逻辑单位。可以理解为是多个组，一个组可以画一系列线段</param>
/// <param name="asz">DWORD类型数组，每个数组元秦指定apt数组中每一个组有几个点</param>
/// <param name="csz">组的个数，也就是asz数组的数组元素个数，也就是画多个一系列线段</param>
/// <returns></returns>
BOOL PolyPolyline(HDC hdc,const POINT* apt,const DWORD* asz,DWORD csz); 
```

- 参数asz是一个DWORD类型的数组，分别指定apt数组中每一个组有几个点，每一个组的点个数必须大于或等于2。该函数既不使用也不更新当前位置。

:::



:::tip

可以看出只有带`To`的函数才使用和**更新当前位置**。

DC包含影响直线和曲线输出的一些属性，直线和曲线用到的属性包括当前位置、画笔样式、宽度和颜色、画刷样式和颜色等。

:::



接下来看一下创建画笔的几个函数。



:::details `CreatePen/CreatePenIndirect 函数声明`

```c
/// <summary>
/// 创建画笔
/// </summary>
/// <param name="fnPenStyle">画笔样式</param>
/// <param name="nWidth">画笔宽度，逻辑单位</param>
/// <param name="crColor">画笔颜色，使用RGB宏</param>
/// <returns></returns>
HPEN CreatePen(int fnPenStyle,int nWidth,COLORREF crColor); 
```

- 参数`fnPenStyle`指定画笔样式，值如下表所示。

|                   宏常量                   |                             含义                             |
| :----------------------------------------: | :----------------------------------------------------------: |
|                 `PS_SOLID`                 |                           实心画笔                           |
|                 `PS_DASH`                  |                             划线                             |
|                  `PS_DOT`                  |                             点线                             |
|                `PS_DASHDOT`                |                       交替的划线和点线                       |
|              `PS_DASHDOTDOT`               |                      交替的划线和双点线                      |
| `PS_INSIDEFRAMEPS_SOLID`和`PS_INSIDEFRAME` | PS_INSIDEFRAMEPS_SOLID和PS_INSIDEFRAME样式的画笔使用的都是实心线条，它们之间的区别是当画笔的宽度大于1像素，且使用区域绘画函数（例如绘制矩形)的时候，PS_SOLID样式的线条会居中画于边框线上﹔而PS_INSIDEFRAME样式的线条会全部画在边框线里面，画笔的宽度会向区域的内部扩展，所以它的名称是INSIDEFRAME |
|                 `PS_NULL`                  |                        空，什么也不画                        |

这几种样式的画笔效果如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204091227426-17070091507491.png)



对于`PS_DASH PS_DOT, PS_DASHDOT和PS_DASHDOTDOT样式`，如果指定的宽度`nWidth`大于1，那么会被替换为具有`nWidth`宽度的`PS_SOLID`样式的画笔，即这些样式的画笔只能是1像素宽。





对于上述4种样式的画笔，划线和点线中间的空白默认是不透明、白色，可以通过调用`SetBkMode`和`SetBkColor`函数改变背景模式和背景颜色。



```c

/// <summary>
/// 创建具有结构中指定的样式、宽度和颜色的画笔
/// </summary>
/// <param name="lplgpn">指向 LOGPEN 结构的指针，该结构指定笔的样式、宽度和颜色。</param>
/// <returns></returns>
HPEN CreatePenIndirect(const LOGPEN* lplgpn);
```

`CreatePenIndirect`函数的`Iplgpn`参数是一个指向`LOGPEN`结构的指针，用于定义画笔的样式、宽度和颜色。这3个字段的含义和`CreatePen`函数的3个参数一一对应。

```c
typedef struct tagLOGPEN
{
	UINT	lopnStyle;
	POINT	lopnWidth;
	COLORREF lopnColor;
}LOGPEN，*PLOGPEN，NEAR*NPLOGPEN,FAR*LPLOGPEN;
```

如果函数执行成功，则返回值是逻辑画笔的句柄，HPEN是画笔句柄类型;如果函数执行失败，则返回值为NULL。

:::



再看一下创建画刷的几个函数。

:::details `CreateSolidBrush`

```c
/// <summary>
/// 创建具有指定颜色的纯色逻辑画刷
/// </summary>
/// <param name="color">COLORREF颜色值，使用RGB宏</param>
/// <returns></returns>
HBRUSH CreateSolidBrush(COLORREF color);


/// <summary>
/// 检索指定显示元素的当前颜色。
/// </summary>
/// <param name="nIndex">nlndex指定为标准系统颜色，返回对应的COLORREF颜色值</param>
/// <returns></returns>
COLORREF GetSysColor(int nIndex);  

/// <summary>
/// 检索标识与指定颜色索引对应的逻辑画笔的句柄。
/// </summary>
/// <param name="nIndex">nIndex指定为标准系统颜色，返回这个颜色的画刷句柄</param>
/// <returns></returns>
HBRUSH GetSysColorBrush(int nIndex);
```

函数执行成功，返回一个逻辑画刷句柄，HBRUSH是画刷句柄类型。

如果需要使用系统颜色画刷进行绘制，直接使用`GetSysColorBrush`即可，不需要使用`CreateSolidBrush (GetSysColor(nIndex))`创建画刷。因为`GetSysColorBrush`直接返回系统缓存的画刷，而不是创建新的画刷，不用的时候不需要调用`DeleteObject`函数将其删除。



:::





:::details `CreateHatchBrush 函数说明`	

```c
/// <summary>
/// 创建具有阴影样式的逻辑画刷
/// </summary>
/// <param name="fnStyle">阴影样式</param>
/// <param name="clrref">COLORREF颜色值</param>
/// <returns></returns>
HBRUSH CreateHatchBrush(int fnStyle,COLORREF clrref); 
```

- fnStyle指定阴影样式，可用的值如下表所示。

|      宏常量      |            含义            |
| :--------------: | :------------------------: |
|  `HS_BDIAGONAL`  | 从左到右看是向上45度的斜线 |
|    `HS_CROSS`    |      水平和垂直交叉线      |
| `HS_DIAGCROSS45` |         45度交叉线         |
|  `HS_FDIAGONAL`  | 从左到右看是向下45度的斜线 |
| `HS_HORIZONTAL`  |           水平线           |
|  `HS_VERTICAL`   |           垂直线           |

这几种样式的阴影画刷效果如下图所示。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204092257524.png)



阴影中间的空白默认为不透明、白色，可以调用`SetBkMode`和`SetBkColor`函数改变背景模式和背景颜色。



:::



:::details `CreatePatternBrush 函数说明`

```c
// <summary>
/// 创建一个具有位图图案的逻辑画刷
/// </summary>
/// <param name="hbm">位图句柄</param>
/// <returns></returns>
HBRUSH CreatePatternBrush(HBITMAP hbm);
```

:::



:::details `CreateBrushIndirect 函数说明`

CreateBrushIndirect函数创建具有指定样式、颜色和图案的逻辑画刷.

```
HBRUSH CreateBrushIndirect(_In_ const LOGBRUSH *lplb);
```

CreateBrushIndirect函数具有前面所有函数的功能，而且也比较简单。参数lplb是一个指向LOGBRUSH结构的指针。

```c
typedef struct tagLOGBRUSH
{
	UINT	lbStyle;//样式
    COLORREF lbColor;//颜色
    ULoNG_PTR lbHatch;//图案
}LOGBRUSH,*PLOGBRUSH,NEAR *NPLOGBRUSH,FAR*LPLOGBRUSH;
```

- `lbStyle`字段指定画刷样式，值如下表所示。

|               宏常量                |                             含义                             |
| :---------------------------------: | :----------------------------------------------------------: |
| `BS_DIBPATTERN ` `BS_DIBPATTERN8*8` | 由设备无关位图（`DIB`）定义图案画刷，lbHatch字段指定为DIB的句柄 |
|             `BS_SOLID`              |                           实心画刷                           |
|            `BS_HATCHED`             |                           阴影画刷                           |
|     `BS_PATTERN BS_PATTERN8*8`      |   由内存位图定义的图案画刷,lbHatch字段指定为内存位图的句柄   |
|         `BS_HOLLOW BS_NULL`         |                            空画刷                            |

- `lbColor`字段指定画刷的颜色，通常用于BS_SOLID或BS_HATCHED样式的画刷。
- `lbHatch`字段的含义取决于lbStyle定义的画刷样式。如果lbStyle字段指定为BS_HATCHED，则lbHatch字段指定阴影填充的线的方向，可用的值与CreateHatchBrush函数的fnStyle字段相同﹔如果lbStyle字段指定为BS_SOLID或BS_HOLLOWBS_NULL，则忽略lbHatch字段。



当不再需要创建的逻辑画笔、画刷时，需要调用`DeleteObject`函数将其删除。

:::



先练习一下这几个画线函数的用法。Line程序使用前面介绍的` LineTo  Polyline  PolylineTo PolyPolyline`函数画线。程序运行效果如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204094350457.png)

其中，Line程序使用`PolyPolyline`函数画了一个立方体，分为2组，第1组画了1～3，第2组画了①～⑥。



:::details `绘制直线函数示例`

```c
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 240, 300, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    POINT arrPtPolyPolyline[] = {                           // PolyPolyline函数的点
        110,60, 10,60, 60,10, 160,10,
        10,60, 10,160, 110,160, 110,60, 160,10, 160,110, 110,160,
    };
    DWORD arrGroup[] = { 4, 7 };
    POINT arrPtPolyline[] = { 10,220, 110,200, 210,220 };   // Polyline函数的点
    POINT arrPtPolylineTo[] = { 110,260, 210,240 };         // PolylineTo函数的点
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);

        SelectObject(hdc, CreatePen(PS_SOLID, 3, RGB(255, 0, 0)));
        PolyPolyline(hdc, arrPtPolyPolyline, arrGroup, _countof(arrGroup));
        
        DeleteObject(SelectObject(hdc, CreatePen(PS_DASH, 1, RGB(0, 255, 0))));
        MoveToEx(hdc, 10, 180, NULL);
        LineTo(hdc, 210, 180);

        DeleteObject(SelectObject(hdc, CreatePen(PS_DOT, 1, RGB(0, 0, 255))));
        Polyline(hdc, arrPtPolyline, _countof(arrPtPolyline));

        DeleteObject(SelectObject(hdc, CreatePen(PS_DASHDOT, 1, RGB(0, 0, 0))));
        MoveToEx(hdc, 10, 240, NULL);
        PolylineTo(hdc, arrPtPolylineTo, _countof(arrPtPolylineTo));
        DeleteObject(SelectObject(hdc, GetStockObject(BLACK_PEN)));

        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611000032750.png)



:::

### 绘制曲线

常用的绘制曲线的函数有`Arc ArcTo PolyBezier  PolyBezierTo`，可以绘制直线和曲线组合的函数有`AngleArc PolyDraw`。





:::details `Arc 函数说明`

```c
/// <summary>
/// 绘制椭圆弧线
/// </summary>
/// <param name="hdc">设备环境句柄，以下单位均是逻辑单位</param>
/// <param name="nLeftRect">边界矩形左上角的X坐标</param>
/// <param name="nTopRect">边界矩形左上角的Y坐标</param>
/// <param name="nRightRect">边界矩形右下角的X坐标</param>
/// <param name="nBottomRect">边界矩形右下角的Y坐标</param>
/// <param name="nXStartArc">弧起点的X坐标</param>
/// <param name="nYStartArc">/弧起点的Y坐标</param>
/// <param name="nXEndArc">弧终点的X坐标</param>
/// <param name="nYEndArc">弧终点的Y坐标</param>
/// <returns></returns>
BOOL Arc(HDC hdc, int nLeftRect,int nTopRect,int nRightRect,int nBottomRect,int nXStartArc,int nYStartArc,int nXEndArc,int nYEndArc);
```

- 点(nLeftRect,nTopRect)和(nRightRect,nBottomRect)指定边界矩形，边界矩形内的椭圆定义了椭圆弧线的范围。
- 将矩形中心到起点(nXStartArc,nYStartArc)与椭圆的相交点作为弧线的起点，矩形中心到终点(nXEndArc,nYEndArc)与椭圆的相交点作为弧线的终点，从弧线的起点到终点浴当前绘图方向绘制。
- 如果起点和终点相同，则会绘制一个完整的椭圆形(内部不会填充)。具体请结合下图理解，其中的实心弧线就是Arc函数所画的弧线。
- DC有一个当前绘图方向属性对Arc函数有影响。默认绘图方向是逆时针方向，可以通过调用GetArcDirection和SetArcDirection函数获取和设置DC的当前绘图方向。如果更改绘图方向为顺时针，那么下图中的椭圆弧线就会变为椭圆的虚线部分。
- Arc函数既不使用也不更新当前位置。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204095030425.png)

:::



:::details `ArcTo 函数说明`

```c
/// <summary>
/// 绘制椭圆弧线
/// </summary>
/// <param name="hdc">设备环境句柄，以下单位均是逻辑单位</param>
/// <param name="nLeftRect">边界矩形左上角的X坐标</param>
/// <param name="nTopRect">边界矩形左上角的Y坐标</param>
/// <param name="nRightRect">边界矩形右下角的X坐标</param>
/// <param name="nBottomRect">边界矩形右下角的Y坐标</param>
/// <param name="nXStartArc">弧起点的X坐标</param>
/// <param name="nYStartArc">/弧起点的Y坐标</param>
/// <param name="nXEndArc">弧终点的X坐标</param>
/// <param name="nYEndArc">弧终点的Y坐标</param>
/// <returns></returns>
BOOL ArcTo(HDC hdc, int nLeftRect,int nTopRect,int nRightRect,int nBottomRect,int nXStartArc,int nYStartArc,int nXEndArc,int nYEndArc);
```

ArcTo函数的参数和Arc完全相同，只不过ArcTo函数会从当前位置到弧线起点额外画一条线，而且会更新DC的当前位置为弧线终点。注意，这里的弧线起点不一定是函数中定义的起点，除非起点(nXStartArc,nYStartArc）正好定义为弧线起点，这里的弧线终点不一定是函数中定义的终点，除非终点(nXEndArc,nYEndArc)正好定义为弧线终点。



下图中的实心直线和弧线就是ArcTo函数绘制的结果

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204095355858-17070116405225.png)



:::





**贝塞尔曲线**(Bezier curve）又称贝兹曲线或贝济埃曲线，是应用于二维图形应用程序的数学不规则曲线，由法国数学家皮埃尔·贝塞尔(Pierre Bezier)发明，为计算机矢量图形学寞定了基础。我们在绘图工具上看到的钢笔工具就是用来绘制这种矢量曲线的。



:::details `PolyBezier 函数说明`

```c
/// <summary>
/// 绘制一条或多条贝塞尔曲线
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="apt">端点和控制点的点结构数组，逻辑单位</param>
/// <param name="cpt">apt数组中点的个数</param>
/// <returns></returns>
BOOL PolyBezier(HDC	hdc,const POINT* apt,DWORD cpt);
```

参数cpt指定apt数组中点的个数，该值必须是要绘制曲线个数的3倍以上，因为每个贝塞尔曲线需要2个控制点和1个端点。另外，贝塞尔曲线的开始还需要1个额外的起点。如果不明白，继续往下看。



PolyBezier函数使用apt参数指定的端点和控制点进行绘制。以第2点和第3点为控制点，从第1点到第4点绘制第一条曲线，就是说第一条曲线需要使用4个点; apt数组中的每个后续曲线需要提供3个点，以上一条曲线的终点为起点，后续2个点为控制点，后续第3个点为终点。



PolyBezier函数使用当前画笔绘制线条，该函数既不使用也不更新当前位置。

:::



:::details `PolyBezier 示例:`

```c
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 240, 300, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        SelectObject(hdc, CreatePen(PS_SOLID, 2, RGB(0, 0, 0)));

        POINT arrPoint[] = { 10,100,100,10,150,150,200,50 };
        //曲线起点、控点1，控点2,曲线终点

        //绘制贝赛尔曲线
        PolyBezier(hdc, arrPoint, _countof(arrPoint));
        DeleteObject(SelectObject(hdc, CreatePen(PS_DOT, 1, RGB(0, 0, 0))));

        //曲线起点到控制点1画一条点线
        MoveToEx(hdc, arrPoint[0].x, arrPoint[0].y, NULL);
        LineTo(hdc, arrPoint[1].x, arrPoint[1].y);

        //曲线起点到控制点2画一条点线
        MoveToEx(hdc, arrPoint[2].x, arrPoint[2].y, NULL);
        LineTo(hdc, arrPoint[3].x, arrPoint[3].y);
        DeleteObject(SelectObject(hdc, GetStockObject(BLACK_PEN)));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

程序执行效果如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204101205574-17070127267841.png)

`PolyBezier`函数只是画了一条曲线(图中的实心黑线)。绘制控制线是程序的责任，一般的绘图程序通常是鼠标按住控制·点1或2拖动可以调整曲线的形状。这个实现起来很简单，只需要处理鼠标按下、松开和鼠标移动消息，然后重新计算控制点坐标，再次调用`PolyBezier`函数即可(曲线的起点和终点坐标通常不会再改变)。

:::



:::details `PolyBezierTo 函数说明`

```c
/// <summary>
/// 绘制一条或多条贝塞尔曲线
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="apt">端点和控制点的点结构数组，逻辑单位</param>
/// <param name="cpt">apt数组中点的个数</param>
/// <returns></returns>
BOOL PolyBezierTo(HDC	hdc,const POINT* apt,DWORD cpt);
```

PolyBezierTo函数的参数和PolyBezier完全相同。PolyBezierTo函数从当前位置到apt数组提供的第3个点绘制一条贝塞尔曲线，使用第1·2个点作为控制点﹔对于每个后续曲线，函数也是需要3个点，使用前一条曲线的终点作为下一条曲线的起点。PolyBezierTo函数将当前位置设置为最后一条贝塞尔曲线的终点。

:::



:::details `AngleArc 函数说明`

```c
/// <summary>
/// 绘制一条直线和一条弧线（一个正圆形边框的一部分)
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="x">圆心的X坐标，逻辑单位</param>
/// <param name="y">圆心的Y坐标，逻辑单位</param>
/// <param name="r">圆的半径，逻辑单位</param>
/// <param name="StartAngle">相对于X轴的起始角度，单位是度</param>
/// <param name="SweepAngle">扫描角度，即相对于起始角度StartAngle的角度，单位是度</param>
/// <returns></returns>
BOOL AngleArc(HDC hdc,int x,int y, DWORD r, FLOAT StartAngle, FLOAT SweepAngle);
```

AngleArc函数会将当前位置设置为弧线的终点。

:::



:::details `AngleArc 示例`

```c
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 240, 300, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
   
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc,TRANSPARENT);
        
        MoveToEx(hdc,250,50,NULL); //设置当前位置
        AngleArc(hdc,150,150,100,0,270); //调用AngleAr函数进行绘制

        //绘制参考点线
        SelectObject(hdc,CreatePen(PS_DOT,1,RGB(0,0,0)));
        MoveToEx(hdc,150,150,NULL);
        LineTo(hdc, 270, 150);
        
        MoveToEx(hdc,150,150,NULL);
        LineTo(hdc,150,270);

        DeleteObject(SelectObject(hdc,GetStockObject(BLACK_PEN)));

        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

程序执行效果如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204102536328.png)

:::



:::details `PolyDraw 函数说明`

```c
/// <summary>
/// 一组直线和贝塞尔曲线
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="apt">点结构数组，包含每条直线的端点以及每条贝塞尔曲线的端点和控制点</param>
/// <param name="aj">一个数组，每个数组元素指定如何使用apt数组中对应的每个点</param>
/// <param name="cpt">apt数组中点的个数</param>
/// <returns></returns>
BOOL PolyDraw(HDC hdc,const POINT* apt, const BYTE* aj,int cpt);
```

参数aj中的每个数组元素指定如何使用apt数组中对应的每个点，该参数如下表所示。

|    宏常量     |                             含义                             |
| :-----------: | :----------------------------------------------------------: |
|  `PT_MOVETO`  |            从该点开始绘制，该点将成为新的当前位置            |
|  `PT_LINETO`  |   从当前位置到该点绘制一条直线，然后该点将成为新的当前位置   |
| `PT_BEZIERTO` | 该点是贝塞尔曲线的控制点或端点。PT_BEZIERTO类型总是以3个一组出现，当前位置作为贝塞尔曲线的起点，前2个点是控制点，第3个点是终点，终点会变为新的当前位置 |

PT_LINETO或PT_BEZIERTO还可以和PT_CLOSEFIGURE标志一起使用，即PT_LINETO | PT_CLOSEFIGURE或PT_BEZIERTO | PT_CLOSEFIGURE，表示绘制完直线或贝塞尔曲线以后，直线或贝塞尔曲线的终点和最近使用PT_MOVETO的点之间会画一条线，形成一个封闭区域，但其内部不会被填充。

:::



:::details `PolyDraw 示例`

```c
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 240, 300, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
   
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc,TRANSPARENT);
        POINT arrPoint[] = { 10,100,100,10,150,150,200,50,10,100,100,10,150,150,200,50 }; //这四个点用于绘制控制线
        BYTE arrFlag[] = {PT_MOVETO,PT_BEZIERTO,PT_BEZIERTO,PT_BEZIERTO ,PT_MOVETO ,PT_LINETO,PT_MOVETO,PT_LINETO }; 
        PolyDraw(hdc,arrPoint,arrFlag,_countof(arrPoint));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

效果是一样的，只不过是贝塞尔曲线和控制线都是实心黑线，不能分别控制其样式。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204103330566-17070140117483.png)

:::

## 填充图形

填充图形，也叫填充形状。有许多应用程序会用到填充图形，例如电子表格程序使用填充图形来绘制图表。填充图形使用当前画笔绘制边框线，使用当前画刷绘制内部的填充色。常见的填充图形如下所示。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611001925078.png)



默认的DC使用1像素的黑色实心画笔和白色画刷，所以这些填充图形的边框线是1像素的实心黑线，内部填充为白色。为了能看出填充图形的内部填充颜色，本节程序指定WNDCLASSEX结构的hbrBackground字段为`COLOR_BTNFACE＋1`(浅灰色窗口背景)。





:::details `Rectangle 函数说明`

```c

/// <summary>
/// 绘制一个直角矩形
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="nLeftRect">矩形左上角的X坐标，逻辑单位</param>
/// <param name="nTopRect">矩形左上角的Y坐标，逻辑单位</param>
/// <param name="nRightRect">矩形右下角的X坐标，逻辑单位</param>
/// <param name="nBottomRect">矩形右下角的Y坐标，逻辑单位</param>
/// <returns></returns>
BOOL Rectangle(HDC hdc, int nLeftRect,int nTopRect,int nRightRect, int nBottomRect); 
```

:::

:::details `Rectangle 示例`

```c{52}
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 400, 500, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        SelectObject(hdc, CreatePen(PS_SOLID, 2, RGB(0, 0, 0)));


        //绘制矩形
        RECT rect ={0};
        rect.left = 100; 
        rect.top = 150;
        rect.right = rect.left + 200; 
        rect.bottom = rect.top + 150; 
        Rectangle(hdc, rect.left, rect.top, rect.right, rect.bottom);

        DeleteObject(SelectObject(hdc, GetStockObject(BLACK_PEN)));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611221332644.png)

:::





:::details `RoundRect 函数说明`

```c
/// <summary>
/// 绘制一个圆角矩形
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="nLeftRect">矩形左上角的X坐标，逻辑单位</param>
/// <param name="nTopRect">矩形左上角的Y坐标，逻辑单位</param>
/// <param name="nRightRect">矩形右下角的X坐标，逻辑单位</param>
/// <param name="nBottomRect">矩形右下角的Y坐标，逻辑单位</param>
/// <param name="nWidth">用于绘制圆角的椭圆的宽度，逻辑单位</param>
/// <param name="nHeight">用于绘制圆角的椭圆的高度，逻辑单位</param>
/// <returns></returns>
BOOL RoundRect(HDC hdc,int nLeftRect,int nTopRect,int nRightRect,int nBottomRect,int nWidth, int nHeight );
```

可以把圆角矩形的圆角想象成是一个较小的椭圆，如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204103723364.png)

这个小椭圆的宽度是nWidth，高度是nHeight，可以想象成Windows将这个小椭圆分成了4个象限，4个圆角分别是该小椭圆的一个象限。当nWidth和nHeight的值较大时，对应的圆角显得比较明显.



- 如果nWidth的值等于nLeftRect与nRightRect的差，并且nHeight的值等于nTopRect与nBottomRect的差，那么RoundRect函数画出来的就是一个椭圆，而不是一个圆角矩形。
- 上图中在圆角矩形的长边上的那部分圆角和短边上的那部分圆角是相同大小的，因为使用了相同的nWidth和nHeight值，也可以把这两个参数指定为不同的值，实现不同的效果。

:::



:::details `RoundRect() 代码示例`

```c{50}
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 400, 500, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        SelectObject(hdc, CreatePen(PS_SOLID, 2, RGB(0, 0, 0)));
        //绘制圆角矩形
        RECT rect ={0};
        rect.left = 100; 
        rect.top = 150;
        rect.right = rect.left + 200; 
        rect.bottom = rect.top + 150; 
        RoundRect(hdc, rect.left, rect.top, rect.right, rect.bottom,150,150);

        DeleteObject(SelectObject(hdc, GetStockObject(BLACK_PEN)));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611221539246.png)

:::



:::details `Ellipse 函数说明`

```c

/// <summary>
/// 在指定的边界矩形内绘制椭圆
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="nLeftRect">矩形左上角的X坐标，逻辑单位</param>
/// <param name="nTopRect">矩形左上角的Y坐标，逻辑单位</param>
/// <param name="nRightRect">矩形右下角的X坐标，逻辑单位</param>
/// <param name="nBottomRect">矩形右下角的Y坐标，逻辑单位</param>
/// <returns></returns>
BOOL Ellipse(HDC hdc,int nLeftRect,int nTopRect,int nRightRect,int nBottomRect);
```

Ellipse函数在指定的边界矩形内绘制椭圆，函数参数和Rectangle完全相同，该函数既不使用也不更新当前位置

:::



:::details `Ellipse 示例`

```c{50}
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 400, 500, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        SelectObject(hdc, CreatePen(PS_SOLID, 2, RGB(0, 0, 0)));
        //绘制椭圆
        RECT rect ={0};
        rect.left = 100; 
        rect.top = 150;
        rect.right = rect.left + 200; 
        rect.bottom = rect.top + 150; 
        Ellipse(hdc, rect.left, rect.top, rect.right, rect.bottom);

        DeleteObject(SelectObject(hdc, GetStockObject(BLACK_PEN)));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611222317930.png)

:::





:::details `Chord 函数说明`

绘制一个弦形，有一个椭圆和一条直线的交点界定的区域，该函数既不使用也不更新当前位置。

```c
/// <summary>
/// 绘制一个弦形，有一个椭圆和一条直线的交点界定的区域。(绘制扇形)
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="nLeftRect">边界矩形左上角的X坐标，逻辑单位</param>
/// <param name="nTopRect">边界矩形左上角的Y坐标，逻辑单位</param>
/// <param name="nRightRect">边界矩形右下角的X坐标，逻辑单位</param>
/// <param name="nBottomRect">边界矩形右下角的Y坐标，逻辑单位</param>
/// <param name="nXRadiall">弦起点的径向端点的X坐标，逻辑单位</param>
/// <param name="nYRadial1">弦起点的径向端点的Y坐标，逻辑单位</param>
/// <param name="nXRadial2">弦终点的径向端点的X坐标，逻辑单位</param>
/// <param name="nYRadial2">弦终点的径向端点的Y坐标，逻辑单位</param>
/// <returns></returns>
BOOL Chord(HDC hdc,int nLeftRect,int nTopRect,int nRightRect,int nBottomRect,int nXRadiall,int nYRadial1,int nXRadial2,int nYRadial2);
```

弦形曲线部分的绘制和Arc函数类似，只不过Chord函数会闭合曲线的两个端点。点(nLeftRect,nTopRect)和(nRightRect,nBottomRect)指定边界矩形，边界矩形内的椭圆定义了弦形的曲线。



矩形中心到起点(nXRadial1, nYRadial1)与椭圆的相交点作为弦形曲线的起点，矩形中心到终点(nXRadial2,nYRadial2)与椭圆的相交点作为弦形曲线的终点，从弦形曲线的起点到终点浴当前绘图方向绘制，然后在弦形曲线的起点和终点之间绘制一条直线来闭合弦形。如果起点和终点相同，则会绘制一个完整的椭圆形。具体请结合下图理解。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204104519602-17070147207016.png)

DC有一个当前绘图方向属性对Chord函数有影响，默认绘图方向是逆时针方向，可以调用`GetChordDirection`和`SetChordDirection`函数获取和设置DC的当前绘图方向。

:::



:::details `Chord 示例`

```c{52}
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 400, 500, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        SelectObject(hdc, CreatePen(PS_SOLID, 2, RGB(0, 0, 0)));
        int x1 = 10,
        y1 = 10,
        x2 = 200,
        y2 = 200,
        x3 = 130,
        y3 = 200,
        x4 = 160,
        y4 = 10;
        Chord(hdc, x1, y1, x2, y2, x3, y3, x4, y4);
        DeleteObject(SelectObject(hdc, GetStockObject(BLACK_PEN)));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611223045524.png)

:::





:::details `Pie 函数说明`

Pie函数绘制一个饼形，该函数的参数和Chord完全相同，只不过闭合方式不同，该函数既不使用也不更新当前位置∶

```c
/// <summary>
/// 绘制一个饼形
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="nLeftRect">边界矩形左上角的X坐标，逻辑单位</param>
/// <param name="nTopRect">边界矩形左上角的Y坐标，逻辑单位</param>
/// <param name="nRightRect">边界矩形右下角的X坐标，逻辑单位</param>
/// <param name="nBottomRect">边界矩形右下角的Y坐标，逻辑单位</param>
/// <param name="nXRadiall">饼形起点的径向端点的X坐标，逻辑单位</param>
/// <param name="nYRadial">饼形起点的径向端点的Y坐标，逻辑单位</param>
/// <param name="nXRadial2">饼形终点的径向端点的X坐标，逻辑单位</param>
/// <param name="nYRadial2">饼形终点的径向端点的Y坐标，逻辑单位</param>
/// <returns></returns>
BOOL Pie(HDC hdc, int nLeftRect,int nTopRect, int nRightRect,int nBottomRect,int nXRadiall, int nYRadial,int nXRadial2,int nYRadial2);
```

点(nLeftRect,nTopRect)和(nRightRect,nBottomRect)指定边界矩形，边界矩形内的椭圆定义了饼形的曲线。矩形中心到起点(nXRadial1,nYRadial1）与椭圆的相交点作为饼形曲线的起点，矩形中心到终点(nXRadial2,nYRadial2)与椭圆的相交点作为饼形曲线的终点，从饼形曲线的起点到终点治当前绘图方向绘制，然后在矩形中心到饼形曲线的起点和终点之间分别绘制一条直线来闭合饼形。具体结合下图理解。



可以看到，函数Arc  Chord和Pie都使用同样的参数。同样，Pie函数会受当前绘图方向的影响。

:::



:::details `Pie 示例`

```c
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 400, 500, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        SelectObject(hdc, CreatePen(PS_SOLID, 2, RGB(0, 0, 0)));
      
        Pie(hdc, 100, 100, 600, 400, 350, 400, 100, 400);
        DeleteObject(SelectObject(hdc, GetStockObject(BLACK_PEN)));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611224326228.png)

:::



:::details `Polygon 函数说明`





Polygon函数与Polyline有点类似，该函数通过连接指定数组中的点来绘制一条或多条直线。如果数组中的最后一个点与第一个点不同，则会额外绘制一条线连接最后一个点与第—个点(Polyline函数不会这么做)，形成一个多边形，内部会被填充。该函数既不使用也不更新当前位置∶

```c
/// <summary>
/// 通过连接指定数组中的点，来绘制一条或者多条直线
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lpPoints">点结构数组，逻辑单位</param>
/// <param name="nCount">lpPoints数组中点的个数，必须大于或等于2</param>
/// <returns></returns>
BOOL Polygon(HDC hdc,const POINT* lpPoints,int nCount);

```

参数nCount指定lpPoints数组中点的个数，必须大于或等于2。如果只是指定了2个点，那么仅绘制一条直线。大家测试一下，把Line程序对Polyline函数的调用改为Polygon，会发现(10,220)，(110,200)，(210,220)这3个点会形成一个多边形，内部会被填充。

:::



:::details `Polygon 示例`

```c
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 400, 500, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        POINT arrPt[] = { 0,40,100,40,20,100,50,0,80,100 };
        POINT arrPt2[] = { 120,40,220,40,140,100,170,0,200,100 };
        Polygon(hdc, arrPt, _countof(arrPt));
        //设置多边形填充模式 WINDING
        SetPolyFillMode(hdc, WINDING);
        Polygon(hdc, arrPt2, _countof(arrPt2));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

程序运行效果如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204105950176.png)

为了方便大家识别，我把5个点的先后顺序标识出来了。可以看到，默认情况下五角形内部那个五边形不会被填充﹔设置多边形填充模式为WINDING以后，五角形内部那个五边形会被填充。

:::







在填充复杂的重叠多边形的情况下，例如上面的五角形，不同的多边形填充模式可能会导致内部填充方式的不同。`SetPolyFillMode`函数为多边形填充函数设置多边形填充模式.



:::details `SetPolyFillMode 函数说明`

```c
/// <summary>
/// 设置多边形的填充模式
/// </summary>
/// <param name="hdc">设备环境</param>
/// <param name="iPolyFillMode">新的多边形填充模式</param>
/// <returns></returns>
int SetPolyFillMode(HDC hdc,int iPolyFillMode); 
```

- 参数iPolyFillMode指定新的多边形填充模式，该参数如下表所示。

|   宏常量    |                             含义                             |
| :---------: | :----------------------------------------------------------: |
| `ALTERNATE` | 交替模式，默认值。对于ALTERNATE填充模式，要判断一个封闭区域是否被填充，可以想象从这个封闭区域中的一个点向外部无穷远处水平或垂直画一条射线，只有该射线穿越奇数条边框线时，封闭区域才会被填充缠绕模式。WINDING模式在大多数情况下会填充所有封闭区域，但是也有例外。在WINDING模式下，要确定一个区域是否应该被填充，同样可以假想从区域内的一个点画一条伸向外部无穷远处的水平或垂直射线，如果射线穿越奇数条边框线，则区域被填充，这和ALTERNATE模式相同 |
|  `WINDING`  | 如果射线穿越偶数条边框线，还要考虑到边框线的绘制方向。在被穿越的偶数条边框线中，不同方向的边框线（相对于射线的方向)的数目如果相等，则区域不会被填充﹔不同方向的边框线（相对于射线的方向)的数目如果不相等，则区域会被填充 |

为了让大家理解多边形填充模式，再看一种更复杂的情况，下图中的箭头表示画线的方向。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204110444362-17070158855198.png)



WINDING模式和ALTERNATE模式都会填充号码为1～3的3个封闭的L型区域。两个更小的内部区域号码为4和5，在ALTERNATE模式下不被填充。但是在WINDING模式下，号码为5的区域会被填充，这是因为从区域的内部到达图形的外部会穿越两条相同方向的边框线;号码为4的区域不会被填充，这是因为射线会穿越两条边框线，但是这两条边框线的绘制方向相反。

:::



:::details `PolyPolygon 函数说明`

```c
/// <summary>
/// 绘制—系列多边形
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lpPoints">点结构数组，逻辑单位。可理解为是多个组，一个组画一个多边形</param>
/// <param name="lpPolyCounts">整型数组</param>
/// <param name="nCount">组的个数，也就是lpPolyCounts的数组元素个数，即几个多边形</param>
/// <returns></returns>
BOOL PolyPolygon(HDC hdc,const POINT* lpPoints,const INT* lpPolyCounts, int nCount);
```

参数lpPolyCounts是一个整型数组，每个数组元素用于指定每一个组分别有几个点，每一个组的点个数必须大于或等于2。每个多边形都会通过从最后一个顶点到第一个顶点绘制一条直线来自动闭合多边形，该函数同样受多边形填充模式影响。PolyPolygon在功能上等同于下面的代码∶

```c
    for (int i = 0, iGroup = 0; i < nCount; i++)
    {
        Polygon(hdc, lpPoints + iGroup, lpPolyCounts[i]);
        iGroup += lpPolyCounts[i];
    }
```

:::

:::details `PolyPolygon 示例`

举个小例子，画一个三菱车标。

```c
#include <Windows.h>
#include <tchar.h>
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    WNDCLASSEX wndclass;
    TCHAR szClassName[] = TEXT("MyWindow");
    TCHAR szAppName[] = TEXT("直线");
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
    RegisterClassEx(&wndclass);
    hwnd = CreateWindowEx(0, szClassName, szAppName, WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 400, 500, NULL, NULL, hInstance, NULL);
    ShowWindow(hwnd, nCmdShow);
    UpdateWindow(hwnd);
    while (GetMessage(&msg, NULL, 0, 0) != 0)
    {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return msg.wParam;
}
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
    HDC hdc;
    PAINTSTRUCT ps;
    if (uMsg == WM_PAINT)
    {
        hdc = BeginPaint(hwnd, &ps);
        SetBkMode(hdc, TRANSPARENT);
        POINT arrPoint[] = { 50,66,66,33,50,0,33,33,
                            50,66,17,66,0,100,33,100,
                            50,66,83,66,100,100,66,100 };
        INT arrPolyCounts[] = { 4,4,4 };
        PolyPolygon(hdc, arrPoint, arrPolyCounts, _countof(arrPolyCounts));
        EndPaint(hwnd, &ps);
        return 0;
    }
    else if (uMsg == WM_DESTROY)
    {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240611225535541.png)

:::



可以看到，上面的函数都既不使用也不更新当前位置。

填充图形使用当前画笔绘制边框线，使用当前画刷绘制内部的填充色。



前面已经学习过创建逻辑画笔和逻辑画刷，我们可以创建各种不同样式、宽度和颜色的画笔，然后使用SelectObject函数将其选入DC中用于绘制边框线。



可以创建各种不同颜色、阴影样式或图案的画刷，然后使用SelectObject函数将其选入DC中用于填充图形内部。



## 一些矩形操作函数

在GDI编程中经常使用矩形，以下矩形函数在实际开发中可能会用到。矩形的坐标值使用有符号整数，矩形右侧的坐标值必须大于左侧的坐标值。同样，矩形底部的坐标值必须大于顶部的坐标值。下面的所有矩形函数都使用逻辑单位。



- `SetRect`函数设置指定矩形的坐标
- `CopyRect`函数将一个矩形的坐标复制给另一个矩形，设置rect2 = rect1 
- `SetRectEmpty`函数用于把一个矩形的所有坐标都设置为0
- `IsRectEmpty`函数判断一个矩形的大小是否为0，即右侧的坐标是否小于或等于左侧的坐标，或底部的坐标是否小于或等于顶部的坐标，或同时小于或等于
- `EqualRect`函数判断两个矩形是否相同，即两个矩形的左上角和右下角坐标是否都相同，若两个矩形的尺寸大小相同是不可以的，必须是坐标完全相同,

:::details `SetRect/CopyRect/SetRectEmpty/IsRectEmpty/EqualRect 函数声明`

```c
/// <summary>
/// 设置指定矩形的坐标
/// </summary>
/// <param name="lprc">out,要设置的矩形的RECT结构的指针</param>
/// <param name="xLeft">指定矩形左上角的新X坐标</param>
/// <param name="yTop">指定矩形左上角的新Y坐标</param>
/// <param name="xRight">指定矩形右下角的新X坐标</param>
/// <param name="yBottom">指定矩形右下角的新Y坐标</param>
/// <returns></returns>
BOOL SetRect(LPRECT lprc,int xLeft,int yTop,int xRight,int yBottom);

/// <summary>
/// 将一个矩形的坐标复制给另一个矩形
/// </summary>
/// <param name="lprcDst">out,目标矩形的RECT结构的指针</param>
/// <param name="prcSrc">源矩形的RECT结构的指针</param>
/// <returns></returns>
BOOL CopyRect(LPRECT lprcDst,const RECT* prcSrc); 

/// <summary>
/// 把一个矩形的所有坐标都设置为0 
/// </summary>
/// <param name="Iprc">out,要设置的矩形的RECT结构的指针</param>
/// <returns></returns>
BOOL SetRectEmpty(LPRECT Iprc); 

/// <summary>
/// 函数判断一个矩形的大小是否为0
/// </summary>
/// <param name="lprc">要判断的矩形的RECT结构的指针</param>
/// <returns></returns>
BOOL lsRectEmpty(const RECT* lprc); 

/// <summary>
/// 判断两个矩形是否相同
/// </summary>
/// <param name="lprc1">第一个矩形的RECT结构的指针</param>
/// <param name="lprc2">第二个矩形的RECT结构的指针</param>
/// <returns></returns>
BOOL EqualRect(const RECT* lprc1,const RECT* lprc2);
```

:::



:::details `InflateRect 函数说明`

InflateRect函数增加或减小一个矩形的宽度或高度，也可以同时增加或减小宽度和高度︰

```c
/// <summary>
/// 增加或减小一个矩形的宽度或高度
/// </summary>
/// <param name="lprc">out,要设置的矩形的RECT结构的指针</param>
/// <param name="dx">增加或减少矩形宽度的量，设置为负可以减小宽度</param>
/// <param name="dy">增加或减少矩形高度的量，设置为负可以减小高度</param>
/// <returns></returns>
BOOL InflateRect(LPRECT lprc,int dx,int dy);
```

Inflate的字面意思是膨胀，该函数在矩形的左侧和右侧各添加dx单位，在顶部和底部各添加dy单位∶

:::



:::details `InflateRect 示例:`

```c
    // 矩形大小100 100
	RECT rect = { 10,10,110,110 };  
    // 变为rect = { -90,-90,210,210 } 矩形大小300 300
	InflateRect(&rect, 100, 100); 

   //变为rect = { 60,60,60,60 }矩形大小0 0
	InflateRect(&rect, -150, -150); 
```

:::



:::details `OffsetRect 函数说明`

OffsetRect函数将矩形移动一定的量，大小不会改变

```c
/// <summary>
/// 将矩形移动一定的量，大小不会改变
/// </summary>
/// <param name="lprc">out,要移动的矩形的RECT结构的指针</param>
/// <param name="dx">向左或向右移动的量，设置为负值可以向左移动</param>
/// <param name="dy">向上或向下移动的量，设置为负值可以向上移动</param>
/// <returns></returns>
BOOL OffsetRect(LPRECT lprc,int dx,int dy); 
```

:::



:::details `OffsetRect 示例`

为了帮助理解，请看代码︰

```c
RECT rect = { 10，10,110,110 };
//rect = { 20，30，120,130 }100 100
OffsetRect(&rect,10,20);  
// rect = { -30,-20,70，80 } 100 100
OffsetRect(&rect,-50,-50); 
```

:::



`PtInRect`函数用于判断一个点是否位于指定的矩形内，这个函数经常使用。



:::details `PtInRect 函数定义`

```c
/// <summary>
/// 判断一个点是否位于指定的矩形内
/// </summary>
/// <param name="lprc">矩形的RECT结构的指针</param>
/// <param name="pt">点结构</param>
/// <returns></returns>
BOOL PtInRect(const RECT* lprc,POINT pt); 
```

::: 



`IntersectRect`函数计算两个源矩形的交集，并将交集矩形的坐标放入目标矩形参数.



:::details `IntersectRect 函数说明`

```c
/// <summary>
/// 计算两个源矩形的交集
/// </summary>
/// <param name="lprcDst">目标矩形的RECT结构的指针</param>
/// <param name="IprcSrc1">源矩形1的RECT结构的指针</param>
/// <param name="IprcSrc2">源矩形2的RECT结构的指针</param>
/// <returns></returns>
BOOL IntersectRect(LPRECT lprcDst, const RECT* IprcSrc1,const RECT* IprcSrc2); 
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204113034097-17070174351329.png)

源矩形1和源矩形2的并集就是实心黑线范围的大矩形，并集的结果是包含两个源矩形的最小矩形，而不会是一个不规则的形状。

:::





`SubtractRect`函数从一个矩形中减去另一个矩形.



:::details `SubtractRect 函数说明`

```c

/// <summary>
/// 一个矩形中减去另一个矩形
/// </summary>
/// <param name="lprcDst">存放相减结果的矩形的RECT结构的指针</param>
/// <param name="lprcSrc1">源矩形1的RECT结构的指针，函数从该结构中减去lprcSrc2指向的矩形</param>
/// <param name="lprcSrc2">源矩形2的RECT结构的指针</param>
/// <returns></returns>
BOOL SubtractRect(LPRECT lprcDst, const RECT* lprcSrc1,const RECT* lprcSrc2);
```

有一点需要注意，请看下图。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204113231938-170701755310610.png)



图中粗边框的矩形为源矩形1，细边框的矩形为源矩形2，左图中源矩形1减源矩形2的结果还是源矩形1﹔右图中源矩形1减源矩形2的结果则是阴影填充那个小矩形，即无法只减去一个小角，和`UnionRect`函数的道理相同，结果不会是一个不规则形状。

:::



`FillRect`函数使用指定的画刷填充矩形



`FrameRect`函数使用指定的画刷绘制矩形的边框，一般都是使用画笔绘制边框线，使用画刷绘制边框线比较少见



`InvertRect`函数通过对矩形每个像素的颜色值执行逻辑非运算来反转矩形的边框和内部填充颜色，对同一个矩形调用`lnvertRect`两次又会还原为以前的颜色。



:::details `FillRect/FrameRect/InvertRect 函数定义`

```c
/// <summary>
/// 使用指定的画刷填充矩形
/// </summary>
/// <param name="hDC">设备环境句柄</param>
/// <param name="lprc">要填充的矩形的RECT结构的指针</param>
/// <param name="hbr">用于填充矩形的逻辑画刷句柄，或标准系统颜色，例如(HBRUSH)(COLOR_BTNFACE+ 1)</param>
/// <returns></returns>
int FillRect(HDC hDC,const RECT* lprc,HBRUSH hbr); 

/// <summary>
/// 使用指定的画刷绘制矩形的边框
/// </summary>
/// <param name="hDC">设备环境句柄</param>
/// <param name="lprc">要绘制边框线的矩形的RECT结构的指针</param>
/// <param name="hbr">用于绘制边框线的画刷句柄</param>
/// <returns></returns>
int FrameRect(HDC hDC,const RECT* lprc,HBRUSH hbr);


/// <summary>
/// 通过对矩形每个像素的颜色值执行逻辑非运算来反转矩形的边框和内部填充颜色
/// </summary>
/// <param name="hDC">设备环境句柄</param>
/// <param name="lprc">out,要反转颜色的矩形的RECT结构的指针</param>
/// <returns></returns>
BOOL InvertRect(HDC hDC,const RECT* lprc);
```

:::

## 逻辑坐标与设备坐标



坐标空间是一个二维笛卡尔坐标系，通过使用相互垂直的两个参考轴来定位二维对象。系统中有**四层**坐标空间：世界、页面、设备和物理设备（客户区、桌面或打印纸页面)，如下所示。



**世界坐标空间**

可选，用作图形对象变换的起始坐标空间，可以对图形对象进行平移、缩放、旋转、剪切(倾斜、变形)和反射(镜像)。世界坐标空间高2单位，宽2单位。





**页面坐标空间**



用作世界坐标空间之后的下一个坐标空间，或图形变换的起始坐标空间，该坐标空间可以设置映射模式。页面坐标空间也是高2单位，宽2单位





**设备坐标空间**



用作页面坐标空间之后的下一个坐标空间，该坐标空间只允许平移操作，这样可以确保设备坐标空间的原点映射到物理设备坐标空间中的正确位置。设备坐标空间高2个单位，宽2个单位



**物理设备坐标空间**

图形对象变换的最终(输出)空间，通常指应用程序窗口的客户区，也可以是整个桌面、全窗口(整个程序窗口，包括标题栏、菜单栏、客户区、边框等)或一页打印机或绘图仪纸张，具体取决于获取的是哪一种DC。



世界坐标空间和页面坐标空间都称为逻辑坐标空间，这两种坐标空间配合使用，为应用程序提供与设备无关的单位，如毫米和英寸。系统使用变换技术将一个矩形区域从一个坐标空间复制（或映射)到下一个坐标空间，直到输出全部显示在物理设备上，变换是一种改变对象大小、方向和形状的算法。





## 世界坐标空间到页面坐标空间的变换

DC默认运行在兼容图形模式下。兼容图形模式只支持一种逻辑坐标空间，即页面坐标空间，而不支持世界坐标空间。如果应用程序需要支持世界坐标空间，就必须调用`SetGraphicsMode(hdc,GM_ADVANCED)`函数改变DC的图形模式为高级图形模式，这样一来，DC就支持两层逻辑坐标空间:世界坐标空间和页面坐标空间以及两种坐标空间之间的变换矩阵。





世界坐标空间到页面坐标空间的变换支持平移、缩放、旋转、剪切(倾斜、变形)和反射（镜像)等功能，这都是通过调用`SetWorldTransform`函数实现的。调用该函数以后，映射将从世界坐标空间开始。否则，映射将从页面坐标空间开始。





:::details `SetWorldTransform 函数说明`



`SetWorldTransform`函数为指定的DC设置世界坐标空间和页面坐标空间之间的二维线性变换，该函数使用的是逻辑单位∶

```c
/// <summary>
/// 数为指定的DC设置世界坐标空间和页面坐标空间之间的二维线性变换
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="lpXform">包含变换数据的XFORM结构的指针</param>
/// <returns></returns>
BOOL SetWorldTransform(HDC hdc,const XFORM* lpXform);
```

参数`lpXform`是一个指向XFORM结构的指针，包含世界坐标空间到页面坐标空间变换的数据。

```c
typedef struct tagXFORM
{
	FLOAT eM11;
    FLOAT eM12;
    FLOAT eM21;
	FLOAT eM22;
	FLOAT eDx;
	FLOAT eDy;
}XFORM，*PXFORM，FAR*LPXFORM;
```

这6个字段构成了一个`2*3`矩阵，不同的操作需要设置不同的字段，如下表所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240204120056573.png)

:::



:::details `SetWorldTransform 示例`

接下来让我们看一下不同变换的效果。对于`WorldPage`程序，读者分别用`NORMAL` `TRANSLATE` `SCALE` `ROTATE` `SHEAR` `REFLECT`为参数调用`TransformAndDraw`函数，看一下相等、平移、缩放、旋转、剪切、反射的效果，在学习了页面坐标空间到设备坐标空间的变换以后就可以读懂本程序。具体代码实现如下所示：

```c
#include <Windows.h>
#include <tchar.h>
#include<math.h>

// 函数声明，窗口过程
LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam);

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
	WNDCLASSEX wndclass;
	TCHAR szAppName[] = TEXT("世界空间到页面空间的变换");
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
	wndclass.lpszClassName = szAppName;
	wndclass.hIconSm = NULL;
	RegisterClassEx(&wndclass);

	hwnd = CreateWindowEx(0, szAppName, szAppName, WS_OVERLAPPEDWINDOW,
		100, 100, 500, 400, NULL, NULL, hInstance, NULL);

	ShowWindow(hwnd, nCmdShow);
	UpdateWindow(hwnd);

	while (GetMessage(&msg, NULL, 0, 0) != 0)
	{
		TranslateMessage(&msg);
		DispatchMessage(&msg);
	}

	return msg.wParam;
}

enum MyEnum
{
	NORMAL, TRANSLATE, SCALE, ROTATE, SHEAR, REFLECT,
};

void TransformAndDraw(int iTransform, HWND hWnd)
{
	HDC hdc;
	XFORM xForm;
	RECT rect = {0};

	// 将图形模式设置为高级图形模式
	hdc = ::GetDC(hWnd);
	::SetGraphicsMode(hdc, GM_ADVANCED);

	// 将映射模式设置为MM_LOMETRIC，以0.1毫米为单位，这个函数稍后介绍
	::SetMapMode(hdc, MM_LOMETRIC);
	switch (iTransform)
	{
	case NORMAL:      // 相等
		xForm.eM11 = (FLOAT)1.0;
		xForm.eM12 = (FLOAT)0.0;
		xForm.eM21 = (FLOAT)0.0;
		xForm.eM22 = (FLOAT)1.0;
		xForm.eDx = (FLOAT)0.0;
		xForm.eDy = (FLOAT)0.0;
		SetWorldTransform(hdc, &xForm);
		break;
	case TRANSLATE:   // 向右平移
		xForm.eM11 = (FLOAT)1.0;
		xForm.eM12 = (FLOAT)0.0;
		xForm.eM21 = (FLOAT)0.0;
		xForm.eM22 = (FLOAT)1.0;
		xForm.eDx = (FLOAT)200.0;
		xForm.eDy = (FLOAT)0.0;
		SetWorldTransform(hdc, &xForm);
		break;
	case SCALE:        // 缩放到原始大小的1/2
		xForm.eM11 = (FLOAT)0.5;
		xForm.eM12 = (FLOAT)0.0;
		xForm.eM21 = (FLOAT)0.0;
		xForm.eM22 = (FLOAT)0.5;
		xForm.eDx = (FLOAT)0.0;
		xForm.eDy = (FLOAT)0.0;
		SetWorldTransform(hdc, &xForm);
		break;

	case ROTATE:      // 逆时针旋转30度
		xForm.eM11 = (FLOAT)0.8660;
		xForm.eM12 = (FLOAT)0.5000;
		xForm.eM21 = (FLOAT)-0.5000;
		xForm.eM22 = (FLOAT)0.8660;
		xForm.eDx = (FLOAT)0.0;
		xForm.eDy = (FLOAT)0.0;
		SetWorldTransform(hdc, &xForm);
		break;
	case SHEAR:       // 倾斜变形
		xForm.eM11 = (FLOAT)1.0;
		xForm.eM12 = (FLOAT)1.0;
		xForm.eM21 = (FLOAT)0.0;
		xForm.eM22 = (FLOAT)1.0;
		xForm.eDx = (FLOAT)0.0;
		xForm.eDy = (FLOAT)0.0;
		SetWorldTransform(hdc, &xForm);
		break;
	case REFLECT:     // 沿X轴镜像
		xForm.eM11 = (FLOAT)1.0;
		xForm.eM12 = (FLOAT)0.0;
		xForm.eM21 = (FLOAT)0.0;
		xForm.eM22 = (FLOAT)-1.0;
		xForm.eDx = (FLOAT)0.0;
		xForm.eDy = (FLOAT)0.0;
		SetWorldTransform(hdc, &xForm);
		break;
	}
	GetClientRect(hWnd, (LPRECT)&rect);
	// 设备坐标转换为逻辑坐标，此处逻辑单位为0.1毫米
	DPtoLP(hdc, (LPPOINT)&rect, 2);
	SelectObject(hdc, GetStockObject(NULL_BRUSH));
	// 还记得吧，下面的绘图函数均使用逻辑单位
	// 画外圆
	Ellipse(hdc, (rect.right / 2 - 300), (rect.bottom / 2 + 300),
		(rect.right / 2 + 300), (rect.bottom / 2 - 300));
	// 画内圆
	Ellipse(hdc, (rect.right / 2 - 270), (rect.bottom / 2 + 270),
		(rect.right / 2 + 270), (rect.bottom / 2 - 270));

	// 画小矩形
	Rectangle(hdc, (rect.right / 2 - 20), (rect.bottom / 2 + 360),
		(rect.right / 2 + 20), (rect.bottom / 2 + 210));

	// 画水平线
	MoveToEx(hdc, (rect.right / 2 - 400), (rect.bottom / 2 + 0), NULL);
	LineTo(hdc, (rect.right / 2 + 400), (rect.bottom / 2 + 0));

	// 画垂直线
	MoveToEx(hdc, (rect.right / 2 + 0), (rect.bottom / 2 + 400), NULL);
	LineTo(hdc, (rect.right / 2 + 0), (rect.bottom / 2 - 400));
	ReleaseDC(hWnd, hdc);
}

LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	HDC hdc;
	PAINTSTRUCT ps;
	if (uMsg == WM_CREATE)
	{
		return 0;
	}
	else if (uMsg == WM_PAINT)
	{
		hdc = BeginPaint(hwnd, &ps);
		// 请依次测试：NORMAL, TRANSLATE, SCALE, ROTATE, SHEAR, REFLECT
		TransformAndDraw(NORMAL, hwnd);
		EndPaint(hwnd, &ps);
		return 0;
	}
	else if (uMsg == WM_DESTROY)
	{
		PostQuitMessage(0);
		return 0;
	}
	return DefWindowProc(hwnd, uMsg, wParam, lParam);
}
```

:::



## 页面坐标空间到设备坐标空间的变换

页面坐标空间到设备坐标空间的变换决定了与DC关联的所有图形输出的映射模式。映射模式指定用于绘图操作的逻辑单位的大小。Windows提供了8种映射模式，如下表所示。





**映射模式逻辑单位XY轴正方向**



- `MM_TEXT`页面空间中的每个逻辑单位都映射到一个像素，也就是说，根本不执行缩放,这种映射模式下的页面空间相当于设备空间 Y坐标轴从上到下增加,X坐标轴从左向右增加.

- `MM_HIENGLISH`页面空间中的每个逻辑单位映射到设备空间中的0.001英寸,Y坐标轴从下到上增加; X坐标轴从左向右增加

- `MM_LOENGLISH`页面空间中的每个逻辑单位映射到设备空间中的0.01英寸;Y坐标轴从下到上增加;X坐标轴从左向右增加

- `MM_HIMETRIC`页面空间中的每个逻辑单位映射到设备空间中的0.01毫米;Y坐标轴从下到上增加;X坐标轴从左向右增加

- `MM_LOMETRIC`页面空间中的每个逻辑单位映射到设备空间中的0.1毫米;Y坐标轴从下到上增加;X坐标轴从左向右增加

- `MM_TWIPS`页面空间中的每个逻辑单位映射到一个点的二十分之一(1/1440英寸);Y坐标轴从下到上增加;坐标轴总是等量缩放

- `MM_ISOTROPIC`页面空间中的每个逻辑单位映射到设备空间中应用程序定义的单元
  坐标轴的方向由应用程序指定坐标轴不一定等量缩放

- `MM_ANISOTROPIC`页面空间中的每个逻辑单位映射到设备空间中应用程序定义的单元;坐标轴的方向由应用程序指定





单词METRIC (公制)和ENGLISH(英制)指的是两种比较通用的测量系统，LO和HI是低(Low）和高(High)，指的是精度的高低。在排版中，一个点是一个基本测量单位，大约为1/72英寸，但是在图形程序设计中，通常假定它正好是1/72英寸，一个Twip是1/20点，也就是1/1440英寸。ISOTROPIC和ANISOTROPIC的意思分别是各向同性和各向异性。



前6种映射模式属于系统预定义映射模式，MM_ISOTROPIC和MM_ANISOTROPIC属于程序自定义映射模式。



在6种预定义的映射模式中，—种依赖于设备(MM_TEXT)，其余(MM_HIENGLISH MM_LOENGLISH MM_HIMETRIC MM_LOMETRIC MM_TWIPS)称为度量映射模式，度量映射模式独立于设备，即与设备无关。



在6种预定义的映射模式中，X坐标轴都是从左向右增加﹔除了MM_TEXT映射模式Y坐标轴从上到下增加以外，其余5种的Y坐标轴都是从下到上增加。



:::details `S/GetMapMode 设置映射模式 函数说明`

要设置映射模式，需要调用`SetMapMode`函数。调用`GetMapMode`函数可以获取DC的当前映射模式。

```c
/// <summary>
/// 设置映射模式
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <param name="fnMapMode">8种映射模式之一</param>
/// <returns></returns>
int SetMapMode(HDC hdc,int fnMapMode);
```

```c

/// <summary>
/// 获取映射模式
/// </summary>
/// <param name="hdc">设备环境句柄</param>
/// <returns></returns>
int GetMapMode(HDC hdc);
```

:::



## 设备坐标系统

在Windows中有3种设备坐标系统∶屏幕坐标、全窗口坐标和客户区坐标。注意，在所有的设备坐标系统中，都是以像素为单位，水平方向上X值从左向右增加，垂直方向上Y值从上往下增加。



**屏幕坐标**



很多函数的操作都是相对于屏幕的，比如创建一个程序窗口的CreateWindowEx函数，获取一个窗口位置、大小的GetWindowRect函数，获取光标位置的GetCursorPos函数，MSG结构的pt字段（消息发生时的光标位置)等，都是使用屏幕坐标。



**全窗口坐标**



全窗口坐标在Windows中用得不多，调用GetWindowDC函数获取的DC的原点是窗口的左上角而非客户区左上角。



**客户区坐标**



这是最常使用的设备坐标系统，调用GetDC或BeginPaint函数获取的DC的原点是客户区左上角。





:::details `ClientToScreen/ScreenToClient 函数说明`

```c
/// <summary>
/// 客户区坐标转为屏幕坐标
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="lpPoint">要转换的客户区坐标的点结构，函数返回后屏幕坐标将被复制到该结构中</param>
/// <returns></returns>
BOOL ClientToScreen(HWND hWnd,LPPOINT lpPoint);
```



```c

/// <summary>
/// 屏幕坐标转为客户区坐标
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="IpPoint">要转换的屏幕坐标的点结构，函数返回后客户区坐标将被复制到该结构中</param>
/// <returns></returns>
BOOL ScreenToClient(HWND hWnd,LPPOINT IpPoint);
```

:::



:::details `GetWindowRect 函数说明`



`GetWindowRect`函数获取指定窗口的尺寸，尺寸以屏幕坐标表示，相对于屏幕左上角

```c
/// <summary>
/// 获取指定窗口的尺寸
/// </summary>
/// <param name="hWnd">窗口句柄</param>
/// <param name="lpRect">接收窗口左上角和右下角屏幕坐标的RECT结构</param>
/// <returns></returns>
BOOL GetWindowRect(HWND hWnd,LPRECT lpRect);
```

:::



:::details `MapWindowsPoints`

全窗口坐标是相对于一个程序窗口的。如果想将一组点从相对于一个窗口的坐标空间转换(映射）到相对于另一个窗口的坐标空间，则可以调用`MapWindowPoints`函数.

```c

/// <summary>
/// 将一组点从相对于一个窗口的坐标空间转换(映射）到相对于另一个窗口的坐标空间
/// </summary>
/// <param name="hWndFrom"></param>
/// <param name="hWndTo"></param>
/// <param name="IpPoints">指向POINT结构数组的指针，其中包含要转换的点</param>
/// <param name="cPoints"> IpPoints参数指向的数组中POINT结构的数量</param>
/// <returns></returns>
int MapWindowPoints(HWND hWndFrom,HWND hWndTo,LPPOINT IpPoints,UINT cPoints);
```

:::
