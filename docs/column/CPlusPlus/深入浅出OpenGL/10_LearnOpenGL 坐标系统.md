# 坐标系统

在上一个教程中，我们学习了如何有效地利用矩阵变换来对所有顶点进行转换。OpenGL希望在所有顶点着色器运行后，所有我们可见的顶点都变为标准化设备坐标(Normalized Device Coordinate, NDC)。也就是说，每个顶点的x，y，z坐标都应该在-1.0到1.0之间，超出这个坐标范围的顶点都将不可见。我们通常会自己设定一个坐标的范围，之后再在顶点着色器中将这些坐标转换为标准化设备坐标。然后将这些标准化设备坐标传入光栅器(Rasterizer)，再将他们转换为屏幕上的二维坐标或像素。



将坐标转换为标准化设备坐标，接着再转化为屏幕坐标的过程通常是分步，也就是类似于流水线那样子，实现的，在流水线里面我们在将对象转换到屏幕空间之前会先将其转换到多个坐标系统(Coordinate System)。将对象的坐标转换到几个过渡坐标系(Intermediate Coordinate System)的优点在于，在这些特定的坐标系统中进行一些操作或运算更加方便和容易，这一点很快将会变得很明显。对我们来说比较重要的总共有5个不同的坐标系统：



- 局部空间(Local Space，或者称为物体空间(Object Space))
- 世界空间(World Space)
- 观察空间(View Space，或者称为视觉空间(Eye Space))
- 裁剪空间(Clip Space)
- 屏幕空间(Screen Space)



这些就是我们将所有顶点转换为片段之前，顶点需要处于的不同的状态。

你现在可能对什么是空间或坐标系到底是什么感到困惑，所以接下来我们将会通过展示完整的图片来解释每一个坐标系实际做了什么。



## 概述

为了将坐标从一个坐标系转换到另一个坐标系，我们需要用到几个转换矩阵，最重要的几个分别是**模型(Model)**、**视图(View)**、**投影(Projection)**三个矩阵。首先，顶点坐标开始于**局部空间(Local Space)**，称为**局部坐标(Local Coordinate)**，然后经过**世界坐标(World Coordinate)**，**观察坐标(View Coordinate)**，**裁剪坐标(Clip Coordinate)**，并最后以**屏幕坐标(Screen Coordinate)**结束。下面的图示显示了整个流程及各个转换过程做了什么：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103212452261.png)



- 局部坐标是对象相对于局部原点的坐标；也是对象开始的坐标。
- 将局部坐标转换为世界坐标，世界坐标是作为一个更大空间范围的坐标系统。这些坐标是相对于世界的原点的。
- 接下来我们将世界坐标转换为观察坐标，观察坐标是指以摄像机或观察者的角度观察的坐标。
- 在将坐标处理到观察空间之后，我们需要将其投影到裁剪坐标。裁剪坐标是处理-1.0到1.0范围内并判断哪些顶点将会出现在屏幕上。
- 最后，我们需要将裁剪坐标转换为屏幕坐标，我们将这一过程成为**视口变换(Viewport Transform)**。视口变换将位于-1.0到1.0范围的坐标转换到由`glViewport`函数所定义的坐标范围内。最后转换的坐标将会送到光栅器，由光栅器将其转化为片段。



你可能了解了每个单独的坐标空间的作用。我们之所以将顶点转换到各个不同的空间的原因是有些操作在特定的坐标系统中才有意义且更方便。例如，当修改对象时，如果在局部空间中则是有意义的；当对对象做相对于其它对象的位置的操作时，在世界坐标系中则是有意义的；等等这些。如果我们愿意，本可以定义一个直接从局部空间到裁剪空间的转换矩阵，但那样会失去灵活性。接下来我们将要更仔细地讨论各个坐标系。

## 局部空间

局部空间(Local Space)是指对象所在的坐标空间，例如，对象最开始所在的地方。想象你在一个模型建造软件(比如说Blender)中创建了一个立方体。你创建的立方体的原点有可能位于(0，0，0)，即使有可能在最后的应用中位于完全不同的另外一个位置。甚至有可能你创建的所有模型都以(0，0，0)为初始位置，然而他们会在世界的不同位置。则你的模型的所有顶点都是在**局部**空间：他们相对于你的对象来说都是局部的。

我们一直使用的那个箱子的坐标范围为-0.5到0.5，设定(0, 0)为它的原点。这些都是局部坐标。



