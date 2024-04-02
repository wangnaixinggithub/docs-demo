# C++ Qt开发：LineEdit单行输入组件

Qt 是一个跨平台C++[图形界面](https://so.csdn.net/so/search?q=图形界面&spm=1001.2101.3001.7020)开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍`LineEdit`单行输入框组件的常用方法及灵活运用。



在Qt中，QLineEdit是一个用于输入单行文本的控件，它提供了一个允许用户输入和编辑文本的文本框。该组件是Qt的基础控件之一，常用于获取用户的输入，例如用户名、密码、搜索关键字等。是构建用户交互界面的基础组件之一，通常与其他控件一起使用，例如按钮、标签等，以构建完整的用户输入界面。



以下是`QLineEdit`的一些常用方法和属性配置，以表格形式进行说明：

|                方法名                 |                        描述                        |
| :-----------------------------------: | :------------------------------------------------: |
|             `QLineEdit()`             |          构造函数，创建一个空的LineEdit。          |
|               `clear()`               |               清空LineEdit中的文本。               |
|      `setText(const QString &)`       |              设置LineEdit的文本内容。              |
|            `text() const`             |            获取LineEdit的当前文本内容。            |
| `setPlaceholderText(const QString &)` | 设置占位文本，显示在LineEdit中，提供用户输入提示。 |
|       `placeholderText() const`       |                   获取占位文本。                   |
|          `setMaxLength(int)`          |                 设置最大输入长度。                 |
|          `maxLength() const`          |                 获取最大输入长度。                 |
|          `setReadOnly(bool)`          |       设置LineEdit为只读状态，用户无法编辑。       |
|         `isReadOnly() const`          |            检查LineEdit是否为只读状态。            |
|  `setEchoMode(QLineEdit::EchoMode)`   |    设置回显模式，用于处理密码等敏感信息的显示。    |
|          `echoMode() const`           |                获取当前的回显模式。                |
|     `setValidator(QValidator *)`      |        设置输入验证器，用于限制输入的内容。        |
|          `validator() const`          |               获取当前的输入验证器。               |
|    `setInputMask(const QString &)`    |           设置输入掩码，限制输入的格式。           |
|          `inputMask() const`          |                获取当前的输入掩码。                |
|               `undo()`                |                  撤销上一次操作。                  |
|               `redo()`                |               重做上一次撤销的操作。               |
|                `cut()`                |                剪切当前选中的文本。                |
|               `copy()`                |                复制当前选中的文本。                |
|               `paste()`               |                 粘贴剪切板的内容。                 |
|             `selectAll()`             |             选中LineEdit中的所有文本。             |
|             `deselect()`              |                取消文本的选择状态。                |

这些方法提供了`QLineEdit`的基本功能，包括文本的设置、获取、清空，以及一些编辑和格式化的操作。具体使用时可以根据需求选择合适的方法。



# 使用输入框

首先实现一个简单的输入框案例，首先需要构建一个如下图所示的窗体布局，在布局中单行输入框LineEdit()组件用来输入一行文本内容，Label()标签用于显示文本信息，GroupBox()组件用来实现分组显示，PushButton()用于增加按钮的点击事件，通过四者配合实现两个简单的数值转换器。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240123194159735-17060101209901.png)



在代码是线上我们分别对两个按钮增加触发事件，第一个按钮用于实现乘法计算器功能，在代码中判断编辑框是否为空，不为空则计算，第二个按钮触发进制转换事件，完整代码如下所示；

