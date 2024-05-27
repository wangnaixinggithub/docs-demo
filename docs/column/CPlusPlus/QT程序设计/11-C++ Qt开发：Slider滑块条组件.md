# C++ Qt开发：Slider滑块条组件

当涉及到C++ Qt开发中的Slider滑块条组件时，你可能会用到QSlider类。QSlider是一个用于选择整数值的控件，常用于调整范围内的数值，如音量、亮度等。在水平方向上的Slider通常被称为水平滑块（Horizontal Slider），而在垂直方向上的Slider被称为垂直滑块（Vertical Slider）。



**水平滑块（Horizontal Slider）特点**

- **方向：** 在水平轴上移动，允许用户通过拖动滑块来选择数值。
- **应用场景：** 适用于需要在水平方向上进行范围选择的情况，比如调整音量、进度等。



**垂直滑块（Vertical Slider）特点**

- **方向：** 在垂直轴上移动，允许用户通过拖动滑块来选择数值。
- **应用场景：** 适用于需要在垂直方向上进行范围选择的情况，比如调整亮度、高度等。



这两种`Slider`都是在用户界面中提供直观、交互式的方式来选择数值范围的优秀组件，它们能够很好地与Qt应用程序的其他部分集成。



以下是`QSlider`类的一些常用方法的说明和概述，以表格形式进行说明：

|                       **方法**                        |                           **描述**                           |
| :---------------------------------------------------: | :----------------------------------------------------------: |
| `QSlider(Qt::Orientation, QWidget *parent = nullptr)` | 构造函数，创建一个滑块控件。`Qt::Orientation`参数指定方向（`Qt::Horizontal`或`Qt::Vertical`）。 |
|                 `setMinimum(int min)`                 |                      设置滑块的最小值。                      |
|                 `setMaximum(int max)`                 |                      设置滑块的最大值。                      |
|               `setSingleStep(int step)`               |        设置用户通过鼠标或键盘按键时，滑块的单步大小。        |
|                `setPageStep(int step)`                |         设置用户通过点击滑块轨道时，滑块的页面步长。         |
|                 `setValue(int value)`                 |                      设置滑块的当前值。                      |
|                    `value() const`                    |                      返回滑块的当前值。                      |
|               `setTickInterval(int ti)`               |               设置刻度间隔，以便显示刻度标记。               |
|       `setTickPosition(TickPosition position)`        | 设置刻度标记的位置（`NoTicks`、`TicksAbove`、`TicksBelow`、`TicksBothSides`）。 |
|               `sliderPosition() const`                | 返回滑块的位置，通常与`value()`相同，但可能在某些情况下不同（例如，未捕获的移动）。 |
|              `setTracking(bool enable)`               | 启用/禁用实时跟踪。如果启用，滑块在拖动时会实时更新值；禁用时，只有在释放鼠标时才更新。 |
|               `setTickInterval(int ti)`               |               设置刻度间隔，以便显示刻度标记。               |
|       `setTickPosition(TickPosition position)`        | 设置刻度标记的位置（`NoTicks`、`TicksAbove`、`TicksBelow`、`TicksBothSides`）。 |

这些方法提供了一些基本的控制和配置选项，以便根据应用程序的需求对`QSlider`进行调整。在使用这些方法时，你可以根据具体的场景和用户体验需求来灵活选择参数值。



## 使用滑块条事件

如下图，我们首先创建一个页面UI，在页面中左侧放置`Vertical Slider`垂直滑块，底部放置`Horizontal Slider`水平滑块，在水平滑块的上方放置两个`lineEdit`组件，在其右侧是两个调节按钮。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401173049044.png)



不论是水平滑块（Horizontal Slider）条还是垂直滑块（Vertical Slider）条其都有一个valueChanged(int)的槽函数，该信号用于接收滑块条的参数改变情况，通常会返回到函数参数上，此时只需要在槽函数内对该参数进行捕捉处理即可，如下代码，通过捕捉滑块进度并将其输出到编辑框内；

