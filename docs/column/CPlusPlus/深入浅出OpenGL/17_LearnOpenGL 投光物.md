

# 投光物

我们目前使用的所有光照都来自于一个单独的光源，这是空间中的一个点。它的效果不错，但是在真实世界，我们有多种类型的光，它们每个表现都不同。一个光源把光投射到物体上，叫做投光。这个教程里我们讨论几种不同的投光类型。学习模拟不同的光源是你未来丰富你的场景的另一个工具。



我们首先讨论定向光(directional light)，接着是作为之前学到知识的扩展的点光(point light)，最后我们讨论聚光(Spotlight)。下面的教程我们会把这几种不同的光类型整合到一个场景中。





# 定向光

当一个光源很远的时候，来自光源的每条光线接近于平行。这看起来就像所有的光线来自于同一个方向，无论物体和观察者在哪儿。当一个光源被设置为无限远时，它被称为定向光(Directional Light)，因为所有的光线都有着同一个方向；它会独立于光源的位置。



我们知道的定向光源的一个好例子是，太阳。太阳和我们不是无限远，但它也足够远了，在计算光照的时候，我们感觉它就像无限远。在下面的图片里，来自于太阳的所有的光线都被定义为平行光：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110201748162.png)







因为所有的光线都是平行的，对于场景中的每个物体光的方向都保持一致，物体和光源的位置保持怎样的关系都无所谓。由于光的方向向量保持一致，光照计算会和场景中的其他物体相似。

我们可以通过定义一个光的方向向量，来模拟这样一个定向光，而不是使用光的位置向量。着色器计算保持大致相同的要求，这次我们直接使用光的方向向量来代替用`lightDir`向量和`position`向量的计算：

```c
struct Light
{
    // vec3 position; // 现在不在需要光源位置了，因为它是无限远的
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};
...
void main()
{
    vec3 lightDir = normalize(-light.direction);
    ...
}
```

注意，我们首先对`light.direction`向量取反。目前我们使用的光照计算需要光的方向作为一个来自片段朝向的光源的方向，但是人们通常更习惯定义一个定向光作为一个全局方向，它从光源发出。所以我们必须对全局光的方向向量取反来改变它的方向；它现在是一个方向向量指向光源。同时，确保对向量进行标准化处理，因为假定输入的向量就是一个单位向量是不明智的。

作为结果的`lightDir`向量被使用在`diffuse`和`specular`计算之前。

为了清晰地强调一个定向光对所有物体都有同样的影响，我们再次访问[坐标系教程](https://learnopengl-cn.readthedocs.io/zh/latest/01 Getting started/08 Coordinate Systems/)结尾部分的箱子场景。例子里我们先定义10个不同的箱子位置，为每个箱子生成不同的模型矩阵，每个模型矩阵包含相应的本地到世界变换：

```c
for(GLuint i = 0; i < 10; i++)
{
    model = glm::mat4();
    model = glm::translate(model, cubePositions[i]);
    GLfloat angle = 20.0f * i;
    model = glm::rotate(model, angle, glm::vec3(1.0f, 0.3f, 0.5f));
    glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
    glDrawArrays(GL_TRIANGLES, 0, 36);
}
```

同时，不要忘记定义光源的方向（注意，我们把方向定义为：从光源处发出的方向；在下面，你可以快速看到光的方向的指向）：

```c
GLint lightDirPos = glGetUniformLocation(lightingShader.Program, "light.direction");
glUniform3f(lightDirPos, -0.2f, -1.0f, -0.3f);
```

> 我们已经把光的位置和方向向量传递为vec3，但是有些人去想更喜欢把所有的向量设置为vec4.当定义位置向量为vec4的时候，把w元素设置为1.0非常重要，这样平移和投影才会合理的被应用。然而，当定义一个方向向量为vec4时，我们并不想让平移发挥作用（因为它们除了代表方向，其他什么也不是）所以我们把w元素设置为0.0。
>
> 方向向量被表示为：vec4(0.2f, 1.0f, 0.3f, 0.0f)。这可以作为简单检查光的类型的方法：你可以检查w元素是否等于1.0，查看我们现在所拥有的光的位置向量，w是否等于0.0，我们有一个光的方向向量，所以根据那个调整计算方法：
>
> \```c++ if(lightVector.w == 0.0) // 请留意浮点数错误 // 执行定向光照计算
>
> else if(lightVector.w == 1.0) // 像上一个教程一样执行顶点光照计算 ```
>
> 有趣的事实：这就是旧OpenGL（固定函数式）决定一个光源是一个定向光还是位置光源，更具这个修改它的光照。

如果你现在编译应用，飞跃场景，它看起来像有一个太阳一样的光源，把光抛到物体身上。你可以看到`diffuse`和`specular`元素都对该光源进行反射了，就像天空上有一个光源吗？看起来就像这样：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%AE%9A%E5%90%91%E5%85%89-17167361933201.gif)



