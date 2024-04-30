# C++ Qt开发：TabWidget实现多窗体功能

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`TabWidget`标签组件的常用方法及灵活运用。

`QTabWidget` 是Qt中用于实现标签页（tabbed interface）的控件，可以在一个窗口内切换不同的页面。在开发窗体应用时通常会伴随功能的分页，使用TabWidget并配合自定义Dialog组件，即可实现一个复杂的多窗体分页结构，此类布局方式也是多数软件通用的方案。

以下是 `QTabWidget` 的一些常用方法，以表格形式概述：

| 方法签名                                                     | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QTabWidget(QWidget *parent = nullptr)`                      | 构造函数，创建一个 `QTabWidget` 对象。                       |
| `int addTab(QWidget *page, const QString &label)`            | 添加一个标签页，参数 `page` 为标签页的内容，`label` 为标签页的标签文本。返回新添加标签页的索引。 |
| `void insertTab(int index, QWidget *page, const QString &label)` | 在指定索引位置插入一个标签页。                               |
| `void removeTab(int index)`                                  | 移除指定索引位置的标签页。                                   |
| `int currentIndex() const`                                   | 返回当前活动标签页的索引。                                   |
| `void setCurrentIndex(int index)`                            | 设置当前活动标签页的索引。                                   |
| `QWidget *currentWidget() const`                             | 返回当前活动标签页的内容窗口。                               |
| `int count() const`                                          | 返回标签页的总数。                                           |
| `QWidget *widget(int index) const`                           | 返回指定索引位置的标签页的内容窗口。                         |
| `QString tabText(int index) const`                           | 返回指定索引位置的标签页的标签文本。                         |
| `void setTabText(int index, const QString &text)`            | 设置指定索引位置的标签页的标签文本。                         |
| `QIcon tabIcon(int index) const`                             | 返回指定索引位置的标签页的图标。                             |
| `void setTabIcon(int index, const QIcon &icon)`              | 设置指定索引位置的标签页的图标。                             |
| `void clear()`                                               | 移除所有标签页。                                             |
| `void setMovable(bool movable)`                              | 设置标签页是否可移动。默认为可移动。                         |
| `void setTabEnabled(int index, bool enable)`                 | 设置指定索引位置的标签页是否可用。                           |
| `bool isTabEnabled(int index) const`                         | 返回指定索引位置的标签页是否可用。                           |
| `int indexOf(QWidget *page) const`                           | 返回指定内容窗口所在的标签页的索引。                         |
| `QWidget *widget(const QString &label) const`                | 返回具有指定标签文本的标签页的内容窗口。                     |

显示详细信息

这些方法可以帮助你在 `QTabWidget` 中动态地管理标签页，设置标签文本、图标，以及进行标签页的切换和管理。

### 1.1 重复窗体分页

重复窗体的使用广泛应用于标签页克隆，例如一些远程SSH工具每次打开标签都是一个重复的交互环境，唯一不同的只是`IP`地址的变化，对于这些重复打开的标签页面就可以使用此分页来解决。

首先实现如下窗体布局，布局中空白部分是一个`TabWidget`分页组件，下方是一个`PushButton`按钮，当用户点击按钮时，自动将`Dialog`窗体追加到`TabWidget`组件中，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6d935e60108163e659468a1b3975e372%5B1%5D.png)





首先读者需要新建一个名叫`FormDoc.ui`的标准对话框，并在`FormDoc`构造函数中对该窗体进行初始化，如下代码则是自定义 `FormDoc` 类的实现，该类继承自 `QWidget`。在构造函数中，创建了垂直布局管理器 `QVBoxLayout`，并设置了一些边距和间距。然后，通过 `setLayout` 将这个布局管理器应用到 `FormDoc` 类的对象上。

在构造函数中，通过 `parentWidget()` 获取了父窗口指针，并通过强制类型转换将其转为 `MainWindow*` 类型。接着，通过调用 `GetTableNumber()` 方法获取了选中标签的索引，然后将其输出到控制台。此处的`GetTableNumber()`是父类中的函数，主要用于返回当前`TabWidget`组件的下标。

```c
#include "formdoc.h"
#include "ui_formdoc.h"
#include "mainwindow.h"

#include <QVBoxLayout>
#include <iostream>

FormDoc::FormDoc(QWidget *parent) :QWidget(parent),ui(new Ui::FormDoc)
{
    ui->setupUi(this);

    QVBoxLayout *Layout = new QVBoxLayout();
    Layout->setContentsMargins(2,2,2,2);
    Layout->setSpacing(2);
    this->setLayout(Layout);

    // 获取父窗口指针
    MainWindow *parWind = (MainWindow*)parentWidget();

    // 获取选中标签索引
    QString ref = parWind->GetTableNumber();
    std::cout << ref.toStdString().data() << std::endl;
}

