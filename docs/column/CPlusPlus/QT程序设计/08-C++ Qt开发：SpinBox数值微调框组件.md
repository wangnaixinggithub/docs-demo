# C++ Qt开发：SpinBox数值微调框组件



Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍QSpinBox精度数值组件的常用方法及灵活运用。

QSpinBox是Qt框架中的一个部件（Widget），用于提供一个方便用户输入整数值的界面元素。它通常以微调框（SpinBox）的形式展现，用户可以通过微调框上的按钮或手动输入来增加或减少整数值。在实际使用中该控件主要用于整数或浮点数的计数显示，与普通的LineEdit组件不同，该组件可以在前后增加特殊符号并提供了上下幅度的调整按钮，灵活性更强。



使用场景：



- 数值输入： 适用于需要用户输入整数值的场景，如设置参数、调整数量等。
- 调整参数： 在需要进行微小调整的地方，提供直观的增减按钮。
- 限制输入范围： 当需要确保用户输入在一定范围内时，可设置最小值和最大值。
- 只读展示： 可以用于只读展示某个数值，不允许用户修改。



以下是QSpinBox类的一些常用方法，说明并概述成表格：



|                          **方法**                           |                          **描述**                          |
| :---------------------------------------------------------: | :--------------------------------------------------------: |
|            `QSpinBox(QWidget *parent = nullptr)`            |               构造函数，创建一个整数微调框。               |
|                     `int value() const`                     |                 获取当前微调框中的整数值。                 |
|                 `void setValue(int value)`                  |                    设置微调框的整数值。                    |
|                    `int minimum() const`                    |                    获取微调框的最小值。                    |
|                 `void setMinimum(int min)`                  |                    设置微调框的最小值。                    |
|                    `int maximum() const`                    |                    获取微调框的最大值。                    |
|                 `void setMaximum(int max)`                  |                    设置微调框的最大值。                    |
|                  `int singleStep() const`                   |     获取单步步进值，即微调框在每次增减操作时的变化量。     |
|               `void setSingleStep(int step)`                |                      设置单步步进值。                      |
|                    `int prefix() const`                     |              获取前缀（显示在值之前的文本）。              |
|           `void setPrefix(const QString &prefix)`           |                         设置前缀。                         |
|                    `int suffix() const`                     |              获取后缀（显示在值之后的文本）。              |
|           `void setSuffix(const QString &suffix)`           |                         设置后缀。                         |
|                 `QString cleanText() const`                 |    获取文本表示的干净值，即不包含前缀和后缀的纯文本值。    |
|                   `bool wrapping() const`                   | 检查微调框是否启用了循环，即在达到最大或最小值时是否绕回。 |
|                 `void setWrapping(bool on)`                 |                  启用或禁用微调框的循环。                  |
|                       `void stepUp()`                       |              将微调框的值增加一个单步步进值。              |
|                      `void stepDown()`                      |              将微调框的值减少一个单步步进值。              |
|               `void setAccelerated(bool on)`                | 启用或禁用加速，即按住上下箭头时值的变化速度是否逐渐加快。 |
|                `bool isAccelerated() const`                 |                    检查是否启用了加速。                    |
|                 `void setReadOnly(bool ro)`                 |           设置微调框为只读模式，禁止用户编辑值。           |
|                  `bool isReadOnly() const`                  |                 检查微调框是否为只读模式。                 |
|          `void setAlignment(Qt::Alignment align)`           |                设置微调框中文本的对齐方式。                |
|              `Qt::Alignment alignment() const`              |                获取微调框中文本的对齐方式。                |
| `void setButtonSymbols(QAbstractSpinBox::ButtonSymbols bs)` |                  设置增减按钮的显示方式。                  |
|   `QAbstractSpinBox::ButtonSymbols buttonSymbols() const`   |                  获取增减按钮的显示方式。                  |

这些方法涵盖了QSpinBox类中一些常用的设置和获取整数微调框属性的功能。

接下来我将用一个简单的案例展示如何使用SpinBox组件，该组件有两个版本SpinBox()用于展示单精度浮点数，而DoubleSpinBox()则可以展示精度更高的数值，需要注意的是，该组件有两个特殊参数，当使用setPrefix()时可以指定在前方加入特殊符号，而使用setSuffix()时则可以在后方追加特殊符号，我们就以后方追加为例，首先绘制一个窗体；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240330174931639.png)



要实现计算流程很简单，只需要在按钮被触发时直接调用`on_pushButton_clicked()`按钮事件即可，其核心代码如下所示；

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 在组件后方设置$特殊符号
    ui->spinBox->setSuffix(" $");
    ui->spinBox_2->setSuffix(" $");
    ui->doubleSpinBox->setSuffix(" $");

    // 设置显示精度
    ui->doubleSpinBox->setDecimals(6);
}

MainWindow::~MainWindow()
{
    delete ui;
}

// 触发计算流程
void MainWindow::on_pushButton_clicked()
{
     int x = ui->spinBox->value();
     int y = ui->spinBox_2->value();

     double total = x+y;
     // 设置SpinBox数值(设置时无需转换)
     ui->doubleSpinBox->setValue(total);
}

```

我们继续在SpinBox的基础上改进，如上代码中每次都需要点击计算按钮才能出结果，此时的需求是当SpinBox中的参数发生变化时自定的完成计算，这里就需要用到信号和槽了，当SpinBox被修改后，自动触发计算信号实现计算。该需求很容易被实现，只需要将信号绑定到特定的槽函数上即可，核心代码如下所示；

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 在组件后方设置$特殊符号
    ui->spinBox->setSuffix(" $");
    ui->spinBox_2->setSuffix(" $");
    ui->doubleSpinBox->setSuffix(" $");

    // 设置显示精度
    ui->doubleSpinBox->setDecimals(6);

    // 始终不可编辑
    ui->doubleSpinBox->setEnabled(false);

    // 将数量和单价两个SpinBox的valueChanged()信号与on_pushButton_clicked()槽关联
    // 只要spinBox中的内容发生变化,则立即触发按钮完成计算
    QObject::connect(ui->spinBox,SIGNAL(valueChanged(int)),this,SLOT(on_pushButton_clicked()));
    QObject::connect(ui->spinBox_2,SIGNAL(valueChanged(int)),this,SLOT(on_pushButton_clicked()));
    QObject::connect(ui->doubleSpinBox,SIGNAL(valueChanged(double)),this,SLOT(on_pushButton_clicked()));
}

```

编译并运行上述程序，当我们的两个选择框其中一个发生变化时，都会自动触发`信号与on_pushButton_clicked()`实现计算，效果图如下；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240330175137153.png)

