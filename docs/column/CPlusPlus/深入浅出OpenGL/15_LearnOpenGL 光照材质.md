# 光照材质

在真实世界里，每个物体会对光产生不同的反应。钢看起来比陶瓷花瓶更闪闪发光，一个木头箱子不会像钢箱子一样对光产生很强的反射。每个物体对镜面高光也有不同的反应。有些物体不会散射(Scatter)很多光却会反射(Reflect)很多光，结果看起来就有一个较小的高光点(Highlight)，有些物体散射了很多，它们就会产生一个半径更大的高光。如果我们想要在OpenGL中模拟多种类型的物体，我们必须为每个物体分别定义材质(Material)属性。



在前面的教程中，我们指定一个物体和一个光的颜色来定义物体的图像输出，并使之结合环境(Ambient)和镜面强度(Specular Intensity)元素。当描述物体的时候，我们可以使用3种光照元素：环境光照(Ambient Lighting)、漫反射光照(Diffuse Lighting)、镜面光照(Specular Lighting)定义一个材质颜色。通过为每个元素指定一个颜色，我们已经对物体的颜色输出有了精密的控制。现在把一个镜面高光元素添加到这三个颜色里，这是我们需要的所有材质属性：

```c
#version 330 core
struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};
uniform Material material;
```

在片段着色器中，我们创建一个结构体(Struct)，来储存物体的材质属性。我们也可以把它们储存为独立的uniform值，但是作为一个结构体来储存可以更有条理。我们首先定义结构体的布局，然后简单声明一个uniform变量，以新创建的结构体作为它的类型。

就像你所看到的，我们为每个冯氏光照模型的元素都定义一个颜色向量。`ambient`材质向量定义了在环境光照下这个物体反射的是什么颜色；通常这是和物体颜色相同的颜色。`diffuse`材质向量定义了在漫反射光照下物体的颜色。漫反射颜色被设置为(和环境光照一样)我们需要的物体颜色。`specular`材质向量设置的是物体受到的镜面光照的影响的颜色(或者可能是反射一个物体特定的镜面高光颜色)。最后，`shininess`影响镜面高光的散射/半径。

