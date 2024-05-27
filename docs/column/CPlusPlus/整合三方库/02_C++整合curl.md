# C++整合curl

# 官网下载

```
https://curl.se/download.html
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124204434882-17167168710601.png)

下载好了之后，人家提供的是源码，而实际业务开发我们需要的是库，这里展示下解压`.zip`之后的一个项目层级，注意这里重点关注 `winbuild`目录，

```c
C:\Users\82737\Desktop\curl-8.4.0\winbuild
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124205337661-17167169011402.png)



我们在安装`VS`的时候，`VS`还提供了别的一些工具，提供我们编译程序。比如我们可以用 `开发人员命令提示Command Prompt` 来帮助我们编译静态库和动态库。我们选择第一个工具A`x64 Native Tools Command Prompt for VS 2019` 来帮助我们编译静态库和动态库。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124204756088-17008300771491-17167169171473.png)



```c
静态库debug
nmake /f Makefile.vc mode=static VC=16 DEBUG=yes MACHINE=x64

静态库release
nmake /f Makefile.vc mode=static VC=16  MACHINE=x64

动态库debug
nmake /f Makefile.vc mode=dll VC=16 DEBUG=yes MACHINE=x64

动态库release
nmake /f Makefile.vc mode=dll VC=16 MACHINE=x64
```
# 编译动态库

笔者这里演示一个编译X64平台下，工具集采用VC16的动态库编译。

```
# 1、运行此工具A后， 切换到curl工程下的 winbulid目录下
D:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise>c:

C:\Program Files (x86)\Microsoft Visual Studio\Installer>cd C:\Users\82737\Desktop\curl-8.4.0\winbuild

#2、执行 编译命令
C:\Users\82737\Desktop\curl-8.4.0\winbuild>nmake /f Makefile.vc mode=dll VC=16 DEBUG=yes MACHINE=x64
```

执行完成之后，可以看到该工具A,不间断在生成代码和编译代码。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124205441241-17167169433464.png)



最终，这个库在编译通过后会自动生成文件到`builds`目录下。最终得到了我们想要的头文件，库文件。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124205655966-17008306172253-17167169572585.png)

# HelloWorld

```c
#define CURL_STATICLIB
#define BUILDING_LIBCURL
#include <iostream>
#include "curl/curl.h"

#pragma comment (lib,"libcurl_debug.lib")
#pragma comment (lib,"wldap32.lib")
#pragma comment (lib,"ws2_32.lib")
#pragma comment (lib,"Crypt32.lib")

using namespace std;

int main(int argc, char* argv[])
{
	CURL* curl = NULL; //CURL对象
	CURLcode res; //结果值

	//初始化CURL对象
	curl = curl_easy_init(); 
	
	if (curl)
	{
		//通过curl_easy_setopt() 发起一个访问此URL地址的请求
		curl_easy_setopt(curl, CURLOPT_URL, "https://www.baidu.com");
		
		//当访问成功之后,通过curl_easy_perform() 函数得到访问结果
		res = curl_easy_perform(curl);

		//释放此CURL资源
		curl_easy_cleanup(curl);
		curl = NULL;
	}
	cout << "返回状态:" << res << endl;

	return 0;
}

```

运行上述代码，读者可看到网站内容。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124210755514-17008312768504-17167169708096.png)



上述代码中的`curl_easy_setopt()`函数第二个参数可以使用多种类型的变量定义，我们可以通过传入不同的常量来定义请求头中的参数，例如当我们需要修改协议头时，可以使用CURLOPT_HTTPHEADER常量，并在其后第三个参数中传入该常量所对应的结构即可，这个结构体定义有许多类型，具体如下下表所示；
![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124210947549-17008313887945-17167169941537.png)



如下案例是一个简单的GET请求封装，通过调用`SendGet()`函数实现对特定页面发起请求的功能，其中`curl_slist_append()`用于增加新的请求头，在调用`curl_easy_setopt()`函数时，分别传入了`CURLOPT_HTTPHEADER`设置请求头，`CURLOPT_WRITEFUNCTION`设置响应接收回调。`CURLINFO_PRIMARY_IP`获取目标服务器IP地址，`CURLINFO_RESPONSE_CODE`获取目标服务器返回的响应状态代码，此处的`write_data()`函数直接返回0则表示屏蔽所有的页面输出内容。

