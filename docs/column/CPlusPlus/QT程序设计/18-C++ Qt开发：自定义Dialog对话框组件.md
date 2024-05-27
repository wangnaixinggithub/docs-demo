# C++ Qt开发：自定义Dialog对话框组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍自定义`Dialog`组件的常用方法及灵活运用。

在之前的文章中笔者已经为大家展示了默认`Dialog`组件的使用方法，虽然内置组件支持对数据的输入，但有时候我们需要一次性输入多个数据，此时如果之使用默认模态对话框似乎不太够用，此时我们需要自己创建一个自定义对话框，需要说明的是此类对话框也是一种窗体，所以可以在其上面放置任何通用组件，以实现更多复杂的开发需求。

自定义对话框需要解决的问题是，如何让父窗体与子窗体进行数据交换，要实现数据的交换有两种方式，第一种方式是通过动态加载模态对话框，当用户点击确定后通过`GetValue()`来拿到数据，而第二种方式则是通过发送信号的方式将数据投递给父窗体，这两种方式都可以，读者可根据自身需求来选择不同的通信方式。

### 1.1 使用模态对话框传值

首先我们需要创建一个自定义对话框，在Qt中创建对话框很容易，具体创建流程如下所示：

- 选择项目 -> AddNew -> QT -> Qt设计师界面类 -> 选择DialogWithoutButtons -> 命名为Dialog保存

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/cb7d23e5eb88cc3aef270b0b7e4cba74%5B1%5D.png)



此时直接点击下一步按钮，并选中`Forms/dialog.ui`界面编辑菜单，在编辑栏中我们分别增加一个`LineEdit`编辑框，以及两个`PushButton`按钮组件，将第一个组件命名为`BtnOk`将第二个组件命名为`BtnCancel`，界面如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9fa926a1410d919118014153b34d445c%5B1%5D.png)



当做完页面布局后，其次我们还需要在`Dialog.ui`组件上增加两个信号，分别是`点击`和`关闭`，并将信号关联到两个槽函数上，其信号应该写成如下图所示。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/abf5cd1600a1a1c28de4a115b7d884ed%5B1%5D.png)



如上图，`accept()` 是 `QDialog` 类的一个公共槽函数。调用这个槽函数会触发对话框的接受（accept）操作，通常用于模拟用户点击对话框的“确定”按钮。同样的`reject()` 也是 `QDialog` 类的一个公共槽函数。调用这个槽函数会触发对话框的拒绝（reject）操作，通常用于模拟用户点击对话框的“取消”按钮。

接着我们点开模态对话框的`dialog.cpp`对话框类，其类内需要定义两个成员函数，它们的功能如下：

- 第一个 `GetValue()` 用来获取当前编辑框内的数据并将数据返回给父窗体。
- 第二个 `SetValue()` 用来接收传入的参数，并将此参数设置到自身窗体中的编辑框内。

```c
#include "dialog.h"
#include "ui_dialog.h"

Dialog::Dialog(QWidget *parent) :QDialog(parent),ui(new Ui::Dialog)
{
    ui->setupUi(this);
}

// 用于MainWindow获取编辑框中的数据
QString Dialog::GetValue()
{
    return ui->lineEdit->text();
}

// 用于设置当前编辑框中的数据为MainWindow
void Dialog::SetValue(QString x)
{
    ui->lineEdit->setText(x);
}

Dialog::~Dialog()
{
    delete ui;
}
```

接着我们来看一下`MainWindow`函数中是如何接收参数的，对于主窗体来说，当用户点击`on_pushButton_clicked()`按钮时，我们需要动态将自己创建的`Dialog`加载，读取出主窗体编辑框内的值并设置到子窗体内，当用户按下`QDialog::Accepted`时则是获取子窗体内的值，此时通过调用`ptr->GetValue()`子窗体的成员函数来返回一个字符串，并将其设置到父窗体的编辑框内，主函数代码如下所示；

