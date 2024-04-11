# Main函数的参数

## Main函数形参解析方式

任何程序都有一个入口函数。这个函数是程序执行的入口。我们通常叫他入口函数。也叫`main`函数。



 然则`main`函数的参数的应用场景有，比如说大量的Linux命令，可以通过附加参数的形式来实现不同的作用效果。而命令本身就是一个C++程序，实现这种操作通常是由解析`main` 函数形参来实现了的。



所以了解Linux 程序开发的Main函数参数很有必要。

```shell
# 新建Main.cpp 并修改 makefile文件编译Main.cpp 成可执行文件
[root@localhost app]# touch Main.cpp
[root@localhost app]# make
g++ -o Main Main.cpp 
# 运行程序，查看Main函数形参解析结果
[root@localhost app]# ./Main -L root/tools -l public
```

```makefile
all: Main
Main:Main.cpp
	g++ -o Main Main.cpp 	
clean:
	rm -rf HelloWorld \
	rm -rf HelloWorld_1\
	rm -rf Main
```

::: details 程序运行结果

```shell
程序入口函数，一共有5个附加参数
现对每一个附加参数值进行输出如下所示
./Main
-L
root/tools
-l
public
输出此程序运行的环境变量k=v
MANPATH=/opt/rh/devtoolset-8/root/usr/share/man:/opt/rh/devtoolset-8/root/usr/share/man:
XDG_SESSION_ID=2
TERM_PROGRAM=vscode
HOSTNAME=localhost.localdomain
TERM_PROGRAM_VERSION=1.85.1
SELINUX_USE_CURRENT_RANGE=
PCP_DIR=/opt/rh/devtoolset-8/root
USER=root
...
LOGNAME=root
SSH_CONNECTION=192.168.28.1 45232 192.168.28.132 22
XDG_DATA_DIRS=/root/.local/share/flatpak/exports/share:/var/lib/flatpak/exports/share:/usr/local/share:/usr/share
VSCODE_IPC_HOOK_CLI=/run/user/0/vscode-ipc-4b6cd09f-815e-4087-9b89-c3cb0c158705.sock
PKG_CONFIG_PATH=/opt/rh/devtoolset-8/root/usr/lib64/pkgconfig:/opt/rh/devtoolset-8/root/usr/lib64/pkgconfig
LESSOPEN=||/usr/bin/lesspipe.sh %s
BROWSER=/root/.vscode-server/bin/0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2/bin/helpers/browser.sh
INFOPATH=/opt/rh/devtoolset-8/root/usr/share/info:/opt/rh/devtoolset-8/root/usr/share/info
XDG_RUNTIME_DIR=/run/user/0
COLORTERM=truecolor
_=/usr/bin/env
OLDPWD=/root
[root@localhost app]# 
```

:::

```c
#include<iostream>
using namespace std;
int main(int argc,char* argv[],char* envp[])
{
    if(argc != 0)
    {
        cout << "程序入口函数，一共有" << argc << "个附加参数" << endl;
        cout << "现对每一个附加参数值进行输出如下所示" << endl;
        for (size_t i = 0; i < argc; i++)
        {
            cout << argv[i] << "\n";
        }  
    }
    else
    {
        cout << "警告！本次程序运行没有附加参数，打印附加参数值的流程终止！" << endl;
    }
    //环境变量数组（字符串数组）的最后一个元素必然是0
    cout << "输出此程序运行的环境变量k=v" << endl;
    for (size_t i = 0; envp[i] != NULL; i++)
    {
        cout <<  envp[i] << endl;
    }
    return 0;   
}
```

总结一下：`main`函数有三个参数，`argc`、`argv`和`envp`，它的标准写法如下：

```c
int main(int argc,char *argv[],char *envp[])
{
    return 0;
}
```

:::details main()函数形参说明

argc	存放了程序参数的个数，包括程序本身。

argv	字符串的数组，存放了每个参数的值，包括程序本身。

envp	字符串的数组，存放了环境变量，数组的最后一个元素是空。

:::

> 在程序中，如果不关心main()函数的参数，可以省略不写。



在实际开发中，可能会有如下需求场景，即C++程序员有可能要提供做好的可执行程序给Java程序员调用。





如果期望把这个程序写好，则在编写代码的时候，要考虑Java程序员非法调用的习惯，即要做好一些判断，错误使用时则出现提示引导信息。

```c
#include<iostream>
using namespace std;
int main(int argc,char* argv[],char* envp[])
{
    //查验Java程序员传参对不对
    if(argc != 4)
    {
        //不对，提示他怎么用
        cout << "神级表白神器SDK的使用方法: ./Main 追求者姓名 被追求者姓名 表白内容" << endl;
    }
    //0索引位置 shell 调用可执行文件 不理 
    cout << argv[1]  << "开始向" << argv[2] << "表白。" << endl;
    cout << argv[3] << endl;
    cout << argv[1] << "表白完成!" << endl; 
    return 0;
}
```

```shell
[root@localhost app]# make
g++ -o Main Main.cpp 
[root@localhost app]# ./Main 
神级表白神器SDK的使用方法: ./Main 追求者姓名 被追求者姓名 表白内容
[root@localhost app]# ./Main 张三 李四 我喜欢你
张三开始向李四表白。
我喜欢你
张三表白完成!
```

## 操作环境变量

### 新增/修改环境变量

```c
int setenv(const char *name, const char *value, int overwrite);
```

:::details setenv() 

参数 name		环境变量名。



参数 value		环境变量的值。



参数 overwrite  重写标识。

