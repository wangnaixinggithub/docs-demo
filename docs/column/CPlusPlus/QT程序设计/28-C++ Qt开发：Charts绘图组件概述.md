# C++ Qt开发：Charts绘图组件概述

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`QCharts`二维绘图组件的常用方法及灵活运用。

Qt Charts 提供了一个强大且易于使用的工具集，用于在 Qt 应用程序中创建各种类型的图表和图形可视化，该模块提供了多种类型的图表，包括折线图、散点图、条形图、饼图等。这使得开发人员能够轻松地将数据以直观的方式呈现给用户，增强应用程序的可视化效果。

Qt Charts 组件基于`GraphicsView`架构，核心由`QChartView`和`QChart`两个组件构成。其中，`QChartView`的父类是`QGraphicsView`，它负责管理数据集的显示。而`QChart`则是图表的主要类，用于定义图表的结构和样式。整体来说，`QChartView`通过显示`QChart`来呈现图表视图。其中`QChart`的继承关系如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/485665b3234134c620cd4f57893c9c89%5B1%5D.png)



如果要在项目中使用绘图模块，则必须在项目的`*.pro`文件中引用`Qt+=charts`并在主函数中包含绘图头文件，如下所示；

```c
#include <QtCharts>
using namespace QtCharts;
```

或者直接使用宏定义的方式；

```c
#include <QtCharts>
Qt_CHARTS_USE_NAMESPACE
```

此外，为了能够让界面支持中文汉字，我们通常会直接引入如下代码至`mainwindow.h`头文件中；

```c
#include <QMainWindow>
#include <QtCharts>

QT_CHARTS_USE_NAMESPACE

// 解决MSVC编译时，界面汉字乱码的问题
#if _MSC_VER >= 1600
#pragma execution_character_set("utf-8")
#endif
```

以下是 `QChart` 类的一些常用方法的概述，说明和表格：

| 方法                                                         | 描述                                                |
| ------------------------------------------------------------ | --------------------------------------------------- |
| `setTitle(const QString &title)`                             | 设置图表的标题                                      |
| `setTitleFont(const QFont &font)`                            | 设置图表标题的字体                                  |
| `setTitleBrush(const QBrush &brush)`                         | 设置图表标题的画刷（颜色和填充）                    |
| `setTheme(QChart::ChartTheme theme)`                         | 设置图表的主题，包括颜色和样式                      |
| `addSeries(QAbstractSeries *series)`                         | 向图表中添加数据系列                                |
| `removeSeries(QAbstractSeries *series)`                      | 从图表中移除指定的数据系列                          |
| `createDefaultAxes()`                                        | 创建默认的坐标轴                                    |
| `setAxisX(QAbstractAxis *axis, QAbstractSeries *series = nullptr)` | 设置图表的 X 轴。如果未指定系列，则应用于所有系列   |
| `setAxisY(QAbstractAxis *axis, QAbstractSeries *series = nullptr)` | 设置图表的 Y 轴。如果未指定系列，则应用于所有系列   |
| `legend()`                                                   | 返回图表的图例对象                                  |
| `setAnimationOptions(QChart::AnimationOptions options)`      | 设置图表的动画选项                                  |
| `createDefaultGraphicsView()`                                | 创建默认的图形视图（`QGraphicsView`），用于显示图表 |
| `addAxis(QAbstractAxis *axis, Qt::Alignment alignment)`      | 将指定的坐标轴添加到图表中，并指定对齐方式          |
| `removeAxis(QAbstractAxis *axis)`                            | 从图表中移除指定的坐标轴                            |
| `axisX(QAbstractSeries *series = nullptr)`                   | 返回图表的 X 轴。如果未指定系列，则返回第一个 X 轴  |
| `axisY(QAbstractSeries *series = nullptr)`                   | 返回图表的 Y 轴。如果未指定系列，则返回第一个 Y 轴  |
| `setPlotAreaBackgroundBrush(const QBrush &brush)`            | 设置图表绘图区域的背景画刷                          |
| `setPlotAreaBackgroundVisible(bool visible)`                 | 设置图表绘图区域的背景是否可见                      |
| `setBackgroundBrush(const QBrush &brush)`                    | 设置整个图表的背景画刷                              |
| `setBackgroundRoundness(qreal diameter)`                     | 设置图表背景的圆角直径                              |
| `setMargins(const QMargins &margins)`                        | 设置图表的外边距                                    |
| `setTheme(QChart::ChartTheme theme)`                         | 设置图表的主题                                      |

显示详细信息

注意，上述表格中的方法并非 exhaustive，只是介绍了一些常见的和常用的方法。在实际使用中，可以根据需要查阅官方文档获取更详细的信息。

