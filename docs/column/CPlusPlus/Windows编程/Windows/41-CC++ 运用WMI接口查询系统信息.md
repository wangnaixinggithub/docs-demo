# C/C++ 运用WMI接口查询系统信息

Windows Management Instrumentation（WMI）是一种用于管理和监视`Windows`操作系统的框架。它为开发人员、系统管理员和自动化工具提供了一种标准的接口，通过这个接口，可以获取有关计算机系统硬件、操作系统和应用程序的信息，以及对系统进行管理和控制的能力。

WMI允许通过编程方式查询系统信息、监视性能、执行管理任务等。它提供了一种统一的方式来访问和管理Windows操作系统的各个方面，而无需了解底层实现细节。通过WMI，可以使用各种编程语言（如C#、VBScript、PowerShell等）来执行诸如查询系统信息、监控性能、配置系统设置等任务。

当需要通过`WMI`编程提取参数时，我们就需要使用WQL（Windows Management Instrumentation Query Language）它是一种查询语言，专门用于查询`Windows Management Instrumentation (WMI)`数据。WMI 是`Windows`操作系统中用于管理和监视的框架，而`WQL`则是用于与`WMI`进行交互的查询语言。

- 查询分析器下载：https://download.csdn.net/download/lyshark_csdn/87950095

WQL 的语法类似于 SQL（Structured Query Language），使用WQL可以执行各种查询来检索关于计算机系统、硬件、软件和其他管理信息的数据。这些查询可以用于编写脚本、管理任务、监视性能等。为了方便查询获取参数这里提供一个简单的查询工具供大家查询使用，下载后打开，其默认查询的是`Win32_ComputerSystem`也就是系统的基本参数信息；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/044d6ad66b7508c805f3e9462699a9ec%5B1%5D.png)



如果我们需要获取其他信息，比如得到计算机中所安装的所有Windows服务信息，可以执行`SELECT * FROM Win32_Service`语句，当然也有许多其他的通用语句可以让我们使用，例如如下几种常用的语句。

- 查询所有安装的软件
  - SELECT * FROM Win32_Product
- 查询所有逻辑磁盘的信息
  - SELECT * FROM Win32_LogicalDisk
- 查询所有网络适配器的信息
  - SELECT * FROM Win32_NetworkAdapter
- 查询操作系统信息
  - SELECT * FROM Win32_OperatingSystem
- 查询所有正在运行的进程
  - SELECT * FROM Win32_Process
- 查询所有用户账户信息
  - SELECT * FROM Win32_UserAccount
- 查询系统启动项
  - SELECT * FROM Win32_StartupCommand
- 查询物理内存
  - SELECT * FROM Win32_PhysicalMemory



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/c8d167b8a8d84a7def0ba4a62ef2e63b%5B1%5D.png)

如上图所示，查询将返回`Win32_Service`类中所有服务的信息。你可以根据需要编写更复杂的查询，以满足特定的管理或监视要求。

为了让读者更加方便的使用查询功能，此处我封装了一个`SelectQuerySQL`查询函数，该函数需要传入特定的查询语句，特定的查询字段以及返回值缓冲区，此时只需要读取缓冲区内的数据即可得到查询结果。

