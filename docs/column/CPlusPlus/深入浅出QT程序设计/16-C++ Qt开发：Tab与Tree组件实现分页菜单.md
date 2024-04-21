# C++ Qt开发：Tab与Tree组件实现分页菜单

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`tabWidget`选择夹组件与`TreeWidget`树形选择组件，的常用方法及灵活运用。

### 1.1 TabWidget

`QTabWidget` 是 Qt 中的一个用于显示多个页面的小部件，其中每个页面通常包含不同的内容。每个页面与一个标签相关联，用户可以通过点击标签来切换不同的页面。`QTabWidget` 是一个常见的用户界面元素，用于组织和展示具有层次结构的信息。

以下是关于 `QTabWidget` 的主要特点和用法：

#### 主要特点

1. **多页显示：** `QTabWidget` 允许在同一窗口中显示多个页面，每个页面由一个标签页表示。
2. **标签页：** 每个页面都有一个与之相关联的标签，通常是一个文本标签或包含图标的标签，用于显示页面的名称或标识。
3. **切换页面：** 用户可以通过点击标签页来切换显示不同的页面，使得只有一个页面处于可见状态。
4. **自定义标签页：** `QTabWidget` 允许通过添加小部件（如按钮、文本框等）作为标签页，以定制标签页的外观和功能。

以下是 `QTabWidget` 类的一些常用方法的说明和概述，以表格形式列出：

| **方法**                                                     | **描述**                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QTabWidget(QWidget *parent = nullptr)`                      | 构造函数，创建一个 `QTabWidget` 对象。                       |
| `addTab(QWidget *widget, const QString &label)`              | 向 `QTabWidget` 添加一个标签页，并关联一个小部件。           |
| `insertTab(int index, QWidget *widget, const QString &label)` | 在指定位置插入一个标签页，并关联一个小部件。                 |
| `removeTab(int index)`                                       | 移除指定位置的标签页。                                       |
| `clear()`                                                    | 移除所有的标签页。                                           |
| `setCurrentIndex(int index)`                                 | 设置当前显示的标签页的索引。                                 |
| `currentIndex()`                                             | 获取当前显示的标签页的索引。                                 |
| `count()`                                                    | 获取标签页的数量。                                           |
| `widget(int index)`                                          | 获取指定索引处的标签页关联的小部件。                         |
| `tabText(int index)`                                         | 获取指定索引处的标签页的文本。                               |
| `setTabText(int index, const QString &text)`                 | 设置指定索引处的标签页的文本。                               |
| `tabIcon(int index)`                                         | 获取指定索引处的标签页的图标。                               |
| `setTabIcon(int index, const QIcon &icon)`                   | 设置指定索引处的标签页的图标。                               |
| `tabBar()`                                                   | 返回 `QTabBar` 对象，允许对标签栏进行更高级的操作。          |
| `tabBar()->setTabButton(int index, QTabBar::ButtonPosition position, QWidget *widget)` | 在指定位置添加一个小部件按钮到标签页。                       |
| `setTabEnabled(int index, bool enable)`                      | 启用或禁用指定索引处的标签页。                               |
| `isTabEnabled(int index)`                                    | 检查指定索引处的标签页是否启用。                             |
| `setTabToolTip(int index, const QString &tip)`               | 设置指定索引处的标签页的工具提示。                           |
| `tabToolTip(int index)`                                      | 获取指定索引处的标签页的工具提示。                           |
| `setTabWhatsThis(int index, const QString &text)`            | 设置指定索引处的标签页的 What’s This 文本。                  |
| `tabWhatsThis(int index)`                                    | 获取指定索引处的标签页的 What’s This 文本。                  |
| `currentChanged(int index)`                                  | 当前标签页发生变化时发出的信号，连接到槽函数以执行相应的操作。 |
| `tabCloseRequested(int index)`                               | 用户请求关闭标签页时发出的信号，连接到槽函数以执行相应的操作。 |

显示详细信息

这些方法提供了对 `QTabWidget` 进行标签页管理、属性设置以及与标签页交互的控制。你可以根据具体需求使用这些方法，定制 `QTabWidget` 的外观和行为。

与其他通用组件不同，TabWidget 组件只能通过在页面中添加，当需要增加新的子菜单时，可以通过右键组件选中插入页，在当前之后插入，这里我们分别增加四个子夹，此处只需要增加不需要重命名。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/28c482a84e33409bc0488f5eaa544bc8%5B1%5D.png)

针对子夹的美化也很简单，只需要调用`setTab`系列函数即可，需要注意的是，调用这些函数其中第一个参数均为子选择夹的下标索引值，该索引值默认是从0开始计数的，完整代码如下所示；

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 全局配置tabWidget选项卡
    ui->tabWidget->setTabPosition(QTabWidget::North);       // 设置选项卡方位
    ui->tabWidget->setIconSize(QSize(50, 25));              // 设置图标整体大小
    ui->tabWidget->setTabShape(QTabWidget::Triangular);     // 设置选项卡形状
    ui->tabWidget->setMovable(true);                        // 设置选项卡是否可拖动
    ui->tabWidget->usesScrollButtons();                     // 选项卡滚动

    // 设置选项卡1
    ui->tabWidget->setTabText(0,QString("进制转换标签"));           // 设置选项卡文本
    ui->tabWidget->setTabIcon(0,QIcon(":/image/about.ico"));      // 设置选项卡图标
    ui->tabWidget->setTabToolTip(0,QString("SpinBox 与进制转换"));  // 设置鼠标悬停提示

    // 设置选项卡2
    ui->tabWidget->setTabText(1,QString("颜色配置标签"));          // 设置选项卡文本
    ui->tabWidget->setTabIcon(1,QIcon(":/image/file.ico"));      // 设置选项卡图标
    ui->tabWidget->setTabToolTip(1,QString("滑块条的使用"));       // 设置鼠标悬停提示

    // 设置选项卡3
    ui->tabWidget->setTabText(2,QString("系统配置标签"));          // 设置选项卡文本
    ui->tabWidget->setTabIcon(2,QIcon(":/image/lock.ico"));      // 设置选项卡图标
    ui->tabWidget->setTabToolTip(2,QString("圆形组件与数码表"));    // 设置鼠标悬停提示

    // 设置选项卡4
    ui->tabWidget->setTabText(3,QString("文件配置标签"));          // 设置选项卡文本
    ui->tabWidget->setTabIcon(3,QIcon(":/image/lock.ico"));      // 设置选项卡图标
    ui->tabWidget->setTabToolTip(3,QString("文件配置组合"));       // 设置鼠标悬停提示
}
```

