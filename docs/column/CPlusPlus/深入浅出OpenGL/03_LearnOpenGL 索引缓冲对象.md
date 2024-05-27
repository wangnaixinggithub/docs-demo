

# 索引缓冲对象

在渲染顶点这一话题上我们还有最有一个需要讨论的东西——索引缓冲对象(Element Buffer Object，EBO，也叫Index Buffer Object，IBO)。要解释索引缓冲对象的工作方式最好还是举个例子：假设我们不再绘制一个三角形而是绘制一个矩形。我们可以绘制两个三角形来组成一个矩形（OpenGL主要处理三角形）。这会生成下面的顶点的集合：

```c
GLfloat vertices[] = {
    // 第一个三角形
    0.5f, 0.5f, 0.0f,   // 右上角
    0.5f, -0.5f, 0.0f,  // 右下角
    -0.5f, 0.5f, 0.0f,  // 左上角
    // 第二个三角形
    0.5f, -0.5f, 0.0f,  // 右下角
    -0.5f, -0.5f, 0.0f, // 左下角
    -0.5f, 0.5f, 0.0f   // 左上角
};
```

可以看到，有几个顶点叠加了。我们指定了`右下角`和`左上角`两次！一个矩形只有4个而不是6个顶点，这样就产生50%的额外开销。当我们有包括上千个三角形的模型之后这个问题会更糟糕，这会产生一大堆浪费。更好的解决方案是只储存不同的顶点，并设定绘制这些顶点的顺序。这样子我们只要储存4个顶点就能绘制矩形了，之后只要指定绘制的顺序就行了。如果OpenGL提供这个功能就好了，对吧？



很幸运，索引缓冲对象的工作方式正是这样的。和顶点缓冲对象一样，EBO也是一个缓冲，它专门储存索引，OpenGL调用这些顶点的索引来决定该绘制哪个顶点。所谓的索引绘制(Indexed Drawing)正是我们问题的解决方案。首先，我们先要定义（独一无二的）顶点，和绘制出矩形所需的索引：

```c
GLfloat vertices[] = {
    0.5f, 0.5f, 0.0f,   // 右上角
    0.5f, -0.5f, 0.0f,  // 右下角
    -0.5f, -0.5f, 0.0f, // 左下角
    -0.5f, 0.5f, 0.0f   // 左上角
};

GLuint indices[] = { // 注意索引从0开始! 
    0, 1, 3, // 第一个三角形
    1, 2, 3  // 第二个三角形
};
```

你可以看到，当时用索引的时候，我们只定义了4个顶点，而不是6个。下一步我们需要创建索引缓冲对象：

```c
GLuint EBO;
glGenBuffers(1, &EBO);
```

与VBO类似，我们先绑定EBO然后用`glBufferData()`把索引复制到缓冲里。同样，和VBO类似，我们会把这些函数调用放在绑定和解绑函数调用之间，只不过这次我们把缓冲的类型定义为`GL_ELEMENT_ARRAY_BUFFER`。

```c
glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW); 
```

要注意的是，我们传递了GL_ELEMENT_ARRAY_BUFFER当作缓冲目标。最后一件要做的事是用`glDrawElements()`来替换`glDrawArrays()`函数，来指明我们从索引缓冲渲染。使用`glDrawElements()`时，我们会使用当前绑定的索引缓冲对象中的索引进行绘制:

```c
//  glDrawArrays(GL_TRIANGLES, 0, 3);
glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
```

第一个参数指定了我们绘制的模式，这个和`glDrawArrays()`的一样。

第二个参数是我们打算绘制顶点的个数，这里填6，也就是说我们一共需要绘制6个顶点。

第三个参数是索引的类型，这里是GL_UNSIGNED_INT。最后一个参数里我们可以指定EBO中的偏移量（或者传递一个索引数组，但是这是当你不在使用索引缓冲对象的时候），但是我们会在这里填写0。



`glDrawElements()`函数从当前绑定到GL_ELEMENT_ARRAY_BUFFER目标的EBO中获取索引。这意味着我们必须在每次要用索引渲染一个物体时绑定相应的EBO，这还是有点麻烦。不过顶点数组对象同样可以保存索引缓冲对象的绑定状态。VAO绑定时正在绑定的索引缓冲对象会被保存为VAO的元素缓冲对象。绑定VAO的同时也会自动绑定EBO。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231225204500571-17035083016921-17167329947021.png)

