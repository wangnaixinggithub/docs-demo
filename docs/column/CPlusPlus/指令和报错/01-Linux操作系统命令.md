# Linux操作系统命令



# HelloWorld

## Shell是什么？

- Shell` 这个单词的原意是“外壳”`，跟 `kernel（内核)`相对应，比喻内核外面的一层，即用户跟内核交互的对话界面。

- Shell` 是一个程序，提供一个与用户对话的环境。这个环境只有一个命令提示符，让用户从键盘输入命令，所以又称为命令行环境（` `command line interface` ，简写为 CLI）。 

`Shell` 接收到用户输入的命令，将命令送入操作系统执行，并将结果返回给用户。

- `Shell` 是一个命令解释器，解释用户输入的命令。它支持变量、条件判断、循环操作等语法，所以用户可以用 `Shell` 命令写出各种小程序，又称为 `Shell` 脚本。这些脚本都通过 `Shell` 的解释执行，而不通过编译。

- `Shell` 是一个工具箱，提供了各种小工具，供用户方便地使用操作系统的功能。

`Shell` 有很多种，只要能给用户提供命令行环境的程序，都可以看作是 `Shell` 。

在Linux历史上，主要的 `Shell` 有下面这些：

- Bourne Shell（sh）
- Bourne Again shell（bash）
- C Shell（csh）
- TENEX C Shell（tcsh）
- Korn shell（ksh）
- Z Shell（zsh）
- Friendly Interactive Shell（fish）

其中 `Bash` 是目前最常用的 `Shell` 。 `MacOS` 中的默认 `Shell` 就是 `Bash` 。

通过执行 `echo $SHELL` 命令可以查看到当前正在使用的 `Shell` 。当然，还可以通过 `cat /etc/shells` 查看当前系统安装的所有 `Shell` 种类。

**Shell命令提示符**

进入命令行环境以后，用户会看到 `Shell` 的提示符。提示符往往是一串前缀，最后以一个美元符号 `$` 结尾，用户可以在这个符号后面输入各种命令。

执行一个简单的命令 `pwd` ：

```
wangnaixing@wangnaixing-Dell-G15-5511:~$ pwd
/home/wangnaixing
```

- `wangnaixing`：表示用户名；
- `wangnaixing-Dell-G15-5511`：表示主机名；
- `~`：表示目前所在目录为家目录，其中 `root` 用户的家目录是 `/root` 普通用户的家目录在 `/home` 下；
- `#`：指示你所具有的权限（ `root` 用户为 `#` ，普通用户为 `$` ）。

**命令格式与参数**

```c
命令语法：
command parameters（命令 参数）

命令附加参数语法：
单个参数：ls -a（a 是英文 all 的缩写，表示“全部”）
多个参数：ls -al（全部文件 + 列表形式展示）
单个长参数：ls --all
多个长参数：ls --reverse --all
长短混合参数：ls --all -l

命令附加参数值语法：

短参数：command -p 10（例如：ssh root@121.42.11.34 -p 22）
长参数：command --paramters=10（例如：ssh root@121.42.11.34 --port=22）
```



**操作快捷方式**

在开始学习 `Linux` 命令之前，有这么操作一些快捷方式，是必须要提前掌握的，它将贯穿整个使用 `Linux`操作系统的职业打工生涯。

- 通过上下方向键 ↑ ↓ 来调取过往执行过的 `Linux` 命令；
- 命令或参数仅需输入前几位就可以用 `Tab` 键补全；
- `Ctrl + L`：清除屏幕并将当前行移到页面顶部；
- `Ctrl + C`：中止当前正在执行的命令；
- `Ctrl + U`：从光标位置剪切到行首；
- `Ctrl + K`：从光标位置剪切到行尾
- `Ctrl + W`：剪切光标左侧的一个单词；
- `Ctrl + Y`：粘贴 `Ctrl + U | K | Y` 剪切的命令；
- `Ctrl + A`：光标跳到命令行的开头；
- `Ctrl + E`：光标跳到命令行的结尾；
- `Ctrl + D`：关闭 `Shell` 会话；



**文件的组织**

Linux有一句名言，叫万物都是文件！掌握Linux目录层级，是我们入门的第一步！

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230608191505131-16862229073771-17167203762371.png)

```c++
/bin
bin是Binaries（二进制文件）的缩写，这个目录存放了经常使用的系统命令。
/boot
这里存放了启动Linux时的核心文件。
/dev
dev是Device（设备）的缩写，该目录下存放的是Linux的外部设备。
/etc
etc是Etcetera（等等）的缩写，这个目录用来存放系统管理所需要的配置文件。
/home
用户的主目录，在Linux中，每个用户都有一个自己的目录，创建用户后，在/home目录中创建一个子目录，专用于该用户。
/lib
lib是Library（库） 的缩写这个目录里存放着系统最基本的静态和动态链接库。
/lost+found
这个目录一般情况下是空的，当系统非法关机后，这里就存放了一些文件。
/media
linux系统会自动识别一些设备，例如U盘、光驱等等，当识别后，Linux 会把识别的设备挂载到这个目录下。
/mnt
系统提供该目录是为了让用户临时挂载别的文件系统的，我们可以将光驱挂载在/mnt上，然后进入该目录就可以查看光驱里的内容了。
/opt
opt是optional（可选）的缩写，这是给主机额外安装软件所摆放的目录。例如Oracle数据库系统安装后的文件可以放在这个目录中。
/proc
proc是Processes（进程）的缩写，/proc是伪文件系统（虚拟文件系统），存放了当前内核运行状态的特殊文件，它是系统内存的映射，读取这个目录下的文件可以获取系统运行的信息。
/root
该目录为系统管理员的主目录。
/sbin
s是Super User的意思，是Superuser Binaries（超级用户的二进制文件）的缩写，/sbin存放了系统管理员使用的系统管理程序。
/selinux
这个目录是Redhat（CentOS）特有的目录，selinux 是一种安全机制，类似于Windows的防火墙，但是，这套机制比较复杂，这个目录了与selinux相关的文件。
/srv
该目录存放了服务启动之后的数据。
/sys
该目录挂载了sysfs文件系统，存放了系统设备信息，包含所有系统硬件层次的视图。
/tmp
tmp是temporary（临时）的缩写这个目录是用来存放一些临时文件的。
/usr
usr是unix shared resources（共享资源）的缩写，这是一个非常重要的目录，很多应用程序和文件存放在这个目录下，类似Windows的Program Files目录。
/var
var是variable（变量）的缩写，存放着经常变动的文件，如缓存文件、日志文件、程序运行时产生的文件等。
/run
这是一个临时文件系统，存储系统启动以来的信息。当系统重启时，这个目录下的文件应该被删掉或清除。
```

## 相对路径和绝对路径

严谨的说，文件名是由**目录+文件名**组成的。区别于Window操作系统的是，Linux系统的文件没有文件扩展名！

对于目录和文件，是有一些约定的表述的，以`/usr/include/stdio.h`为例。

- stdio.h是文件名，它在/usr/include目录中。
- **全路径文件名**包含了目录名和文件名，即/usr/include/stdio.h，也叫绝对路径文件名。
- 一个圆点 . 表示当前目录；
- 两个圆点 .. 表示当前目录的上一级目录。

在Linux系统下，一切都是文件。 内存、磁盘、打印机、网卡，都用文件名表示（可以理解为文件名只是一个符号而已）

Linux也支持磁盘分区，磁盘分区的管理由Linux文件系统所调度，在工作中，我们可以通过`df`命令（Disk Free）来查看，操作系统可用的磁盘空间。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231211220407598-17023034496391-17167203946062.png)





需要提醒读者的是，不是自己创建的目录和文件不要轻易改动。

对于一些临时处理的文件，我们可以放到`/temp`中， `/tmp`指代临时目录，即在里面创建目录和文件，但不保证它的安全和有效性，仅开发用户做临时处理用途。

## 通信问题排查

如果读者安装纯净版本的Linux，我们通过`ip addr` 查当前虚拟机的IP地址会发现只有本地环路地址。即127.0.0.1, 遇到此类情况，我们可以对`/etc/sysconfig/network-scripts/`目录下的系统配置的网卡脚本`ifcfg-ens33`进行调整。将配置项`onboot=true`激活。既可以查到网口地址。

如果遇到网络不能互联互通，即开发机器不能和虚拟机器通信，很大可能是虚拟机NAT网络接口和宿主机器的网络适配器接口不在同一个局域网内。只需要简单修改`VMWare`配置即可！在处理好了之后，我们就可以通过`ssh`远程连接客户端，轻易的连接到虚拟机服务器啦。





# 软件安装

在Linux中，软件安装，只需要一个命令就可以了，以发行版`CentosOs`为例子，我们通常使用 `Yum` 命令进行软件安装。个人认为这种方法比`Windows` 强太多了，不需要向`Window` 那种去网上找`.exe`下载链接，尤其是`Yum`对程序包依赖，比如说已经安装了此软件，如何卸载，如果更新，很有一套。这是`Windows`系统不能比的。

## yum 下载软件

**yum是什么**

在`Linux` 操作系统中，软件是以包的形式存在，一个软件包其实就是软件的所有文件的压缩包，是二进制的形式，包含了安装软件的所有指令。 `Red Hat` 家族的软件包后缀名一般为 `.rpm` ， `Debian` 家族的软件包后缀是 `.deb` 。

`Linux` 的包都存在一个仓库，叫做软件仓库，所有的软件包都在仓库里拿。仓库可以使用 `yum` 来管理软件包，即解决怎么拿的问题。 `yum` 是 `CentOS` 中默认的包管理工具，适用于 `Red Hat` 一族。

可以理解成 `Node.js` 的 `npm` ，`Java` 的 `Maven/Gradle`。

**yum的常用命令**

通过`yum`命令附加一些参数就可以对软件包的安装、更新、删除、查询进行整合管理，方便我们安装软件。

- `yum update | yum upgrade`  更新软件包

操作系统大差不差，基本每天都会升级软件和系统内核补丁，就好比Window系统的检查更新操作一样。在Linux系统，对于系统更新我们只需通过`yum update`命令就可以实现一键全部更新。命令底层会计算全部软件包升级总计需要多少M,并再次询问你，要不要更新。我们输入`yes` 就可以看到这些包，哗啦啦在更新了。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230605223255339-17167204113243.png)





如果我们不希望被再次询问，可以使用命令参数追加，`yum update -y` 让其直接做更新动作。最终就会包所有的`rpm`包都更新好了！

- `yum search xxx` 搜索相应的软件包
- `yum install xxx` 安装软件包

通过`yum install` 去安装软件包，是我们最常用的`yum` 命令附加参数操作了，没有之一。一旦执行此命令，系统会自动的去yum源服务器下载需要的rpm包，进行自动化的安装。下面以安装火狐浏览器为例子进行演示：

```shell
# 1、安装 火狐浏览器
yum install firefox

#2、查下，火狐浏览器是否安装成功
rpm -qa | grep firefox

# 3、观察下安装的软件包,我们也可在此感知到很多关于软件版本、运行环境等信息。
# firefox 软件名
#91.12.0-2 软件版本号
# el7.centos.x86_64 软件所运行的硬件平台

#4、再次查看该安装的软件包，发现最后的标识会从 update 变为 @update.即系统告知我们，更新包已经替换安装完毕了！
yum list |grep firefox
```

![image-20230605224559951](01-Linux操作系统命令.assets/image-20230605224559951-16859763633072.png)

![](01-Linux操作系统命令.assets/image-20230605224837120.png)

- `yum remove xxx` 删除软件包

在Linux操作系统中，软件卸载只需要 `yum remove` 就可以了。比`Windos`卸载方便快捷多了，你想想`Windows`系统卸载一个软件多么麻烦，笔者之前卸载一个Oracle,卸完之后，出现神马注册表没有清理干净整个人麻掉了。

下面以卸载火狐浏览器软件为演示例子：

```c++
# 1、 卸载firefox 浏览器软件
yum remove firefox
#2、Centos 会进行一次系统分析，告诉你移除此软件的package信息，占用大小，运行平台，版本，等信息问你是否确定卸载此软件？
y
#3、系统执行卸载firefox 浏览器，执行完毕告知你，完成！
```

![](01-Linux操作系统命令.assets/image-20230605225212901-16859767342383.png)

- `yum deplist xxx` 查软件包的依赖关系

我们知道，Linux的安装包都是rpm包，包与包之间是有一定存在依赖关系的。如果我们想知道某个软件包依赖哪些软件包，可以使用` yum deplist `查看

下面以查看火狐浏览器软件包依赖关系为例子演示：

```shell
# 查firefox 火狐浏览器 软件包的依赖关系。
yum deplist firefox

#随即，可以看到shell终端就展示了火狐浏览器全部的依赖关系，依赖哪些文件，以及这些文件的提供者是谁。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20220805225434882-17167204966014.png)

- ` yum list  Or yum list | grep XXX` 查已经安装的包

在`linux`操作系统中，如果我们想查看所有已经安装的rpm软件包信息，可以使用`yum list ` 命令。

```shell
# 1、查看当前系统已经安装的软件包信息
yum list 
# 2、会显示出很多...
```

实际开发中，我们只是希望显示出某个软件包信息而已，即往往是为了验证我们移除某些`.rpm`软件包有没有移除干净。针对此场景需求，我们通常会配合`grep`管道命令搭配使用。

```shell
# 1、只查看firefox软件包信息
yum list | grep firefox

# 2、可以看到，当前系统安装的是68.10.0的包，并且现在已经更新有91.12.0的更新包。

#嘿嘿，如果这个时候我们想更新，直接 yum update firefox 就完事了，是不是比Window操作系统来得简单得多。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20220805235619250-17167205993245.png)

## 切换 CentOS 软件下载源

有时候 `CentOS` 默认的 `yum` 源不一定是国内镜像，导致 `yum` 在线安装及更新速度不是很理想。这时候需要将 `yum` 源设置为国内镜像站点。目前，国内主要开源的镜像站点是网易和阿里云。

下面以切换下载源为阿里镜像为例子，介绍执行切换CentOs软件下载的操作流程。

```shell
#1、首先备份系统自带yum源配置文件
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup

#2、下载阿里云的 yum源配置文件到 /etc/yum.repos.d/CentOS7
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

#3、生成缓存
yum makecache
#阿里官网操作说明：https://developer.aliyun.com/mirror/centos?spm=a2c6h.13651102.0.0.3e221b11YbjJ5M
```

上面切换CentOs软件源是阿里提供的做法，其思路就是人家帮我们写好了一个`CentOS-Base.repo`,作为开发的你，你只需要通过`HTTP`协议把他下载下来把原来替换掉就完事了。

实际上我们也可以自己来配置下，加深对`yum`的理解。想一想，`yum`是不是和Java中的项目管理工具`maven` 中拉取库依赖的机制很相似呢？

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230605225501573-17167206387976.png" style="zoom: 50%;" />

`maven`有中央仓库，也有镜像仓库。做Java开发的同学，一般都会改仓库镜像，配置成国内的，比如阿里的maven中央镜像仓库。这样拉Jar包依赖的时候就会快很多。

同样的，yum也有源地址服务器在国外，不够快，我们通常也是要改成国内镜像的，让下载软件包的速度加快。

在`maven`是使用`setting.xml`来配置镜像仓库的，同理可推，`yum`是通过`CentOS-Base.repo`去配置软件包镜像下载网址的。

下面演示如果修改Linux系统的 `CentOS-Base.repo` 来更换Centos下载软件源站点。

```shell
#1、第一步，查yum源服务器的Ip地址配置
more /etc/yum.resps.d/CentOS-Base.repo

#2、可以清晰的看到Yum源:http://mirrorlist.centos.org/,然后这个网址的服务器在国外，就会导致我们的下载速度不是很快。我们可以切换成本地Yum源镜像的服务器，就可以大大提升我们下载软件的下载速度了。

#3、疑问:为啥我不切换镜像其实下载速度还不错呢？
# 简单搂一眼 CentOS-Base.repo配置文件。
# 可以看到CentOs-Base.repo文件的注释说明，因为镜像系统选择算法，实际上会选择一个离我们地理位置最近的地方作为Yum源镜像。

# 4、 vim 一顿猛猛改！~
```

