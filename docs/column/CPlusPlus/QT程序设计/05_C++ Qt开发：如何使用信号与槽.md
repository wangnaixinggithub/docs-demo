# C++ Qt开发：如何使用信号与槽

在Qt中，信号与槽（Signal and Slot）是一种用于对象之间通信的机制。是Qt框架引以为傲的一项机制，它带来了许多优势，使得Qt成为一个强大且灵活的开发框架之一。信号与槽的关联通过`QObject::connect`函数完成。这样的机制使得对象能够以一种灵活而松散耦合的方式进行通信，使得组件之间的交互更加灵活和可维护。


**信号（Signal）** 是一种特殊的成员函数，用于表示某个事件的发生。当特定的事件发生时，对象会发射（emit）相应的信号。例如，按钮被点击、定时器时间到达等都可以是信号。



**槽（Slot）** 是用于处理信号的成员函数。槽函数定义了在特定信号发生时执行的操作。一个槽可以与一个或多个信号关联，当信号被发射时，与之关联的槽函数将被调用。



在早期，对象间的通信采用回调实现。回调实际上是利用函数指针来实现，当我们希望某件事发生时处理函数能够获得通知，就需要将回调函数的指针传递给处理函数，这样处理函数就会在合适的时候调用回调函数。回调有两个明显的缺点：

- 它们不是类型安全的，无法保证处理函数传递给回调函数的参数都是正确的。
- 回调函数和处理函数紧密耦合，源于处理函数必须知道哪一个函数被回调。

而信号与槽机制则可以更好的比秒上述问题的产生，以下是信号与槽机制的一些优势：

1. **松散耦合（Loose Coupling）：** 信号与槽机制实现了松散耦合，使得对象之间的连接更加灵活。对象不需要知道彼此的具体实现，只需通过信号与槽进行通信。这降低了组件之间的依赖关系，提高了代码的可维护性。
2. **事件驱动（Event-Driven）：** 信号与槽机制使得Qt应用程序能够轻松地处理事件。例如，按钮的点击、定时器的超时等都可以通过信号与槽来处理，使得应用程序能够响应用户交互和外部事件。
3. **模块化设计：** 通过信号与槽，不同模块之间可以通过事件进行通信，这样可以更容易地设计和维护模块化的代码。一个模块的改变不太可能影响到其他模块，从而提高了代码的可维护性。
4. **异步通信：** 信号与槽机制支持跨线程的异步通信。当信号与槽连接在不同线程的对象上时，Qt会自动进行线程间的通信，使得开发者能够更方便地处理多线程应用。
5. **灵活的连接方式：** Qt支持多种连接方式，包括在代码中使用`QObject::connect`连接，也可以使用Qt Creator等工具在图形界面上进行可视化的信号与槽关联。这种灵活性使得开发者可以选择最适合他们需求的连接方式。
6. **类型安全的连接（Qt5新增特性）：** 在Qt5中引入了新的connect语法，不再需要使用SIGNAL()和SLOT()宏，而是使用函数指针直接进行连接，从而在编译时进行类型检查，减少了潜在的运行时错误。

总体而言，这些优势使得Qt成为构建各种类型应用程序的理想选择。





# 信号与槽函数

信号与槽函数的使用非常容易理解，笔者将以最简单的案例来告诉大家该如何[灵活的](https://so.csdn.net/so/search?q=灵活的&spm=1001.2101.3001.7020)运用这两者，首先新建一个`Qt Widgets Application`项目，如下图所示第一个则是该项目的选项卡，其他参数保持默认即可；



![image-20231217162633774](05_C++ Qt开发：如何使用信号与槽.assets/image-20231217162633774-17028015946911.png)当项目被创建好之后读者应该能构建看到如下图所示的页面提示信息，其中的`untitled.pro`是项目的主配置文件该配置文件一般有Qt自动维护，文件夹`Headers`则是项目的头文件包含路径，`Sources`则是代码的实现路径，最后一个`Forms`是用于图形化设计的UI模板。





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217162842872-17028017236794.png)



首先双击`mainwindow.ui`进入到UI设计模式，接着拖拽一个`PushButton`按钮组件，与两个`lineEdit`组件到右侧的窗体画布上，并按下`Ctrl+S`保存该画布，刷新配置文件，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217163035737-17028018371195.png)

此时回到编辑菜单，并点击`mainwindow.h`头文件部分，并在头文件`mainwindow.h`的类`MainWindow`的定义中声明槽函数，代码如下，其含义是定义一个按钮点击槽：

```cpp
public slots:
    void HandlePushButtonClick();
```

![image-20231217163235470](05_C++ Qt开发：如何使用信号与槽.assets/image-20231217163235470-17028019567176.png)接着我们就需要点击`mainwindow.cpp`文件，并在头文件中实现这个槽函数的具体功能，此处我们就实现设置两个`lineEdit`组件分别用于显示两串字符串，代码如下；

