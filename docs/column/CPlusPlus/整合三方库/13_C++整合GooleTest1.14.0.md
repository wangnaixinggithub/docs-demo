# C++整合GooleTest1.14.0

 gtest是一个跨平台(Liunx、Mac OS X、Windows、Cygwin、Windows CE and Symbian)的C++测试框架，有google公司发布。gtest测试框架是在不同平台上为编写C++测试而生成的。下面我将说明如何在windows环境中整合该测试库。

# 下载并编译库程序

GTest作为一个开源项目，在github上有完整源码并还在维护中。

```c
https://github.com/google/googletest/releases/tag/v1.14.0
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240225092514923-17167180201431.png)



官方文档：[GoogleTest Primer | GoogleTest](https://google.github.io/googletest/primer.html)



使用cmake工具，进行源码编译处理。这里对cmake工具不要有任何的思想负担，因为在Linux中，项目的编译工程有make承担，而windows程序员，所有的编译工程都是由vs来集成的(底层是`MSBuild` ) 所以诞生了该cmake工具. 这样只需要CMakeList.txt写一份编译规则，则两个平台都能复用了，解放了程序员的编译工作，他从而方便程序员做跨平台编译。该工具直接能生成出来一个vs的工程，从而能用vs打开，剩下的不多说了。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240225092716144-17167180353812.png)

# 整合并测试

将`ALL_BUILD` 设置为该解决方案的启动项目，调整编译级别和平台，如红线处所示。其会生成一个lib文件夹，就是该框架的静态库文件。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240225092930027-17088245710613-17167180463963.png)



编译成功之后，从生成文件中抽离出来静态库文件，并找到源码工程的头文件。进行整合。目录情况如下所示：

- C:\cpp\gtest1.14.0\lib 
  - gmock.lib
  - gtest.lib

- C:\cpp\gtest1.14.0\include

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240225093218479-17167180604614.png)



我们创建一个工程，指定附加头文件和库目录之后，直接写一个Demo，以验证整合成功，得到笔者的用户输出即代表整合成功!

```c
#include "gtest/gtest.h" //测试框架总头
#include <iostream>
#include <tchar.h>
//要测试的函数
int Foo(int a, int b)
{
    if (a == 0 || b == 0)
    {
        throw "don't do that";
    }
    int c = a % b;
    if (c == 0)
        return b;
    return Foo(b, c);
}
//编写测试逻辑
TEST(FooTest, HandleNoneZeroInput)
{
    EXPECT_EQ(2, Foo(4, 10));
    EXPECT_EQ(6, Foo(30, 18));
}

int _tmain(int argc, _TCHAR* argv[])
{
  	//查注入的命令行参数在 测试环境中使用
    testing::InitGoogleTest(&argc, argv); 
    
    //运行所有的测试
    return RUN_ALL_TESTS();

}


```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240225093553495-17088249545975-17167180725885.png)

# 遇到的错误

究其原由，其实就是所选工程的运行库不匹配导致的。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240225093726508-17088250476526-17167180943416.png)



在工程上右键-》属性-》c/c++-》代码生成-》运行库，有四个选项及含义分别如下：

- 多线程调试Dll (/MDd) 对应的是MD_DynamicDebug
- 多线程Dll (/MD) 对应的是MD_DynamicRelease
- 多线程(/MT) 对应的是MD_StaticRelease
- 多线程(/MTd)对应的是MD_StaticDebug

 error LNK2038: 检测到“RuntimeLibrary”的不匹配项:  值“MTd_StaticDebug”不匹配值“MDd_DynamicDebug，从上面的错误提示可知，我们原来选择的是   多线程调试Dll (/MDd) 选项 ，把它改为   多线程(/MTd)  即可 

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240225094028805-17088252299487-17167181050987.png)