### 1.1 绘制折线图

接着我们来创建一个最基本的折线图，首先需要使用图形界面中的`Graphics View`组件做好UI布局，但由于该组件并不是用于绘制图形的，所以如果需要绘制图形则要在组件上右键，选中提升为按钮将其提升为绘图组件，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/d6dab45e9784b73d500dfb1f937e0aec%5B1%5D.png)



此时会弹出如下所示的提示框，我们直接输入`QChartView`类名称，并点击添加按钮，最后选择提升按钮，此时组件将将被支持绘制图形；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/1d21789e4ffd89b95f9faf836651b396%5B1%5D.png)



为了能让后续的代码能够更更容易的被读着理解，此处还需要为读者提供一份`QGraphicsView`组件的常用方法，如下表格是`QGraphicsView`的一些常用方法的概述：

| 方法                                                         | 描述                                                     |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| `QGraphicsView(QWidget *parent = nullptr)`                   | 默认构造函数，创建一个`QGraphicsView`对象。              |
| `setScene(QGraphicsScene *scene)`                            | 将指定的`QGraphicsScene`设置为视图的场景。               |
| `scene() const`                                              | 获取当前视图关联的场景。                                 |
| `setRenderHint(QPainter::RenderHint hint, bool on = true)`   | 设置渲染提示，例如抗锯齿等。                             |
| `setRenderHints(QPainter::RenderHints hints)`                | 设置多个渲染提示。                                       |
| `renderHints() const`                                        | 获取当前的渲染提示。                                     |
| `setViewportUpdateMode(ViewportUpdateMode mode)`             | 设置视口更新模式，决定何时重绘视口。                     |
| `setSceneRect(const QRectF &rect)`                           | 设置场景矩形，指定在视图中可见的场景区域。               |
| `setSceneRect(qreal x, qreal y, qreal w, qreal h)`           | 设置场景矩形，指定在视图中可见的场景区域。               |
| `sceneRect() const`                                          | 获取当前场景矩形。                                       |
| `setTransform(const QTransform &matrix, bool combine = false)` | 设置视图的坐标变换矩阵。                                 |
| `resetTransform()`                                           | 重置视图的坐标变换矩阵为单位矩阵。                       |
| `translate(qreal dx, qreal dy)`                              | 将视图进行平移。                                         |
| `rotate(qreal angle)`                                        | 将视图进行旋转。                                         |
| `scale(qreal sx, qreal sy)`                                  | 将视图进行缩放。                                         |
| `resetMatrix()`                                              | 将视图的坐标变换矩阵重置为单位矩阵。                     |
| `setViewportMargins(int left, int top, int right, int bottom)` | 设置视口的边缘，以保留用于显示视图的场景区域之外的空间。 |
| `setBackgroundBrush(const QBrush &brush)`                    | 设置视图的背景刷。                                       |
| `viewport() const`                                           | 获取视口窗口部件，即视图的直接子部件。                   |
| `setOptimizationFlag(OptimizationFlag flag, bool enabled = true)` | 启用或禁用指定的优化标志，以提高性能。                   |
| `optimizationFlag(OptimizationFlag flag) const`              | 获取指定的优化标志状态。                                 |
| `centerOn(const QGraphicsItem *item)`                        | 将视图中心对准指定的图形项。                             |
| `centerOn(const QPointF &pos)`                               | 将视图中心对准指定的场景坐标。                           |
| `setInteractive(bool allowed)`                               | 启用或禁用与场景中的项的交互。                           |
| `setDragMode(DragMode mode)`                                 | 设置拖动模式，用于选择或移动项。                         |
| `setViewportMargins(int left, int top, int right, int bottom)` | 设置视口的边缘，以保留用于显示视图的场景区域之外的空间。 |
| `viewport() const`                                           | 获取视口窗口部件，即视图的直接子部件。                   |

显示详细信息

这些方法提供了对`QGraphicsView`的各种设置和操作，用于管理视图的外观和行为。可以根据实际需要选择适当的方法进行使用。

接着，我们来实现一个简单的绘图功能，在`MainWindow`构造函数中我们首先通过`new QChart()`创建一个图表类，接着通过使用`ui->graphicsView->setChart`方法可以将`QChart()`类附加到`QGraphicsView`图形组件上，当有了组件指针以后，就可以动态的通过折线图的规则来创建图例，当有了图例以后则就可以通过`series0->append()`方法依次向图形表格中追加记录。

以下是对功能的概述：

1. 创建图表和序列：
   - 创建一个 `QChart` 对象，并设置图表标题。
   - 将图表添加到 `QChartView` 中，以便在UI中显示。
   - 创建两个曲线序列 `QLineSeries`，分别代表一分钟和五分钟的系统负载。
   - 将这两个序列添加到图表中。
