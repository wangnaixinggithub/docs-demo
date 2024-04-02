# C++ Qt开发：RadioButton单选框分组组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍QRadioButton单选框组件以及与之交互的QButtonGroup类的常用方法及灵活运用。



QRadioButton是Qt框架中的一个部件（Widget），用于提供单选按钮的界面元素。单选按钮允许用户从多个互斥的选项中选择一个，通常用于表示一组相关但互斥的选项。



以下是`QRadioButton`的一些常用方法，以表格形式概述：

|                 **方法**                  |                           **描述**                           |
| :---------------------------------------: | :----------------------------------------------------------: |
| `QRadioButton(QWidget *parent = nullptr)` |          构造函数，创建一个单选按钮，可指定父部件。          |
|      `setText(const QString &text)`       |                   设置单选按钮的文本标签。                   |
|              `text() const`               |                   获取单选按钮的文本标签。                   |
|        `setChecked(bool checked)`         | 设置单选按钮的选中状态，`true`表示选中，`false`表示未选中。  |
|            `isChecked() const`            |                判断单选按钮是否处于选中状态。                |
|     `setAutoExclusive(bool enabled)`      |     设置是否自动将同一组中的其他单选按钮设为未选中状态。     |
|   `setObjectName(const QString &name)`    |                 设置对象名称，用于样式表等。                 |
|  `setCheckedState(Qt::CheckState state)`  | 设置单选按钮的选中状态，可选值有`Qt::Checked`、`Qt::Unchecked`和`Qt::PartiallyChecked`。 |
|           `checkState() const`            | 获取单选按钮的选中状态，返回`Qt::Checked`、`Qt::Unchecked`或`Qt::PartiallyChecked`。 |
|          `toggled(bool checked)`          | 信号，当单选按钮的选中状态发生改变时触发。参数`checked`表示是否选中。 |
|                 `click()`                 |               模拟点击单选按钮，触发点击事件。               |
|        `setDisabled(bool disable)`        |  设置单选按钮是否被禁用，`true`表示禁用，`false`表示启用。   |
|         `setEnabled(bool enable)`         |   设置单选按钮是否启用，`true`表示启用，`false`表示禁用。    |
|        `blockSignals(bool block)`         | 阻塞或解除阻塞信号与槽的连接，用于在某些操作时临时禁用信号槽。 |

这些方法提供了对`QRadioButton`的一些基本操作，包括设置文本、选中状态、信号与槽等。通过这些方法，可以在应用程序中方便地创建和控制单选按钮。总而言之，`QRadioButton`是一种简单而有效的界面元素，用于在多个互斥的选项中进行单一选择。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401170154551-17119621159851.png)



谈到QRadioButton组件就不得不提起QButtonGroup类，因为这两者通常是需要组合在一起使用的，一般来说QButtonGroup用于管理一组按钮，通常是单选按钮（QRadioButton）或复选按钮（QCheckBox）。它为这组按钮提供了一些便捷的方法，方便进行管理和操作。



首先我们需要在mainwindow.h头文件中手动增加一个槽函数的声明，该槽函数用于触发后的处理工作。

```c
private slots:
    void MySlots();
```

其次在主程序`mainwindow.cpp`中我们通过`new QBUttonGroup`新建一个按钮组，并将其加入到`group_sex`组内，创建信号和槽的绑定，将信号全部绑定到`MySlots()`槽函数上，如下所示；

```c
#include "mainwindow.h"
#include "ui_mainwindow.h"

#include <QMessageBox>
#include <QButtonGroup>
#include <iostream>

// 定义全局组变量
QButtonGroup *group_sex;

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 将RadioButton放入ButtonGroup组中
    group_sex = new QButtonGroup(this);
    group_sex->addButton(ui->radioButton_male,0);
    group_sex->addButton(ui->radioButton_female,1);
    group_sex->addButton(ui->radioButton_unknown,2);

    // 设置默认选中
    ui->radioButton_unknown->setChecked(true);

    // 绑定信号和槽
    connect(ui->radioButton_male,SIGNAL(clicked(bool)),this,SLOT(MySlots()));
    connect(ui->radioButton_female,SIGNAL(clicked(bool)),this,SLOT(MySlots()));
    connect(ui->radioButton_unknown,SIGNAL(clicked(bool)),this,SLOT(MySlots()));
}

MainWindow::~MainWindow()
{
    delete ui;
}

// 手动创建一个槽函数
void MainWindow::MySlots()
{
    switch(group_sex->checkedId())
    {
    case 0:
        std::cout << "male" << std::endl;
        QMessageBox::information(nullptr, "信息", "用户选中了男", QMessageBox::Ok);
        break;
    case 1:
        std::cout << "female" << std::endl;
        QMessageBox::information(nullptr, "信息", "用户选中了女", QMessageBox::Ok);
        break;
    case 2:
        std::cout << "unknown" << std::endl;
        QMessageBox::information(nullptr, "信息", "用户选中了未知", QMessageBox::Ok);
        break;
    }
}

```

当程序运行后，读者可自行选择不同的单选框，此时会弹出不同的提示信息，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401170316532-17119621976182.png)



当然如果读者不想使用`QButtonGroup`对单选框进行分组操作，同样可以实现判断选中状态，通过依次检查`isChecked()`单选框的状态即可实现，但是此类方式并不推荐使用。

```c
void MainWindow::on_pushButton_clicked()
{
    if(ui->radioButton_male->isChecked() == true)
    {
        std::cout << "选中男" << std::endl;
    }
    if(ui->radioButton_female->isChecked() == true)
    {
        std::cout << "选中女" << std::endl;
    }
    if(ui->radioButton_unknown->isChecked() == true)
    {
        std::cout << "选中未知" << std::endl;
    }
}

```

