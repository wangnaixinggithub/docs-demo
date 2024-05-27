# C++ Qt开发：使用关联容器类

当我们谈论编程中的[数据结构](https://so.csdn.net/so/search?q=数据结构&spm=1001.2101.3001.7020)时，顺序容器是不可忽视的一个重要概念。顺序容器是一种能够按照元素添加的顺序来存储和检索数据的数据结构。它们提供了简单而直观的方式来组织和管理数据，为程序员提供了灵活性和性能的平衡。

Qt 中提供了丰富的容器类，用于方便地管理和操作数据。这些容器类涵盖了各种不同的用途，从简单的动态数组到复杂的映射和集合。本章我们将主要学习关联容器，主要包括 `QMap` ，`QSet`和 `QHash`，它们提供了键值对存储和检索的功能，允许通过键来快速查找值。

# QMap

`QMap` 是 Qt 中的有序关联容器，用于存储键值对，并按键的升序进行排序。以下是关于 `QMap` 的概述：

## 特点和用途

- **有序性：** `QMap` 中的元素是有序的，按照键的升序进行排列。
- **唯一键：** 每个键在 `QMap` 中是唯一的，不允许重复键。
- **键值对存储：** 存储键值对，每个键关联一个值。
- **性能：** 插入和查找操作的平均复杂度是 O(log n)，适用于需要按键排序并进行频繁查找的场景。

## 函数和功能

以下是关于 `QMap` 常用函数及其功能的总结：

|                  **函数**                   |                       **功能**                       |
| :-----------------------------------------: | :--------------------------------------------------: |
|   insert(const Key &key, const T &value)    |               向 `QMap` 中插入键值对。               |
| insertMulti(const Key &key, const T &value) |         向 `QMap` 中插入允许相同键的多个值。         |
|           remove(const Key &key)            |                  移除指定键的元素。                  |
|         value(const Key &key) const         |                   返回指定键的值。                   |
|       contains(const Key &key) const        |                 判断是否包含指定键。                 |
|               isEmpty() const               |                判断 `QMap` 是否为空。                |
|                size() const                 |             返回 `QMap` 中键值对的数量。             |
|                   clear()                   |             返回 `QMap` 中键值对的数量。             |
|                keys() const                 |             返回 `QMap` 中所有键的列表。             |
|               values() const                |             返回 `QMap` 中所有值的列表。             |
|                   begin()                   |          返回指向 `QMap` 开始位置的迭代器。          |
|                    end()                    |          返回指向 `QMap` 结束位置的迭代器。          |
|             constBegin() const              |        返回指向 `QMap` 开始位置的常量迭代器。        |
|              constEnd() const               |        返回指向 `QMap` 结束位置的常量迭代器。        |
|         find(const Key &key) const          |          返回指向 `QMap` 中指定键的迭代器。          |
|      lowerBound(const Key &key) const       | 返回指向 `QMap` 中不小于指定键的第一个元素的迭代器。 |
|      upperBound(const Key &key) const       |  返回指向 `QMap` 中大于指定键的第一个元素的迭代器。  |
|         count(const Key &key) const         |                  返回指定键的数量。                  |
|              toStdMap() const               |            将 `QMap` 转换为 `std::map`。             |

这些函数提供了对 `QMap` 中键值对的插入、删除、查找和遍历等操作。根据需求选择适当的函数以满足操作要求。

##  应用案例

正如如下代码所示，我们提供了`QMap<QString,QString>`字典类型的关联数组，该数组中一个键映射对应一个值，QMap容器是按照顺序存储的，如果项目中不在意顺序可以使用`QHash`容器，使用`QHash`效率更高些。

```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QtGlobal>
#include <QMap>
#include <QMapIterator>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QMap<QString,QString> map;


    map["1001"] = "zhangsan";
    map["1002"] = "lisi";
    map.insert("1003","wangwu");
    map.insert("1004","zhaoliu");
    // map.remove("1002");

    // key 找 value
    std::cout << map["1002"].toStdString().data() << std::endl;
    std::cout << map.value("1003").toStdString().data() << std::endl;
    // value 找 key
    std::cout << map.key("zhangsan").toStdString().data() << std::endl;


    // 使用STL语法 只读迭代器 遍历键值对
    for(auto itFn=map.constBegin();itFn != map.constEnd(); ++itFn)
    {
        std::cout << itFn.key().toStdString().data() << " : ";
        std::cout << itFn.value().toStdString().data() << std::endl;
    }


    //根据KEY 查 指向这个键值对的迭代器指针
    QMap<QString,QString>::iterator itFn = NULL;
    itFn = map.find("1003");

    //找到了，就修改键值对值
    if(itFn !=map.end())
    {
        itFn.value()= "wangwu shi wo!";
    }



    //QT 的foreach语法 和JavaScript很像.遍历每一个KEY
    foreach(const QString &item,map.keys())
    {
        std::cout << map.value(item).toStdString().data() << std::endl;
    }



    return a.exec();
}

```

上述代码是如何使用`QMap`容器，其实还有一个`QMultiMap`容器，该容器其实是`QMap`的一个子集，用于处理多值映射的类，也就是说传统`QMap`只能是一对一的关系，而`QMultiMap`则可以实现一个`Key`对应多个`Value`或者是反过来亦可，实现一对多的关系。

如果总结起来可以发现两者的异同点；

### QMap

- **唯一键：** `QMap` 中每个键都是唯一的，不允许重复键。
- **键排序：** `QMap` 中的元素是按键的升序排列的。
- **使用场景：** 适用于需要键值对有序且键唯一的场景。

### QMultiMap

- **允许重复键：** `QMultiMap` 中可以包含重复的键，即多个键可以映射到相同的值。
- **键排序：** `QMultiMap` 中的元素是按键的升序排列的。
- **使用场景：** 适用于允许键重复，并且需要键值对有序的场景。

相同点

- **键值对：** 都是用于存储键值对的容器。
- **有序性：** 元素在容器中是有序的，按键的升序排列。

不同点

- **键唯一性：** `QMap` 中每个键都是唯一的，而 `QMultiMap` 允许重复的键。
- **使用场景：** `QMap` 适用于需要键唯一的情况，而 `QMultiMap` 适用于允许键重复的情况。

如下所示，展示了如何使用`QMultiMap`实现一对多的映射关系；

```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QList>
#include <QMultiMap>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QMultiMap<QString,QString> mapA;
    QMultiMap<QString,QString> mapB;
    QMultiMap<QString,QString> mapC;
    QMultiMap<QString,QString> mapD; // 一对多的表

    mapA.insert("key1","1000");
    mapA.insert("key1","2000"); 



    //查所有key1键值对
    QList<QString> allValues;

    allValues = mapA.values("key1");
    for(int x=0;x<allValues.size();++x)
    {
        std::cout << allValues.at(x).toStdString().data() << std::endl;
    }

    mapB.insert("key2","3000");
    mapB.insert("key2","4000");
    mapC.insert("key2","5000");

    // 两个key相同可相加后输出
    mapD = mapB + mapC;

    //查所有key2简直对
    allValues = mapD.values("key2");
    for(int x=0;x<allValues.size();x++)
    {
        std::cout << allValues.at(x).toStdString().data() << std::endl;
    }

    return a.exec();
}

```

# QHash

`QHash` 是一个无序的关联容器，它存储键值对，但与 `QMap` 不同，`QHash` 不会对键进行排序。

## 特点和用途

- **键值对存储：** `QHash` 中的元素以键值对的形式存储，但与 `QMap` 不同，`QHash` 中的元素是无序的。
- **无序性：** `QHash` 中的元素是无序的，没有特定的排列顺序。
- **唯一键：** 每个键在 `QHash` 中是唯一的，不允许重复键。
- **性能：** 插入和查找操作的平均复杂度是 O(1)，适用于需要快速插入和查找的场景。

## 函数和功能

以下是关于 `QHash` 常用函数及其功能的总结：

|                  **函数**                   |                         **功能**                          |
| :-----------------------------------------: | :-------------------------------------------------------: |
|   insert(const Key &key, const T &value)    |                 向 `QHash` 中插入键值对。                 |
| insertMulti(const Key &key, const T &value) |           向 `QHash` 中插入允许相同键的多个值。           |
|           remove(const Key &key)            |                    移除指定键的元素。                     |
|         value(const Key &key) const         |                     返回指定键的值。                      |
|       contains(const Key &key) const        |                   判断是否包含指定键。                    |
|               isEmpty() const               |                  判断 `QHash` 是否为空。                  |
|                size() const                 |               返回 `QHash` 中键值对的数量。               |
|                   clear()                   |                清空 `QHash` 中的所有元素。                |
|                keys() const                 |               返回 `QHash` 中所有键的列表。               |
|               values() const                |               返回 `QHash` 中所有值的列表。               |
|                   begin()                   |            返回指向 `QHash` 开始位置的迭代器。            |
|                    end()                    |            返回指向 `QHash` 结束位置的迭代器。            |
|             constBegin() const              |          返回指向 `QHash` 开始位置的常量迭代器。          |
|              constEnd() const               |          返回指向 `QHash` 结束位置的常量迭代器。          |
|         find(const Key &key) const          |            返回指向 `QHash` 中指定键的迭代器。            |
|         count(const Key &key) const         |                    返回指定键的数量。                     |
|          unite(const QHash &other)          | 合并两个 `QHash`，将 `other` 中的元素合并到当前 `QHash`。 |
|        intersect(const QHash &other)        |       保留两个 `QHash` 中共有的元素，删除其他元素。       |
|        subtract(const QHash &other)         |       从当前 `QHash` 中移除与 `other` 共有的元素。        |
|             `toStdHash()` const             |         将 `QHash` 转换为 `std::unordered_map`。          |

这些函数提供了对 `QHash` 中键值对的插入、删除、查找和遍历等操作。根据需求选择适当的函数以满足操作要求。

## 应用案例

`QHash`与`QMap`其实是一样的，如果不需要对键值对进行排序那么使用`QHash`将会得到更高的效率，正是因为`Hash`的无序，才让其具备了更加高效的处理能力。



```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QHash>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QHash<QString, QString> hash; //一对一，KEY乱序

    hash["1001"] = "zhangsan";
    hash["1002"] = "lisi";
    hash.insert("1003", "wangwu");
    hash.insert("1004", "zhaoliu");
    // hash.remove("1002");

   // key 查 value
    std::cout << hash["1002"].toStdString().data() << std::endl;
    std::cout << hash.value("1003").toStdString().data() << std::endl;
    std::cout << hash.key("admin").toStdString().data() << std::endl;

    // STL 只读迭代器遍历
    for (auto itFn = hash.constBegin(); itFn != hash.constEnd(); ++itFn)
    {
        std::cout << itFn.key().toStdString().data() << " : ";
        std::cout << itFn.value().toStdString().data() << std::endl;
    }

    //查键值对在不在，在就改值
    QHash<QString, QString>::iterator itFn;
    itFn = hash.find("1003");
    if (itFn != hash.end())
    {
        itFn.value() = "wangwu shiwo ";
    }



    //遍历所有KEY foreach QT 自带
    foreach (const QString &key, hash.keys())
    {
        //并输出KEY 对应的值
        std::cout << hash.value(key).toStdString().data() << std::endl;
    }



    return a.exec();
}

```

这里需要说明一点，与`QMap`一样，`QHash`也能够使用`QMultiHash`其操作上与`QMultiMap`保持一致，此处读者可自行尝试。



# QSet

`Set` 是 Qt 中的无序关联容器，类似于 C++ 标准库的 `std::unordered_set`。它主要用于存储唯一值，而不关心元素的顺序。以下是关于 `QSet` 的概述：

## 特点和用途

- **无序性**： `QSet` 中的元素是无序的，没有特定的排列顺序。
- **唯一值：** 每个值在 `QSet` 中是唯一的，不允许重复值。
- **性能：** 适用于需要快速查找和检索唯一值的场景，性能比有序容器（如 `QMap`）更高。
- **底层实现：** 使用哈希表实现，因此插入和查找操作的平均复杂度是 O(1)。

## 函数和功能

以下是关于 `QSet` 常用函数及其功能的总结：

|            **函数**            |                        **功能**                         |
| :----------------------------: | :-----------------------------------------------------: |
|     insert(const T &value)     |                 向 `QSet` 中插入元素。                  |
| contains(const T &value) const |                 判断是否包含指定元素。                  |
|     remove(const T &value)     |                     移除指定元素。                      |
|        isEmpty() const         |                 判断 `QSet` 是否为空。                  |
|          size() const          |               返回 `QSet` 中元素的数量。                |
|            clear()             |               清空 `QSet` 中的所有元素。                |
|    unite(const QSet &other)    | 合并两个 `QSet`，将 `other` 中的元素合并到当前 `QSet`。 |
|  intersect(const QSet &other)  |      保留两个 `QSet` 中共有的元素，删除其他元素。       |
|  subtract(const QSet &other)   |       从当前 `QSet` 中移除与 `other` 共有的元素。       |
|            begin()             |           返回指向 `QSet` 开始位置的迭代器。            |
|             end()              |           返回指向 `QSet` 结束位置的迭代器。            |
|       constBegin() const       |         返回指向 `QSet` 开始位置的常量迭代器。          |
|        constEnd() const        |         返回指向 `QSet` 结束位置的常量迭代器。          |

这些函数提供了对 `QSet` 中元素的插入、删除、查找和遍历等操作。`QSet` 是一个无序容器，用于存储唯一的元素。根据需求选择适当的函数以满足操作要求。

## 应用案例

QSet 集合容器，是基于散列表（哈希表）的集合模板，存储顺序同样不定，查找速度最快，其内部使用`QHash`实现。

```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QSet>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QSet<QString> set;

    set << "dog" << "cat" << "tiger";
    set.insert("dog");

    // 测试某值是否包含于集合
    if(set.contains("cat"))
    {
        std::cout << "include" << std::endl;
    }
    
    //自动去重
    for(auto itFn = set.constBegin();itFn != set.constEnd();++itFn)
    {
        std::cout << itFn->toStdString().data() << std::endl;

    }

    return a.exec();
}

```

# 嵌套案例总结

## QList与QMap组合

代码通过结合使用 `QList` 和 `QMap` 实现了数据的嵌套存储。具体而言，通过在 `QMap` 中存储键值对，其中键是时间字符串，而值是包含浮点数数据的 `QList`。这种结构使得可以方便地按时间检索相关联的数据集。



```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QtGlobal>
#include <QList>
#include <QMap>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QMap<QString,QList<float>> map;
    QList<float> ptr;

    // 指定第一组数据
    ptr.append(10.1);
    ptr.append(12.5);
    ptr.append(22.3);
    map["10:10"] = ptr;

    // 指定第二组数据
    ptr.clear();
    ptr.append(102.2);
    ptr.append(203.2);
    ptr.append(102.1);
    map["11:20"] = ptr;


    // 遍历所有的KEY 并输出值
    QList<float> values;
    foreach(QString key,map.uniqueKeys())
    {
        values = map.value(key);
        std::cout << "Time: " << key.toStdString().data() << std::endl;
        for(qint32 x=0;x<values.size();x++)
        {
            std::cout << values[x]<< std::endl;
        }
    }

    return a.exec();
}

```

在示例中，两组数据分别对应不同的时间键，每组数据存储在相应的 `QList` 中。最后，通过迭代输出了所有数据，以时间为键检索相应的数据集，并将每个数据集中的浮点数逐个输出。整体而言，这种数据结构的嵌套使用有助于组织和检索多维度的数据。

## QList合并为QMap



```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QtGlobal>
#include <QList>
#include <QMap>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QList<QString> Header = {"MemTotal","MemFree","Cached","SwapTotal","SwapFree"};
    QList<float> Values = {12.5,46.8,68,100.3,55.9};
    QMap<QString,float> map;

    // 将两个列表合并为一个字典,开发会遇到的~~~~
    for(int i=0;i<Header.count();i++)
    {
        QString key = Header[i].toStdString().data();
        map[key] = Values[i];
    }

    // 输出特定字典中的数据
    std::cout << map.key(100.3).toStdString().data() << std::endl;
    std::cout << map.value("SwapTotal") << std::endl;

    return a.exec();
}

```

##  QList结构体排序

```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QtGlobal>
#include <QList>

struct Student
{
    int id;
    QString name;
};

void DisplayQListItem(const QList<int>& qList)
{
    foreach(const int &item,qList)
    {
        std::cout << item << " ";
    }
    std::cout << std::endl;
}



void devListSort(QList<Student> *list)
{
    std::sort(list->begin(),list->end(),[](const Student &itemA,const Student &itemB)
    {
        return itemA.id < itemB.id;
    }); //用结构体的ID排序
}

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 定义并对单一数组排序

    QList<Student> stuList;
    QList<int> numberList;
    Student item;

    numberList = {56,88,34,61,79,82,34,67,88,1};
    std::sort(numberList.begin(),numberList.end(),[](const int &itemA,const int &itemB)
    {
     return itemA > itemB;
    }); //是不是和Java的Lamba差不多？闭着眼都能写


    DisplayQListItem(numberList);



    item.id=1005;
    item.name="admin";
    stuList.append(item);

    item.id=1002;
    item.name = "guest";
    stuList.append(item);

    item.id = 1000;
    item.name = "JacksonWang";
    stuList.append(item);

    devListSort(&stuList);

    for(int x=0;x< stuList.count();x++)
    {
        std::cout << stuList[x].id << " ---> ";
        std::cout << stuList[x].name.toStdString().data() << std::endl;
    }

    return a.exec();
}

```

上述这段代码演示了如何对一个包含整数的列表和一个包含结构体的列表进行排序，并输出排序后的结果。在结构体排序的情况下，使用了自定义的排序方法 `devListSort`，该方法按照结构体的 `id` 成员进行升序排序。