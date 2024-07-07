# 变换

现在我们已经解释了变换背后的所有理论，是时候将这些知识利用起来了。OpenGL没有自带任何的矩阵和向量知识，所以我们必须定义自己的数学类和函数。在教程中我们更希望抽象所有的数学细节，使用已经做好了的数学库。幸运的是，有个易于使用，专门为OpenGL量身定做的数学库，那就是GLM

## GLM

GLM是Open**GL** **M**athematics的缩写，它是一个**只有头文件的**库，也就是说我们只需包含对应的头文件就行了，不用链接和编译。GLM可以在它们的[网站](http://glm.g-truc.net/0.9.5/index.html)上下载。把头文件的根目录复制到你的**includes**文件夹，然后你就可以使用这个库了。

我们需要的GLM的大多数功能都可以从下面这3个头文件中找到：

```c
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
```

我们来看看是否可以利用我们刚学的变换知识把一个向量(1, 0, 0)位移(1, 1, 0)个单位（注意，我们把它定义为一个`glm::vec4`类型的值，齐次坐标设定为1.0）：

```c
    // 使用glm::vec4定义一个四维向量（齐次坐标为1.0）
     glm::vec4 vec(1.0f, 0.0f, 0.0f, 1.0f);
     // 使用glm::mat4定义一个4x4的矩阵
     // glm::mat4如果不初始化则数据会是未知的，所以用以下方式初始化为单位矩阵
     glm::mat4 trans = glm::mat4(1.0f);

     // 使用glm::translate(变换矩阵,位移向量)
     // glm::translate返回变换矩阵添加位移效果后得到的矩阵
     trans = glm::translate(trans, glm::vec3(1.0f, 1.0f, 0.0f));
    
	// 使用 变换矩阵✖四维向量= 变换后的向量
     vec = trans * vec;
    
	std::cout << vec.x << vec.y << vec.z << std::endl; // 210

```

我们先用GLM内建的向量类定义一个叫做`vec`的向量。接下来定义一个`mat4`类型的`trans`，默认是一个4×4单位矩阵。下一步是创建一个变换矩阵，我们是把单位矩阵和一个位移向量传递给`glm::translate`函数来完成这个工作的（然后用给定的矩阵乘以位移矩阵就能获得最后需要的矩阵）。



之后我们把向量乘以位移矩阵并且输出最后的结果。如果你仍记得位移矩阵是如何工作的话，得到的向量应该是(1 + 1, 0 + 1, 0 + 0)，也就是(2, 1, 0)。这个代码片段将会输出`210`，所以这个位移矩阵是正确的。







我们来做些更有意思的事情，让我们来旋转和缩放之前教程中的那个箱子。首先我们把箱子逆时针旋转90度。然后缩放0.5倍，使它变成原来的一半大。我们先来创建变换矩阵：

```c
glm::mat4 trans(1.0); //建议初始化，不然高版本VS,比如2022 会有坑！
trans = glm::rotate(trans, 90.0f, glm::vec3(0.0, 0.0, 1.0)); //绕Z 转90°
trans = glm::scale(trans, glm::vec3(0.5, 0.5, 0.5));   // 整体缩小0.5倍
```

首先，我们把箱子在每个轴都缩放到0.5倍，然后沿z轴旋转90度。注意有纹理的那面矩形是在XY平面上的，所以我们需要把它绕着z轴旋转。因为我们把这个矩阵传递给了GLM的每个函数，GLM会自动将矩阵相乘，返回的结果是一个包括了多个变换的变换矩阵。

> 有些GLM版本接收的是弧度而不是角度，这种情况下你可以用`glm::radians(90.0f)`将角度转换为弧度

下一个大问题是：如何把矩阵传递给着色器？我们在前面简单提到过GLSL里也有一个`mat4`类型。所以我们将修改顶点着色器让其接收一个`mat4`的uniform变量，然后再用矩阵uniform乘以位置向量：

```c
#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;
layout (location = 2) in vec2 texCoord;

out vec3 ourColor;
out vec2 TexCoord;
uniform mat4 transform;
void main()
{
    //拿到VAO中一个顶点对应的位置坐标属性、颜色属性、纹理坐标属性
	gl_Position = transform * vec4(position, 1.0f); // 点坐标基于转换矩阵做变换
	ourColor = color;
	TexCoord =  vec2(texCoord.x, texCoord.y);
}

```

> GLSL也有`mat2`和`mat3`类型从而允许了像向量一样的混合运算。前面提到的所有数学运算（像是标量-矩阵相乘，矩阵-向量相乘和矩阵-矩阵相乘）在矩阵类型里都可以使用。当出现特殊的矩阵运算的时候我们会特别说明。



在把位置向量传给`gl_Position`之前，我们先添加一个uniform，并且将其与变换矩阵相乘。我们的箱子现在应该是原来的二分之一大小并（向左）旋转了90度。当然，我们仍需要把变换矩阵传递给着色器：

```c
//查全局 transform 索引
GLuint transformLoc = glGetUniformLocation(ourShader.Program, "transform");
//把值从CPU 注入到 GPU中
glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(trans));
```

我们首先查询uniform变量的地址，然后用有`Matrix4fv`后缀的`glUniform()`函数把矩阵数据发送给着色器。第一个参数你现在应该很熟悉了，它是uniform的位置值。第二个参数告诉OpenGL我们将要发送多少个矩阵，这里是1。第三个参数询问我们我们是否希望对我们的矩阵进行置换(Transpose)，也就是说交换我们矩阵的行和列。OpenGL开发者通常使用一种内部矩阵布局，叫做列主序(Column-major Ordering)布局。GLM的默认布局就是列主序，所以并不需要置换矩阵，我们填`GL_FALSE`。最后一个参数是真正的矩阵数据，但是GLM并不是把它们的矩阵储存为OpenGL所希望接受的那种，因此我们要先用GLM的自带的函数value_ptr来变换这些数据。



我们创建了一个变换矩阵，在顶点着色器中声明了一个uniform，并把矩阵发送给了着色器，着色器会变换我们的顶点坐标。最后的结果应该看起来像这样：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240101182804784-17041071715951.png)



