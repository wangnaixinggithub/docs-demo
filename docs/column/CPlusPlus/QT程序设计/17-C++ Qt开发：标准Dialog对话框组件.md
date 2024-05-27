# C++ Qt开发：标准Dialog对话框组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍标准对话框`QInputDialog`、`QFileDialog `这两种对话框组件的常用方法及灵活运用。

在 Qt 中，标准对话框提供了一些常见的用户交互界面，用于执行特定任务，例如获取用户输入、选择文件路径、显示消息等。这些对话框通常具有标准化的外观和行为，使得在不同的平台上能够保持一致性。在一般的开发过程中，标准对话框是开发者常用的工具之一。

### 1.1 QInputDialog

`QInputDialog` 类提供了一种简单的方法，用于获取用户的输入。它可以用于获取文本、整数、浮点数等类型的输入。

以下是 `QInputDialog` 类的一些常用方法的说明和概述，以表格形式列出：

| **方法**                                                     | **描述**                                         |
| ------------------------------------------------------------ | ------------------------------------------------ |
| `getText(QWidget *parent, const QString &title, const QString &label, QLineEdit::EchoMode mode = QLineEdit::Normal, const QString &text = QString(), bool *ok = nullptr, Qt::WindowFlags flags = Qt::WindowFlags()) -> QString` | 显示一个文本输入对话框，返回用户输入的文本。     |
| `getInt(QWidget *parent, const QString &title, const QString &label, int value = 0, int minValue = -2147483647, int maxValue = 2147483647, int step = 1, bool *ok = nullptr, Qt::WindowFlags flags = Qt::WindowFlags()) -> int` | 显示一个整数输入对话框，返回用户输入的整数。     |
| `getDouble(QWidget *parent, const QString &title, const QString &label, double value = 0, double minValue = -2147483647, double maxValue = 2147483647, int decimals = 1, bool *ok = nullptr, Qt::WindowFlags flags = Qt::WindowFlags()) -> double` | 显示一个浮点数输入对话框，返回用户输入的浮点数。 |
| `getItem(QWidget *parent, const QString &title, const QString &label, const QStringList &items, int current = 0, bool editable = true, bool *ok = nullptr, Qt::WindowFlags flags = Qt::WindowFlags(), Qt::InputMethodHints inputMethodHints = Qt::ImhNone) -> QString` | 显示一个列表输入对话框，返回用户选择的项。       |
| `getMultiLineText(QWidget *parent, const QString &title, const QString &label, const QString &text = QString(), bool *ok = nullptr, Qt::WindowFlags flags = Qt::WindowFlags()) -> QString` | 显示一个多行文本输入对话框，返回用户输入的文本。 |

显示详细信息

这些方法提供了不同类型的输入对话框，包括文本、整数、浮点数、列表等。通过这些方法，开发者可以方便地与用户交互，获取用户输入的信息。需要注意的是，这些方法都是静态方法，可以直接通过类名 `QInputDialog` 调用。

为了方便展示这四种标准输入框的使用，此处读者可自行绘制如下所示的页面`UI`布局，并自行导入`#include <QInputDialog>`与`#include <QLineEdit>`两个头文件；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6c936b8953837f9befced6442dd9d028%5B1%5D.png)





#### 1.1.3 文本输入

通过`getText`方法实现，`QInputDialog::getText` 是 Qt 中用于显示一个简单的对话框，其中包含一个用于输入文本的字段的静态方法。这个方法通常用于获取用户输入的文本。

方法的参数包括：

- `parent`: 对话框的父窗口。传入 `nullptr` 表示没有父窗口。
- `caption`: 对话框的标题。
- `label`: 输入字段上方的文本标签。
- `echo`: 输入文本时的回显模式，可以是 `QLineEdit::Normal`、`QLineEdit::NoEcho` 等。
- `text`: 初始文本。
- `ok`: 一个布尔指针，用于获取对话框的 OK 按钮的状态。
- `flags`: 可选的窗口标志。

