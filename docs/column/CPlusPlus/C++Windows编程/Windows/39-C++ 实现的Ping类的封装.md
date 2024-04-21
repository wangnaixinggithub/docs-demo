# C++ 实现的Ping类的封装

Ping 使用 Internet 控制消息协议（ICMP）来测试主机之间的连接。当用户发送一个 ping 请求时，则对应的发送一个 ICMP Echo 请求消息到目标主机，并等待目标主机回复一个 ICMP Echo 回应消息。如果目标主机接收到请求并且网络连接正常，则会返回一个回应消息，表示主机之间的网络连接是正常的。如果目标主机没有收到请求消息或网络连接不正常，则不会有回应消息返回。



**编译报错问题解决**

在`Windows`环境下编程不可避免的会用到`windows.h`和`winsock.h`头文件，在默认情况下`windows.h`头文件会包含`winsock.h`，此时当尝试包含`winsock.h`时就会出现头文件定义冲突的情况。解决这个冲突的方式有两种，第一种，在头部定义`#define WIN32_LEAN_AND_MEAN`来主动去除`winsock.h`头文件包含。第二种是将`#include <winsock2.h>`头文件，放在`#include<windows.h>`之前。两种方式均可，这些方法在进行`Windows`套接字编程时非常重要，可以防止头文件冲突，确保编译顺利进行。

### Ping头文件

如下头文件代码定义了几个结构体，用于表示IP协议头、ICMP协议头和Ping的回复信息。这些结构体主要用于网络编程中，解析和构建网络数据包。

```c
#pragma once
#include <winsock2.h>
#pragma comment(lib, "WS2_32")

#define DEF_PACKET_SIZE 32
#define ECHO_REQUEST 8
#define ECHO_REPLY 0

struct IPHeader
{
  BYTE m_byVerHLen;           // 4位版本+4位首部长度
  BYTE m_byTOS;               // 服务类型
  USHORT m_usTotalLen;        // 总长度
  USHORT m_usID;              // 标识
  USHORT m_usFlagFragOffset;  // 3位标志+13位片偏移
  BYTE m_byTTL;               // TTL
  BYTE m_byProtocol;          // 协议
  USHORT m_usHChecksum;       // 首部检验和
  ULONG m_ulSrcIP;            // 源IP地址
  ULONG m_ulDestIP;           // 目的IP地址
};

struct ICMPHeader
{
  BYTE m_byType;            // 类型
  BYTE m_byCode;            // 代码
  USHORT m_usChecksum;      // 检验和 
  USHORT m_usID;            // 标识符
  USHORT m_usSeq;           // 序号
  ULONG m_ulTimeStamp;      // 时间戳（非标准ICMP头部）
};

struct PingReply
{
  USHORT m_usSeq;            // 来源IP
  DWORD m_dwRoundTripTime;   // 时间戳
  DWORD m_dwBytes;           // 返回长度
  DWORD m_dwTTL;             // TTL值
};

class CPing
{
public:
  CPing(); // 构造函数
  ~CPing(); // 析构函数

  // 执行 Ping 操作的方法，传入目标 IP 地址或域名、PingReply 结构体和超时时间
  BOOL Ping(DWORD dwDestIP, PingReply *pPingReply = NULL, DWORD dwTimeout = 2000);
  BOOL Ping(char *szDestIP, PingReply *pPingReply = NULL, DWORD dwTimeout = 2000);

private:
  // Ping 核心方法，传入目标 IP 地址、PingReply 结构体和超时时间
  BOOL PingCore(DWORD dwDestIP, PingReply *pPingReply, DWORD dwTimeout);

  // 计算检验和的方法，传入缓冲区和大小
  USHORT CalCheckSum(USHORT *pBuffer, int nSize);

  // 获取时钟计时器的校准值
  ULONG GetTickCountCalibrate();

private:
  SOCKET m_sockRaw;        // 原始套接字
  WSAEVENT m_event;        // WSA 事件
  USHORT m_usCurrentProcID; // 当前进程 ID
  char *m_szICMPData;      // ICMP 数据
  BOOL m_bIsInitSucc;      // 初始化是否成功

private:
  static USHORT s_usPacketSeq; // 静态变量，用于记录 ICMP 包的序列号
};
```