完美！我们的箱子向左侧旋转，并是原来的一半大小，所以变换成功了。我们现在做些更有意思的，看看我们是否可以让箱子随着时间旋转，我们还会重新把箱子放在窗口的右下角。要让箱子随着时间推移旋转，我们必须在游戏循环中更新变换矩阵，因为它在每一次渲染迭代中都要更新。我们使用GLFW的时间函数来获取不同时间的角度：

```c
        //创建转换矩阵 必须进行初始化！
        glm::mat4 transform(1.0f);
        //把笑脸从视图中点位置 平移到右下角
        transform = glm::translate(transform, glm::vec3(0.5f, -0.5f, 0.0f)); 
        //笑脸基于Y轴旋转   glfwGetTime() 拿到当前的秒数，从1-60 这么数。 相当于渲染的角度区间[50,300]
        transform = glm::rotate(transform, glm::radians((GLfloat)glfwGetTime() * 50.0f), glm::vec3(0.0f, 0.0f, 1.0f));
```

要记住的是前面的例子中我们可以在任何地方声明变换矩阵，但是现在我们必须在每一次迭代中创建它，从而保证我们能够不断更新旋转角度。这也就意味着我们不得不在每次游戏循环的迭代中重新创建变换矩阵。通常在渲染场景的时候，我们也会有多个需要在每次渲染迭代中都用新值重新创建的变换矩阵

在这里我们先把箱子围绕原点(0, 0, 0)旋转，之后，我们把旋转过后的箱子位移到屏幕的右下角。记住，实际的变换顺序应该与阅读顺序相反：尽管在代码中我们先位移再旋转，实际的变换却是先应用旋转再是位移的。明白所有这些变换的组合，并且知道它们是如何应用到物体上是一件非常困难的事情。只有不断地尝试和实验这些变换你才能快速地掌握它们。



如果你做对了，你将看到下面的结果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%8F%98%E6%8D%A2%E7%9F%A9%E9%98%B5%E7%94%A8%E4%B8%80%E4%B8%8B-17041072000292-17167344350511.gif)