方法返回用户输入的文本，如果用户取消了对话框，则返回一个空字符串。你可以根据需要调整标签、初始文本、回显模式等参数，以满足你的具体需求。

该方法要求用户传入标题`EchoMode`等必备参数，需要注意的是如果读者想要输入时隐藏显示文本则可以直接设置`QLineEdit::Password`为密码模式，此时输入的密码将会被`*`号代替，代码如下；

```c
void MainWindow::on_pushButton_text_clicked()
{
    QString dlgTitle="输入文字对话框";
    QString txtLabel="请输入文件名";
    QString defaultInput="新建文件.txt";
    QLineEdit::EchoMode echoMode=QLineEdit::Normal;       // 正常文字输入
    // QLineEdit::EchoMode echoMode=QLineEdit::Password;  // 密码输入

    bool flag = false;
    QString text = QInputDialog::getText(this, dlgTitle,txtLabel, echoMode,defaultInput, &flag);
    if (flag && !text.isEmpty())
    {
        ui->plainTextEdit->appendPlainText(text);
    }
}
```

代码运行后点击`文本输入`按钮，则可弹出输入框，如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/ca17b09f348fbe0dd10d38a463120eaa%5B1%5D.png)

#### 1.1.2 整数输入

通过`getInt`方法实现，`QInputDialog::getInt` 是 Qt 中用于显示一个简单的对话框，其中包含一个用于输入整数的字段的静态方法。这个方法通常用于获取用户输入的整数。

方法的参数包括：

- `parent`: 对话框的父窗口。传入 `nullptr` 表示没有父窗口。
- `caption`: 对话框的标题。
- `label`: 输入字段上方的文本标签。
- `value`: 初始值。
- `min`: 最小值。
- `max`: 最大值。
- `step`: 步长，表示每次增减的量。
- `ok`: 一个布尔指针，用于获取对话框的 OK 按钮的状态。
- `flags`: 可选的窗口标志。

方法返回用户输入的整数，如果用户取消了对话框，则返回 0。你可以根据需要调整标签、初始值、范围、步长等参数，以满足你的具体需求。

该方法提供了一个`SpinBox`选择框，在输入时可以通过传入`minValue`限制最小值，`maxValue`限制最大值，通过`stepValue`设置每次步长，代码如下；

```c
void MainWindow::on_pushButton_int_clicked()
{
    QString dlgTitle="输入整数对话框";
    QString txtLabel="设置字体大小";
    int defaultValue=ui->plainTextEdit->font().pointSize();   // 现有字体大小
    int minValue=6, maxValue=50, stepValue=1;                 // 范围(步长)
    bool flag=false;
    int inputValue = QInputDialog::getInt(this, dlgTitle,txtLabel,defaultValue, minValue,maxValue,stepValue,&flag);
    if (flag)
    {
        QFont font=ui->plainTextEdit->font();
        font.setPointSize(inputValue);
        ui->plainTextEdit->setFont(font);

        // 显示在编辑框内
        QString stringValue = QString::number(inputValue);
        ui->plainTextEdit->appendPlainText(stringValue);
    }
}
```

代码运行后点击`整数输入`按钮，则可弹出输入框，整数选择最小被限制在了`6`而最大限制为`50`，如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/077524e5663375dbda317d6697cb72be%5B1%5D.png)



#### 1.1.3 浮点数输入

通过`getDouble`方法实现，`QInputDialog::getDouble` 是 Qt 中用于显示一个简单的对话框，其中包含一个用于输入浮点数的字段的静态方法。这个方法通常用于获取用户输入的浮点数。

方法的参数包括：

- `parent`: 对话框的父窗口。传入 `nullptr` 表示没有父窗口。
- `caption`: 对话框的标题。
- `label`: 输入字段上方的文本标签。
- `value`: 初始值。
- `min`: 最小值。
- `max`: 最大值。
- `decimals`: 小数位数。
- `ok`: 一个布尔指针，用于获取对话框的 OK 按钮的状态。
- `flags`: 可选的窗口标志。