你可以在这里获得应用的所有代码:

- lighting.frag

```c
#version 330 core
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float     shininess;
};  

struct Light {
    //vec3 position;
    vec3 direction;

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
    // vec3 lightDir = normalize(light.position - FragPos);
    vec3 lightDir = normalize(-light.direction);  
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

- lighting.vs

```c
#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 normal;
layout (location = 2) in vec2 texCoords;

out vec3 Normal;
out vec3 FragPos;
out vec2 TexCoords;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

void main()
{
    gl_Position = projection * view *  model * vec4(position, 1.0f);
    FragPos = vec3(model * vec4(position, 1.0f));
    Normal = mat3(transpose(inverse(model))) * normal;  
    TexCoords = texCoords;
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




	lightingShader.Use();
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.diffuse"), 0);
	glUniform1i(glGetUniformLocation(lightingShader.Program, "material.specular"), 1);



	while (!glfwWindowShouldClose(window))
	{
		GLfloat currentFrame;
		//glm::mat4 model(1.0f);
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


	
		//注入光源方向
		glUniform3f(glGetUniformLocation(lightingShader.Program, "light.direction"), -0.2f, -1.0f, -0.3f);
		glUniform3f(glGetUniformLocation(lightingShader.Program, "viewPos"), camera.Position.x, camera.Position.y, camera.Position.z);


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


		//渲染出来10个
		glBindVertexArray(containerVAO);
		for (GLuint i = 1; i < 10; i++)
		{
			glm::mat4 model = glm::mat4(1.0);
			model = glm::translate(model, cubePositions[i]);
			GLfloat angle = 20.0f * i * glfwGetTime();
			model = glm::rotate(model, glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
			glUniformMatrix4fv(glGetUniformLocation(lightingShader.Program, "model"), 1, GL_FALSE, glm::value_ptr(model));

			glDrawArrays(GL_TRIANGLES, 0, 36);
		}
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

# 点光源

定向光作为全局光可以照亮整个场景，这非常棒，但是另一方面除了定向光，我们通常也需要几个点光源(Point Light)，在场景里发亮。点光是一个在时间里有位置的光源，它向所有方向发光，光线随距离增加逐渐变暗。想象灯泡和火炬作为投光物，它们可以扮演点光的角色。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110204221464-17167362144412.png)





之前的教程我们已经使用了（最简单的）点光。我们指定了一个光源以及其所在的位置，它从这个位置向所有方向发散光线。然而，我们定义的光源所模拟光线的强度却不会因为距离变远而衰减，这使得看起来像是光源亮度极强。在大多数3D仿真场景中，我们更希望去模拟一个仅仅能照亮靠近光源点附近场景的光源，而不是照亮整个场景的光源。

如果你把10个箱子添加到之前教程的光照场景中，你会注意到黑暗中的每个箱子都会有同样的亮度，就像箱子在光照的前面；没有公式定义光的距离衰减。我们想让黑暗中与光源比较近的箱子被轻微地照亮。



## 衰减

随着光线穿越距离的变远使得亮度也相应地减少的现象，通常称之为**衰减(Attenuation)**。一种随着距离减少亮度的方式是使用线性等式。这样的一个随着距离减少亮度的线性方程，可以使远处的物体更暗。然而，这样的线性方程效果会有点假。在真实世界，通常光在近处时非常亮，但是一个光源的亮度，开始的时候减少的非常快，之后随着距离的增加，减少的速度会慢下来。我们需要一种不同的方程来减少光的亮度。

幸运的是一些聪明人已经早就把它想到了。下面的方程把一个片段的光的亮度除以一个已经计算出来的衰减值，这个值根据光源的远近得到：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110204252656-17048905736534-17167362373913.png)



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110204302224-17167362498484.png)



