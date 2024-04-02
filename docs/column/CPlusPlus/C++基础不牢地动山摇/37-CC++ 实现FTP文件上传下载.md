# C/C++ 实现FTP文件上传下载

FTP（文件传输协议）是一种用于在网络上传输文件的标准协议。它属于因特网标准化的协议族之一，为文件的上传、下载和文件管理提供了一种标准化的方法，在Windows系统中操作FTP上传下载可以使用WinINet库，WinINet（Windows Internet）库是 Windows 操作系统中的一个网络 API 库，用于访问 Internet 上的资源。它提供了一组函数，使开发人员能够创建网络应用程序，例如通过 HTTP 协议下载文件，发送 HTTP 请求，处理 cookie 等，本章将通过使用WinInet所提供的接口实现FTP文件上传下载功能，使得用户可以通过代码的方式上传或下载文件与FTP服务器交互。



首先读者需要自行搭建FTP服务器，这里可以使用`20CN Mini Ftp`这款迷你FTP服务器，配置好信息之后运行即可；





接着来介绍实现FTP通信的标准API函数信息，其核心的函数如下所示；



`InternetOpen` 函数，用于初始化 WinINet 库，返回一个句柄，该句柄可用于后续的网络操作。以下是该函数的原型和简要说明：

```c
HINTERNET InternetOpen(
  LPCWSTR lpszAgent,  // 用户代理字符串，标识应用程序的名称
  DWORD   dwAccessType, // 访问类型，可以是 DIRECT、PRECONFIG 或 PROXY
  LPCWSTR lpszProxyName, // 代理服务器名称
  LPCWSTR lpszProxyBypass, // 代理服务器的绕过列表
  DWORD   dwFlags // 一些标志，例如INTERNET_FLAG_ASYNC（异步操作）
);

```

- `lpszAgent`: 用户代理字符串，用于标识应用程序的名称。可以是应用程序的名称或标识符。
- `dwAccessType`: 访问类型，指定应用程序的访问权限。可以是以下值之一：
  - `INTERNET_OPEN_TYPE_DIRECT`: 直接访问互联网。
  - `INTERNET_OPEN_TYPE_PRECONFIG`: 使用系统配置的代理。
  - `INTERNET_OPEN_TYPE_PROXY`: 使用指定的代理。
- `lpszProxyName`: 代理服务器的名称，仅在 `dwAccessType` 为 `INTERNET_OPEN_TYPE_PROXY` 时使用。
- `lpszProxyBypass`: 代理服务器的绕过列表，仅在 `dwAccessType` 为 `INTERNET_OPEN_TYPE_PROXY` 时使用。
- `dwFlags`: 一些标志，用于指定其他选项，例如 `INTERNET_FLAG_ASYNC` 表示执行异步操作。



该函数返回一个 HINTERNET 句柄，用于后续的网络操作。如果操作失败，返回 NULL。在使用完 HINTERNET 句柄后，应该使用 InternetCloseHandle 函数关闭该句柄。



InternetConnect 函数，用于创建一个与指定服务器的连接。以下是该函数的原型和简要说明：

```c
HINTERNET InternetConnect(
  HINTERNET     hInternet,       // InternetOpen 返回的句柄
  LPCWSTR       lpszServerName,  // 服务器的主机名
  INTERNET_PORT nServerPort,      // 服务器的端口号
  LPCWSTR       lpszUsername,    // 用户名
  LPCWSTR       lpszPassword,    // 密码
  DWORD         dwService,       // 服务类型，例如 INTERNET_SERVICE_HTTP
  DWORD         dwFlags,         // 一些标志，例如 INTERNET_FLAG_RELOAD
  DWORD_PTR     dwContext        // 应用程序定义的上下文
);

```

- `hInternet`: 由 `InternetOpen` 返回的句柄，表示与 WinINet 库的连接。
- `lpszServerName`: 服务器的主机名或 IP 地址。
- `nServerPort`: 服务器的端口号。
- `lpszUsername`: 连接需要的用户名。
- `lpszPassword`: 连接需要的密码。
- `dwService`: 服务类型，可以是以下值之一：
  - `INTERNET_SERVICE_FTP`: FTP 服务
  - `INTERNET_SERVICE_HTTP`: HTTP 服务
  - 其他服务类型，具体可查阅官方文档。
