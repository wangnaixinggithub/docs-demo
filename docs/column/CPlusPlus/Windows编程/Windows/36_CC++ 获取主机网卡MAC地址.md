# 获取主机网卡MAC地址

## 什么是MAC地址？

MAC地址（Media Access Control address），又称为[物理地址](https://so.csdn.net/so/search?q=物理地址&spm=1001.2101.3001.7020)或硬件地址，是网络适配器（网卡）在制造时被分配的全球唯一的48位地址。这个地址是数据链路层（OSI模型的第二层）的一部分，用于在局域网（LAN）中唯一标识网络设备。

获取网卡地址主要用于网络标识和身份验证的目的。MAC地址是一个唯一的硬件地址，通常由网卡的制造商在制造过程中分配。

通过获取MAC地址可以判断当前主机的唯一性可以与IP地址绑定并实现网络准入控制。



在Windows平台下获取MAC地址的方式有很多，获取MAC地址的常见方式包括使用操作系统提供的网络API（如Windows的`::GetAdaptersAddresses()`和`::GetAdaptersInfo()`，`NetBIOS API`，系统命令（如ipconfig /all），ARP缓存表查询，第三方库（如WinPcap或Libpcap），以及在编程语言中使用网络库。









**GetAdaptersInfo** 函数检索本地计算机的适配器信息。

:::details `GetAdaptersInfo 函数说明`

我们可以通过检索本地适配器信息，来获取到mac地址。

```c

/// <summary>
/// 检索本地网络适配器信息
/// </summary>
/// <param name="AdapterInfo">out,指向接收IP_ADAPTER_INFO结构链接列表的缓冲区 的 指针</param>
/// <param name="SizePointer">指向 ULONG 变量的指针，该变量指定 pAdapterInfo 参数指向的缓冲区的大小。</param>
/// <returns></returns>
ULONG GetAdaptersInfo(PIP_ADAPTER_INFO AdapterInfo, PULONG SizePointer)
```

我们在windos中，可以通过输入`管理网络适配器`关键字，来看到这些本地网络适配器得信息。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240613233631611.png)

:::



:::details `GetAdaptersInfo  示例`

```c
#include <iostream>
#include <winsock2.h>
#include <iphlpapi.h>
#include <string>
#include<strsafe.h>
#pragma comment(lib, "Netapi32.lib")
#pragma comment(lib, "IPHLPAPI.lib")
using namespace std;
bool GetMacByGetAdaptersInfo()
{
	bool bRet = false;
	PIP_ADAPTER_INFO pAdapterInfo = NULL;//指向适配器信息内存块的指针
	ULONG ulOutBufLen = sizeof(IP_ADAPTER_INFO); //适配器信息内存块大小
	//分配适配器信息空间
	if (::GetAdaptersInfo(pAdapterInfo, &ulOutBufLen) == ERROR_BUFFER_OVERFLOW)
	{
		delete[] pAdapterInfo;
		pAdapterInfo = (PIP_ADAPTER_INFO) new IP_ADAPTER_INFO[ulOutBufLen];
		if (pAdapterInfo == NULL)
		{
			return false;
		}
	}
	//
	if (::GetAdaptersInfo(pAdapterInfo, &ulOutBufLen) == NO_ERROR)
	{
		//遍历返回的适配器信息内存块，找到第一个物理地址长度为6的适配器信息，并将MAC地址格式化字符串的形式存到输出变量中。
		PIP_ADAPTER_INFO itFn = pAdapterInfo;
		char szBuf[45] = {0};
		while (itFn)
		{
			
			std::cout << "ComboIndex:\t" << itFn->ComboIndex << "\n";
			std::cout << "适配器名称:\t" << itFn->AdapterName << "\n";
			std::cout << "适配器描述:\t " << itFn->Description << "\n";
			std::cout << "适配器(Mac)地址:\t";
			for (size_t i = 0; i < pAdapterInfo->AddressLength; i++)
			{
				if(i == pAdapterInfo->AddressLength -1)
				{
					printf("%.2X\n", (int)itFn->Address[i]);
				}
				else
				{
					printf("%.2X-", (int)itFn->Address[i]);
				}
			}
			std::cout << "Index:\t" << itFn->Index << "\n";
			std::cout << "Type:\t";
			switch (itFn->Type)
			{
			case MIB_IF_TYPE_OTHER:
				printf("Other\n");
				break;
			case MIB_IF_TYPE_ETHERNET:
				printf("Ethernet\n");
				break;
			case MIB_IF_TYPE_TOKENRING:
				printf("Token Ring\n");
				break;
			case MIB_IF_TYPE_FDDI:
				printf("FDDI\n");
				break;
			case MIB_IF_TYPE_PPP:
				printf("PPP\n");
				break;
			case MIB_IF_TYPE_LOOPBACK:
				printf("Loopback\n");
				break;
			case MIB_IF_TYPE_SLIP:
				printf("Slip\n");
				break;
			default:
				printf("Unknown type %ld\n", itFn->Type);
				break;
			}

			std::cout << "IP地址:\t" << itFn->IpAddressList.IpAddress.String << "\n";
			std::cout << "IP 掩码:\t" << itFn->IpAddressList.IpMask.String << "\n";
			std::cout << "网关:\t" << itFn->GatewayList.IpAddress.String << "\n";


			if (itFn->DhcpEnabled)
			{
				std::cout << "DHCP Enabled Yes:\n";
				std::cout << "DHCP Server: \t" << itFn->DhcpServer.IpAddress.String;
				
				errno_t error;
				struct tm newtime;
				char buffer[32];

				printf("\t  Lease Obtained: ");
				error = _localtime32_s(&newtime, (__time32_t*)&itFn->LeaseObtained);
				if (error)
				{
					printf("Invalid Argument to _localtime32_s\n");
				}
				else 
				{
					// Convert to an ASCII representation 
					error = asctime_s(buffer, 32, &newtime);
					if (error)
					{
						printf("Invalid Argument to asctime_s\n");
					}
					else
					{
						printf("%s", buffer);
					}
				}
			}
			else
			{
				std::cout << "DHCP Enabled: No\n";
			}

			if (itFn->HaveWins) 
			{
				printf("\tHave Wins: Yes\n");
				printf("\t  Primary Wins Server:    %s\n", itFn->PrimaryWinsServer.IpAddress.String);
				printf("\t  Secondary Wins Server:  %s\n",itFn->SecondaryWinsServer.IpAddress.String);
			}
			else
			{
				printf("\tHave Wins: No\n");
			}


			itFn = itFn->Next;
			printf("\n");
		}
	}

	if (pAdapterInfo)
	{
		delete[] pAdapterInfo; pAdapterInfo = NULL;
	}
	return bRet;
}
int main(int argc, char* argv[])
{
	GetMacByGetAdaptersInfo();
	return 0;
}


```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240613233808438.png)

