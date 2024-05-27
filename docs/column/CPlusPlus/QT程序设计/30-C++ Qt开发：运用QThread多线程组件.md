# C++ Qt开发：运用QThread多线程组件

Qt 是一个跨平台C++图形界面开发库，利用Qt可以快速开发跨平台窗体应用程序，在Qt中我们可以通过拖拽的方式将不同组件放到指定的位置，实现图形化开发极大的方便了开发效率，本章将重点介绍如何运用`QThread`组件实现多线程功能。

多线程技术在程序开发中尤为常用，Qt框架中提供了`QThread`库来实现多线程功能。当你需要使用`QThread`时，需包含`QThread`模块，以下是`QThread`类的一些主要成员函数和槽函数。

| 成员函数/槽函数                                            | 描述                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| `QThread(QObject *parent = nullptr)`                       | 构造函数，创建一个QThread对象。                              |
| `~QThread()`                                               | 析构函数，释放QThread对象。                                  |
| `void start(QThread::Priority priority = InheritPriority)` | 启动线程。                                                   |
| `void run()`                                               | 默认的线程执行函数，需要在继承QThread的子类中重新实现以定义线程的操作。 |
| `void exit(int returnCode = 0)`                            | 请求线程退出，线程将在适当的时候退出。                       |
| `void quit()`                                              | 请求线程退出，与exit()类似。                                 |
| `void terminate()`                                         | 立即终止线程的执行。这是一个危险的操作，可能导致资源泄漏和未完成的操作。 |
| `void wait()`                                              | 等待线程完成。主线程将被阻塞，直到该线程退出。               |
| `bool isRunning() const`                                   | 检查线程是否正在运行。                                       |
| `void setPriority(Priority priority)`                      | 设置线程的优先级。                                           |
| `Priority priority() const`                                | 获取线程的优先级。                                           |
| `QThread::Priority priority()`                             | 获取线程的优先级。                                           |
| `void setStackSize(uint stackSize)`                        | 设置线程的堆栈大小（以字节为单位）。                         |
| `uint stackSize() const`                                   | 获取线程的堆栈大小。                                         |
| `void msleep(unsigned long msecs)`                         | 使线程休眠指定的毫秒数。                                     |
| `void sleep(unsigned long secs)`                           | 使线程休眠指定的秒数。                                       |
| `static QThread *currentThread()`                          | 获取当前正在执行的线程的QThread对象。                        |
| `void setObjectName(const QString &name)`                  | 为线程设置一个对象名。                                       |

显示详细信息

当我们需要创建线程时，通常第一步则是要继承`QThread`类，并重写类内的`run()`方法，在`run()`方法中，你可以编写需要在新线程中执行的代码。当你创建一个`QThread`的实例并调用它的`start()`方法时，会自动调用`run()`来执行线程逻辑，如下这样一段代码展示了如何运用线程类。

```c
#include <QCoreApplication>
#include <QThread>
#include <QDebug>

class MyThread : public QThread
{
public:
    void run() override
    {
        for (int i = 0; i < 5; ++i)
        {
            qDebug() << "Thread is running" << i;
            sleep(1);
        }
    }
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    MyThread thread;
    thread.start();
    thread.wait();

    qDebug() << "Main thread is done.";
    return a.exec();
}
```

上述代码运行后则会每隔1秒输出一段话，在主函数内通过调用`thread.start`方法启动这个线程，并通过`thread.wait`等待线程结束，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/bc8922076c663d8002e88a5a63897a41%5B1%5D.png)

#### 1.1 线程组与多线程

线程组是一种组织和管理多个线程的机制，允许将相关联的线程集中在一起，便于集中管理、协调和监控。通过线程组，可以对一组线程进行统一的生命周期管理，包括启动、停止、调度和资源分配等操作。

上述方法并未真正实现多线程功能，我们继续完善`MyThread`自定义类，在该类内增加两个标志，`is_run()`用于判断线程是否正在运行，`is_finish()`则用来判断线程是否已经完成，并在`run()`中增加打印当前线程对象名称的功能。

```c
class MyThread: public QThread
{
protected:
    volatile bool m_to_stop;

protected:
    void run()
    {
        for(int x=0; !m_to_stop && (x <10); x++)
        {
            msleep(1000);
            std::cout << objectName().toStdString() << std::endl;
        }
    }

public:
    MyThread()
    {
        m_to_stop = false;
    }

    void stop()
    {
        m_to_stop = true;
    }

    void is_run()
    {
        std::cout << "Thread Running = " << isRunning() << std::endl;
    }

    void is_finish()
    {
        std::cout << "Thread Finished = " << isFinished() << std::endl;
    }

};
```

