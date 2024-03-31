# Main函数的参数

# Main函数形参解析方式

任何程序都有一个入口函数。这个函数是程序执行的入口。我们通常叫他入口函数。也叫`main`函数。

 然则`main`函数的参数的应用场景有，比如说大量的Linux命令，可以通过附加参数的形式来实现不同的作用效果。而命令本身就是一个程序，实现这种操作通常是由解析`main`函数实现了的。所以了解Linux 程序开发的Main函数参数很有必要。

```shell
# 新建Main.cpp 并修改 makefile文件编译Main.cpp 成可执行文件
[root@localhost app]# touch Main.cpp
[root@localhost app]# make
g++ -o Main Main.cpp 
# 运行程序，查看Main函数形参解析结果
[root@localhost app]# ./Main -L root/tools -l public
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
SELINUX_ROLE_REQUESTED=
TERM=xterm-256color
SHELL=/bin/bash
HISTSIZE=1000
SSH_CLIENT=192.168.28.1 45232 22
PERL5LIB=/opt/rh/devtoolset-8/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-8/root/usr/lib/perl5:/opt/rh/devtoolset-8/root//usr/share/perl5/vendor_perl:/opt/rh/devtoolset-8/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-8/root/usr/lib/perl5:/opt/rh/devtoolset-8/root//usr/share/perl5/vendor_perl
TERM_PROGRAM_VERSION=1.85.1
SELINUX_USE_CURRENT_RANGE=
PCP_DIR=/opt/rh/devtoolset-8/root
USER=root
LS_COLORS=rs=0:di=38;5;27:ln=38;5;51:mh=44;38;5;15:pi=40;38;5;11:so=38;5;13:do=38;5;5:bd=48;5;232;38;5;11:cd=48;5;232;38;5;3:or=48;5;232;38;5;9:mi=05;48;5;232;38;5;15:su=48;5;196;38;5;15:sg=48;5;11;38;5;16:ca=48;5;196;38;5;226:tw=48;5;10;38;5;16:ow=48;5;10;38;5;21:st=48;5;21;38;5;15:ex=38;5;34:*.tar=38;5;9:*.tgz=38;5;9:*.arc=38;5;9:*.arj=38;5;9:*.taz=38;5;9:*.lha=38;5;9:*.lz4=38;5;9:*.lzh=38;5;9:*.lzma=38;5;9:*.tlz=38;5;9:*.txz=38;5;9:*.tzo=38;5;9:*.t7z=38;5;9:*.zip=38;5;9:*.z=38;5;9:*.Z=38;5;9:*.dz=38;5;9:*.gz=38;5;9:*.lrz=38;5;9:*.lz=38;5;9:*.lzo=38;5;9:*.xz=38;5;9:*.bz2=38;5;9:*.bz=38;5;9:*.tbz=38;5;9:*.tbz2=38;5;9:*.tz=38;5;9:*.deb=38;5;9:*.rpm=38;5;9:*.jar=38;5;9:*.war=38;5;9:*.ear=38;5;9:*.sar=38;5;9:*.rar=38;5;9:*.alz=38;5;9:*.ace=38;5;9:*.zoo=38;5;9:*.cpio=38;5;9:*.7z=38;5;9:*.rz=38;5;9:*.cab=38;5;9:*.jpg=38;5;13:*.jpeg=38;5;13:*.gif=38;5;13:*.bmp=38;5;13:*.pbm=38;5;13:*.pgm=38;5;13:*.ppm=38;5;13:*.tga=38;5;13:*.xbm=38;5;13:*.xpm=38;5;13:*.tif=38;5;13:*.tiff=38;5;13:*.png=38;5;13:*.svg=38;5;13:*.svgz=38;5;13:*.mng=38;5;13:*.pcx=38;5;13:*.mov=38;5;13:*.mpg=38;5;13:*.mpeg=38;5;13:*.m2v=38;5;13:*.mkv=38;5;13:*.webm=38;5;13:*.ogm=38;5;13:*.mp4=38;5;13:*.m4v=38;5;13:*.mp4v=38;5;13:*.vob=38;5;13:*.qt=38;5;13:*.nuv=38;5;13:*.wmv=38;5;13:*.asf=38;5;13:*.rm=38;5;13:*.rmvb=38;5;13:*.flc=38;5;13:*.avi=38;5;13:*.fli=38;5;13:*.flv=38;5;13:*.gl=38;5;13:*.dl=38;5;13:*.xcf=38;5;13:*.xwd=38;5;13:*.yuv=38;5;13:*.cgm=38;5;13:*.emf=38;5;13:*.axv=38;5;13:*.anx=38;5;13:*.ogv=38;5;13:*.ogx=38;5;13:*.aac=38;5;45:*.au=38;5;45:*.flac=38;5;45:*.mid=38;5;45:*.midi=38;5;45:*.mka=38;5;45:*.mp3=38;5;45:*.mpc=38;5;45:*.ogg=38;5;45:*.ra=38;5;45:*.wav=38;5;45:*.axa=38;5;45:*.oga=38;5;45:*.spx=38;5;45:*.xspf=38;5;45:
LD_LIBRARY_PATH=/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib
PATH=/root/.vscode-server/bin/0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2/bin/remote-cli:/opt/rh/devtoolset-8/root/usr/bin:/opt/rh/devtoolset-8/root/usr/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
MAIL=/var/spool/mail/root
PWD=/root/app
LANG=en_US.UTF-8
SELINUX_LEVEL_REQUESTED=
HISTCONTROL=ignoredups
HOME=/root
SHLVL=5
PYTHONPATH=/opt/rh/devtoolset-8/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib/python2.7/site-packages
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
_=./Main
OLDPWD=/root
# Main程序输出的环境变量和 env 命令输出结果是一样的
[root@localhost app]# env
MANPATH=/opt/rh/devtoolset-8/root/usr/share/man:/opt/rh/devtoolset-8/root/usr/share/man:
XDG_SESSION_ID=2
TERM_PROGRAM=vscode
HOSTNAME=localhost.localdomain
SELINUX_ROLE_REQUESTED=
TERM=xterm-256color
SHELL=/bin/bash
HISTSIZE=1000
SSH_CLIENT=192.168.28.1 45232 22
PERL5LIB=/opt/rh/devtoolset-8/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-8/root/usr/lib/perl5:/opt/rh/devtoolset-8/root//usr/share/perl5/vendor_perl:/opt/rh/devtoolset-8/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-8/root/usr/lib/perl5:/opt/rh/devtoolset-8/root//usr/share/perl5/vendor_perl
TERM_PROGRAM_VERSION=1.85.1
SELINUX_USE_CURRENT_RANGE=
PCP_DIR=/opt/rh/devtoolset-8/root
USER=root
LS_COLORS=rs=0:di=38;5;27:ln=38;5;51:mh=44;38;5;15:pi=40;38;5;11:so=38;5;13:do=38;5;5:bd=48;5;232;38;5;11:cd=48;5;232;38;5;3:or=48;5;232;38;5;9:mi=05;48;5;232;38;5;15:su=48;5;196;38;5;15:sg=48;5;11;38;5;16:ca=48;5;196;38;5;226:tw=48;5;10;38;5;16:ow=48;5;10;38;5;21:st=48;5;21;38;5;15:ex=38;5;34:*.tar=38;5;9:*.tgz=38;5;9:*.arc=38;5;9:*.arj=38;5;9:*.taz=38;5;9:*.lha=38;5;9:*.lz4=38;5;9:*.lzh=38;5;9:*.lzma=38;5;9:*.tlz=38;5;9:*.txz=38;5;9:*.tzo=38;5;9:*.t7z=38;5;9:*.zip=38;5;9:*.z=38;5;9:*.Z=38;5;9:*.dz=38;5;9:*.gz=38;5;9:*.lrz=38;5;9:*.lz=38;5;9:*.lzo=38;5;9:*.xz=38;5;9:*.bz2=38;5;9:*.bz=38;5;9:*.tbz=38;5;9:*.tbz2=38;5;9:*.tz=38;5;9:*.deb=38;5;9:*.rpm=38;5;9:*.jar=38;5;9:*.war=38;5;9:*.ear=38;5;9:*.sar=38;5;9:*.rar=38;5;9:*.alz=38;5;9:*.ace=38;5;9:*.zoo=38;5;9:*.cpio=38;5;9:*.7z=38;5;9:*.rz=38;5;9:*.cab=38;5;9:*.jpg=38;5;13:*.jpeg=38;5;13:*.gif=38;5;13:*.bmp=38;5;13:*.pbm=38;5;13:*.pgm=38;5;13:*.ppm=38;5;13:*.tga=38;5;13:*.xbm=38;5;13:*.xpm=38;5;13:*.tif=38;5;13:*.tiff=38;5;13:*.png=38;5;13:*.svg=38;5;13:*.svgz=38;5;13:*.mng=38;5;13:*.pcx=38;5;13:*.mov=38;5;13:*.mpg=38;5;13:*.mpeg=38;5;13:*.m2v=38;5;13:*.mkv=38;5;13:*.webm=38;5;13:*.ogm=38;5;13:*.mp4=38;5;13:*.m4v=38;5;13:*.mp4v=38;5;13:*.vob=38;5;13:*.qt=38;5;13:*.nuv=38;5;13:*.wmv=38;5;13:*.asf=38;5;13:*.rm=38;5;13:*.rmvb=38;5;13:*.flc=38;5;13:*.avi=38;5;13:*.fli=38;5;13:*.flv=38;5;13:*.gl=38;5;13:*.dl=38;5;13:*.xcf=38;5;13:*.xwd=38;5;13:*.yuv=38;5;13:*.cgm=38;5;13:*.emf=38;5;13:*.axv=38;5;13:*.anx=38;5;13:*.ogv=38;5;13:*.ogx=38;5;13:*.aac=38;5;45:*.au=38;5;45:*.flac=38;5;45:*.mid=38;5;45:*.midi=38;5;45:*.mka=38;5;45:*.mp3=38;5;45:*.mpc=38;5;45:*.ogg=38;5;45:*.ra=38;5;45:*.wav=38;5;45:*.axa=38;5;45:*.oga=38;5;45:*.spx=38;5;45:*.xspf=38;5;45:
LD_LIBRARY_PATH=/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib
PATH=/root/.vscode-server/bin/0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2/bin/remote-cli:/opt/rh/devtoolset-8/root/usr/bin:/opt/rh/devtoolset-8/root/usr/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
MAIL=/var/spool/mail/root
PWD=/root/app
LANG=en_US.UTF-8
SELINUX_LEVEL_REQUESTED=
HISTCONTROL=ignoredups
HOME=/root
SHLVL=5
PYTHONPATH=/opt/rh/devtoolset-8/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib/python2.7/site-packages
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

    cout << "输出此程序运行的环境变量k=v" << endl;

    for (size_t i = 0; envp[i] != NULL; i++) //环境变量数组的最后一个元素必然是0
    {
        cout <<  envp[i] << endl;
    }
    

    return 0;
    
}
```