```c
#define _CRT_SECURE_NO_WARNINGS
#define _WIN32_DCOM
#define _CRT_NONSTDC_NO_DEPRECATE

#include <comdef.h>
#include <Wbemidl.h>
#include <iostream>
#include <string>

# pragma comment(lib, "wbemuuid.lib")

using namespace std;

// 去掉字符串中的空格
void Trims(char* data)
{
    int i = -1, j = 0;
    int ch = ' ';

    while (data[++i] != '\0')
    {
        if (data[i] != ch)
        {
            data[j++] = data[i];
        }
    }
    data[j] = '\0';
}

// 通用查询方法,每次查询一条
bool SelectQuerySQL(LPCWSTR SQL, LPCWSTR Key, OUT char OutBuf[1024])
{
    HRESULT hres;

    CoUninitialize();
    hres = CoInitializeEx(0, COINIT_MULTITHREADED);
    if (FAILED(hres))
    {
        return false;
    }
    hres = CoInitializeSecurity(0, -1, 0, 0, RPC_C_AUTHN_LEVEL_DEFAULT, RPC_C_IMP_LEVEL_IMPERSONATE, 0, EOAC_NONE, 0);
    if (FAILED(hres))
    {
        CoUninitialize();
        return false;
    }
    IWbemLocator* pLoc = NULL;
    hres = CoCreateInstance(CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER, IID_IWbemLocator, (LPVOID*)&pLoc);
    if (FAILED(hres))
    {
        CoUninitialize();
        return false;
    }
    IWbemServices* pSvc = NULL;
    hres = pLoc->ConnectServer(_bstr_t(L"ROOT\\CIMV2"), 0, 0, 0, 0, 0, 0, &pSvc);
    if (FAILED(hres))
    {
        pLoc->Release();
        CoUninitialize();
        return false;
    }
    hres = CoSetProxyBlanket(pSvc,RPC_C_AUTHN_WINNT,RPC_C_AUTHZ_NONE,NULL,RPC_C_AUTHN_LEVEL_CALL,RPC_C_IMP_LEVEL_IMPERSONATE,NULL,EOAC_NONE);
    if (FAILED(hres))
    {
        pSvc->Release();
        pLoc->Release();
        CoUninitialize();
        return false;
    }

    IEnumWbemClassObject* pEnumerator = NULL;

    // 执行WSQL语句
    hres = pSvc->ExecQuery(bstr_t("WQL"),bstr_t(SQL),WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY,NULL,&pEnumerator);
    if (FAILED(hres))
    {
        pSvc->Release();
        pLoc->Release();
        CoUninitialize();
        return false;
    }
    IWbemClassObject* pclsObj;
    ULONG uReturn = 0;
    while (pEnumerator)
    {
        HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
        if (0 == uReturn)
        {
            break;
        }
        VARIANT vtProp;

        // 获取到指定Key字段
        hr = pclsObj->Get(Key, 0, &vtProp, 0, 0);

        // 将获取到的数据返回给OutBuf
        wcstombs(OutBuf, vtProp.bstrVal, 1024);
        VariantClear(&vtProp);
        pclsObj->Release();
    }
    pSvc->Release();
    pLoc->Release();
    pEnumerator->Release();
    CoUninitialize();
    return true;
}
```

有了上述函数的封装，那么实现查询就变得很容易了，当我们需要查询CPU序列号时，可以直接执行`SELECT * FROM win32_Processor`并取出里面的`ProcessorId`字段，使用函数时可以总结为如下所示的案例；

```c
int main(int argc, char *argv[])
{
	char RefBuffer[1024] = { 0 };
	bool ref = false;

	ref = SelectQuerySQL(L"SELECT * FROM win32_Processor", L"ProcessorId", RefBuffer);
	std::cout << "获取CPU序列号: " << RefBuffer << std::endl;
	Trims(RefBuffer);

	system("pause");
	return 0;
}
```

输出效果如下所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/100716416c728d3e05d62f72e81b8df9%5B1%5D.png)

根据这个查询方法，我们就可以得到系统的各类固件序列号，这对于软件认证尤为重要；

```c
int main(int argc, char *argv[])
{
	char RefBuffer[1024] = { 0 };
	bool ref = false;

	ref = SelectQuerySQL(L"SELECT * FROM win32_Processor", L"ProcessorId", RefBuffer);
	std::cout << "获取CPU序列号: " << RefBuffer << std::endl;
	Trims(RefBuffer);

	ref = SelectQuerySQL(L"SELECT * FROM Win32_BaseBoard", L"SerialNumber", RefBuffer);
	std::cout << "获取主板ID号: " << RefBuffer << std::endl;
	Trims(RefBuffer);

	ref = SelectQuerySQL(L"SELECT * FROM Win32_BIOS", L"SerialNumber", RefBuffer);
	std::cout << "获取BIOS序列号: " << RefBuffer << std::endl;
	Trims(RefBuffer);

	ref = SelectQuerySQL(L"SELECT * FROM Win32_PhysicalMemory", L"SerialNumber", RefBuffer);
	std::cout << "获取内存序列号: " << RefBuffer << std::endl;
	Trims(RefBuffer);

	ref = SelectQuerySQL(L"SELECT * FROM Win32_DiskDrive WHERE Index = 0", L"SerialNumber", RefBuffer);
	Trims(RefBuffer);
	std::cout << "获取硬盘序列号: " << RefBuffer << std::endl;

	system("pause");
	return 0;
}
```