改配置之前的`CentOS-Base.repo`

```shell
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#

[base]
name=CentOS-$releasever - Base
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=os&infra=$infra
#baseurl=http://mirror.centos.org/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

#released updates 
[updates]
name=CentOS-$releasever - Updates
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=updates&infra=$infra
#baseurl=http://mirror.centos.org/centos/$releasever/updates/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=extras&infra=$infra
#baseurl=http://mirror.centos.org/centos/$releasever/extras/$basearch/
gpgcheck=1
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7

#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus
mirrorlist=http://mirrorlist.centos.org/?release=$releasever&arch=$basearch&repo=centosplus&infra=$infra
#baseurl=http://mirror.centos.org/centos/$releasever/centosplus/$basearch/
gpgcheck=1
enabled=0
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-7
```

改之后的`CentOS-Base.repo`

```c++
# CentOS-Base.repo
#
# The mirror system uses the connecting IP address of the client and the
# update status of each mirror to pick mirrors that are updated to and
# geographically close to the client.  You should use this for CentOS updates
# unless you are manually picking other mirrors.
#
# If the mirrorlist= does not work for you, as a fall back you can try the 
# remarked out baseurl= line instead.
#
#
 
[base]
name=CentOS-$releasever - Base - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/os/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/os/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/os/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#released updates 
[updates]
name=CentOS-$releasever - Updates - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/updates/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/updates/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/updates/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#additional packages that may be useful
[extras]
name=CentOS-$releasever - Extras - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/extras/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/extras/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/extras/$basearch/
gpgcheck=1
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#additional packages that extend functionality of existing packages
[centosplus]
name=CentOS-$releasever - Plus - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/centosplus/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/centosplus/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/centosplus/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
 
#contrib - packages by Centos Users
[contrib]
name=CentOS-$releasever - Contrib - mirrors.aliyun.com
failovermethod=priority
baseurl=http://mirrors.aliyun.com/centos/$releasever/contrib/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/contrib/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/contrib/$basearch/
gpgcheck=1
enabled=0
gpgkey=http://mirrors.aliyun.com/centos/RPM-GPG-KEY-CentOS-7
```

其修改配置项的操作总的来说就是把国外的网站统统换成国内的，就完成我们yum下载软件包网址换成了国内镜像版本。

两种方法处理操作下来，比较之，你会发现，实际上还是阿里提供的方式简单容易上手。

这时候，再去安装软件，可以看到yum软件包下载镜像网站全部都是阿里的了。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230605230741429-17167206813097.png)



# 联网下载

## wget 下载资源

 `wget`是一个下载文件的工具，它用在命令行下。即处理在我们如果知道了下载链接，则那么通过`wget` 命令，能帮助我们快速的从互联网中下载此资源。对于Linux用户是必不可少的工具。

首先，我们先要安装`wget` 命令，假如说，你的Linux系统没有`wget`命令,并且在`yum`仓库中也找不到该wget软件包的情况，这里提供一个网上安装软件包的思路。

```shell
# 1、查到163 linux系统软件包镜像下载网址
https://mirrors.163.com/centos/7/os/x86_64/Packages/

# 2、上传该包，并新建wget软件主目录，执行安装
mkdir /usr/local/wget
mv  ./wget-1.14-18.el7_6.1.x86_64.rpm /usr/local/wget
cd /usr/local/wget && ls
rpm -ivh wget-1.14-18.el7_6.1.x86_64.rpm

#3、验证安装成功
rpm -qa|grep "wget"
wget -V
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230605222756579-17167207452138.png)

## ifconfig 查网卡信息

有的时候，我们需要输出一些网络信息，比如使用`ifconfig` 命令输出当前的Linux操作系统的网络IP地址。就可以通过在yum仓库中找到`net-tools`包安装。

```c
#1、在yum中查询ifconfig命令
yum search ifconfig

#2、安装net-tools工具,从而拥有ifconfig命令
yum install net-tools.x86_64

#ifconfig命令是设置或显示网络接口的程序，可以显示出我们机器的网卡信息，可是有些时候最小化安装CentOS等Linux发行版的时候会默认不安装ifconfig等命令，这时候你进入终端，运行ifconfig命令就会出错

#----解决办法：使用yum安装ifconfig
```



# 文件路径

## pwd 查当前路径

我们知道Linux操作系统只有一个根 用`/`表示。每一个文件/文件夹都有一个在操作系统中的唯一文件路径。和`Windows`相比，没有了逻辑驱动器的概念（卷、分区GUID,文件系统NTFS,这里不做扩展...）。

在`shell`终端，我们一定会进入到某一个路径中，来做某些操作的。这时候通过`pwd`命令，我们可以很轻易的获取到当前目录所在的文件路径。

```shell
# 比如，显示我当前操作目录的文件路径
pwd
# 很显然，我当前是在/home/wangnaixing 下做操作。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606103832348-168601911318815-17023073876566-17167207770129.png)

## which 查可执行全文件路径

每一个命令，等价于一个软件。额，也可以说是可执行文件，那么每一个软件都会由自己的软件主目录，比如你安装一个OpenCv也好，还是什么也好，在Windows系统安装引导时一定会让你指定安装路径的，这个目录就是你的软件主目录了，`Linux` 遵循约定大于配置的思路，这些软件会被归类帮你放好的，我们只需要`which` 来查下，软件主目录即可，也可以说查找并显示给定命令的绝对路径，再可以说查可执行文件所在的路径。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231211231719273-171672081325310.png)

## cd 切换当前目录

cd是英语change directory的缩写，表示`Shell终端`操作所在目录。

```shell
cd / #--> 跳转到根目录

cd ~ #--> 跳转到家目录

cd .. #--> 跳转到上级目录

cd ./home #--> 跳转到当前目录的home目录下

cd /home/lion #--> 跳转到根目录下的home目录下的lion目录

cd #--> 不添加任何参数，也是回到家目录

# 技巧：比如 输入cd /ho + 单次 tab键会自动补全路径 如果 + 两次 tab键会列出所有可能的目录列表。
```



# 文件操作

## ln 文件链接

英文 `Link` 的缩写，该命令用于表示创建链接。

学习创建链接之前，首先我们要理解链接是什么？并理解链接之前，再先来看看 `Linux` 的文件是如何存储的？

在`Linux` 中，文件的存储方式分为3个部分：

- 文件名

- 文件内容

- 权限


其中文件名的列表是存储在硬盘的其它地方和文件内容是分开存放的，每个文件名通过 `inode（索引节点编号）` 绑定到文件内容。就是说文件内容和文件名是分离的，底层弄了一张表，通过文件名找到 `inode` 号，再查到此文件对应内容。

了解的文件的存储方式之后，我们再来看`链接`的概念，在`Linux`中有两种链接类型：硬链接和软链接。

**硬链接(Hard Link)**

硬链接的两个文件共享同样文件内容，就是同样的 `inode` ，一旦文件1和文件2之间有了硬链接，那么修改任何一个文件，修改的都是同一块内容。这样的好处是，防止用户误删，因为有多个文件名（文件路径）指向了同一个文件内容，删除一个文件名，只是少了一个硬链接，并不会影响的`inode` 和其他文件名的绑定关系，只有当最后一个连接被删除后，硬链接才彻底消失。

下面我们来验证一下硬链接:

```c
# 创建一个测试文件 a1.txt
[root@localhost ~]# touch a1.txt
# 创建a1文件的一个硬链接文件 hard.txt    
[root@localhost ~]# ln a1.txt hard.txt
 # 查当前目录文件信息，并显示文件的 inode 值    
[root@localhost ~]# ls -li 
总用量 4
67146875 -rw-r--r--. 2 root root    0 12月 11 10:34 a1.txt
67146831 -rw-------. 1 root root 1260 6月   6 2023 anaconda-ks.cfg
67146875 -rw-r--r--. 2 root root    0 12月 11 10:34 hard.txt   
[root@localhost ~]# 
```

从显示的结果看，硬链接文件hard 和 原文件a1 inode值相同，都是  67146875

```shell
# 向a1写入内容为JacksonWang
[root@localhost ~]# echo "JacksonWang" > a1.txt
#查a1文件的内容
[root@localhost ~]# cat a1.txt
JacksonWang
 #查硬链接hard文件的内容发现是一样的
[root@localhost ~]# cat hard.txt
JacksonWang
#将原文件删除
[root@localhost ~]# rm -f a1.txt
#再查看硬链接文件内容是否存在 最终发现存在
[root@localhost ~]# cat hard.txt 
JacksonWang
```

通过上面的测试可以看出：当删除原文件a1后，硬链接不受影响。

硬链接缺点：

- 只能创建指向常规文件的硬链接，不能创建指向目录和特殊文件的硬链接。

```shell
[root@localhost ~]# ln /etc/ c.txt
ln: "/etc/": 不允许将硬链接指向目录
[root@localhost ~]# 
```

- 硬链接不能跨文件系统

```shell
[root@servera ~]# ln hard.txt /mountpoint/a.txt
ln: failed to create hard link '/mountpoint/a.txt' => 'hard.txt': Invalid cross-device link
[root@servera ~]# df -Th
Filesystem     Type      Size  Used Avail Use% Mounted on
devtmpfs       devtmpfs  388M     0  388M   0% /dev
tmpfs          tmpfs     411M     0  411M   0% /dev/shm
tmpfs          tmpfs     411M   11M  400M   3% /run
tmpfs          tmpfs     411M     0  411M   0% /sys/fs/cgroup
/dev/vda1      xfs        10G  1.5G  8.6G  15% /
tmpfs          tmpfs      83M     0   83M   0% /run/user/0
/dev/vdb1      ext4      976M  2.6M  907M   1% /mountpoint
```

对比于软链接，软链接既可以创建指向文件的链接也可以创建指向目录的链接，因此实际开发中，软链接的使用会更加频繁。

```shell
# 创建语法：
ln file1 file2  # 创建 file2 为 file1 的硬链接
```

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230109224350833.png" style="zoom:50%;" />



总之，我们要清楚一点，如果我们用 `rm file1` 来删除 `file1` ，对 `file2` 没有什么影响，对于硬链接来说，删除任意一方的文件，共同指向的文件内容并不会从硬盘上删除。只有同时删除了 `file1` 与 `file2` 后，它们共同指向的文件内容才会消失。



**软链接(Symbolic Link)**

软链接也叫符号链接，有点类型`Windows`当中的快捷方式的意思。它实际上是一个特殊的文件。在软链接当中，文件实际上是一个文本文件，其中包含的有另一文件的位置信息的感觉。

下面我们来验证一下软链接:

```shell
# 创建原文件soft.txt
[root@localhost ~]# touch soft.txt
# 给原文件写入内容
[root@localhost ~]# echo "JasonWang Symbolic Link Test" > soft.txt
# 创建软连接
[root@localhost ~]# ln -s soft.txt abc.txt
# 查当前目录情况
[root@localhost ~]# ls -li 
总用量 12
67146878 lrwxrwxrwx. 1 root root    8 12月 11 10:51 abc.txt -> soft.txt
67146831 -rw-------. 1 root root 1260 6月   6 2023 anaconda-ks.cfg
67146877 -rw-r--r--. 1 root root   29 12月 11 10:50 soft.txt
```

从上面的结果可以看出，软链接文件abc.txt与原文件soft.txt的inode值不相等，这种情况下我们称之为“断链”。

断链：指向缺失文件的软链接

软链接优点：

- 可以指向目录或特殊文件，而不仅限于常规文件

```shell
[root@servera ~]# ln -s /etc/ directory
[root@servera ~]# ll -li
total 16
4318232 -rw-------. 1 root root 6947 Apr  4  2019 anaconda-ks.cfg
4427926 lrwxrwxrwx. 1 root root    5 Jun 27 09:09 directory -> /etc/
4318231 -rw-------. 1 root root 6750 Apr  4  2019 original-ks.cfg
```

- 可以跨越文件系统

```shell
[root@servera ~]# ln -s /abc/c.txt redhat.txt
[root@servera ~]# df -Th
Filesystem     Type      Size  Used Avail Use% Mounted on
devtmpfs       devtmpfs  388M     0  388M   0% /dev
tmpfs          tmpfs     411M     0  411M   0% /dev/shm
tmpfs          tmpfs     411M   11M  400M   3% /run
tmpfs          tmpfs     411M     0  411M   0% /sys/fs/cgroup
/dev/vda1      xfs        10G  1.5G  8.5G  15% /
tmpfs          tmpfs      83M     0   83M   0% /run/user/0
/dev/vdb1      ext4      976M  2.6M  907M   1% /abc
```

```shell
# 创建语法：
ln -s file1 file2  #--> 创建 file2 为 file1 的软链接
```

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606142637209.png" style="zoom:50%;" />

```shell
total 0
-rw-r--r-- 1 root root 0 Jan 14 06:29 file1
lrwxrwxrwx 1 root root 5 Jan 14 06:42 file2 -> file1  # 表示file2 指向 file1
```

总之，创建软链接，我们要记住一点。 `file2` 只是 `file1` 的一个快捷方式，它指向的是 `file1` ，所以显示的是 `file1` 的内容，但其实 `file2` 的 `inode` 与 `file1` 并不相同。如果我们删除了 `file2` 的话， `file1` 是不会受影响的，但如果删除 `file1` 的话， `file2` 就会变成死链接，因为指向的文件不见了。

## locate 快速文件搜索

`locate`，定位的意思，作用是让使用者可以快速的搜寻系统中是否有指定的文件。

`locate`的速度比`find`快，因为它并不是真的查找文件，而是查数据库 所以新建的文件，我们立即用"locate"命令去查找，一般是找不到的。因为数据库的更新不是实时的，数据库的更新时间由系统维护。通常我们用`updatedb`命令来更新数据库，这样就能查询到刚才新建的文件了。

通常来说，这个搜索的后台数据库在`/var/lib/mlocate`这个目录下，但是不同的Linux系统可能有微小不同，我们可以通过`locate locate` 来查库在什么位置。

另外，并不是所有的目录下的文件都会用`locate`命令查得到。具体的查询规则，可以在 `/etc/updatedb.conf`配置文件中进行配置。

/etc/updatedb.conf配置文件解析：

```shell
1) PRUNE_BIND_MOUNTS = "yes"
   值为"yes"时开启搜索限制，此时，下边的配置生效；为"no"时关闭搜索限制。
2) PRUNEFS =
   后边跟搜索时，不搜索的文件系统。
3) PRUNENAMES = 
   后边跟搜索时，不搜索的文件类型。
4) PRUNEPATHS = 
   后边跟搜索时，不搜索的文件所在的路径。
```

参数说明：

```shell
"locate -c" 查询指定文件的数目。(c为count的意思)
"locate -e" 只显示当前存在的文件条目。(e为existing的意思)
"locate -h" 显示"locate"命令的帮助信息。(h为help的意思)
"locate -i" 查找时忽略大小写区别。(i为ignore的意思)
"locate -n" 最大显示条数" 至多显示"最大显示条数"条查询到的内容。
"locate -r" 使用正则运算式做寻找的条件。(r为regexp的意思)
```

如果说你没有安装`locate` 软件，则可以通过`yum` 做安装。

```shell
# 安装locate软件包
yum -y install mlocate
#  更新数据库
updatedb
```

接下来，我们演示下此命令如何使用：

