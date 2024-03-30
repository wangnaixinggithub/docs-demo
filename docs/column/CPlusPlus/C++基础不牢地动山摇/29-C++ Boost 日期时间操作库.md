# C++ Boost 日期时间操作库

当涉及到日期时间和目录的操作时，Boost提供了boost::posix_time库，该库可以实现日期时间的解析、格式化、差值计算等常见操作。此外，该库还提供了许多常见的时间表示方式，如time_duration表示时间长度，ptime表示时间点，以及time_period表示时间段等。

#  字符串日期时间互转

本节涉及的主要内容是如何使用Boost库中的日期和时间模块来实现C字符串与日期时间的相互转换，其中包括从字符串中读取日期时间，将日期时间转换为字符串，常用日期时间格式和常见处理问题及其解决方案。

此外，本章还会提供实例和技巧指导，帮助读者掌握如何使用Boost库的日期和时间模块。通过学习本章内容，读者可提高代码编程能力并实现更丰富的C应用程序。

```c
#include <iostream>
#include <vector>
#include <boost\date_time\gregorian\gregorian.hpp>
#include <boost\date_time\posix_time\posix_time.hpp>

using namespace std;
using namespace boost::posix_time;
using namespace boost::gregorian;

// 从字符串读取日期
void string_transformation_date()
{
    // 字符串 -> 日期
    date date_a(2010, 12, 11);
    std::cout << date_a.year() << " 年 " << date_a.month() << " 月 " << date_a.day() << " 日 " << std::endl;

    date date_b = from_string("2020-01-12");
    std::cout << date_b.year() << " 年 " << date_b.month() << " 月 " << date_b.day() << " 日 " << std::endl;
}

// 从字符串读取时间
void string_transformation_time()
{
    // 字符串 -> 时间
    time_duration time_dur_a(12, 10, 22, 1000);
    cout << time_dur_a.hours() << " 小时 " << time_dur_a.minutes() << " 分钟 " << time_dur_a.seconds() << " 秒" << endl;

    time_duration time_dur_b = duration_from_string("2:12:11:001");
    cout << time_dur_b.hours() << " 小时 " << time_dur_b.minutes() << " 分钟 " << time_dur_b.seconds() << " 秒" << endl;
}

// 从字符串读取时间点
void string_transformation_ptime()
{
    // 字符串 -> 时间点
    ptime ptime_a(date(2020, 12, 11), time_duration(12, 11, 22, 100));
    std::cout << "输出时间点: " << ptime_a << std::endl;

    ptime ptime_b = time_from_string("2020-1-10 02:12:00");
    std::cout << "格式化时间点: " << ptime_b << std::endl;
}

// 日期或时间点转为字符串
void date_time_transformation_string()
{
    // 日期 -> 字符串
    date my_date(2020, 12, 11);
    std::string string_date = to_iso_extended_string(my_date);
    std::cout << "输出日期: " << my_date << std::endl;

    // 时间点 -> 字符串
    ptime my_ptime(date(2020, 12, 11), time_duration(12, 11, 22, 100));
    std::string string_ptime = to_iso_extended_string(my_ptime);
    std::cout << "输出时间点: " << string_ptime << std::endl;
}

// 例: 将字符串转换为date类型,并输出参数
int main(int argc, char* argv[])
{
    if (1)
    {
        string_transformation_date();
        string_transformation_time();
        string_transformation_ptime();
        date_time_transformation_string();
        //    2010 年 Dec 月 11 日
        //    2020 年 Jan 月 12 日
        //    12 小时 10 分钟 22 秒
        //    2 小时 12 分钟 11 秒
        //    输出时间点 : 2020 - Dec - 11 12 : 11 : 22.000100
        //    格式化时间点 : 2020 - Jan - 10 02 : 12 : 00
        //    输出日期 : 2020 - Dec - 11
        //    输出时间点 : 2020 - 12 - 11T12 : 11 : 22.00010

    }


    if (0)
    {

        std::vector<std::string> string_time;
        string_time.push_back("2018-01-04");
        string_time.push_back("2019-04-05");
        string_time.push_back("2021-05-06");
        std::vector<boost::gregorian::date> my_date;

        // 循环字符串,将字符串批量变为date类型
        for (int x = 0; x < string_time.size(); x++)
        {
            std::string time_ptr = string_time[x];
            my_date.push_back(from_string(time_ptr));
        }

        // 输出date格式的数据
        for (int x = 0; x < my_date.size(); x++)
        {
            std::cout << "年: " << my_date[x].year() << "月:" << my_date[x].month() << " 日: "
                << my_date[x].day() << std::endl;
        }
        std::system("pause");
        //年: 2018月:Jan 日: 4
        //年: 2019月 : Apr 日 : 5
        //年 : 2021月 : May 日 : 6
        //请按任意键继续. . .

    }
   

    return 0;
}

```

