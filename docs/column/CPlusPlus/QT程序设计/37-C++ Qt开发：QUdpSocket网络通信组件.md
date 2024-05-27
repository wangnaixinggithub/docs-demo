# C++ Qt开发：QUdpSocket网络通信组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QUdpSocket`组件实现基于UDP的网络通信功能。

与`QTcpSocket`组件功能类似，`QUdpSocket`组件是 Qt 中用于实现用户数据报协议（UDP，User Datagram Protocol）通信的类。UDP 是一种无连接的、不可靠的数据传输协议，它不保证数据包的顺序和可靠性，但具有低延迟和简单的特点。

以下是 `QUdpSocket` 类的完整函数及其简要解释：

| 函数                                                         | 描述                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| `QUdpSocket(QObject *parent = nullptr)`                      | 构造函数，创建一个新的 `QUdpSocket` 对象。              |
| `~QUdpSocket()`                                              | 析构函数，释放 `QUdpSocket` 对象及其资源。              |
| `void bind(const QHostAddress &address, quint16 port, BindMode mode = DefaultForPlatform)` | 将套接字绑定到指定的本地地址和端口。                    |
| `void close()`                                               | 关闭套接字。                                            |
| `bool joinMulticastGroup(const QHostAddress &groupAddress, const QNetworkInterface &iface = QNetworkInterface())` | 加入多播组。                                            |
| `bool leaveMulticastGroup(const QHostAddress &groupAddress, const QNetworkInterface &iface = QNetworkInterface())` | 离开多播组。                                            |
| `qint64 pendingDatagramSize() const`                         | 返回下一个待读取的数据报的大小。                        |
| `qint64 readDatagram(char *data, qint64 maxSize, QHostAddress *address = nullptr, quint16 *port = nullptr)` | 读取数据报。                                            |
| `QByteArray readDatagram(qint64 maxSize, QHostAddress *address = nullptr, quint16 *port = nullptr)` | 读取数据报，返回 `QByteArray` 对象。                    |
| `qint64 writeDatagram(const char *data, qint64 size, const QHostAddress &address, quint16 port)` | 发送数据报。                                            |
| `qint64 writeDatagram(const QByteArray &datagram, const QHostAddress &address, quint16 port)` | 发送数据报，接受 `QByteArray` 对象。                    |
| `QAbstractSocket::SocketState state() const`                 | 返回套接字的当前状态。                                  |
| `QAbstractSocket::SocketType socketType() const`             | 返回套接字的类型。                                      |
| `bool isValid() const`                                       | 如果套接字有效，则返回 `true`；否则返回 `false`。       |
| `int error() const`                                          | 返回套接字的当前错误代码。                              |
| `QHostAddress localAddress() const`                          | 返回本地地址。                                          |
| `quint16 localPort() const`                                  | 返回本地端口。                                          |
| `int readBufferSize() const`                                 | 返回读取缓冲区的大小。                                  |
| `void setReadBufferSize(int size)`                           | 设置读取缓冲区的大小。                                  |
| `QNetworkInterface multicastInterface() const`               | 返回多播组的网络接口。                                  |
| `void setMulticastInterface(const QNetworkInterface &iface)` | 设置多播组的网络接口。                                  |
| `bool hasPendingDatagrams() const`                           | 如果有待读取的数据报，则返回 `true`；否则返回 `false`。 |
| `bool isReadable() const`                                    | 如果套接字可读，则返回 `true`；否则返回 `false`。       |
| `bool isWritable() const`                                    | 如果套接字可写，则返回 `true`；否则返回 `false`。       |
| `bool setSocketDescriptor(int socketDescriptor, QUdpSocket::SocketState socketState = ConnectedState, QIODevice::OpenMode openMode = ReadWrite)` | 设置套接字描述符。                                      |
| `int socketDescriptor() const`                               | 返回套接字描述符。                                      |
| `bool waitForReadyRead(int msecs = 30000)`                   | 等待套接字可读取数据。                                  |
| `bool waitForBytesWritten(int msecs = 30000)`                | 等待套接字已写入指定字节数的数据。                      |
| `void ignoreSslErrors(const QList<QSslError> &errors)`       | 忽略 SSL 错误。                                         |
| `void abort()`                                               | 强制关闭套接字。                                        |
| `QNetworkProxy proxy() const`                                | 返回套接字的代理设置。                                  |
| `void setProxy(const QNetworkProxy &networkProxy)`           | 设置套接字的代理设置。                                  |
| `QString errorString() const`                                | 返回套接字的错误消息字符串。                            |

