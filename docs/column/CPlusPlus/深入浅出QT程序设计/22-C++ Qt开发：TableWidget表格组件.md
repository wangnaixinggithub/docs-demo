# C++ Qt开发：TableWidget表格组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`TableWidget`表格组件的常用方法及灵活运用。

`QTableWidget` 是 Qt 中用于显示表格数据的部件。它是 `QTableView` 的子类，提供了一个简单的接口，适用于一些不需要使用自定义数据模型的简单表格场景。该组件可以看作是`TreeWidget`树形组件的高级版，表格组件相比于树结构组件灵活性更高，不仅提供了输出展示二维表格功能，还可以直接对表格元素直接进行编辑与修改操作，表格结构分为表头，表中数据两部分，表格结构可看作一个二维数组，通过数组行列即可锁定特定元素。

以下是 `QTableWidget` 类的一些常用方法的简要说明：

| 方法                                                   | 描述                                           |
| ------------------------------------------------------ | ---------------------------------------------- |
| `setItem(int row, int column, QTableWidgetItem *item)` | 设置指定行和列的项                             |
| `item(int row, int column) const`                      | 返回指定行和列的项                             |
| `setRowCount(int rows)`                                | 设置表格的行数                                 |
| `setColumnCount(int columns)`                          | 设置表格的列数                                 |
| `rowCount() const`                                     | 返回表格的行数                                 |
| `columnCount() const`                                  | 返回表格的列数                                 |
| `setHorizontalHeaderLabels(const QStringList &labels)` | 设置水平表头的标签                             |
| `setVerticalHeaderLabels(const QStringList &labels)`   | 设置垂直表头的标签                             |
| `setItemPrototype(QTableWidgetItem *item)`             | 设置原型项，用于在新插入的单元格中创建副本     |
| `insertRow(int row)`                                   | 在指定行插入新行                               |
| `removeRow(int row)`                                   | 移除指定行                                     |
| `insertColumn(int column)`                             | 在指定列插入新列                               |
| `removeColumn(int column)`                             | 移除指定列                                     |
| `clear()`                                              | 清空表格的所有内容                             |
| `clearContents()`                                      | 清空表格的所有单元格的内容，但保留表头和行列数 |
| `itemAt(int x, int y) const`                           | 返回给定坐标下的项                             |
| `setCurrentItem(QTableWidgetItem *item)`               | 设置当前项，用于指定当前被选择的项             |
| `currentItem() const`                                  | 返回当前被选择的项                             |
| `setCurrentCell(int row, int column)`                  | 设置当前单元格，用于指定当前被选择的单元格     |
| `currentRow() const`                                   | 返回当前被选择的行号                           |
| `currentColumn() const`                                | 返回当前被选择的列号                           |
| `setItemDelegate(QAbstractItemDelegate *delegate)`     | 设置项代理，用于自定义单元格的显示和编辑方式   |
| `setSortingEnabled(bool enable)`                       | 启用或禁用排序功能                             |
| `sortItems(int column, Qt::SortOrder order)`           | 对指定列进行排序                               |
| `setEditTriggers(EditTriggers triggers)`               | 设置触发编辑的事件                             |
| `editItem(QTableWidgetItem *item)`                     | 编辑指定项的内容                               |
| `openPersistentEditor(QTableWidgetItem *item)`         | 打开指定项的持久编辑器                         |
| `closePersistentEditor(QTableWidgetItem *item)`        | 关闭指定项的持久编辑器                         |
| `itemChanged(QTableWidgetItem *item)`                  | 当项的内容发生变化时发出的信号                 |
| `cellClicked(int row, int column)`                     | 单元格被单击时发出的信号                       |
| `cellDoubleClicked(int row, int column)`               | 单元格被双击时发出的信号                       |

显示详细信息

这些方法提供了对 `QTableWidget` 的基本操作和配置的途径。使用这些方法，你可以动态地调整表格的大小、内容，设置表头，进行排序，处理编辑触发事件等。

首先我们准备好`UI`界面部分，该界面包含的元素较为复杂，如果找不到这些组件可以参考文章底部的完整案例代码；