- `dwFlags`: 一些标志，例如 `INTERNET_FLAG_RELOAD` 表示重新加载页面。
- `dwContext`: 应用程序定义的上下文，可以是一个指针。



该函数返回一个 HINTERNET 句柄，用于后续的网络操作。如果操作失败，返回 NULL。在使用完 HINTERNET 句柄后，应该使用 InternetCloseHandle 函数关闭该句柄。



InternetWriteFile 函数，用于向已打开的互联网文件或句柄写入数据。以下是该函数的原型和简要说明：

```c
BOOL InternetWriteFile(
  HINTERNET hFile,           // 由 InternetOpenUrl 或 HttpOpenRequest 返回的文件句柄
  LPCVOID   lpBuffer,        // 指向包含要写入的数据的缓冲区的指针
  DWORD     dwNumberOfBytesToWrite,  // 要写入的字节数
  LPDWORD   lpdwNumberOfBytesWritten  // 指向接收实际写入的字节数的指针
);
```

- `hFile`: 由 `InternetOpenUrl` 或 `HttpOpenRequest` 返回的文件句柄。
- `lpBuffer`: 指向包含要写入的数据的缓冲区的指针。
- `dwNumberOfBytesToWrite`: 要写入的字节数。
- `lpdwNumberOfBytesWritten`: 指向接收实际写入的字节数的指针。

该函数返回一个布尔值，指示操作是否成功。如果成功，返回 `TRUE`，否则返回 `FALSE`。



`InternetReadFile` 函数，用于从已打开的互联网文件或句柄读取数据。以下是该函数的原型和简要说明：

```c
BOOL InternetReadFile(
  HINTERNET hFile,         // 由 InternetOpenUrl 或 HttpOpenRequest 返回的文件句柄
  LPVOID    lpBuffer,      // 指向接收数据的缓冲区的指针
  DWORD     dwNumberOfBytesToRead,  // 要读取的字节数
  LPDWORD   lpdwNumberOfBytesRead  // 指向接收实际读取的字节数的指针
);

```

- `hFile`: 由 `InternetOpenUrl` 或 `HttpOpenRequest` 返回的文件句柄。
- `lpBuffer`: 指向包含要写入的数据的缓冲区的指针。
- `dwNumberOfBytesToRead`: 要读取的字节数。
- `lpdwNumberOfBytesRead`: 指向接收实际读取的字节数的指针。

该函数返回一个布尔值，指示操作是否成功。如果成功，返回 `TRUE`，否则返回 `FALSE`。





## FTP文件下载

如下代码是使用 WinInet 库实现的 FTP 文件下载功能。以下是对该代码的概述：



- 1、头文件引入和库链接：
  - 代码使用了 `<Windows.h>` 和 `<WinInet.h>` 头文件，同时通过 `#pragma comment(lib, "WinInet.lib")` 链接了 WinInet 库，这是使用 WinInet 库的基本准备工作。

- 2、**`FtpSaveToFile` 函数**

  - 该函数用于将数据保存到本地文件。它通过调用 `CreateFile` 创建一个空文件，然后使用 `WriteFile` 将数据写入文件，最后关闭文件句柄。这个函数在 FTP 文件下载后保存文件到本地。

- 3 、**`FTPDownload` 函数**：

  - 这是主要的 FTP 下载函数。它使用 WinInet 提供的函数建立了一个 FTP 会话，连接到指定的 FTP 服务器，打开指定路径的文件，并通过循环调用 `InternetReadFile` 读取文件内容。

  - 下载的数据以字节数组的形式保存在 `pDownloadData` 中，下载完成后，调用 `FtpSaveToFile` 函数将数据保存到本地文件。

- 4、**注意事项**：

  - 代码中使用了 `RtlZeroMemory` 函数清空内存，确保数据缓冲区的正确初始化。
  - 注意释放动态分配的内存，避免内存泄漏。

