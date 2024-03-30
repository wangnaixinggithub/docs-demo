# C++ Boost 多线程并发库



Boost 库是一个由C/C++语言的开发者创建并更新维护的开源类库，其提供了许多功能强大的程序库和工具，用于开发高质量、可移植、高效的C应用程序。Boost库可以作为标准C库的后备，通常被称为准标准库，是C标准化进程的重要开发引擎之一。使用Boost库可以加速C应用程序的开发过程，提高代码质量和性能，并且可以适用于多种不同的系统平台和编译器。Boost库已被广泛应用于许多不同领域的C++应用程序开发中，如网络应用程序、图像处理、数值计算、多线程应用程序和文件系统处理等。



C++语言并没有对多线程与网络的良好支持，虽然新的C++标准加入了基本的thread库，但是对于并发编程的支持仍然很基础，Boost库提供了数个用于实现高并发与网络相关的开发库这让我们在开发跨平台并发网络应用时能够像Java等语言一样高效开发。



thread库为C++增加了多线程处理能力，其主要提供了清晰的，互斥量，线程，条件变量等，可以很容易的实现多线程应用开发，而且该库是可跨平台的，并且支持POSIX和Windows线程。



## 互斥锁



互斥锁通过在访问共享资源的线程之间进行通信来避免并发问题。互斥锁仅允许一个线程在任何给定时间点上访问共享资源。如果已经有一个线程锁定了互斥锁，则任何其他线程都必须等待锁被释放。一旦锁被释放，等待队列中的一个线程将被允许继续其工作。



Boost库中的 boost::mutex 类型表示一个互斥锁。它提供了两个主要函数来控制互斥锁：lock() 和 unlock()。当一个线程想要访问一个共享资源时，它会调用互斥锁的 lock() 函数来获取锁，如果无法获得，线程将最多等待直到锁被释放。在线程访问完共享资源后，它需要调用 unlock() 函数来释放锁，以便其他线程可以获得锁并访问共享资源。



互斥体是用于线程同步的一种手段，其主要用于在多线程环境下，防止多个线程同时操作共享资源，当某线程被锁，其他线程则需要等待它解锁后才能继续访问共享资源。



- thread提供了6种互斥类型,但常用的只有3种:
  - mutex 独占互斥锁
  - recursive_mutex 递归互斥锁
  - shared_mutex 读写锁



通常我们会使用Mutex来保护共享资源，防止在多线程环境中数据的不一致性，当一个资源被锁定，其他线程只能阻塞等待释放后才可继续操作。

```c
#define BOOST_THREAD_VERSION 5
#include <iostream>
#include <boost/thread/thread_guard.hpp>

using namespace std;
using namespace boost;

// 最基本的互斥锁
void MutexA()
{
    boost::mutex mutex;
    try
    {
        mutex.lock();
        // 执行变量存取操作
        mutex.unlock();
    }
    catch (...)
    {
        mutex.unlock();
    }
}

// 智能互斥锁(无需加解锁)
void MutexB()
{
    boost::mutex mutex;
    boost::lock_guard<boost::mutex> global_mutex(mutex);
    // 只需要定义以上代码即可
}

```

在Boost中创建多线程非常简单，只需要定义一个`MyThread`线程函数，并在主函数中开启线程即可实现。

```c
#include <iostream>
#include <boost/thread/thread.hpp>
#include <boost/thread/mutex.hpp>
#include <boost/bind.hpp>

using namespace std;

boost::mutex io_mutex;

void MyThread(int id)
{
    for (int i = 1; i < 10; ++i)
    {
        // 定义智能互斥锁,防止出现输出乱序
        boost::mutex::scoped_lock lock(io_mutex);
        std::cout << id << ": " << i << std::endl;
    }
}

int main(int argc, char* argv[])
{
    boost::thread thrd1(boost::bind(&MyThread, 1));
    boost::thread thrd2(boost::bind(&MyThread, 2));

    //中断线程
    thrd1.interrupt();

    //获取线程ID
    cout << "线程ID:" << thrd1.get_id() << endl;

    // 等待线程
    thrd1.join();
    thrd2.join();

    //超过3s结束线程
    thrd1.timed_join(boost::posix_time::seconds(3));
    thrd2.timed_join(boost::posix_time::seconds(3));

    std::system("pause");
    return 0;

    /*
        线程ID:1424
        1: 1
        1: 2
        1: 3
        1: 4
        1: 5
        1: 6
        1: 7
        1: 8
        1: 9
        2: 1
        2: 2
        2: 3
        2: 4
        2: 5
        2: 6
        2: 7
        2: 8
        2: 9
        请按任意键继续. . .
    */
}
```

