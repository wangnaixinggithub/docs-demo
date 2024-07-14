# CRC32校验技术概述

CRC校验技术是用于检测数据传输或存储过程中是否出现了错误的一种方法，校验算法可以通过计算应用与数据的循环冗余校验（CRC）检验值来检测任何数据损坏。通过运用本校验技术我们可以实现对特定内存区域以及磁盘文件进行完整性检测，并以此来判定特定程序内存是否发生了变化，如果发生变化则拒绝执行，通过此种方法来保护内存或磁盘文件不会被非法篡改。总之，内存和磁盘中的校验技术都是用于确保数据和程序的完整性和安全性的重要技术。



:::details `CRC校验技术`

以下是一些关于内存和磁盘中的CRC校验技术的详细信息：

- 内存中的CRC校验技术

在内存中使用`CRC校验`技术可用于防止缓冲区溢出攻击。内存中的`CRC校验`技术将根据程序的特定部分计算数据的`CRC值`并存储在内存中。当程序运行时，它会自动计算相同的部分的`CRC`值，以确保没有被篡改。如果发现`CRC值`不匹配，则此可能是攻击发生的异常，程序可以终止。

- 磁盘中的CRC校验技术

使用`CRC校验`技术可用于检测磁盘文件是否被篡改。磁盘文件的`CRC值`将在文件中的特定位置处存储。在运行程序之前，程序将读取此`CRC值`并使用相同的算法计算自己的`CRC值`以检查文件是否被篡改。如果发现两个`CRC值`不匹配，则应用程序可能已被篡改或病毒感染。

首先我们需要自行实现一个`CRC`算法，通常情况下`CRC算法`需要经历三个步骤，`生成`CRC表格，`读取`数据并计算CRC，`计算`最终的CRC值，这个实现原理可细化为如下三步；

- 生成CRC表格

> 首先，需要生成一个长度为`256`的`CRC`表格。该表格包含了用于生成`32`位`CRC`值所需的所有信息。CRC32表通常是固定的，可作为算法的参数，也可以根据所需的多项式动态生成。

- 读取数据并计算CRC

> 计算`CRC值`的过程是将指定块的数据视为位流，并将位流分成`32位`的块。这些块按顺序处理，每次使用`CRC表格`中的值对`32位`值进行`XOR`和位移操作。该操作迭代执行，以依次处理每个块。

- 计算最终的CRC值

> 处理所有块后，可以计算最终的`CRC`值。大多数实现都反转了这个值的位，以进行优化，并将计算出的值与`0xFFFFFFFF`（32位的所有位都是1）进行`XOR`运算以得到最终值。





::::





:::details `示例1:`

根据上述描述读者应该可以理解`CRC32`的工作原理，如下代码是实现`CRC32`的核心算法。该算法生成一个`256`个元素的`CRC`表，在输入数据块上执行一系列按位运算。`CRC32`算法将输入的数据块视为位串，并产生一个唯一的`32位`输出，该输出可以用于验证数据的完整性和一致性等方面。

在该代码中，CRC表是动态生成的，采用了多项式`0xEDB88320L`。然后，该算法使用`crcTmp2`变量来存储中间`CRC`值，对每个字节进行一系列运算，以生成最终的`CRC32`值。返回值为计算出的`CRC32`值。

```c
#include <Windows.h>
#include<stdio.h>
// 定义一个指向字节缓冲区的指针ptr和字节缓冲区的大小Size，计算并返回CRC32值
DWORD CRC32(BYTE* ptr, DWORD Size)
{
    DWORD crcTable[256];
    DWORD crcTmp1;

    // 动态生成CRC-32表
    // 生成一个长度为256的CRC表格，共含有256个元素
    for (int i = 0; i < 256; i++)
    {
        crcTmp1 = i;
        // 每个元素计算8个字节
        for (int j = 8; j > 0; j--)
        {
            if (crcTmp1 & 1) crcTmp1 = (crcTmp1 >> 1) ^ 0xEDB88320L; // 判断是否需要异或 0xEDB88320L
            else crcTmp1 >>= 1;                                      // 如果不需要异或，则每次将该数右移一位
        }
        // 将得到的结果存放在CRC表格中
        crcTable[i] = crcTmp1;
    }

    // 计算CRC32值
    // 使用while循环来逐步处理字节块
    DWORD crcTmp2 = 0xFFFFFFFF;
    while (Size--)
    {
        // 将crcTmp2右移8位，并将最高8位数据清零
        crcTmp2 = ((crcTmp2 >> 8) & 0x00FFFFFF) ^ crcTable[(crcTmp2 ^ (*ptr)) & 0xFF];
        ptr++; // 处理下一个字节
    }

    // 将最终的crcTmp2值反转位顺序，并执行XOR运算，返回最终的CRC32值
    return (crcTmp2 ^ 0xFFFFFFFF);
}

int main(int argc, char* argv[])
{
    const char* ptr = "hello JacksonWang";
    DWORD size = sizeof("hello JacksonWang");

    printf("原始字符串: %s \n", ptr);

    DWORD ret = CRC32((BYTE*)ptr, size);
    printf("CRC32 = %x \n", ret);

    system("pause");
    return 0;
}

```