下面是对每个结构体成员的简要说明：

1. IPHeader 结构体：
   - `m_byVerHLen`: 4位版本号 + 4位首部长度。
   - `m_byTOS`: 服务类型。
   - `m_usTotalLen`: 总长度。
   - `m_usID`: 标识。
   - `m_usFlagFragOffset`: 3位标志 + 13位片偏移。
   - `m_byTTL`: 生存时间。
   - `m_byProtocol`: 协议类型。
   - `m_usHChecksum`: 首部检验和。
   - `m_ulSrcIP`: 源IP地址。
   - `m_ulDestIP`: 目的IP地址。
2. ICMPHeader 结构体：
   - `m_byType`: ICMP类型。
   - `m_byCode`: ICMP代码。
   - `m_usChecksum`: 检验和。
   - `m_usID`: 标识符。
   - `m_usSeq`: 序号。
   - `m_ulTimeStamp`: 时间戳（非标准ICMP头部）。
3. PingReply 结构体：
   - `m_usSeq`: 序列号。
   - `m_dwRoundTripTime`: 往返时间。
   - `m_dwBytes`: 返回长度。
   - `m_dwTTL`: TTL值。

这些结构体主要用于在网络编程中处理与IP、ICMP和Ping相关的数据包。在实际应用中，可以使用这些结构体来解析接收到的网络数据包，或者构建要发送的数据包。

**类成员说明：**

- `m_sockRaw`: 用于发送原始套接字的成员变量。
- `m_event`: WSA 事件。
- `m_usCurrentProcID`: 当前进程 ID。
- `m_szICMPData`: ICMP 数据。
- `m_bIsInitSucc`: 初始化是否成功的标志。
- `s_usPacketSeq`: 静态变量，用于记录 ICMP 包的序列号。

**类方法说明：**

- `Ping`: 执行 Ping 操作的方法，可以传入目标 IP 地址或域名、PingReply 结构体和超时时间。
- `PingCore`: Ping 核心方法，用于发送 ICMP 数据包，计算往返时间等。
- `CalCheckSum`: 计算检验和的方法。
- `GetTickCountCalibrate`: 获取时钟计时器的校准值。

### MyPing实现

#### 1. CPing 构造函数和析构函数

```c
CPing::CPing() : m_szICMPData(NULL), m_bIsInitSucc(FALSE)
{
  // ...（省略其他初始化代码）

  m_szICMPData = (char*)malloc(DEF_PACKET_SIZE + sizeof(ICMPHeader));

  if (m_szICMPData == NULL)
  {
    m_bIsInitSucc = FALSE;
  }
}

CPing::~CPing()
{
  WSACleanup();

  if (NULL != m_szICMPData)
  {
    free(m_szICMPData);
    m_szICMPData = NULL;
  }
}
```

构造函数中，首先进行 Winsock 初始化，创建原始套接字，并分配内存用于存储 ICMP 数据。如果分配内存失败，则初始化标志 `m_bIsInitSucc` 置为 `FALSE`。析构函数负责清理 Winsock 资源和释放内存。

#### 2. PingCore 函数

```c
BOOL CPing::PingCore(DWORD dwDestIP, PingReply *pPingReply, DWORD dwTimeout)
{
  // ...（省略其他代码）

  if (!m_bIsInitSucc)
  {
    return FALSE;
  }

  // ...（省略其他代码）

  if (sendto(m_sockRaw, m_szICMPData, nICMPDataSize, 0, (struct sockaddr*)&sockaddrDest, nSockaddrDestSize) == SOCKET_ERROR)
  {
    return FALSE;
  }

  // ...（省略其他代码）

  char recvbuf[256] = { "\0" };
  while (TRUE)
  {
    // ...（省略其他代码）

    if (WSAWaitForMultipleEvents(1, &m_event, FALSE, 100, FALSE) != WSA_WAIT_TIMEOUT)
    {
      WSANETWORKEVENTS netEvent;
      WSAEnumNetworkEvents(m_sockRaw, m_event, &netEvent);

      if (netEvent.lNetworkEvents & FD_READ)
      {
        // ...（省略其他代码）

        if (nPacketSize != SOCKET_ERROR)
        {
          IPHeader *pIPHeader = (IPHeader*)recvbuf;
          USHORT usIPHeaderLen = (USHORT)((pIPHeader->m_byVerHLen & 0x0f) * 4);
          ICMPHeader *pICMPHeader = (ICMPHeader*)(recvbuf + usIPHeaderLen);

          if (pICMPHeader->m_usID == m_usCurrentProcID && pICMPHeader->m_byType == ECHO_REPLY && pICMPHeader->m_usSeq == usSeq)
          {
            // ...（省略其他代码）

            return TRUE;
          }
        }
      }
    }
    // ...（省略其他代码）

    if (GetTickCountCalibrate() - ulSendTimestamp >= dwTimeout)
    {
      return FALSE;
    }
  }
}
```

