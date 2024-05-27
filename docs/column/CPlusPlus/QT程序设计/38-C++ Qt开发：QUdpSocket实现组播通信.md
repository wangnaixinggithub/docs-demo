# C++ Qt开发：QUdpSocket实现组播通信

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QUdpSocket`组件实现基于UDP的组播通信。

组播是一种一对多的通信方式，允许一个发送者将数据报文发送到多个接收者，这些接收者通过共享相同的组播IP地址进行通信。在设置组播地址时需要注意，该范围被限制在`239.0.0.0～239.255.255.255`以内，这是预留给组播的地址范围。

**setSocketOption 设置套接字**

在Qt中使用组播，首先需要调用`setSocketOption`函数，该函数是 `QUdpSocket` 类的成员函数，用于设置套接字的选项。

该函数原型如下：

```c
bool QUdpSocket::setSocketOption(
    QAbstractSocket::SocketOption option, 
    const QVariant & value
)
```

- `option`：要设置的套接字选项，这里应该是 `QAbstractSocket::MulticastTtlOption`，表示设置多播 TTL 选项。
- `value`：选项的值，这里应该是 TTL 的值。在 IPv4 中，TTL 是一个 8 位的字段，表示数据报在网络中允许经过的最大路由器数量。通常情况下，TTL 值越大，数据报能够传播的范围就越广。

函数返回一个 `bool` 类型的值，表示是否成功设置了选项。如果设置成功，返回 `true`，否则返回 `false`。

```c
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    udpSocket=new QUdpSocket(this);

    // 设置为多播
    udpSocket->setSocketOption(QAbstractSocket::MulticastTtlOption,1);
}
```

**bind 绑定套接字地址**

接着就是对特定端口的绑定，绑定端口可以通过调用`bind`函数，该函数用于将 `QUdpSocket` 绑定到指定的本地地址和端口，并设置特定的绑定选项。

在我们的课件中，使用 `bind()` 将 `QUdpSocket` 绑定到 `IPv4` 的任意地址，并指定了一个组播（`Multicast`）端口，同时设置了共享地址（`ShareAddress`）选项。

该函数原型如下：

```c
void QUdpSocket::bind(
    const QHostAddress & address, 
    quint16 port, 
    BindMode mode = DefaultForPlatform
)
```

- `address`：要绑定的本地地址，这里使用 `QHostAddress::AnyIPv4` 表示绑定到 `IPv4` 的任意地址。
- `port`：要绑定的本地端口号，这里应该是组播端口号。
- `mode`：绑定模式，指定套接字的行为。这里使用 `QUdpSocket::ShareAddress` 表示共享地址选项，它允许多个套接字同时绑定到相同的地址和端口。

函数将 `QUdpSocket` 绑定到指定的地址和端口，并且允许多个套接字同时共享相同的地址和端口。

**joinMulticastGroup 加入组播**

`joinMulticastGroup()` 函数是 `QUdpSocket` 类的成员函数，用于将 `QUdpSocket` 加入指定的多播组。

该函数原型如下：

```c
bool QUdpSocket::joinMulticastGroup(
    const QHostAddress & groupAddress, 
    const QNetworkInterface & iface = QNetworkInterface()
)
```

- `groupAddress`：要加入的多播组的组播地址。
- `iface`：要加入多播组的网络接口。默认情况下，会选择默认的网络接口。

函数返回一个 `bool` 类型的值，表示是否成功加入了多播组。如果成功加入多播组，返回 `true`；否则返回 `false`。通过调用 `joinMulticastGroup()` 函数，`QUdpSocket` 将成为指定多播组的成员，并能够接收该多播组发送的数据报。

```c
// 开始组播
void MainWindow::on_pushButton_start_clicked()
{
    // 获取IP
    QString IP= ui->lineEdit_address->text();
    groupAddress=QHostAddress(IP);

    // 获取端口
    quint16 groupPort = ui->lineEdit_port->text().toUInt();

    // 绑定端口
    if (udpSocket->bind(QHostAddress::AnyIPv4, groupPort, QUdpSocket::ShareAddress))
    {
        // 加入组播
        udpSocket->joinMulticastGroup(groupAddress);
        ui->plainTextEdit->appendPlainText("[*] 加入组播 " + IP + ":" + QString::number(groupPort));
    }
}
```

**leaveMulticastGroup 退出组播**

`leaveMulticastGroup()` 函数用于将 `QUdpSocket` 从指定的多播组中移除。通过调用该函数，`QUdpSocket` 将不再是指定多播组的成员，不再接收该多播组发送的数据报。

该函数原型如下：

```c
bool QUdpSocket::leaveMulticastGroup(
    const QHostAddress & groupAddress, 
    const QNetworkInterface & iface = QNetworkInterface()
)
```

- `groupAddress`：要离开的多播组的组播地址。
- `iface`：要离开多播组的网络接口。默认情况下，会选择默认的网络接口。

函数返回一个 `bool` 类型的值，表示是否成功离开了多播组。如果成功离开多播组，返回 `true`；否则返回 `false`。

```c
// 关闭组播
void MainWindow::on_pushButton_stop_clicked()
{
    // 退出组播
    udpSocket->leaveMulticastGroup(groupAddress);
    udpSocket->abort();
    ui->plainTextEdit->appendPlainText("[-] 退出组播");
}
```

**writeDatagram 发送数据报**

`writeDatagram()` 函数是 `QUdpSocket` 类的成员函数，用于发送数据报到指定的多播组。通过调用该函数，可以将数据报发送到指定的多播组和端口，让其他成员接收到该数据报。

其函数原型如下：

```c
qint64 QUdpSocket::writeDatagram(
    const QByteArray & datagram, 
    const QHostAddress & groupAddress, 
    quint16 port
)
```

- `datagram`：要发送的数据报的内容，通常是一个 `QByteArray` 对象。
- `groupAddress`：要发送到的多播组的组播地址。
- `port`：要发送到的多播组的端口号。

函数返回一个 `qint64` 类型的值，表示实际发送的字节数。如果发送成功，返回发送的字节数；否则返回 -1。

```c
// 发送组播消息
void MainWindow::on_pushButton_send_clicked()
{
    quint16 groupPort = ui->lineEdit_port->text().toUInt();
    QString msg=ui->lineEdit_msg->text();
    QByteArray datagram=msg.toUtf8();

    udpSocket->writeDatagram(datagram,groupAddress,groupPort);
}
```

**readDatagram 接收数据报**

`readDatagram()` 函数是 `QUdpSocket` 类的成员函数，用于从套接字中读取数据报，并将其存储到指定的缓冲区中。通常情况下，可以使用这个函数来接收来自其他主机的数据报。通过使用该函数可从套接字中读取数据报，并获取数据报的源地址和端口号。

其函数原型如下：

```c
qint64 QUdpSocket::readDatagram(
    char * data, qint64 maxSize, 
    QHostAddress * address = nullptr, 
    quint16 * port = nullptr
)
```

- `data`：指向用于存储接收数据的缓冲区的指针。
- `maxSize`：缓冲区的最大大小，即最多可以接收的字节数。
- `address`：指向用于存储发送数据报的源地址的 `QHostAddress` 对象的指针。
- `port`：指向用于存储发送数据报的源端口号的 `quint16` 类型的指针。

该函数返回一个 `qint64` 类型的值，表示实际接收的字节数。如果接收成功，返回接收的字节数；否则返回 -1。

```c
// 读取数据报
void MainWindow::onSocketReadyRead()
{
    while(udpSocket->hasPendingDatagrams())
    {
        QByteArray datagram;
        datagram.resize(udpSocket->pendingDatagramSize());
        QHostAddress peerAddr;
        quint16 peerPort;
        udpSocket->readDatagram(datagram.data(),datagram.size(),&peerAddr,&peerPort);

        QString str=datagram.data();

        QString peer="[从 "+peerAddr.toString()+":"+QString::number(peerPort)+" 发送] ";

        ui->plainTextEdit->appendPlainText(peer+str);
    }
}
```

读者可自行运行课件程序，并在多台电脑中配置相同网段，当点击发送消息时所有同网段的程序都将收到广播，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/1c80d9062bdcc44964cdb799ff434669%5B1%5D.png)



C++ Qt开发：QUdpSocket实现组播通信

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QUdpSocket`组件实现基于UDP的组播通信。

