# Window程序内部运行机制

## API和SDK

- API 是SDK的子集，在Window操作系统做应用开发，我们需要使用操作系统提供好的应用程序接口（API）通常是导入`window.h`这个头，用在这个头中定义好的函数。这个应用开发框架称为Win32 API 框架。 而 SDK 不仅仅指的是这些API接口，还包含了帮助文档、手册，开发调试工具等一系列的应用开发包集合。

## 窗口和句柄



- 一个窗口由客户区和非客户区组成，实际开发，我们更多关注点在客户区。
- 非客户区由操作系统来管理，我们在注册窗口类的时候，可以指定这些非客户区的窗口样式，来做到对其进行一些显示，禁用的操作。
- window 一切都是窗口。控件也是窗口。父子窗口。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240326233601294.png)

## 消息和消息队列

```c
/*
 * Message structure
 */
typedef struct tagMSG {
    HWND        hwnd; //标识该消息发送给哪一个应用程序窗口，窗口句柄
    UINT        message; //消息ID
    WPARAM      wParam; //消息携带参数 wParam
    LPARAM      lParam;// 消息携带参数 lParam
    DWORD       time; //消息投递到消息队列的事件
    POINT       pt; //鼠标的当前位置
#ifdef _MAC
    DWORD       lPrivate;
#endif
} MSG, *PMSG, NEAR *NPMSG, FAR *LPMSG;
```

- 消息ID 是一个数值，数值不好记忆，通常被Win32 API 这个框架设计者，定义成具有含义化的宏。通常都是`WM_XXX` 的形式打头的。 比如说鼠标按下消息  `WM_LBUTTONDOWN`

- 消息队列，每一个应用程序都有一个自己的消息队列，发什么消息到哪一个队列中去，由操作系统统一调度。
- 进队消息、不进队消息，正常基本都是进队消息，也有不进队的啊，系统直接把消息发给窗口过程。

## WainMain函数

```c
int WINAPI WinMain (
    _In_ HINSTANCE hInstance,
    _In_opt_ HINSTANCE hPrevInstance,
    _In_ LPSTR lpCmdLine,
    _In_ int nShowCmd
    );
```

- hInstance 应用程序，表示当前正在运行的应用程序实例。
- hPrevInstance 填NULL
- lpCmdLine 要传递给应用程序的命令行参数。
- nShowCmd 控制应用程序隐藏，最大化，最小化的参数。



## 窗口的创建

- 1、注册窗口类 RegisterClass
- 2、创建窗口 CreateWindow
- 3、显示及刷新窗口 ShowWindow  UpdateWindow
- 4、进入消息循环  GetMessage  TranslateMessage DispatchMessage

```c
#include<Windows.h>
#include "resource.h"
#include<iostream>

LRESULT CALLBACK WinSunProc(HWND hwnd,UINT uMsg,WPARAM wParam,	LPARAM lParam );

int WINAPI WinMain(HINSTANCE hInstance,HINSTANCE hPrevInstance,LPSTR lpCmdLine,int nCmdShow)
{
	//设计一个窗口类
	WNDCLASS wndcls;
	wndcls.cbClsExtra = 0;
	wndcls.cbWndExtra = 0;
	wndcls.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
	wndcls.hCursor = LoadCursor(hInstance, MAKEINTRESOURCE(IDC_CURSOR1)); //加载自定义光标
	wndcls.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(IDI_ICON1)); //加载自定义图标 
	wndcls.hInstance = hInstance;		//应用程序实例句柄由WinMain函数传进来
	wndcls.lpfnWndProc = WinSunProc;
	wndcls.lpszClassName = "sunxin2019";
	wndcls.lpszMenuName = NULL;
	wndcls.style = CS_HREDRAW | CS_VREDRAW;
	RegisterClass(&wndcls);
	
	//创建窗口，定义一个变量用来保存成功创建窗口后返回的句柄
	HWND hwnd;
	hwnd = CreateWindow("sunxin2019", "http://www.phei.com.cn",
		WS_OVERLAPPEDWINDOW, 0, 0, 600, 400, NULL, NULL, hInstance, NULL);

	//显示及刷新窗口
	ShowWindow(hwnd, SW_NORMAL);
	UpdateWindow(hwnd);

	//定义消息结构体，开始消息循环
	MSG msg;
	BOOL bRet;
	while ((bRet = GetMessage(&msg, hwnd, 0, 0)) != 0)
	{
		if (bRet == -1)
		{
			// handle the error and possibly exit
			return -1;
		}
		else
		{
			TranslateMessage(&msg);
			DispatchMessage(&msg);
		}

		
	}
	return msg.wParam;
}


//用户按下键盘 （行为）=> （操作系统）WM_KEYDOWN WM_KEYUP 消息 => 应用程序消息队列=> GetMessages()
// WM_KEYDOWN WM_KEYUP TranslateMessage WM_CHAR 在这里发生了消息的转换，再给回操作系统
//（操作系统） WM_CHAR =>  应用程序 WinSunProc
 

//编写窗口过程函数
LRESULT CALLBACK WinSunProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam)
{
	switch (uMsg)
	{
	case WM_CHAR:
		// UINT  unsigned int        
		// wParam 保存的是该按下的键对应的ASCII码。
		char szChar[20];
		sprintf_s(szChar, sizeof(szChar), "char code is %d", wParam);
		MessageBox(hwnd, szChar, "char", 0);
		break;
	case WM_LBUTTONDOWN:
		MessageBox(hwnd, "mouse clicked", "message", 0);
		HDC hdc;
		hdc = GetDC(hwnd);		//不能在响应WM_PAINT消息时调用
		TextOut(hdc, 0, 50, "程序员之家", strlen("程序员之家"));
		ReleaseDC(hwnd, hdc);
		break;
	case WM_PAINT:
		//1、创建窗口的时候，UpdateWindow 会产生WM_PAINT消息
		//2、只要客户区无效，需要重绘。都会发这么一个消息 最小化窗口再恢复，改变窗口尺寸。
		HDC hDC;
		PAINTSTRUCT ps;
		hDC = BeginPaint(hwnd, &ps);		//BeginPaint只能在响应WM_PAINT消息时调用
		TextOut(hDC, 0, 0, "http://www.phei.com.cn", strlen("http://www.phei.com.cn"));
		EndPaint(hwnd, &ps);
		break;
	case WM_CLOSE:
		if (IDYES == MessageBox(hwnd, "是否真的结束？", "message", MB_YESNO))
		{
			DestroyWindow(hwnd);
		}
		break;
	case WM_DESTROY:
		PostQuitMessage(0);
		break;
	default:
		return DefWindowProc(hwnd, uMsg, wParam, lParam);
	}
	return 0;
}

```

指定加载的图标和光标。

```c
//加载自定义光标
wndcls.hCursor = LoadCursor(hInstance,MAKEINTRESOURCE(IDC_CURSOR1));

//加载系统预先定义好的光标
wndcls.hCursor = LoadCursor(NULL, IDC_WAIT); 
```

```c
//加载系统预先定义好的图标
wndcls.hIcon = LoadIcon(NULL, IDI_WARNING); 

//加载自定义图标 
wndcls.hIcon = LoadIcon(hInstance,MAKEINTRESOURCE(IDI_ICON1)); 
```

## 变量的命名

匈牙利表示法，是微软长期开发经验的总结，要求所有开发必须遵循的变量命名规范。



