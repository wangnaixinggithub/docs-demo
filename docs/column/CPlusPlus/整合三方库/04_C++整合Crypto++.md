# C++整合Crypto++

`Crypto++`免费开源C++库，是C++业界内，通用的密码加解密解决方案。

## 下载Crypto++

在`Releses` 中下载`Crypto++`源码

```c
https://github.com/weidai11/cryptopp  //Github托管页
https://github.com/weidai11/cryptopp/archive/refs/tags/CRYPTOPP_8_7_0.zip //下载链接
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125111446324-17167171799711.png)

## 下载PEM包

```c
pem包官方地址：https://cryptopp.com/wiki/PEM_Pack
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125111712969-17008822341751-17167172079142.png)

点击此超链接，到该`cryptopp-pem` Github代码托管地址，直接下载源码。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125111834617-17167172192833.png)



## PEM包整合到Crypto++

- 打开下载并解压好的crypto++文件和pem包，将pem包中包含的全部文件复制粘贴到crypto++包中

- 用你的VS打开`cryptest.sln` 解决方案,将设置`cryptlib` 为启动项目，注意要添加一些PEM包的头文件和实现之后，再依次用debug,release做编译。

右击“Header Files”->添加->现有项：

```
pem.h
pem_common.h
```

右击“Source Files”->添加->现有项：

```
pem_common.cpp
pem_read.cpp
pem_write.cpp
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125112402339-17167172503694.png)



这个时候该Crypto项目下，就产出了lib静态库。如下是笔者的产出目录，可以看到静态库已经生成好了！

```
C:\Users\82737\Desktop\cryptopp-CRYPTOPP_8_7_0\x64\Output
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125112520922-17008827221743-17167172625445.png)

再把这个项目的所有头文件放到你个人统一的地方，笔者这里是`C:\\cpp\\CryptPlusPlus\\include\\` ,我发现头文件有太多个了，不想一个一个复制，就写了个移动指定目录下.h文件的程序。完成复制头文件工作。

