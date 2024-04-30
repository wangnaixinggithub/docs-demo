# C++ Qt开发：QFileSystemWatcher文件监视组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QFileSystemWatcher`组件实现对文件或目录的监视功能。

QFileSystemWatcher 是 Qt 框架中提供的一个类，用于监视文件系统中的文件和目录的变化。它允许你在文件或目录发生变化时接收通知，并可以用于监视文件的创建、删除、重命名以及内容修改等操作。这对于需要实时监控文件系统变化的应用程序是非常有用的。

下面是关于 `QFileSystemWatcher` 类的一些常用函数的解释：

| 函数                                                | 描述                                           |
| --------------------------------------------------- | ---------------------------------------------- |
| `QFileSystemWatcher(QObject *parent = nullptr)`     | 构造函数，创建一个文件系统监视器对象。         |
| `void addPath(const QString &path)`                 | 添加要监视的文件或目录路径。                   |
| `void addPaths(const QStringList &paths)`           | 添加要监视的多个文件或目录路径。               |
| `bool removePath(const QString &path)`              | 移除要监视的文件或目录路径。                   |
| `void removePaths(const QStringList &paths)`        | 移除要监视的多个文件或目录路径。               |
| `bool contains(const QString &path) const`          | 检查监视器是否包含指定的文件或目录路径。       |
| `QStringList files() const`                         | 返回当前监视的文件路径列表。                   |
| `QStringList directories() const`                   | 返回当前监视的目录路径列表。                   |
| `void setFilter(QFileSystemWatcher::Filter filter)` | 设置监视器的过滤器，用于指定要监视的事件类型。 |
| `QFileSystemWatcher::Filter filter() const`         | 返回监视器当前的过滤器设置。                   |
| `void fileChanged(const QString &path)`             | 信号，当监视的文件发生变化时发出。             |
| `void directoryChanged(const QString &path)`        | 信号，当监视的目录发生变化时发出。             |

显示详细信息

这些函数允许你动态地添加或移除要监视的文件或目录，设置过滤器以确定要监视的事件类型，并连接相应的信号以处理文件系统的变化事件。

首先我们需要新增一个`filesystem.h`头文件，该类主要用于实现对文件访问的封装，其中`addWatchPath`用于增加一个被监控目录，当目录被更新世则调用`directoryUpdated`，文件被修改调用`fileUpdated`。

```c
#ifndef FILESYSTEM_H
#define FILESYSTEM_H
#include <QObject>
#include <QMap>
#include <QString>
#include <QMap>
#include <QFileSystemWatcher>

class FileSystemWatcher : public QObject
{
    Q_OBJECT

public:
    static void addWatchPath(QString path);

public slots:

    // 目录更新时调用
    void directoryUpdated(const QString &path);

    // 文件被修改时调用
    void fileUpdated(const QString &path);

private:
    explicit FileSystemWatcher(QObject *parent = 0);

private:
    // 单例
    static FileSystemWatcher *m_pInstance;

    // QFileSystemWatcher变量
    QFileSystemWatcher *m_pSystemWatcher;

    // 当前每个监控的内容目录列表
    QMap<QString, QStringList> m_currentContentsMap;
};

#endif // FILESYSTEM_H
```

接着是`filesystem.cpp`主函数部分，首先`FileSystemWatcher::addWatchPath`用于增加一个监控目录。这里的重点在于创建两个信号，当`m_pSystemWatcher`收到监控数据时，我们让其分别去触发`directoryChanged`与`fileChanged`两个信号，在信号中分别携带一个参数传递给`directoryUpdated`与`fileUpdated`槽函数上进行处理，如果是目录则保存目录中的内容。

```c
void FileSystemWatcher::addWatchPath(QString path)
{
   qDebug() << QString("添加监控目录: %1").arg(path);

    if (m_pInstance == NULL)
    {
        m_pInstance = new FileSystemWatcher();
        m_pInstance->m_pSystemWatcher = new QFileSystemWatcher();

        // 连接QFileSystemWatcher的directoryChanged和fileChanged信号到相应的槽
        connect(m_pInstance->m_pSystemWatcher, SIGNAL(directoryChanged(QString)), m_pInstance, SLOT(directoryUpdated(QString)));
        connect(m_pInstance->m_pSystemWatcher, SIGNAL(fileChanged(QString)), m_pInstance, SLOT(fileUpdated(QString)));
    }

    // 添加监控路径
    m_pInstance->m_pSystemWatcher->addPath(path);

    // 如果添加路径是一个目录，保存当前内容列表
    QFileInfo file(path);
    if (file.isDir())
    {
        const QDir dirw(path);
        m_pInstance->m_currentContentsMap[path] = dirw.entryList(QDir::NoDotAndDotDot | QDir::AllDirs | QDir::Files, QDir::DirsFirst);
    }
}
```

