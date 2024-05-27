# 摄像机类

接下来的教程我们会使用一个摄像机来浏览场景，从各个角度观察结果。然而由于一个摄像机会占教程的很大的篇幅，我们会从细节抽象出创建一个自己的摄像机对象。与着色器教程不同我们不会带你一步一步创建摄像机类，如果你想知道怎么工作的的话，这里给出的是笔者的实现。

你应该能够理解所有的代码。我们建议您至少看一看这个类，看看如何创建一个自己的摄像机类。

- `Main.cpp`

```c
#include <iostream>

// GLEW
#define GLEW_STATIC
#include <GL/glew.h>
#include <GLFW/glfw3.h>
#include "vender/stb_image/stb_image.h"
#include "Shader.h"
#include "Camera.h"
#include<Windows.h>

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>

const GLuint WIDTH = 800, HEIGHT = 600;


void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode);
void scroll_callback(GLFWwindow* window, double xoffset, double yoffset);
void mouse_callback(GLFWwindow* window, double xpos, double ypos);
Camera camera(glm::vec3(0.0f, 0.0f, 3.0f)); //摄像机类 
bool keys[1024]; //存键位情况
GLfloat lastX = 400, lastY = 300; //存上一次鼠标的位置
bool firstMouse = true; //记录是不是第一次触发鼠标事件
GLfloat deltaTime = 0.0f; //每帧的时间查
GLfloat lastFrame = 0.0f; //上一帧的时间

void do_movement();

int main()
{

    GLFWwindow* window = nullptr;
    GLuint VBO, VAO;
    GLuint texture1, texture2;//纹理对象

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
    glfwSetCursorPosCallback(window, mouse_callback);
    glfwSetKeyCallback(window, key_callback);
    glfwSetScrollCallback(window, scroll_callback);
    glewExperimental = GL_TRUE;
    glewInit();
    glViewport(0, 0, WIDTH, HEIGHT);
    glEnable(GL_DEPTH_TEST); // ZBuffer消隐



    //构建作色器程序
    Shader ourShader("res/shaders/shader.vs", "res/shaders/shader.frag");



    // 设置顶点数据集和纹理坐标
    GLfloat vertices[] = {
            -0.5f, -0.5f, -0.5f,  0.0f, 0.0f,
             0.5f, -0.5f, -0.5f,  1.0f, 0.0f,
             0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
             0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
            -0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
            -0.5f, -0.5f, -0.5f,  0.0f, 0.0f,

            -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
             0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
             0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
             0.5f,  0.5f,  0.5f,  1.0f, 1.0f,
            -0.5f,  0.5f,  0.5f,  0.0f, 1.0f,
            -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,

            -0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
            -0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
            -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
            -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
            -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
            -0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

             0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
             0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
             0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
             0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
             0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
             0.5f,  0.5f,  0.5f,  1.0f, 0.0f,

            -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,
             0.5f, -0.5f, -0.5f,  1.0f, 1.0f,
             0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
             0.5f, -0.5f,  0.5f,  1.0f, 0.0f,
            -0.5f, -0.5f,  0.5f,  0.0f, 0.0f,
            -0.5f, -0.5f, -0.5f,  0.0f, 1.0f,

            -0.5f,  0.5f, -0.5f,  0.0f, 1.0f,
             0.5f,  0.5f, -0.5f,  1.0f, 1.0f,
             0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
             0.5f,  0.5f,  0.5f,  1.0f, 0.0f,
            -0.5f,  0.5f,  0.5f,  0.0f, 0.0f,
            -0.5f,  0.5f, -0.5f,  0.0f, 1.0f
    };
    glm::vec3 cubePositions[] = {
      glm::vec3(0.0f,  0.0f,  0.0f),
      glm::vec3(2.0f,  5.0f, -15.0f),
      glm::vec3(-1.5f, -2.2f, -2.5f),
      glm::vec3(-3.8f, -2.0f, -12.3f),
      glm::vec3(2.4f, -0.4f, -3.5f),
      glm::vec3(-1.7f,  3.0f, -7.5f),
      glm::vec3(1.3f, -2.0f, -2.5f),
      glm::vec3(1.5f,  2.0f, -2.5f),
      glm::vec3(1.5f,  0.2f, -1.5f),
      glm::vec3(-1.3f,  1.0f, -1.5f)
    };


    //VAO=>VBO
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glBindVertexArray(VAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 5 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 5 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));     // 纹理属性
    glEnableVertexAttribArray(2);
    glBindVertexArray(0); //解绑VAO


    //创建纹理对象1  container.jpg 和纹理对象1整合生成OepnGL 内部所需 
    glGenTextures(1, &texture1);
    glBindTexture(GL_TEXTURE_2D, texture1);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);     //指定纹理对象1 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);     //指定纹理对象1 纹理过滤
    stbi_set_flip_vertically_on_load(1);
    image1 = stbi_load("src/container.jpg", &width1, &height1, NULL, 3);     //将本地图像1加载到内存图像 image1
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width1, height1, 0, GL_RGB, GL_UNSIGNED_BYTE, image1);
    glGenerateMipmap(GL_TEXTURE_2D);
    glBindTexture(GL_TEXTURE_2D, 0); //纹理对象1 并解绑


    //创建纹理对象2 awesomeface.jpg 和纹理对象1整合生成OepnGL 内部所需 
    glGenTextures(1, &texture2);
    glBindTexture(GL_TEXTURE_2D, texture2);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);     //指定纹理对象2 纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);     //指定纹理对象2 纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
    image2 = stbi_load("src/awesomeface.jpg", &width2, &height2, NULL, 3); //纹理对象1 并解绑
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width2, height2, 0, GL_RGB, GL_UNSIGNED_BYTE, image2);
    glGenerateMipmap(GL_TEXTURE_2D); //纹理对象2 并解绑
    glBindTexture(GL_TEXTURE_2D, 0);


    stbi_image_free(image1);
    stbi_image_free(image2);



    while (!glfwWindowShouldClose(window))
    {
        GLfloat currentFrame = glfwGetTime();
        deltaTime = currentFrame - lastFrame;
        lastFrame = currentFrame;



        glfwPollEvents();
        do_movement();

        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

        //使用纹理单元绑定纹理
        glActiveTexture(GL_TEXTURE0);
        glBindTexture(GL_TEXTURE_2D, texture1);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture1"), 0);
        glActiveTexture(GL_TEXTURE1);
        glBindTexture(GL_TEXTURE_2D, texture2);
        glUniform1i(glGetUniformLocation(ourShader.Program, "ourTexture2"), 1);



        // 激活作色器程序
        ourShader.Use();




        // 获取模型矩阵、视图矩阵、投影矩阵在着色器源码的索引
        GLint modelLoc = glGetUniformLocation(ourShader.Program, "model");
        GLint viewLoc = glGetUniformLocation(ourShader.Program, "view");
        GLint projLoc = glGetUniformLocation(ourShader.Program, "projection");



        // Create camera transformation
        glm::mat4 view(1.0);
        view = camera.GetViewMatrix();
        glm::mat4 projection(1.0);
        projection = glm::perspective(camera.Zoom, (float)WIDTH / (float)HEIGHT, 0.1f, 1000.0f);

        //注入视图矩阵
        glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));

        //注入透视投影矩阵
        glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));

        glBindVertexArray(VAO);
        for (GLuint i = 0; i < 10; i++)
        {
            //根据位置向量得到模型矩阵
            glm::mat4 model(1.0f);
            model = glm::translate(model, cubePositions[i]);
            float angle = 20.0f * (i + 1);


            angle = glfwGetTime() * 25.0f;


            // 模型矩阵， 继续做旋转 让角度随时间变化，形成旋转的效果
            model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));

            //注入模型矩阵
            glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));


            glDrawArrays(GL_TRIANGLES, 0, 36);
        }
        glBindVertexArray(0);



        glfwSwapBuffers(window);
    }

    //释放资源
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

    if (key >= 0 && key < 1024)
    {
        if (action == GLFW_PRESS)
        {
            keys[key] = true;
        }
        else if (action == GLFW_RELEASE)
        {
            keys[key] = false;
        }
    }

}

void do_movement()
{
    GLfloat cameraSpeed = 5.0f * deltaTime;
    if (keys[GLFW_KEY_W])
        camera.ProcessKeyboard(FORWARD, deltaTime);
    if (keys[GLFW_KEY_S])
        camera.ProcessKeyboard(BACKWARD, deltaTime);
    if (keys[GLFW_KEY_A])
        camera.ProcessKeyboard(LEFT, deltaTime);
    if (keys[GLFW_KEY_D])
        camera.ProcessKeyboard(RIGHT, deltaTime);
}


void mouse_callback(GLFWwindow* window, double xpos, double ypos)
{
    if (firstMouse)
    {
        lastX = xpos;
        lastY = ypos;
        firstMouse = false;
    }

    GLfloat xoffset = xpos - lastX;
    GLfloat yoffset = lastY - ypos; // 注意这里是相反的，因为y坐标的范围是从下往上的


    lastX = xpos;
    lastY = ypos;


    camera.ProcessMouseMovement(xoffset, yoffset);

}

void scroll_callback(GLFWwindow* window, double xoffset, double yoffset)
{
    camera.ProcessMouseScroll(yoffset);
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

- Camera.h

```c
#pragma once