#  度量时间流失单位

本节将学习时间单位度量的事项方法，通常Boost库中提供了timer.hpp库，该库可以非常方便地测量程序的性能和效率。

使用boost::timer时只需定义一个计时器对象，它会自动开始计时，可以输出计时器读数并检查程序运行时间。

在度量时间流失时，具体使用哪种时间单位应根据实际情况和需求进行选择。

```c
#define BOOST_TIMER_ENABLE_DEPRECATED
#include <iostream>
#include <boost\timer.hpp>
using namespace std;

void Func()
{
    for (int x = 0; x < 1000; x++)
        cout << x << endl;
}

int main(int argc, char const* argv[])
{
    boost::timer time;

    cout << "度量最大时间(小时): " << time.elapsed_max() / 3600 << endl;
    cout << "度量最小时间(秒): " << time.elapsed_min() << endl;

    // 度量Display函数消耗时间
    double start_time = time.elapsed();
    Func();
    double end_time = time.elapsed();

    cout << "开始时间:" << start_time << " 结束时间: " << end_time << " 时间差: " << (end_time - start_time) << endl;
    system("pause");
    return 0;
}

```




# Ptime与Time_T互转

本节主要介绍了Ptime与Time_T之间相互转换的方法。其中，在将Ptime转为Time_T的过程中，需要使用boost库提供的时间函数，并结合计算时间差的方法将Ptime时间对象转换为对应的Time_T值。而在将Time_T转为Ptime的过程中，则需要注意时区的问题，可先将时间值转为GMT时间，再填充到Ptime对象中进行转换。



通过本节内容的学习，读者可掌握如何使用boost库进行Ptime与Time_T之间的相互转换，并在实际开发中运用相关技巧和方法解决时间处理问题，提升代码编程能力以及开发效率。


```c
#include <iostream>
#include <vector>
#include <boost\date_time\gregorian\gregorian.hpp>
#include <boost\date_time\posix_time\posix_time.hpp>

using namespace std;
using namespace boost::posix_time;
using namespace boost::gregorian;

int main(int argc, char* argv[])
{
	// ptime 与 time_t 转换
	boost::posix_time::ptime my_ptime(second_clock::local_time());
	std::cout << "输出日期: " << to_simple_string(my_ptime) << std::endl;

	tm tm_ptr = boost::posix_time::to_tm(my_ptime);
	time_t timet_ptr = std::mktime(&tm_ptr);

	ptime ptime_ptr = from_time_t(timet_ptr);
	std::cout << "输出日期: " << to_simple_string(ptime_ptr) << std::endl;

	tm* tms = localtime(&timet_ptr);
	ptime pttm = ptime_from_tm(*tms);
	std::cout << "输出日期: " << to_simple_string(pttm) << std::endl;

	std::system("pause");
	return 0;

}
```




# 日期的格式化输出

本节主要介绍了boost库中日期格式化输出相关的内容。使用boost库中的日期格式化函数，我们可以方便地将日期对象转换为不同的字符串格式，以满足具体应用的需求。在本节中，我们首先介绍了boost库中常见的日期格式化输出控制字符，例如%Y、%m等，然后通过举例和代码示范的方式，演示了如何在日期对象中使用这些格式化字符，并将日期转为对应的字符串格式。