`PingCore` 函数是 Ping 工具的核心部分，负责构建 ICMP 报文、发送报文、接收响应报文，并进行超时处理。通过循环等待接收事件，实时检测是否有 ICMP 响应报文到达。在接收到响应后，判断响应是否符合预期条件，如果符合则填充 `pPingReply` 结构体，并返回 `TRUE`。

#### 3. CalCheckSum 函数

```c
USHORT CPing::CalCheckSum(USHORT *pBuffer, int nSize)
{
  unsigned long ulCheckSum = 0;
  while (nSize > 1)
  {
    ulCheckSum += *pBuffer++;
    nSize -= sizeof(USHORT);
  }
  if (nSize)
  {
    ulCheckSum += *(UCHAR*)pBuffer;
  }

  ulCheckSum = (ulCheckSum >> 16) + (ulCheckSum & 0xffff);
  ulCheckSum += (ulCheckSum >> 16);

  return (USHORT)(~ulCheckSum);
}
```

`CalCheckSum` 函数用于计算 ICMP 报文的校验和。校验和的计算采用了累加和的方法，最后对累加和进行溢出处理。计算完成后，返回取反后的校验和。

#### 4. GetTickCountCalibrate 函数

```c
ULONG CPing::GetTickCountCalibrate()
{
  // ...（省略其他代码）

  return s_ulFirstCallTick + (ULONG)(llCurrentTimeMS - s_ullFirstCallTickMS);
}
```

`GetTickCountCalibrate` 函数用于获取经过调校的系统时间。通过计算系统时间相对于 Ping 工具启动时的时间差，实现对系统时间的校准。这样做是为了处理系统时间溢出的情况。

#### 5. Ping 函数

```c
BOOL CPing::Ping(DWORD dwDestIP, PingReply *pPingReply, DWORD dwTimeout)
{
  return PingCore(dwDestIP, pPingReply, dwTimeout);
}

BOOL CPing::Ping(char *szDestIP, PingReply *pPingReply, DWORD dwTimeout)
{
  if (NULL != szDestIP)
  {
    return PingCore(inet_addr(szDestIP), pPingReply, dwTimeout);
  }
  return FALSE;
}
```

`Ping` 函数是对 `PingCore` 函数的封装，根据目标 IP 地址调用 `PingCore` 进行 Ping

最后的`MyPing.cpp`完整实现如下所示；