这就是我们刚刚做到的！一个位移过的箱子，它会一直转，一个变换矩阵就做到了！现在你可以明白为什么矩阵在图形领域是一个如此重要的工具了。我们可以定义一个无限数量的变换，把它们组合为仅仅一个矩阵，如果愿意的话我们还可以重复使用它。在着色器中使用矩阵可以省去重新定义顶点数据的功夫，它也能够节省处理时间，因为我们没有一直重新发送我们的数据（这是个非常慢的过程）。

如果你没有得到正确的结果，或者你有哪儿不清楚的地方。可以看笔者的实现。



- transformations.frag

```c
#version 330 core
in vec3 ourColor;
in vec2 TexCoord;

out vec4 color;

// 接收外部的纹理对象1，纹理对象2
uniform sampler2D ourTexture1;
uniform sampler2D ourTexture2;

void main()
{
		// 查指定纹理在指定纹理坐标下的颜色，查两个纹理，并0.2比例因子混合
	color = mix(texture(ourTexture1, TexCoord), texture(ourTexture2, TexCoord), 0.2);
}
```

- transformations.vs

```c
#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;
layout (location = 2) in vec2 texCoord;

out vec3 ourColor;
out vec2 TexCoord;
uniform mat4 transform;
void main()
{
    //拿到VAO中一个顶点对应的位置坐标属性、颜色属性、纹理坐标属性
	gl_Position = transform * vec4(position, 1.0f); // 点坐标基于转换矩阵做变换
	ourColor = color;
	TexCoord =  vec2(texCoord.x, texCoord.y);
}

```

- Shader.h

```c
#pragma once
#ifndef SHADER_H
#define SHADER_H
#include <string>
#include <fstream>
#include <sstream>
#include <iostream>
#include <GL/glew.h>

class Shader
{
public:
    //指定顶点作色器源码路径、颜色片段源码路径，构建着色器对象
    Shader(const GLchar* vertexPath, const GLchar* fragmentPath);

    // 启动当前做色器程序
    void Use();

public:
    GLuint Program; //作色器程序
};

#endif

```

- Shader.cpp

```c
#include "Shader.h"

Shader::Shader(const GLchar* vertexPath, const GLchar* fragmentPath)
{
    std::ifstream vShaderFileInputStream;
    std::ifstream fShaderFileInputStream; //源码文件输入流
    std::string vertexCode;
    std::string fragmentCode; //源码文件写入的缓存区
    const GLchar* vShaderCode = nullptr;
    const GLchar* fShaderCode = nullptr;

    GLuint vertexShader;
    GLuint fragmentShader; //顶点作色器，片段作色器
    GLchar szInfoLog[512];
    GLint bSuc;

    vShaderFileInputStream.exceptions(std::ifstream::badbit);
    fShaderFileInputStream.exceptions(std::ifstream::badbit);    // 确保ifStream对象可以引发异常
    try
    {
        std::stringstream vShaderStream;
        std::stringstream fShaderStream;

        // 判断流
        if (!vShaderFileInputStream.is_open())
        {
            vShaderFileInputStream.open(vertexPath);
        }
        if (!fShaderFileInputStream.is_open())
        {
            fShaderFileInputStream.open(fragmentPath);
        }


        // 读取文件输入流内容，并转到内存中
        vShaderStream << vShaderFileInputStream.rdbuf();
        fShaderStream << fShaderFileInputStream.rdbuf();
        vertexCode = vShaderStream.str();
        fragmentCode = fShaderStream.str();


        //关闭文件输入流
        vShaderFileInputStream.close();
        fShaderFileInputStream.close();

    }
    catch (std::ifstream::failure e)
    {
        std::cout << "错误！Share源码文件不能有效被读取！" << std::endl;
    }
    vShaderCode = vertexCode.c_str();
    fShaderCode = fragmentCode.c_str();


    //依次编译顶点作色器源码、颜色片段作色器源码。
    vertexShader = glCreateShader(GL_VERTEX_SHADER);
    glShaderSource(vertexShader, 1, &vShaderCode, NULL);
    glCompileShader(vertexShader);
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(vertexShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译顶点着色器，请核查顶点着色器源码!\n" << szInfoLog << std::endl;
    }

    fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fShaderCode, NULL);
    glCompileShader(fragmentShader);
    glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetShaderInfoLog(fragmentShader, 512, NULL, szInfoLog);
        std::cout << "错误！无法编译片段着色器，请核查片段着色器源码!\n" << szInfoLog << std::endl;
    }
    //创建作色器程序
    this->Program = glCreateProgram();

    //作色器程序和作色器组链接整合
    glAttachShader(this->Program, vertexShader);
    glAttachShader(this->Program, fragmentShader);
    glLinkProgram(this->Program);
    glGetProgramiv(this->Program, GL_LINK_STATUS, &bSuc);
    if (!bSuc)
    {
        glGetProgramInfoLog(this->Program, 512, NULL, szInfoLog);
        std::cout << "错误! 无法完成链接任务，请核查着色器程序链接着色器情况！\n" << szInfoLog << std::endl;
    }

    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

}

void Shader::Use()
{
    glUseProgram(this->Program);
}

```

