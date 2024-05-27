# Ubuntu 安装软件报错





[linux](https://so.csdn.net/so/search?q=linux&spm=1001.2101.3001.7020)下载官方软件安装包时由于没有镜像速度很慢，如果意外退出下载，第二次进入下载的时候缓存会被锁住，以下三行命令完美解锁。比如说，使用 `apt-get install ` 安装软件 , 报如下错误

```
sudo apt-get install gparted
```

**报错信息 :**

```shell
octopus@octopus:~$ sudo apt-get install gparted
[sudo] password for octopus: 
E: Could not get lock /var/lib/dpkg/lock-frontend - open (11: Resource temporarily unavailable)
E: Unable to acquire the dpkg frontend lock (/var/lib/dpkg/lock-frontend), is another process using it?
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231218210950293-17029049911181.png)





**解决方案：**

```
# 跑这三行命令执行完毕之后，再次执行  sudo apt-get install gparted，即可解决问题。
sudo rm /var/lib/dpkg/lock-frontend
sudo rm /var/cache/apt/archives/lock
sudo rm /var/lib/dpkg/lock
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231218211114506-17029050754572.png)
