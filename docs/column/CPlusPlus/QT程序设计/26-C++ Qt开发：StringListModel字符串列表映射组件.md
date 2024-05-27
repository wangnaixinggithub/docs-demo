# C++ Qt开发：StringListModel字符串列表映射组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`QStringListModel`字符串映射组件的常用方法及灵活运用。

`QStringListModel` 是 Qt 中用于处理字符串列表数据的模型类之一，它是 `QAbstractListModel` 的子类，用于在 Qt 的视图类（如 `QListView`、`QComboBox` 等）中显示字符串列表。该组件是用于在`Qt`中快速显示字符串列表的便捷模型类。该组件通常会配合`ListView`一起使用，例如将`ListView`组件与`Model`模型绑定，当`ListView`组件内有数据更新时，就可以利用映射将数据模型中的数值以字符串格式提取出来，同理也可实现将字符串赋值到指定的`ListView`组件内。

以下是对 `QStringListModel` 的概述：

- **继承关系：** `QStringListModel` 继承自 `QAbstractListModel`。
- **用途：** `QStringListModel` 主要用于将字符串列表（`QStringList`）与视图进行绑定，使得这些字符串可以在视图中显示和管理。
- 特点：
  - 可以通过 `setStringList` 方法设置字符串列表。
  - 提供了获取和设置数据的接口，可以通过模型索引访问和修改数据。
  - 适用于显示简单的字符串列表，不涉及复杂的数据结构。
- 常见操作：
  - **设置字符串列表：** 使用 `setStringList` 方法设置要在视图中显示的字符串列表。
  - **获取字符串列表：** 使用 `stringList` 方法获取当前模型中的字符串列表。
  - **访问和修改数据：** 可以使用模型索引通过 `data` 方法获取数据，通过 `setData` 方法修改数据。

以下是 `QStringListModel` 的一些常用方法，说明以及概述，按表格形式呈现：

| 方法                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QStringListModel(QObject * parent = nullptr)`               | 构造函数，创建一个 `QStringListModel` 对象。                 |
| `QStringListModel(const QStringList & strings, QObject * parent = nullptr)` | 构造函数，创建一个包含指定字符串列表的 `QStringListModel` 对象。 |
| `QStringList stringList() const`                             | 获取当前模型中的字符串列表。                                 |
| `void setStringList(const QStringList & strings)`            | 设置模型中的字符串列表。                                     |
| `Qt::ItemFlags flags(const QModelIndex & index) const`       | 返回指定索引处的项目标志。                                   |
| `QModelIndex index(int row, int column, const QModelIndex & parent = QModelIndex()) const` | 返回指定行、列和父索引的模型索引。                           |
| `QModelIndex parent(const QModelIndex & child) const`        | 返回指定子索引的父索引。                                     |
| `int rowCount(const QModelIndex & parent = QModelIndex()) const` | 返回给定父索引下的行数。                                     |
| `int columnCount(const QModelIndex & parent = QModelIndex()) const` | 返回给定父索引下的列数。                                     |
| `QVariant data(const QModelIndex & index, int role = Qt::DisplayRole) const` | 返回给定索引处的角色为 `role` 的数据。                       |
| `bool setData(const QModelIndex & index, const QVariant & value, int role = Qt::EditRole)` | 设置给定索引处的角色为 `role` 的数据为 `value`。             |
| `bool insertRows(int row, int count, const QModelIndex & parent = QModelIndex())` | 在给定父索引下的 `row` 位置处插入 `count` 行。               |
| `bool removeRows(int row, int count, const QModelIndex & parent = QModelIndex())` | 从给定父索引下的 `row` 位置开始删除 `count` 行。             |

显示详细信息

这些方法使 `QStringListModel` 可以方便地管理和操作字符串列表数据，并能够与 Qt 的视图组件集成，实现数据的显示和交互。

首先绘制`UI`界面，如下图中所示，左侧是一个`ListView`组件，右侧是一个`PlainTextEdit`组件；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/28a0cd3be8c214cd0d782d8ee59c0c4c%5B1%5D.png)

### 1.1 初始化模型

如下代码演示了如何在 `MainWindow` 中使用 `QStringListModel` 和 `QListView` 来展示一个字符串列表。

以下是该代码的一些说明：

1. 在构造函数中，首先使用 `QStringList theStringList` 创建了一个字符串列表，并向其中添加了一些城市名称。
2. 接着，创建了一个 `QStringListModel` 对象 `model` 并使用 `setStringList` 方法将先前创建的字符串列表导入模型中。
3. 然后，通过 `ui->listView->setModel(model)` 将模型设置到 `QListView` 中，从而使模型中的数据在 `QListView` 中显示。
4. 使用 `setEditTriggers` 方法设置了编辑触发器，使得可以通过双击或选择项目来触发编辑操作。

这样，通过 `QStringListModel` 和 `QListView` 的结合使用，可以很方便地在界面上展示和管理字符串列表的数据。

```c
#include <iostream>
#include <QStringList>
#include <QStringListModel>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 初始化一个StringList字符串列表
    QStringList theStringList;
    theStringList << "北京" << "上海" << "广州" << "深圳" << "山东" << "四川";

    // 创建并使用数据模型
    model = new QStringListModel(this);

    // 导入模型数据
    model->setStringList(theStringList);

    // 为listView设置模型
    ui->listView->setModel(model);
    ui->listView->setEditTriggers(QAbstractItemView::DoubleClicked |
                                  QAbstractItemView::SelectedClicked);
}