```c
#include <iostream>
#include <fstream>
#include<string>
#include <Windows.h>
#include<tchar.h>
#include <vector>
using namespace std;

#if defined(UNICODE) || defined(_UNICODE)
typedef   std::wstring _tstring;
typedef std::wstringstream _tstringstream;
#else
typedef  std::string _tstring;
typedef  std::istringstream _tstringstream;
#endif

_tstring GetExtension(LPCTSTR lpszPath, BOOL bHasDot)

{

	_tstring strExtName(lpszPath);
	size_t dotIndex = strExtName.rfind(_T('.'));
	if (_tstring::npos == dotIndex)
	{
		strExtName = _T("");
	}
	else
	{
		if (bHasDot)
		{
			strExtName = strExtName.substr(dotIndex);
		}
		else
		{
			strExtName = strExtName.substr(dotIndex + 1);
		}
	}
	return strExtName;

}

_tstring GetFileName(const _tstring& filePath, bool bHasExt)
{
	if (filePath.empty())
	{
		return _T("");
	}

	_tstring fileName = filePath;
	size_t lastBackSlash = fileName.find_last_of(_T("\\"));
	if (lastBackSlash != _tstring::npos)
	{
		fileName = fileName.substr(lastBackSlash + 1);
	}
	if (!bHasExt)
	{
		size_t dotIndex = fileName.find_last_of(_T("."));
		if (dotIndex != _tstring::npos)
		{
			fileName = fileName.substr(0, dotIndex);
		}
	}
	return fileName;
}


void GetFileList(const _tstring& dir, const vector<_tstring>& extList, vector<_tstring>& fileList, int depth, bool bIgnoreCase, bool bFileSort)

{
	//到达深度限制返回
	if (depth < 0)
	{
		return;
	}

	WIN32_FIND_DATA  findData = { 0 };
	HANDLE hFindHandle = INVALID_HANDLE_VALUE;
	_tstring strName;
	_tstring strExtName;

	hFindHandle = ::FindFirstFile((dir + TEXT("\\*.*")).c_str(), &findData);
	if (INVALID_HANDLE_VALUE == hFindHandle)
	{
		return;
	}

	do
	{
		strName = findData.cFileName;
		if (!(findData.dwFileAttributes & FILE_ATTRIBUTE_DIRECTORY))
		{
			if (extList.empty())
			{
				fileList.emplace_back(dir + TEXT("\\") + strName);
			}
			else
			{
				 strExtName =GetExtension(strName.c_str(), false);

				if (bIgnoreCase)
				{
					for (size_t i = 0; i < extList.size(); i++)
					{
						if (0 == _tcsicmp(extList[i].c_str(), strExtName.c_str()))
						{
							fileList.emplace_back(dir + _T("\\") + strName);
						}
					}

				}
				else
				{
					for (size_t i = 0; i < extList.size(); i++) 
					{
						if (extList[i] == strExtName)
						{
							fileList.emplace_back(dir + TEXT("\\") + strName);
						}
					}

				}

			}
			continue;
		}

		if (0 == _tcscmp(findData.cFileName, TEXT(".")) || 0 == _tcscmp(findData.cFileName, TEXT("..")))
		{
			continue;
		}

		GetFileList(dir + TEXT("\\") + strName, extList, fileList, depth - 1, bIgnoreCase, bFileSort);
	} while (::FindNextFile(hFindHandle, &findData));

	if (hFindHandle)
	{
		::FindClose(hFindHandle);
		hFindHandle = NULL;
	}

	if (bFileSort)
	{
		//std::sort(fileList.begin(), fileList.end(), sortFileA);
	}
}


//复制文件
BOOL __CopyFileA__(const char* sourceFilePath, const char* targetFilePath)
{
	HANDLE hFile = INVALID_HANDLE_VALUE; //操作的文件句柄
	DWORD dwLength = 0; //复制文件的大小
	DWORD dwRealLength = 0; //实际上文件内容大小
	BOOL bRet = FALSE;


	hFile = ::CreateFileA(
		sourceFilePath, //打开sourceFilePath 表示的文件 
		GENERIC_READ | GENERIC_WRITE,  //打开是为了读写
		0, NULL,//没有安全选项
		OPEN_EXISTING, //打开一个已经存在的文件,
		FILE_ATTRIBUTE_NORMAL, //一般文件属性，基本都是他
		NULL  // 没有属性模板
	);

	if (INVALID_HANDLE_VALUE == hFile)
	{
		TCHAR tipError[MAX_PATH] = { 0 };
		_stprintf_s(tipError, _T("不能打开%s 路径表示的文件! 错误码:%d\n"), sourceFilePath, GetLastError());
		MessageBox(NULL, tipError, _T("错误"), MB_OKCANCEL);
		return FALSE;
	}
	//估量 文件的大小
	dwLength = GetFileSize(hFile, NULL);
	char* szBuffer = (char*)malloc((dwLength + 1) * sizeof(char));
	memset(szBuffer, 0, sizeof szBuffer);
	bRet = ::ReadFile(hFile, szBuffer, dwLength, &dwRealLength, NULL);//打开源文件，并把源文件内容读取到内存
	if (!bRet || dwRealLength <= 0)
	{
		free(szBuffer); szBuffer = NULL;
		TCHAR tipError[MAX_PATH] = { 0 };
		_stprintf_s(tipError, _T("读取%s 路径表示的文件内容失败了! 错误码:%d\n"), sourceFilePath, GetLastError());
		MessageBox(NULL, tipError, _T("错误"), MB_OKCANCEL);
		return FALSE;
	}
	if (hFile)
	{
		::CloseHandle(hFile); hFile = NULL;
	}


	hFile = ::CreateFileA
	(
		targetFilePath,  //打开targetFilePath 表示的文件 
		GENERIC_READ | GENERIC_WRITE, //打开是为了追加数据，并锁定。
		FILE_SHARE_READ,//允许多个进程读
		NULL,//没有安全选项
		CREATE_ALWAYS, // 打开或者创建,确保有这个文件，没有我就帮你建好
		FILE_ATTRIBUTE_NORMAL,//一般文件属性，基本都是他
		NULL //没有属性模板
	);

	if (INVALID_HANDLE_VALUE == hFile)
	{
		free(szBuffer); szBuffer = NULL;
		TCHAR tipError[MAX_PATH] = { 0 };
		_stprintf_s(tipError, _T("读取%s 路径表示的文件内容失败了! 错误码:%d\n"), targetFilePath, GetLastError());
		::MessageBox(NULL, tipError, _T("错误"), MB_OKCANCEL);
		return FALSE;
	}

	//将文件内容写入
	dwRealLength = 0;
	bRet = ::WriteFile(hFile, szBuffer, dwLength + 1, &dwRealLength, NULL); //实际上，个人感觉，可能会发生数据不一致的问题。应该考虑加读写锁

	if (!bRet || dwRealLength <= 0) //写不进去内容，就可能出现了问题
	{
		free(szBuffer); szBuffer = NULL;
		TCHAR tipError[MAX_PATH] = { 0 };
		_stprintf_s(tipError, _T("给%s 路径表示的写入文件内容失败了! 错误码:%d\n"), targetFilePath, GetLastError());
		MessageBox(NULL, tipError, _T("错误"), MB_OKCANCEL);
		return FALSE;
	}
	free(szBuffer); szBuffer = NULL;
	return TRUE;
}


int main()
{
	_tstring dir = _T("C:\\Users\\82737\\Desktop\\cryptopp890");
	_tstring targetDir = _T("C:\\cpp\\CryptPlusPlus\\include\\");
	vector<_tstring> extList;
	extList.push_back(_T("h"));
	vector<_tstring> fileList;
	int depth = 1;
	bool bIgnoreCase = true;
	bool bFileSort = false;
	_tstring itemFileName;
	_tstring targetCopyPath;

	GetFileList(dir, extList, fileList, depth, bIgnoreCase, bFileSort);
	cout << ".h totals:" << fileList.size() << endl;


	setlocale(LC_ALL, "chs");
	for (size_t i = 0; i < fileList.size(); i++)
	{


		 itemFileName =  GetFileName(fileList[i], true);
		 targetCopyPath = targetDir + itemFileName;
		 _tprintf(_T("系统正在执行文件拷贝 源文件绝对路径:%s,目标文件绝对路径:%s\n"), fileList[i].c_str(), targetCopyPath.c_str());
		 __CopyFileA__(fileList[i].c_str(), targetCopyPath.c_str());
	}
   
}
```

