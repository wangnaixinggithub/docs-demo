# C++ Qt开发：QItemDelegate自定义代理组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`QStyledItemDelegate`自定义代理组件的常用方法及灵活运用。

在Qt中，`QStyledItemDelegate` 类是用于创建自定义表格视图（如`QTableView`和`QTableWidget`）的委托类，允许你自定义表格中每个单元格的外观和交互。`QStyledItemDelegate` 是`QItemDelegate` 的子类，提供了更现代、更易用的接口。此处我们将实现对`QTableView`表格组件的自定义代理功能，例如默认情况下表格中的缺省代理就是一个编辑框，我们只能够在编辑框内输入数据，而有时我们想选择数据而不是输入，此时就需要重写编辑框实现选择的效果，代理组件常用于个性化定制表格中的字段类型。

### 1.1 概述代理类

代理类的作用是用来实现组件重写的，例如`TableView`中默认是可编辑的，之所以可编辑是因为Qt默认为我们重写了`QLineEdit`编辑框实现的，也可理解为将组件嵌入到了表格中，实现了对表格的编辑功能。

在自定义代理中`QAbstractItemDelegate`是所有代理类的抽象基类，它用于创建自定义的项委托。提供了一个基本的框架，使得可以定制如何在视图中绘制和编辑数据项。

`QAbstractItemDelegate` 是 `QItemDelegate` 的基类，而 `QItemDelegate` 则是 `QStyledItemDelegate` 的基类。这个继承体系提供了不同层次的定制能力。我们继承任何组件时都必须要包括如下4个函数：

- CreateEditor() 用于创建编辑模型数据的组件，例如(QSpinBox组件)
- SetEditorData() 从数据模型获取数据，以供Widget组件进行编辑
- SetModelData() 将Widget组件上的数据更新到数据模型
- UpdateEditorGeometry() 给Widget组件设置一个合适的大小

通过继承 `QAbstractItemDelegate` 并实现这些函数，读者可创建一个定制的项委托，用于控制数据项在视图中的外观和交互行为。此处我们分别重写三个代理接口，其中两个`ComBox`组件用于选择婚否，而第三个`SpinBox`组件则用于调节数值范围，先来定义三个重写部件。

### 1.2 自定义代理组件

这里我们以第一个`SpinBox`组件为例，要实现代理该组件，首先需要在项目上新建一个`SpinDelegate`类，并依次实现上述的四个方法，先来开创建流程；

- 选择`addnew`选中 `C++ Class` 输入自定义类名称`QWintSpinDelegate`，然后基类继承`QStyledItemDelegate/QMainWindow`，然后下一步结束向导，同理其他功能的创建也如此。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9b39af2803ed64637cf7e44df7d3a7a7%5B1%5D.png)



接着就是对该接口的重写了，此处重写代码`spindelegate.cpp`如下所示，其关键位置的解释可参考注释部分。

```c
#include "spindelegate.h"
#include <QSpinBox>

QWIntSpinDelegate::QWIntSpinDelegate(QObject *parent):QStyledItemDelegate(parent)
{
}

// 创建代理编辑组件
QWidget *QWIntSpinDelegate::createEditor(QWidget *parent,const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    Q_UNUSED(option);
    Q_UNUSED(index);

    QSpinBox *editor = new QSpinBox(parent);  // 创建一个QSpinBox
    editor->setFrame(false);                  // 设置为无边框
    editor->setMinimum(0);
    editor->setMaximum(10000);
    return editor;                            // 返回此编辑器
}

// 从数据模型获取数据，显示到代理组件中
void QWIntSpinDelegate::setEditorData(QWidget *editor,const QModelIndex &index) const
{
    // 获取数据模型的模型索引指向的单元的数据
    int value = index.model()->data(index, Qt::EditRole).toInt();

    QSpinBox *spinBox = static_cast<QSpinBox*>(editor);   // 强制类型转换
    spinBox->setValue(value);                             // 设置编辑器的数值
}

// 将代理组件的数据，保存到数据模型中
void QWIntSpinDelegate::setModelData(QWidget *editor, QAbstractItemModel *model, const QModelIndex &index) const
{
    QSpinBox *spinBox = static_cast<QSpinBox*>(editor); // 强制类型转换
    spinBox->interpretText();                           // 解释数据，如果数据被修改后，就触发信号
    int value = spinBox->value();                       // 获取spinBox的值
    model->setData(index, value, Qt::EditRole);         // 更新到数据模型
}

// 设置组件大小
void QWIntSpinDelegate::updateEditorGeometry(QWidget *editor, const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    Q_UNUSED(index);
    editor->setGeometry(option.rect);
}
```

接着重写接口`floatspindelegate.cpp`实现代码如上述部分一致，唯一的变化是组件变了，代码如下；