```shell
# 查etc目录下所有以sh开头的文件
[root@localhost ~]# locate /etc/sh
/etc/shadow
/etc/shadow-
/etc/shells
# 查找etc目录下所有以sh开头的文件的数目
[root@localhost ~]# locate -c /etc/sh
3
# 查etc目录下所有以sh开头的文件，并最多显示2条
[root@localhost ~]# locate -n 2 /etc/sh
/etc/shadow
/etc/shadow-
#  新建的文件，更新数据库后就能查到了
[root@localhost ~]# touch JAVA.txt
[root@localhost ~]# updatedb
[root@localhost ~]# locate -i java.txt
/root/JAVA.txt
/root/java.txt
# 只显示当前存在的文件条目
[root@localhost ~]# rm -rf java.txt
[root@localhost ~]# locate -i  java.txt
/root/JAVA.txt
/root/java.txt
[root@localhost ~]# locate -e -i  java.txt
/root/JAVA.txt

# 正则通配查询
[root@localhost ~]# locate fil*.txt

```



## grep 文本搜索

`grep`全拼是`Global search Regular expression and Print out the line`，根据用户指定的模式（过滤条件)对目标文本逐行进行匹配检查，打印匹配到的行，简单来说就是，在文件中查找关键字，并显示关键字所在行。

`grep` 底层的工作方式是， 它在一个或多个文件中搜索字符串模板。如果模板包括空格，则必须被引用，模板后的所有字符串被看作文件名。搜索的结果被送到标准输出，不影响原文件内容。

**语法格式：**

```c
grep [option] pattern file
```

**参数：**

用于过滤/搜索的特定字符。可使用[正则表达式](https://so.csdn.net/so/search?q=正则表达式&spm=1001.2101.3001.7020)能多种命令配合使用，使用上十分灵活。

```shell
-a   --text   #不要忽略二进制的数据。

-A<显示行数>   --after-context=<显示行数>   #除了显示符合范本样式的那一列之外，并显示该行之后的内容。

-b   --byte-offset   #在显示符合样式的那一行之前，标示出该行第一个字符的编号。

-B<显示行数>   --before-context=<显示行数>   #除了显示符合样式的那一行之外，并显示该行之前的内容。

-c    --count   #计算符合样式的列数。

-C<显示行数>    --context=<显示行数>或-<显示行数>   #除了显示符合样式的那一行之外，并显示该行之前后的内容。

-d <动作>      --directories=<动作>   #当指定要查找的是目录而非文件时，必须使用这项参数，否则grep指令将回报信息并停止动作。

-e<范本样式>  --regexp=<范本样式>   #指定字符串做为查找文件内容的样式。

-E      --extended-regexp   #将样式为延伸的普通表示法来使用。

-f<规则文件>  --file=<规则文件>   #指定规则文件，其内容含有一个或多个规则样式，让grep查找符合规则条件的文件内容，格式为每行一个规则样式。

-F   --fixed-regexp   #将样式视为固定字符串的列表。

-G   --basic-regexp   #将样式视为普通的表示法来使用。

-h   --no-filename   #在显示符合样式的那一行之前，不标示该行所属的文件名称。

-H   --with-filename   #在显示符合样式的那一行之前，表示该行所属的文件名称。

-i    --ignore-case   #忽略字符大小写的差别。

-l    --file-with-matches   #列出文件内容符合指定的样式的文件名称。

-L   --files-without-match   #列出文件内容不符合指定的样式的文件名称。

-n   --line-number   #在显示符合样式的那一行之前，标示出该行的列数编号。

-q   --quiet或--silent   #不显示任何信息。

-r   --recursive   #此参数的效果和指定“-d recurse”参数相同。

-s   --no-messages   #不显示错误信息。

-v   --revert-match   #显示不包含匹配文本的所有行。

-V   --version   #显示版本信息。

-w   --word-regexp   #只显示全字符合的列。

-x    --line-regexp   #只显示全列符合的列。

-y   #此参数的效果和指定“-i”参数相同。

```

**规则表达式：**

```sh
^  #锚定行的开始 如：'^grep'匹配所有以grep开头的行。

$  #锚定行的结束 如：'grep$'匹配所有以grep结尾的行。

.  #匹配一个非换行符的字符 如：'gr.p'匹配gr后接一个任意字符，然后是p。

*  #匹配零个或多个先前字符 如：'*grep'匹配所有一个或多个空格后紧跟grep的行。

.*   #一起用代表任意字符。

[]   #匹配一个指定范围内的字符，如'[Gg]rep'匹配Grep和grep。

[^]  #匹配一个不在指定范围内的字符，如：'[^A-FH-Z]rep'匹配不包含A-R和T-Z的一个字母开头，紧跟rep的行。

\(..\)  #标记匹配字符，如'\(love\)'，love被标记为1。

\<      #锚定单词的开始，如:'\<grep'匹配包含以grep开头的单词的行。

\>      #锚定单词的结束，如'grep\>'匹配包含以grep结尾的单词的行。

x\{m\}  #重复字符x，m次，如：'0\{5\}'匹配包含5个o的行。

x\{m,\}  #重复字符x,至少m次，如：'o\{5,\}'匹配至少有5个o的行。

x\{m,n\}  #重复字符x，至少m次，不多于n次，如：'o\{5,10\}'匹配5--10个o的行。

\w    #匹配文字和数字字符，也就是[A-Za-z0-9]，如：'G\w*p'匹配以G后跟零个或多个文字或数字字符，然后是p。

\W    #\w的反置形式，匹配一个或多个非单词字符，如点号句号等。

\b    #单词锁定符，如: '\bgrep\b'只匹配grep。
```

```sh
# 通过进程名 查进程，注意ps -ef 是查全部进程
[root@localhost ~]# ps -ef |grep svn
root      11519   2919  0 17:15 pts/1    00:00:00 grep --color=auto svn

#通过进程名 查指定进程数量
[root@localhost ~]# ps -ef|grep -c  svn
1
#查file中指定的字符串C++
[root@localhost ~]# grep "C++" file
C++
[root@localhost ~]# cat file
JavaScript
Java
C++
#查file中以J字符开头的字符串
[root@localhost ~]# grep "^J" file
JavaScript
Java
#查file中不是以J字符开头的字符串
[root@localhost ~]# grep "^[^J]" file
C++
[root@localhost ~]# 

```

## find 快速文件搜索 

`find`命令通常用于查找文件，它会去遍历你的实际硬盘进行查找，而且它允许我们对每个找到的文件进行后续操作，功能非常强大。

如下所示，这是`find` 命令使用的基本格式。

```shell
find 指定路径 [选项] 搜索目录
```

在查询之前，我们十分清楚一点，`~`  `.`  `/`这些字符 在Linux操作系统中分别代表什么

```shell
~表示用户所在目录
.表示当前目录
/表示根目录
```

```shell
# 查当前目录 有没有叫DM的文件
[root@localhost ~]# find . -name DM
./DM
# 查用户家目录（用户所在目录） 有没有叫DM的文件
[root@localhost ~]# find ~ -name DM
/root/DM
# 查根目录 有没有叫DM的文件
[root@localhost ~]# find / -name DM
find: ‘/run/user/1000/gvfs’: 权限不够
/root/DM
```

上面我们使用了`find` 命令的附加参数`-name` ,即表示按照文件名做搜索，通常我们还可以使用如下附加参数进行搜索，以满足我们的开发需求。

```
-name: 按照文件名搜索；
-iname: 按照文件名搜索，不区分文件名大小；
-inum: 按照 inode 号搜索；
```

如果说，我们在使用命令`find / -name ***`查找文件的时候，可能会遇到以下报错，报错如下:

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212094439717-17023454806381-171672094878211.png)

**错误分析**

在全局搜索时，find命令很容易出现这样的错误。`find: ‘/run/user/1000/gvfs’: 权限不够`但我们明明用的是root用户啊，为什么权限不足呢？

**排查处理**