实际上这种写代码去移动的方式太傻逼了，当时在整合的时候不知道WINDOW还可以指定类型过滤。。。这样直接`Ctrl C V` 就一步到位了。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125113325591-17008832065076-17167173022336.png)



# HelloWorld

头文件有了，库文件有了。直接让在项目中指定头文件路径和库路径。再加下附加依赖项即可。跑通官网的入门程序，即代表整合完成。

```c
#include "cryptlib.h"
#include "rijndael.h"
#include "modes.h"
#include "files.h"
#include "osrng.h"
#include "hex.h"

#include <iostream>
#include <string>
#pragma comment(lib,"cryptlib.lib")

int main(int argc, char* argv[])
{
    using namespace CryptoPP;

    AutoSeededRandomPool prng;
    HexEncoder encoder(new FileSink(std::cout));

    SecByteBlock key(AES::DEFAULT_KEYLENGTH);
    SecByteBlock iv(AES::BLOCKSIZE);

    prng.GenerateBlock(key, key.size());
    prng.GenerateBlock(iv, iv.size());

    std::string plain = "CBC Mode Test:Hello!";
    std::string cipher, recovered;

    std::cout << "plain text: " << plain << std::endl;

    /*********************************\
    \*********************************/

    try
    {
        CBC_Mode< AES >::Encryption e;
        e.SetKeyWithIV(key, key.size(), iv);

        StringSource s(plain, true,
            new StreamTransformationFilter(e,
                new StringSink(cipher)
            ) // StreamTransformationFilter
        ); // StringSource
    }
    catch (const Exception& e)
    {
        std::cerr << e.what() << std::endl;
        exit(1);
    }

    /*********************************\
    \*********************************/

    std::cout << "key: ";
    encoder.Put(key, key.size());
    encoder.MessageEnd();
    std::cout << std::endl;

    std::cout << "iv: ";
    encoder.Put(iv, iv.size());
    encoder.MessageEnd();
    std::cout << std::endl;

    std::cout << "cipher text: ";
    encoder.Put((const byte*)&cipher[0], cipher.size());
    encoder.MessageEnd();
    std::cout << std::endl;

    /*********************************\
    \*********************************/

    try
    {
        CBC_Mode< AES >::Decryption d;
        d.SetKeyWithIV(key, key.size(), iv);

        StringSource s(cipher, true,
            new StreamTransformationFilter(d,
                new StringSink(recovered)
            ) // StreamTransformationFilter
        ); // StringSource

        std::cout << "recovered text: " << recovered << std::endl;
    }
    catch (const Exception& e)
    {
        std::cerr << e.what() << std::endl;
        exit(1);
    }

    return 0;
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125113114475-17008830755154-17167173183527.png)