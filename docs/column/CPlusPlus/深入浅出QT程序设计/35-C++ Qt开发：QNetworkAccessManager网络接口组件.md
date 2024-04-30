# C++ Qt开发：QNetworkAccessManager网络接口组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QNetworkAccessManager`组件实现Web网页访问。

QNetworkAccessManager是Qt网络模块中的关键类，用于管理网络访问和请求。作为一个网络请求的调度中心，它为Qt应用程序提供了发送和接收各种类型的网络请求的能力，包括常见的GET、POST、PUT、DELETE等。这个模块的核心功能在于通过处理`QNetworkReply`和`QNetworkRequest`来实现与网络资源的交互。

通过`QNetworkAccessManager`，Qt应用程序能够轻松地与远程服务器通信，获取数据或将数据上传到服务器。这种网络请求的管理不仅是异步的，以确保不会阻塞主线程，还提供了丰富的信号和槽机制，使得开发者可以灵活地处理不同阶段的网络操作。

通常，`QNetworkAccessManager`会与`QNetworkReply`和`QNetworkRequest`一起使用。`QNetworkRequest`用于封装和配置网络请求的各种属性，例如URL、请求头等。而`QNetworkReply`则代表了对网络请求的响应，包含了请求返回的数据和相关信息。这三者共同协作，为Qt应用程序提供了便捷、灵活且强大的网络通信能力。

#### 1.1 通用API函数

##### 1.1.1 QNetworkAccessManager

要想实现网络通信首先需要新建一个网络访问管理器，以下是`QNetworkAccessManager`类中的一些常用函数及其描述：

| 函数                                                         | 描述                                                    |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| `QNetworkAccessManager(QObject *parent = nullptr)`           | 构造函数，创建一个`QNetworkAccessManager`实例。         |
| `virtual ~QNetworkAccessManager()`                           | 虚析构函数，释放`QNetworkAccessManager`实例。           |
| `QNetworkReply *get(const QNetworkRequest &request)`         | 发送GET请求，并返回与请求关联的`QNetworkReply`对象。    |
| `QNetworkReply *post(const QNetworkRequest &request, QIODevice *data)` | 发送POST请求，并返回与请求关联的`QNetworkReply`对象。   |
| `QNetworkReply *post(const QNetworkRequest &request, const QByteArray &data)` | 发送POST请求，并返回与请求关联的`QNetworkReply`对象。   |
| `QNetworkReply *put(const QNetworkRequest &request, QIODevice *data)` | 发送PUT请求，并返回与请求关联的`QNetworkReply`对象。    |
| `QNetworkReply *put(const QNetworkRequest &request, const QByteArray &data)` | 发送PUT请求，并返回与请求关联的`QNetworkReply`对象。    |
| `QNetworkReply *deleteResource(const QNetworkRequest &request)` | 发送DELETE请求，并返回与请求关联的`QNetworkReply`对象。 |
| `QNetworkReply *head(const QNetworkRequest &request)`        | 发送HEAD请求，并返回与请求关联的`QNetworkReply`对象。   |
| `QNetworkReply *sendCustomRequest(const QNetworkRequest &request, const QByteArray &verb, QIODevice *data = nullptr)` | 发送自定义请求，并返回与请求关联的`QNetworkReply`对象。 |
| `QNetworkReply *sendCustomRequest(const QNetworkRequest &request, const QByteArray &verb, const QByteArray &data)` | 发送自定义请求，并返回与请求关联的`QNetworkReply`对象。 |
| `void setConfiguration(const QNetworkConfiguration &config)` | 设置网络配置，用于定制网络行为。                        |
| `QNetworkConfiguration configuration() const`                | 获取当前网络配置。                                      |
| `void clearAccessCache()`                                    | 清除网络访问缓存。                                      |
| `void setCache(QAbstractNetworkCache *cache)`                | 设置网络缓存。                                          |
| `QAbstractNetworkCache *cache() const`                       | 获取当前网络缓存。                                      |
| `void setCookieJar(QNetworkCookieJar *cookieJar)`            | 设置用于管理HTTP cookie的`QNetworkCookieJar`。          |
| `QNetworkCookieJar *cookieJar() const`                       | 获取当前的HTTP cookie管理器。                           |

显示详细信息

这些函数提供了`QNetworkAccessManager`的核心功能，使得开发者能够方便地进行各种类型的网络请求，配置网络参数，并进行相关的网络管理操作。

##### 1.1.2 QNetworkReply

以下是`QNetworkReply`类中的一些常用函数及其描述：

