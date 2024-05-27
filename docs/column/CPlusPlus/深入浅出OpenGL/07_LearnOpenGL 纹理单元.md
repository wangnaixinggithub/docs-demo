# 回顾纹理

我们对上一博客的内容，再进一步学习。比如还可以把得到的纹理颜色与顶点颜色混合，来获得更有趣的效果。我们只需把纹理颜色与顶点颜色在片段着色器中相乘来混合二者的颜色：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231229201353601.png)



- textures.vs

```c
#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;
layout (location = 2) in vec2 texCoord;

out vec3 ourColor;
out vec2 TexCoord;

void main()
{
    //从顶点集中拿到顶点位置、顶点颜色、顶点纹理坐标
    gl_Position = vec4(position, 1.0f);
    ourColor = color;
    TexCoord = texCoord;
}
```

- textures.frag

```c
#version 330 core
in vec3 ourColor;
in vec2 TexCoord;

out vec4 color;


//全局变量，接收 纹理对象
uniform sampler2D ourTexture;

void main()
{
    //拿到纹理对象的颜色 和 我们配置的颜色进行混乘，得到一个最终色。
    color = texture(ourTexture, TexCoord) * vec4(ourColor, 1.0f); 
}
```

- Main.cpp

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include "vender/stb_image/stb_image.h"
#include "Shader.h"


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);
const GLuint WIDTH = 800, HEIGHT = 600;


int main()
{

    GLFWwindow* window = nullptr;
    GLuint VBO, VAO, EBO;

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
    Shader ourShader("res/shaders/textures.vs", "res/shaders/textures.frag");


    //构建顶点数据集
    GLfloat vertices[] = {
        // Positions          // Colors           // Texture Coords
         0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f, // Top Right
         0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f, // Bottom Right
        -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f, // Bottom Left
        -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f  // Top Left 
    };
    //构建顶点索引对象，来复用顶点。
    GLuint indices[] = {  // Note that we start from 0!
        0, 1, 3, // First Triangle
        1, 2, 3  // Second Triangle
    };


    //VAO=>VBO|EBO，顶点数据集处理为OpenGL可用的。
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


    //创建纹理对象并绑定
    GLuint texture;
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture); 
    
    //指定纹理对象的 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);	
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    
    //指定纹理对象的 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    //将本地图像container.jpg 加载到内存图像
    int width, height;
    stbi_set_flip_vertically_on_load(1);
    unsigned char* image = stbi_load("src/container.jpg", &width, &height, NULL, 3);

    //内存图像和纹理对象绑定
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
    glGenerateMipmap(GL_TEXTURE_2D); //自动生成所有需要的多级渐远纹理

    //解绑纹理对象 和释放图像的内存
    stbi_image_free(image);
    
    glBindTexture(GL_TEXTURE_2D, 0);

	
    //开始游戏循环，以渲染图像。
    while (!glfwWindowShouldClose(window))
    {
        //视图渲染初始化
        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        //绑定纹理对象
        // glActiveTexture(GL_TEXTURE0); 可以不用告知当前纹理对象1，采用哪一个纹理单元，默认就是 GL_TEXTURE0
        glBindTexture(GL_TEXTURE_2D, texture);

        // 激活启用作色其程序
        ourShader.Use();

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

- Shader.hpp

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

private:
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

我猜你会说我们的箱子喜欢跳70年代的迪斯科。

# 纹理单元

你可能会奇怪为什么`sampler2D`变量是个uniform，我们却不用`glUniform()`给它赋值。使用`glUniform1i()`，我们可以给纹理采样器分配一个位置值，这样的话我们能够在一个片段着色器中设置多个纹理。一个纹理的位置值通常称为一个纹理单元(Texture Unit)。一个纹理的默认纹理单元是0，它是默认的激活纹理单元，所以教程前面部分我们没有分配一个位置值。



纹理单元的主要目的是让我们在着色器中可以使用多于一个的纹理。通过把纹理单元赋值给采样器，我们可以一次绑定多个纹理，只要我们首先激活对应的纹理单元。就像`glBindTexture()`一样，我们可以使用`glActiveTexture()`激活纹理单元，传入我们需要使用的纹理单元：

```c
glActiveTexture(GL_TEXTURE0); //在绑定纹理之前先激活纹理单元
glBindTexture(GL_TEXTURE_2D, texture);
```

激活纹理单元之后，接下来的`glBindTexture()`函数调用会绑定这个纹理到当前激活的纹理单元，纹理单元GL_TEXTURE0默认总是被激活，所以我们在前面的例子里当我们使用`glBindTexture()`的时候，无需激活任何纹理单元。

> OpenGL至少保证有16个纹理单元供你使用，也就是说你可以激活从GL_TEXTURE0到GL_TEXTRUE15。它们都是按顺序定义的，所以我们也可以通过GL_TEXTURE0 + 8的方式获得GL_TEXTURE8，这在当我们需要循环一些纹理单元的时候会很有用。

我们仍然需要编辑片段着色器来接收另一个采样器。这应该相对来说非常直接了：

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

最终输出颜色现在是两个纹理的结合。GLSL内建的mix函数需要接受两个值作为参数，并对它们根据第三个参数进行线性插值。。如果第三个值是`0.0`，它会返回第一个输入；如果是`1.0`，会返回第二个输入值。`0.2`会返回`80%`的第一个输入颜色和`20%`的第二个输入颜色，即返回两个纹理的混合色。

我们现在需要载入并创建另一个纹理；你应该对这些步骤很熟悉了。记得创建另一个纹理对象，载入图片，使用glTexImage2D生成最终纹理。对于第二个纹理我们使用一张你学习OpenGL时的面部表情]图片。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231230192710360-17039356322521-17167333869461.png)