## 世界空间

如果我们想将我们所有的对象导入到程序当中，它们有可能会全挤在世界的原点上(0，0，0)，然而这并不是我们想要的结果。我们想为每一个对象定义一个位置，从而使对象位于更大的世界当中。世界空间(World Space)中的坐标就如它们听起来那样：是指顶点相对于(游戏)世界的坐标。物体变换到的最终空间就是世界坐标系，并且你会想让这些物体分散开来摆放(从而显得更真实)。对象的坐标将会从局部坐标转换到世界坐标；该转换是由**模型矩阵(Model Matrix)**实现的。



模型矩阵是一种转换矩阵，它能通过对对象进行平移、缩放、旋转来将它置于它本应该在的位置或方向。你可以想象一下，我们需要转换一栋房子，通过将它缩小(因为它在局部坐标系中显得太大了)，将它往郊区的方向平移，然后沿着y轴往坐标旋转。经过这样的变换之后，它将恰好能够与邻居的房子重合。你能够想到上一节讲到的利用模型矩阵将各个箱子放置到这个屏幕上；我们能够将箱子中的局部坐标转换为观察坐标或世界坐标。



## 观察空间

观察空间(View Space)经常被人们称之OpenGL的**摄像机(Camera)**(所以有时也称为摄像机空间(Camera Space)或视觉空间(Eye Space))。观察空间就是将对象的世界空间的坐标转换为观察者视野前面的坐标。因此观察空间就是从摄像机的角度观察到的空间。而这通常是由一系列的平移和旋转的组合来平移和旋转场景从而使得特定的对象被转换到摄像机前面。这些组合在一起的转换通常存储在一个**观察矩阵(View Matrix)**里，用来将世界坐标转换到观察空间。在下一个教程我们将广泛讨论如何创建一个这样的观察矩阵来模拟一个摄像机。





## 裁剪空间

在一个顶点着色器运行的最后，OpenGL期望所有的坐标都能落在一个给定的范围内，且任何在这个范围之外的点都应该被裁剪掉(Clipped)。被裁剪掉的坐标就被忽略了，所以剩下的坐标就将变为屏幕上可见的片段。这也就是**裁剪空间(Clip Space)**名字的由来。



因为将所有可见的坐标都放置在-1.0到1.0的范围内不是很直观，所以我们会指定自己的坐标集(Coordinate Set)并将它转换回标准化设备坐标系，就像OpenGL期望它做的那样。



为了将顶点坐标从观察空间转换到裁剪空间，我们需要定义一个**投影矩阵(Projection Matrix)**，它指定了坐标的范围，例如，每个维度都是从-1000到1000。投影矩阵接着会将在它指定的范围内的坐标转换到标准化设备坐标系中(-1.0，1.0)。所有在在范围(-1.0,1.0)外的坐标都不会被绘制出来并且会被裁剪。在投影矩阵所指定的范围内，坐标(1250，500，750)将是不可见的，这是由于它的x坐标超出了范围，随后被转化为在标准化设备坐标中坐标值大于1.0的值并且被裁剪掉。



> 如果只是片段的一部分例如三角形，超出了裁剪体积(Clipping Volume)，则OpenGL会重新构建三角形以使一个或多个三角形能适应在裁剪范围内。



由投影矩阵创建的**观察区域(Viewing Box)**被称为**平截头体(Frustum)**，且每个出现在平截头体范围内的坐标都会最终出现在用户的屏幕上。将一定范围内的坐标转化到标准化设备坐标系的过程(而且它很容易被映射到2D观察空间坐标)被称之为**投影(Projection)**，因为使用投影矩阵能将3维坐标**投影(Project)**到很容易映射的2D标准化设备坐标系中。





一旦所有顶点被转换到裁剪空间，最终的操作——**透视划分(Perspective Division)**将会执行，在这个过程中我们将位置向量的x，y，z分量分别除以向量的齐次w分量；透视划分是将4维裁剪空间坐标转换为3维标准化设备坐标。这一步会在每一个顶点着色器运行的最后被自动执行。

在这一阶段之后，坐标经过转换的结果将会被映射到屏幕空间(由`glViewport()`设置)且被转换成片段。

投影矩阵将观察坐标转换为裁剪坐标的过程采用两种不同的方式，每种方式分别定义自己的平截头体。我们可以创建一个正射投影矩阵(Orthographic Projection Matrix)或一个透视投影矩阵(Perspective Projection Matrix)。





