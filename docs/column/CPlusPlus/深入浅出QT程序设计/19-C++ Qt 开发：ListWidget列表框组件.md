# C++ Qt 开发：ListWidget列表框组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`ListWidget`列表框组件的常用方法及灵活运用。

`QListWidget` 是 Qt 中的一个列表框组件，用于显示一列项目，并允许用户进行选择。每个项目可以包含一个图标和文本，可以使用 `QListWidgetItem` 类来表示。`ListWidget`组件与`TreeWidget`有些相似，区别在于`TreeWidget`可以实现嵌套以及多字段结构，而`ListWidget`则只能实现单字段结构，该组件常用于显示单条记录，例如只显示`IP`地址，用户名等数据。

以下是 `QListWidget` 类的一些常用方法，说明和概述：

| 方法                                                         | 描述                                                       |
| ------------------------------------------------------------ | ---------------------------------------------------------- |
| `addItem(QListWidgetItem *item)`                             | 向列表中添加一个项目。                                     |
| `addItems(const QStringList &labels)`                        | 向列表中添加多个项目。                                     |
| `count()`                                                    | 返回列表中的项目数量。                                     |
| `currentItem()`                                              | 返回当前选择的项目。                                       |
| `item(int row)`                                              | 返回给定行索引的项目。                                     |
| `itemAt(const QPoint &p)`                                    | 返回给定坐标处的项目。                                     |
| `takeItem(int row)`                                          | 从列表中删除并返回给定行索引的项目。                       |
| `clear()`                                                    | 删除列表中的所有项目。                                     |
| `clearSelection()`                                           | 取消选择所有项目。                                         |
| `removeItemWidget(QListWidgetItem *item)`                    | 从列表中删除一个项目并释放与之关联的任何小部件。           |
| `scrollToItem(QListWidgetItem *item, QAbstractItemView::ScrollHint hint = EnsureVisible)` | 滚动列表以确保给定项目可见。                               |
| `sortItems(Qt::SortOrder order = Qt::AscendingOrder)`        | 对列表中的项目进行排序。                                   |
| `itemClicked(QListWidgetItem *item)`                         | 项目被点击时发出的信号。                                   |
| `itemDoubleClicked(QListWidgetItem *item)`                   | 项目被双击时发出的信号。                                   |
| `setItemWidget(QListWidgetItem *item, QWidget *widget)`      | 在给定项目的位置设置小部件。                               |
| `setIconSize(const QSize &size)`                             | 设置项目图标的大小。                                       |
| `setCurrentRow(int row)`                                     | 设置当前选择的行。                                         |
| `setCurrentItem(QListWidgetItem *item)`                      | 设置当前选择的项目。                                       |
| `selectedItems()`                                            | 返回当前选择的所有项目。                                   |
| `selectedIndexes()`                                          | 返回当前选择的所有项目的模型索引。                         |
| `setSelectionMode(QAbstractItemView::SelectionMode mode)`    | 设置选择模式，例如 `SingleSelection` 或 `MultiSelection`。 |

显示详细信息

这只是 `QListWidget` 类的一部分方法。你可以查阅[官方文档](https://doc.qt.io/qt-5/qlistwidget.html)以获取完整的方法列表，以及这些方法的详细说明。

首先读者可自行绘制好如下所示的UI界面，在界面中左侧包含一个`ListWidget`列表框，右侧包含各类用于控制组件的`pushButton`按钮，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9f56aee8f317d296669df9a61ec86576%5B1%5D.png)

### 1.1 初始化节点

如下代码是一个槽函数 `on_pushButton_init_clicked`，主要作用是初始化一个 `QListWidget` 列表框，其中包含了一系列的 `QListWidgetItem` 项。

以下是概述：

