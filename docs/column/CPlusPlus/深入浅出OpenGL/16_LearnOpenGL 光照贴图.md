# 光照贴图

前面的教程，我们讨论了让不同的物体拥有各自不同的材质并对光照做出不同的反应的方法。在一个光照场景中，让每个物体拥有和其他物体不同的外观很棒，但是这仍然不能对一个物体的图像输出提供足够多的灵活性。

前面的教程中我们将一个物体自身作为一个整体为其定义了一个材质，但是现实世界的物体通常不会只有这么一种材质，而是由多种材质组成。想象一辆车：它的外表质地光亮，车窗会部分反射环境，它的轮胎没有specular高光，轮彀却非常闪亮（在洗过之后）。汽车同样有diffuse和ambient颜色，它们在整个车上都不相同；一辆车显示了多种不同的ambient/diffuse颜色。总之，这样一个物体每个部分都有多种材质属性。

所以，前面的材质系统对于除了最简单的模型以外都是不够的，所以我们需要扩展前面的系统，我们要介绍diffuse和specular贴图。它们允许你对一个物体的diffuse（而对于简洁的ambient成分来说，它们几乎总是是一样的）和specular成分能够有更精确的影响。

# 漫反射贴图

我们希望通过某种方式对每个原始像素独立设置diffuse颜色。有可以让我们基于物体原始像素的位置来获取颜色值的系统吗？