上述代码片段仅用于验证内存字符串，如果读者需要验证磁盘文件的特征码则首先需要通过`CreateFile`打开文件得到文件句柄，接着通过`ReadFile`将整个文件读入到内存，最后再次调用`CRC32(pFile, dwSize)`实现验证文件的CRC数据，但此方法仅用于验证小文件，如果文件过大则可能会耗费大量的内存。

:::





:::details `示例2:`

```c
#include <Windows.h>
#include<stdio.h>

// 定义一个指向字节缓冲区的指针ptr和字节缓冲区的大小Size，计算并返回CRC32值
DWORD CRC32(BYTE* ptr, DWORD Size)
{
    DWORD crcTable[256];
    DWORD crcTmp1;

    // 动态生成CRC-32表
    // 生成一个长度为256的CRC表格，共含有256个元素
    for (int i = 0; i < 256; i++)
    {
        crcTmp1 = i;
        // 每个元素计算8个字节
        for (int j = 8; j > 0; j--)
        {
            if (crcTmp1 & 1) crcTmp1 = (crcTmp1 >> 1) ^ 0xEDB88320L; // 判断是否需要异或 0xEDB88320L
            else crcTmp1 >>= 1;                                      // 如果不需要异或，则每次将该数右移一位
        }
        // 将得到的结果存放在CRC表格中
        crcTable[i] = crcTmp1;
    }

    // 计算CRC32值
    // 使用while循环来逐步处理字节块
    DWORD crcTmp2 = 0xFFFFFFFF;
    while (Size--)
    {
        // 将crcTmp2右移8位，并将最高8位数据清零
        crcTmp2 = ((crcTmp2 >> 8) & 0x00FFFFFF) ^ crcTable[(crcTmp2 ^ (*ptr)) & 0xFF];
        ptr++; // 处理下一个字节
    }

    // 将最终的crcTmp2值反转位顺序，并执行XOR运算，返回最终的CRC32值
    return (crcTmp2 ^ 0xFFFFFFFF);
}

int main(int argc, char* argv[])
{
    const char* lpFilePath = "E://1.xls";
    HANDLE hFile; //文件句柄
    DWORD dwFileSize;//文件内容字节个数
    BYTE* pFileContextBuffer; //指向文件内容的指针
    DWORD dwCrc32; //CRC32校验码
    DWORD dwNumberOfBytesRead = 0;

    // 查一下路径表示的文件是否存在
    if (::GetFileAttributes(lpFilePath) == 0xFFFFFFFF)
    {
        return 0;
    }

    //打开文件
    hFile = ::CreateFile(lpFilePath, GENERIC_READ, FILE_SHARE_READ, 0, OPEN_EXISTING, FILE_ATTRIBUTE_NORMAL, 0);
    if (hFile == INVALID_HANDLE_VALUE)
    {
        return (FALSE);
    }

    //读文件内容
    dwFileSize = GetFileSize(hFile, NULL);
    pFileContextBuffer = (BYTE*)malloc(dwFileSize);
    ReadFile(hFile, pFileContextBuffer, dwFileSize, &dwNumberOfBytesRead, 0);

    // 计算CRC32
     dwCrc32 = CRC32(pFileContextBuffer, dwFileSize);


     //输出信息
    if (pFileContextBuffer != NULL)
    {
        printf("文件名 = %s \n", lpFilePath);
        printf("文件长度 = %d \n", dwFileSize);
        printf("分配内存 = 0x%x \n", pFileContextBuffer);
        printf("CRC32 = 0x%x \n", dwCrc32);

        free(pFileContextBuffer);
        pFileContextBuffer = NULL;
    }

    system("pause");
    return 0;
}

```

上述代码运行后则可输出`E://1.xls`文件的CRC32值

:::