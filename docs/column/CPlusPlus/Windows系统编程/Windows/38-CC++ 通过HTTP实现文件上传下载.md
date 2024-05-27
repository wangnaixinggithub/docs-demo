# C/C++ 通过HTTP实现文件上传下载

WinInet（Windows Internet）是 Microsoft Windows 操作系统中的一个 API 集，用于提供对 Internet 相关功能的支持。它包括了一系列的函数，使得 Windows 应用程序能够进行网络通信、处理 HTTP 请求、FTP 操作等。WinInet 提供了一套完整的网络通信工具，使得开发者能够轻松地构建支持网络功能的应用程序，涵盖了从简单的 HTTP 请求到复杂的文件传输等多种网络操作。

## 分解URL地址

`InternetCrackUrl` 函数可实现对URL字符串进行解析，提取其中的协议、主机名、端口、路径和其他信息，并将这些信息存储在 `URL_COMPONENTS` 结构中，方便后续的网络操作，该函数是Windows下默认提供的，函数与依赖结果如下所示；



**函数原型**

```c
BOOL InternetCrackUrl(
  LPCTSTR      lpszUrl,
  DWORD        dwUrlLength,
  DWORD        dwFlags,
  LPURL_COMPONENTS lpUrlComponents
);
```

**参数说明**

- `lpszUrl`：指定待解析的 URL 字符串。
- `dwUrlLength`：指定 URL 字符串的长度。
- `dwFlags`：指定解析 URL 的标志，可以是以下值之一：
  - `ICU_DECODE`：对 URL 进行解码。
  - `ICU_ESCAPE`：对 URL 进行转义。
- `lpUrlComponents`：一个指向 `URL_COMPONENTS` 结构的指针，用于存储解析后的各个部分信息。



**URL_COMPONENTS结构**

```c
typedef struct {
  DWORD dwStructSize;
  LPTSTR lpszScheme;
  DWORD dwSchemeLength;
  INTERNET_SCHEME nScheme;
  LPTSTR lpszHostName;
  DWORD dwHostNameLength;
  INTERNET_PORT nPort;
  LPTSTR lpszUserName;
  DWORD dwUserNameLength;
  LPTSTR lpszPassword;
  DWORD dwPasswordLength;
  LPTSTR lpszUrlPath;
  DWORD dwUrlPathLength;
  LPTSTR lpszExtraInfo;
  DWORD dwExtraInfoLength;
} URL_COMPONENTS, *LPURL_COMPONENTS;
```

**返回值**

如果函数成功，返回 `TRUE`，并在 `lpUrlComponents` 结构中存储解析后的信息；如果失败，返回 `FALSE`。在失败时，可以调用 `GetLastError` 函数获取详细的错误信息。



**函数调用**

```c
#include <iostream>
#include <Windows.h>
#include <WinInet.h>

#pragma comment(lib, "WinInet.lib")

using namespace std;

BOOL UrlCrack(char* pszUrl, char* pszScheme, char* pszHostName, char* pszUserName, char* pszPassword, char* pszUrlPath, char* pszExtraInfo, DWORD dwBufferSize)
{
	BOOL bRet = FALSE;
	URL_COMPONENTS uc = { 0 };

	// 初始化变量中的内容
	RtlZeroMemory(&uc, sizeof(uc));
	RtlZeroMemory(pszScheme, dwBufferSize);
	RtlZeroMemory(pszHostName, dwBufferSize);
	RtlZeroMemory(pszUserName, dwBufferSize);
	RtlZeroMemory(pszPassword, dwBufferSize);
	RtlZeroMemory(pszUrlPath, dwBufferSize);
	RtlZeroMemory(pszExtraInfo, dwBufferSize);

	// 将长度填充到结构中
	uc.dwStructSize = sizeof(uc);
	uc.dwSchemeLength = dwBufferSize - 1;
	uc.dwHostNameLength = dwBufferSize - 1;
	uc.dwUserNameLength = dwBufferSize - 1;
	uc.dwPasswordLength = dwBufferSize - 1;
	uc.dwUrlPathLength = dwBufferSize - 1;
	uc.dwExtraInfoLength = dwBufferSize - 1;
	uc.lpszScheme = pszScheme;
	uc.lpszHostName = pszHostName;
	uc.lpszUserName = pszUserName;
	uc.lpszPassword = pszPassword;
	uc.lpszUrlPath = pszUrlPath;
	uc.lpszExtraInfo = pszExtraInfo;

	// 分解URL地址
	bRet = InternetCrackUrl(pszUrl, 0, 0, &uc);
	if (FALSE == bRet)
	{
		return bRet;
	}
	return bRet;
}

int main(int argc, char* argv[])
{
	char szHttpDownloadUrl[] = "http://www.lyshark.com/index.php&username=lyshark&password=123";

	// 对应的变量
	char szScheme[MAX_PATH] = { 0 };
	char szHostName[MAX_PATH] = { 0 };
	char szUserName[MAX_PATH] = { 0 };
	char szPassword[MAX_PATH] = { 0 };
	char szUrlPath[MAX_PATH] = { 0 };
	char szExtraInfo[MAX_PATH] = { 0 };

	// 初始化用0填充
	RtlZeroMemory(szScheme, MAX_PATH);
	RtlZeroMemory(szHostName, MAX_PATH);
	RtlZeroMemory(szUserName, MAX_PATH);
	RtlZeroMemory(szPassword, MAX_PATH);
	RtlZeroMemory(szUrlPath, MAX_PATH);
	RtlZeroMemory(szExtraInfo, MAX_PATH);

	// 分解URL
	if (FALSE == UrlCrack(szHttpDownloadUrl, szScheme, szHostName, szUserName, szPassword, szUrlPath, szExtraInfo, MAX_PATH))
	{
		return FALSE;
	}

	std::cout << szScheme << std::endl;
	std::cout << szHostName << std::endl;
	std::cout << szUserName << std::endl;
	std::cout << szPassword << std::endl;
	std::cout << szUrlPath << std::endl;
	std::cout << szExtraInfo << std::endl;

	system("pause");
	return 0;
}

```