#include <GL/glew.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <vector>

#ifndef CAMERA_H
#define CAMERA_H

enum Camera_Movement 
{
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT
};

const GLfloat YAW = -90.0f;
const GLfloat PITCH = 0.0f;
const GLfloat SPEED = 3.0f;
const GLfloat SENSITIVTY = 0.25f;
const GLfloat ZOOM = 45.0f;

class Camera
{
public:
    
    //摄像机属性
    glm::vec3 Position; //摄像机位置
    glm::vec3 Front; // 摄像机方向向量
    glm::vec3 Right; //摄影机右向量
    glm::vec3 Up; // 摄像机上向量
    glm::vec3 WorldUp; //世界坐标系中的上向量

    //欧拉角
    GLfloat Yaw; // 偏航角
    GLfloat Pitch; //俯仰角

    //摄像机设置 读者可定制
    GLfloat MovementSpeed; //移动速度
    GLfloat MouseSensitivity; 	// 移动灵敏度
    GLfloat Zoom; // 视野范围fov

    Camera(
        glm::vec3 position = glm::vec3(0.0f, 0.0f, 0.0f), 
        glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f),
        GLfloat yaw = YAW, 
        GLfloat pitch = PITCH) 
        :Front(glm::vec3(0.0f, 0.0f, -1.0f)), 
        MovementSpeed(SPEED),
        MouseSensitivity(SENSITIVTY), 
        Zoom(ZOOM)
    {
        this->Position = position;
        this->WorldUp = up;
        this->Yaw = yaw;
        this->Pitch = pitch;
        this->updateCameraVectors();
    }

    Camera(
        GLfloat posX, 
        GLfloat posY, 
        GLfloat posZ, 
        GLfloat upX, 
        GLfloat upY,
        GLfloat upZ, 
        GLfloat yaw, 
        GLfloat pitch) 
        :Front(glm::vec3(0.0f, 0.0f, -1.0f)),
        MovementSpeed(SPEED),
        MouseSensitivity(SENSITIVTY), 
        Zoom(ZOOM)
    {
        this->Position = glm::vec3(posX, posY, posZ);
        this->WorldUp = glm::vec3(upX, upY, upZ);
        this->Yaw = yaw;
        this->Pitch = pitch;
        this->updateCameraVectors();
    }