```c
#include <iostream>
#include <boost\date_time\gregorian\gregorian.hpp>

using namespace std;
using namespace boost;
using namespace boost::gregorian;

int main(int argc, char const* argv[])
{
    // 普通的date可以直接声明
    date date_a(2021, 01, 01);
    date date_b(2021, Jan, 1);
    cout << "年: " << date_a.year() << " 月: " << date_a.month() << " 日: " << date_a.day() << endl;

    // 日期格式化输出
    date_b = from_string("2021-01-25");
    cout << "转为英文格式: " << to_simple_string(date_b) << endl;
    cout << "转为纯数字格式: " << to_iso_string(date_b) << endl;
    cout << "转为通用格式: " << to_iso_extended_string(date_b) << endl;

    // 通过字符串读入日期
    date date_c = from_undelimited_string("20191221");
    cout << "年: " << date_c.year() << " 月: " << date_c.month() << " 日: " << date_c.day() << endl;

    // 返回当天日期对象
    date date_d = day_clock::local_day();
    date date_e = day_clock::universal_day();
    cout << "当前日期: " << date_d << endl;
    cout << "当前日期: " << day_clock::local_day() << endl;

    // 返回星期数/所在天/周
    date date_g = from_string("2020-12-14");
    if (!date_g.is_not_a_date())
    {
        cout << "该日期是星期几: " << date_g.day_of_week() << endl;
        cout << "该日期是本年第: " << date_g.day_of_year() << " 天" << endl;
        cout << "该日期是本年第: " << date_g.week_number() << " 周" << endl;
    }
    std::system("pause");
    return 0;
}

```



# 日期的加减运算

本节主要介绍了boost库中日期加减运算相关的内容。通过使用boost库中提供的日期加减运算函数，我们可以方便地对日期对象进行加减运算，比如将日期加上或减去一段时间间隔，并获得运算后的日期对象。

```c
#include <iostream>
#include <boost\date_time\gregorian\gregorian.hpp>

using namespace std;
using namespace boost;
using namespace boost::gregorian;

int main(int argc, char const *argv[])
{
  // 日期/时间/月份差值计算
  days day_a(10), day_b(100), day_c(-50);
  cout << "day_b 与 day_a 相差: " << day_b - day_a << " 天" << endl;
  cout << "相加是否大于100: " << ((day_a + day_b).days() > 100) << endl;

  weeks week_a(3), week_b(4);
  cout << "三个星期: " << week_a << " 天" << endl;
  cout << "四个星期等于28: " << (week_b.days() == 28) << endl;

  // 日期混合相加
  years year(2);       // 2年
  months month(5);     // 5个月

  months item = year + month;
  cout << "总计: " << item.number_of_months() << " 个月" << endl;
  cout << "总计: " << (year).number_of_years() << " 年 " << "零 " << month.number_of_months() << " 个月" << endl;

  // 日期的运算
  date date_b(2019, 01, 01), date_c(2020, 01, 01);
  cout << "日期相差: " << date_c - date_b << " 天" << endl;

  date_b += months(12);
  cout << "加12个月后: " << date_b << endl;

  date_b -= days(100);
  cout << "减100天后: " << date_b << endl;

  std::system("pause");
  return 0;
}

```



# 日期区间与变动区间

```c
#include <iostream>
#include <boost\date_time\gregorian\gregorian.hpp>

using namespace std;
using namespace boost;
using namespace boost::gregorian;

int main(int argc, char const* argv[])
{
	// 指定日期区间
	date_period date_per(date(2020, 1, 1), days(20));
	cout << "当前区间: " << date_per << " 总长度: " << date_per.length().days() << endl;
	cout << "第一天为: " << date_per.begin().day() << " 最后一天: " << date_per.last().day() << endl;

	// 动态变动区间 shift = 区间整体向后延申3天
	date_per.shift(days(3));
	cout << "第一天为: " << date_per.begin().day() << " 最后一天: " << date_per.last().day() << endl;

	// 动态变动区间 expand = 区间分别向前和向后延申2天
	date_per.expand(days(2));
	cout << "第一天为: " << date_per.begin().day() << " 最后一天: " << date_per.last().day() << endl;

	std::system("pause");
	return 0;
}

```