```c
#include "QTLineEdit.h"

QTLineEdit::QTLineEdit(QWidget *parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);

    connect(ui.pushButton, SIGNAL(clicked()), this, SLOT(HandlePushButtonClick()));
    connect(ui.pushButton_2, SIGNAL(clicked()), this, SLOT(HandlePushButton2Click()));

    // 设置计算和编辑框不可修改
    ui.lineEdit_hex->setEnabled(false);
    ui.lineEdit_bin->setEnabled(false);
    setWindowTitle(QString::fromLocal8Bit("JasksonWang"));
    ui.label_Sum->setText("");
}

void QTLineEdit::HandlePushButtonClick()
{
    // 得到两个编辑框的数据
    QString qSNumberA;
    QString qSNumberB;
    QString qSTotalSum;
    int dNumberA = 0;
    double dNumberB = 0;
    double totalSum = 0;

    qSNumberA = ui.lineEdit_A->text();
    qSNumberB =  ui.lineEdit_B->text();

    // 判断是否为空
    if (qSNumberA.isEmpty() || qSNumberB.isEmpty())
    {
        ui.label_Sum->setText(QString::fromLocal8Bit("参数不能为空!"));
        return;
    }

    //QString 转基本数据类型
    dNumberA = qSNumberA.toInt();
    dNumberB = qSNumberB.toDouble();


    //注入到ID = labelSum的Label控件中
    totalSum = dNumberB + dNumberA;
    qSTotalSum.sprintf("%.2f", totalSum);
    ui.label_Sum->setText(qSTotalSum);





}

QTLineEdit::~QTLineEdit()
{
    
}

void QTLineEdit::HandlePushButton2Click()
{
    QString qSValue;
    uint dValue;
    QString qSConvertValue;


    // 判断是否为空
    qSValue = ui.lineEdit_C->text();
    if (qSValue.isEmpty())
    {
        ui.label_Sum->setText(QString::fromLocal8Bit("参数不能为空!"));
        return;
    }

    //QString 转基本数据类型
    dValue =  qSValue.toUInt();
    
    //转十六进制
    qSConvertValue.setNum(dValue, 16);
    qSConvertValue = qSConvertValue.toUpper();
    ui.lineEdit_hex->setText(qSConvertValue);

    //转二进制
    qSConvertValue.setNum(dValue, 2);
    ui.lineEdit_bin->setText(qSConvertValue);

}
```

运行后读者可自行观察输出效果，如下图：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/LineEdit%E6%8E%A7%E4%BB%B6-17060102040992.gif)

#  信息提示框

在Qt中对话框分为两种形式，一种是标准对话框，另一种则是自定义对话框，在开发过程中标准对话框使用是最多的，标准对话框一般包括 QMessageBox、QInputDialog、QFileDialog 这几种，为了后续文章的需要我们先来展示QMessageBox的特性，QMessageBox 是 Qt 中用于显示消息框的类，提供了一种简单的方式来向用户显示信息、询问问题或警告。

以下是 `QMessageBox` 的一些主要特点和用法：

- **消息框类型：** `QMessageBox` 支持不同类型的消息框，包括信息框、警告框、错误框、提问框等，以满足不同场景下的需求。
- **按钮配置：** 可以自定义消息框中显示的按钮，如"确定"、“取消”、“是”、"否"等，也可以使用默认的按钮配置。
- **图标设置：** 可以为消息框设置不同的图标，用于表示消息的重要性或类型，如信息、警告、错误等。
- **标准按钮和返回值：** `QMessageBox` 提供了一组标准按钮，用户可以选择，每个按钮都对应一个返回值，便于判断用户的选择。
- **详细信息和帮助：** 可以设置消息框的详细信息和帮助信息，以提供更多上下文或帮助用户理解消息。
- **默认按钮：** 可以指定消息框中的默认按钮，用户可以通过回车键触发默认按钮。

首先我们以消息类型为例，来概述一下Qt中所支持的类型，以下是一些主要的消息框类型：

- **`QMessageBox::Information`（信息框）**
  - 显示一般性的信息，用于向用户传递一般性的消息。
- **`QMessageBox::Warning`（警告框）**
  - 用于向用户传递警告信息，表示可能的问题或需要用户注意的情况。
- **`QMessageBox::Critical`（错误框）**
  - 显示严重错误的消息框，用于向用户传递需要立即处理的错误信息。
- **`QMessageBox::Question`（提问框）**
  - 通常用于询问用户一个问题，用户可以选择"是"、“否”、"取消"等答案。

- **自定义图标类型**
  - 除了上述预定义的几种类型，`QMessageBox` 还支持通过 `QMessageBox::setIcon()` 方法设置自定义图标，以满足特定需求。



该组件的使用同样需要提前导入`#include <QMessageBox>`库，以下是`QMessageBox`类的一些常用方法，说明和概述：



