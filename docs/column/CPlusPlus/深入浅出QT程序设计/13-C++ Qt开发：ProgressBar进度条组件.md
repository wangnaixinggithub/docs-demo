# C++ Qt开发：ProgressBar进度条组件

ProgressBar（进度条）是在Qt中常用的用户界面组件之一，用于显示任务的完成进度。它通常以一个水平或垂直的条形图形式展示，表示任务已完成的比例。进度条组件提供了一种直观的方式来显示任务的进度，让用户清晰地了解任务的完成情况。其还可根据需要在水平或垂直方向上显示，以适应不同的界面布局。



以下是QProgressBar类的一些常用方法的说明和概述，以表格形式列出：



|                   **方法**                    |                 **描述**                 |
| :-------------------------------------------: | :--------------------------------------: |
|   `QProgressBar(QWidget *parent = nullptr)`   |       构造函数，创建一个组件对象。       |
|     `setRange(int minimum, int maximum)`      |  设置组件的范围，即任务的最小和最大值。  |
|             `setValue(int value)`             |  设置组件的当前值，即任务已完成的进度。  |
|                `value() const`                |            获取组件的当前值。            |
|           `setMinimum(int minimum)`           |            设置组件的最小值。            |
|           `setMaximum(int maximum)`           |            设置组件的最大值。            |
|                   `reset()`                   |     重置组件，将当前值设置为最小值。     |
|               `minimum() const`               |            获取组件的最小值。            |
|               `maximum() const`               |            获取组件的最大值。            |
|                `text() const`                 |   获取组件显示的文本，通常是百分比值。   |
|      `setFormat(const QString &format)`       |  设置组件显示文本的格式，支持百分比等。  |
|    `setAlignment(Qt::Alignment alignment)`    |         设置组件文本的对齐方式。         |
|     `setInvertedAppearance(bool invert)`      | 设置组件是否显示为反向进度（从右到左）。 |
| `setOrientation(Qt::Orientation orientation)` |    设置组件的方向，可以是水平或垂直。    |
|  `setStyleSheet(const QString &styleSheet)`   |            设置组件的样式表。            |
|      `setFormat(const QString &format)`       |           设置组件的显示格式。           |
|    `setAlignment(Qt::Alignment alignment)`    |         设置组件文本的对齐方式。         |

这些方法提供了对QProgressBar进行配置、管理和与之交互的灵活性。你可以根据具体的应用需求使用这些方法，使QProgressBar在你的Qt应用程序中按照期望的方式工作。



说到进度条组件就不得不提起定时器类，因为进度条组件往往需要配合定时器一起使用，QTimer是 Qt 中用于创建定时器的类，它允许你在一段时间间隔后执行特定的操作。以下是 QTimer 类的一些常用方法的说明和概述，以表格形式列出：



|              **方法**               |                          **描述**                          |
| :---------------------------------: | :--------------------------------------------------------: |
| `QTimer(QObject *parent = nullptr)` |               构造函数，创建一个定时器对象。               |
|          `start(int msec)`          |       启动定时器，指定触发时间间隔（以毫秒为单位）。       |
|              `stop()`               |             停止定时器，阻止进一步的定时触发。             |
|       `setInterval(int msec)`       |                 设置定时器的触发时间间隔。                 |
|  `setSingleShot(bool singleShot)`   |             设置定时器是单次触发还是重复触发。             |
|         `isActive() const`          |                检查定时器是否处于活动状态。                |
|       `remainingTime() const`       |  返回离下一次定时器触发还有多少时间，如果不活动返回 -1。   |
|              `timeout`              |    在定时器超时时发出，可以与槽函数连接以执行相应操作。    |
| `setTimerType(Qt::TimerType atype)` | 设置定时器的类型，可以是 `PreciseTimer` 或 `CoarseTimer`。 |
|         `timerType() const`         |                     返回定时器的类型。                     |
|  `setSingleShot(bool singleShot)`   |             设置定时器是单次触发还是重复触发。             |
|         `interval() const`          |                 返回定时器的触发时间间隔。                 |
|             `timeout()`             |   返回 `timeout` 信号的 `QMetaObject::Connection` 对象。   |

这些方法提供了对 `QTimer` 进行配置、管理和与之交互的灵活性。你可以根据具体的应用需求使用这些方法，使 `QTimer` 在你的 Qt 应用程序中按照期望的方式工作。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401205745674.png)





首先在`MainWindow`主函数中通过`connect`设置绑定定时器，并在匿名函数中对数值进行判断，如果到达了进度条最大值则直接使用`my_timer->stop()`停止计时，否则每次设置进度条加一，代码如下所示；

```c
#include <QTimer>

// 全局定时器变量指针
QTimer *my_timer;

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 声明定时器
     my_timer = new QTimer(this);

     // 绑定一个匿名函数
     connect(my_timer,&QTimer::timeout,[=]{
         static int x = 0;

         // 判断是否到达了进度条的最大值
         if(x != 100)
         {
             x++;
             ui->progressBar_Up->setValue(x);
             ui->progressBar_Down->setValue(int(100-x));
         }
         else
         {
             x=0;
             my_timer->stop();
         }
     });
}

```

当用户点击初始化按钮时，我们首先将两个进度条使用`reset()`属性进行重置，接着设置`progressBar_Down`为最大值状态，代码如下所示；

```c
// 初始化进度条
void MainWindow::on_pushButton_clear_clicked()
{
    // 清空进度条
    ui->progressBar_Up->reset();
    ui->progressBar_Down->reset();

    // 设置递减进度条最大值100
    ui->progressBar_Down->setValue(100);
}

```

启动与停止定时器流程一致，首先通过`my_timer->isActive()`来验证定时器是否启动中，只不过不是则`my_timer->start(100)`启动，如果是则`my_timer->stop()`停止。

```c
// 启动定时器,并设置周期为100毫秒
void MainWindow::on_pushButton_start_clicked()
{
    if(my_timer->isActive() == false)
    {
        my_timer->start(100);
    }
}

// 停止定时器
void MainWindow::on_pushButton_stop_clicked()
{
    if(my_timer->isActive() == true)
    {
        my_timer->stop();
    }
}

```

运行程序，首先点击初始化按钮设置进度条的状态值，然后读者可点击启动定时器和停止定时器，如下图所示；





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401210047194-17119764482312.png)