> 当目标是GL_ELEMENT_ARRAY_BUFFER的时候，VAO会储存`glBindBuffer()`的函数调用。这也意味着它也会储存解绑调用，所以确保你没有在解绑VAO之前解绑索引数组缓冲，否则它就没有这个EBO配置了。

最后的初始化和绘制代码现在看起来像这样：

```c
// ..:: 初始化代码 :: ..
// 1. 绑定顶点数组对象
glBindVertexArray(VAO);
    // 2. 把我们的顶点数组复制到一个顶点缓冲中，供OpenGL使用
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    // 3. 复制我们的索引数组到一个索引缓冲中，供OpenGL使用
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);
    // 3. 设定顶点属性指针
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid*)0);
    glEnableVertexAttribArray(0);
// 4. 解绑VAO（不是EBO！）
glBindVertexArray(0);

[...]

// ..:: 绘制代码（游戏循环中） :: ..

glUseProgram(shaderProgram);
glBindVertexArray(VAO);
glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0)
glBindVertexArray(0);
```

运行程序会获得下面这样的图片的结果。左侧图片看应该起来很熟悉，而右侧的则是使用线框模式(Wireframe Mode)绘制的。线框矩形可以显示出矩形的确是由两个三角形组成的。

> **线框模式(Wireframe Mode)**
>
> 要想用线框模式绘制你的三角形，你可以通过`glPolygonMode(GL_FRONT_AND_BACK, GL_LINE)`函数配置OpenGL如何绘制图元。第一个参数表示我们打算将其应用到所有的三角形的正面和背面，第二个参数告诉我们用线来绘制。之后的绘制调用会一直以线框模式绘制三角形，直到我们用`glPolygonMode(GL_FRONT_AND_BACK, GL_FILL)`将其设置回默认模式。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231225204603840-17167330181762.png)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231225204700145.png)



这里同样也提供笔者的一个实现。

