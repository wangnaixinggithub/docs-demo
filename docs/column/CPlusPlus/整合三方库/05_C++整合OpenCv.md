# C++整合OpenCv

```
官网：https://opencv.org/releases/，复制链接到迅雷下载。得到一个exe文件，运行安装。
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125115530284-17008845313411-17167173629741.png)

笔者这里安装到D盘的`OpenCv` 目录下。安装好了之后，我们做开发的只关心头文件和库文件。通常情况下，头文件和库文件都是在`build`目录下的。注意，这里`opencv库`,依赖VS16平台工具集(vc16)，如果要使用版本工具集，下载的时候注意选择！笔者的目录情况如下所示：

```c
//头文件目录
D:\OpenCv\opencv\build\include\opencv2
D:\OpenCv\opencv\build\include\

//库文件目录 
D:\OpenCv\opencv\build\x64\vc16\lib
    
 //库文件，也叫附加依赖项名称
opencv_world480d.lib
opencv_world480.lib
```

拷贝这些头文件和库文件，到你指定管理的三方库目录中去。跑通此程序即可完成整合。

```c
#include<opencv2/opencv.hpp>
#include<iostream>
using namespace std;
using namespace cv;
#pragma comment(lib,"opencv_world480d.lib")

int main()
{
	Mat img; //声明一个保存图像的类型
	img = imread("E:\\MyOpenCvTestPicture\\Lena.png");
	if (img.empty())
	{
		cout << "请确认图像名称是否正确" << endl;
		return -1;
	}
	imshow("test", img);
	waitKey(0);
	return 0;
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231125120448646-17008850900062-17167173956962.png)