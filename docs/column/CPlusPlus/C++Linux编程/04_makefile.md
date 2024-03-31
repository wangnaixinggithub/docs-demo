# makefile

在实际开发中，项目的源代码文件比较多，按类型、功能、模块分别存放在不同的目录和文件中，哪些文件需要先编译，那些文件后编译，那些文件需要重新编译，还有更多更复杂的操作。

make是一个强大的实用工具，用于管理项目的编译和链接。make通过一个编译规则文件`makefile`，可实现自动化编译。

# HelloWorld

在没有`make` 的时代，程序员要编译静态库和动态库，处理程序和库的整合，通常会把`g++` 处理指定写成一个shell脚本，但有了`make` 之后这项工作就变成了编写 `makefile`文件了。 



在开始操作之前，我们先说概念，`makfile`、`make`、`.mk`是什么？

因为一个大的工程比如[linux内核](https://so.csdn.net/so/search?q=linux内核&spm=1001.2101.3001.7020)的source code 会有数以万计的文件，你很难去正确快速的进行手动链接编译，去处理哪些文件需要先编译，哪些文件需要后编译，哪些文件需要重新编译的问题， 所以出现了编写编译规则的文件makefile做统一管理。

而make是一个命令工具，是一个解释`makefile`中指令的命令工具，一般来说，大多数的IDE都有这个命令。

即 make命令执行时，需要一个`makefile`文件，以告诉make命令 我需要怎么样的去编译和链接程序。

那`.mk`是什么？.mk是一种android编译环境下的一种特殊的“makefile”文件，mk文件最终还是要被android编译系统层层解析，转化为make命令能够读懂的格式，从而调用gcc编译器进行编译，暂时在我没有对其有更深的认识之前，我也把其当做一种特殊领域的makefile文件了(了解即可)

接下来，我分别以编写shell脚本的方式和编写`makefile`的方式，来处理源码编译成动态库和静态库的过程。以学习`makefile`

```shell
# 最笨的办法，写一个脚本做动态库和静态库的编译工作
[root@localhost app]# cd ../tools/
[root@localhost tools]# vim make_lib.sh
[root@localhost tools]# more make_lib.sh 
g++ -c -o libpublic.a public.cpp
g++ -fPIC -shared -o libpublic.so public.cpp
[root@localhost tools]# sh make_lib.sh 
[root@localhost tools]# ls
libpublic.a  libpublic.so  make_lib.sh  public.cpp  public.h

#写makefile 文件来执行编译工作
[root@localhost tools]# rm -rf make_lib.sh 
[root@localhost tools]# rm -rf libpublic.so libpublic.a 
[root@localhost tools]# ls
public.cpp  public.h
[root@localhost tools]# vim makefile 
[root@localhost tools]# more makefile 
# 指定编译的目标文件是 libpublic.a 和 libpublic.so
all:libpublic.a  libpublic.so

# 编译libpublic.a 需要依赖public.h public.cpp 
# # 如果说，被依赖的文件内容发生了变化，则重新编译 libpublic.a
libpublic.a:public.h public.cpp
        g++ -c -o libpublic.a public.cpp
libpublic.so:public.h public.cpp
        g++ -fPIC -shared -o libpublic.so public.cpp
# clean 用于清理编译目标文件 仅在 make clean 才会执行
clean:
        rm -rf libpublic.a libpublic.so
#
[root@localhost tools]# ls
makefile  public.cpp  public.h

# 执行make命令，底层会自动根据当前目录的makefile文件来做事
[root@localhost tools]# make 
g++ -c -o libpublic.a public.cpp
g++ -fPIC -shared -o libpublic.so public.cpp
[root@localhost tools]# ls
libpublic.a  libpublic.so  makefile  public.cpp  public.h

#清理动态库和静态库
[root@localhost tools]# make clean
rm -rf libpublic.a libpublic.so
[root@localhost tools]# ls
makefile  public.cpp  public.h
[root@localhost tools]# 


```

实际上，`make` 的机制和`maven` 很像，如果说，依赖文件没有改动并且已经生成出来的动态库和静态库了，则再次`make` 会提示`make: Nothing to be done for all`,告诉你，不会执行任何操作。

```shell
[root@localhost tools]# make 
g++ -c -o libpublic.a public.cpp
g++ -fPIC -shared -o libpublic.so public.cpp
[root@localhost tools]# make
make: Nothing to be done for `all'.
[root@localhost tools]# 
```

接着，我去修改源码实现。然后再跑`make` 命令验证他的处理。

![image-20231216101844027](04_makefile.assets/image-20231216101844027-17026931248541.png)

```shell
# make底层会自动判断 当前管理的源码文件有没有更新，有更新则重新编译出动态库和静态库。
root@localhost tools]# make
g++ -c -o libpublic.a public.cpp
g++ -fPIC -shared -o libpublic.so public.cpp
[root@localhost tools]# ls
libpublic.a  libpublic.so  makefile  public.cpp  public.h
[root@localhost tools]# ../app/HelloWorld 
Linux C++ HelloWorld!
HelloWorld Linux C++!
I Working, Using C++ Resolve Question
[root@localhost tools]# 
```

如果说，我操作删除了静态库，再跑`make`，`make` 只会生成我删掉的静态库。即采用增量编译的方案，比脚本强很多，脚本写出来不用说都是全量编译，费事费力，这里，make的优势就突出了！

```shell
# make 底层会查一遍当前存在静态库和动态库情况，对没有的东西进行补充。 即只会做增量更新，不是全量更新。大大提高编译的效率。
[root@localhost tools]# rm -rf libpublic.a 
[root@localhost tools]# make
g++ -c -o libpublic.a public.cpp
[root@localhost tools]# ls
libpublic.a  libpublic.so  makefile  public.cpp  public.h
[root@localhost tools]# 
```

# 多个makefile处理

```shell
root@localhost ~]# cd api/
[root@localhost api]# touch  myApi.h myApi.cpp
[root@localhost api]# pwd
/root/api
[root@localhost api]# ls
myApi.cpp  myApi.h
[root@localhost api]# vim makefile
[root@localhost api]# make
g++ -c -o libmyapi.a myApi.cpp
g++ -fPIC -shared -o libmyapi.so myApi.cpp
[root@localhost api]# more makefile 
all:libmyapi.a libmyapi.so
libmyapi.a:myApi.h myApi.cpp
        g++ -c -o libmyapi.a myApi.cpp
