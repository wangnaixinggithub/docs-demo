# 对C++中function和bind用法一窍不通？别担心，看完这篇文章就搞定了！

# 一、简介

在设计回调函数的时候，无可避免地会接触到可回调对象。在C++11中，提供了std::function和std::bind两个方法来对可回调对象进行统一和封装。



C++语言中有几种可调用对象：函数、函数指针、lambda表达式、bind创建的对象以及重载了函数调用运算符的类。 和其他对象一样，可调用对象也有类型。例如，每个lambda有它自己唯一的（未命名）类类型；函数及函数指针的类型则由其返回值类型和实参类型决定。



# 二、std::function的用法

类似于c语言的函数指针，包含在头文件`#include<functional>`中。



## 2.1、保存普通函数

```c
#include <iostream>
#include <functional>
void printA(int a)
{
        std::cout<<"a = "<<a<<std::endl;
}

int main()
{
        std::function<void(int a)> func;
        func=printA;
        func(22);
        return 0;
}
```

## 2.2、保存lambda表达式

```c
#include <iostream>
#include <functional>

int main()
{
        std::function<void()> func2=[](){std::cout<<"hello world"<<std::endl;};
        func2();
        return 0;
}
```



## 2.3、保存成员函数

```c
#include <iostream>
#include <functional>
class Foo{
public:
        Foo(int num) : num_(num){}
        void print_add(int a) const
        {
                std::cout<<num_+a<<std::endl;
        }
        int num_;
};

int main()
{
        std::function<void(const Foo&,int)> test=&Foo::print_add;
        Foo foo(10);
        test(foo,1);
        return 0;
```

注意，这里的function无法保存重载的成员函数，需要使用std::bind才行。下面的代码编译时会报错：

```c
#include <iostream>
#include <functional>
#include <string>

class Foo{
public:
        Foo(int num) : num_(num){}
        void print_add(int a) const
        {
                std::cout<<num_+a<<std::endl;
        }
        void print_add(std::string c) const
        {
                 std::cout<<c<<std::endl;
        }


        int num_;
};

int main()
{
        std::function<void(const Foo&,int)> test=&Foo::print_add;
        Foo foo(10);
        test(foo,1);
        return 0;
}
```

编译报错：

```
function_test.cc: In function ‘int main()’:
function_test.cc:32:50: error: conversion from ‘<unresolved overloaded function type>’ to non-scalar type ‘std::function<void(const Foo&, int)>’ requested
   32 |         std::function<void(const Foo&,int)> test=&Foo::print_add;
      |                                                  ^~~~~~~~~~~~~~~
```

# 三、std::bind用法

可将bind函数看作是一个通用的函数适配器，它接受一个可调用对象，生成一个新的可调用对象来“适应”原对象的参数列表。
调用bind的一般形式：

```c
auto newCallable = bind(callable,arg_list);  
```

其中，newCallable本身是一个可调用对象，arg_list是一个逗号分隔的参数列表，对应给定的callable的参数。即，当我们调用newCallable时，newCallable会调用callable,并传给它arg_list中的参数。



arg_list中的参数可能包含形如n的名字，其中n是一个整数，这些参数是“占位符”，表示newCallable的参数，它们占据了传递给newCallable的参数的“位置”。数值n表示生成的可调用对象中参数的位置：1为newCallable的第一个参数，_2为第二个参数，以此类推。

```c
std::function<void(int,int)> fc = std::bind(&A::fun_3, a,std::placeholders::_1,std::placeholders::_2);
```

总结起来就是：

1. 只是绑定函数，参数需要我们自己传入。
2. 绑定函数时候，也把参数绑定了，直接运行就行。即调用函数时参数已经被固定了，再次修改是没有用的。
3. bind的目的：不同的任务能传递不同的参数。

**使用示例：**

```c
#include <iostream>
#include <functional>
#include <string>
using namespace std;

class A{
public:
        void fun_3(int a,int b)
        {
                cout<<"func_3 print: a = "<<a<<", b = "<<b<<endl;
        }
        void fun_4(string str,int b)
        {
                cout<<"func_4 print: str = "<<str<<", b = "<<b<<endl;
        }
        void fun_4(int a,int b)
        {
                cout<<"func_4 print: a = "<<a<<", b = "<<b<<endl;
        }

};

void fun_1(int x,int y,int z)
{
        cout<<"func_1 print: x = "<<x<<", y = "<<y<<", z = "<<z<<endl;
}
void fun_2(int &a,int &b)
{
        a++;
        b++;
        cout<<"func_2 print: a=" <<a<<",b="<<b<<endl;
} 

int main(int argc,char** argv)
{
        // f1的类型为 function<void(int, int, int)>
        auto f1=std::bind(fun_1,1,2,3);//表示绑定函数 fun 的第一，二，三个参数值为： 1 2 3
        f1();
        f1(4,5,6);//修改无效
        cout<<"-----------------------------"<<endl;

        // 占位符
        // 表示绑定函数 fun 的第三个参数为 3，而fun 的第一，二个参数分别由调用 f2 的第一，二个参数 指定
        auto f2=bind(fun_1,placeholders::_1,placeholders::_2,3);
        f2(11,22);
        f2(11,22,33);//修改第三个参数无效
        cout<<"-----------------------------"<<endl;

        // 表示绑定函数 fun 的第三个参数为 3，而fun 的第一，二个参数分别由调用 f3 的第二，一个参数 指定 
        // 注意： f2 和 f3 的区别。
        auto f3=bind(fun_1,placeholders::_2,placeholders::_1,3);
        f3(11,22);
        f3(11,22,33);//修改第三个参数无效
        cout<<"-----------------------------"<<endl;

        // 传入引用
        int a=2,b=3;
        //表示绑定fun_2的第一个参数为b, fun_2的第二个参数由调用f4的第一个参数（_1）指定。
        auto f4=bind(fun_2,placeholders::_1,b);
        f4(a);
        cout<<"main print: a=" <<a<<",b="<<b<<endl;//说明：bind对于不事先绑定的参数，通过std::placeholders传 递的参数是通过引用传递的
        cout<<"-----------------------------"<<endl;

        // 绑定成员函数
        A aa;
        auto f5=bind(&A::fun_3,aa,placeholders::_1,placeholders::_2);
        f5(10,20);
        // std::function<void(int,int)> fc = std::bind(&A::fun_3, a,std::placeholders::_1,std::placeholders::_2); 
        // fc(10,20); //调用a.fun_3,和上面的auto等价
        cout<<"-----------------------------"<<endl;

        // 重载函数
        auto my=bind((void(A::*)(string,int))&A::fun_4,aa,placeholders::_1,13);
        my("hello world");

        return 0;
}
```

注意，重载成员函数的绑定是需要显式的指出被绑定成员函数的类型。如下所示：

```c
std::function<void(int, char*)> foo_test=std::bind((void (Foo::*)(int,char*))&Foo::foo, 
			 &foo, 
             std::placeholders::_1, 
             std::placeholders::_2);
```

# 总结

1. function保存函数的三个方式：保存普通函数、保存lambda表达式、保存成员函数；但是重载的成员函数需要配合bind才可以。
2. bind的目的：不同的任务能传递不同的参数。