# ArkTS开发实践

## 声明式UI基本概念

应用界面是由一个个页面组成，ArkTS是由ArkUI框架提供，用于以声明式开发范式开发界面的语言。

声明式UI构建页面的过程，其实是组合组件的过程，声明式UI的思想，主要体现在两个方面：

- 描述UI的呈现结果，而不关心过程
- 状态驱动视图更新



类似苹果的SwiftUI中通过组合视图View，安卓Jetpack Compose中通过组合@Composable函数，ArkUI作为HarmonyOS应用开发的UI开发框架，其使用ArkTS语言构建自定义组件，通过组合自定义组件完成页面的构建。



## 自定义组件的组成

ArkTS通过struct声明组件名，并通过@Component和@Entry装饰器，来构成一个自定义组件。



使用@Entry和@Component装饰的自定义组件作为页面的入口，会在页面加载时首先进行渲染。

```c
@Entry
@Component
struct ToDoList {...}
```

例如ToDoList组件对应如下整个代办页面。





使用@Component装饰的自定义组件，如ToDoItem这个自定义组件则对应如下内容，作为页面的组成部分。

```c
@Component
struct ToDoItem {...}
```



在自定义组件内需要使用build方法来进行UI描述。

```javascript
@Entry
@Component
 struct ToDoList
   ...
   build() {
    ...
  } 
}
```

build方法内可以容纳内置组件和其他自定义组件，如Column和Text都是内置组件，由ArkUI框架提供，ToDoItem为自定义组件，需要开发者使用ArkTS自行声明。

```c
@Entry
@Component
struct ToDoList {
  ...
  build() {
    Column(...) {
      Text(...)
        ...
      ForEach(...{
        TodoItem(...)
      },...)
    }
  ...
  }
}
```

## 配置属性与布局

自定义组件的组成使用基础组件和容器组件等内置组件进行组合。但有时内置组件的样式并不能满足我们的需求，ArkTS提供了属性方法用于描述界面的样式。属性方法支持以下使用方式：

 

- 常量传递

例如使用fontSize(50)来配置字体大小。

```c
Text('Hello World')
  .fontSize(50)
```

- 变量传递

在组件内定义了相应的变量后，例如组件内部成员变量size，就可以使用this.size方式使用该变量。

```c
Text('Hello World')
  .fontSize(this.size)
```

- 链式调用

在配置多个属性时，ArkTS提供了链式调用的方式，通过'.'方式连续配置。

```c
Text('Hello World')
  .fontSize(this.size)
  .width(100)
  .height(100)
```

- 表达式传递

```c
Text('Hello World')
  .fontSize(this.size)
  .width(this.count + 100)
  .height(this.count % 2 === 0 ? 100 : 200)
```

- 内置枚举类型

除此之外，ArkTS中还提供了内置枚举类型，如Color，FontWeight等，例如设置fontColor改变字体颜色为红色，并私有fontWeight为加粗。

```c
Text('Hello World')
  .fontSize(this.size)
  .width(this.count + 100)
  .height(this.count % 2 === 0 ? 100 : 200)
  .fontColor(Color.Red)
  .fontWeight(FontWeight.Bold)
```

对于有多种组件需要进行组合时，容器组件则是描述了这些组件应该如何排列的结果。

ArkUI中的布局容器有很多种，在不同的适用场合选择不同的布局容器实现，ArkTS使用容器组件采用花括号语法，内部放置UI描述。



这里我们将介绍最基础的两个布局——列布局和行布局。



对于如下每一项的布局，两个元素为横向排列，选择Row布局

 **Row布局**



```c
Row() {
  Image($r('app.media.ic_default'))
    ...
  Text(this.content) 
    ...
}
...
```

类似下图所示的布局，整体都是从上往下纵向排列，适用的布局方式是Column列布局。

 **Column布局**





```c
Column() {
   Text($r('app.string.page_title'))
     ...

   ForEach(this.totalTasks,(item) => {
     TodoItem({content:item})
   },...)
 }
```

## 改变组件状态

实际开发中由于交互，页面的内容可能需要产生变化，以每一个ToDoItem为例，其在完成时的状态与未完成时的展示效果是不一样的。

**不同状态的视图**



声明式UI的特点就是UI是随数据更改而自动刷新的，我们这里定义了一个类型为boolean的变量isComplete，其被@State装饰后，框架内建立了数据和视图之间的绑定，其值的改变影响UI的显示。

```c
@State isComplete : boolean = false;
```

