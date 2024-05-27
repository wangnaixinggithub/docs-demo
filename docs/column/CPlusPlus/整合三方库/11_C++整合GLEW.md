# C++整合GLEW

我们在上一篇文章已经配置好了`glfw`库，但是还需要一些操作才能使用现代OpenGL。按照惯例，先说说为什么要配置`glew`库。我们已经知道OpenGL只是一个规范，其本身并没有实现这些方法，具体的实现是由驱动开发商针对特定显卡实现的。所以如果我们要使用这些函数就需要手动获取这些函数。这个过程繁杂且无法实现跨平台，幸运的是有一些现成的库可以帮我们访问显卡驱动，取得对应函数的函数指针并链接起来，比如我们要现在要配置使用的GLEW。下面我们来看看怎么配置GLEW库。


# 官网下载

我们不下载源码，直接下载人家整合好的包二进制包，即lib包。

```
https://glew.sourceforge.net/
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223084951003-17167178745191.png)

# 工程整合

读者下载解压归档zip文件后，可以看到如下目录层级，已经涵盖了，我们需要的lib和include文件夹。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223085849398-17032931301931-17167178976232.png)







之后读者并自行配置整合。笔者配置的库目录的附加依赖项如下所示：

- 附加库目录以及附加依赖项：`C:\cpp\GLEW\lib\Win32`
  - glew32s.lib
- 头文件包含目录:`C:\cpp\GLEW\include`



# 验证可行

新建一个空项目，并构建一个`.cpp `文件，编写如下 `main()` 入口函数逻辑代码。

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


    /* 初始化OpenGL环境 */
    if (!glfwInit())
    {
        return -1;
    }

    /*窗口基本设置 https://www.glfw.org/docs/latest/window.html#window_hints */

    //主版本号(Major)和次版本号(Minor)都设为3
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    //明确告诉GLFW我们使用的是核心模式(Core-profile)
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    //不允许用户调整窗口的大小
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    //Mac OS X系统，你还需要额外加下面这行代码到你的初始化代码中，上述这些配置才能起作用
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); 
    



    //创建模态窗口 以及 OpenGL 上下文
    glfwWindow = glfwCreateWindow(800, 600, "JaskonWang", NULL, NULL);
    if (!glfwWindow)
    {
        cout << "创建 GLFW窗口失败!";
        glfwTerminate();
        return -1;
    }

    //通知GLFW将我们窗口的上下文设置为当前线程的主上下文了
    glfwMakeContextCurrent(glfwWindow);


    //设置键盘事件回调
    glfwSetKeyCallback(glfwWindow, keyCallback);


    //查窗口的大小，将其作为OpenGL渲染窗口的尺寸大小，并把左下角点坐标位置设置为(0,0)
    glfwGetFramebufferSize(glfwWindow,&renderWidth,&renderHeight);
    cout << "renderWidth" << renderWidth << endl;
    cout << "renderHeight" << renderHeight << endl;
    glViewport(0, 0, renderWidth, renderHeight);
    //OpenGL幕后使用glViewport中定义的位置和宽高进行2D坐标的转换，将OpenGL中的位置坐标转换为你的屏幕坐标。例如，OpenGL中的坐标(-0.5, 0.5)有可能（最终）被映射为屏幕中的坐标(200,450)。
    // 注意，处理过的OpenGL坐标范围只为-1到1，因此我们事实上将(-1到1)范围内的坐标映射到(0, 800)和(0, 600)。


  
    //实现游戏循环，能在我们让GLFW退出前一直保持运行，直到用户关闭窗口 
    while (!glfwWindowShouldClose(glfwWindow))
    {
        //查有没有触发什么事件（比如键盘输入、鼠标移动等），然后调用对应的回调函数
        glfwPollEvents();


        /* 从这里开始渲染 */
        
        //在每个新的渲染迭代开始的时候我们总是希望清屏，否则将会看到上一次迭代的渲染结果

        //清空颜色缓冲
        glClear(GL_COLOR_BUFFER_BIT);


        glBegin(GL_TRIANGLES);
        glVertex2f(-0.5f,-0.5f);
        glVertex2f(0.0f,0.5f);
        glVertex2f(0.5f,-0.5f);
        glEnd();


   

        
       //交换颜色缓冲（它是一个储存着GLFW窗口每一个像素颜色的大缓冲），它在这一迭代中被用来绘制，并且将会作为输出显示在屏幕上。
        glfwSwapBuffers(glfwWindow);


    }

    //释放GLFW分配的内存 和资源。
    glfwTerminate();


    return 0;
}


void keyCallback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    //如果用户按下了ESC键，则将window窗口的属性windowShouldColse 设置为true,从而关闭窗口
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
    {
        cout << "用户按下了ECS键" << endl;
        glfwSetWindowShouldClose(window, GL_TRUE);
    }
      
}
```

运行如果能正确出现如下结果，即代表整合完成！

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223090300073-17032933814862-17167179128143.png)