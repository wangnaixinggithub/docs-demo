# C++ Qt开发：StandardItemModel数据模型组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`StandardItemModel`数据模型组件的常用方法及灵活运用。

`QStandardItemModel` 是 Qt 中用于存储标准项数据的模型类之一，它继承自 `QAbstractItemModel` 类。这个模型提供了一种灵活的方式来组织和管理数据，适用于各种视图类（比如 `QTreeView`、`QListView`、`QTableView` 等）。该组件是标准的以项数据为单位的基于M/V模型的一种标准数据管理方式。

Model/View 是Qt中的一种数据编排结构，其中`Model`代表模型而`View`则代表视图，视图是显示和编辑数据的界面组件，而模型则是视图与原始数据之间的接口，通常该类结构都是用在数据库中较多，例如模型结构负责读取或写入数据库，视图结构则负责展示数据，其条理清晰，编写代码便于维护。Model/View架构是Qt中数据与界面分离的核心设计模式，为开发者提供了一种清晰而灵活的方式来管理和展示数据。

数据模型组件通常会配合`TableView`等相关组件一起使用，首先绘制`UI`界面，界面中包含顶部`ToolBar`组件，底部是一个`TableView`视图表格，最下方是一个`PlainTextEdit`文本框，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/49d7d206aaa1fac2d0ed3ece9517d169%5B1%5D.png)



如上图所示`ToolBar`组件中我们绑定了一些快捷键及`ICO`图标，这些信息通过图形化的方式进行了关联；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/d30841134fe46e097ba9e917cabe6ba5%5B1%5D.png)

### 1.1 初始化表格

为了能充分展示`QStandardItemModel`模型组件的使用，我们首先简单的的介绍一下该组件的常用方法与描述，下面是 `QStandardItemModel` 类的一些常用方法，说明和概述：