方法返回用户输入的浮点数，如果用户取消了对话框，则返回 0.0。你可以根据需要调整标签、初始值、范围、小数位数等参数，以满足你的具体需求。

该方法提供了一个`SpinBox`选择框，浮点数的输入同样可以限制输入长度，同时浮点数也可以指定小数点的位数，通过`decimals`指定为两位显示，代码如下；

```c
void MainWindow::on_pushButton_float_clicked()
{
    QString dlgTitle="输入浮点数对话框";
    QString txtLabel="输入一个浮点数";
    float defaultValue=3.13;

    float minValue=0, maxValue=10000;  // 范围
    int decimals=2;                    // 小数点位数

    bool flag=false;
    float inputValue = QInputDialog::getDouble(this, dlgTitle,txtLabel,defaultValue, minValue,maxValue,decimals,&flag);
    if (flag)
    {
        QString str=QString::asprintf("输入了一个浮点数:%.2f",inputValue);
        ui->plainTextEdit->appendPlainText(str);
    }
}
```

代码运行后点击`浮点数输入`按钮，则可弹出输入框，浮点数选择最小被限制在了`0`而最大限制为`10000`，默认值为`3.13`保留长度为两位，如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/492935043474d54b2b8d52b99ff8f2d7%5B1%5D.png)



#### 1.1.4 单选框输入

通过`getItem`方法实现，该方法适合于只让用户选择特定的内容，`QInputDialog::getItem` 是 Qt 中用于显示一个简单的对话框，其中包含一个下拉框（QComboBox）供用户选择的静态方法。这个方法通常用于获取用户从列表中选择的项。

方法的参数包括：

- `parent`: 对话框的父窗口。传入 `nullptr` 表示没有父窗口。
- `caption`: 对话框的标题。
- `label`: 下拉框上方的文本标签。
- `items`: 字符串列表，表示下拉框中的选项。
- `currentItem`: 初始时被选中的项的索引。
- `editable`: 是否允许用户编辑下拉框中的文本。
- `ok`: 一个布尔指针，用于获取对话框的 OK 按钮的状态。在这个例子中，我们传递了 `nullptr`，因为我们不关心 OK 按钮的状态。
- `flags`: 可选的窗口标志。

方法返回用户选择的项，如果用户取消了对话框，则返回一个空字符串。你可以根据需要调整标签、初始选中项、是否可编辑等参数，以满足你的具体需求。代码如下所示；

```c
void MainWindow::on_pushButton_checkbox_clicked()
{
    QStringList items;                        // 列表内容
    items <<"优秀"<<"良好"<<"合格"<<"不合格";    // 放入列表

    QString dlgTitle="条目选择对话框";
    QString txtLabel="请选择级别";
    int curIndex=0;                            // 初始选择项
    bool editable=false;                       // 是否可编辑
    bool flag=false;
    QString text = QInputDialog::getItem(this, dlgTitle,txtLabel,items,curIndex,editable,&flag);

    if (flag && !text.isEmpty())
    {
        ui->plainTextEdit->appendPlainText(text);
    }
}
```

代码运行后点击`单选框输入`按钮，则可弹出单选框窗体，读者可选择对应的选项，如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/045066db5d76486c78757a77974fc8b5%5B1%5D.png)

### 2.1 QFileDialog

`QFileDialog` 类用于打开和保存文件的标准对话框。它提供了用户友好的界面，使得用户可以轻松地选择文件或目录，在使用时同样需要导入`#include <QFileDialog>`头文件。

以下是 `QFileDialog` 类的一些常用方法的说明和概述，以表格形式列出：

