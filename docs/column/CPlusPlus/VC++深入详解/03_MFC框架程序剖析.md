# MFC框架程序剖析

## MFC AppWizard

利用MFC AppWizard来创建一个基于MFC的单文档界面(SDI)应用程序。



## 基于MFC的程序框架剖析



我们可以在**类视图**，查看该应用程序定义好的类，以及他们的方法、属性与继承关系。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240330225230345.png)



模板创建的工程 ，肯定有这几个类的派生子类。 CDocument CView CMainFrame CDialogEx CWinApp。。。

```
class CTestApp : public CWinApp
class CTestDoc : public CDocument
class CTestView : public CView

Test 项目名
```



## MFC程序和WinMain产生的关联点

```c
// global.cpp : 此文件包含 "main" 函数。程序执行将在此处开始并结束。
//

#include "pch.h"
#include <iostream>
using namespace std;

int a = 6;

class CPoint
{
public:
    CPoint()
    {
    }
};

CPoint pt;
int main()
{
	cout<< a<<endl;
	return 0;
}


//C++ 程序 ，会把全局变量先初始化后，再进入main() 方法
// 如果全局变量还是一个类全局的话，那么会执行该类的构造方法。
```

全局变量`CWinApp` 对象的初始化，执行的逻辑和`_twinMain()` 函数高度关联。

```c

// Test.h: Test 应用程序的主头文件
//
#pragma once

#ifndef __AFXWIN_H__
	#error "在包含此文件之前包含“stdafx.h”以生成 PCH 文件"
#endif

#include "resource.h"       // 主符号


// CTestApp:
// 有关此类的实现，请参阅 Test.cpp
//

class CTestApp : public CWinApp
{
public:
    
    //1、构造做了很多把类实例this 和底层API、全局函数关联的事情
	CTestApp() noexcept;


// 重写
public:
    
    //2、初始化实例，做了很多win32底层要干的事情，比如说，消息循环。
	virtual BOOL InitInstance();
	virtual int ExitInstance();

// 实现
	afx_msg void OnAppAbout();
	DECLARE_MESSAGE_MAP()
};

extern CTestApp theApp;

```

## 窗口类、窗口类对象与窗口

窗口类，窗口类对象，窗口，你要站在开发这个框架的人的层面思考问题。已经有了基于面向过程的函数，来管理这些窗口资源了。通过句柄操作，那我想开发一个框架来简化这些操作过程给其他程序员来用。肯定把句柄作为成员变量，然后调用类方法，但是说白了， 类方法底层还是调用Win32的SDK...



当用户把窗口类对象被new出来后，要求他去调用`Create()` 方法，去指定前面CreateWindows时候的一些必要参数进来，我这个框架帮他做好这些事情。最终窗口类对象被delete时候，再通过窗口句柄去`DestroyWindow()`



这样带来一个很大的设计缺陷点，不排除用户自己查了窗口句柄，然后直接调用底层函数，比如`DestroyWindow()` 直接干销毁了。但是窗口类对象还在（C++类的声明周期），这个类对象指代的窗口对象已经不在了，这个对象就是一个死对象了。

```c
#include "cwnd.h"

CWnd::CWnd()
{
	m_hWnd = NULL;
}

CWnd::~CWnd()
{
	DestroyWindow();
}

BOOL CWnd::CreateEx(DWORD dwExStyle,      // extended window style
	LPCTSTR lpClassName,  // registered class name
	LPCTSTR lpWindowName, // window name
	DWORD dwStyle,        // window style
	int x,                // horizontal position of window
	int y,                // vertical position of window
	int nWidth,           // window width
	int nHeight,          // window height
	HWND hWndParent,      // handle to parent or owner window
	HMENU hMenu,          // menu handle or child identifier
	HINSTANCE hInstance,  // handle to application instance
	LPVOID lpParam)        // window-creation data
{
	m_hWnd = ::CreateWindowEx(dwExStyle, lpClassName, lpWindowName, 
		dwStyle, x, y,nWidth, nHeight, hWndParent, hMenu, 
		hInstance,lpParam);
	if (m_hWnd != NULL)
		return TRUE;
	else
		return FALSE;
}

BOOL CWnd::ShowWindow(int nCmdShow)
{
	return ::ShowWindow(m_hWnd, nCmdShow);
}

//知道一点，成员函数名和全局函数名 一致，用::区分，以表示为全局。
BOOL CWnd::UpdateWindow()
{
	return ::UpdateWindow(m_hWnd);
}

BOOL CWnd::DestroyWindow()
{
	BOOL bResult = FALSE;
	
	if (m_hWnd != NULL)
	{
		bResult = ::DestroyWindow(m_hWnd);
		m_hWnd = NULL;
	}
	return bResult;
}

```