2. 设置图表属性：
   - 设置图表的渲染提示，以提高图表的渲染质量。
   - 设置图表的主题色。
3. 创建坐标轴：
   - 创建 X 轴和 Y 轴对象，并设置它们的范围、标题、格式和刻度。
   - 为每个序列设置相应的坐标轴。
4. 初始化数据：
   - 使用 `QRandomGenerator` 生成介于0和100之间的随机整数，模拟系统负载的变化。
   - 将生成的随机整数添加到两个曲线序列中，分别对应一分钟和五分钟的负载。
   - 在X轴上递增，以模拟时间的推移。
5. 清空图例和赋予数据：
   - 获取序列的指针。
   - 清空曲线序列的数据，以便重新加载新的数据。
   - 通过循环生成的随机数填充曲线序列。

总体来说，这段代码创建了一个简单的系统性能统计图，其中包括两条曲线，每条曲线代表不同时间段的系统负载。通过使用`Qt Charts`模块，可以轻松创建并显示这样的图表。

```c
#include <QRandomGenerator>

MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // ---------------------------------------------------
    // 创建图表的各个部件
    // ---------------------------------------------------
    QChart *chart = new QChart();
    chart->setTitle("系统性能统计图");

    // 将Chart添加到ChartView
    ui->graphicsView->setChart(chart);
    ui->graphicsView->setRenderHint(QPainter::Antialiasing);

    // 设置图表主题色
    ui->graphicsView->chart()->setTheme(QChart::ChartTheme(0));

    // 创建曲线序列
    QLineSeries *series0 = new QLineSeries();
    QLineSeries *series1 = new QLineSeries();

    series0->setName("一分钟负载");
    series1->setName("五分钟负载");

    // 序列添加到图表
    chart->addSeries(series0);
    chart->addSeries(series1);

    // 其他附加参数
    series0->setPointsVisible(false);       // 设置数据点可见
    series1->setPointLabelsVisible(false);  // 设置数据点数值可见

    // 创建坐标轴
    QValueAxis *axisX = new QValueAxis;    // X轴
    axisX->setRange(1, 100);               // 设置坐标轴范围
    axisX->setTitleText("X轴标题");         // 标题
    axisX->setLabelFormat("%d %");         // 设置x轴格式
    axisX->setTickCount(3);                // 设置刻度
    axisX->setMinorTickCount(3);

    QValueAxis *axisY = new QValueAxis;    // Y轴
    axisY->setRange(0, 100);               // Y轴范围(-0 - 20)
    axisY->setTitleText("Y轴标题");         // 标题
    axisY->setLabelFormat("%d %");         // 设置y轴格式
    axisY->setTickCount(3);                // 设置刻度
    axisY->setMinorTickCount(3);

    // 设置X于Y轴数据集
    chart->setAxisX(axisX, series0);   // 为序列设置坐标轴
    chart->setAxisY(axisY, series0);

    chart->setAxisX(axisX, series1);   // 为序列设置坐标轴
    chart->setAxisY(axisY, series1);

    // ---------------------------------------------------
    // 开始初始化数据
    // ---------------------------------------------------

    // 获取指针
    series0=(QLineSeries *)ui->graphicsView->chart()->series().at(0);
    series1=(QLineSeries *)ui->graphicsView->chart()->series().at(1);

    // 清空图例
    series0->clear();
    series1->clear();

    // 赋予数据
    qreal t=0,intv=1;
    for(int i=1;i<100;i++)
    {
        // 生成一个介于0和100之间的随机整数
        int randomInt = QRandomGenerator::global()->bounded(101);
        int randomInt2 = QRandomGenerator::global()->bounded(84);

        series0->append(t,randomInt2);    // 设置轴粒度以及数据
        series1->append(t,randomInt);     // 此处用随机数替代
        t+=intv;                          // X轴粒度
    }
}
```

当程序被编译运行后，读着可看到如下图所示的模拟数据输出；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/e9f7655a6a844cc3f46eaa0b761532d1%5B1%5D.png)

### 1.2 绘制饼状图

接着来实现饼状图的绘制，此处我们增加两个`graphicsView`组件来分别绘制两个不同的饼状图，饼状图A用于统计CPU利用率，由于只有两个数据集，所以只需要构建两个`QPieSlice`即可，代码如下所示；