### 正射投影

正射投影(Orthographic Projection)矩阵定义了一个类似立方体的平截头体，指定了一个裁剪空间，每一个在这空间外面的顶点都会被裁剪。创建一个正射投影矩阵需要指定可见平截头体的宽、高和长度。所有在使用正射投影矩阵转换到裁剪空间后如果还处于这个平截头体里面的坐标就不会被裁剪。它的平截头体看起来像一个容器：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103213028095-17167345361431.png)



上面的平截头体定义了由宽、高、**近**平面和**远**平面决定的可视的坐标系。任何出现在近平面前面或远平面后面的坐标都会被裁剪掉。正视平截头体直接将平截头体内部的顶点映射到标准化设备坐标系中，因为每个向量的w分量都是不变的；如果w分量等于1.0，则透视划分不会改变坐标的值。

为了创建一个正射投影矩阵，我们利用GLM的构建函数`glm::ortho()`

```c
glm::ortho(0.0f, 800.0f, 0.0f, 600.0f, 0.1f, 100.0f);
```

前两个参数指定了平截头体的左右坐标，第三和第四参数指定了平截头体的底部和上部。通过这四个参数我们定义了近平面和远平面的大小，然后第五和第六个参数则定义了近平面和远平面的距离。这个指定的投影矩阵将处于这些x，y，z范围之间的坐标转换到标准化设备坐标系中。

正射投影矩阵直接将坐标映射到屏幕的二维平面内，但实际上一个直接的投影矩阵将会产生不真实的结果，因为这个投影没有将**透视(Perspective)**考虑进去。所以我们需要**透视投影**矩阵来解决这个问题。



#### 透视投影

如果你曾经体验过**实际生活**给你带来的景象，你就会注意到离你越远的东西看起来更小。这个神奇的效果我们称之为透视(Perspective)。透视的效果在我们看一条无限长的高速公路或铁路时尤其明显，正如下面图片显示的那样:

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103213204097-170429169865413-17167345473682.png)





正如你看到的那样，由于透视的原因，平行线似乎在很远的地方看起来会相交。这正是透视投影(Perspective Projection)想要模仿的效果，它是使用透视投影矩阵来完成的。这个投影矩阵不仅将给定的平截头体范围映射到裁剪空间，同样还修改了每个顶点坐标的w值，从而使得离观察者越远的顶点坐标w分量越大。被转换到裁剪空间的坐标都会在-w到w的范围之间(任何大于这个范围的对象都会被裁剪掉)。OpenGL要求所有可见的坐标都落在-1.0到1.0范围内从而作为最后的顶点着色器输出，因此一旦坐标在裁剪空间内，透视划分就会被应用到裁剪空间坐标：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103213307177-170429171820014-17167345597983.png)



每个顶点坐标的分量都会除以它的w分量，得到一个距离观察者的较小的顶点坐标。这是也是另一个w分量很重要的原因，因为它能够帮助我们进行透射投影。最后的结果坐标就是处于标准化设备空间内的。如果你对研究正射投影矩阵和透视投影矩阵是如何计算的很感兴趣(且不会对数学感到恐惧的话)我推荐[这篇由Songho写的文章](http://www.songho.ca/opengl/gl_projectionmatrix.html)。



在GLM中可以这样创建一个透视投影矩阵：

```c
glm::mat4 proj = glm::perspective(45.0f, (float)width/(float)height, 0.1f, 100.0f);
```

`glm::perspective`所做的其实就是再次创建了一个定义了可视空间的大的**平截头体**，任何在这个平截头体的对象最后都不会出现在裁剪空间体积内，并且将会受到裁剪。一个透视平截头体可以被可视化为一个不均匀形状的盒子，在这个盒子内部的每个坐标都会被映射到裁剪空间的点。一张透视平截头体的照片如下所示：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103213401653-17042888472225-170429174448815-17167345790934.png)



它的第一个参数定义了**fov**的值，它表示的是**视野(Field of View)**，并且设置了观察空间的大小。对于一个真实的观察效果，它的值经常设置为45.0，但想要看到更多结果你可以设置一个更大的值。第二个参数设置了宽高比，由视口的高除以宽。第三和第四个参数设置了平截头体的近和远平面。我们经常设置近距离为0.1而远距离设为100.0。所有在近平面和远平面的顶点且处于平截头体内的顶点都会被渲染。