```shell
INCLUDE_DIR=-I /root/api -I /root/tools 
LIB_DIR=-L /root/api/ -l myapi -L /root/tools -l  public 
all:HelloWorld HelloWorld_1 Main
HelloWorld:HelloWorld.cpp
	g++ -o HelloWorld HelloWorld.cpp $(LIB_DIR) $(INCLUDE_DIR)
	cp HelloWorld ./temp
	./HelloWorld
HelloWorld_1:Helloworld_1.cpp
	g++ -o HelloWorld_1 Helloworld_1.cpp $(LIB_DIR) $(INCLUDE_DIR)
Main:Main.cpp
	g++ -o Main Main.cpp 	
clean:
	rm -rf HelloWorld \
	rm -rf HelloWorld_1\
	rm -rf Main
```

总结一下：`main`函数有三个参数，`argc`、`argv`和`envp`，它的标准写法如下：

```c
int main(int argc,char *argv[],char *envp[])
{
    return 0;
}
```

```
argc	存放了程序参数的个数，包括程序本身。

argv	字符串的数组，存放了每个参数的值，包括程序本身。

envp	字符串的数组，存放了环境变量，数组的最后一个元素是空。
```

在程序中，如果不关心main()函数的参数，可以省略不写。

在实际开发中，可能会有如下场景，C++程序员有可能要提供做好的可执行程序给Java程序员调用。通常这个做好的程序在编写代码的时候，要考虑Java程序员非法调用的习惯，要做好一些判断，错误使用时或发生处理异常时，要告知上层Java程序员的工作。

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
[root@localhost app]# 
```

# 操作环境变量

新增/修改环境变量：

```c
int setenv(const char *name, const char *value, int overwrite);
参数 name		环境变量名。
参数 value		环境变量的值。
参数 overwrite	0-如果环境不存在，增加新的环境变量，如果环境变量已存在，不替换其值；非0-如果环境不存在，增加新的环境变量，如果环境变量已存在，替换其值。
返回值：0-成功；-1-失败（失败的情况极少见）。 

 注意：此函数设置的环境变量只对本进程有效，不会影响shell的环境变量。如果在运行程序时执行了setenv()函数，进程终止后再次运行该程序，上次的设置是无效的。
