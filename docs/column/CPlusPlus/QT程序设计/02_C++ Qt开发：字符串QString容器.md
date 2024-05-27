# C++ Qt开发：字符串QString容器

在Qt框架中，QString 是一个强大而灵活的字符串容器，专为处理 Unicode 字符而设计。它提供了许多方便的方法来操作和处理字符串，使得在跨平台开发中能够轻松地进行文本操作。QString 是 Qt 开发中不可或缺的一部分，它的灵活性和强大的功能使其成为处理文本和字符串操作的理想选择。本篇博客将深入探讨 QString 的各种用法，包括字符串的连接、追加与移除、格式化输出、统计字符串长度、去空格操作、字符串的切割与截取，以及类型转换等，以帮助读者更好地利用这一重要的字符串容器。

首先读者需要打开`Qt Creator`程序并新建一个`Qt Console Application`项目，创建选项我们可以直接采用默认配置，当创建成功后读者可看到如下图所示的默认选项；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231210100629680.png)





上述案例中使用的就是命令行程序开发，接下来我们将演示如何灵活的使用`QString`容器实现对字符串的灵活管理，在使用之前读者需要包含`#include <QString>`头文件，该文件内包含了所有字符串操作函数。

###  连接追加与移除操作

#### 字符串连接

在Qt中，字符串的定义可以使用`QString str1`的方式实现，我们可以使用简单的加号 + 或者 append 方法将两个字符串连接在一起。

代码中的`toStdString`则代表将字符串转换为标准的std格式，除了使用 toStdString() 将 QString 转换为标准的 C++ 字符串 (std::string) 之外，还有其他几种字符串转换的方法：

- **`toLatin1()` 和 `toUtf8()`：**

  - `toLatin1()` 返回一个 Latin-1 编码的 `QByteArray`，其中包含了 `QString` 的内容。

  - `toUtf8()` 返回一个 UTF-8 编码的 `QByteArray`。

  - ```c
        QString str = "Hello, JacksonWang!";
        QByteArray latin1Data = str.toLatin1();
        QByteArray utf8Data = str.toUtf8();
    ```

- **`toLocal8Bit()`：**

  - 返回一个包含 `QString` 内容的 `QByteArray`，使用本地字符集编码。

  - ```c
        QString str = "Hello, JacksonWang!";
        QByteArray localData = str.toLocal8Bit();
    ```

- **`toLatin1()`、`toUtf8()`、`toLocal8Bit()` 的 `constData()` 方法：**

  - 这些方法返回一个指向字符串数据的常量指针，可以直接传递给需要 C 风格字符串的函数。

  - ```c
        QString str = "Hello, JacksonWang!";
        const char* latin1Data = str.toLatin1().constData();
        const char* utf8Data = str.toUtf8().constData();
        const char* localData = str.toLocal8Bit().constData();
    ```

这些方法允许根据需要选择不同的字符集和编码方式，并在Qt应用程序中方便地进行字符串和字节数组之间的转换。

如下我们演示如何简单的实现字符串的拼接，示例代码如下:

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString Str1 = "hello";
    QString Str2 = "JacksonWang";
    QString temp;
	 
    //直接用 + 运算符拼接字符串，即使是字符串常量 编译器也会把它转成QString对象处理继续做拼接
    temp = Str1 + " " + Str2;

    //QString => string
    std::cout << temp.toStdString().c_str() << std::endl;
    std::cout << (Str1 + " " + Str2).toStdString().c_str() << std::endl;

    return a.exec();
}

```

#### 追加与移除

`QString` 提供了多种方法来追加与移除字符串，追加时可以使用`append()/push_back()`在移除时可以使用`remove()`，而`prepend()`提供了在头部追加的功能。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString Str = "hello ";

    // hello => hello JackWang
    Str.append("JacksonWang");
    
    //hello JackWang => hello JackWangtest
    Str.push_back("test");
    
    //hello JackWangtest => JackWangtest
    Str.remove("hello");
    
    //JackWangtest => -->JackWangtest
    Str.prepend("-->");

    std::cout << Str.toStdString().data() << std::endl;

    return a.exec();
}

```