> 当你把透视矩阵的*near*值设置太大时(如10.0)，OpenGL会将靠近摄像机的坐标都裁剪掉(在0.0和10.0之间)，这会导致一个你很熟悉的视觉效果：在太过靠近一个物体的时候视线会直接穿过去。



当使用正射投影时，每一个顶点坐标都会直接映射到裁剪空间中而不经过任何精细的透视划分(它仍然有进行透视划分，只是w分量没有被操作(它保持为1)因此没有起作用)。因为正射投影没有使用透视，远处的对象不会显得小以产生神奇的视觉输出。由于这个原因，正射投影主要用于二维渲染以及一些建筑或工程的应用，或者是那些我们不需要使用投影来转换顶点的情况下。某些如Blender的进行三维建模的软件有时在建模时会使用正射投影，因为它在各个维度下都更准确地描绘了每个物体。下面你能够看到在Blender里面使用两种投影方式的对比：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103213533390-170429177020516-17167345929615.png)



你可以看到使用透视投影的话，远处的顶点看起来比较小，而在正射投影中每个顶点距离观察者的距离都是一样的。

### 把它们都组合到一起

我们为上述的每一个步骤都创建了一个转换矩阵：模型矩阵、观察矩阵和投影矩阵。一个顶点的坐标将会根据以下过程被转换到裁剪坐标：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103213621264-17042889829347-17167346053286.png)





> **然后呢？**
>
> 顶点着色器的输出需要所有的顶点都在裁剪空间内，而这是我们的转换矩阵所做的。OpenGL然后在裁剪空间中执行透视划分从而将它们转换到标准化设备坐标。OpenGL会使用`glViewPort`内部的参数来将标准化设备坐标映射到屏幕坐标，每个坐标都关联了一个屏幕上的点(在我们的例子中屏幕是800 *600)。这个过程称为视口转换。



这一章的主题可能会比较难理解，如果你仍然不确定每个空间的作用的话，你也不必太担心。接下来你会看到我们是怎样好好运用这些坐标空间的并且会有足够的展示例子在接下来的教程中。



# 进入3D

既然我们知道了如何将三维坐标转换为二维坐标，我们可以开始将我们的对象展示为三维对象而不是目前我们所展示的缺胳膊少腿的二维平面。

在开始进行三维画图时，我们首先创建一个模型矩阵。这个模型矩阵包含了平移、缩放与旋转，我们将会运用它来将对象的顶点转换到全局世界空间。让我们平移一下我们的平面，通过将其绕着x轴旋转使它看起来像放在地上一样。这个模型矩阵看起来是这样的：



```c
glm::mat4 model;
model = glm::rotate(model, -55.0f, glm::vec3(1.0f, 0.0f, 0.0f));
```

接下来我们需要创建一个观察矩阵。我们想要在场景里面稍微往后移动以使得对象变成可见的(当在世界空间时，我们位于原点(0,0,0))。要想在场景里面移动，思考下面的问题：

- 将摄像机往后移动跟将整个场景往前移是一样的。

这就是观察空间所做的，我们以相反于移动摄像机的方向移动整个场景。因为我们想要往后移动，并且OpenGL是一个右手坐标系(Right-handed System)所以我们沿着z轴的负方向移动。我们会通过将场景沿着z轴正方向平移来实现这个。它会给我们一种我们在往后移动的感觉。

> **右手坐标系(Right-handed System)**
>
> 按照约定，OpenGL是一个右手坐标系。最基本的就是说正x轴在你的右手边，正y轴往上而正z轴是往后的。想象你的屏幕处于三个轴的中心且正z轴穿过你的屏幕朝向你。坐标系画起来如下：
>
> ![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103213956982-17042891979668-17167346256917.png)
>
> 为了理解为什么被称为右手坐标系，按如下的步骤做：
>
> - 张开你的右手使正y轴沿着你的手往上。
> - 使你的大拇指往右。
> - 使你的食指往上。
> - 向下90度弯曲你的中指。
>
> 如果你都正确地做了，那么你的大拇指朝着正x轴方向，食指朝着正y轴方向，中指朝着正z轴方向。如果你用左手来做这些动作，你会发现z轴的方向是相反的。这就是有名的左手坐标系，它被DirectX广泛地使用。注意在标准化设备坐标系中OpenGL使用的是左手坐标系(投影矩阵改变了惯用手的习惯)。