1. **清空列表框：** 首先，通过 `ui->listWidget->clear()` 清空了列表框，以确保在初始化之前移除已有的项。
2. **循环初始化项：** 使用 `for` 循环，遍历了 0 到 9 的数字，共初始化了 10 个项。
3. **创建 `QListWidgetItem`：** 对于每个循环，通过 `new QListWidgetItem()` 创建了一个新的 `QListWidgetItem` 对象 `aItem`。
4. **设置文本标签：** 使用 `setText` 方法为 `QListWidgetItem` 设置了文本标签，内容是形如 “192.168.1.x” 的字符串。
5. **设置图标：** 使用 `setIcon` 方法为每个项设置了相同的图标，这里使用了名为 “1.ico” 的图标。
6. **设置为选中状态：** 使用 `setCheckState` 方法将每个项设为选中状态，即显示复选框并勾选。
7. **设置不可编辑状态：** 使用 `setFlags` 方法将每个项设置为不可编辑状态，只允许选择和检查操作。
8. **增加项到列表中：** 使用 `ui->listWidget->addItem(aItem)` 将每个项添加到 `QListWidget` 中。

该槽函数用于初始化一个包含特定图标、文本、复选框等属性的 `QListWidget`，方便用户进行选择和操作。

```c
// 初始化列表
void MainWindow::on_pushButton_init_clicked()
{
    // 每一行是一个QListWidgetItem
    QListWidgetItem *aItem;

    // 设置ICON的图标
    QIcon aIcon;
    aIcon.addFile(":/image/1.ico");

    // 清空列表框
    ui->listWidget->clear();

    // 循环初始化
    for(int x=0;x<10;x++)
    {
        // 填充字符串
        QString str = QString::asprintf("192.168.1.%d",x);

        // 新建一个项
        aItem = new QListWidgetItem();

        aItem->setText(str);                        // 设置文字标签
        aItem->setIcon(aIcon);                      // 设置图标
        aItem->setCheckState(Qt::Checked);          // 设为选中状态
        aItem->setFlags(Qt::ItemIsSelectable |      // 设置为不可编辑状态
                         Qt::ItemIsUserCheckable
                        |Qt::ItemIsEnabled);

        // 增加项到列表中
        ui->listWidget->addItem(aItem);
    }
}
```

运行效果如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5d5d0dfe1d5daa7814cc678060982499%5B1%5D.png)

### 1.2 设置编辑状态

如下槽函数 `on_pushButton_edit_clicked` 的主要功能是将所有项设置为可编辑状态。

以下是概述：

1. **获取所有项数量：** 使用 `ui->listWidget->count()` 获取列表框中的项的数量。
2. **循环设置状态：** 使用 `for` 循环遍历每个项，获取当前项的句柄。
3. **设置为可编辑状态：** 使用 `setFlags` 方法将每个项的状态设置为可编辑，包括可选择、可编辑、可检查、可启用等状态。

该槽函数的作用是将列表框中的所有项的状态设置为可编辑，这样用户可以在运行时修改这些项的文本内容。

```c
// 设置所有项设置为可编辑状态
void MainWindow::on_pushButton_edit_clicked()
{
    int x,cnt;
    QListWidgetItem *aItem;

    // 获取所有项数量
    cnt = ui->listWidget->count();
    for(x=0;x<cnt;x++)
    {
        // 得到当前选中项句柄
        aItem = ui->listWidget->item(x);

        // 设置状态
        aItem->setFlags(Qt::ItemIsSelectable | Qt::ItemIsEditable
                        |Qt::ItemIsUserCheckable |Qt::ItemIsEnabled);
    }
}
```

运行效果如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9f8ce94bfe0fbd180ab5f2a751f3f9a4%5B1%5D.png)

### 1.3 全选与反选

如下槽函数 `on_pushButton_selectall_clicked` 的核心功能是实现一个全选按钮，即将列表框中的所有项设置为选中状态。

以下是概述：

1. **获取总数：** 使用 `ui->listWidget->count()` 获取列表框中的项的总数。
2. **循环设置选中状态：** 使用 `for` 循环遍历每个项，获取每个项的指针。
3. **设置为选中状态：** 使用 `setCheckState` 方法将每个项的状态设置为选中状态，即勾选复选框。

该槽函数的作用是实现一个全选按钮，方便用户一次性选中所有列表框中的项。