```

查环境变量：

```c
char *getenv(const char *name);
参数 name： 指定获取的环境变量名。
返回值： 如果存在该环境变量，则返回该环境变量的值对应字符串的指针；如果不存在该环境变量，则返回 NULL。
```

删除环境变量：

```c
int unsetenv(const char *name);
参数 name： 需要移除的环境变量名称。
返回值： 成功返回 0；失败将返回-1，并设置 errno。
```

```c
#include<iostream>
#include<sys/stat.h>
#include<string>
using namespace std;

bool FileIsExist(const string& strFilePath )
{
    //查文件信息，函数执行成功返回 0，函数执行失败，可推理此路径表示的文件不存在
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

    //创建目录
    if(!FileIsExist("/usr/java"))
    {
        mkdir("/usr/java",0755);     
    }
    if(!FileIsExist(preSetEnvV))
    {
        mkdir(preSetEnvV,0755);
    }

    //查JAVA_HOME环境变量 有没有设定?
    curEnv = getenv(preSetEnvK);
    if(curEnv)
    {
        cout << "环境变量" << preSetEnvK << "=" << curEnv << endl; //有输出下之前的
    }
    //设置环境变量
    bRet =  setenv(preSetEnvK,preSetEnvV,1);
    if(!bRet)
    {
        cout<< "更新环境变量" << preSetEnvK << "成功！" <<endl;
    }

    //再查
   curEnv = NULL;
   curEnv =  getenv(preSetEnvK);
   if(!curEnv)
   {
      cout << "环境变量" << preSetEnvK << "=" << curEnv; 
   }

   //删除环境变量
   bRet =  unsetenv(preSetEnvK);
    if(!bRet)
    {
        cout << "删除环境变量成功!" <<endl;
    }

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
[root@localhost app]# 
```

验证环境变量的设定`setenv()`，只对本进程有效的情况。注释掉删除环境变量的逻辑

```c
#include<iostream>
#include<sys/stat.h>
#include<string>
using namespace std;

bool FileIsExist(const string& strFilePath )
{
    //查文件信息，函数执行成功返回 0，函数执行失败，可推理此路径表示的文件不存在
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
    {
        mkdir("/usr/java",0755);     
    }
    if(!FileIsExist(preSetEnvV))
    {
        mkdir(preSetEnvV,0755);
    }

    curEnv = getenv(preSetEnvK);
    if(curEnv)
    {
        cout << "环境变量" << preSetEnvK << "=" << curEnv << endl; //有输出下之前的
    }

    bRet =  setenv(preSetEnvK,preSetEnvV,1);
    if(!bRet)
    {
        cout<< "更新环境变量" << preSetEnvK << "成功！" <<endl;
    }
    
   curEnv = NULL;
   curEnv =  getenv(preSetEnvK);
   if(!curEnv)
   {
      cout << "环境变量" << preSetEnvK << "=" << curEnv; 
   }

   //注释掉删除环境变量的逻辑
//    bRet =  unsetenv(preSetEnvK);
//     if(!bRet)
//     {
//         cout << "删除环境变量成功!" <<endl;
//     }

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
SELINUX_ROLE_REQUESTED=
TERM=xterm-256color
SHELL=/bin/bash
HISTSIZE=1000
SSH_CLIENT=192.168.28.1 45232 22
PERL5LIB=/opt/rh/devtoolset-8/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-8/root/usr/lib/perl5:/opt/rh/devtoolset-8/root//usr/share/perl5/vendor_perl:/opt/rh/devtoolset-8/root//usr/lib64/perl5/vendor_perl:/opt/rh/devtoolset-8/root/usr/lib/perl5:/opt/rh/devtoolset-8/root//usr/share/perl5/vendor_perl
TERM_PROGRAM_VERSION=1.85.1
SELINUX_USE_CURRENT_RANGE=
PCP_DIR=/opt/rh/devtoolset-8/root
USER=root
LS_COLORS=rs=0:di=38;5;27:ln=38;5;51:mh=44;38;5;15:pi=40;38;5;11:so=38;5;13:do=38;5;5:bd=48;5;232;38;5;11:cd=48;5;232;38;5;3:or=48;5;232;38;5;9:mi=05;48;5;232;38;5;15:su=48;5;196;38;5;15:sg=48;5;11;38;5;16:ca=48;5;196;38;5;226:tw=48;5;10;38;5;16:ow=48;5;10;38;5;21:st=48;5;21;38;5;15:ex=38;5;34:*.tar=38;5;9:*.tgz=38;5;9:*.arc=38;5;9:*.arj=38;5;9:*.taz=38;5;9:*.lha=38;5;9:*.lz4=38;5;9:*.lzh=38;5;9:*.lzma=38;5;9:*.tlz=38;5;9:*.txz=38;5;9:*.tzo=38;5;9:*.t7z=38;5;9:*.zip=38;5;9:*.z=38;5;9:*.Z=38;5;9:*.dz=38;5;9:*.gz=38;5;9:*.lrz=38;5;9:*.lz=38;5;9:*.lzo=38;5;9:*.xz=38;5;9:*.bz2=38;5;9:*.bz=38;5;9:*.tbz=38;5;9:*.tbz2=38;5;9:*.tz=38;5;9:*.deb=38;5;9:*.rpm=38;5;9:*.jar=38;5;9:*.war=38;5;9:*.ear=38;5;9:*.sar=38;5;9:*.rar=38;5;9:*.alz=38;5;9:*.ace=38;5;9:*.zoo=38;5;9:*.cpio=38;5;9:*.7z=38;5;9:*.rz=38;5;9:*.cab=38;5;9:*.jpg=38;5;13:*.jpeg=38;5;13:*.gif=38;5;13:*.bmp=38;5;13:*.pbm=38;5;13:*.pgm=38;5;13:*.ppm=38;5;13:*.tga=38;5;13:*.xbm=38;5;13:*.xpm=38;5;13:*.tif=38;5;13:*.tiff=38;5;13:*.png=38;5;13:*.svg=38;5;13:*.svgz=38;5;13:*.mng=38;5;13:*.pcx=38;5;13:*.mov=38;5;13:*.mpg=38;5;13:*.mpeg=38;5;13:*.m2v=38;5;13:*.mkv=38;5;13:*.webm=38;5;13:*.ogm=38;5;13:*.mp4=38;5;13:*.m4v=38;5;13:*.mp4v=38;5;13:*.vob=38;5;13:*.qt=38;5;13:*.nuv=38;5;13:*.wmv=38;5;13:*.asf=38;5;13:*.rm=38;5;13:*.rmvb=38;5;13:*.flc=38;5;13:*.avi=38;5;13:*.fli=38;5;13:*.flv=38;5;13:*.gl=38;5;13:*.dl=38;5;13:*.xcf=38;5;13:*.xwd=38;5;13:*.yuv=38;5;13:*.cgm=38;5;13:*.emf=38;5;13:*.axv=38;5;13:*.anx=38;5;13:*.ogv=38;5;13:*.ogx=38;5;13:*.aac=38;5;45:*.au=38;5;45:*.flac=38;5;45:*.mid=38;5;45:*.midi=38;5;45:*.mka=38;5;45:*.mp3=38;5;45:*.mpc=38;5;45:*.ogg=38;5;45:*.ra=38;5;45:*.wav=38;5;45:*.axa=38;5;45:*.oga=38;5;45:*.spx=38;5;45:*.xspf=38;5;45:
LD_LIBRARY_PATH=/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib:/opt/rh/devtoolset-8/root/usr/lib64/dyninst:/opt/rh/devtoolset-8/root/usr/lib/dyninst:/opt/rh/devtoolset-8/root/usr/lib64:/opt/rh/devtoolset-8/root/usr/lib
PATH=/root/.vscode-server/bin/0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2/bin/remote-cli:/opt/rh/devtoolset-8/root/usr/bin:/opt/rh/devtoolset-8/root/usr/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin
MAIL=/var/spool/mail/root
PWD=/root/app
LANG=en_US.UTF-8
SELINUX_LEVEL_REQUESTED=
HISTCONTROL=ignoredups
HOME=/root
SHLVL=5
PYTHONPATH=/opt/rh/devtoolset-8/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib64/python2.7/site-packages:/opt/rh/devtoolset-8/root/usr/lib/python2.7/site-packages
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