输出效果如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/8519d650bfcb18e581f6ddca0ae32afa%5B1%5D.png)

当然，有时我们也需要一次性输出多个参数，某些数据存在多条记录，在输出时也需要增加一些代码，我们以`Win32_LogicalDisk`为例，代码需要进行一定的改进，在循环时分别取出不同的字段，此时的查询函数需要相应的做一些改进，如下是查询函数需要变化的位置。

```c
while (pEnumerator)
{
    HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
    if (0 == uReturn)
    {
        break;
    }

    // 输出盘符字段
    VARIANT vtProp_DeviceID;
    VARIANT vtProp_FreeSpace;
    VARIANT vtProp_Size;

    // 获取到指定Key字段
    hr = pclsObj->Get(L"DeviceID", 0, &vtProp_DeviceID, 0, 0);
    hr = pclsObj->Get(L"FreeSpace", 0, &vtProp_FreeSpace, 0, 0);
    hr = pclsObj->Get(L"Size", 0, &vtProp_Size, 0, 0);

    // 转换数据为字符串
    char x[32], y[32], z[32];
    wcstombs(x, vtProp_DeviceID.bstrVal, 32);
    wcstombs(y, vtProp_FreeSpace.bstrVal, 32);
    wcstombs(z, vtProp_Size.bstrVal, 32);

    std::cout << "分区: " << x << std::endl;
    std::cout << "剩余: " << y << std::endl;
    std::cout << "容量: " << z << std::endl;

    // 清理
    VariantClear(&vtProp_DeviceID);
    VariantClear(&vtProp_FreeSpace);
    VariantClear(&vtProp_Size);
    pclsObj->Release();
}
```

此外，在查询参数上也应该修改为对应的`SELECT * FROM Win32_LogicalDisk`查询磁盘；

```c
int main(int argc, char *argv[])
{
	char RefBuffer[1024] = { 0 };
	bool ref = false;

	ref = SelectQuerySQL(L"SELECT * FROM Win32_LogicalDisk", L"ProcessorId", RefBuffer);
	Trims(RefBuffer);

	system("pause");
	return 0;
}
```

此时，当再一次运行这段代码，就可以查询到当前系统中所有的磁盘信息，如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/26b53a83510460d13c9d1a44112a1258%5B1%5D.png)

:::details `完整代码..`