```c
#include "MyPing.h"

USHORT CPing::s_usPacketSeq = 0;

// 构造函数
CPing::CPing() :m_szICMPData(NULL), m_bIsInitSucc(FALSE)
{
  WSADATA WSAData;
  
  if (WSAStartup(MAKEWORD(1, 1), &WSAData) != 0)
  {
    // 如果初始化不成功则返回
    return;
  }
  m_event = WSACreateEvent();
  m_usCurrentProcID = (USHORT)GetCurrentProcessId();
  m_sockRaw = WSASocket(AF_INET, SOCK_RAW, IPPROTO_ICMP, NULL, 0, 0);
  if (m_sockRaw == INVALID_SOCKET)
  {
    // 10013 以一种访问权限不允许的方式做了一个访问套接字的尝试
    return;
  }
  else
  {
    WSAEventSelect(m_sockRaw, m_event, FD_READ);
    m_bIsInitSucc = TRUE;

    m_szICMPData = (char*)malloc(DEF_PACKET_SIZE + sizeof(ICMPHeader));

    if (m_szICMPData == NULL)
    {
      m_bIsInitSucc = FALSE;
    }
  }
}

// 析构函数
CPing::~CPing()
{
  WSACleanup();

  if (NULL != m_szICMPData)
  {
    free(m_szICMPData);
    m_szICMPData = NULL;
  }
}

// Ping 方法，传入目标 IP 地址或域名、PingReply 结构体和超时时间
BOOL CPing::Ping(DWORD dwDestIP, PingReply *pPingReply, DWORD dwTimeout)
{
  return PingCore(dwDestIP, pPingReply, dwTimeout);
}

// Ping 方法，传入目标 IP 地址或域名、PingReply 结构体和超时时间
BOOL CPing::Ping(char *szDestIP, PingReply *pPingReply, DWORD dwTimeout)
{
  if (NULL != szDestIP)
  {
    return PingCore(inet_addr(szDestIP), pPingReply, dwTimeout);
  }
  return FALSE;
}

// Ping 核心方法，传入目标 IP 地址、PingReply 结构体和超时时间
BOOL CPing::PingCore(DWORD dwDestIP, PingReply *pPingReply, DWORD dwTimeout)
{
  // 判断初始化是否成功
  if (!m_bIsInitSucc)
  {
    return FALSE;
  }

  // 配置 SOCKET
  sockaddr_in sockaddrDest;
  sockaddrDest.sin_family = AF_INET;
  sockaddrDest.sin_addr.s_addr = dwDestIP;
  int nSockaddrDestSize = sizeof(sockaddrDest);

  // 构建 ICMP 包
  int nICMPDataSize = DEF_PACKET_SIZE + sizeof(ICMPHeader);
  ULONG ulSendTimestamp = GetTickCountCalibrate();
  USHORT usSeq = ++s_usPacketSeq;
  memset(m_szICMPData, 0, nICMPDataSize);
  ICMPHeader *pICMPHeader = (ICMPHeader*)m_szICMPData;
  pICMPHeader->m_byType = ECHO_REQUEST;
  pICMPHeader->m_byCode = 0;
  pICMPHeader->m_usID = m_usCurrentProcID;
  pICMPHeader->m_usSeq = usSeq;
  pICMPHeader->m_ulTimeStamp = ulSendTimestamp;
  pICMPHeader->m_usChecksum = CalCheckSum((USHORT*)m_szICMPData, nICMPDataSize);

  // 发送 ICMP 报文
  if (sendto(m_sockRaw, m_szICMPData, nICMPDataSize, 0, (struct sockaddr*)&sockaddrDest, nSockaddrDestSize) == SOCKET_ERROR)
  {
    return FALSE;
  }

  // 判断是否需要接收相应报文
  if (pPingReply == NULL)
  {
    return TRUE;
  }

  char recvbuf[256] = { "\0" };
  while (TRUE)
  {
    // 接收响应报文
    if (WSAWaitForMultipleEvents(1, &m_event, FALSE, 100, FALSE) != WSA_WAIT_TIMEOUT)
    {
      WSANETWORKEVENTS netEvent;
      WSAEnumNetworkEvents(m_sockRaw, m_event, &netEvent);

      if (netEvent.lNetworkEvents & FD_READ)
      {
        ULONG nRecvTimestamp = GetTickCountCalibrate();
        int nPacketSize = recvfrom(m_sockRaw, recvbuf, 256, 0, (struct sockaddr*)&sockaddrDest, &nSockaddrDestSize);
        if (nPacketSize != SOCKET_ERROR)
        {
          IPHeader *pIPHeader = (IPHeader*)recvbuf;
          USHORT usIPHeaderLen = (USHORT)((pIPHeader->m_byVerHLen & 0x0f) * 4);
          ICMPHeader *pICMPHeader = (ICMPHeader*)(recvbuf + usIPHeaderLen);

          if (pICMPHeader->m_usID == m_usCurrentProcID    // 是当前进程发出的报文
            && pICMPHeader->m_byType == ECHO_REPLY      // 是 ICMP 响应报文
            && pICMPHeader->m_usSeq == usSeq            // 是本次请求报文的响应报文
            )
          {
            pPingReply->m_usSeq = usSeq;
            pPingReply->m_dwRoundTripTime = nRecvTimestamp - pICMPHeader->m_ulTimeStamp;
            pPingReply->m_dwBytes = nPacketSize - usIPHeaderLen - sizeof(ICMPHeader);
            pPingReply->m_dwTTL = pIPHeader->m_byTTL;
            return TRUE;
          }
        }
      }
    }
    // 超时
    if (GetTickCountCalibrate() - ulSendTimestamp >= dwTimeout)
    {
      return FALSE;
    }
  }
}

// 计算检验和的方法
USHORT CPing::CalCheckSum(USHORT *pBuffer, int nSize)
{
  unsigned long ulCheckSum = 0;
  while (nSize > 1)
  {
    ulCheckSum += *pBuffer++;
    nSize -= sizeof(USHORT);
  }
  if (nSize)
  {
    ulCheckSum += *(UCHAR*)pBuffer;
  }

  ulCheckSum = (ulCheckSum >> 16) + (ulCheckSum & 0xffff);
  ulCheckSum += (ulCheckSum >> 16);

  return (USHORT)(~ulCheckSum);
}

// 获取时钟计时器的校准值
ULONG CPing::GetTickCountCalibrate()
{
  static ULONG s_ulFirstCallTick = 0;
  static LONGLONG s_ullFirstCallTickMS = 0;

  SYSTEMTIME systemtime;
  FILETIME filetime;
  GetLocalTime(&systemtime);
  SystemTimeToFileTime(&systemtime, &filetime);
  LARGE_INTEGER liCurrentTime;
  liCurrentTime.HighPart = filetime.dwHighDateTime;
  liCurrentTime.LowPart = filetime.dwLowDateTime;
  LONGLONG llCurrentTimeMS = liCurrentTime.QuadPart / 10000;

  if (s_ulFirstCallTick == 0)
  {
    s_ulFirstCallTick = GetTickCount();
  }
  if (s_ullFirstCallTickMS == 0)
  {
    s_ullFirstCallTickMS = llCurrentTimeMS;
  }

  return s_ulFirstCallTick + (ULONG)(llCurrentTimeMS - s_ullFirstCallTickMS);
}
```