```c
#include <iostream>

#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);

// 窗口维度
const GLuint WIDTH = 800;
const GLuint HEIGHT = 600;

// Shaders
const GLchar* vertexShaderSource = 
"#version 330 core\n"
"layout (location = 0) in vec3 position;\n"
"void main()\n"
"{\n"
"gl_Position = vec4(position.x, position.y, position.z, 1.0);\n"
"}\0";
const GLchar* fragmentShaderSource = 
"#version 330 core\n"
"out vec4 color;\n"
"void main()\n"
"{\n"
"color = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
"}\n\0";


int main()
{
    GLfloat vertices[] = {
     0.5f, 0.5f, 0.0f,   // 右上角
     0.5f, -0.5f, 0.0f,  // 右下角
     -0.5f, -0.5f, 0.0f, // 左下角
     -0.5f, 0.5f, 0.0f   // 左上角
    };

    GLuint indices[] = { // 注意索引从0开始! 
        0, 1, 3, // 第一个三角形
        1, 2, 3  // 第二个三角形
    };



    GLFWwindow* window = nullptr;
    int viewHeight = 0;
    int viewWidth = 0;
    GLuint vertexShader;//顶点作色器
    GLuint fragmentShader;//颜色片段作色器
    GLuint shaderProgram;//着色器程序
    GLuint VBO; //顶点缓冲对象
    GLuint VAO;//顶点数组对象
    GLuint EBO; // 索引缓冲对象

    GLint bSuc;
    GLchar szInfoLog[512];

    std::cout << "启动 GLFW 上下文,版本 OpenGL 3.3" << std::endl;
    if (!glfwInit())
    {
        return false;
    }


    //创建GLFW窗口，并进行一些初始化工作
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR,3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR,3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    window = glfwCreateWindow(WIDTH,HEIGHT,"JacksonWang",nullptr,nullptr);
    glfwMakeContextCurrent(window);
    glfwSetKeyCallback(window, key_callback);

    glewExperimental = GL_TRUE;
    glewInit();
    
    //定义视图维度
    glfwGetFramebufferSize(window,&viewWidth,&viewHeight);
    glViewport(0, 0, viewWidth, viewHeight);


    //构建顶点着色器对象，完成顶点作色器源码和着色器对象的绑定，并进行编译工作
    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(vertexShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译顶点着色器，请核查顶点着色器源码!\n" << szInfoLog << std::endl;
    }
  
    //构建颜色片段着色器对象，完成颜色片段着色器源码和颜色片段着色器的绑定，并进行编译任务。
    fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader,1,&fragmentShaderSource,NULL);
    glCompileShader(fragmentShader);
    glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(fragmentShader,512,NULL,szInfoLog);
        std::cout << "错误！无法编译片段着色器，请核查片段着色器源码!\n" << szInfoLog << std::endl;
    }

    //构建作色器程序对象，并由他完成对顶点作色器、颜色作色器的链接工作
    shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram,vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);
    glGetProgramiv(shaderProgram, GL_LINK_STATUS,&bSuc);
    if (!bSuc)
    {
        glGetProgramInfoLog(shaderProgram, 512, NULL, szInfoLog);
        std::cout << "错误! 无法完成链接任务，请核查着色器程序链接着色器情况！\n" << szInfoLog << std::endl;
    }

    //当下，所有工作由作色器程序来干。作色器可以先删除了
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);


    //创建顶点缓冲对象
    glGenBuffers(1,&VBO);
    glGenVertexArrays(1, &VAO);

    //绑定VAO
    glBindVertexArray(VAO);

    //顶点数据集 和顶点缓冲对象 绑定,
    glBindBuffer(GL_ARRAY_BUFFER,VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);


    //创建索引缓冲对象
    glGenBuffers(1, &EBO);

    //索引数据集 和索引缓冲对象 绑定，
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);



    //设置顶点属性指针
    glVertexAttribPointer(0,3, GL_FLOAT,GL_FALSE,3*sizeof(GLfloat),(GLvoid*)0);
    glEnableVertexAttribArray(0);


    
    //顶点缓冲对象解绑，顶点数组对象解绑
    glBindBuffer(GL_ARRAY_BUFFER, 0);
    glBindVertexArray(0);

   

    while (!glfwWindowShouldClose(window))
    {
        glfwPollEvents();

        glClearColor(0.2f,0.3f,0.3f,1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        glUseProgram(shaderProgram);
        glBindVertexArray(VAO);

       glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
      // glPolygonMode(GL_FRONT_AND_BACK, GL_LINE); //启动线框模式

        glBindVertexArray(0);

        glfwSwapBuffers(window);
    }


    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glfwTerminate();
   


}



void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, GL_TRUE);
    }
       
}
```

如果你像我这样成功绘制出了这个三角形或矩形，那么恭喜你，你成功地通过了现代OpenGL最难部分之一：绘制你自己的第一个三角形。这部分很难，因为在可以绘制第一个三角形之前你需要了解很多知识。幸运的是我们现在已经越过了这个障碍，接下来的教程会比较容易理解一些。下面让我们继续做一些练习来巩固一下学到的东西。



# 尝试绘制两个彼此相连的三角形

添加更多顶点到数据中，使用`glDrawArrays()`，尝试绘制两个彼此相连的三角形

在你好，三角形一节中已经演示了如何渲染出来一个三角形。我们只需要修改顶点集，就可以完成此需求了。

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>

// GLFW
#include <GLFW/glfw3.h>


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);

// 窗口维度
const GLuint WIDTH = 800, HEIGHT = 600;

// 着色器源码
const GLchar* vertexShaderSource = "#version 330 core\n"
"layout (location = 0) in vec3 position;\n"
"void main()\n"
"{\n"
"gl_Position = vec4(position.x, position.y, position.z, 1.0);\n"
"}\0";
const GLchar* fragmentShaderSource = "#version 330 core\n"
"out vec4 color;\n"
"void main()\n"
"{\n"
"color = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
"}\n\0";