组播是一种一对多的通信方式，允许一个发送者将数据报文发送到多个接收者，这些接收者通过共享相同的组播IP地址进行通信。在设置组播地址时需要注意，该范围被限制在`239.0.0.0～239.255.255.255`以内，这是预留给组播的地址范围。

**setSocketOption 设置套接字**

在Qt中使用组播，首先需要调用`setSocketOption`函数，该函数是 `QUdpSocket` 类的成员函数，用于设置套接字的选项。

该函数原型如下：

```c
bool QUdpSocket::setSocketOption(
    QAbstractSocket::SocketOption option, 
    const QVariant & value
)
```

- `option`：要设置的套接字选项，这里应该是 `QAbstractSocket::MulticastTtlOption`，表示设置多播 TTL 选项。
- `value`：选项的值，这里应该是 TTL 的值。在 IPv4 中，TTL 是一个 8 位的字段，表示数据报在网络中允许经过的最大路由器数量。通常情况下，TTL 值越大，数据报能够传播的范围就越广。

函数返回一个 `bool` 类型的值，表示是否成功设置了选项。如果设置成功，返回 `true`，否则返回 `false`。

```c
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    udpSocket=new QUdpSocket(this);

    // 设置为多播
    udpSocket->setSocketOption(QAbstractSocket::MulticastTtlOption,1);
}
```