:::



:::details `基于Netbios 获取Mac地址`

```c
#include <iostream>
#include <winsock2.h>
#include <iphlpapi.h>
#include <string>
#pragma comment(lib, "Netapi32.lib")
#pragma comment(lib, "IPHLPAPI.lib")
using namespace std;

bool GetAdapterInfo(int adapterNum, std::string& macOUT)
{
	NCB Ncb;
	memset(&Ncb, 0, sizeof(Ncb));

	// 重置网卡 以便我们可以查询
	Ncb.ncb_command = NCBRESET;
	Ncb.ncb_lana_num = adapterNum;
	if (Netbios(&Ncb) != NRC_GOODRET)
	{
		return false;
	}
	// 准备取得接口卡的状态块
	memset(&Ncb, sizeof(Ncb), 0);
	Ncb.ncb_command = NCBASTAT;
	Ncb.ncb_lana_num = adapterNum;
	strcpy_s((char*)Ncb.ncb_callname, sizeof Ncb.ncb_callname, "*");
	struct ASTAT
	{
		ADAPTER_STATUS adapt;
		NAME_BUFFER nameBuff[30];
	}adapter;

	memset(&adapter, sizeof(adapter), 0);
	Ncb.ncb_buffer = (unsigned char*)&adapter;
	Ncb.ncb_length = sizeof(adapter);
	if (Netbios(&Ncb) != 0)
	{
		return false;
	}
	char acMAC[32];
	sprintf_s(acMAC, "%02X-%02X-%02X-%02X-%02X-%02X",
		int(adapter.adapt.adapter_address[0]),
		int(adapter.adapt.adapter_address[1]),
		int(adapter.adapt.adapter_address[2]),
		int(adapter.adapt.adapter_address[3]),
		int(adapter.adapt.adapter_address[4]),
		int(adapter.adapt.adapter_address[5]));
	macOUT = acMAC;
	return true;
}
bool GetMacByNetBIOS(std::string& macOUT)
{
	// 取得网卡列表
	LANA_ENUM adapterList;
	NCB Ncb;
	memset(&Ncb, 0, sizeof(NCB));
	Ncb.ncb_command = NCBENUM;
	Ncb.ncb_buffer = (unsigned char*)&adapterList;
	Ncb.ncb_length = sizeof(adapterList);
	Netbios(&Ncb);
	// 取得MAC
	for (int i = 0; i < adapterList.length; ++i)
	{
		if (GetAdapterInfo(adapterList.lana[i], macOUT))
			return true;
	}
	return false;
}
int main(int argc, char* argv[])
{
	std::string refBuffer;
	GetMacByNetBIOS(refBuffer);
	std::cout << "Mac地址: " << refBuffer << std::endl;
	system("pause");
	return 0;
}
```

:::
