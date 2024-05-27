# gdb调试程序



GDB是一个由GNU开源组织发布的、UNIX/[LINUX操作系统](https://so.csdn.net/so/search?q=LINUX操作系统&spm=1001.2101.3001.7020)下的、基于命令行的、功能强大的程序调试工具。 对于一名Linux下工作的c/c++程序员，gdb是必不可少的工具；虽然它是命令行模式的调试工具，但是它的功能强大到你无法想象，能够让用户在程序运行时观察程序的内部结构和内存的使用情况。



## 安装gdb

如果没有安装gdb则可以通过`yum install` 来安装下。

```shell
[root@localhost tools]# yum install -y gdb
Loaded plugins: fastestmirror, langpacks
....
Package gdb-7.6.1-120.el7.x86_64 already installed and latest version
Nothing to do
[root@localhost tools]# 
```

## gbd基本使用

:::details 启动`gdb`的调用语法

```shell
gdb 目标程序
gdb -q 目标程序
gdb Main -p 7083
gdb 目标程序 -p 附加到指定进程的进程ID
```

> 表示不打印`gdb` 软件版本信息，使得界面较为干净。

:::



:::details `gdb` 调试时常用命令

|      命令      | 简写 | 命令说明                                                     |
| :------------: | ---- | :----------------------------------------------------------- |
|   `set args`   |      | 设置程序运行的参数,比如说./Main 张三 李四 我喜欢你； 则设置参数的方法为 set args 张三 李四 我喜欢你 |
|    `break`     | b    | 设置断点，b 20 表示在第20行设置断点，可以设置多个断点。      |
|     `run`      | r    | 开始/重新运行程序, 程序运行到断点的位置会停下来，如果没有遇到断点，程序一直运行下去。 |
|     `next`     | n    | 执行当前行语句，如果该语句为函数调用，不会进入函数内部。 VS的F10 |
|     `step`     | s    | 执行当前行语句，如果该语句为函数调用，则进入函数内部。如果是库函数或者第三方库函数，则进不到函数内部，因为没有源代码，只要有源码的地方都能进去。VS的F11 |
|    `print`     | p    | 显示变量或表达式的值，如果是指针变量则显示指针指向的变量的地址。 如果p后面是表达式，会执行这个表达式。还可以作为变量的赋值语句来用 |
|   `continue`   | c    | 继续运行程序，遇到下一个断点停止，如果没有遇到断点，程序将一直运行。VS的F5 |
|   `set var`    |      | 设置变量的值，假如程序中定义了两个变量 int i; char name[21]; set var i = 10086 set var name = "JacksonWang" |
|     `quit`     | q    | 退出gdb                                                      |
|    `start`     |      | 单步执行，运行程序，并停留在第一个执行语句。                 |
|    `finsh`     |      | 在进入到函数内部的情况下，结束当前函数，回到函数调用点       |
|  `backtrace`   | bt   | 查函数调用堆栈                                               |
|    `until`     |      | 当你厌倦了在一个循环体内单步跟踪时，这个命令可以运行程序直到退出循环体。until+行号： 运行至某行，不仅仅用来跳出循环 |
| `b 23 if a＞b` |      | 条件断点设置， if后面跟着条件。                              |

:::

这里用c++程序做基本演示。c程序也是同样的道理的。

```c:line-numbers
#include<iostream>
using namespace std;
void Show(const char* forName,const char* toName,const char* speakMsg)
{
    cout << forName  << "开始向" << toName << "表白。" << endl;
    cout << speakMsg << endl;
    cout << forName << "表白完成!" << endl; 
}
int main(int argc,char* argv[],char* envp[])
{
    if(argc != 4)
    { 
        cout << "神级表白神器SDK的使用方法: ./Main 追求者姓名 被追求者姓名 表白内容" << endl;
        return -1;
    }
    cout << "表白前的预处理工作1" << endl;
    cout << "表白前的预处理工作2" << endl;
    cout << "表白前的预处理工作3" << endl;
    cout << "表白前的预处理工作4" << endl;
    Show(argv[1],argv[2],argv[3]);
    cout << "表白完成!" << endl;    
    //这里开始使用条件断点，玩一下
    for (size_t i = 0; i < 10; i++)
    {
        string str = "这是第" + to_string(i) + "个超级女生。" ;
        cout << str << endl;
    }
    return 0;
}
```

注意，如果希望你的程序可调试，编译时需要加`-g`选项，并且，不能使用`-O`的优化选项。

```makefile{4}
all: Main
# 为了可执行生成可以调试，g++ 加入 -g附加参数
Main:Main.cpp
	g++ -g -o Main  Main.cpp 	
clean:
	rm -rf HelloWorld \
	rm -rf HelloWorld_1\
	rm -rf Main
```

```
# 跑一下程序
root@localhost app]# make
g++ -g -o Main  Main.cpp 
[root@localhost app]# ./Main 张三 李四 我爱你
表白前的预处理工作1
表白前的预处理工作2
表白前的预处理工作3
表白前的预处理工作4
张三开始向李四表白。
我爱你
张三表白完成!
这是第0个超级女生。
这是第1个超级女生。
这是第2个超级女生。
这是第3个超级女生。
这是第4个超级女生。
这是第5个超级女生。
这是第6个超级女生。
这是第7个超级女生。
这是第8个超级女生。
这是第9个超级女生。
[root@localhost app]# 
```

```shell
#开始调试
[root@localhost app]# gdb Main
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /root/app/Main...done.

# 设置程序运行参数
(gdb) set args 张三 李四 我喜欢你

# 23行来一个断点
(gdb) b 23
Breakpoint 1 at 0x400ffc: file Main.cpp, line 23.

# 直接跳转到断点会失效，因为调试之前必须开始要先运行程序
(gdb) c
The program is not being run.

# 开始调试，程序在第一个断点处停止
(gdb) r
Starting program: /root/app/Main 张三 李四 我喜欢你
Breakpoint 1, main (argc=4, argv=0x7fffffffdce8, envp=0x7fffffffdd10) at Main.cpp:23
23          cout << "表白前的预处理工作1" << endl;
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libgcc-4.8.5-44.el7.x86_64 libstdc++-4.8.5-44.el7.x86_64

# 设置第二个断点
(gdb) b 27 
Breakpoint 2 at 0x40106c: file Main.cpp, line 27.

# 直接切到第二个断点
(gdb) c
Continuing.
表白前的预处理工作1
表白前的预处理工作2
表白前的预处理工作3
表白前的预处理工作4

# 第二个断点是一处函数调用
Breakpoint 2, main (argc=4, argv=0x7fffffffdce8, envp=0x7fffffffdd10) at Main.cpp:27
27          Show(argv[1],argv[2],argv[3]);

#步入函数实现
(gdb) s
Show (forName=0x7fffffffdfb2 "张三", toName=0x7fffffffdfb9 "李四", speakMsg=0x7fffffffdfc0 "我喜欢你") at Main.cpp:6
6           cout << forName  << "开始向" << toName << "表白。" << endl;
(gdb) n
张三开始向李四表白。
7           cout << speakMsg << endl;
(gdb) n
我喜欢你
8           cout << forName << "表白完成!" << endl; 
(gdb) n
张三表白完成!
9       }
(gdb) n
main (argc=4, argv=0x7fffffffdce8, envp=0x7fffffffdd10) at Main.cpp:29
29          for (size_t i = 0; i < 10; i++)
(gdb) n
31              string str = "这是第" + to_string(i) + "个超级女生。" ;

# 查局部变量 使用表达式之后的值，这里直接查这个字符串长度
(gdb) p strlen(str)
$1 = 4
(gdb) 

# 查局部变量值
(gdb) p str
$2 = ""

(gdb) n
32              cout << str << endl;

(gdb) p str
$3 = "这是第0个超级女生。"
(gdb) 
```

## gdb设置变量值

```shell
[root@localhost app]# gdb Main
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /root/app/Main...done.
(gdb) set args 张三 李四 我喜欢你
(gdb) b 28
Breakpoint 1 at 0x401098: file Main.cpp, line 28.
(gdb) r
Starting program: /root/app/Main 张三 李四 我喜欢你
表白前的预处理工作1
表白前的预处理工作2
表白前的预处理工作3
表白前的预处理工作4
张三开始向李四表白。
我喜欢你
张三表白完成!

Breakpoint 1, main (argc=4, argv=0x7fffffffdce8, envp=0x7fffffffdd10) at Main.cpp:28
28          cout << "表白完成!" << endl;    
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libgcc-4.8.5-44.el7.x86_64 libstdc++-4.8.5-44.el7.x86_64
(gdb) n
表白完成!
31          for (size_t i = 0; i < 10; i++)
(gdb) n
33              string str = "这是第" + to_string(i) + "个超级女生。" ;
(gdb) n
34              cout << str << endl;
(gdb) n
这是第0个超级女生。
33              string str = "这是第" + to_string(i) + "个超级女生。" ;
# 查局部变量i的值
(gdb) p i
$1 = 0

# 设置局部变量i值为6之后，这个FOR循环要跑10次的，设置完了之后只跑了4次。
(gdb) set var i=6
(gdb) c
Continuing.
这是第7个超级女生。
这是第8个超级女生。
这是第9个超级女生。
[Inferior 1 (process 5114) exited normally]

```

```shell
[root@localhost app]# gdb Main
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /root/app/Main...done.
(gdb) b 31 
Breakpoint 1 at 0x4010b4: file Main.cpp, line 31.
(gdb) r
Starting program: /root/app/Main 
神级表白神器SDK的使用方法: ./Main 追求者姓名 被追求者姓名 表白内容
[Inferior 1 (process 5903) exited with code 0377]
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libgcc-4.8.5-44.el7.x86_64 libstdc++-4.8.5-44.el7.x86_64
(gdb) set args 张三 李四 我喜欢你
(gdb) r
Starting program: /root/app/Main 张三 李四 我喜欢你
表白前的预处理工作1
表白前的预处理工作2
表白前的预处理工作3
表白前的预处理工作4
张三开始向李四表白。
我喜欢你
张三表白完成!
表白完成!
Breakpoint 1, main (argc=4, argv=0x7fffffffdce8, envp=0x7fffffffdd10) at Main.cpp:31
31          for (size_t i = 0; i < 10; i++)
(gdb) n
33              string str = "这是第" + to_string(i) + "个超级女生。" ;
(gdb) p i
$1 = 0
# 设置 变量 i的值的另一种方式 p 变量 = 变量值
(gdb) p i = 8
$2 = 8
(gdb) n
34              cout << str << endl;
(gdb) n
这是第8个超级女生。
33              string str = "这是第" + to_string(i) + "个超级女生。" ;
(gdb) p i 
$3 = 8
(gdb) c
Continuing.
这是第9个超级女生。
[Inferior 1 (process 5979) exited normally]
(gdb) 
```

## gdb调试Core文件

`Core Dump`：Core的意思是内存，Dump的意思是扔出来，堆出来（段错误）。



实际开发和使用Unix程序时，有的时候，程序莫名其妙的down了，却没有任何的提示(有时候会提示core dumped)。



这时候可以查看一下有没有形如core.进程号的文件生成，这个文件便是操作系统把程序down掉时的内存内容扔出来生成的, 它可以做为调试程序的参考，能够很大程序帮助我们定位问题。那怎么生成Core文件呢？



产生`coredump`的条件，首先需要确认当前会话的`ulimit –c`，为无限制即`unlimied` . 若为0，则不会产生对应的`coredump`，需要进行修改和设置。我们可以通过`ulimit -c` 来查系统资源限制中的core file 文件大小。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217104841549-17027813225642.png)