据官方说这是一个**bug[bug#615848]**，原因是**FUSE文件系统和权限不配**的问题。所以全局搜索时查到这个文件的时候，就会退出报错。但实际这个目录是空的，查不查都没关系。

所以，我们可以采用如下方式进行处理，比较简单粗暴。

```shell
umount /run/user/1000/gvfs    // 卸载该文件
rm -rf /run/user/1000/gvfs    // 删除该文件
```

现在，再使用命令`find / -name ***`查找东西就清爽多了。

现在，我们从文件名的角度出发，进行查我们想要的文件。

```shell
# 从根目录出发 查以happ文件开头的目录
[root@localhost ~]# find / -name "happ*"
/root/happy.txt

#从根目录出发 查inode=35532949的文件
[root@localhost ~]# ls -li
总用量 16
33574982 -rw-------. 1 root root 2789 12月 11 17:06 anaconda-ks.cfg
35532947 -rw-r--r--. 1 root root    0 12月 11 17:34 DM
33574994 -rw-r--r--. 1 root root   20 12月 11 17:22 file
33575016 -rw-r--r--. 1 root root   24 12月 11 17:23 file2
35532948 -rw-r--r--. 1 root root    0 12月 11 17:50 happy.txt
35532949 -rw-r--r--. 1 root root    0 12月 11 17:50 Happy.txt
33574981 -rw-------. 1 root root 2069 12月 11 17:06 original-ks.cfg
[root@localhost ~]# find / -inum 35532949
/root/Happy.txt

#从根目录出发，查文件名为happy.txt的文件
[root@localhost ~]# find / -name "happy.txt"
/root/happy.txt

#从根目录出发，忽略大小写查文件名为happy.txt的文件
[root@localhost ~]# find / -iname "happy.txt"
/root/happy.txt
/root/Happy.txt
[root@localhost ~]# 

#从根目录出发，查文件名后缀是.java的所有文件
[root@localhost ~]# find / -name "*.java"
/etc/.java
/usr/share/doc/python2-cryptography-1.7.2/docs/development/custom-vectors/rsa-oaep-sha2/VerifyRSAOAEPSHA2.java
[root@localhost ~]# 

#从根目录出发，查文件名包含appy的所有文件
[root@localhost ~]# find / -name "*appy*"
/root/happy.txt
/root/Happy.txt
/var/lib/yum/yumdb/s/98f6ebb91654225da0bd6d45e27d893f813931f4-snappy-1.1.0-3.el7-x86_64
/usr/lib/python2.7/site-packages/sos/plugins/snappy.py
/usr/lib/python2.7/site-packages/sos/plugins/snappy.pyc
/usr/lib/python2.7/site-packages/sos/plugins/snappy.pyo
/usr/lib64/libsnappy.so.1
/usr/lib64/libsnappy.so.1.1.4
/usr/share/doc/snappy-1.1.0
[root@localhost ~]# 

```

我们也可以从文件大小的角度出发，查我们想查的文件。

```shell
find 目录 -size n
文件使用了 n 单位个存储单元。
n后面加上b或不写单位 表示默认的单位是512字节的块，则按照 512Byte搜索
n后面加上c 表示按字节搜索
n后面加上k 表示按千字节(kB)搜索
n后面加上w 表示按双字节(中文)搜索
n后面加上M 表示按MB搜索
n后面加上G 表示按GB搜索
```

```shell
#从当前目录出发，查文件大小为20字节的文件
[root@localhost ~]# ll
总用量 16
-rw-------. 1 root root 2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root    0 12月 11 17:34 DM
-rw-r--r--. 1 root root   20 12月 11 17:22 file
-rw-r--r--. 1 root root   24 12月 11 17:23 file2
-rw-r--r--. 1 root root    0 12月 11 17:50 happy.txt
-rw-r--r--. 1 root root    0 12月 11 17:50 Happy.txt
-rw-------. 1 root root 2069 12月 11 17:06 original-ks.cfg
[root@localhost ~]# find . -size 20c
./file
[root@localhost ~]# 

#从当前目录出发，查文件大小小于30字节的文件
[root@localhost ~]# find . -size -30c
./.bash_logout
./.cache
./.cache/abrt/lastnotification
./.config
./.config/abrt
./file
./file2
./DM
./happy.txt
./Happy.txt
[root@localhost ~]# 


#从当前目录出发，查大于10M的文件
[root@localhost ~]# du -sh *
4.0K    anaconda-ks.cfg
0       DM
4.0K    file
4.0K    file2
0       happy.txt
0       Happy.txt
22M     night.wav
4.0K    original-ks.cfg
[root@localhost ~]# find . -size +10M
./night.wav

```

我们还可以按照文件修改时间出发，查我们想查的文件

```
find 目录 -选项 n
atime对文件的访问时间
mtime对文件的数据修改时间
ctime对文件的状态修改时间
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212101109619-17023470705862-171672098702812.png)

time 选项的默认单位是天，而 min 选项的默认单位是分钟。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212101322663-17023472034303-171672101644313.png)

```shell
# 从当前目录出发，查5天内访问过的文件
[root@localhost ~]# find . -atime -5
.
./.bash_profile
./.bashrc
./original-ks.cfg
./anaconda-ks.cfg
./.cache
./.cache/abrt
./.cache/abrt/lastnotification
./.config
./.config/abrt
./file
./file2
./DM
./happy.txt
./Happy.txt
./night.wav
[root@localhost ~]# 
# 从当前目录出发，查10-11天文件状态改变过的文件
[root@localhost ~]# find . -ctime 10
# 从当前目录出发，查10-11天修改过的文件
[root@localhost ~]# find . -mtime 10
```

我们还可以按照文件的权限，查我们的文件。

```shell
perm 权限模式：査找文件权限刚好等于"权限模式"的文件
perm -权限模式：査找文件权限全部包含"权限模式"的文件
perm /权限模式：査找文件权限包含"权限模式"的任意一个权限的文件
```

```shell
#从当前文件出发，查文件权限刚好等于 777 的文件
[root@localhost100 logonuser]# ll
总用量 44
drwxr-xr-x. 2 root      root      4096 5月  26 17:29 Apply
-rwxr-xr-x. 1 root      root        15 4月   6 15:28 banana.txt
-rwxrwxrwx. 1 logonuser logonuser 1204 4月   2 12:14 happy.txt
-rw-r--r--. 1 root      root       196 4月   1 14:43 info.txt
drwxrwxrwx. 3 logonuser logonuser 4096 4月  11 17:16 learn
-rw-r--r--. 1 root      root       340 4月   2 15:35 learn.zip
-rw-r--r--. 1 root      root        24 6月   6 16:07 mydata.txt
-rw-r--r--. 1 root      root       215 4月  11 10:22 mydate
-rw-r--r--. 1 root      root       223 4月   2 15:51 myinfo.tar.gz
lrwxrwxrwx. 1 root      root         5 4月   6 11:22 myopt -> /opt/
-rw-r--r--. 1 root      root       922 4月   2 15:53 study.tar.gz
drwxr-xr-x. 4 root      root      4096 4月   6 16:10 test
--w-------. 1 root      root         0 6月   6 16:18 yy.txt
[root@localhost100 logonuser]# find . -perm 777
./learn
./happy.txt
./myopt
[root@localhost100 logonuser]# 

#从当前文件出发，查文件权限全部包含w的文件
[root@localhost100 logonuser]# ll
总用量 44
drwxr-xr-x. 2 root      root      4096 5月  26 17:29 Apply
-rwxr-xr-x. 1 root      root        15 4月   6 15:28 banana.txt
-rwxrwxrwx. 1 logonuser logonuser 1204 4月   2 12:14 happy.txt
-rw-r--r--. 1 root      root       196 4月   1 14:43 info.txt
drwxrwxrwx. 3 logonuser logonuser 4096 4月  11 17:16 learn
-rw-r--r--. 1 root      root       340 4月   2 15:35 learn.zip
-rw-r--r--. 1 root      root        24 6月   6 16:07 mydata.txt
-rw-r--r--. 1 root      root       215 4月  11 10:22 mydate
-rw-r--r--. 1 root      root       223 4月   2 15:51 myinfo.tar.gz
lrwxrwxrwx. 1 root      root         5 4月   6 11:22 myopt -> /opt/
-rw-r--r--. 1 root      root       922 4月   2 15:53 study.tar.gz
drwxr-xr-x. 4 root      root      4096 4月   6 16:10 test
--w-------. 1 root      root         0 6月   6 16:18 yy.txt
[root@localhost100 logonuser]# find . -perm -222
./learn
./happy.txt
./myopt
[root@localhost100 logonuser]# 

# 从当前目录出发，查文件权限包含w的任意一个权限的文件
[root@localhost100 fruits]# ll
总用量 0
-r--------. 1 root      root   0 6月   6 16:28 aa.txt
-rwxr-xr-x. 1 logonuser fruits 0 4月   6 15:33 apple.txt
-rw-r--r--. 1 logonuser fruits 0 4月   6 15:52 pear
[root@localhost100 fruits]# find . -perm /222
.
./pear
./apple.txt
[root@localhost100 fruits]# 


```

我们还可以按照所有者和所属组来查我们想要的文件

```shell
-uid 用户 ID:按照用户 ID 査找所有者是指定 ID 的文件
-gid 组 ID:按照用户组 ID 査找所属组是指定 ID 的文件
-user 用户名：按照用户名査找所有者是指定用户的文件
-group 组名：按照组名査找所属组是指定用户组的文件
-nouser：査找没有所有者的文件
```

```shell
# 从当前目录出发，查文件所属用户是用户名为root的文件
[root@localhost100 fruits]# ll
总用量 0
-r--------. 1 root      root   0 6月   6 16:28 aa.txt
-rwxr-xr-x. 1 logonuser fruits 0 4月   6 15:33 apple.txt
-rw-r--r--. 1 logonuser fruits 0 4月   6 15:52 pear
[root@localhost100 fruits]# find . -user root
.
./aa.txt
[root@localhost100 fruits]# 

```

我们还可以通过文件类型来查文件

```shell
-type d：查找目录
-type f：查找普通文件
-type l：查找软链接文件
```

```shell
# 从当前目录出发，查文件类型是 软链接的文件
[root@localhost100 logonuser]# ll
总用量 44
-r--------. 1 root      root         0 6月   6 16:25 aa.txt
drwxr-xr-x. 2 root      root      4096 5月  26 17:29 Apply
-rwxr-xr-x. 1 root      root        15 4月   6 15:28 banana.txt
-rwxrwxrwx. 1 logonuser logonuser 1204 4月   2 12:14 happy.txt
-rw-r--r--. 1 root      root       196 4月   1 14:43 info.txt
drwxrwxrwx. 3 logonuser logonuser 4096 4月  11 17:16 learn
-rw-r--r--. 1 root      root       340 4月   2 15:35 learn.zip
-rw-r--r--. 1 root      root        24 6月   6 16:07 mydata.txt
-rw-r--r--. 1 root      root       215 4月  11 10:22 mydate
-rw-r--r--. 1 root      root       223 4月   2 15:51 myinfo.tar.gz
lrwxrwxrwx. 1 root      root         5 4月   6 11:22 myopt -> /opt/
-rw-r--r--. 1 root      root       922 4月   2 15:53 study.tar.gz
drwxr-xr-x. 4 root      root      4096 6月   6 16:28 test
--w-------. 1 root      root         0 6月   6 16:18 yy.txt
[root@localhost100 logonuser]# find . -type l
./myopt
[root@localhost100 logonuser]# 

```

另外，`find` 命令还支持我们组合逻辑运算符进行查询

```
a：and逻辑与
-o：or逻辑或
-not：not逻辑非
```

```shell
# 从当前目录出发，查文件大小大于20M并且文件类型是文件的 所有文件
[root@localhost ~]# ll
总用量 22276
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root        0 12月 11 17:50 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
[root@localhost ~]# find . -size +20M -a -type f
./night.wav
[root@localhost ~]# 

#从当前目录出发，查文件名为 happy.txt 或者是 Happy.txt 的所有文件
[root@localhost ~]# find . -name happy.txt -o -name Happy.txt
./happy.txt
./Happy.txt
[root@localhost ~]# 

```

##  sed 文本内容替换

sed全称（[stream](https://so.csdn.net/so/search?q=stream&spm=1001.2101.3001.7020) editor）流式编辑器，它一次处理一行内容。

处理时，把当前处理的行存储在临时缓冲区中，称为“模式空间”（pattern space），接着用sed命令处理缓冲区中的内容，处理完成后，把缓冲区的内容送往屏幕。接着处理下一行，这样不断重复，直到文件末尾。注意处理过程中，文件内容本身并没有改变，除非你使用重定向存储输出,或者使用sed -i选项 (-i选项就是将本该输出到屏幕上的内容修改输出/流入文件中)

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212104708343-17023492291394-171672105710014.png)

在实际开发中，比如我这里写好了需处理的SQL脚本，我只想动态替换库名和表名。而脚本的脚本语句，记录插入语句统统不改变，则这种需求，使用`sed` 命令 就可以很好的完成了。`sed -i [定位指令] 文件路径`来完成。



```shell
#创建create_database.sql 文件，写入如下建库，建表，插入数据语句。
[root@localhost ~]# touch create_database.sql
[root@localhost ~]# vim create_database.sql 
[root@localhost ~]# more create_database.sql 
DROP DATABASE IF EXISTS `student_data_001`;

CREATE DATABASE IF NOT EXISTS `student_data_001`;

CREATE TABLE IF NOT EXISTS `student` (
        id BIGINT ,
        name VARCHAR(30)
);

INSERT INTO `student` VALUES(1,'zhangsan');
INSERT INTO `student` VALUES(2,'lisi');

# 替换库名 由student_data_001 为 student_data_123456
[root@localhost ~]# sed -i 's/student_data_001/student_data_123456/g' create_database.sql 
[root@localhost ~]# more create_database.sql 
DROP DATABASE IF EXISTS `student_data_123456`;

CREATE DATABASE IF NOT EXISTS `student_data_123456`;

CREATE TABLE IF NOT EXISTS `student` (
        id BIGINT ,
        name VARCHAR(30)
);

INSERT INTO `student` VALUES(1,'zhangsan');
INSERT INTO `student` VALUES(2,'lisi');

#替换表名 由student 变为 t_student
[root@localhost ~]# sed -i 's/student/t_student/g' create_database.sql 
[root@localhost ~]# more create_database.sql 
DROP DATABASE IF EXISTS `t_student_data_123456`;

CREATE DATABASE IF NOT EXISTS `t_student_data_123456`;

CREATE TABLE IF NOT EXISTS `t_student` (
        id BIGINT ,
        name VARCHAR(30)
);

INSERT INTO `t_student` VALUES(1,'zhangsan');
INSERT INTO `t_student` VALUES(2,'lisi');
[root@localhost ~]# 

```

这种针对提供一套数据模板，根据业务对动态适配而创建数据库表接口的业务场景十分有用。

## ls 查当前目录下所有文件和目录

`ls`命令是linux下最常用的命令。`ls`命令就是`list`的缩写，用来打印出当前目录的文件和目录清单。

如果ls指定其他目录，那么就会显示指定目录里的文件及文件夹清单。 

通过ls 命令不仅可以查看linux文件夹内包含的文件，而且可以查看文件权限(包括目录、文件夹、文件权限)查看目录信息等等。

命令的语法格式如下：

```shell
ls [选项] [目录或者文件]
```

常用追加参数：

```
-a或--all   列出目录下所有文件和目录，包括以 . 开头的隐含文件。
-l   使用详细格式列表，除了文件名之外，还将文件的权限、所有者、文件大小等信息详细列出来。ls -l 等于 ll -h或--human-readable   用"K","M","G"来显示文件和目录的大小。更适合适合人类阅读的
 -t   用文件和目录的修改时间对文件进行排序
 -i或--inode   显示文件和目录的inode编号。
```

```shell
# 查当前目录下 所有文件和文件夹名称，不包含隐含文件
[root@localhost ~]# ls
\  anaconda-ks.cfg  create_database.sql  DM  file  file2  happy.txt  Happy.txt  night.wav  original-ks.cfg

# 查当前目录下，所有文件和文件夹名称，包含隐含文件
[root@localhost ~]# ls -a
.   \                .bash_logout   .bashrc  .config              .cshrc  file   happy.txt  night.wav        .tcshrc
..  anaconda-ks.cfg  .bash_profile  .cache   create_database.sql  DM      file2  Happy.txt  original-ks.cfg  .viminfo

#查当前目录下，所有不是隐含文件，并按照文件修改时间，升序排序展示的文件
[root@localhost ~]# ls -t
create_database.sql  \  night.wav  Happy.txt  happy.txt  DM  file2  file  anaconda-ks.cfg  original-ks.cfg

#查当前目录下，所有文件和文件夹，并显示文件额 inode号
[root@localhost ~]# ls -i
33833947 \                33833948 create_database.sql  33574994 file   35532948 happy.txt  35532950 night.wav
33574982 anaconda-ks.cfg  35532947 DM                   33575016 file2  35532949 Happy.txt  33574981 original-ks.cfg

# 更为详细的显示 文件和文件加信息，告诉你文件类型，修改时间，大小，权限，用户/用户组这些信息
[root@localhost ~]# ll
总用量 22284
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 18:59 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root        0 12月 11 17:50 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
[root@localhost ~]# 

# 更适合人类阅读习惯的展示
[root@localhost ~]# ll -h
总用量 22M
-rw-r--r--. 1 root root  254 12月 11 18:57 \
-rw-------. 1 root root 2.8K 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root  270 12月 11 18:59 create_database.sql
-rw-r--r--. 1 root root    0 12月 11 17:34 DM
-rw-r--r--. 1 root root   20 12月 11 17:22 file
-rw-r--r--. 1 root root   24 12月 11 17:23 file2
-rw-r--r--. 1 root root    0 12月 11 17:50 happy.txt
-rw-r--r--. 1 root root    0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root  22M 12月 11 18:07 night.wav
-rw-------. 1 root root 2.1K 12月 11 17:06 original-ks.cfg
[root@localhost ~]
```



## du 查文件大小

du命令是linux系统里的文件大小查看的命令。一般来说du命令的应用场景如下：

- 需要查看单个目录里面多个文件总大小。
- 需要查看目录中每个文件的大小以及每个子文件夹中文件的大小。
- 查看日志文件的大小。
- 查看文件大小并排序，找出最大的或最小的文件。
- 其它需要统计文件大小的场景。

```shell
# 查当前目录下所有子目录占用磁盘大小
[root@localhost ~]# du -h
4.0K    ./.cache/abrt
4.0K    ./.cache
0       ./.config/abrt
0       ./.config
22M     .

# 查当前目录 总共占用的磁盘空间
[root@localhost ~]# du -s
22316   .

#查当前目录 所有文件或者文件夹 占用的磁盘大小 深度遍历的深度为1
[root@localhost ~]# du -ahd1
4.0K    ./.bash_logout
4.0K    ./.bash_profile
4.0K    ./.bashrc
4.0K    ./.cshrc
4.0K    ./.tcshrc
4.0K    ./original-ks.cfg
4.0K    ./anaconda-ks.cfg
4.0K    ./.cache
0       ./.config
4.0K    ./file
4.0K    ./file2
0       ./DM
0       ./happy.txt
0       ./Happy.txt
22M     ./night.wav
4.0K    ./\
4.0K    ./create_database.sql
4.0K    ./.viminfo
22M     .

#查当前目录 所有文件或者文件夹 占用的磁盘大小 深度遍历的深度为1，并且按照文件大小，升序排序
[root@localhost ~]# du -ahd1 | sort -hr
22M     ./night.wav
22M     .
4.0K    ./.viminfo
4.0K    ./.tcshrc
4.0K    ./original-ks.cfg
4.0K    ./file2
4.0K    ./file
4.0K    ./.cshrc
4.0K    ./create_database.sql
4.0K    ./.cache
4.0K    ./.bashrc
4.0K    ./.bash_profile
4.0K    ./.bash_logout
4.0K    ./anaconda-ks.cfg
4.0K    ./\
0       ./Happy.txt
0       ./happy.txt
0       ./DM
0       ./.config
[root@localhost ~]# 
```

## cat/less/head/tail 查文件内容

### cat

`cat`[命令](https://so.csdn.net/so/search?q=命令&spm=1001.2101.3001.7020)是Linux系统下的一个基本命令，主要用于连接文件并将它们的内容打印到标准输出设备上，如屏幕或文件中。`cat`是concatenate（连接）的简写。

基本语法格式为：

```shell
cat [选项]... [文件]...
```

选项参数包括：

```
-b ： 对非空输出行编号
-n ： 对输出的所有行编号
-E ： 在每行结束符后面显示"$"
-T ： 显示制表符
-s ： 把连续的空行压缩为一行
```

下面我们演示下，如果使用`cat` 命令查文件内容

```shell
# 查看文件内容
[root@localhost ~]# cat create_database.sql 
DROP DATABASE IF EXISTS `t_student_data_123456`;

CREATE DATABASE IF NOT EXISTS `t_student_data_123456`;

CREATE TABLE IF NOT EXISTS `t_student` (
        id BIGINT ,
        name VARCHAR(30)
);

INSERT INTO `t_student` VALUES(1,'zhangsan');
INSERT INTO `t_student` VALUES(2,'lisi');
# 查看文件内容，并显示行号
[root@localhost ~]# cat -n  create_database.sql 
     1  DROP DATABASE IF EXISTS `t_student_data_123456`;
     2  
     3  CREATE DATABASE IF NOT EXISTS `t_student_data_123456`;
     4  
     5  CREATE TABLE IF NOT EXISTS `t_student` (
     6          id BIGINT ,
     7          name VARCHAR(30)
     8  );
     9  
    10  INSERT INTO `t_student` VALUES(1,'zhangsan');
    11  INSERT INTO `t_student` VALUES(2,'lisi');
```

所以说， `cat`命令，是可以一次性显示文件所有内容，通常更适合查看小的文件。

```shell
[root@localhost ~]# more file
JavaScript
Java
C++
[root@localhost ~]# more happy.txt 
[root@localhost ~]# echo "Happy EveryDay~~~" > happy.txt 
[root@localhost ~]# touch merge
[root@localhost ~]# cat file happy.txt > merge 
[root@localhost ~]# cat  merge 
JavaScript
Java
C++
Happy EveryDay~~~
[root@localhost ~]#
```

同时，cat 命令也常常被用来创建新文件或者将多个文件合并为一个文件。

```shell
# 将 file 和 happy.txt 文件内容进行合并，写入到 merge文件中
[root@localhost ~]# more file
JavaScript
Java
C++
[root@localhost ~]# more happy.txt 
[root@localhost ~]# echo "Happy EveryDay~~~" > happy.txt 
[root@localhost ~]# touch merge
[root@localhost ~]# cat file happy.txt > merge 
[root@localhost ~]# cat  merge 
JavaScript
Java
C++
Happy EveryDay~~~
[root@localhost ~]# 

```

### less

`less `命令，适合分页显示文件内容，更适合查看大的文件。

```
less cloud-init.log
```

常用追加参数

- 空格键：前进一页（一个屏幕）；
- `b` 键：后退一页；
- 回车键：前进一行；
- `y` 键：后退一行；
- 上下键：回退或前进一行；
- `d` 键：前进半页；
- `u` 键：后退半页；
- `q` 键：停止读取文件，中止 `less` 命令；
- `=` 键：显示当前页面的内容是文件中的第几行到第几行以及一些其它关于本页内容的详细信息；
- `h` 键：显示帮助文档；
- `/` 键：进入搜索模式后，按 `n` 键跳到一个符合项目，按 `N` 键跳到上一个符合项目，同时也可以输入正则表达式匹配。

`head`命令，是显示文件的开头几行（默认是10行）

```
head cloud-init.log
```

常用追加参数

- `-n` 指定行数 `head cloud-init.log -n 2`

### tail

`tail`命令显示文件的结尾几行（默认是10行），这个命令在实际开发中，十分常用！我们的跑的项目是一直运行在操作系统中的，每时每刻都会被人使用，所以日志文件记录的日志内容总在不断更新，我们用`vim` 查日志文件是不能查看到最新的日志的，而有了`tail` 命令，我们就可以查到最新的几条日志信息了！

```
tail cloud-init.log
```

常用附加参数：

- `-n` 指定行数 `tail cloud-init.log -n 2`
- `-f` 会每过1秒检查下文件是否有更新内容，也可以用 `-s` 参数指定间隔时间 `tail -f -s 4 xxx.log`

## touch 创建文件

`touch` 命令用于修改文件或者目录的时间属性，如果说操作修改的文件不存在，系统会建立一个新的文件。所以，我们平时用得最多的是通过touch创建一个空文件。但实际开发中，通过`touch`命令可以对一个已经存在的文件，会修改文件的atime、mtime，所以文件的真实访问时间和修改时间是可以被修改。这一点在开发中很重要！因此我们在排查系统异常的时候，还需要结合日志、历史命令等等因素来综合决策。

```shell
# 查当前目录列表，有没有hi.txt文件
root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 18:59 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg

# 走一次 touch 命令
[root@localhost ~]# touch hi.txt

# 再查当前目录列表，可以看到touch 底层，对不存在的文件，会创建一个文件大小为0的文件
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 18:59 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
[root@localhost ~]# 

# 再touch 命令 其create_database.sql本身就存在
[root@localhost ~]# touch create_database.sql 

# 可以看到 atime mtime 文件访问时间和文件修改时间 被改成了当前时间
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
[root@localhost ~]# date
2023年 12月 11日 星期一 19:56:50 PST
[root@localhost ~]# 
```

## mkdir 创建目录

`mkdir` 命令主要用于创建目录，用法 mkdir dirname，命令后接目录的名称，常用参数详解如下:

语法格式：

```
mkdir dirname
```

附加参数：

```
-p, --parents 需要时创建目标目录的上层目录，但即使这些目录已存在也不当作错误处理，即递归的创建目录结构
```

```shell
# 创建一个空目录
[root@localhost ~]# mkdir word
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 2 root root        6 12月 11 20:01 word
[root@localhost ~]# 

# 创建多个目录
[root@localhost ~]# mkdir word1 word2 
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 2 root root        6 12月 11 20:01 word
drwxr-xr-x. 2 root root        6 12月 11 20:02 word1
drwxr-xr-x. 2 root root        6 12月 11 20:02 word2
[root@localhost ~]# 


# 递归创建多个目录
root@localhost ~]# mkdir word3/word 
mkdir: 无法创建目录"word3/word": 没有那个文件或目录
[root@localhost ~]# mkdir -p  word3/word 
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 2 root root        6 12月 11 20:01 word
drwxr-xr-x. 2 root root        6 12月 11 20:02 word1
drwxr-xr-x. 2 root root        6 12月 11 20:02 word2
drwxr-xr-x. 3 root root       18 12月 11 20:03 word3
[root@localhost ~]# cd word
[root@localhost word]# cd ..
[root@localhost ~]# cd word3/
[root@localhost word3]# ll
总用量 0
drwxr-xr-x. 2 root root 6 12月 11 20:03 word
[root@localhost word3]# 


