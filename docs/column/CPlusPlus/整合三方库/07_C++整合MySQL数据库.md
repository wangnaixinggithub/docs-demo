# C++整合MySQL数据库

前提是你得装一个MySQL数据库到你本地。装的目的是为了拿到访问MySQL服务进程所需要的头文件和库程序。

以笔者的MySQL8数据库为例子，你找到MySQL的安装主目录，清晰可见include文件夹和lib文件夹，这正是我们开发需要的东西。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125123628535-17167175349211.png)



# HelloWorld

直接整合到项目使用，能跑通如下HelloWorld,则可知整合成功。

```c
#include <stdio.h>
#include <mysql.h>
#pragma comment(lib,"libmysql.lib")

int main(void)
{
	//初始化MySQL数据库连接对象
	printf("MySQL Environment Successful\n");
	MYSQL* mysql = mysql_init(NULL);
	if (mysql == NULL)
	{
		printf("mysql_init() error");
		return-1;
	}
		printf("数据库初始化成功\n");

		//获取连接，并检查数据库连接情况
		mysql = mysql_real_connect
		(
			mysql, //mysql_init()函数返回值
			"localhost", //mysql的IP地址
			"root", //myslq的用户名
			"root", //mysql的密码
			"cpp",   //使用的数据库名称
			3306,     //监听端口，0为默认3306端口
		NULL,   //本地套接字，不指定为NULL
		0//默认0
	);
	if (mysql == NULL)
	{
		printf("mysql_real_connect() error\n");
		return-1;
	}
	printf("数据库连接成功\n");


	//修改本次连接MySQL数据库编码格式
	printf("mysql api使用的默认编码:%s\n", mysql_character_set_name(mysql));
	mysql_set_character_set(mysql, "gbk"); //将编码改为gbk才可以进行数据插入，报错，乱码
	printf("mysql api修改后的编码为:%s\n", mysql_character_set_name(mysql));

	//执行DQL语句
	int ret = mysql_query(mysql, "select * from dept");
	if (ret != 0)
	{
		printf("mysql_query()失败了，原因：%s\n", mysql_error(mysql));
		return-1;
	}
	//获取结果集
	MYSQL_RES* res = mysql_store_result(mysql);
	if (res == NULL)
	{
		printf("mysql_store_result()失败了，原因是:%s\n", mysql_error(mysql));
		return-1;
	}

	//输出结果集表头
	int num = mysql_num_fields(res);
	MYSQL_FIELD* fields = mysql_fetch_fields(res);
	for (int i = 0; i < num; i++)
	{
		printf("%s\t\t", fields[i].name);

	}
	printf("\n");


	//输出结果集每一行每一列
	MYSQL_ROW row;
	while ((row = mysql_fetch_row(res)) != NULL)
	{
		// 将当前列中的每一列信息读出
		for (int i = 0; i < num; ++i)
		{
			printf("%s\t\t", row[i]);
		}
		printf("\n");
	}


	//释放结果集
	mysql_free_result(res);



	//写入数据

	//MySQL默认自动提交数据库，修改设置事务为手动提交
	mysql_autocommit(mysql, 0);
	int ret1 = mysql_query(mysql, "insert into dept values(10,'第一海军','海南')");
	int ret2 = mysql_query(mysql, "insert into dept values(11,'第二海军','福建')");
	int ret3 = mysql_query(mysql, "insert into dept values(12,'第三海军','辽宁')");
	printf("ret1=%d  ret2 = %d  ret3 = %d\n", ret1, ret2, ret3); 	//执行成功返回0

	if (ret1 == 0 && ret2 == 0 && ret3 == 0)
	{
		//提交事务
		printf("执行成功，正在提交事务\n");
		mysql_commit(mysql);
	}
	else
	{
		//回滚事务
		printf("执行失败，正在回滚....\n");
		printf("执行失败原因: %s\n", mysql_error(mysql));
		mysql_rollback(mysql);
	}



	//释放数据库资源
	mysql_close(mysql);


	return 0;
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125123933168-17167175560092.png)