## 线程局部存储

Boost库中提供了线程局部存储（Thread Local Storage，简称TLS）的支持，可以让程序中的每个线程都拥有独立的数据空间，互相之间不会受到干扰。这对于一些线程之间需要共享数据，但需要保证数据安全的场景非常有用，例如线程池等。



有时候函数使用了局部静态变量或全局变量，导致无法用于多线程环境，因为无法保证变量在多线程环境下重入的正确操作。


```c
#include <iostream>
#include <boost/thread/thread.hpp>
#include <boost/thread/mutex.hpp>
#include <boost/thread/tss.hpp>

using namespace std;

// 定义一个全局互斥体
boost::mutex io_mutex;

// 线程本地存储一个整数,声明
boost::thread_specific_ptr<int> ptr;

struct MyThread
{
    MyThread(int id) :id(id) {}

    void operator()()
    {
        // 如果ptr内部为0则说明没有,我们就初始化为0
        if (ptr.get() == 0)
            ptr.reset(new int(0));

        for (int x = 0; x < 10; ++x)
        {
            // 往自己的线程上加
            (*ptr)++;
            boost::mutex::scoped_lock lock(io_mutex);
            std::cout << "当前ID: " << id << " 本地存储数值: " << *ptr << std::endl;
        }
    }

public:
    int id;
};

int main(int argc, char* argv[])
{
    boost::thread thrd1(MyThread(1));
    boost::thread thrd2(MyThread(2));

    thrd1.join();
    thrd2.join();

    std::system("pause");

    /*
        当前ID: 1 本地存储数值: 1
        当前ID: 1 本地存储数值: 2
        当前ID: 1 本地存储数值: 3
        当前ID: 1 本地存储数值: 4
        当前ID: 1 本地存储数值: 5
        当前ID: 1 本地存储数值: 6
        当前ID: 1 本地存储数值: 7
        当前ID: 1 本地存储数值: 8
        当前ID: 1 本地存储数值: 9
        当前ID: 1 本地存储数值: 10
        当前ID: 2 本地存储数值: 1
        当前ID: 2 本地存储数值: 2
        当前ID: 2 本地存储数值: 3
        当前ID: 2 本地存储数值: 4
        当前ID: 2 本地存储数值: 5
        当前ID: 2 本地存储数值: 6
        当前ID: 2 本地存储数值: 7
        当前ID: 2 本地存储数值: 8
        当前ID: 2 本地存储数值: 9
        当前ID: 2 本地存储数值: 10
        请按任意键继续. . .
    */
    return 0;
}

```

如果本地存储的类型是一个结构体，如下定义了`MyStruct`本地结构体，来实现本地数据累加。

