# C++ Qt开发：QProcess进程管理模块

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QProcess`组件实现针对进程的控制管理等。

当你在使用Qt进行跨平台应用程序开发时，经常需要与外部进程进行交互，这时就可以利用Qt的`QProcess`模块。`QProcess`模块提供了启动和控制外部进程的功能，能够执行外部命令、运行其他可执行文件，以及与外部进程进行通信。通过`QProcess`，可以方便地执行命令行命令、调用系统工具、执行脚本等。`QProcess`还可以捕获外部进程的输出，以及监视外部进程的运行状态，从而实现更灵活、高效的进程管理。

以下是`QProcess`类的一些常用函数及其解释的表格：

| 函数                                                         | 描述                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `start(const QString &program, const QStringList &arguments)` | 启动一个新的进程，`program`参数指定要执行的程序，`arguments`参数指定传递给程序的参数列表。 |
| `startDetached(const QString &program, const QStringList &arguments)` | 启动一个新的进程，但不会等待进程退出，也不会将输出传递给调用进程。 |
| `waitForStarted(int msecs = 30000)`                          | 等待进程启动，如果在指定时间内进程没有启动，将返回false。    |
| `waitForFinished(int msecs = 30000)`                         | 等待进程退出，如果在指定时间内进程没有退出，将返回false。    |
| `readAllStandardOutput()`                                    | 读取进程的标准输出，并返回为`QByteArray`。                   |
| `readAllStandardError()`                                     | 读取进程的标准错误输出，并返回为`QByteArray`。               |
| `write(const QByteArray &data)`                              | 向进程的标准输入写入数据。                                   |
| `closeWriteChannel()`                                        | 关闭进程的标准输入。                                         |
| `kill()`                                                     | 终止进程。                                                   |
| `terminate()`                                                | 终止进程。                                                   |
| `start(const QString &program)`                              | 启动一个新的进程，`program`参数指定要执行的程序。            |
| `setWorkingDirectory(const QString &dir)`                    | 设置进程的工作目录。                                         |
| `state()`                                                    | 返回进程的当前状态。                                         |
| `error()`                                                    | 返回进程的错误状态。                                         |
| `pid()`                                                      | 返回进程的进程ID。                                           |
| `waitForBytesWritten(int msecs = 30000)`                     | 等待写入到进程的数据已经被完全写入。                         |
| `waitForReadyRead(int msecs = 30000)`                        | 等待进程有数据可读。                                         |
| `startDetached(const QString &program)`                      | 启动一个新的进程，但不会等待进程退出，也不会将输出传递给调用进程。 |
| `setProcessChannelMode(QProcess::ProcessChannelMode mode)`   | 设置进程通信模式，可选值包括`QProcess::SeparateChannels`和`QProcess::MergedChannels`。 |

显示详细信息

这些函数提供了控制进程的各种方法，可以实现启动、监视、控制和与外部进程进行交互的功能。

进程控制模块可以实现对特定进程的启动关闭，本章将以执行命令行为例，通过调用`Start()`可以拉起一个第三方进程。

`QProcess`类的`start()`函数有几种不同的重载形式，但最常用的是以下形式：

```c
bool QProcess::start(
    const QString &program, 
    const QStringList &arguments, 
    QIODevice::OpenMode mode = ReadWrite
)
```

函数用于启动一个新的进程，并执行指定的程序（`program`参数）。`arguments`参数指定了传递给程序的参数列表，它是一个`QStringList`类型的参数，可以为空。`mode`参数指定了启动进程时打开的模式，默认为`ReadWrite`。函数返回一个`bool`类型的值，表示进程是否成功启动。

当调用`start()`执行命令后，我们则可以通过`readAllStandardOutput()`函数从进程的标准输出中读取所有可用的数据，并将其返回为 `QByteArray` 对象。

```c
QByteArray QProcess::readAllStandardOutput()
```

这个函数没有参数，它会立即返回当前可用的标准输出数据，并将输出数据作为字节数组返回。如果没有可用的输出数据，它将返回一个空的字节数组。

当然了，与之对应的`readAllStandardError()`是函数，该函数可以用于从进程的标准错误输出中读取所有可用的数据，并将其返回为 `QByteArray` 对象。

```c
QByteArray QProcess::readAllStandardError()
```

该函数同样没有参数，它会立即返回当前可用的标准错误输出数据，并将输出数据作为字节数组返回。如果没有可用的错误输出数据，它将返回一个空的字节数组。

#### 1.1 获取进程信息

此处我们以输出系统进程信息为例，通常可以调用`tasklist /FO CSV`来获取系统中的进程列表，并将其输出为`CSV`格式，通过调用如下函数则可以获取到系统进程信息。

```c
process.start("tasklist", QStringList() << "/FO" << "CSV");
```

此时通过调用`readAllStandardOutput`函数我们可以将缓冲区内的数据读出并将其放入到一个`QString`类型变量内；

```c
QString output = process.readAllStandardOutput();
```

当具备了这个列表后，就可以根据冒号来逐行读入并切割，通过循环的方式将其追加到`treeWidget`组件内，并以此来实现展示的效果；

```c
void MainWindow::on_pushButton_clicked()
{
    CallProcess();

    ui->treeWidget->clear();

    QProcess process;
    process.start("tasklist", QStringList() << "/FO" << "CSV");

    if (process.waitForFinished())
    {
        QString output = process.readAllStandardOutput();
        output.replace("\"", "");

        QStringList lines = output.split("\n");

        // 跳过第一行标题
        for(int i = 1; i < lines.size(); ++i)
        {
            QStringList fields = lines[i].split(",");

            // 确保至少有五个字段
            if(fields.size() >= 5)
            {
                QStringList rowData;
                for(int j = 0; j < 5; ++j)
                {
                    rowData << fields[j].trimmed();
                }
                ui->treeWidget->addTopLevelItem(new QTreeWidgetItem(rowData));
            }
        }

        // 设置列标题
        ui->treeWidget->setHeaderLabels(QStringList() << "进程名称" << "PID" << "会话名称" << "Session"<< "内存占用");
    } else
    {
        QTreeWidgetItem *item = new QTreeWidgetItem(ui->treeWidget);
        item->setText(0, "Failed to execute tasklist command.");
    }
}
```

运行后当点击输出系统进程时则可以看到完整的进程输出效果，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/f40d35eb0ee173a5092952daf7b4e2bf%5B1%5D.png)



使用此方法我们可以很好的读取到系统中的各种信息，只要能够合理的过滤出想要的字段即可，当需要输出系统信息时我们可以通过`process.start("systeminfo")`调用系统命令获取到，如下代码所示；

```c
void MainWindow::on_pushButton_2_clicked()
{
    ui->treeWidget->clear();

    // 获取系统信息
    QProcess process;
    process.start("systeminfo");

    if (process.waitForFinished())
    {
     QByteArray output = process.readAllStandardOutput();

     // 使用正确的文本编码对输出进行解码
     QTextCodec *codec = QTextCodec::codecForName("GBK");
     QString text = codec->toUnicode(output);

     QStringList lines = text.split("\n");
     for (const QString &line : lines)
     {
         // 解析系统信息，添加到 QTreeWidget 中
         QStringList fields = line.split(":", Qt::SkipEmptyParts);
         if (fields.size() >= 2)
         {
             QString property = fields[0].trimmed();
             QString value = fields[1].trimmed();

             QTreeWidgetItem *item = new QTreeWidgetItem(ui->treeWidget);
             item->setText(0, property);
             item->setText(1, value);
         }
     }

     // 设置列标题
     ui->treeWidget->setHeaderLabels(QStringList() << "系统信息" << "数值");
    } else
    {
     QTreeWidgetItem *item = new QTreeWidgetItem(ui->treeWidget);
     item->setText(0, "Failed to execute systeminfo command.");
    }
}
```

运行后当用户点击输出系统信息按钮时，因`systeminfo`运行时间较长所以需要等待一段时间，输出效果如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/ac6971bce2a7843baa4c553a0731b068%5B1%5D.png)