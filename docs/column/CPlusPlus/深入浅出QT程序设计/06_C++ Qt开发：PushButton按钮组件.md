# C++ Qt开发：PushButton按钮组件

Qt 是一个跨平台C++[图形界面](https://so.csdn.net/so/search?q=图形界面&spm=1001.2101.3001.7020)开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`QPushButton`按钮组件的常用方法及灵活运用。



QPushButton 是 Qt 框架中用于创建按钮的组件类，是 QWidget 的子类。按钮是用户界面中最常见的交互元素之一，用于触发特定的操作或事件。该组件具有丰富的属性和方法，使其在不同的应用场景中能够灵活运用。

以下是 QPushButton 类中常用的一些方法，包括说明和简要概述：

|                           **方法**                           |                    **说明**                    |
| :----------------------------------------------------------: | :--------------------------------------------: |
| `QPushButton(const QString &text, QWidget *parent = nullptr)` | 构造函数，创建一个带有指定文本和父对象的按钮。 |
|             `void setText(const QString &text)`              |                设置按钮的文本。                |
|                    `QString text() const`                    |                获取按钮的文本。                |
|              `void setIcon(const QIcon &icon)`               |                设置按钮的图标。                |
|                     `QIcon icon() const`                     |                获取按钮的图标。                |
|             `void setCheckable(bool checkable)`              |            设置按钮是否可切换状态。            |
|                  `bool isCheckable() const`                  |            检查按钮是否可切换状态。            |
|               `void setEnabled(bool enabled)`                |                启用或禁用按钮。                |
|                   `bool isEnabled() const`                   |               检查按钮是否启用。               |
|              `void setDefault(bool isDefault)`               |            设置按钮是否为默认按钮。            |
|                   `bool isDefault() const`                   |            检查按钮是否为默认按钮。            |
|                        `void click()`                        |                 模拟按钮点击。                 |
|                  `void setFlat(bool flat)`                   |            设置按钮是否为平面按钮。            |
|                    `bool isFlat() const`                     |            检查按钮是否为平面按钮。            |
|                        `void show()`                         |                   显示按钮。                   |

这些方法提供了丰富的功能，使得 QPushButton 可以适应不同的界面需求。通过设置文本、图标、切换状态等属性，以及连接点击事件等，可以实现按钮的各种交互效果。

PushButton 的使用有两种方式，读者可以直接在图形界面上面拖拽来使用，也可以通过new QPushButton的方式动态的创建生成。

## 代码方式创建

首先我们以第一种纯代码的方式来使用`PushButton`组件，读者需要导入`#include <QPushButton>`类，导入后可以使用`new`关键词创建一个按钮组件。

```c
#include "HelloQT.h"
#include <QPushButton>
#include <iostream>

// 设置函数,用于绑定事件
void Print()
{
    std::cout << "hello JacksonWang" << std::endl;
}

HelloQT::HelloQT(QWidget *parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);


    //创建【退出】按钮

    QPushButton* btn = new QPushButton;
    btn->setParent(this);  // 设置父窗体(将btn内嵌到主窗体中)
    btn->setText(QString::fromLocal8Bit("退出")); // 设置按钮text显示
    btn->move(100, 20);  // 移动按钮位置
    btn->resize(100, 50);  // 设置按钮大小
    btn->setEnabled(true); // 设置是否可被点击
    
    // 创建[触发信号]按钮
    QPushButton* btn2 = new QPushButton(QString::fromLocal8Bit("触发信号"), this);
    btn2->move(100, 100);
    btn2->resize(100, 50);

    // 设置主窗体常用属性
    this->resize(300, 200);              // 重置窗口大小,调整主窗口大小
    this->setWindowTitle(QString::fromLocal8Bit("我的窗体"));    // 重置主窗体的名字
    this->setFixedSize(300, 200);        // 固定窗体大小(不让其修改)

    // 为按钮绑定事件 connect(信号的发送者,发送的信号,信号的接受者,处理的函数(槽函数))
    connect(btn, &QPushButton::clicked, this, &QWidget::close);

    // 将窗体中的 [触发信号] 按钮,连接到Print函数中.
    connect(btn2, &QPushButton::clicked, this, &Print);

}

HelloQT::~HelloQT()
{}

```

上述代码中我们通过`new QPushButton`的方式创建了两个按钮，并分别调整了按钮的常规属性包括按钮的高度宽度以及按钮的大小、按钮标题等，通过`connect`分别为按钮绑定了两个事件，以用于推出和触发打印函数，效果如下所示：

<img src="06_C++ Qt开发：PushButton按钮组件.assets/代码形式创建Pushbutton.gif" style="zoom:50%;" />

如果说，读者的程序运行之后，没有控制台窗口出现，可以通过配置项目属性来解决。具体步骤如下图所示：

<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114115631180.png" alt="image-20240114115631180" style="zoom: 50%;" />

## 图形界面创建

通过图形界面的创建很简单，只需要拖拽控件Qt会帮我们做完所有的工作，这里我们就重点说说Qt中的QSS组件库的使用，Qt Style Sheets（QSS）是一种用于定义Qt应用程序外观和样式的样式表语言。类似于HTML和CSS中的样式表，QSS允许开发者通过简单的样式规则来定义Qt界面的外观，包括控件的颜色、字体、边框、背景等。

在讲解之前，我们先new出来两个pushButton按钮。



<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114120101148.png" alt="image-20240114120101148" style="zoom:50%;" />

总的来说，使用QSS，开发者可以很容易地改变应用程序的外观，使其适应不同的用户界面设计需求，或者根据应用程序的主题进行个性化定制。



QSS可以通过在组件上直接追加属性的方式实现，通过使用setStyleSheet属性可以很容易的对特定的组件进行着色操作，如下我们将第一个pushButton设置为黄色可以这样写；

```c
#include "HelloQT.h"
#include <QPushButton>
#include <iostream>


HelloQT::HelloQT(QWidget *parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);
    //设置pushButton的背景颜色为黄色
    ui.pushButton->setStyleSheet("background:yellow");
    
}

HelloQT::~HelloQT()
{}

```

<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114120605687.png" alt="image-20240114120605687" style="zoom:67%;" />



如果读者是使用VS开发，可能会出现我们在`可视化ui界面`修改之后后在VS中运行却没有变化的问题，处理该问题很简单。我们只需要找到ui文件，笔者这里是`HelloQT.ui`  进行编译即可！

<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114120504056.png" alt="image-20240114120504056" style="zoom:67%;" />





当然了如果我们将`ui->`指定传入`this->`则会对当前整个页面生效，当如下界面被执行时则整个页面会变成蓝色；

```c
this->setStyleSheet("background:blue");
```

除了使用代码来设置样式表外，也可以在设计模式中为添加到界面上的部件设置样式表，这样更加直观。先注释掉上面添加的代码，然后进入设计模式。在界面上右击，在弹出的菜单中选择“改变样式表”.

<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114121132781.png" alt="image-20240114121132781" style="zoom: 50%;" />



这时会出现编辑样式表对话框，在其中输入如下代码，如图；

![image-20240114121217278](06_C++ Qt开发：PushButton按钮组件.assets/image-20240114121217278-17052055383776.png)

则此时将会针对所有的`pushButton`组件生效，当程序运行时所有的组件都见变为蓝色，当然了在某些时候我们还是希望能对单独的组件进行控制，例如将第二个按钮上色第一个保持不变，则此时需要将规则由；

```c
QPushButton{
	background-color: rgb(0, 0, 255);
}
```

更改为`QPushButton`组件名外加`#`紧随其后的是`ObjectName`对象名`pushButton_2`，那么就要写成如下规则；

```c
QPushButton#pushButton_2
{
	background-color: rgb(0,0,255);
}
```

此时再次运行程序，则只有第二个按钮被标记为蓝色，第一个按钮将会保持默认色，如下图；

![image-20240114121318104](06_C++ Qt开发：PushButton按钮组件.assets/image-20240114121318104-17052055992687.png)



当然这样的配色显然是无法正常使用的，如果读者学过`前端`应该知道使用`CSS`如何美化按钮，QSS也支持CSS中的各种事件（哈哈哈直接抄思想），我们以按钮的普通状态，按下抬起为例，将如下`QSS`设置到组件上。

```c
/*按钮普通态*/
QPushButton
{
    /*字体为微软雅黑*/
    font-family:Microsoft Yahei;
    /*字体大小为20点*/
    font-size:20pt;
    /*字体颜色为白色*/    
    color:white;
    /*背景颜色*/  
    background-color:rgb(14 , 150 , 254);
    /*边框圆角半径为8像素*/ 
    border-radius:8px;
}

/*按钮停留态*/
QPushButton:hover
{
    /*背景颜色*/  
    background-color:rgb(44 , 137 , 255);
}

/*按钮按下态*/
QPushButton:pressed
{
    /*背景颜色*/  
    background-color:rgb(14 , 135 , 228);
    /*左内边距为3像素，让按下时字向右移动3像素*/  
    padding-left:3px;
    /*上内边距为3像素，让按下时字向下移动3像素*/  
    padding-top:3px;
}
```

此时会呈现三种状态，当默认未被选中时会使用`QPushButton`来渲染，而`QPushButton:hover`则用于悬停时的显示，最后的`QPushButton:pressed`则是被按下是的颜色渲染，如下所示；

![](06_C++ Qt开发：PushButton按钮组件.assets/前端CSS在QT中直接用.gif)



接着我们来看一下如何添加背景图片到`Qt`中并使用`QSS`将背景附加到`PushButton`上，首先分别准备一些素材文件，这里提供三个不同的png图片；

下面是**普通态**的背景图，用了同一张背景图：

- Qt_threeStatus_ok.png

![](06_C++ Qt开发：PushButton按钮组件.assets/Qt_threeStatus_ok.png)

- Qt_threeStatus_ok1.png

![Qt_threeStatus_ok1](06_C++ Qt开发：PushButton按钮组件.assets/Qt_threeStatus_ok1.png)

- Qt_threeStatus_ok2.png

![Qt_threeStatus_ok2](06_C++ Qt开发：PushButton按钮组件.assets/Qt_threeStatus_ok2.png)

接着就是要把这些图片添加到Qt中的资源中去，如果你用的工具是`QT Creator`，则在项目主目录上右键选中`Add New...`按钮，并找到`Qt`下的`Qt Resource File`选项卡，并点击`Choose...`按钮，如下图所示:

<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114124452404.png" alt="image-20240114124452404" style="zoom:50%;" />



笔者用的工具是`VS2022`，所以是采用添加新建项的方式。读者可自行命名该资源名称这里我就叫`jacksonWang.qrc`

<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114124659890.png" alt="image-20240114124659890" style="zoom: 33%;" />

然后对`jacksonWang.qrc` 文件进行编辑，这里不能直接在`VS2022` 直接处理，有BUG.所以笔者这里用`QT Creator` 对此文件进行编辑，完成添加图片资源的工作。



点击`Add Prefix`按钮，并在项目根目录新建一个`jacksonWang`目录并将所需文件拖拽到该目录下，如下图；

<img src="06_C++ Qt开发：PushButton按钮组件.assets/image-20240114125130998.png" alt="image-20240114125130998" style="zoom:50%;" />



![image-20240114125241069](06_C++ Qt开发：PushButton按钮组件.assets/image-20240114125241069-170520796203711.png)

按钮依次选中资源并添加到项目源文件中，当添加结束后按下`Ctrl+S`保存RC文件，即可看到如下图所示；

![image-20240114125903283](06_C++ Qt开发：PushButton按钮组件.assets/image-20240114125903283-170520834486813.png)



样式表设置背景图可以使用`setStyleSheet`函数，在程序里设置按钮的样式表，具体程序如下所示：

```c
#include "HelloQT.h"
#include <QPushButton>
#include <iostream>


HelloQT::HelloQT(QWidget *parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);

     // 美化第一个按钮
    ui.pushButton->setStyleSheet(
        "QPushButton{border-image: url(:/new/jacksonWang/Qt_threeStatus_ok.png);}"
        "QPushButton:hover{border-image: url(:/new/jacksonWang/Qt_threeStatus_ok1.png);}"
        "QPushButton:pressed{border-image: url(:/new/jacksonWang/Qt_threeStatus_ok2.png);}"
    );

    // 美化第二个按钮
    ui.pushButton_2->setStyleSheet(
        "QPushButton{border-image: url(:/new/jacksonWang/Qt_threeStatus_ok.png);}"
        "QPushButton:hover{border-image: url(:/new/jacksonWang/Qt_threeStatus_ok1.png);}"
        "QPushButton:pressed{border-image: url(:/new/jacksonWang/Qt_threeStatus_ok2.png);}"
    );
  
}

HelloQT::~HelloQT()
{}

```

原来的样式表，就不需要背景颜色了。

```css
/*按钮普通态*/
QPushButton
{
    /*字体为微软雅黑*/
    font-family:Microsoft Yahei;
    /*字体大小为20点*/
    font-size:20pt;
    /*字体颜色为白色*/    
    color:white;
    /*边框圆角半径为8像素*/ 
    border-radius:8px;
}

/*按钮停留态*/
QPushButton:hover
{
  
}

/*按钮按下态*/
QPushButton:pressed
{
    /*左内边距为3像素，让按下时字向右移动3像素*/  
    padding-left:3px;
    /*上内边距为3像素，让按下时字向下移动3像素*/  
    padding-top:3px;
}
```

运行上述代码后将分别美化两个按钮，并输出如下图所示；



![](06_C++ Qt开发：PushButton按钮组件.assets/使用图片资源-170520846554914.gif)

当然，此类按钮的美化完全可以使用`QSS`来实现并不需要导入样式图，这种方法比上面用图标作为背景的好处就是可以不需要设计背景图，而且在样式不设置字体的情况下，可以随意更改文字以及文字的大小、位置、字体等显示效果。