接着在主函数内调整，增加一个`MyThread thread[10]`用于存储线程组，线程组是一种用于组织和管理多个线程的概念。在不同的编程框架和操作系统中，线程组可能具有不同的实现和功能，但通常用于提供一种集中管理和协调一组相关线程的机制。

我们通过循环的方式依次对线程组进行赋值，通过调用`setObjectName`对每一个线程赋予一个不同的名称，当需要使用这些线程时则可以通过循环调用`run()`方法来实现，而结束调用同样如此，如下是调用的具体实现；

```c
#include <QCoreApplication>
#include <iostream>
#include <QThread>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    // 定义线程数组
    MyThread thread[10];

    // 设置线程对象名字
    for(int x=0;x<10;x++)
    {
        thread[x].setObjectName(QString("thread => %1").arg(x));
    }

    // 批量调用run执行
    for(int x=0;x<10;x++)
    {
        thread[x].start();
        thread[x].is_run();
        thread[x].isFinished();
    }

    // 批量调用stop关闭
    for(int x=0;x<10;x++)
    {
        thread[x].wait();
        thread[x].stop();

        thread[x].is_run();
        thread[x].is_finish();
    }

    return a.exec();
}
```

如下图则是运行后实现的多线程效果；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/4af5fee4e65d7dd8b88faa610e66c457%5B1%5D.png)

#### 1.2 向线程中传递参数

向线程中传递参数是多线程编程中常见的需求，不同的编程语言和框架提供了多种方式来实现这个目标，在Qt中，由于使用的自定义线程类，所以可通过增加一个`set_value()`方法来向线程内传递参数，由于线程函数内的变量使用了`protected`属性，所以也就实现了线程间变量的隔离，当线程被执行结束后则可以通过`result()`方法获取到线程执行结果，这个线程函数如下所示；

```c
class MyThread: public QThread
{
protected:
    int m_begin;
    int m_end;
    int m_result;

    void run()
    {
        m_result = m_begin + m_end;
    }

public:
    MyThread()
    {
        m_begin = 0;
        m_end = 0;
        m_result = 0;
    }

    // 设置参数给当前线程
    void set_value(int x,int y)
    {
        m_begin = x;
        m_end = y;
    }

    // 获取当前线程名
    void get_object_name()
    {
        std::cout << "this thread name => " << objectName().toStdString() << std::endl;
    }

    // 获取线程返回结果
    int result()
    {
        return m_result;
    }
};
```

在主函数中，我们通过`MyThread thread[3];`来定义3个线程组，并通过循环三次分别`thread[x].set_value()`设置三组不同的参数，当设置完成后则可以调用`thread[x].start()`方法运行这些线程，线程运行结束后则返回值将会被依次保存在`thread[x].result()`中，此时直接将其相加即可得到最终线程执行结果；

```c
#include <QCoreApplication>
#include <iostream>
#include <QThread>

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    MyThread thread[3];

    // 分别将不同的参数传入到线程函数内
    for(int x=0; x<3; x++)
    {
        thread[x].set_value(1,2);
        thread[x].setObjectName(QString("thread -> %1").arg(x));
        thread[x].start();
    }

    // 等待所有线程执行结束
    for(int x=0; x<3; x++)
    {
        thread[x].get_object_name();
        thread[x].wait();
    }

    // 获取线程返回值并相加
    int result = thread[0].result() + thread[1].result() + thread[2].result();
    std::cout << "sum => " << result << std::endl;

    return a.exec();
}
```

程序运行后，则可以输出三个线程相加的和；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/cd9b27ae8041f64a7d3446d313e21fcb%5B1%5D.png)

#### 1.3 互斥同步线程锁

`QMutex` 是Qt框架中提供的用于线程同步的类，用于实现互斥访问共享资源。Mutex是“互斥锁（Mutual Exclusion）”的缩写，它能够确保在任意时刻，只有一个线程可以访问被保护的资源，从而避免了多线程环境下的数据竞争和不一致性。

在Qt中，`QMutex`提供了简单而有效的线程同步机制，其基本用法包括：

- **锁定（Lock）：** 线程在访问共享资源之前，首先需要获取`QMutex`的锁，这通过调用`lock()`方法来实现。
- **解锁（Unlock）：** 当线程使用完共享资源后，需要释放`QMutex`的锁，以允许其他线程访问，这通过调用`unlock()`方法来实现。

该锁`lock()`锁定与`unlock()`解锁必须配对使用，线程锁保证线程间的互斥，利用线程锁能够保证临界资源的安全性。

- 线程锁解决的问题: 多个线程同时操作同一个全局变量，为了防止资源的无序覆盖现象，从而需要增加锁，来实现多线程抢占资源时可以有序执行。
- 临界资源(Critical Resource): 每次只允许一个线程进行访问 (读/写)的资源。
- 线程间的互斥(竞争): 多个线程在同一时刻都需要访问临界资源。
- 一般性原则: 每一个临界资源都需要一个线程锁进行保护。