| 函数                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `QByteArray readAll() const`                                 | 读取所有可用的数据，并返回一个`QByteArray`，包含从网络回复读取的所有内容。 |
| `QByteArray peek(int maxSize) const`                         | 查看最多`maxSize`字节的可用数据，但不从缓冲区中移除。        |
| `QByteArray read(int maxSize)`                               | 从网络回复中读取最多`maxSize`字节的数据，并将其从缓冲区中移除。 |
| `QByteArray readLine(int maxSize = 0)`                       | 从网络回复中读取一行数据，最多包含`maxSize`字节，并将其从缓冲区中移除。 |
| `void ignoreSslErrors(const QList<QSslError> &errors = QList<QSslError>())` | 忽略SSL错误，继续处理网络回复。                              |
| `void abort()`                                               | 终止网络回复的处理，关闭底层连接。                           |
| `void close()`                                               | 关闭网络回复的处理。                                         |
| `QUrl url() const`                                           | 返回与网络回复相关联的URL。                                  |
| `QNetworkRequest request() const`                            | 返回生成此网络回复的网络请求。                               |
| `QNetworkAccessManager *manager() const`                     | 返回与网络回复相关联的`QNetworkAccessManager`。              |
| `bool isFinished() const`                                    | 检查网络回复是否已完成。                                     |
| `QNetworkReply::NetworkError error() const`                  | 返回网络回复的错误代码。                                     |
| `bool hasRawHeader(const QByteArray &headerName) const`      | 检查网络回复是否包含指定原始头。                             |
| `QList<QByteArray> rawHeaderList() const`                    | 返回网络回复的所有原始头的列表。                             |
| `QByteArray rawHeader(const QByteArray &headerName) const`   | 返回指定原始头的值。                                         |
| `QVariant header(QNetworkRequest::KnownHeaders header) const` | 返回指定标准头的值。                                         |
| `QList<QByteArray> rawHeaderValues(const QByteArray &headerName) const` | 返回指定原始头的所有值。                                     |
| `QVariant attribute(QNetworkRequest::Attribute code) const`  | 返回指定网络请求属性的值。                                   |
| `QIODevice *readAllStandardOutput()`                         | 读取标准输出的所有数据，并返回一个`QIODevice`，用于访问读取的内容。 |
| `QIODevice *readAllStandardError()`                          | 读取标准错误的所有数据，并返回一个`QIODevice`，用于访问读取的内容。 |
| `bool isReadable() const`                                    | 检查网络回复是否可读取。                                     |

显示详细信息

这些函数提供了对`QNetworkReply`实例进行各种操作和查询的方法，包括读取回复数据、处理SSL错误、获取请求信息、检查错误状态等。开发者可以根据具体需求使用这些函数来有效地与网络回复进行交互。

##### 1.1.3 QNetworkRequest

以下是`QNetworkRequest`类中的一些常用函数及其描述：

| 函数                                                         | 描述                                         |
| ------------------------------------------------------------ | -------------------------------------------- |
| `QNetworkRequest(const QUrl &url)`                           | 使用给定的URL构造一个`QNetworkRequest`实例。 |
| `void setUrl(const QUrl &url)`                               | 设置`QNetworkRequest`的URL。                 |
| `QUrl url() const`                                           | 返回与`QNetworkRequest`相关联的URL。         |
| `void setRawHeader(const QByteArray &headerName, const QByteArray &headerValue)` | 设置指定原始头的值。                         |
| `QByteArray rawHeader(const QByteArray &headerName) const`   | 返回指定原始头的值。                         |
| `bool hasRawHeader(const QByteArray &headerName) const`      | 检查`QNetworkRequest`是否包含指定原始头。    |
| `void setRawHeaderList(const QList<QByteArray> &headerList)` | 设置所有原始头的列表。                       |
| `QList<QByteArray> rawHeaderList() const`                    | 返回`QNetworkRequest`的所有原始头的列表。    |
| `void setHeader(QNetworkRequest::KnownHeaders header, const QVariant &value)` | 设置指定标准头的值。                         |
| `QVariant header(QNetworkRequest::KnownHeaders header) const` | 返回指定标准头的值。                         |
| `void setAttribute(QNetworkRequest::Attribute code, const QVariant &value)` | 设置指定网络请求属性的值。                   |
| `QVariant attribute(QNetworkRequest::Attribute code) const`  | 返回指定网络请求属性的值。                   |
| `void setSslConfiguration(const QSslConfiguration &config)`  | 设置SSL配置。                                |
| `QSslConfiguration sslConfiguration() const`                 | 返回SSL配置。                                |
| `void setMaximumRedirectsAllowed(int maxRedirects)`          | 设置允许的最大重定向次数。                   |
| `int maximumRedirectsAllowed() const`                        | 返回允许的最大重定向次数。                   |
| `void setOriginatingObject(QObject *object)`                 | 设置发起此网络请求的对象。                   |
| `QObject *originatingObject() const`                         | 返回发起此网络请求的对象。                   |
| `bool isEmpty() const`                                       | 检查`QNetworkRequest`是否为空（未设置URL）。 |