运行代码输出特定网址的每个部分，如下图所示；







![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240402220340448-17120666216471.png)

## 下载页面内容

**InternetOpen**

用于初始化 WinINet 函数的使用。以下是该函数的原型：

```c
HINTERNET InternetOpen(
  LPCWSTR lpszAgent,
  DWORD   dwAccessType,
  LPCWSTR lpszProxyName,
  LPCWSTR lpszProxyBypass,
  DWORD   dwFlags
);
```

参数说明：

- `lpszAgent`: 指定应用程序的名称，用于标识调用 `InternetOpen` 的应用程序。
- `wAccessType`: 指定访问类型，可以是 `INTERNET_OPEN_TYPE_DIRECT`、`INTERNET_OPEN_TYPE_PROXY` 或`INTERNET_OPEN_TYPE_PRECONFIG` 中的一个。
- `lpszProxyName`: 如果 `dwAccessType` 是 `INTERNET_OPEN_TYPE_PROXY`，则指定代理服务器的名称。否则，可以设为 `NULL`。
- `lpszProxyBypass`: 如果 `dwAccessType` 是 `INTERNET_OPEN_TYPE_PROXY`，则指定绕过代理服务器的地址。否则，可以设为 `NULL`。
- `dwFlags`: 一些标志，可以用来指定额外的行为，如 `INTERNET_FLAG_ASYNC` 用于异步操作。



返回值：

如果函数调用成功，将返回一个类型为 `HINTERNET` 的句柄，用于后续的 WinINet 操作。如果函数调用失败，返回 `NULL`。可以使用 `GetLastError` 函数获取详细的错误信息。



**InternetConnect**

用于建立到远程服务器的连接。以下是该函数的原型：

```c
HINTERNET InternetConnect(
  HINTERNET     hInternet,
  LPCWSTR       lpszServerName,
  INTERNET_PORT nServerPort,
  LPCWSTR       lpszUserName,
  LPCWSTR       lpszPassword,
  DWORD         dwService,
  DWORD         dwFlags,
  DWORD_PTR     dwContext
);
```

参数说明：

- `hInternet`: 调用 `InternetOpen` 返回的句柄，表示连接的上下文。
- `lpszServerName`: 要连接的服务器的名称或 IP 地址。
- `nServerPort`: 服务器的端口号。
- `lpszUserName`: 连接服务器时要使用的用户名，可以为 `NULL`。
- `lpszPassword`: 连接服务器时要使用的密码，可以为 `NULL`。
- `dwService`: 指定服务类型，可以是 `INTERNET_SERVICE_FTP`、`INTERNET_SERVICE_HTTP` 或其他服务类型。
- `dwFlags`: 一些标志，用于指定连接的属性，如 `INTERNET_FLAG_RELOAD`、`INTERNET_FLAG_SECURE` 等。
- `dwContext`: 用户定义的应用程序上下文，将在回调函数中使用。

返回值：

如果函数调用成功，将返回一个类型为 `HINTERNET` 的句柄，表示连接的上下文。如果函数调用失败，返回 `NULL`。可以使用 `GetLastError` 函数获取详细的错误信息。