int main()
{
      std::cout << "启动 GLFW 上下文,版本 OpenGL 3.3" << std::endl;
    
    GLFWwindow* window = nullptr;
    int viewWidth = 0;
    int viewHeight = 0;
    GLuint vertexShader;
    GLuint fragmentShader;
    GLuint shaderProgram;
    GLuint VBO;
    GLuint VAO;

    GLint bSuc;
    GLchar szInfoLog[512];


    // 初始化 GLFW
    glfwInit();
    // 设置GLFW 所有必要设定
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

    // 创建GLFW窗口，以便我们更好使用GLFW函数
    window = glfwCreateWindow(WIDTH, HEIGHT, "JacksonWang", nullptr, nullptr);
    glfwMakeContextCurrent(window);

    // 设置GLFW的鼠标回调
    glfwSetKeyCallback(window, key_callback);

    // 将其设置为TRUE，以便Glew知道使用现代方法来检索函数指针和扩展
    glewExperimental = GL_TRUE;

    //初始化 GLEW
    glewInit();

   //设置视口维度
    glfwGetFramebufferSize(window, &viewWidth, &viewHeight);
    glViewport(0, 0, viewWidth, viewHeight);
    
    //顶点作色器初始化
    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(vertexShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译顶点着色器，请核查顶点着色器源码!\n" << szInfoLog << std::endl;
    }
    // 片段作色器初始化
    fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);
    glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(fragmentShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译片段着色器，请核查片段着色器源码!\n" << szInfoLog << std::endl;
    }

    // 作色器程序 开始整合顶点、片段作色器。
    shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);
    glGetProgramiv(shaderProgram, GL_LINK_STATUS, &bSuc);
    if (!bSuc) {
        glGetProgramInfoLog(shaderProgram, 512, NULL, szInfoLog);
        std::cout << "错误! 无法完成链接任务，请核查着色器程序链接着色器情况！\n" << szInfoLog << std::endl;
    }
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);
 
    //构建顶点数据集
    GLfloat vertices[] = {
        // 第一个三角形
        -0.9f, -0.5f, 0.0f,  // Left 
        -0.0f, -0.5f, 0.0f,  // Right
        -0.45f, 0.5f, 0.0f,  // Top 
       
        // 第二个三角形
         0.0f, -0.5f, 0.0f,  // Left
         0.9f, -0.5f, 0.0f,  // Right
         0.45f, 0.5f, 0.0f   // Top 
    };
    
    //创建顶点缓冲对象、顶点数组对象
    glGenBuffers(1, &VBO);
    glGenVertexArrays(1, &VAO);

    //绑定VAO
    glBindVertexArray(VAO);

    //VBO和顶点数据集绑定
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    //设置顶点属性指针，主要完成了CPU中数据直接一口气发给GPU，此后数据的管理由GPU负责。
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid*)0);
    //激活，允许顶点着色器直接读取GPU管理的数据
    glEnableVertexAttribArray(0);

    //做解绑工作
    glBindBuffer(GL_ARRAY_BUFFER, 0); 
    glBindVertexArray(0); 


    while (!glfwWindowShouldClose(window))
    {
        //渲染前的准备工作，观察下有没有回调被激活
        glfwPollEvents();

        //清空已经绘制的内容
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        //注入作色器程序
        glUseProgram(shaderProgram);

        //启用VAO绑定,GPU开始干活。
        glBindVertexArray(VAO);

        //绘制一个三角形，从顶点0开始，一共有六个顶点。
        glDrawArrays(GL_TRIANGLES, 0, 6);

        //GPU干完或了，解绑VAO
        glBindVertexArray(0);

        //前后台数据交换渲染显示
        glfwSwapBuffers(window);
    }
   
    //删除VBO,VBO,释放GLFW资源。 
    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glfwTerminate();
    return 0;
}


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, GL_TRUE);
    }

}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231225212745540-17035108667064-17167330513843.png)



# 多个VAO VBO情况

在上个练习的继承上，还是创建相同的两个三角形，但对它们的数据使用不同的VAO和VBO



最终的结果，和上图是一样的。只是说，让读者需要使用多个VAO,VBO处理多个数据集。因为实际开发中，数据集的数量通常大于1个，意味着往往我们要处理多组数据。

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>

// GLFW
#include <GLFW/glfw3.h>


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);

//窗口维度
const GLuint WIDTH = 800, HEIGHT = 600;


