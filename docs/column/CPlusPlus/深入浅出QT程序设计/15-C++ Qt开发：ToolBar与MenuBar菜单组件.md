# C++ Qt开发：ToolBar与MenuBar菜单组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`ToolBar`工具栏组件以及与之类似的`MenuBar`菜单栏组件的常用方法及灵活运用。

#### 1.1 QToolBar 工具栏

`QToolBar` 是 Qt 中用于创建工具栏的组件，它为用户提供了一个方便的方式来组织和访问应用程序中的各种工具和操作。工具栏通常用于快速访问常用的功能，提高用户体验。

##### 1.1.1 主要特点

1. **工具按钮：** `QToolBar` 主要由工具按钮组成，每个工具按钮代表一个功能或操作。工具按钮可以包含文本、图标，也可以与相应的槽函数关联，实现用户点击按钮时触发相应的操作。
2. **分组和弹出菜单：** 工具栏支持将工具按钮分组，使界面更加清晰。还可以为工具按钮添加弹出菜单，以提供额外的选项。
3. **可调整性：** 用户可以在工具栏上自由拖动工具按钮，重新排列它们的位置。这增加了用户定制界面的灵活性。
4. **自定义小部件：** 除了工具按钮，工具栏还支持添加自定义的小部件，例如搜索框、进度条等，以满足特定需求。
5. **样式和布局：** 可以通过设置样式和布局来定制工具栏的外观，包括工具按钮的样式、大小和排列方式。

以下是 `QToolBar` 类的一些常用方法的说明和概述，以表格形式列出：

| **方法**                                        | **描述**                                                     |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `QToolBar(QWidget *parent = nullptr)`           | 构造函数，创建一个 `QToolBar` 对象。                         |
| `addAction(QAction *action)`                    | 向工具栏中添加一个动作。                                     |
| `addWidget(QWidget *widget)`                    | 向工具栏中添加一个小部件。                                   |
| `addSeparator()`                                | 向工具栏中添加一个分隔符。                                   |
| `clear()`                                       | 清除工具栏上的所有动作和小部件。                             |
| `setOrientation(Qt::Orientation orientation)`   | 设置工具栏的方向，可以是水平 (`Qt::Horizontal`) 或垂直 (`Qt::Vertical`)。 |
| `setMovable(bool movable)`                      | 设置工具栏是否可以被用户移动。                               |
| `setIconSize(const QSize &size)`                | 设置工具栏中动作的图标大小。                                 |
| `setToolButtonStyle(Qt::ToolButtonStyle style)` | 设置工具按钮的样式，可以是文本和图标一起显示、只显示图标、只显示文本等。 |
| `toggleViewAction()`                            | 返回一个切换工具栏可见性的动作。                             |
| `addWidget(QWidget *widget)`                    | 在工具栏中添加一个自定义小部件。                             |
| `clear()`                                       | 清除工具栏上的所有动作和小部件。                             |
| `setAllowedAreas(Qt::ToolBarAreas areas)`       | 设置工具栏允许停靠的区域，可以是上、下、左、右、所有区域的组合。 |
| `setFloatable(bool floatable)`                  | 设置工具栏是否可以浮动。                                     |
| `setWindowTitle(const QString &title)`          | 设置工具栏的标题。                                           |
| `addWidget(QWidget *widget)`                    | 在工具栏中添加一个自定义小部件。                             |
| `widgetForAction(QAction *action) const`        | 返回与给定动作相关联的小部件。                               |

显示详细信息

这些方法提供了对 `QToolBar` 进行动作、小部件和外观等方面的控制，使其适应不同的应用场景。你可以根据具体需求使用这些方法，定制工具栏的外观和行为。

#### 1.2 QMenuBar 菜单栏

`QMenuBar` 是 Qt 中用于创建菜单栏的组件，它提供了一种方便的方式来组织和管理应用程序的菜单。菜单栏通常用于将应用程序的功能划分为不同的菜单，使用户可以轻松访问各种操作。

##### 1.2.1 主要特点

