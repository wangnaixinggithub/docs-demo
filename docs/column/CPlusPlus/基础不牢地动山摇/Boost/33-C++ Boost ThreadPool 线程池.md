# C++ Boost ThreadPool 线程池

默认的[Boost](https://so.csdn.net/so/search?q=Boost&spm=1001.2101.3001.7020)框架中支持多线程操作，但是并不支持线程池，我们可以下载一个boost::threadpool来让其支持线程池.



> [threadpool Documentation (sourceforge.net)](https://threadpool.sourceforge.net/)



```c
#include <iostream>
#include <string>
#include "boost/threadpool.hpp"

void first_task()
{
    std::cout << "hello lyshark" << std::endl;
}

void last_task(int uuid, std::string uname)
{
    std::cout << "UUID: " << uuid << " Uname: " << uname << std::endl;
}

int main(int argc, char* argv[])
{
    // 初始化为4个线程
    boost::threadpool::pool pool(4);

    // 无参数调用
    pool.schedule(&first_task);
    pool.wait();

    // 有参数调用
    pool.schedule(boost::bind(last_task, 1001, "lyshark"));
    pool.wait();

    std::system("pause");
    return 0;
}
```

ThreadPool 线程池是一个跨平台的C++库。一般来说，线程池是在同一进程中进行异步任务处理的有效机制。他们意识到线程池模式。



线程池管理一组线程，以便处理大量任务。由于多个线程可以并行执行，因此这种方法对于许多计算机系统上的整体程序性能可能是非常有效的。通过限制线程的数量并重用它们，节省了资源，此外还提高了系统的稳定性。



线程池库为调度异步任务提供了一种方便的方式。池可以自定义、动态管理，并且可以轻松地集成到您的软件中。



首先来看一下,如何实现无参数和有参数的调用,同上这里就不在解释了.

