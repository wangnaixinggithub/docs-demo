# 分析HelloWorld

## 你好窗口

让我们试试能不能让GLFW正常工作。新建一个`.cpp`文件，然后把下面的代码粘贴到该文件的最前面。注意，之所以定义`GLEW_STATIC`宏，是因为我们使用的是GLEW静态的链接库。

```c
#define GLEW_STATIC 
#include <GL/glew.h>
#include <GLFW/glfw3.h> //通常是先include glew 再 include  glfw3 江湖规矩
#include<iostream>
using namespace std;
```

接下来我们创建main函数，在这个函数中我们将会实例化GLFW窗口：

```c
int main()
{
    if (!glfwInit())
    {
        return -1;
    }
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); 
  }
```

首先，我们在main函数中调用`glfwInit()`函数来初始化GLFW，然后我们可以使用`glfwWindowHint()`函数来配置GLFW。



`glfwWindowHint()`函数的第一个参数代表选项的名称，我们可以从很多以`GLFW_`开头的枚举值中选择；第二个参数接受一个整形，用来设置这个选项的值。该函数的所有的选项以及对应的值都可以在 [GLFW’s window handling](http://www.glfw.org/docs/latest/window.html#window_hints) 这篇文档中找到。



如果你现在编译你的`.cpp`文件会得到大量的 *undefined reference* (未定义的引用)错误，也就是说你并未顺利地链接到GLFW库，对于这种错误，相信读者已经养成肌肉记忆了，这里不再延申。



我们知道OpenGL在迭代的过程中衍生了两个模式，核心模式与立即渲染模式。早期的OpenGL使用立即渲染模式，但是效率太低。因此从OpenGL3.2开始，规范文档开始废弃立即渲染模式，推出核心模式(Core-profile)，这个模式完全移除了旧的特性。所以我们需要告诉GLFW我们要使用的OpenGL版本是`3.3（主版本号(Major)和次版本号(Minor)都设为3`，采用核心模式。这样一来，GLFW会在创建OpenGL上下文时做出适当的调整。二来也可以确保用户在没有适当的OpenGL版本支持的情况下无法运行。

再明确告诉GLFW我们使用的是核心模式(Core-profile)，并且不允许用户调整窗口的大小。



这样配置的好处在于，明确告诉GLFW使用核心模式的情况下，使用旧版函数将会导致**invalid operation**(无效操作)的错误，当我们不小心用了旧函数时，该库就会编译报错，就可避免使用一些被废弃的用法了。



如果使用的是Mac OS X系统，你还需要加下面这行代码到你的初始化代码中这些配置才能起作用：

```
lfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
```

> 请确认您的系统支持OpenGL3.3或更高版本，否则此应用有可能会崩溃或者出现不可预知的错误。如果想要查看OpenGL版本的话，在Linux上运行**glxinfo**，或者在Windows上使用其它的工具（例如[OpenGL Extension Viewer](http://download.cnet.com/OpenGL-Extensions-Viewer/3000-18487_4-34442.html)）。如果你的OpenGL版本低于3.3，检查一下显卡是否支持OpenGL 3.3+（不支持的话你的显卡真的太老了），并更新你的驱动程序，有必要的话请更新显卡。



接下来我们创建一个窗口对象，这个窗口对象存放了所有和窗口相关的数据，而且会被GLFW的其他函数频繁地用到。

```c
    GLFWwindow* glfwWindow = NULL; 
     glfwWindow = glfwCreateWindow(800, 600, "JaskonWang", NULL, NULL);
    if (!glfwWindow)
    {
        cout << "创建 GLFW窗口失败!";
        glfwTerminate();
        return -1;
    }
     glfwMakeContextCurrent(glfwWindow);
```

glfwCreateWindow函数需要窗口的宽和高作为它的前两个参数；第三个参数表示这个窗口的名称（标题），这里我们使用`"JaskonWang"`，当然你也可以使用你喜欢的名称；最后两个参数我们暂时忽略，先设置为空指针就行。它的返回值GLFWwindow对象的指针会在其他的GLFW操作中使用到。创建完窗口我们就可以通知GLFW将我们窗口的上下文设置为当前线程的主上下文了。

## GLEW

我们知道`GLEW`是用来管理OpenGL的函数指针的，所以在调用任何OpenGL的函数之前我们需要初始化GLEW。

```c
    glewExperimental = GL_TRUE;
    if (!glfwInit())
    {
        cout << "初始化 GLEW 环境失败" << endl;
        return -1;
    }
```

请注意，我们在初始化GLEW之前设置`glewExperimental`变量的值为`GL_TRUE`，这样做能让GLEW在管理OpenGL的函数指针时更多地使用现代化的技术，如果把它设置为`GL_FALSE`的话可能会在使用OpenGL的核心模式时出现一些问题。





## 视口(Viewport)

在我们开始渲染之前还有一件重要的事情要做，我们必须告诉OpenGL渲染窗口的尺寸大小，这样OpenGL才只能知道怎样相对于窗口大小显示数据和坐标。我们可以通过调用`glViewport()`函数来设置窗口的**维度**(Dimension)：

```c
    int renderWidth = 0;
    int renderHeight = 0; //存OpenGL 渲染窗口的大小。这样OpenGL才只能知道怎样相对于窗口大小显示数据和坐标。
    glfwGetFramebufferSize(glfwWindow,&renderWidth,&renderHeight);
    glViewport(0, 0, renderWidth, renderHeight);
```

`glViewport()`函数前两个参数控制窗口左下角的位置。第三个和第四个参数控制渲染窗口的宽度和高度（像素），这里我们是直接从GLFW中获取的。我们没有直接写死`800*600`，而是查了一遍窗口的宽高，是为了让它在高DPI的屏幕上（比如说Apple的视网膜显示屏）也能[正常工作](http://www.glfw.org/docs/latest/window.html#window_size)。



我们实际上也可以将视口的维度设置为比GLFW的维度小，这样子之后所有的OpenGL渲染将会在一个更小的窗口中显示，从而我们也可以将一些其它元素显示在OpenGL视口之外。



> OpenGL幕后使用`glViewport()`中定义的位置和宽高进行2D坐标的转换，将OpenGL中的位置坐标转换为你的屏幕坐标。例如，OpenGL中的坐标(-0.5, 0.5)有可能（最终）被映射为屏幕中的坐标(200,450)。注意，处理过的OpenGL坐标范围只为-1到1，因此我们事实上将(-1到1)范围内的坐标映射到(0, 800)和(0, 600)。



## 准备好你的引擎

我们可不希望只绘制一个图像之后我们的应用程序就立即退出并关闭窗口。我们希望程序在我们明确地关闭它之前不断绘制图像并能够接受用户输入。因此，我们需要在程序中添加一个while循环，我们可以把它称之为游戏循环(Game Loop)，它能在我们让GLFW退出前一直保持运行。下面几行的代码就实现了一个简单的游戏循环,可以对比理解WIN32窗口的消息处理机制。

```c
    while (!glfwWindowShouldClose(glfwWindow))
    {
    	glfwPollEvents();
        glfwSwapBuffers(glfwWindow);
    }
```

- `glfwWindowShouldClose()`函数在我们每次循环的开始前会查一次GLFW是否被要求退出，如果是的话该函数返回`true` 然后游戏循环便结束了，之后为我们就可以关闭应用程序了。
- `glfwPollEvents()`函数检查有没有触发什么用户事件（比如说键盘输入、鼠标移动等），然后调用对应的回调函数（可以通过回调方法手动设置），通常我们会在游戏循环之前，给窗口绑定一些用户事件的回调处理函数。
- `glfwSwapBuffers()`函数会交换颜色缓冲（它是一个储存着GLFW窗口每一个像素颜色的大缓冲），它在这一迭代中被用来绘制，并且将会作为输出显示在屏幕上。

> **双缓冲(Double Buffer)**
>
> 应用程序使用单缓冲绘图时可能会存在图像闪烁的问题。 这是因为生成的图像不是一下子被绘制出来的，而是按照从左到右，由上而下逐像素地绘制而成的。最终图像不是在瞬间显示给用户，而是通过一步一步生成的，这会导致渲染的结果很不真实。为了规避这些问题，我们应用双缓冲渲染窗口应用程序。**前**缓冲保存着最终输出的图像，它会在屏幕上显示；而所有的的渲染指令都会在**后**缓冲上绘制。当所有的渲染指令执行完毕后，我们**交换**(Swap)前缓冲和后缓冲，这样图像就立即呈显出来，之前提到的不真实感就消除了。



## 最后一件事

当游戏循环结束后我们需要正确释放/删除之前的分配的所有资源。我们可以在main函数的最后调用`glfwTerminate()`函数来释放GLFW分配的内存。

```c
glfwTerminate();
return 0;
```

样便能清理所有的资源并正确地退出应用程序。现在你可以尝试编译并运行你的应用程序了，如果没做错的话，你将会看到如下的输出：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223093432932-17167328319891.png)

如果你看见了一个非常无聊的黑色窗口，那么就对了！如果你没得到正确的结果，或者你不知道怎么把所有东西放到一起，请参考如下源代码。

```c
#define GLEW_STATIC 
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include<iostream>
using namespace std;

//键盘回调函数
void keyCallback(GLFWwindow* window, int key, int scancode, int action, int mode);



int main(void)
{

    GLFWwindow* glfwWindow = NULL; //Open展示的窗口对象，这个窗口对象存放了所有和窗口相关的数据，而且会被GLFW的其他函数频繁地用到
    int renderWidth = 0;
    int renderHeight = 0; //存OpenGL 渲染窗口的大小。这样OpenGL才只能知道怎样相对于窗口大小显示数据和坐标。
    
    glewExperimental = GL_TRUE;
    if (!glfwInit())
    {
        cout << "初始化 GLEW 环境失败" << endl;
        return -1;
    }

 

    //窗口基本设定
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); 
    

    //窗口创建，并和当前线程整合
    glfwWindow = glfwCreateWindow(800, 600, "JaskonWang", NULL, NULL);
    if (!glfwWindow)
    {
        cout << "创建 GLFW窗口失败!";
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(glfwWindow);


    //设置窗口的键盘事件回调
    glfwSetKeyCallback(glfwWindow, keyCallback);


    //查窗口的大小，将其作为OpenGL渲染窗口的尺寸大小，并把左下角点坐标位置设置为(0,0)
    glfwGetFramebufferSize(glfwWindow,&renderWidth,&renderHeight);
    glViewport(0, 0, renderWidth, renderHeight);



  
    //实现游戏循环，能在我们让GLFW退出前一直保持运行，直到用户关闭窗口 
    while (!glfwWindowShouldClose(glfwWindow))
    {
        //查有没有触发什么事件（比如键盘输入、鼠标移动等），然后调用对应的回调函数
        glfwPollEvents();


        /* 从这里开始渲染 */
        //TODO SomeThing in Here!
        


        //清空颜色缓冲，并设置颜色为深绿色
        glClear(GL_COLOR_BUFFER_BIT);
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);

        
       //交换颜色缓冲
        glfwSwapBuffers(glfwWindow);


    }

    //释放GLFW分配的内存 和资源。
    glfwTerminate();


    return 0;
}


void keyCallback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    //抓用户点击了ESC键，并关闭窗口
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
    {
        cout << "用户按下了ECS键" << endl;
        glfwSetWindowShouldClose(window, GL_TRUE);
    }
      
}
```

## 输入

我们同样也希望能够在GLFW中实现一些键盘控制，这可以通过使用GLFW的回调函数(Callback Function)来完成。回调函数事实上是一个函数指针。当我们设置好后，GLWF会在合适的时候调用它。**按键回调**(KeyCallback)只是众多回调函数中的一种。当我们设置了按键回调之后，GLFW会在用户有键盘交互时调用它。该回调函数的原型如下所示：

```c
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);
```

按键回调函数接受一个`GLFWwindow`指针作为它的第一个参数；第二个整形参数用来表示按下的按键；`action`参数表示这个按键是被按下还是释放；最后一个整形参数表示是否有Ctrl、Shift、Alt、Super等按钮的操作。GLFW会在合适的时候调用它，并为各个参数传入适当的值。

```c
void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    //如果用户按下了ESC键，则将window窗口的属性windowShouldColse 设置为true,从而关闭窗口
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
    {
        cout << "用户按下了ECS键" << endl;
        glfwSetWindowShouldClose(window, GL_TRUE);
    }
      
}
```

在我们（新创建的）key_callback函数中，我们检测了键盘是否按下了Escape键。如果键的确按下了(不释放)，我们使用glfwSetwindowShouldClose函数设定`WindowShouldClose`属性为`true`从而关闭GLFW。main函数的`while`循环下一次的检测将为失败，程序就关闭了。

最后一件事就是通过GLFW注册我们的函数至合适的回调，代码是这样的:

```c
glfwSetKeyCallback(window, key_callback);  
```

除了按键回调函数之外，我们还能我们自己的函数注册其它的回调。例如，我们可以注册一个回调函数来处理窗口尺寸变化、处理一些错误信息等。我们可以在创建窗口之后，开始游戏循环之前注册各种回调函数。

## 渲染

我们要把所有的渲染(Rendering)操作放到游戏循环中，因为我们想让这些渲染指令在每次游戏循环迭代的时候都能被执行。代码将会是这样的：

```c
// 程序循环
while(!glfwWindowShouldClose(window))
{
    // 检查事件
    glfwPollEvents();

    // 渲染指令
    ...

    // 交换缓冲
    glfwSwapBuffers(window);
}
```

为了测试一切都正常工作，我们使用一个自定义的颜色清空屏幕。在每个新的渲染迭代开始的时候我们总是希望清屏，否则我们仍能看见上一次迭代的渲染结果（这可能是你想要的效果，但通常这不是）。我们可以通过调用`glClear()`函数来清空屏幕的颜色缓冲，它接受一个缓冲位(Buffer Bit)来指定要清空的缓冲，可能的缓冲位有GL_COLOR_BUFFER_BIT，GL_DEPTH_BUFFER_BIT和GL_STENCIL_BUFFER_BIT。由于现在我们只关心颜色值，所以我们只清空颜色缓冲。

```c
glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
glClear(GL_COLOR_BUFFER_BIT);
```

注意，除了`glClear()`之外，我们还调用了`glClearColor()`来设置清空屏幕所用的颜色。当调用`glClear()`函数，清除颜色缓冲之后，整个颜色缓冲都会被填充为`glClearColor()`里所设置的颜色。在这里，我们将屏幕设置为了类似黑板的深蓝绿色。





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223093918432-17167328493932.png)