- 5、**函数参数**：

  - 函数参数包括 FTP 服务器的主机名 (`szHostName`)、用户名 (`szUserName`)、密码 (`szPassword`)、FTP 路径 (`szUrlPath`)，以及本地保存路径 (`SavePath`)。



总体而言，这段代码实现了基本的 FTP 文件下载功能，适用于从 FTP 服务器下载文件到本地。在使用时，确保提供正确的 FTP 服务器信息和路径，以及合适的本地保存路径。

```c
#include <iostream>
#include <Windows.h>
#include <WinInet.h>

#pragma comment(lib, "WinInet.lib")

// 实现文件上传操作
BOOL FTPUpload(char *szHostName, char *szUserName, char *szPassword, char *szUrlPath, char *FilePath)
{
  HINTERNET hInternet, hConnect, hFTPFile = NULL;
  DWORD dwBytesReturn = 0;
  DWORD UploadDataSize = 0;
  BYTE *pUploadData = NULL;
  DWORD dwRet, bRet = 0;

  // 建立会话并打开FTP操作
  hInternet = InternetOpen("WinInet Ftp", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
  hConnect = InternetConnect(hInternet, szHostName, INTERNET_INVALID_PORT_NUMBER, szUserName, szPassword, 
    INTERNET_SERVICE_FTP, INTERNET_FLAG_PASSIVE, 0);
  hFTPFile = FtpOpenFile(hConnect, szUrlPath, GENERIC_WRITE, FTP_TRANSFER_TYPE_BINARY | INTERNET_FLAG_RELOAD, NULL);

  // 打开文件
  HANDLE hFile = CreateFile(FilePath, GENERIC_READ | GENERIC_WRITE,FILE_SHARE_READ | 
    FILE_SHARE_WRITE, NULL, OPEN_EXISTING,FILE_ATTRIBUTE_ARCHIVE, NULL);
  if (INVALID_HANDLE_VALUE == hFile)
    return FALSE;

  // 获取文件大小
  UploadDataSize = GetFileSize(hFile, NULL);
  pUploadData = new BYTE[UploadDataSize];
  // 读取文件到缓冲区
  ReadFile(hFile, pUploadData, UploadDataSize, &dwRet, NULL);
  UploadDataSize = dwRet;

  // 开始上传数据
  bRet = InternetWriteFile(hFTPFile, pUploadData, UploadDataSize, &dwBytesReturn);
  if (FALSE == bRet)
  {
    delete[]pUploadData;
    return FALSE;
  }
  delete[]pUploadData;
  return TRUE;
}

```

调用`FTPDownload`时分别传入参数，参数1是IP地址，参数2是FTP登录用户名，参数3是FTP登录密码，参数4是服务器端根目录下的文件，参数5是下载文件到本地的路径，函数执行结束后返回一个BOOL状态值。

```c
int main(int argc, char * argv[])
{
	BOOL bRET = FTPDownload("127.0.0.1", "admin", "admin", "/lyshark.jpg", "d://newtest/lyshark.jpg");
	if (bRET == TRUE)
	{
		printf("已下载文件 \n");
	}
	else
	{
		printf("下载失败 \n");
	}

	system("pause");
	return 0;
}

```

运行后则可以将服务器端上的`/lyshark.jpg`下载到本地的`d://newtest/lyshark.jpg`目录下，如下图所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240402215511391.png)

#### FTP文件上传

如下代码使用 WinInet 库实现了 FTP 文件上传操作。以下是对该代码的概述：

- **1、函数功能**：
  - 该代码实现了 FTP 文件上传操作，将本地文件上传到指定的 FTP 服务器路径。

- **2、函数参数**：
  - 函数参数包括 FTP 服务器的主机名 (`szHostName`)、用户名 (`szUserName`)、密码 (`szPassword`)、FTP 路径 (`szUrlPath`)，以及本地文件路径 (`FilePath`)。
- **3、建立会话和连接**：
  - 使用 `InternetOpen` 函数建立一个 WinInet 会话，然后使用 `InternetConnect` 函数建立到 FTP 服务器的连接。