# 日期区间范围判断

本节主要介绍了boost库中使用日期区间进行日期范围判断的相关内容。在实际开发中，经常需要对时间区间进行判断，以便更好地满足业务需求。本节示例介绍了如何使用boost库中提供的日期区间函数进行日期范围判断，以及如何通过代码示例演示如何使用这些函数。



具体而言，我们介绍了如何判断一个日期是否在指定的日期区间范围内，如何判断两个日期区间是否重叠，以及如何获得两个日期区间的交集等等。需要注意的是，在使用日期区间函数进行日期范围判断时，应充分考虑时区等一系列问题，并根据具体需求进行灵活调整，以便更好地满足业务需求。

```c
#include <iostream>
#include <boost\date_time\gregorian\gregorian.hpp>

using namespace std;
using namespace boost;
using namespace boost::gregorian;

int main(int argc, char const *argv[])
{
  // 指定日期区间
  date_period date_per(date(2020, 1, 1), days(20));

  // 区间范围判断: is_before()/is_after() = 日期区间是否在日期前或后
  cout << "是否在2009年之后: " << date_per.is_after(date(2009, 12, 1)) << endl;
  cout << "是否在2009年之前: " << date_per.is_before(date(2009, 12, 1)) << endl;

  // 区间包含判断: contains() 日期区间是否包含另一个区间或日期
  cout << "是否包含2020/01/15: " << date_per.contains(date(2020, 1, 15)) << endl;

  // 区间交集判断: intersects() 判断区间是否存在交集
  date_period date_inter_a(date(2020, 1, 1), days(31));    // 2020-1-1 -> 2020-1-31
  date_period date_inter_b(date(2020, 1, 20), days(30));   // 2020-1-20 -> 2020-2-19
  cout << "两区间是否存在交集: " << date_inter_a.intersects(date_inter_b) << endl;

  // 获取交集
  if (!date_inter_a.intersection(date_inter_b).is_null())
  {
    cout << "输出交集: " << date_inter_a.intersection(date_inter_b) << endl;
  }

  // 区间并集判断: merge()/span() 判断并集与合并
  if (!date_inter_a.intersection(date_inter_b).is_null())
  {
    cout << "合并后的并集: " << date_inter_a.merge(date_inter_b) << endl;
    cout << "合并后的并集: " << date_inter_a.span(date_inter_b) << endl;
  }

  std::system("pause");
  return 0;
}

```



# 使用日期迭代器

本节主要介绍了boost库中使用日期迭代器进行日期遍历的相关内容。在实际开发中，经常需要对一段时间内的日期进行遍历，以便进行数据处理等操作。本节介绍了如何使用boost库中的日期迭代器，以及如何通过代码示例演示如何使用这些迭代器。



具体而言，我们介绍了如何使用整数迭代器和日期迭代器创建日期序列，如何进行迭代器运算，以及如何使用for_each算法来处理日期序列等等。

```c
#include <iostream>
#include <boost\date_time\gregorian\gregorian.hpp>

using namespace std;
using namespace boost;
using namespace boost::gregorian;

int main(int argc, char const* argv[])
{
    // 日期迭代器(天)
    date today(2020, 1, 1);                          // 指定当前日期
    date day_start(today.year(), today.month(), 1);  // 指定当月第一天
    date day_end = today.end_of_month();             // 指定当月最后一天

    for (day_iterator day_iter(day_start); day_iter != day_end; ++day_iter)
    {
        cout << "输出日期: " << *day_iter << " 星期: " << day_iter->day_of_week() << endl;
    }

    // 计算指定 2020/01/01 有几个周末
    int count = 0;
    for (day_iterator day_iter(date(today.year(), 1, 1)); day_iter != today.end_of_month(); ++day_iter)
    {
        // 判断是否为周日
        if (day_iter->day_of_week() == Sunday)
            ++count;
    }
    cout << "该月有: " << count << " 个周末." << endl;

    // 计算该年总共多少天
    int count_day = 0;
    for (month_iterator mon_iter(date(today.year(), 1, 1)); mon_iter < date(today.year() + 1, 1, 1); ++mon_iter)
    {
        count_day += mon_iter->end_of_month().day();
    }
    cout << "该年有: " << count_day << " 天" << endl;

    std::system("pause");
    return 0;
}

```