```c
void MainWindow::on_pushButton_selectall_clicked()
{
    // 获取总数
    int cnt = ui->listWidget->count();
    for(int x=0;x<cnt;x++)
    {
        // 获取到项的指针
        QListWidgetItem *aItem = ui->listWidget->item(x);

        // 设置为选中
        aItem->setCheckState(Qt::Checked);
    }

}
```

如下槽函数 `on_pushButton_noselect_clicked` 的核心功能是实现一个全不选按钮，即将列表框中的所有项设置为非选中状态。

以下是概述：

1. **获取总数：** 使用 `ui->listWidget->count()` 获取列表框中的项的总数。
2. **循环设置非选中状态：** 使用 `for` 循环遍历每个项，获取每个项的指针。
3. **设置为非选中状态：** 使用 `setCheckState` 方法将每个项的状态设置为非选中状态，即取消勾选复选框。

该槽函数的作用是实现一个全不选按钮，方便用户一次性取消选中列表框中的所有项。

```c
void MainWindow::on_pushButton_noselect_clicked()
{
    // 获取总数
    int cnt = ui->listWidget->count();
    for(int x=0;x<cnt;x++)
    {
        // 获取到一项指针
        QListWidgetItem *aItem = ui->listWidget->item(x);

        // 设置为非选中
        aItem->setCheckState(Qt::Unchecked);
    }
}
```

如下槽函数 `on_pushButton_deselect_clicked` 的核心功能是实现一个反选按钮，即将列表框中的每个项的选中状态进行反转。

以下是概述：

1. **获取总数：** 使用 `ui->listWidget->count()` 获取列表框中的项的总数。
2. **循环设置反选状态：** 使用 `for` 循环遍历每个项，获取每个项的指针。
3. **反选状态：** 使用 `checkState` 方法获取每个项的当前选中状态，如果是选中状态 (`Qt::Checked`)，则设置为非选中状态 (`Qt::Unchecked`)，反之亦然。

该槽函数的作用是实现一个反选按钮，方便用户一次性反转列表框中的所有项的选中状态。

```c
void MainWindow::on_pushButton_deselect_clicked()
{
    int x,cnt;
    QListWidgetItem *aItem;

    // 获取总数
    cnt = ui->listWidget->count();
    for(x=0;x<cnt;x++)
    {
        // 获取到一项指针
        aItem = ui->listWidget->item(x);

        // 如果未选中则选中否则不选
        if(aItem->checkState() != Qt::Checked)
            aItem->setCheckState(Qt::Checked);
        else
            aItem->setCheckState(Qt::Unchecked);
    }
}
```

运行效果如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c0564469a898cc77e30be42b16bdbcbf%5B1%5D.png)



### 1.4 插入与追加

如下槽函数 `on_pushButton_add_clicked` 的核心功能是实现一个“增加一项”按钮，即在列表框的尾部追加一个新的项。

以下是概述：

1. **创建图标：** 使用 `QIcon` 创建一个新的图标，这里使用了名为 “2.ico” 的图标。
2. **创建新的 `QListWidgetItem`：** 使用 `new QListWidgetItem("新增的项目")` 创建一个新的 `QListWidgetItem` 对象，设置了文本为 “新增的项目”。
3. **设置图标和状态：** 使用 `setIcon` 设置项的图标，`setCheckState` 设置项的选中状态为选中，`setFlags` 设置项的状态为可选择、可检查、可启用。
4. **追加到控件：** 使用 `ui->listWidget->addItem(aItem)` 将新创建的项追加到列表框的尾部。

该槽函数的作用是在列表框的尾部追加一个新的项，该项包含指定的文本、图标以及初始的选中状态。

```c
void MainWindow::on_pushButton_add_clicked()
{
    QIcon aIcon;
    aIcon.addFile(":/image/2.ico");

    QListWidgetItem *aItem = new QListWidgetItem("新增的项目");    // 增加项目名
    aItem->setIcon(aIcon);                                       // 设置图标
    aItem->setCheckState(Qt::Checked);                           // 设置为选中
    aItem->setFlags(Qt::ItemIsSelectable |Qt::ItemIsUserCheckable |Qt::ItemIsEnabled);
    ui->listWidget->addItem(aItem);                              // 增加到控件
}
```