这四个元素定义了一个物体的材质，通过它们我们能够模拟很多真实世界的材质。这里有一个列表[devernay.free.fr](http://devernay.free.fr/cours/opengl/materials.html)展示了几种材质属性，这些材质属性模拟外部世界的真实材质。下面的图片展示了几种真实世界材质对我们的立方体的影响：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240109204308164.png)



如你所见，正确地指定一个物体的材质属性，似乎就是改变我们物体的相关属性的比例。效果显然很引人注目，但是对于大多数真实效果，我们最终需要更加复杂的形状，而不单单是一个立方体。在[后面的教程](https://learnopengl-cn.readthedocs.io/zh/latest/03 Model Loading/01 Assimp/)中，我们会讨论更复杂的形状。

为一个物体赋予一款正确的材质是非常困难的，这需要大量实验和丰富的经验，所以由于错误的设置材质而毁了物体的画面质量是件经常发生的事。

让我们试试在着色器中实现这样的一个材质系统。





我们在片段着色器中创建了一个uniform材质结构体，所以下面我们希望改变光照计算来顺应新的材质属性。由于所有材质元素都储存在结构体中，我们可以从uniform变量`material`取得它们：

```c
void main()
{
    // 环境光
    vec3 ambient = lightColor * material.ambient;

    // 漫反射光
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = lightColor * (diff * material.diffuse);

    // 镜面高光
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = lightColor * (spec * material.specular);  

    vec3 result = ambient + diffuse + specular;
    color = vec4(result, 1.0f);
}
```

你可以看到，我们现在获得所有材质结构体的属性，无论在哪儿我们都需要它们，这次通过材质颜色的帮助，计算结果输出的颜色。物体的每个材质属性都乘以它们对应的光照元素。

通过设置适当的uniform，我们可以在应用中设置物体的材质。当设置uniform时，GLSL中的一个结构体并不会被认为有什么特别之处。一个结构体值扮演uniform变量的封装体，所以如果我们希望填充这个结构体，我们就仍然必须设置结构体中的各个元素的uniform值，但是这次带有结构体名字作为前缀：

```c
GLint matAmbientLoc = glGetUniformLocation(lightingShader.Program, "material.ambient");
GLint matDiffuseLoc = glGetUniformLocation(lightingShader.Program, "material.diffuse");
GLint matSpecularLoc = glGetUniformLocation(lightingShader.Program, "material.specular");
GLint matShineLoc = glGetUniformLocation(lightingShader.Program, "material.shininess");

glUniform3f(matAmbientLoc, 1.0f, 0.5f, 0.31f);
glUniform3f(matDiffuseLoc, 1.0f, 0.5f, 0.31f);
glUniform3f(matSpecularLoc, 0.5f, 0.5f, 0.5f);
glUniform1f(matShineLoc, 32.0f);
```

我们将`ambient`和`diffuse`元素设置成我们想要让物体所呈现的颜色，设置物体的`specular`元素为中等亮度颜色；我们不希望`specular`元素对这个指定物体产生过于强烈的影响。我们同样设置`shininess`为32。我们现在可以简单的在应用中影响物体的材质。

运行程序，会得到下面这样的结果：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%85%89%E7%85%A7%E6%9D%90%E8%B4%A8-17167358615471.gif)



如果你的实现有困难，请参考笔者的是实现。

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
// 光线属性
glm::vec3 lightPos(1.2f, 1.0f, 2.0f);

void do_movement();

int main()
{

	GLFWwindow* window = nullptr;
	GLuint VBO;
	GLuint containerVAO;
	GLuint lightVAO;


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
	Shader lightingShader("res/shaders/lighting.vs", "res/shaders/lighting.frag");
	Shader lampShader("res/shaders/lamp.vs", "res/shaders/lamp.frag");


	// 设置顶点数据集和纹理坐标
	GLfloat vertices[] = {
		  -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		  -0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		  -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,

		  -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		  -0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		  -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,

		  -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,

		   0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,

		  -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		  -0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,

		  -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		  -0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		  -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f
	};


	//containerVAO=>VBO=>vertices
	glGenVertexArrays(1, &containerVAO);
	glGenBuffers(1, &VBO);
	glBindVertexArray(containerVAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));	// 法向量属性
	glEnableVertexAttribArray(1);
	glBindVertexArray(0); //解绑VAO


	//lightVAO=>VBO=>vertices
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)0); // 注意，这里我们跳过法向量属性
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);






	while (!glfwWindowShouldClose(window))
	{
		GLfloat currentFrame;

		GLint viewLoc;
		GLint projLoc;
		GLint modelLoc;
		glm::mat4 model(1.0f);
		glm::mat4 view(1.0f);
		glm::mat4 projection(1.0f);

		currentFrame = glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glfwPollEvents();
		do_movement();
		glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);


		//===================做的物体渲染工作==================
		lightingShader.Use();
		GLint lightColorLoc = glGetUniformLocation(lightingShader.Program, "lightColor");
		GLint lightPosLoc = glGetUniformLocation(lightingShader.Program, "lightPos");
		GLint viewPosLoc = glGetUniformLocation(lightingShader.Program, "viewPos");

		
		//材质结构体注入属性
		GLint matAmbientLoc = glGetUniformLocation(lightingShader.Program, "material.ambient");
		GLint matDiffuseLoc = glGetUniformLocation(lightingShader.Program, "material.diffuse");
		GLint matSpecularLoc = glGetUniformLocation(lightingShader.Program, "material.specular");
		GLint matShineLoc = glGetUniformLocation(lightingShader.Program, "material.shininess");
		glUniform3f(matAmbientLoc, 1.0f, 0.5f, 0.31f);
		glUniform3f(matDiffuseLoc, 1.0f, 0.5f, 0.31f);
		glUniform3f(matSpecularLoc, 0.5f, 0.5f, 0.5f);
		glUniform1f(matShineLoc, 32.0f);


		//随时间更改灯光的位置值
		lightPos.x = 1.0f + sin(glfwGetTime()) * 2.0f;
		lightPos.y = sin(glfwGetTime() / 2.0f) * 1.0f;
		glUniform3f(lightColorLoc, 1.0f, 1.0f, 1.0f);
		glUniform3f(lightPosLoc, lightPos.x, lightPos.y, lightPos.z);
		glUniform3f(viewPosLoc, camera.Position.x, camera.Position.y, camera.Position.z); //这里：注入摄像机的坐标点

	
		view = camera.GetViewMatrix();
		projection = glm::perspective(camera.Zoom, (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);		//计算视图、投影矩阵
		viewLoc = glGetUniformLocation(lightingShader.Program, "view");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));		//注入摄像机位视图矩阵
		
		projLoc = glGetUniformLocation(lightingShader.Program, "projection");
		glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));		//注入摄像机位投影矩阵

		//绑定VAO数据开始渲染
		glBindVertexArray(containerVAO);
		float angle = glfwGetTime() * 25.0f; 		//改标准的模型矩阵 让他基于某个点位先平移再根据时间旋转，让其看起来像动的一样 2D=>3D 其实就是旋转了！
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		modelLoc = glGetUniformLocation(lightingShader.Program, "model");
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model)); 	//注入摄像机位模型矩阵
		glDrawArrays(GL_TRIANGLES, 0, 36); //画三角形
		glBindVertexArray(0);		//渲染完成解绑VAO


		//===================做光源的渲染工作，流程同上========================
		lampShader.Use();
		modelLoc = glGetUniformLocation(lampShader.Program, "model");
		viewLoc = glGetUniformLocation(lampShader.Program, "view");
		projLoc = glGetUniformLocation(lampShader.Program, "projection");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));
		glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));

		glBindVertexArray(lightVAO);
		model = glm::mat4(1.0);
		model = glm::translate(model, lightPos);
		angle = glfwGetTime() * 25.0f;
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		model = glm::scale(model, glm::vec3(0.2f));
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
		glDrawArrays(GL_TRIANGLES, 0, 36);
		glBindVertexArray(0);


		glfwSwapBuffers(window);
	}

	//释放资源
	glDeleteVertexArrays(1, &containerVAO);
	glDeleteVertexArrays(1, &lightVAO);
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
	{
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (keys[GLFW_KEY_S])
	{
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (keys[GLFW_KEY_A])
	{
		camera.ProcessKeyboard(LEFT, deltaTime);
	}

	if (keys[GLFW_KEY_D])
	{
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

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

- lamp.vs

```c
#version 330 core
layout (location = 0) in vec3 position;
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0f);
}

```

- lamp.frag

```c
#version 330 core
out vec4 color;

void main()
{
    color = vec4(1.0f);
}

```

- lighting.vs

```c
#version 330 core
layout (location = 0) in vec3 position; //从顶点集中拿到本帧顶点的 点位置属性
layout (location = 1) in vec3 normal; //从顶点集中拿到本帧顶点的 法向量属性

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

out vec3 Normal;
out vec3 FragPos;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0f);
    FragPos = vec3(model * vec4(position, 1.0f)); //基于模型矩阵变换之后得到帧片段点位置
    Normal = mat3(transpose(inverse(model))) * normal; // 计算出法向量需要的正规矩阵 法向量基于此正规矩阵做一次变换
}
```

- lighting.frag

```c
#version 330 core
out vec4 color;
  
in vec3 Normal;  //.vs从中拿到法向量
in vec3 FragPos;  //.vs中拿到点
  
uniform vec3 lightPos;  //光源的位置
uniform vec3 lightColor; //光源的颜色
uniform vec3 viewPos;


struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};
uniform Material material;

void main()
{
   

   // 环境光
    vec3 ambient = lightColor * material.ambient;

    // 漫反射光
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = lightColor * (diff * material.diffuse);

    // 镜面高光
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = lightColor * (spec * material.specular);  

    vec3 result = ambient + diffuse + specular;
    color = vec4(result, 1.0f);

} 
```

看起来很奇怪不是吗？

## 光的属性

这个物体太亮了。物体过亮的原因是环境、漫反射和镜面三个颜色任何一个光源都会去全力反射。光源对环境、漫反射和镜面元素同时具有不同的强度。前面的教程，我们通过使用一个强度值改变环境和镜面强度的方式解决了这个问题。我们想做一个相同的系统，但是这次为每个光照元素指定了强度向量。如果我们想象`lightColor`是`vec3(1.0)`，代码看起来像是这样：

```c
vec3 ambient = vec3(1.0f) * material.ambient;
vec3 diffuse = vec3(1.0f) * (diff * material.diffuse);
vec3 specular = vec3(1.0f) * (spec * material.specular);
```

所以物体的每个材质属性返回了每个光照元素的全强度。这些vec3(1.0)值可以各自独立的影响各个光源，这通常就是我们想要的。现在物体的`ambient`元素完全地展示了立方体的颜色，可是环境元素不应该对最终颜色有这么大的影响，所以我们要设置光的`ambient`亮度为一个小一点的值，从而限制环境色：

```c
vec3 result = vec3(0.1f) * material.ambient;
```

我们可以用同样的方式影响光源`diffuse`和`specular`的强度。这和我们[前面教程](http://learnopengl-cn.readthedocs.org/zh/latest/02 Lighting/02 Basic Lighting/)所做的极为相似；你可以说我们已经创建了一些光的属性来各自独立地影响每个光照元素。我们希望为光的属性创建一些与材质结构体相似的东西：

```c
struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform Light light;
```

一个光源的`ambient`、`diffuse`和`specular`光都有不同的亮度。环境光通常设置为一个比较低的亮度，因为我们不希望环境色太过显眼。光源的`diffuse`元素通常设置为我们希望光所具有的颜色；经常是一个明亮的白色。`specular`元素通常被设置为`vec3(1.0f)`类型的全强度发光。要记住的是我们同样把光的位置添加到结构体中。

就像材质uniform一样，需要更新片段着色器：

```c
vec3 ambient = light.ambient * material.ambient;
vec3 diffuse = light.diffuse * (diff * material.diffuse);
vec3 specular = light.specular * (spec * material.specular);
```

然后我们要在应用里设置光的亮度：

```c
GLint lightAmbientLoc = glGetUniformLocation(lightingShader.Program, "light.ambient");
GLint lightDiffuseLoc = glGetUniformLocation(lightingShader.Program, "light.diffuse");
GLint lightSpecularLoc = glGetUniformLocation(lightingShader.Program, "light.specular");

glUniform3f(lightAmbientLoc, 0.2f, 0.2f, 0.2f);
glUniform3f(lightDiffuseLoc, 0.5f, 0.5f, 0.5f);// 让我们把这个光调暗一点，这样会看起来更自然
glUniform3f(lightSpecularLoc, 1.0f, 1.0f, 1.0f);
```

现在，我们调整了光是如何影响物体所有的材质的，我们得到一个更像前面教程的视觉输出。这次我们完全控制了物体光照和材质：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%85%89%E7%9A%84%E5%B1%9E%E6%80%A7-17167358788422.gif)



- lighting.frag

```c
#version 330 core
out vec4 color;
  
in vec3 Normal;  //.vs从中拿到法向量
in vec3 FragPos;  //.vs中拿到点
  
uniform vec3 lightPos;  //光源的位置
uniform vec3 viewPos;

struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
uniform Light light;



struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};
uniform Material material;

void main()
{
   

   // 环境光
   vec3 ambient = light.ambient * material.ambient;

    // 漫反射光
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * (diff * material.diffuse);

    // 镜面高光
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
     vec3 specular = light.specular * (spec * material.specular);

    vec3 result = ambient + diffuse + specular;
    color = vec4(result, 1.0f);

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
// 光线属性
glm::vec3 lightPos(1.2f, 1.0f, 2.0f);

void do_movement();

int main()
{

	GLFWwindow* window = nullptr;
	GLuint VBO;
	GLuint containerVAO;
	GLuint lightVAO;


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
	Shader lightingShader("res/shaders/lighting.vs", "res/shaders/lighting.frag");
	Shader lampShader("res/shaders/lamp.vs", "res/shaders/lamp.frag");


	// 设置顶点数据集和纹理坐标
	GLfloat vertices[] = {
		  -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		  -0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		  -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,

		  -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		  -0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		  -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,

		  -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,

		   0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,

		  -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		  -0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,

		  -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		  -0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		  -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f
	};


	//containerVAO=>VBO=>vertices
	glGenVertexArrays(1, &containerVAO);
	glGenBuffers(1, &VBO);
	glBindVertexArray(containerVAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));	// 法向量属性
	glEnableVertexAttribArray(1);
	glBindVertexArray(0); //解绑VAO


	//lightVAO=>VBO=>vertices
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)0); // 注意，这里我们跳过法向量属性
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);






	while (!glfwWindowShouldClose(window))
	{
		GLfloat currentFrame;

		GLint viewLoc;
		GLint projLoc;
		GLint modelLoc;
		glm::mat4 model(1.0f);
		glm::mat4 view(1.0f);
		glm::mat4 projection(1.0f);

		currentFrame = glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glfwPollEvents();
		do_movement();
		glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);


		//===================做的物体渲染工作==================
		lightingShader.Use();
		GLint lightColorLoc = glGetUniformLocation(lightingShader.Program, "lightColor");
		GLint lightPosLoc = glGetUniformLocation(lightingShader.Program, "lightPos");
		GLint viewPosLoc = glGetUniformLocation(lightingShader.Program, "viewPos");

		
		//材质结构体注入属性
		GLint matAmbientLoc = glGetUniformLocation(lightingShader.Program, "material.ambient");
		GLint matDiffuseLoc = glGetUniformLocation(lightingShader.Program, "material.diffuse");
		GLint matSpecularLoc = glGetUniformLocation(lightingShader.Program, "material.specular");
		GLint matShineLoc = glGetUniformLocation(lightingShader.Program, "material.shininess");


		glUniform3f(matAmbientLoc, 1.0f, 0.5f, 0.31f);
		glUniform3f(matDiffuseLoc, 1.0f, 0.5f, 0.31f);
		glUniform3f(matSpecularLoc, 0.5f, 0.5f, 0.5f);
		glUniform1f(matShineLoc, 32.0f);

		//光照结构体注入属性
		GLint lightAmbientLoc = glGetUniformLocation(lightingShader.Program, "light.ambient");
		GLint lightDiffuseLoc = glGetUniformLocation(lightingShader.Program, "light.diffuse");
		GLint lightSpecularLoc = glGetUniformLocation(lightingShader.Program, "light.specular");
		glUniform3f(lightAmbientLoc, 0.2f, 0.2f, 0.2f);
		glUniform3f(lightDiffuseLoc, 0.5f, 0.5f, 0.5f);
		glUniform3f(lightSpecularLoc, 1.0f, 1.0f, 1.0f);


		//随时间更改灯光的位置值
		lightPos.x = 1.0f + sin(glfwGetTime()) * 2.0f;
		lightPos.y = sin(glfwGetTime() / 2.0f) * 1.0f;
		glUniform3f(lightColorLoc, 1.0f, 1.0f, 1.0f);
		glUniform3f(lightPosLoc, lightPos.x, lightPos.y, lightPos.z);
		glUniform3f(viewPosLoc, camera.Position.x, camera.Position.y, camera.Position.z); //这里：注入摄像机的坐标点

	
		view = camera.GetViewMatrix();
		projection = glm::perspective(camera.Zoom, (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);		//计算视图、投影矩阵
		viewLoc = glGetUniformLocation(lightingShader.Program, "view");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));		//注入摄像机位视图矩阵
		
		projLoc = glGetUniformLocation(lightingShader.Program, "projection");
		glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));		//注入摄像机位投影矩阵

		//绑定VAO数据开始渲染
		glBindVertexArray(containerVAO);
		float angle = glfwGetTime() * 25.0f; 		//改标准的模型矩阵 让他基于某个点位先平移再根据时间旋转，让其看起来像动的一样 2D=>3D 其实就是旋转了！
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		modelLoc = glGetUniformLocation(lightingShader.Program, "model");
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model)); 	//注入摄像机位模型矩阵
		glDrawArrays(GL_TRIANGLES, 0, 36); //画三角形
		glBindVertexArray(0);		//渲染完成解绑VAO


		//===================做光源的渲染工作，流程同上========================
		lampShader.Use();
		modelLoc = glGetUniformLocation(lampShader.Program, "model");
		viewLoc = glGetUniformLocation(lampShader.Program, "view");
		projLoc = glGetUniformLocation(lampShader.Program, "projection");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));
		glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));

		glBindVertexArray(lightVAO);
		model = glm::mat4(1.0);
		model = glm::translate(model, lightPos);
		angle = glfwGetTime() * 25.0f;
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		model = glm::scale(model, glm::vec3(0.2f));
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
		glDrawArrays(GL_TRIANGLES, 0, 36);
		glBindVertexArray(0);


		glfwSwapBuffers(window);
	}

	//释放资源
	glDeleteVertexArrays(1, &containerVAO);
	glDeleteVertexArrays(1, &lightVAO);
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
	{
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (keys[GLFW_KEY_S])
	{
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (keys[GLFW_KEY_A])
	{
		camera.ProcessKeyboard(LEFT, deltaTime);
	}

	if (keys[GLFW_KEY_D])
	{
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

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

现在改变物体的外观相对简单了些。我们做点更有趣的事！

## 不同的光源颜色

目前为止，我们使用光源的颜色仅仅去改变物体各个元素的强度(通过选用从白到灰到黑范围内的颜色)，并没有影响物体的真实颜色(只是强度)。由于现在能够非常容易地访问光的属性了，我们可以随着时间改变它们的颜色来获得一些有很意思的效果。由于所有东西都已经在片段着色器做好了，改变光的颜色很简单，我们可以立即创建出一些有趣的效果：



如你所见，不同光的颜色极大地影响了物体的颜色输出。由于光的颜色直接影响物体反射的颜色(你可能想起在颜色教程中有讨论过)，它对视觉输出有显著的影响。

利用`sin`和`glfwGetTime`改变光的环境和漫反射颜色，我们可以随着时间流逝简单的改变光源颜色：

- Main.cpp

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
// 光线属性
glm::vec3 lightPos(1.2f, 1.0f, 2.0f);

void do_movement();

int main()
{

	GLFWwindow* window = nullptr;
	GLuint VBO;
	GLuint containerVAO;
	GLuint lightVAO;


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
	Shader lightingShader("res/shaders/lighting.vs", "res/shaders/lighting.frag");
	Shader lampShader("res/shaders/lamp.vs", "res/shaders/lamp.frag");


	// 设置顶点数据集和纹理坐标
	GLfloat vertices[] = {
		  -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		  -0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,
		  -0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,

		  -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		  -0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,
		  -0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,

		  -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,
		  -0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,

		   0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,

		  -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		   0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		  -0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,
		  -0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,

		  -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		   0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		  -0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,
		  -0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f
	};


	//containerVAO=>VBO=>vertices
	glGenVertexArrays(1, &containerVAO);
	glGenBuffers(1, &VBO);
	glBindVertexArray(containerVAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));	// 法向量属性
	glEnableVertexAttribArray(1);
	glBindVertexArray(0); //解绑VAO


	//lightVAO=>VBO=>vertices
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 6 * sizeof(GLfloat), (GLvoid*)0); // 注意，这里我们跳过法向量属性
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);






	while (!glfwWindowShouldClose(window))
	{
		GLfloat currentFrame;

		GLint viewLoc;
		GLint projLoc;
		GLint modelLoc;
		glm::mat4 model(1.0f);
		glm::mat4 view(1.0f);
		glm::mat4 projection(1.0f);

		currentFrame = glfwGetTime();
		deltaTime = currentFrame - lastFrame;
		lastFrame = currentFrame;

		glfwPollEvents();
		do_movement();
		glClearColor(0.1f, 0.1f, 0.1f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);


		//===================做的物体渲染工作==================
		lightingShader.Use();
		GLint lightColorLoc = glGetUniformLocation(lightingShader.Program, "lightColor");
		GLint lightPosLoc = glGetUniformLocation(lightingShader.Program, "lightPos");
		GLint viewPosLoc = glGetUniformLocation(lightingShader.Program, "viewPos");

		
		//材质结构体注入属性
		GLint matAmbientLoc = glGetUniformLocation(lightingShader.Program, "material.ambient");
		GLint matDiffuseLoc = glGetUniformLocation(lightingShader.Program, "material.diffuse");
		GLint matSpecularLoc = glGetUniformLocation(lightingShader.Program, "material.specular");
		GLint matShineLoc = glGetUniformLocation(lightingShader.Program, "material.shininess");


		glUniform3f(matAmbientLoc, 1.0f, 0.5f, 0.31f);
		glUniform3f(matDiffuseLoc, 1.0f, 0.5f, 0.31f);
		glUniform3f(matSpecularLoc, 0.5f, 0.5f, 0.5f);
		glUniform1f(matShineLoc, 32.0f);

		//光照结构体注入属性
		GLint lightAmbientLoc = glGetUniformLocation(lightingShader.Program, "light.ambient");
		GLint lightDiffuseLoc = glGetUniformLocation(lightingShader.Program, "light.diffuse");
		GLint lightSpecularLoc = glGetUniformLocation(lightingShader.Program, "light.specular");

		//利用sin和glfwGetTime改变光的环境和漫反射颜色，我们可以随着时间流逝简单的改变光源颜色：
		glm::vec3 lightColor; lightColor.x = sin(glfwGetTime() * 2.0f);
		lightColor.y = sin(glfwGetTime() * 0.7f);
		lightColor.z = sin(glfwGetTime() * 1.3f);

		glm::vec3 diffuseColor = lightColor * glm::vec3(0.5f);
		glm::vec3 ambientColor = diffuseColor * glm::vec3(0.2f);

		glUniform3f(lightAmbientLoc, ambientColor.x, ambientColor.y, ambientColor.z);
		glUniform3f(lightDiffuseLoc, diffuseColor.x, diffuseColor.y, diffuseColor.z);
		glUniform3f(lightSpecularLoc, 1.0f, 1.0f, 1.0f);

		//随时间更改灯光的位置值
		lightPos.x = 1.0f + sin(glfwGetTime()) * 2.0f;
		lightPos.y = sin(glfwGetTime() / 2.0f) * 1.0f;
		glUniform3f(lightColorLoc, 1.0f, 1.0f, 1.0f);
		glUniform3f(lightPosLoc, lightPos.x, lightPos.y, lightPos.z);
		glUniform3f(viewPosLoc, camera.Position.x, camera.Position.y, camera.Position.z); //这里：注入摄像机的坐标点

	
		view = camera.GetViewMatrix();
		projection = glm::perspective(camera.Zoom, (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);		//计算视图、投影矩阵
		viewLoc = glGetUniformLocation(lightingShader.Program, "view");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));		//注入摄像机位视图矩阵
		
		projLoc = glGetUniformLocation(lightingShader.Program, "projection");
		glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));		//注入摄像机位投影矩阵

		//绑定VAO数据开始渲染
		glBindVertexArray(containerVAO);
		float angle = glfwGetTime() * 25.0f; 		//改标准的模型矩阵 让他基于某个点位先平移再根据时间旋转，让其看起来像动的一样 2D=>3D 其实就是旋转了！
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		modelLoc = glGetUniformLocation(lightingShader.Program, "model");
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model)); 	//注入摄像机位模型矩阵
		glDrawArrays(GL_TRIANGLES, 0, 36); //画三角形
		glBindVertexArray(0);		//渲染完成解绑VAO


		//===================做光源的渲染工作，流程同上========================
		lampShader.Use();
		modelLoc = glGetUniformLocation(lampShader.Program, "model");
		viewLoc = glGetUniformLocation(lampShader.Program, "view");
		projLoc = glGetUniformLocation(lampShader.Program, "projection");
		glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));
		glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));

		glBindVertexArray(lightVAO);
		model = glm::mat4(1.0);
		model = glm::translate(model, lightPos);
		angle = glfwGetTime() * 25.0f;
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		model = glm::scale(model, glm::vec3(0.2f));
		glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
		glDrawArrays(GL_TRIANGLES, 0, 36);
		glBindVertexArray(0);


		glfwSwapBuffers(window);
	}

	//释放资源
	glDeleteVertexArrays(1, &containerVAO);
	glDeleteVertexArrays(1, &lightVAO);
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
	{
		camera.ProcessKeyboard(FORWARD, deltaTime);
	}
	if (keys[GLFW_KEY_S])
	{
		camera.ProcessKeyboard(BACKWARD, deltaTime);
	}
	if (keys[GLFW_KEY_A])
	{
		camera.ProcessKeyboard(LEFT, deltaTime);
	}

	if (keys[GLFW_KEY_D])
	{
		camera.ProcessKeyboard(RIGHT, deltaTime);
	}

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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E4%B8%8D%E5%90%8C%E7%9A%84%E5%85%89%E6%BA%90%E9%A2%9C%E8%89%B2-17167359037703.gif)