#创建一个权限为777的目录
[root@localhost ~]# mkdir -m 777 word2
mkdir: 无法创建目录"word2": 文件已存在
[root@localhost ~]# mkdir -m 777 word4
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 17:50 Happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 2 root root        6 12月 11 20:01 word
drwxr-xr-x. 2 root root        6 12月 11 20:02 word1
drwxr-xr-x. 2 root root        6 12月 11 20:02 word2
drwxr-xr-x. 3 root root       18 12月 11 20:03 word3
drwxrwxrwx. 2 root root        6 12月 11 20:05 word4
[root@localhost ~]# 
```

## cp 复制文件

cp是copy的缩写，翻译就是复制拷贝，cp可以实现以下功能：

- 复制文件或者目录
- 建立文件链接
- 文件重命名

命令格式：

```
cp [选项] 源文件或者目录 目标文件或者目录
```

拷贝文件命令格式为：

```
cp 源文件 目标文件（夹）
```

这个是使用频率最多的命令格式了，其负责把一个源文件复制到目标文件（夹）下。`cp`命令的底层，对复制到目标文件夹下的操作来说，会文件名保持不变。复制到目标文件夹下。

对复制到文件中，则会文件名变更。

如果**目标文件已经存在或目标文件夹中含有同名文件，则复制之后目标文件或目标文件夹中的同名文件会被覆盖**。

拷贝文件夹的命令格式：

```
cp -r 源文件夹 目标文件夹
```

只需要记住复制文件夹一定要加`“-r”`参数，否则会出现`“cp: omitting directory”`错误。

常用附加参数:

```
-r 拷贝文件夹必用
-u 只有源文件较目标文件新时复制,这个命令很实用，尤其是在更新文件时,只有源文件比目标文件新时，才会将源文件复制给目标文件，否则就算执行了命令，也不会复制。
 -s 建立软链接
 -l 建立硬链接
```

```shell
# 复制当前目录下的happy.txt文件到 targetDir/目录下
[root@localhost ~]# mkdir targetDir
[root@localhost ~]# cp happy.txt targetDir/

# 如果复制文件存在同名，则会覆盖
[root@localhost ~]# cp happy.txt targetDir/happy.txt 
cp：是否覆盖"targetDir/happy.txt"？ y
[root@localhost ~]# 

#把当前目录下的happy.txt 复制一份到targetDir目录下，并重命名为happy2.txt
[root@localhost ~]# cp happy.txt targetDir/happy2.txt
[root@localhost ~]# ll targetDir/
总用量 8
-rw-r--r--. 1 root root 18 12月 11 20:18 happy2.txt
-rw-r--r--. 1 root root 18 12月 11 20:16 happy.txt
[root@localhost ~]# 

#把当前目录下，所以的文件复制到targetDir目录下
[root@localhost ~]# cp *.txt targetDir/
cp：是否覆盖"targetDir/happy.txt"？ y
[root@localhost ~]# ll targetDir/
总用量 8
-rw-r--r--. 1 root root 18 12月 11 20:18 happy2.txt
-rw-r--r--. 1 root root 18 12月 11 20:19 happy.txt
-rw-r--r--. 1 root root  0 12月 11 20:19 Happy.txt
-rw-r--r--. 1 root root  0 12月 11 20:19 hi.txt
[root@localhost ~]# 


# 将整个目录下所有文件和子文件夹 做拷贝
[root@localhost ~]# mkdir -p  work/work2/word3
[root@localhost ~]# cp -r work/ targetDir/
[root@localhost ~]# ll targetDir/
总用量 8
-rw-r--r--. 1 root root 18 12月 11 20:18 happy2.txt
-rw-r--r--. 1 root root 18 12月 11 20:19 happy.txt
-rw-r--r--. 1 root root  0 12月 11 20:19 Happy.txt
-rw-r--r--. 1 root root  0 12月 11 20:19 hi.txt
drwxr-xr-x. 3 root root 19 12月 11 20:21 work
[root@localhost ~]# ll targetDir/work/
总用量 0
drwxr-xr-x. 3 root root 19 12月 11 20:21 work2
[root@localhost ~]# ll targetDir/work/work2/
总用量 0
drwxr-xr-x. 2 root root 6 12月 11 20:21 word3
[root@localhost ~]# ll targetDir/work/work2/word3/
总用量 0
[root@localhost ~]# 


```

## mv 剪切/重命名文件

是`move`的缩写,可以用来移动文件或者重命名文件名,经常用来备份文件或者目录。

命令格式：

```
mv [选项] 源文件或者目录 目标文件或者目录
```

附加参数：

```
-b 如果已存在相同文件名，则覆盖前进行备份
-f 如果已存在相同文件名，而用户不具有写的权限，则强制覆盖
-i 如果已存在相同文件名，覆盖前提示用户进行确认
-u 比较原文件与目标文件修改时间，如果目标文件较新则不覆盖
```

```shell
# 文件重命名
[root@localhost ~]# mv Happy.txt NoHappy.txt
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-r--r--. 1 root root        0 12月 11 17:50 NoHappy.txt
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 3 root root       84 12月 11 20:21 targetDir
drwxr-xr-x. 3 root root       19 12月 11 20:21 work
[root@localhost ~]# 


# 文件剪切（移动）
[root@localhost ~]# mv Happy.txt NoHappy.txt
[root@localhost ~]# ll
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-r--r--. 1 root root        0 12月 11 17:50 NoHappy.txt
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 3 root root       84 12月 11 20:21 targetDir
drwxr-xr-x. 3 root root       19 12月 11 20:21 work
[root@localhost ~]# mv NoHappy.txt targetDir/
[root@localhost ~]# ll targetDir/
总用量 8
-rw-r--r--. 1 root root 18 12月 11 20:18 happy2.txt
-rw-r--r--. 1 root root 18 12月 11 20:19 happy.txt
-rw-r--r--. 1 root root  0 12月 11 20:19 Happy.txt
-rw-r--r--. 1 root root  0 12月 11 20:19 hi.txt
-rw-r--r--. 1 root root  0 12月 11 17:50 NoHappy.txt
drwxr-xr-x. 3 root root 19 12月 11 20:21 work
[root@localhost ~]# ll 
总用量 22296
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 3 root root      103 12月 11 20:31 targetDir
drwxr-xr-x. 3 root root       19 12月 11 20:21 work
[root@localhost ~]# 


```



## rm删除文件

rm 是remove 的缩写， rm 命令的功能为删除一个或多个文件或目录，它也可以将某个目录及其下的所有文件及子目录均删除。他不像在`WINDOWS` 系统那样，删除了还可以在回收站找到，他的删除时不可逆的，所以平时一定要做好备份。

对于链接文件，只是删除了链接，原有文件均保持不变。

rm是一个危险的命令，使用的时候要特别当心,在执行rm之前最好先确认一下在哪个目录，到底要删除什么东西，再三核对之后再去执行。

语法格式：

```shell
rm       [option]      [file]
rm       [选项]        [文件或目录]
```

常用附加参数：

```shell
-f, --force  强制删除文件或目录，即使文件属性设为只读也直接删除，不产生提示确认。
 -r, -R, --recursive  递归地删除目录及其内容。
 -i            删除之前逐一询问确认
 
```



```sh
# 删除targetDir目录
[root@localhost ~]# ls
\  anaconda-ks.cfg  create_database.sql  DM  file  file2  happy.txt  hi.txt  log  merge  night.wav  original-ks.cfg  targetDir  work
[root@localhost ~]# rm -rf targetDir/
[root@localhost ~]# ls
\  anaconda-ks.cfg  create_database.sql  DM  file  file2  happy.txt  hi.txt  log  merge  night.wav  original-ks.cfg  work
[root@localhost ~]# 

```

## tar 压缩和解压文件

`tar `是 Linux 中常用的一种存档格式，它可以将多个文件或目录压缩成单个文件进行分发，还可以创建和解压 tar 存档。

语法格式：

```shell
tar [选项] [文件名]
```

常用附加参数：

```
-c：创建新的存档文件（Create）。
-z --gzip --ungzip  在创建或提取存档文件时使用 gzip 压缩算法来进行压缩或解压缩（gzip）。
-j：在创建或提取存档文件时使用 bzip2 压缩算法来进行压缩或解压缩（bzip2）。
-v  显示命令执行的详细信息（Verbose）
-f --file 指定存档文件的名称（File）。
-x：--extract --get  从存档文件中提取文件（eXtract）。
```

下面演示一下，如果把某个目录进行压缩得到`xx.tar.gz`的存档文件，对指定的`xx.tar.gz`存档文件进去提取解压。

```shell

[root@localhost ~]# mkdir compressOps
[root@localhost ~]# cd compressOps/
[root@localhost compressOps]# ls
[root@localhost compressOps]# mkdir dir1 dir2 dir3 
[root@localhost compressOps]# touch 1.txt echo "JacksonWang" > 1.txt
[root@localhost compressOps]# ls
1.txt  dir1  dir2  dir3  echo  JacksonWang
[root@localhost compressOps]# cd ..
#对指定目录进行压缩
[root@localhost ~]# tar -czvf compressOps.tar.gz compressOps/
compressOps/
compressOps/dir1/
compressOps/dir2/
compressOps/dir3/
compressOps/1.txt
compressOps/echo
compressOps/JacksonWang
[root@localhost ~]# ll
总用量 22300
-rw-r--r--. 1 root root      254 12月 11 18:57 \
-rw-------. 1 root root     2789 12月 11 17:06 anaconda-ks.cfg
drwxr-xr-x. 5 root root       86 12月 11 22:32 compressOps
-rw-r--r--. 1 root root      220 12月 11 22:35 compressOps.tar.gz
-rw-r--r--. 1 root root      270 12月 11 19:56 create_database.sql
-rw-r--r--. 1 root root        0 12月 11 17:34 DM
-rw-r--r--. 1 root root       20 12月 11 17:22 file
-rw-r--r--. 1 root root       24 12月 11 17:23 file2
-rw-r--r--. 1 root root       18 12月 11 19:35 happy.txt
-rw-r--r--. 1 root root        0 12月 11 19:53 hi.txt
-rw-r--r--. 1 root root       13 12月 11 19:40 log
-rw-r--r--. 1 root root       38 12月 11 19:35 merge
-rw-r--r--. 1 root root 22790924 12月 11 18:07 night.wav
-rw-------. 1 root root     2069 12月 11 17:06 original-ks.cfg
drwxr-xr-x. 3 root root       19 12月 11 20:21 work
[root@localhost ~]# 

# 对指定tar.gz文件进行解压
[root@localhost ~]# rm -rf compressOps
[root@localhost ~]# tar -zxvf  compressOps.tar.gz compressOps 
compressOps/
compressOps/dir1/
compressOps/dir2/
compressOps/dir3/
compressOps/1.txt
compressOps/echo
compressOps/JacksonWang
[root@localhost ~]# ls
\  anaconda-ks.cfg  compressOps  compressOps.tar.gz  create_database.sql  DM  file  file2  happy.txt  hi.txt  log  merge  night.wav  original-ks.cfg  work
[root@localhost ~]# ll compressOps
总用量 0
-rw-r--r--. 1 root root 0 12月 11 22:32 1.txt
drwxr-xr-x. 2 root root 6 12月 11 22:32 dir1
drwxr-xr-x. 2 root root 6 12月 11 22:32 dir2
drwxr-xr-x. 2 root root 6 12月 11 22:32 dir3
-rw-r--r--. 1 root root 0 12月 11 22:32 echo
-rw-r--r--. 1 root root 0 12月 11 22:32 JacksonWang
[root@localhost ~]# 


```

## gzip/bgzip2 文件压缩解压

`gzip` 也是一个压缩命令，跟 `zip` 类似，是对文件进行压缩文件经它压缩过后，其名称后面会多出`".gz"`的扩展名。

在使用`gzip`时 需要注意的以下几点：

- `gzip` 命令只能用来压缩文件，不能压缩目录，即便指定了目录，也只能压缩目录内的所有文件。
- 压缩后会删除源文件。
- 压缩后文件的后缀格式是 `.gz`。
- 该命令还支持解压缩。
- 该命令不需要指定压缩包名。

常用附加参数：

```shell
-r或–recursive 递归处理，将指定目录下的所有文件及子目录一并处理
-d或–decompress或----uncompress 解开压缩文件
-c或–stdout或–to-stdout  	把压缩后的文件输出到标准输出设备，不去更动原始文件
-v或–verbose 压缩过程显示
```

下面我们来使用一下`gzip` 命令，来对文件进行压缩和解压缩吧。

```shell
# 压缩文件 happy.txt,可以看到压缩成功之后得到 happy.txt.gz文件，而原文件被删除
[root@localhost ~]# gzip happy.txt 
[root@localhost ~]# ls
\  anaconda-ks.cfg  compressOps  compressOps.tar.gz  create_database.sql  DM  file  file2  happy.txt.gz  hi.txt  log  merge  night.wav  original-ks.cfg  work
[root@localhost ~]# 