FormDoc::~FormDoc()
{
    delete ui;
}
```

接着来看下`MainWindow`主窗体中是如何实现创建窗体的，当用户点击`PushButton`按钮时，首先`new FormDoc`新建一个空的窗体，并通过 `addTab` 方法将 `FormDoc` 实例添加到 `QTabWidget` 中，设置了选项卡的显示文本为 `IP` 地址（`"192.168.1.x"`）以及对应的图标。然后，通过 `setCurrentIndex` 将新建的选项卡设置为当前选中，并通过 `setVisible(true)` 确保 `QTabWidget` 是可见的。

另外，该主窗口还实现了一个槽函数 `on_tabWidget_tabCloseRequested`，当某个选项卡被关闭时触发。在这个槽函数中，首先获取被关闭的选项卡对应的 `QWidget` 指针，然后调用 `close` 方法关闭选项卡。需要注意的是，如果在关闭选项卡时需要执行一些清理工作，可以在 `FormDoc` 类的析构函数中进行相应的处理。

```c
void MainWindow::on_pushButton_clicked()
{
    // 新建选项卡
    FormDoc *ptr = new FormDoc(this);

    // 关闭时自动销毁
    ptr->setAttribute(Qt::WA_DeleteOnClose);

    int cur = ui->tabWidget->addTab(ptr,QString::asprintf(" 192.168.1.%d",ui->tabWidget->count()));

    ui->tabWidget->setTabIcon(cur,QIcon(":/image/1.ico"));

    ui->tabWidget->setCurrentIndex(cur);
    ui->tabWidget->setVisible(true);
}

// 关闭Tab时执行
void MainWindow::on_tabWidget_tabCloseRequested(int index)
{
    if (index<0)
        return;
    QWidget* aForm=ui->tabWidget->widget(index);
    aForm->close();
}
```

程序运行后读者可以点击创建窗体按钮，每次点击都会创建一个独立的新窗体，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/3958c8c0da9d8707bc97b0f8037307cc%5B1%5D.png)

### 1.2 独立窗体分页

在`1.1`节中，笔者所介绍的方法仅用于重复功能页面的创建，而有时我们需要让不同的窗口展示不同的功能，此时就需要实现多窗体，通过`ToolBar`与`TabWidget`组件的配合可以很好的实现多窗体的应用，如下图通过`ToolBar`配置一个按钮组件并初始化图标。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5639c71ee75170886293be3a67a3fe08%5B1%5D.png)



接着对窗体中的菜单栏依次绑定一个名称，其中名称使用`action`开头，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5024eee76a3a840f614bd7e0a302a51d%5B1%5D.png)





接着我们分别创建三个与之对应的`Dialog`对话框，其中`actionMain`对应`formmain.ui`、`actionOption`对应到`formoption.ui`、`actionCharts`对应到`formcharts.ui`上面，当首页按钮被点击后，在`MainWindow`中执行如下操作，首先判断窗体是否打开了，如果打开了则不允许继续打开新的，而如果没有被打开，那么我们就新建一个窗口，并设置到`TabWidget`上面，其代码如下所示；

```c
// 首页菜单创建
void MainWindow::on_actionMain_triggered()
{
    int tab_count = ui->tabWidget->count();
    int option_count = 0;

    for(int x=0; x < tab_count; x++)
    {
        // 获取出每个菜单的标题
        QString tab_name = ui->tabWidget->tabText(x);

        if(tab_name == "首页菜单")
            option_count = option_count + 1;
    }

    if(option_count < 1)
    {
        FormMain *ptr = new FormMain(this);              // 新建选项卡
        ptr->setAttribute(Qt::WA_DeleteOnClose);         // 关闭时自动销毁

        int cur=ui->tabWidget->addTab(ptr,QString::asprintf("首页菜单"));
        ui->tabWidget->setTabIcon(cur,QIcon(":/image/1.ico"));

        ui->tabWidget->setCurrentIndex(cur);
        ui->tabWidget->setVisible(true);
    }
}
```

系统设置页面同理，这里我们规定系统设置页面也只能打开一个，其代码如下所示；

```c
// 创建系统设置菜单
void MainWindow::on_actionOption_triggered()
{
    int tab_count = ui->tabWidget->count();
    int option_count = 0;

    for(int x=0; x < tab_count; x++)
    {
        // 获取出每个菜单的标题
        QString tab_name = ui->tabWidget->tabText(x);

        if(tab_name == "系统设置")
            option_count = option_count + 1;
    }

    // 判断首页菜单是否只有一个,可判断标签个数来识别
    if(option_count < 1)
    {
        FormOption *ptr = new FormOption(this);
        ptr->setAttribute(Qt::WA_DeleteOnClose);

        int cur = ui->tabWidget->addTab(ptr,QString::asprintf("系统设置"));
        ui->tabWidget->setTabIcon(cur,QIcon(":/image/2.ico"));

        ui->tabWidget->setCurrentIndex(cur);
        ui->tabWidget->setVisible(true);
    }
}
```

最后一个是图形绘制按钮，该按钮我们让其可以弹出多个，此处就不再限制弹出数量，只要点击按钮就新建一个并追加到`TabWidget`中，代码如下所示；

```c
// 绘图页面的弹出
void MainWindow::on_actionCharts_triggered()
{
    FormCharts *ptr = new FormCharts(this);

    ptr->setAttribute(Qt::WA_DeleteOnClose);

    int cur = ui->tabWidget->addTab(ptr,QString::asprintf("图形绘制"));
    ui->tabWidget->setTabIcon(cur,QIcon(":/image/3.ico"));

    ui->tabWidget->setCurrentIndex(cur);
    ui->tabWidget->setVisible(true);
}
```

运行后读者可依次点击不同的按钮实现子窗体的创建，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/1ed3f34b5d2dc524aff284094f8ebe7b%5B1%5D.png)