public:
    //返回视图矩阵
    glm::mat4 GetViewMatrix()
    {
        //创建出摄像机观察矩阵
        return glm::lookAt(this->Position, this->Position + this->Front, this->Up);
    }

    void ProcessKeyboard(Camera_Movement direction, GLfloat deltaTime)
    {
       
        GLfloat velocity = this->MovementSpeed * deltaTime; //硬件差，则时间差就大，那就加速移动，确保不同硬件得到相同体验，移动速率越高
       
        //根据用户按下的方向键，通过加减向前（右）分量来更新摄像机位置。
        if (direction == FORWARD)
        {
            this->Position += this->Front * velocity;
        }
        if (direction == BACKWARD)
        {
            this->Position -= this->Front * velocity;
        }
        if (direction == LEFT)
        {
            this->Position -= this->Right * velocity;
        }
        
        if (direction == RIGHT)
        {
            this->Position += this->Right * velocity;
        }
    }

    void ProcessMouseMovement(GLfloat xoffset, GLfloat yoffset, GLboolean constrainPitch = true)
    {
        //偏航角和俯仰角是从鼠标移动获得的，鼠标水平移动影响偏航角，鼠标垂直移动影响俯仰角。
        xoffset *= this->MouseSensitivity;
        yoffset *= this->MouseSensitivity;

        this->Yaw += xoffset;
        this->Pitch += yoffset;

        // 对于俯仰角 偏航角 加以限制
        if (constrainPitch)
        {
            if (this->Pitch > 89.0f)
            {
                this->Pitch = 89.0f;
            }     
            if (this->Pitch < -89.0f)
            {
                this->Pitch = -89.0f;
            }
        }


        this->updateCameraVectors();
    }


    void ProcessMouseScroll(GLfloat yoffset)
    {
        if (this->Zoom >= 1.0f && this->Zoom <= 45.0f)
        {
            this->Zoom -= yoffset;
        }
          
        //缩放视野fov上限 就是1.f
        if (this->Zoom <= 1.0f)
        {
            this->Zoom = 1.0f;
        }
        //缩放视野fov下限 就是45.0f
        if (this->Zoom >= 45.0f)
        {
            this->Zoom = 45.0f;
        }
        
    }

    private:
        void updateCameraVectors()
        {
            // 通过俯仰角和偏航角来计算 新的摄影机方向向量 并进行单位化
            glm::vec3 front;
            front.x = cos(glm::radians(this->Yaw)) * cos(glm::radians(this->Pitch));
            front.y = sin(glm::radians(this->Pitch));
            front.z = sin(glm::radians(this->Yaw)) * cos(glm::radians(this->Pitch));
            this->Front = glm::normalize(front);

            //新的摄影机方向向量和 世界坐标系中上向量 做叉乘 得到摄像机右向量 并进行单位化
            this->Right = glm::normalize(glm::cross(this->Front, this->WorldUp));  
            
            // 摄影机右向量 和 摄影机方向向量 再叉乘 得到摄影机上向量
            this->Up = glm::normalize(glm::cross(this->Right, this->Front));
        }

};