# 压缩指定目录的文件，gzip底层是不会压缩整个目录的，只会压缩目录下的所有文件
[root@localhost ~]# ll compressOps
总用量 8
-rw-r--r--. 1 root root 5 12月 11 22:46 1.txt
-rw-r--r--. 1 root root 4 12月 11 22:47 2.txt
drwxr-xr-x. 2 root root 6 12月 11 22:32 dir1
drwxr-xr-x. 2 root root 6 12月 11 22:32 dir2
drwxr-xr-x. 2 root root 6 12月 11 22:32 dir3
[root@localhost ~]# gzip compressOps/
gzip: compressOps/ is a directory -- ignored
[root@localhost ~]# ls compressOps
1.txt  2.txt  dir1  dir2  dir3
[root@localhost ~]# gzip -r compressOps/
[root@localhost ~]# ls compressOps
1.txt.gz  2.txt.gz  dir1  dir2  dir3
[root@localhost ~]# 

# 解压缩指定压缩文件
[root@localhost ~]# gzip -d compressOps/1.txt.gz 
[root@localhost ~]# ll compressOps
总用量 8
-rw-r--r--. 1 root root  5 12月 11 22:46 1.txt
-rw-r--r--. 1 root root 30 12月 11 22:47 2.txt.gz
drwxr-xr-x. 2 root root  6 12月 11 22:32 dir1
drwxr-xr-x. 2 root root  6 12月 11 22:32 dir2
drwxr-xr-x. 2 root root  6 12月 11 22:32 dir3
[root@localhost ~]# 


#查看压缩文件内容
[root@localhost ~]# gzip -l compressOps/2.txt.gz 
         compressed        uncompressed  ratio uncompressed_name
                 30                   4 -50.0% compressOps/2.txt
[root@localhost ~]# 

# 不去改动原始文件，进行压缩生成，底层会先把1.txt的内容先输出到标准输出流，再流进入创建好的压缩文件
[root@localhost compressOps]# gzip -c 1.txt > 1.txt.gz
[root@localhost compressOps]# ls
1.txt  1.txt.gz  2.txt  dir1  dir2  dir3
[root@localhost compressOps]# 

# 解压，但保留压缩文件
[root@localhost compressOps]# gzip -dvc 1.txt.gz > 1_backup.txt
1.txt.gz:       -40.0%
[root@localhost compressOps]# ls
1_backup.txt  1.txt  1.txt.gz  2.txt  dir1  dir2  dir3
[root@localhost compressOps]# 



#批量压缩和批量解压

wangnaixing@wangnaixing-Dell-G15-5511:~/compress$ gzip *
wangnaixing@wangnaixing-Dell-G15-5511:~/compress$ gzip -d *

```

`Linux bgzip2`命令也是用于`压缩文件`。我个人感觉他是`gzip` 命令的增强版本，压缩后的文件其名称后面会多出`".bz2"`的扩展名。基本使用和`bzip` 相似，这里不再累述。

## zip/unzip 大家通用的压缩解压

`zip` 命令的功能是用于压缩文件，[解压命令](https://so.csdn.net/so/search?q=解压命令&spm=1001.2101.3001.7020)为 `unzip`。压缩后不覆盖源文件，可以压缩目录。

个人感受生活和工作里面挺多开发，办公人员会把文件/文件夹压缩成zip格式的压缩文件的进行传输给别人的。

语法格式：

```
zip [选项] [参数] [文件]
```

常用附加参数：

```
-r 递归处理，将指定目录下的所有文件和子目录一起处理
-d 删除压缩包内的文件
-f 更新现有的文件
-e 加密压缩文件

```

下面我们来使用一下`zip unzip` 命令，来对文件进行压缩和解压缩吧。

```shell
# 将多个文件和目录 进行压缩，压缩文件名为test8.5.zip 
[root@localhost compressOps]# zip test8.5.zip  -r 1_backup.txt 1.txt 1.txt.gz dir1/ 
  adding: 1_backup.txt (stored 0%)
  adding: 1.txt (stored 0%)
  adding: 1.txt.gz (stored 0%)
  adding: dir1/ (stored 0%)
[root@localhost compressOps]# ls
1_backup.txt  1.txt  1.txt.gz  2.txt  dir1  dir2  dir3  test8.5.zip
[root@localhost compressOps]# 

#压缩当前目录下所有的目录和文件
[root@localhost compressOps]# rm -rf test8.5.zip 
[root@localhost compressOps]# zip testall.zip *
  adding: 1_backup.txt (stored 0%)
  adding: 1.txt (stored 0%)
  adding: 1.txt.gz (stored 0%)
  adding: 2.txt (stored 0%)
  adding: dir1/ (stored 0%)
  adding: dir2/ (stored 0%)
  adding: dir3/ (stored 0%)
[root@localhost compressOps]# ls
1_backup.txt  1.txt  1.txt.gz  2.txt  dir1  dir2  dir3  testall.zip
[root@localhost compressOps]# 


# 从压缩包中删除指定文件
[root@localhost compressOps]# unzip -l testall.zip 
Archive:  testall.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        5  12-11-2023 23:00   1_backup.txt
        5  12-11-2023 22:46   1.txt
       31  12-11-2023 22:57   1.txt.gz
        4  12-11-2023 22:47   2.txt
        0  12-11-2023 22:32   dir1/
        0  12-11-2023 22:32   dir2/
        0  12-11-2023 22:32   dir3/
---------                     -------
       45                     7 files
[root@localhost compressOps]# zip -d  testall.zip 1.txt
deleting: 1.txt
[root@localhost compressOps]# unzip -l testall.zip 
Archive:  testall.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        5  12-11-2023 23:00   1_backup.txt
       31  12-11-2023 22:57   1.txt.gz
        4  12-11-2023 22:47   2.txt
        0  12-11-2023 22:32   dir1/
        0  12-11-2023 22:32   dir2/
        0  12-11-2023 22:32   dir3/
---------                     -------
       40                     6 files
[root@localhost compressOps]# 

# 更新压缩包内2.txt文件
[root@localhost compressOps]# echo "Update 2.txt Content" >>   2.txt 
[root@localhost compressOps]# zip -f testall.zip  2.txt 
freshening: 2.txt (stored 0%)
[root@localhost compressOps]# 


# 查一下要更新的3.txt在压缩文件中有没有，没有就加入进去。有就更新
[root@localhost compressOps]# unzip -l testall.zip 
Archive:  testall.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        5  12-11-2023 23:00   1_backup.txt
       31  12-11-2023 22:57   1.txt.gz
       25  12-11-2023 23:14   2.txt
        0  12-11-2023 22:32   dir1/
        0  12-11-2023 22:32   dir2/
        0  12-11-2023 22:32   dir3/
---------                     -------
       61                     6 files
[root@localhost compressOps]# touch 3.txt 
[root@localhost compressOps]# echo "JackWang GOGOGO" > 3.txt 
[root@localhost compressOps]# zip -u testall.zip 3.txt 
  adding: 3.txt (deflated 6%)
[root@localhost compressOps]# unzip -l testall.zip 
Archive:  testall.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
        5  12-11-2023 23:00   1_backup.txt
       31  12-11-2023 22:57   1.txt.gz
       25  12-11-2023 23:14   2.txt
        0  12-11-2023 22:32   dir1/
        0  12-11-2023 22:32   dir2/
        0  12-11-2023 22:32   dir3/
       16  12-11-2023 23:16   3.txt
---------                     -------
       77                     7 files
[root@localhost compressOps]# 


# 对zip压缩包设置解压密码
[root@localhost compressOps]# zip -e  test_encrypt.zip * 
Enter password: 
Verify password: 
  adding: 1_backup.txt (stored 0%)
  adding: 1.txt (stored 0%)
  adding: 1.txt.gz (stored 0%)
  adding: 2.txt (stored 0%)
  adding: 3.txt (deflated 6%)
  adding: dir1/ (stored 0%)
  adding: dir2/ (stored 0%)
  adding: dir3/ (stored 0%)
  adding: testall.zip (stored 0%)
[root@localhost compressOps]# unzip test_encrypt.zip 
Archive:  test_encrypt.zip
[test_encrypt.zip] 1_backup.txt password: 
```

解压zip文件，通过`unzip` 命令来完成，可通过`unzip 压缩文件.zip -d 解压后文件目录` 来解压文件包。这里不再累述了。



## vi/vim 编辑文本内容

文本操作在Window操作系统中，使用`notpad.exe` 来对文本文件进行管理。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212160357732-17023682386976-171672113623215.png)
做同样的事情的，在`Linux`操作系统中，由`vim` 一个命令来执行。


如果说，我们的`镜像ISO` 是最小化安装`Linux` ,则文本编辑器命名是`vi`  我们想使用`vim` 命令的话，可以在`yum`仓库中找到此软件并进行安装。

```shell
# 安装vim命令，用于文本编辑
yum install vim -y
```

我们只需要知道VIM的四种模式如何切换和当前处于什么模式之下，就可以上手`vim` 了，四种模式的关系图如下所示：

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212153717022-171672117298216.png" style="zoom: 80%;" />

### 末行模式

在编辑模式下，输入`:set number` 可以显示行号。

```shell
  1 1111
  2 2222
  3 3333
  4 4444
  5 6666
  6 1111
  7 1111
  8 8888
  9 1010                        
:set number   
```

处理粘贴代码，格式缩进问题。

```shell
 1 1111
  2 2222
  3 3333
  4 4444
  5 6666
  6 1111
  7 1111
  8 8888
  9 1010
 10 问题：在终端Vim中粘贴代码时，发现插入的代码会有多余的缩进，而且会逐行累加。原因是终端把粘贴的文本存入键盘缓存（Keyboard Buffer）中，Vim则把这些内容作为用户的键盘输入来处理。导致在遇到换行符的时候，如果Vim开启了自动缩进，就会默认的把上一行缩进插入到下一行的开头，最终使代码变乱。

:set nopaste
```

在终端Vim中粘贴代码时，发现插入的代码会有多余的缩进，而且会逐行累加。为了避免这种情况，我们会在末行模式下，在粘贴数据之前输入`:set paste` 激活paste模式，粘贴完成之后，同样在末行模式下输入`:set nopaste`,不激活paste模式。

在实际开发中，我们可能还需要对文件的某个内容做替换操作，那么我们可以通过在末行模式下，`:%s/要替换的关键词/替换后的关键词/g` 来做符合条件的全局替换。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212155421654-17023676630805-171672121053217.png)

回车，可以看到整个文档的6666字符串全部替换成了8888.

## basename 查文件名

`basename`是一个命令行中实用的小工具，可从给定的文件名中删除目录和后缀。拿个这个文件叫什么。

基本语法

```shell
basename [string / pathname] [suffix]
```

```shell
# 查给定全路径的文件名，不要后缀
[root@localhost compressOps]# basename /root/compressOps/1.txt .txt
1
# 查给定路径的全路径名，要后缀
[root@localhost compressOps]# basename /root/compressOps/1.txt 
1.txt
[root@localhost compressOps]# 
```

## dirname 查目录路径

功能描述：从给定的包含绝对路径的文件名中去除文件名（非目录的部分），然后返回剩下的路径（目录的部分）

语法格式

```
dirname 文件绝对路径
```

```shell
[root@localhost compressOps]# dirname  /root/compressOps/1.txt 
/root/compressOps
[root@localhost compressOps]# 
```



# 主机通信

## scp 多主机互传文件

[Linux](https://so.csdn.net/so/search?q=Linux&spm=1001.2101.3001.7020) `scp` 命令用于 Linux 之间复制文件和目录。他可以将你主机的文件，复制拷贝到另一台主机上或者多台处于同一局域网上的主机上。scp 是加密的，rcp 是不加密的，scp 是 rcp 的加强版。

命令格式：

```
scp [附加参数] 【本地文件的路径】【服务器用户名】@【服务器地址】：【服务器的路径】

-r： 递归复制整个目录。
```

比如处于同一局域网有三个主机节点,主机名分别为hodoop102,hodoop103,hodoop104。

现在我以root用户的身份登录hadoop102,期望将此hadoop102指定目录的全部文件复制拷贝给另外的两个服务器节点 hadoop103 hadoop104。

```c++
#1、（构建复制的文件夹） 
#在hodoop102上 创建目录wangnaixing 并在该目录下创建1.txt 输入内容
 sudo mkdir wangnaixing
 sudo touch 1.txt
 sudo vim 1.txt
 
     
 #2、(执行拷贝复制的过程）     
 #复制wangnaixing 文件 到 hodoop103
 scp -r /opt/wangnaixing root@hadoop103:/opt/wangnaixing
 #复制wangnaixing 文件 到 hodoop104
 scp -r /opt/wangnaixing  root@hadoop104:/opt/wangnaixing
 
     
 # 3、(分析结论)    
 #我们可以在hodoop102上，看到数据传输过程。
 #并切换到hodoop103 hodoop104 可以看到wangnaixing 文件了。
 #值得注意的是，复制的前提是我需要知道另外两个节点的的账户权限密码或者三个节点之间相互交换公钥建立信任。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003005157555-16859784592097.png)

同样的，如果另外两个节点，对推送的目录作为编译，比如新增了文件，我在hadoop102节点，可以通过`tcp`命令做远程目录变化拉取动作。

```c++
#1、在hadoop103中创建一个新文件2.txt
cd /opt/wangnaixing/
sudo vim 2.txt

#2、在hodoop2中拉取hodoop103的2.txt文件 放置到hadoop102 /opt/wangnaixing
scp -r root@hadoop103:/opt/wangnaixing/2.txt /opt/wangnaixing

#3、可以看到成功拉取到了！
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003012542112.png)

我们甚至可以在`hadoop102`这个节点，将`hadoop103`的数据变化推送给`hadoop104`。

```c++
scp -r root@hadoop103:/opt/wangnaixing/2.txt root@hadoop104:/opt/wangnaixing

#1、可以看到要求了输入两次密码。分别是hadoop103的密码 hadoop104的密码。

#2、此时进入hadoop104，可以看到2.txt
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003013132353.png)

## rsync

rsync命令和scp命令区别：用rsync做文件的复制要比scp的速度快，rsync只对差异文件做更新。scp是把所有文件都复制过去。

```shell
rsync    -av       $pdir/$fname              $user@hadoop$host:$pdir/$fname
命令   选项参数   要拷贝的文件路径/名称    目的用户@主机:目的路径/名称

-a 归档拷贝
-v 显示复制过程
```

```shell
#1、在hadoop103 已经存在了1.txt 2.txt 如图1所示。

#2、在hadoop102 存在 1.txt 2.txt 3.txt 4.txt

#3、使用rsync进行全量复制(首次是全发，修改了之后，只会发送修改的)
rsync -av /opt/wangnaixing/* root@hadoop103:/opt/wangnaixing

#4、结果只发送了3.txt 4.txt.

#5、hadoop3删除3.txt 4.txt 
rm -rf 3.txt 4.txt

#6、改用scp 命令再次发送，是全量发送
scp -r /opt/wangnaixing/* root@hadoop103:/opt/wangnaixing
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003014349953.png)

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003014755459.png)

## ssh 远程安全连接

`SSH`只是一种协议，存在多种实现，既有商业实现，也有开源实现。OpenSSH是一种免费开源实现。

`ssh`命令，是安全的远程连接命令，属于`openssl`软件包的组件之一。他可以帮助我们登录轻松登录到另一台主机上。实现远程操作主机的操作。

当我们要远程登录的主机都处于同一个局域网之下，我们可以根据`hostname(主机名) Or IpAddr(IP地址)` 来远程登录到另一台主机上。

语法格式：

```
ssh 用户名@IP地址 -p
-p为追加参数，默认为22端口
```

```shell
#例如在主机名为hadoop102上,登录 hadoop103主机 
#在登录过程中，需要输入hadoop103主机root账号的密码，比如这里假定此密码是：123231
ssh hadoop103
ssh 172.16.247.103（使用IP登录也可！）

#在成功登录hadoop103主机后,操作了一波，不想再操作的时候，可以通过exit命令来退出。回到我们hadoop102的控制台。
exit
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003015616628.png)