```c
#define CURL_STATICLIB
#define BUILDING_LIBCURL
#include <iostream>
#include "curl/curl.h"

#pragma comment (lib,"libcurl_debug.lib")
#pragma comment (lib,"wldap32.lib")
#pragma comment (lib,"ws2_32.lib")
#pragma comment (lib,"Crypt32.lib")

using namespace std;

// 设置CURLOPT_WRITEFUNCTION回调函数,返回为空屏蔽输出
static size_t write_data(char* d, size_t n, size_t l, void* p)
{
	return 0;
}

//获取网站的返回值
void SendGet(const char* url)
{
	CURLcode dxStatus; //方法状态码
	struct curl_slist* requestHeaders = NULL; //请求头
	CURL* request; //请求
	long responseCode = 0; //响应码
	char* serverAddress = { 0 }; //请求的服务器的地址
	

	//初始化模块
	dxStatus = curl_global_init(CURL_GLOBAL_WIN32);
	if (CURLE_OK != dxStatus)
	{
		return;
	}

	//初始化填充请求头
	requestHeaders = curl_slist_append(requestHeaders,"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0)");
	requestHeaders = curl_slist_append(requestHeaders, "Referer: https://www.zhangsan.com");

	//初始化请求库
	 request = curl_easy_init();
	 if (request)
	 {
		 // CURLOPT_HTTPHEADER 自定义设置请求头
		 curl_easy_setopt(request, CURLOPT_HTTPHEADER, requestHeaders);

		 //CURLOPT_URL 自定义请求的网站
		 curl_easy_setopt(request, CURLOPT_URL, url);

		 //CURLOPT_WRITEFUNCTION 设置回调函数,屏蔽输出
		 curl_easy_setopt(request, CURLOPT_WRITEFUNCTION, write_data);

		 //执行CURL请求服务器地址
		 dxStatus = curl_easy_perform(request);


		 //查服务器地址
		 dxStatus = curl_easy_getinfo(request, CURLINFO_PRIMARY_IP, &serverAddress);
		 if (CURLE_OK == dxStatus && serverAddress)
		 {
			 cout << "目标IP:" << serverAddress << endl;
		 }


		 dxStatus = curl_easy_getinfo(request, CURLINFO_RESPONSE_CODE,&responseCode);

		 if (CURLE_OK == dxStatus && responseCode)
		 {
			 cout << "返回状态码:" << responseCode << endl;
		 }

		 curl_easy_cleanup(request);
	 }
	 curl_global_cleanup();


}


int main(int argc, char* argv[])
{
	
	SendGet("https://www.lyshark.com");

	return 0;
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124212831032-17008325119286-17167170144888.png)

当然该库同样支持`POST`请求方式，在使用`POST`请求时我们可以通过`CURLOPT_COOKIEFILE`参数指定`Cookie`参数，通过`CURLOPT_POSTFIELDS`指定`POST`的数据集，而如果需要使用代理模式则可以通过`CURLOPT_PROXY`方式来指定代理地址。

```c
#define CURL_STATICLIB
#define BUILDING_LIBCURL
#include <iostream>
#include "curl/curl.h"

#pragma comment (lib,"libcurl_debug.lib")
#pragma comment (lib,"wldap32.lib")
#pragma comment (lib,"ws2_32.lib")
#pragma comment (lib,"Crypt32.lib")

using namespace std;

bool SendPost(const char* url, const char* cookies,const char* postVal)
{

	CURL* request = NULL;
	CURLcode dxStatus = CURLE_OK;

	request = curl_easy_init();
	if (request)
	{
		
		//设置请求头
		struct curl_slist* requestHeaders = NULL;
		requestHeaders = curl_slist_append(requestHeaders,"User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0)");
		requestHeaders = curl_slist_append(requestHeaders, "Referer: https://www.zhangsan.com");
		curl_easy_setopt(request, CURLOPT_HTTPHEADER, requestHeaders);

		//设置请求URL
		curl_easy_setopt(request, CURLOPT_URL, url);

		// 指定cookie参数
		curl_easy_setopt(request, CURLOPT_COOKIEFILE, cookies);

		// 指定post内容
		curl_easy_setopt(request, CURLOPT_POSTFIELDS, postVal);

		//是否代理
		//curl_easy_setopt(request, CURLOPT_PROXY, "10.99.60.201:8080");
		
		dxStatus = curl_easy_perform(request);
		curl_easy_cleanup(request);
		
		return true;
	}
	return false;

	
}

int main(int argc, char* argv[])
{
	// 传入网址 cookie 以及post参数
	SendPost("https://www.lyshark.com/post.php", "1e12sde342r2", "&logintype=uid&u=xieyan&psw=xxx86");


	return 0;
}
```

该函数的调用需要有一个POST结构才可测试，此处由于我并没有指定接口所有返回了页面错误信息，如下图所示；也就是他们Java那帮兄弟定义好的`vo`,请求形式也具体区分JSON格式和表单形式，这里不展开研究了。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124213814984-17008330957917-17167170313059.png)



接着继续实现下载页面到本地的功能，该功能实现的原理是利用`write_data`回调函数，当页面数据被读入到内存时回调函数会被触发，在该回调函数的内部通过调用`fwrite`函数将`ptr`指针中的数据保存本地，实现这段代码如下所示；

```c
#define CURL_STATICLIB
#define BUILDING_LIBCURL
#include <iostream>
#include "curl/curl.h"