![img](https://img-blog.csdnimg.cn/img_convert/9353f8f78b310c9bb7e5a1515a7b1093.png)

### 1.1 设置初始表格

如下代码演示了如何使用 `QTableWidget` 设置表头。

以下是关于该代码的一些解释：

1. `setHorizontalHeaderLabels` 方法用于设置水平表头的标签。在这里，`headerText_Row` 是一个包含列标签的字符串列表，每个字符串对应一个表格列。
2. 如果需要设置垂直表头，可以使用 `setVerticalHeaderLabels` 方法，将一个包含行标签的字符串列表传递给它。
3. 可以通过循环设置表头的每个单元格的属性。在这里，使用了循环遍历列并创建一个 `QTableWidgetItem`，设置其字体为粗体、字体大小为8，字体颜色为黑色，然后将其设置为相应列的水平表头项。

这样，通过设置表头的不同属性，可以使表格更具可读性和美观性。

```c
// 设置表头的实现
void MainWindow::on_pushButton_clicked()
{
    QTableWidgetItem *headerItem;
    QStringList headerText_Row,headerText_Col;
    headerText_Row << "姓 名" << "性 别" << "出生日期" << "民 族" << "分数" << "是否党员";
    //headerText_Col << "第一行" << "第二行";

    // 设置为水平表头
    ui->tableWidget->setHorizontalHeaderLabels(headerText_Row);

    // 设置垂直表头
    //ui->tableWidget->setVerticalHeaderLabels(headerText_Col);

    // 另一种方式: 通过循环设置
    ui->tableWidget->setColumnCount(headerText_Row.count());       // 列数设置为与headerText_Row的列相等
    for (int i=0;i<ui->tableWidget->columnCount();i++)             // 列编号从0开始
    {
       headerItem=new QTableWidgetItem(headerText_Row.at(i));      // headerText.at(i) 获取headerText的i行字符串
       QFont font=headerItem->font();                              // 获取原有字体设置
       font.setBold(true);                                         // 设置为粗体
       font.setPointSize(8);                                       // 设置字体大小
       headerItem->setTextColor(Qt::black);                        // 设置字体颜色
       headerItem->setFont(font);                                  // 设置字体
       ui->tableWidget->setHorizontalHeaderItem(i,headerItem);     // 设置表头单元格的Item
    }
}
```

如下代码演示了如何从 `QSpinBox` 中读取数量，并将其设置为 `QTableWidget` 表格的行数。

以下是关于该代码的一些解释：

1. 通过 `ui->spinBox->value()` 读取 `QSpinBox` 中的值，即用户选择的数量。
2. 使用 `setRowCount` 方法将读取到的数量设置为表格的行数。
3. `setAlternatingRowColors(true)` 用于交替设置行的底色，以提高可读性。此方法在交替的行之间使用不同的颜色。

通过这样的操作，可以动态地设置表格的行数，以适应用户的需求。

```c
// 从spinBox中读出数量,并设置TableWidget表格的行数
void MainWindow::on_pushButton_2_clicked()
{
    // 读取出spinBox中的数据,并将其设置到表格中
    ui->tableWidget->setRowCount(ui->spinBox->value());

    // 行的底色交替采用不同颜色
    ui->tableWidget->setAlternatingRowColors(true);
}
```

运行程序，分别点击设置表头与设置行数，此时读者会看到如下图所示的输出效果，`Table`表格被初始化了。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/25e57b8a1e298f31a1523d808a473d19%5B1%5D.png)



### 1.1 初始化表格

如下代码中的`createItemsARow`函数，用于为表格的一行创建各个单元格的 `QTableWidgetItem`。

以下是对该代码的一些解释：

1. 姓名（Name）：
   - 使用 `QTableWidgetItem` 创建一个单元格，并将其类型设置为自定义的 `MainWindow::ctName`。
   - 设置文本对齐格式为水平居中和垂直居中。
   - 使用 `setData` 方法将学号（StudID）设置为单元格的数据。
   - 将 `QTableWidgetItem` 添加到表格的指定位置。
2. 性别（Sex）：
   - 使用 `QTableWidgetItem` 创建一个单元格，并将其类型设置为自定义的 `MainWindow::ctSex`。
   - 根据性别设置对应的图标。
   - 设置文本对齐格式为水平居中和垂直居中。
   - 将 `QTableWidgetItem` 添加到表格的指定位置。
3. 出生日期（birth）：
   - 使用 `QTableWidgetItem` 创建一个单元格，并将其类型设置为自定义的 `MainWindow::ctBirth`。
   - 将日期转换为字符串，并设置为单元格的文本。
   - 设置文本对齐格式为左对齐和垂直居中。
   - 将 `QTableWidgetItem` 添加到表格的指定位置。
4. 民族（Nation）：
   - 使用 `QTableWidgetItem` 创建一个单元格，并将其类型设置为自定义的 `MainWindow::ctNation`。
   - 设置文本对齐格式为水平居中和垂直居中。
   - 将 `QTableWidgetItem` 添加到表格的指定位置。
5. 是否党员（isPM）：
   - 使用 `QTableWidgetItem` 创建一个单元格，并将其类型设置为自定义的 `MainWindow::ctPartyM`。
   - 根据是否党员设置对应的复选框状态。
   - 设置文本对齐格式为水平居中和垂直居中。
   - 设置背景颜色为黄色。
   - 将 `QTableWidgetItem` 添加到表格的指定位置。