```c
#define _CRT_SECURE_NO_WARNINGS
#define _WIN32_DCOM
#define _CRT_NONSTDC_NO_DEPRECATE
#include <iostream>
#include <string>
#include <comdef.h>
#include <Wbemidl.h>
# pragma comment(lib, "wbemuuid.lib")
using namespace std;

/// <summary>
/// 去掉字符串中的空格
/// </summary>
/// <param name="data">指向字符串的指针</param>
void Trims(char* data)
{
	int i = -1, j = 0;
	int ch = ' ';

	while (data[++i] != '\0')
	{
		if (data[i] != ch)
		{
			data[j++] = data[i];
		}
	}
	data[j] = '\0';
}
/// <summary>
/// 查询系统信息
/// </summary>
/// <param name="SQL">执行的SQL</param>
/// <param name="Key">列名</param>
/// <param name="OutBuf">列名对应值</param>
/// <returns> 实际开发 => vector<string></returns>
bool SelectQuerySQL(LPCWSTR SQL, LPCWSTR Key, OUT char OutBuf[1024])
{
	HRESULT hres;

	// 初始化COM
	CoUninitialize();
	hres = CoInitializeEx(0, COINIT_MULTITHREADED);
	if (FAILED(hres))
	{
		return false;
	}
	// 初始化COM安全性
	hres = CoInitializeSecurity(0, -1, 0, 0, RPC_C_AUTHN_LEVEL_DEFAULT, RPC_C_IMP_LEVEL_IMPERSONATE, 0, EOAC_NONE, 0);
	if (FAILED(hres))
	{
		CoUninitialize();
		return false;
	}

	// 创建WMI实例
	IWbemLocator* pLoc = NULL;
	hres = CoCreateInstance(CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER, IID_IWbemLocator, (LPVOID*)&pLoc);
	if (FAILED(hres))
	{
		CoUninitialize();
		return false;
	}

	// 连接到WMI
	IWbemServices* pSvc = NULL;
	hres = pLoc->ConnectServer(_bstr_t(L"ROOT\\CIMV2"), 0, 0, 0, 0, 0, 0, &pSvc);
	if (FAILED(hres))
	{
		pLoc->Release();
		CoUninitialize();
		return false;
	}
	// 设置安全级别
	hres = CoSetProxyBlanket(pSvc, RPC_C_AUTHN_WINNT, RPC_C_AUTHZ_NONE, NULL, RPC_C_AUTHN_LEVEL_CALL, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE);
	if (FAILED(hres))
	{
		pSvc->Release();
		pLoc->Release();
		CoUninitialize();
		return false;
	}

	IEnumWbemClassObject* pEnumerator = NULL;

	// 执行WSQL语句
	hres = pSvc->ExecQuery(bstr_t("WQL"), bstr_t(SQL), WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY, NULL, &pEnumerator);
	if (FAILED(hres))
	{
		pSvc->Release();
		pLoc->Release();
		CoUninitialize();
		return false;
	}

	// 枚举查询结果
	IWbemClassObject* pclsObj;
	ULONG uReturn = 0;
	while (pEnumerator)
	{
		HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
		if (0 == uReturn)
		{
			break;
		}
		VARIANT vtProp = { 0 };

		// 获取到指定Key字段
		hr = pclsObj->Get(Key, 0, &vtProp, 0, 0);

		if (SUCCEEDED(hr))
		{
			wcstombs(OutBuf, vtProp.bstrVal, 1024);        // 将获取到的数据返回给OutBuf          
			VariantClear(&vtProp);
		}
		pclsObj->Release();
	}
	pSvc->Release();
	pLoc->Release();
	pEnumerator->Release();
	CoUninitialize();
	return true;
}
/// <summary>
/// //有可能一行记录有多列 则需要Get多次  实际开发 => vector<StructTT>
/// </summary>
/// <param name="SQL">执行的SQL</param>
/// <returns> 实际开发 => vector<StructTT></returns>
bool SelectQuerySQLMore(LPCWSTR SQL)
{
	HRESULT hres;

	CoUninitialize();
	hres = CoInitializeEx(0, COINIT_MULTITHREADED);
	if (FAILED(hres))
	{
		return false;
	}
	hres = CoInitializeSecurity(0, -1, 0, 0, RPC_C_AUTHN_LEVEL_DEFAULT, RPC_C_IMP_LEVEL_IMPERSONATE, 0, EOAC_NONE, 0);
	if (FAILED(hres))
	{
		CoUninitialize();
		return false;
	}
	IWbemLocator* pLoc = NULL;
	hres = CoCreateInstance(CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER, IID_IWbemLocator, (LPVOID*)&pLoc);
	if (FAILED(hres))
	{
		CoUninitialize();
		return false;
	}
	IWbemServices* pSvc = NULL;
	hres = pLoc->ConnectServer(_bstr_t(L"ROOT\\CIMV2"), 0, 0, 0, 0, 0, 0, &pSvc);
	if (FAILED(hres))
	{
		pLoc->Release();
		CoUninitialize();
		return false;
	}
	hres = CoSetProxyBlanket(pSvc, RPC_C_AUTHN_WINNT, RPC_C_AUTHZ_NONE, NULL, RPC_C_AUTHN_LEVEL_CALL, RPC_C_IMP_LEVEL_IMPERSONATE, NULL, EOAC_NONE);
	if (FAILED(hres))
	{
		pSvc->Release();
		pLoc->Release();
		CoUninitialize();
		return false;
	}

	IEnumWbemClassObject* pEnumerator = NULL;
	hres = pSvc->ExecQuery(bstr_t("WQL"), bstr_t(SQL), WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY, NULL, &pEnumerator);
	if (FAILED(hres))
	{
		pSvc->Release();
		pLoc->Release();
		CoUninitialize();
		return false;
	}
	IWbemClassObject* pclsObj;
	ULONG uReturn = 0;
	while (pEnumerator)
	{
		HRESULT hr = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);
		if (0 == uReturn)
		{
			break;
		}

		// 输出盘符字段
		VARIANT vtProp_DeviceID;
		VARIANT vtProp_FreeSpace;
		VARIANT vtProp_Size;

		// 获取到指定Key字段
		hr = pclsObj->Get(L"DeviceID", 0, &vtProp_DeviceID, 0, 0);
		hr = pclsObj->Get(L"FreeSpace", 0, &vtProp_FreeSpace, 0, 0);
		hr = pclsObj->Get(L"Size", 0, &vtProp_Size, 0, 0);

		// 转换数据为字符串
		char x[32], y[32], z[32];
		wcstombs(x, vtProp_DeviceID.bstrVal, 32);
		wcstombs(y, vtProp_FreeSpace.bstrVal, 32);
		wcstombs(z, vtProp_Size.bstrVal, 32);

		std::cout << "分区: " << x << std::endl;
		std::cout << "剩余: " << y << std::endl;
		std::cout << "容量: " << z << std::endl;

		// 清理
		VariantClear(&vtProp_DeviceID);
		VariantClear(&vtProp_FreeSpace);
		VariantClear(&vtProp_Size);
		pclsObj->Release();
	}
	pSvc->Release();
	pLoc->Release();
	pEnumerator->Release();
	CoUninitialize();
	return true;
}
/// <summary>
/// 遍历每一行的 Name
/// </summary>
/// <param name="query">SQL</param>
void QueryWMI(const wchar_t* query)
{
	// 初始化COM
	HRESULT hres = CoInitializeEx(0, COINIT_MULTITHREADED);
	if (FAILED(hres))
	{

		std::wcerr << L"Failed to initialize COM library. Error code = 0x" << std::hex << hres << std::endl;
		return;
	}

	// 初始化COM安全性
	hres = CoInitializeSecurity(
		nullptr, -1, nullptr, nullptr, RPC_C_AUTHN_LEVEL_DEFAULT, RPC_C_IMP_LEVEL_IMPERSONATE, nullptr, EOAC_NONE, nullptr);

	if (FAILED(hres))
	{
		std::wcerr << L"Failed to initialize security. Error code = 0x" << std::hex << hres << std::endl;
		CoUninitialize();
		return;
	}

	// 创建WMI实例
	IWbemLocator* pLoc = nullptr;
	hres = CoCreateInstance(
		CLSID_WbemLocator, 0, CLSCTX_INPROC_SERVER, IID_IWbemLocator, reinterpret_cast<LPVOID*>(&pLoc));

	if (FAILED(hres))
	{
		std::wcerr << L"Failed to create IWbemLocator object. Error code = 0x" << std::hex << hres << std::endl;
		CoUninitialize();
		return;
	}

	// 连接到WMI
	IWbemServices* pSvc = nullptr;
	hres = pLoc->ConnectServer(
		_bstr_t(L"ROOT\\CIMV2"), // Object path of WMI namespace
		NULL,                    // User name. NULL = current user
		NULL,                    // User password. NULL = current
		0,                       // Locale. NULL indicates current
		NULL,                    // Security flags.
		0,                       // Authority (for example, Kerberos)
		0,                       // Context object 
		&pSvc                    // pointer to IWbemServices proxy
	);

	if (FAILED(hres))
	{
		std::wcerr << L"Failed to connect to ROOT\\CIMV2. Error code = 0x" << std::hex << hres << std::endl;
		pLoc->Release();
		CoUninitialize();
		return;
	}

	// 设置安全级别
	hres = CoSetProxyBlanket(
		pSvc, RPC_C_AUTHN_WINNT, RPC_C_AUTHZ_NONE, nullptr, RPC_C_AUTHN_LEVEL_CALL, RPC_C_IMP_LEVEL_IMPERSONATE, nullptr, EOAC_NONE);

	if (FAILED(hres))
	{
		std::wcerr << L"Failed to set proxy blanket. Error code = 0x" << std::hex << hres << std::endl;
		pSvc->Release();
		pLoc->Release();
		CoUninitialize();
		return;
	}

	// 执行WMI查询
	IEnumWbemClassObject* pEnumerator = nullptr;
	hres = pSvc->ExecQuery(
		_bstr_t(L"WQL"), _bstr_t(query), WBEM_FLAG_FORWARD_ONLY | WBEM_FLAG_RETURN_IMMEDIATELY, nullptr, &pEnumerator);

	if (FAILED(hres))
	{
		std::wcerr << L"Query for data failed. Error code = 0x" << std::hex << hres << std::endl;
		pSvc->Release();
		pLoc->Release();
		CoUninitialize();
		return;
	}

	// 枚举查询结果
	IWbemClassObject* pclsObj = nullptr;
	ULONG uReturn = 0;

	while (pEnumerator)
	{
		hres = pEnumerator->Next(WBEM_INFINITE, 1, &pclsObj, &uReturn);

		if (uReturn == 0)
			break;

		VARIANT vtProp = { 0 };

		// 获取属性值
		hres = pclsObj->Get(L"Name", 0, &vtProp, 0, 0);

		if (SUCCEEDED(hres))
		{
			std::wcout << L"Name : " << vtProp.bstrVal << std::endl;
			VariantClear(&vtProp);
		}

		pclsObj->Release();
	}

	// 释放资源
	pSvc->Release();
	pLoc->Release();
	pEnumerator->Release();
	CoUninitialize();
}
int main(int argc, char* argv[])
{
	if (1)
	{
		char RefBuffer[1024] = { 0 };
		bool ref = false;

		ref = SelectQuerySQL(L"SELECT * FROM win32_Processor", L"ProcessorId", RefBuffer);
		std::cout << "获取CPU序列号: " << RefBuffer << std::endl;
		Trims(RefBuffer);

		ref = SelectQuerySQL(L"SELECT * FROM Win32_BaseBoard", L"SerialNumber", RefBuffer);
		std::cout << "获取主板ID号: " << RefBuffer << std::endl;
		Trims(RefBuffer);

		ref = SelectQuerySQL(L"SELECT * FROM Win32_BIOS", L"SerialNumber", RefBuffer);
		std::cout << "获取BIOS序列号: " << RefBuffer << std::endl;
		Trims(RefBuffer);

		ref = SelectQuerySQL(L"SELECT * FROM Win32_PhysicalMemory", L"SerialNumber", RefBuffer);
		std::cout << "获取内存序列号: " << RefBuffer << std::endl;
		Trims(RefBuffer);

		ref = SelectQuerySQL(L"SELECT * FROM Win32_DiskDrive WHERE Index = 0", L"SerialNumber", RefBuffer);
		Trims(RefBuffer);
		std::cout << "获取硬盘序列号: " << RefBuffer << std::endl;
	}
	if (1)
	{
		char RefBuffer[1024] = { 0 };
		bool ref = false;
		ref = SelectQuerySQLMore(L"SELECT * FROM Win32_LogicalDisk");
		Trims(RefBuffer);
	}
	if (1)
	{
		//查询所有已安装的软件
	   //QueryWMI(L"SELECT * FROM Win32_Product");

	   //查询磁盘信息
	   //QueryWMI(L"SELECT * FROM Win32_DiskDrive");

	   // 查询网络适配器信息
	   //QueryWMI(L"SELECT * FROM Win32_NetworkAdapter");

	   // 查询操作系统信息
	   //QueryWMI(L"SELECT * FROM Win32_OperatingSystem");

	   // 查询正在运行的进程信息
	   //QueryWMI(L"SELECT * FROM Win32_Process");

	   //// 查询所有用户账户信息
	   //QueryWMI(L"SELECT * FROM Win32_UserAccount");

	   // 查询系统启动项信息
	   //QueryWMI(L"SELECT * FROM Win32_StartupCommand");

	   // 查询物理内存信息
	   //QueryWMI(L"SELECT * FROM Win32_PhysicalMemory");

	   //查询所有逻辑磁盘的信息
	   //QueryWMI(L"SELECT * FROM Win32_LogicalDisk");

	   //查询CPU信息
	  // QueryWMI(L"SELECT * FROM win32_Processor");

	   //查询主板
	   QueryWMI(L"SELECT * FROM Win32_DiskDrive");

	}
	system("pause");
	return 0;
}
```

:::