因为我们需要`coredump`,所以我们需要让core文件能够产生,设置core大小为无限:

```shell
ulimit -c unlimied
```

在实际开发时，我们还得更改core dump 文件的生成目录。



因为core dump默认会生成在程序的工作目录，但是有些程序存在切换目录的情况，导致core dump生成的路径没有规律。所以最好是自己建立一个文件夹，存放生成的core文件。

笔者这里建立一个 `/data/coredump `文件夹，即表示在根目录data里的coredump文件夹，来作为统一管理`coredump`



首先通过修改`/proc/sys/kernel/core_pattern`来控制core文件保存位置和文件格式。

```shell
vim /etc/sysctl.conf
## sysctl.conf文件的最后增加一行
# 执行coredump文件生成路径文件模板 当然也可使用相对路径
# 你需要确保目录已经存在
kernel.core_pattern = /data/coredump/core-%e-%p-%t 
# 配置不在文件名后加上pid
kernel.core_uses_pid=0 
```

从而最终达到将core文件统一生成到`/data/coredump`目录下并产生的文件名为`core-命令名-pid-时间戳` 为格式的文件的目的。

:::details coredump文件模板匹配格式设定


%p - insert pid into filename 添加pid



%u - insert current uid into filename 添加当前uid



%g - insert current gid into filename 添加当前gid



