# C++ Qt开发：QTcpSocket网络通信组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QTcpSocket`组件实现基于TCP的网络通信功能。

`QTcpSocket`和`QTcpServer`是Qt中用于实现基于TCP（Transmission Control Protocol）通信的两个关键类。TCP是一种面向连接的协议，它提供可靠的、双向的、面向字节流的通信。这两个类允许Qt应用程序在网络上建立客户端和服务器之间的连接。

以下是`QTcpSocket`类的一些常用函数：

| 函数                                                        | 描述                                         |
| ----------------------------------------------------------- | -------------------------------------------- |
| `QTcpSocket()`                                              | 构造函数，创建一个新的`QTcpSocket`对象。     |
| `~QTcpSocket()`                                             | 析构函数，释放`QTcpSocket`对象及其资源。     |
| `void connectToHost(const QString &hostName, quint16 port)` | 尝试与指定主机名和端口建立连接。             |
| `void disconnectFromHost()`                                 | 断开与主机的连接。                           |
| `QAbstractSocket::SocketState state() const`                | 返回套接字的当前状态。                       |
| `QHostAddress peerAddress() const`                          | 返回与套接字连接的远程主机的地址。           |
| `quint16 peerPort() const`                                  | 返回与套接字连接的远程主机的端口。           |
| `QAbstractSocket::SocketError error() const`                | 返回套接字的当前错误代码。                   |
| `qint64 write(const char *data, qint64 maxSize)`            | 将数据写入套接字，返回实际写入的字节数。     |
| `qint64 read(char *data, qint64 maxSize)`                   | 从套接字读取数据，返回实际读取的字节数。     |
| `void readyRead()`                                          | 当套接字有可供读取的新数据时发出信号。       |
| `void bytesWritten(qint64 bytes)`                           | 当套接字已经写入指定字节数的数据时发出信号。 |
| `void error(QAbstractSocket::SocketError socketError)`      | 当套接字发生错误时发出信号。                 |

显示详细信息

以下是`QTcpServer`类的一些常用函数及其简要解释：

| 函数                                                         | 描述                                             |
| ------------------------------------------------------------ | ------------------------------------------------ |
| `QTcpServer()`                                               | 构造函数，创建一个新的`QTcpServer`对象。         |
| `~QTcpServer()`                                              | 析构函数，释放`QTcpServer`对象及其资源。         |
| `bool listen(const QHostAddress &address = QHostAddress::Any, quint16 port = 0)` | 开始监听指定的地址和端口。                       |
| `void close()`                                               | 停止监听并关闭服务器。                           |
| `bool isListening() const`                                   | 返回服务器是否正在监听连接。                     |
| `QList<QTcpSocket*> pendingConnections()`                    | 返回等待处理的挂起连接的列表。                   |
| `virtual void incomingConnection(qintptr socketDescriptor)`  | 当有新连接时调用，可以在子类中实现以处理新连接。 |
| `void maxPendingConnections() const`                         | 返回允许的最大挂起连接数。                       |
| `void setMaxPendingConnections(int numConnections)`          | 设置允许的最大挂起连接数。                       |
| `QNetworkProxy proxy() const`                                | 返回服务器的代理设置。                           |
| `void setProxy(const QNetworkProxy &networkProxy)`           | 设置服务器的代理设置。                           |
| `QAbstractSocket::SocketError serverError() const`           | 返回服务器的当前错误代码。                       |
| `QString errorString() const`                                | 返回服务器的错误消息字符串。                     |
| `void pauseAccepting()`                                      | 暂停接受新连接，但保持现有连接。                 |
| `void resumeAccepting()`                                     | 恢复接受新连接。                                 |
| `void close()`                                               | 关闭服务器。                                     |

显示详细信息

如上这些只是常用函数的简要描述，详细的函数说明和用法可以参考Qt官方文档或相关文档。

#### 1.1 通信的流程

##### 1.1.1 服务端流程

在使用TCP通信时同样需要导入`Qt+=network`模块，并在头文件中引入`QTcpServer`和`QTcpSocket`两个模块，当有了模块的支持，接着就是侦听套接字，此处可通过调用`server.listen`来实现侦听，此函数原型如下；