| **方法**                                                     | **描述**                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| `getOpenFileName(QWidget *parent = nullptr, const QString &caption = QString(), const QString &dir = QString(), const QString &filter = QString(), QString *selectedFilter = nullptr, Options options = 0)` | 打开文件对话框，获取用户选择的文件名。                       |
| `getOpenFileNames(QWidget *parent = nullptr, const QString &caption = QString(), const QString &dir = QString(), const QString &filter = QString(), QString *selectedFilter = nullptr, Options options = 0)` | 打开文件对话框，获取用户选择的多个文件名。                   |
| `getSaveFileName(QWidget *parent = nullptr, const QString &caption = QString(), const QString &dir = QString(), const QString &filter = QString(), QString *selectedFilter = nullptr, Options options = 0)` | 保存文件对话框，获取用户输入的文件名。                       |
| `getExistingDirectory(QWidget *parent = nullptr, const QString &caption = QString(), const QString &dir = QString(), Options options = ShowDirsOnlyDontResolveSymlinks)` | 用于在文件系统中获取现有目录的路径。                         |
| `getExistingDirectoryUrl(QWidget *parent = nullptr, const QString &caption = QString(), const QUrl &dir = QUrl(), QFileDialog::Options options = ShowDirsOnlyDontResolveSymlinks)` | 用于在文件系统中获取现有目录的路径。                         |
| `getSaveFileUrl(QWidget *parent = nullptr, const QString &caption = QString(), const QUrl &dir = QUrl(), const QString &filter = QString(), QString *selectedFilter = nullptr, Options options = 0)` | 保存文件对话框，获取用户输入的文件的 URL。                   |
| `getOpenFileUrl(QWidget *parent = nullptr, const QString &caption = QString(), const QUrl &dir = QUrl(), const QString &filter = QString(), QString *selectedFilter = nullptr, Options options = 0)` | 打开文件对话框，获取用户选择的文件的 URL。                   |
| `getOpenFileUrls(QWidget *parent = nullptr, const QString &caption = QString(), const QUrl &dir = QUrl(), const QString &filter = QString(), QString *selectedFilter = nullptr, Options options = 0)` | 打开文件对话框，获取用户选择的多个文件的 URL。               |
| `getSaveFileUrls(QWidget *parent = nullptr, const QString &caption = QString(), const QUrl &dir = QUrl(), const QString &filter = QString(), QString *selectedFilter = nullptr, Options options = 0)` | 保存文件对话框，获取用户输入的多个文件的 URL。               |
| `setLabelText(QFileDialog::DialogLabel label, const QString &text)` | 设置对话框中指定标签的文本。                                 |
| `setLabelText(QFileDialog::DialogLabel label, const QUrl &url)` | 设置对话框中指定标签的文本为 URL。                           |
| `setOption(QFileDialog::Option option, bool on = true)`      | 启用或禁用对话框的指定选项。                                 |
| `setOptions(QFileDialog::Options options)`                   | 设置对话框的选项。                                           |
| `setFileMode(QFileDialog::FileMode mode)`                    | 设置对话框的文件模式（打开、保存、目录选择等）。             |
| `setAcceptMode(QFileDialog::AcceptMode mode)`                | 设置对话框的接受模式，是打开文件还是保存文件。               |
| `setViewMode(QFileDialog::ViewMode mode)`                    | 设置对话框的视图模式，如详细视图、图标视图等。               |
| `setDirectory(const QString &directory)`                     | 设置对话框打开时的默认目录。                                 |
| `setDirectoryUrl(const QUrl &directory)`                     | 设置对话框打开时的默认目录的 URL。                           |
| `setFilter(const QString &filter)`                           | 设置对话框的文件类型过滤器，如"文本文件 (*.txt);;所有文件 (*)"。 |
| `setNameFilter(const QString &filter)`                       | 设置对话框的文件名过滤器，如"*.txt"。                        |
| `setDefaultSuffix(const QString &suffix)`                    | 设置默认的文件后缀，用于在用户未指定文件后缀时追加到文件名。 |
| `setMimeTypeFilters(const QStringList &filters)`             | 设置对话框的 MIME 类型过滤器。                               |
| `setSidebarUrls(const QList<QUrl> &urls)`                    | 设置对话框侧边栏的 URL 列表。                                |
| `setProxyModel(QAbstractProxyModel *proxyModel)`             | 设置对话框使用的代理模型。                                   |
| `setHistory(const QStringList &paths)`                       | 设置对话框历史记录的路径列表。                               |
| `setSidebarUrls(const QList<QUrl> &urls)`                    | 设置对话框侧边栏的 URL 列表。                                |
| `setProxyModel(QAbstractProxyModel *proxyModel)`             | 设置对话框使用的代理模型。                                   |
| `setHistory(const QStringList &paths)`                       | 设置对话框历史记录的路径列表。                               |
| `setDefaultSuffix(const QString &suffix)`                    | 设置默认的文件后缀，用于在用户未指定文件后缀时追加到文件名。 |
| `setMimeTypeFilters(const QStringList &filters)`             | 设置对话框的 MIME 类型过滤器。                               |
| `setSidebarUrls(const QList<QUrl> &urls)`                    | 设置对话框侧边栏的 URL 列表。                                |
| `setProxyModel(QAbstractProxyModel *proxyModel)`             | 设置对话框使用的代理模型。                                   |
| `setHistory(const QStringList &paths)`                       | 设置对话框历史记录的路径列表。                               |
| `setDefaultSuffix(const QString &suffix)`                    | 设置默认的文件后缀，用于在用户未指定文件后缀时追加到文件名。 |
| `setMimeTypeFilters(const QStringList &filters)`             | 设置对话框的 MIME 类型过滤器。                               |
| `setSidebarUrls(const QList<QUrl> &urls)`                    | 设置对话框侧边栏的 URL 列表。                                |
| `setProxyModel(QAbstractProxyModel *proxyModel)`             | 设置对话框使用的代理模型。                                   |
| `setHistory(const QStringList &paths)`                       | 设置对话框历史记录的路径列表。                               |
| `setDefaultSuffix(const QString &suffix)`                    | 设置默认的文件后缀，用于在用户未指定文件后缀时追加到文件名。 |
| `setMimeTypeFilters(const QStringList &filters)`             | 设置对话框的 MIME 类型过滤器。                               |
| `setSidebarUrls(const QList<QUrl> &urls)`                    | 设置对话框侧边栏的 URL 列表。                                |
| `setProxyModel(QAbstractProxyModel *proxyModel)`             | 设置对话框使用的代理模型。                                   |
| `setHistory(const QStringList &paths)`                       | 设置对话框历史记录的路径列表。                               |
| `setDefaultSuffix(const QString &suffix)`                    | 设置默认的文件后缀，用于在用户未指定文件后缀时追加到文件名。 |
| `setMimeTypeFilters(const QStringList &filters)`             | 设置对话框的 MIME 类型过滤器。                               |
| `setSidebarUrls(const QList<QUrl> &urls)`                    | 设置对话框侧边栏的 URL 列表。                                |
| `setProxyModel(QAbstractProxyModel *proxyModel)`             | 设置对话框使用的代理模型。                                   |
| `setHistory(const QStringList &paths)`                       | 设置对话框历史记录的路径列表。                               |
| `setLabelText(QFileDialog::DialogLabel label, const QString &text)` | 设置对话框中指定标签的文本。                                 |
| `setLabelText(QFileDialog::DialogLabel label, const QUrl &url)` | 设置对话框中指定标签的文本为 URL。                           |
| `setOption(QFileDialog::Option option, bool on = true)`      | 启用或禁用对话框的指定选项。                                 |
| `setOptions(QFileDialog::Options options)`                   | 设置对话框的选项。                                           |
| `setFileMode(QFileDialog::FileMode mode)`                    | 设置对话框的文件模式（打开、保存、目录选择等）。             |
| `setAcceptMode(QFileDialog::AcceptMode mode)`                | 设置对话框的接受模式，是打开文件还是保存文件。               |
| `setViewMode(QFileDialog::ViewMode mode)`                    | 设置对话框的视图模式，如详细视图、图标视图等。               |
| `setDirectory(const QString &directory)`                     | 设置对话框打开时的默认目录。                                 |
| `setDirectoryUrl(const QUrl &directory)`                     | 设置对话框打开时的默认目录的 URL。                           |
| `setFilter(const QString &filter)`                           | 设置对话框的文件类型过滤器，如"文本文件 (*.txt);;所有文件 (*)"。 |
| `setNameFilter(const QString &filter)`                       | 设置对话框的文件名过滤器，如"*.txt"。                        |
| `setDefaultSuffix(const QString &suffix)`                    | 设置默认的文件后缀，用于在用户未指定文件后缀时追加到文件名。 |
| `setMimeTypeFilters(const QStringList &filters)`             | 设置对话框的 MIME 类型过滤器。                               |
| `setSidebarUrls(const QList<QUrl> &urls)`                    | 设置对话框侧边栏的 URL 列表。                                |
| `setProxyModel(QAbstractProxyModel *proxyModel)`             | 设置对话框使用的代理模型。                                   |
| `setHistory(const QStringList &paths)`                       | 设置对话框历史记录的路径列表。                               |