# 时钟与时间点

本节主要介绍了boost库中时钟和时间点相关的内容。时钟和时间点是boost库中与时间处理相关的重要概念。在本节中，我们首先介绍了boost库中常用的时钟类型，例如system_clock、steady_clock和high_resolution_clock等，并通过代码示例演示了如何使用这些时钟类型。



通过本节内容的学习，读者可掌握如何使用boost库中的时钟和时间点进行时间处理，以及如何将时间点转换成日期或时间对象等操作，提高时间处理能力及代码编程水平。

```c
#include <iostream>
#include <boost/chrono.hpp>
#include <boost/chrono/include.hpp>
#define BOOST_CHRONO_EXITENSIONS

using namespace std;
using namespace boost;

int main(int argc, char const *argv[])
{
  // 获取计算机启动时间
  auto pt_c = boost::chrono::steady_clock::now();
  auto tmp = pt_c.time_since_epoch();
  cout << "计算机启动时间: " << boost::chrono::round<boost::chrono::hours>(tmp) << endl;
  
  // 时间点的简单转换
  auto pt_a = boost::chrono::system_clock::now();
  cout << "获取时间点: " << pt_a << endl;
  cout << "初始时间点到现在的秒数: " << pt_a.time_since_epoch() << endl;

  auto day = pt_a.time_since_epoch();
  cout << "将秒数转为小时: " << boost::chrono::duration_cast<boost::chrono::hours>(day) << endl;

  // 时间点的计算
  auto pt_b = pt_a + boost::chrono::minutes(10) + boost::chrono::hours(10);
  cout << "将pt_b加10分钟在加10小时: " << pt_b << endl;

  // 时间点转为实际时间
  auto time = boost::chrono::system_clock::to_time_t(pt_a);
  cout << "输出字符串日期: " << std::ctime(&time) << endl;
  
  std::system("pause");
  return 0;
}

```


#  时间基本操作

本节主要介绍了boost库中的一些时间基本操作，包括获取当前时间，计算时间差值，以及比较时间大小等等。这些操作是时间处理中的基本操作，非常实用。



在本节中，我们首先介绍了如何获取当前时间，包括获取时间点类型、日期类型、以及时间类型等等；然后，我们介绍了如何计算时间差值，包括使用时间持续类型、时钟类型等等；最后，我们介绍了如何比较时间大小，包括比较时间点和日期等等。

```c
#include <iostream>
#include <boost\date_time\posix_time\posix_time.hpp>

using namespace std;
using namespace boost;
using namespace boost::posix_time;

int main(int argc, char const *argv[])
{
  // 时间的创建与赋值
  time_duration time_a(1, 10, 20, 1000);
  cout << time_a.hours() << " 小时 " << time_a.minutes() << " 分钟 " << time_a.seconds() << " 秒" << endl;
  
  hours h(2); minutes m(10); seconds s(30); millisec ms(1);
  time_duration time_b = h + m + s + ms;
  cout << time_b.hours() << " 小时 " << time_b.minutes() << " 分钟 " << time_b.seconds() << " 秒" << endl;

  time_duration time_c = duration_from_string("2:12:11:001");
  cout << time_c.hours() << " 小时 " << time_c.minutes() << " 分钟 " << time_c.seconds() << " 秒" << endl;

  // 时间的格式化输出
  time_duration time_d(2, 10, 20, 1000);
  cout << "标准格式输出: " << to_simple_string(time_d) << endl;
  cout << "纯数字格式输出: " << to_iso_string(time_d) << endl;

  // 时间的运算
  time_duration time_e(2, 10, 20, 1000);
  cout << "原时间: " << time_e << endl;

  time_e += minutes(10);  // 增加十分钟
  time_e += hours(3);     // 增加三小时
  cout << "当前时间: " << time_e << endl;

  std::system("pause");
  return 0;
}

```


