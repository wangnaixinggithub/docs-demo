# C++ Qt开发：运用QJSON模块解析数据

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QJson`组件的实现对JSON文本的灵活解析功能。

JSON（JavaScript Object Notation）是一种轻量级的数据交换格式，它易于人阅读和编写，也易于机器解析和生成。该格式是基于JavaScript语言的一个子集，但它是一种独立于语言的数据格式，因此可以在许多不同的编程语言中使用。

该数据是以键值对的形式组织的，其中键是字符串，值可以是字符串、数字、布尔值、数组、对象（即嵌套的键值对集合）或null，在Qt中默认提供了`QJson`系列类库，使用该类库可以很方便的解析和处理JSON文档。

#### 1.1 解析单一键值对

实现解析根中的单一键值对，例如解析`config.json`配置文件中的`blog,enable,status`等这些独立的字段值，在解析之前需要先通过`QJsonDocument::fromJson`将内存中的字符串格式化为`QJsonDocument`类型，当有着该类型之后，则我们可以使用`*.object()`将其转换为对应的`QJsonObject`对象，在对象中我们可以调用各种方法对内存中的`JSON`数据进行处理。

以下是关于 `QJsonDocument` 类的一些常用方法的说明：

| 方法                                                         | 说明                                               |
| ------------------------------------------------------------ | -------------------------------------------------- |
| `QJsonDocument()`                                            | 构造函数，创建一个空的 JSON 文档。                 |
| `QJsonDocument(const QJsonObject &object)`                   | 通过给定的 JSON 对象构造 JSON 文档。               |
| `QJsonDocument(const QJsonArray &array)`                     | 通过给定的 JSON 数组构造 JSON 文档。               |
| `QJsonDocument(const QJsonValue &value)`                     | 通过给定的 JSON 值构造 JSON 文档。                 |
| `QJsonDocument(const QJsonDocument &other)`                  | 复制构造函数。                                     |
| `QJsonDocument &operator=(const QJsonDocument &other)`       | 赋值运算符。                                       |
| `bool isNull() const`                                        | 检查文档是否为空。                                 |
| `bool isEmpty() const`                                       | 检查文档是否为空，包括 JSON 数组或对象为空的情况。 |
| `QJsonObject object() const`                                 | 返回文档中的 JSON 对象。                           |
| `QJsonArray array() const`                                   | 返回文档中的 JSON 数组。                           |
| `QJsonValue value() const`                                   | 返回文档中的 JSON 值。                             |
| `bool isArray() const`                                       | 检查文档是否包含 JSON 数组。                       |
| `bool isObject() const`                                      | 检查文档是否包含 JSON 对象。                       |
| `QByteArray toBinaryData() const`                            | 将文档转换为二进制数据。                           |
| `bool fromBinaryData(const QByteArray &data)`                | 从二进制数据恢复文档。                             |
| `QString toJson(QJsonDocument::JsonFormat format = QJsonDocument::Compact) const` | 返回 JSON 字符串表示，可以选择格式化的方式。       |
| `static QJsonDocument fromJson(const QString &json, QJsonParseError *error = nullptr)` | 从 JSON 字符串创建文档。                           |

显示详细信息

以下是关于 `QJsonObject` 类的一些常用方法的说明：

| 方法                                                       | 说明                                     |
| ---------------------------------------------------------- | ---------------------------------------- |
| `QJsonObject()`                                            | 构造函数，创建一个空的 JSON 对象。       |
| `QJsonObject(const QJsonObject &other)`                    | 复制构造函数。                           |
| `QJsonObject &operator=(const QJsonObject &other)`         | 赋值运算符。                             |
| `bool isEmpty() const`                                     | 检查对象是否为空。                       |
| `int size() const`                                         | 返回对象中键值对的数量。                 |
| `bool contains(const QString &key) const`                  | 检查对象中是否包含指定的键。             |
| `QStringList keys() const`                                 | 返回对象中所有键的列表。                 |
| `QJsonValue value(const QString &key) const`               | 返回与指定键关联的值。                   |
| `void insert(const QString &key, const QJsonValue &value)` | 向对象中插入键值对。                     |
| `QJsonObject &unite(const QJsonObject &other)`             | 将另一个对象的键值对合并到当前对象。     |
| `void remove(const QString &key)`                          | 从对象中移除指定键及其关联的值。         |
| `QJsonValue take(const QString &key)`                      | 移除并返回与指定键关联的值。             |
| `void clear()`                                             | 移除对象中的所有键值对，使其变为空对象。 |
| `QJsonDocument toDocument() const`                         | 将对象转换为 JSON 文档。                 |

显示详细信息

当需要读取参数时只需要使用`find()`方法查询特定字段中的key值即可，按钮`on_pushButton_clicked`被点击后执行如下流程；

```c
void MainWindow::on_pushButton_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 解析blog字段
    QString blog = root_object.find("blog").value().toString();
    //std::cout << "字段对应的值 = > "<< blog.toStdString() << std::endl;
    ui->lineEdit_blog->setText(blog);

    // 解析enable字段
    bool enable = root_object.find("enable").value().toBool();
    //std::cout << "是否开启状态: " << enable << std::endl;
    ui->lineEdit_enable->setText(QString::number(enable));

    // 解析status字段
    int status = root_object.find("status").value().toInt();
    //std::cout << "状态数值: " << status << std::endl;
    ui->lineEdit_status->setText(QString::number(status));
}
```

运行后点击读取数据按钮，输出效果如下；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/1e0cb9d8f32c90c398802243b6e7a65f%5B1%5D.png)



#### 1.2 解析单数组键值

实现解析简单的单一对象与单一数组结构，如配置文件中的`GetDict`与`GetList`既是我们需要解析的内容，在解析时我们需要通过`toVariantMap`将字符串转换为对应的Map容器，当数据被转换后则就可以通过`Map[]`的方式很容易的将其提取出来。

```c
void MainWindow::on_pushButton_2_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 解析单一对象
    QJsonObject get_dict_ptr = root_object.find("GetDict").value().toObject();
    QVariantMap map = get_dict_ptr.toVariantMap();

    if(map.contains("address") && map.contains("username") && map.contains("password") && map.contains("update"))
    {
        QString address = map["address"].toString();
        QString username = map["username"].toString();
        QString password = map["password"].toString();
        QString update = map["update"].toString();

        std::cout
               << " 地址: " << address.toStdString()
               << " 用户名: " << username.toStdString()
               << " 密码: " << password.toStdString()
               << " 更新日期: " << update.toStdString()
               << std::endl;

        ui->listWidget->addItem(address);
        ui->listWidget->addItem(username);
        ui->listWidget->addItem(password);
        ui->listWidget->addItem(update);
    }

    // 解析单一数组
    QJsonArray get_list_ptr = root_object.find("GetList").value().toArray();

    for(int index=0; index < get_list_ptr.count(); index++)
    {
        int ref_value = get_list_ptr.at(index).toInt();
        std::cout << "输出数组元素: " << ref_value << std::endl;

        ui->listWidget_2->addItem(QString::number(ref_value));
    }
}
```

运行后点击解析数据按钮，输出效果如下；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/5825d2f9643a2343dc05acf3d9dc7e53%5B1%5D.png)

#### 1.3 解析多数组键值

实现解析字典嵌套字典或字典嵌套数组的结构，如配置文件中的`ObjectInArrayJson`则是一个字典中嵌套了另外两个字典而每个字典中的值又是一个`Value`数组，而与之相对应的`ArrayJson`则是在列表中嵌套了另外一个列表，这两中结构的使用读者可参照如下案例；

首先我们来看`ObjectInArrayJson`是如何被解析的，我们分别准备两个`ComboBox`选择框，当读者点击按钮时我们通过`toVariantMap`将字典转换为一个MAP容器，并通过`toJsonArray`转换内部的列表到`JsonArray`容器内，其初始化部分如下所示；

```c
void MainWindow::on_pushButton_3_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 找到Object对象
    QJsonObject one_object_json = root_object.find("ObjectInArrayJson").value().toObject();

    // 转为MAP映射
    QVariantMap map = one_object_json.toVariantMap();

    // 寻找One键
    QJsonArray array_one = map["One"].toJsonArray();

    for(int index=0; index < array_one.count(); index++)
    {
        QString value = array_one.at(index).toString();

        std::cout << "One => "<< value.toStdString() << std::endl;
        ui->comboBox->addItem(value);
    }

    // 寻找Two键
    QJsonArray array_two = map["Two"].toJsonArray();

    for(int index=0; index < array_two.count(); index++)
    {
        QString value = array_two.at(index).toString();

        std::cout << "Two => "<< value.toStdString() << std::endl;
        ui->comboBox_2->addItem(value);
    }
}
```

同理，要实现解析数组中的数组也可以通过该方式实现，如配置文件中的`ArrayJson`既是我们需要解析的内容，首先我们通过`isArray`判断该节点是否为数组，如果是则通过`toArray().at`方法以此得到不同下标元素参数，并依次循环即可，其代码如下所示；

```c
void MainWindow::on_pushButton_4_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 获取MyJson数组
    QJsonValue array_value = root_object.value("ArrayJson");

    // 验证节点是否为数组
    if(array_value.isArray())
    {
        // 得到数组个数
        int array_count = array_value.toArray().count();

        // 循环数组个数
        for(int index=0;index <= array_count;index++)
        {
            QJsonValue parset = array_value.toArray().at((index));
            if(parset.isArray())
            {
                QString address = parset.toArray().at(0).toString();
                QString username = parset.toArray().at(1).toString();
                QString userport = parset.toArray().at(2).toString();

                std::cout
                        << "地址: " << address.toStdString()
                        << "用户名: " << username.toStdString()
                        << "端口号: " << userport.toStdString()
                << std::endl;

                ui->comboBox_3->addItem(address);
                ui->comboBox_4->addItem(username);
                ui->comboBox_5->addItem(userport);
            }
        }
    }
}
```

运行后点击两个初始化按钮则可以将字典或列表中的数据依次解析到不同的`ComBobox`列表框内，输出效果如下；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/e8657c9b21f9db5606e5e10b2b82c065%5B1%5D.png)

#### 1.4 解析多字典键值

实现解析字典中嵌套多个参数或字典中嵌套参数中包含列表的数据集，如配置文件中的`ObjectJson`则是字典中存在多个键值对，而`ObjectArrayJson`则更进一步在多键值对中增加了列表的支持，解析此类内容只需要依次逐级拆分即可，我们来看下如何实现对这些键值的灵活提取；

首先我们来实现对`ObjectJson`的参数解析功能，读者可自行对比与之前`1.3`中的区别，可以发现这两者的差别其实不大，解析`ObjectJson`完整代码如下所示；

```c
void MainWindow::on_pushButton_5_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 获取MyJson数组
    QJsonValue object_value = root_object.value("ObjectJson");

    // 验证是否为数组
    if(object_value.isArray())
    {
        // 获取对象个数
        int object_count = object_value.toArray().count();

        // 循环个数
        for(int index=0;index <= object_count;index++)
        {
            QJsonObject obj = object_value.toArray().at(index).toObject();

            // 验证数组不为空
            if(!obj.isEmpty())
            {
                QString address = obj.value("address").toString();
                QString username = obj.value("username").toString();

                std::cout << "地址: " << address.toStdString() << " 用户: " << username.toStdString() << std::endl;
                ui->comboBox_6->addItem(address);
                ui->comboBox_7->addItem(username);
            }
        }
    }
}
```

接着我们来实现一个更为复杂的需求，解析多字典中嵌套的数组，如配置文件中的`ObjectArrayJson`则是我们需要解析的内容，在之前解析字典部分保持与上述案例一致，唯一不同的是我们需要通过`value("ulist").toArray()`获取到对应字典中的数组，并通过循环的方式输出。

如下案例中，当读者点击初始化按钮时我们首先让字典中的数据填充之`ComboBox`列表框中，接着当读者点击第一个列表框时我们让其过滤出特定的内容并赋值到第二个列表框中，以此实现联动效果，首先初始化部分如下所示；

```c
void MainWindow::on_pushButton_6_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 获取MyJson数组
    QJsonValue object_value = root_object.value("ObjectArrayJson");

    // 验证是否为数组
    if(object_value.isArray())
    {
        // 获取对象个数
        int object_count = object_value.toArray().count();

        // 循环个数
        for(int index=0;index <= object_count;index++)
        {
            QJsonObject obj = object_value.toArray().at(index).toObject();

            // 验证数组不为空
            if(!obj.isEmpty())
            {
                QString uname = obj.value("uname").toString();
                std::cout << "用户名: " << uname.toStdString() <<  std::endl;

                ui->comboBox_8->addItem(uname);

                // 解析该用户的数组
                int array_count = obj.value("ulist").toArray().count();

                std::cout << "数组个数: "<< array_count << std::endl;

                for(int index=0;index < array_count;index++)
                {
                    QJsonValue parset = obj.value("ulist").toArray().at(index);

                    int val = parset.toInt();

                    std::cout << "Value = > "<< val << std::endl;
                    ui->comboBox_9->addItem(QString::number(val));
                }
            }
        }
    }
}
```

当第一个选择框被选中时我们触发`currentIndexChanged`信号，在其中只需要判断`uname.compare(arg1)`是否相等如果相等则`addItem`追加到新的列表内，运行效果如下所示，详细实现可参考附件。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/eba14eefee9a1813dde7e0bcbe555b0c%5B1%5D.png)

#### 1.5 解析多字典嵌套

实现解析多个字典嵌套或多个列表嵌套的结构，如配置文件中的`NestingObjectJson`则是字典中嵌套字典，而`ArrayNestingArrayJson`则是列表中嵌套列表，两种的解析方式基本一致。

我们首先来实现第一种格式的解析，当按钮被点击后，我们首先查询`uuid`字段并赋值到`ComBobox`列表中，实现代码如下所示；

```c
void MainWindow::on_pushButton_7_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 获取NestingObjectJson数组
    QJsonValue array_value = root_object.value("NestingObjectJson");

    // 验证节点是否为数组
    if(array_value.isArray())
    {
        // 得到内部对象个数
        int count = array_value.toArray().count();
        std::cout << "对象个数: " << count << std::endl;

        for(int index=0; index < count; index++)
        {
            // 得到数组中的index下标中的对象
            QJsonObject array_object = array_value.toArray().at(index).toObject();

            QString uuid = array_object.value("uuid").toString();

            // 追加数据
            std::cout << uuid.toStdString() << std::endl;
            ui->comboBox_10->addItem(uuid);

            // 开始解析basic中的数据
            QJsonObject basic = array_object.value("basic").toObject();

            QString lat = basic.value("lat").toString();
            QString lon = basic.value("lon").toString();

            std::cout << "解析basic中的lat字段: " << lat.toStdString() << std::endl;
            std::cout << "解析basic中的lon字段: " << lon.toStdString()<< std::endl;

            // 解析单独字段
            QString status = array_object.value("status").toString();
            std::cout << "解析字段状态: " << status.toStdString() << std::endl;
        }
    }
}
```

当`ComBobox`组件中的`currentIndexChanged`信号被触发时，则直接执行对`LineEdit`编辑框的赋值操作，其代码如下所示；

```c
void MainWindow::on_comboBox_10_currentIndexChanged(const QString &arg1)
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        QMessageBox::information(nullptr,"提示","JSON格式错误",QMessageBox::Ok);
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 获取NestingObjectJson数组
    QJsonValue array_value = root_object.value("NestingObjectJson");

    // 验证节点是否为数组
    if(array_value.isArray())
    {
        // 得到内部对象个数
        int count = array_value.toArray().count();
        std::cout << "对象个数: " << count << std::endl;

        for(int index=0; index < count; index++)
        {
            // 得到数组中的index下标中的对象
            QJsonObject array_object = array_value.toArray().at(index).toObject();

            QString uuid = array_object.value("uuid").toString();

            // 对比是否相等
            if(uuid.compare(arg1) == 0)
            {
                // 开始解析basic中的数据
                QJsonObject basic = array_object.value("basic").toObject();

                QString lat = basic.value("lat").toString();
                QString lon = basic.value("lon").toString();

                std::cout << "解析basic中的lat字段: " << lat.toStdString() << std::endl;
                std::cout << "解析basic中的lon字段: " << lon.toStdString()<< std::endl;

                ui->lineEdit->setText(lat);
                ui->lineEdit_2->setText(lon);

                // 解析单独字段
                QString status = array_object.value("status").toString();
                std::cout << "解析字段状态: " << status.toStdString() << std::endl;
            }
        }
    }
}
```

同理，我们也可以实现字典中嵌套列表结构，如配置文件中的`ArrayNestingArrayJson`既我们需要解析的内容，解析实现方法与上述代码保持一致，首先当按钮被点击后我们直接对`ComBobox`组件进行初始化，代码如下所示；

```c
void MainWindow::on_pushButton_8_clicked()
{
    // 字符串格式化为JSON
    QJsonParseError err_rpt;
    QJsonDocument  root_document = QJsonDocument::fromJson(config.toUtf8(), &err_rpt);
    if(err_rpt.error != QJsonParseError::NoError)
    {
        std::cout << "json 格式错误" << std::endl;
    }

    // 获取到Json字符串的根节点
    QJsonObject root_object = root_document.object();

    // 获取NestingObjectJson数组
    QJsonValue array_value = root_object.value("ArrayNestingArrayJson");

    // 验证节点是否为数组
    if(array_value.isArray())
    {
        // 得到数组中的0号下标中的对象
        QJsonObject array_object = array_value.toArray().at(0).toObject();

        // 解析手机号字符串
        QString telephone = array_object.value("telephone").toString();
        std::cout << "手机号: " << telephone.toStdString() << std::endl;

        ui->comboBox_11->addItem(telephone);

        // 定位外层数组
        QJsonArray root_array = array_object.find("path").value().toArray();
        std::cout << "外层循环计数: " << root_array.count() << std::endl;

        for(int index=0; index < root_array.count(); index++)
        {
            // 定位内层数组
            QJsonArray sub_array = root_array.at(index).toArray();
            std::cout << "内层循环计数: "<< sub_array.count() << std::endl;

            for(int sub_count=0; sub_count < sub_array.count(); sub_count++)
            {
                // 每次取出最里层数组元素
                float var = sub_array.toVariantList().at(sub_count).toFloat();

                std::cout << "输出元素: " << var << std::endl;
                // std::cout << sub_array.toVariantList().at(0).toFloat() << std::endl;

                ui->listWidget_3->addItem(QString::number(var));
            }
        }
    }
}
```

运行效果如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/0359ab613878842101f7cb1705971e34%5B1%5D.png)