在确保网络互通，即通信的双方处于同一个局域网下，都可以实现远程访问，比如我自己的电脑通过WIFI连接了互联网。通过公网IP，可以远程访问操作到我的阿里云服务器。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212162026244-17023692270967-171672143888418.png)

之所以可以这么操作，是因为建立远程主机连接的双方，都激活开启了`sshd`服务进程，如果在开发中，没有办法通过ssh命令来远程连接目标主机，可以通过排查目标主机是否已经开启了`sshd` 服务进程作为解决问题的一个出发点。

```shell
# 检查目标主机sshd 进程的状态
systemctl status sshd
# 如果此sshd如下图所示，处于active状态，则通常是可以通过ssh 远程连接的。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212162124060-17023692848528-171672147736819.png)

`ssh`不仅仅支持密码的形式进行远程访问目标主机，也支持通过密钥的方式进行访问。具体过程为，建立ssh远程访问的双方，访问方持有公钥，目标方持有私钥。在建立ssh连接时，访问方根据公钥加密一个信息传递给目标方根据持有私钥解密信息，信息可获取则信任访问方，并给予访问方远程访问操作权限。

为了做到这种密钥通信，目标方需要制作公钥和私钥，将私钥保留，并把公钥给到访问方。

```shell
#我们可以使用 ssh-keygen命令，生成公钥和私钥
cd ~ && ssh-keygen -t rsa

#操作时连续点击三次回车即可
#最后可以看到在当前目录下生成了.ssh目录。 
#当前目录，其实是用户家目录。/home/atguigu/.ssh 打开此目录，就有公钥和私钥。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606000346604-168598102777118.png)

```shell
#基于好奇，我们可以查看下公钥和私钥的内容

#查看私钥
more id_rsa
#查看公钥
more id_rsa.pub
#观察结果，可以看到私钥特别的长，公钥比较之，是比较短的。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606000452833.png)

在目标方主机做好了公钥私钥之后，假设是hadoop102节点，我们希望hadoop103,hadoop104 都可以通过公钥借助`ssh`远程访问到。通过`ssh-copy-id` 命令可以帮助我们做发送公钥这件事情。

```shell
#将公钥发送给hadoop103
ssh-copy-id hadoop103
#将公钥发送给hadoop104
ssh-copy-id hadoop104
 
 #在切换到hadoop103  hadoop104 可以发现，在他们的家目录同样生成了.ssh文件夹。里头会存放一个授权之后的公钥。
 #可以知道 家目录下/.ssh 文件夹是Linux操作系统存放通过密钥方式其他远程访问主机时，要使用的公钥的管理文件夹。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003101516149.png)

在微服务横行的时代，多个主机之间通信密切（集群）。迫切的希望建立起来，节点和节点之间的无密登录。结合上述的知识，我们可以确定要达成这样的绝对信任需要完成以下几件事情:

- 1、在每一个集群节点都生成公钥和私钥，然后在公钥广播发送给其他集群节点。
- 2、这样，某个集群节点都存有，其他的集群节点的公钥了。以hadoop102举例子，他的`authorized_keys` 就保存了hadoop103的公钥，hadoop104的公钥。以及他自己的。样就可以在hadoop102这台机器上不需要验证密码登录hadoop103 hadoop104 hadoop102 自己。

```shell
【集群节点1：hadoop102】

#1、生成公钥和私钥
ssh-keygen -t rsa

#2、拷贝发送公钥给节所有的集群节点，包括自己
ssh-copy-id hadoop103
ssh-copy-id hadoop104
ssh-copy-id hadoop102

【集群节点2：hadoop103】
#1、生成公钥和私钥
ssh-keygen -t rsa

#2、拷贝发送公钥给节所有的集群节点，包括自己
ssh-copy-id hadoop102
ssh-copy-id hadoop104
ssh-copy-id hadoop103

【集群节点3：hadoop104】
#1、生成公钥和私钥
ssh-keygen -t rsa


#2、拷贝发送公钥给节所有的集群节点，包括自己
ssh-copy-id hadoop102
ssh-copy-id hadoop103
ssh-copy-id hadoop104
```

# 账户管理

## whoami 查当前用户名

执行 `whoami` 命令可以查看当前用户名；



## sudo 非管理员身份执行管理员权限做的事

`sudo`（superuser do）是 Linux 系统中一种很常用的权限管理机制，允许非 `root` 用户以特定的身份执行特定的命令。`sudo` 命令通过 `/etc/sudoers` 配置文件实现。

我们知道，`Linux`操作系统是一个多用户的操作系统。在 `Linux` 中，理论上来说，我们可以创建无数个用户，但是这些用户是会被划分到不同的群组里面的。

在所有的用户中，有一个名为 `root`的用户 ，是一个很特殊的用户，它是超级用户，拥有最高权限。他属于`root`群组，并且此群组只有他一个成员。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606001918298-171672174034521.png)

说这么多，就是想表达一个观点，创建的用户是有不同的操作权限的。

`Linux`操作系统这样设计的目的，可以大大提高了 `Linux` 系统的安全性，有效防止误操作或是病毒攻击。

同时，这样也带来了不便，比如某普通用户A去执行的某些命令需要更高权限，现有权限不能满足此命令的调用，这时候我们可以使用 `sudo` 命令。表明以root 用户的权限执行此命令。

```shell
# 举个例子，打印日期命令，我希望以root用户的权限去执行此m
sudo date  #--> 当然查看日期是不需要sudo的这里只是演示。
#sudo 完之后一般还需要输入用户密码的
```

## chown/chgrp 改文件所属用户 所属组

我们知道Linux操作系统里面对于账户的管理是分组、分账户的。Linux所有的基础都是从文件开始的，所有的文件有所属组和所属用户的概念，即表示这个文件必须是所属组中的账户才能操作，或者是某个具体账户才能操作。而通过使用`chown` 命令 可以帮助我们改变文件的所属某个用户，通过 `chgrp` 命令可以改变文件所属的组。语法如下所示：

```shell
Linux 修改文件目录所属用户和组

1.使用chown 命令可以修改文件或目录所属的用户：

命令：chown 用户 目录或文件名
`-R` 可以递归地修改文件访问权限，例如 `chmod -R 777 /home/lion`


2.使用 chgrp 命令可以修改文件或目录所属的组

命令：chgrp 组名 目录或文件名
```

```shell
# 修改wangnaixing目录属于atguigu【用户】
sudo chown atguigu /opt/wangnaixing/
# 修改wangnaixing目录属于atguigu【组】
sudo chgrp atguigu /opt/wangnaixing/
# 可以看到，修改之后：/opt/wangnaixing这个目录属于atguigu用户 属于atguigu组
```



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003115715798.png)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221003115946385.png)

下面我们再来具体讨论下`chmod`命令，修改文件所属用户，进而修改文件修改权限的操作的确简单。但是理解其深层次的意义才是更加重要的。下面我们来系统的学习 `Linux` 的文件权限。

```
# 以查看文件列表为例子，我们解读下展示的文件列表信息。
[root@lion ~]# ls -l
drwxr-xr-x 5 root root 4096 Apr 13  2020 climb
lrwxrwxrwx 1 root root    7 Jan 14 06:41 hello2.c -> hello.c
-rw-r--r-- 1 root root  149 Jan 13 06:14 hello.c
```

权限的整体是按用户来划分的，如下图所示：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606141039986.png)







其中 `drwxr-xr-x` 表示文件或目录的权限。让我们一起来解读它具体代表什么？

- `d` ：表示目录，就是说这是一个目录，普通文件是 `-` ，链接是 `l` 。
- `r` ： `read` 表示文件可读。
- `w` ： `write` 表示文件可写，一般有写的权限，就有删除的权限。
- `x` ： `execute` 表示文件可执行。
- `-` ：表示没有相应权限。

现在理解了权限，我们可以使用 `chmod` 来尝试修改权限。 `chmod` 它不需要是 `root` 用户才能运行的，只要你是此文件所有者，就可以用 `chmod` 来修改文件的访问权限。为了程序员理解方便，设计者会被这些权限点和数字挂钩，即形成了一个数字分配权限表，如下所示，然后通过一些简单的加法，就可以设定此文件是什么权限了。

| 权限 | 数字 |
| :--: | :--: |
|  r   |  4   |
|  w   |  2   |
|  x   |  1   |

比如我们修改hello.c文件的权限。

```
chmod 640 hello.c 

# 分析
6 = 4 + 2 + 0 表示所有者具有 rw 权限
4 = 4 + 0 + 0 表示群组用户具有 r 权限
0 = 0 + 0 + 0 表示其它用户没有权限
```

**用字母来分配权限**

- `u` ： `user` 的缩写，用户的意思，表示所有者。
- `g` ： `group` 的缩写，群组的意思，表示群组用户。
- `o` ： `other` 的缩写，其它的意思，表示其它用户。
- `a` ： `all` 的缩写，所有的意思，表示所有用户。
- `+` ：加号，表示添加权限。
- `-` ：减号，表示去除权限。
- `=` ：等于号，表示分配权限。

```shell
chmod u+rx file --> 文件file的所有者增加读和运行的权限
chmod g+r file --> 文件file的群组用户增加读的权限
chmod o-r file --> 文件file的其它用户移除读的权限
chmod g+r o-r file --> 文件file的群组用户增加读的权限，其它用户移除读的权限
chmod go-r file --> 文件file的群组和其他用户移除读的权限
chmod +x file --> 文件file的所有用户增加运行的权限
chmod u=rwx,g=r,o=- file --> 文件file的所有者分配读写和执行的权限，群组其它用户分配读的权限，其他用户没有任何权限
```

## su 切换用户

`su`命令，由于处理切换操作Linux系统的用户的，通常切换用户是需要用户具有 `root` 用户权限。

```java
sudo su --> 切换为root用户（exit 命令或 CTRL + D 快捷键都可以使普通用户切换为 root 用户）
su lion --> 切换为普通用户
su - --> 切换为root用户
```

## useradd/passwd 添加用户和改密

我们使用`useradd` 添加一个新用户，使用`passwd` 修改用户密码。通常两个命令一起使用，来达到新建账户的效果。

这两个命令需要 `root` 用户权限

```
useradd lion --> 添加一个lion用户，添加完之后在 /home 路径下可以查看
passwd lion --> 修改lion用户的密码
```



## usermod 修改用户

`usermod`命令用于修改用户的账户。

【常用参数】

- `-l` 对用户重命名。需要注意的是 `/home` 中的用户家目录的名字不会改变，需要手动修改。
- `-g` 修改用户所在的群组，例如 `usermod -g friends lion` 修改 `lion` 用户的群组为 `friends` 。
- `-G` 一次性让用户添加多个群组，例如 `usermod -G friends,foo,bar lion` 。
- `a` `-G` 会让你离开原先的群组，如果你不想这样做的话，就得再添加 `-a` 参数，意味着 `append` 追加的意思。

## userdel 删除用户

删除账户操作使用`userdel`命令，使用此命令是需要 `root` 用户权限的。

```
userdel lion --> 只会删除用户名，不会从/home中删除对应文件夹
userdel lion -r --> 会同时删除/home下的对应文件夹
```





## groupadd 新增用户组

`Linux` 中每个用户都属于一个特定的群组，如果你不设置用户的群组，默认会创建一个和它的用户名一样的群组，并且把用户划归到这个群组。



在 `Linux` 中，理论上来说，我们可以创建无数个用户，用户实际会是被划分到不同的群组里面的，其中有一个用户，名叫 `root` ，是一个很特殊的用户，它是超级用户，拥有最高权限。自动的属于root组。



我们可以通过`groupadd`命令来创建群组，用法和 `useradd` 类似。

```
groupadd friends
```

## groupdel 删除用户组

通过`groupdel`删除一个已存在的群组

```
groupdel foo  --> 删除foo群组
```

## groups 查用户所在用户组

通过`groups`命令来查看用户所在群组。

```
groups lion  --> 查看 lion 用户所在的群组
```



# 磁盘管理

## du 

在Linux操作系统中，我们知道使用ls命令，可以展示某个目录下，所有的文件或文件夹的情况，那么具体到如何知道一个文件夹占用多少磁盘空间？

- 可以通过`ls` 命令的参数追加，来以M为单位算出来占用磁盘空间多少，再做求和操作。
- 也可以通过`du`命令直接得到这个文件总占用磁盘空间大小。

```shell
#1、使用ll -lh 以M为单位展示文件大小 查看某个文件夹占用文件多少 = 335 + 199 + 446 = 1000M
ll -lh ./video/
#2、或者直接使用 du -sh 直接得到该文件夹占用多大磁盘空间
du -sh ./video/

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20221004170156433.png)

# 时间管理

## hwclock 软硬时间同步

实际上，Linux操作系统显示的时间是仅仅是软件时间，硬件内部也有系统，内部也有时间。通常机器恢复出厂设置之后，这个时间的感知是和硬件时间取齐的。就导致了会有系统显示时间和当前实际时间不同。我们可以借用`hwclock` 命令来将当前系统时间同步到硬件时间来解决来个问题。如果程序在读本机操作系统时间的话，可能会出现重启机器后，界面显示时间不一致的缺陷。通过如下方式可以处理。

```shell
# 将当前系统时间 同步到硬件时间，防止系统重启后时间还原
hwclock --systohc
```

## date设置时间

我们可以通过`date`命令，设置当前Linux操作系统的时间。比如`date -s "yyyy-mm-dd hh:mi:ss"` 格式来设置当前时间为指定的日期字符串表示的时间。

```
例如：date -s "2020-09-26 09:30:28"
```



# 帮助手册

## man

`Linux` 命令种类繁杂，我们凭借记忆不可能全部记住，因此学会查用手册是非常重要的。阅读一个命令的帮助手册，我们通常使用`man`命令。

```shell
sudo yum install -y man-pages #--> 安装
sudo mandb #--> 更新
```

**man 手册种类**

1. 可执行程序或 `Shell` 命令；
2. 系统调用（ `Linux` 内核提供的函数）；
3. 库调用（程序库中的函数）；
4. 文件（例如 `/etc/passwd` ）；
5. 特殊文件，比如设备文件（通常在 `/dev` 下）；
6. 游戏；
7. 系统的软件包（ `man(7)` ，`groff(7)` ）；
8. 系统管理命令（通常只能被 `root` 用户使用）；
9. 内核子程序。

在实际开发中，我们输入 `man + 数字 + 命令/函数`，可以查到相关的命令和函数，若不加数字， `man` 默认从数字较小的手册中寻找相关命令和库函数。

```shell

man 3 rand  --> 表示在手册的第三部分查找 rand 函数
man ls    --> 查找 ls 用法手册

#比如我们想查看C库函数 sleep库函数的使用。如果不加3,会得不到我们想要的结果的。
man 3 sleep
```

man 手册核心区域解析：(以 `man pwd` 为例)

```shell
NAME # 命令名称和简单描述
     pwd -- return working directory name

SYNOPSIS # 使用此命令的所有方法
     pwd [-L | -P]

DESCRIPTION # 包括所有参数以及用法
     The pwd utility writes the absolute pathname of the current working directory to the standard output.

     Some shells may provide a builtin pwd command which is similar or identical to this utility.  Consult the builtin(1) manual page.

     The options are as follows:

     -L      Display the logical current working directory.

     -P      Display the physical current working directory (all symbolic links resolved).

     If no options are specified, the -L option is assumed.

SEE ALSO # 扩展阅读相关命令
     builtin(1), cd(1), csh(1), sh(1), getcwd(3)
```

如果我们在Linux上想通过`man`命令来查看一些C库函数，默认不能查看，我们可以通过使用`yum -y install man-pages`，来安装库函数的帮助文档。这样我们就可以查看到了。可以看到关于此库函数很详细的介绍。

```
#比如我们输入man strcpy
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231212164035345-170237043629910-171672186896122.png)

## help

