# C++ Qt开发：DateTime日期时间组件

在Qt中，日期和时间的处理通常使用 `QDateTime` 类。`QDateTime` 是一个用于表示日期和时间的类，而与之相关的组件还包括 `QDate` 、 `QTime`以及`QDateTime`，以下是对这些组件的详细概述。



## **QDate**



`QDate` 类用于表示日期，包括年、月和日。

主要特点如下：

- **构造函数：** `QDate(int year, int month, int day)`，用于创建一个 `QDate` 对象。
- **获取日期信息：** 提供了获取年、月、日等日期信息的方法，例如 `year()`、`month()`、`day()`。
- **比较日期：** 可以进行日期的比较，判断日期的先后顺序。
- **日期格式：** 可以以不同的格式输出日期的字符串表示。



以下是 `QDate` 类的一些常用方法的说明和概述，以表格形式列出：



|                  **方法**                  |                      **描述**                       |
| :----------------------------------------: | :-------------------------------------------------: |
|                 `QDate()`                  | 默认构造函数，创建一个表示当前日期的 `QDate` 对象。 |
|   `QDate(int year, int month, int day)`    |  构造函数，创建一个指定年、月、日的 `QDate` 对象。  |
|                `isValid()`                 |                 检查日期是否有效。                  |
|               `year() const`               |                     返回年份。                      |
|              `month() const`               |                     返回月份。                      |
|               `day() const`                |                     返回日期。                      |
|  `toString(const QString &format) const`   | 返回日期的字符串表示，可以通过指定格式进行格式化。  |
|              `currentDate()`               |     静态函数，返回当前系统日期的 `QDate` 对象。     |
|              `daysInMonth()`               |                返回当前月份的天数。                 |
|               `daysInYear()`               |                返回当前年份的天数。                 |
|            `addDays(int days)`             |         返回增加指定天数后的 `QDate` 对象。         |
|          `addMonths(int months)`           |         返回增加指定月数后的 `QDate` 对象。         |
|           `addYears(int years)`            |         返回增加指定年数后的 `QDate` 对象。         |
|           `operator+(int days)`            | 重载加法运算符，返回增加指定天数后的 `QDate` 对象。 |
|           `operator-(int days)`            | 重载减法运算符，返回减去指定天数后的 `QDate` 对象。 |
|     `daysTo(const QDate &date) const`      |              返回到指定日期的天数差。               |
|    `monthsTo(const QDate &date) const`     |              返回到指定日期的月数差。               |
| `yearsTo(const QDateTime &dateTime) const` |              返回到指定日期的年数差。               |
|                `isValid()`                 |                 检查日期是否有效。                  |

这些方法提供了对 `QDate` 进行构造、获取、比较、格式化和运算等操作的灵活性。你可以根据应用的需求使用这些方法，方便地处理日期相关的操作。



## **QTime**

`QTime` 类用于表示时间，包括小时、分钟、秒和毫秒。



主要特点如下：

- **构造函数：** `QTime(int h, int m, int s, int ms = 0)`，用于创建一个 `QTime` 对象。
- **获取时间信息：** 提供了获取小时、分钟、秒、毫秒等时间信息的方法，例如 `hour()`、`minute()`、`second()`。
- **比较时间：** 可以进行时间的比较，判断时间的先后顺序。
- **时间格式：** 可以以不同的格式输出时间的字符串表示。



以下是 `QTime` 类的一些常用方法的说明和概述，以表格形式列出：



|                 **方法**                 |                          **描述**                           |
| :--------------------------------------: | :---------------------------------------------------------: |
|                `QTime()`                 |     默认构造函数，创建一个表示当前时间的 `QTime` 对象。     |
| `QTime(int h, int m, int s, int ms = 0)` | 构造函数，创建一个指定小时、分钟、秒和毫秒的 `QTime` 对象。 |
|               `isValid()`                |                     检查时间是否有效。                      |
|              `hour() const`              |                       返回小时部分。                        |
|             `minute() const`             |                       返回分钟部分。                        |
|             `second() const`             |                        返回秒部分。                         |
|              `msec() const`              |                       返回毫秒部分。                        |
| `toString(const QString &format) const`  |     返回时间的字符串表示，可以通过指定格式进行格式化。      |
|             `currentTime()`              |         静态函数，返回当前系统时间的 `QTime` 对象。         |
|           `addSecs(int secs)`            |             返回增加指定秒数后的 `QTime` 对象。             |
|          `addMSecs(int msecs)`           |            返回增加指定毫秒数后的 `QTime` 对象。            |
|          `operator+(int secs)`           |     重载加法运算符，返回增加指定秒数后的 `QTime` 对象。     |
|          `operator-(int secs)`           |     重载减法运算符，返回减去指定秒数后的 `QTime` 对象。     |
|      `secsTo(const QTime &t) const`      |                  返回到指定时间的秒数差。                   |
|     `msecsTo(const QTime &t) const`      |                 返回到指定时间的毫秒数差。                  |
|               `isValid()`                |                     检查时间是否有效。                      |