在下一个教程中我们将会详细讨论如何在场景中移动。目前的观察矩阵是这样的：

```c
glm::mat4 view;
// 注意，我们将矩阵向我们要进行移动场景的反向移动。
view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f)); 
```

最后我们需要做的是定义一个投影矩阵。我们想要在我们的场景中使用透视投影所以我们声明的投影矩阵是像这样的：

```c
glm::mat4 projection;
projection = glm::perspective(45.0f, screenWidth / screenHeight, 0.1f, 100.0f);
```

> 再重复一遍，在glm指定角度的时候要注意。这里我们将参数fov设置为45度，但有些GLM的实现是将fov当成弧度，在这种情况你需要使用`glm::radians(45.0)`来设置。



既然我们创建了转换矩阵，我们应该将它们传入着色器。首先，让我们在顶点着色器中声明一个单位转换矩阵然后将它乘以顶点坐标：

```
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

我们应该将矩阵传入着色器(这通常在每次渲染的时候即转换矩阵将要改变的时候完成)：

```c
GLint modelLoc = glGetUniformLocation(ourShader.Program, "model");
glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));
... // 观察矩阵和投影矩阵与之类似
```

现在我们的顶点坐标通过模型、观察和投影矩阵来转换，最后的对象应该是：

- 往后向地板倾斜。
- 离我们有点距离。
- 由透视展示(顶点越远，变得越小)。

让我们检查一下结果是否满足这些要求：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103220445105-17167346391118.png)



它看起来就像是一个三维的平面，是静止在一些虚构的地板上的。如果你不是得到相同的结果，请参考笔者的实现。

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
    GLuint VBO, VAO,EBO; 
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
    glfwSetKeyCallback(window, key_callback);
    glewExperimental = GL_TRUE;
    glewInit();
    glViewport(0, 0, WIDTH, HEIGHT);
    glEnable(GL_DEPTH_TEST); //



    //构建作色器程序
    Shader ourShader("res/shaders/shader.vs", "res/shaders/shader.frag");



    // 设置顶点数据集和纹理坐标
    GLfloat vertices[] = {
        // Positions          // Texture Coords
         0.5f,  0.5f, 0.0f,   1.0f, 1.0f, // Top Right
         0.5f, -0.5f, 0.0f,   1.0f, 0.0f, // Bottom Right
        -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, // Bottom Left
        -0.5f,  0.5f, 0.0f,   0.0f, 1.0f  // Top Left 
    };
    GLuint indices[] = {  // Note that we start from 0!
        0, 1, 3, // First Triangle
        1, 2, 3  // Second Triangle
    };

    //VAO=>VBO、EBO
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
    glBindBuffer(GL_ARRAY_BUFFER, VBO);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW); //顶点索引

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

       

        glfwPollEvents();
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



        glm::mat4 model(1.0);
        glm::mat4 view(1.0f);
        glm::mat4 projection(1.0f);

        model = glm::rotate(model, glm::radians(-55.0f), glm::vec3(1.0f, 0.0f, 0.0f));
        view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
        projection = glm::perspective(glm::radians(45.0f), (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);


        GLint modelLoc = glGetUniformLocation(ourShader.Program, "model");
        GLint viewLoc = glGetUniformLocation(ourShader.Program, "view");
        GLint projLoc = glGetUniformLocation(ourShader.Program, "projection");
     
        glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));   //注入模型矩阵
        glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));        //注入视图矩阵
        glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));        //注入透视投影矩阵
        glBindVertexArray(VAO);
   
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
in vec2 TexCoord;

out vec4 color;

uniform sampler2D ourTexture1;
uniform sampler2D ourTexture2;

void main()
{
    color = mix(texture(ourTexture1, TexCoord), texture(ourTexture2, TexCoord), 0.2);
}
```

## 更多的3D

