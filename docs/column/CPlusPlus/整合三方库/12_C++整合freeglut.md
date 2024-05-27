# C++整合freeglut

学习OpenGL编程首先需要可以跟着书中的示例代码进行学习。书中使用[GLUT](https://so.csdn.net/so/search?q=GLUT&spm=1001.2101.3001.7020)作为示例代码的演示，GLUT于1998年作者不在维护并不开源，freeglut是一个完美的代替方案。以后我们将会通过freeglut来重现书中的示例代码。(⊙﹏⊙)，想不到企业级开发居然还有人导入这个glut包，😔水真深。



# freeglut下载及MSVC编译安装

```
官网：https://freeglut.sourceforge.net/index.php#download
GitHub托管：https://github.com/freeglut/freeglut/releases
```

解压下载完成的源代码，放入到自己的准备好的文件夹下；在文件夹下创建和两个文件夹，用来存放编译内容和安装内容。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240101095314640-17040747422368-17167179497101.png)



打开Cmake GUI进行编译及生成操作，期间需要修改本地的编译环境。和配置时取齐。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240101100119445-17040744802782-17040746731066-17167179632212.png)

# HelloWorld

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240101100223723-17040746761487-17167179786133.png)

```c
#include <iostream>
#include "GL/freeglut.h"
#pragma comment(lib,"freeglut.lib")

void myDisplay(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	glColor3f(0.5, 0.5, 0.5);
	static float sc = 1.0;
	glRectf(-0.5f * sc, -0.5f * sc, 0.5f * sc, 0.5f * sc);
	sc = sc * 1.01;
	glFlush();
}

void timerProc(int id)
{
	myDisplay();
	glutTimerFunc(33, timerProc, 1);//需要在函数中再调用一次，才能保证循环
}

int main(int argc, char* argv[])

{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE);
	glutInitWindowPosition(100, 100);
	glutInitWindowSize(400, 400);
	glutCreateWindow("第一个OpenGL程序");
	glutDisplayFunc(&myDisplay);
	glutTimerFunc(33, timerProc, 1);
	glutMainLoop();
	return 0;
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E7%AC%AC%E4%B8%80%E4%B8%AAFreeGult%E7%A8%8B%E5%BA%8F-17167179907504.gif)