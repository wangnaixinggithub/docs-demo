# C++ Qt开发：QHostInfo主机地址查询组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QHostInfo`组件实现对主机地址查询功能。

在Qt网络编程中，QHostInfo是一个强大而灵活的组件，用于获取有关主机的信息，包括主机名、IP地址和域名解析等。通过支持异步查询的机制，它能够在后台获取主机信息，避免阻塞主线程，同时通过信号-槽机制提供查询结果。其多主机查询、可靠的错误处理和与网络环境的适应性，使其成为处理网络应用中主机信息获取的理想选择。

以下是`QHostInfo`类的一些常用函数的解释：

| 函数                                                        | 描述                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `QHostInfo()`                                               | 默认构造函数，创建一个空的`QHostInfo`对象。                  |
| `QHostInfo(const QHostInfo &other)`                         | 拷贝构造函数，根据给定的`other`对象创建一个新的对象。        |
| `QHostInfo &operator=(const QHostInfo &other)`              | 赋值运算符，将`other`对象的值赋给当前对象。                  |
| `QHostInfo &swap(QHostInfo &other)`                         | 交换两个`QHostInfo`对象的值。                                |
| `bool isNull() const`                                       | 判断`QHostInfo`对象是否为空，即未进行任何查询。              |
| `bool isComplete() const`                                   | 判断查询是否完成，返回`true`表示查询已完成，`false`表示正在进行中。 |
| `QList<QHostAddress> addresses() const`                     | 返回与主机相关联的IP地址列表。                               |
| `QString hostName() const`                                  | 返回主机的名称。                                             |
| `QStringList aliases() const`                               | 返回主机的别名列表。                                         |
| `QHostInfo::Error error() const`                            | 返回查询时发生的错误。                                       |
| `QString errorString() const`                               | 返回与错误代码对应的人类可读的错误字符串。                   |
| `static QHostInfo fromName(const QString &name)`            | 根据主机名创建`QHostInfo`对象。                              |
| `static QHostInfo fromAddress(const QHostAddress &address)` | 根据IP地址创建`QHostInfo`对象。                              |
| `static QHostInfo localHostName()`                          | 返回本地主机的`QHostInfo`对象。                              |
| `void clear()`                                              | 清空`QHostInfo`对象，重置为初始状态。                        |
| `static void swap(QHostInfo &first, QHostInfo &second)`     | 交换两个`QHostInfo`对象的值。                                |

显示详细信息

这些函数提供了对主机信息的查询、获取和处理的操作。需要注意，很多函数都是通过异步查询的方式获取主机信息的，因此在使用时需要通过信号-槽机制来获取查询结果。

在使用这个模块时，要确保导入`QT+=network`模块，接着来看该如何实现查询本机IP地址，通过调用`QHostInfo::localHostName`可以直接获取到本机的主机名，调用`QHostInfo::fromName(hostName)`可将该主机名转换为对应的`HostInfo`结构，当具备了这个结构体以后，就可以通过循环遍历`addList.count()`内的所有记录，并`aHost.toString()`输出所有的IP地址表，代码如下所示；

```c
// 查询本机IP地址
void MainWindow::on_pushButton_clicked()
{
    // 本地主机名
    QString hostName=QHostInfo::localHostName();
    std::cout << hostName.toStdString() << std::endl;
    ui->lineEdit->setText(hostName);

    // 查询主机IP地址信息
    QHostInfo hostInfo=QHostInfo::fromName(hostName);

    QList<QHostAddress> addList=hostInfo.addresses();
    if (!addList.isEmpty())
    for (int i=0;i<addList.count();i++)
    {
        // 每一项是一个QHostAddress
        QHostAddress aHost=addList.at(i);

        // 判断是否为IPV4
        if(QAbstractSocket::IPv4Protocol==aHost.protocol())
        {
            ui->listWidget->addItem("IPV4 | " + aHost.toString());
        }
        else
        {
            ui->listWidget->addItem("IPV6 | " + aHost.toString());
        }
    }
}
```

运行后读者可通过点击查询数据按钮实现对本机IP地址的获取，输出效果如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6fe5f483a3ff610e43913e2974be31c6%5B1%5D.png)



QHostInfo组件既可以查询自身IP地址信息，也可以实现对特定域名的IP解析，通过使用`QHostInfo::lookupHost`则可以实现查询特定主机的地址信息，该函数需要传入一个回调，如下所示我们在回调函数内查询主机所有的IP地址并输出，其实现原理与上述方法相同。

```c
void MainWindow::lookedUpHostInfo(const QHostInfo &host)
{
    // 每一项是一个QHostAddress
    QList<QHostAddress> addList=host.addresses();
    if (!addList.isEmpty())
    for (int i=0;i<addList.count();i++)
    {
        QHostAddress aHost=addList.at(i);

        // 判断是否为IPV4
        if(QAbstractSocket::IPv4Protocol==aHost.protocol())
        {
            ui->listWidget_2->addItem("IPV4 | " + aHost.toString());
        }
        else
        {
            ui->listWidget_2->addItem("IPV6 | " + aHost.toString());
        }
    }
}
```

在查询时只需要通过`lookupHost`调用即可，如下代码所示；

```c
void MainWindow::on_pushButton_2_clicked()
{
    // 主机名
    QString hostname=ui->lineEdit_2->text();
    QHostInfo::lookupHost(hostname,this,SLOT(lookedUpHostInfo(QHostInfo)));
}
```

运行后读者可通过点击查询数据按钮实现对特定域名的IP地址获取，输出效果如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/0ceec1923242ff6ccac3c977fdeb8126%5B1%5D.png)