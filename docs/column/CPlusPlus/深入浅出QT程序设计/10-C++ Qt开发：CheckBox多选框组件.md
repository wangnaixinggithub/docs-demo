# C++ Qt开发：CheckBox多选框组件

`QCheckBox` 是 Qt 中用于实现复选框的组件，它提供了丰富的功能和灵活性。与之前文章中的`RadioButton`组件不同，`CheckBox`组件支持多项选择以及三态支持，即可以是选中、未选中或半选中的状态。



下面是`QCheckBox`的主要方法的概述和表格形式：



|               **方法名**               |                           **描述**                           |
| :------------------------------------: | :----------------------------------------------------------: |
| `QCheckBox(QWidget *parent = nullptr)` |             构造函数，创建一个 QCheckBox 组件。              |
|          `isChecked() const`           |    返回复选框的当前状态，选中返回 true，否则返回 false。     |
| `setCheckState(Qt::CheckState state)`  | 设置复选框的状态，可以是 Qt::Unchecked、Qt::PartiallyChecked 或 Qt::Checked。 |
|          `checkState() const`          |       返回复选框的当前状态，枚举类型 Qt::CheckState。        |
|          `setTristate(bool)`           |                 启用或禁用三态复选框的功能。                 |
|          `isTristate() const`          |               返回是否启用了三态复选框的功能。               |
|     `setCheckable(bool checkable)`     | 设置复选框是否可以被选中，true 表示可以选中，false 表示不能选中。 |
|          `isChecked() const`           |    返回复选框的当前状态，选中返回 true，否则返回 false。     |
|        `setChecked(bool check)`        |     设置复选框的状态，true 表示选中，false 表示未选中。      |
|             `text() const`             |                    返回复选框的文本标签。                    |
|     `setText(const QString &text)`     |                    设置复选框的文本标签。                    |
|          `stateChanged(int)`           | 复选框状态变化时发射的信号，参数是枚举类型 Qt::CheckState，可以是 Qt::Unchecked、Qt::PartiallyChecked 或 Qt::Checked。 |

这里分别演示一下选择框组件的使用方法，首先展示如何设置三态选择框，然后再展示一下如何通过一个选择框控制子选择框的状态，如下图是该程序的布局。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401170958532-17119626030541.png)



首先在主构造函数`MainWindow`中通过使用`setTristate()`将前三个半选框设置为三态状态，并使用`setEnabled()`将前三个选择框设置为可选择状态，代码如下所示；

```c
#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 启用三态状态并设置为可选择
    ui->checkBox_a->setTristate();
    ui->checkBox_b->setTristate();
    ui->checkBox_c->setTristate();

    // 设置为可选状态
    ui->checkBox_a->setEnabled(true);
    ui->checkBox_b->setEnabled(true);
    ui->checkBox_c->setEnabled(true);
}

MainWindow::~MainWindow()
{
    delete ui;
}

```

接着我们分别为三个选择框配置选择事件，通过在半选框中右键选中stateChanged(int)点击确定跳转到选择框的事件中来，在事件中int state参数则代表选择框传回的状态码，通过判断状态码Qt::Checked则代表选中、Qt::PartiallyChecked代表半选中、Qt::Unchecked代表未选中。

```c
// 设置第一个选择框
void MainWindow::on_checkBox_a_stateChanged(int state)
{
    // 选中状态
    if (state == Qt::Checked)
    {
       ui->checkBox_a->setText("选中");
    }
    // 半选状态
    else if(state == Qt::PartiallyChecked)
    {
       ui->checkBox_a->setText("半选中");
    }
    // 未选中
    else if(state == Qt::Unchecked)
    {
       ui->checkBox_a->setText("未选中");
    }
    // 否则恢复默认值
    else
    {
        ui->checkBox_a->setText("半选框1");
    }
}

// 设置第二个选择框
void MainWindow::on_checkBox_b_stateChanged(int state)
{
    // 选中状态
    if (state == Qt::Checked)
    {
       ui->checkBox_b->setText("选中");
    }
    // 半选状态
    else if(state == Qt::PartiallyChecked)
    {
       ui->checkBox_b->setText("半选中");
    }
    // 未选中
    else if(state == Qt::Unchecked)
    {
       ui->checkBox_b->setText("未选中");
    }
    // 否则恢复默认值
    else
    {
        ui->checkBox_b->setText("半选框2");
    }
}

// 设置第三个选择框
void MainWindow::on_checkBox_c_stateChanged(int state)
{
    // 选中状态
    if (state == Qt::Checked)
    {
       ui->checkBox_c->setText("选中");
    }
    // 半选状态
    else if(state == Qt::PartiallyChecked)
    {
       ui->checkBox_c->setText("半选中");
    }
    // 未选中
    else if(state == Qt::Unchecked)
    {
       ui->checkBox_c->setText("未选中");
    }
    // 否则恢复默认值
    else
    {
        ui->checkBox_c->setText("半选框3");
    }
}

```

至此，当选择不同的选择框时则可以切换到不同的选择状态，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401171137171-17119626983762.png)





接着来说说如何实现清除选择框的状态，当用户点击清除状态时，首先我们要做的就是调用`isChecked()`来检查每一个选择框是否被选中，如果是则通过`setChecked()`将属性设置为`false`即可，通过这种方式也可以实现对特定选择框状态的父子关联，代码如下所示；

```c
// 清除选中状态
void MainWindow::on_pushButton_clicked()
{
    // 获取选择框状态
    int checka = ui->checkBox_a->isChecked();
    int checkb = ui->checkBox_b->isChecked();
    int checkc = ui->checkBox_c->isChecked();

    // 依次重置
    if(checka == true)
    {
        ui->checkBox_a->setChecked(false);
    }
    if(checkb == true)
    {
        ui->checkBox_b->setChecked(false);
    }
    if(checkc == true)
    {
        ui->checkBox_c->setChecked(false);
    }
}

// 设置选中全部子框
void MainWindow::on_checkBox_d_stateChanged(int state)
{
    // 选中所有子框
    if(state == Qt::Checked)
    {
        ui->checkBox_e->setChecked(true);
        ui->checkBox_f->setChecked(true);
        ui->checkBox_g->setChecked(true);
        ui->checkBox_g->setChecked(true);
        ui->checkBox_h->setChecked(true);
    }
    // 取消子框全选状态
    if(state == Qt::Unchecked)
    {
        ui->checkBox_e->setChecked(false);
        ui->checkBox_f->setChecked(false);
        ui->checkBox_g->setChecked(false);
        ui->checkBox_g->setChecked(false);
        ui->checkBox_h->setChecked(false);
    }
}

```

当读者选择选中全部子框按钮时，则底部的四个`CheckBox`将会联动，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401171214246-17119627353433.png)