这可能听起来极其相似，坦白来讲我们使用这样的系统已经有一段时间了。听起来很像在一个[之前的教程](https://learnopengl-cn.readthedocs.io/zh/latest/01 Getting started/06 Textures/)中谈论的**纹理**，它基本就是一个纹理。我们其实是使用同一个潜在原则下的不同名称：使用一张图片覆盖住物体，以便我们为每个原始像素索引独立颜色值。在光照场景中，通过纹理来呈现一个物体的diffuse颜色，这个做法被称做**漫反射贴图(Diffuse texture)**(因为3D建模师就是这么称呼这个做法的)。



为了演示漫反射贴图，我们将会使用[下面的图片](http://learnopengl.com/img/textures/container2.png)，它是一个有一圈钢边的木箱：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110191617440.png)







在着色器中使用漫反射贴图和纹理教程介绍的一样。这次我们把纹理以sampler2D类型储存在Material结构体中。我们使用diffuse贴图替代早期定义的vec3类型的diffuse颜色。

> 要记住的是sampler2D也叫做模糊类型，这意味着我们不能以某种类型对它实例化，只能用uniform定义它们。如果我们用结构体而不是uniform实例化（就像函数的参数那样），GLSL会抛出奇怪的错误；这同样也适用于其他模糊类型。

我们也要移除amibient材质颜色向量，因为ambient颜色绝大多数情况等于diffuse颜色，所以不需要分别去储存它：

```c
struct Material
{
    sampler2D diffuse;
    vec3 specular;
    float shininess;
};
...
in vec2 TexCoords;
```

> 如果你非把ambient颜色设置为不同的值不可（不同于diffuse值），你可以继续保留ambient的vec3，但是整个物体的ambient颜色会继续保持不变。为了使每个原始像素得到不同ambient值，你需要对ambient值单独使用另一个纹理。

注意，在片段着色器中我们将会再次需要纹理坐标，所以我们声明一个额外输入变量。然后我们简单地从纹理采样，来获得原始像素的diffuse颜色值：

```c
vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
```

同样，不要忘记把ambient材质的颜色设置为diffuse材质的颜色：

```c
vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
```

这就是diffuse贴图的全部内容了。就像你看到的，这不是什么新的东西，但是它却极大提升了视觉品质。为了让它工作，我们需要用到纹理坐标更新顶点数据，把它们作为顶点属性传递到片段着色器，把纹理加载并绑定到合适的纹理单元。

更新的顶点数据可以从[这里](http://learnopengl.com/code_viewer.php?code=lighting/vertex_data_textures)找到。顶点数据现在包括了顶点位置，法线向量和纹理坐标，每个立方体的顶点都有这些属性。让我们更新顶点着色器来接受纹理坐标作为顶点属性，然后发送到片段着色器：

```c
#version 330 core
layout (location = 0) in vec3 position; //从顶点集中拿到本帧顶点的 点位置属性
layout (location = 1) in vec3 normal; //从顶点集中拿到本帧顶点的 法向量属性
layout (location = 2) in vec2 texCoords; //从顶点集中拿到本帧顶点的 纹理属性

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
out vec2 TexCoords;
out vec3 Normal;
out vec3 FragPos;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0f);
    FragPos = vec3(model * vec4(position, 1.0f)); //基于模型矩阵变换之后得到帧片段点位置
    Normal = mat3(transpose(inverse(model))) * normal; // 计算出法向量需要的正规矩阵 法向量基于此正规矩阵做一次变换
    TexCoords = texCoords; //纹理坐标
}
```

要保证更新的顶点属性指针，不仅是VAO匹配新的顶点数据，也要把箱子图片加载为纹理。在绘制箱子之前，我们希望首选纹理单元被赋为`material.diffuse`这个uniform采样器，并绑定箱子的纹理到这个纹理单元：

```c
glUniform1i(glGetUniformLocation(lightingShader.Program, "material.diffuse"), 0);
...
glActiveTexture(GL_TEXTURE0);
glBindTexture(GL_TEXTURE_2D, diffuseMap);
```

现在，使用一个diffuse贴图，我们在细节上再次获得惊人的提升，这次添加到箱子上的光照开始闪光了（名符其实）。你的箱子现在可能看起来像这样：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%BC%AB%E5%8F%8D%E5%B0%84%E8%B4%B4%E5%9B%BE-17167360012751.gif)

你可以在这里得到笔者的实现代码。

- lighting.vs

```c
#version 330 core
layout (location = 0) in vec3 position; //从顶点集中拿到本帧顶点的 点位置属性
layout (location = 1) in vec3 normal; //从顶点集中拿到本帧顶点的 法向量属性
layout (location = 2) in vec2 texCoords; //从顶点集中拿到本帧顶点的 纹理属性

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
out vec2 TexCoords;
out vec3 Normal;
out vec3 FragPos;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0f);
    FragPos = vec3(model * vec4(position, 1.0f)); //基于模型矩阵变换之后得到帧片段点位置
    Normal = mat3(transpose(inverse(model))) * normal; // 计算出法向量需要的正规矩阵 法向量基于此正规矩阵做一次变换
    TexCoords = texCoords; //纹理坐标
}
```

- lighting.frag

```c
#version 330 core

struct Material 
{
    sampler2D diffuse;
    sampler2D specular;
    float     shininess;
};  

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;  
in vec3 Normal;  
in vec2 TexCoords;
  
out vec4 color;
  
uniform vec3 viewPos;
uniform Material material;
uniform Light light;

void main()
{
    // 求解环境因子
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
  	
    // 求解散射因子 
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));  
    
    // 求解镜面因子 注入纹理坐标，计算材质颜色
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
        
    color = vec4(ambient + diffuse + specular, 1.0f);  
} 
```

- **lamp.vs**

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

//窗口维度
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
	glEnable(GL_DEPTH_TEST); 



	//构建作色器程序
	Shader lightingShader("res/shaders/lighting.vs", "res/shaders/lighting.frag");
	Shader lampShader("res/shaders/lamp.vs", "res/shaders/lamp.frag");


	// 设置顶点数据集和纹理坐标
	float vertices[] = {
		// positions          // normals           // texture coords
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f, 0.0f,
		 0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f, 1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f, 1.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f, 0.0f,

		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f, 1.0f,   0.0f, 0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f,  0.0f, 1.0f,   1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f, 1.0f,   1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f, 1.0f,   1.0f, 1.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  0.0f, 1.0f,   0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f, 1.0f,   0.0f, 0.0f,

		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f, 0.0f,
		-0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  1.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f, 1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f, 1.0f,
		-0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  0.0f, 0.0f,
		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f, 0.0f,

		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f, 0.0f,
		 0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  1.0f, 1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f, 1.0f,
		 0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  0.0f, 0.0f,
		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f, 0.0f,

		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f, 1.0f,
		 0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  1.0f, 1.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f, 0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f, 0.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  0.0f, 0.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f, 1.0f,

		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f, 1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  1.0f, 1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f, 0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f, 0.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  0.0f, 0.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f, 1.0f
	};


	//containerVAO=>VBO=>vertices
	glGenVertexArrays(1, &containerVAO);
	glGenBuffers(1, &VBO);
	glBindVertexArray(containerVAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));	// 法向量属性
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat))); // 纹理属性
	glEnableVertexAttribArray(2);
	glBindVertexArray(0); //解绑VAO


	//lightVAO=>VBO=>vertices
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0); // 注意，这里我们跳过法向量属性
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);


	//加载纹理
	GLuint diffuseMap;
	glGenTextures(1, &diffuseMap);
	int width, height;
	unsigned char* image;
	stbi_set_flip_vertically_on_load(1);
	image  = stbi_load("src/container2.png", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, diffuseMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);
	glBindTexture(GL_TEXTURE_2D, 0);


	lightingShader.Use();
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.diffuse"), 0);


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
		GLint lightPosLoc = glGetUniformLocation(lightingShader.Program, "light.position");
		GLint viewPosLoc = glGetUniformLocation(lightingShader.Program, "viewPos");

		//随时间更改灯光的位置值
		lightPos.x = 1.0f + sin(glfwGetTime()) * 2.0f;
		lightPos.y = sin(glfwGetTime() / 2.0f) * 1.0f;
		glUniform3f(lightPosLoc, lightPos.x, lightPos.y, lightPos.z);
		glUniform3f(viewPosLoc, camera.Position.x, camera.Position.y, camera.Position.z); //这里：注入摄像机的坐标点

		// Set lights properties
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.ambient"), 0.2f, 0.2f, 0.2f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.diffuse"), 0.5f, 0.5f, 0.5f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.specular"), 1.0f, 1.0f, 1.0f);
		// Set material properties
		glUniform3f(glGetUniformLocation(lightingShader.Program, "material.specular"), 0.5f, 0.5f, 0.5f);
		glUniform1f(glGetUniformLocation(lightingShader.Program, "material.shininess"), 64.0f);
		
		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, diffuseMap);



		//利用sin和glfwGetTime改变光的环境和漫反射颜色，我们可以随着时间流逝简单的改变光源颜色：
		glm::vec3 lightColor; lightColor.x = sin(glfwGetTime() * 2.0f);
		lightColor.y = sin(glfwGetTime() * 0.7f);
		lightColor.z = sin(glfwGetTime() * 1.3f);

		glm::vec3 diffuseColor = lightColor * glm::vec3(0.5f);
		glm::vec3 ambientColor = diffuseColor * glm::vec3(0.2f);

	
	

	
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