`man` 命令像新华词典一样可以查询到命令或函数的详细信息，但其实我们还有更加快捷的方式去查询， `command \--help` 或 `command \-h` ，它没有 `man` 命令显示的那么详细，但是它更加易于阅读。

```
#include<iostream>
using namespace std;
int main(){
cout << "Hello World\n";、
}
```



# 网络管理

## hostname 查主机名

执行 `hostname` 命令可以查看当前主机名；

## 修改host文件

是处在同一局域网的多台主机彼此间是可以通过IP进行通信，现在如果我们希望通过主机名进行通信该如何处理呢？

```
场景：当下我有四台服务器，他们的主机名和IP分别为：

spark100 192.168.70.100
spark101 192.168.70.101
spark102 192.168.70.102
spark103 192.168.70.103

需求：我想直接通过服务器主机名，在其中一台服务器中访问另外三台服务器
```

在Linux系统中，也有类似`windows`的hosts文件，其负责维护IP和主机名(也可为域名)的映射关系。

```shell
#1、修改 /etc/hosts文件
vim /etc/hosts

#2、配置主机名和Ip的映射关系

#3、重启设备
reboot
```

```
192.168.70.100 spark100
192.168.70.101 spark101
192.168.70.102 spark102
192.168.70.103 spark103
```

四台服务器，都写入上面的IP和主机名的映射关系。重启之后，可以看到在spark100，成功通过主机名 ping通了101 102 103三台服务器。

## 配置静态IP

默认网卡生成IP地址的协议是`DHCP`,在虚拟机调试时，就会出现一个问题，即虚拟机重启之后，有一定概率发生IP地址变更的情况。我们更希望看到的是虚拟机IP地址不要变动，这个时候我们就可以通过配置静态IP来完成这个事情了。

```shell
#1、查看Vment8网卡信息，分配的网卡路由是多少，子网掩码，以及网关,DNS1可以设置为网卡

#2、修改配置文件
vim /etc/sysconfig/network-scripts/ifcfg-ens33

#3、重启网络服务
systemctl restart network
```

```shell
TYPE="Ethernet"
OXY_METHOD="none"
BROWSER_ONLY="no"
#协议改为 static
BOOTPROTO="static"
DEFROUTE="yes"
IPV4_FAILURE_FATAL="no"
IPV6INIT="yes"
IPV6_AUTOCONF="yes"
IPV6_DEFROUTE="yes"
IPV6_FAILURE_FATAL="no"
IPV6_ADDR_GEN_MODE="stable-privacy"
NAME="ens33"
UUID="3213c196-bfde-4747-88eb-90f1aad6b4e4"
DEVICE="ens33"
# yes激活
ONBOOT="yes"
#将Vment8网卡信息填入。IP地址你只要不和网卡一样。就可以。
IPADDR=192.168.70.101
NETMASK=255.255.255.0
GATEWAY=192.168.70.2
DNS1=192.168.70.2
```

## 处理网卡冲突

Linux中和IP有关的服务进程有两个。`NetworkManager`和`network` 当 `network`和`NetworkManager`一起工作时就会出现冲突，导致网卡识别不出来了。

```shell
#1、 NetworkManager  服务开机默认关闭
systemctl disable  NetworkManager
chkconfig NetworkManager off


#2、network 服务 开机默认启动
chkconfig network on
systemctl enable network

#3、关闭NetworkManager 服务
systemctl stop  NetworkManager 

#4、开启 network 服务
systemctl start  network 
```



## Linux防火墙配置及放行端口



firewalld的基本使用（系统[防火墙](https://so.csdn.net/so/search?q=防火墙&spm=1001.2101.3001.7020)）



- 查看防火墙状态

```shell
systemctl status firewalld.service
```

- 关闭防火墙

```shell
systemctl stop firewalld.service
```



- 重启防火墙

```shell
systemctl restart firewalld.service
```



- 开启防火墙

```shell
systemctl start firewalld.service
```



- 关闭开机启动

```shell
systemctl disable firewalld.service
```

- 开启开机启动

```shell
systemctl enable firewalld.service
```

配置firewalld-cmd

- 查看放行的所有端口

```shell
firewall-cmd --zone=public --list-ports
```

- 查看防火墙规则

```
firewall-cmd --list-all
```

- 重新加载防火墙规则

```
firewall-cmd --reload
```

通过firewall-cmd（放行端口）



- 作用域是public，开放tcp协议的80端口，一直有效：

```
firewall-cmd --zone=public --add-port=80/tcp --permanent
```

- 作用域是public，批量开放tcp协议的80-90端口，一直有效：

```
firewall-cmd --zone=public --add-port=80-90/tcp --permanent
```

- 作用域是public，批量开放tcp协议的80、90端口，一直有效：

```
firewall-cmd --zone=public --add-port=80/tcp --add-port=90/tcp --permanent
```

- 指定某个端口限定某个ip访问

```shell
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="10.100.168.0" port protocol="tcp" port="2375" accept"
```

- 指定某范围端口限定某个ip网段访问

```
firewall-cmd --permanent --add-rich-rule="rule family="ipv4" source address="10.100.168.0/24" port protocol="tcp" port="8000-9999" accept"
```

- 删除规则

```shell
firewall-cmd --permanent --remove-rich-rule="rule family=ipv4 source address=10.100.168.0 port protocol=tcp port=2375 accept"
```

- 开放的服务是http协议，一直有效：

```
firewall-cmd --zone=public --add-service=http --permanent
```

- **重新载入，更新防火墙规则**，这样才生效；systemctl restart firewal也可以生效：

```
firewall-cmd --reload
```

- 查看tcp协议的80端口是否生效：

```
firewall-cmd --zone=public --query-port=80/tcp
```

- 删除80端口放行规则：

```
firewall-cmd --zone=public --remove-port=80/tcp --permanent
```

`注意：`**放行端口后必须要重新加载防火墙才会生效！**



# 开发设置

## 切换JDK版本

如果你是一个Java程序员，那么在你电脑的本地一定不止安装了一个JDK,系统究竟使用哪一个JDK。即JDK版本切换工作，在Window中，可以通过修改`JAVA_HOME` 环境变量来调整。而在Linux中，改如何进行切换JDK版本的操作呢？答案是通过`alternatives`命令。

```shell
# 1、查看当前yum安装了几个版本的JDK
alternatives --config java

#2、输入版本对应选择序号，切换当前JDK版本从8 -> 11

#3、再次验证当前JDK版本，看看是否切换成功！
java -version
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20220814004926664.png)

# 进程管理

## systemctl 任务管理器

在Centos6版本使用service命令来管理服务，其管理的服务在`/etc/init.d` 文件中保存。当下已经被弃用了。Cent7中仅仅保留了`netconsole network` 两个服务。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606192559447-16860507613222.png)



```
# ------基本语法------
service network restart 
service network start
service network stop
service network status
```

从Centos7版本开始，管理服务使用`systemctl`命令。其管理的服务放在`/usr/lib/systemd/system`目录之下。可以看到，很多的service结尾的文件，target结尾的文件。他们都是服务或者一组服务。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606192658133.png)





**系统服务级别**

我们的硬件一开机，Linux操作系统的守护进程会开启许多系统服务，系统服务之间有运行级别。其中**系统服务的运行级别**决定了这些服务是否被开启。



在Centos6中，将系统运行级别分为6类。常用的就是级别3和级别5，级别3其实就是只展示一个命令行，级别5就是有GUI图形化界面。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606192946112.png)



```shell
# Centos 6 查看当前系统的默认运行级别
vim /etc/inittab 

# 可以看到当前已经废弃此配置文件了，就算配置了，对于你的系统没有任何影响 还告诉了我们应该如何配置。以及查看当前配置

# multi-user.target 等价于命令行系统运行模式
# graphical.target 等价于GUI系统运行模式
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606193124278-171672193286623.png)





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20230606193124278.png)



所以在`Centos7` 我们想修改系统的运行级别。可以使用 `systemctl set-default` 来处理。

```shell
#1、查看系统运行模式
systemctl get-default

#2、修改系统运行模式为命令行运行模式
systemctl set-default multi-user.target

#3、修改系统运行模式为GUI图形化界面运行模式
systemctl set-default graphical.target
```

# 安全加密

## openssl

### 生成服务器证书

我们可以通过`openssl` 来生成服务端证书。

```shell
# 1、创建服务器证书秘钥 并对这个秘钥加入密码保护（采用3DES加密）。
openssl genrsa -des3 -out server.key 1024

# 2、输入该秘钥的密码。wangnaixing

# 3、创建服务器证书的申请文件
openssl req -new -key server.key -out server.csr

#4、因为使用了服务器证书秘钥，所以要进行一次密码认证 wangnaixing

# 5、系统将要求您输入要合并的信息，到您的证书申请中。
- 输入国家代号 中国写CA
- 输入省的全名 拼音
- 输入市的全名 拼音
- 公司英文名 
- 可以不输入
- 可以不输入

#6、备份一份服务器证书秘钥 备份：server.key.org
cp server.key server.key.org

#7、去掉服务器证书秘钥密码
openssl rsa -in server.key.org -out server.key

#8、去掉服务器证书秘钥秘钥 时需要再次验证该密码 wangnaixing

#9、生成证书文件 即server.crt
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

我们还可以根据需要，比如将生成证书的格式改为.p12格式的。

```shell
#1、创建私钥
openssl genrsa -out ca-key.pem 1024
#2、创建证书请求
openssl req -new -out ca-req.csr -key ca-key.pem

#3、自签署证书
openssl x509 -req -in ca-req.csr -out ca-cert.pem -signkey ca-key.pem -days 3650

#4、将证书导出成浏览器支持的.p12格式
openssl pkcs12 -export -clcerts -in ca-cert.pem -inkey ca-key.pem -out ca.p12

#5、需要你写入一个密码 wangnaixing
```

或者转为`.jks`格式的。

```shell
# 1、生成CA认证证书时用的私钥
openssl genrsa -out ca-key.pem 1024

# 2、创建证书申请请求
openssl req -new -out client-req.csr -key ca-key.pem

# 3、颁发证书
openssl x509 -req -in client-req.csr -out client.crt -signkey ca-key.pem -days 3650

#4、证书格式转为 P12
openssl pkcs12 -export -clcerts -in client.crt -inkey ca-key.pem -out client.p12

# 5、.p12文件转化成JKS格式
keytool -importkeystore -srckeystore client.p12 -srcstoretype pkcs12 -destkeystore client.jks -deststoretype JKS

# 6、CA根证书转成JKS格式(需要输入密码,之后在代码中需要用到该密码）
keytool -import -noprompt -file client.crt -keystore ca.jks -storepass 123456
```

### 公钥加密私钥解密

```shell
# 生成RSA私钥(无加密) 默认情况下，openssl 输出格式为 PKCS#1-PEM
openssl genrsa -out rsa_private.key 2048

#2、查看RSA私钥
cat rsa_private.key

#3、根据RSA私钥生成 RSA公钥
openssl rsa -in rsa_private.key -pubout -out rsa_public_key

#4、查看RSA公钥
cat rsa_public_key

# 5、写入内容到明文文件中
echo "This is Plain Message" > f.txt

# 6、使用公钥加密
openssl pkeyutl -encrypt -inkey rsa_public_key -pubin -in f.txt -out fcipher.txt

# 7、查看加密后的密文文件
cat fcipher.txt

#8、 使用私钥对密文文件进行解密
openssl pkeyutl -decrypt -inkey rsa_private.key  -in fcipher.txt -out f.txt

# 9、查看密文文件
more f.txt
```

## keystore

### 生成服务端证书

```shell
# 1、创建服务端keyStore
keytool -genkey -alias serverkey -keyalg RSA -keysize 2048 -sigalg SHA256withRSA -keystore serverkeystore.p12 -storepass 123456 -ext san=ip:127.0.0.1,dns:localhost
#输入服务端keySotre 信息

#2、导出服务端证书
keytool -exportcert -keystore serverkeystore.p12 -alias serverkey -storepass 123456 -rfc -file server-certificate.pem

# 3、将服务端证书添加到客户端trustStore中
keytool -import -trustcacerts -file server-certificate.pem -keypass 123456 -storepass 123456 -keystore clientTruststore.jks

# 4、 创建客户端keyStore
keytool -genkey -alias client -keyalg RSA -keysize 2048 -sigalg SHA256withRSA -keystore clientKeystore.p12 -storepass 123456 -ext san=ip:127.0.0.1

#5、导出客户端证书
keytool -exportcert -keystore clientKeystore.p12 -alias client -storepass 123456 -rfc -file client-certificate.pem

#6、将客户端证书添加到服务端trustStore中 
keytool -import -trustcacerts -file client-certificate.pem -keypass 123456 -storepass 123456 -keystore serverTruststore.jks
```

**keyStore与trustStore的作用**

KeyStore:

- keyStore是一个可以存储密钥、密钥对或证书的存储库。密钥：只有一个钥，一般是对称加密时使用；密钥对：包含公钥和私钥，一般是非对称加密时使用。
- keyStore文件的类型可以是JSK、PKCS12、JCEKS。JSK（Java Key Store）可以存储密钥对和证书；PKCS12、JCEKS都可以存储密钥、密钥对、证书。
- 在创建keyStore文件时，可以为keyStore设置密码。
- 密钥、密钥对、证书在keyStore统称为key，每一个key通过alias（别名）区分。key也可以设置密码（具体体现在keytool创建keyStore和trustStore时），keyStore可以存储多对key。
- 通过keytool成功往一个keyStore文件添加密钥对后，可以从该keyStore中获取到私钥、证书以及公钥（公钥主要以证书的形式存放）。

trustStore：

-  trustStore中保存的是一些可信任的证书
-  trustStore文件的类型可以是JSK、PKCS12、JCEKS。JSK（Java Key Store）可以存储密钥对和证书；PKCS12、JCEKS都可以存储密钥、密钥对、证书。

### 生成密钥

- 使用keytool 命令
- -genkey来生成密钥
-  -alias tomcathttps 设置别名为tomcathttps
- -keyalg  RSA 使用算法名称RSA
- -keysize 2048 密钥位数为2048
-  -keystore D:\wangnaixing.p12 保存在D盘
- -validity 365 有效天数为365天

```xml
-alias <alias>                  要处理的条目的别名
 -keyalg <keyalg>                密钥算法名称
 -keysize <keysize>              密钥位大小
 -sigalg <sigalg>                签名算法名称
 -destalias <destalias>          目标别名
 -dname <dname>                  唯一判别名
 -startdate <startdate>          证书有效期开始日期/时间
 -ext <value>                    X.509 扩展
 -validity <valDays>             有效天数
 -keypass <arg>                  密钥口令
 -keystore <keystore>            密钥库名称
 -storepass <arg>                密钥库口令
 -storetype <storetype>          密钥库类型
 -providername <providername>    提供方名称
 -providerclass <providerclass>  提供方类名
 -providerarg <arg>              提供方参数
 -providerpath <pathlist>        提供方类路径
 -v                              详细输出
 -protected                      通过受保护的机制的口令
```

```shell
keytool -genkey -alias tomcathttps -keyalg  RSA -keysize 2048 -keystore D:\wangnaixing.p12 -validity 365
```

```
输入密钥口令：wzxy1234
再次输入密钥口令：wzxy1234
您的名字与姓氏是什么? wangnaixing
您的组织单位名称是什么? huasu
您的组织名称是什么? huasu
您所在的城市或区域名称是什么? guangzhou 
您所在的省/市/自治区名称是什么? guangdong
该单位的双字母国家/地区代码是什么? Zh
```

进入到D盘下，发现已经出现一个wangnaixing.p12的文件哦！

# 其他

## reboot 重启

如果想重启，在Linux操作系统中，我们可以使用`reboot` 命令，或者使用 `init 6`

```c++
# 重启
reboot
init 6
```

## init 0 关机

如果想关机，在Linux操作系统中，我们可以使用使用 `init 0`命令来关机。

```
# 关机
init 0 
```

## clear 清屏

我们可以通过`clear`命令，来清空`shell` 终端的全部输入。