显示详细信息

这些方法提供了一系列功能，包括打开文件、保存文件、选择目录等，以及对对话框的一些属性进行设置。这样，开发者可以方便地使用这些方法构建出符合应用需求的文件对话框。需要注意的是，这些方法中的许多参数都有默认值，因此在大多数情况下，开发者可以选择性地调用这些方法。

#### 2.1.1 选择文件

在选择单个文件时可以通过调用`getOpenFileName`方法实现，`QFileDialog::getOpenFileName` 是 Qt 中用于显示打开文件对话框并获取用户选择的文件名的静态方法。它通常用于在用户需要选择一个文件进行打开操作时，例如加载文件等场景。

方法的参数包括：

- `parent`: 对话框的父窗口。传入 `nullptr` 表示没有父窗口。
- `caption`: 对话框的标题。
- `dir`: 默认的目录路径。
- `filter`: 文件类型过滤器，用于筛选可打开的文件类型。可以使用分号分隔多个过滤器，例如 `"Text Files (*.txt);;All Files (*)"`。

方法返回用户选择的文件名，如果用户取消了对话框，则返回一个空字符串。你可以根据需要调整过滤器、默认目录等参数，以满足你的具体需求。

通过最后一个参数来指定需要打开的文件类型，通常可传入一组字符串来实现过滤，当打开后可以通过`aFileName`拿到文件具体路径，代码如下；