该组件常用于分页操作，以让应用程序可以在一个页面中容纳更多的子页面，如下图我们分别创建了四个选择夹，并实现了分页展示的效果；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/a5f795f96c1d146273eea554604152fb%5B1%5D.png)



### 1.2 TreeWidget

`QTreeWidget` 是 Qt 中的一个用于显示树形结构的小部件。它允许用户通过展开和折叠树节点来查看和管理层次化的数据。每个节点可以包含子节点，形成一个树状结构。`QTreeWidget` 继承自 `QTreeWidget`，提供了更高级的树状结构显示功能。

以下是关于 `QTreeWidget` 的主要特点和用法：

#### 主要特点

1. **树形结构：** `QTreeWidget` 支持显示树形结构，每个节点可以包含子节点，形成一个层次化的树。
2. **列显示：** 可以在每个节点下显示多列数据，每列可以包含不同的信息，这使得 `QTreeWidget` 可以用于显示表格型数据。
3. **编辑节点：** 用户可以编辑节点的数据，允许动态修改树的内容。
4. **选择和操作：** 提供了丰富的选择和操作功能，用户可以通过键盘或鼠标进行节点的选择、展开和折叠等操作。
5. **信号与槽：** `QTreeWidget` 发送各种信号，如 `itemClicked`、`itemDoubleClicked` 等，以便在用户与树交互时执行相应的操作。

以下是 `QTreeWidget` 类的一些常用方法的说明和概述，以表格形式列出：