#endif
```

- shader.frag

```c
#version 330 core
in vec2 TexCoord;

out vec4 color;

uniform sampler2D ourTexture1;
uniform sampler2D ourTexture2;

void main()
{
    color = mix(texture(ourTexture1, TexCoord), texture(ourTexture2, TexCoord), 0.2);
}
```

- shader.vs

```c
#version 330 core
layout (location = 0) in vec3 position;
layout (location = 2) in vec2 texCoord;

out vec2 TexCoord;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0f);
    TexCoord = vec2(texCoord.x, 1.0 - texCoord.y);
}
```

## 练习

> 看看你是否能够变换摄像机类从而使得其能够变- 成一个**真正的**FPS摄像机(也就是说不能够随意飞行)；你只能够呆在xz平面上: 

```c
 void ProcessKeyboard(Camera_Movement direction, GLfloat deltaTime)
 {
    
     GLfloat velocity = this->MovementSpeed * deltaTime; //硬件差，则时间差就大，那就加速移动，确保不同硬件得到相同体验，移动速率越高
    
     //根据用户按下的方向键，通过加减向前（右）分量来更新摄像机位置。
     if (direction == FORWARD)
     {
         this->Position += this->Front * velocity;
     }
     if (direction == BACKWARD)
     {
         this->Position -= this->Front * velocity;
     }
     if (direction == LEFT)
     {
         this->Position -= this->Right * velocity;
     }
     
     if (direction == RIGHT)
     {
         this->Position += this->Right * velocity;
     }
     Position.y = 0.0f; //这一行使用户保持在地面(XZ平面)
 }