%s - insert signal that caused the coredump into the filename 添加导致产生core的信号



%t - insert UNIX time that the coredump occurred into filename 添加core文件生成时的unix时间



%h - insert hostname where the coredump happened into filename 添加主机名



%e - insert coredumping executable name into filename 添加命令名

:::



最后，重启后生效，或者执行`sysctl -p`立即生效。

下面来演示下如果根据`coredump`文件来排查程序崩溃问题的做法。

```c
#include <cstring>
#include <iostream>
using namespace std;

void MemeryError(const int bh,const string xm)
{

  char *ptr=nullptr;
  *ptr=3; //空指针解引用赋值 必然内存泄漏
  //strcpy(ptr,xm.c_str()); // 把内容赋值给一段不存在的空间，必然内存泄漏
}

void DoYourBiz(const int no,const string name)
{
  MemeryError(3,"xxxx2");
}

int main()
{
  DoYourBiz(8,"xxxx");

  return 0;
}
```

```shell
[root@localhost app]# make
g++ -g -o Main  Main.cpp 
# 跑程序，因为内存泄漏程序崩了，会提示 Segmentation fault (core dumped)
[root@localhost app]# ./Main 
Segmentation fault (core dumped)
# 开始验尸分析原因
# 查当前目录没有生成崩盘的core文件
# 如发现没有core文件，则该Linux系统启用的为默认机制，即默认Linux是不生成core文件的
[root@localhost app]# ls
HelloWorld  HelloWorld_1  Helloworld_1.cpp  HelloWorld_1.cpp  HelloWorld.cpp  Main  Main.cpp  makefile  temp

# 查Linux系统资源限制情况
# 即查知是否能生成 Core文件
# 依据 core file size = 0 所以不能生成
[root@localhost app]# ulimit -a
core file size          (blocks, -c) 0
....
file locks                      (-x) unlimited

# 激活core文件生成模式
[root@localhost app]# ulimit -c unlimited
# 再次验证Core文件生成模式是否成功激活。 指向 unlimited 即可证实激活成功！
[root@localhost app]# ulimit -a
core file size          (blocks, -c) unlimited
...
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited

# 再跑程序，程序继续崩。
#再查目录内文件情况，清晰可见core.6507 即有验尸文件了 可以进行验尸了
[root@localhost app]# ./Main 
Segmentation fault (core dumped)
[root@localhost app]# ls
core.6507  HelloWorld  HelloWorld_1  Helloworld_1.cpp  HelloWorld_1.cpp  HelloWorld.cpp  Main  Main.cpp  makefile  temp


# 用gdb分析Core文件
[root@localhost app]# gdb Main core.6507 
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /root/app/Main...done.
[New LWP 6507]
Core was generated by `./Main'.
# 很明确告诉你是哪一个函数，哪一行语句报错了导致内存泄漏，进而引发程序崩溃了
Program terminated with signal 11, Segmentation fault.
#0  0x0000000000400869 in MemeryError (bh=3, xm=...) at Main.cpp:9
9         *ptr=3; //空指针解引用赋值 必然内存泄漏
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libgcc-4.8.5-44.el7.x86_64 libstdc++-4.8.5-44.el7.x86_64