| **方法**                                                     | **描述**                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QTreeWidget(QWidget *parent = nullptr)`                     | 构造函数，创建一个 `QTreeWidget` 对象。                      |
| `addTopLevelItem(QTreeWidgetItem *item)`                     | 向树中添加一个顶级项。                                       |
| `insertTopLevelItem(int index, QTreeWidgetItem *item)`       | 在指定位置插入一个顶级项。                                   |
| `takeTopLevelItem(int index)`                                | 移除并返回指定位置的顶级项。                                 |
| `clear()`                                                    | 移除所有的项。                                               |
| `topLevelItemCount()`                                        | 获取顶级项的数量。                                           |
| `topLevelItem(int index)`                                    | 获取指定位置的顶级项。                                       |
| `invisibleRootItem()`                                        | 获取树的不可见根项。                                         |
| `setCurrentItem(QTreeWidgetItem *item)`                      | 设置当前项。                                                 |
| `currentItem()`                                              | 获取当前项。                                                 |
| `setItemWidget(QTreeWidgetItem *item, int column, QWidget *widget)` | 在指定项和列上设置一个小部件。                               |
| `itemWidget(QTreeWidgetItem *item, int column)`              | 获取指定项和列上的小部件。                                   |
| `editItem(QTreeWidgetItem *item, int column)`                | 编辑指定项和列的数据。                                       |
| `closePersistentEditor(QTreeWidgetItem *item, int column)`   | 关闭指定项和列上的持久编辑器。                               |
| `collapseItem(QTreeWidgetItem *item)`                        | 折叠指定项。                                                 |
| `expandItem(QTreeWidgetItem *item)`                          | 展开指定项。                                                 |
| `isItemExpanded(QTreeWidgetItem *item)`                      | 检查指定项是否展开。                                         |
| `setItemExpanded(QTreeWidgetItem *item, bool expand)`        | 设置指定项的展开状态。                                       |
| `scrollToItem(QTreeWidgetItem *item, QAbstractItemView::ScrollHint hint = EnsureVisible)` | 滚动视图以确保指定项可见。                                   |
| `setItemHidden(QTreeWidgetItem *item, bool hide)`            | 设置指定项的隐藏状态。                                       |
| `isItemHidden(QTreeWidgetItem *item)`                        | 检查指定项是否隐藏。                                         |
| `setItemDisabled(QTreeWidgetItem *item, bool disable)`       | 设置指定项的禁用状态。                                       |
| `isItemDisabled(QTreeWidgetItem *item)`                      | 检查指定项是否禁用。                                         |
| `setItemSelected(QTreeWidgetItem *item, bool select)`        | 设置指定项的选择状态。                                       |
| `isItemSelected(QTreeWidgetItem *item)`                      | 检查指定项是否被选择。                                       |
| `itemAt(const QPoint &p)`                                    | 返回在指定位置的项。                                         |
| `indexOfTopLevelItem(QTreeWidgetItem *item)`                 | 获取指定顶级项的索引。                                       |
| `clearSelection()`                                           | 清除所有选定的项。                                           |
| `sortItems(int column, Qt::SortOrder order = Qt::AscendingOrder)` | 根据指定列的数据对项进行排序。                               |
| `headerItem()`                                               | 获取树的标题项。                                             |
| `setHeaderItem(QTreeWidgetItem *item)`                       | 设置树的标题项。                                             |
| `header()`                                                   | 获取树的标题。                                               |
| `setHeaderLabel(const QString &label)`                       | 设置树的标题。                                               |
| `headerItem()`                                               | 获取树的标题项。                                             |
| `setHeaderItem(QTreeWidgetItem *item)`                       | 设置树的标题项。                                             |
| `header()`                                                   | 获取树的标题。                                               |
| `setHeaderLabel(const QString &label)`                       | 设置树的标题。                                               |
| `setSortingEnabled(bool enable)`                             | 启用或禁用树的排序功能。                                     |
| `isSortingEnabled()`                                         | 检查树的排序功能是否启用。                                   |
| `sortColumn()`                                               | 获取当前排序的列。                                           |
| `sortOrder()`                                                | 获取当前排序的顺序。                                         |
| `sortByColumn(int column, Qt::SortOrder order)`              | 根据指定列的数据对项进行排序。                               |
| `currentChanged(QTreeWidgetItem *current, QTreeWidgetItem *previous)` | 当前项发生变化时发出的信号，连接到槽函数以执行相应的操作。   |
| `itemClicked(QTreeWidgetItem *item, int column)`             | 项被点击时发出的信号，连接到槽函数以执行相应的操作。         |
| `itemDoubleClicked(QTreeWidgetItem *item, int column)`       | 项被双击时发出的信号，连接到槽函数以执行相应的操作。         |
| `itemPressed(QTreeWidgetItem *item, int column)`             | 项被按下时发出的信号，连接到槽函数以执行相应的操作。         |
| `itemActivated(QTreeWidgetItem *item, int column)`           | 项被激活时发出的信号，连接到槽函数以执行相应的操作。         |
| `itemCollapsed(QTreeWidgetItem *item)`                       | 项被折叠时发出的信号，连接到槽函数以执行相应的操作。         |
| `itemExpanded(QTreeWidgetItem *item)`                        | 项被展开时发出的信号，连接到槽函数以执行相应的操作。         |
| `itemChanged(QTreeWidgetItem *item, int column)`             | 项的数据发生变化时发出的信号，连接到槽函数以执行相应的操作。 |
| `itemSelectionChanged()`                                     | 选定项发生变化时发出的信号，连接到槽函数以执行相应的操作。   |

显示详细信息

这些方法提供了对 `QTreeWidget` 进行树节点管理、属性设置以及与树节点交互的控制。你可以根据具体需求使用这些方法，定制 `QTreeWidget` 的外观和行为。

虽然`TreeWidget`组件可以实现多节点的增删改查功能，但在一般的应用场景中基本上只使用一层结构即可解决大部分开发需求，`TreeWidget`组件通常可配合`TabWidget`组件实现类似于树形菜单栏的功能，当用户点击菜单栏中的选项时则会跳转到不同的页面上。

首先在Qt的`UI`编辑界面左侧加入`TreeWidget`组件，右侧加入`TabWidget`组件，将页面中的`TabWidget`组件增加指定页，整体页面布局如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/429fe5003035d289f09553f7d030ccfb%5B1%5D.png)





要实现对页面的美化只需要在代码中进行调整，在`MainWindow::MainWindow`主函数中我们对其中的两个组件进行初始化操作，并通过`setText`设置标签名，通过`setIcon`设置图标组，最后通过`expandAll`执行刷新到页面，其核心代码如下所示；

```c
#include <iostream>
#include <QStyleFactory>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    ui->treeWidget->clear();
    ui->treeWidget->setColumnCount(1);
    ui->treeWidget->setHeaderHidden(true);

    // 隐藏tabWidget头部
    ui->tabWidget->tabBar()->hide();

    // 为treeWidget增加线条
    ui->treeWidget->setStyle(QStyleFactory::create("windows"));

    // ----------------------------------------------------------
    // 创建 [系统设置] 父节点
    // ----------------------------------------------------------
    QTreeWidgetItem *system_setup = new QTreeWidgetItem(ui->treeWidget,QStringList(QString("系统位置")));
    system_setup->setFlags(Qt::ItemIsSelectable | Qt::ItemIsUserCheckable | Qt::ItemIsEnabled | Qt::ItemIsAutoTristate);
    system_setup->setIcon(0,QIcon(":/image/lock.ico"));

    // 给父节点添加子节点
    QTreeWidgetItem *system_setup_child_node_1 = new QTreeWidgetItem(system_setup);
    system_setup_child_node_1->setText(0,"修改密码");
    system_setup_child_node_1->setIcon(0,QIcon(":/image/about.ico"));

    QTreeWidgetItem *system_setup_child_node_2 = new QTreeWidgetItem(system_setup);
    system_setup_child_node_2->setText(0,"设置菜单");
    system_setup_child_node_2->setIcon(0,QIcon(":/image/about.ico"));

    // ----------------------------------------------------------
    // 创建 [页面布局] 父节点
    // ----------------------------------------------------------
    QTreeWidgetItem *page_layout = new QTreeWidgetItem(ui->treeWidget,QStringList(QString("页面布局")));
    page_layout->setFlags(Qt::ItemIsSelectable | Qt::ItemIsUserCheckable | Qt::ItemIsEnabled | Qt::ItemIsAutoTristate);
    page_layout->setIcon(0,QIcon(":/image/lock.ico"));

    QTreeWidgetItem *page_layout_clild_1 = new QTreeWidgetItem(page_layout);
    page_layout_clild_1->setText(0,"页面配置");
    page_layout_clild_1->setIcon(0,QIcon(":/image/about.ico"));

    QTreeWidgetItem *page_layout_clild_2 = new QTreeWidgetItem(page_layout);
    page_layout_clild_2->setText(0,"页面参数");
    page_layout_clild_2->setIcon(0,QIcon(":/image/about.ico"));

    ui->treeWidget->expandAll();
}
```

当上述代码运行后我们可以得到一个经过美化后的页面，但我们还需要将`TreeWidget`与`TabWidget`组件的页码进行绑定，当用户点击`TreeWidget`组件时我们可以通过`on_treeWidget_itemDoubleClicked`槽函数获取到点击的页，通过在`TreeWidget`组件上右键并转到槽，找到`itemDoubleClicked`被点击事件，当页面被点击时则触发跳转，代码如下所示；

```c
void MainWindow::on_treeWidget_itemDoubleClicked(QTreeWidgetItem *item, int column)
{
    QString str = item->text(column);

     if(str == "修改密码")
     {
         ui->tabWidget->setCurrentIndex(0);
     }
     if(str == "设置菜单")
     {
         ui->tabWidget->setCurrentIndex(1);
     }
     if(str == "页面配置")
     {
         ui->tabWidget->setCurrentIndex(2);
     }
     if(str == "页面参数")
     {
         ui->tabWidget->setCurrentIndex(3);
     }
}
```

运行这个程序，读者可自行切换测试效果，当需要功能分页时只需要分别开发不同页面并放入到特定的`TabWidget`组中即可，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/3595ac314c7589aa7988bf43cc137db4%5B1%5D.png)