到目前为止，我们在二维平面甚至在三维空间中画图，所以让我们采取大胆的方式来将我们的二维平面扩展为三维立方体。要渲染一个立方体，我们一共需要36个顶点(6个面 x 每个面有2个三角形组成 x 每个三角形有3个顶点)，这36个顶点的位置你可以[从这里获取](http://learnopengl.com/code_viewer.php?code=getting-started/cube_vertices)。注意，这一次我们省略了颜色值，因为这次我们只在乎顶点的位置和，我们使用纹理贴图。

为了好玩，我们将让立方体随着时间旋转：



```
model = glm::rotate(model, (GLfloat)glfwGetTime() * 50.0f, glm::vec3(0.5f, 1.0f, 0.0f));
```

然后我们使用`glDrawArrays`来画立方体，这一次总共有36个顶点。

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
    GLuint VBO, VAO,EBO; 
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
    glfwSetKeyCallback(window, key_callback);
    glewExperimental = GL_TRUE;
    glewInit();
    glViewport(0, 0, WIDTH, HEIGHT);
 



    //构建作色器程序
    Shader ourShader("res/shaders/shader.vs", "res/shaders/shader.frag");



    // 设置顶点数据集和纹理坐标
    float vertices[] = {
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
    GLuint indices[] = {  // Note that we start from 0!
        0, 1, 3, // First Triangle
        1, 2, 3  // Second Triangle
    };

    //VAO=>VBO、EBO
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &VBO);
    glGenBuffers(1, &EBO);

    glBindVertexArray(VAO); //绑定VAO,并将顶点数据集数据由VBO管理，VAO再管理VBO
    glBindBuffer(GL_ARRAY_BUFFER, VBO);

    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_STATIC_DRAW); //顶点索引

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

       

        glfwPollEvents();
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



        glm::mat4 model(1.0); //模型 视图 透视投影矩阵
        glm::mat4 view(1.0f);
        glm::mat4 projection(1.0f);

        model = glm::rotate(model, (GLfloat)glfwGetTime() * glm::radians(50.0f), glm::vec3(0.5f, 1.0f, 0.0f));
        view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
        projection = glm::perspective(glm::radians(45.0f), (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);


        GLint modelLoc = glGetUniformLocation(ourShader.Program, "model");
        GLint viewLoc = glGetUniformLocation(ourShader.Program, "view");
        GLint projLoc = glGetUniformLocation(ourShader.Program, "projection");
     
        glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));   //注入模型矩阵
        glUniformMatrix4fv(viewLoc, 1, GL_FALSE, glm::value_ptr(view));        //注入视图矩阵
        glUniformMatrix4fv(projLoc, 1, GL_FALSE, glm::value_ptr(projection));        //注入透视投影矩阵
        glBindVertexArray(VAO);
   
        glDrawArrays(GL_TRIANGLES, 0, 36);
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%A5%87%E8%AF%A1%E7%9A%843D-17167346549969.gif)





这有点像一个立方体，但又有种说不出的奇怪。立方体的某些本应被遮挡住的面被绘制在了这个立方体的其他面的上面。之所以这样是因为OpenGL是通过画一个一个三角形来画你的立方体的，所以它将会覆盖之前已经画在那里的像素。因为这个原因，有些三角形会画在其它三角形上面，虽然它们本不应该是被覆盖的。

幸运的是，OpenGL存储深度信息在z缓冲区(Z-buffer)里面，它允许OpenGL决定何时覆盖一个像素何时不覆盖。通过使用z缓冲区我们可以设置OpenGL来进行深度测试。

### Z缓冲区

OpenGL存储它的所有深度信息于Z缓冲区(Z-buffer)中，也被称为深度缓冲区(Depth Buffer)。GLFW会自动为你生成这样一个缓冲区 (就如它有一个颜色缓冲区来存储输出图像的颜色)。深度存储在每个片段里面(作为片段的z值)当片段像输出它的颜色时，OpenGL会将它的深度值和z缓冲进行比较然后如果当前的片段在其它片段之后它将会被丢弃，然后重写。这个过程称为**深度测试(Depth Testing)**并且它是由OpenGL自动完成的。

然而，如果我们想要确定OpenGL是否真的执行深度测试，首先我们要告诉OpenGL我们想要开启深度测试；而这通常是默认关闭的。我们通过`glEnable`函数来开启深度测试。`glEnable`和`glDisable`函数允许我们开启或关闭某一个OpenGL的功能。该功能会一直是开启或关闭的状态直到另一个调用来关闭或开启它。现在我们想开启深度测试就需要开启`GL_DEPTH_TEST`：

```c
glEnable(GL_DEPTH_TEST);
```