`InternetConnect` 用于建立连接后，可以使用返回的句柄执行相关的协议操作，如 FTP 或 [HTTP](https://so.csdn.net/so/search?q=HTTP&spm=1001.2101.3001.7020) 操作。使用完连接后，同样需要使用 `InternetCloseHandle` 函数关闭相应的句柄，以释放资源。



**HttpOpenRequest**

它是在使用 WinINet 库进行 HTTP 操作时的一部分。以下是该函数的原型：

```c
HINTERNET HttpOpenRequest(
  HINTERNET hConnect,
  LPCWSTR   lpszVerb,
  LPCWSTR   lpszObjectName,
  LPCWSTR   lpszVersion,
  LPCWSTR   lpszReferrer,
  LPCWSTR   *lplpszAcceptTypes,
  DWORD     dwFlags,
  DWORD_PTR dwContext
);

```

参数说明：

- `hConnect`: 调用 `InternetConnect` 返回的连接句柄，表示请求的上下文。
- `lpszVerb`: HTTP 请求方法，如 “GET”、“POST” 等。
- `lpszObjectName`: 请求的对象名，通常是 URL 的路径部分。
- `lpszVersion`: HTTP 协议版本，通常是 “HTTP/1.1”。
- `lpszReferrer`: 引用的来源，可以为 `NULL`。
- `lplpszAcceptTypes`: 指定可接受的媒体类型，可以为 `NULL`。
- `dwFlags`: 一些标志，用于指定请求的属性，如 `INTERNET_FLAG_RELOAD`、`INTERNET_FLAG_SECURE` 等。
- `dwContext`: 用户定义的应用程序上下文，将在回调函数中使用。

返回值：

如果函数调用成功，将返回一个类型为 HINTERNET 的句柄，表示打开的 HTTP 请求。如果函数调用失败，返回 NULL。可以使用 GetLastError 函数获取详细的错误信息。



一旦打开了 HTTP 请求，可以使用返回的句柄执行发送请求、接收响应等操作。使用完请求后，同样需要使用 InternetCloseHandle 函数关闭相应的句柄，以释放资源。



**HttpSendRequest**

用于发送 HTTP 请求的函数，通常在使用 WinINet 库进行 HTTP 操作时调用。以下是该函数的原型：

```c
BOOL HttpSendRequest(
  HINTERNET hRequest,
  LPCWSTR   lpszHeaders,
  DWORD     dwHeadersLength,
  LPVOID    lpOptional,
  DWORD     dwOptionalLength
);
```

参数说明：

- `hRequest`: 调用 `HttpOpenRequest` 返回的 HTTP 请求句柄，表示要发送请求的上下文。
- `lpszHeaders`: 包含请求头信息的字符串，可以为 `NULL`。
- `dwHeadersLength`: 请求头的长度，如果 `lpszHeaders` 是 `NULL`，则可以为零。
- `lpOptional`: 包含请求的可选数据的缓冲区，可以为 `NULL`。
- `dwOptionalLength`: 可选数据的长度，如果 `lpOptional` 是 `NULL`，则可以为零。

返回值：

如果函数调用成功，返回非零值；如果函数调用失败，返回零。可以使用 `GetLastError` 函数获取详细的错误信息。



`HttpSendRequest` 用于实际发送 HTTP 请求。在调用此函数之后，可以使用其他 WinINet 函数来读取服务器的响应。同样，使用完请求后，需要使用 `InternetCloseHandle` 函数关闭相应的句柄，以释放资源。





**HttpQueryInfo**

用于检索有关 HTTP 请求或响应的信息的函数，通常在使用 WinINet 库进行 HTTP 操作时调用。以下是该函数的原型：

```c
BOOL HttpQueryInfo(
  HINTERNET hRequest,
  DWORD     dwInfoLevel,
  LPVOID    lpBuffer,
  LPDWORD   lpdwBufferLength,
  LPDWORD   lpdwIndex
);
```

参数说明：

- `hRequest`: 调用 `HttpOpenRequest` 返回的 HTTP 请求句柄，表示要查询信息的上下文。
- `dwInfoLevel`: 指定要检索的信息类型，可以是预定义的常量，如 `HTTP_QUERY_STATUS_CODE`、`HTTP_QUERY_CONTENT_TYPE` 等。
- `lpBuffer`: 用于接收检索到的信息的缓冲区。
- `lpdwBufferLength`: 指向一个变量，表示 `lpBuffer` 缓冲区的大小。在调用函数前，应该将该变量设置为 `lpBuffer` 缓冲区的大小。在调用函数后，该变量将包含实际写入缓冲区的字节数
- `lpdwIndex`: 如果请求返回多个值，可以使用此参数指定要检索的值的索引。对于单值的信息，可以将其设置为 `NULL`。

返回值：

如果函数调用成功，返回非零值；如果函数调用失败，返回零。可以使用 `GetLastError` 函数获取详细的错误信息。



`HttpQueryInfo` 用于获取与 HTTP 请求或响应相关的信息，如状态码、内容类型等。注意，在调用此函数之前，通常需要先调用 `HttpSendRequest` 发送请求。同样，使用完请求后，需要使用 `InternetCloseHandle` 函数关闭相应的句柄，以释放资源。





**InternetReadFile**

用于从指定的句柄读取数据的函数，通常在使用 WinINet 库进行网络操作时调用。以下是该函数的原型：

```c
BOOL InternetReadFile(
  HINTERNET hFile,
  LPVOID    lpBuffer,
  DWORD     dwNumberOfBytesToRead,
  LPDWORD   lpdwNumberOfBytesRead
);
```

参数说明：

- `hFile`: 调用 `HttpOpenRequest` 或 `FtpOpenFile` 返回的句柄，表示要读取数据的上下文。
- `lpBuffer`: 用于接收读取到的数据的缓冲区。
- `dwNumberOfBytesToRead`: 指定要读取的字节数。
- `lpdwNumberOfBytesRead`: 指向一个变量，表示 `lpBuffer` 缓冲区中实际读取的字节数。在调用函数前，应该将该变量设置为 `lpBuffer` 缓冲区的大小。在调用函数后，该变量将包含实际读取的字节数。

返回值：

如果函数调用成功，返回非零值；如果函数调用失败，返回零。可以使用 GetLastError 函数获取详细的错误信息。



InternetReadFile 用于从网络资源中读取数据，如从 HTTP 请求的响应中读取内容。在调用此函数之前，通常需要先调用其他相关的函数，如 HttpOpenRequest、HttpSendRequest 和 HttpQueryInfo。同样，使用完资源后，需要使用 InternetCloseHandle 函数关闭相应的句柄，以释放资源。



下载页面的完整代码是这样的，如下所示；

```c
#include <iostream>
#include <Windows.h>
#include <WinInet.h>

#pragma comment(lib, "WinInet.lib")

using namespace std;

BOOL UrlCrack(char* pszUrl, char* pszScheme, char* pszHostName, char* pszUserName, char* pszPassword, char* pszUrlPath, char* pszExtraInfo, DWORD dwBufferSize)
{
	BOOL bRet = FALSE;
	URL_COMPONENTS uc = { 0 };

	// 初始化变量中的内容
	RtlZeroMemory(&uc, sizeof(uc));
	RtlZeroMemory(pszScheme, dwBufferSize);
	RtlZeroMemory(pszHostName, dwBufferSize);
	RtlZeroMemory(pszUserName, dwBufferSize);
	RtlZeroMemory(pszPassword, dwBufferSize);
	RtlZeroMemory(pszUrlPath, dwBufferSize);
	RtlZeroMemory(pszExtraInfo, dwBufferSize);

	// 将长度填充到结构中
	uc.dwStructSize = sizeof(uc);
	uc.dwSchemeLength = dwBufferSize - 1;
	uc.dwHostNameLength = dwBufferSize - 1;
	uc.dwUserNameLength = dwBufferSize - 1;
	uc.dwPasswordLength = dwBufferSize - 1;
	uc.dwUrlPathLength = dwBufferSize - 1;
	uc.dwExtraInfoLength = dwBufferSize - 1;
	uc.lpszScheme = pszScheme;
	uc.lpszHostName = pszHostName;
	uc.lpszUserName = pszUserName;
	uc.lpszPassword = pszPassword;
	uc.lpszUrlPath = pszUrlPath;
	uc.lpszExtraInfo = pszExtraInfo;

	// 分解URL地址
	bRet = InternetCrackUrl(pszUrl, 0, 0, &uc);
	if (FALSE == bRet)
	{
		return bRet;
	}
	return bRet;
}

// 从响应信息头信息中获取数据内容长度大小
BOOL GetContentLength(char* pResponseHeader, DWORD* pdwContentLength)
{
	int i = 0;
	char szContentLength[MAX_PATH] = { 0 };
	DWORD dwContentLength = 0;
	char szSubStr[] = "Content-Length: ";
	RtlZeroMemory(szContentLength, MAX_PATH);

	// 在传入字符串中查找子串
	char* p = strstr(pResponseHeader, szSubStr);
	if (NULL == p)
	{
		return FALSE;
	}

	p = p + lstrlen(szSubStr);
	
	// 如果找到了就提取出里面的纯数字
	while (('0' <= *p) && ('9' >= *p))
	{
		szContentLength[i] = *p;
		p++;
		i++;
	}

	// 字符串转数字
	dwContentLength = atoi(szContentLength);
	*pdwContentLength = dwContentLength;
	return TRUE;
}

// 数据下载
BOOL HttpDownload(char* pszDownloadUrl, BYTE** ppDownloadData, DWORD* pdwDownloadDataSize)
{
	// 定义HTTP子变量
	char szScheme[MAX_PATH] = { 0 };
	char szHostName[MAX_PATH] = { 0 };
	char szUserName[MAX_PATH] = { 0 };
	char szPassword[MAX_PATH] = { 0 };
	char szUrlPath[MAX_PATH] = { 0 };
	char szExtraInfo[MAX_PATH] = { 0 };

	// 填充为空
	RtlZeroMemory(szScheme, MAX_PATH);
	RtlZeroMemory(szHostName, MAX_PATH);
	RtlZeroMemory(szUserName, MAX_PATH);
	RtlZeroMemory(szPassword, MAX_PATH);
	RtlZeroMemory(szUrlPath, MAX_PATH);
	RtlZeroMemory(szExtraInfo, MAX_PATH);

	// 拆解URL地址
	if (FALSE == UrlCrack(pszDownloadUrl, szScheme, szHostName, szUserName, szPassword, szUrlPath, szExtraInfo, MAX_PATH))
	{
		return FALSE;
	}

	// 数据下载
	HINTERNET hInternet = NULL;
	HINTERNET hConnect = NULL;
	HINTERNET hRequest = NULL;
	DWORD dwOpenRequestFlags = 0;
	BOOL bRet = FALSE;
	unsigned char* pResponseHeaderIInfo = NULL;
	DWORD dwResponseHeaderIInfoSize = 2048;
	BYTE* pBuf = NULL;
	DWORD dwBufSize = 64 * 1024;
	BYTE* pDownloadData = NULL;
	DWORD dwDownloadDataSize = 0;
	DWORD dwRet = 0;
	DWORD dwOffset = 0;

	do
	{
		// 建立会话
		hInternet = InternetOpen("WinInetGet/0.1", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
		if (NULL == hInternet)
		{
			break;
		}

		// 建立连接
		hConnect = InternetConnect(hInternet, szHostName, INTERNET_DEFAULT_HTTP_PORT, szUserName, szPassword, INTERNET_SERVICE_HTTP, 0, 0);
		if (NULL == hConnect)
		{
			break;
		}

		// 打开并发送HTTP请求
		dwOpenRequestFlags = INTERNET_FLAG_IGNORE_REDIRECT_TO_HTTP |
			INTERNET_FLAG_KEEP_CONNECTION |
			INTERNET_FLAG_NO_AUTH |
			INTERNET_FLAG_NO_COOKIES |
			INTERNET_FLAG_NO_UI |
			INTERNET_FLAG_RELOAD;
		if (0 < lstrlen(szExtraInfo))
		{
			lstrcat(szUrlPath, szExtraInfo);
		}

		// 以GET模式打开请求
		hRequest = HttpOpenRequest(hConnect, "GET", szUrlPath, NULL, NULL, NULL, dwOpenRequestFlags, 0);
		if (NULL == hRequest)
		{
			break;
		}

		// 发送请求
		bRet = HttpSendRequest(hRequest, NULL, 0, NULL, 0);
		if (FALSE == bRet)
		{
			break;
		}
		// 接收响应的报文信息头(Get Response Header)
		pResponseHeaderIInfo = new unsigned char[dwResponseHeaderIInfoSize];
		if (NULL == pResponseHeaderIInfo)
		{
			break;
		}
		RtlZeroMemory(pResponseHeaderIInfo, dwResponseHeaderIInfoSize);

		// 查询HTTP请求头
		bRet = HttpQueryInfo(hRequest, HTTP_QUERY_RAW_HEADERS_CRLF, pResponseHeaderIInfo, &dwResponseHeaderIInfoSize, NULL);
		if (FALSE == bRet)
		{
			break;
		}

		// 从字符串中 "Content-Length: " 网页获取数据长度
		bRet = GetContentLength((char*)pResponseHeaderIInfo, &dwDownloadDataSize);

		// 输出完整响应头
		std::cout << pResponseHeaderIInfo << std::endl;
		if (FALSE == bRet)
		{
			break;
		}
		// 接收报文主体内容(Get Response Body)
		pBuf = new BYTE[dwBufSize];
		if (NULL == pBuf)
		{
			break;
		}
		pDownloadData = new BYTE[dwDownloadDataSize];
		if (NULL == pDownloadData)
		{
			break;
		}
		RtlZeroMemory(pDownloadData, dwDownloadDataSize);
		do
		{
			RtlZeroMemory(pBuf, dwBufSize);

			// 循环读入数据并保存在变量中
			bRet = InternetReadFile(hRequest, pBuf, dwBufSize, &dwRet);
			if (FALSE == bRet)
			{
				break;
			}

			RtlCopyMemory((pDownloadData + dwOffset), pBuf, dwRet);
			dwOffset = dwOffset + dwRet;

		} while (dwDownloadDataSize > dwOffset);

		// 返回数据
		*ppDownloadData = pDownloadData;
		*pdwDownloadDataSize = dwDownloadDataSize;

	} while (FALSE);

	// 关闭并释放资源
	if (NULL != pBuf)
	{
		delete[]pBuf;
		pBuf = NULL;
	}
	if (NULL != pResponseHeaderIInfo)
	{
		delete[]pResponseHeaderIInfo;
		pResponseHeaderIInfo = NULL;
	}
	if (NULL != hRequest)
	{
		InternetCloseHandle(hRequest);
		hRequest = NULL;
	}
	if (NULL != hConnect)
	{
		InternetCloseHandle(hConnect);
		hConnect = NULL;
	}
	if (NULL != hInternet)
	{
		InternetCloseHandle(hInternet);
		hInternet = NULL;
	}
	return bRet;
}

// 创建并保存文件
BOOL SaveToFile(char* pszFileName, BYTE* pData, DWORD dwDataSize)
{
	// 创建空文件
	HANDLE hFile = CreateFile(pszFileName, GENERIC_READ | GENERIC_WRITE,
		FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, CREATE_ALWAYS,
		FILE_ATTRIBUTE_ARCHIVE, NULL);
	if (INVALID_HANDLE_VALUE == hFile)
	{
		return FALSE;
	}

	DWORD dwRet = 0;

	// 写出数据到文件
	WriteFile(hFile, pData, dwDataSize, &dwRet, NULL);

	// 关闭句柄保存文件
	CloseHandle(hFile);

	return TRUE;
}

```

使用时调用`HttpDownload`实现数据下载，下载后的文件会保存在`pHttpDownloadData`中，此时直接调用`SaveToFile`将其保存在文件中即可；

```c
int main(int argc, char* argv[])
{
	// 设置需要下载的地址
	char szHttpDownloadUrl[] = "http://www.lyshark.com/index.html";
	BYTE* pHttpDownloadData = NULL;
	DWORD dwHttpDownloadDataSize = 0;

	// HTTP下载 
	if (TRUE == HttpDownload(szHttpDownloadUrl, &pHttpDownloadData, &dwHttpDownloadDataSize))
	{
		std::cout << "已保存文件,长度: " << dwHttpDownloadDataSize << " 字节"<< std::endl;
	}

	// 将下载数据保存成文件
	SaveToFile((char *)"d://index.html", pHttpDownloadData, dwHttpDownloadDataSize);

	// 释放内存
	delete[]pHttpDownloadData;
	pHttpDownloadData = NULL;

	system("pause");
	return 0;
}

```

运行后则可输出响应头`Content-Length:`完整参数以及输出的字节数，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240402221553417-17120673545842.png)