# 镜面贴图

你可能注意到，specular高光看起来不怎么样，由于我们的物体是个箱子，大部分是木头，我们知道木头是不应该有镜面高光的。我们通过把物体设置specular材质设置为vec3(0.0f)来修正它。但是这样意味着铁边会不再显示镜面高光，我们知道钢铁是会显示一些镜面高光的。我们会想要控制物体部分地显示镜面高光，它带有修改了的亮度。这个问题看起来和diffuse贴图的讨论一样。这是巧合吗？我想不是。



我们同样用一个纹理贴图，来获得镜面高光。这意味着我们需要生成一个黑白（或者你喜欢的颜色）纹理来定义specular亮度，把它应用到物体的每个部分。下面是一个[镜面贴图(Specular Map)](http://learnopengl.com/img/textures/container2_specular.png)的例子：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110192707233-17167361383808.png)





一个specular高光的亮度可以通过图片中每个纹理的亮度来获得。specular贴图的每个像素可以显示为一个颜色向量，比如：在那里黑色代表颜色向量vec3(0.0f)，灰色是vec3(0.5f)。在片段着色器中，我们采样相应的颜色值，把它乘以光的specular亮度。像素越“白”，乘积的结果越大，物体的specualr部分越亮。

由于箱子几乎是由木头组成，木头作为一个材质不会有镜面高光，整个木头部分的diffuse纹理被用黑色覆盖：黑色部分不会包含任何specular高光。箱子的铁边有一个修改的specular亮度，它自身更容易受到镜面高光影响，木纹部分则不会。

从技术上来讲，木头也有镜面高光，尽管这个闪亮值很小（更多的光被散射），影响很小，但是为了学习目的，我们可以假装木头不会有任何specular光反射。

使用Photoshop或Gimp之类的工具，通过将图片进行裁剪，将某部分调整成黑白图样，并调整亮度/对比度的做法，可以非常容易将一个diffuse纹理贴图处理为specular贴图。



## 镜面贴图采样

一个specular贴图和其他纹理一样，所以代码和diffuse贴图的代码也相似。确保合理的加载了图片，生成一个纹理对象。由于我们在同样的片段着色器中使用另一个纹理采样器，我们必须为specular贴图使用一个不同的纹理单元(参见[纹理](https://learnopengl-cn.readthedocs.io/zh/latest/01 Getting started/06 Textures/))，所以在渲染前让我们把它绑定到合适的纹理单元



```c
glUniform1i(glGetUniformLocation(lightingShader.Program, "material.specular"), 1);
...
glActiveTexture(GL_TEXTURE1);
glBindTexture(GL_TEXTURE_2D, specularMap);
```

然后更新片段着色器材质属性，接受一个sampler2D作为这个specular部分的类型，而不是vec3：

```c
struct Material
{
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
};
```

最后我们希望采样这个specular贴图，来获取原始像素相应的specular亮度：

```c
vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));
vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
color = vec4(ambient + diffuse + specular, 1.0f);
```

```
color = vec4(ambient + diffuse + specular, 1.0f);
```

通过使用一个specular贴图我们可以定义极为精细的细节，物体的这个部分会获得闪亮的属性，我们可以设置它们相应的亮度。specular贴图给我们一个附加的高于diffuse贴图的控制权限。

如果你不想成为主流，你可以在specular贴图里使用颜色，不单单为每个原始像素设置specular亮度，同时也设置specular高光的颜色。从真实角度来说，specular的颜色基本是由光源自身决定的，所以它不会生成真实的图像（这就是为什么图片通常是黑色和白色的：我们只关心亮度）。

如果你现在运行应用，你可以清晰地看到箱子的材质现在非常类似真实的铁边的木头箱子了：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E9%95%9C%E9%9D%A2%E8%B4%B4%E5%9B%BE%E9%87%87%E6%A0%B7-17048872237512-17167361152697.gif)





如果你的实现有困难，可以参考笔者的实现。



- lighting.vs

```c
#version 330 core
layout (location = 0) in vec3 position; //从顶点集中拿到本帧顶点的 点位置属性
layout (location = 1) in vec3 normal; //从顶点集中拿到本帧顶点的 法向量属性
layout (location = 2) in vec2 texCoords; //从顶点集中拿到本帧顶点的 纹理属性

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
out vec2 TexCoords;
out vec3 Normal;
out vec3 FragPos;

void main()
{
    gl_Position = projection * view * model * vec4(position, 1.0f);
    FragPos = vec3(model * vec4(position, 1.0f)); //基于模型矩阵变换之后得到帧片段点位置
    Normal = mat3(transpose(inverse(model))) * normal; // 计算出法向量需要的正规矩阵 法向量基于此正规矩阵做一次变换
    TexCoords = texCoords; //纹理坐标
}

```

- lighting.frag

```c
#version 330 core
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float     shininess;
};  

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;  
in vec3 Normal;  
in vec2 TexCoords;
  
out vec4 color;
  
uniform vec3 viewPos;
uniform Material material;
uniform Light light;

void main()
{
    // Ambient
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
  	
    // Diffuse 
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));  
    
    // Specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
        
    color = vec4(ambient + diffuse + specular, 1.0f);  
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

//窗口维度
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
	glEnable(GL_DEPTH_TEST); 



	//构建作色器程序
	Shader lightingShader("res/shaders/lighting.vs", "res/shaders/lighting.frag");
	Shader lampShader("res/shaders/lamp.vs", "res/shaders/lamp.frag");


	// 设置顶点数据集和纹理坐标
	GLfloat vertices[] = {
		// Positions          // Normals           // Texture Coords
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  1.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f
	};


	//containerVAO=>VBO=>vertices
	glGenVertexArrays(1, &containerVAO);
	glGenBuffers(1, &VBO);
	glBindVertexArray(containerVAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));	// 法向量属性
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat))); // 纹理属性
	glEnableVertexAttribArray(2);
	glBindVertexArray(0); //解绑VAO


	//lightVAO=>VBO=>vertices
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0); // 注意，这里我们跳过法向量属性
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);


	//加载纹理
	
	  // Diffuse map
	GLuint diffuseMap;
	glGenTextures(1, &diffuseMap);
	int width, height;
	unsigned char* image;
	stbi_set_flip_vertically_on_load(1);
	image  = stbi_load("src/container2.png", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, diffuseMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);


	// Specular map
	GLuint specularMap;
	glGenTextures(1, &specularMap);
	image = stbi_load("src/container2_specular.png", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, specularMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);
	glBindTexture(GL_TEXTURE_2D, 0);



	lightingShader.Use();
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.diffuse"), 0);
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.specular"), 1);


	while (!glfwWindowShouldClose(window))
	{
		GLfloat currentFrame;
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
		GLint lightPosLoc = glGetUniformLocation(lightingShader.Program, "light.position");
		GLint viewPosLoc = glGetUniformLocation(lightingShader.Program, "viewPos");

		//随时间更改灯光的位置值
		lightPos.x = 1.0f + sin(glfwGetTime()) * 2.0f;
		lightPos.y = sin(glfwGetTime() / 2.0f) * 1.0f;
		glUniform3f(lightPosLoc, lightPos.x, lightPos.y, lightPos.z);
		glUniform3f(viewPosLoc, camera.Position.x, camera.Position.y, camera.Position.z); //这里：注入摄像机的坐标点

		// 设置光线属性
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.ambient"), 0.2f, 0.2f, 0.2f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.diffuse"), 0.5f, 0.5f, 0.5f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.specular"), 1.0f, 1.0f, 1.0f);
		
		// 设置材质属性
		glUniform1f(glGetUniformLocation(lightingShader.Program, "material.shininess"), 32.0f);
		
		//激活纹理
		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, diffuseMap);
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, specularMap);

	
		view = camera.GetViewMatrix();
		projection = glm::perspective(camera.Zoom, (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);	
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "view"), 1, GL_FALSE, glm::value_ptr(view));		//注入摄像机位视图矩阵
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "projection"), 1, GL_FALSE, glm::value_ptr(projection));		//注入摄像机位投影矩阵

		//绑定VAO数据开始渲染
		glBindVertexArray(containerVAO);
		float angle = glfwGetTime() * 25.0f; 		//改标准的模型矩阵 让他基于某个点位先平移再根据时间旋转，让其看起来像动的一样 2D=>3D 其实就是旋转了！
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "model"), 1, GL_FALSE, glm::value_ptr(model)); 	//注入摄像机位模型矩阵
		glDrawArrays(GL_TRIANGLES, 0, 36); //画三角形
		glBindVertexArray(0);		//渲染完成解绑VAO


		//===================做光源的渲染工作，流程同上========================
		lampShader.Use();
		glBindVertexArray(lightVAO);
		model = glm::mat4(1.0);
		model = glm::translate(model, lightPos);
		angle = glfwGetTime() * 25.0f;
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		model = glm::scale(model, glm::vec3(0.2f));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "model"), 1, GL_FALSE, glm::value_ptr(model));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "view"), 1, GL_FALSE, glm::value_ptr(view));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "projection"), 1, GL_FALSE, glm::value_ptr(projection));
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

# 练习

> - 尝试在片段着色器中反转镜面贴图(Specular Map)的颜色值，然后木头就会变得反光而边框不会反光了（由于贴图中钢边依然有一些残余颜色，所以钢边依然会有一些高光，不过反光明显小了很多）

```c
#version 330 core
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float     shininess;
};  

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;  
in vec3 Normal;  
in vec2 TexCoords;
  
out vec4 color;
  
uniform vec3 viewPos;
uniform Material material;
uniform Light light;

void main()
{
    // Ambient
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
  	
    // Diffuse 
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));  
    
    // Specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * spec * (vec3(1.0) - vec3(texture(material.specular, TexCoords))); //在这里，我们反转采样的镜面反射颜色。黑变白，白变黑。
        
    color = vec4(ambient + diffuse + specular, 1.0f);  
} 
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110195314257-17167360947956.png)



