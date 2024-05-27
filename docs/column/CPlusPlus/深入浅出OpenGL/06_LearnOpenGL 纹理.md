# 纹理

我们已经了解到，我们可以为每个顶点添加颜色来增加图形的细节，从而创建出有趣的图像。但是，如果想让图形看起来更真实，我们就必须有足够多的顶点，从而指定足够多的颜色。这将会产生很多额外开销，因为每个模型都会需求更多的顶点，每个顶点又需求一个颜色属性。

艺术家和程序员更喜欢使用纹理(Texture)。纹理是一个2D图片（甚至也有1D和3D的纹理），它可以用来添加物体的细节；你可以想象纹理是一张绘有砖块的纸，无缝折叠贴合到你的3D的房子上，这样你的房子看起来就像有砖墙外表了。因为我们可以在一张图片上插入非常多的细节，这样就可以让物体非常精细而不用指定额外的顶点。



> 除了图像以外，纹理也可以被用来储存大量的数据，这些数据可以发送到着色器上，但是这不是我们现在的主题。



下面你会看到之前教程的那个三角形贴上了一张[砖墙](https://learnopengl-cn.readthedocs.io/zh/latest/img/01/06/wall.jpg)图片。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231228224637462.png)



为了能够把纹理映射(Map)到三角形上，我们需要指定三角形的每个顶点各自对应纹理的哪个部分。这样每个顶点就会关联着一个纹理坐标(Texture Coordinate)，用来标明该从纹理图像的哪个部分采样（译注：采集片段颜色）。之后在图形的其它片段上进行片段插值(Fragment Interpolation)。



纹理坐标在x和y轴上，范围为0到1之间（注意我们使用的是2D纹理图像）。使用纹理坐标获取纹理颜色叫做采样(Sampling)。纹理坐标起始于(0, 0)，也就是纹理图片的左下角，终始于(1, 1)，即纹理图片的右上角。下面的图片展示了我们是如何把纹理坐标映射到三角形上的。

![image-20231228224808360](06_纹理.assets/image-20231228224808360-17037748898092.png)



我们为三角形指定了3个纹理坐标点。如上图所示，我们希望三角形的左下角对应纹理的左下角，因此我们把三角形左下角顶点的纹理坐标设置为(0, 0)；三角形的上顶点对应于图片的上中位置所以我们把它的纹理坐标设置为(0.5, 1.0)；同理右下方的顶点设置为(1, 0)。我们只要给顶点着色器传递这三个纹理坐标就行了，接下来它们会被传片段着色器中，它会为每个片段进行纹理坐标的插值。



纹理坐标看起来就像这样：

```c
GLfloat texCoords[] = {
    0.0f, 0.0f, // 左下角
    1.0f, 0.0f, // 右下角
    0.5f, 1.0f // 上中
};
```

对纹理采样的解释非常宽松，它可以采用几种不同的插值方式。所以我们需要自己告诉OpenGL该怎样对纹理**采样**。

## 纹理环绕方式

那如果我们把纹理坐标设置在范围之外会发生什么？OpenGL默认的行为是重复这个纹理图像（我们基本上忽略浮点纹理坐标的整数部分），但OpenGL提供了更多的选择：

| **环绕方式(Wrapping)** |                           **描述**                           |
| :--------------------: | :----------------------------------------------------------: |
|       GL_REPEAT        |               对纹理的默认行为。重复纹理图像。               |
|   GL_MIRRORED_REPEAT   |        和GL_REPEAT一样，但每次重复图片是镜像放置的。         |
|    GL_CLAMP_TO_EDGE    | 纹理坐标会被约束在0到1之间，超出的部分会重复纹理坐标的边缘，产生一种边缘被拉伸的效果 |
|   GL_CLAMP_TO_BORDER   |               超出的坐标为用户指定的边缘颜色。               |

当纹理坐标超出默认范围时，每个选项都有不同的视觉效果输出。我们来看看这些纹理图像的例子：

![image-20231228225132668](06_纹理.assets/image-20231228225132668-17037750938443.png)

前面提到的每个选项都可以使用`glTexParameter()`函数对单独的一个坐标轴设置（`s`、`t`（如果是使用3D纹理那么还有一个`r`）它们和`x`、`y`、`z`是等价的）：

```c
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_MIRRORED_REPEAT);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_MIRRORED_REPEAT);
```

第一个参数指定了纹理目标；我们使用的是2D纹理，因此纹理目标是GL_TEXTURE_2D。

第二个参数需要我们指定设置的选项与应用的纹理轴。我们打算配置的是`WRAP`选项，并且指定`S`和`T`轴。

最后一个参数需要我们传递一个环绕方式，在这个例子中OpenGL会给当前激活的纹理设定纹理环绕方式为GL_MIRRORED_REPEAT。

如果我们选择GL_CLAMP_TO_BORDER选项，我们还需要指定一个边缘的颜色。这需要使用`glTexParameter()`函数的`fv`后缀形式，用GL_TEXTURE_BORDER_COLOR作为它的选项，并且传递一个float数组作为边缘的颜色值：

```c
float borderColor[] = { 1.0f, 1.0f, 0.0f, 1.0f };
glTexParameterfv(GL_TEXTURE_2D, GL_TEXTURE_BORDER_COLOR, borderColor);
```

## 纹理过滤

纹理坐标不依赖于分辨率(Resolution)，它可以是任意浮点值，所以OpenGL需要知道怎样将纹理像素(Texture Pixel，也叫Texel，译注1)映射到纹理坐标。当你有一个很大的物体但是纹理的分辨率很低的时候这就变得很重要了。你可能已经猜到了，OpenGL也有对于纹理过滤(Texture Filtering)的选项。纹理过滤有很多个选项，但是现在我们只讨论最重要的两种：GL_NEAREST和GL_LINEAR。



> Texture Pixel也叫Texel，你可以想象你打开一张`.jpg`格式图片，不断放大你会发现它是由无数像素点组成的，这个点就是纹理像素；注意不要和纹理坐标搞混，纹理坐标是你给模型顶点设置的那个数组，OpenGL以这个顶点的纹理坐标数据去查找纹理图像上的像素，然后进行采样提取纹理像素的颜色。



GL_NEAREST（也叫邻近过滤，Nearest Neighbor Filtering）是OpenGL默认的纹理过滤方式。当设置为GL_NEAREST的时候，OpenGL会选择中心点最接近纹理坐标的那个像素。下图中你可以看到四个像素，加号代表纹理坐标。左上角那个纹理像素的中心距离纹理坐标最近，所以它会被选择为样本颜色：



![image-20231228225419139](06_纹理.assets/image-20231228225419139-17037752599454.png)

GL_LINEAR（也叫线性过滤，(Bi)linear Filtering）它会基于纹理坐标附近的纹理像素，计算出一个插值，近似出这些纹理像素之间的颜色。一个纹理像素的中心距离纹理坐标越近，那么这个纹理像素的颜色对最终的样本颜色的贡献越大。下图中你可以看到返回的颜色是邻近像素的混合色：

![image-20231228225435166](06_纹理.assets/image-20231228225435166.png)

那么这两种纹理过滤方式有怎样的视觉效果呢？让我们看看在一个很大的物体上应用一张低分辨率的纹理会发生什么吧（纹理被放大了，每个纹理像素都能看到）：

![image-20231228225504694](06_纹理.assets/image-20231228225504694-17037753059835.png)

GL_NEAREST产生了颗粒状的图案，我们能够清晰看到组成纹理的像素，而GL_LINEAR能够产生更平滑的图案，很难看出单个的纹理像素。GL_LINEAR可以产生更真实的输出，但有些开发者更喜欢8-bit风格，所以他们会用GL_NEAREST选项。

当进行放大(Magnify)和缩小(Minify)操作的时候可以设置纹理过滤的选项，比如你可以在纹理被缩小的时候使用邻近过滤，被放大时使用线性过滤。我们需要使用`glTexParameter()`函数为放大和缩小指定过滤方式。这段代码看起来会和纹理环绕方式的设置很相似：

```c
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
```

### 多级渐远纹理

想象一下，假设我们有一个包含着上千物体的大房间，每个物体上都有纹理。有些物体会很远，但其纹理会拥有与近处物体同样高的分辨率。由于远处的物体可能只产生很少的片段，OpenGL从高分辨率纹理中为这些片段获取正确的颜色值就很困难，因为它需要对一个跨过纹理很大部分的片段只拾取一个纹理颜色。在小物体上这会产生不真实的感觉，更不用说对它们使用高分辨率纹理浪费内存的问题了。

OpenGL使用一种叫做多级渐远纹理(Mipmap)的概念来解决这个问题，它简单来说就是一系列的纹理图像，后一个纹理图像是前一个的二分之一。多级渐远纹理背后的理念很简单：距观察者的距离超过一定的阈值，OpenGL会使用不同的多级渐远纹理，即最适合物体的距离的那个。由于距离远，解析度不高也不会被用户注意到。同时，多级渐远纹理另一加分之处是它的性能非常好。让我们看一下多级渐远纹理是什么样子的：



![image-20231228225628894](06_纹理.assets/image-20231228225628894-17037753900416.png)

手工为每个纹理图像创建一系列多级渐远纹理很麻烦，幸好OpenGL有一个`glGenerateMipmaps()`函数，在创建完一个纹理后调用它OpenGL就会承担接下来的所有工作了。后面的教程中你会看到该如何使用它。

在渲染中切换多级渐远纹理级别(Level)时，OpenGL在两个不同级别的多级渐远纹理层之间会产生不真实的生硬边界。就像普通的纹理过滤一样，切换多级渐远纹理级别时你也可以在两个不同多级渐远纹理级别之间使用NEAREST和LINEAR过滤。为了指定不同多级渐远纹理级别之间的过滤方式，你可以使用下面四个选项中的一个代替原有的过滤方式：

|       **过滤方式**        |                           **描述**                           |
| :-----------------------: | :----------------------------------------------------------: |
| GL_NEAREST_MIPMAP_NEAREST | 使用最邻近的多级渐远纹理来匹配像素大小，并使用邻近插值进行纹理采样 |
| GL_LINEAR_MIPMAP_NEAREST  |     使用最邻近的多级渐远纹理级别，并使用线性插值进行采样     |
| GL_NEAREST_MIPMAP_LINEAR  | 在两个最匹配像素大小的多级渐远纹理之间进行线性插值，使用邻近插值进行采样 |
|  GL_LINEAR_MIPMAP_LINEAR  | 在两个邻近的多级渐远纹理之间使用线性插值，并使用线性插值进行采样 |

就像纹理过滤一样，我们可以使用`glTexParameteri()`将过滤方式设置为前面四种提到的方法之一：

```c
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
```

一个常见的错误是，将放大过滤的选项设置为多级渐远纹理过滤选项之一。这样没有任何效果，因为多级渐远纹理主要是使用在纹理被缩小的情况下的：纹理放大不会使用多级渐远纹理，为放大过滤设置多级渐远纹理的选项会产生一个GL_INVALID_ENUM错误代码

# 加载与创建纹理

使用纹理之前要做的第一件事是把它们加载到我们的应用中。纹理图像可能被储存为各种各样的格式，每种都有自己的数据结构和排列，所以我们如何才能把这些图像加载到应用中呢？一个解决方案是选一个需要的文件格式，比如`.PNG`，然后自己写一个图像加载器，把图像转化为字节序列。写自己的图像加载器虽然不难，但仍然挺麻烦的，而且如果要支持更多文件格式呢？你就不得不为每种你希望支持的格式写加载器了。

另一个解决方案也许是一种更好的选择，使用一个支持多种流行格式的图像加载库来为我们解决这个问题。比如说我们要用的STB库。

## STB

开源的stb库，目前Star数已过万，地址为https://github.com/nothings/stb，为何叫stb，是用的作者名字的缩写Sean T. Barrett。此库仅包含头文件，除stretchy_buffer.h外，其它所有文件以前缀stb开头，每个头文件的作用及用法在每个头文件的开始部分都作了介绍。此开源库的license为public domain或MIT。下面仅对与图像相关的头文件的作用及使用进行简单的说明，当仅需要将图像数据载入内存、或进行缩放操作、或保存图像时使用stb会非常方便，因为仅需要include一个或三个头文件即可，不需要额外图像处理库的依赖，如libjpeg、libpng、opencv等。

现在我们来聊下，怎么导入这个库，来实现把图像转为字节序列。进入此网站下载std_image.h头，网站：https://github.com/nothings/stb/blob/master/stb_image.h

![image-20231228230425389](06_纹理.assets/image-20231228230425389-17037758665647.png)

我们将其添加到我们的工程中，在这个文件中，人家说得很明白，需要你再建一个`std_image.cpp`的实现，并且在实现中定义`STB_IMAGE_IMPLEMENTATION` 这个宏，任何include一下 `std_image.h`的头。

![image-20231228230557085](06_纹理.assets/image-20231228230557085-17037759586918.png)

如果是笔者最后整合完成的目录，提供读者思考。

![image-20231228230901985](06_纹理.assets/image-20231228230901985-17037761445209.png)

下面的教程中，我们会使用一张[木箱](https://learnopengl-cn.readthedocs.io/zh/latest/img/01/06/container.jpg)的图片。要使用SOIL加载图片，我们需要使用它的`stbi_load()`函数：

```c
    int width, height;
    stbi_set_flip_vertically_on_load(1);
    unsigned char* image = stbi_load("src/container.jpg", &width, &height, NULL, 3);
```

函数首先需要输入图片文件的路径。然后需要两个`int`指针作为第二个和第三个参数，STB会分别返回图片的**宽度**和**高度**到其中。后面我们在生成纹理的时候会用图像的宽度和高度。第四个参数指定图片的**通道**(Channel)数量，但是这里我们只需留为`0`。最后一个参数告诉SOIL如何来加载图片：我们只关注图片的`RGB`值。结果会储存为一个很大的char/byte数组。

## 生成纹理

和之前生成的OpenGL对象一样，纹理也是使用ID引用的。让我们来创建一个：

```c
GLuint texture;
glGenTextures(1, &texture);
```

`glGenTextures()`函数首先需要输入生成纹理的数量，然后把它们储存在第二个参数的`GLuint`数组中（我们的例子中只是一个单独的`GLuint`）再之后就像其他对象一样，我们需要绑定它，让之后任何的纹理指令都可以配置当前绑定的纹理：

```c
glBindTexture(GL_TEXTURE_2D, texture);
```

现在纹理已经绑定了，我们可以使用前面载入的图片数据生成一个纹理了。纹理可以通过`glTexImage2D()`来生成：

```c
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
glGenerateMipmap(GL_TEXTURE_2D);
```

函数很长，参数也不少，所以我们一个一个地讲解：

- 第一个参数指定了纹理目标(Target)。设置为GL_TEXTURE_2D意味着会生成与当前绑定的纹理对象在同一个目标上的纹理（任何绑定到GL_TEXTURE_1D和GL_TEXTURE_3D的纹理不会受到影响）。
- 第二个参数为纹理指定多级渐远纹理的级别，如果你希望单独手动设置每个多级渐远纹理的级别的话。这里我们填0，也就是基本级别。
- 第三个参数告诉OpenGL我们希望把纹理储存为何种格式。我们的图像只有`RGB`值，因此我们也把纹理储存为`RGB`值。
- 第四个和第五个参数设置最终的纹理的宽度和高度。我们之前加载图像的时候储存了它们，所以我们使用对应的变量。
- 下个参数应该总是被设为`0`（历史遗留问题）。
- 第七第八个参数定义了源图的格式和数据类型。我们使用RGB值加载这个图像，并把它们储存为`char`(byte)数组，我们将会传入对应值。
- 最后一个参数是真正的图像数据。

当调用`glTexImage2D()`时，当前绑定的纹理对象就会被附加上纹理图像。然而，目前只有基本级别(Base-level)的纹理图像被加载了，如果要使用多级渐远纹理，我们必须手动设置所有不同的图像（不断递增第二个参数）。或者，直接在生成纹理之后调用`glGenerateMipmap()`。这会为当前绑定的纹理自动生成所有需要的多级渐远纹理。

生成了纹理和相应的多级渐远纹理后，释放图像的内存并解绑纹理对象是一个很好的习惯。

```c
    //解绑和释放图像的内存
    stbi_image_free(image);
    glBindTexture(GL_TEXTURE_2D, 0);
```

生成一个纹理的过程应该看起来像这样：

```c
GLuint texture;
glGenTextures(1, &texture);
glBindTexture(GL_TEXTURE_2D, texture);
// 为当前绑定的纹理对象设置环绕、过滤方式
...
// 加载并生成纹理
 int width, height;
 stbi_set_flip_vertically_on_load(1);
 unsigned char* image = stbi_load("src/container.jpg", &width, &height, NULL, 3);
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
glGenerateMipmap(GL_TEXTURE_2D);
stbi_image_free(image);
glBindTexture(GL_TEXTURE_2D, 0); 
```

## 应用纹理

后面的这部分我们会使用`glDrawElements()`绘制[「你好，三角形」](https://learnopengl-cn.readthedocs.io/zh/latest/01 Getting started/04 Hello Triangle/)教程最后一部分的矩形。我们需要告知OpenGL如何采样纹理，所以我们必须使用纹理坐标更新顶点数据：

```c
GLfloat vertices[] = {
//     ---- 位置 ----       ---- 颜色 ----     - 纹理坐标 -
     0.5f,  0.5f, 0.0f,   1.0f, 0.0f, 0.0f,   1.0f, 1.0f,   // 右上
     0.5f, -0.5f, 0.0f,   0.0f, 1.0f, 0.0f,   1.0f, 0.0f,   // 右下
    -0.5f, -0.5f, 0.0f,   0.0f, 0.0f, 1.0f,   0.0f, 0.0f,   // 左下
    -0.5f,  0.5f, 0.0f,   1.0f, 1.0f, 0.0f,   0.0f, 1.0f    // 左上
};
```

由于我们添加了一个额外的顶点属性，我们必须告诉OpenGL我们新的顶点格式：

![image-20231228231736648](06_纹理.assets/image-20231228231736648-170377665756010.png)

```c
glVertexAttribPointer(2, 2, GL_FLOAT,GL_FALSE, 8 * sizeof(GLfloat), (GLvoid*)(6 * sizeof(GLfloat)));
glEnableVertexAttribArray(2);
```

注意，我们同样需要调整前面两个顶点属性的步长参数为`8 * sizeof(GLfloat)`。



接着我们需要调整顶点着色器使其能够接受顶点坐标为一个顶点属性，并把坐标传给片段着色器：

```c
#version 330 core
layout (location = 0) in vec3 position;
layout (location = 1) in vec3 color;
layout (location = 2) in vec2 texCoord;

out vec3 ourColor;
out vec2 TexCoord;

void main()
{
    gl_Position = vec4(position, 1.0f);
    ourColor = color;
    TexCoord = texCoord;
}
```

片段着色器应该把输出变量`TexCoord`作为输入变量。

片段着色器也应该能访问纹理对象，但是我们怎样能把纹理对象传给片段着色器呢？GLSL有一个供纹理对象使用的内建数据类型，叫做采样器(Sampler)，它以纹理类型作为后缀，比如`sampler1D`、`sampler3D`，或在我们的例子中的`sampler2D`。我们可以简单声明一个`uniform sampler2D`把一个纹理添加到片段着色器中，稍后我们会把纹理赋值给这个uniform。

```c
#version 330 core
in vec3 ourColor;
in vec2 TexCoord;

out vec4 color;

uniform sampler2D ourTexture;

void main()
{
    color = texture(ourTexture, TexCoord);
}
```

我们使用GLSL内建的texture函数来采样纹理的颜色，它第一个参数是纹理采样器，第二个参数是对应的纹理坐标。texture函数会使用之前设置的纹理参数对相应的颜色值进行采样。这个片段着色器的输出就是纹理的（插值）纹理坐标上的(过滤后的)颜色。

现在只剩下在调用`glDrawElements)_`之前绑定纹理了，它会自动把纹理赋值给片段着色器的采样器：

```c
glBindTexture(GL_TEXTURE_2D, texture);
glBindVertexArray(VAO);
glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
glBindVertexArray(0);
```

如果你跟着这个教程正确地做完了，你会看到下面的图像：

![image-20231228231924774](06_纹理.assets/image-20231228231924774-170377676643411.png)

如果你的矩形是全黑或全白的你可能在哪儿做错了什么。检查你的着色器日志，并尝试对比一下笔者的实现。

# 笔者的实现

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


    //创建纹理对象并绑定
    GLuint texture;
    glGenTextures(1, &texture);
    glBindTexture(GL_TEXTURE_2D, texture); 
    //指定纹理环绕方式
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);	
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
    //指定纹理过滤
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

    //将本地图像加载到内存图像
    int width, height;
    stbi_set_flip_vertically_on_load(1);
    unsigned char* image = stbi_load("src/container.jpg", &width, &height, NULL, 3);

    //内存图像和纹理对象绑定
    glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, width, height, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
    glGenerateMipmap(GL_TEXTURE_2D); //自动生成所有需要的多级渐远纹理

    //解绑纹理对象 和释放图像的内存
    stbi_image_free(image);
    glBindTexture(GL_TEXTURE_2D, 0);


    while (!glfwWindowShouldClose(window))
    {
       
        glfwPollEvents();
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glClear(GL_COLOR_BUFFER_BIT);


        //绑定纹理对象
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

uniform sampler2D ourTexture;

void main()
{
    color = texture(ourTexture, TexCoord);
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