**bind 绑定套接字地址**

接着就是对特定端口的绑定，绑定端口可以通过调用`bind`函数，该函数用于将 `QUdpSocket` 绑定到指定的本地地址和端口，并设置特定的绑定选项。

在我们的课件中，使用 `bind()` 将 `QUdpSocket` 绑定到 `IPv4` 的任意地址，并指定了一个组播（`Multicast`）端口，同时设置了共享地址（`ShareAddress`）选项。

该函数原型如下：

```c
void QUdpSocket::bind(
    const QHostAddress & address, 
    quint16 port, 
    BindMode mode = DefaultForPlatform
)
```

- `address`：要绑定的本地地址，这里使用 `QHostAddress::AnyIPv4` 表示绑定到 `IPv4` 的任意地址。
- `port`：要绑定的本地端口号，这里应该是组播端口号。
- `mode`：绑定模式，指定套接字的行为。这里使用 `QUdpSocket::ShareAddress` 表示共享地址选项，它允许多个套接字同时绑定到相同的地址和端口。

函数将 `QUdpSocket` 绑定到指定的地址和端口，并且允许多个套接字同时共享相同的地址和端口。

**joinMulticastGroup 加入组播**

`joinMulticastGroup()` 函数是 `QUdpSocket` 类的成员函数，用于将 `QUdpSocket` 加入指定的多播组。

该函数原型如下：

```c
bool QUdpSocket::joinMulticastGroup(
    const QHostAddress & groupAddress, 
    const QNetworkInterface & iface = QNetworkInterface()
)
```

- `groupAddress`：要加入的多播组的组播地址。
- `iface`：要加入多播组的网络接口。默认情况下，会选择默认的网络接口。

函数返回一个 `bool` 类型的值，表示是否成功加入了多播组。如果成功加入多播组，返回 `true`；否则返回 `false`。通过调用 `joinMulticastGroup()` 函数，`QUdpSocket` 将成为指定多播组的成员，并能够接收该多播组发送的数据报。

```c
// 开始组播
void MainWindow::on_pushButton_start_clicked()
{
    // 获取IP
    QString IP= ui->lineEdit_address->text();
    groupAddress=QHostAddress(IP);

    // 获取端口
    quint16 groupPort = ui->lineEdit_port->text().toUInt();

    // 绑定端口
    if (udpSocket->bind(QHostAddress::AnyIPv4, groupPort, QUdpSocket::ShareAddress))
    {
        // 加入组播
        udpSocket->joinMulticastGroup(groupAddress);
        ui->plainTextEdit->appendPlainText("[*] 加入组播 " + IP + ":" + QString::number(groupPort));
    }
}
```

