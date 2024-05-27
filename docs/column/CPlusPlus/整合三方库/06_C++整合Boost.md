# C++整合Boost

# 官网下载

- Boost库官网：https://www.boost.org/

读者可自行去官方下载对应特定编译器的二进制文件，在官方网站页面中选中`More Downloads... (RSS)`下载页面，并点击`Prebuilt windows binaries`则可打开二进制预编译版本的对应页面。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125121433508-17167174356571.png)





人家告诉你现在最新版本是1.84,因为看到1.84好像还不稳定，笔者这里下载的是1.83。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125121610221-17167174482792.png)



点击进去，是以不同的VS平台工具集为区分的`.exe` 可执行安装文件，考虑到笔者开发实际，这里笔者下载的是[boost_1_83_0-msvc-10.0-64.exe](https://sourceforge.net/projects/boost/files/boost-binaries/1.83.0/boost_1_83_0-msvc-10.0-64.exe/download),并将其安装到了D盘。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125121634010-17167174673663.png)





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125120655329-17167174843454.png)



# HelloWorld

等待安装，装好了就可以开箱即用了。写一个入门程序，如果得到下面运行结果代码整合完成。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125121933722-17008859749263-17167174968395.png)



```c
#include <iostream>
#include <string>
#include <boost\lexical_cast.hpp>

using namespace std;
using namespace boost;

int main(int argc, char* argv[])
{
    string str[3] = { "100", "102", "3.14159" };

    // 字符串转换为数值类型
    std::cout << "字符串转为整数: " << lexical_cast<int>(str[0]) << std::endl;
    std::cout << "字符串转为长整数: " << lexical_cast<long>(str[1]) << std::endl;
    std::cout << "字符串转为浮点数: " << lexical_cast<float>(str[2]) << std::endl;

    // 数值类型转化为字符串
    std::cout << "数值转为字符串: " << lexical_cast<string>(100) << std::endl;
    std::cout << "十六进制转为十进制: " << lexical_cast<string>(0x10) << std::endl;

    // 转换后赋值给变量
    try {
        int number = lexical_cast<int>(str[0]);
        std::cout << "转换后赋值给变量: " << number << std::endl;
    }
    catch (bad_lexical_cast&) {
        std::cout << "转换失败抛出异常." << std::endl;
    }

    system("pause");
    return 0;
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125122026732-17008860275234-17167175098556.png)