|              **方法**               |                           **描述**                           |
| :---------------------------------: | :----------------------------------------------------------: |
|    `QMessageBox::information()`     |            显示信息框，包含图标、标题和文本信息。            |
|      `QMessageBox::warning()`       |            显示警告框，包含图标、标题和警告文本。            |
|      `QMessageBox::critical()`      |            显示错误框，包含图标、标题和错误文本。            |
|      `QMessageBox::question()`      | 显示提问框，包含图标、标题和问题文本，通常有"是"、"否"按钮。 |
|       `QMessageBox::about()`        |            显示关于框，包含图标、标题和关于文本。            |
|      `QMessageBox::aboutQt()`       |          显示关于Qt框，包含图标、标题和关于Qt文本。          |
|   `QMessageBox::setWindowTitle()`   |                      设置消息框的标题。                      |
|      `QMessageBox::setText()`       |                    设置消息框的主要文本。                    |
| `QMessageBox::setInformativeText()` |                    设置消息框的附加信息。                    |
|      `QMessageBox::setIcon()`       |                    设置消息框的图标类型。                    |
| `QMessageBox::setStandardButtons()` |          设置消息框的标准按钮集合，如确定、取消等。          |
|  `QMessageBox::setDefaultButton()`  |   设置消息框中默认的按钮，按下 `Enter` 键会触发默认按钮。    |
|        `QMessageBox::exec()`        |       执行消息框并等待用户的响应，返回用户选择的按钮。       |
|       `QMessageBox::button()`       |   获取消息框中指定类型的按钮，用于自定义按钮的属性和行为。   |
|     `QMessageBox::addButton()`      |                   向消息框添加自定义按钮。                   |
|    `QMessageBox::removeButton()`    |                   从消息框移除自定义按钮。                   |
|  `QMessageBox::setDefaultButton()`  |          设置默认按钮，按下 Enter 键触发默认按钮。           |

首先我们来实现一个简单的按钮提示框，其核心代码如下所示，当用户点击了`pushButton`按钮时，则会触发`on_pushButton_clicked`按钮事件，此时根据提示弹出不同的对话框信息；

```c
#include "QTLineEdit.h"
#include<qmessagebox.h>

QTLineEdit::QTLineEdit(QWidget *parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);
    connect(ui.pushButton,SIGNAL(clicked()),this,SLOT(HandlePushButtonClick()));
 
}



QTLineEdit::~QTLineEdit()
{

}

void QTLineEdit::HandlePushButtonClick()
{
    QMessageBox msgBox;
    int response;
    msgBox.setWindowTitle(QString::fromLocal8Bit("提示框"));
    msgBox.setText(QString::fromLocal8Bit("你好JacksonWang 这是一个信息框!"));
    msgBox.setIcon(QMessageBox::Information);
    msgBox.setStandardButtons(QMessageBox::Ok | QMessageBox::Cancel);
    msgBox.setDefaultButton(QMessageBox::Ok);
    response = msgBox.exec();
    if (response == QMessageBox::Ok)
    {
        QMessageBox::information(nullptr, QString::fromLocal8Bit("信息"), QString::fromLocal8Bit("用户点击了确认按钮"), QMessageBox::Ok);
    }
    else if (response == QMessageBox::Cancel)
    {
        QMessageBox::warning(nullptr, QString::fromLocal8Bit("警告"), QString::fromLocal8Bit("用户点击了取消按钮"), QMessageBox::Ok);
    }

}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/MessageBox-17060114462893.gif)



接着我们来扩展一个非常实用的案例技巧，在某些时候用户点击右上角的关闭按钮时会自动终止程序的执行，有时我们需要提示用户是否关闭，这时就可以使用`QCloseEvent`组件实现事件通知机制，当用户点击关闭按钮时则会提示是否关闭，如果是则关闭，否则继续执行。



需要注意的是，使用该组件时，需要`QTLineEdit.h`在引入`#include <QCloseEvent>`组件，并在public:中定义`void closeEvent(QCloseEvent *event);`声明其存在，最后要在.cpp中实现该功能，核心代码如下；

- QTLineEdit.h

```c
#pragma once

#include<QtWidgets/QMainWindow>
#include<QCloseEvent>
#include<QMessageBox>
#include "ui_QTLineEdit.h"

class QTLineEdit : public QMainWindow
{
    Q_OBJECT

public:
    QTLineEdit(QWidget* parent = nullptr);
    ~QTLineEdit();

public:
    //添加声明
    void closeEvent(QCloseEvent* event);

private:
    Ui::QTLineEditClass ui;

private slots:
    void HandlePushButtonClick();

};

```

- QTLineEdit.cpp