- **4、打开 FTP 文件**：
  - 使用 `FtpOpenFile` 函数打开指定路径的 FTP 文件。如果文件不存在，将创建一个新文件。文件以二进制传输方式打开，并且具有重新加载标志。
- **5、打开本地文件**：
  - 使用 `CreateFile` 函数打开本地文件。如果本地文件不存在，将返回 `INVALID_HANDLE_VALUE`。
- **6、获取文件大小和读取文件数据**：
  - 通过 `GetFileSize` 获取本地文件大小，然后根据文件大小动态分配内存，并使用 `ReadFile` 读取文件数据到内存中。
- **7、上传数据**：
  - 使用 `InternetWriteFile` 函数将内存中的文件数据上传到 FTP 服务器。上传成功后释放内存，上传失败则返回 FALSE。
- **8、注意事项**：
  - 确保提供正确的 FTP 服务器信息和路径，以及本地文件路径。
  - 释放动态分配的内存，避免内存泄漏。
  - 处理上传失败的情况，可能需要添加适当的错误处理代码。

总体而言，这段代码实现了基本的 FTP 文件上传功能，适用于将本地文件上传到 FTP 服务器。在使用时，注意提供正确的参数和处理可能出现的错误。

```c
#include <iostream>
#include <Windows.h>
#include <WinInet.h>

#pragma comment(lib, "WinInet.lib")

// 实现文件上传操作
BOOL FTPUpload(char *szHostName, char *szUserName, char *szPassword, char *szUrlPath, char *FilePath)
{
  HINTERNET hInternet, hConnect, hFTPFile = NULL;
  DWORD dwBytesReturn = 0;
  DWORD UploadDataSize = 0;
  BYTE *pUploadData = NULL;
  DWORD dwRet, bRet = 0;

  // 建立会话并打开FTP操作
  hInternet = InternetOpen("WinInet Ftp", INTERNET_OPEN_TYPE_PRECONFIG, NULL, NULL, 0);
  hConnect = InternetConnect(hInternet, szHostName, INTERNET_INVALID_PORT_NUMBER, szUserName, szPassword, 
    INTERNET_SERVICE_FTP, INTERNET_FLAG_PASSIVE, 0);
  hFTPFile = FtpOpenFile(hConnect, szUrlPath, GENERIC_WRITE, FTP_TRANSFER_TYPE_BINARY | INTERNET_FLAG_RELOAD, NULL);

  // 打开文件
  HANDLE hFile = CreateFile(FilePath, GENERIC_READ | GENERIC_WRITE,FILE_SHARE_READ | 
    FILE_SHARE_WRITE, NULL, OPEN_EXISTING,FILE_ATTRIBUTE_ARCHIVE, NULL);
  if (INVALID_HANDLE_VALUE == hFile)
    return FALSE;

  // 获取文件大小
  UploadDataSize = GetFileSize(hFile, NULL);
  pUploadData = new BYTE[UploadDataSize];
  // 读取文件到缓冲区
  ReadFile(hFile, pUploadData, UploadDataSize, &dwRet, NULL);
  UploadDataSize = dwRet;

  // 开始上传数据
  bRet = InternetWriteFile(hFTPFile, pUploadData, UploadDataSize, &dwBytesReturn);
  if (FALSE == bRet)
  {
    delete[]pUploadData;
    return FALSE;
  }
  delete[]pUploadData;
  return TRUE;
}

```

文件上传与下载一样，`FTPUpload`通过传入服务器地址，用户名，密码，上传后的文件名，被上传本地文件路径；

```c
int main(int argc, char * argv[])
{
	BOOL bRET = FTPUpload("127.0.0.1", "admin", "admin", "/abc.exe", "c://nc.exe");
	if (bRET == TRUE)
	{
		printf("已上传文件 \n");
	}
	else
	{
		printf("上传失败 \n");
	}

	system("pause");
	return 0;
}

```

上传成功后输出如下图所示；







![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240402220025246-17120664264091.png)
