# 分析HelloWorld程序

```c
#include <Windows.h>

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{

	MessageBox(NULL, TEXT("HelloWorld"), TEXT("Caption"), MB_OKCANCEL | MB_ICONINFORMATION | MB_DEFBUTTON2);
	return 0;
}
```

## window.h头文件

`Window.h` 是编写WINDOW程序最重要的头文件，内部会包含许多其他的头文件。其中比较重要的和基础的如下：

```c
#include <windef.h> // 基本数据类型定义
#include <winbase.h> // Kernel (内核)有关定义
#include <wingdi.h> // 图形设备接口有关定义
#include <winuser.h> //用户界面有关定义
```

## WinMain入口函数

任何一个程序都会由一个入口函数，比如说控制台程序（exe），UG二次开发的程序（dll）。程序一旦被加载到内存，`windows`都会被将其认为是一个模块`HMoudle`。

入口函数的声明在`winbase.h` 中被声明。

```c
int WINAPI WinMain (
    _In_ HINSTANCE hInstance, //二进制代码和资源被操作系统加载到内存，这一个内存块业内叫模块，这一个内存块操作系统也会给他分配一个实例，实例句柄在WINDOWS中，基本等价于模块句柄。
    _In_opt_ HINSTANCE hPrevInstance,
    _In_ LPSTR lpCmdLine,//想一下，打开一个1.txt，为啥notepad.exe可直接阅读内容，把1.txt的绝对路径作为命令行参数，传给了notepad.exe了呗，因此notepad.exe底层再去解析此命令行参数，从而读取文件内容。
    _In_ int nShowCmd //期望说这个窗口怎么显示，最大化显示还是最小化显示。
    );	
```

`WinMain` 函数名前面的 `WINAPI` 在`minwindef.h` 中被定义了。可以看到`CALLBACK`,`WINAPI`,`APIPRIVATE` 都代表`__stdcall` ,这是一种<u>函数调用约定</u>，就正常来说，调用一个函数是，函数的实参会被压入函数栈，这个入栈顺序是从阅读顺序的从左往右进行的。而有了这样的一个宏之后，这个规则就会变成从右往左进行了。

```c
#define CALLBACK    __stdcall
#define WINAPI      __stdcall
#define WINAPIV     __cdecl
#define APIENTRY    WINAPI
#define APIPRIVATE  __stdcall
#define PASCAL      __stdcall 
```



在`WinMain`函数声明里面，数据类型前面的`_In_  _In_opt_ `   这些宏，可以把他理解成`参数标注`，是为了告诉你，这些形参是输入参数还是输出参数？表达此形参的性质和类型的，方便你更好的了解怎么使用这些参数。

:::details `形参宏描述`

```c
_In_ 输入参数，在调用函数时要为该参数设置一个值，这个值只是输入参数，不会在方法内部改他。
_InOt_ 输入输出参数，在调用的时候，要你传入一个值，走完该方法逻辑之后，这个值会被改，向你返回此修改后的值。
_Out_ 输出参数 走完方法逻辑后，给你返回一个值。
_Outptr__ 返回一个指针值
_OutPtr_opt_ opt,表达的是可选的.表示你可以不使用此参数你传个NULL(0) 进来也得。当然你定义一个指针变量来接收也没有意见。
```

:::

额外说明：`LPSTR` 都知道是一个宏，点进去，`_Null_terminated_` 也是一个宏，其表达含义为以零结尾的字符串。所以可以推出，`LPSTR` 以零结尾的char类型字符串指针。`LP` 是 `Long Pointer(长指针的意思)`，这是Win16中推出的概念，`Win32` 本身指针不分长指针和短指针了，都是32位，4个字节。微软的工程师为了兼容而不再修正宏说明了。 

`以零结尾: 又称为 以NULL结尾，以空字符结尾。`

```c
typedef _Null_terminated_ CHAR *NPSTR, *LPSTR, *PSTR;
typedef char CHAR;
```

## MessBox弹窗

`MessageBox()` 函数是消息提示框。

```c
int WINAPI MessageBox(
    _In_opt_ HWND hWnd,//消息窗拥有者的句柄
    _In_opt_ LPCWSTR lpText, //要显示的消息内容
    _In_opt_ LPCWSTR lpCaption,//要显示的消息标题
    _In_ UINT uType //消息框的图标样式和按钮样式
);
```

`uType` 通过一些宏整型常量以`|`做为分割符，来让开发组合其显示的样式。

### 显示的按钮

如果说，要在消息框中显示按钮，可以使用下面列举出来的值。

**MB_ABORTRETRYIGNORE** 中止，重试，忽略

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231119105041013-17003622425211-17173362868441.png)

- **MB_CANCELTRYCONTINUE** 取消、重试和继续

- **MB_HELP** 帮助

- **MB_OK** 确认

- **MB_OKCANCEL** 确认、取消

- **MB_RETRYCANCEL** 重试、取消

- **MB_YESNO**  是、否

- **MB_YESNOCANCEL**  是、否和取消

### 显示的图标

如果说，要在消息框中显示对应的图标。可以使用下面的值。

**MB_ICONEXCLAMATION** 感叹号图标

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231119105754294-17173363198912.png)

- **MB_ICONWARNING** 感叹号图标

- **MB_ICONINFORMATION** 在一个圆圈中有一个小写字母i组成的图标

- **MB_ICONASTERISK** 在一个圆圈中有一个小写字母i组成的图标

- **MB_ICONQUESTION** 问号图标

- **MB_ICONSTOP** 停止符号图标

- **MB_ICONERROR **停止符号图标

- **MB_ICONHAND** 停止符号图标

### 指定默认按钮

我们还可以指定消息的默认按钮，默认按钮的作用就是你不操作鼠标直接回车操作，等价于你去点击弹窗的的这个按钮。该按钮在外观是，会有一个比较粗的边框。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231119110600910-17173363450943.png)

要指代弹窗中哪一个按钮是默认按钮，可以通过下面枚举的宏来做说明。

- **MB_DEFBUTTON1**  第一个按钮是默认按钮

- **MB_DEFBUTTON2** 第二个按钮是默认按钮

- **MB_DEFBUTTON3** 第三个按钮是默认按钮

- **MB_DEFBUTTON4** 第四个按钮是默认按钮

### 返回值

- **IDABORT**  用户点击了中止按钮

- **IDCANCEL**  用户点击了取消按钮

- **IDCONTINUE ** 用户点击了继续按钮

- **IDIGNORE ** 用户点击了忽略按钮

- **IDNO**  用户点击了否按钮

- **IDOK ** 用户点击了是按钮

- **IDRETRY ** 用户点击了重试按钮

- **IDTRYAGAIN**   用户点击了重试按钮

- **IDYES **  用户点击了是按钮

```c
#include <Windows.h>
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow)
{
	int nRet =  MessageBox(NULL, TEXT("今天你敲代码了吗"), TEXT("消息框"), MB_YESNO | MB_ICONQUESTION|MB_DEFBUTTON1);
	
    //实际开发，我们可以基于返回值，对用户的操作进行处理。
	if (nRet == IDYES)
	{
		MessageBox(NULL, TEXT("对的，今天我敲了代码，并写下了第一句HelloWorld!"), TEXT("回复"), MB_OK);
	}
	else if (nRet == IDNO)
	{
		MessageBox(NULL, TEXT("不，今天没有。"), TEXT("回复"), MB_OK);
	}

	return 0;
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%B6%88%E6%81%AF%E6%A1%86%E8%BF%94%E5%9B%9E%E5%80%BC%E5%A4%84%E7%90%86-17003637779822-17173364007114.gif)