# 再查函数调用栈，这就很清晰了！基本锁定问题根源，即可解决此问题。
(gdb) bt
#0  0x0000000000400869 in MemeryError (bh=3, xm="xxxx2") at Main.cpp:9
#1  0x00000000004008b1 in DoYourBiz (no=8, name="xxxx") at Main.cpp:16
#2  0x0000000000400927 in main () at Main.cpp:21
(gdb) 
```

假设程序员去修改，然后解决了空指针解引用的问题，又继续错误使用`strcpy()` 系统又崩了。



由于是用库函数挂掉了，我们看不了库函数的实现，而问题就是出现了库函数实现内部。这种问题在实际开发中，一旦不及时判空下，会**极大可能**出现这种问题。

```c
#include <cstring>
#include <iostream>
using namespace std;

void MemeryError(const int bh,const string xm)
{

  char *ptr=nullptr;
  //*ptr=3; //空指针解引用赋值 必然内存泄漏
  strcpy(ptr,xm.c_str()); // 把内容赋值给一段不存在的空间，必然内存泄漏
}

void DoYourBiz(const int no,const string name)
{
  MemeryError(3,"xxxx2");
}

int main()
{
  DoYourBiz(8,"xxxx");

  return 0;
}
```

```shell
root@localhost app]# make
g++ -g -o Main  Main.cpp 
# 程序继续崩溃，产生新的Core文件
[root@localhost app]# ./Main 
Segmentation fault (core dumped)
[root@localhost app]# ls
core.6507  core.6834  HelloWorld  HelloWorld_1  Helloworld_1.cpp  HelloWorld_1.cpp  HelloWorld.cpp  Main  Main.cpp  makefile  temp
# 继续调试Core文件 进行验尸
[root@localhost app]# gdb Main core.6834
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "x86_64-redhat-linux-gnu".
For bug reporting instructions, please see:
<http://www.gnu.org/software/gdb/bugs/>...
Reading symbols from /root/app/Main...done.
[New LWP 6834]
Core was generated by `./Main'.
Program terminated with signal 11, Segmentation fault.
#0  0x00007f07facdfa96 in __strcpy_sse2_unaligned () from /lib64/libc.so.6
Missing separate debuginfos, use: debuginfo-install glibc-2.17-317.el7.x86_64 libgcc-4.8.5-44.el7.x86_64 libstdc++-4.8.5-44.el7.x86_64

# 查调用堆栈，并没有告诉你具体哪里报错了
# 但我们知道是/lib64/libc.so.6这个动态库里面的这个函数出问题了！
# 从而依据落地代码 处理本次问题。
(gdb) bt 
#0  0x00007f07facdfa96 in __strcpy_sse2_unaligned () from /lib64/libc.so.6
#1  0x0000000000400927 in MemeryError (bh=3, xm="xxxx2") at Main.cpp:11
#2  0x000000000040096c in DoYourBiz (no=8, name="xxxx") at Main.cpp:16
#3  0x00000000004009e2 in main () at Main.cpp:21
(gdb) 
```

