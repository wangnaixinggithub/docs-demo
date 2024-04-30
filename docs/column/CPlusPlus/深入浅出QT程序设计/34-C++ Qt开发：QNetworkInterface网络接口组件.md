# C++ Qt开发：QNetworkInterface网络接口组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QNetworkInterface`组件实现查询详细的网络接口参数。

在Qt网络编程中，`QNetworkInterface`是一个强大的类，提供了获取本地网络接口信息的能力。通过`QNetworkInterface`，可以轻松地获取有关网络接口的信息，包括接口的名称、硬件地址、IP地址和子网掩码等。这个类对于需要获取本地网络环境信息的应用程序特别有用，例如网络配置工具、网络监控程序等。`QNetworkInterface`通过提供一致而易于使用的接口，使得网络编程中的任务更加简便和可靠。

以下是`QNetworkInterface`类的一些常用函数的解释：

| 函数                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `static QList<QNetworkInterface> allInterfaces()`            | 返回系统中所有可用的网络接口列表。                           |
| `static QNetworkInterface interfaceFromName(const QString &name)` | 根据给定名称返回对应的网络接口。                             |
| `static QList<QNetworkInterface> allAddresses()`             | 返回系统中所有网络接口的IP地址列表。                         |
| `QString name() const`                                       | 返回网络接口的名称。                                         |
| `QNetworkInterface::InterfaceType type() const`              | 返回网络接口的类型。                                         |
| `bool isValid() const`                                       | 判断网络接口是否有效。                                       |
| `QNetworkAddressEntry addressEntryAt(int index) const`       | 返回索引位置的网络接口地址。                                 |
| `QList<QNetworkAddressEntry> addressEntries() const`         | 返回网络接口的地址列表。                                     |
| `QNetworkAddressEntry addressEntry() const`                  | 返回首选网络接口地址，如果没有地址则返回空的`QNetworkAddressEntry`对象。 |
| `QNetworkInterface::HardwareAddress macAddress() const`      | 返回网络接口的硬件地址（MAC地址）。                          |
| `bool isLoopBack() const`                                    | 判断网络接口是否是回环接口。                                 |
| `bool isPointToPoint() const`                                | 判断网络接口是否是点对点连接。                               |
| `bool supportsMulticast() const`                             | 判断网络接口是否支持多播。                                   |
| `bool operator==(const QNetworkInterface &other) const`      | 判断两个网络接口是否相等。                                   |
| `bool operator!=(const QNetworkInterface &other) const`      | 判断两个网络接口是否不相等。                                 |
| `QList<QNetworkInterface> allInterfaces(QNetworkInterface::InterfaceType type)` | 返回指定类型的所有网络接口列表。                             |

显示详细信息

`QNetworkInterface`类提供了丰富的功能，用于获取和处理系统中的网络接口信息。通过这些函数，可以轻松地检索有关网络接口的各种详细信息，为网络编程提供了便捷的工具。

网卡的查询非常容易实现，只需要调用通用接口`QNetworkInterface::allInterfaces()`即可，该函数可以直接返回指定类型的所有网络接口列表。

在解析IP地址时还需要使用`QNetworkAddressEntry`类，QNetworkAddressEntry是用于表示网络接口地址信息的类。它包含了IP地址、子网掩码、广播地址以及前缀长度等关键信息，为处理网络配置和操作提供了便捷的工具。通过`QNetworkAddressEntry`可以轻松地获取和设置网络接口的各种地址属性，用于网络编程中的接口配置和信息查询。

以下是`QNetworkAddressEntry`类的一些常用函数和描述：

| 函数                                                         | 描述                                                   |
| ------------------------------------------------------------ | ------------------------------------------------------ |
| `QNetworkAddressEntry()`                                     | 默认构造函数，创建一个空的`QNetworkAddressEntry`对象。 |
| `QNetworkAddressEntry(const QNetworkAddressEntry &other)`    | 拷贝构造函数，根据给定的`other`对象创建一个新的对象。  |
| `QNetworkAddressEntry &operator=(const QNetworkAddressEntry &other)` | 赋值运算符，将`other`对象的值赋给当前对象。            |
| `void setIp(const QHostAddress &address)`                    | 设置IP地址。                                           |
| `QHostAddress ip() const`                                    | 返回IP地址。                                           |
| `void setNetmask(const QHostAddress &netmask)`               | 设置子网掩码。                                         |
| `QHostAddress netmask() const`                               | 返回子网掩码。                                         |
| `void setBroadcast(const QHostAddress &broadcast)`           | 设置广播地址。                                         |
| `QHostAddress broadcast() const`                             | 返回广播地址。                                         |
| `void setPrefixLength(int length)`                           | 设置前缀长度。                                         |
| `int prefixLength() const`                                   | 返回前缀长度。                                         |
| `void clear()`                                               | 清空`QNetworkAddressEntry`对象，重置为初始状态。       |

显示详细信息

通过使用`aInterface.addressEntries()`我们可直接读入IP地址列表，并将其放入到`QNetworkAddressEntry`内保存，通过`*.count()`得到网卡总数量，并调用`at()`得到我们所需要的地址，最后就能够通过`aEntry.ip().*`的方式遍历出所有的地址信息，代码如下所示；

```c
void MainWindow::on_pushButton_clicked()
{
    QList<QNetworkInterface> list=QNetworkInterface::allInterfaces();
    for(int i=0;i<list.count();i++)
    {
        QNetworkInterface aInterface=list.at(i);
        if (!aInterface.isValid())
           continue;

        ui->plainTextEdit->appendPlainText("设备名称："+aInterface.humanReadableName());
        ui->plainTextEdit->appendPlainText("硬件地址："+aInterface.hardwareAddress());
        QList<QNetworkAddressEntry> entryList=aInterface.addressEntries();
        for(int j=0;j<entryList.count();j++)
        {
            QNetworkAddressEntry aEntry=entryList.at(j);
            ui->plainTextEdit->appendPlainText("IP 地址："+aEntry.ip().toString());
            ui->plainTextEdit->appendPlainText("子网掩码："+aEntry.netmask().toString());
            ui->plainTextEdit->appendPlainText("广播地址："+aEntry.broadcast().toString());
        }

        ui->plainTextEdit->appendPlainText(" ------------------------------------------- ");
        ui->plainTextEdit->appendPlainText("\n");
    }
}
```

运行后点击查询网卡信息，可得到完整的本机网卡，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6e27d63b57bdbf5848521caa9bfb629c%5B1%5D.png)