## 上传文件内容

服务端，首先需要实现一个简单的上传接收功能，这里使用flask框架实现，通过执行`pip install flask`命令安装这个库，安装成功以后手动保存为`main.py`文件，上传文件是只需要向`http://127.0.0.1/upload?file=`推送数据即可，代码如下；



服务端以管理员身份运行`main.py`文件，此时会启用一个Web服务器用于接收客户端的上传请求，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240402221727458-17120674490133.png)



接着是客户端的实现，首先介绍如下几个关键API函数；



**HttpSendRequestEx**

用于发送带有附加选项的 HTTP 请求。相对于 `HttpSendRequest`，它提供了更多的灵活性，允许在请求中包含额外的信息，例如头部和数据。



以下是 `HttpSendRequestEx` 的原型：

```c
BOOL HttpSendRequestEx(
  HINTERNET               hRequest,
  LPINTERNET_BUFFERS      lpBuffersIn,
  LPINTERNET_BUFFERS      lpBuffersOut,
  DWORD                   dwFlags,
  DWORD_PTR               dwContext
);
```

参数说明：

- `hRequest`：由 `HttpOpenRequest` 返回的句柄，表示 HTTP 请求。
- `lpBuffersIn`：指向 `INTERNET_BUFFERS` 结构的指针，其中包含要作为请求的一部分发送的数据。
- `lpBuffersOut`：指向 `INTERNET_BUFFERS` 结构的指针，用于接收响应中接收到的数据。
- `dwFlags`：附加标志，控制函数的行为。这可以包括选项，如`INTERNET_FLAG_RELOAD`、`INTERNET_FLAG_SECURE` 等。
- `dwContext`：传递给回调函数的用户定义的上下文值。