#  时间点加减法

本节主要介绍了boost库中时间点加减法相关的内容。时间点加减法是时间处理中的常见操作，可以方便地对时间点进行加减运算，以满足实际需求。在本节中，我们首先介绍了boost库中常用的时间持续类型、时钟类型等等，然后通过代码示例演示了如何使用这些类型进行时间点加减运算。

```c
#include <iostream>
#include <boost\date_time\posix_time\posix_time.hpp>

using namespace std;
using namespace boost;
using namespace boost::posix_time;
using namespace boost::gregorian;

int main(int argc, char const* argv[])
{
	// 创建时间点
	ptime ptime_a(date(2020, 01, 20), hours(2));
	cout << "输出时间点: " << ptime_a << endl;

	ptime ptime_b = time_from_string("2020-1-10 02:12:00");
	cout << "输出时间点: " << ptime_b << endl;

	ptime ptime_c = from_iso_string("20200112T121122");
	cout << "输出时间点: " << ptime_c << endl;

	// 操作时间点(递增递减)
	ptime ptime_d(date(2020, 12, 11), hours(11) + minutes(12) + seconds(50));

	date today = ptime_d.date();
	time_duration time = ptime_d.time_of_day();
	cout << "日期: " << today << " 时间: " << time << endl;

	cout << "递增前: " << ptime_d << endl;
	ptime_d += hours(1);
	ptime_d += days(10);
	cout << "递增后: " << ptime_d << endl;

	std::system("pause");
	return 0;
}

```





# 时间点格式化

本节主要介绍了boost库中时间点格式化输出相关的内容。时间点的格式化输出是我们进行时间处理中常用的操作之一，可以将时间点转化为具有可读性的字符串，以方便后续的处理和展示。

```c
#include <iostream>
#include <boost\date_time\posix_time\posix_time.hpp>

using namespace std;
using namespace boost;
using namespace boost::posix_time;
using namespace boost::gregorian;

int main(int argc, char const *argv[])
{
  // 时间点格式化输出
  ptime ptime_e(date(2020, 1, 1), hours(10));
  cout << "默认时间点格式: " << to_simple_string(ptime_e) << endl;
  cout << "文本格式输出: " << to_iso_string(ptime_e) << endl;
  cout << "标准格式输出: " << to_iso_extended_string(ptime_e) << endl;

  // 日期与时间格式化
  date today(2020, 12, 11);

  date_facet * dfacet = new date_facet("%Y 年 %m 月 %d 日");
  cout.imbue(locale(cout.getloc(), dfacet));
  cout << "格式化中文显示(日期): " << today << endl;

  time_facet * tfacet = new time_facet("%Y 年 %m 月 %d 日 %H 时 %M 分 %S%F 秒");
  cout.imbue(locale(cout.getloc(), tfacet));
  cout << "格式化日期与时间: " << ptime(today, hours(11) + minutes(24) + millisec(59)) << endl;
  
  std::system("pause");
  return 0;
}

```

# 时间区间操作

本节主要介绍了boost库中时间区间操作相关的内容。时间区间操作是我们进行时间处理中常用的操作之一，可以方便地对时间区间进行加减运算、格式化输出等操作，以满足实际需求。在本节中，我们首先介绍了boost库中常用的时间区间类型，例如date_period类型等等。然后，我们通过代码示例演示了如何使用时间区间类型对时间区间进行加减运算、格式化输出等操作。

