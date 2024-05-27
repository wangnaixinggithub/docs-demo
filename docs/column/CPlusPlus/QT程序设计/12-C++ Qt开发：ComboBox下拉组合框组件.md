# C++ Qt开发：ComboBox下拉组合框组件



在Qt中，ComboBox（组合框）是一种常用的用户界面控件，它提供了一个下拉列表，允许用户从预定义的选项中选择一个。该组件提供了一种方便的方式让用户从预定义的选项中进行选择，一般来说ComboBox会以按钮的形式显示在界面上，用户点击按钮后，会弹出一个下拉列表，其中包含预定义的选项。当然ComboBox不仅局限于选择，也允许用户手动输入内容。



下面是QComboBox类的一些常用方法的说明和概述，按照表格形式列出：

|                           **方法**                           |                           **描述**                           |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|            `QComboBox(QWidget *parent = nullptr)`            |                 构造函数，创建一个组件对象。                 |
| `addItem(const QString &text, const QVariant &userData = QVariant())` |             向组件添加一个项，可以附带用户数据。             |
|             `addItems(const QStringList &texts)`             |              向组件添加多个项，使用字符串列表。              |
| `insertItem(int index, const QString &text, const QVariant &userData = QVariant())` |                   在指定索引处插入一个项。                   |
|      `insertItems(int index, const QStringList &texts)`      |                   在指定索引处插入多个项。                   |
|                   `removeItem(int index)`                    |                     移除指定索引处的项。                     |
|                          `clear()`                           |                     清除组件中的所有项。                     |
|                 `setCurrentIndex(int index)`                 |                 设置组件当前选择的项的索引。                 |
|                       `currentText()`                        |                  返回当前组件中显示的文本。                  |
|                       `currentIndex()`                       |                返回当前组件中选择的项的索引。                |
|                          `count()`                           |                     返回组件中项的总数。                     |
|                    `itemText(int index)`                     |                   返回指定索引处项的文本。                   |
|        `itemData(int index, int role = Qt::UserRole)`        |                 返回指定索引处项的用户数据。                 |
|        `setItemText(int index, const QString &text)`         |                   设置指定索引处项的文本。                   |
| `setItemData(int index, const QVariant &value, int role = Qt::UserRole)` |                为指定索引处项设置额外的数据。                |
|                      `clearEditText()`                       |                     清除组件的编辑文本。                     |
|                 `setEditable(bool editable)`                 |    设置组件是否可编辑。如果可编辑，用户可以手动输入文本。    |
|                    `setMaxCount(int max)`                    | 设置组件中显示的最大项数。如果超过该数目，将出现垂直滚动条。 |
|          `setMinimumContentsLength(int characters)`          |          设置组件的最小内容长度，以便显示完整的项。          |
|            `setModel(QAbstractItemModel *model)`             |  设置组件的数据模型。通过模型，可以更灵活地管理组件中的项。  |
|                           `view()`                           |             返回组件的视图，允许对视图进行定制。             |
|                          `clear()`                           |                     清除组件中的所有项。                     |
|                        `showPopup()`                         |                     打开组件的下拉列表。                     |
|                        `hidePopup()`                         |                     隐藏组件的下拉列表。                     |
|                    `activated(int index)`                    |              信号，当用户选择组件中的项时发出。              |
|               `currentIndexChanged(int index)`               |            信号，当组件中的当前项发生变化时发出。            |

上述这些方法提供了对ComboBox进行配置、管理和与之交互的灵活性。你可以根据具体的应用需求使用这些方法，使ComboBox在你的Qt应用程序中按照期望的方式工作。



如下图所示，我们分别增加三个ComboBox组件，其中前两个组件是默认的，最后一个是Font ComboBox字体选择框，其实该选择框也是标准选择框的模板，只不过其默认为我们初始化了系统字体方便选择而已但在使用上与ComboBox是一致的。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401175510033.png)



通常情况下使用ComboBox组件与前几章中所示案例保持一致，只需要通过ui->comboBox_Main->调用不同的属性即可实现赋值或取值，此处我们来演示一个更复杂的需求，实现选择组件的联动效果，即用户选择主选择框时自动列出该主选择框的子项，这也是开发中最常见的需求。