MainWindow::~MainWindow()
{
    delete ui;
}
```

运行后左侧的`ListView`组将将被初始化为城市地址，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/48d5a876e4d014b99041b136659f0e8c%5B1%5D.png)

### 1.2 添加与插入

如下代码演示了如何在 `MainWindow` 中通过按钮的点击事件向 `QStringListModel` 中添加或插入数据。

以下是代码的一些说明：

1. `on_btnListAppend_clicked` 方法用于在 `QStringListModel` 的末尾添加一行。具体步骤包括：
   - 使用 `insertRow` 在模型的末尾插入一行。
   - 获取最后一行的索引。
   - 从界面的 `lineEdit` 获取输入的文本。
   - 使用 `setData` 方法将文本设置到模型的指定索引处。
   - 使用 `setCurrentIndex` 方法将最后一行设置为当前选中行。
   - 清空输入框。
2. `on_btnListInsert_clicked` 方法用于在当前选中行的前面插入一行。具体步骤包括：
   - 获取当前选中行的索引。
   - 使用 `insertRow` 在当前行的前面插入一行。
   - 从界面的 `lineEdit` 获取输入的文本。
   - 使用 `setData` 方法将文本设置到模型的指定索引处。
   - 使用 `setData` 方法设置对齐方式为右对齐。
   - 使用 `setCurrentIndex` 方法将当前行设置为当前选中行。

这样，通过这两个按钮的点击事件，可以向 `QStringListModel` 中添加或插入数据，并在 `QListView` 中进行显示。

```c
// 添加一行
void MainWindow::on_btnListAppend_clicked()
{
    model->insertRow(model->rowCount());                       // 在尾部插入一行
    QModelIndex index = model->index(model->rowCount()-1,0);   // 获取最后一行的索引
    QString LineText = ui->lineEdit->text();
    
    model->setData(index,LineText,Qt::DisplayRole);            // 设置显示文字
    ui->listView->setCurrentIndex(index);                      // 设置当前行选中
    ui->lineEdit->clear();
}

// 插入一行数据到ListView
void MainWindow::on_btnListInsert_clicked()
{
    QModelIndex index;

    index= ui->listView->currentIndex();             // 获取当前选中行
    model->insertRow(index.row());                   // 在当前行的前面插入一行
    
    QString LineText = ui->lineEdit->text();
    model->setData(index,LineText,Qt::DisplayRole);             // 设置显示文字
    model->setData(index,Qt::AlignRight,Qt::TextAlignmentRole); // 设置对其方式
    ui->listView->setCurrentIndex(index);                       // 设置当前选中行
}
```

运行后输出如下图，使用`SetData`则可以在`index`位置设置字符串，并最终`setCurrentIndex`设置到当前下标处；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/4af10051387088e8faf07b4abfa3ada5%5B1%5D.png)

### 1.3 转换字符串

如下代码演示了如何通过按钮的点击事件将 `QStringListModel` 的数据导入到 `QPlainTextEdit` 中。

以下是代码的一些说明：

- 使用 `stringList` 方法获取数据模型的字符串列表。
- 清空 `QPlainTextEdit`，准备追加数据。
- 循环遍历字符串列表，并将每个字符串追加到 `QPlainTextEdit` 中，每个字符串之间用逗号隔开。

这样，通过这个按钮的点击事件，可以将 `QStringListModel` 中的数据导入到 `QPlainTextEdit` 中。

```c
// 显示数据模型文本到QPlainTextEdit
void MainWindow::on_btnTextImport_clicked()
{
    QStringList pList;

    pList = model->stringList();    // 获取数据模型的StringList
    ui->plainTextEdit->clear();     // 先清空文本框

    // 循环追加数据
    for(int x=0;x< pList.count();x++)
    {
        ui->plainTextEdit->appendPlainText(pList.at(x) + QString(","));
    }
}
```

当点击显示数据模型时，则会将列表转换为字符串并按照特定格式输出到编辑框内，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/87f1bb06f70ef366cec14696fcdb76da%5B1%5D.png)