```c
bool QTcpServer::listen(
    const QHostAddress &address = QHostAddress::Any, 
    quint16 port = 0
);
```

这个函数用于开始在指定的地址和端口上监听连接。它的参数包括：

- `address`：一个`QHostAddress`对象，指定要监听的主机地址。默认为`QHostAddress::Any`，表示监听所有可用的网络接口。
- `port`：一个`quint16`类型的端口号，指定要监听的端口。如果设置为0，系统将选择一个可用的未使用端口。

函数返回一个`bool`值，表示是否成功开始监听。如果成功返回`true`，否则返回`false`，并且可以通过调用`errorString()`获取错误消息。

紧随套接字侦听其后，通过使用一个`waitForNewConnection`等待新的连接到达。它的原型如下：

```c
bool QTcpServer::waitForNewConnection(
    int msec = 0, 
    bool *timedOut = nullptr
);
```

该函数在服务器接受新连接之前会一直阻塞。参数包括：

- `msec`：等待连接的超时时间（以毫秒为单位）。如果设置为0（默认值），则表示无限期等待，直到有新连接到达。
- `timedOut`：一个可选的布尔指针，用于指示等待是否超时。如果传递了此参数，并且等待时间达到了指定的超时时间，`*timedOut`将被设置为`true`，否则为`false`。如果不关心超时，可以将此参数设置为`nullptr`。

函数返回一个布尔值，表示是否成功等待新连接。如果在超时时间内有新连接到达，返回`true`，否则返回`false`。如果等待超时，可以通过检查`timedOut`参数来确定。如果函数返回`false`，可以通过调用`errorString()`获取错误消息。

套接字的接收会使用`nextPendingConnection()`函数来实现，`nextPendingConnection` 是 `QTcpServer` 类的成员函数，用于获取下一个已接受的连接的套接字（`QTcpSocket`）。它的原型如下：

```c
QTcpSocket *QTcpServer::nextPendingConnection();
```

函数返回一个指向新连接套接字的指针。如果没有已接受的连接，则返回 `nullptr`。

使用这个函数，你可以在服务器接受连接之后获取相应的套接字，以便进行数据传输和通信。一般来说，在收到 `newConnection` 信号后，你可以调用这个函数来获取新连接的套接字。

当有了套接字以后，就可以通过`QTcpServer`指针判断对应的套接字状态，一般套接字的状态被定义在`QAbstractSocket`类内。以下是`QAbstractSocket`类中定义的一些状态及其对应的标志：

| 状态标志           | 描述                                                   |
| ------------------ | ------------------------------------------------------ |
| `UnconnectedState` | 未连接状态，套接字没有连接到远程主机。                 |
| `HostLookupState`  | 正在查找主机地址状态，套接字正在解析主机名。           |
| `ConnectingState`  | 连接中状态，套接字正在尝试与远程主机建立连接。         |
| `ConnectedState`   | 已连接状态，套接字已经成功连接到远程主机。             |
| `BoundState`       | 已绑定状态，套接字已经与地址和端口绑定。               |
| `ClosingState`     | 关闭中状态，套接字正在关闭连接。                       |
| `ListeningState`   | 监听中状态，用于`QTcpServer`，表示服务器正在监听连接。 |

这些状态反映了套接字在不同阶段的连接和通信状态。在实际使用中，可以通过调用`state()`函数获取当前套接字的状态，并根据需要处理相应的状态。例如，可以使用信号和槽机制来捕获状态变化，以便在连接建立或断开时执行相应的操作。

当套接字被连接后则可以通过`socket->write()`方法向上线客户端发送一个字符串，此处我们以发送`lyshark`为例，发送时需要向`write()`中传入两个参数。其原型如下：

```c
qint64 QTcpSocket::write(const char *data, qint64 maxSize);
```

该函数接受两个参数：

- `data`：指向要写入套接字的数据的指针。
- `maxSize`：要写入的数据的最大字节数。

函数返回实际写入的字节数，如果发生错误，则返回 -1。在写入数据之后，可以使用 `bytesWritten` 信号来获取写入的字节数。此外，你也可以使用 `waitForBytesWritten` 函数来阻塞等待直到所有数据都被写入。

至此服务端代码可总结为如下案例；