`INTERNET_BUFFERS` 是一个结构，允许您在 HTTP 请求和响应中指定用于发送和接收数据的缓冲区。



使用 `HttpSendRequestEx` 需要谨慎处理内存，并根据您的需求设置 `INTERNET_BUFFERS` 结构的具体方式。



**InternetWriteFile**

用于将数据写入到由 `InternetOpenUrl`、`InternetOpen`、`HttpOpenRequest` 或 `FtpOpenFile` 等函数打开的 URL、连接或文件。以下是该函数的原型

```c
BOOL InternetWriteFile(
  HINTERNET hFile,
  LPCVOID   lpBuffer,
  DWORD     dwNumberOfBytesToWrite,
  LPDWORD   lpdwNumberOfBytesWritten
);
```

参数说明：

- `hFile`: 调用 `InternetOpenUrl`、`InternetOpen`、`HttpOpenRequest` 或 `FtpOpenFile` 等函数返回的句柄，表示要写入的文件、URL 或连接。
- `lpBuffer`: 指向包含要写入的数据的缓冲区的指针。
- `dwNumberOfBytesToWrite`: 要写入的字节数。
- `lpdwNumberOfBytesWritten`: 指向一个变量，表示实际写入的字节数。在调用函数前，应该将该变量设置为缓冲区的大小。在调用函数后，该变量将包含实际写入的字节数。

