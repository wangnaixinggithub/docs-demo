# C++ Qt开发：TreeWidget 树形选择组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`TreeWidget`树形选择组件的常用方法及灵活运用。

`QTreeWidget` 是 Qt 中的树形控件组件，用于显示树形结构的数据。它继承自 `QTreeView` 和 `QTreeWidget`，提供了一个方便的方式来展示和编辑包含层次结构数据的项目。

以下是 `QTreeWidget` 类的一些常用方法，说明和概述：

| 方法                                                         | 描述                                                 |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| `addTopLevelItem(QTreeWidgetItem *item)`                     | 向树中添加一个顶级项目。                             |
| `addTopLevelItems(const QList<QTreeWidgetItem *> &items)`    | 向树中添加多个顶级项目。                             |
| `clear()`                                                    | 清除树中的所有项目。                                 |
| `currentItem()`                                              | 返回当前选择的项目。                                 |
| `currentIndex()`                                             | 返回当前选择的项目的模型索引。                       |
| `editItem(QTreeWidgetItem *item, int column)`                | 进入编辑模式以编辑给定项目的指定列。                 |
| `headerItem()`                                               | 返回树的标题项目，该项目可用于设置标题标签。         |
| `invisibleRootItem()`                                        | 返回树的不可见根项目。                               |
| `itemAbove(QTreeWidgetItem *item)`                           | 返回给定项目的上面一个项目。                         |
| `itemBelow(QTreeWidgetItem *item)`                           | 返回给定项目的下面一个项目。                         |
| `setCurrentItem(QTreeWidgetItem *item)`                      | 设置当前选择的项目。                                 |
| `topLevelItem(int index)`                                    | 返回树中给定索引的顶级项目。                         |
| `topLevelItemCount()`                                        | 返回树的顶级项目的数量。                             |
| `insertTopLevelItem(int index, QTreeWidgetItem *item)`       | 在给定索引处插入一个顶级项目。                       |
| `insertTopLevelItems(int index, const QList<QTreeWidgetItem *> &items)` | 在给定索引处插入多个顶级项目。                       |
| `takeTopLevelItem(int index)`                                | 从树中移除给定索引处的顶级项目，并返回该项目的指针。 |
| `scrollToItem(QTreeWidgetItem *item, QAbstractItemView::ScrollHint hint = EnsureVisible)` | 滚动树以确保给定项目可见。                           |
| `sortItems(int column, Qt::SortOrder order = Qt::AscendingOrder)` | 对树中的项目进行排序。                               |
| `findItems(const QString &text, Qt::MatchFlags flags, int column = 0)` | 查找树中包含指定文本的项目。                         |

显示详细信息

这只是 `QTreeWidget` 类的一小部分方法。你可以查阅[官方文档](https://doc.qt.io/qt-5/qtreewidget.html)以获取完整的方法列表，以及这些方法的详细说明。

首先我们来绘制一下`UI`界面，由于该节点同时具备编辑功能所以实现起来要稍微复杂一些，我们分别在最左侧放置一个`TreeWidget`组件，在中间放置不同的`PushButton`组件，最后是一个`plainTextEdit`组件用来接收反馈，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/1be8d65daf042cf68eae4f0f0509e86f%5B1%5D.png)



### 1.1 初始化组件

如下代码是在 Qt 中使用 `QTreeWidget` 初始化一个树形结构，其中包含了朋友、同学和陌生人等不同分类的节点。

以下是概述：

1. **初始化 `QTreeWidget`：** 设置 `QTreeWidget` 的一些基本属性，包括列数、标题的隐藏等。
2. **创建父节点 “朋友”：** 使用 `QTreeWidgetItem` 创建一个朋友节点，并设置图标、选择状态等属性。然后添加两个子节点 “老张” 和 “老王”，分别设置图标和选择状态。
3. **创建父节点 “同学”：** 类似地，创建一个同学节点，并添加两个子节点 “张三” 和 “李四”，设置相应的图标和选择状态。
4. **创建 “陌生人” 节点：** 使用 `QTreeWidgetItem` 直接创建一个陌生人节点，并设置文本和图标。
5. **将节点添加到 `QTreeWidget` 中：** 使用 `addTopLevelItem` 将 “同学” 和 “陌生人” 节点添加到 `QTreeWidget` 的顶级。
6. **展开所有节点：** 使用 `expandAll` 展开所有节点，使其在初始化时可见。
7. **设置 `QTreeWidget` 的大小：** 使用 `resize` 设置 `QTreeWidget` 的大小。