显示详细信息

这些函数提供了在 UDP 通信中使用 `QUdpSocket` 的各种功能，包括绑定、发送和接收数据报、设置和获取套接字的状态等。

#### 1.1 初始化部分

在初始化部分我们首先通过`new QUdpSocket`来实现创建UDP对象，`QUdpSocket` 构造函数的函数原型如下：

```c
QUdpSocket::QUdpSocket(QObject * parent = nullptr)
```

如上构造函数创建一个新的 `QUdpSocket` 对象。如果提供了 `parent` 参数，则会将新创建的 `QUdpSocket` 对象添加到 `parent` 对象的子对象列表中，并且在 `parent` 对象被销毁时自动销毁 `QUdpSocket` 对象。如果没有提供 `parent` 参数，则 `QUdpSocket` 对象将不会有父对象，并且需要手动管理其生命周期。

初始化结束后，则下一步需要调用`bind()`，`bind()` 函数是 `QUdpSocket` 类的一个成员函数，用于将套接字绑定到特定的本地地址和端口。它的函数原型如下：

```c
void QUdpSocket::bind(const QHostAddress &address, quint16 port, BindMode mode = DefaultForPlatform)
```

- `address`：要绑定的本地地址，通常是 `QHostAddress::Any`，表示绑定到所有可用的网络接口。
- `port`：要绑定的本地端口号。
- `mode`：绑定模式，指定套接字的行为。默认值是 `DefaultForPlatform`，表示使用平台默认的绑定模式。

该函数允许 `QUdpSocket` 在本地网络接口上监听传入的数据报。一旦调用了 `bind()` 函数，`QUdpSocket` 就可以接收来自指定地址和端口的数据报。

在调用 `bind()` 函数之后，如果成功绑定了指定的地址和端口，套接字将处于 `BoundState` 状态。如果出现错误，可以通过检查 `error()` 函数获取错误代码，并通过 `errorString()` 函数获取错误消息。

接着我们通过`connect()`函数依次绑定套接字到`stateChanged`状态改变信号，以及`readyRead()`读取信号上，这段初始化代码如下所示；

```c
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    udpSocket=new QUdpSocket(this);

    // 生成随机整数 包含2000 - 不包含65534
    int randomInt = QRandomGenerator::global()->bounded(2000, 65534);

    if(udpSocket->bind(randomInt))
    {
        this->setWindowTitle(this->windowTitle() + " | 地址: " + getLocalAddress() + " 绑定端口：" + QString::number(udpSocket->localPort()));
    }

    connect(udpSocket,SIGNAL(stateChanged(QAbstractSocket::SocketState)),this,SLOT(onSocketStateChange(QAbstractSocket::SocketState)));
    onSocketStateChange(udpSocket->state());
    connect(udpSocket,SIGNAL(readyRead()),this,SLOT(onSocketReadyRead()));
}
```

接着切换到读取信号所对应的槽函数上，`onSocketReadyRead`是我们自定义的一个槽，该槽函数功能如下所示；

```c
// 读取收到的数据报
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

        QString peer="[消息来自 " + peerAddr.toString()+":"+QString::number(peerPort)+"] | ";

        ui->plainTextEdit->appendPlainText(peer+str);
    }
}
```

首先在代码中调用`pendingDatagramSize`函数，`pendingDatagramSize()` 是 `QUdpSocket` 类的一个成员函数，用于获取下一个待读取的数据报的大小。它的函数原型如下：

```c
qint64 QUdpSocket::pendingDatagramSize() const
```

该函数返回一个 `qint64` 类型的值，表示下一个待读取的数据报的大小（以字节为单位）。如果没有待读取的数据报，或者发生了错误，该函数将返回 -1。

通常，可以在调用 `readDatagram()` 函数之前调用 `pendingDatagramSize()` 函数来获取下一个待读取的数据报的大小。这样可以为数据缓冲区分配正确大小的空间，以确保完整地读取数据报。