```c
void MainWindow::on_pushButton_file_clicked()
{
    QString curPath=QDir::currentPath();                                       // 获取系统当前目录
    //  QString  curPath=QCoreApplication::applicationDirPath();               // 获取应用程序的路径
    QString dlgTitle="选择一个文件";                                             // 对话框标题
    QString filter="文本文件(*.txt);;图片文件(*.jpg *.gif *.png);;所有文件(*.*)";  // 文件过滤器

    QString aFileName=QFileDialog::getOpenFileName(this,dlgTitle,curPath,filter);

    if (!aFileName.isEmpty())
    {
        ui->plainTextEdit->appendPlainText(aFileName);
    }
}
```

打开效果图如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/6be0ac8f6f9d30c6e7318f296697b3e2%5B1%5D.png)



同理，当我们需要选择多个文件并打开时只需要将`QString`修改为`QStringList`这样当文件被打开后则可以通过循环输出`fileList`列表来获取所有路径信息，如下代码所示；

```c
void MainWindow::on_pushButton_multiple_clicked()
{
    // QString curPath=QCoreApplication::applicationDirPath();                // 获取应用程序的路径
    QString curPath=QDir::currentPath();                                      // 获取系统当前目录
    QString dlgTitle="选择多个文件";                                            // 对话框标题
    QString filter="文本文件(*.txt);;图片文件(*.jpg *.gif *.png);;所有文件(*.*)"; // 文件过滤器

    QStringList fileList=QFileDialog::getOpenFileNames(this,dlgTitle,curPath,filter);
    for (int i=0; i<fileList.count();i++)
    {
        // 循环将文件路径添加到列表中
        ui->plainTextEdit->appendPlainText(fileList.at(i));
    }
}
```