这段代码的主要功能是创建一个包含不同分类和子节点的树形结构，每个节点可以有不同的图标、文本和选择状态。在展示的树形结构中，朋友和同学节点有子节点，而陌生人节点没有子节点。这个示例展示了 `QTreeWidget` 用于创建层次结构的基本用法。

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    ui->treeWidget->clear();

    // ----------------------------------------------
    // 初始化TreeWidget组件
    // ----------------------------------------------

    // 设置QTreeWidget的列数
    ui->treeWidget->setColumnCount(1);

    // 设置QTreeWidget标题隐藏
    ui->treeWidget->setHeaderHidden(true);

    // ----------------------------------------------
    // 创建QTreeWidget的朋友节点 此时的父节点是TreeWidget
    // ----------------------------------------------

    QTreeWidgetItem *Friend = new QTreeWidgetItem(ui->treeWidget,QStringList(QString("朋友")));
    Friend->setIcon(0,QIcon(":/image/4.ico"));
    Friend->setFlags(Qt::ItemIsSelectable | Qt::ItemIsUserCheckable
                     | Qt::ItemIsEnabled | Qt::ItemIsAutoTristate);
    Friend->setCheckState(0,Qt::Checked);

    // 给Friend添加一个子节点frd
    QTreeWidgetItem *frd = new QTreeWidgetItem(Friend);
    frd->setText(0,"老张");
    frd->setIcon(0,QIcon(tr(":/image/1.ico")));
    frd->setCheckState(0,Qt::Checked);

    // 继续给Friend添加一个子节点frs
    QTreeWidgetItem *frs = new QTreeWidgetItem(Friend);
    frs->setText(0,"老王");
    frs->setIcon(0,QIcon(tr(":/image/1.ico")));
    frs->setCheckState(0,Qt::Unchecked);

    // ----------------------------------------------
    // 继续创建名叫同学节点 父节点同样是TreeWidget
    // ----------------------------------------------
    QTreeWidgetItem * ClassMate = new QTreeWidgetItem(ui->treeWidget,QStringList(QString("同学")));
    ClassMate->setIcon(0,QIcon(":/image/5.ico"));
    ClassMate->setCheckState(0,Qt::Checked);

    // Fly是ClassMate的子节点
    QTreeWidgetItem *Fly = new QTreeWidgetItem(QStringList(QString("张三")));
    Fly->setIcon(0,QIcon(tr(":/image/2.ico")));

    // 创建子节点的另一种方法
    ClassMate->addChild(Fly);
    Fly->setCheckState(0,Qt::Checked);

    // 继续创建子节点Fls
    QTreeWidgetItem *Fls = new QTreeWidgetItem(QStringList(QString("李四")));
    Fls->setIcon(0,QIcon(tr(":/image/2.ico")));
    ClassMate->addChild(Fls);
    Fls->setCheckState(0,Qt::Checked);       // 设置为选中

    // ----------------------------------------------
    // 创建陌生人节点
    // ----------------------------------------------
    QTreeWidgetItem  *Strange = new QTreeWidgetItem(true);
    Strange->setText(0,"陌生人");
    Strange->setIcon(0,QIcon(":/image/6.ico"));

    ui->treeWidget->addTopLevelItem(ClassMate);
    ui->treeWidget->addTopLevelItem(Strange);

    // 展开QTreeWidget的所有节点
    ui->treeWidget->expandAll();
    ui->treeWidget->resize(271,401);
}
```

代码运行后可动态对左侧组件进行初始化，并增加应有的父节点与子节点，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/4805ad3186f1a426386d635c1b14ba07%5B1%5D.png)



### 1.2 添加根节点

如下槽函数，其核心功能是在 `QTreeWidget` 中添加一个新的顶级父节点，并在 `QPlainTextEdit` 中添加一行文本记录。

以下是概述：

1. **获取节点文本：** 使用 `QString NodeText = "新的父节点";` 设置新父节点的文本。
2. **创建新的 `QTreeWidgetItem`：** 使用 `QTreeWidgetItem` 的构造函数创建一个新的顶级父节点，并设置其文本和图标。
3. **添加节点到 `QTreeWidget` 中：** 使用 `ui->treeWidget->addTopLevelItem(item);` 将新的顶级父节点添加到 `QTreeWidget` 中。
4. **记录操作到 `QPlainTextEdit` 中：** 使用 `ui->plainTextEdit->appendPlainText("添加新的父节点");` 将一行文本记录添加到 `QPlainTextEdit` 中，用于记录操作。

这段代码的作用是在点击按钮时，在 `QTreeWidget` 中添加一个新的顶级父节点，并在 `QPlainTextEdit` 中记录这一操作。这样可以用于在界面上动态添加树节点，并记录相关的操作信息。

```c
void MainWindow::on_pushButton_add_clicked()
{
    QString NodeText = "新的父节点";
    QTreeWidgetItem  *item = new QTreeWidgetItem(true);
    item->setText(0,NodeText);
    item->setIcon(0,QIcon(":/image/7.ico"));
    ui->treeWidget->addTopLevelItem(item);
    ui->plainTextEdit->appendPlainText("添加新的父节点");
}
```

运行后通过点击添加根节点按钮，每次则可以生成一个根，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/54ad9c764f2dbace771028259d20dd80%5B1%5D.png)

### 1.3 添加子节点

如下槽函数，其核心功能是在 `QTreeWidget` 中添加新的子节点，并在 `QPlainTextEdit` 中添加一行文本记录。

以下是概述：

1. **获取当前选择的节点：** 使用 `QTreeWidgetItem * item= ui->treeWidget->currentItem();` 获取当前在 `QTreeWidget` 中选择的节点。
2. **判断是否有选择的节点：** 使用 `if(item!=NULL)` 条件判断，如果存在选择的节点，则调用 `AddTreeNode` 函数添加子节点；否则，调用 `AddTreeRoot` 函数添加新的根节点。
3. 添加子节点或新的根节点：
   - 如果存在选择的节点，调用 `AddTreeNode(item,"新子节点","新子节点");` 添加一个新的子节点，其文本和图标分别为 “新子节点”。
   - 如果没有选择的节点，调用 `AddTreeRoot("新子节点","新子节点");` 添加一个新的根节点，其文本和图标同样为 “新子节点”。
4. **记录操作到 `QPlainTextEdit` 中：** 使用 `ui->plainTextEdit->appendPlainText("添加新的子节点");` 将一行文本记录添加到 `QPlainTextEdit` 中，用于记录操作。

这段代码的作用是在点击按钮时，根据用户当前选择的节点状态，在 `QTreeWidget` 中添加新的子节点或新的根节点，并记录这一操作到 `QPlainTextEdit` 中。

```c
QTreeWidgetItem * MainWindow::AddTreeRoot(QString name,QString desc)
{
    QTreeWidgetItem * item=new QTreeWidgetItem(QStringList()<<name<<desc);
    ui->treeWidget->addTopLevelItem(item);
    return item;
}