### 如何使用

在主程序中直接引入头文件`MyPing.h`，并在`main()`函数中直接调用`CPing`类即可实现探测主机是否存活。

**探测主机是否存活**

```c
#include "MyPing.h"
#include <iostream>

// 探测主机是否存活
bool TestPing(char *szIP)
{
	CPing objPing;
	PingReply reply;

	objPing.Ping(szIP, &reply);

	if (reply.m_dwTTL >= 10 && reply.m_dwTTL <= 255)
	{
		return true;
	}
	return false;
}

int main(int argc, char *argv[])
{
	bool is_open = TestPing("202.89.233.100");
	std::cout << "本机是否存活: " << is_open << std::endl;

	system("pause");
	return 0;
}
```

运行效果如下所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/a086d2e4a4a2c66ed2566e3d6903fb47%5B1%5D.png)



**模拟系统Ping测试**

```c
#include "MyPing.h"
#include <iostream>

// 模拟系统Ping测试
void SystemPing(char *szIP, int szCount)
{
	CPing objPing;
	PingReply reply;
	for (int x = 0; x < szCount; x++)
	{
		objPing.Ping(szIP, &reply);

		std::cout << "探测主机: " << szIP << " 默认字节: " << DEF_PACKET_SIZE << " 发送长度: " << reply.m_dwBytes << " 时间: " << reply.m_dwRoundTripTime << " TTL: " << reply.m_dwTTL << std::endl;
		Sleep(1000);
	}
}

int main(int argc, char *argv[])
{
	SystemPing("202.89.233.100", 5);

	system("pause");
	return 0;
}
```

运行效果如下所示；



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/3b12b5cbdbcf5a7947a1c8ed82db3257%5B1%5D.png)