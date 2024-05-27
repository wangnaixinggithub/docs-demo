# C++整合LOG4CPlus

log4cplus是C++编写的开源的日志系统，前身是java编写的log4j系统，受Apache Software License保护，作者是Tad E. Smith。

log4cplus具有线程安全、灵活、以及多粒度控制的特点，通过将日志划分优先级使其可以面向程序调试、运行、测试、和维护等全生命周期。你可以选择将日志输出到屏幕、文件、NT event log、甚至是远程服务器；通过指定策略对日志进行定期备份等等。下面我们在学习如何整合`LOG4CPlus`


# Github下载

```shell
https://github.com/log4cplus/log4cplus 
https://log4cplus.github.io/log4cplus/docs/log4cplus-2.1.0/doxygen/files.html
https://sourceforge.net/projects/log4cplus/files/log4cplus-stable/
```

因笔者的平台工具集是2010，所以使用的版本是`log4cplus-1.2.1.zip`,

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231222204328020-17032490091001.png)

# 编译动态库

有windows下的Visual Studio环境的，可以打开Visual Studio，进入 log4cplus-1.x\msvc10目录下，运行log4cplus.sln解决方案。指定`Release_Unicode`编译。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231222204400019-17032490413292.png)



编译之后得到动态库对应的lib以及dll,笔者是在如下目录可查到。

```
C:\Users\82737\Desktop\log4cplus-1.2.1\msvc10\x64\bin.Release_Unicode
```

- `log4cplusU.dll`
- `log4cplusU.lib`

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231222204551393-17032491524733.png)

# 整合到工程

```c

#include <log4cplus/logger.h>
#include <log4cplus/consoleappender.h>
#include <log4cplus/layout.h>
#include <log4cplus/ndc.h>
#include <log4cplus/mdc.h>
#include <log4cplus/helpers/loglog.h>
#include <log4cplus/thread/threads.h>
#include <log4cplus/helpers/sleep.h>
#include <log4cplus/loggingmacros.h>
#include <iostream>
#include <string>

using namespace std;
using namespace log4cplus;
using namespace log4cplus::helpers;

int
main()
{
    cout << "Entering main()..." << endl;
    
    //WINDOWS平台必须 用init ,Github主页有说明。
    log4cplus::initialize ();
    LogLog::getLogLog()->setInternalDebugging(true);
    try {
        SharedObjectPtr<Appender> append_1(new ConsoleAppender());
        append_1->setName(LOG4CPLUS_TEXT("First"));

        log4cplus::getMDC ().put (LOG4CPLUS_TEXT ("key"),
            LOG4CPLUS_TEXT ("MDC value"));
        log4cplus::tstring pattern = LOG4CPLUS_TEXT("%d{%m/%d/%y %H:%M:%S,%Q} [%t] %-5p %c{2} %%%x%% - %X{key} - %m [%l]%n");
        //	std::tstring pattern = LOG4CPLUS_TEXT("%d{%c} [%t] %-5p [%.15c{3}] %%%x%% - %m [%l]%n");
        append_1->setLayout( std::auto_ptr<Layout>(new PatternLayout(pattern)) );
        Logger::getRoot().addAppender(append_1);

        Logger logger = Logger::getInstance(LOG4CPLUS_TEXT("test.a.long_logger_name.c.logger"));
        LOG4CPLUS_DEBUG(logger, "This is the FIRST log message...");

        sleep(1, 0);
        {
            NDCContextCreator ndc(LOG4CPLUS_TEXT("second"));
            LOG4CPLUS_INFO(logger, "This is the SECOND log message...");
        }

        sleep(1, 0);
        LOG4CPLUS_WARN(logger, "This is the THIRD log message...");

        sleep(1, 0);
        LOG4CPLUS_ERROR(logger, "This is the FOURTH log message...");

        sleep(1, 0);
        LOG4CPLUS_FATAL(logger, "This is the FIFTH log message...");
    }
    catch(...) {
        cout << "Exception..." << endl;
        Logger::getRoot().log(FATAL_LOG_LEVEL, LOG4CPLUS_TEXT("Exception occured..."));
    }

    cout << "Exiting main()..." << endl;
    return 0;
}


```

因为是`Release_Unicode`,对应到项目必须要取其。也是用`Release X64` 编译。示例代码是抄的测试工程`patternlayout_test`。读者可以视情况学习。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231222204809425.png)



# 验证整合成功

dll放在和exe文件同级，运行exe,可以看到控制台成功展示了结果，证实整合成功。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231222204904679-17032493458744.png)