libmyapi.so:myApi.h myApi.cpp
        g++ -fPIC -shared -o libmyapi.so myApi.cpp
clean:
        rm -rf libmyapi.so libmyapi.a

[root@localhost api]# 
```

```c++
// myApi.h
#ifndef MY_API_H_INCLUDE

#define MY_API_H_INCLUDE
#include <iostream>

class Student
{
public:
    void Learn();
};

#endif //MY_API_H_INCLUDE
```

```c++
//myApi.cpp
#include "myApi.h"

void Student::Learn()
{

    std::cout << "Student Learn Linux C++ " << std::endl; 
}
```

修改`HelloWorld.cpp` 程序，把另一个动态库也整合到程序中,现在这个工程从原来的使用一个动态库，变成了使用两个动态库了。则我们需要重新编译下程序。[03_动态库和静态库-CSDN博客](https://wangnaixing.blog.csdn.net/article/details/135029039)

```c
#include <iostream>
#include "/root/tools/public.h"
#include "/root/api/myApi.h"
using namespace std;
int main(int argc, char* argv[])
{
    PrintMsg();

    Engineer engineer;
    engineer.Working();

    Student student;
    student.Learn();
    return 0;
}

```

```shell
# 编译myApi动态库
[root@localhost api]# make
g++ -c -o libmyapi.a myApi.cpp
g++ -fPIC -shared -o libmyapi.so myApi.cpp
[root@localhost api]# more makefile 
all:libmyapi.a libmyapi.so
libmyapi.a:myApi.h myApi.cpp
        g++ -c -o libmyapi.a myApi.cpp
libmyapi.so:myApi.h myApi.cpp
        g++ -fPIC -shared -o libmyapi.so myApi.cpp
clean:
        rm -rf libmyapi.so libmyapi.a

[root@localhost api]# cd ..

# 查下我们的项目层级情况。
[root@localhost ~]# tree
bash: tree: command not found...
[root@localhost ~]# yum -y install tree
Loaded plugins: fastestmirror, langpacks
Loading mirror speeds from cached hostfile
 * base: ftp.sjtu.edu.cn
 * centos-sclo-rh: mirrors.cqu.edu.cn
 * centos-sclo-sclo: ftp.sjtu.edu.cn
 * extras: ftp.sjtu.edu.cn
 * updates: mirrors.ustc.edu.cn
base                                                                                  | 3.6 kB  00:00:00     
centos-sclo-rh                                                                        | 3.0 kB  00:00:00     
centos-sclo-sclo                                                                      | 3.0 kB  00:00:00     
extras                                                                                | 2.9 kB  00:00:00     
updates                                                                               | 2.9 kB  00:00:00     
updates/7/x86_64/primary_db                                                           |  24 MB  00:00:12     
Resolving Dependencies
--> Running transaction check
---> Package tree.x86_64 0:1.6.0-10.el7 will be installed
--> Finished Dependency Resolution

