# C++ Qt开发：MdiArea多窗体组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`MdiArea`组件的常用方法及灵活运用。

QMdiArea（Multiple Document Interface Area）是Qt中用于创建多文档界面的组件。它提供了一种在单个窗口中管理多个文档的方式，每个文档通常是一个子窗口（`QMdiSubWindow`）。该组件主要用于设计多文档界面应用程序，具备有多种窗体展示风格，实现了在父窗体中内嵌多种子窗体的功能，使开发者能够轻松地创建支持多个文档的应用程序。

下面是一些常用的`QMdiArea`的方法，说明并概述成表格：

| 方法                                                         | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QMdiArea(QWidget *parent = nullptr)`                        | 构造函数，创建一个QMdiArea实例。                             |
| `addSubWindow(QWidget *widget, Qt::WindowFlags flags = Qt::WindowFlags())` | 将指定的QWidget添加为QMdiArea的子窗口。                      |
| `cascadeSubWindows()`                                        | 将所有子窗口进行层叠排列。                                   |
| `tileSubWindows()`                                           | 平铺排列所有子窗口。                                         |
| `closeAllSubWindows()`                                       | 关闭所有子窗口。                                             |
| `setBackground(const QBrush &background)`                    | 设置QMdiArea的背景色或背景图片。                             |
| `setViewMode(QMdiArea::ViewMode mode)`                       | 设置子窗口排列模式，例如`QMdiArea::SubWindowView`或`QMdiArea::TabbedView`。 |
| `setTabsClosable(bool closable)`                             | 设置子窗口标签是否可关闭。                                   |
| `setTabsMovable(bool movable)`                               | 设置子窗口标签是否可移动。                                   |
| `setTabShape(QTabWidget::TabShape shape)`                    | 设置子窗口标签的形状，例如`QTabWidget::Rounded`或`QTabWidget::Triangular`。 |
| `setDocumentMode(bool enabled)`                              | 设置是否以文档模式显示子窗口标签。                           |
| `setTabPosition(QTabWidget::TabPosition position)`           | 设置子窗口标签的位置，例如`QTabWidget::North`或`QTabWidget::South`。 |
| `setActivationOrder(QMdiArea::ActivationOrder order)`        | 设置子窗口的激活顺序，例如`QMdiArea::StackingOrder`或`QMdiArea::CreationOrder`。 |
| `setTabbedView(bool tabbed)`                                 | 将QMdiArea设置为标签视图，即子窗口以标签页的形式显示。       |
| `setOption(QMdiArea::AreaOption option, bool on = true)`     | 设置QMdiArea的选项，例如`QMdiArea::DontMaximizeSubWindowOnActivation`。 |
| `activeSubWindow()`                                          | 返回当前激活的子窗口，如果没有激活的子窗口则返回nullptr。    |
| `closeActiveSubWindow()`                                     | 关闭当前激活的子窗口。                                       |

显示详细信息

这只是一些常用方法的概述，实际上`QMdiArea`提供了更多的方法和选项，以满足不同应用场景的需求。开发者可以根据具体需求查阅官方文档获取更详细的信息。

读者在使用`MDI`组件时，需要在`UI`界面中增加`mdiArea`控件容器，之后所有窗体创建与操作都要在容器内进行，其次由于`MDI`窗体组件仅仅是一个画布只具备限制窗口的作用，无法实现生成窗体，所以需要在项目中手动增加自定义`Dialog`对话框，并对该对话框进行一定的定制，首先绘制如下案例，其顶部是一个`QToolBar`组件，底部则是一个`QMidArea`组件，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/59902ec3f30cac01b3e3a5ee1cdda8ec%5B1%5D.png)



接着我们需要以此对上述菜单绑定一个唯一的名称及文本，这个过程可以通过代码实现，也可以通过图形化配置，如下图我们直接通过图形化模式增加其功能；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/8512ad98d327cb739ea6139c901e6b5c%5B1%5D.png)



### 1.1 初始化控件

如下代码，使用`QMdiArea`创建多文档界面的`MainWindow`类的构造函数和析构函数。

下面是一些关键点的概述：

1. `QMdiArea`设置为中央窗口：
   - `this->setCentralWidget(ui->mdiArea);` 将`QMdiArea`设置为主窗口的中央窗口，表示主要的工作区域将由`QMdiArea`管理。
2. 主窗口最大化显示（注释部分）：
   - `this->setWindowState(Qt::WindowMaximized);` 这是一行注释掉的代码，表示将主窗口设置为最大化显示。你可以根据需要取消注释，以便在启动应用程序时窗口最大化。
3. 工具栏设置：
   - `ui->mainToolBar->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);` 设置工具栏按钮的显示风格为图标下方显示文本。这种设置在工具栏上同时显示图标和文本，提供了更直观的用户界面。
4. 子窗口模式设置：
   - `ui->mdiArea->setViewMode(QMdiArea::SubWindowView);` 将`QMdiArea`的视图模式设置为子窗口模式。在子窗口模式下，`QMdiArea`管理并显示各个子窗口，允许用户同时查看和编辑多个文档。
5. 析构函数：
   - 析构函数中执行了 `delete ui;`，确保在对象销毁时释放与`ui`相关的资源，避免内存泄漏。

这段代码片段展示了一个使用`QMdiArea`创建多文档界面的主窗口类的基本结构和初始化设置。在这个窗口中，用户可以打开和管理多个子窗口，每个子窗口可以包含一个独立的文档。

```c
MainWindow::MainWindow(QWidget *parent) :QMainWindow(parent),ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    this->setCentralWidget(ui->mdiArea);

    // 窗口最大化显示
    // this->setWindowState(Qt::WindowMaximized);
    ui->mainToolBar->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

    // 子窗口模式
    ui->mdiArea->setViewMode(QMdiArea::SubWindowView);
}

