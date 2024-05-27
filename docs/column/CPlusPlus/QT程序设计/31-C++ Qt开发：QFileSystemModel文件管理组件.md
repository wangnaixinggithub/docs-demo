# C++ Qt开发：QFileSystemModel文件管理组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QFileSystemModel`组件实现文件管理器功能。

QFileSystemModel是Qt框架中的一个关键类，用于在Qt应用程序中管理和展示文件系统的结构。该模型提供了一个方便的接口，使得开发者可以轻松地在应用程序中集成文件和目录的树形结构，并通过视图组件（如`QTreeView`、`QListView`、`QTabView`等）展示给用户。

以下是 `QFileSystemModel` 类的一些重要函数：

| 函数                                                         | 描述                                               |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `QFileSystemModel(QObject *parent = nullptr)`                | 构造函数，创建一个 `QFileSystemModel` 对象。       |
| `void setRootPath(const QString &path)`                      | 设置模型的根路径，指定从哪个目录开始显示文件系统。 |
| `QString rootPath() const`                                   | 获取模型的根路径。                                 |
| `void setFilter(QDir::Filters filters)`                      | 设置目录过滤器，用于过滤显示的文件和目录。         |
| `void setResolveSymlinks(bool enable)`                       | 设置是否解析符号链接。                             |
| `void sort(int column, Qt::SortOrder order)`                 | 对指定列进行排序。                                 |
| `QModelIndex index(const QString &path, int column = 0) const` | 根据文件路径和列号获取模型索引。                   |
| `QFileInfo fileInfo(const QModelIndex &index) const`         | 获取给定索引处的文件信息。                         |
| `bool mkdir(const QModelIndex &index, const QString &name)`  | 在给定索引处的目录中创建新目录。                   |
| `bool rmdir(const QModelIndex &index)`                       | 删除给定索引处的目录。                             |
| `bool remove(const QModelIndex &index)`                      | 删除给定索引处的文件。                             |
| `void directoryLoaded(const QString &path)`                  | 在目录加载完成时发射的信号。                       |
| `void fileRenamed(const QString &path, const QString &oldName, const QString &newName)` | 在文件重命名时发射的信号。                         |
| `QModelIndex setRootPath(const QString &path)`               | 设置根路径，并返回表示新路径的模型索引。           |
| `QString filePath(const QModelIndex &index) const`           | 获取给定索引处的文件路径。                         |
| `void setReadOnly(bool enable)`                              | 设置模型为只读模式。                               |
| `bool isReadOnly() const`                                    | 判断模型是否为只读模式。                           |
| `void setNameFilters(const QStringList &filters)`            | 设置名称过滤器，用于限制模型中显示的文件类型。     |
| `QStringList nameFilters() const`                            | 获取当前的名称过滤器。                             |
| `void setRootIndex(const QModelIndex &index)`                | 设置根索引。                                       |
| `QModelIndex rootIndex() const`                              | 获取当前的根索引。                                 |
| `QModelIndex index(int row, int column, const QModelIndex &parent = QModelIndex()) const` | 获取模型索引。                                     |
| `QModelIndex parent(const QModelIndex &index) const`         | 获取给定索引的父索引。                             |
| `int rowCount(const QModelIndex &parent = QModelIndex()) const` | 获取给定父索引下的行数。                           |
| `int columnCount(const QModelIndex &parent = QModelIndex()) const` | 获取给定父索引下的列数。                           |
| `QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const` | 获取模型数据。                                     |

显示详细信息

当需要使用此模型时，我们需要导入`QFileSystemModel`组件， 并在主类内定义`QFileSystemModel`类型的模型指针，并在主函数内通过`new QFileSystemModel`新建类，通过`model->setRootPath`设置默认停留的指针位置，最后调用`model->setNameFilters`设置过滤器，此处我们只需要显示`*.exe,*.txt,*.mp4`三种格式即可，最后使用`ui->treeView->setModel`将此模型设置到组件内即可，其完整代码非常简单，如下所示；

```c
MainWindow::MainWindow(QWidget *parent) :QMainWindow(parent),ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    // 新建类指针
    model=new QFileSystemModel(this);

    // 设置根目录
    model->setRootPath(QDir::currentPath());

    // 设置过滤器,只过滤出txt,mp4
    QStringList filter;
    filter << "*.txt" << "*.mp4";

    // 使用过滤器
    model->setNameFilters(filter);
    model->setNameFilterDisables(false);

    // 设置数据模型
    ui->treeView->setModel(model);
}
```

数据模型内的选中项可通过使用模型内提供的各种方法来实现取值，例如使用`model->isDir`可获取到是否为目录，通过`model->filePath`则可用于得到文件的路径等。

```c
// 被点击后触发
void MainWindow::on_treeView_clicked(const QModelIndex &index)
{
    // 是否是目录
    ui->chkIsDir->setChecked(model->isDir(index));
    // 文件路径
    ui->LabPath->setText(model->filePath(index));

    // 文件类型
    ui->LabType->setText(model->type(index));

    // 文件名
    ui->LabFileName->setText(model->fileName(index));

    // 文件的大小
    int sz=model->size(index)/1024;
    if (sz<1024)
    {

        ui->LabFileSize->setText(QString("%1 KB").arg(sz));
    }
    else
    {
        ui->LabFileSize->setText(QString::asprintf("%.1f MB",sz/1024.0));
    }
}
```

运行后则可以通过点击不同的目录树展开，由于设置了只过滤特定的文件所以此处显示的结果如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/9bbad5f1d3fd146f7be9e57490a36a48%5B1%5D.png)