```c
#include <iostream>
#include <string>
#include <boost/thread/thread.hpp>
#include <boost/thread/mutex.hpp>
#include <boost/thread/tss.hpp>

using namespace std;

// 定义一个全局互斥体
boost::mutex io_mutex;

// 定义本地存储结构体
typedef struct MyStruct
{
    int uid;
    std::string uname;

    MyStruct(int x, std::string y)
    {
        uid = x;
        uname = y;
    }
}MyStruct;

// 线程本地存储一个整数,声明
boost::thread_specific_ptr<MyStruct> ptr;

struct MyThread
{
    MyThread(int id) :id(id) {}
    void operator()()
    {
        // 如果ptr内部为0则说明没有,我们就初始化为0
        if (ptr.get() == 0)
            ptr.reset(new MyStruct(0, "lyshark"));

        for (int x = 0; x < 10; ++x)
        {
            // 往自己的线程上加
            (*ptr).uid = (*ptr).uid + 1;
            (*ptr).uname = "lyshark";
            boost::mutex::scoped_lock lock(io_mutex);
            std::cout << "当前ID: " << id << " 本地存储数值: " << (*ptr).uid << "本地存储名字: " << (*ptr).uname << std::endl;
        }
    }
public:
    int id;
};

int main(int argc, char* argv[])
{
    boost::thread thrd1(MyThread(1));
    boost::thread thrd2(MyThread(2));

    thrd1.join();
    thrd2.join();

    std::system("pause");

    /*
        当前ID: 2 本地存储数值: 1本地存储名字: lyshark
        当前ID: 1 本地存储数值: 1本地存储名字: lyshark
        当前ID: 1 本地存储数值: 2本地存储名字: lyshark
        当前ID: 2 本地存储数值: 2本地存储名字: lyshark
        当前ID: 2 本地存储数值: 3本地存储名字: lyshark
        当前ID: 1 本地存储数值: 3本地存储名字: lyshark
        当前ID: 1 本地存储数值: 4本地存储名字: lyshark
        当前ID: 2 本地存储数值: 4本地存储名字: lyshark
        当前ID: 1 本地存储数值: 5本地存储名字: lyshark
        当前ID: 1 本地存储数值: 6本地存储名字: lyshark
        当前ID: 1 本地存储数值: 7本地存储名字: lyshark
        当前ID: 1 本地存储数值: 8本地存储名字: lyshark
        当前ID: 2 本地存储数值: 5本地存储名字: lyshark
        当前ID: 1 本地存储数值: 9本地存储名字: lyshark
        当前ID: 1 本地存储数值: 10本地存储名字: lyshark
        当前ID: 2 本地存储数值: 6本地存储名字: lyshark
        当前ID: 2 本地存储数值: 7本地存储名字: lyshark
        当前ID: 2 本地存储数值: 8本地存储名字: lyshark
        当前ID: 2 本地存储数值: 9本地存储名字: lyshark
        当前ID: 2 本地存储数值: 10本地存储名字: lyshark
        请按任意键继续. . .
    */
    return 0;
}

```

## 使用线程组

线程组`thread_group`用于管理一组线程，就像线程池一样，其内部使用了`std::list<thread*>`来容纳每个线程对象。



当需要创建新线程时，使用`create_thread()`工厂函数，并通过`bind`绑定传递参数即可实现创建，如下是最简单的线程组创建。

```c
#include <iostream>
#include <boost/thread.hpp>
#include <boost/function.hpp>
#include <boost/bind.hpp>

using namespace std;

boost::mutex io_mutex;

void MyThread(int x, string str)
{
    try
    {
        // 延时2秒
        boost::this_thread::sleep(boost::posix_time::seconds(2));
        for (int i = 0; i < x; i++)
        {
            boost::mutex::scoped_lock lock(io_mutex);
            cout << "输出字符串: " << str << " 计次: " << i << endl;
        }
    }
    catch (boost::thread_interrupted&)
    {
        cout << "thread is interrupt" << endl;
    }
}

int main(int argc, char* argv[])
{
    // 定义线程组
    boost::thread_group group;

    for (int x = 0; x < 10; x++)
    {
        // 创建新线程
        group.create_thread(boost::bind(MyThread, x, "hello lyshark"));
    }

    cout << "当前线程数量: " << group.size() << endl;
    group.join_all();


    /*
        当前线程数量: 10
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 2
        输出字符串: hello lyshark 计次: 3
        输出字符串: hello lyshark 计次: 4
        输出字符串: hello lyshark 计次: 5
        输出字符串: hello lyshark 计次: 6
        输出字符串: hello lyshark 计次: 7
        输出字符串: hello lyshark 计次: 8
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 2
        输出字符串: hello lyshark 计次: 3
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 2
        输出字符串: hello lyshark 计次: 3
        输出字符串: hello lyshark 计次: 4
        输出字符串: hello lyshark 计次: 5
        输出字符串: hello lyshark 计次: 6
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 2
        输出字符串: hello lyshark 计次: 3
        输出字符串: hello lyshark 计次: 4
        输出字符串: hello lyshark 计次: 5
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 2
        输出字符串: hello lyshark 计次: 3
        输出字符串: hello lyshark 计次: 4
        输出字符串: hello lyshark 计次: 5
        输出字符串: hello lyshark 计次: 6
        输出字符串: hello lyshark 计次: 7
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 2
        输出字符串: hello lyshark 计次: 3
        输出字符串: hello lyshark 计次: 4
        输出字符串: hello lyshark 计次: 0
        输出字符串: hello lyshark 计次: 1
        输出字符串: hello lyshark 计次: 2
        请按任意键继续. . .
    */
    std::system("pause");
    return 0;
}

```