在选择时可以通过拖拽选中的方式选择多个文件，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/4b2f6ddabba38b85af1b7072f827540f%5B1%5D.png)

#### 2.1.2 选择目录

选择目录时可以调用`getExistingDirectory`方法，`QFileDialog::getExistingDirectory` 是 Qt 中用于显示选择目录对话框并获取用户选择的目录的静态方法。它通常用于在用户需要选择一个目录时，例如保存文件到特定目录或加载文件等场景。

方法的参数包括：

- `parent`: 对话框的父窗口。传入 `nullptr` 表示没有父窗口。
- `caption`: 对话框的标题。
- `dir`: 默认的目录路径。
- `options`: 对话框的选项。在示例中，使用了 `QFileDialog::ShowDirsOnly` 表示只显示目录，并且 `QFileDialog::DontResolveSymlinks` 表示不解析符号链接。

方法返回用户选择的目录路径，如果用户取消了对话框，则返回一个空字符串。你可以根据需要调整默认目录、选项等参数，以满足你的具体需求。

```c
void MainWindow::on_pushButton_dirfile_clicked()
{
    QString curPath=QCoreApplication::applicationDirPath();    // 获取应用程序的路径
    // QString curPath=QDir::currentPath();                    // 获取系统当前目录

    // 调用打开文件对话框打开一个文件
    QString dlgTitle="选择一个目录";                             // 对话框标题
    QString selectedDir=QFileDialog::getExistingDirectory(this,dlgTitle,curPath,QFileDialog::ShowDirsOnly);
    if (!selectedDir.isEmpty())
    {
        ui->plainTextEdit->appendPlainText(selectedDir);
    }
}
```

选择目录输出效果图如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/64454cc79fe9f61ad0b9f99ce9bfd632%5B1%5D.png)



#### 2.1.3 保存文件

保存文件可以通过调用`getSaveFileName`方法来实现，`QFileDialog::getSaveFileName` 是 Qt 中用于显示保存文件对话框并获取用户选择的文件名的静态方法。它通常用于在用户将文件保存到磁盘时获取文件的保存路径。

该方法的参数包括：

- `parent`: 对话框的父窗口。传入 `nullptr` 表示没有父窗口。
- `caption`: 对话框的标题。
- `dir`: 默认的目录路径。
- `filter`: 文件类型过滤器，用于筛选可保存的文件类型。可以使用分号分隔多个过滤器，例如 `"Text Files (*.txt);;All Files (*)"`。

方法返回用户选择的文件名，如果用户取消了对话框，则返回一个空字符串。你可以根据需要调整过滤器、默认目录等参数，以满足你的具体需求。

```c
void MainWindow::on_pushButton_save_clicked()
{
    QString curPath=QCoreApplication::applicationDirPath();                  // 获取应用程序的路径
    QString dlgTitle="保存文件";                                              // 对话框标题
    QString filter="文本文件(*.txt);;h文件(*.h);;C++文件(.cpp);;所有文件(*.*)"; // 文件过滤器
    QString aFileName=QFileDialog::getSaveFileName(this,dlgTitle,curPath,filter);
    if (!aFileName.isEmpty())
    {
        ui->plainTextEdit->appendPlainText(aFileName);
    }
}
```

保存文件对话框如下图所示，当点击后则可以将文件保存到特定目录下；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/0f96c68a04527ee962311c55fd6b21e7%5B1%5D.png)