```c
#include <QCoreApplication>
#include <QTcpServer>
#include <QTcpSocket>
#include <iostream>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QTcpServer server;

    server.listen(QHostAddress::Any,9000);
    server.waitForNewConnection(100000);

    QTcpSocket *socket;

    socket = server.nextPendingConnection();
    if(socket->state() && QAbstractSocket::ConnectedState)
    {
        QByteArray bytes = QString("lyshark").toUtf8();
        socket->write(bytes.data(),bytes.length());
    }

    socket->close();
    server.close();
    return a.exec();
}
```

##### 1.1.2 客户端流程

客户端的流程与服务端基本保持一致，唯一的区别在于将`server.listen`更换为`socket.connectToHost`连接到对应的主机，`QTcpSocket` 的 `connectToHost` 函数的原型如下：

```c
void QTcpSocket::connectToHost(
const QString &hostName, 
quint16 port, 
OpenMode openMode = ReadWrite
);
```

- `hostName`：远程主机的主机名或IP地址。
- `port`：要连接的端口号。
- `openMode`：套接字的打开模式，默认为 `ReadWrite`。

函数用于初始化与指定远程主机和端口的连接。在实际使用中，你可以通过调用这个函数来发起与目标主机的连接尝试。

读取数据时可以使用`readAll`函数来实现，`socket.readAll()` 是 `QTcpSocket` 类的成员函数，用于读取所有可用的数据并返回一个 `QByteArray` 对象。其函数函数原型如下：

```c
QByteArray QTcpSocket::readAll();
```

该函数返回一个包含从套接字中读取的所有数据的 `QByteArray` 对象。通常，你可以通过这个函数来获取已经到达的所有数据，然后对这些数据进行进一步的处理。其客户端功能如下所示；

```c
#include <QCoreApplication>
#include <QTcpServer>
#include <QTcpSocket>
#include <iostream>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QTcpSocket socket;
    socket.connectToHost(QHostAddress::LocalHost,9000);

    if(socket.state() && QAbstractSocket::ConnectedState)
    {
        socket.waitForReadyRead(10000);

        QByteArray ref = socket.readAll();

        QString ref_string;

        ref_string.prepend(ref);

        std::cout << ref_string.toStdString() << std::endl;
    }

    socket.close();
    return a.exec();
}
```

#### 1.2 图形化应用

##### 1.2.1 服务端流程

与命令行版本的网络通信不同，图形化部分需要使用信号与槽函数进行绑定，所有的通信流程都是基于信号的，对于服务端而言我们需要导入`QTcpServer`、`QtNetwork`、`QTcpSocket`模块，并新增四个槽函数分别对应四个信号；

| 信号                                         | 槽函数                                              | 描述                                                         |
| -------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| `connected()`                                | `onClientConnected()`                               | 当 `tcpSocket` 成功连接到远程主机时触发，执行 `onClientConnected()` 函数。 |
| `disconnected()`                             | `onClientDisconnected()`                            | 当 `tcpSocket` 断开连接时触发，执行 `onClientDisconnected()` 函数。 |
| `stateChanged(QAbstractSocket::SocketState)` | `onSocketStateChange(QAbstractSocket::SocketState)` | 当 `tcpSocket` 的状态发生变化时触发，执行 `onSocketStateChange()` 函数，传递新的状态。 |
| `readyRead()`                                | `onSocketReadyRead()`                               | 当 `tcpSocket` 有可读取的新数据时触发，执行 `onSocketReadyRead()` 函数。 |

显示详细信息

在程序入口处我们通过`new QTcpServer(this)`新建TCP套接字类，并通过`connect()`连接到初始化槽函数上，当程序运行后会首先触发`newConnection`信号，执行`onNewConnection`槽函数。

```c
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 新建TCP套接字类
    tcpServer=new QTcpServer(this);

    // 连接信号初始化其他信号
    connect(tcpServer,SIGNAL(newConnection()),this,SLOT(onNewConnection()));
}
```

而在槽函数`onNewConnection`中，通过`nextPendingConnection`新建一个套接字，并绑定其他四个槽函数，这里的槽函数功能各不相同，将其对应的信号绑定到对应槽函数上即可；