这些方法提供了对 `QTime` 进行构造、获取、比较、格式化和运算等操作的灵活性。你可以根据应用的需求使用这些方法，方便地处理时间相关的操作。



## QDateTime

`QDateTime` 类结合了日期和时间，用于表示日期和时间的组合。



主要特点如下：

- **构造函数：** `QDateTime(QDate date, QTime time)`，用于创建一个 `QDateTime` 对象。
- **获取日期和时间信息：** 提供了获取年、月、日、小时、分钟、秒等信息的方法。
- **比较日期和时间：** 可以进行 `QDateTime` 对象的比较，判断日期和时间的先后顺序。
- **日期时间格式：** 可以以不同的格式输出日期和时间的字符串表示。
- **时区支持：** `QDateTime` 提供了对时区的支持，可以进行时区的设置和获取。



以下是 `QDateTime` 类的一些常用方法的说明和概述，以表格形式列出：

|                     **方法**                      |                           **描述**                           |
| :-----------------------------------------------: | :----------------------------------------------------------: |
|                   `QDateTime()`                   | 默认构造函数，创建一个表示当前日期和时间的 `QDateTime` 对象。 |
| `QDateTime(const QDate &date, const QTime &time)` | 构造函数，创建一个由指定日期和时间组成的 `QDateTime` 对象。  |
|                    `isValid()`                    |                   检查日期和时间是否有效。                   |
|                  `date() const`                   |                        返回日期部分。                        |
|                  `time() const`                   |                        返回时间部分。                        |
|      `toString(const QString &format) const`      |   返回日期和时间的字符串表示，可以通过指定格式进行格式化。   |
|                `currentDateTime()`                |    静态函数，返回当前系统日期和时间的 `QDateTime` 对象。     |
|                `addDays(int days)`                |           返回增加指定天数后的 `QDateTime` 对象。            |
|              `addMonths(int months)`              |           返回增加指定月数后的 `QDateTime` 对象。            |
|               `addYears(int years)`               |           返回增加指定年数后的 `QDateTime` 对象。            |
|                `addSecs(int secs)`                |           返回增加指定秒数后的 `QDateTime` 对象。            |
|             `addMSecs(qint64 msecs)`              |          返回增加指定毫秒数后的 `QDateTime` 对象。           |
|               `operator+(int secs)`               |   重载加法运算符，返回增加指定秒数后的 `QDateTime` 对象。    |
|               `operator-(int secs)`               |   重载减法运算符，返回减去指定秒数后的 `QDateTime` 对象。    |
|      `operator-(const QDateTime &dateTime)`       |      重载减法运算符，返回两个日期时间对象之间的时间差。      |
|     `secsTo(const QDateTime &dateTime) const`     |                 返回到指定日期时间的秒数差。                 |
|    `msecsTo(const QDateTime &dateTime) const`     |                返回到指定日期时间的毫秒数差。                |
|     `daysTo(const QDateTime &dateTime) const`     |                 返回到指定日期时间的天数差。                 |
|    `monthsTo(const QDateTime &dateTime) const`    |                 返回到指定日期时间的月数差。                 |
|    `yearsTo(const QDateTime &dateTime) const`     |                 返回到指定日期时间的年数差。                 |
|                   `toTime_t()`                    | 将日期时间对象转换为自 `1970-01-01 00:00:00` UTC 以来的秒数。 |
|            `fromTime_t(uint seconds)`             | 从自 `1970-01-01 00:00:00` UTC 以来的秒数创建日期时间对象。  |

这些方法提供了对 `QDateTime` 进行构造、获取、比较、格式化和运算等操作的灵活性。你可以根据应用的需求使用这些方法，方便地处理日期和时间相关的操作。



首先我们来绘制一个简单的日期时间页面，这里需要注意页面中的日期组件`DateEdit`和`TimeEdit`其长得很像之前文章中所提到的`SpinBox`但其两者是不同的，读者应注意区分两者的不同指出，如下图所示；





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401211850724-17119775316571.png)