## gdb调整正在运行的程序

通常我们开发的程序都是不会终止的，要么时跑在客户端由客户启动和终止。要么就跑在服务端，24小时无间断运行。可执行文件一但被cpu调度在内存中运行，必然产生一个进程，我们的调试也是基于这个进程ID进行的。



如果笔者是做Windows系统的开发，VS已经把进程列表内置了，我们只需要找到这个进程名附加以下就可以了。



而在Linux操作系统中，这部分工作由开发自己完成，我们可以通过`ps -ef` 命令来查到要调试进程的ID。

```c
#include <unistd.h>
#include <iostream>
using namespace std;

void MsgContrl(const int bh,const string xm)
{
  for (int ii=0;ii<1000000;ii++)
  {
    sleep(1);
    cout << "ii=" << ii << endl;
  }
}

void DoYourBiz(const int no,const string name)
{
  MsgContrl(3,"正在处理XXX消息");
}

int main()
{
  DoYourBiz(8,"非窗口窗口已经构建，正在进行消息处理");

  return 0;
}
```

```c
# 跑这个程序，会一直输出编号
[root@localhost app]# make
g++ -g -o Main  Main.cpp 
[root@localhost app]# ./Main 
ii=0
ii=1
ii=2
ii=3
ii=4
....
ii=86
```

由于shell终端会一直输出并刷新，我们无法控制了。我们可以在`vscode` 中再添加一个终端再次远程连接到服务器。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231217102113407-17027796741891.png)

```shell
# 根据进程查 进程ID
[root@localhost app]# ps -ef |grep Main
...
root       7083   2766  0 18:17 pts/4    00:00:00 ./Main
root       7372   7147  0 18:18 pts/0    00:00:00 grep --color=auto Main
# gdb -p 附加参数 指定正在运行的进程做调试。
# 调试中，切换回shell窗口你会发现不会继续输出编号了..
# 可证实gdb会中断正在运行的程序，来进行调试。
[root@localhost app]# gdb Main -p 7083
GNU gdb (GDB) Red Hat Enterprise Linux 7.6.1-120.el7
Copyright (C) 2013 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later 
....
# 退出gdb,再切换去窗口，发现编号又开始从中断处继续输出编号了。
(gdb) quit
A debugging session is active.

        Inferior 1 [process 7083] will be detached.

Quit anyway? (y or n) y
Detaching from program: /root/app/Main, process 7083
[Inferior 1 (process 7083) detached]
```



