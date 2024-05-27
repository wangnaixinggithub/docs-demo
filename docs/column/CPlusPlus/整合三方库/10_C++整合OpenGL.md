# C++整合OpenGL库

在开始之前我们先了解一下OpenGL到底是什么？



一般它被认为是一个API(Application Programming Interface, 应用程序编程接口)，包含了一系列可以操作图形、图像的函数。然而，OpenGL本身并不是一个API，它仅仅是一个由[Khronos组织](http://www.khronos.org/)制定并维护的**规范**(Specification)。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/opengl-17167175983361.jpg)



OpenGL规范严格规定了每个函数该如何执行，以及它们的输出值。至于内部具体每个函数是如何实现(Implement)的，将由OpenGL库的开发者自行决定（注：这里开发者是指编写OpenGL库的人）。因为OpenGL规范并没有规定实现的细节，具体的OpenGL库允许使用不同的实现，只要其功能和结果与规范相匹配（亦即，作为用户不会感受到功能上的差异）。

实际的OpenGL库的开发者通常是显卡的生产商。你购买的显卡所支持的OpenGL版本都为这个系列的显卡专门开发的。当你使用Apple系统的时候，OpenGL库是由Apple自身维护的。在Linux下，有显卡生产商提供的OpenGL库，也有一些爱好者改编的版本。这也意味着任何时候OpenGL库表现的行为与规范规定的不一致时，基本都是库的开发者留下的bug。



> **由于OpenGL的大多数实现都是由显卡厂商编写的，当产生一个bug时通常可以通过升级显卡驱动来解决。这些驱动会包括你的显卡能支持的最新版本的OpenGL，这也是为什么总是建议你偶尔更新一下显卡驱动。**







# 官网下载

```shel
下载地址：https://www.glfw.org/download.html
文档地址：https://www.glfw.org/documentation.html
学习地址：https://learnopengl-cn.readthedocs.io/
```

注意：根据大佬们所说，32位是当前比较稳定版本，所以建议使用32位的。（这里的32位不是你的电脑位数）

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223004520427-17032635212612-17167176246702.png)









# 和项目整合

配置下库目录和包含目录，以及附加依赖项。建议在配置时选择所有配置和所有平台。以达到一次配置全通用的目的。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223005806324-17032642873755-17167176380153.png)





以下是静态库的整合，动态库其实也很简单，就是把`glfw3.lib` 改为`glfw3dll.lib`,并把`glfw3.dll` 放到和项目最终得到的可执行文件同级，即可，这里不做展开。

- C:\cpp\GLFW\include
- C:\cpp\GLFW\lib-vc2022

```
glfw3.lib
user32.lib
Gdi32.lib
Shell32.lib
Opengl32.lib
```

如果遇到这样错误，代表库可以用，但是在和项目`exe` 做链接时发生了错误， 即OpenGL库里面的函数用到了其他库的函数。而项目本身没有提供其他库函数的实现。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223004846578-17167176493034.png)



通常这种情况，我们可以可以针对该函数进行搜索。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223005055373-17032638564223-17167176746865.png)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223005146652-17167176878626.png)



进一步查到该函数依赖的静态库，在附加依赖项中给他补充进去。再构建，就会发现错误少了很多，重复操作即可解决问题。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223005210007-17032639311594-17167176998227.png)



```c
#include <GLFW/glfw3.h>
#include<iostream>
using namespace std;
int main(void)
{
    GLFWwindow* window = NULL;

    /* 初始化OpenGL环境 */
    if (!glfwInit())
    {
        return -1;
    }


    /* 创建模态窗口 以及 OpenGL 上下文*/
    window = glfwCreateWindow(640, 480, "Hello World", NULL, NULL);
    if (!window)
    {
        cout << "创建模态窗口失败!";
        glfwTerminate();
        return -1;
    }

    /*将窗口的上下文设置为当前 */
    glfwMakeContextCurrent(window);

    /* 循环，直到用户关闭窗口 */
    while (!glfwWindowShouldClose(window))
    {

        /* 从这里开始渲染 */
        glClear(GL_COLOR_BUFFER_BIT);

        
        glBegin(GL_TRIANGLES);
        glVertex2f(-0.5f,-0.5f);
        glVertex2f(0.0f,0.5f);
        glVertex2f(0.5f,-0.5f);
        glEnd();
        
        /* 交换前台和后台缓冲区 */
        glfwSwapBuffers(window);


        /* 轮询和处理事件 */
        glfwPollEvents();
    }

    /*销毁OpenGL环境*/
    glfwTerminate();
    return 0;
}
```

运行程序之后，成功画出来的三角形。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231223005838449-17032643192536-17167177271108.png)