首先如何获取日期时间，点击获取日期按钮时我们可以直接通过调用`QDate::currentDate()`则可获取到当前日期，同理点击获取时间按钮则直接调用`QTime::currentTime()`实现，左侧三个按钮的功能实现如下所示；



```c
#include <QDate>
#include <QTime>
#include <QDateTime>
#include <iostream>

// 设置日期组件
void MainWindow::on_pushButton_getdate_clicked()
{
    QDate curDate = QDate::currentDate();
    int year = curDate.year();
    int month = curDate.month();
    int day = curDate.day();

    ui->dateEdit->setDate(curDate);
    std::cout << year << "/" << month << "/" << day << std::endl;
}

// 设置时间组件
void MainWindow::on_pushButton_gettime_clicked()
{
    QTime curTime = QTime::currentTime();
    int hour = curTime.hour();
    int minute = curTime.minute();
    int second = curTime.second();

    ui->timeEdit->setTime(curTime);
    std::cout << hour << "/" << minute << "/" << second << std::endl;
}

// 设置日期时间
void MainWindow::on_pushButton_getdatetime_clicked()
{
    QDateTime curDateTime = QDateTime::currentDateTime();
    int yearDT = curDateTime.date().year();
    int monthDT = curDateTime.date().month();
    int dayDT = curDateTime.date().day();
    int hourDT = curDateTime.time().hour();
    int minuteDT = curDateTime.time().minute();
    int secondDT = curDateTime.time().second();

    ui->dateTimeEdit->setDateTime(curDateTime);

    std::cout << yearDT << "/" << monthDT << "/" << dayDT << std::endl;
    std::cout << hourDT << "/" << minuteDT << "/" << secondDT << std::endl;
}

```

接着我们来实现时间日期组件与字符串之间的转换，当我们需要将字符串转换为日期时可以通过`QDateTime::fromString`并根据字符串规律对其进行格式化，同理通过使用`curDateTime.toString`即可实现日期时间转换为字符串。

```c
// 将字符串转为日期
void MainWindow::on_pushButton_stod_clicked()
{
    // 获取字符串
    QString datestr = ui->lineEdit->text();

    datestr = datestr.trimmed();

    // 是否为空
    if(!datestr.isEmpty())
    {
        // 格式化
        QDateTime datetime = QDateTime::fromString(datestr,"yyyy-MM-dd hh:mm:ss");

        // 设置到日期组件上
        ui->dateTimeEdit_convert->setDateTime(datetime);
    }
}

// 将日期转换为字符串
void MainWindow::on_pushButton_dtos_clicked()
{
    QDateTime curDateTime = QDateTime::currentDateTime();
    ui->dateTimeEdit_convert->setDateTime(curDateTime);

    ui->lineEdit->setText(curDateTime.toString("yyyy-MM-dd hh:mm:ss"));
}

```

程序运行效果如下图所示，读者可通过点击不同的按钮来实现不同的功能



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401211959196-17119776002762.png)



为了能更加充分的认识时间日期组件，此处我们将通过LCD Number组件实现一个简单的钟表，QLCDNumber 是 Qt 中用于显示数字的小部件，通常用于显示整数或浮点数值。它提供了一个类似于数字显示器或仪表板的外观，可以用于显示各种数值信息。



显示器的使用非常容易，只需要setDigitCount()设置显示长度，并通过setDecMode()设置为十进制输出模式，最后调用display()就可以将一个整数刷新到屏幕上，完整代码如下所示；

```c
#include <QTime>
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

        // 获取时间
        QTime curTime = QTime::currentTime();
        int hour = curTime.hour();
        int minute = curTime.minute();
        int second = curTime.second();

        // 设置LCD屏幕2位显示
        ui->lcdNumber_hour->setDigitCount(2);
        ui->lcdNumber_minute->setDigitCount(2);
        ui->lcdNumber_hour->setDigitCount(2);

        // 使用十进制
        ui->lcdNumber_hour->setDecMode();
        ui->lcdNumber_minute->setDecMode();
        ui->lcdNumber_second->setDecMode();

        // 刷新参数
        ui->lcdNumber_hour->display(hour);
        ui->lcdNumber_minute->display(minute);
        ui->lcdNumber_second->display(second);
    });

    // 启动定时器1000毫秒执行依次
    my_timer->start(1000);
}

MainWindow::~MainWindow()
{
    delete ui;
}

```

读者可自行编译运行这段程序，则会看到每隔一秒计时器都会向前递增以为，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240401212033214-17119776343103.png)