Dependencies Resolved

=============================================================================================================
 Package                Arch                     Version                        Repository              Size
=============================================================================================================
Installing:
 tree                   x86_64                   1.6.0-10.el7                   base                    46 k

Transaction Summary
=============================================================================================================
Install  1 Package

Total download size: 46 k
Installed size: 87 k
Downloading packages:
tree-1.6.0-10.el7.x86_64.rpm                                                          |  46 kB  00:00:02     
Running transaction check
Running transaction test
Transaction test succeeded
Running transaction
  Installing : tree-1.6.0-10.el7.x86_64                                                                  1/1 
  Verifying  : tree-1.6.0-10.el7.x86_64                                                                  1/1 

Installed:
  tree.x86_64 0:1.6.0-10.el7                                                                                 

Complete!
[root@localhost ~]# tree
.
├── \\
├── api
│   ├── libmyapi.a
│   ├── libmyapi.so
│   ├── makefile
│   ├── myApi.cpp
│   └── myApi.h
├── app
│   ├── HelloWorld
│   └── HelloWorld.cpp
├── tools
│   ├── libpublic.a
│   ├── libpublic.so
│   ├── makefile
│   ├── public.cpp
│   └── public.h

10 directories, 35 files

#按照前面动态库和静态库的知识，将两个动态库一起链接到程序中
[root@localhost ~]# cd app/
[root@localhost app]# g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools/ -l public
[root@localhost app]# ./HelloWorld 
./HelloWorld: error while loading shared libraries: libmyapi.so: cannot open shared object file: No such file or directory
[root@localhost app]# echo $LD_LIBRARY_PATH
/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/root/tools/
[root@localhost app]# export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/root/api
[root@localhost app]# echo $LD_LIBRARY_PATH
/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/root/tools/:/root/api
[root@localhost app]# ./HelloWorld 
Linux C++ HelloWorld!
HelloWorld Linux C++!
I Working, Using C++ Resolve Question
Student Learn Linux C++ 
```

这种方式也能完成程序和多个动态库的整合，如果有多个`.a` 要和程序做链接整合，每一次都要这样操作，光是写 `-L -l` 都得累死。而且我们引入头文件的方式，很不专业，也不合理。

![image-20231216105252718](04_makefile.assets/image-20231216105252718-17026951742142.png)

所以在程序中，我们修改`include` 的方式，采用开发的写法去引用头文件后再做编译。

```c++
#include <iostream>
#include "public.h"
#include "myApi.h"
using namespace std;
int main(int argc, char* argv[]){...}
```

```c
# 如果这个时候，你再去做链接，会报错。找不到头文件了！
[root@localhost app]# rm -rf HelloWorld
[root@localhost app]# g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools/ -l  public
HelloWorld.cpp:2:10: fatal error: public.h: No such file or directory
 #include "public.h"
          ^~~~~~~~~~
compilation terminated.
    
# 通过附加命令参数 -I 指定库的文件目录 如果说库的头文件目录有多个，则都需要指定出来，不然会继续报错    
[root@localhost app]# g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools/ -l  public -I /root/tools/
HelloWorld.cpp:3:10: fatal error: myApi.h: No such file or directory
 #include "myApi.h"
          ^~~~~~~~~