既然我们使用了深度测试我们也想要在每次重复渲染之前清除深度缓冲区(否则前一个片段的深度信息仍然保存在缓冲区中)。就像清除颜色缓冲区一样，我们可以通过在`glclear`函数中指定`DEPTH_BUFFER_BIT`位来清除深度缓冲区：

```c
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E4%B8%80%E4%B8%AA%E5%8A%A8%E8%B5%B7%E6%9D%A5%E7%9A%843D-171673469873610.gif)



## 更多的立方体

现在我们想在屏幕上显示10个立方体。每个立方体看起来都是一样的，区别在于它们在世界的位置及旋转角度不同。立方体的图形布局已经定义好了，所以当渲染更多物体的时候我们不需要改变我们的缓冲数组和属性数组，我们唯一需要做的只是改变每个对象的模型矩阵来将立方体转换到世界坐标系中。

首先，让我们为每个立方体定义一个转换向量来指定它在世界空间的位置。我们将要在`glm::vec3`数组中定义10个立方体位置向量。

```c
glm::vec3 cubePositions[] = {
  glm::vec3( 0.0f,  0.0f,  0.0f), 
  glm::vec3( 2.0f,  5.0f, -15.0f), 
  glm::vec3(-1.5f, -2.2f, -2.5f),  
  glm::vec3(-3.8f, -2.0f, -12.3f),  
  glm::vec3( 2.4f, -0.4f, -3.5f),  
  glm::vec3(-1.7f,  3.0f, -7.5f),  
  glm::vec3( 1.3f, -2.0f, -2.5f),  
  glm::vec3( 1.5f,  2.0f, -2.5f), 
  glm::vec3( 1.5f,  0.2f, -1.5f), 
  glm::vec3(-1.3f,  1.0f, -1.5f)  
};
```

现在，在循环中，我们调用`glDrawArrays`10次，在我们开始渲染之前每次传入一个不同的模型矩阵到顶点着色器中。我们将会创建一个小的循环来通过一个不同的模型矩阵重复渲染我们的对象10次。注意我们也传入了一个旋转参数到每个箱子中：

```c
        glBindVertexArray(VAO);
        for (GLuint i = 0; i < 10; i++)
        {
            //根据位置向量得到模型矩阵
            glm::mat4 model(1.0f);
            model = glm::translate(model, cubePositions[i]);
            float angle = 20.0f * (i + 1);

            // 模型矩阵， 继续做旋转 让角度随时间变化，形成旋转的效果
            model = glm::rotate(model, (float)glfwGetTime() * glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
            glUniformMatrix4fv(modelLoc, 1, GL_FALSE, glm::value_ptr(model));

            glDrawArrays(GL_TRIANGLES, 0, 36);
        }
        glBindVertexArray(0);
```

这个代码将会每次都更新模型矩阵然后画出新的立方体，如此总共重复10次。然后我们应该就能看到一个拥有10个正在奇葩旋转着的立方体的世界。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%BF%9B%E5%85%A53D%E4%B8%96%E7%95%8C-17042898721379-171673472423711.gif)





完美！这就像我们的箱子找到了志同道合的小伙伴一样。如果你在这里卡住了，你可以对照一下笔者的实现。

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
    glfwSetKeyCallback(window, key_callback);
    glewExperimental = GL_TRUE;
    glewInit();
    glViewport(0, 0, WIDTH, HEIGHT);
    glEnable(GL_DEPTH_TEST); //



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

       

        glfwPollEvents();
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



 
        glm::mat4 view(1.0f);
        glm::mat4 projection(1.0f);

       //构建透视投影矩阵
        view = glm::translate(view, glm::vec3(0.0f, 0.0f, -3.0f));
        projection = glm::perspective(45.0f, (GLfloat)WIDTH / (GLfloat)HEIGHT, 0.1f, 100.0f);
       
        // 获取模型矩阵、视图矩阵、投影矩阵在着色器源码的索引
        GLint modelLoc = glGetUniformLocation(ourShader.Program, "model");
        GLint viewLoc = glGetUniformLocation(ourShader.Program, "view");
        GLint projLoc = glGetUniformLocation(ourShader.Program, "projection");
     
       

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

            // 模型矩阵， 继续做旋转 让角度随时间变化，形成旋转的效果
            model = glm::rotate(model, (float)glfwGetTime() * glm::radians(angle), glm::vec3(1.0f, 0.3f, 0.5f));
         
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

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240103215344275-170429002521010-171673474151312.png)