- 常数项通常是1.0，它的作用是保证分母永远不会比1小，因为它可以利用一定的距离增加亮度，这个结果不会影响到我们所寻找的。
- 一次项用于与距离值相乘，这会以线性的方式减少亮度。
- 二次项用于与距离的平方相乘，为光源设置一个亮度的二次递减。二次项在距离比较近的时候相比一次项会比一次项更小，但是当距离更远的时候比一次项更大。

由于二次项的光会以线性方式减少，指导距离足够大的时候，就会超过一次项，之后，光的亮度会减少的更快。最后的效果就是光在近距离时，非常量，但是距离变远亮度迅速降低，最后亮度降低速度再次变慢。下面的图展示了在100以内的范围，这样的衰减效果。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110204337433-17048906186435-17167362607265.png)



你可以看到当距离很近的时候光有最强的亮度，但是随着距离增大，亮度明显减弱，大约接近100的时候，就会慢下来。这就是我们想要的。

### 选择正确的值

但是，我们把这三个项设置为什么值呢？正确的值的设置由很多因素决定：环境、你希望光所覆盖的距离范围、光的类型等。大多数场合，这是经验的问题，也要适度调整。下面的表格展示一些各项的值，它们模拟现实（某种类型的）光源，覆盖特定的半径（距离）。第一栏定义一个光的距离，它覆盖所给定的项。这些值是大多数光的良好开始，它是来自Ogre3D的维基的礼物：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110204415280-17048906562736-17167362810666.png)





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240110204442072-17048906830677-17048906842138-17167362937407.png)

### 实现衰减

为了实现衰减，在着色器中我们会需要三个额外数值：也就是公式的常量、一次项和二次项。最好把它们储存在之前定义的Light结构体中。要注意的是我们计算`lightDir`，就是在前面的教程中我们所做的，不是像之前的定向光的那部分。

```c
struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float constant;
    float linear;
    float quadratic;
};
```

然后，我们在OpenGL中设置这些项：我们希望光覆盖50的距离，所以我们会使用上面的表格中合适的常数项、一次项和二次项：

```c
glUniform1f(glGetUniformLocation(lightingShader.Program, "light.constant"), 1.0f);
glUniform1f(glGetUniformLocation(lightingShader.Program, "light.linear"), 0.09);
glUniform1f(glGetUniformLocation(lightingShader.Program, "light.quadratic"), 0.032);
```

在片段着色器中实现衰减很直接：我们根据公式简单的计算衰减值，在乘以`ambient`、`diffuse`和`specular`元素。

我们需要将光源的距离提供给公式；还记得我们是怎样计算向量的长度吗？我们可以通过获取片段和光源之间的不同向量把向量的长度结果作为距离项。我们可以使用GLSL的内建`length`函数做这件事：

```c
float distance = length(light.position - FragPos);
float attenuation = 1.0f / (light.constant + light.linear*distance +light.quadratic*(distance*distance))
```

然后，我们在光照计算中，通过把衰减值乘以`ambient`、`diffuse`和`specular`颜色，包含这个衰减值。

我们可以可以把`ambient`元素留着不变，这样`amient`光照就不会随着距离减少，但是如果我们使用多余1个的光源，所有的`ambient`元素会开始叠加，因此这种情况，我们希望`ambient`光照也衰减。简单的调试出对于你的环境来说最好的效果。

```c
ambient *= attenuation;
diffuse *= attenuation;
specular *= attenuation;
```