QTreeWidgetItem * MainWindow::AddTreeNode(QTreeWidgetItem *parent,QString name,QString desc)
{
    QTreeWidgetItem * item=new QTreeWidgetItem(QStringList()<<name<<desc);
    parent->addChild(item);
    return item;
}

void MainWindow::on_pushButton_addsubnode_clicked()
{
    QTreeWidgetItem * item= ui->treeWidget->currentItem();
        if(item!=NULL)
            AddTreeNode(item,"新子节点","新子节点");
        else
            AddTreeRoot("新子节点","新子节点");

        ui->plainTextEdit->appendPlainText("添加新的子节点");
}
```

子节点的添加依赖于封装好的两个`AddTreeNode`函数，通过调用后则可以在父节点上添加子节点，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/b9be2f081cff2ecc4ab5d84a537b679f%5B1%5D.png)

### 1.4 修改选中节点

如下槽函数，其核心功能是修改 `QTreeWidget` 中当前选中节点的文本和图标，并在 `QPlainTextEdit` 中添加一行文本记录。

以下是概述：

1. **获取当前选中的节点：** 使用 `QTreeWidgetItem *currentItem = ui->treeWidget->currentItem();` 获取当前在 `QTreeWidget` 中选择的节点。
2. **判断是否存在选择的节点：** 使用 `if(currentItem == NULL)` 条件判断，如果没有选择的节点，则直接返回。
3. **修改选中节点的文本和图标：** 使用 `for` 循环遍历节点的所有列，通过 `setText` 修改每一列的文本为 “Modify” 加上列索引的字符串，通过 `setIcon` 修改每一列的图标为特定的图标。
4. **记录操作到 `QPlainTextEdit` 中：** 使用 `ui->plainTextEdit->appendPlainText("修改节点名");` 将一行文本记录添加到 `QPlainTextEdit` 中，用于记录操作。

这段代码的作用是在点击按钮时，修改 `QTreeWidget` 中当前选中节点的文本和图标，同时在 `QPlainTextEdit` 中记录这一修改操作。

```c
void MainWindow::on_pushButton_modifynode_clicked()
{
    // 得到当前节点
    QTreeWidgetItem *currentItem = ui->treeWidget->currentItem();
    if(currentItem == NULL)
        return;
    // 修改选中项
    for(int x=0;x<currentItem->columnCount();x++)
    {
        currentItem->setText(x,tr("Modify") + QString::number(x));
        currentItem->setIcon(x,QIcon(":/image/1.ico"));
    }

    ui->plainTextEdit->appendPlainText("修改节点名");
}
```

修改节点的执行效果如下图，当点击修改选中节点后则将自动替换节点名和图标信息。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/400d4da53c07969fe06b4f87db0f6e36%5B1%5D.png)



### 1.5 删除选中节点

如下槽函数，其核心功能是删除 `QTreeWidget` 中当前选中节点，并在 `QPlainTextEdit` 中添加一行文本记录。

以下是概述：

1. **获取当前选中的节点：** 使用 `QTreeWidgetItem *currentItem = ui->treeWidget->currentItem();` 获取当前在 `QTreeWidget` 中选择的节点。
2. **判断是否存在选择的节点：** 使用 `if(currentItem == NULL)` 条件判断，如果没有选择的节点，则直接返回。
3. **判断是否为顶级父节点：** 使用 `if(currentItem->parent() == NULL)` 条件判断，如果当前节点没有父节点（即为顶级父节点），则使用 `ui->treeWidget->takeTopLevelItem` 删除该节点。
4. **如果有父节点，使用父节点的 `takeChild` 删除子节点：** 使用 `delete currentItem->parent()->takeChild(ui->treeWidget->currentIndex().row());` 删除当前节点。这种情况下，要使用父节点的 `takeChild` 方法，因为直接删除会导致父节点无法正确管理子节点。
5. **记录操作到 `QPlainTextEdit` 中：** 使用 `ui->plainTextEdit->appendPlainText("删除一个节点");` 将一行文本记录添加到 `QPlainTextEdit` 中，用于记录操作。

这段代码的作用是在点击按钮时，删除 `QTreeWidget` 中当前选中的节点，并记录这一删除操作到 `QPlainTextEdit` 中。

```c
void MainWindow::on_pushButton_delnode_clicked()
{
    QTreeWidgetItem *currentItem = ui->treeWidget->currentItem();
    if(currentItem == NULL)
        return;

    // 如果没有父节点则直接删除
    if(currentItem->parent() == NULL)
    {
        delete ui->treeWidget->takeTopLevelItem(ui->treeWidget->currentIndex().row());
        std::cout << ui->treeWidget->currentIndex().row() << std::endl;
    }
    else
    {
        // 如果有父节点就要用父节点的takeChild删除节点
        delete currentItem->parent()->takeChild(ui->treeWidget->currentIndex().row());
    }

    ui->plainTextEdit->appendPlainText("删除一个节点");
}
```

删除节点有两种情况，如果只有父节点那么可以直接删除，如果有子节点则那就要一并删除，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/ea772e8f778eae26ac107c0ebeadf3fc%5B1%5D.png)

### 1.6 枚举全部节点

如下槽函数，其核心功能是遍历 `QTreeWidget` 中的所有节点，并输出每个节点的文本。

以下是概述：

1. **获取全部的根节点数量：** 使用 `int size = ui->treeWidget->topLevelItemCount();` 获取顶级父节点的数量。
2. **遍历所有根节点：** 使用 `for` 循环遍历每一个根节点，通过 `ui->treeWidget->topLevelItem(x)` 获取当前的根节点。
3. **输出所有根节点：** 使用 `child->text(0).toStdString().data()` 输出当前根节点的文本信息，并将其输出到标准输出流。
4. **遍历根节点下的子节点：** 使用内层 `for` 循环遍历当前根节点下的所有子节点，通过 `child->child(y)` 获取子节点。
5. **输出子节点：** 使用 `grandson->text(0).toStdString().data()` 输出当前子节点的文本信息，并将其输出到标准输出流。
6. **记录操作到 `QPlainTextEdit` 中：** 使用 `ui->plainTextEdit->appendPlainText("枚举所有节点");` 将一行文本记录添加到 `QPlainTextEdit` 中，用于记录操作。

这段代码的作用是在点击按钮时，遍历 `QTreeWidget` 中的所有节点，输出每个节点的文本信息，并将信息记录到 `QPlainTextEdit` 中。

```c
void MainWindow::on_pushButton_enumnode_clicked()
{
    // 获取到全部的根节点数量
    int size = ui->treeWidget->topLevelItemCount();
    QTreeWidgetItem *child;
    for(int x=0;x<size;x++)
    {
        // 输出所有父节点
        child = ui->treeWidget->topLevelItem(x);
        std::cout << "all root = "<< child->text(0).toStdString().data() << std::endl;

        // 得到所有子节点计数
        int childCount = child->childCount();
        // std::cout << "all child count = " << childCount << std::endl;

        // 输出根节点下面的子节点
        for(int y=0;y<childCount;++y)
        {
            QTreeWidgetItem *grandson = child->child(y);
            std::cout << "--> sub child = "<< grandson->text(0).toStdString().data() << std::endl;

            ui->plainTextEdit->appendPlainText(grandson->text(0).toStdString().data());
        }
    }

    ui->plainTextEdit->appendPlainText("枚举所有节点");
}
```

枚举所有节点会将父节点与子节点一并输出，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/4615b4351377d03a32aaa1ce53250bea%5B1%5D.png)



### 1.7 枚举选中节点

如下槽函数，其核心功能是遍历 `QTreeWidget` 中的所有节点，并输出每个选中节点的文本信息。

以下是概述：

1. **获取全部的根节点数量：** 使用 `int size = ui->treeWidget->topLevelItemCount();` 获取顶级父节点的数量。
2. **遍历所有根节点：** 使用 `for` 循环遍历每一个根节点，通过 `ui->treeWidget->topLevelItem(x)` 获取当前的根节点。
3. **遍历根节点下的子节点：** 使用内层 `for` 循环遍历当前根节点下的所有子节点，通过 `child->child(y)` 获取子节点。
4. **判断是否选中：** 使用 `if(Qt::Checked == grandson->checkState(0))` 判断当前子节点是否被选中。
5. **输出选中节点信息：** 如果子节点被选中，输出当前根节点与子节点的文本信息，并将信息输出到标准输出流。
6. **记录操作到 `QPlainTextEdit` 中：** 使用 `ui->plainTextEdit->appendPlainText("枚举所有选中节点");` 将一行文本记录添加到 `QPlainTextEdit` 中，用于记录操作。

这段代码的作用是在点击按钮时，遍历 `QTreeWidget` 中的所有节点，输出每个被选中节点的文本信息，并将信息记录到 `QPlainTextEdit` 中。

```c
void MainWindow::on_pushButton_enumselectnode_clicked()
{
    // 获取到全部的根节点数量
    int size = ui->treeWidget->topLevelItemCount();
    QTreeWidgetItem *child;
    for(int x=0;x<size;x++)
    {
        // 输出所有父节点
        child = ui->treeWidget->topLevelItem(x);

        // 得到所有子节点计数
        int childCount = child->childCount();

        // 输出根节点下面的子节点
        for(int y=0;y<childCount;++y)
        {
            QTreeWidgetItem *grandson = child->child(y);
            // 判断是否选中,如果选中输出父节点与子节点
            if(Qt::Checked == grandson->checkState(0))
            {
                std::cout << "root -> " << child->text(0).toStdString().data()
                          << "--> sub child = "<< grandson->text(0).toStdString().data() << std::endl;

                ui->plainTextEdit->appendPlainText(child->text(0).toStdString().data());
                ui->plainTextEdit->appendPlainText(grandson->text(0).toStdString().data());
            }
        }
    }

    ui->plainTextEdit->appendPlainText("枚举所有选中节点");
}
```

枚举所有选中的节点，此处需要打上对勾才会生效，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/96f1ec7b3b14817f9beb7a118c5c7154%5B1%5D.png)

### 1.8 获取节点父节点

如下槽函数，其核心功能是获取当前选中节点的父节点（如果存在），输出父节点的序号和名字，并将信息记录到 `QPlainTextEdit` 中。

以下是概述：

1. **获取当前选中节点的父节点：** 使用 `QTreeWidgetItem *currentItem = ui->treeWidget->currentItem()->parent();` 获取当前选中节点的父节点。
2. **获取父节点在顶级节点中的序号：** 使用 `int root_count = ui->treeWidget->indexOfTopLevelItem(currentItem);` 获取父节点在顶级节点中的序号。
3. **判断是否存在父节点：** 使用 `if(root_count != -1)` 条件判断，如果存在父节点，执行下面的操作；否则，直接返回。
4. **获取指定序号对应的父节点：** 使用 `child = ui->treeWidget->topLevelItem(root_count);` 获取指定序号对应的父节点。
5. **输出父节点的序号和名字：** 使用 `std::cout << "root Count = " << root_count << std::endl;` 输出父节点在顶级节点中的序号，以及 `std::cout << "root name= "<< child->text(0).toStdString().data() << std::endl;` 输出父节点的名字。
6. **记录操作到 `QPlainTextEdit` 中：** 使用 `ui->plainTextEdit->appendPlainText("获取父节点ID");` 将一行文本记录添加到 `QPlainTextEdit` 中，用于记录操作。

这段代码的作用是在点击按钮时，获取当前选中节点的父节点（如果存在），输出父节点在顶级节点中的序号和名字，并将信息记录到 `QPlainTextEdit` 中。

```c
void MainWindow::on_pushButton_getnode_clicked()
{
    // 取所有的父节点
    QTreeWidgetItem *currentItem = ui->treeWidget->currentItem()->parent();
    int root_count = ui->treeWidget->indexOfTopLevelItem(currentItem);
    std::cout << "root Count = " <<  root_count << std::endl;
    if(root_count != -1)
    {
        // 指定序号对应的父节点名字
        QTreeWidgetItem *child;

        child = ui->treeWidget->topLevelItem(root_count);
        std::cout << "root name= "<< child->text(0).toStdString().data() << std::endl;

        ui->plainTextEdit->appendPlainText(child->text(0).toStdString().data());
    }

    ui->plainTextEdit->appendPlainText("获取父节点ID");
}
```

当用户选中一个子节点时，可通过该槽函数获取其父节点的ID编号，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/151084941bb437e5086e579cc83cc059%5B1%5D.png)



### 1.9 绑定右键菜单

在开发中我们经常会把它当作一个升级版的`ListView`组件使用，因为`ListView`每次只能显示一列数据集，而使用`TableWidget`组件显示多列显得不够美观，此时使用`TreeWidget`组件显示单层结构是最理想的方式，同时该组件同样支持增加右键菜单，在真正的开发中尤为常用。

首先我们在`MainWindow`主窗体中只保留一个`treeWidget`组件，接着直接来到`MainWindow`构造函数上，在该函数中我们通过动态创建一个`menuBar()`并将其隐藏起来，接着将菜单属性与`treeWidget`中的事件相互绑定，最后初始化填充一些测试数据，其代码如下；

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // -------------------------------------------------
    // 初始化组件菜单
    // -------------------------------------------------

    // 在MainWindow中使用右击菜单需要添加此项
    ui->treeWidget->setContextMenuPolicy(Qt::CustomContextMenu);

    // 创建基础顶部菜单
    QMenuBar *bar = menuBar();
    this->setMenuBar(bar);
    QMenu * fileMenu = bar->addMenu("菜单1");

    // 实现只隐藏菜单1其他的不受影响
    fileMenu->menuAction()->setVisible(false);

    // 添加子菜单
    GetColumnAction = fileMenu->addAction("获取列号");
    GetRowDataAction = fileMenu->addAction("获取本行数据");
    GetLineAction = fileMenu->addAction("获取行号");

    // 分别设置图标
    GetColumnAction->setIcon(QIcon(":/image/1.ico"));
    GetRowDataAction->setIcon(QIcon(":/image/2.ico"));
    GetLineAction->setIcon(QIcon(":/image/3.ico"));

    // 为子菜单绑定热键
    GetColumnAction->setShortcut(Qt::CTRL | Qt::Key_A);
    GetRowDataAction->setShortcut(Qt::SHIFT | Qt::Key_S);
    GetLineAction->setShortcut(Qt::CTRL | Qt::SHIFT | Qt::Key_B);

    // -------------------------------------------------
    // 绑定槽函数
    // -------------------------------------------------

    // 绑定槽函数: 获取选中列
    connect(GetColumnAction,&QAction::triggered,this,[=](){
        int col = ui->treeWidget->currentColumn();
        std::cout << col << std::endl;
    });

    // 绑定槽函数: 获取选中的第0行的数据内容
    connect(GetRowDataAction,&QAction::triggered,this,[=](){
        QString msg = ui->treeWidget->currentItem()->text(0);
        std::cout << msg.toStdString().data() << std::endl;
    });

    // 绑定槽函数: 获取当前选中的索引值
    connect(GetLineAction,&QAction::triggered,this,[=](){
        int row  = ui->treeWidget->currentIndex().row();
        std::cout << row << std::endl;
    });

    // -------------------------------------------------
    // 设置属性填充数据
    // -------------------------------------------------

    // 设置treeWidget属性
    ui->treeWidget->setColumnCount(4);         // 设置总列数
    ui->treeWidget->setColumnWidth(0,300);     // 设置最后一列宽度自适应
    ui->treeWidget->setIndentation(1);         // 设置表头缩进为1

    // 设置表头数据
    QStringList headers;
    headers.append("文件名");
    headers.append("更新时间");
    headers.append("文件类型");
    headers.append("文件大小");
    ui->treeWidget->setHeaderLabels(headers);

    // 模拟插入数据到表中
    for(int x=0;x<100;x++)
    {
        QTreeWidgetItem* item=new QTreeWidgetItem();
        item->setText(0,"《LyShark 从入门到精通》");
        item->setIcon(0,QIcon(":/image/1.ico"));
        item->setText(1,"2023-12-17");
        item->setText(2,"*.pdf");
        item->setText(3,"102MB");
        item->setIcon(3,QIcon(":/image/2.ico"));
        ui->treeWidget->addTopLevelItem(item);
    }
}
```

此时，当`treeWidget`中的右键被点击后则将触发`on_treeWidget_customContextMenuRequested`槽函数，此函数中动态的新建一个菜单，并在鼠标点击位置将其显示输出，代码如下；

```c
// 当treeWidget中的右键被点击时则触发
void MainWindow::on_treeWidget_customContextMenuRequested(const QPoint &pos)
{
    std::cout << "x pos = "<< pos.x() << "y pos = " << pos.y() << std::endl;
    Q_UNUSED(pos);

    // 新建Menu菜单
    QMenu *ptr = new QMenu(this);

    // 添加Actions创建菜单项
    ptr->addAction(GetColumnAction);
    ptr->addAction(GetLineAction);

    // 添加一个分割线
    ptr->addSeparator();
    ptr->addAction(GetRowDataAction);

    // 在鼠标光标位置显示右键快捷菜单
    ptr->exec(QCursor::pos());
    // 手工创建的指针必须手工删除
    delete ptr;
}
```

运行后读者可看到如下图所示的输出效果；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/0fe1a23d94601c42b1553c49bf1a1c22%5B1%5D.png)