```c
#include "floatspindelegate.h"
#include <QDoubleSpinBox>

QWFloatSpinDelegate::QWFloatSpinDelegate(QObject *parent):QStyledItemDelegate(parent)
{
}

QWidget *QWFloatSpinDelegate::createEditor(QWidget *parent,
   const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    Q_UNUSED(option);
    Q_UNUSED(index);

    QDoubleSpinBox *editor = new QDoubleSpinBox(parent);
    editor->setFrame(false);
    editor->setMinimum(0);
    editor->setDecimals(2);
    editor->setMaximum(10000);

    return editor;
}

void QWFloatSpinDelegate::setEditorData(QWidget *editor,
                      const QModelIndex &index) const
{
    float value = index.model()->data(index, Qt::EditRole).toFloat();
    QDoubleSpinBox *spinBox = static_cast<QDoubleSpinBox*>(editor);
    spinBox->setValue(value);
}

void QWFloatSpinDelegate::setModelData(QWidget *editor, QAbstractItemModel *model, const QModelIndex &index) const
{
    QDoubleSpinBox *spinBox = static_cast<QDoubleSpinBox*>(editor);
    spinBox->interpretText();
    float value = spinBox->value();
    QString str=QString::asprintf("%.2f",value);

    model->setData(index, str, Qt::EditRole);
}

void QWFloatSpinDelegate::updateEditorGeometry(QWidget *editor, const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    editor->setGeometry(option.rect);
}
```

最后重写接口`comboxdelegate.cpp`其代码如下所示；

```c
#include "comboxdelegate.h"
#include <QComboBox>

QWComboBoxDelegate::QWComboBoxDelegate(QObject *parent):QItemDelegate(parent)
{

}

QWidget *QWComboBoxDelegate::createEditor(QWidget *parent,const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    QComboBox *editor = new QComboBox(parent);

    editor->addItem("已婚");
    editor->addItem("未婚");
    editor->addItem("单身");

    return editor;
}

void QWComboBoxDelegate::setEditorData(QWidget *editor, const QModelIndex &index) const
{
    QString str = index.model()->data(index, Qt::EditRole).toString();

    QComboBox *comboBox = static_cast<QComboBox*>(editor);
    comboBox->setCurrentText(str);
}

void QWComboBoxDelegate::setModelData(QWidget *editor, QAbstractItemModel *model, const QModelIndex &index) const
{
    QComboBox *comboBox = static_cast<QComboBox*>(editor);
    QString str = comboBox->currentText();
    model->setData(index, str, Qt::EditRole);
}

void QWComboBoxDelegate::updateEditorGeometry(QWidget *editor,const QStyleOptionViewItem &option, const QModelIndex &index) const
{
    editor->setGeometry(option.rect);
}
```

将部件导入到`mainwindow.cpp`主程序中，并将其通过`ui->tableView->setItemDelegateForColumn(0,&intSpinDelegate);`关联部件到指定的`table`下标索引上面。

```c
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 初始化模型数据
    model = new QStandardItemModel(4,6,this);      // 初始化4行,每行六列
    selection = new QItemSelectionModel(model);    // 关联模型

    ui->tableView->setModel(model);
    ui->tableView->setSelectionModel(selection);

    // 添加表头
    QStringList HeaderList;
    HeaderList << "序号" << "姓名" << "年龄" << "性别" << "婚否" << "薪资";
    model->setHorizontalHeaderLabels(HeaderList);

    // 批量添加数据
    QStringList DataList[3];
    QStandardItem *Item;

    DataList[0] << "1001" << "admin" << "24" << "男" << "已婚" << "4235.43";
    DataList[1] << "1002" << "guest" << "23" << "男" << "未婚" << "20000.21";
    DataList[2] << "1003" << "lucy" << "37" << "女" << "单身" << "8900.23";

    int Array_Length = DataList->length();                          // 获取每个数组中元素数
    int Array_Count = sizeof(DataList) / sizeof(DataList[0]);       // 获取数组个数

    for(int x=0; x<Array_Count; x++)
    {
        for(int y=0; y<Array_Length; y++)
        {
            // std::cout << DataList[x][y].toStdString().data() << std::endl;
            Item = new QStandardItem(DataList[x][y]);
            model->setItem(x,y,Item);
        }
    }

    // 为各列设置自定义代理组件
    // 0，4，5 代表第几列 后面的函数则是使用哪个代理类的意思
    ui->tableView->setItemDelegateForColumn(0,&intSpinDelegate);
    ui->tableView->setItemDelegateForColumn(4,&comboBoxDelegate);
    ui->tableView->setItemDelegateForColumn(5,&floatSpinDelegate);
}

MainWindow::~MainWindow()
{
    delete ui;
}
```

运行后，序号部分与薪资部分将变成一个`SpinBox`组件，读者可自行调节大小，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6c33c19d56996e8fae368ad756047dd9%5B1%5D.png)



而婚否字段将被重写成一个`ComBoBox`组件，这有助于让用户直接选择一个状态，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/49f73174e61436c3408b08ca52ef2228%5B1%5D.png)