我们还可以通过`add_thread`和`remove_thread`将特定的线程对象放入到不同的线程组中，来实现对线程的批量操作。

```c
#include <iostream>
#include <string>
#include <boost/thread.hpp>
#include <boost/function.hpp>
#include <boost/bind.hpp>

using namespace std;

typedef struct MyStruct
{
    int uuid;
    std::string uname;
}MyStruct;

boost::mutex io_mutex;

void MyThread(MyStruct ptr)
{
    try
    {
        for (int i = 0; i < 5; i++)
        {
            boost::mutex::scoped_lock lock(io_mutex);
            cout << "UUID: " << ptr.uuid << " UName: " << ptr.uname << endl;
        }
    }
    catch (boost::thread_interrupted&)
    {
        cout << "thread is interrupt" << endl;
    }
}

int main(int argc, char* argv[])
{
    MyStruct my_struct;
    boost::thread_group group;

    // 创建线程并赋值
    my_struct.uuid = 1001;
    my_struct.uname = "lyshark";
    boost::thread thrd1(&MyThread, my_struct);

    my_struct.uuid = 1002;
    my_struct.uname = "admin";
    boost::thread thrd2(&MyThread, my_struct);

    // 将线程加入线程组
    group.add_thread(&thrd1);
    group.add_thread(&thrd2);

    // 中断所有线程
    // group.interrupt_all();

    // 判断thrd1是否在组内
    bool is_in = group.is_thread_in(&thrd1);
    std::cout << "是否在组内: " << is_in << std::endl;

    // 移除线程组
    group.remove_thread(&thrd1);
    group.remove_thread(&thrd2);

    // 等待线程组执行结束
    group.join_all();
    boost::this_thread::sleep(boost::posix_time::seconds(2));


    /*
        是否在组内: 1
        UUID: 1002 UName: admin
        UUID: 1002 UName: admin
        UUID: 1002 UName: admin
        UUID: 1002 UName: admin
        UUID: 1002 UName: admin
        UUID: 1001 UName: lyshark
        UUID: 1001 UName: lyshark
        UUID: 1001 UName: lyshark
        UUID: 1001 UName: lyshark
        UUID: 1001 UName: lyshark
        请按任意键继续. . .

    */
    std::system("pause");
    return 0;
}

```

## 获取线程返回值

获取线程返回值，需要使用异步的方式得到，Boost中提供了`ASIO`库来实现异步操作，该库采用了前摄器设计模式，实现了可移植的异步IO操作。



首先来简单的看一下，如何使用异步的方式实现创建线程的。



```c
#define BOOST_THREAD_VERSION 5
#include <iostream>
#include <boost/asio.hpp>
#include <boost/bind.hpp>
#include <boost/thread.hpp>
#include <boost/function.hpp>

using namespace std;
using namespace boost;

void MyThread(int x)
{
    for (int i = 0; i < x; i++)
        std::cout << i << std::endl;
}

int main(int argc, char* argv[])
{
    // 第一种使用方式
    auto x = async(&MyThread, 10);
    x.wait();

    // 直接通过bind绑定参数
    boost::async(boost::bind(MyThread, 20));

    // 直接使用lambda表达式
    auto y = boost::async([]
        {
            cout << "hello lyshark" << endl;
        });
    y.wait();

    std::system("pause");
    return 0;
}

```

当我们需要获取单个线程的返回值时，可以使用`valid()`方法或使用`get()`将返回值从线程里拉取出来。