**leaveMulticastGroup 退出组播**

`leaveMulticastGroup()` 函数用于将 `QUdpSocket` 从指定的多播组中移除。通过调用该函数，`QUdpSocket` 将不再是指定多播组的成员，不再接收该多播组发送的数据报。

该函数原型如下：

```c
bool QUdpSocket::leaveMulticastGroup(
    const QHostAddress & groupAddress, 
    const QNetworkInterface & iface = QNetworkInterface()
)
```

- `groupAddress`：要离开的多播组的组播地址。
- `iface`：要离开多播组的网络接口。默认情况下，会选择默认的网络接口。

函数返回一个 `bool` 类型的值，表示是否成功离开了多播组。如果成功离开多播组，返回 `true`；否则返回 `false`。

```c
// 关闭组播
void MainWindow::on_pushButton_stop_clicked()
{
    // 退出组播
    udpSocket->leaveMulticastGroup(groupAddress);
    udpSocket->abort();
    ui->plainTextEdit->appendPlainText("[-] 退出组播");
}
```

**writeDatagram 发送数据报**

`writeDatagram()` 函数是 `QUdpSocket` 类的成员函数，用于发送数据报到指定的多播组。通过调用该函数，可以将数据报发送到指定的多播组和端口，让其他成员接收到该数据报。

其函数原型如下：

```c
qint64 QUdpSocket::writeDatagram(
    const QByteArray & datagram, 
    const QHostAddress & groupAddress, 
    quint16 port
)
```

- `datagram`：要发送的数据报的内容，通常是一个 `QByteArray` 对象。
- `groupAddress`：要发送到的多播组的组播地址。
- `port`：要发送到的多播组的端口号。

函数返回一个 `qint64` 类型的值，表示实际发送的字节数。如果发送成功，返回发送的字节数；否则返回 -1。

```c
// 发送组播消息
void MainWindow::on_pushButton_send_clicked()
{
    quint16 groupPort = ui->lineEdit_port->text().toUInt();
    QString msg=ui->lineEdit_msg->text();
    QByteArray datagram=msg.toUtf8();

    udpSocket->writeDatagram(datagram,groupAddress,groupPort);
}
```

**readDatagram 接收数据报**

`readDatagram()` 函数是 `QUdpSocket` 类的成员函数，用于从套接字中读取数据报，并将其存储到指定的缓冲区中。通常情况下，可以使用这个函数来接收来自其他主机的数据报。通过使用该函数可从套接字中读取数据报，并获取数据报的源地址和端口号。

其函数原型如下：

```c
qint64 QUdpSocket::readDatagram(
    char * data, qint64 maxSize, 
    QHostAddress * address = nullptr, 
    quint16 * port = nullptr
)
```

- `data`：指向用于存储接收数据的缓冲区的指针。
- `maxSize`：缓冲区的最大大小，即最多可以接收的字节数。
- `address`：指向用于存储发送数据报的源地址的 `QHostAddress` 对象的指针。
- `port`：指向用于存储发送数据报的源端口号的 `quint16` 类型的指针。

该函数返回一个 `qint64` 类型的值，表示实际接收的字节数。如果接收成功，返回接收的字节数；否则返回 -1。

```c
// 读取数据报
void MainWindow::onSocketReadyRead()
{
    while(udpSocket->hasPendingDatagrams())
    {
        QByteArray datagram;
        datagram.resize(udpSocket->pendingDatagramSize());
        QHostAddress peerAddr;
        quint16 peerPort;
        udpSocket->readDatagram(datagram.data(),datagram.size(),&peerAddr,&peerPort);

        QString str=datagram.data();

        QString peer="[从 "+peerAddr.toString()+":"+QString::number(peerPort)+" 发送] ";

        ui->plainTextEdit->appendPlainText(peer+str);
    }
}
```

读者可自行运行课件程序，并在多台电脑中配置相同网段，当点击发送消息时所有同网段的程序都将收到广播，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/1c80d9062bdcc44964cdb799ff434669%5B1%5D.png)