```shell
# 正常使用调试，前面怎么调试这里就这么调试~
[root@localhost app]# gdb Main -p 7083
(gdb) bt
#0  0x00007efdae4a9840 in __nanosleep_nocancel () from /lib64/libc.so.6
#1  0x00007efdae4a96f4 in sleep () from /lib64/libc.so.6
#2  0x0000000000400aab in MsgContrl (bh=3, xm="正在处理XXX消息") at Main.cpp:9
#3  0x0000000000400b22 in DoYourBiz (no=8, 
    name="非窗口窗口已经构建，正在进行消息处理") at Main.cpp:16
#4  0x0000000000400ba9 in main () at Main.cpp:21
(gdb) n
Single stepping until exit from function __nanosleep_nocancel,
which has no line number information.
0x00007efdae4a96f4 in sleep () from /lib64/libc.so.6
(gdb) n
Single stepping until exit from function sleep,
which has no line number information.
MsgContrl (bh=3, xm="正在处理XXX消息") at Main.cpp:10
10          cout << "ii=" << ii << endl;
(gdb) n
7         for (int ii=0;ii<1000000;ii++)
(gdb) n
9           sleep(1);
(gdb) 
```

## vscode远程gdb调试

### 装插件和配置launch.json

在服务端创建一个 c++ 代码，这里`Linux之C++获取系统用户名`中的代码为例，很简单

```cpp
#include <unistd.h>
#include <pwd.h>
#include <iostream>
 
int main()
{
	struct passwd* pwd;
	uid_t userid;
	userid = getuid();
	pwd = getpwuid(userid);
 
	std::cout << "pw_name:" << pwd->pw_name << std::endl;
	std::cout << "pw_passwd:" << pwd->pw_passwd << std::endl;
	std::cout << "pw_uid：" << pwd->pw_uid << std::endl;
	std::cout << "pw_gid:" << pwd->pw_gid << std::endl;
	std::cout << "pw_gecos:" << pwd->pw_gecos << std::endl;
	std::cout << "pw_dir:" << pwd->pw_dir << std::endl;
	std::cout << "pw_shell:" << pwd->pw_shell << std::endl;
 
    return 0;
}
```

编译方法如下，注意一定要加上 -g 指令，否则无法 gdb 调试

```shell
g++ -g test.cpp -o test
```

第一次运行需要安装 c++ 的扩展，在扩展页面中，安装 C/C++ ,同时搜索 GDB Debug 并安装.



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240408212321266.png)

 安装好之后，点击“运行和调试”按钮，“创建 launch.json” 文件



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240408212446202.png)

选择 C++(GDB/LLDB）项，自动生成 launch.json 文件，内容如下



```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": []
}
```

按照下边的内容，对应的修改一下

```shell
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) 启动", //配置名称，显示在配置下拉菜单中
            "type": "cppdbg", //配置类型
            "request": "launch", //请求配置类型，可以是启动或者是附加
            "program": "${workspaceFolder}/demo/test", //程序可执行文件的完整路径，${workspaceFolder}表示远程连接的初始路径
            "args": [], //传递给程序的命令行参数
            "stopAtEntry": false,//可选参数，如果为true,调试程序应该在入口（main）处停止
            "cwd": "${workspaceFolder}/demo", //目标的工作目录
            "environment": [], //表示要预设的环境变量
            "externalConsole": false,//如果为true，则为调试对象启动控制台
            "MIMode": "gdb",//要连接到的控制台启动程序
            "setupCommands": [ //为了安装基础调试程序而执行的一个或多个GDB/LLDB命令
                {
                    "description": "为 gdb 启用整齐打印",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ]
        }
    ]
}
```

至此环境配置完毕.

### 调试方法

在源代码中直接点击行数左侧，即可增加断点，设置好断点之后，点击“运行和调试”--（gdb）启动，如下



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240408212747750.png)



可以在变量区直接看到变量值，完成调试目的。