```c
#include "cwnd.h"

int WINAPI WinMain(
	HINSTANCE hInstance,      // handle to current instance
	HINSTANCE hPrevInstance,  // handle to previous instance
	LPSTR lpCmdLine,          // command line
	int nCmdShow              // show state
)
{
	//首先是设计窗口类，即定义一个WNDCLASS，并为相应字段赋值。
	WNDCLASS wndcls;
	wndcls.cbClsExtra = 0;
	wndcls.cbWndExtra = 0;
	......
		//注册窗口类
		RegisterClass(&wndcls);

	//创建窗口
	CWnd wnd;
	wnd.CreateEx(...);

	//显示窗口
	wnd.ShowWindow(SW_SHOWNORMAL);

	//更新窗口
	wnd.UpdateWindow();
	//接下来就是消息循环，此处省略
	......
	return 0;
}

//知道第二点，窗口类对象和窗口（是Windows种的一个对象资源）他们之间的关联仅仅 只是啊 只是m_hWnd 窗口句柄。

//所以只有窗口被DestroyWindows了，窗口才真的销毁了，不然有可能窗口类对象还没有销毁，但是实际上窗口已经销毁了的。

```

## 动态添加窗口控件

```c
#pragma once
class CMainFrame : public CFrameWnd
{

protected:  // 控件条嵌入成员
	CToolBar          m_wndToolBar; //工具条
	CStatusBar        m_wndStatusBar;  //状态栏   
        
private:
	CButton m_btn;
};
```

```c
int CMainFrame::OnCreate(LPCREATESTRUCT lpCreateStruct)
{
	if (CFrameWnd::OnCreate(lpCreateStruct) == -1)
		return -1;

	if (!m_wndToolBar.CreateEx(this, TBSTYLE_FLAT, WS_CHILD | WS_VISIBLE | CBRS_TOP | CBRS_GRIPPER | CBRS_TOOLTIPS | CBRS_FLYBY | CBRS_SIZE_DYNAMIC) ||
		!m_wndToolBar.LoadToolBar(IDR_MAINFRAME))
	{
		TRACE0("未能创建工具栏\n");
		return -1;      // 未能创建
	}

	if (!m_wndStatusBar.Create(this))
	{
		TRACE0("未能创建状态栏\n");
		return -1;      // 未能创建
	}
	m_wndStatusBar.SetIndicators(indicators, sizeof(indicators)/sizeof(UINT));

	// TODO: 如果不需要可停靠工具栏，则删除这三行
	m_wndToolBar.EnableDocking(CBRS_ALIGN_ANY);
	EnableDocking(CBRS_ALIGN_ANY);
	DockControlBar(&m_wndToolBar);

	// new 和不new 只是说这个c++对象，存的内存在哪的问题 栈还是堆上而已。
	// 不能把定义为局部对象，OnCreate方法执行完，就把btn销毁了。
	//CButton btn;
	//btn.Create(L"按钮", WS_CHILD | BS_DEFPUSHBUTTON, 
		//CRect(0, 0, 100, 100), this, 123);

	//窗口类对象和窗口资源对象 两回事，不是说我们创建了窗口类对象了，就有界面的窗口出来了，我们得用Create方法
	// Create方法，底层会走注册窗口类、CreateWindow这些流程，才真正意义的创建出来。
	m_btn.Create(L"按钮", WS_CHILD | BS_DEFPUSHBUTTON, CRect(0, 0, 100, 100), this, 123); 	//动态创建窗口
	m_btn.ShowWindow(SW_SHOWNORMAL); //如果按钮是隐藏的，则进行显示。

	return 0;
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240331002224758-17118157457303.png)

因为`CMainFrame` 管理工具条和状态栏，所有他的窗口原点，比显示的客户区要大。实际开发都是在客户区中加入控件的，所有我们加的控件，比如按钮 应当由视图管理。

## 视图类才管理客户区

所有的控件的都继承了CWind类，也都具备了`Create()`方法，基本上要用控件，都要先声明控件类对象作为属性成员，再调用`Create()`方法,做底层的窗口对象（句柄）和窗口类的绑定。

```c
class CTestView : public CView
{
private:
	CButton m_btn; //1、声明窗口控件类对象为属性
}
```

```c
int CTestView::OnCreate(LPCREATESTRUCT lpCreateStruct)
{
	if (CView::OnCreate(lpCreateStruct) == -1)
		return -1;

    
    
    //2、调用Create() 完成关联

	// dwStyle &= WS_CHILD  m_btn 执行的父窗口是谁？ this			CView   √
	//											 GetParent()	CMainFrame
	//m_btn.Create(L"按钮", WS_CHILD | BS_DEFPUSHBUTTON, CRect(0, 0, 100, 100), this, 123);
	//m_btn.Create(L"按钮", WS_CHILD | BS_DEFPUSHBUTTON, CRect(0, 0, 100, 100), GetParent(), 123);
	//m_btn.ShowWindow(SW_SHOWNORMAL);


	// dwStyle &=WS_VISIBLE 等价于调用 m_btn.ShowWindow(SW_SHOWNORMAL);
	m_btn.Create(L"按钮", WS_CHILD | WS_VISIBLE | BS_DEFPUSHBUTTON, CRect(0, 0, 100, 100), this, 123);

	return 0;
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240331001920030-17118155614511.png)