显示详细信息

这些函数提供了对`QNetworkRequest`实例进行各种操作和查询的方法，包括设置和获取头信息、设置SSL配置、设置和获取网络请求属性等。开发者可以根据具体需求使用这些函数来有效地构建和管理网络请求。

#### 1.2 实现Web页面访问

要使用该模块读者应该在`*.pro`文件内包含`network`网络模块，并在头文件中引入`QNetworkAccessManager`、`QNetworkReply`、`QNetworkRequest`三个类，在建立访问时首先使用`QNetworkAccessManager`新增一个`manager`管理类，并通过`QNetworkRequest`类创建一个GET请求地址，通过使用`manager.get`方法实现对特定页面的访问。

当访问完成时需要通过一个信号来实现对数据的处理，在`QNetworkReply`类中包含有如下表所示的信号以供读者使用，例如当访问被完成时则自动触发`&QNetworkReply::finished`完成信号，此时只需要对该信号进行相应的处理即可，通常会使用一个槽函数来处理它。

| 信号                                  | 描述                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| `finished()`                          | 当网络请求完成时发出。                                       |
| `downloadProgress(qint64, qint64)`    | 在下载过程中定期发出，提供下载进度信息。参数为已下载的字节数和总字节数。 |
| `uploadProgress(qint64, qint64)`      | 在上传过程中定期发出，提供上传进度信息。参数为已上传的字节数和总字节数。 |
| `readyRead()`                         | 当有可读取的数据时发出，用于通知应用程序可以调用`readAll()`或`read()`方法以获取更多数据。 |
| `error(QNetworkReply::NetworkError)`  | 当网络请求发生错误时发出，参数为错误代码。                   |
| `sslErrors(const QList<QSslError> &)` | 当SSL错误发生时发出，参数为SSL错误的列表。                   |

这些信号提供了丰富的信息，使开发者能够在不同阶段处理网络请求。同理，在下载和上传过程中可以使用`downloadProgress`和`uploadProgress`信号来获取进度信息，`readyRead`信号表示有可读取的数据，`error`信号表示请求发生错误，`sslErrors`信号表示`SSL`相关的错误。

当信号被触发时则会通过`QObject::connect`连接到对应的槽函数上，如下案例中所示，在槽函数内通过`reply->attribute`方法我们获取到此次响应码中的`QNetworkRequest::HttpStatusCodeAttribute`属性，该属性用来指明本次访问的状态值。此类属性也有许多可供参考，如下所示；

| 属性                                              | 描述                                               |
| ------------------------------------------------- | -------------------------------------------------- |
| `QNetworkRequest::HttpStatusCodeAttribute`        | HTTP响应的状态码。                                 |
| `QNetworkRequest::HttpReasonPhraseAttribute`      | HTTP响应的原因短语，如"OK"、"Not Found"等。        |
| `QNetworkRequest::RedirectionTargetAttribute`     | 重定向目标的URL。                                  |
| `QNetworkRequest::ConnectionEncryptedAttribute`   | 连接是否加密的标志，返回一个`bool`值。             |
| `QNetworkRequest::SourceIsFromCacheAttribute`     | 请求是否来自缓存的标志，返回一个`bool`值。         |
| `QNetworkRequest::HttpPipeliningAllowedAttribute` | 是否允许HTTP流水线传输的标志，返回一个`bool`值。   |
| `QNetworkRequest::HttpPipeliningWasUsedAttribute` | 是否使用了HTTP流水线传输的标志，返回一个`bool`值。 |
| `QNetworkRequest::CustomVerbAttribute`            | 自定义请求动作（HTTP verb）的字符串。              |
| `QNetworkRequest::User`                           | 用户自定义的属性，用于存储任意类型的用户数据。     |

显示详细信息

这些属性提供了额外的信息，使得开发者能够更全面地了解和处理网络响应。根据具体的应用需求，开发者可以选择使用这些属性中的一个或多个来获取所需的信息。