返回值：

如果函数调用成功，返回非零值；如果函数调用失败，返回零。可以使用 GetLastError 函数获取详细的错误信息。



`InternetWriteFile` 主要用于将数据写入网络资源，如通过 HTTP 或 FTP 协议上传文件。在调用此函数之前，通常需要先调用其他相关的函数，如` InternetOpenUrl`、`InternetOpen`、`HttpOpenRequest `等。同样，使用完资源后，需要使用 `InternetCloseHandle` 函数关闭相应的句柄，以释放资源。





**HttpEndRequest**

它通常与 `HttpSendRequest` 或 `HttpSendRequestEx` 配合使用，用于完成 HTTP 请求的发送，并准备接收服务器的响应。



以下是 `HttpEndRequest` 函数的原型：

```c
BOOL HttpEndRequest(
  HINTERNET hRequest,
  LPINTERNET_BUFFERS lpBuffersOut,
  DWORD dwFlags,
  DWORD_PTR dwContext
);
```

参数说明：

- `hRequest`: 调用 `HttpOpenRequest`、`HttpOpenRequestEx`、`HttpSendRequest` 或 `HttpSendRequestEx` 等函数返回的 HTTP 请求句柄。
- `lpBuffersOut`: 指向一个 `INTERNET_BUFFERS` 结构的指针，该结构用于传递关于响应数据的信息。可以为 `NULL`。
- `dwFlags`: 一些标志，用于指定结束请求的选项。通常为 0。
- `dwContext`: 用户定义的应用程序上下文，将在回调函数中使用。

返回值：

如果函数调用成功，返回非零值；如果函数调用失败，返回零。可以使用 `GetLastError` 函数获取详细的错误信息。





`HttpEndRequest` 的主要作用是完成 HTTP 请求的发送，并在请求完成后准备接收服务器的响应。在调用此函数之后，通常会使用 `InternetReadFile` 函数等来读取服务器的响应数据。





上传文件的完整代码是这样的，如下所示；