```c
// 首先要包含Dialog对话框类
#include "dialog.h"

#include <iostream>
#include <QDialog>

MainWindow::MainWindow(QWidget *parent) :QMainWindow(parent),ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    ui->lineEdit->setEnabled(false);
    ui->lineEdit->setText("hello lyshark");
}

MainWindow::~MainWindow()
{
    delete ui;
}

// 按钮点击后执行
void MainWindow::on_pushButton_clicked()
{
    // 创建模态对话框
    Dialog *ptr = new Dialog(this);                                 // 创建一个对话框
    Qt::WindowFlags flags = ptr->windowFlags();                     // 需要获取返回值
    ptr->setWindowFlags(flags | Qt::MSWindowsFixedSizeDialogHint);  // 设置对话框固定大小

    // 读取MainWindows参数并设置到Dialog
    QString item = ui->lineEdit->text();
    ptr->SetValue(item);

    int ref = ptr->exec();             // 以模态方式显示对话框
    if (ref==QDialog::Accepted)        // OK键被按下,对话框关闭
    {
        // 当BtnOk被按下时,则设置对话框中的数据
        QString the_value = ptr->GetValue();
        std::cout << "value = " << the_value.toStdString().data() << std::endl;
        ui->lineEdit->setText(the_value);
    }

    // 删除释放对话框句柄
    delete ptr;
}
```

至此就实现了参数的子窗体传递到父窗体，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/b63cd130fa02ef068554c98df966f5e0%5B1%5D.png)



### 2.1 使用信号传值

对于信号传值，我们需要在`dialog.h`头文件中增加`sendText()`信号，以及`on_pushButton_clicked()`槽函数的声明部分，如下所示；

```c
// 定义信号(信号只需声明无需实现)
signals:
    void sendText(QString str);
private slots:
    void on_pushButton_clicked();
```

而在`dialog.cpp`实现部分，我们首先需要将子窗体中的按钮组件绑定到`onBtnClick()`槽函数上面，当需要发送数据时直接通过调用`emit sendText`触发信号，并携带子窗体中`send_data`的数据；

```c
#include "dialog.h"
#include "ui_dialog.h"

Dialog::Dialog(QWidget *parent) :QDialog(parent),ui(new Ui::Dialog)
{
    ui->setupUi(this);

    // 连接pushButton到onBtnClick上
    connect(ui->pushButton, SIGNAL(clicked()), this, SLOT(onBtnClick()));
}

Dialog::~Dialog()
{
    delete ui;
}

// 发送信号到MainWindow
void Dialog::on_pushButton_clicked()
{
    QString send_data = ui->lineEdit->text();
    emit sendText(send_data);
}
```

接着是在`mainwindow.h`头文件定义中，新增槽函数`receiveMsg()`函数用来接收信号的传值。

```c
private slots:
    // 定义槽函数
    void receiveMsg(QString str);
    void on_pushButton_clicked();
```

在`mainwindow.cpp`实现部分，接收到信号后的槽函数`receiveMsg`其内部可以直接将参数设置到父类窗口的`lineEdit`组件上，而当`on_pushButton_clicked`按钮被点击是，我们只需要加载自己的子窗体，并`Connect`链接槽函数`receiveMsg`上面，当做完这一切之后，再通过`subwindow->show()`让子窗体显示出来。

```c
#include "mainwindow.h"
#include "ui_mainwindow.h"

#include "dialog.h"
#include <QDialog>

MainWindow::MainWindow(QWidget *parent) : QMainWindow(parent),ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    ui->lineEdit->setEnabled(false);
}

// 接收信号并设置到LineEdit上
void MainWindow::receiveMsg(QString str)
{
    ui->lineEdit->setText(str);
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::on_pushButton_clicked()
{
    Dialog *subwindow = new Dialog(this);
    // 当收到sendText信号时使用receiveMsg槽函数处理
    connect(subwindow, SIGNAL(sendText(QString)), this, SLOT(receiveMsg(QString)));
    subwindow->show();
}
```

当然，此类对话框是非模态的，读者可以拖动父对话框，而由于是信号控制，所以当发送参数到父窗体后，子窗体并不会立即关闭，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/13b810008d2aa9d545fd03450dbcafb7%5B1%5D.png)