- 0-如果环境不存在，增加新的环境变量，如果环境变量已存在，不替换其值；
- 非0-如果环境不存在，增加新的环境变量，如果环境变量已存在，替换其值。

返回值：0-成功；-1-失败（失败的情况极少见）。 

:::



::: danger 注意

 注意：此函数设置的环境变量`只对本进程有效，不会影响shell的环境变量`。如果在运行程序时执行了setenv()函数，进程终止后再次运行该程序，上次的设置是**无效的**。

:::

### 查询环境变量

```c
char *getenv(const char *name);
```

::: details getenv() 

​	参数 name： 指定获取的环境变量名。

​	返回值： 

- 如果存在该环境变量，则返回该环境变量的值对应字符串的指针。
- 如果不存在该环境变量，则返回 NULL。

:::

### 删除环境变量

```c
int unsetenv(const char *name);
```

::: details unsetenv() 

参数 name： 需要移除的环境变量名称。
返回值： 成功返回 0；失败将返回-1，并设置 errno。

:::

```c
#include<iostream>
#include<sys/stat.h>
#include<string>
using namespace std;
bool FileIsExist(const string& strFilePath )
{
    //查文件信息，函数执行成功返回 0，函数执行失败
    //可推理此路径表示的文件不存在
    struct stat buffer;
    bool bRet = false;
    bRet =  stat(strFilePath.c_str(),&buffer) == 0;
    return bRet;
}
int main(int argc,char* argv[],char* envp[])
{
   char const*  preSetEnvK = "JAVA_HOME";
   char const*  preSetEnvV = "/usr/java/jdk1.8.0_333";
   char* curEnv = NULL;
   int bRet = 0;
   
   if(!FileIsExist("/usr/java"))
       mkdir("/usr/java",0755);
   if(!FileIsExist(preSetEnvV))
       mkdir(preSetEnvV,0755);
   //查环境变量
   curEnv = getenv(preSetEnvK);
   if(curEnv)
        cout << "环境变量" << preSetEnvK << "=" << curEnv << endl; 
   //新增(更新)环境变量
   bRet =  setenv(preSetEnvK,preSetEnvV,1);
   if(!bRet)
        cout<< "更新环境变量" << preSetEnvK << "成功！" <<endl;

   curEnv = NULL;
   curEnv =  getenv(preSetEnvK);
   if(!curEnv)
      cout << "环境变量" << preSetEnvK << "=" << curEnv; 
   //删除环境变量
   bRet =  unsetenv(preSetEnvK);
   if(!bRet)
        cout << "删除环境变量成功!" <<endl;
   return 0;
}
```

```shell
# 跑下程序
[root@localhost app]# make
g++ -o Main Main.cpp 
[root@localhost app]# ./Main 
更新环境变量JAVA_HOME成功！
删除环境变量成功!
# 查目录信息
[root@localhost app]# stat /usr/java/jdk1.8.0_333/
  File: ‘/usr/java/jdk1.8.0_333/’
  Size: 6               Blocks: 0          IO Block: 4096   directory
Device: 803h/2051d      Inode: 19584855    Links: 2
Access: (0755/drwxr-xr-x)  Uid: (    0/    root)   Gid: (    0/    root)
Context: unconfined_u:object_r:usr_t:s0
Access: 2023-12-16 06:10:03.840432186 -0800
Modify: 2023-12-16 06:10:03.840432186 -0800
Change: 2023-12-16 06:10:03.840432186 -0800
 Birth: -
```

验证环境变量的设定`setenv()`，只对`本进程有效`的情况。注释掉删除环境变量的逻辑

```c
#include<iostream>
#include<sys/stat.h>
#include<string>
using namespace std;
bool FileIsExist(const string& strFilePath )
{
    //查文件信息，函数执行成功返回 0，函数执行失败
    //可推理此路径表示的文件不存在
    struct stat buffer;
    bool bRet = false;
    bRet =  stat(strFilePath.c_str(),&buffer) == 0;
    return bRet;
}
int main(int argc,char* argv[],char* envp[])
{
   char const*  preSetEnvK = "JAVA_HOME";
   char const*  preSetEnvV = "/usr/java/jdk1.8.0_333";
   char* curEnv = NULL;
   int bRet = 0;
   
   if(!FileIsExist("/usr/java"))
       mkdir("/usr/java",0755);
   if(!FileIsExist(preSetEnvV))
       mkdir(preSetEnvV,0755);
   //查环境变量
   curEnv = getenv(preSetEnvK);
   if(curEnv)
        cout << "环境变量" << preSetEnvK << "=" << curEnv << endl; 
   //新增(更新)环境变量
   bRet =  setenv(preSetEnvK,preSetEnvV,1);
   if(!bRet)
        cout<< "更新环境变量" << preSetEnvK << "成功！" <<endl;

   curEnv = NULL;
   curEnv =  getenv(preSetEnvK);
   if(!curEnv)
      cout << "环境变量" << preSetEnvK << "=" << curEnv; 
   //删除环境变量
   //bRet =  unsetenv(preSetEnvK);
   //if(!bRet)
   //     cout << "删除环境变量成功!" <<endl;
   return 0;
}
```

```shell
# 程序跑完了，进程结束，再查当前shell环境变量,并没有JAVA_HOME 环境变量。
[root@localhost app]# ./Main 
更新环境变量JAVA_HOME成功！
[root@localhost app]# env
MANPATH=/opt/rh/devtoolset-8/root/usr/share/man:/opt/rh/devtoolset-8/root/usr/share/man:
XDG_SESSION_ID=2
TERM_PROGRAM=vscode
HOSTNAME=localhost.localdomain
....
```