```c
#include <iostream>
#include <Windows.h>
#include <WinInet.h>

#pragma comment(lib, "WinInet.lib")

using namespace std;

// 切割路径
BOOL UrlCrack(char* pszUrl, char* pszScheme, char* pszHostName, char* pszUserName, char* pszPassword, char* pszUrlPath, char* pszExtraInfo, DWORD dwBufferSize)
{
	BOOL bRet = FALSE;
	URL_COMPONENTS uc = { 0 };

	// 初始化变量中的内容
	RtlZeroMemory(&uc, sizeof(uc));
	RtlZeroMemory(pszScheme, dwBufferSize);
	RtlZeroMemory(pszHostName, dwBufferSize);
	RtlZeroMemory(pszUserName, dwBufferSize);
	RtlZeroMemory(pszPassword, dwBufferSize);
	RtlZeroMemory(pszUrlPath, dwBufferSize);
	RtlZeroMemory(pszExtraInfo, dwBufferSize);

	// 将长度填充到结构中
	uc.dwStructSize = sizeof(uc);
	uc.dwSchemeLength = dwBufferSize - 1;
	uc.dwHostNameLength = dwBufferSize - 1;
	uc.dwUserNameLength = dwBufferSize - 1;
	uc.dwPasswordLength = dwBufferSize - 1;
	uc.dwUrlPathLength = dwBufferSize - 1;
	uc.dwExtraInfoLength = dwBufferSize - 1;
	uc.lpszScheme = pszScheme;
	uc.lpszHostName = pszHostName;
	uc.lpszUserName = pszUserName;
	uc.lpszPassword = pszPassword;
	uc.lpszUrlPath = pszUrlPath;
	uc.lpszExtraInfo = pszExtraInfo;

	// 分解URL地址
	bRet = InternetCrackUrl(pszUrl, 0, 0, &uc);
	if (FALSE == bRet)
	{
		return bRet;
	}
	return bRet;
}

// 从响应信息头信息中获取数据内容长度大小
BOOL GetContentLength(char* pResponseHeader, DWORD* pdwContentLength)
{
	int i = 0;
	char szContentLength[MAX_PATH] = { 0 };
	DWORD dwContentLength = 0;
	char szSubStr[] = "Content-Length: ";
	RtlZeroMemory(szContentLength, MAX_PATH);

	// 在传入字符串中查找子串
	char* p = strstr(pResponseHeader, szSubStr);
	if (NULL == p)
	{
		return FALSE;
	}

	p = p + lstrlen(szSubStr);

	// 如果找到了就提取出里面的纯数字
	while (('0' <= *p) && ('9' >= *p))
	{
		szContentLength[i] = *p;
		p++;
		i++;
	}

	// 字符串转数字
	dwContentLength = atoi(szContentLength);
	*pdwContentLength = dwContentLength;
	return TRUE;
}

// 数据上传
BOOL HttpUpload(char* pszUploadUrl, BYTE* pUploadData, DWORD dwUploadDataSize)
{
	// 初始化变量中的内容
	char szScheme[MAX_PATH] = { 0 };
	char szHostName[MAX_PATH] = { 0 };
	char szUserName[MAX_PATH] = { 0 };
	char szPassword[MAX_PATH] = { 0 };
	char szUrlPath[MAX_PATH] = { 0 };
	char szExtraInfo[MAX_PATH] = { 0 };
	
	// 将长度填充到结构中
	RtlZeroMemory(szScheme, MAX_PATH);
	RtlZeroMemory(szHostName, MAX_PATH);
	RtlZeroMemory(szUserName, MAX_PATH);
	RtlZeroMemory(szPassword, MAX_PATH);
	RtlZeroMemory(szUrlPath, MAX_PATH);
	RtlZeroMemory(szExtraInfo, MAX_PATH);
	
	// 分解URL地址
	if (FALSE == UrlCrack(pszUploadUrl, szScheme, szHostName, szUserName, szPassword, szUrlPath, szExtraInfo, MAX_PATH))
	{
		return FALSE;
	}

	// 数据上传
	HINTERNET hInternet = NULL;
	HINTERNET hConnect = NULL;
	HINTERNET hRequest = NULL;
	DWORD dwOpenRequestFlags = 0;
	BOOL bRet = FALSE;
	DWORD dwRet = 0;
	unsigned char* pResponseHeaderIInfo = NULL;
	DWORD dwResponseHeaderIInfoSize = 2048;
	BYTE* pBuf = NULL;
	DWORD dwBufSize = 64 * 1024;
	BYTE* pResponseBodyData = NULL;
	DWORD dwResponseBodyDataSize = 0;
	DWORD dwOffset = 0;
	DWORD dwPostDataSize = dwUploadDataSize;
	INTERNET_BUFFERS internetBuffers = { 0 };

	do
	{
		// 建立会话
		hInternet = InternetOpen("WinInetPost/0.1", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
		if (NULL == hInternet)
		{
			break;
		}

		// 建立连接
		hConnect = InternetConnect(hInternet, szHostName, INTERNET_DEFAULT_HTTP_PORT, szUserName, szPassword, INTERNET_SERVICE_HTTP, 0, 0);
		if (NULL == hConnect)
		{
			break;
		}

		// 打开并发送HTTP请求
		dwOpenRequestFlags = INTERNET_FLAG_IGNORE_REDIRECT_TO_HTTP |
			INTERNET_FLAG_KEEP_CONNECTION |
			INTERNET_FLAG_NO_AUTH |
			INTERNET_FLAG_NO_COOKIES |
			INTERNET_FLAG_NO_UI |
			INTERNET_FLAG_RELOAD;
		if (0 < lstrlen(szExtraInfo))
		{
			lstrcat(szUrlPath, szExtraInfo);
		}

		// 使用POST请求
		hRequest = HttpOpenRequest(hConnect, "POST", szUrlPath, NULL, NULL, NULL, dwOpenRequestFlags, 0);
		if (NULL == hRequest)
		{
			break;
		}

		// 告诉服务器传输数据的总大小
		RtlZeroMemory(&internetBuffers, sizeof(internetBuffers));
		internetBuffers.dwStructSize = sizeof(internetBuffers);
		internetBuffers.dwBufferTotal = dwPostDataSize;

		bRet = HttpSendRequestEx(hRequest, &internetBuffers, NULL, 0, 0);
		if (FALSE == bRet)
		{
			break;
		}

		// 发送数据
		bRet = InternetWriteFile(hRequest, pUploadData, dwUploadDataSize, &dwRet);
		if (FALSE == bRet)
		{
			break;
		}

		// 发送完毕
		bRet = HttpEndRequest(hRequest, NULL, 0, 0);
		if (FALSE == bRet)
		{
			break;
		}

		// 接收响应报文
		pResponseHeaderIInfo = new unsigned char[dwResponseHeaderIInfoSize];
		if (NULL == pResponseHeaderIInfo)
		{
			break;
		}
		RtlZeroMemory(pResponseHeaderIInfo, dwResponseHeaderIInfoSize);
		bRet = HttpQueryInfo(hRequest, HTTP_QUERY_RAW_HEADERS_CRLF, pResponseHeaderIInfo, &dwResponseHeaderIInfoSize, NULL);
		if (FALSE == bRet)
		{
			break;
		}

		// 获取数据长度
		bRet = GetContentLength((char*)pResponseHeaderIInfo, &dwResponseBodyDataSize);
		if (FALSE == bRet)
		{
			break;
		}

		// 输出响应头
		std::cout << pResponseHeaderIInfo << std::endl;

		// 接收报文主体内容(Get Response Body)
		pBuf = new BYTE[dwBufSize];
		if (NULL == pBuf)
		{
			break;
		}
		pResponseBodyData = new BYTE[dwResponseBodyDataSize];
		if (NULL == pResponseBodyData)
		{
			break;
		}
		RtlZeroMemory(pResponseBodyData, dwResponseBodyDataSize);

		do
		{
			// 循环读取数据并填充到缓冲区内
			RtlZeroMemory(pBuf, dwBufSize);
			bRet = InternetReadFile(hRequest, pBuf, dwBufSize, &dwRet);
			if (FALSE == bRet)
			{
				break;
			}

			RtlCopyMemory((pResponseBodyData + dwOffset), pBuf, dwRet);
			dwOffset = dwOffset + dwRet;

		} while (dwResponseBodyDataSize > dwOffset);

	} while (FALSE);

	// 关闭释放
	if (NULL != pResponseBodyData)
	{
		delete[]pResponseBodyData;
		pResponseBodyData = NULL;
	}
	if (NULL != pBuf)
	{
		delete[]pBuf;
		pBuf = NULL;
	}
	if (NULL != pResponseHeaderIInfo)
	{
		delete[]pResponseHeaderIInfo;
		pResponseHeaderIInfo = NULL;
	}

	if (NULL != hRequest)
	{
		InternetCloseHandle(hRequest);
		hRequest = NULL;
	}
	if (NULL != hConnect)
	{
		InternetCloseHandle(hConnect);
		hConnect = NULL;
	}
	if (NULL != hInternet)
	{
		InternetCloseHandle(hInternet);
		hInternet = NULL;
	}

	return bRet;
}

```