```c
#define BOOST_THREAD_VERSION 5
#include <iostream>
#include <boost/bind.hpp>
#include <boost/thread.hpp>
#include <boost/function.hpp>

using namespace std;

int MyThread(int x, int y)
{
    Sleep(3000);
    return x + y;
}

typedef struct
{
    int x;
    int y;
}MyStruct;

MyStruct MyThreadStruct(int x, int y)
{
    MyStruct ref;
    ref.x = x + 100;
    ref.y = y + 100;

    return ref;
}

int main(int argc, char* argv[])
{
    // 返回数值直接使用get得到
    auto f = boost::async(boost::bind(MyThread, 10, 20));
    //auto f = boost::async(boost::launch::async,bind(MyThread, 10, 20));

    if (f.valid())
    {
        cout << "获取计算结果: " << f.get() << endl;
    }
    f.wait();

    // 返回参数是结构体
    auto t = boost::async(boost::bind(MyThreadStruct, 100, 200));
    MyStruct tmp = t.get();
    cout << "获取结构体参数A: " << tmp.x << " 参数B: " << tmp.y << endl;
    t.wait();

    /*
    获取计算结果: 30
    获取结构体参数A: 200 参数B: 300
    */

    std::system("pause");
    return 0;
}

```

有时候我们会一次性`创建`多个线程共同执行，此时想要获取到`每个线程`中的`返回值`，那么就需要使用多个`future`对象，代码如下。

```c
#define BOOST_THREAD_VERSION 5
#include <iostream>
#include <boost/bind.hpp>
#include <boost/thread.hpp>
#include <boost/function.hpp>

using namespace std;

int MyThread(int x, int y)
{
  Sleep(3000);
  return x + y;
}

int main(int argc, char *argv[])
{
  std::vector<boost::future<int>> vect;

  // 启动异步线程,并放入vector容器中
  for (int i = 0; i < 100; ++i)
  {
    vect.push_back(boost::async(bind(MyThread, i, i * 10)));
  }

  // 等待所有线程计算结束
  boost::wait_for_all(vect.begin(), vect.end());
  for (size_t i = 0; i < vect.size(); i++)
  {
      // 获取到返回值
      if (vect[i].valid())
      {
          cout << "线程计算结果: " << vect[i].get() << endl;
      }
  }


  /*
    线程计算结果: 0
    线程计算结果: 11
    线程计算结果: 22
    线程计算结果: 33
    线程计算结果: 44
    线程计算结果: 55
    线程计算结果: 66
    线程计算结果: 77
    线程计算结果: 88
    线程计算结果: 99
    线程计算结果: 110
    线程计算结果: 121
    线程计算结果: 132
    线程计算结果: 143
    线程计算结果: 154
    线程计算结果: 165
    线程计算结果: 176
    线程计算结果: 187
    线程计算结果: 198
    线程计算结果: 209
    线程计算结果: 220
    线程计算结果: 231
    线程计算结果: 242
    线程计算结果: 253
    线程计算结果: 264
    线程计算结果: 275
    线程计算结果: 286
    线程计算结果: 297
    线程计算结果: 308
    线程计算结果: 319
    线程计算结果: 330
    线程计算结果: 341
    线程计算结果: 352
    线程计算结果: 363
    线程计算结果: 374
    线程计算结果: 385
    线程计算结果: 396
    线程计算结果: 407
    线程计算结果: 418
    线程计算结果: 429
    线程计算结果: 440
    线程计算结果: 451
    线程计算结果: 462
    线程计算结果: 473
    线程计算结果: 484
    线程计算结果: 495
    线程计算结果: 506
    线程计算结果: 517
    线程计算结果: 528
    线程计算结果: 539
    线程计算结果: 550
    线程计算结果: 561
    线程计算结果: 572
    线程计算结果: 583
    线程计算结果: 594
    线程计算结果: 605
    线程计算结果: 616
    线程计算结果: 627
    线程计算结果: 638
    线程计算结果: 649
    线程计算结果: 660
    线程计算结果: 671
    线程计算结果: 682
    线程计算结果: 693
    线程计算结果: 704
    线程计算结果: 715
    线程计算结果: 726
    线程计算结果: 737
    线程计算结果: 748
    线程计算结果: 759
    线程计算结果: 770
    线程计算结果: 781
    线程计算结果: 792
    线程计算结果: 803
    线程计算结果: 814
    线程计算结果: 825
    线程计算结果: 836
    线程计算结果: 847
    线程计算结果: 858
    线程计算结果: 869
    线程计算结果: 880
    线程计算结果: 891
    线程计算结果: 902
    线程计算结果: 913
    线程计算结果: 924
    线程计算结果: 935
    线程计算结果: 946
    线程计算结果: 957
    线程计算结果: 968
    线程计算结果: 979
    线程计算结果: 990
    线程计算结果: 1001
    线程计算结果: 1012
    线程计算结果: 1023
    线程计算结果: 1034
    线程计算结果: 1045
    线程计算结果: 1056
    线程计算结果: 1067
    线程计算结果: 1078
    线程计算结果: 1089
    请按任意键继续. . .
  */
  std::system("pause");

  return 0;
}

```

