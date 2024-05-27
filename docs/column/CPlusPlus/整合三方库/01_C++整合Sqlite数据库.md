# C++整合Sqlite数据库

# 1、官网下载

到官网下载头文件和库文件

```
官网：https://www2.sqlite.org/download.html
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231122222437666-17006630788051-17167166990051.png)

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231122222514820-17167167338752.png)



# 2、生成.lib文件

依据`sqlite3.def`文件和`sqlite3.dll`文件 可以通过VS自带的工具生成`sqlite3.lib`文件。笔者的思路是找到以下文件拷贝到下述目录上。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231122223317069-17006635980444-17167167467793.png)

```shell
//VS2019专业版本
D:\Program Files (x86)\Microsoft Visual \Studio\2019\Enterprise\VC\Tools\MSVC\14.29.30133\bin\Hostx64\x64

//VS2022社区版本，都有下面说的这些文件。
D:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC\14.36.32532\bin\Hostx64\x86
```

打开`CMD`窗口，输入如下指令,显然可以看到文件夹下生成了sqlite3.lib文件。

```c
LIB /MACHINE:IX86 /DEF:sqlite3.def //X86 架构
lib /def:sqlite3.def /machine:X64 /out:sqlite3.lib //X64架构，开发通常用他
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231122223149947-17167167750434.png)

# 3、整合到你的本地库仓库

一般出于习惯，我会放到`cpp`文件目录下，再新建`include` 文件夹和`lib`文件夹，统一分类放好这些头文件以及动态库静态库文件。这样在我们的项目也好指定头文件目录以及库目录。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231122223531757-17167167954505.png)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231122223541857-17006637432775-17167168192746.png)



# 4、HelloWorld

创建一个控制台窗口项目，在项目目录下新建一个`data.db`数据库。

```c
#include <Windows.h>
#include<tchar.h>
#include<stdio.h>
#include <locale.h>
#include<strsafe.h>
#include<vector>
#include<iostream>

#include "sqlite3.h"
#pragma comment(lib, "sqlite3.lib")
using namespace std;


//创建数据库连接
sqlite3* OpenDataBase(const char* dbFilePath)
{
	//打开数据库
	sqlite3* db = nullptr;
	if (sqlite3_open(dbFilePath, &db) != SQLITE_OK)
	{
		std::cerr << "无法获取数据库连接！" << endl;
		return nullptr;
	}
	else
	{
		std::cout << "成功获取数据库连接!" << endl;
		return db;
	}
}
//关闭数据库连接
void CloseDatabase(sqlite3* db)
{
	if (db)
	{
		sqlite3_close(db);
		db = nullptr;
	}
}

//创建表
void CreateTable(sqlite3* db)
{
	const char* createTableSql = "CREATE TABLE IF NOT EXISTS Users (Id INTEGER PRIMARY KEY AUTOINCREMENT ,Name TEXT,Age INTEGER)";
	if (sqlite3_exec(db, createTableSql, nullptr, nullptr, nullptr) != SQLITE_OK)
	{
		std::cerr << "无法创建数据表！" << endl;
	}
	else
	{
		std::cout << "User表已经存在，或创建User表成功!" << endl;
	}
}

//插入数据
void InsertData(sqlite3* db, const char* name, int age)
{
	const char* insertDataSql = "INSERT INTO Users(Name,Age) VALUES(?,?);";

	//占位符预编译
	sqlite3_stmt* statement;
	if (sqlite3_prepare_v2(db, insertDataSql, -1, &statement, nullptr) == SQLITE_OK)
	{
		//绑定参数
		sqlite3_bind_text(statement, 1, name, -1, SQLITE_STATIC);
		sqlite3_bind_int(statement, 2, age);


		//执行SQL
		if (sqlite3_step(statement) != SQLITE_DONE)
		{
			std::cout << "数据新增失败" << endl;
		}
		else
		{
			std::cout << "数据新增成功!" << endl;
		}

		//释放资源
		sqlite3_finalize(statement);
	}

}

//查询数据
void QueryData(sqlite3* db)
{
	const char* queryDataSql = "SELECT * FROM Users;";
	sqlite3_stmt* statement;

	if (sqlite3_prepare_v2(db, queryDataSql, -1, &statement, nullptr) == SQLITE_OK)
	{
		std::cout << "Id\tName\tAge" << std::endl;

		//遍历结果集
		while (sqlite3_step(statement) == SQLITE_ROW)
		{
			std::cout << sqlite3_column_int(statement, 0) << "\t"
				<< sqlite3_column_text(statement, 1) << "\t"
				<< sqlite3_column_int(statement, 2) << endl;
		}

		//释放资源
		sqlite3_finalize(statement);
	}
}

//更新数据
void UpdateData(sqlite3* db, int id, const char* name, int age)
{

	const char* updateDataSql = "UPDATE Users SET Name=?, Age=? WHERE Id=?;";
	sqlite3_stmt* statement;
	if (sqlite3_prepare_v2(db, updateDataSql, -1, &statement, nullptr) == SQLITE_OK)
	{
		//绑定参数
		sqlite3_bind_text(statement, 1, name, -1, SQLITE_STATIC);
		sqlite3_bind_int(statement, 2, age);
		sqlite3_bind_int(statement, 3, id);

		//执行语句
		if (sqlite3_step(statement) != SQLITE_DONE)
		{
			std::cout << "更新数据失败!" << endl;
		}
		else
		{
			std::cout << "更新数据成功!" << endl;
		}

		//释放资源
		sqlite3_finalize(statement);

	}

}

//删除数据
void DeleteData(sqlite3* db, int id)
{
	const char* deleteDataSql = "DELETE FROM Users Where Id = ?;";
	sqlite3_stmt* statement;


	if (sqlite3_prepare_v2(db, deleteDataSql, -1, &statement, nullptr) == SQLITE_OK)
	{
		//绑定参数
		sqlite3_bind_int(statement, 1, id);

		//执行语句
		if (sqlite3_step(statement) != SQLITE_DONE)
		{
			std::cout << "删除数据失败!" << endl;
		}
		else
		{
			std::cout << "数据删除成功!" << endl;
		}

		// 释放资源
		sqlite3_finalize(statement);

	}
}


int main()
{
	sqlite3* db = nullptr;
	const char* dbFilePath = "data.db";

	//创建数据库连接
	db = OpenDataBase(dbFilePath);
	if (db)
	{
		// 创建表
		CreateTable(db);

		// 插入数据
		InsertData(db, "JakeSon...", 30);

		// 查询数据
		QueryData(db);

		// 更新数据
		UpdateData(db, 1, "Updated Name", 35);

		// 查询更新后的数据
		QueryData(db);

		// 删除数据
		DeleteData(db, 1);

		// 查询删除后的数据
		QueryData(db);

		// 关闭数据库连接
		CloseDatabase(db);

	}

}
```