首先我们先来演示一下如何向Main选择框内批量追加选项，为了能更好的展示图标的导入，此处分别增加browser alt.ico和ksirtet.ico两个ICO图标，读者可通过 《C++ Qt开发：PushButton按钮组件》中所使用的方法将图标导入，接着在主函数初始化中我们可以使用以下代码将其初始化。

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    QIcon icon;
    icon.addFile(":/image/ksirtet.ico");

    // 填充第一个Main
    for(int x=0;x<10;x++)
    {
        ui->comboBox_Main->addItem(icon,QString::asprintf("元素_%d",x));
    }

    // 填充第二个SubMain
    icon.addFile(":/image/browser alt.ico");
    for(int x=0;x<10;x++)
    {
        ui->comboBox_SubMain->addItem(icon,QString::asprintf("元素_%d",x));
    }
}

```

运行上述代码片段，则可以输出如下图所示的效果，可以看到两个选择框已被初始化。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401175612903-17119653741662.png)



接着我们来实现菜单的联动，该功能的实现依赖于`QMap`容器，其中Key定义地区，而Value值则定义一个`QList`该容器类存储特定地区的城市，如下核心代码中`MainWindow`用于初始化，将默认的`comboBox_Main`填充为四大地区，依次初始化`map`容器映射。

```c
#include <iostream>
#include <QList>
#include <QMap>

// --------------------------------------
// 定义全局变量
// --------------------------------------

// 存储城市与ID
QMap<QString,int> City_Zone;

// 存储地区与城市
QMap<QString,QList <QString>> map;

// 临时变量
QList<QString> tmp;

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // --------------------------------------------
    // comboBox_Main设置主菜单
    ui->comboBox_Main->clear();
    QStringList str;
    str << "北京" << "上海" << "广州" << "深圳";

    // 添加元素到主菜单
    ui->comboBox_Main->addItems(str);

    // 依次设置图标
    ui->comboBox_Main->setItemIcon(0,QIcon(":/image/ksirtet.ico"));
    ui->comboBox_Main->setItemIcon(1,QIcon(":/image/ksirtet.ico"));
    ui->comboBox_Main->setItemIcon(2,QIcon(":/image/ksirtet.ico"));
    ui->comboBox_Main->setItemIcon(3,QIcon(":/image/ksirtet.ico"));

    // --------------------------------------------
    // 设置城市和序号
    ui->comboBox_Main->clear();
    City_Zone.insert("请选择",0);
    City_Zone.insert("北京",1);
    City_Zone.insert("上海",2);
    City_Zone.insert("广州",3);
    City_Zone.insert("深圳",4);

    // --------------------------------------------
    // 循环填充一级菜单
    ui->comboBox_Main->clear();
    foreach(const QString &str,City_Zone.keys())
    {
        ui->comboBox_Main->addItem(QIcon(":/image/ksirtet.ico"),str,City_Zone.value(str));
    }

    // --------------------------------------------
    // 插入二级菜单
    tmp.clear();
    tmp << "大兴区" << "昌平区" << "东城区" << "西城区";
    map["北京"] = tmp;

    tmp.clear();
    tmp << "黄浦区" << "徐汇区" << "长宁区" << "杨浦区";
    map["上海"] = tmp;

    tmp.clear();
    tmp << "荔湾区" << "越秀区" << "花都区" << "增城区";
    map["广州"] = tmp;

    tmp.clear();
    tmp << "罗湖区" << "福田区" << "龙岗区" << "光明区";
    map["深圳"] = tmp;

    // 设置默认选择第4个
    ui->comboBox_Main->setCurrentIndex(4);
}

```

菜单联动的第二部则是对特定槽函数的实现，当我们点击`comboBox_Main`组件时，触发`currentTextChanged(QString)`槽函数，此时只需要在全局`map`容器内提取出所需要的子标签，并依次赋值到`comboBox_SubMain`组件内即可，代码如下所示；

```c
// 触发子标签填充
void MainWindow::on_comboBox_Main_currentTextChanged(const QString &arg1)
{
    ui->comboBox_SubMain->clear();
    QList<QString> qtmp;

    qtmp = map.value(arg1);
    for(int x=0;x<qtmp.count();x++)
    {
        ui->comboBox_SubMain->addItem(QIcon(":/image/browser alt.ico"),qtmp[x]);
    }
}

// 触发按钮点击
void MainWindow::on_pushButton_clicked()
{
    QString one = ui->comboBox_Main->currentText();
    QString two = ui->comboBox_SubMain->currentText();
    std::cout << one.toStdString().data() << " | " << two.toStdString().data() << std::endl;
}

```

运行后输出效果如下，当读者选择主选择框时子选择框将被填充，此时读者只需要根据标签号的对应关系，即可判断用户选择了那个选项。





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401205100723-17119758617951.png)