返回数值类型如果不够存储的话，那么我们可以定义一个`MyStruct`结构体，通过结构体传递参数，并将计算结果`返回为结构`体类型。

```c
#define BOOST_THREAD_VERSION 5
#include <iostream>
#include <boost/bind.hpp>
#include <boost/thread.hpp>
#include <boost/function.hpp>

using namespace std;

typedef struct
{
    int x;
    int y;
}MyStruct;

// 定义一个返回结构体的函数
MyStruct MyThreadStruct(int x, int y)
{
    MyStruct ref;
    ref.x = x + 100;
    ref.y = y + 100;

    return ref;
}

int main(int argc, char* argv[])
{
    std::vector<boost::future<MyStruct>> vec;
    for (int x = 0; x < 100; x++)
    {
        vec.push_back(boost::async(bind(MyThreadStruct, x, x + 10)));
    }

    boost::wait_for_all(vec.begin(), vec.end());


    for (size_t i = 0; i < vec.size(); i++)
    {
        // 获取到返回值
        if (vec[i].valid())
        {
            MyStruct tmp = vec[i].get();
            cout << "获取计算结果A: " << tmp.x << " 获取结果B: " << tmp.y << endl;
        }
    }

    /*
        获取计算结果A: 100 获取结果B: 110
        获取计算结果A: 101 获取结果B: 111
        获取计算结果A: 102 获取结果B: 112
        获取计算结果A: 103 获取结果B: 113
        获取计算结果A: 104 获取结果B: 114
        获取计算结果A: 105 获取结果B: 115
        获取计算结果A: 106 获取结果B: 116
        获取计算结果A: 107 获取结果B: 117
        获取计算结果A: 108 获取结果B: 118
        获取计算结果A: 109 获取结果B: 119
        获取计算结果A: 110 获取结果B: 120
        获取计算结果A: 111 获取结果B: 121
        获取计算结果A: 112 获取结果B: 122
        获取计算结果A: 113 获取结果B: 123
        获取计算结果A: 114 获取结果B: 124
        获取计算结果A: 115 获取结果B: 125
        获取计算结果A: 116 获取结果B: 126
        获取计算结果A: 117 获取结果B: 127
        获取计算结果A: 118 获取结果B: 128
        获取计算结果A: 119 获取结果B: 129
        获取计算结果A: 120 获取结果B: 130
        获取计算结果A: 121 获取结果B: 131
        获取计算结果A: 122 获取结果B: 132
        获取计算结果A: 123 获取结果B: 133
        获取计算结果A: 124 获取结果B: 134
        获取计算结果A: 125 获取结果B: 135
        获取计算结果A: 126 获取结果B: 136
        获取计算结果A: 127 获取结果B: 137
        获取计算结果A: 128 获取结果B: 138
        获取计算结果A: 129 获取结果B: 139
        获取计算结果A: 130 获取结果B: 140
        获取计算结果A: 131 获取结果B: 141
        获取计算结果A: 132 获取结果B: 142
        获取计算结果A: 133 获取结果B: 143
        获取计算结果A: 134 获取结果B: 144
        获取计算结果A: 135 获取结果B: 145
        获取计算结果A: 136 获取结果B: 146
        获取计算结果A: 137 获取结果B: 147
        获取计算结果A: 138 获取结果B: 148
        获取计算结果A: 139 获取结果B: 149
        获取计算结果A: 140 获取结果B: 150
        获取计算结果A: 141 获取结果B: 151
        获取计算结果A: 142 获取结果B: 152
        获取计算结果A: 143 获取结果B: 153
        获取计算结果A: 144 获取结果B: 154
        获取计算结果A: 145 获取结果B: 155
        获取计算结果A: 146 获取结果B: 156
        获取计算结果A: 147 获取结果B: 157
        获取计算结果A: 148 获取结果B: 158
        获取计算结果A: 149 获取结果B: 159
        获取计算结果A: 150 获取结果B: 160
        获取计算结果A: 151 获取结果B: 161
        获取计算结果A: 152 获取结果B: 162
        获取计算结果A: 153 获取结果B: 163
        获取计算结果A: 154 获取结果B: 164
        获取计算结果A: 155 获取结果B: 165
        获取计算结果A: 156 获取结果B: 166
        获取计算结果A: 157 获取结果B: 167
        获取计算结果A: 158 获取结果B: 168
        获取计算结果A: 159 获取结果B: 169
        获取计算结果A: 160 获取结果B: 170
        获取计算结果A: 161 获取结果B: 171
        获取计算结果A: 162 获取结果B: 172
        获取计算结果A: 163 获取结果B: 173
        获取计算结果A: 164 获取结果B: 174
        获取计算结果A: 165 获取结果B: 175
        获取计算结果A: 166 获取结果B: 176
        获取计算结果A: 167 获取结果B: 177
        获取计算结果A: 168 获取结果B: 178
        获取计算结果A: 169 获取结果B: 179
        获取计算结果A: 170 获取结果B: 180
        获取计算结果A: 171 获取结果B: 181
        获取计算结果A: 172 获取结果B: 182
        获取计算结果A: 173 获取结果B: 183
        获取计算结果A: 174 获取结果B: 184
        获取计算结果A: 175 获取结果B: 185
        获取计算结果A: 176 获取结果B: 186
        获取计算结果A: 177 获取结果B: 187
        获取计算结果A: 178 获取结果B: 188
        获取计算结果A: 179 获取结果B: 189
        获取计算结果A: 180 获取结果B: 190
        获取计算结果A: 181 获取结果B: 191
        获取计算结果A: 182 获取结果B: 192
        获取计算结果A: 183 获取结果B: 193
        获取计算结果A: 184 获取结果B: 194
        获取计算结果A: 185 获取结果B: 195
        获取计算结果A: 186 获取结果B: 196
        获取计算结果A: 187 获取结果B: 197
        获取计算结果A: 188 获取结果B: 198
        获取计算结果A: 189 获取结果B: 199
        获取计算结果A: 190 获取结果B: 200
        获取计算结果A: 191 获取结果B: 201
        获取计算结果A: 192 获取结果B: 202
        获取计算结果A: 193 获取结果B: 203
        获取计算结果A: 194 获取结果B: 204
        获取计算结果A: 195 获取结果B: 205
        获取计算结果A: 196 获取结果B: 206
        获取计算结果A: 197 获取结果B: 207
        获取计算结果A: 198 获取结果B: 208
        获取计算结果A: 199 获取结果B: 209
        请按任意键继续. . .
    */
    std::system("pause");
    return 0;
}

```