```c
// 垂直滑块（Vertical Slider）条
void MainWindow::on_verticalSlider_valueChanged(int value)
{
    // 转换整数为string
    QString myString = QString::number(value);
    // 设置到编辑框内
    ui->lineEdit->setText(myString);
}

// 水平滑块（Horizontal Slider）条
void MainWindow::on_horizontalSlider_valueChanged(int value)
{
    // 转换整数为string
    QString myString = QString::number(value);
    // 设置到编辑框内
    ui->lineEdit_2->setText(myString);
}

```

当用户点击页面中的设置按钮时，此时在后端只需要调用`verticalSlider`或`horizontalSlider`滑块条的`setValue`属性即可实现对滑块条的赋值。

```c
// 设置垂直滑块（Vertical Slider）条进度
void MainWindow::on_pushButton_clicked()
{
    // 字符串转整数
    int x = ui->lineEdit->text().toUInt();
    // 设置数值到滑块条
    ui->verticalSlider->setValue(x);
}

// 设置水平滑块（Horizontal Slider）条
void MainWindow::on_pushButton_2_clicked()
{
    int x = ui->lineEdit_2->text().toUInt();
    ui->horizontalSlider->setValue(x);
}

```

运行代码，读者可自行测试滑块条的取值与设置功能，如下图所示；





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401174731471-17119648527291.png)



## 滑块条与信号绑定

滑块条同样可以与信号绑定，在某些时候我们希望只需要变动滑块条的位置就能实现特定的功能，此时就需要对特定的滑块条绑定信号与槽函数，如下图所示，我们在左侧调色板位置放置四个滑块条用于调整颜色参数，在右侧放置一个`textEdit`编辑框，当读者滑动滑块时右侧则出现相对应的颜色。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401174749925.png)





首先，我们以第一个红色`Horizontal Slider`滑块条为例，通过右键选中转到槽，选择`valueChaged(int)`这个槽函数，并实现如下逻辑，在代码中我们分别读入四个进度条的默认值，并率先设置到`textEdit`组件上，接着就是对`textEdit`底色的设置。

```c
// 变色槽函数
void MainWindow::on_SliderRed_valueChanged(int value)
{
    Q_UNUSED(value);
     QColor color;
     int R=ui->SliderRed->value();      // 读取SliderRed的当前值
     int G=ui->SliderGreen->value();    // 读取 SliderGreen 的当前值
     int B=ui->SliderBlue->value();     // 读取 SliderBlue 的当前值
     int alpha=ui->SliderAlpha->value();// 读取 SliderAlpha 的当前值
     color.setRgb(R,G,B,alpha);         // 使用QColor的setRgb()函数获得颜色

     QPalette pal=ui->textEdit->palette(); // 获取textEdit原有的 palette
     pal.setColor(QPalette::Base,color);   // 设置palette的基色（即背景色）
     ui->textEdit->setPalette(pal);        // 设置为textEdit的palette,改变textEdit的底色
}

```

接着，我们在MainWindow构造函数上分别绑定三个信号，将 SliderGreen，SliderBlue，SliderAlpha 与第一个滑块条 SliderRead 关联起来，并全部绑定到on_SliderRed_valueChanged槽函数上，此时的实现效果为，当其他三个选择条数值改变时，同样会触发on_SliderRed_valueChanged槽函数执行变色。

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    QObject::connect(ui->SliderRed,SIGNAL(valueChanged(int)),this,SLOT(on_SliderRed_valueChanged(int)));
    QObject::connect(ui->SliderGreen,SIGNAL(valueChanged(int)),this,SLOT(on_SliderRed_valueChanged(int)));
    QObject::connect(ui->SliderBlue,SIGNAL(valueChanged(int)),this,SLOT(on_SliderRed_valueChanged(int)));
    QObject::connect(ui->SliderAlpha,SIGNAL(valueChanged(int)),this,SLOT(on_SliderRed_valueChanged(int)));
}

```

至此，读者可自行拖拽滑块条以获得不同的配色方案，如下图所示，这里需要提醒读者默认滑块条是`0-99`而颜色的长度为`0-255`读者需要自行调整滑块条的颜色值，以获取更多的配色方案。





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401174909929-17119649508433.png)