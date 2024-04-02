# C++ Qt开发：使用顺序容器类

当我们谈论编程中的[数据结构](https://so.csdn.net/so/search?q=数据结构&spm=1001.2101.3001.7020)时，顺序容器是不可忽视的一个重要概念。顺序容器是一种能够按照元素添加的顺序来存储和检索数据的数据结构。它们提供了简单而直观的方式来组织和管理数据，为程序员提供了灵活性和性能的平衡。

Qt 中提供了丰富的容器类，用于方便地管理和操作数据。这些容器类涵盖了各种不同的用途，从简单的动态数组到复杂的映射和集合。本章我们将主要学习顺序容器，顺序容器是一组强大而灵活的数据结构，用于按照元素添加的顺序存储和管理数据。Qt提供了多种顺序容器，每种都具有独特的特性，这些容器包括向量、列表、队列、栈等，每种都有特定的适用场景。

当然了STL标准模板中也存在这些容器，Qt 的容器类与标准模板库（STL）中的容器类有些相似，但也有一些不同之处。以下是 Qt 容器类相对于STL的一些特点和优势：

- **可自动共享数据**
  - Qt 容器类使用了引用计数的技术，能够自动共享数据，减少内存占用。当一个容器对象复制另一个容器对象时，它们可以共享底层数据而不是进行深拷贝。

- **隐式共享：**
  - Qt 容器类通过隐式共享实现了高效的数据共享。只有在发生写操作时，才会执行深拷贝，从而减少不必要的开销。
- **可跨线程使用**
  - Qt 容器类支持在多线程环境中安全使用，通过显式共享（`QExplicitlySharedDataPointer`）和不显式共享两种方式，方便在多线程应用中进行数据处理。
- **提供了一些额外的功能**
  - Qt 的容器类在标准容器的基础上提供了一些额外的功能，例如对 Unicode 字符串的特殊支持（`QString`），以及一些便捷的成员函数，使得容器的使用更为方便。
- **内存管理**
  - Qt 容器类负责管理其元素的内存，使得内存的分配和释放不需要额外的手动管理，减轻了开发者的负担。
- **直观的 API 设计**
  - Qt 的容器类 API 设计考虑了 Qt 的整体框架，采用了一致而直观的命名规范，使得使用者更容易理解和记忆容器类的接口。
- **与其他 Qt 类的集成**
  - Qt 容器类能够无缝地与其他 Qt 类和框架集成，例如与信号和槽机制一起使用，使得在 Qt 应用程序中的开发更为方便。

在某些特定的场景和需求下，STL 的容器类可能更适合使用。然而，在使用 Qt 框架的情况下，Qt 容器类通常能够提供更好的集成和一些额外的特性。选择使用哪种容器类取决于具体的项目需求和开发者的偏好。

# QList 动态数组容器

`QList` 是 Qt 中常用的动态数组类，它提供了动态大小的数组，支持在列表的两端和中间快速插入、删除元素。适用于需要动态管理元素集合的场景，使得对列表的操作更加简便。

以下是 `QList` 的一些常用函数：

|                        **函数**                         |                           **功能**                           |
| :-----------------------------------------------------: | :----------------------------------------------------------: |
|                     QList::QList()                      |            构造函数，创建一个空的 `QList` 对象。             |
|            QList::QList(const QList &other)             |    复制构造函数，创建一个与给定列表相同的 `QList` 对象。     |
|              QList::append(const T &value)              |                   在列表末尾添加一个元素。                   |
|             QList::prepend(const T &value)              |                   在列表开头添加一个元素。                   |
|          QList::replace(int i, const T &value)          |           替换列表中索引为 `i` 的元素为给定的值。            |
|                 QList::removeAt(int i)                  |                移除列表中索引为 `i` 的元素。                 |
|            QList::removeOne(const T &value)             |              移除列表中第一个匹配给定值的元素。              |
|            QList::removeAll(const T &value)             |               移除列表中所有匹配给定值的元素。               |
|                  QList::takeAt(int i)                   |             移除并返回列表中索引为 `i` 的元素。              |
|                   QList::takeFirst()                    |                移除并返回列表中的第一个元素。                |
|                    QList::takeLast()                    |               移除并返回列表中的最后一个元素。               |
|          QList::insert(int i, const T &value)           |           在列表中索引为 `i` 的位置插入一个元素。            |
|          QList::contains(const T &value) const          |                  判断列表中是否包含给定值。                  |
|           QList::count(const T &value) const            |               统计列表中匹配给定值的元素数量。               |
|   QList::indexOf(const T &value, int from = 0) const    | 返回给定值在列表中的第一个匹配项的索引，从指定位置 `from` 开始搜索。 |
| QList::lastIndexOf(const T &value, int from = -1) const | 返回给定值在列表中的最后一个匹配项的索引，从指定位置 `from` 开始反向搜索。 |
|                 QList::isEmpty() const                  |                      判断列表是否为空。                      |
|                   QList::size() const                   |                    返回列表中元素的数量。                    |
|                     QList::clear()                      |                   清空列表，移除所有元素。                   |
|                   QList::operator=()                    |         重载赋值运算符，将一个列表赋值给另一个列表。         |
|                   QList::operator==()                   |            重载相等运算符，判断两个列表是否相等。            |
|                   QList::operator!=()                   |           重载不等运算符，判断两个列表是否不相等。           |

以上是 `QList` 的一些常用函数及其功能，这些函数允许开发者对列表进行添加、删除、替换、查找等操作，以满足不同场景的需求。

## 主要特点

- **动态数组：** `QList` 是动态大小的数组，可以根据需要自动调整大小。
- **泛型：** `QList` 是泛型容器，可以存储任意类型的数据。
- **可变大小：** 列表的大小可以动态改变，元素的插入和删除操作都很高效。
- **双向迭代器：** `QList` 提供了双向迭代器，可以方便地从前往后或从后往前遍历列表。

## 如何使用

如下所示的代码中我定义了两个`QList`容器，分别是`groupOne`和`groupTwo`通过使用不同的容器操作函数对其进行简单的增加插入替换删除和移动操作，如下代码所示；

```c
#include <QCoreApplication>
#include <iostream>
#include <QList>

void DisplayQListItem(const QList<QString> &ptr)
{
    std::cout << "-----------------------------" << std::endl;
    for(qint32 x=0;x<ptr.count();x++)
    {
        // std::cout << ptr[x].toStdString().data() << std::endl;
        std::cout << (ptr.at(x)).toStdString().data() << std::endl;
    }
    std::cout << std::endl;
}

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QList<QString> groupOne; //第一小组
    QList<QString> groupTwo;

    // 第一组添加三个成员
    groupOne.append("zhangsan");
    groupOne.append("lisi");
    groupOne.append("wangwu");
    DisplayQListItem(groupOne);

    // 在首部插入 JacksonWang
    groupOne.prepend("JacksonWang");
    DisplayQListItem(groupOne);


    // 在第0的位置插入zhaoliu
    groupOne.insert(0,"zhaoliu");
    DisplayQListItem(groupOne);

    // 替换原来的zhangsan为zhangsanfei
    groupOne.replace(2,"zhangsanfei");
    DisplayQListItem(groupOne);


    // 删除第0个元素
    groupOne.removeAt(0);
    DisplayQListItem(groupOne);

    // 删除首部和尾部
    groupOne.removeFirst();
    groupOne.removeLast();

    // 移动两个变量
    groupOne.move(0,1);
    DisplayQListItem(groupOne);

    // 将两个list容器对调交换
    groupTwo = {"youtube","facebook"};
    groupOne.swap(groupTwo);
    DisplayQListItem(groupOne);
    return a.exec();
}
```

上述代码我们只是对字符串进行了链表管理，其实Qt中支持管理结构体，首先要定义一个特有的结构体`Stduent`.并向链表中添加结构体项。

当在遍历时可以有三种方式，第一种时传统的循环依次输出元素，这里我们说说使用`QListIterator`和`QMutableListIterator`来输出元素的区别。

```c
#include <QCoreApplication>
#include <iostream>
#include <QList>
#include <QListIterator>
#include <QMutableListIterator>

struct Stduent
{
    qint32 id;
    QString name;
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QList<Stduent> stuList;
    Stduent item;

    item.id = 1001;
    item.name = "zhangsan";
    stuList.append(item);

    item.id = 1002;
    item.name = "lisi";
    stuList.append(item);

    //for +下标
    for(qint32 i=0;i<stuList.count();i++)
    {
        std::cout << stuList.at(i).id << std::endl;
        std::cout << stuList[i].name.toStdString().data() << std::endl;
    }

    // 使用只读迭代器遍历,很像Java
    QListIterator<Stduent> itFn(stuList);
    while(itFn.hasNext())
    {
        // peeknext读取下一个节点,但不影响指针变化
        std::cout << itFn.peekNext().id << std::endl;
        std::cout << (itFn.peekNext().name).toStdString().data() << std::endl;
        // 最后将x指针指向下一个数据
        itFn.next();
    }

    // 使用读写迭代器, 针对如果id=1002则将lisi改为JacksonWang
    QMutableListIterator<Stduent> iter(stuList);
    while(iter.hasNext())
    {
        // y.peekNext().uid = 9999;
        if(iter.peekNext().id == 1002)
        {
            iter.peekNext().name = "JacksonWang";
        }
        iter.next();
    }
    
    //再查链表，看看改了没有
    itFn = stuList;
    while(itFn.hasNext())
    {

        std::cout << itFn.peekNext().id << std::endl;
        std::cout << (itFn.peekNext().name).toStdString().data() << std::endl;
        itFn.next();
    }

    return a.exec();
}

```

其实QListIterator 和 QMutableListIterator 都是用于遍历 QList 容器的迭代器类。区别是QListIterator 是一个只读迭代器，用于遍历 QList 容器中的元素。它提供了一个方便的方式来访问容器中的元素，支持前向和后向遍历。而QMutableListIterator 是一个可变迭代器，除了支持读取元素外，还允许修改 QList 中的元素。它提供了修改元素的接口，使得在遍历的同时可以对容器进行修改。

QListIterator 主要函数和特点

- `QListIterator(const QList<T> &list)`: 构造函数，用于初始化迭代器并关联到给定的 `QList`。
- `hasNext() const`: 检查是否有下一个元素。
- `next()`: 返回当前元素并将迭代器移动到下一个元素。
- `peekNext() const`: 返回当前元素但不移动迭代器。
- `toFront()`: 将迭代器移动到列表的第一个元素。
- `toBack()`: 将迭代器移动到列表的最后一个元素。

QMutableListIterator 主要函数和特点

- `QMutableListIterator(QList<T> &list)`: 构造函数，用于初始化可变迭代器并关联到给定的 `QList`。
- `hasNext() const`: 检查是否有下一个元素。
- `next()`: 返回当前元素并将迭代器移动到下一个元素。
- `peekNext() const`: 返回当前元素但不移动迭代器。
- `toFront()`: 将迭代器移动到列表的第一个元素。
- `toBack()`: 将迭代器移动到列表的最后一个元素。
- `remove()`: 移除迭代器当前位置的元素。
- `setValue(const T &value)`: 将迭代器当前位置的元素设置为给定值。

这两个迭代器类提供了方便而灵活的方式来遍历和操作 `QList` 中的元素，根据需要选择合适的迭代器。

# QLinkeList 双向链表容器

QLinkedList 是 Qt 中的双向链表实现，与 QList 不同，它不是基于数组的动态容器，而是基于链表的数据结构。QLinkedList 提供了链表特有的灵活性，适用于需要在任意位置高效插入和删除元素的场景。在一些访问元素的场景中，由于链表的非连续存储特性，可能比数组容器的访问效率稍低。选择使用 QLinkedList 还是其他容器，取决于具体的使用需求。

以下是 `QLinkedList` 的一些常用函数：

|                          **函数**                           |                          **功能**                           |
| :---------------------------------------------------------: | :---------------------------------------------------------: |
|                 QLinkedList::QLinkedList()                  |         构造函数，创建一个空的 `QLinkedList` 对象。         |
|     QLinkedList::QLinkedList(const QLinkedList &other)      | 复制构造函数，创建一个与给定链表相同的 `QLinkedList` 对象。 |
|             QLinkedList::append(const T &value)             |                  在链表末尾添加一个元素。                   |
|            QLinkedList::prepend(const T &value)             |                  在链表开头添加一个元素。                   |
| QLinkedList::replace(const_iterator before, const T &value) |         替换链表中给定迭代器位置的元素为给定的值。          |
|             QLinkedList::remove(const T &value)             |              移除链表中所有匹配给定值的元素。               |
|           QLinkedList::removeOne(const T &value)            |             移除链表中第一个匹配给定值的元素。              |
|                QLinkedList::removeAt(int i)                 |                移除链表中索引为 `i` 的元素。                |
|                 QLinkedList::takeAt(int i)                  |             移除并返回链表中索引为 `i` 的元素。             |
|                  QLinkedList::takeFirst()                   |               移除并返回链表中的第一个元素。                |
|                   QLinkedList::takeLast()                   |              移除并返回链表中的最后一个元素。               |
| QLinkedList::insert(const_iterator before, const T &value)  |            在链表中给定迭代器位置插入一个元素。             |
|         QLinkedList::contains(const T &value) const         |                 判断链表中是否包含给定值。                  |
|          QLinkedList::count(const T &value) const           |              统计链表中匹配给定值的元素数量。               |
|         QLinkedList::indexOf(const T &value) const          |          返回给定值在链表中的第一个匹配项的索引。           |
|       QLinkedList::lastIndexOf(const T &value) const        |         返回给定值在链表中的最后一个匹配项的索引。          |
|                QLinkedList::isEmpty() const                 |                     判断链表是否为空。                      |
|                  QLinkedList::size() const                  |                   返回链表中元素的数量。                    |
|                    QLinkedList::clear()                     |                  清空链表，移除所有元素。                   |
|                    QLinkedList::begin()                     |              返回指向链表第一个元素的迭代器。               |
|                     QLinkedList::end()                      |           返回指向链表最后一个元素之后的迭代器。            |

`QLinkedList` 提供了与 `QList` 类似的操作，但由于其基于双向链表实现，特别适合于需要频繁插入和删除操作的场景。在使用上，`QLinkedList` 提供了一些额外的函数，如 `replace`、`insert` 等，可以更方便地操作链表中的元素。



## 主要特点

- **双向链表：** `QLinkedList` 使用双向链表结构，每个节点存储一个元素以及指向前后节点的指针，支持高效的插入和删除操作。
- **泛型：** `QLinkedList` 是泛型容器，可以存储任意类型的数据。
- **可变大小：** 链表的大小可以动态改变，元素的插入和删除操作在任意位置都很高效。
- **双向迭代器：** `QLinkedList` 提供了双向迭代器，可以方便地从前往后或从后往前遍历链表。

## 如何使用

QLinkeList其实就是动态链表结构，数据的存储非连续，访问时无法直接使用下标定位，只能通过迭代器迭代寻找，这是其与`QList`的本质区别，其参数定义与`QList`基本一致，在使用上并没有本质上的区别。

```c
#include <QCoreApplication>
#include <iostream>
#include <QLinkedList>
#include <QLinkedListIterator>
#include <QMutableLinkedListIterator>

struct Student
{
    qint32 id;
    QString name;
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QLinkedList<Student> stuList;
    QLinkedList<int> numberList;
    Student item;

    QLinkedList<Student>::iterator iter = NULL;
    QLinkedList<Student>::const_iterator constIter = NULL; //C++风格

    item.id = 1001;
    item.name = "zhangsan";
    stuList.append(item);

    item.id = 1002;
    item.name = "lisi";
    stuList.append(item);


    // 使用只读迭代器遍历: 从前向后遍历
    QLinkedListIterator<Student> itFn(stuList); //QT风格
    while(itFn.hasNext())
    {
        std::cout << itFn.peekNext().id << std::endl;
        std::cout << itFn.peekNext().name.toStdString().data() << std::endl;
        itFn.next();
    }

    // 使用只读迭代器遍历: 从后向前遍历
    for(itFn.toBack();itFn.hasPrevious();itFn.previous())
    {
        std::cout << itFn.peekPrevious().id << std::endl;
        std::cout << itFn.peekPrevious().name.toStdString().c_str() << std::endl;
    }

    // STL风格 迭代器遍历
    for(iter=stuList.begin();iter!=stuList.end();++iter)
    {
        std::cout << (*iter).id << std::endl;
    }

    // STL风格 只读迭代器遍历
    for(constIter=stuList.constBegin();constIter!=stuList.constEnd();++constIter)
    {
        std::cout <<((*constIter).name).toStdString().data()<< std::endl;
    }


    // 使用读写迭代器: 动态生成列表,每次对二取余
    numberList = QLinkedList<int>({1,2,3,4,5,6,7,8,9,10});
    QMutableLinkedListIterator<int> numberListIter(numberList); //QT风格

    // --> 从前向后输出一次,每次指针后移。
    for(numberListIter.toFront();numberListIter.hasNext();numberListIter.next())
    {
          std::cout << numberListIter.peekNext() << std::endl;
    }


    // --> 将指针移动到最后然后判断
    for(numberListIter.toBack();numberListIter.hasPrevious();)
    {
        //指针上移，查这个元素是偶数则移除。
        if(numberListIter.previous() % 2==0) //干掉偶数的元素
        {
              numberListIter.remove();
        }
        else //反之奇数的元素，全部放大10倍
        {
             numberListIter.setValue(numberListIter.peekNext() * 10);
        }
    }

    // --> 输出结果
    for(numberListIter.toFront();numberListIter.hasNext(); numberListIter.next())
    {
        std::cout << numberListIter.peekNext() << std::endl;

    }
    return a.exec();
}

```

# QVector 动态数组容器

`QVector` 是Qt中的动态数组类，它提供了动态大小的数组，并在内部使用指针数组进行存储。`QVector` 是一个灵活的动态数组类，适用于需要动态管理元素集合的场景，同时由于其连续存储的特性，在访问元素的效率上相对较高。

以下是 `QVector` 的一些常用函数：

|                         **函数**                          |                           **功能**                           |
| :-------------------------------------------------------: | :----------------------------------------------------------: |
|                    QVector::QVector()                     |           构造函数，创建一个空的 `QVector` 对象。            |
|                QVector::QVector(int size)                 |   构造函数，创建一个包含 `size` 个元素的 `QVector` 对象。    |
|        QVector::QVector(int size, const T &value)         | 构造函数，创建一个包含 `size` 个元素，每个元素都是给定值的 `QVector` 对象。 |
|          QVector::QVector(const QVector &other)           |   复制构造函数，创建一个与给定向量相同的 `QVector` 对象。    |
|              QVector::append(const T &value)              |                   在向量末尾添加一个元素。                   |
|             QVector::prepend(const T &value)              |                   在向量开头添加一个元素。                   |
|          QVector::replace(int i, const T &value)          |           替换向量中索引为 `i` 的元素为给定的值。            |
|                 QVector::removeAt(int i)                  |                移除向量中索引为 `i` 的元素。                 |
|            QVector::removeOne(const T &value)             |              移除向量中第一个匹配给定值的元素。              |
|              QVector::remove(const T &value)              |               移除向量中所有匹配给定值的元素。               |
|                  QVector::takeAt(int i)                   |             移除并返回向量中索引为 `i` 的元素。              |
|                   QVector::takeFirst()                    |                移除并返回向量中的第一个元素。                |
|                    QVector::takeLast()                    |               移除并返回向量中的最后一个元素。               |
|          QVector::insert(int i, const T &value)           |           在向量中索引为 `i` 的位置插入一个元素。            |
|       QVector::fill(const T &value, int size = -1)        |  使用给定值填充向量，如果指定了 `size`，则填充到指定大小。   |
|          QVector::contains(const T &value) const          |                  判断向量中是否包含给定值。                  |
|           QVector::count(const T &value) const            |               统计向量中匹配给定值的元素数量。               |
|   QVector::indexOf(const T &value, int from = 0) const    | 返回给定值在向量中的第一个匹配项的索引，从指定位置 `from` 开始搜索。 |
| QVector::lastIndexOf(const T &value, int from = -1) const | 返回给定值在向量中的最后一个匹配项的索引，从指定位置 `from` 开始反向搜索。 |
|                 QVector::isEmpty() const                  |                      判断向量是否为空。                      |
|                   QVector::size() const                   |                    返回向量中元素的数量。                    |
|                     QVector::clear()                      |                   清空向量，移除所有元素。                   |
|                 QVector::resize(int size)                 |   更改向量的大小，如果新大小大于当前大小，会用默认值填充。   |
|                QVector::reserve(int size)                 |     预留空间以容纳指定数量的元素，可提高插入操作的性能。     |
|                    QVector::squeeze()                     |                   释放向量占用的多余空间。                   |

`QVector` 提供了类似于 `QList` 的操作，但由于其底层使用连续存储，因此在某些情况下性能更高。开发者可以根据具体的需求选择适合的容器。

##  主要特点

- **动态数组：** `QVector` 是动态大小的数组，可以根据需要自动调整大小
- **连续存储：** 与 `QLinkedList` 不同，`QVector` 的元素在内存中是连续存储的，这有助于提高访问效率。
- **泛型：** `QVector` 是泛型容器，可以存储任意类型的数据。
- **可变大小：** 数组的大小可以动态改变，元素的插入和删除操作在末尾和中间都很高效。

## 如何使用

`QVector` 在内存中存储连续的数据，类似于 C++ 中的 `std::vector`。该容器的使用与`Qlist`完全一致，但读取性能要比`Qlist`更高，但在插入时速度最慢。

```c
#include <QCoreApplication>
#include <iostream>
#include <QVector>
#include <QVectorIterator>
#include <QMutableVectorIterator>

struct Student
{
    qint32 id;
    QString name;
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QVector<Student> vecStudents;
    Student item;

    item.id = 1001;
    item.name = "zhangsan";
    vecStudents.append(item);

    item.id = 1002;
    item.name = "lisi";
    vecStudents.append(item);

    // 使用传统方式遍历
    for(qint32 x=0;x<vecStudents.count();x++)
    {
        std::cout << vecStudents.at(x).id << std::endl;
        std::cout << vecStudents[x].name.toStdString().data() << std::endl;
    }

    // 使用只读迭代器遍历: C++ STL写法
    for(auto constItFn = vecStudents.cbegin();constItFn != vecStudents.cend(); ++constItFn)
    {
        std::cout << (*constItFn).id << std::endl;
        std::cout << (*constItFn).name.toStdString().data() << std::endl;
    }

    // 使用读写迭代器修改: C++ STL写法
    for(auto itFn = vecStudents.begin();itFn !=vecStudents.end();++itFn)
    {
        if((*itFn).id == 1001)
        {
            (*itFn).name = "xxxx";
        }
        std::cout << (*itFn).id << std::endl;
        std::cout << (*itFn).name.toStdString().data() << std::endl;
    }

    return a.exec();
}

```

## 与QList的比较

- **相似性：** `QVector` 和 `QList` 在接口上非常相似，可以使用相同的函数进行元素的访问、插入和删除等操作。
- **性能差异：** 由于 `QVector` 的元素在内存中是连续存储的，因此在顺序访问时，`QVector` 的性能通常比 `QList` 更高。但在中间插入元素时，`QVector` 的性能可能较差，因为需要移动插入点之后的所有元素。
- **适用场景：** `QVector` 适用于需要频繁进行顺序访问而较少进行中间插入操作的场景，例如对大量数据进行顺序处理的情况。



# QStack 栈容器

`QStack` 是 Qt 中的栈容器，它提供了栈（LIFO）的数据结构。该容器用于需要满足后进先出规则的场景，例如在算法实现中，或者在某些数据处理过程中需要临时存储和恢复状态。

以下是 `QStack` 的一些常用函数：

|              **函数**               | **功能**                                             |
| :---------------------------------: | ---------------------------------------------------- |
|          QStack::QStack()           | 构造函数，创建一个空的 `QStack` 对象。               |
| QStack::QStack(const QStack &other) | 复制构造函数，创建一个与给定栈相同的 `QStack` 对象。 |
|    QStack::push(const T &value)     | 在栈顶压入一个元素。                                 |
|            QStack::pop()            | 弹出栈顶的元素。                                     |
|         QStack::top() const         | 返回栈顶的元素，不弹出。                             |
|       QStack::isEmpty() const       | 判断栈是否为空。                                     |
|        QStack::size() const         | 返回栈中元素的数量。                                 |
|           QStack::clear()           | 清空栈，移除所有元素。                               |
|         QStack::operator=()         | 重载赋值运算符，将一个栈赋值给另一个栈。             |
|        QStack::operator==()         | 重载相等运算符，判断两个栈是否相等。                 |
|        QStack::operator!=()         | 重载不等运算符，判断两个栈是否不相等。               |

`QStack` 是一个后进先出（LIFO）的栈，提供了压栈、弹栈等基本操作。栈是一种常见的数据结构，可以用于需要遵循后进先出原则的场景，例如递归函数调用时的存储函数调用信息等。

## 主要特点

- **栈数据结构：** `QStack` 是栈的实现，它遵循后进先出（Last In, First Out，LIFO）的原则。
- **泛型：** `QStack` 是泛型容器，可以存储任意类型的数据。
- **封闭性：** `QStack` 提供的接口限制在栈顶进行插入和删除操作，不允许在中间或底部插入或删除元素。

```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QStack>
#include <QQueue>

struct Student
{
    qint32 id;
    QString name;
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);


    QStack<QString> strStack;
    QStack<Student> stuStack;


    strStack.push("zhangsan");
    strStack.push("lisi");

    //查栈顶元素
    std::cout << (strStack.top()).toStdString().data()<<std::endl;

    //元素弹栈
    while(!strStack.isEmpty())
    {
        std::cout << (strStack.pop()).toStdString().data() << std::endl;
    }


    //结构体也是一样用
    Student item;
    item.id = 1001;
    item.name = "zhangsan";
    stuStack.push(item);

    item.id = 1002;
    item.name = "lisi";
    stuStack.push(item);


    while(!stuStack.isEmpty())
    {
        Student ref;

        ref = stuStack.pop();
        std::cout << "id = " << ref.id << std::endl;
        std::cout << "name = " << ref.name.toStdString().data() << std::endl;
    }

    return a.exec();
}

```

# QQueue 队列容器

`QQueue` 是 Qt 中的队列容器，它提供了队列（FIFO）的数据结构。`QQueue` 可以用于需要满足先进先出规则的场景，例如在任务调度、数据缓冲等应用中。

以下是 `QQueue` 的一些常用函数：

|              **函数**               |                        **功能**                        |
| :---------------------------------: | :----------------------------------------------------: |
|          QQueue::QQueue()           |         构造函数，创建一个空的 `QQueue` 对象。         |
| QQueue::QQueue(const QQueue &other) | 复制构造函数，创建一个与给定队列相同的 `QQueue` 对象。 |
|   QQueue::enqueue(const T &value)   |                在队列尾部插入一个元素。                |
|          QQueue::dequeue()          |                  移除队列头部的元素。                  |
|        QQueue::head() const         |              返回队列头部的元素，不移除。              |
|       QQueue::isEmpty() const       |                   判断队列是否为空。                   |
|        QQueue::size() const         |                 返回队列中元素的数量。                 |
|           QQueue::clear()           |                清空队列，移除所有元素。                |
|         QQueue::operator=()         |      重载赋值运算符，将一个队列赋值给另一个队列。      |
|        QQueue::operator==()         |         重载相等运算符，判断两个队列是否相等。         |
|        QQueue::operator!=()         |        重载不等运算符，判断两个队列是否不相等。        |

`QQueue` 是一个先进先出（FIFO）的队列，提供了入队、出队等基本操作。队列常用于需要按照先后顺序处理元素的场景，例如任务队列、消息队列等。

## 主要特点

- **队列数据结构：** `QQueue` 是队列的实现，它遵循先进先出（First In, First Out，FIFO）的原则。
- **泛型：** `QQueue` 是泛型容器，可以存储任意类型的数据。
- **封闭性：** `QQueue` 提供的接口限制在队列的前端进行插入，队列的后端进行删除操作。

## 如何使用

队列就是先进后出，在使用上与普通容器保持一致，只是队列的可用方法会更少一些。

```c
#include <QCoreApplication>
#include <iostream>
#include <QString>
#include <QQueue>

struct Student
{
    qint32 id;
    QString name;
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    QQueue<Student> stuQueue;
    Student item;

    //元素入队
    item.id = 1001;
    item.name = "zhangsan";
    stuQueue.enqueue(item);

    item.id = 1002;
    item.name = "lisi";
    stuQueue.enqueue(item);

    //元素出队
    while(!stuQueue.isEmpty())
    {
        Student ref;

        ref = stuQueue.dequeue();
        std::cout << "id = " << ref.id << std::endl;
        std::cout << "name = " << ref.name.toStdString().data() << std::endl;
    }

    return a.exec();
}

```