#### 字符串链接

QString容器默认就支持自定义输出，该容器内部有一个`sprintf`可以很容易的实现字符串的连接与个性化输出，当然了其初始化有两种方式，一种是定义后调用，另一种是在初始化时填充。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString Str1;
    QString Str2;

    //格式化输出字符串
    Str1.sprintf("%s %s","Hello","QString!");
    std::cout << Str1.toStdString().data() << std::endl;



    //构造时 格式化字符串
    Str2 = QString("%1 is age =  %2 . ").arg("JacksonWang").arg("18");
    std::cout << Str2.toStdString().data() << std::endl;
    
    
    //支持和 QChar 做拼接
    std::cout << (QString("1") + QChar('A')).toStdString().data() << std::endl;
    std::cout << (QString("2") + QString('B')).toStdString().data() << std::endl;

    return a.exec();
}

```

#### 字符串长度统计

符串长度统计有多种方式，可以使用`count()`也可以是`size()`也可以使用`length()`三者均可以。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString Str1;
    Str1.sprintf("%s %s","Welcome","to you !");
    std::cout << Str1.toStdString().data() << std::endl;

    // 实现统计字符串长度
    std::cout << Str1.count() << std::endl;
    std::cout << Str1.size() << std::endl;
    std::cout << Str1.length() << std::endl;

    return a.exec();
}

```

#### 字符串去空格

空格的去除有多种方式，使用`trimmed()`可实现去掉字符串首尾两端空格，使用`simplified`可去掉所有空格，中间连续的只保留一个。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 去空格
    QString Str1 = " hello  JacksonWang   welcome !  ";
    
    //去掉首尾空格，开发常用
    Str1 = Str1.trimmed();
    
    //处理，中间有多个空格的，比如说 hello 和 JacksonWang 之间有两个空格，JacksonWang 和 welcome
    //之间又有三个空格，执行完此API之后，他们之间的空格均为一个空格
    Str1 = Str1.simplified();           
    std::cout << Str1.toStdString().data() << std::endl;

    return a.exec();
}

```

#### 字符串选取

用 `QString` 类中的一些字符串操作方法，通过`mid`可以截取区间参数，当然`remove`也支持区间参数。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString str1 = "nihaoJacksonWang";

    // 从索引2开始 取10个字符包含索引2指向字符。很像CString.Mid
    str1 = str1.mid(2,10);
    std::cout << str1.toStdString().data() << std::endl;

    //移除索引1到索引3之间的字符  123456 => 156
    std::cout << (QString("123456").remove(1,3)).toStdString().data() << std::endl;

    // 超过 11 个字符就保留 11 个字符，否则不足替换为 '.'
    std::cout << (QString("abcdefg").leftJustified(11,'.',true)).toStdString().data() << std::endl;
    std::cout << QString("wwwwwwwwwwwwwwwwwwwwwwwww").leftJustified(11,'.',true).toStdString().data() << std::endl;
    return a.exec();
}

```

### 字符串查询与替换

#### 查询字符串包含