compilation terminated.
[root@localhost app]# g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools/ -l  public -I /root/tools/ -I /root/api/
[root@localhost app]# ./HelloWorld 
Linux C++ HelloWorld!
HelloWorld Linux C++!
I Working, Using C++ Resolve Question
Student Learn Linux C++ 
[root@localhost app]# 
```

针对这种场景，程序引用多个库， 则 `makefile` 作为编译器make的配置文件，既然我们编译`myapi` `public` 动态库的时候都可以写`makefile` 文件来配置生成动态库。那为啥不能在程序那里也写一个`makefile` 文件来处理程序和其他动态库之间的整合工作呢？`make` 说白了就好像`maven`，`makefile` 就好像`setting.xml` 文件一样。当你把动态库和静态库都想象成工程的时候，在做的事情和Java的没啥区分，三个工作的整合工作而已。 

```sh
[root@localhost app]# vim makefile
[root@localhost app]# make
make: Nothing to be done for `all'.
[root@localhost app]# rm -rf HelloWorld
[root@localhost app]# make
g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools -l  public \
-I /root/api -I /root/tools 
[root@localhost app]# ./HelloWorld 
Linux C++ HelloWorld!
HelloWorld Linux C++!
I Working, Using C++ Resolve Question
Student Learn Linux C++ 
[root@localhost app]# more makefile 
all:HelloWorld
HelloWorld:HelloWorld.cpp
        g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools -l  public \
        -I /root/api -I /root/tools 
clean:
        rm -rf HelloWorld
#同样，HelloWorld.cpp文件的变化会令make重新编译，这种变化底层实际是通过判读文件有没有被访问实现的。
# 笔者试过，知识vim HelloWorld.cpp 并不对内容做改动，然则make执行还是会重新编译。
[root@localhost app]# make
make: Nothing to be done for `all'.
[root@localhost app]# vim HelloWorld.cpp 
[root@localhost app]# make
g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools -l  public \
-I /root/api -I /root/tools 
[root@localhost app]# ./HelloWorld 
Linux C++ HelloWorld!
HelloWorld Linux C++!
I Working, Using C++ Resolve Question
Student Learn Linux C++ 
Hello Main
[root@localhost app]# 
```

![image-20231216111228843](04_makefile.assets/image-20231216111228843-17026963501263.png)

# makefile 变量

上面写的makefile文件，对头文件目录和库目录都写死到执行的语句中去了。这样如果目录改动，开发修改的工作量会很大，我们可以利用变量来解决这个问题。

```shell
#一些变量的定义
INCLUDE_DIR=-I /root/api -I /root/tools 
LIB_DIR=-L /root/api/ -l myapi -L /root/tools -l  public 
all:HelloWorld HelloWorld_1  

#$(变量)名 来表示定义的变量
HelloWorld:HelloWorld.cpp
	g++ -o HelloWorld HelloWorld.cpp $(LIB_DIR) $(INCLUDE_DIR)
HelloWorld_1:Helloworld_1.cpp
	g++ -o HelloWorld_1 Helloworld_1.cpp $(LIB_DIR) $(INCLUDE_DIR)
clean:
	rm -rf HelloWorld \
	rm -rf HelloWorld_1\
```

```shell
# 考虑多个程序需要整合相同的两个库的情况
[root@localhost app]# cp HelloWorld.cpp HelloWorld_1.cpp
[root@localhost app]# ls
 Helloworld_1.cpp  HelloWorld_1.cpp  HelloWorld.cpp  makefile
[root@localhost app]# make clean
rm -rf HelloWorld \
rm -rf HelloWorld_1\

[root@localhost app]# make
g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools -l  public  -I /root/api -I /root/tools 
g++ -o HelloWorld_1 Helloworld_1.cpp -L /root/api/ -l myapi -L /root/tools -l  public  -I /root/api -I /root/tools 
[root@localhost app]# ls
HelloWorld  HelloWorld_1  Helloworld_1.cpp  HelloWorld_1.cpp  HelloWorld.cpp  makefile
[root@localhost app]# ./HelloWorld_1 
Linux C++ HelloWorld!
HelloWorld Linux C++!
I Working, Using C++ Resolve Question
Student Learn Linux C++ 
Hello Main
[root@localhost app]# 
```

我们还可以对生成的可执行文件做一些后处理，比如我期望得到HelloWorld可执行文件之后，把该可执行文件放到`temp` 目录下，并且执行以下该`HelloWorld` 可执行文件，则可以如下所示这样修改`makefile` 文件。

```makefile
INCLUDE_DIR=-I /root/api -I /root/tools 
LIB_DIR=-L /root/api/ -l myapi -L /root/tools -l  public 
all:HelloWorld HelloWorld_1 
#还可以对生成的可执行文件做一些后处理 
HelloWorld:HelloWorld.cpp
	g++ -o HelloWorld HelloWorld.cpp $(LIB_DIR) $(INCLUDE_DIR)
	cp HelloWorld ./temp
	./HelloWorld
HelloWorld_1:Helloworld_1.cpp
	g++ -o HelloWorld_1 Helloworld_1.cpp $(LIB_DIR) $(INCLUDE_DIR)
clean:
	rm -rf HelloWorld \
	rm -rf HelloWorld_1\

```

```shell
[root@localhost app]# make clean
rm -rf HelloWorld \
rm -rf HelloWorld_1\

[root@localhost app]# make
g++ -o HelloWorld HelloWorld.cpp -L /root/api/ -l myapi -L /root/tools -l  public  -I /root/api -I /root/tools 
cp HelloWorld ./temp
./HelloWorld
Linux C++ HelloWorld!
HelloWorld Linux C++!
I Working, Using C++ Resolve Question
Student Learn Linux C++ 
Hello Main
g++ -o HelloWorld_1 Helloworld_1.cpp -L /root/api/ -l myapi -L /root/tools -l  public  -I /root/api -I /root/tools 
[root@localhost app]# 
```