```c
#include <iostream>
#include <boost\date_time\posix_time\posix_time.hpp>

using namespace std;
using namespace boost;
using namespace boost::posix_time;
using namespace boost::gregorian;

int main(int argc, char const* argv[])
{
    // 时间日期区间
    ptime ptime_a(date(2020, 1, 1), hours(0) + minutes(20) + seconds(40));
    cout << "先定义日期时间: " << ptime_a << endl;         // 2020-1-1 00:20:40
    time_period time_per_a(ptime_a, hours(12));            // 2020-1-1 12:20:40
    cout << "输出12小时的区间: " << time_per_a << endl;

    // 时间日期交集判断 (time_per_a 与 time_per_b 的交集)
    ptime ptime_b(date(2020, 1, 1), hours(0) + minutes(10) + seconds(60));
    time_period time_per_b(ptime_b, hours(12));            // 2020-1-1 12:10:60
    cout << "是否存在交集: " << time_per_a.intersects(time_per_b) << endl;
    cout << "交集为: " << time_per_a.intersection(time_per_b) << endl;

    // 平移与扩展时间
    time_per_a.shift(hours(1));
    cout << "向后平移一小时: " << time_per_a << endl;

    time_per_a.expand(hours(10));
    cout << "两端扩展10小时: " << time_per_a << endl;

    // 时间迭代器(每次迭代10分钟)
    ptime ptime_c(date(2020, 1, 1), hours(10));
    for (time_iterator t_iter(ptime_c, minutes(10)); t_iter < ptime_c + hours(1); ++t_iter)
    {
        cout << "时间迭代: " << *t_iter << endl;
    }

    std::system("pause");
    return 0;
}

```



#  时间长度计算

```c
#include <iostream>
#include <boost/chrono.hpp>
#include <boost/chrono/include.hpp>

#define BOOST_CHRONO_EXITENSIONS

using namespace std;
using namespace boost;

int main(int argc, char const* argv[])
{
	boost::chrono::milliseconds milliseconds(1000);   // 定义1000毫秒
	boost::chrono::seconds seconds(20);               // 定义20秒
	boost::chrono::minutes minutes(30);               // 定义30分钟
	boost::chrono::hours hours(1);                    // 定义1小时

	typedef boost::chrono::duration<long, boost::ratio<30>> half_min;        // 定义半分钟
	typedef boost::chrono::duration<int, boost::ratio<60 * 15>> quater;      // 定义15分钟
	typedef boost::chrono::duration<double, boost::ratio<3600 * 24>> day;    // 定义1天

	cout << "返回时间: " << seconds.count() << endl;
	cout << "单位最小值: " << seconds.min() << " 单位最大值: " << seconds.max() << endl;

	// 时间单位 递增与递减
	seconds *= 2;
	cout << "将秒扩大2倍: " << seconds.count() << endl;

	seconds = seconds + boost::chrono::seconds(100);
	cout << "将秒增加100: " << seconds << endl;

	seconds = seconds - boost::chrono::seconds(40);
	cout << "将秒递减40: " << seconds << endl;

	// 不同时间单位相加 (分钟与秒相加转为秒)
	boost::chrono::seconds temporary;
	temporary = seconds + minutes;
	cout << "100秒加30分钟: " << temporary << endl;

	// 不同时间单位相加 (分钟与秒相加转为分钟)
	typedef boost::chrono::duration<double, boost::ratio<60>> my_minutes;
	my_minutes m(5);
	m += temporary;
	cout << "1900秒加5分钟: " << m << endl;

	// 时间之间类型转换
	boost::chrono::seconds cast_minutes(300);

	boost::chrono::minutes min = boost::chrono::duration_cast<boost::chrono::minutes>(cast_minutes);
	cout << "300秒转为分钟: " << min << endl;

	boost::chrono::seconds cast_seconds(3600 + 30);   // 1小时30秒
	cout << "输出60分钟: " << boost::chrono::floor<boost::chrono::minutes>(cast_seconds) << endl;
	cout << "输出61分钟: " << boost::chrono::ceil<boost::chrono::minutes>(cast_seconds) << endl;
	cout << "输出60分钟: " << boost::chrono::round<boost::chrono::minutes>(cast_seconds) << endl;
	cout << "输出1小时: " << boost::chrono::round<boost::chrono::hours>(cast_seconds) << endl;

	std::system("pause");
	return 0;
}

```