#pragma comment (lib,"libcurl_debug.lib")
#pragma comment (lib,"wldap32.lib")
#pragma comment (lib,"ws2_32.lib")
#pragma comment (lib,"Crypt32.lib")

using namespace std;

FILE* stream = NULL;
//存储回调函数
size_t write_data(void* ptr, size_t size, size_t nmemb, void* stream)
{
	
	int written = fwrite(ptr, size, nmemb, (FILE*)stream);
	return written;
}

BOOL SetGet(const char* url, const char* fileName)
{
	CURL* request = NULL;


	curl_global_init(CURL_GLOBAL_ALL);
	request = curl_easy_init();
	if (request)
	{
		//设置请求URL
		curl_easy_setopt(request, CURLOPT_URL, url);

		//在屏幕打印请求连接过程和返回http数据
		curl_easy_setopt(request, CURLOPT_VERBOSE, 1L);

		// 查找次数,防止查找太深
		curl_easy_setopt(request, CURLOPT_MAXREDIRS, 1);

		// 设置连接超时
		curl_easy_setopt(request, CURLOPT_CONNECTTIMEOUT, 3);

		// 接收数据时超时设置
		curl_easy_setopt(request, CURLOPT_TIMEOUT, 3);

		//以写入的权限方式，打开要写入网页内容的文件，操作失败则终止业务！
		fopen_s(&stream, fileName, "w");
		if (stream == NULL)
		{
			curl_easy_cleanup(request);
			return FALSE;
		}

		//CURLOPT_WRITEFUNCTION  将后续的处理服务器响应的动作交给 write_data() 函数处理
		curl_easy_setopt(request, CURLOPT_WRITEFUNCTION, write_data);

		curl_easy_perform(request);
		curl_easy_cleanup(request);
	}

	curl_global_cleanup();
	return true;

	
}

int main(int argc, char* argv[])
{
	// 下载网页到本地
	SetGet("https://www.baidu.com", "./baidu.html");

	if (stream)
	{
		fclose(stream);
	}

	return 0;
}
```

当读者运行上述程序后，即可将`www.baidu.com`网站页面源码，下载到本地当前目录下`baidu.html`，输出效果如下图所示；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124215609792-17008341708068-171671704992210.png)



为了能解析参数，我们还是需要将页面源代码读入到内存中，要实现这个需求并不难，首先我们定义一个std::string容器，然后当有新数据产生时触发`WriteCallback`在该函数内，我们直接将数据拷贝到一个内存指针中，也就是存储到`readBuffer`内，并将该缓冲区返回给调用者即可，如下则是完整源代码。

```c
#define CURL_STATICLIB
#define BUILDING_LIBCURL
#include <iostream>
#include <string>
#include "curl/curl.h"

#pragma comment (lib,"libcurl_debug.lib")
#pragma comment (lib,"wldap32.lib")
#pragma comment (lib,"ws2_32.lib")
#pragma comment (lib,"Crypt32.lib")

using namespace std;

// 存储回调函数
size_t WriteCallback(char* contents, size_t size, size_t nmemb, void* userp)
{
	((std::string*)userp)->append((char*)contents, size * nmemb);
	return size * nmemb;
}

// 获取数据并放入string中.
std::string GetUrlPageOfString(std::string url)
{
	std::string readBuffer;
	CURL* request;

	curl_global_init(CURL_GLOBAL_ALL);
	request = curl_easy_init();
	if (request)
	{
	
		curl_easy_setopt(request, CURLOPT_URL, url.c_str());
		curl_easy_setopt(request, CURLOPT_MAXREDIRS, 1);
		curl_easy_setopt(request, CURLOPT_CONNECTTIMEOUT, 3);
		curl_easy_setopt(request, CURLOPT_TIMEOUT, 3);


		curl_easy_setopt(request, CURLOPT_WRITEFUNCTION, WriteCallback);
		//设置写入数据
		curl_easy_setopt(request, CURLOPT_WRITEDATA, &readBuffer);
		// 忽略证书检查
		curl_easy_setopt(request, CURLOPT_SSL_VERIFYPEER, 0L);
		// 重定向
		curl_easy_setopt(request, CURLOPT_FOLLOWLOCATION, 1);

		curl_easy_perform(request);
		curl_easy_cleanup(request);

		return readBuffer;
	}
	return "None";
}

int main(int argc, char* argv[])
{
	std::string urls = GetUrlPageOfString("https://www.baidu.com");
	std::cout << "接收长度: " << urls.length() << " bytes" << std::endl;
	//cout << urls;
	system("pause");
	return 0;
}

```

如下图所示，则是运行后输出内存数据长度，当然我们也可以直接输出`urls`中的数据，也就是网页的源代码；

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231124220232803-171671707436211.png)