6. 分数（score）：
   - 使用 `QTableWidgetItem` 创建一个单元格，并将其类型设置为自定义的 `MainWindow::ctScore`。
   - 将分数转换为字符串，并设置为单元格的文本。
   - 设置文本对齐格式为水平居中和垂直居中。
   - 将 `QTableWidgetItem` 添加到表格的指定位置。

通过这样的操作，可以在表格中动态地创建一行，并设置每个单元格的内容和样式。

```c
// 为一行的单元格创建Items行
void MainWindow::createItemsARow(int rowNo,QString Name,QString Sex,QDate birth,QString Nation,bool isPM,int score)
{
    QTableWidgetItem *item;
    QString str;
    uint StudID=1001;

    // -------------------------------------------------------
    // 姓名
    // -------------------------------------------------------
    // 新建一个Item 设置单元格type为自定义的MainWindow::ctName
    item=new QTableWidgetItem(Name,MainWindow::ctName);

    // 文本对齐格式
    item->setTextAlignment(Qt::AlignHCenter | Qt::AlignVCenter);

    // 学号 = 基数+ 行号
    StudID  +=rowNo;

    // 设置studID为data
    item->setData(Qt::UserRole,QVariant(StudID));

    // 为单元格设置Item
    ui->tableWidget->setItem(rowNo,MainWindow::colName,item);

    // -------------------------------------------------------
    // 性别
    // -------------------------------------------------------
    QIcon icon;

    if (Sex=="男")
    {
        icon.addFile(":/image/boy.ico");
    }
    else
    {
        icon.addFile(":/image/girl.ico");
    }

    // 新建一个Item 设置单元格type为自定义的 MainWindow::ctSex
    item=new  QTableWidgetItem(Sex,MainWindow::ctSex);
    item->setIcon(icon);

    // 为单元格设置Item
    item->setTextAlignment(Qt::AlignHCenter | Qt::AlignVCenter);

    // 为单元格设置Item
    ui->tableWidget->setItem(rowNo,MainWindow::colSex,item);

    // -------------------------------------------------------
    // 出生日期
    // -------------------------------------------------------

    // 日期转换为字符串
    str=birth.toString("yyyy-MM-dd");

    // 新建一个Item 设置单元格type为自定义的 MainWindow::ctBirth
    item=new  QTableWidgetItem(str,MainWindow::ctBirth);

    // 文本对齐格式
    item->setTextAlignment(Qt::AlignLeft | Qt::AlignVCenter);

    // 为单元格设置Item
    ui->tableWidget->setItem(rowNo,MainWindow::colBirth,item);

    // -------------------------------------------------------
    // 民族
    // -------------------------------------------------------

    // 新建一个Item 设置单元格type为自定义的 MainWindow::ctNation
    item=new  QTableWidgetItem(Nation,MainWindow::ctNation);

    // 文本对齐格式
    item->setTextAlignment(Qt::AlignHCenter | Qt::AlignVCenter);

    // 为单元格设置Item
    ui->tableWidget->setItem(rowNo,MainWindow::colNation,item);

    // -------------------------------------------------------
    // 是否党员
    // -------------------------------------------------------

    // 新建一个Item 设置单元格type为自定义的 MainWindow::ctPartyM
    item=new  QTableWidgetItem("群众",MainWindow::ctPartyM);

    // 文本对齐格式
    item->setTextAlignment(Qt::AlignHCenter | Qt::AlignVCenter);
    if (isPM)
    {
        item->setCheckState(Qt::Checked);
    }
    else
    {
        item->setCheckState(Qt::Unchecked);
    }

    // 设置为黄色
    item->setBackgroundColor(Qt::yellow);

    // 为单元格设置Item
    ui->tableWidget->setItem(rowNo,MainWindow::colPartyM,item);

    // -------------------------------------------------------
    // 分数
    // -------------------------------------------------------
    str.setNum(score);

    //新建一个Item 设置单元格type为自定义的 MainWindow::ctPartyM
    item=new  QTableWidgetItem(str,MainWindow::ctScore);

    // 文本对齐格式
    item->setTextAlignment(Qt::AlignHCenter | Qt::AlignVCenter);

    // 为单元格设置Item
    ui->tableWidget->setItem(rowNo,MainWindow::colScore,item);
}
```

接着我们来看一下如何实现初始化一个表格的，首先我们需要设置好需要填充的数据，当有了这些数据以后直接调用`createItemsARow`函数，并传入数据，至此就可以实现创建一行，通过循环的方式则可以实现多行的创建。

如下代码用于初始化表格元素，通过循环为每一行添加学生数据。

以下是代码的主要解释：

1. 清除内容：
   - 使用 `ui->tableWidget->clearContents()` 清除工作区中的内容，但不清除表格结构。
