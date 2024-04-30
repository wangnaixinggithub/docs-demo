# C++ Qt开发：StatusBar底部状态栏组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`QStatusBar`底部状态栏组件的常用方法及灵活运用。

`QStatusBar` 是 Qt 中用于在主窗口底部显示状态信息的部件。它通常用于向用户提供应用程序的当前状态、进度信息、或者其他与应用程序运行相关的消息。通过在状态栏上显示文本、永久部件、进度条等内容，可以为用户提供清晰的反馈和实时信息。在设计应用程序界面时，使用状态栏有助于提升用户体验。

下面是 `QStatusBar` 的一些常用方法，以表格形式概述它们的功能：

| 方法                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `addPermanentWidget(QWidget *widget, int stretch = 0)`       | 将一个永久部件添加到状态栏，并可以设置部件在状态栏中的拉伸因子。永久部件会一直显示在状态栏上。 |
| `addWidget(QWidget *widget, int stretch = 0, Qt::Alignment alignment = 0)` | 将一个部件添加到状态栏，并可以设置部件在状态栏中的拉伸因子和对齐方式。 |
| `removeWidget(QWidget *widget)`                              | 从状态栏中移除指定的部件。                                   |
| `addPermanentWidget(QWidget *widget, int stretch = 0)`       | 将一个永久部件添加到状态栏，并可以设置部件在状态栏中的拉伸因子。永久部件会一直显示在状态栏上。 |
| `removeWidget(QWidget *widget)`                              | 从状态栏中移除指定的部件。                                   |
| `clearMessage()`                                             | 清除状态栏上的当前消息。                                     |
| `clear()`                                                    | 移除状态栏上的所有部件和消息。                               |
| `insertPermanentWidget(int index, QWidget *widget, int stretch = 0)` | 在指定索引位置插入一个永久部件。永久部件会一直显示在状态栏上。 |
| `insertWidget(int index, QWidget *widget, int stretch = 0, Qt::Alignment alignment = 0)` | 在指定索引位置插入一个部件。                                 |
| `insertPermanentWidget(int index, QWidget *widget, int stretch = 0)` | 在指定索引位置插入一个永久部件。永久部件会一直显示在状态栏上。 |
| `showMessage(const QString &text, int timeout = 0)`          | 在状态栏上显示一条临时消息。可以指定显示的时间，如果设置为0，则消息会一直显示，直到下一条消息出现或者被清除。 |
| `currentMessage()`                                           | 返回状态栏上当前显示的消息。                                 |
| `messageChanged(const QString &message)`                     | 当状态栏上的消息改变时触发的信号。                           |

显示详细信息

这些方法提供了丰富的功能，允许你动态地管理状态栏上的部件和消息。通过调用这些方法，你可以在状态栏上添加、删除、插入部件，显示临时消息，清除消息等，以满足不同应用场景的需求。

### 1.1 QLabel组件显示

在默认情况下新建的窗体程序都会自带一个`StatusBar`组件，可在项目右侧的`Filter`处看到，该组件可以与其它任意的通用组件配合使用，首先我们先将一个`QLabel`标签组件安置在底部状态栏中，代码如下所示；

```c
#include <QLabel>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 初始化状态栏
    QLabel *labCellIndex = new QLabel("当前坐标: 0.0",this);
    labCellIndex->setMinimumWidth(150);

    QLabel *labCellType=new QLabel("单元格类型: null",this);
    labCellType->setMinimumWidth(100);

    QLabel *labStudID=new QLabel("学生ID: 0",this);
    labStudID->setMinimumWidth(100);

    // 将初始化的标签添加到底部状态栏上
    ui->statusbar->addWidget(labCellIndex);
    ui->statusbar->addWidget(labCellType);
    ui->statusbar->addWidget(labStudID);
}
```

运行后则可以将三个标签组件内嵌到窗体最底部，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/b11c7be74f20c6263e78543531635073%5B1%5D.png)



QLabel组件除了可以增加提示信息以外，通过设置`setOpenExternalLinks`可以将这个组件设置为以链接形式出现，有利于我们增加网页跳转等功能。

```c
#include <QLabel>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 隐藏状态栏下方三角形
    ui->statusbar->setSizeGripEnabled(false);

    // 新增标签栏
    QLabel *label_url = new QLabel(this);
    QLabel *label_about = new QLabel(this);

    // 配置连接
    label_url->setFrameStyle(QFrame::Box | QFrame::Sunken);
    label_url->setText(tr("<a href=\"https://www.lyshark.com\">访问主页</a>"));
    label_url->setOpenExternalLinks(true);

    label_about->setFrameStyle(QFrame::Box | QFrame::Sunken);
    label_about->setText(tr("<a href=\"https://www.lyshark.com\">关于我</a>"));
    label_about->setOpenExternalLinks(true);

    // 将信息增加到底部（永久添加）
    ui->statusbar->addPermanentWidget(label_url);
    ui->statusbar->addPermanentWidget(label_about);
}
```