```c#
void MainWindow::HandlePushButtonClick()
{
    ui->lineEdit->setText("HelloWorld");
    ui->lineEdit_2->setText("QT Solt");
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217163415533-17028020562317.png)



最后一步则是建立映射关系，在类`MainWindow`的构造函数中添加如下语句，以便将信号和槽函数进行连接：

```c
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    //建立关联，和MFC消息映射差不多，MFC是按钮点击时的WINDOWS的消息由该窗体类哪一个成员函数处理
    //QT 是按钮点击时会产生一个信号clicked() 发送给主窗体类的HandlePushButtonClick()这个槽函数处理
    //槽函数 也是窗体类的成员函数。
    connect(ui->pushButton,SIGNAL(clicked()),this,SLOT(HandlePushButtonClick()));
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::HandlePushButtonClick()
{
    ui->lineEdit->setText("HelloWorld");
    ui->lineEdit_2->setText("QT Solt");
}

```

此时运行程序，当读者点击按钮时，则会自动触发`HandlePushButtonClick()`所关联的代码，将两个`lineEdit`设置为不同的内容，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217164816070-17028028974848.png)



当然了，上述过程都是需要我们手动的去关联信号与槽，在开发中其实可以直接在`PushButton`组件上右键，选中`转到槽`选项，此时则会弹出关于该组件所支持的所有槽函数，读者只需要选中并双击，即可自动实现槽函数的创建与管理，这对于高效率开发是至关重要的。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217164914793-170280296779710.png)



当然在槽函数使用结束后我们需要断开，在断开时直接使用`disconnect`并传入需要断开的绑定`sender`信号即可，如下所示；

```c
void MainWindow::on_pushButton_2_clicked()
{
    disconnect(ui->pushButton,SIGNAL(clicked()),nullptr,nullptr);

}
```

这个时候断开信号了，再去点击按钮就`HandlePushButtonClick()` 就不会处理这个按钮的点击信息了。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217165359229-170280324078911.png)



# 匿名函数绑定

你是否感觉使用代码创建信号与槽很麻烦呢，其实通过使用`Lambda`表达式我们可以与`Connect`完美的结合在一起使用，者能够让信号与槽的使用更加的得心应手。



Lambda表达式是一种匿名函数的表示方式，引入C++11标准，用于创建内联函数或闭包。Lambda表达式可以在需要函数对象的地方提供一种更为简洁和灵活的语法。

它的基本形式如下：

```c
[capture](parameters) -> return_type {
    // 函数体
}
```

- `capture`：用于捕获外部变量的列表。可以捕获外部变量的值或引用，也可以省略不捕获任何变量。捕获列表是Lambda表达式的一部分.
- `parameters`：参数列表，类似于普通函数的参数。
- `return_type`：返回类型，指定Lambda表达式的返回类型。可以省略，由编译器自动推断。
- `{}`：Lambda表达式的函数体。

使用Lambda表达式与Qt的`connect`函数结合实现匿名槽函数。具体概述如下：

```c
  //没有函数名，等价于JavaScript的闭包，直接执行！
    [=]() {
        this->setWindowTitle("初始化..");
    }();
```

![image-20231217165720859](05_C++ Qt开发：如何使用信号与槽.assets/image-20231217165720859-170280344169312.png)

这里使用Lambda表达式对 `this->setWindowTitle("初始化..");` 进行了初始化，Lambda表达式中的 `[=]` 表示捕获外部变量并通过值传递，其中的 `()` 表示Lambda表达式立即执行，实现对窗口标题的初始化。



**Lambda表达式作为槽函数**

```c
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    
   
   
    //比如这里我们通过匿名函数的方式，直接实现HandlePushButtonClick() 槽函数的工作
    connect(ui->pushButton,&QPushButton::clicked,this,[=]() mutable
    {
        ui->lineEdit->setText("HelloWorld");
        ui->lineEdit_2->setText("QT Solt");
         number = number + 100;
    });


}
```

这里使用Lambda表达式作为 `pushButton` 按钮的槽函数。在Lambda表达式中，使用了 `mutable` 关键字，允许修改通过值传递的变量 `number`。按钮 `pushButton` 被点击时，Lambda表达式内部修改了 `number` 的值。

**Lambda表达式中的返回值**

```c
int ref = []() -> int {
    return 1000;
}();
std::cout << "Return = " << ref << std::endl;
```

里的Lambda表达式中带有返回值的情况。Lambda表达式通过 `-> int` 指定返回类型，然后在大括号中返回了一个整数值。该Lambda表达式被立即执行，返回值被赋给变量 `ref`，并输出到控制台。



总体来说，匿名函数（Lambda表达式）在Qt中与`connect`函数一起使用，提供了一种方便的方式来定义简短的槽函数，使得代码更加紧凑和可读。