```c
#include "QTLineEdit.h"


QTLineEdit::QTLineEdit(QWidget *parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);
    connect(ui.pushButton,SIGNAL(clicked()),this,SLOT(HandlePushButtonClick()));
 
}



QTLineEdit::~QTLineEdit()
{

}

// 窗口关闭时询问是否退出
void QTLineEdit::closeEvent(QCloseEvent* event)
{
    QMessageBox::StandardButton response;

    response =  QMessageBox::question(this, QString::fromLocal8Bit("确认"), QString::fromLocal8Bit("确认退出此程序吗?"),
        QMessageBox::Yes | QMessageBox::No | QMessageBox::Cancel | QMessageBox::Cancel);
   
    if (response == QMessageBox::Yes)
    {
        event->accept();
    }
    else
    {
        event->ignore();
    }

}


void QTLineEdit::HandlePushButtonClick()
{
    QMessageBox msgBox;
    int response;
    msgBox.setWindowTitle(QString::fromLocal8Bit("提示框"));
    msgBox.setText(QString::fromLocal8Bit("你好JacksonWang 这是一个信息框!"));
    msgBox.setIcon(QMessageBox::Information);
    msgBox.setStandardButtons(QMessageBox::Ok | QMessageBox::Cancel);
    msgBox.setDefaultButton(QMessageBox::Ok);
    response = msgBox.exec();
    if (response == QMessageBox::Ok)
    {
        QMessageBox::information(nullptr, QString::fromLocal8Bit("信息"), QString::fromLocal8Bit("用户点击了确认按钮"), QMessageBox::Ok);
    }
    else if (response == QMessageBox::Cancel)
    {
        QMessageBox::warning(nullptr, QString::fromLocal8Bit("警告"), QString::fromLocal8Bit("用户点击了取消按钮"), QMessageBox::Ok);
    }

}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/CloseEvent%E4%BA%8B%E4%BB%B6.gif)

# 账号密码登录

为了能灵活的展示lineEdit组件与PushButton的灵活运用，本次将实现一个具有记住密码的用户登录程序，首先在布局中需要两个label标签，两个lineEdit编辑框，以及一个checkBox单选框，和PushButton登录按钮，需要注意登录密码一般时隐藏模式所以需要设置setEchoMode(QLineEdit::Password)为密码输入模式，该程序的整体UI布局如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240123205831692-17060147130284.png)



在实现账号密码验证之前，我们还需要增加密码的加密、读入、和写入功能，此时需要使用QCryptographicHash模块，该模块是Qt中提供的用于计算哈希值的类，属于Qt的核心模块。哈希函数将输入数据映射为固定长度的哈希值，通常用于安全领域、数据完整性验证等方面。QCryptographicHash支持多种哈希算法，如MD5、SHA-1、SHA-224、SHA-256、SHA-384、SHA-512等。




我们分别增加三个函数的定义部分，其中`encrypt`用于接收一个字符串并输出该字符串的`Hash`值，`ReadString`函数用于在注册表内读入账号密码信息，`WriteString`则用于写出账号密码信息到注册表内，其核心代码如下所示；

- QTLineEdit.h

```c
#pragma once

#include<QtWidgets/QMainWindow>
#include<QCloseEvent>
#include<QMessageBox>
#include <QByteArray>
#include <QSettings>
#include <QCryptographicHash>
#include "ui_QTLineEdit.h"


class QTLineEdit : public QMainWindow
{
    Q_OBJECT

public:
    QTLineEdit(QWidget* parent = nullptr);
    ~QTLineEdit();

public:

    void closeEvent(QCloseEvent* event);

    //对密码进行 MD5算法的哈希加密
    QString encrypt(const QString& str);

    //查 用户名、密码、记住账号状态 （注册表）
    void ReadString();


    // 存当前用户名和密码 （注册表）
    void WriteString();

private:
    Ui::QTLineEditClass ui;

private slots:
    void HandlePushButtonClick();

};

```

- QTLineEdit.cpp

```c
#include "QTLineEdit.h"


QString m_user = QString::fromLocal8Bit("jacksonWang");
QString m_password = QString::fromLocal8Bit("12345");
int m_tryCount = 0;
 

QTLineEdit::QTLineEdit(QWidget* parent)
    : QMainWindow(parent)
{
    ui.setupUi(this);
    connect(ui.pushButton, SIGNAL(clicked()), this, SLOT(HandlePushButtonClick()));
    setWindowTitle("JacksonWang");

    // 设置主窗体不可调节
    setFixedSize(width(), height());

    //查注册的账号密码，默认账号JacksonWang 密码123456
    ui.lineEdit_password->setEchoMode(QLineEdit::Password);

    ReadString();
}