由于`future`只能`get`获取一次数据，使得它不能被多线程并发访问，所以就出现了`shared_future`，它是`future`的增强，可以线程安全的多次调用`get()`获取到计算结果，修改很简单只需要将声明改一下，其他的不用动。

```c
#define BOOST_THREAD_VERSION 5
#include <iostream>
#include <boost/bind.hpp>
#include <boost/thread.hpp>
#include <boost/function.hpp>

using namespace std;

typedef struct
{
	int x;
	int y;
}MyStruct;

// 定义一个返回结构体的函数
MyStruct MyThreadStruct(int x, int y)
{
	MyStruct ref;
	ref.x = x + 100;
	ref.y = y + 100;

	return ref;
}

int main(int argc, char* argv[])
{
	std::vector<boost::shared_future<MyStruct>> vec;
	for (int x = 0; x < 100; x++)
	{
		vec.push_back(boost::async(bind(MyThreadStruct, x, x + 10)).share());
	}

	boost::wait_for_all(vec.begin(), vec.end());
	//哥们现在可以多次get了哦！！！
	for (size_t i = 0; i < vec.size(); i++)
	{
		// 获取到返回值
		if (vec[i].valid())
		{
			MyStruct tmp = vec[i].get();
			cout << "获取计算结果A: " << tmp.x << " 获取结果B: " << tmp.y << endl;
		}
	}


	std::system("pause");
	return 0;
}

```

