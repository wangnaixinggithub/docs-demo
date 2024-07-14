# SCM服务管理组件

[SCM](https://so.csdn.net/so/search?q=SCM&spm=1001.2101.3001.7020)（Service Control Manager）服务管理器是 Windows 操作系统中的一个关键组件，负责管理系统服务的启动、停止和配置。服务是一种在后台运行的应用程序，可以在系统启动时自动启动，也可以由用户或其他应用程序手动启动。本篇文章中，我们将通过使用 Windows 的服务管理器（SCM）提供的API接口，实现一个简单的服务管理组件的编写。



服务管理器的主要功能包括：

1. **服务启动和停止：** SCM 管理系统服务的启动和停止。在系统启动时，SCM 会根据每个服务的配置启动相应的服务。用户也可以通过服务管理器手动启动或停止服务。
2. **服务配置：** SCM 管理服务的配置信息，包括服务的启动类型（如自动、手动、禁用）、服务的依赖关系、服务的用户身份等。
3. **服务状态监控：** SCM 监控运行中服务的状态。服务可以处于运行、暂停、停止等状态。SCM 提供 API 函数，允许应用程序查询和控制服务的状态。
4. **事件日志：** SCM 记录服务启动、停止等事件到系统的事件日志中，这有助于故障排查和系统管理。
5. **服务通知：** SCM 允许应用程序注册服务状态变化的通知，以便及时响应服务状态的改变。
6. **服务安全性：** SCM 确保服务以适当的权限和身份运行，以保障系统的安全性。

开发者可以通过使用 Windows API 提供的相关函数（例如 `OpenSCManager`、`CreateService`、`StartService` 等）与 SCM 进行交互，[管理系统](https://so.csdn.net/so/search?q=管理系统&spm=1001.2101.3001.7020)中的服务。这些 API 函数允许开发者创建、配置、启动、停止和查询服务，以及监控服务的状态变化。



## 枚举SCM系统服务

Windows 的服务控制管理器（SCM）允许开发者通过 `EnumServicesStatus` 函数来枚举系统中正在运行的服务。这个功能非常有用，可以用于监控系统中的服务状态、获取服务的详细信息等。在这篇文章中，我们将学习如何使用 `EnumServicesStatus` 函数来实现对 SCM 系统服务的枚举，并获取相关信息。

`OpenSCManager` 用于打开服务控制管理器数据库，并返回一个指向服务控制管理器的句柄。通过这个句柄，你可以进行对服务的查询、创建、启动、停止等操作。

以下是 `OpenSCManager` 函数的原型：

```c
SC_HANDLE OpenSCManager(
  LPCTSTR lpMachineName,
  LPCTSTR lpDatabaseName,
  DWORD   dwDesiredAccess
);

```

- `lpMachineName`: 指定远程计算机的名称。如果为 `NULL`，表示本地计算机。
- `lpDatabaseName`: 指定要打开的服务控制管理器数据库的名称。通常为 `SERVICES_ACTIVE_DATABASE`。
- `dwDesiredAccess`:指定所请求的访问权限。可以是以下之一或它们的组合：
  - `SC_MANAGER_CONNECT`: 允许连接服务控制管理器。
  - `SC_MANAGER_CREATE_SERVICE`: 允许创建服务。
  - `SC_MANAGER_ENUMERATE_SERVICE`: 允许枚举服务。
  - `SC_MANAGER_LOCK`: 允许锁定服务数据库。
  - `SC_MANAGER_QUERY_LOCK_STATUS`: 允许查询服务数据库的锁定状态。
  - `SC_MANAGER_MODIFY_BOOT_CONFIG`: 允许修改系统启动配置。
  - `SC_MANAGER_ALL_ACCESS`: 允许执行上述所有操作。

函数返回一个指向服务控制管理器的句柄 (`SC_HANDLE`)。如果操作失败，返回 `NULL`，可以通过调用 `GetLastError` 函数获取错误代码。

`EnumServicesStatus` 用于枚举指定服务控制管理器数据库中的服务。通过这个函数，你可以获取正在运行的服务的信息，如服务的名称、显示名称、状态等。

以下是 `EnumServicesStatus` 函数的原型：

```c
BOOL EnumServicesStatus(
  SC_HANDLE hSCManager,
  DWORD     dwServiceType,
  DWORD     dwServiceState,
  LPENUM_SERVICE_STATUS lpServices,
  DWORD     cbBufSize,
  LPDWORD   pcbBytesNeeded,
  LPDWORD   lpServicesReturned,
  LPDWORD   lpResumeHandle
);
```

- `hSCManager`: 指定服务控制管理器的句柄，通过 `OpenSCManager` 函数获取。
- `dwServiceType`: 指定服务的类型，如 `SERVICE_WIN32`。
- `dwServiceState`: 指定服务的状态，如 `SERVICE_STATE_ALL`。
- `lpServices`: 指向 `ENUM_SERVICE_STATUS` 结构体数组的指针，用于接收服务的信息。
- `cbBufSize`: 指定 `lpServices` 缓冲区的大小，以字节为单位。
- `pcbBytesNeeded`: 接收所需的缓冲区大小，以字节为单位。
- `lpServicesReturned`: 接收实际返回的服务数。
- `lpResumeHandle`: 用于标识服务的遍历位置。

函数返回 `BOOL` 类型，如果调用成功，返回 `TRUE`，否则返回 `FALSE`。如果函数返回 `FALSE`，可以通过调用 `GetLastError` 函数获取错误代码。

上述`EnumServicesStatus`中的第二个参数`dwServiceType`非常重要，在 `Windows` [操作系统](https://so.csdn.net/so/search?q=操作系统&spm=1001.2101.3001.7020)中，服务的启动类型和服务类型是通过服务的标志（Service Flags）来指定的。这些标志是用于定义服务的性质和启动方式的。以下是其中几个标志的含义：

1. **0x00000001 (SERVICE_KERNEL_DRIVER):** 设备驱动程序。这种服务类型表示一个内核模式的设备驱动程序。
2. **0x00000002 (SERVICE_FILE_SYSTEM_DRIVER):** 内核模式文件系统驱动程序。这种服务类型表示一个内核模式的文件系统驱动程序。
3. **0x00000010 (SERVICE_WIN32_OWN_PROCESS):** 独占一个进程的服务。这种服务类型表示服务运行在自己的进程中。
4. **0x00000020 (SERVICE_WIN32_SHARE_PROCESS):** 与其他服务共享一个进程的服务。这种服务类型表示服务可以与其他服务运行在同一个进程中。
5. 0x00000030(**SERVICE_WIN32**)  SERVICE_WIN32_OWN_PROCESS 和 SERVICE_WIN32_SHARE_PROCESS 类型的服务。
6. 0x0000000B(**SERVICE_DRIVER**) SERVICE_KERNEL_DRIVER 和 SERVICE_FILE_SYSTEM_DRIVER 类型的服务。

需要注意的是，上述标志可以通过按位 OR 运算来组合使用，以表示服务的多个特性。例如，`SERVICE_WIN32_OWN_PROCESS | SERVICE_INTERACTIVE_PROCESS` 表示一个交互式服务，即运行在自己的进程中并与桌面交互。

除了上述标志之外，还有一些其他的标志，如：

- **SERVICE_INTERACTIVE_PROCESS (0x100):** 交互式服务。表示服务可以与桌面进行交互，通常用于服务需要显示用户界面的情况。
- **SERVICE_AUTO_START (0x2):** 自动启动。表示服务会在系统启动时自动启动。
- **SERVICE_DEMAND_START (0x3):** 手动启动。表示服务需要由用户手动启动。
- **SERVICE_DISABLED (0x4):** 禁用。表示服务被禁用，不会自动启动。

这些标志允许开发者灵活地定义服务的启动方式和性质。在使用服务相关的 API 函数时，这些标志会在函数参数中进行指定。例如，在使用 `CreateService` 函数时，可以通过设置 `dwServiceType` 和 `dwStartType` 参数来指定服务的类型和启动方式。

如下代码则实现了对系统内特定服务的枚举功能，通过向`Enum_Services`函数中传入不同的参数来实现枚举不同的服务类型；

```c
#include <stdio.h>
#include <windows.h>
#include <winternl.h>
#include<tchar.h>
#include<locale>

//依据服务类型 查本机的所有服务
BOOL GetServiceByType(DWORD dwServiceType)
{
    DWORD dxServicesReturned = 0;
    DWORD cbBytesNeeded = 0;
    LPENUM_SERVICE_STATUS lpInfo = NULL;
    SC_HANDLE hSCM;
    BOOL bRet = FALSE;

    //查本机服务控制管理器句柄
    hSCM = ::OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
    if (!hSCM)
    {
        return FALSE;
    }
    //查要接收这个类型的服务信息 需要的内存空间大小C1
    bRet = ::EnumServicesStatus(hSCM, dwServiceType, SERVICE_STATE_ALL, NULL, 0, &cbBytesNeeded, &dxServicesReturned, NULL);
    if (!bRet && GetLastError() == ERROR_MORE_DATA)
    {
        //基于此大小C1 开始分配接收查到的服务信息内存空间，字节为单位。
        lpInfo = (LPENUM_SERVICE_STATUS)(new BYTE[cbBytesNeeded]);
        if (!lpInfo)
        {
            return FALSE;
        }

        //开始查这个类型的服务信息
        bRet = ::EnumServicesStatus(hSCM, dwServiceType, SERVICE_STATE_ALL, (LPENUM_SERVICE_STATUS)lpInfo, cbBytesNeeded, &cbBytesNeeded, &dxServicesReturned, NULL);

        //逐个遍历获取服务信息
        for (size_t i = 0; i < dxServicesReturned; i++)
        {
            _tprintf(_T("名称:%-30s 显示名称:%-30s 状态:"), lpInfo[i].lpServiceName, lpInfo[i].lpDisplayName);
            if (lpInfo[i].ServiceStatus.dwCurrentState == SERVICE_PAUSED)
            {
                printf("暂停 \n");
            }
            else if (lpInfo[i].ServiceStatus.dwCurrentState == SERVICE_STOPPED)
            {
                printf("停止 \n");
            }
            else if (lpInfo[i].ServiceStatus.dwCurrentState == SERVICE_RUNNING)
            {
                printf("运行 (*) \n");
            }
            else
            {
                printf("其他 \n");
            }
        }

        delete[] lpInfo; lpInfo = NULL;

    }




}



int main(int argc, char* argv[])
{
    

    setlocale(LC_ALL, "chs");
    //SERVICE_DRIVER
    //SERVICE_FILE_SYSTEM_DRIVER
    //SERVICE_KERNEL_DRIVER
    //SERVICE_WIN32
    //SERVICE_WIN32_OWN_PROCESS
    //SERVICE_WIN32_SHARE_PROCESS

    GetServiceByType(SERVICE_WIN32_OWN_PROCESS);


    return 0;
}

```

我们传入`SERVICE_WIN32_OWN_PROCESS`则代表枚举当前系统中的独占一个进程的服务，代码需要使用管理员权限运行，输出效果图如下所示；

![image-20231126120556403](11_SCM服务管理组件.assets/image-20231126120556403-17009715574271.png)

## 编写SCM系统服务

Windows 服务程序的主体框架需要包括关键的两个函数，其中ServiceMain标志着服务程序的入口，而ServiceCtrlHandle则是服务程序的控制处理流程，最后的TellSCM函数则用于通知SCM服务的当前状态，当然了TellSCM可以单独出来也可以写在ServiceCtrlHandle都可以，任何一个正常的服务程序都必须包含这两个关键位置，并且需要将该函数导出，首先展示核心API函数的定义信息

`SERVICE_TABLE_ENTRY` 用于定义服务表的结构体。服务表是一个包含服务入口函数和服务名的数组，它告诉 SCM （服务控制管理器）哪个服务程序入口函数与哪个服务相关联。

以下是 `SERVICE_TABLE_ENTRY` 结构体的定义：

```c
typedef struct _SERVICE_TABLE_ENTRY {
    LPSTR lpServiceName;          // 服务名
    LPSERVICE_MAIN_FUNCTION lpServiceProc;  // 服务入口函数
} SERVICE_TABLE_ENTRY, *LPSERVICE_TABLE_ENTRY;
```

- `lpServiceName`: 指向服务名的指针。服务名是服务在 SCM 中的标识符，可以通过该名字启动、停止、控制服务等。
- `lpServiceProc`: 指向服务入口函数的指针。该函数是服务的主要执行点，当 SCM 启动服务时会调用该函数。

在主程序中，你通过创建 `SERVICE_TABLE_ENTRY` 数组来定义服务表，然后将其传递给 `StartServiceCtrlDispatcher` 函数。代码中，服务表包含一个 `SERVICE_TABLE_ENTRY` 结构体：

```c
SERVICE_TABLE_ENTRY stDispatchTable[] = {
    { g_szServiceName, (LPSERVICE_MAIN_FUNCTION)ServiceMain },
    { NULL, NULL }
};
```

- `g_szServiceName`: 是你的服务的名字，这里定义了为 “ServiceTest.exe”。
- `(LPSERVICE_MAIN_FUNCTION)ServiceMain`: 是指向服务入口函数 `ServiceMain` 的指针。当 SCM 启动服务时，将调用这个函数。

这个服务表告诉 SCM 与哪个服务相关联，通过哪个函数来启动和管理服务。 `StartServiceCtrlDispatcher` 函数接受这个服务表作为参数，并负责将控制传递给适当的服务。

`StartServiceCtrlDispatcher` 用于启动服务控制分发器。这个函数通常在服务程序的 `main` 函数中调用，它接受一个包含服务表的数组作为参数，并将控制传递给适当的服务。



以下是 `StartServiceCtrlDispatcher` 函数的原型：

```c
BOOL StartServiceCtrlDispatcher(
  const SERVICE_TABLE_ENTRY *lpServiceTable
);
```

- `lpServiceTable`: 指向 `SERVICE_TABLE_ENTRY` 结构体数组的指针，该数组定义了服务表。服务表中的每个元素指定了服务的名称和服务入口函数。

该函数返回 `BOOL` 类型。如果调用成功，返回 `TRUE`，否则返回 `FALSE`。如果返回 `FALSE`，可以通过调用 `GetLastError` 函数获取错误代码。

`RegisterServiceCtrlHandler` 用于注册一个服务控制处理程序，该处理程序将接收来自 SCM（服务控制管理器）的控制请求。每个服务都需要注册一个服务控制处理程序，以便在服务状态发生变化时接收通知。

以下是 `RegisterServiceCtrlHandler` 函数的原型：

```c
SERVICE_STATUS_HANDLE RegisterServiceCtrlHandler(
  LPCTSTR                  lpServiceName,
  LPHANDLER_FUNCTION_EX    lpHandlerProc
);
```

- `lpServiceName`: 指定要注册的服务的名称。这应该是服务在 SCM 中注册的唯一标识符。
- `lpHandlerProc`: 指定服务控制处理程序的地址。这是一个指向处理函数的指针，该函数将在接收到控制请求时被调用。

函数返回一个 `SERVICE_STATUS_HANDLE` 类型的句柄。这个句柄用于标识服务控制管理器中的服务控制处理程序。

`SetServiceStatus` 用于通知 SCM（服务控制管理器）关于服务的当前状态。这个函数通常在服务的主循环中调用，以便及时向 SCM 报告服务的状态变化。

以下是 `SetServiceStatus` 函数的原型：

```c
BOOL SetServiceStatus(
  SERVICE_STATUS_HANDLE hServiceStatus,
  LPSERVICE_STATUS      lpServiceStatus
);

```

- `hServiceStatus`: 指定服务控制管理器中的服务的句柄，即由 `RegisterServiceCtrlHandler` 返回的句柄。
- `lpServiceStatus`: 指向 `SERVICE_STATUS` 结构体的指针，该结构体描述了服务的当前状态。

`SERVICE_STATUS` 结构体定义如下：

```c
typedef struct _SERVICE_STATUS {
  DWORD dwServiceType;
  DWORD dwCurrentState;
  DWORD dwControlsAccepted;
  DWORD dwWin32ExitCode;
  DWORD dwServiceSpecificExitCode;
  DWORD dwCheckPoint;
  DWORD dwWaitHint;
} SERVICE_STATUS, *LPSERVICE_STATUS;

```

- `dwServiceType`: 服务的类型，例如 `SERVICE_WIN32_OWN_PROCESS`。
- `dwCurrentState`: 服务的当前状态，例如 `SERVICE_RUNNING`。
- `dwControlsAccepted`: 服务接受的控制码，例如 `SERVICE_ACCEPT_STOP` 表示服务接受停止控制。
- `dwWin32ExitCode`: 服务的 Win32 退出码。
- `dwServiceSpecificExitCode`: 服务的特定退出码。
- `dwCheckPoint`: 在操作进行中时，用于指示操作的进度。
- `dwWaitHint`: SCM 期望服务完成操作所需的等待时间。

有了上述接口的说明，并通过遵循微软的对服务编写的定义即可实现一个系统服务，这里的`DoTask()`是一个自定义函数，该服务在启动后会率先执行此处，此处可用于定义特定的功能，例如开机自启动某个进程，或者是远程创建套接字等，当然了服务程序也可以是`exe`如下可以使用控制台方式创建。

```c
#include <stdio.h>
#include <windows.h>
#include <winternl.h>
#include<tchar.h>
#include<locale>


void __stdcall ServiceMainProc(DWORD dwArgc, char* lpszArgv);
void __stdcall ServiceCtrlHandle(DWORD dwOperateCode);
BOOL TellSCM(DWORD dwState, DWORD dwExitCode, DWORD dwProgress);

//自定义函数
void DoTask();

//全局变量
char g_szServiceName[MAX_PATH] = "ServiceTest.exe"; //自身服务名称
SERVICE_STATUS_HANDLE g_ServiceStatusHandle = { 0 };




int main(int argc, char* argv[])
{
    

    //服务表维护了通过ServiceMainProc函数来启动g_szServiceName服务。
    SERVICE_TABLE_ENTRY stDispatchTable[] = { {g_szServiceName,LPSERVICE_MAIN_FUNCTIONA(ServiceMainProc)},{ NULL, NULL} };


    //启动服务控制分发器，其需要上述的服务表参数
   ::StartServiceCtrlDispatcher(stDispatchTable);

    return 0;

}

void __stdcall ServiceMainProc(DWORD dwArgc, char* lpszArgv)
{
    //注册服务控制程序，针对服务状态改变时，以便在ServiceCtrlHandle()接收到通知，做相对应的针对处理。
    g_ServiceStatusHandle = ::RegisterServiceCtrlHandler(g_szServiceName,(LPHANDLER_FUNCTION)ServiceCtrlHandle);

    TellSCM(SERVICE_START_PENDING, 0, 1);
    TellSCM(SERVICE_RUNNING, 0, 0);

    while (TRUE)
    {
        Sleep(5000);
        DoTask();
    }

}

void __stdcall ServiceCtrlHandle(DWORD dwOperateCode)
{
    if (dwOperateCode == SERVICE_CONTROL_PAUSE) //暂停
    {
        TellSCM(SERVICE_PAUSE_PENDING, 0, 1);
        TellSCM(SERVICE_PAUSED, 0, 0);
    }
    else if (dwOperateCode == SERVICE_CONTROL_CONTINUE) // 继续
    {
        TellSCM(SERVICE_CONTINUE_PENDING, 0, 1);
        TellSCM(SERVICE_RUNNING, 0, 0);
    }
    else if (dwOperateCode == SERVICE_CONTROL_STOP) //停止
    {
        TellSCM(SERVICE_STOP_PENDING, 0, 1);
        TellSCM(SERVICE_STOPPED, 0, 0);

    }
    else if (dwOperateCode == SERVICE_CONTROL_INTERROGATE) //询问
    {

    }
    else
    {

    }
}

BOOL TellSCM(DWORD dwState, DWORD dwExitCode, DWORD dwProgress)
{
    SERVICE_STATUS serviceStatus = { 0 };
    BOOL bRet = FALSE;
    ::RtlZeroMemory(&serviceStatus,sizeof(serviceStatus));
    serviceStatus.dwServiceType = SERVICE_WIN32_OWN_PROCESS;
    serviceStatus.dwCurrentState = dwState;
    serviceStatus.dwControlsAccepted = SERVICE_ACCEPT_STOP | SERVICE_ACCEPT_PAUSE_CONTINUE | SERVICE_ACCEPT_SHUTDOWN;
    serviceStatus.dwWin32ExitCode = dwExitCode;
    serviceStatus.dwWaitHint = 3000;

    //通知 SCM（服务控制管理器）关于服务的当前状态
    bRet = ::SetServiceStatus(g_ServiceStatusHandle,&serviceStatus);
    return bRet;
}

void DoTask()
{
    // 自己程序实现部分代码放在这里
}

```

## 设置SCM开机运行

独立的SCM程序无法直接双击运行，该服务程序只能通过服务管理器运行，通过使用`CreateService`将服务管理器程序设置为开机自动运行，并使用`StartService`将服务启动。

`CreateService` 函数用于创建一个新的服务。这个函数通常在安装服务时使用。在服务安装过程中，需要指定服务的名称、显示名称、服务类型、启动类型、二进制路径等信息。

以下是 `CreateService` 函数的原型：

```c
SC_HANDLE CreateService(
  SC_HANDLE hSCManager,
  LPCTSTR   lpServiceName,
  LPCTSTR   lpDisplayName,
  DWORD     dwDesiredAccess,
  DWORD     dwServiceType,
  DWORD     dwStartType,
  DWORD     dwErrorControl,
  LPCTSTR   lpBinaryPathName,
  LPCTSTR   lpLoadOrderGroup,
  LPDWORD   lpdwTagId,
  LPCTSTR   lpDependencies,
  LPCTSTR   lpServiceStartName,
  LPCTSTR   lpPassword
);

```

- `hSCManager`: 服务控制管理器的句柄，可以通过 `OpenSCManager` 函数获取。
- `lpServiceName`: 要创建的服务的名称。这是服务在 SCM 中的唯一标识符。
- `lpDisplayName`: 服务的显示名称，这是在服务列表中显示的名称。
- `dwDesiredAccess`: 对服务的访问权限，例如 `SERVICE_ALL_ACCESS`。
- `dwServiceType`: 服务的类型，例如 `SERVICE_WIN32_OWN_PROCESS`。
- `dwStartType`: 服务的启动类型，例如 `SERVICE_AUTO_START`。
- `dwErrorControl`: 当服务无法启动时的错误处理控制。
- `lpBinaryPathName`: 服务程序的可执行文件的路径。
- `lpLoadOrderGroup`: 指定服务应属于的加载顺序组。
- `lpdwTagId`: 指向接收服务标识符的指针。
- `lpDependencies`: 指定服务依赖的服务名称。
- `pServiceStartName`: 服务启动时使用的用户名。
- `lpPassword`: 服务启动时使用的密码。

函数返回一个 `SC_HANDLE` 类型的句柄，该句柄标识了新创建的服务。如果函数调用失败，返回 `NULL`。可以通过调用 `GetLastError` 函数获取错误代码。

`StartService` 函数用于启动一个已注册的服务。这个函数通常在服务程序中的启动代码或者通过服务管理工具中手动启动服务时使用。

以下是 `StartService` 函数的原型：

```c
BOOL StartService(
  SC_HANDLE hService,
  DWORD     dwNumServiceArgs,
  LPCTSTR   *lpServiceArgVectors
);
```

- `hService`: 要启动的服务的句柄，可以通过 `OpenService` 函数获取。
- `dwNumServiceArgs`: 指定传递给服务的命令行参数数量。
- `lpServiceArgVectors`: 指向包含服务命令行参数的字符串数组。

函数返回一个 `BOOL` 类型的值，如果调用成功返回 `TRUE`，否则返回 `FALSE`。可以通过调用 `GetLastError` 函数获取错误代码。

`ControlService` 函数用于向已注册的服务发送控制码，以便执行特定的操作。这个函数通常在服务程序中的控制逻辑或者通过服务管理工具中手动控制服务时使用。

以下是 `ControlService` 函数的原型：

```c
BOOL ControlService(
  SC_HANDLE        hService,
  DWORD            dwControl,
  LPSERVICE_STATUS lpServiceStatus
);
```

- `hService`: 要控制的服务的句柄，可以通过 `OpenService` 函数获取。

- `dwControl`: 指定服务的控制码，可以是以下之一：

  - `SERVICE_CONTROL_CONTINUE`: 继续服务。
  - `SERVICE_CONTROL_PAUSE`: 暂停服务。
  - `SERVICE_CONTROL_STOP`: 停止服务。

  - 等等，还有其他服务控制码。

- `lpServiceStatus`: 指向 `SERVICE_STATUS` 结构体的指针，用于接收服务的当前状态信息。

函数返回一个 `BOOL` 类型的值，如果调用成功返回 `TRUE`，否则返回 `FALSE`。可以通过调用 `GetLastError` 函数获取错误代码。

函数返回一个 `BOOL` 类型的值，如果调用成功返回 `TRUE`，否则返回 `FALSE`。可以通过调用 `GetLastError` 函数获取错误代码。

这样的功能对于管理系统服务的状态和自启动行为具有重要意义。然而，需要注意确保在执行这些操作时具有足够的权限，并在实际应用中加强错误处理以确保操作的可靠性。

```c
#include <stdio.h>
#include <windows.h>
#include <Shlwapi.h>
#include<strsafe.h>
#pragma comment(lib,"Shlwapi")


//注册服务自启动
void AutoRunService(char* szFilePath, char* lpDisplayName)
{

    char szServiceName[MAX_PATH] = { 0 };//服务名称
    SC_HANDLE hSCM;//服务控制管理器,根据服务控制管理器，可以对服务进行查询、创建、启动、停止操作。
    SC_HANDLE hService; //本次要注册的服务句柄


    //查到服务控制管理器的句柄
     hSCM = ::OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);


     //从.sys文件中拿到服务名，服务名即等价于文件名
    ::StringCchCopy(szServiceName,_countof(szServiceName), szFilePath);
    ::PathStripPath(szServiceName);



    //查一下要注册的服务已经被服务控制管理器管理了没有
    hService = ::OpenService(hSCM, szServiceName, SERVICE_ALL_ACCESS);
    
    if (hService == NULL) 
    {
        //没有则创建出此服务，并让此服务开机自启动 然后启动服务。
        SC_HANDLE hNewService = ::CreateService(hSCM, szServiceName, lpDisplayName, SERVICE_ALL_ACCESS,
            SERVICE_WIN32_OWN_PROCESS, SERVICE_AUTO_START,
            SERVICE_ERROR_IGNORE, szFilePath,
            NULL, NULL, NULL, NULL, NULL);

        ::StartService(hNewService, 0, NULL);

        ::CloseServiceHandle(hNewService);

        printf("[*] 创建服务完成 \n");
    }
    ::CloseServiceHandle(hService);
    ::CloseServiceHandle(hSCM);

}

// 设置服务状态
BOOL SetServiceStatus(char* lpServiceName, int Status)
{
    SERVICE_STATUS ss;
    SC_HANDLE hSCM;//服务控制管理器,根据服务控制管理器，可以对服务进行查询、创建、启动、停止操作。
    BOOL bRet = TRUE;
    SC_HANDLE hService;//要设置服务状态的服务

    //查到服务控制管理器的句柄
    hSCM = ::OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);


    //从服务控制管理器中 依据服务名称 查到此设置服务状态的服务，
    hService = ::OpenService(hSCM, lpServiceName, SERVICE_ALL_ACCESS);
    if (hService != NULL)
    {
        if (Status == 1) //用户要求停止服务
        {

            if (!::ControlService(hService, SERVICE_CONTROL_STOP, &ss))
            {
                bRet = FALSE;
            }
        }
        else if (Status == 2) //用户要求启动服务
        {
            if (!::StartService(hService, 0, NULL))
            {
                bRet = FALSE;
            }
        }
        else if (Status == 3) //用户要求删除服务
        {
            if (!DeleteService(hService))
            {
                bRet = FALSE;
            }
        }
        else
        {
            //todo...
        }

    }

    CloseServiceHandle(hSCM);
    CloseServiceHandle(hService);

    return bRet;


}
int main(int argc, char* argv[])
{
    
    // 注册为自启动服务将d:/myservice.exe 注册为自启动服务 后面是描述信息

    AutoRunService((char*)"d:/myservice.exe", (char*)"Microsoft Windows Security Services");

    // 根据服务名称管理服务 1=>停止服务 2=>启动服务 3=>删除服务
    BOOL ret = SetServiceStatus((char*)"myservice.exe", 2);
    printf("状态: %d \n", ret);



    return 0;

}

```