为了使用第二个纹理（以及第一个），我们必须改变一点渲染流程，先绑定两个纹理到对应的纹理单元，然后定义哪个uniform采样器对应哪个纹理单元：

```c
 
        //激活纹理对象1，以采用纹理单元0
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture1);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture1"), 0);

        //激活纹理对象2 以采用纹理单元1
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, texture2);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture2"), 1);



        //绑定VAO
        glBindVertexArray(VAO);

        //开始画画~~~~~
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
        glBindVertexArray(0);
```

注意，我们使用glUniform1i设置uniform采样器的位置值，或者说纹理单元。通过glUniform1i的设置，我们保证每个uniform采样器对应着正确的纹理单元。你应该能得到下面的结果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231230193101994-17039358635172-17167333988662.png)



如果你看到了一个开心的箱子，你就做对了。你可以对比一下笔者的源代码。看看是哪里出现了问题。

- textures.vs

```c
#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;
layout (location = 2) in vec2 texCoord;

out vec3 ourColor;
out vec2 TexCoord;

void main()
{
    //拿到VAO中一个顶点对应的位置坐标属性、颜色属性、纹理坐标属性
	gl_Position = vec4(position, 1.0f);
	ourColor = color;
	TexCoord = texCoord;
}
```

- textures.frag

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

- Shader.hpp

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

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include "vender/stb_image/stb_image.h"
#include "Shader.h"


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
    Shader ourShader("res/shaders/textures.vs", "res/shaders/textures.frag");


    //构建顶点数据集
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
   image2 = stbi_load("src/awesomeface.jpg", &width2, &height2,NULL,3);

   //基于此image1 生成OepnGL 内部所需 最终纹理2 并解绑
   glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,width2,height2,0,GL_RGB, GL_UNSIGNED_BYTE, image2);
   glGenerateMipmap(GL_TEXTURE_2D);
    
    stbi_image_free(image1);
    stbi_image_free(image2);

    glBindTexture(GL_TEXTURE_2D, 0);
    
  
    while (!glfwWindowShouldClose(window))
    {
       
        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        // 激活启用作色其程序
        ourShader.Use();

      
        
        //激活纹理对象1，以采用纹理单元0
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture1);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture1"), 0);

        //激活纹理对象2 以采用纹理单元1
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, texture2);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture2"), 1);



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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231230193938293-17039363798433-17167334167003.png)

# 练习

为了更熟练地使用纹理，建议在继续之后的学习之前做完这些练习：



> 修改让图像进行颠倒显示。

