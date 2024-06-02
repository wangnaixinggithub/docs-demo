# HelloWorld程序

## VS向导构建

打开VS，单击创建新项目对话框。语言类型选择C++,目标平台选择Windows，项目类型选择所有项目类型，选择Windows桌面应用程序。点击下一步。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231118222816722-17003176981711-17173357683441.png)

指定项目名称，以及此项目所在的父目录。点击创建。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231118223034334-17003178358192-17173358420282.png)

应用程序类型，选择桌面应用程序。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231118223352233-17003180335303-17173358648273.png)

在左侧的解决方案资源管理器中，创建一个`.cpp` 写入如下内容。

```c
#include <Windows.h>

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
    
	MessageBox(NULL, TEXT("HelloWorld"), TEXT("Caption"), MB_OKCANCEL | MB_ICONINFORMATION | MB_DEFBUTTON2);
	return 0;
}
```

## 控制台魔改为窗口应用

刚开始学习`C++` 的时候，我们练习的时候通过会创建一个控制台应用程序。当然，除了上面第一种方式，我们还可以通过**对控制台应用程序进行简单的魔改**，**改为窗口程序。**

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231118223550917-17003181518965-17173359115914.png)

魔改的步骤如下：

- 1、预定义处理器定义，_CONSOLE 改为 _WINDOWS

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231118223932073-17003183733546-17173359525525.png)

- 2、链接器的系统中的子系统由控制台，直接调整为窗口。

  ![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231118224016186-17173359663506.png)

- 3、运行验证 

`ctrl+f5` ,运行exe程序，可以看到成功弹窗一个模态框。