> - 使用漫反射纹理(Diffuse Texture)原本的颜色而不是黑白色来创建镜面贴图，并观察，你会发现结果显得并不那么真实了。如果你不会处理图片，你可以使用这个[带颜色的镜面贴图](http://learnopengl.com/img/lighting/lighting_maps_specular_color.png) 如下所示：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110195714183-17167360717355.png)



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

//窗口维度
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
	glEnable(GL_DEPTH_TEST); 



	//构建作色器程序
	Shader lightingShader("res/shaders/lighting.vs", "res/shaders/lighting.frag");
	Shader lampShader("res/shaders/lamp.vs", "res/shaders/lamp.frag");


	// 设置顶点数据集和纹理坐标
	GLfloat vertices[] = {
		// Positions          // Normals           // Texture Coords
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  1.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f
	};


	//containerVAO=>VBO=>vertices
	glGenVertexArrays(1, &containerVAO);
	glGenBuffers(1, &VBO);
	glBindVertexArray(containerVAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));	// 法向量属性
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat))); // 纹理属性
	glEnableVertexAttribArray(2);
	glBindVertexArray(0); //解绑VAO


	//lightVAO=>VBO=>vertices
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0); // 注意，这里我们跳过法向量属性
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);


	//加载纹理
	
	  // Diffuse map
	GLuint diffuseMap;
	glGenTextures(1, &diffuseMap);
	int width, height;
	unsigned char* image;
	stbi_set_flip_vertically_on_load(1);
	//改图片即可出效果
	image  = stbi_load("src/lighting_maps_specular_color.png", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, diffuseMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);


	// Specular map
	GLuint specularMap;
	glGenTextures(1, &specularMap);
	image = stbi_load("src/container2_specular.png", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, specularMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);
	glBindTexture(GL_TEXTURE_2D, 0);



	lightingShader.Use();
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.diffuse"), 0);
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.specular"), 1);


	while (!glfwWindowShouldClose(window))
	{
		GLfloat currentFrame;
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
		GLint lightPosLoc = glGetUniformLocation(lightingShader.Program, "light.position");
		GLint viewPosLoc = glGetUniformLocation(lightingShader.Program, "viewPos");

		//随时间更改灯光的位置值
		lightPos.x = 1.0f + sin(glfwGetTime()) * 2.0f;
		lightPos.y = sin(glfwGetTime() / 2.0f) * 1.0f;
		glUniform3f(lightPosLoc, lightPos.x, lightPos.y, lightPos.z);
		glUniform3f(viewPosLoc, camera.Position.x, camera.Position.y, camera.Position.z); //这里：注入摄像机的坐标点

		// 设置光线属性
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.ambient"), 0.2f, 0.2f, 0.2f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.diffuse"), 0.5f, 0.5f, 0.5f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.specular"), 1.0f, 1.0f, 1.0f);
		
		// 设置材质属性
		glUniform1f(glGetUniformLocation(lightingShader.Program, "material.shininess"), 32.0f);
		
		//激活纹理
		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, diffuseMap);
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, specularMap);

	
		view = camera.GetViewMatrix();
		projection = glm::perspective(camera.Zoom, (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);	
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "view"), 1, GL_FALSE, glm::value_ptr(view));		//注入摄像机位视图矩阵
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "projection"), 1, GL_FALSE, glm::value_ptr(projection));		//注入摄像机位投影矩阵

		//绑定VAO数据开始渲染
		glBindVertexArray(containerVAO);
		float angle = glfwGetTime() * 25.0f; 		//改标准的模型矩阵 让他基于某个点位先平移再根据时间旋转，让其看起来像动的一样 2D=>3D 其实就是旋转了！
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "model"), 1, GL_FALSE, glm::value_ptr(model)); 	//注入摄像机位模型矩阵
		glDrawArrays(GL_TRIANGLES, 0, 36); //画三角形
		glBindVertexArray(0);		//渲染完成解绑VAO


		//===================做光源的渲染工作，流程同上========================
		lampShader.Use();
		glBindVertexArray(lightVAO);
		model = glm::mat4(1.0);
		model = glm::translate(model, lightPos);
		angle = glfwGetTime() * 25.0f;
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		model = glm::scale(model, glm::vec3(0.2f));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "model"), 1, GL_FALSE, glm::value_ptr(model));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "view"), 1, GL_FALSE, glm::value_ptr(view));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "projection"), 1, GL_FALSE, glm::value_ptr(projection));
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%B8%A6%E9%A2%9C%E8%89%B2%E7%9A%84%E9%95%9C%E9%9D%A2%E8%B4%B4%E5%9B%BE-17048879336605-17167360550504.gif)