- Main.cpp

```c
#include <iostream>


#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include "vender/stb_image/stb_image.h"
#include "Shader.h"

#include<Windows.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);
const GLuint WIDTH = 800, HEIGHT = 600;


int main()
{



    GLFWwindow* window = nullptr;
    GLuint VBO, VAO, EBO;

    GLuint texture1;
    GLuint texture2; //纹理对象

    int width1;
    int height1;
    unsigned char* image1 = NULL; //第一张图片

    int width2;
    int height2;
    unsigned char* image2 = NULL; //第二张图片



    //窗口、视图窗口初始化
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    window = glfwCreateWindow(WIDTH, HEIGHT, "JacksonWang", nullptr, nullptr);
    glfwMakeContextCurrent(window);
    glfwSetKeyCallback(window, key_callback);
    glewExperimental = GL_TRUE;
    glewInit();
    glViewport(0, 0, WIDTH, HEIGHT);

    //构建作色器程序
    Shader ourShader("res/shaders/transformations.vs", "res/shaders/transformations.frag");



    // Set up vertex data (and buffer(s)) and attribute pointers
    GLfloat vertices[] = {
        // Positions          // Colors           // Texture Coords
         0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f, // Top Right
         0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f, // Bottom Right
        -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f, // Bottom Left
        -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f  // Top Left 
    };
    GLuint indices[] = {  // Note that we start from 0!
        0, 1, 3, // First Triangle
        1, 2, 3  // Second Triangle
    };


    //VAO=>VBO|EBO
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

    // 点属性
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0);
    glEnableVertexAttribArray(0);
    // 颜色属性
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));
    glEnableVertexAttribArray(1);
    // 纹理属性
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat)));
    glEnableVertexAttribArray(2);

    glBindVertexArray(0); //解绑VAO


    //创建纹理对象1
    glGenTextures(1, &texture1);
    glBindTexture(GL_TEXTURE_2D, texture1);


    //指定纹理对象1 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    //指定纹理对象1 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    stbi_set_flip_vertically_on_load(1);

    //将本地图像1加载到内存图像 image1
    image1 = stbi_load("src/container.jpg", &width1, &height1, NULL, 3);

    //基于此image1 生成OepnGL 内部所需 最终纹理1 并解绑
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width1, height1, 0, GL_RGB, GL_UNSIGNED_BYTE, image1);
    glGenerateMipmap(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, 0);


    //创建纹理对象2
    glGenTextures(1, &texture2);
    glBindTexture(GL_TEXTURE_2D, texture2);

    //指定纹理对象2 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    //指定纹理对象2 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);


    //将本地图像2加载到内存图像 image2
    image2 = stbi_load("src/awesomeface.jpg", &width2, &height2, NULL, 3);

    //基于此image1 生成OepnGL 内部所需 最终纹理2 并解绑
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width2, height2, 0, GL_RGB, GL_UNSIGNED_BYTE, image2);
    glGenerateMipmap(GL_TEXTURE_2D);

    stbi_image_free(image1);
    stbi_image_free(image2);

    glBindTexture(GL_TEXTURE_2D, 0);





    while (!glfwWindowShouldClose(window))
    {

       

        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);



        //激活纹理对象1，以采用纹理单元0
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture1);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture1"), 0);

        //激活纹理对象2 以采用纹理单元1
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, texture2);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture2"), 1);

   
        
        // 激活启用作色其程序
        ourShader.Use();

        //创建转换矩阵 必须进行初始化！
        glm::mat4 transform(1.0f);
        //把笑脸从视图中点位置 平移到右下角
        transform = glm::translate(transform, glm::vec3(0.5f, -0.5f, 0.0f)); 
        //笑脸基于Y轴旋转  
        //旋转角度的取值范围可以根据具体的旋转函数而定。在这个例子中，使用了GLM库的glm::rotate函数，该函数的第二个参数是旋转角度，以弧度为单位。
//通常情况下，旋转角度的取值范围是从0到360度，或者从-180到180度。但是在GLM库中，旋转角度的取值范围是无限的，可以是任何实数值，正数表示顺时针旋转，负数表示逆时针旋转。
//在这个例子中，使用了glfwGetTime()函数乘以50.0f作为旋转角度，这意味着每秒旋转50度。由于glfwGetTime()返回的是从窗口创建以来经过的时间，因此旋转角度会随着时间的推移而增加。
        transform = glm::rotate(transform, glm::radians((GLfloat)glfwGetTime() * 50.0f), glm::vec3(0.0f, 0.0f, 1.0f));

  
        std::cout << glfwGetTime() << std::endl;


        GLint transformLoc = glGetUniformLocation(ourShader.Program, "transform");
        glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(transform));

        
        ::Sleep(721);
  

        //绑定VAO
        glBindVertexArray(VAO);

        //开始画画~~~~~
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);


        glfwSwapBuffers(window);
    }

    //释放资源
    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glDeleteBuffers(1, &EBO);
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



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240101183955303-17167344604172.png)

## 练习

> 使用应用在箱子上的最后一个变换，尝试将其改变为先旋转，后位移。看看发生了什么，试着想想为什么会发生这样的事情?

直接调整一下游戏循环里面求变换矩阵顺序，更改为先渲染再平移。

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include "vender/stb_image/stb_image.h"
#include "Shader.h"

#include<Windows.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);
const GLuint WIDTH = 800, HEIGHT = 600;


int main()
{



    GLFWwindow* window = nullptr;
    GLuint VBO, VAO, EBO;

    GLuint texture1;
    GLuint texture2; //纹理对象

    int width1;
    int height1;
    unsigned char* image1 = NULL; //第一张图片

    int width2;
    int height2;
    unsigned char* image2 = NULL; //第二张图片



    //窗口、视图窗口初始化
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    window = glfwCreateWindow(WIDTH, HEIGHT, "JacksonWang", nullptr, nullptr);
    glfwMakeContextCurrent(window);
    glfwSetKeyCallback(window, key_callback);
    glewExperimental = GL_TRUE;
    glewInit();
    glViewport(0, 0, WIDTH, HEIGHT);

    //构建作色器程序
    Shader ourShader("res/shaders/transformations.vs", "res/shaders/transformations.frag");



    // Set up vertex data (and buffer(s)) and attribute pointers
    GLfloat vertices[] = {
        // Positions          // Colors           // Texture Coords
         0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f, // Top Right
         0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f, // Bottom Right
        -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f, // Bottom Left
        -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f  // Top Left 
    };
    GLuint indices[] = {  // Note that we start from 0!
        0, 1, 3, // First Triangle
        1, 2, 3  // Second Triangle
    };


    //VAO=>VBO|EBO
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

    // 点属性
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0);
    glEnableVertexAttribArray(0);
    // 颜色属性
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));
    glEnableVertexAttribArray(1);
    // 纹理属性
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat)));
    glEnableVertexAttribArray(2);

    glBindVertexArray(0); //解绑VAO


    //创建纹理对象1
    glGenTextures(1, &texture1);
    glBindTexture(GL_TEXTURE_2D, texture1);


    //指定纹理对象1 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    //指定纹理对象1 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    stbi_set_flip_vertically_on_load(1);

    //将本地图像1加载到内存图像 image1
    image1 = stbi_load("src/container.jpg", &width1, &height1, NULL, 3);

    //基于此image1 生成OepnGL 内部所需 最终纹理1 并解绑
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width1, height1, 0, GL_RGB, GL_UNSIGNED_BYTE, image1);
    glGenerateMipmap(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, 0);


    //创建纹理对象2
    glGenTextures(1, &texture2);
    glBindTexture(GL_TEXTURE_2D, texture2);

    //指定纹理对象2 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    //指定纹理对象2 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);


    //将本地图像2加载到内存图像 image2
    image2 = stbi_load("src/awesomeface.jpg", &width2, &height2, NULL, 3);

    //基于此image1 生成OepnGL 内部所需 最终纹理2 并解绑
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width2, height2, 0, GL_RGB, GL_UNSIGNED_BYTE, image2);
    glGenerateMipmap(GL_TEXTURE_2D);

    stbi_image_free(image1);
    stbi_image_free(image2);

    glBindTexture(GL_TEXTURE_2D, 0);





    while (!glfwWindowShouldClose(window))
    {

       

        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);



        //激活纹理对象1，以采用纹理单元0
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture1);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture1"), 0);

        //激活纹理对象2 以采用纹理单元1
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, texture2);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture2"), 1);

   
        
        // 激活启用作色其程序
        ourShader.Use();

     	//这回先渲染再平移，其他不变~~~
        glm::mat4 transform(1.0f);
        transform = glm::rotate(transform, glm::radians((GLfloat)glfwGetTime() * 50.0f), glm::vec3(0.0f, 0.0f, 1.0f));
        transform = glm::translate(transform, glm::vec3(0.5f, -0.5f, 0.0f));
  
        std::cout << glfwGetTime() << std::endl;


        GLint transformLoc = glGetUniformLocation(ourShader.Program, "transform");
        glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(transform));

        
        ::Sleep(721);
  

        //绑定VAO
        glBindVertexArray(VAO);

        //开始画画~~~~~
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);


        glfwSwapBuffers(window);
    }

    //释放资源
    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glDeleteBuffers(1, &EBO);
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

为什么我们的笑脸现在绕着屏幕旋转？

记住，矩阵乘法是反向应用的。第一次的变换是这样的。
首先平移笑脸，将其定位在屏幕的右下角。平移后，旋转将应用于已平移的笑脸。这个没有问题。



诸如我们上文所说，旋转矩阵的运算是针对旋转中心在原点的，代码中先将矩阵旋转再位移，相当于对矩阵先位移再旋转。这时会发现笑脸绕着窗口中心原点不停的逆时针旋转。这是由于旋转中心的不同导致的差距。当先进行移动后，笑脸的几何中心就不在原点了，原本打算让它绕着几何中心旋转变成了绕着原点（非几何中心）旋转。


> 尝试再次调用`glDrawElements()`画出第二个箱子，**只**使用变换将其摆放在不同的位置。让这个箱子被摆放在窗口的左上角，并且会不断的缩放（而不是旋转）。`sin`函数在这里会很有用，不过注意使用`sin`函数时应用负值会导致物体被翻转

- Main.cpp

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include "vender/stb_image/stb_image.h"
#include "Shader.h"

#include<Windows.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);
const GLuint WIDTH = 800, HEIGHT = 600;


int main()
{



    GLFWwindow* window = nullptr;
    GLuint VBO, VAO, EBO;

    GLuint texture1;
    GLuint texture2; //纹理对象

    int width1;
    int height1;
    unsigned char* image1 = NULL; //第一张图片

    int width2;
    int height2;
    unsigned char* image2 = NULL; //第二张图片



    //窗口、视图窗口初始化
    glfwInit();
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
    window = glfwCreateWindow(WIDTH, HEIGHT, "JacksonWang", nullptr, nullptr);
    glfwMakeContextCurrent(window);
    glfwSetKeyCallback(window, key_callback);
    glewExperimental = GL_TRUE;
    glewInit();
    glViewport(0, 0, WIDTH, HEIGHT);

    //构建作色器程序
    Shader ourShader("res/shaders/transformations.vs", "res/shaders/transformations.frag");



    // Set up vertex data (and buffer(s)) and attribute pointers
    GLfloat vertices[] = {
        // Positions          // Colors           // Texture Coords
         0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f, // Top Right
         0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f, // Bottom Right
        -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f, // Bottom Left
        -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f  // Top Left 
    };
    GLuint indices[] = {  // Note that we start from 0!
        0, 1, 3, // First Triangle
        1, 2, 3  // Second Triangle
    };


    //VAO=>VBO|EBO
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW);

    // 点属性
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0);
    glEnableVertexAttribArray(0);
    // 颜色属性
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));
    glEnableVertexAttribArray(1);
    // 纹理属性
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat)));
    glEnableVertexAttribArray(2);

    glBindVertexArray(0); //解绑VAO


    //创建纹理对象1
    glGenTextures(1, &texture1);
    glBindTexture(GL_TEXTURE_2D, texture1);


    //指定纹理对象1 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    //指定纹理对象1 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    stbi_set_flip_vertically_on_load(1);

    //将本地图像1加载到内存图像 image1
    image1 = stbi_load("src/container.jpg", &width1, &height1, NULL, 3);

    //基于此image1 生成OepnGL 内部所需 最终纹理1 并解绑
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width1, height1, 0, GL_RGB, GL_UNSIGNED_BYTE, image1);
    glGenerateMipmap(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, 0);


    //创建纹理对象2
    glGenTextures(1, &texture2);
    glBindTexture(GL_TEXTURE_2D, texture2);

    //指定纹理对象2 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);

    //指定纹理对象2 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);


    //将本地图像2加载到内存图像 image2
    image2 = stbi_load("src/awesomeface.jpg", &width2, &height2, NULL, 3);

    //基于此image1 生成OepnGL 内部所需 最终纹理2 并解绑
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width2, height2, 0, GL_RGB, GL_UNSIGNED_BYTE, image2);
    glGenerateMipmap(GL_TEXTURE_2D);

    stbi_image_free(image1);
    stbi_image_free(image2);

    glBindTexture(GL_TEXTURE_2D, 0);





    while (!glfwWindowShouldClose(window))
    {

       

        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);



        //激活纹理对象1，以采用纹理单元0
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture1);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture1"), 0);

        //激活纹理对象2 以采用纹理单元1
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, texture2);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture2"), 1);

   
        
        // 激活启用作色其程序
        ourShader.Use();


        //画第一个箱子
        glm::mat4 transform(1.0f);
        transform = glm::translate(transform, glm::vec3(0.5f, -0.5f, 0.0f));
        transform = glm::rotate(transform, glm::radians((GLfloat)glfwGetTime() * 50.0f), glm::vec3(0.0f, 0.0f, 1.0f));
        GLint transformLoc = glGetUniformLocation(ourShader.Program, "transform");
        glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(transform));
        glBindVertexArray(VAO);
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);




        //画第二个箱子
        transform = glm::mat4(1.0);
        transform = glm::translate(transform, glm::vec3(-0.5f, 0.5f, 0.0f));

       // 利用sin/2+0.5，将时间 0到正无穷 转换为 0到1
        GLfloat scaleAmount = sin(glfwGetTime());
        transform = glm::scale(transform, glm::vec3(scaleAmount, scaleAmount, scaleAmount));
        glUniformMatrix4fv(transformLoc, 1, GL_FALSE, glm::value_ptr(transform));
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);



        std::cout << glfwGetTime() << std::endl;

     ::Sleep(721);


  

        glfwSwapBuffers(window);
    }

    //释放资源
    glDeleteVertexArrays(1, &VAO);
    glDeleteBuffers(1, &VBO);
    glDeleteBuffers(1, &EBO);
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/sin%E4%B8%89%E8%A7%92%E5%87%BD%E6%95%B0%E7%9A%84%E7%94%A8%E9%80%94-17041070554444-17167344891143.gif)