如下槽函数 `on_pushButton_ins_clicked` 的核心功能是实现一个“指定位置插入一项”按钮，即在列表框的指定位置插入一个新的项。

以下是概述：

1. **创建图标：** 使用 `QIcon` 创建一个新的图标，这里使用了名为 “3.ico” 的图标。
2. **创建新的 `QListWidgetItem`：** 使用 `new QListWidgetItem("插入的数据")` 创建一个新的 `QListWidgetItem` 对象，设置了文本为 “插入的数据”。
3. **设置图标和状态：** 使用 `setIcon` 设置项的图标，`setCheckState` 设置项的选中状态为选中，`setFlags` 设置项的状态为可选择、可检查、可启用。
4. **在指定位置插入项：** 使用 `ui->listWidget->insertItem(ui->listWidget->currentRow(), aItem)` 在当前行的上方插入一个新项。

该槽函数的作用是在列表框的指定位置插入一个新的项，该项包含指定的文本、图标以及初始的选中状态。

```c
void MainWindow::on_pushButton_ins_clicked()
{
    QIcon aIcon;
    aIcon.addFile(":/image/3.ico");

    QListWidgetItem *aItem = new QListWidgetItem("插入的数据");
    aItem->setIcon(aIcon);
    aItem->setCheckState(Qt::Checked);
    aItem->setFlags(Qt::ItemIsSelectable |Qt::ItemIsUserCheckable |Qt::ItemIsEnabled);

    // 在当前行的上方插入一个项
    ui->listWidget->insertItem(ui->listWidget->currentRow(),aItem);
}
```

运行效果如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/320f60db2523919f1a40e5d5ed494ab3%5B1%5D.png)

### 1.5 删除列表一行

如下槽函数 `on_pushButton_delete_clicked` 的核心功能是实现一个“删除选中项”按钮，即删除列表框中当前选中的项。

以下是概述：

1. **获取当前行：** 使用 `ui->listWidget->currentRow()` 获取当前选中项的行索引。
2. **移除指定行的项：** 使用 `ui->listWidget->takeItem(row)` 移除指定行的项，该方法返回被移除的项的指针，但不释放空间。
3. **释放空间：** 使用 `delete aItem` 释放被移除项的空间，确保不发生内存泄漏。

该槽函数的作用是删除列表框中当前选中的项，同时释放相应的内存空间。

```c
void MainWindow::on_pushButton_delete_clicked()
{
    // 获取当前行
    int row = ui->listWidget->currentRow();

    // 移除指定行的项,但不delete
    QListWidgetItem *aItem = ui->listWidget->takeItem(row);

    // 释放空间
    delete aItem;
}
```

运行效果如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/dc5ed128af023c2070433c114e553a2c%5B1%5D.png)

### 1.6 绑定右键菜单

在之前的内容中我们展示了如何给`MainWindow`主窗体增加右键菜单，本节我们将给`ListWidget`增加右键菜单，当用户在`ListWidget`组件中的任意一个子项下右键，则让其弹出这个菜单，并根据选择提供不同的功能。

首先我们绘制两个`UI`界面，并通过`Tab`组件将其分离开，为了方便演示我们需要手动增加列表项内容，增加方法是在`ListWidget`上面右键并选中编辑项目按钮，此时就可以逐行向列表中录入数据集。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/ffa8aa9a15eaa1a8f852614c3db6e058%5B1%5D.png)



为了增加菜单，我们首先需要在程序全局增加`QAction`其中每一个`QAction`则代表一个菜单选项指针，由于我们计划增加三个菜单选项，则此处就保留三个全局菜单指针。

```c
#include <QMenuBar>
#include <QMenu>
#include <QToolBar>
#include <iostream>

// 全局下设置增加删除菜单
QAction *NewAction;
QAction *InsertAction;
QAction *DeleteAction;
```