我们以生产者消费者模型为例来演示锁的使用方法，生产者消费者模型是一种并发编程中常见的同步机制，用于解决多线程环境下的协作问题。该模型基于两类角色：生产者（Producer）和消费者（Consumer），它们通过共享的缓冲区进行协作。

主要特点和工作原理如下：

1. 生产者：
   - 生产者负责产生一些资源或数据，并将其放入共享的缓冲区中。生产者在生产资源后，需要通知消费者，以便它们可以取走资源。
2. 消费者：
   - 消费者从共享的缓冲区中取走资源，并进行相应的处理。如果缓冲区为空，消费者需要等待，直到有新的资源可用。
3. 共享缓冲区：
   - 作为生产者和消费者之间的交换介质，共享缓冲区存储被生产者产生的资源。它需要提供对资源的安全访问，以防止竞态条件和数据不一致性。
4. 同步机制：
   - 生产者和消费者之间需要一些同步机制，以确保在正确的时机进行资源的生产和消费。典型的同步机制包括信号量、互斥锁、条件变量等。

生产者消费者模型的典型应用场景包括异步任务处理、事件驱动系统、数据缓存等。这种模型的实现可以通过多线程编程或使用消息队列等方式来完成。

首先在全局中引入`#include <QMutex>`库，并在全局定义`static QMutex`线程锁变量，接着我们分别定义两个自定义线程函数，其中`Producer`代表生产者，而`Customer`则是消费者，生产者中负责每次产出一个随机数并将其追加到`g_store`全局变量内保存，消费者则通过`g_store.remove`每次取出一个元素。

```c
static QMutex g_mutex;      // 线程锁
static QString g_store;     // 定义全局变量

class Producer : public QThread
{
protected:
    void run()
    {
        int count = 0;

        while(true)
        {
            // 加锁
            g_mutex.lock();

            g_store.append(QString::number((count++) % 10));
            std::cout << "Producer -> "<< g_store.toStdString() << std::endl;

            // 释放锁
            g_mutex.unlock();
            msleep(900);
        }
    }
};

class Customer : public QThread
{
protected:
    void run()
    {
        while( true )
        {
            g_mutex.lock();
            if( g_store != "" )
            {
                g_store.remove(0, 1);
                std::cout << "Curstomer -> "<< g_store.toStdString() << std::endl;
            }

            g_mutex.unlock();
            msleep(1000);
        }
    }
};
```

在主函数中分别定义两个线程类，并依次运行它们；

```c
int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    Producer p;
    Customer c;

    p.setObjectName("producer");
    c.setObjectName("curstomer");

    p.start();
    c.start();

    return a.exec();
}
```

至此，生产者产生数据，消费者消费数据；如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/423311c9bfccfd4bc8d0ed7f5c9dbe6c%5B1%5D.png)



`QMutexLocker` 是Qt框架中提供的一个辅助类，它是在`QMutex`基础上简化版的线程锁，`QMutexLocker`会保护加锁区域，并自动实现互斥量的锁定和解锁操作，可以将其理解为是智能版的`QMutex`锁，通过 `QMutexLocker`可以确保在作用域内始终持有锁，从而避免因为忘记释放锁而导致的问题。该锁只需要在上方代码中稍加修改即可。

使用 `QMutexLocker` 的一般流程如下：

1. 创建一个 `QMutex` 对象。
2. 创建一个 `QMutexLocker` 对象，传入需要锁定的 `QMutex`。
3. 在 `QMutexLocker` 对象的作用域内进行需要互斥访问的操作。
4. 当 `QMutexLocker` 对象超出作用域范围时，会自动释放锁。

```c
static QMutex g_mutex;      // 线程锁
static QString g_store;     // 定义全局变量

class Producer : public QThread
{
protected:
    void run()
    {
        int count = 0;

        while(true)
        {
			// 增加智能线程锁
            QMutexLocker Locker(&g_mutex);

            g_store.append(QString::number((count++) % 10));
            std::cout << "Producer -> "<< g_store.toStdString() << std::endl;

            msleep(900);
        }
    }
};
```

#### 1.4 读写同步线程锁

QReadWriteLock 是Qt框架中提供的用于实现读写锁的类。读写锁允许多个线程同时读取共享数据，但在写入数据时会互斥，确保数据的一致性和完整性。这对于大多数情况下读取频繁而写入较少的共享数据非常有用，可以提高程序的性能。

其提供了两种锁定操作：