接着是`FileSystemWatcher::directoryUpdated`函数的实现部分，如下所示代码，通过`QFileSystemWatcher`来监听指定目录下文件和子目录的变化。当目录发生变化时，调用`directoryUpdated`槽函数，比较最新的目录内容和之前保存的内容，找出新增文件、删除文件以及文件重命名等变化。

- 功能概述
  1. **添加监控路径**：通过`addWatchPath`函数添加监控路径，创建`QFileSystemWatcher`对象并连接相关信号和槽。
  2. **目录更新处理**：当监控的目录发生变化时，调用`directoryUpdated`槽函数。
  3. **内容变化比较**：比较最新的目录内容和之前保存的内容，找出新增文件、删除文件和文件重命名等变化。
  4. **文件重命名处理**：如果有文件重命名，输出文件重命名的信息。
  5. **新增文件处理**：输出新建文件的信息，并可以在相应的逻辑中处理每个新文件。
  6. **删除文件处理**：输出删除文件的信息，并可以在相应的逻辑中处理每个被删除的文件。

代码对文件系统的变化进行了细致的监控和处理，可以用于实时监控目录下文件的变动情况，例如新增文件、删除文件和文件重命名等操作。当用户需要自定义功能时可以在信息输出前对特定目录做进一步处理以达到监视并控制特定文件的功能。

```c
// 任何监控的目录更新（添加、删除、重命名）则调用
void FileSystemWatcher::directoryUpdated(const QString &path)
{
    qDebug() << QString("目录更新: %1").arg(path);

    // 比较最新的内容和保存的内容找出区别(变化)
    QStringList currEntryList = m_currentContentsMap[path];
    const QDir dir(path);

    QStringList newEntryList = dir.entryList(QDir::NoDotAndDotDot  | QDir::AllDirs | QDir::Files, QDir::DirsFirst);

    QSet<QString> newDirSet = QSet<QString>::fromList(newEntryList);
    QSet<QString> currentDirSet = QSet<QString>::fromList(currEntryList);

    // 添加了文件
    QSet<QString> newFiles = newDirSet - currentDirSet;
    QStringList newFile = newFiles.toList();

    // 文件已被移除
    QSet<QString> deletedFiles = currentDirSet - newDirSet;
    QStringList deleteFile = deletedFiles.toList();

    // 更新当前设置
    m_currentContentsMap[path] = newEntryList;

    if (!newFile.isEmpty() && !deleteFile.isEmpty())
    {
        // 文件/目录重命名
        if ((newFile.count() == 1) && (deleteFile.count() == 1))
        {
           qDebug() << QString("文件重命名 %1 到 %2").arg(deleteFile.first()).arg(newFile.first());
        }
    }
    else
    {
        // 添加新文件/目录至Dir
        if (!newFile.isEmpty())
        {
           qDebug() << "新建文件或目录: " << newFile;

            foreach (QString file, newFile)
            {
                // 处理操作每个新文件....
            }
        }

        // 从Dir中删除文件/目录
        if (!deleteFile.isEmpty())
        {
            qDebug() << "删除文件或目录: " << deleteFile;

            foreach(QString file, deleteFile)
            {
                // 处理操作每个被删除的文件....
            }
        }
    }
}
```

同理，当文件被修改时则调用`fileUpdated`函数，只需要去除绝对路径与文件名即可，如下代码所示；

```c
void FileSystemWatcher::fileUpdated(const QString &path)
{
    QFileInfo file(path);
    QString strPath = file.absolutePath();
    QString strName = file.fileName();

   qDebug() << QString("文件 %1 路径 %2 修改").arg(strName).arg(strPath);
}
```

你可以自行运行课件`FileSystemWatcher.zip`来观察监控效果，如下图；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/57ae159ff8399787464287a03f55b8a4%5B1%5D.png)