首先以右键菜单演示为例，在`MainWindow`主函数中，首先通过创建顶部菜单并将其设置为隐藏属性，接着通过`Connect`将每一个子菜单与`Action`进行连接，代码如下所示；

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // ----------------------------------------------------
    // 绘制部分
    // ----------------------------------------------------

    // 使用 customContextMenuRequested 信号则需要设置
    ui->listWidget->setContextMenuPolicy(Qt::CustomContextMenu);

    // 隐藏菜单栏上的右击菜单
    this->setContextMenuPolicy(Qt::NoContextMenu);

    // 创建基础顶部菜单
    QMenuBar *bar = menuBar();
    this->setMenuBar(bar);
    QMenu * fileMenu = bar->addMenu("菜单1");

    // 隐藏顶部菜单栏
    bar->setVisible(false);

    // 添加子菜单
     NewAction = fileMenu->addAction("增加IP地址");
     InsertAction = fileMenu->addAction("插入IP地址");
     DeleteAction = fileMenu->addAction("删除IP地址");

    // 分别设置图标
    NewAction->setIcon(QIcon(":/image/1.ico"));
    InsertAction->setIcon(QIcon(":/image/2.ico"));
    DeleteAction->setIcon(QIcon(":/image/3.ico"));

    // ----------------------------------------------------
    // 绑定槽函数
    // ----------------------------------------------------
    connect(NewAction,&QAction::triggered,this,[=](){
        std::cout << "new action" << std::endl;
    });

    connect(InsertAction,&QAction::triggered,this,[=](){
        std::cout << "insert action" << std::endl;
    });

    // 以删除为例,演示如何删除选中行
    connect(DeleteAction,&QAction::triggered,this,[=](){
        int row = ui->listWidget->currentRow();
        QListWidgetItem *aItem = ui->listWidget->takeItem(row);
        delete aItem;
        std::cout << "delete action" << std::endl;
    });
}
```

接着，当`ListWidget`右键被点击时，则触发`on_listWidget_customContextMenuRequested`槽函数，在该槽函数内我们通过`new QMenu`新建菜单，并通过`addAction`属性将其插入到被点击位置上，其代码如下所示；

```c
// 当listWidget被右键点击时则触发
void MainWindow::on_listWidget_customContextMenuRequested(const QPoint &pos)
{
    std::cout << "x pos = "<< pos.x() << "y pos = " << pos.y() << std::endl;
    Q_UNUSED(pos);

    // 新建Menu菜单
    QMenu *ptr = new QMenu(this);

    // 添加Actions创建菜单项
    ptr->addAction(NewAction);
    ptr->addAction(InsertAction);
    // 添加一个分割线
    ptr->addSeparator();
    ptr->addAction(DeleteAction);

    // 在鼠标光标位置显示右键快捷菜单
    ptr->exec(QCursor::pos());

    // 手工创建的指针必须手工删除
    delete ptr;
}
```

运行后读者可自行在特定行上点击右键，此时则会弹出菜单栏，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/3ef2c1c35c159dd26a880a8ba2686c39%5B1%5D.png)





接着来看下图标组的设置与绑定右键菜单的实现方式，第二种方式的绑定与第一种一致，唯一的区别仅仅只是显示设置上的不同，如下是第二种方法的显示配置代码；

```c
// 第二个ListWidget_使用图标方式展示
ui->listWidget_ico->setViewMode(QListView::IconMode);

// 每一行是一个QListWidgetItem
QListWidgetItem *aItem;

// 设置ICON的图标
QIcon aIcon;
aIcon.addFile(":/image/1.ico");

ui->listWidget_ico->clear();
for(int x=0;x<10;x++)
{
    QString str = QString::asprintf("admin_%d",x);
    aItem = new QListWidgetItem();           // 新建一个项

    aItem->setText(str);                     // 设置文字标签
    aItem->setIcon(aIcon);                   // 设置图标
    //aItem->setCheckState(Qt::Checked);     // 设为选中状态
    aItem->setFlags(Qt::ItemIsSelectable |   // 设置为不可编辑状态
                     Qt::ItemIsUserCheckable
                    |Qt::ItemIsEnabled);

    ui->listWidget_ico->addItem(aItem);       // 增加项
}
```

使用时只需要按照相同的方式绑定菜单即可，运行效果如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/12a6782a5b516e6449eb9523af0c5af2%5B1%5D.png)