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





:::details `DrawText和DrawTextEx函数说明`

```c
int DrawText(
_In_ HDC hdc, //设备环境句柄
_Inout_ LPCTSTR lpchText, //字符串指针
_In_ int cchText, //字符串长度，以字符为单位
_In_out_LPRECT lpRect, //所绘制的文本限定在这个矩形范围内
_In_ UINT uFormat //绘制格式选项
);

int DrawTextEx(
_In_ HDC hdc,//设备环境句柄
_Inout_ LPTSTR lpchText,//字符串指针
_ln_ int cchText, //字符串长度，以字符为单位
_In_out_ LPRECT lpRect,//所绘制的文本限定在这个矩形范围内
_In_ UINT uFormat, //绘制格式选项
_In_opt_ LPDRAWTEXTPARAMS lpDTParams //指定扩展格式选项的DRAWTEXTPARAMS结构，可以为NULL
);
```

:::