```c
#version 330 core
out vec4 FragColor;

in vec3 ourColor;
in vec2 TexCoord;

uniform sampler2D ourTexture1;
uniform sampler2D ourTexture2;

void main()
{	
    //第二个纹理是笑脸，现在笑脸是正放着的，要颠倒显示，很简单，就是竖直方向（Y）弄个方向就可以了
    FragColor = mix(texture(ourTexture1, TexCoord), texture(ourTexture2, vec2(TexCoord.x, 1.0 - TexCoord.y)), 0.2);
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231230195124595-17167334387384.png)



> 修改片段着色器，**仅**让笑脸图案朝另一个方向看

```c
#version 330 core
out vec4 FragColor;

in vec3 ourColor;
in vec2 TexCoord;

uniform sampler2D ourTexture1;
uniform sampler2D ourTexture2;

void main()
{
    //同理可得啊，直接让纹理坐标 水平方向（反向）
    FragColor = mix(texture(ourTexture1, TexCoord), texture(ourTexture2, vec2(1.0 - TexCoord.x, TexCoord.y)), 0.2);
}

```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231230195220853-17167334513335.png)



> 尝试用不同的纹理环绕方式，设定一个从`0.0f`到`2.0f`范围内的（而不是原来的`0.0f`到`1.0f`）纹理坐标。试试看能不能在箱子的角落放置4个笑脸



修改顶点数据集，纹理坐标最大上限即可。

```c

    //构建顶点数据集
    GLfloat vertices[] = {
        // Positions          // Colors           // Texture Coords 纹理坐标 最大上限，从1.0f 变成 2.0f 
         0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   2.0f, 2.0f, // Top Right
         0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   2.0f, 0.0f, // Bottom Right
        -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f, // Bottom Left
        -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 2.0f  // Top Left 
    };
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231230195527987-17167334658626.png)



> - 使用一个uniform变量作为mix函数的第三个参数来改变两个纹理可见度，使用上和下键来改变箱子或笑脸的可见度

- textures.frag

```c
#version 330 core
in vec3 ourColor;
in vec2 TexCoord;

out vec4 color;

uniform float mixValue;

// Texture samplers
uniform sampler2D ourTexture1;
uniform sampler2D ourTexture2;

void main()
{
	// 第三个uniform参数mixValue值越大第二个笑脸纹理越明显，第一个木板纹理越来越暗淡，反之值越小时同理可反推，即该参数可以控制两个纹理的可见度。
	color = mix(texture(ourTexture1, TexCoord), texture(ourTexture2, TexCoord), mixValue);
}
```

- Main.cpp

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include "vender/stb_image/stb_image.h"
#include "Shader.h"


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);
const GLuint WIDTH = 800, HEIGHT = 600;
GLfloat mixValue = 0.2f;

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
    Shader ourShader("res/shaders/textures.vs", "res/shaders/textures.frag");


    //构建顶点数据集
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
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

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
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);


    //将本地图像2加载到内存图像 image2
   image2 = stbi_load("src/awesomeface.jpg", &width2, &height2,NULL,3);

   //基于此image1 生成OepnGL 内部所需 最终纹理2 并解绑
   glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,width2,height2,0,GL_RGB, GL_UNSIGNED_BYTE, image2);
   glGenerateMipmap(GL_TEXTURE_2D);
    
    stbi_image_free(image1);
    stbi_image_free(image2);

    glBindTexture(GL_TEXTURE_2D, 0);
    
  
    while (!glfwWindowShouldClose(window))
    {
       
        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);

        // 激活启用作色其程序
        ourShader.Use();

      
        
        //激活纹理对象1，以采用纹理单元0
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture1);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture1"), 0);

        //激活纹理对象2 以采用纹理单元1
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, texture2);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture2"), 1);

        //重点 =======绑定 mixValue 
        glUniform1f(glGetUniformLocation(ourShader.Program, "mixValue"), mixValue);

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

    //抓移动↑键 按下事件
    if (key == GLFW_KEY_UP && action == GLFW_PRESS)
    {
        mixValue += 0.1f;

        //不能大于上限
        if (mixValue >= 1.0f)
        {
            mixValue = 1.0f;
        }

    }
    //抓移动↓键 按下事件
    if (key == GLFW_KEY_DOWN && action == GLFW_PRESS)
    {
        mixValue -= 0.1f;

        //不能低于下限
        if (mixValue <= 0.0f)
        {
            mixValue = 0.0f;
        }
   
    }
}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%9B%BE%E5%83%8F%E5%8F%AF%E8%A7%81%E5%BA%A6-17039383007025-17167334910797.gif)