```

> 试着创建你自己的LookAt函数，使你能够手动创建一个我们在一开始讨论的观察矩阵。用你的函数实现来替换glm的LookAt函数，看看它是否还能一样的工作：

```c
#pragma once

#include <GL/glew.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <vector>

#ifndef CAMERA_H
#define CAMERA_H

// Custom implementation of the LookAt function
glm::mat4 calculate_lookAt_matrix(glm::vec3 position, glm::vec3 target, glm::vec3 worldUp)
{
    // 1. 摄像机点的位置已知 目标点的位置也已知
   
    //计算出摄像机点、目标点的方向向量V1
    glm::vec3 zaxis = glm::normalize(position - target);

    // 用世界坐标的Z方向向量 和 方向向量V1 叉乘并单位话 得到 摄像机的 x方向
    glm::vec3 xaxis = glm::normalize(glm::cross(glm::normalize(worldUp), zaxis));
 
    // 此时摄像机方向向量 和摄像机x方向 之间互相垂直， 再通过叉乘 得到 摄像机的 y方向
    glm::vec3 yaxis = glm::cross(zaxis, xaxis);

    //创建平移和旋转矩阵
    // 在GLM中，由于以列为主的布局，我们以MAT[COL][ROW]形式访问元素
    glm::mat4 translation = glm::mat4(1.0f); 
    glm::mat4 rotation = glm::mat4(1.0f);

    translation[3][0] = -position.x; // Third column, first row
    translation[3][1] = -position.y;
    translation[3][2] = -position.z;

    rotation[0][0] = xaxis.x; // First column, first row
    rotation[1][0] = xaxis.y;
    rotation[2][0] = xaxis.z;
    rotation[0][1] = yaxis.x; // First column, second row
    rotation[1][1] = yaxis.y;
    rotation[2][1] = yaxis.z;
    rotation[0][2] = zaxis.x; // First column, third row
    rotation[1][2] = zaxis.y;
    rotation[2][2] = zaxis.z;

    // 将LookAt矩阵返回为平移和旋转矩阵的组合
    return rotation * translation; // 记住从右向左阅读(先平移，再旋转)
}




enum Camera_Movement 
{
    FORWARD,
    BACKWARD,
    LEFT,
    RIGHT
};

const GLfloat YAW = -90.0f;
const GLfloat PITCH = 0.0f;
const GLfloat SPEED = 3.0f;
const GLfloat SENSITIVTY = 0.25f;
const GLfloat ZOOM = 45.0f;

class Camera
{
public:
    
    //摄像机属性
    glm::vec3 Position; //摄像机位置
    glm::vec3 Front; // 摄像机方向向量
    glm::vec3 Right; //摄影机右向量
    glm::vec3 Up; // 摄像机上向量
    glm::vec3 WorldUp; //世界坐标系中的上向量

    //欧拉角
    GLfloat Yaw; // 偏航角
    GLfloat Pitch; //俯仰角

    //摄像机设置 读者可定制
    GLfloat MovementSpeed; //移动速度
    GLfloat MouseSensitivity; 	// 移动灵敏度
    GLfloat Zoom; // 视野范围fov

    Camera(
        glm::vec3 position = glm::vec3(0.0f, 0.0f, 0.0f), 
        glm::vec3 up = glm::vec3(0.0f, 1.0f, 0.0f),
        GLfloat yaw = YAW, 
        GLfloat pitch = PITCH) 
        :Front(glm::vec3(0.0f, 0.0f, -1.0f)), 
        MovementSpeed(SPEED),
        MouseSensitivity(SENSITIVTY), 
        Zoom(ZOOM)
    {
        this->Position = position;
        this->WorldUp = up;
        this->Yaw = yaw;
        this->Pitch = pitch;
        this->updateCameraVectors();
    }