在一个字符串中查询是否包含一个子串，这里通过使用`Qt::CaseInsensitive`指定不区分大小写，通过`Qt::CaseSensitive`指定为区分大小写，查询函数为`contains`保持不变。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString str = "hello JacksonWang welcome admin";
    bool bContain;

    // 查询字符串中是否包含特定子串
    bContain = str.contains("JacksonWang",Qt::CaseInsensitive);  // 不区分大小写
    std::cout << bContain << std::endl;

    bContain = str.contains("JacksonWang",Qt::CaseSensitive);    // 区分大小写
    std::cout << bContain << std::endl;

    return a.exec();
}
```

#### 判断开头结尾

开头结尾的判断可以使用`startsWith`和`endsWith`，在判断开头时通过`Qt::CaseInsensitive`标志定义，而结尾则使用`Qt::CaseSensitive`标志。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString str = "hello JacksonWang welcome admin";
    int index;
    bool bStartWith = false;
    bool bEndWith = false;

    // 判断是否以某个字符串开头或结束
    bStartWith = str.startsWith("hello",Qt::CaseInsensitive);      // 判断是否hello开头
    std::cout << bStartWith << std::endl;

    bEndWith = str.endsWith("admin",Qt::CaseSensitive);        // 判断是否admin结尾
    std::cout << bEndWith << std::endl;

    return a.exec();
}
```

#### 字符串位置查询

位置查询也是很常见的需求，我们可以使用`indexOf()`来查询最早出现某个字符的位置，当然也可以使用`lastIndexOf()`查询最后一次出现的位置，这两个函数接收一个字符串用作过滤条件。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString str = "xlen=1500=unused";
    int firstEqualOps = -1;
    int lastEqualOps = -1;


    // 从字符串中取左边/右边多少个字符
    firstEqualOps = str.indexOf("=");        //查第一个=出现的位置
    lastEqualOps = str.lastIndexOf("=");   // 查最后一个=出现的位置


    //基于=号，做拆分 得到 xlen 1500 unused
    std::cout << str.left(firstEqualOps).toStdString().data()<< std::endl;
    std::cout << str.mid(firstEqualOps+1,lastEqualOps - firstEqualOps-1).toStdString().data() << std::endl;
    std::cout << str.right(str.size() - lastEqualOps - 1).toStdString().data() << std::endl;

    return a.exec();
}
```

#### 字符串替换

字符串的替换可以使用`replace()`函数，该函数接受两个参数第一个时需要替换的字符串，第二个是替换后的字符串。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString str = "hello JacksonWang welcome admin";

    // 替换字符串中所有的JacksonWang为admin
    str = str.replace("JacksonWang","admin");
    std::cout << str.toStdString().data() << std::endl;

    return a.exec();
}

```

####  字符串截取

字符串的截取可以使用自带的`section()`函数，该函数接受三个参数，第一个是截取字符分隔符，第二和第三个是需要截取的字段，当然也可以通过灵活的利用`left/mid/right/indexOf`实现对字符串的截取。

```c
#include <QCoreApplication>
#include <QString>
#include <QStringList>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 字符串的截取
    QString str1 = "uname,uage,usex";
    std::cout << str1.section(",",0,0).toStdString().data() << std::endl;
    std::cout << str1.section(",",1,1).toStdString().data() << std::endl;
   std::cout << str1.section(",",2,2).toStdString().data() << std::endl;

    // 自己截取
    QString str2 ="192.168.1.10";
    std::cout << str2.left(str2.indexOf(".")).toStdString().data() << std::endl;
    std::cout << str2.mid(str2.indexOf(".")+1,3).toStdString().data() << std::endl;
    std::cout << str2.mid(str2.indexOf(".")+1,1).toStdString().data() << std::endl;
    std::cout << str2.right(str2.size() - str2.lastIndexOf(".")-1).toStdString().data() << std::endl;


    // 切割字符串
    QStringList splitList =QString("100~120~130~140").split('~');
   for(QStringList::iterator itFn =  splitList.begin(); itFn != splitList.end(); itFn++)
   {
        std::cout << (*itFn).toStdString().data() << std::endl;
   }


    return a.exec();
}

```

####  字符串空判断

判断一个字符串是否为空，这个功能可以直接使用`isNull/isEmpty`函数来实现，如下是这三个函数的具体区别。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 判断字符串是否为空
    QString str4,str5="";
    std::cout << str4.isNull() << std::endl;    // 为空则为True
    std::cout << str5.isNull() << std::endl;    // \0不为空
    std::cout << str5.isEmpty() << std::endl;   // 为空则为False
    
    //记住开发用isEmpty()就完事了！
    return a.exec();
}