| 方法                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QStandardItemModel(int rows, int columns, QObject *parent = nullptr)` | 构造函数，创建一个具有指定行数和列数的 `QStandardItemModel` 对象。 |
| `virtual ~QStandardItemModel()`                              | 虚析构函数，释放 `QStandardItemModel` 对象及其所有子项。     |
| `int rowCount(const QModelIndex &parent = QModelIndex()) const` | 返回指定父项的行数。如果 `parent` 为无效索引，则返回根项的行数。 |
| `int columnCount(const QModelIndex &parent = QModelIndex()) const` | 返回指定父项的列数。如果 `parent` 为无效索引，则返回根项的列数。 |
| `QModelIndex index(int row, int column, const QModelIndex &parent = QModelIndex()) const` | 返回指定行、列和父项的索引。                                 |
| `QModelIndex parent(const QModelIndex &child) const`         | 返回指定子项的父项的索引。如果子项没有父项，则返回无效索引。 |
| `Qt::ItemFlags flags(const QModelIndex &index) const`        | 返回指定索引处项的标志，用于指示该项的状态和行为。           |
| `QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const` | 返回指定索引处项的数据。`role` 参数指定要获取的数据的角色，如 `Qt::DisplayRole` 表示显示文本。 |
| `bool setData(const QModelIndex &index, const QVariant &value, int role = Qt::EditRole)` | 设置指定索引处项的数据。如果设置成功，则返回 `true`，否则返回 `false`。 |
| `bool insertRows(int row, int count, const QModelIndex &parent = QModelIndex())` | 在指定父项下插入行。返回 `true` 表示成功。                   |
| `bool removeRows(int row, int count, const QModelIndex &parent = QModelIndex())` | 从指定父项中移除行。返回 `true` 表示成功。                   |
| `QModelIndexList match(const QModelIndex &start, int role, const QVariant &value, int hits = 1, Qt::MatchFlags flags = Qt::MatchFlags(Qt::MatchStartsWithQt::MatchWrap)) const` | 从模型中匹配指定的字符串等变量。                             |
| `bool insertColumns(int column, int count, const QModelIndex &parent = QModelIndex())` | 在指定父项下插入列。返回 `true` 表示成功。                   |
| `bool removeColumns(int column, int count, const QModelIndex &parent = QModelIndex())` | 从指定父项中移除列。返回 `true` 表示成功。                   |
| `Qt::DropActions supportedDropActions() const`               | 返回模型支持的拖放操作。                                     |
| `Qt::DropActions supportedDragActions() const`               | 返回模型支持的拖动操作。                                     |
| `QStringList mimeTypes() const`                              | 返回模型支持的 MIME 类型列表。                               |
| `QMimeData *mimeData(const QModelIndexList &indexes) const`  | 返回包含指定索引项数据的 MIME 数据对象。                     |
| `bool dropMimeData(const QMimeData *data, Qt::DropAction action, int row, int column, const QModelIndex &parent)` | 处理拖放操作中的 MIME 数据。返回 `true` 表示成功。           |

显示详细信息

以上是 `QStandardItemModel` 类的一些常用方法，通过这些方法，可以对模型进行增删改查等操作，并与视图进行交互。

首先笔者先来演示一下如何将`tableView`组件与`QStandardItemModel`组件进行绑定操作，其实绑定很简单只需要调用`ui->tableView->setModel`即可将`tableView`组件与`model`数据集进行绑定，当绑定后，模型中的数据发生变化则会自动刷新到`View`组件中，我们就无需关心界面中的组件如何显示了，这个现实过程交给`Model`映射吧。

如下所示的代码片段是一个使用 `QStandardItemModel` 的例子，演示了如何创建一个带有表头和初始数据的 `QTableView`。

以下是代码片段的一些说明：

1. 创建 `QStandardItemModel` 对象，并设置列数为 3。
2. 为表头设置标签，分别是 “账号”、“用户”、“年龄”。
3. 将模型设置为 `QTableView`。
4. 设置表头默认对齐方式为左对齐。
5. 设置列宽，第一列宽度为 101，第二列宽度为 102。
6. 循环添加数据到模型中，包括 “20210506”、“lyshark” 和 “24”。

这样，就创建了一个包含表头和数据的 `QTableView`，并将其显示在 `MainWindow` 中。

```c
// 默认构造函数
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    QStandardItemModel *model = new QStandardItemModel();

    // 初始化tableView表头
    model->setColumnCount(3);
    model->setHeaderData(0,Qt::Horizontal,QString("账号"));
    model->setHeaderData(1,Qt::Horizontal,QString("用户"));
    model->setHeaderData(2,Qt::Horizontal,QString("年龄"));

    ui->tableView->setModel(model);
    ui->tableView->horizontalHeader()->setDefaultAlignment(Qt::AlignLeft);  // 表头居左显示

    // 设置列宽
    ui->tableView->setColumnWidth(0,101);
    ui->tableView->setColumnWidth(1,102);
    
    // 循环初始化设置模型
    for(int i = 0; i < 5; i++)
    {
        model->setItem(i,0,new QStandardItem("20210506"));

        // 设置字符颜色
        model->item(i,0)->setForeground(QBrush(QColor(255, 0, 0)));
        // 设置字符位置
        model->item(i,0)->setTextAlignment(Qt::AlignCenter);
        model->setItem(i,1,new QStandardItem(QString("lyshark")));
        model->setItem(i,2,new QStandardItem(QString("24")));
    }
}
```

运行后读者可观察`TableView`表格中的变化情况，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/ea931fb8a2b515daa04fedc9103643fe%5B1%5D.png)

接着，我们来看下如何对本项目中`UI`表格进行初始化，在`MainWindow`构造函数中，我们首先创建一个`QStandardItemModel`用于存储表格数据，以及一个`QItemSelectionModel`用于处理表格中的选择操作，并将它们关联到`TableView`组件上。在窗口初始化时，除了打开文件的操作外，禁用了其他所有`Action`选项。创建状态栏组件，包括显示当前文件、当前单元格位置和单元格内容的`QLabel`组件。

```c
// 默认构造函数
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 初始化部分
    model = new QStandardItemModel(3,FixedColumnCount,this);  // 数据模型初始化
    selection = new QItemSelectionModel(model);               // Item选择模型

    // 为TableView设置数据模型
    ui->tableView->setModel(model);               // 设置数据模型
    ui->tableView->setSelectionModel(selection);  // 设置选择模型

    // 默认禁用所有Action选项,只保留打开
    ui->actionSave->setEnabled(false);
    ui->actionView->setEnabled(false);
    ui->actionAppend->setEnabled(false);
    ui->actionDelete->setEnabled(false);
    ui->actionInsert->setEnabled(false);

    // 创建状态栏组件,主要来显示单元格位置
    LabCurFile = new QLabel("当前文件：",this);
    LabCurFile->setMinimumWidth(200);

    LabCellPos = new QLabel("当前单元格：",this);
    LabCellPos->setMinimumWidth(180);
    LabCellPos->setAlignment(Qt::AlignHCenter);

    LabCellText = new QLabel("单元格内容：",this);
    LabCellText->setMinimumWidth(150);

    ui->statusbar->addWidget(LabCurFile);
    ui->statusbar->addWidget(LabCellPos);
    ui->statusbar->addWidget(LabCellText);

    // 选择当前单元格变化时的信号与槽
    connect(selection,SIGNAL(currentChanged(QModelIndex,QModelIndex)),this,SLOT(on_currentChanged(QModelIndex,QModelIndex)));
}