MainWindow::~MainWindow()
{
    delete ui;
}
```

程序打开后可以看到如下图所示的界面；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/e035fc091bc6f74af5e0de6ea1055422%5B1%5D.png)

### 1.2 新建与关闭窗体

新建窗体时只需要调用`new Dialog`创建新的窗体，并通过`addSubWindow()`将新的窗体指针加入到组件内即可，当关闭时可以直接通过调用`closeAllSubWindows()`来实现，如下代码则是创建与关闭的实现。

```c
// 新建窗体
void MainWindow::on_actionOpen_triggered()
{
    // 创建Dialog窗体
    Dialog *formDoc = new Dialog(this);

    // 文档窗口添加到MDI
    ui->mdiArea->addSubWindow(formDoc);

    // 在单独的窗口中显示
    formDoc->show();
}

// 关闭全部
void MainWindow::on_actionClose_triggered()
{
    // 关闭所有子窗口
    ui->mdiArea->closeAllSubWindows();
}
```

运行后可以点击打开窗体创建，这个创建是无限制的，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c955ee80a5530550b9a3c850206fb808%5B1%5D.png)

### 1.3 转换窗体模式

针对模式的转换此处提供了三种模式，分别是`MDI`模式、`级联`模式及`平铺`模式，三种模式的实现只需要调用不同的接口即可实现，代码如下所示；

```c
// 转为MDI模式
void MainWindow::on_actionMID_triggered(bool checked)
{
    // Tab多页显示模式
    if (checked)
    {
        // Tab多页显示模式
        ui->mdiArea->setViewMode(QMdiArea::TabbedView);
        // 页面可关闭
        ui->mdiArea->setTabsClosable(true);
        ui->actionLine->setEnabled(false);
        ui->actionTile->setEnabled(false);
    }
    // 子窗口模式
    else
    {
        // 子窗口模式
        ui->mdiArea->setViewMode(QMdiArea::SubWindowView);
        ui->actionLine->setEnabled(true);
        ui->actionTile->setEnabled(true);
    }
}

// 恢复默认模式
void MainWindow::on_actionWindow_triggered()
{
    ui->mdiArea->setViewMode(QMdiArea::SubWindowView);
    ui->actionLine->setEnabled(true);
    ui->actionMID->setEnabled(true);
    ui->actionTile->setEnabled(true);
}

// 级联模式
void MainWindow::on_actionLine_triggered()
{
    ui->mdiArea->cascadeSubWindows();
}

// 平铺模式
void MainWindow::on_actionTile_triggered()
{
    ui->mdiArea->tileSubWindows();
}
```

**子窗口模式（QMdiArea::SubWindowView）**

- 这是多文档界面的默认模式，允许用户在主窗口内同时打开多个子窗口，每个子窗口可以包含一个独立的文档或视图。
- 子窗口可以重叠、平铺、级联等方式排列。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/25428132c477565940d2024035bf569b%5B1%5D.png)



**标签页多页显示模式（QMdiArea::TabbedView）**

- 在这种模式下，子窗口以标签页的形式显示在主窗口的顶部，用户可以通过点击标签页来切换不同的子窗口。
- 提供了标签页的关闭按钮，允许用户关闭特定的标签页。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/45d5ebe3bcfa15811d6f8556919b0426%5B1%5D.png)



**级联模式和平铺模式**

- 这两种模式是在标签页多页显示模式下的两种特定排列方式。
- **级联模式（Cascade）：** 子窗口以重叠的方式显示，类似级联排列的效果，方便用户查看和操作每个子窗口。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/4947ab6bfe72c50d9c6fac9ce2b1ca34%5B1%5D.png)





- **平铺模式（Tile）：** 子窗口以平铺的方式显示，使它们在主窗口中均匀分布，方便用户同时浏览多个子窗口内容。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/d801190dcc945830c76dc8dc2b766c76%5B1%5D.png)



这些模式提供了不同的用户体验，使用户能够根据实际需求选择最适合他们工作流程的窗口排列方式。用户可以根据应用程序的性质和自己的使用偏好在这些模式之间切换。