2. 循环添加行数据：
   - 获取表格的总行数，即数据区的行数。
   - 使用循环为每一行添加学生数据。
   - 使用 `QString::asprintf` 格式化字符串设置学生姓名。
   - 根据行号的奇偶性设置性别，同时设置对应的图标。
   - 调用 `createItemsARow` 方法为某一行创建各个单元格的 `QTableWidgetItem`。
3. 日期处理：
   - 初始日期设定为1997年10月7日。
   - 循环中，每次添加行后，将日期加20天。
4. 党员标志处理：
   - 使用布尔变量 `isParty` 表示学生是否为党员，每次取反。
   - 将党员标志设置为对应的复选框状态。

通过这样的初始化，表格会被填充上预设的学生数据，每一行包含姓名、性别、出生日期、民族、是否党员和分数等信息。

```c
// 初始化表格元素
void MainWindow::on_pushButton_4_clicked()
{
    QString strName,strSex;
    bool isParty=false;

    QDate birth;
    birth.setDate(1997,10,7);                // 初始化一个日期
    ui->tableWidget->clearContents();        // 只清除工作区中的内容,不清除表格

    int Rows=ui->tableWidget->rowCount();    // 数据区行数

    // 循环添加行数据
    for (int i=0;i<Rows;i++)
    {
        strName=QString::asprintf("学生%d",i);   // 学生姓名

        if ((i % 2)==0)                         // 分奇数，偶数行设置性别，及其图标
            strSex="男";
        else
            strSex="女";

        // 为某一行创建items
        createItemsARow(i, strName, strSex, birth,"汉族",isParty,70);

        // 日期加20天
        birth=birth.addDays(20);
        isParty =!isParty;
    }
}
```

运行后，通过点击初始化表格则可以实现对Table的初始化，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9cad6ead249985fb4231a18ad88dbb9f%5B1%5D.png)



这里我说一下插入行是如何实现的，插入时只需要通过`currentRow()`获取当前光标位置，接着直接调用`insertRow(CurRow)`新建一行空白数据，最后通过`createItemsARow()`向该行插入数据即可实现，同样的删除行时只需要使用`removeRow()`即可实现。

### 1.2 读数据到文本

如下代码实现了将`QTableWidget`中的数据读入文本框的功能。

以下是代码的主要解释：

1. 清空文本框：
   - 使用 `ui->textEdit->clear()` 清空文本框内容。
2. 循环遍历表格行：
   - 通过 `ui->tableWidget->rowCount()` 获取表格的行数，进行循环遍历。
3. 逐列处理数据：
   - 使用内部循环 `for (int j=0; j<ui->tableWidget->columnCount()-1; j++)` 处理每一列的数据，最后一列是党员状态，需要单独处理。
   - 获取每个单元格的 `QTableWidgetItem`。
   - 使用 `cellItem->text()` 获取单元格的文本内容。
   - 将每列的文本内容连接为一行字符串。
4. 党员状态处理：
   - 获取最后一列（党员状态列）的 `QTableWidgetItem`。
   - 使用 `cellItem->checkState()` 判断复选框的状态，根据状态判断是否为党员。
5. 添加到文本框：
   - 将每一行的字符串添加到文本框中，使用 `ui->textEdit->append(str)`。

通过这样的处理，文本框中会显示表格的内容，每一行包含每个单元格的文本内容，最后一列显示党员状态。

```c
// 将表格中的数据读入文本框: 将QTableWidget的所有行的内容提取字符串
void MainWindow::on_pushButton_8_clicked()
{
    QString str;
    QTableWidgetItem *cellItem;

    // 先清空一下
    ui->textEdit->clear();

    // 循环次数为表格行数,逐行处理
    for(int i=0;i< ui->tableWidget->rowCount();i++)
    {
        str = QString::asprintf("第 %d 行: ",i+1);    // 设置表个第0列

        // 逐列处理,但最后一列是check型,需要单独处理
        for (int j=0;j<ui->tableWidget->columnCount()-1;j++)
        {
            cellItem = ui->tableWidget->item(i,j);     // 获取到单元格的Item
            str = str + cellItem->text() + " | ";      // 连接字符串
        }

        // 最后一列的党员状态,是一个选择框,要单独判断
        cellItem = ui->tableWidget->item(i,colPartyM);

        // 根据选择框的状态来单独判断
        if(cellItem->checkState() == Qt::Checked)
            str = str + "党员";
        else
            str = str + "群众";

        // 添加到编辑框作为一行
        // ui->textEdit->appendPlainText(str);
        ui->textEdit->append(str);
    }
}
```

当读者点击将表格读入文本框后则可实现表格转文本，如下图所示；





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c156b65b85ada600fe1651a08e11805b%5B1%5D.png)