MainWindow::~MainWindow()
{
    delete ui;
}
```

如上代码中，我们还将选择模型的`currentChanged`信号连接到了槽函数`on_currentChanged`上面，这个槽函数主要用于实现，当选择单元格变化时则响应，并将当前单元格变化刷新到底部的`StatusBar`组件上，代码如下所示；

```c
// 【选中单元格时响应】：选择单元格变化时的响应,通过在构造函数中绑定信号和槽函数实现触发
void MainWindow::on_currentChanged(const QModelIndex &current, const QModelIndex &previous)
{
   Q_UNUSED(previous);

    if (current.isValid())                                        // 当前模型索引有效
    {
        LabCellPos->setText(QString::asprintf("当前单元格：%d行，%d列",current.row(),current.column())); // 显示模型索引的行和列号
        QStandardItem   *aItem;
        aItem=model->itemFromIndex(current);                      // 从模型索引获得Item
        this->LabCellText->setText("单元格内容："+aItem->text());   // 显示item的文字内容
    }
}
```

读者可自行运行这段程序，当运行后首先会初始化表格的长度及宽度，且页面中禁用了其他按钮，只能选择打开文件选项，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9d8be46679b253ac18fff73f3ca7adf9%5B1%5D.png)

### 1.2 打开文件

当读者点击打开文件时，首先会触发`on_actionOpen_triggered`槽函数，在该函数内，通过`QCoreApplication::applicationDirPath()`获取应用程序的路径，并通过`QFileDialog::getOpenFileName()`文件对话框让用户选择一个数据文件（`*.txt`）。如果用户选择了文件，就以只读文本方式打开该文件，读取文件内容到一个字符串列表 `fFileContent` 中，并显示到 `plainTextEdit` 文本框中。

当读取结束后，直接关闭文件，并调用 `iniModelFromStringList` 函数，该函数根据字符串列表的内容初始化数据模型。随即启用工具栏中的其他`Action`选项，包括保存、查看、追加、删除和插入。并在状态栏显示当前打开的文件路径。

该函数实现了打开文件后的一系列操作，包括读取文件内容、更新UI显示和初始化数据模型。

```c
// 【打开文件】：当工具栏中打开文件被点击后则触发
void MainWindow::on_actionOpen_triggered()
{
    QString curPath=QCoreApplication::applicationDirPath(); // 获取应用程序的路径
    // 调用打开文件对话框打开一个文件
    QString aFileName=QFileDialog::getOpenFileName(this,"打开一个文件",curPath,"数据文件(*.txt);;所有文件(*.*)");
    if (aFileName.isEmpty())
    {
        return; // 如果未选择文件则退出
    }

    QStringList fFileContent;                              // 文件内容字符串列表
    QFile aFile(aFileName);                                // 以文件方式读出
    if (aFile.open(QIODevice::ReadOnly | QIODevice::Text)) // 以只读文本方式打开文件
    {
        QTextStream aStream(&aFile);       // 用文本流读取文件
        ui->plainTextEdit->clear();        // 清空列表
        // 循环读取只要不为空
        while (!aStream.atEnd())
        {
            QString str=aStream.readLine();          // 读取文件的一行
            ui->plainTextEdit->appendPlainText(str); // 添加到文本框显示
            fFileContent.append(str);                // 添加到StringList
        }
        aFile.close();                               // 关闭文件

        iniModelFromStringList(fFileContent);        // 从StringList的内容初始化数据模型
    }

    // 打开文件完成后,就可以将Action全部开启了
    ui->actionSave->setEnabled(true);
    ui->actionView->setEnabled(true);
    ui->actionAppend->setEnabled(true);
    ui->actionDelete->setEnabled(true);
    ui->actionInsert->setEnabled(true);

    // 打开文件成功后,设置状态栏当前文件列
    this->LabCurFile->setText("当前文件："+aFileName);//状态栏显示
}
```

在上述槽函数中并没有分析`iniModelFromStringList(fFileContent)`函数的具体实现细节，该函数用于从传入的字符串列表 `aFileContent` 中获取数据，并将数据初始化到 `TableView` 模型中。

具体步骤如下：

- 获取文本行数 `rowCnt`，第一行是标题。
- 设置模型的行数为实际数据行数 `rowCnt-1`，因为第一行是标题。
- 获取表头 `header`，并将其分割成一个字符串列表 `headerList`，作为模型的水平表头标签。
- 循环处理每一行数据，分割每行的文本为一个字符串列表 `tmpList`。
- 对于每一行，循环处理每一列（不包括最后一列），为模型的某个行列位置设置 `QStandardItem`。
- 对于每行的最后一列，该列是可检查的，需要创建 `QStandardItem`，并设置为可检查状态。根据数据判断是否选中，并设置相应的检查状态。
- 将 `QStandardItem` 设置到模型的相应行列位置。

这个函数主要完成了从字符串列表中获取数据并初始化到 `TableView` 模型的过程，包括表头的设置、数据的提取和状态的处理。

```c
// 【初始化填充TableView】：从传入的StringList中获取数据,并将数据初始化到TableView模型中
void MainWindow::iniModelFromStringList(QStringList& aFileContent)
{
    int rowCnt=aFileContent.count();     // 文本行数,第1行是标题
    model->setRowCount(rowCnt-1);        // 实际数据行数,要在标题上减去1

    // 设置表头
    QString header=aFileContent.at(0);                // 第1行是表头

    // 一个或多个空格、TAB等分隔符隔开的字符串、分解为一个StringList
    QStringList headerList=header.split(QRegExp("\\s+"),QString::SkipEmptyParts);
    model->setHorizontalHeaderLabels(headerList);    // 设置表头文字

    // 设置表格中的数据
    int x = 0,y = 0;
    QStandardItem *Item;

    // 有多少列数据就循环多少次
    for(x=1; x < rowCnt; x++)
    {
        QString LineText = aFileContent.at(x);    // 获取数据区的一行
        // 一个或多个空格、TAB等分隔符隔开的字符串、分解为一个StringList
        QStringList tmpList=LineText.split(QRegExp("\\s+"),QString::SkipEmptyParts);

        // 循环列数,也就是循环FixedColumnCount,其中tmpList中的内容也是.
        for(y=0; y < FixedColumnCount-1; y++)
        {
            Item = new QStandardItem(tmpList.at(y)); // 创建item
            model->setItem(x-1,y,Item);              // 为模型的某个行列位置设置Item
        }

        // 最后一个数据需要取出来判断,并单独设置状态
        Item=new QStandardItem(headerList.at(y));   // 最后一列是Checkable,需要设置
        Item->setCheckable(true);                   // 设置为Checkable

        // 判断最后一个数值是否为0
        if (tmpList.at(y) == "0")
            Item->setCheckState(Qt::Unchecked);     // 根据数据设置check状态
        else
            Item->setCheckState(Qt::Checked);

        model->setItem(x-1,y,Item);                 // 为模型的某个行列位置设置Item
    }
}
```

读者可自行运行程序，当程序运行后默认只能点击打开按钮，点击打开按钮后可以选择项目中的`data.txt`文本文件，此时就可以将文本中的内容映射到组件中，其输出效果如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/f593464cd0209e356fc00a8de66a2232%5B1%5D.png)

### 1.3 保存文件

接着我们来看下保存文件与预览`TableView`视图的实现方法，其实保存文件与预览是一个功能，唯一的区别是保存文件刷新到文件中，而预览则是刷新到了`PlainTextEdit`文本框内，但其两个本质上是一个功能，此处笔者就以保存文件为例来说明如何实现的。

首先，在代码中同样是获取应用程序路径，同样是打开文件唯一不同的是这里使用了`getSaveFileName`也标志着是打开一个保存对话框，这里还使用了`QFile::Open`函数，并设置了`QIODevice::ReadWrite`写入模式，接着定义了`QTextStream`文本流，第一次循环将表头先追加到流中，最后`model->rowCount()`循环表格元素次数，并依次追加文本流到文件。

步骤总结起来如下：

- 获取当前应用程序的路径。
- 弹出保存文件对话框，让用户选择保存文件的路径和文件名。
- 如果用户未选择文件，则直接退出。
- 使用 `QFile` 打开文件，以读写、覆盖原有内容的方式打开文件。
- 使用 `QTextStream` 以文本流的方式读取文件。
- 获取表头文字，以制表符 `\t\t` 分隔，写入文件。
- 获取数据区文字，对于每一行的每一列，以制表符 `\t\t` 分隔，写入文件。最后一列根据选中状态写入 `1` 或 `0`。
- 将表头文字和数据区文字分别追加到 `plainTextEdit` 文本框中。

这个函数主要完成了将 `TableView` 模型中的数据保存到文件的过程，包括文件的选择、打开和写入。

```c
// 【保存文件】：当保存文件被点击后触发
void MainWindow::on_actionSave_triggered()
{
    QString curPath=QCoreApplication::applicationDirPath(); // 获取应用程序的路径

    // 调用打开文件对话框选择一个文件
    QString aFileName=QFileDialog::getSaveFileName(this,tr("选择一个文件"),curPath,"数据文件(*.txt);;所有文件(*.*)");

    if (aFileName.isEmpty()) // 未选择文件则直接退出
    {
        return;
    }

    QFile aFile(aFileName);

    // 以读写、覆盖原有内容方式打开文件
    if (!(aFile.open(QIODevice::ReadWrite | QIODevice::Text | QIODevice::Truncate)))
        return;

    QTextStream aStream(&aFile);    // 用文本流读取文件
    QStandardItem *Item;
    QString str;
    int x = 0,y = 0;

    ui->plainTextEdit->clear();

    // 获取表头文字
    for (x=0; x<model->columnCount(); x++)
    {
        Item=model->horizontalHeaderItem(x);     // 获取表头的项数据
        str= str + Item->text() + "\t\t";        // 以TAB制表符隔开
    }
    aStream << str << "\n";                      // 文件里需要加入换行符\n
    ui->plainTextEdit->appendPlainText(str);

    // 获取数据区文字
    for ( x=0; x < model->rowCount(); x++)
    {
        str = "";
        for( y=0; y < model->columnCount()-1; y++)
        {
            Item=model->item(x,y);
            str=str + Item->text() + QString::asprintf("\t\t");
        }

        // 对最后一列需要转换一下,如果判断为选中则写1否则写0
        Item=model->item(x,y);
        if (Item->checkState()==Qt::Checked)
        {
            str= str + "1";
        }
        else
        {
            str= str + "0";
        }

         ui->plainTextEdit->appendPlainText(str);
         aStream << str << "\n";
    }
}
```

运行程序后，读者可以点击保存文件按钮，并将其保存到任意位置，此时打开文件，可看到如下图所示的效果；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/b0237407dcaf6d30d07c03cfa2d35ade%5B1%5D.png)



### 1.3 插入与删除

首先来解释一下如何添加一行新的行，其实添加与插入原理一致，唯一的区别在于，添加一行新的数据是在行尾加入，这个可以使用`model->columnCount()`来得到行尾，而插入则是在选中当前`selection->currentIndex()`行的下方加入行，其他的方式是完全一致的。

如下所示的函数用于在 `TableView` 中追加一行数据，具体步骤如下：

1. 创建一个 `QList` 容器 `ItemList` 用于存储一行数据的 `QStandardItem`。
2. 循环创建 `FixedColumnCount-1` 列的数据，每列的数据都是 “测试(追加行)”。
3. 创建最后一列的数据，这一列是一个可选框（Check Box），其表头通过 `model->headerData` 获取。将该项设置为可选，并添加到 `ItemList` 中。
4. 使用 `model->insertRow` 插入一行，该行的数据由 `ItemList` 决定。
5. 获取最后一行的 `ModelIndex`。
6. 清空当前选中项，然后设置当前选中项为最后一行。

这个函数主要用于模拟在 `TableView` 中追加一行数据，其中包括普通文本和可选框数据。

```c
// 【添加一行】：为TableView添加一行数据(在文件末尾插入)
void MainWindow::on_actionAppend_triggered()
{
    QList<QStandardItem *> ItemList;   // 创建临时容器
    QStandardItem *Item;

    // 模拟添加一列的数据
    for(int x=0; x<FixedColumnCount-1; x++)
    {
        Item = new QStandardItem("测试(追加行)");    // 循环创建每一列
        ItemList << Item;                          // 添加到链表中
    }

    // 创建最后一个列元素,由于是选择框所以需要单独创建
    // 1.获取到最后一列的表头下标,最后下标为6
    QString str = model->headerData(model->columnCount()-1,Qt::Horizontal,Qt::DisplayRole).toString();

    Item=new QStandardItem(str); // 创建 "是否合格" 字段
    Item->setCheckable(true);    // 设置状态为真
    ItemList << Item;            // 最后一个选项追加进去

    model->insertRow(model->rowCount(),ItemList);                 // 插入一行，需要每个Cell的Item
    QModelIndex curIndex=model->index(model->rowCount()-1,0);     // 创建最后一行的ModelIndex
    selection->clearSelection();                                      // 清空当前选中项
    selection->setCurrentIndex(curIndex,QItemSelectionModel::Select); // 设置当前选中项为当前选择行
}
```

对于删除来说则更容易实现，只需要通过调用`selection->currentIndex()`获取当当前单元格模型索引，并通过调用`model->removeRow`来实现一处即可，此处需要区别一下是不是最后一行，如果是最后一行则直接删除即可，如果不是则需要在删除数据后通过`setCurrentIndex`将索引设置到前一个或第一个元素上，且核心代码如下所示；

```c
// 【删除一行】：删除选中行
void MainWindow::on_actionDelete_triggered()
{
    QModelIndex curIndex = selection->currentIndex();  // 获取当前选择单元格的模型索引

    // 先判断是不是最后一行
    if (curIndex.row()==model->rowCount()-1)
    {
        model->removeRow(curIndex.row());    // 删除最后一行
    }
    else
    {
        model->removeRow(curIndex.row());    // 删除一行，并重新设置当前选择行
        selection->setCurrentIndex(curIndex,QItemSelectionModel::Select);
    }
}
```

读者可自行点击添加一行与插入行，观察变化则可以理解两者的区别，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/8806c671550b0c2de2f8ddbd6ff4c1e5%5B1%5D.png)

### 1.4 格式设置

格式设置也是非常常用的功能，例如在`Office`中就有表格元素居中、表格左对齐、表格右对齐、字体加粗显示等，在Qt中`Table`表格就默认自带了这些功能的支持，通过直接调用`setTextAlignment`并传入`Qt::AlignHCenter`居中、`Qt::AlignLeft`用于左对齐、`Qt::AlignRight`用于右对齐、而对于加粗显示只需要通过调用`setFont`将加粗厚的文本刷新到表格中即可，这些功能具备相似性，如下是完整的代码实现；

```c
// 设置表格居中对齐
void MainWindow::on_pushButton_clicked()
{
    if (!selection->hasSelection())
    {
        return;
    }

    QModelIndexList selectedIndex=selection->selectedIndexes();

    QModelIndex Index;
    QStandardItem *Item;

    for (int i=0; i<selectedIndex.count(); i++)
    {
        Index=selectedIndex.at(i);
        Item=model->itemFromIndex(Index);
        Item->setTextAlignment(Qt::AlignHCenter);
    }
}