QTLineEdit::~QTLineEdit()
{

}

// 窗口关闭时询问是否退出
void QTLineEdit::closeEvent(QCloseEvent* event)
{
    QMessageBox::StandardButton response;

    response =  QMessageBox::question(this, QString::fromLocal8Bit("确认"), QString::fromLocal8Bit("确认退出此程序吗?"),
        QMessageBox::Yes | QMessageBox::No | QMessageBox::Cancel | QMessageBox::Cancel);
   
    if (response == QMessageBox::Yes)
    {
        event->accept();
    }
    else
    {
        event->ignore();
    }

}

QString QTLineEdit::encrypt(const QString& str)
{
    //QString => QByteArray
    QByteArray qByteArray;
    QByteArray qByteResult;
    QString result;
    qByteArray.append(str);

    //构建哈希MD5算法对象
    QCryptographicHash hashMd5AlgorithmObj(QCryptographicHash::Algorithm::Md5);
   
    //添加要进行加密的明文,并进行加密
    hashMd5AlgorithmObj.addData(qByteArray);
    qByteResult = hashMd5AlgorithmObj.result();
    result = qByteResult.toHex(); //转为16进制字符串
    return result;
}

void QTLineEdit::ReadString()
{

    // 创建key-value
    QSettings settingsObj("UserDataBase", "onley");
    
    //查注册表HKEY_CURRENT_USER/Software/UserDataBase/onley 存的值
    QString defaultPassword = encrypt("123456");
    bool saved = settingsObj.value("saved", false).toBool();
    m_user = settingsObj.value("Username", "JacksonWang").toString();
    m_password = settingsObj.value("PSWD", defaultPassword).toString();
    
    //更新UI复选框
    if (saved)
    {
        ui.lineEdit_username->setText(m_user);
    }
    ui.checkBox->setChecked(saved);

}

void QTLineEdit::WriteString()
{
    //注册表这个KEY: HKEY_CURRENT_USER/Software/UserDataBase/onley,写入如下Value
    QSettings qSettingObj("UserDataBase","onley");
    qSettingObj.setValue("Username", m_user);
    qSettingObj.setValue("PSWD", m_password);
    qSettingObj.setValue("saved", ui.checkBox->isChecked());


}


void QTLineEdit::HandlePushButtonClick()
{
    QString qSUsername;
    QString qSPassword;
    QString encryptPassword;
    qSUsername = ui.lineEdit_username->text().trimmed();
    qSPassword = ui.lineEdit_password->text().trimmed();
    encryptPassword = encrypt(qSPassword);

    //登录成功
    if ((qSUsername == m_user) && (encryptPassword == m_password))
    {
        WriteString();
        QMessageBox::information(this, QString::fromLocal8Bit("成功"), QString::fromLocal8Bit("已登录"));

    }
    else
    {
        //密码输出错误，错3次以上直接退出程序。
        m_tryCount++;
        if (m_tryCount > 3)
        {
            QMessageBox::critical(this, QString::fromLocal8Bit("错误"), QString::fromLocal8Bit("输入错误次数太多，强行退出"));
            this->close();

        }
        else
        {
            QMessageBox::warning(this, QString::fromLocal8Bit("错误提示"), QString::fromLocal8Bit("用户名或密码错误"));
        }

    }


}
```

再对照代码，看下主验证程序的流程，在主程序中我们调用`ReadString`读入账号密码到内存，当按钮被点击后触发`HandlePushButtonClick()`子程序，并实现对账号密码的登录验证功能





程序运行后读者可以输入默认的账号`jasksonWang`及密码`123456`默认当登录成功后则提示已登录弹窗，如果用户勾选了记住密码，则下次会自动输入账号密码，如下图；如果用户勾选了记住账号，则下次会自动输入账号，如下图；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%B3%A8%E5%86%8C%E8%A1%A8%E6%9D%A5%E5%AD%98%E7%94%A8%E6%88%B7%E4%BF%A1%E6%81%AF%E5%88%A9%E4%BA%8E%E4%B8%8B%E6%AC%A1%E7%9B%B4%E6%8E%A5%E6%9F%A5-17060152622405.gif)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240123210904527-17060153453876.png)