```c
// 初始化信号槽函数
void MainWindow::onNewConnection()
{
    // 创建新套接字
    tcpSocket = tcpServer->nextPendingConnection();

    // 连接触发信号
    connect(tcpSocket, SIGNAL(connected()),this, SLOT(onClientConnected()));
    onClientConnected();

    // 关闭触发信号
    connect(tcpSocket, SIGNAL(disconnected()),this, SLOT(onClientDisconnected()));

    // 状态改变触发信号
    connect(tcpSocket,SIGNAL(stateChanged(QAbstractSocket::SocketState)),this,SLOT(onSocketStateChange(QAbstractSocket::SocketState)));
    onSocketStateChange(tcpSocket->state());

    // 读入数据触发信号
    connect(tcpSocket,SIGNAL(readyRead()),this,SLOT(onSocketReadyRead()));
}
```

当读者点击侦听时则直接调用`tcpServer->listen`实现对本地IP的`8888`端口的侦听功能，停止侦听则是调用`tcpServer->close`函数实现，如下所示；

```c
// 开始侦听
void MainWindow::on_pushButton_2_clicked()
{
    // 此处指定绑定本机的8888端口
    tcpServer->listen(QHostAddress::LocalHost,8888);
    ui->plainTextEdit->appendPlainText("[+] 开始监听");
    ui->plainTextEdit->appendPlainText(" 服务器地址：" + tcpServer->serverAddress().toString() +
                                       " 服务器端口："+QString::number(tcpServer->serverPort())
                                       );
}

// 停止侦听
void MainWindow::on_pushButton_3_clicked()
{
    if (tcpServer->isListening())
    {
        tcpServer->close();
    }
}
```

对于读取数据可以通过`canReadLine()`函数判断行，并通过`tcpClient->readLine()`逐行读入数据，相对应的发送数据可通过调用`tcpSocket->write`函数实现，在发送之前需要将其转换为`QByteArray`类型的字符串格式，如下所示；

```c
// 读取数据
void MainWindow::onSocketReadyRead()
{
    while(tcpSocket->canReadLine())
        ui->plainTextEdit->appendPlainText("[接收] | " + tcpSocket->readLine());
}

// 发送数据
void MainWindow::on_pushButton_clicked()
{
    QString  msg=ui->lineEdit->text();
    ui->plainTextEdit->appendPlainText("[发送] | " + msg);

    QByteArray str=msg.toUtf8();
    str.append('\n');
    tcpSocket->write(str);
}
```

运行服务端程序，并点击侦听按钮此时将会在本地的`8888`端口上启用侦听，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/b70e4cc83dd909818787509dffb0bdbb%5B1%5D.png)



##### 1.2.2 客户端流程

对于客户端而言同样需要绑定四个信号并对应到特定的槽函数上，其初始化部分与服务端保持一致，唯一不同的是客户端使用`connectToHost`函数链接到服务端上，断开连接时使用的是`disconnectFromHost`函数，如下所示；

```c
// 连接服务器时触发
void MainWindow::on_pushButton_2_clicked()
{
    // 连接到8888端口
    tcpClient->connectToHost(QHostAddress::LocalHost,8888);
}

// 断开时触发
void MainWindow::on_pushButton_3_clicked()
{
    if (tcpClient->state()==QAbstractSocket::ConnectedState)
        tcpClient->disconnectFromHost();
}
```

此处的读取数据与服务端保持一致，发送数据时则是通过`tcpClient->write(str)`函数直接传递给客户端，代码如下所示；

```c
// 读取数据时触发
void MainWindow::onSocketReadyRead()
{
    while(tcpClient->canReadLine())
    {
        ui->plainTextEdit->appendPlainText("[接收] | " + tcpClient->readLine());
    }
}

// 发送消息时触发
void MainWindow::on_pushButton_clicked()
{
    QString msg=ui->lineEdit->text();
    ui->plainTextEdit->appendPlainText("[发送] | " + msg);
    QByteArray str=msg.toUtf8();
    str.append('\n');
    tcpClient->write(str);
}
```

运行后，服务端启用侦听等待客户端连接，客户端连接后，双方则可以实现数据的收发功能，由于采用了信号机制，两者的收发并不会阻断可同时进行，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/a1d830bf7fca981a11f5e66255b352f3%5B1%5D.png)