// 设置表格左对齐
void MainWindow::on_pushButton_2_clicked()
{
    // 没有选择的项
    if (!selection->hasSelection())
    {
        return;
    }

    // 获取选择的单元格的模型索引列表，可以是多选
    QModelIndexList selectedIndex=selection->selectedIndexes();

    for (int i=0;i<selectedIndex.count();i++)
    {
        QModelIndex aIndex=selectedIndex.at(i);             // 获取其中的一个模型索引
        QStandardItem* aItem=model->itemFromIndex(aIndex);  // 获取一个单元格的项数据对象
        aItem->setTextAlignment(Qt::AlignLeft);             // 设置文字对齐方式
    }
}

// 设置表格右对齐
void MainWindow::on_pushButton_3_clicked()
{
    if (!selection->hasSelection())
    {
        return;
    }

    QModelIndexList selectedIndex=selection->selectedIndexes();

    QModelIndex aIndex;
    QStandardItem *aItem;

    for (int i=0;i<selectedIndex.count();i++)
    {
        aIndex=selectedIndex.at(i);
        aItem=model->itemFromIndex(aIndex);
        aItem->setTextAlignment(Qt::AlignRight);
    }
}

// 设置字体加粗显示
void MainWindow::on_pushButton_4_clicked()
{
    if (!selection->hasSelection())
    {
        return;
    }

    // 获取选择单元格的模型索引列表
    QModelIndexList selectedIndex=selection->selectedIndexes();

    for (int i=0;i<selectedIndex.count();i++)
    {
        QModelIndex aIndex=selectedIndex.at(i);            // 获取一个模型索引
        QStandardItem* aItem=model->itemFromIndex(aIndex); // 获取项数据
        QFont font=aItem->font();                          // 获取字体
        font.setBold(true);                                // 设置字体是否粗体
        aItem->setFont(font);                              // 重新设置字体
    }
}
```

读者可依此点击下图的四个按钮来实习那对不同表格元素的个性化处理，当然如果需要保存这些状态，则还需要单独存储表格中的状态值，在运行程序后依次设置即可；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/56e3b093e2c715ec7adca984f498d31d%5B1%5D.png)