//顶点作色器源码
const GLchar* vertexShaderSource = "#version 330 core\n"
"layout (location = 0) in vec3 position;\n"
"void main()\n"
"{\n"
"gl_Position = vec4(position.x, position.y, position.z, 1.0);\n"
"}\0";
const GLchar* fragmentShaderSource = "#version 330 core\n"
"out vec4 color;\n"
"void main()\n"
"{\n"
"color = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
"}\n\0";


int main()
{
    std::cout << "启动 GLFW 上下文,版本 OpenGL 3.3" << std::endl;

    GLFWwindow* window = nullptr;
    int viewWidth = 0;
    int viewHeight = 0;
    GLuint vertexShader;
    GLuint fragmentShader;
    GLuint shaderProgram;
    GLuint VBO;
    GLuint VAO;

    GLint bSuc;
    GLchar szInfoLog[512];


    // 初始化 GLFW
    glfwInit();
    // 设置GLFW 所有必要设定
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

    // 创建GLFW窗口，以便我们更好使用GLFW函数
    window = glfwCreateWindow(WIDTH, HEIGHT, "JacksonWang", nullptr, nullptr);
    glfwMakeContextCurrent(window);

    // 设置GLFW的鼠标回调
    glfwSetKeyCallback(window, key_callback);

    // 将其设置为TRUE，以便Glew知道使用现代方法来检索函数指针和扩展
    glewExperimental = GL_TRUE;

    //初始化 GLEW
    glewInit();

    //设置视口维度
    glfwGetFramebufferSize(window, &viewWidth, &viewHeight);
    glViewport(0, 0, viewWidth, viewHeight);

    //顶点作色器初始化
    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(vertexShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译顶点着色器，请核查顶点着色器源码!\n" << szInfoLog << std::endl;
    }
    // 片段作色器初始化
    fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);
    glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(fragmentShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译片段着色器，请核查片段着色器源码!\n" << szInfoLog << std::endl;
    }

    // 作色器程序 开始整合顶点、片段作色器。
    shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);
    glGetProgramiv(shaderProgram, GL_LINK_STATUS, &bSuc);
    if (!bSuc) {
        glGetProgramInfoLog(shaderProgram, 512, NULL, szInfoLog);
        std::cout << "错误! 无法完成链接任务，请核查着色器程序链接着色器情况！\n" << szInfoLog << std::endl;
    }
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);


    //构建顶点数据集 业务上可能有多个的情况
    GLfloat firstTriangle[] = {
        -0.9f, -0.5f, 0.0f,  // Left 
        -0.0f, -0.5f, 0.0f,  // Right
        -0.45f, 0.5f, 0.0f,  // Top 
    };
    GLfloat secondTriangle[] = {
         0.0f, -0.5f, 0.0f,  // Left
         0.9f, -0.5f, 0.0f,  // Right
         0.45f, 0.5f, 0.0f   // Top 
    };

    //不同的顶点数据集 使用不同的VBO VAO 
    GLuint VBOs[2];
    GLuint VAOs[2];

    //创建多个不同的顶点数据对象 VAO
    glGenVertexArrays(2, VAOs); 
    //创建多个不同的顶点缓冲对象 VBO
    glGenBuffers(2, VBOs);

    // ================================
    // VAO[0]->VBO[0]->firstTriangle
    // ===============================
    glBindVertexArray(VAOs[0]);
    glBindBuffer(GL_ARRAY_BUFFER, VBOs[0]);
    glBufferData(GL_ARRAY_BUFFER, sizeof(firstTriangle), firstTriangle, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid*)0);	
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);

    // ================================
    // VAO[1]->VBO[1]->secondTriangle
    // ===============================
    glBindVertexArray(VAOs[1]);	 //使用另一个VBO
    glBindBuffer(GL_ARRAY_BUFFER, VBOs[1]);	//使用另一个VBO
    glBufferData(GL_ARRAY_BUFFER, sizeof(secondTriangle), secondTriangle, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, (GLvoid*)0); 
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);


    while (!glfwWindowShouldClose(window))
    {
      
        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);


        glUseProgram(shaderProgram);

        //画第一个三角形 使用第一个VAO的数据
        glBindVertexArray(VAOs[0]);
        glDrawArrays(GL_TRIANGLES, 0, 3);

        // 然后画第二个三角形 使用第二个VAO的数据
        glBindVertexArray(VAOs[1]);
        glDrawArrays(GL_TRIANGLES, 0, 3);
        glBindVertexArray(0);

        //交换屏幕缓存
        glfwSwapBuffers(window);
    }

    //释放所有VAO VBO
    glDeleteVertexArrays(2, VAOs);
    glDeleteBuffers(2, VBOs);
    glfwTerminate();
    return 0;
}

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, GL_TRUE);
    }
        
}
```

# 多个作色器情况

再继续再上一个练习的基础上。创建两个着色器程序，第二个程序使用与第一个不同的片段着色器，输出黄色；再次绘制这两个三角形，其中一个输出为黄色。

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>

// GLFW
#include <GLFW/glfw3.h>


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);

//窗口维度
const GLuint WIDTH = 800, HEIGHT = 600;


//顶点作色器源码
const GLchar* vertexShaderSource = "#version 330 core\n"
"layout (location = 0) in vec3 position;\n"
"void main()\n"
"{\n"
"gl_Position = vec4(position.x, position.y, position.z, 1.0);\n"
"}\0";


const GLchar* fragmentShader1Source = "#version 330 core\n"
"out vec4 color;\n"
"void main()\n"
"{\n"
"color = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
"}\n\0";
const GLchar* fragmentShader2Source = "#version 330 core\n"
"out vec4 color;\n"
"void main()\n"
"{\n"
"color = vec4(1.0f, 1.0f, 0.0f, 1.0f); // The color yellow \n"
"}\n\0";



int main()
{
    std::cout << "启动 GLFW 上下文,版本 OpenGL 3.3" << std::endl;

    GLFWwindow* window = nullptr;
    int viewWidth = 0;
    int viewHeight = 0;
    GLuint vertexShader;
    GLuint fragmentShaderYellow;
    GLuint fragmentShaderOrange;
    GLuint shaderProgramOrange;
    GLuint shaderProgramYellow;
    GLuint VBO;
    GLuint VAO;

    GLint bSuc;
    GLchar szInfoLog[512];


    // 初始化 GLFW
    glfwInit();
    // 设置GLFW 所有必要设定
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

    // 创建GLFW窗口，以便我们更好使用GLFW函数
    window = glfwCreateWindow(WIDTH, HEIGHT, "JacksonWang", nullptr, nullptr);
    glfwMakeContextCurrent(window);

    // 设置GLFW的鼠标回调
    glfwSetKeyCallback(window, key_callback);

    // 将其设置为TRUE，以便Glew知道使用现代方法来检索函数指针和扩展
    glewExperimental = GL_TRUE;

    //初始化 GLEW
    glewInit();

    //设置视口维度
    glfwGetFramebufferSize(window, &viewWidth, &viewHeight);
    glViewport(0, 0, viewWidth, viewHeight);

    //顶点作色器初始化
    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(vertexShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译顶点着色器，请核查顶点着色器源码!\n" << szInfoLog << std::endl;
    }
    // 橙色、黄色片段作色器初始化
    fragmentShaderOrange = glCreateShader(GL_FRAGMENT_SHADER);
    fragmentShaderYellow = glCreateShader(GL_FRAGMENT_SHADER);

    glShaderSource(fragmentShaderOrange, 1, &fragmentShader1Source, NULL);
    glShaderSource(fragmentShaderYellow, 1, &fragmentShader2Source, NULL);

    glCompileShader(fragmentShaderOrange);
    glCompileShader(fragmentShaderYellow);
    glGetShaderiv(fragmentShaderOrange, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(fragmentShaderOrange, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译片段橙色着色器，请核查片段着色器源码!\n" << szInfoLog << std::endl;
    }
    glGetShaderiv(fragmentShaderYellow, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(fragmentShaderYellow, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译片段黄色着色器，请核查片段着色器源码!\n" << szInfoLog << std::endl;
    }


    //橙色作色器程序  整合顶点作色器 和 橙色作色器
    shaderProgramOrange = glCreateProgram();
    glAttachShader(shaderProgramOrange, vertexShader);
    glAttachShader(shaderProgramOrange, fragmentShaderOrange);
    glLinkProgram(shaderProgramOrange);
    glGetProgramiv(shaderProgramOrange, GL_LINK_STATUS, &bSuc);
    if (!bSuc) {
        glGetProgramInfoLog(shaderProgramOrange, 512, NULL, szInfoLog);
        std::cout << "错误! 无法完成链接任务，请核查着色器程序链接着色器情况！\n" << szInfoLog << std::endl;
    }


    //黄色作色器程序 整合顶点作色器 和 黄色作色器
    shaderProgramYellow = glCreateProgram();
    glAttachShader(shaderProgramYellow, vertexShader);
    glAttachShader(shaderProgramYellow, fragmentShaderYellow);
    glLinkProgram(shaderProgramYellow);
    glGetProgramiv(shaderProgramYellow, GL_LINK_STATUS, &bSuc);
    if (!bSuc) {
        glGetProgramInfoLog(shaderProgramYellow, 512, NULL, szInfoLog);
        std::cout << "错误! 无法完成链接任务，请核查着色器程序链接着色器情况！\n" << szInfoLog << std::endl;
    }

    
    //删除作色器对象
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShaderYellow);
    glDeleteShader(fragmentShaderOrange);


    //构建顶点数据集 业务上可能有多个的情况
    GLfloat firstTriangle[] = {
        -0.9f, -0.5f, 0.0f,  // Left 
        -0.0f, -0.5f, 0.0f,  // Right
        -0.45f, 0.5f, 0.0f,  // Top 
    };
    GLfloat secondTriangle[] = {
         0.0f, -0.5f, 0.0f,  // Left
         0.9f, -0.5f, 0.0f,  // Right
         0.45f, 0.5f, 0.0f   // Top 
    };

    //不同的顶点数据集 使用不同的VBO VAO 
    GLuint VBOs[2];
    GLuint VAOs[2];

    //创建多个不同的顶点数据对象 VAO
    glGenVertexArrays(2, VAOs); 
    //创建多个不同的顶点缓冲对象 VBO
    glGenBuffers(2, VBOs);

    // ================================
    // VAO[0]->VBO[0]->firstTriangle
    // ===============================
    glBindVertexArray(VAOs[0]);
    glBindBuffer(GL_ARRAY_BUFFER, VBOs[0]);
    glBufferData(GL_ARRAY_BUFFER, sizeof(firstTriangle), firstTriangle, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(GLfloat), (GLvoid*)0);	
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);

    // ================================
    // VAO[1]->VBO[1]->secondTriangle
    // ===============================
    glBindVertexArray(VAOs[1]);	 //使用另一个VBO
    glBindBuffer(GL_ARRAY_BUFFER, VBOs[1]);	//使用另一个VBO
    glBufferData(GL_ARRAY_BUFFER, sizeof(secondTriangle), secondTriangle, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, (GLvoid*)0); 
    glEnableVertexAttribArray(0);
    glBindVertexArray(0);


    while (!glfwWindowShouldClose(window))
    {
      
        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

    
    

        //画第一个三角形 使用第一个VAO的数据 并使用黄色作色器程序
        glUseProgram(shaderProgramOrange);
        glBindVertexArray(VAOs[0]);
        glDrawArrays(GL_TRIANGLES, 0, 3);

        // 然后画第二个三角形 使用第二个VAO的数据 并使用橙色作色器程序
        glUseProgram(shaderProgramYellow);
        glBindVertexArray(VAOs[1]);
        glDrawArrays(GL_TRIANGLES, 0, 3);
        glBindVertexArray(0);

        //交换屏幕缓存
        glfwSwapBuffers(window);
    }

    //释放所有VAO VBO
    glDeleteVertexArrays(2, VAOs);
    glDeleteBuffers(2, VBOs);
    glfwTerminate();
    return 0;
}

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    if (key == GLFW_KEY_ESCAPE && action == GLFW_PRESS)
    {
        glfwSetWindowShouldClose(window, GL_TRUE);
    }
        
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231225214238695-17035117601505-17167330700664.png)