- **读取锁（Read Lock）：** 允许多个线程同时获取读取锁，用于并行读取共享数据。在没有写入锁的情况下，多个线程可以同时持有读取锁。
- **写入锁（Write Lock）：** 写入锁是互斥的，当一个线程获取写入锁时，其他线程无法获取读取锁或写入锁。这确保了在写入数据时，不会有其他线程同时读取或写入。

互斥锁存在一个问题，每次只能有一个线程获得互斥量的权限，如果在程序中有多个线程来同时读取某个变量，那么使用互斥量必须排队，效率上会大打折扣，基于`QReadWriteLock`读写模式进行代码段锁定，即可解决互斥锁存在的问题。

```c
#include <QCoreApplication>
#include <iostream>
#include <QThread>
#include <QMutex>
#include <QReadWriteLock>

static QReadWriteLock g_mutex;      // 线程锁
static QString g_store;             // 定义全局变量

class Producer : public QThread
{
protected:
    void run()
    {
        int count = 0;

        while(true)
        {
            // 以写入方式锁定资源
            g_mutex.lockForWrite();

            g_store.append(QString::number((count++) % 10));

            // 写入后解锁资源
            g_mutex.unlock();

            msleep(900);
        }
    }
};

class Customer : public QThread
{
protected:
    void run()
    {
        while( true )
        {
            // 以读取方式写入资源
            g_mutex.lockForRead();
            if( g_store != "" )
            {
                std::cout << "Curstomer -> "<< g_store.toStdString() << std::endl;
            }

            // 读取到后解锁资源
            g_mutex.unlock();
            msleep(1000);
        }
    }
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    Producer p1,p2;
    Customer c1,c2;

    p1.setObjectName("producer 1");
    p2.setObjectName("producer 2");

    c1.setObjectName("curstomer 1");
    c2.setObjectName("curstomer 2");

    p1.start();
    p2.start();

    c1.start();
    c2.start();

    return a.exec();
}
```

该锁允许用户以同步读`lockForRead()`或同步写`lockForWrite()`两种方式实现保护资源，但只要有一个线程在以写的方式操作资源，其他线程也会等待写入操作结束后才可继续读资源。

#### 1.5 基于信号线程锁

QSemaphore 是Qt框架中提供的用于实现信号量的类。信号量是一种用于在线程之间进行同步和通信的机制，它允许多个线程在某个共享资源上进行协调，控制对该资源的访问。`QSemaphore` 的主要作用是维护一个计数器，线程可以通过获取和释放信号量来改变计数器的值。

其主要方法包括：

- `QSemaphore(int n = 0)`：构造函数，创建一个初始计数值为 `n` 的信号量。
- `void acquire(int n = 1)`：获取信号量，将计数器减去 `n`。如果计数器不足，线程将阻塞等待。
- `bool tryAcquire(int n = 1)`：尝试获取信号量，如果计数器足够，立即获取并返回 `true`；否则返回 `false`。
- `void release(int n = 1)`：释放信号量，将计数器加上 `n`。如果有等待的线程，其中一个将被唤醒。

信号量是特殊的线程锁，信号量允许N个线程同时访问临界资源，通过`acquire()`获取到指定资源，`release()`释放指定资源。

```c
#include <QCoreApplication>
#include <iostream>
#include <QThread>
#include <QSemaphore>

const int SIZE = 5;
unsigned char g_buff[SIZE] = {0};

QSemaphore g_sem_free(SIZE); // 5个可生产资源
QSemaphore g_sem_used(0);    // 0个可消费资源

// 生产者生产产品
class Producer : public QThread
{
protected:
    void run()
    {
        while( true )
        {
            int value = qrand() % 256;

            // 若无法获得可生产资源，阻塞在这里
            g_sem_free.acquire();

            for(int i=0; i<SIZE; i++)
            {
                if( !g_buff[i] )
                {
                    g_buff[i] = value;
                    std::cout << objectName().toStdString() << " --> " << value << std::endl;
                    break;
                }
            }

            // 可消费资源数+1
            g_sem_used.release();

            sleep(2);
        }
    }
};

// 消费者消费产品
class Customer : public QThread
{
protected:
    void run()
    {
        while( true )
        {
            // 若无法获得可消费资源，阻塞在这里
            g_sem_used.acquire();

            for(int i=0; i<SIZE; i++)
            {
                if( g_buff[i] )
                {
                    int value = g_buff[i];

                    g_buff[i] = 0;
                    std::cout << objectName().toStdString() << " --> " << value << std::endl;
                    break;
                }
            }

            // 可生产资源数+1
            g_sem_free.release();

            sleep(1);
        }
    }
};

int main(int argc, char *argv[])
{
    QCoreApplication a(argc, argv);

    Producer p1;
    Customer c1;

    p1.setObjectName("producer");
    c1.setObjectName("curstomer");

    p1.start();
    c1.start();

    return a.exec();
}
```