>  添加一个叫做**放射光贴图(Emission Map)**的东西，即记录每个片段发光值(Emission Value)大小的贴图，发光值是(模拟)物体自身**发光(Emit)**时可能产生的颜色。这样的话物体就可以忽略环境光自身发光。通常在你看到游戏里某个东西(比如 [机器人的眼](http://www.witchbeam.com.au/unityboard/shaders_enemy.jpg),或是[箱子上的小灯](http://www.tomdalling.com/images/posts/modern-opengl-08/emissive.png))在发光时，使用的就是放射光贴图。使用[这个](http://learnopengl.com/img/textures/matrix.jpg)贴图(作者为 creativesam)作为放射光贴图并使用在箱子上，你就会看到箱子上有会发光的字了

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

//窗口维度
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
	glEnable(GL_DEPTH_TEST); 



	//构建作色器程序
	Shader lightingShader("res/shaders/lighting.vs", "res/shaders/lighting.frag");
	Shader lampShader("res/shaders/lamp.vs", "res/shaders/lamp.frag");


	// 设置顶点数据集和纹理坐标
	GLfloat vertices[] = {
		// Positions          // Normals           // Texture Coords
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f,  0.0f,  0.0f, -1.0f,  0.0f,  0.0f,

		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  1.0f,  1.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f,  0.0f,  0.0f,  1.0f,  0.0f,  0.0f,

		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f, -0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		-0.5f, -0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f,  0.5f, -1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  0.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  1.0f,  0.0f,  0.0f,  1.0f,  0.0f,

		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  1.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f, -0.5f,  0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f, -0.5f, -0.5f,  0.0f, -1.0f,  0.0f,  0.0f,  1.0f,

		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f,
		 0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  1.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		 0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  1.0f,  0.0f,
		-0.5f,  0.5f,  0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  0.0f,
		-0.5f,  0.5f, -0.5f,  0.0f,  1.0f,  0.0f,  0.0f,  1.0f
	};


	//containerVAO=>VBO=>vertices
	glGenVertexArrays(1, &containerVAO);
	glGenBuffers(1, &VBO);
	glBindVertexArray(containerVAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0);     // 点属性
	glEnableVertexAttribArray(0);
	glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(3 * sizeof(GLfloat)));	// 法向量属性
	glEnableVertexAttribArray(1);
	glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat))); // 纹理属性
	glEnableVertexAttribArray(2);
	glBindVertexArray(0); //解绑VAO


	//lightVAO=>VBO=>vertices
	glGenVertexArrays(1, &lightVAO);
	glBindVertexArray(lightVAO);
	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)0); // 注意，这里我们跳过法向量属性
	glEnableVertexAttribArray(0);
	glBindVertexArray(0);


	//加载纹理
	
	  // Diffuse map
	GLuint diffuseMap;
	glGenTextures(1, &diffuseMap);
	int width, height;
	unsigned char* image;
	stbi_set_flip_vertically_on_load(1);
	//改图片即可出效果
	image  = stbi_load("src/container2.png", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, diffuseMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);


	// Specular map
	GLuint specularMap;
	glGenTextures(1, &specularMap);
	image = stbi_load("src/container2_specular.png", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, specularMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);


	// Emission map
	GLuint emissionMap;
	glGenTextures(1, &emissionMap);
	image = stbi_load("src/matrix.jpg", &width, &height, NULL, 3);
	glBindTexture(GL_TEXTURE_2D, emissionMap);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
	glGenerateMipmap(GL_TEXTURE_2D);
	stbi_image_free(image);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST_MIPMAP_NEAREST);
	glBindTexture(GL_TEXTURE_2D, 0);



	lightingShader.Use();
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.diffuse"), 0);
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.specular"), 1);
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.emission"), 2);


	while (!glfwWindowShouldClose(window))
	{
		GLfloat currentFrame;
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
		GLint lightPosLoc = glGetUniformLocation(lightingShader.Program, "light.position");
		GLint viewPosLoc = glGetUniformLocation(lightingShader.Program, "viewPos");

		//随时间更改灯光的位置值
		lightPos.x = 1.0f + sin(glfwGetTime()) * 2.0f;
		lightPos.y = sin(glfwGetTime() / 2.0f) * 1.0f;
		glUniform3f(lightPosLoc, lightPos.x, lightPos.y, lightPos.z);
		glUniform3f(viewPosLoc, camera.Position.x, camera.Position.y, camera.Position.z); //这里：注入摄像机的坐标点

		// 设置光线属性
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.ambient"), 0.2f, 0.2f, 0.2f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.diffuse"), 0.5f, 0.5f, 0.5f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.specular"), 1.0f, 1.0f, 1.0f);
		
		// 设置材质属性
		glUniform1f(glGetUniformLocation(lightingShader.Program, "material.shininess"), 32.0f);
		
		//激活纹理
		glActiveTexture(GL_TEXTURE0);
		glBindTexture(GL_TEXTURE_2D, diffuseMap);
		glActiveTexture(GL_TEXTURE1);
		glBindTexture(GL_TEXTURE_2D, specularMap);
		glActiveTexture(GL_TEXTURE2);
		glBindTexture(GL_TEXTURE_2D, emissionMap);


	
		view = camera.GetViewMatrix();
		projection = glm::perspective(camera.Zoom, (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);	
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "view"), 1, GL_FALSE, glm::value_ptr(view));		//注入摄像机位视图矩阵
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "projection"), 1, GL_FALSE, glm::value_ptr(projection));		//注入摄像机位投影矩阵

		//绑定VAO数据开始渲染
		glBindVertexArray(containerVAO);
		float angle = glfwGetTime() * 25.0f; 		//改标准的模型矩阵 让他基于某个点位先平移再根据时间旋转，让其看起来像动的一样 2D=>3D 其实就是旋转了！
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "model"), 1, GL_FALSE, glm::value_ptr(model)); 	//注入摄像机位模型矩阵
		glDrawArrays(GL_TRIANGLES, 0, 36); //画三角形
		glBindVertexArray(0);		//渲染完成解绑VAO


		//===================做光源的渲染工作，流程同上========================
		lampShader.Use();
		glBindVertexArray(lightVAO);
		model = glm::mat4(1.0);
		model = glm::translate(model, lightPos);
		angle = glfwGetTime() * 25.0f;
		model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
		model = glm::scale(model, glm::vec3(0.2f));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "model"), 1, GL_FALSE, glm::value_ptr(model));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "view"), 1, GL_FALSE, glm::value_ptr(view));
		glUniformMatrix4fv(glGetUniformLocation(lampShader.Program, "projection"), 1, GL_FALSE, glm::value_ptr(projection));
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

- lighting.frag

```c
#version 330 core
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    sampler2D emission;
    float     shininess;
};  

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;  
in vec3 Normal;  
in vec2 TexCoords;
  
out vec4 color;
  
uniform vec3 viewPos;
uniform Material material;
uniform Light light;
uniform float time;

void main()
{
    // Ambient
    vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
  	
    // Diffuse 
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * vec3(texture(material.diffuse, TexCoords));  
    
    // Specular
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));
    
    // Emission
    vec3 emission = vec3(texture(material.emission, TexCoords));
        
    color = vec4(ambient + diffuse + specular + emission, 1.0f);  
} 
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%94%BE%E5%B0%84%E5%85%89%E8%B4%B4%E5%9B%BE-17048884475936-17167360277623.gif)