```c
#include <QCoreApplication>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QDebug>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 创建网络访问管理器
    QNetworkAccessManager manager;

    // 创建GET请求
    QNetworkRequest request(QUrl("http://www.baidu.com"));

    // 发送GET请求
    QNetworkReply *reply = manager.get(request);

    // 连接信号槽，处理响应
    QObject::connect(reply, &QNetworkReply::finished, [&]()
    {
        if (reply->error() == QNetworkReply::NoError)
        {
            // 获取请求的 URL
            qDebug() << "Request URL:" << reply->request().url();

            // 输出请求头信息
            qDebug() << "Request Headers:";
            QList<QByteArray> requestHeaders = reply->request().rawHeaderList();
            foreach (const QByteArray &header, requestHeaders) {
                qDebug() << header << ":" << reply->request().rawHeader(header);
            }

            // 获取响应码
            int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
            qDebug() << "HttpStatusCodeAttribute:" << statusCode;

            // 连接是否加密的标志
            bool connectionEncryptedAttribute = reply->attribute(QNetworkRequest::ConnectionEncryptedAttribute).toBool();
            qDebug() << "ConnectionEncryptedAttribute:" << connectionEncryptedAttribute;

            // 请求是否来自缓存的标志
            bool sourceIsFromCacheAttribute = reply->attribute(QNetworkRequest::SourceIsFromCacheAttribute).toBool();
            qDebug() << "SourceIsFromCacheAttribute:" << sourceIsFromCacheAttribute;

            // HTTP请求是否被允许进行流水线处理的标志
            bool httpPipeliningAllowedAttribute = reply->attribute(QNetworkRequest::HttpPipeliningAllowedAttribute).toBool();
            qDebug() << "HttpPipeliningAllowedAttribute:" << httpPipeliningAllowedAttribute;

            // 输出响应头信息
            qDebug() << "Response Headers:";
            QList<QByteArray> responseHeaders = reply->rawHeaderList();
            foreach (const QByteArray &header, responseHeaders) {
                qDebug() << header << ":" << reply->rawHeader(header);
            }

            // 处理响应内容，这里可以使用 readAll() 方法获取响应内容
            // qDebug() << "Response Content:" << reply->readAll();
        } else
        {
            qDebug() << "Error:" << reply->errorString();
        }

        // 释放资源
        reply->deleteLater();
        QCoreApplication::quit();
    });

    return a.exec();
}
```

读者可自行编译并运行这段代码，观察请求与相应数据如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9e6fbcdd41e8085f395e499b9c8a8fe4%5B1%5D.png)





至于如何在图形界面中使用则就更简单了，首先我们在`mainwindow.h`头文件中定义好所需要的两个槽函数，函数`on_finished()`用于在完成请求后被调用，函数`on_readyRead()`则用于在回调被执行后调用，并并以两个网络管理类的指针变量，如下所示；

```c
class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    //自定义槽函数
    void on_finished();
    void on_readyRead();

    void on_pushButton_clicked();

private:
    Ui::MainWindow *ui;
    QNetworkAccessManager networkManager;   // 网络管理
    QNetworkReply *reply;                   // 网络响应
};
```

当获取按钮被点击后则开始执行读入指定URL地址，并对该地址进行网页访问，同时绑定这两个信号，一旦被触发则自动路由到对应的槽函数上面去，如下所示；

```c
void MainWindow::on_pushButton_clicked()
{
    // 读入URL地址
    QString urlSpec = ui->lineEdit->text().trimmed();
    if (urlSpec.isEmpty())
    {
        QMessageBox::information(this, "错误", "请指定URL");
        return;
    }

    // 格式化URL
    QUrl newUrl = QUrl::fromUserInput(urlSpec);
    if (!newUrl.isValid())
    {
        QMessageBox::information(this, "错误", QString("无效URL: %1").arg(urlSpec));
        return;
    }

    // 访问页面
    reply = networkManager.get(QNetworkRequest(newUrl));

    // 完成时的槽函数绑定
    connect(reply, SIGNAL(finished()), this, SLOT(on_finished()));

    // 读入数据的槽函数绑定
    connect(reply, SIGNAL(readyRead()), this, SLOT(on_readyRead()));

}
```

相对应的，在`on_finished()`槽函数中我们将响应头读出并输出到文本框中，在`on_readyRead()`槽函数中则是对整个网站页面源代码的输出功能，完整代码如下所示；

```c
void MainWindow::on_finished()
{
    // 获取响应码
    int statusCode = reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();

    if(statusCode == 200)
    {
        ui->plainTextEdit_2->appendPlainText("响应头数据:");
        // 输出响应头信息
        QList<QByteArray> responseHeaders = reply->rawHeaderList();
        foreach (const QByteArray &header, responseHeaders)
        {
            ui->plainTextEdit_2->appendPlainText(header + " : " + reply->rawHeader(header));
        }
    }
} 

// 读入页面源代码
void MainWindow::on_readyRead()
{
    ui->plainTextEdit->setPlainText(reply->readAll());
}
```

运行代码，读者可自行输入特定的网站进行读取测试，如下所示（完整代码请参考课件部分）；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c576a8697efd957a129622f4cc646de9%5B1%5D.png)