**@State装饰器的作用**


用圆圈和对勾这样两个图片，分别来表示该项是否完成，这部分涉及到内容的切换，需要使用条件渲染if / else语法来进行组件的显示与消失，当判断条件为真时，组件为已完成的状态，反之则为未完成。

```c
if (this.isComplete) {
  Image($r('app.media.ic_ok'))
    .objectFit(ImageFit.Contain)
    .width($r('app.float.checkbox_width'))
    .height($r('app.float.checkbox_width'))
    .margin($r('app.float.checkbox_margin'))
} else {
  Image($r('app.media.ic_default'))
    .objectFit(ImageFit.Contain)
    .width($r('app.float.checkbox_width'))
    .height($r('app.float.checkbox_width'))
    .margin($r('app.float.checkbox_margin'))
}
```

由于两个Image的实现具有大量重复代码，ArkTS提供了@Builder装饰器，来修饰一个函数，快速生成布局内容，从而可以避免重复的UI描述内容。这里使用@Bulider声明了一个labelIcon的函数，参数为url，对应要传给Image的图片路径。

```c
@Builder labelIcon(url) {
  Image(url)
    .objectFit(ImageFit.Contain)
    .width($r('app.float.checkbox_width'))
    .height($r('app.float.checkbox_width'))
    .margin($r('app.float.checkbox_margin'))
}
```

使用时只需要使用this关键字访问@Builder装饰的函数名，即可快速创建布局。

```c
if (this.isComplete) {
  this.labelIcon($r('app.media.ic_ok'))
} else {
  this.labelIcon($r('app.media.ic_default'))
}
```

为了让待办项带给用户的体验更符合已完成的效果，给内容的字体也增加了相应的样式变化，这里使用了三目运算符来根据状态变化修改其透明度和文字样式，如opacity是控制透明度，decoration是文字是否有划线。通过isComplete的值来控制其变化。



```c
Text(this.content)
  ...
  .opacity(this.isComplete ? CommonConstants.OPACITY_COMPLETED : CommonConstants.OPACITY_DEFAULT)
  .decoration({ type: this.isComplete ? TextDecorationType.LineThrough : TextDecorationType.None })
```

最后，为了实现与用户交互的效果，在组件上添加了onClick点击事件，当用户点击该待办项时，数据isComplete的更改就能够触发UI的更新。

```c
@Component
struct ToDoItem {
  @State isComplete : boolean = false;
  @Builder labelIcon(icon) {...}
  ...
  build() {
    Row() {
      if (this.isComplete) {
        this.labelIcon($r('app.media.ic_ok'))
      } else {
        this.labelIcon($r('app.media.ic_default'))
      }
      ... 
    }
    ...
    .onClick(() => {
      this.isComplete= !this.isComplete;
     })
  }
}
```

## 循环渲染列表数据

刚刚只是完成了一个ToDoItem组件的开发，当我们有多条待办数据需要显示在页面时，就需要使用到ForEach循环渲染语法。



例如这里我们有五条待办数据需要展示在页面上。

```c
total_Tasks:Array<string> = [
  '早起晨练',
  '准备早餐',
  '阅读名著',
  '学习ArkTS',
  '看剧放松'
]
```

ForEach基本使用中，只需要了解要渲染的数据以及要生成的UI内容两个部分，例如这里要渲染的数组为以上的五条待办事项，要渲染的内容是ToDoItem这个自定义组件，也可以是其他内置组件。





**ForEach基本使用**

ForEach基本使用中，只需要了解要渲染的数据以及要生成的UI内容两个部分，例如这里要渲染的数组为以上的五条待办事项，要渲染的内容是ToDoItem这个自定义组件，也可以是其他内置组件。







ToDoItem这个自定义组件中，每一个ToDoItem要显示的文本参数content需要外部传入，参数传递使用花括号的形式，用content接受数组内的内容项item。





最终完成的代码及其效果如下。

```c
@Entry
@Component
struct ToDoList {
   ...
   build() {
     Row() {
       Column() {
         Text(...)
           ...
         ForEach(this.totalTasks,(item) => {
           TodoItem({content:item})
         },...)
       }
       .width('100%')
     }
     .height('100%')
   }
 }
```

**ToDoList页面**



如果读者的实现有困难，可以参考笔者的实现[ToDoListArkTs · 晴城丶/HarmonyOsProjects - 码云 - 开源中国 (gitee.com)](https://gitee.com/wangnaixing/harmony-os-projects/tree/master/ToDoListArkTs)