```

### 字符串类型转换

#### 大小写转换

与标准C语言一致，小写转为大写同样可以调用`toUpper()`函数实现，小写的话可以使用`toLower()`函数实现。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QString str = "uname,uage,usex";
    QString int_str = "100,200,300";

    // 大小写转换
    str = str.toUpper();            // 转为大写
    std::cout << str.toStdString().data() << std::endl;
    str = str.toLower();            // 转为小写
    std::cout << str.toStdString().data() << std::endl;

    return a.exec();
}

```

#### 字符串与整数

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);


    QString intStr = "100,200,300";
    QString tempStr;
    bool bRet = false;
    int decNumber; //十进制数
    int hexNumber; //十六进制数
    QString numberStr; //数字字符串

      // 提取出第一个字符串
     tempStr= intStr.section(",",0,0);

     // 将字符串转为整数
    decNumber = tempStr.toInt(&bRet,10);              // 转为十进制整数
    std::cout << decNumber << std::endl;

    hexNumber = tempStr.toUInt(&bRet,16);            // 转为十六进制数
    std::cout << hexNumber << std::endl;


    // 将整数转为字符串
    numberStr = numberStr.setNum(100,16);  // 转为十六进制字符串
    std::cout << numberStr.toStdString().data() << std::endl;

    return a.exec();
}

```

当然了标准的`QString`容器内天生也自带转换功能，我们可以使用这些功能进行自定义转换，如下所示；

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 100 转16进制
    std::cout << (QString::number(100,16)).toStdString().data() << std::endl;

    // 转换为 16 进制，不足 8 位前面补 ‘0’
    std::cout << (QString("0%1").arg(123,8,16,QLatin1Char('0'))).toStdString().data() << std::endl;

    // 转为8进制
    std::cout << QString("0%1").arg(QString::number(100,8)).toStdString().data() << std::endl;
    std::cout << (QString("0%1").arg(QString::number(.777,'f',1))).toStdString().data() << std::endl;

    return a.exec();
}

```



#### 格式化输出转换

浮点数与字符串的转换可以使用sprintf()格式化，也可以使用asprintf()格式化，这两个函数的区别是，QString::sprintf是在原始字符串上操作， QString::asprintf 允许创建一个格式化的字符串，并返回一个新的 QString 对象，而不是直接在现有对象中进行修改。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 格式化输出转换
    float total = 3.1415926;
    QString strTotal;
    QString strTotal1;
    QString strTotal2;

    // 将浮点数转换为字符串
    strTotal1 = strTotal.sprintf("%.4f",total);
    
    std::cout << strTotal.toStdString().data() << std::endl;//结果相同
    std::cout << strTotal1.toStdString().data() << std::endl;



    // 将双精度浮点数转为字符串
    strTotal2 = QString::asprintf("%2f",total);
    std::cout << strTotal.toStdString().data() << std::endl; //结果不同
    std::cout << strTotal2.toStdString().data() << std::endl;
    return a.exec();
}

```

这里需要多说一下类型转换，一般`StdString()`可以直接使用`ToUTF8()`转换格式，而`QByteArray`也可以直接使用`StdString()`函数将其转换成`QString`格式。

```c
#include <QCoreApplication>
#include <QString>
#include <iostream>

using namespace std;

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 编码之间的转换
    QString str_string = "welcome to you !";

    // 将StdString转换为UTF8格式
    QByteArray ba = str_string.toUtf8();
    std::cout << ba.toStdString().data() << std::endl;

    // 类型转换QByteArray转换QString
    QByteArray byte;

    byte.resize(2);
    byte[0]='1';
    byte[1]='2';
    QString strs = byte;
    std::cout << strs.toStdString().data() << std::endl;

    return a.exec();
}

```