1. **菜单项：** `QMenuBar` 主要由菜单项组成，每个菜单项代表一个功能或操作。菜单项可以包含子菜单，形成层级关系，用于更好地组织功能。
2. **快捷键：** 每个菜单项可以关联一个快捷键，用户可以通过键盘快捷键来触发相应的操作。
3. **分组和分割线：** 菜单栏支持在菜单项之间添加分组和分割线，用于更好地区分不同的功能模块。
4. **动作关联：** 菜单项通常与具体的动作（`QAction`）关联，点击菜单项时触发相应的动作。
5. **上下文菜单：** `QMenuBar` 也可以用作上下文菜单（右键菜单），在特定区域点击右键时显示相应的菜单项。

以下是 `QMenuBar` 类的一些常用方法的说明和概述，以表格形式列出：

| **方法**                                                     | **描述**                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QMenuBar(QWidget *parent = nullptr)`                        | 构造函数，创建一个 `QMenuBar` 对象。                         |
| `addMenu(const QString &title)`                              | 添加一个具有给定标题的菜单，并返回一个指向新菜单的指针。     |
| `addMenu(QMenu *menu)`                                       | 添加给定的菜单。                                             |
| `addSeparator()`                                             | 在菜单栏上添加一个分隔符。                                   |
| `addActions(QList<QAction*> actions)`                        | 添加给定的动作列表到菜单栏。                                 |
| `clear()`                                                    | 清除菜单栏上的所有菜单和分隔符。                             |
| `setNativeMenuBar(bool nativeMenuBar)`                       | 设置是否使用本地菜单栏，如果为 `true`，则菜单栏将使用本地系统的菜单栏实现。 |
| `setCornerWidget(QWidget *widget, Qt::Corner corner = Qt::TopLeftCorner)` | 在指定的角落放置一个小部件。                                 |
| `addMenu(QMenu *menu)`                                       | 添加给定的菜单。                                             |
| `setActiveAction(QAction *action)`                           | 设置活动动作，该动作将在菜单栏上显示为活动状态。             |
| `addMenu(const QString &title)`                              | 添加一个具有给定标题的菜单，并返回一个指向新菜单的指针。     |
| `setCornerWidget(QWidget *widget, Qt::Corner corner = Qt::TopLeftCorner)` | 在指定的角落放置一个小部件。                                 |
| `clear()`                                                    | 清除菜单栏上的所有菜单和分隔符。                             |
| `setNativeMenuBar(bool nativeMenuBar)`                       | 设置是否使用本地菜单栏，如果为 `true`，则菜单栏将使用本地系统的菜单栏实现。 |
| `setActiveAction(QAction *action)`                           | 设置活动动作，该动作将在菜单栏上显示为活动状态。             |
| `setCornerWidget(QWidget *widget, Qt::Corner corner = Qt::TopLeftCorner)` | 在指定的角落放置一个小部件。                                 |

显示详细信息

这些方法提供了对 `QMenuBar` 进行菜单管理、外观设置以及与其他小部件的交互等方面的控制。你可以根据具体需求使用这些方法，定制菜单栏的外观和行为。

#### 1.3 使用菜单组件

通常情况下`ToolBar`与`MenuBar`两者会配合使用，在`5.14.2`版本中，窗体创建后会默认包含一个`MenuBar`组件，对于老版本的`Qt`则会自带一个`ToolBar`组件，`ToolBar`工具栏组件与`MenuBar`菜单栏组件，在所有窗体应用程序中都广泛被使用，使用这两种组件可以很好的规范菜单功能分类，用户可根据菜单栏来选择不同的功能，实现灵活的用户交互。

顶部工具栏`ToolBar`组件的定义有多种方式，我们可以直接通过代码生成，也可以使用图形界面`UI`添加，当需要使用`UI`实现时，只需要在`MainWindow`中选择添加工具来新增，默认会在窗口顶部增加，如果想要在四面增加可以使用`Add Tool Bar to Other Area`选项实现；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/8b58b7466f94cdc3a26b64d5cc7a2938%5B1%5D.png)

##### 1.3.1 应用菜单组件

通常情况下我们不会使用`UI`的方式来使用工具栏，通过代码将很容易的实现创建，如下代码中我们通过属性`setAllowedAreas()`可以实现将`ToolBar`组件放置到上下左右四个不同的方位上，通过代码的方式实现一个顶部菜单栏，该菜单栏中可以通过`SetIcon(QIcon("://image/.ico"));`指定图标，也可以使用`setShortcut(Qt::CTRL | Qt::Key_C);`为其指定特殊的快捷键。

```c
#include <iostream>
#include <QMenuBar>
#include <QToolBar>
#include <QMessageBox>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // ----------------------------------------------------------
    // 创建菜单栏
    // ----------------------------------------------------------
    QMenuBar *bar = menuBar();
    this->setMenuBar(bar);                      // 将菜单栏放入主窗口
    QMenu * fileMenu = bar->addMenu("文件");     // 创建父节点

    // 添加子菜单
    QAction *newAction = fileMenu->addAction("新建文件");      // 设置名字
    newAction->setIcon(QIcon("://image/file.ico"));          // 设置可用图标
    newAction->setShortcut(Qt::CTRL | Qt::Key_A);            // 设置快捷键ctrl+a

    fileMenu->addSeparator();                                // 添加分割线
    QAction *openAction = fileMenu->addAction("打开文件");     // 设置名字
    openAction->setIcon(QIcon("://image/lock.ico"));         // 设置可用图标
    openAction->setShortcut(Qt::CTRL | Qt::Key_C);           // 设置快捷键ctrl+c

    // ----------------------------------------------------------
    //创建工具栏 (可屏蔽掉 屏蔽掉后底部将失去控件栏位)
    // ----------------------------------------------------------
    QToolBar *toolBar = new QToolBar(this);    // 创建工具栏
    addToolBar(Qt::BottomToolBarArea,toolBar); // 设置默认停靠范围 [默认停靠底部]

    toolBar->setAllowedAreas(Qt::TopToolBarArea |Qt::BottomToolBarArea);   // 允许上下拖动
    toolBar->setAllowedAreas(Qt::LeftToolBarArea |Qt::RightToolBarArea);   // 允许左右拖动

    toolBar->setFloatable(false);       // 设置是否浮动
    toolBar->setMovable(false);         // 设置工具栏不允许移动

    // 工具栏添加菜单项
    toolBar->addAction(newAction);
    toolBar->addSeparator();
    toolBar->addAction(openAction);

    // ----------------------------------------------------------
    // 绑定槽函数
    // ----------------------------------------------------------
    connect(newAction,&QAction::triggered,this,[=](){
        QMessageBox::information(nullptr,"提示","触发新建文件",QMessageBox::Ok);
    });

    connect(openAction,&QAction::triggered,this,[=](){
        QMessageBox::information(nullptr,"提示","触发打开文件",QMessageBox::Ok);
    });
}
```

由于通过`connect`绑定到了每一个`Action`上，所以当用户点击不同的菜单时将会触发不同的匿名槽函数，代码中实现了弹窗提示，此处也可以替换成任意代码，运行效果图如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/0ee6e0f534507f73f34cef3d9489a5d4%5B1%5D.png)



##### 1.3.2 二级菜单联动

如上所示的生成案例实现了单一菜单的生成，其实`QMenuBar`组件同样可实现二级菜单的联动，二级顶部菜单与一级菜单完全一致，只是在一级菜单的基础上进行了延申，当然只要遵循菜单的嵌套规则理论上我们可以无限延伸下去，当然为了开发代码逻辑清晰，笔者并不建议菜单层级超过三级。

```c
#include <iostream>
#include <QMenuBar>
#include <QToolBar>
#include <QMessageBox>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // ----------------------------------------------------------
    // 多层菜单导航栏
    // ----------------------------------------------------------
    QMenuBar *MainMenu = new QMenuBar(this);
    this->setMenuBar(MainMenu);

    // 1.定义父级菜单
    QMenu *EditMenu = MainMenu->addMenu("文件编辑");

    // 1.1 定义 EditMemu 下面的子菜单
    QAction *text = new QAction(EditMenu);
    text->setText("编辑文件");                     // 设置文本内容
    text->setShortcut(Qt::CTRL | Qt::Key_A);      // 设置快捷键ctrl+a
    text->setIcon(QIcon(":/image/about.ico"));    // 增加图标
    EditMenu->addAction(text);

    // 在配置模式与编辑文件之间增加虚线
    EditMenu->addSeparator();

    QAction *option = new QAction(EditMenu);
    option->setText("配置模式");
    option->setIcon(QIcon(":/image/file.ico"));
    EditMenu->addAction(option);

    // 1.1.2 定义Option配置模式下的子菜单
    QMenu *childMenu = new QMenu();
    QAction *set_file = new QAction(childMenu);
    set_file->setText("设置文件内容");
    set_file->setIcon(QIcon(":/image/lock.ico"));
    set_file->setShortcut(Qt::CTRL | Qt::Key_B);

    childMenu->addAction(set_file);

    QAction *read_file = new QAction(childMenu);
    read_file->setText("读取文件内容");
    read_file->setIcon(QIcon(":/image/about.ico"));
    childMenu->addAction(read_file);
    read_file->setShortcut(Qt::CTRL | Qt::Key_C);

    // ----------------------------------------------------------
    // 注册菜单到窗体中
    // ----------------------------------------------------------
    // 首先将childMenu注册到option中
    option->setMenu(childMenu);
    // 然后再将childMenu加入到EditMenu中
    EditMenu->addMenu(childMenu);

    // ----------------------------------------------------------
    // 绑定信号和槽
    // ----------------------------------------------------------
    connect(text,&QAction::triggered,this,[=](){
       QMessageBox::information(nullptr,"提示","触发编辑文件",QMessageBox::Ok);
    });

    connect(set_file,&QAction::triggered,this,[=](){
       QMessageBox::information(nullptr,"提示","触发设置文件",QMessageBox::Ok);
    });

    connect(read_file,&QAction::triggered,this,[=](){
      QMessageBox::information(nullptr,"提示","触发读取文件",QMessageBox::Ok);
    });
}
```

代码运行后读者可看到如下图所示的效果，在配置模式中增加了两个子菜单，每个子菜单分别绑定到了一个槽函数上，而其父菜单仅仅只是展示功能此处可以不增加任何实质性的功能。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/8f6457ae94b99b94ba10986c7a2f91f2%5B1%5D.png)

##### 1.3.3 增加右键菜单

Qt中的菜单还可以实现任意位置的弹出，该功能的实现依赖于`QMainWindow`主窗体中的`customContextMenuRequested()`事件，该事件是`Qt`中的一个信号，通常与右键菜单（上下文菜单）相关。该信号在用户请求上下文菜单时触发，例如通过右键单击某个小部件（如窗口、按钮、表格等）时。

我们可以将右击`customContextMenuRequested()`事件绑定到主窗口中，实现在窗体任意位置右击都可以弹出菜单栏，读者可以直接在主界面中点击右键转到槽，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/02a3cc6e4f3aa33ef51e5b94f0c5a413%5B1%5D.png)

当读者点击主窗体中的右键时则会触发`on_MainWindow_customContextMenuRequested`事件，该事件的内部则实现了创建菜单的功能，并通过`pMenu->exec(QCursor::pos())`的方式显示在鼠标点击位置处，其代码如下所示；

```c
#include <iostream>
#include <QMenuBar>
#include <QToolBar>
#include <QCursor>
#include <QMessageBox>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 设置小部件（QWidget）的上下文菜单策略
    this->setContextMenuPolicy(Qt::CustomContextMenu);
}

