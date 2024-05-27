# VSCode安装和配置

## 下载并安装VSCode

VSCode 是微软官网提供的一个开源、免费的IDE,我们进入官网之后，直接点击`Download for free` 按钮进行一个下载即可。



> 官网：https://code.visualstudio.com/

<img src="https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214215827698.png" style="zoom:50%;" />

## 安装Remote SSH

由于我们的开发电脑通常是windows操作系统的，我们通常会借助虚拟机技术来虚拟化一台Linux操作系统的主机，通过远程连接，进行Linux编程的应用开发。这就需要我们解决一个文件，即如何在VSCode中，连接到远程的Linux服务器。



我们可以通过安装

`visual studio code remote - ssh` 这个插件解决这个问题。



该插件可以实现通过[ssh连接](https://so.csdn.net/so/search?q=ssh连接&spm=1001.2101.3001.7020)远程主机、虚拟机，打开远程文件夹，并利用vscode 的插件优势进行远程开发、调试等。底层通信示意图如下所示：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214225813962.png)





因为`remote-ssh`插件中使用到了ssh连接，该ssh连接是基于[openssh](https://so.csdn.net/so/search?q=openssh&spm=1001.2101.3001.7020)实现的。

并且后续我们需要使用生成ssh密钥需要git工具，所以我们需要准备安装：

- OpenSSH 
- Git（版本不低于1.9）

首先，我们用管理员身份运行PowerShell，执行如下命令安装OpenSSH客户端。

```shell
#用管理员身份运行PowerShell
Get-WindowsCapability -Online | Where-Object Name -like 'OpenSSH*'

# 安装OpenSSH客户端 (这里我们只需要客户端)
Add-WindowsCapability -Online -Name OpenSSH.Client~~~~0.0.1.0
```

当你安装成功后，可以在控制台通过如下操作，确定已经成功安装`git` 以及 `ssh`软件。

```shell
Microsoft Windows [版本 10.0.22621.2861]
(c) Microsoft Corporation。保留所有权利。

C:\Users\82737>git -v
git version 2.40.0.windows.1

C:\Users\82737>ssh
usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]
           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]
           [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11]
           [-i identity_file] [-J [user@]host[:port]] [-L address]
           [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port]
           [-Q query_option] [-R address] [-S ctl_path] [-W host:port]
           [-w local_tun[:remote_tun]] destination [command]

C:\Users\82737>
```

之后，打开VSCode程序。查如下两个插件并安装到你的VSCode中。

- Remote - SSH

- Terminal SSH

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214230114906.png)

## 配置实现远程连接Linux服务器

在装好了`Remote -SSH` 插件之后，我们开始进行一些简单配置。即配置你的服务器的主机和域名。这两项，经过实际验证都可以写IP地址。



登录远程主机用户名，笔者这里是`root` 用户。

```shell
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host 192.168.28.132
    HostName 192.168.28.132
    User root
```

保存，并启用此配置，之后会让你输入该`root` 账户的密码，输入成功。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214230417495.png)

之后可通过`查看 >> 找到终端`，从而在VSCode下放出现`Shell` 窗口后，出现远程shell终端，则可以确定完成了配置工作。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214230524603.png)



## 可能遇到的问题

如果第一次连接Linux服务器时长时间卡在`“正在打开远程...`”，这是由于服务器因为网络问题无法下载VSCode环境相关文件。



::: info

此时需要离线安装vscode环境，这个环境配置文件，决定了你能不能远程连接到服务器，十分重要。通常网络好的话，会由服务器端自动根据连接的VSCode版本进行一个自动下载，额，如果运气不好，那么开发只能直接下载好，再替换这个环境配置文件了。

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214230648804.png)



::: warning

注意，该vscode环境配置文件和服务器关联，有这个环境配置文件，我们可使用`vscode` 对Linux程序进行断点调试，当然更专业的是使用gdb程序进行调试啊。

:::





进入VS环境配置文件目录。因为笔者这里已经下载替换好了，可以看到笔者这里有两个版本的VSCode。



不同的VSCode通过微软公司在发布产品时，给其不同的序列号，做为版本之间的区分。因此不同的VSCode的` vscode-server-linux-x64.tar.gz` 内容也时不一样。



::: info

这说明笔者用了两个版本的VSCode，正常情况只有一个的。 `vscode-server-linux-x64.tar.gz` 这一个包的内容就是要替换到你自己vc的文件夹里头。

:::



```shell{2}
# 进入VS环境文件存放目录 并查该目录存在的内容
[root@localhost bin]# cd /root/.vscode-server/bin 
[root@localhost bin]# ll 
总用量 49248
drwxr-xr-x. 6 root root      233 12月 14 06:56 0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2
drwxr-xr-x. 6 root root      150 12月 14 06:10 d2e414d9e4239a252d1ab117bd7067f125afd80a
drwxr-xr-x. 6 root root      133 12月 13 01:47 vscode-server-linux-x64
-rw-r--r--. 1 root root 50426703 12月 14 06:50 vscode-server-linux-x64.tar.gz
[root@localhost bin]# 
```

所以我们需要知道，当前我们用的VSCode的版本和序列号信息。打开VSCode软件后是可以在`顶部菜单栏帮助–>关于中查看VScode版本`，复制"提交"后的序列号，然后在



下面这个地址下载所需的VSCode环境变量配置文件安装包。

```
https://update.code.visualstudio.com/commit:<提交序列号>/server-linux-x64/stable
```



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214231351228-17025668335585.png)

将本机下载的安装包上传到服务器`/root/.vscode-server/bin/<序列号>`目录下并解压。