上传代码通过指定`szHttpUploadUrl`将`d://lyshark.exe`文件提交到远程主机，代码如下所示；

```c
int main(int argc, char* argv[])
{
	// 设置上传接口地址
	char szHttpUploadUrl[] = "http://127.0.0.1/upload?file=lyshark.exe";

	// 被上传文件绝对路径
	char szHttpUploadFileName[] = "d://lyshark.exe";
	BYTE* pHttpUploadData = NULL;
	DWORD dwHttpUploadDataSize = 0;
	DWORD dwRet = 0;
	
	// 打开文件
	HANDLE hFile = CreateFile(szHttpUploadFileName, GENERIC_READ | GENERIC_WRITE,
		FILE_SHARE_READ | FILE_SHARE_WRITE, NULL, OPEN_EXISTING,
		FILE_ATTRIBUTE_ARCHIVE, NULL);

	// 获取文件大小
	dwHttpUploadDataSize = GetFileSize(hFile, NULL);
	
	// 读取文件数据
	pHttpUploadData = new BYTE[dwHttpUploadDataSize];
	ReadFile(hFile, pHttpUploadData, dwHttpUploadDataSize, &dwRet, NULL);
	dwHttpUploadDataSize = dwRet;
	
	// 上传数据
	if (FALSE == HttpUpload(szHttpUploadUrl, pHttpUploadData, dwHttpUploadDataSize))
	{
		return 0;
	}

	// 释放内存
	delete[]pHttpUploadData;
	pHttpUploadData = NULL;
	CloseHandle(hFile);

	system("pause");
	return 0;
}

```

运行后提交文件，则可以看到输出信息，如下图所示；





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240402222521327-17120679224924.png)