MainWindow::~MainWindow()
{
    delete ui;
}

// 触发右键创建菜单
void MainWindow::on_MainWindow_customContextMenuRequested(const QPoint &pos)
{

    // 创建菜单对象
    QMenu *pMenu = new QMenu(this);

    QAction *pNewTask = new QAction(tr("新建菜单"), this);
    QAction *pEditTask = new QAction(tr("编辑菜单"), this);
    QAction *pDeleteTask = new QAction(tr("删除菜单"), this);

    // 设置属性值编号: 1=>新建 2=>设置 3=>删除
    pNewTask->setData(1);
    pEditTask->setData(2);
    pDeleteTask ->setData(3);

    // 把QAction对象添加到菜单上
    pMenu->addAction(pNewTask);
    pMenu->addAction(pEditTask);
    pMenu->addAction(pDeleteTask);

    // 增加图标
    pNewTask->setIcon(QIcon(":/image/about.ico"));
    pEditTask->setIcon(QIcon(":/image/file.ico"));
    pDeleteTask->setIcon(QIcon(":/image/lock.ico"));

    // 连接鼠标右键点击信号
    connect(pNewTask, SIGNAL(triggered()), this, SLOT(onTaskBoxContextMenuEvent()));
    connect(pEditTask, SIGNAL(triggered()), this, SLOT(onTaskBoxContextMenuEvent()));
    connect(pDeleteTask, SIGNAL(triggered()), SLOT(onTaskBoxContextMenuEvent()));

    // 在鼠标右键点击的地方显示菜单
    pMenu->exec(QCursor::pos());

    //释放内存
    QList<QAction*> list = pMenu->actions();
    foreach (QAction* pAction, list) delete pAction;
    delete pMenu;
}
```

接着就需要绑定到特定的槽函数上，用于接收用户点击的菜单选项，并根据选项做出相应的判断，这里我们定义一个`onTaskBoxContextMenuEvent`函数，并在`MainWindow.h`头文件进行声明，其实现部分如下所示；

```c
// 处理发送过来的信号
void MainWindow::onTaskBoxContextMenuEvent()
{
    // this->sender()就是信号发送者 QAction
    QAction *pEven = qobject_cast<QAction *>(this->sender());

    // 获取编号: 1=>新建 2=>设置 3=>删除
    int iType = pEven->data().toInt();

    switch (iType)
    {
    case 1:
        QMessageBox::information(nullptr,"提示","触发新建任务",QMessageBox::Ok);
        break;
    case 2:
        QMessageBox::information(nullptr,"提示","触发设置任务",QMessageBox::Ok);
        break;
    case 3:
        QMessageBox::information(nullptr,"提示","触发删除任务",QMessageBox::Ok);
        break;
    default:
        break;
    }
}
```

至此当我们再次使用右键点击主页面时，则会弹出一个个性化菜单栏，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6ad72128fcc6aaabe8aff3a7859a45ba%5B1%5D.png)



##### 1.3.4 增加顶部通栏

通常情况下我们需要顶部按钮的排布，这有助于增加页面的图形化显示效果，为了让页面只保留一个`ToolBar`组件，通常情况下会将默认的`menuBar`组件进行隐藏，隐藏的方式是通过调用`setVisible(false)`来实现，对外只展示出一个`ToolBar`控件栏位，而在ToolBar控件栏中只保留`ICO`图标与底部文字描述，这样能显得更加清爽一些。

```c
#include <iostream>
#include <QMenuBar>
#include <QToolBar>
#include <QCursor>
#include <QMessageBox>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 隐藏菜单栏上的右击菜单
    this->setContextMenuPolicy(Qt::NoContextMenu);

    // ----------------------------------------------------------
    // 创建menuBar组件
    // ----------------------------------------------------------
    // 创建基础顶部菜单并让其隐藏
    QMenuBar *bar = menuBar();
    this->setMenuBar(bar);
    QMenu * fileMenu = bar->addMenu("Ptr");

    // 隐藏菜单
    bar->setVisible(false);

    // 添加子菜单
    QAction *NewAction = fileMenu->addAction("新建文件");
    QAction *OpenAction = fileMenu->addAction("打开文件");
    QAction *ReadAction = fileMenu->addAction("读入文件");

    // 分别设置图标
    NewAction->setIcon(QIcon(":/image/about.ico"));
    OpenAction->setIcon(QIcon(":/image/file.ico"));
    ReadAction->setIcon(QIcon(":/image/lock.ico"));

    // 创建工具栏
    QToolBar *toolBar = new QToolBar(this);
    addToolBar(Qt::TopToolBarArea,toolBar);

    // 将菜单项依次添加到工具栏
    toolBar->addAction(NewAction);
    toolBar->addAction(OpenAction);
    toolBar->addAction(ReadAction);

    // 设置禁止移动属性,工具栏默认贴在上方
    toolBar->setFloatable(false);
    toolBar->setMovable(false);
    toolBar->setToolButtonStyle(Qt::ToolButtonTextUnderIcon);

    // ----------------------------------------------------------
    // 绑定槽函数
    // ----------------------------------------------------------
    connect(NewAction,&QAction::triggered,this,[=](){
        QMessageBox::information(nullptr,"提示","触发新建文件按钮",QMessageBox::Ok);
    });

    connect(OpenAction,&QAction::triggered,this,[=](){
        QMessageBox::information(nullptr,"提示","触发打开文件按钮",QMessageBox::Ok);
    });

    connect(ReadAction,&QAction::triggered,this,[=](){
        QMessageBox::information(nullptr,"提示","触发读取文件按钮",QMessageBox::Ok);
    });
}
```

运行后读者可看到如下图所示的案例，我们只保留了最基本的按钮栏，这样看起来更加的清爽。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/91a90d16e1125979822940743a62497d%5B1%5D.png)