```c
void MainWindow::printA()
{
    // 构造数据 [已用CPU%] [剩余CPU%]
    QPieSlice *slice_1 = new QPieSlice(QStringLiteral("已使用"), 0.6, this);
    slice_1->setLabelVisible(true);

    QPieSlice *slice_2 = new QPieSlice(QStringLiteral("可用"), 0.4, this);
    slice_2->setLabelVisible(true);

    // 将两个饼状分区加入series
    QPieSeries *series = new QPieSeries(this);
    series->append(slice_1);
    series->append(slice_2);

    // 创建Chart画布
    QChart *chart = new QChart();
    chart->addSeries(series);

    // 设置显示时的动画效果
    chart->setAnimationOptions(QChart::AllAnimations);
    chart->setTitle("系统CPU利用率");

    // 将参数设置到画布
    ui->graphicsView_A->setChart(chart);
    ui->graphicsView_A->setRenderHint(QPainter::Antialiasing);
    ui->graphicsView_A->chart()->setTheme(QChart::ChartTheme(0));
}
```

饼状图B的构建与A保持一致，只需要根据规则定义对图表中的元素进行增减即可，但需要注意由于饼状图100%是最大值，所以再分配时需要考虑到配额的合理性。

```c
void MainWindow::printB()
{
    // 构造数据 [C盘%] [D盘%] [E盘%]
    QPieSlice *slice_c = new QPieSlice(QStringLiteral("C盘"), 0.2, this);
    slice_c->setLabelVisible(true);

    QPieSlice *slice_d = new QPieSlice(QStringLiteral("D盘"), 0.3, this);
    slice_d->setLabelVisible(true);

    QPieSlice *slice_e = new QPieSlice(QStringLiteral("E盘"),0.5,this);
    slice_e->setLabelVisible(true);

    // 将两个饼状分区加入series
    QPieSeries *series = new QPieSeries(this);
    series->append(slice_c);
    series->append(slice_d);
    series->append(slice_e);

    // 创建Chart画布
    QChart *chart = new QChart();
    chart->addSeries(series);

    // 设置显示时的动画效果
    chart->setAnimationOptions(QChart::AllAnimations);
    chart->setTitle("系统磁盘信息");

    // 将参数设置到画布
    ui->graphicsView_B->setChart(chart);
    ui->graphicsView_B->setRenderHint(QPainter::Antialiasing);

    // 设置不同的主题
    ui->graphicsView_B->chart()->setTheme(QChart::ChartTheme(3));
}
```

运行上述程序，则可以输出两个不同的饼状图，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5d6d629b403679b8f5fb37dc3500a38b%5B1%5D.png)

### 1.3 绘制柱状图

与饼状图的绘制方法一致，在绘制柱状图时只需要根据`QBarSeries`类的定义对特有元素进行填充即可，当数据集被填充后既可以直接调用绘图方法将数据刷新到组件上。

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 创建人名
    QBarSet *set0 = new QBarSet("张三");
    QBarSet *set1 = new QBarSet("李四");
    QBarSet *set2 = new QBarSet("王五");

    // 分别为不同人添加bu不同数据集
    *set0 << 1 << 2 << 8 << 4 << 6 << 6;
    *set1 << 5 << 2 << 5 << 4 << 5 << 3;
    *set2 << 5 << 5 << 8 << 15 << 9 << 5;

    // 将数据集关联到series中
    QBarSeries *series = new QBarSeries();
    series->append(set0);
    series->append(set1);
    series->append(set2);

    // 增加顶部提示
    QChart *chart = new QChart();
    chart->addSeries(series);
    chart->setTitle("当前人数统计柱状图");
    chart->setAnimationOptions(QChart::SeriesAnimations);

    // 创建X轴底部提示
    QStringList categories;
    categories << "周一" << "周二" << "周三" << "周四" << "周五" << "周六";

    QBarCategoryAxis *axis = new QBarCategoryAxis();
    axis->append(categories);
    chart->createDefaultAxes();
    chart->setAxisX(axis, series);

    chart->legend()->setVisible(true);
    chart->legend()->setAlignment(Qt::AlignBottom);

    // 将参数设置到画布
    ui->graphicsView->setChart(chart);
    ui->graphicsView->setRenderHint(QPainter::Antialiasing);

    // 设置主题
    ui->graphicsView->chart()->setTheme(QChart::ChartTheme(0));
}
```

运行代码后则可以输出如下图所示的三个人的柱状统计图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/a9a0bb02d04d8836f17a77d7fc4e622a%5B1%5D.png)



至此本章内容就结束了，通过本章内容读着应该能掌握`GraphicsView`绘图组件是如何提升的，并如何利用该组件实现简单的绘制工作，从下一章开始我们将依次深入分析常用的图形类，并实现一个更加实用的小功能，能够让读者学以致用充分发挥Qt图形组件的强大功能。