# 实现Windows注册表操作



Windows注册表（Registry）是[Windows操作系统](https://so.csdn.net/so/search?q=Windows操作系统&spm=1001.2101.3001.7020)中用于存储系统配置信息、用户设置和应用程序数据的一个集中式数据库。它是一个层次结构的数据库，由键（Key）和值（Value）组成，这些键和值被用于存储各种系统和应用程序的配置信息。



以下是注册表的一些基本概念：

1. **键（Key）：** 注册表中的数据结构，类似于文件夹，用于组织和存储相关的信息。每个键可以包含子键和/或值。
2. **子键（Subkey）：** 位于注册表中的键的层次结构中的更深一层的键。子键可以包含其他子键或值。
3. **值（Value）：** 存储在注册表中的数据单元，通常与键相关联。值可以包含配置信息、用户设置等数据。
4. **数据类型（Data Type）：** 值的数据类型定义了值的内容和用途。常见的数据类型包括字符串、整数、二进制数据等。
5. **根键（Root Key）：** 注册表的最顶层，有几个根键，常见的包括 `HKEY_CLASSES_ROOT`、`HKEY_CURRENT_USER`、`HKEY_LOCAL_MACHINE` 等。

Windows注册表的作用包括：

- **存储系统配置信息：** 注册表中存储了操作系统的配置信息，包括系统启动时需要加载的驱动程序、系统服务、文件关联等。
- **存储用户设置：** 注册表中存储了用户特定的设置，如桌面背景、主题、鼠标指针样式等。
- **应用程序配置：** 许多应用程序使用注册表存储其配置信息。当应用程序安装时，它可能会在注册表中创建相关的键和值来保存配置。
- **组织系统和应用程序数据：** 注册表提供了一个结构化的方式来组织系统和应用程序需要存储的数据，使得操作系统和应用程序可以轻松地检索和修改配置信息。
- **提供对系统设置的访问：** 通过注册表，用户和系统管理员可以访问和修改系统的各种设置，从而对系统行为进行调整和优化。

## 枚举注册表项
:::details `RegOpenKeyEx 函数说明 `

```c
/// <summary>
/// 用于打开指定的注册表键
/// </summary>
/// <param name="hKey">指定要打开的基础键的句柄，可以是 HKEY_CLASSES_ROOT、HKEY_CURRENT_USER、HKEY_LOCAL_MACHINE 等。</param>
/// <param name="lpSubKey">指定相对于hKey的子键路径。</param>
/// <param name="ulOptions"> 保留参数，通常可以设置为 0</param>
/// <param name="samDesired">指定键的访问权限，例如 KEY_READ或 KEY_WRITE。</param>
/// <param name="phkResult">接收指向打开的注册表键的句柄的指针</param>
/// <returns>如果函数调用成功，返回ERROR_SUCCESS 如果函数调用失败，返回一个错误代码。 </returns>
LSTATUS RegOpenKeyEx(HKEY hKey, LPCTSTR lpSubKey, DWORD   ulOptions, REGSAM  samDesired, PHKEY   phkResult)
```

:::



:::details `查指定键下存的注册表项`

```c
#include <stdio.h>
#include <Windows.h>
#include<iostream>
using namespace std;
/// <summary>
/// 查指定键下存的注册表项
/// </summary>
/// <param name="hRootKey"></param>
/// <param name="lpSubKey"></param>
void GetAllRegValueName(HKEY hRootKey, const char* lpSubKey)
{
	HKEY hKey = NULL;//注册表子键句柄
	char szValueName[MAXBYTE] = { 0 }; //值名称的缓冲区
	DWORD cchValueName = MAXBYTE; // 值名称的缓冲区大小
	int index = 0;//要检索的值的索引 从0开始，逐渐递增
	DWORD dwType = 0; //值类型
	char szData[MAXBYTE] = { 0 }; //数据缓冲区
	DWORD cchData = MAXBYTE; //数据缓冲区大小
	LONG lRet = 0L; //返回值状态量
	//打开注册表项
	lRet = ::RegOpenKeyExA(hRootKey, lpSubKey, 0, KEY_ALL_ACCESS, &hKey);
	if (ERROR_SUCCESS != lRet)
	{
		printf("打开注册表项失败，无法获取注册表项句柄!,hRootKey:%d\n", (int)hRootKey);
		return;
	}
	// 枚举注册表键项
	while (true)
	{
		lRet = ::RegEnumValueA(hKey, index, szValueName, &cchValueName, NULL,&dwType, (unsigned char*)szData, &cchData);
		if (lRet == ERROR_NO_MORE_ITEMS)
			break;
		printf("序号: %d 名称: %s 值: %s 类型: ", index, szValueName, szData);
		switch (dwType)
		{
		case 1: printf("REG_SZ \n"); break;
		case 2: printf("REG_EXPAND_SZ \n"); break;
		case 4: printf("REG_DWORD \n"); break;
		case 7: printf("REG_MULTI_SZ \n"); break;
		default: printf("None \n"); break;
		}
		cchValueName = MAXBYTE;
		cchData = MAXBYTE;
		index++;
	}
	//关闭注册表子键句柄
	::RegCloseKey(hKey);
}
int main(void)
{
	// 枚举普通启动项
	GetAllRegValueName(HKEY_LOCAL_MACHINE, "Software\\Microsoft\\Windows\\CurrentVersion\\Run");
	GetAllRegValueName(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Run");
	// 枚举Boot启动项
	GetAllRegValueName(HKEY_LOCAL_MACHINE, "System\\CurrentControlSet\\Control\\Session Manager\\");
	// 枚举ActiveX启动项,在子键中添加SubPath即可完成开机自启动.
	GetAllRegValueName(HKEY_LOCAL_MACHINE, "SOFTWARE\\Microsoft\\Active Setup\\Installed Components\\");
	return 0;
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240622234712655.png)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125164326130-17009018074911.png)

:::



## 添加注册表项

`RegCreateKey` 是用于创建或打开指定的注册表键。如果键不存在，则它将被创建；如果存在，则它将被打开。以下是 `RegCreateKey` 的一般用法：



:::details `RegCreateKey 函数说明`

```c
/// <summary>
/// 创建或打开指定的注册表键。如果键不存在，则它将被创建；如果存在，则它将被打开。
/// </summary>
/// <param name="hKey">指定要创建或打开的基础键的句柄，可以是 HKEY_CLASSES_ROOT HKEY_CURRENT_USER、HKEY_LOCAL_MACHINE 等</param>
/// <param name="lpSubKey">指定相对于 hKey 的子键路径。</param>
/// <param name="phkResult"接收指向创建或打开的注册表键的句柄的指针。></param>
/// <returns>如果函数调用成功，返回 ERROR_SUCCESS。如果函数调用失败，返回一个错误代码。 </returns>
LSTATUS RegCreateKey(HKEY hKey,LPCTSTR lpSubKey,PHKEY   phkResult)
```

:::





`RegSetValueEx` 是用于在指定的注册表键中设置一个值。它可以用于创建新的键值，也可以用于修改现有键值。以下是 `RegSetValueEx` 的一般用法：



:::details `RegSetValueEx 函数说明` 

```c
/// <summary>
/// 用于在指定的注册表键中设置一个值。它可以用于创建新的键值，也可以用于修改现有键值。
/// </summary>
/// <param name="hKey">指定要设置值的注册表键的句柄</param>
/// <param name="lpValueName">指定要设置值的注册表键的句柄</param>
/// <param name="Reserved">保留参数，通常可以设置为 0</param>
/// <param name="dwType">指定值的数据类型，例如 `REG_SZ` 表示字符串。</param>
/// <param name="lpData">指定要设置的值的数据。</param>
/// <param name="cbData">指定数据的大小。</param>
/// <returns>如果函数调用成功，返回 `ERROR_SUCCESS`。如果函数调用失败，返回一个错误代码。</returns>
LSTATUS RegSetValueEx(HKEY hKey, LPCTSTR lpValueName, DWORD Reserved, DWORD dwType, const BYTE* lpData, DWORD cbData)
```

:::





:::details `设置开机自启动`

通过获取自身进程名称，并将该进程路径写入到`CurrentVersion`变量中实现开机自启。查注册表确实已经写入了。并关开机试验可行。

```c
#include <stdio.h>
#include <Windows.h>
#define RegPath "Software\\Microsoft\\Windows\\CurrentVersion\\Run"
BOOL InsertRegValueData(HKEY hRootKey, const char* lpValueName, const char* lpData)
{
    //打开指定的注册表键
    HKEY hKey = NULL;
    if (ERROR_SUCCESS != ::RegOpenKeyExA(hRootKey, RegPath, 0, KEY_WRITE, &hKey))
    {
        return FALSE;
    }
    //往注册表键中写入值
    DWORD cbData = (1 + ::strlen(lpData));
    if (ERROR_SUCCESS != ::RegSetValueExA(hKey, lpValueName, 0, REG_SZ, (BYTE*)lpData, cbData))
    {
        ::RegCloseKey(hKey);
        return FALSE;
    }
    ::RegCloseKey(hKey);
    return TRUE;
}

int main(int argc, char* argv[])
{
    //查当前EXE所在的全路径
    char szPath[MAX_PATH] = { 0 };
    if (::GetModuleFileNameA(NULL, szPath, MAX_PATH))
    {
        //加入到开机自启动注册表中
        int ret = InsertRegValueData(HKEY_CURRENT_USER, "main", szPath);
        if (ret == 1)
        {
            printf("添加自身启动项成功 \n");
        }
    }
    return 0;
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125165916554-17009027577891.png)

:::



注册表项不仅可以实现开机自启动，由于Win系统都是在注册表之上工作的，只要向指定位置写入键值,即可实现许多不可思议的功能。

:::details `不可思议的功能`

```c
// 禁用系统任务管理器
void RegTaskmanagerForbidden()
{
    HKEY hkey;
    DWORD value = 1;
    DWORD dwDisposition;
    //创建指定注册表项
    ::RegCreateKeyExA(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System", 0, NULL, 0, KEY_ALL_ACCESS, NULL, &hkey, &dwDisposition);
     //设置该注册表项值
    ::RegSetValueExA(hkey, "DisableTaskMgr", NULL, REG_DWORD, (LPBYTE)&value, sizeof(DWORD));

    ::RegCloseKey(hkey);
}


// 禁用注册表编辑器
void RegEditForbidden()
{
  HKEY hkey;
  DWORD value = 1;
  RegCreateKey(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System", &hkey);
  RegSetValueEx(hkey, "DisableRegistryTools", NULL, REG_DWORD, (LPBYTE)&value, sizeof(DWORD));
  RegCloseKey(hkey);
}

// 干掉桌面壁纸
void RegModifyBackroud()
{
  DWORD value = 1;
  HKEY hkey;
  RegCreateKey(HKEY_CURRENT_USER, "Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\System", &hkey);
  RegSetValueEx(hkey, "Wallpaper", NULL, REG_SZ, (unsigned char *)"c://", 3);
  RegSetValueEx(hkey, "WallpaperStyle", NULL, REG_DWORD, (LPBYTE)&value, sizeof(DWORD));
}
```
:::

## 判断键值状态

:::details `RegQueryValueEx 函数说明`

```c
/// <summary>
/// 用于检索指定注册表键中的指定值。它可以用来获取注册表键中的数据，例如字符串、整数等。
/// </summary>
/// <param name="hKey">指定要查询值的注册表键的句柄。</param>
/// <param name="lpValueName">指定要查询的值的名称。</param>
/// <param name="lpReserved"> 保留参数，通常可以设置为 NULL</param>
/// <param name="lpType">接收值的数据类型的指针。</param>
/// <param name="lpData">接收值的数据的缓冲区</param>
/// <param name="lpcbData">接收数据缓冲区大小的指针。在调用函数之前，你应该将其设置为缓冲区大小。</param>
/// <returns>如果函数调用成功，返回 ERROR_SUCCESS。 如果函数调用失败，返回一个错误代码。</returns>
LSTATUS RegQueryValueEx(HKEY hKey,LPCTSTR lpValueName,LPDWORD lpReserved,LPDWORD lpType,LPBYTE  lpData,LPDWORD lpcbData);
```

:::

:::details `案例：判断指定键值对是否存在,是否被设置过`

```c
#include <stdio.h>
#include <Windows.h>
#include <stdio.h>
#include <Windows.h>
BOOL QueryRegValueExist(HKEY hRootKey, const char* lpValueName)
{
    HKEY hKey = NULL;
    LPCSTR lpSubKey = "Software\\Microsoft\\Windows\\CurrentVersion\\Run";
    if (ERROR_SUCCESS == ::RegOpenKeyExA(hRootKey, lpSubKey, NULL, KEY_ALL_ACCESS, &hKey))
    {

        DWORD dwType = REG_SZ;
        char szData[256];
        DWORD cbData = 255;
        if (ERROR_SUCCESS == RegQueryValueExA(hKey, lpValueName, NULL, &dwType, (BYTE*)szData, &cbData))
        {
            return true;
        }
    }
    RegCloseKey(hKey);
    return false;
}

int main(int argc, char* argv[])
{
    //查询注册某值是否存在？
    int ret = QueryRegValueExist(HKEY_CURRENT_USER, "main");
    printf("启动项存在: %d \n", ret);
    system("pause");
    return 0;
}
```

:::

## 删除键值对

:::details `RegDeleteValue 函数说明`

```c
/// <summary>
/// 用于删除指定注册表键中的指定值。它可以用来删除注册表键中的数据值
/// </summary>
/// <param name="hKey">指定要删除值的注册表键的句柄</param>
/// <param name="lpValueName">指定要删除的值的名称</param>
/// <returns>如果函数调用成功，返回 `ERROR_SUCCESS`。如果函数调用失败，返回一个错误代码。</returns>
LSTATUS RegDeleteValue(HKEY  hKey,LPCTSTR lpValueName);
```

:::



:::details `案例：传入需要删除的注册表位置，以及该表中键值对的名字即可完成删除。`

```c
#include <stdio.h>
#include <Windows.h>
BOOL DeleteRegBySubKeyPathAndValueName(const char* lpSubKey, const char* lpValueName)
{
	char szKeyName[MAXBYTE] = { 0 };
	LSTATUS lStatus;
	HKEY hKey = NULL;
	LONG lRet = ::RegOpenKeyExA(HKEY_CURRENT_USER, lpSubKey, 0, KEY_ALL_ACCESS, &hKey);
	lStatus = ::RegDeleteValueA(hKey, lpValueName);
	::RegCloseKey(hKey);
	if (lStatus == ERROR_SUCCESS)
	{
		return true;
	}
	else
	{
		return false;
	}
}

int main(int argc, char* argv[])
{
	if (DeleteRegBySubKeyPathAndValueName("Software\\Microsoft\\Windows\\CurrentVersion\\Run", "main"))
	{
		printf("删除成功!");
	}
	system("pause");
	return 0;
}
```

:::