    Camera(
        GLfloat posX, 
        GLfloat posY, 
        GLfloat posZ, 
        GLfloat upX, 
        GLfloat upY,
        GLfloat upZ, 
        GLfloat yaw, 
        GLfloat pitch) 
        :Front(glm::vec3(0.0f, 0.0f, -1.0f)),
        MovementSpeed(SPEED),
        MouseSensitivity(SENSITIVTY), 
        Zoom(ZOOM)
    {
        this->Position = glm::vec3(posX, posY, posZ);
        this->WorldUp = glm::vec3(upX, upY, upZ);
        this->Yaw = yaw;
        this->Pitch = pitch;
        this->updateCameraVectors();
    }

public:
    //返回视图矩阵
    glm::mat4 GetViewMatrix()
    {

       // return glm::lookAt(this->Position, this->Position + this->Front, this->Up);

        //用自己封装的lookAt 观察矩阵
        return calculate_lookAt_matrix(this->Position, this->Position + this->Front, this->Up);
    }

    void ProcessKeyboard(Camera_Movement direction, GLfloat deltaTime)
    {
       
        GLfloat velocity = this->MovementSpeed * deltaTime; //硬件差，则时间差就大，那就加速移动，确保不同硬件得到相同体验，移动速率越高
       
        //根据用户按下的方向键，通过加减向前（右）分量来更新摄像机位置。
        if (direction == FORWARD)
        {
            this->Position += this->Front * velocity;
        }
        if (direction == BACKWARD)
        {
            this->Position -= this->Front * velocity;
        }
        if (direction == LEFT)
        {
            this->Position -= this->Right * velocity;
        }
        
        if (direction == RIGHT)
        {
            this->Position += this->Right * velocity;
        }
        Position.y = 0.0f; //这一行使用户保持在地面(XZ平面)
    }

    void ProcessMouseMovement(GLfloat xoffset, GLfloat yoffset, GLboolean constrainPitch = true)
    {
        //偏航角和俯仰角是从鼠标移动获得的，鼠标水平移动影响偏航角，鼠标垂直移动影响俯仰角。
        xoffset *= this->MouseSensitivity;
        yoffset *= this->MouseSensitivity;

        this->Yaw += xoffset;
        this->Pitch += yoffset;

        // 对于俯仰角 偏航角 加以限制
        if (constrainPitch)
        {
            if (this->Pitch > 89.0f)
            {
                this->Pitch = 89.0f;
            }     
            if (this->Pitch < -89.0f)
            {
                this->Pitch = -89.0f;
            }
        }


        this->updateCameraVectors();
    }


    void ProcessMouseScroll(GLfloat yoffset)
    {
        if (this->Zoom >= 1.0f && this->Zoom <= 45.0f)
        {
            this->Zoom -= yoffset;
        }
          
        //缩放视野fov上限 就是1.f
        if (this->Zoom <= 1.0f)
        {
            this->Zoom = 1.0f;
        }
        //缩放视野fov下限 就是45.0f
        if (this->Zoom >= 45.0f)
        {
            this->Zoom = 45.0f;
        }
        
    }

    private:
        void updateCameraVectors()
        {
            // 通过俯仰角和偏航角来计算 新的摄影机方向向量 并进行单位化
            glm::vec3 front;
            front.x = cos(glm::radians(this->Yaw)) * cos(glm::radians(this->Pitch));
            front.y = sin(glm::radians(this->Pitch));
            front.z = sin(glm::radians(this->Yaw)) * cos(glm::radians(this->Pitch));
            this->Front = glm::normalize(front);

            //新的摄影机方向向量和 世界坐标系中上向量 做叉乘 得到摄像机右向量 并进行单位化
            this->Right = glm::normalize(glm::cross(this->Front, this->WorldUp));  
            
            // 摄影机右向量 和 摄影机方向向量 再叉乘 得到摄影机上向量
            this->Up = glm::normalize(glm::cross(this->Right, this->Front));
        }

};



#endif
```