## 共享锁

shared_mutex（共享互斥锁）是 C++11 标准库中引入的一种线程同步机制，可以实现同时有多个线程同时读取共享资源，但只能有一个线程写入共享资源的机制。与常见的互斥锁不同，shared_mutex 具有更加细致的控制对共享资源的访问权限。



该锁允许线程获取多个共享所有权和一个专享所有权，实现了读写锁机制，即多个读线程一个写线程。

```c
#define BOOST_THREAD_VERSION 5
#include <iostream>
#include <boost/bind.hpp>
#include <boost/thread.hpp>
#include <boost/function.hpp>

using namespace std;
using namespace boost;

class MyClass
{
private:
    // 读写的数据
    int m_x;

    // 定义共享互斥量
    boost::shared_mutex rw_mutex;

public:
    MyClass()
    {
        m_x = 0;
    }

    // 写数据
    void write()
    {
        //写锁定
        boost::unique_lock<boost::shared_mutex> g(rw_mutex);
        ++m_x;
    }

    // 读数据
    void read(int* x)
    {
        // 读锁定
        boost::shared_lock<boost::shared_mutex> g(rw_mutex);
        *x = m_x;
    }
};

// 定义写函数,每次调用都会写入十次
void writer(MyClass& ptr)
{
    for (int x = 0; x < 10; x++)
    {
        ptr.write();
    }
}

// 定义读函数,每次调用读取十次
void reader(MyClass& ptr)
{
    int item;
    for (int x = 0; x < 10; x++)
    {
        ptr.read(&item);
        std::cout << "读取数据: " << item << std::endl;
    }
}

int main(int argc, char* argv[])
{
    MyClass ptr;
    thread_group pool;

    // 定义2个读
    pool.create_thread(boost::bind(reader, boost::ref(ptr)));
    pool.create_thread(boost::bind(reader, boost::ref(ptr)));

    // 定义1个写
    pool.create_thread(boost::bind(writer, boost::ref(ptr)));

    pool.join_all();


    /*
        读取数据: 0
        读取数据: 0
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        读取数据: 10
        请按任意键继续. . .
    */
    std::system("pause");
    return 0;
}

```

## 获取线程ID号

实现线程池，每次将一个线程`service_io`存入到栈中，需要时从栈中弹出并调用内部相应的函数。

```c
#include <stack>
#include <iostream>
#include <boost/asio.hpp>
#include <boost/bind.hpp>
#include <boost/thread/mutex.hpp>
#include <boost/thread/thread.hpp>

using namespace std;
using namespace boost;

class ThreadPool
{
    static int count;
    int NoOfThread;
    int counter;
    thread_group group;
    boost::mutex mutex_;
    asio::io_service io_service;
    stack<boost::thread*> thread_stack;

public:
    ThreadPool(int num)
    {
        NoOfThread = num;
        counter = 0;
        boost::mutex::scoped_lock lock(mutex_);

        if (count == 0)
            count++;
        else
            return;

        // 开辟线程并放入栈中存储
        for (int i = 0; i < num; ++i)
        {
            thread_stack.push(group.create_thread(boost::bind(&asio::io_service::run, &io_service)));
        }
    }
    ~ThreadPool()
    {
        io_service.stop();
        group.join_all();
    }

    // 从栈中弹出元素
    boost::thread* get_thread()
    {
        // 判断成立说明不存在线程
        if (counter > NoOfThread)
            return NULL;

        // 否则从栈中弹出
        counter++;
        boost::thread* ptr = thread_stack.top();
        thread_stack.pop();
        return ptr;
    }
    // 获取到元素计数器
    int get_number()
    {
        return counter;
    }
};

int ThreadPool::count = 0;

int main(int argc, char* argv[])
{
    // 定义启动10个线程
    ThreadPool pool(10);

    // 循环线程池
    for (int x = 0; x < 10; x++)
    {
        boost::thread* ptr = pool.get_thread();
        cout << "线程ID: " << ptr->get_id() << endl;

        int num = pool.get_number();
        std::cout << "计数器: " << num << std::endl;
    }

    std::system("pause");
    return 0;
}

```