当有了待读取字节后，接着就可以直接通过调用`readDatagram`函数来从套接字中读取数据报，`readDatagram()` 是 `QUdpSocket` 类的一个成员函数，它有几个重载形式，其中最常用的是：

```c
qint64 QUdpSocket::readDatagram(char * data, qint64 maxSize, QHostAddress * address = nullptr, quint16 * port = nullptr)
```

该函数用于读取数据报并将其存储到指定的缓冲区 `data` 中，最多读取 `maxSize` 个字节的数据。可选参数 `address` 和 `port` 用于返回数据报的源地址和端口号。如果不需要这些信息，可以将它们设置为 `nullptr`。

函数返回实际读取的字节数，如果发生错误，返回 -1。要查看错误信息，可以使用 `error()` 和 `errorString()` 函数。

另外，还有一个更简单的重载形式：

```c
QByteArray QUdpSocket::readDatagram(qint64 maxSize, QHostAddress * address = nullptr, quint16 * port = nullptr)
```

这个重载函数直接返回一个 `QByteArray` 对象，其中包含了读取的数据报。

#### 1.2 单播与广播消息

单播（Unicast）和广播（Broadcast）是网络通信中常见的两种数据传输方式，它们在数据包的传输范围和目标数量上有所不同。

##### 单播（Unicast）

单播是一种一对一的通信方式，其中数据包从一个发送者传输到一个接收者。在单播通信中，数据包只发送到目标主机的网络接口，并且只有目标主机能够接收和处理这个数据包。

- 一对一通信：每个数据包只有一个发送者和一个接收者。
- 目标明确：数据包只发送到特定的目标主机，其他主机不会接收到这个数据包。
- 点到点通信：适用于直接通信的场景，如客户端与服务器之间的通信。

当按钮发送消息被点击后，则是一种单播模式，通常该模式需要得到目标地址与端口号，并通过调用`writeDatagram`来实现数据的发送，该函数通过传入三个参数，分别是发送字符串，目标地址与目标端口来实现一对一推送。

```c
void MainWindow::on_pushButton_clicked()
{
    QHostAddress targetAddr(ui->lineEdit_addr->text());
    QString portString = ui->lineEdit_port->text();
    quint16 targetPort = portString.toUShort();

    QString msg=ui->lineEdit_msg->text();
    QByteArray str=msg.toUtf8();

    // 发送数据报
    udpSocket->writeDatagram(str,targetAddr,targetPort);
    ui->plainTextEdit->appendPlainText("[单播消息] | " + msg);
}
```

##### 广播（Broadcast）

广播是一种一对多的通信方式，其中数据包从一个发送者传输到同一网络中的所有主机。在广播通信中，数据包被发送到网络中的所有主机，并且所有的主机都能够接收和处理这个数据包。

- 一对多通信：每个数据包有一个发送者，但可以有多个接收者。
- 目标不明确：数据包被发送到网络中的所有主机，不需要知道接收者的具体地址。
- 广播域：在局域网中进行广播，只有在同一广播域内的主机才能接收到广播消息。
- 网络负载：在大型网络中使用广播可能会产生大量的网络流量，影响网络性能。

当按钮广播消息被点击后，则同样是调用`writeDatagram`函数与，唯一的区别在于第二个参数并未指定地址，而是使用了`QHostAddress::Broadcast`来代替，意味着只要端口是一致的则对所有的客户推送消息，其他保持不变。

```c
void MainWindow::on_pushButton_2_clicked()
{
    // 广播地址
    QString portString = ui->lineEdit_port->text();
    quint16 targetPort = portString.toUShort();

    QString  msg=ui->lineEdit_msg->text();
    QByteArray str=msg.toUtf8();
    udpSocket->writeDatagram(str,QHostAddress::Broadcast,targetPort);

    ui->plainTextEdit->appendPlainText("[广播消息] | " + msg);
}
```

读者可自行运行两次客户端，此时的端口将会随机分配，当指定对端端口后就可以向其发送数据，如下图所示；具体实现细节，请参考文章附件。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/e729e87553e4ebdee24add4d9bcf706c%5B1%5D.png)