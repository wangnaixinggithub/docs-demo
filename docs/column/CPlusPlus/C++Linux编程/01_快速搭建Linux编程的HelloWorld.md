# 快递搭建Linux编程的HelloWorld

# 安装GCC

```shell
# 1、安装C和C++的编译器
yum -y install gcc*
# 2、 升级GCC软件包
yum -y install centos-release-scl devtoolset-8-gcc*
# 3、启用软件包
echo "source /opt/rh/devtoolset-8/enable" >>/etc/profile # 每次启动shell的时候，会执行/etc/profile脚本。

#4、安装库函数的帮助文档
yum -y install man-pages

#5、查看k函数说明
man -3 strcpy

```

# ✌️HelloWorld✌️

写一个HelloWorld程序, `HelloWorld.cpp`. 

语法格式：

```
gcc/g++ [附加参数] 源代码文件1 源代码文件2 源代码文件n
```

常用附加参数：

```
-o 指定输出的文件名，这个名称不能和源文件同名。如果不给出这个选项，则生成可执行文件a.out。
```

```c 
#include <iostream>

using namespace std;
int main(int argc, char* argv[])
{
 
    cout << "Linux HelloWorld!" << endl;
    return 0;
}
```

```shell
# 编译源文件 
[root@localhost ~]# g++ -o HelloWorld HelloWorld.cpp 
[root@localhost ~]# ll
总用量 22312
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
drwxr-xr-x. 5 root root      176 12月 11 23:57 compressOps
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       48 12月 11 19:35 happy.txt.gz
-rwxr-xr-x. 1 root root     8896 12月 12 01:11 HelloWorld
-rw-r--r--. 1 root root      148 12月 12 01:09 HelloWorld.cpp
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 3 root root       19 12月 11 20:21 work
[root@localhost ~]# ./HelloWorld 
Linux HelloWorld!
[root@localhost ~]# 

# 不指定 -o 附加参数，则生成的可执行文件为a.out
[root@localhost ~]# g++ HelloWorld.cpp 
[root@localhost ~]# ls
\  anaconda-ks.cfg  a.out  compressOps  create_database.sql  DM  file  file2  happy.txt.gz  HelloWorld.cpp  hi.txt  log  merge  night.wav  original-ks.cfg  work
[root@localhost ~]# 

```