```shell{2,3}
# 将解压包的文件 放到以序列号作为文件夹的目录之中
[root@localhost bin]# tar -zxvf vscode-server-linux-x64.tar.gz
[root@localhost bin]# cp -r vscode-server-linux-x64/* 0ee08df0cf4527e40edc9aa28f4b5bd38bbff2b2
```

这个时候，登录Linux远程服务器看，就不会出现说，长时间卡在`“正在打开远程...”` 这个提示中了。



## 免密登录

由于每一个登录，我们都需要进行一次口令认证，即每一次都要登录，都要输入密码。

实在是很麻烦。能不能不用密码我就可以登录呢？ 



当然可以，我们可以换一种登录方式，即通过密钥登录。



::: info

在企业实际开发中，也都是别人都是给你一个私钥的，在Linux服务器中存了ssh连接的公钥。你进行发起远程SSH连接的请求，Linux服务器端收到的你发来的连接请求，在authorized_keys中查找，如果有相应的用户名和IP，则随机生成一个字符串string_text，并且使用你的公钥加密，随后发送给你，你收到这个加密的后字符串，用你的私钥加密后，再继续发给服务器，服务器拿你解密之后的字符串和string_text比对，如果一致则认定为合法连接，则可以连接到shell终端。就实现了免密登录，这也是Linux操作系统设计的初衷，即多用户性。

:::

所以基于这一套免密登录认证流程，我们需要在Windows客户端中，基于RSA算法，生成一组公钥和私钥。并公钥发送给服务器。发送的路径也很讲究，即需要发送到服务器指定的存ssh连接私钥配置目录中。

```bash{5,28,31,48,52}
Microsoft Windows [版本 10.0.22621.2861]
(c) Microsoft Corporation。保留所有权利。

# 1、基于RSA算法，生成公钥和私钥
C:\Windows\System32>ssh-keygen -t rsa -b 4096
Generating public/private rsa key pair.
Enter file in which to save the key (C:\Users\82737/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in C:\Users\82737/.ssh/id_rsa
Your public key has been saved in C:\Users\82737/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:mLMd1Inc44rqLcVDtrxBNFp2ytYNJ2AiZaePLYtdIRk 82737@wangnaixing
The key's randomart image is:
+---[RSA 4096]----+
|  ..E +.         |
|   o B=.++..     |
|    +*.=+==      |
|    .=B=....     |
|    oBB.S .      |
|   o +B= o       |
|  . o.o+o        |
|    .o.          |
|   .o..          |
+----[SHA256]-----+

# 2、切换到生成目录
C:\Windows\System32>cd C:\Users\82737\.ssh\

#3、查一下，是否有id_rsa 私钥文件  id_rsa.pub公钥文件
C:\Users\82737\.ssh>dir
 Volume in drive C has no label.
 Volume Serial Number is 64DB-4E37

 Directory of C:\Users\82737\.ssh

2023/12/14  23:18    <DIR>          .
2023/12/10  20:54    <DIR>          ..
2023/12/14  23:03               136 config
2023/12/14  23:18             3,381 id_rsa
2023/12/14  23:18               744 id_rsa.pub
2023/12/14  22:07             1,511 known_hosts
2023/12/14  22:07               937 known_hosts.old
               5 File(s)          6,709 bytes
               2 Dir(s)  326,339,551,232 bytes free

# 4、基于Linux服务器指定账号@IP:文件目录绝对路径，发送公钥文件给服务器
C:\Users\82737\.ssh>scp id_rsa.pub root@192.168.28.132:/root/.ssh/

# 5、输入Linux服务器登录密码
root@192.168.28.132's password:
id_rsa.pub      100%  744   354.8KB/s   00:00

C:\Users\82737\.ssh>
```

切换到Linux服务器这边，将收到的公钥，写入到`authorized_keys` 文件中，并

```shell{8,15,18,21}
# 1、服务器，切换到家目录，并新建.ssh目录。
[root@localhost bin]# cd ~

# 2、切换到.ssh目录下，并查全路径，这个路径不能错啊！
[root@localhost ~]# mkdir .ssh
[root@localhost ~]# cd .ssh/
[root@localhost .ssh]# pwd
/root/.ssh

# 3、服务器确认查收到该公钥文件
[root@localhost .ssh]# ls
id_rsa.pub

# 4、新建authorized_keys文件，并把id_rsa.pub公钥内容写入到authorized_keys文件里面
[root@localhost .ssh]# cat id_rsa.pub >> authorized_keys

# 5、该authorized_keys文件，授予所有用户可读权限
[root@localhost .ssh]# chmod 600 authorized_keys 

# 6、该.ssh目录，授权所有用户可读可写可执行权限
[root@localhost .ssh]# chmod 700 ~/.ssh 
```

这个时候，用别的连接工具，比如说`finalshell xshell` 之类的，是已经支持的密钥登录了。



对于VSCode来说，我们需要修改之前的配置项。

- 加入`IdentityFile` 属性，值指定为 `私钥文件全路径`。
- 加入`ForwardAgent` 属性，值指定为 `yes` 



目的是希望使用本地电脑里的密钥登录，且不想把这个密钥发送到服务器）进行配置。 



具体的配置细节见下图、见下图配置表。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231214233344915-17025680258606.png)



```shell
# Read more about SSH config files: https://linux.die.net/man/5/ssh_config
Host 192.168.28.132
    HostName 192.168.28.132
    User root
    IdentityFile "C:\Users\82737\.ssh\id_rsa"
    ForwardAgent yes
```

嘿嘿，大功告成，这时候，进行远程连接，就不需要再输入密码了。