上述代码运行后将会在窗体最右侧新建两个可以点击的超链接，并永久固定在窗体底部，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/841223efd0d2f6831dd5edce28a922c6%5B1%5D.png)

### 1.2 QProgressBar组件显示

进度条组件的使用方法与标签一样，同样需要通过`new`的方式动态生成，当配置好进度条属性后，只需要通过`addPermanentWidget`将其添加到底部菜单栏即可，代码如下所示；

```c
#include <QLabel>
#include <QProgressBar>

QProgressBar *pro;

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 隐藏状态栏下方三角形
    ui->statusbar->setSizeGripEnabled(false);

    pro = new QProgressBar(this);

    // 添加进度条
    ui->statusbar->addPermanentWidget(pro, 1);

    // 设置进度是否显示
    pro->setTextVisible(true);

    // 设置样式表，使用 width 控制宽度 height控制高度
    pro->setStyleSheet("QProgressBar { min-width: 400px; max-width: 10px; min-height: 10px; max-height: 10px; }");

    // 设置初始化进度位置
    pro->setValue(74);
}

MainWindow::~MainWindow()
{
    delete ui;
}

// 递增进度
void MainWindow::on_pushButton_add_clicked()
{
    qint32 count = pro->value();
    count = count +10;
    pro->setValue(count);
}

// 递减进度
void MainWindow::on_pushButton_sub_clicked()
{
    qint32 count = pro->value();
    count = count - 10;
    pro->setValue(count);
}
```

运行后效果如下图所示，当点击递增进度时子等增加10，点击递减进度是则自动减少10；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5e9dd570939d2490241f0d2716ef8edd%5B1%5D.png)



### 1.3 QtableWidget组件交互

接着我们来看一下如何与`TableWidget`实现交互，在`tableWidget`组件中存在一个`on_tableWidget_currentCellChanged`属性，该属性的作用是，只要表格存在变化则会触发，当用户选择不同的表格是，我们可以动态将当前表格行列自动设置到状态栏中，从而实现同步状态栏消息提示，起到时刻动态显示的作用。

首先对图形界面中的表格进行初始化，在`MainWindow`构造函数中使用如下代码完成初始化；

```c
#include <QLabel>
#include <QTableWidget>
#include <QTableWidgetItem>

QLabel *labCellIndex;

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // ----------------------------------------------------
    // 初始化状态栏
    // ----------------------------------------------------
    labCellIndex = new QLabel("当前坐标: 0.0",this);
    labCellIndex->setMinimumWidth(250);

    // 将初始化的标签添加到底部状态栏上
    ui->statusbar->addWidget(labCellIndex);

    // ----------------------------------------------------
    // 填充数据，对表格进行初始化操作
    // ----------------------------------------------------
    QStringList header;
    header << "姓名" << "性别" << "年龄";

    ui->tableWidget->setColumnCount(header.size());                        // 设置表格的列数
    ui->tableWidget->setHorizontalHeaderLabels(header);                    // 设置水平头
    ui->tableWidget->setRowCount(5);                                       // 设置总行数
    ui->tableWidget->setEditTriggers(QAbstractItemView::NoEditTriggers);   // 设置表结构默认不可编辑

    // ----------------------------------------------------
    // 填充数据
    // ----------------------------------------------------
    QStringList NameList;
    NameList << "张三" << "李四" << "王五";

    QStringList SexList;
    SexList << "男" << "男" << "女";

    qint32 AgeList[3] = {22,23,43};

    // 针对获取元素使用 NameList[x] 和使用 NameList.at(x)效果相同
    for(int x=0;x< 3;x++)
    {
        int col =0;
        // 添加姓名
        ui->tableWidget->setItem(x,col++,new QTableWidgetItem(NameList[x]));
        // 添加性别
        ui->tableWidget->setItem(x,col++,new QTableWidgetItem(SexList.at(x)));
        // 添加年龄
        ui->tableWidget->setItem(x,col++,new QTableWidgetItem( QString::number(AgeList[x]) ) );
    }
}
```

此时，当表格元素发生变化时，只需要通过`setText`属性将表格位置刷新到标签组件中即可实现，如下代码；

```c
void MainWindow::on_tableWidget_currentCellChanged(int currentRow, int currentColumn, int previousRow, int previousColumn)
{
    Q_UNUSED(previousRow);
    Q_UNUSED(previousColumn);

    // 显示行与列的变化数值
    std::cout << "currentRow = " << currentRow << " currentColumn = " << currentColumn << std::endl;
    std::cout << "pre Row = " << previousRow << " pre Column = " << previousColumn << std::endl;

    // 获取当前单元格的Item
    QTableWidgetItem *item = ui->tableWidget->item(currentRow,currentColumn);
    if(item == NULL)
    {
        return;
    }

    // 设置单元格坐标
    labCellIndex->setText(QString::asprintf("当前坐标: %d 行 | %d 列",currentRow,currentColumn));
}
```

运行后选择不同的行实现刷新，如下所示；

![](https://img-blog.csdnimg.cn/img_convert/aaa8d3fa3c2f04f5b57e7782a040600f.png)