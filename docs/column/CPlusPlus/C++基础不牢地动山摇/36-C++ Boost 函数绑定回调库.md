# C++ Boost 函数绑定回调库

Boost库中提供了函数对象库，可以轻松地把函数的参数和返回值进行绑定，并用于回调函数。这个库的核心就是bind函数和function类。

bind函数可以将一个函数或函数对象和其参数进行绑定，返回一个新的函数对象。通过这个新的函数对象，我们就可以将原有的函数或函数对象当做参数传来传去，并可以传递附加的参数，方便实现参数绑定和回调函数。function类用于表示一种特定的函数签名，可以在不知道具体函数的类型时进行类型擦除，并把这个函数作为参数传递和存储。通过function类，我们可以在编译时确定函数的类型，而在运行时将不同类型的函数封装成统一的类型，这为实现回调函数提供了便利。

## reference_wrapper

包装器主要用于防止参数传递时的多次拷贝问题，`boost.ref`应用代理模式，引入包装器来解决该问题。



使用包装器时，我们获取变量数据的方式就需要改为利用内置函数`get`获得，此时`get`相当于一个代理，他帮我们去修改后面的变量，从而实现对变量的安全访问。

```c
#include <iostream>
#include <vector>
#include <functional>
#include <boost/ref.hpp>

using namespace std;
using namespace boost;

int main(int argc, char* argv[])
{
	// 应用于整数类型的包装
	int x = 0;
	boost::reference_wrapper<int> int_ptr(x);

	(int&)int_ptr = 200;
	std::cout << "修改后的数值: " << int_ptr.get() << std::endl;

	// 应用于字符串类型的包装
	std::string my_string;
	boost::reference_wrapper<std::string> string_ptr(my_string);

	*string_ptr.get_pointer() = "hello lyshark";
	std::cout << "字符串: " << string_ptr.get().c_str() << " 长度: " << string_ptr.get().size() << std::endl;

	// ref 自动推导包装器
	double y = 3.14;
	auto rw = boost::ref(y);

	(double&)rw = 2.19;
	std::cout << "自动推导: " << rw.get() << " 类型: " << typeid(rw).name() << std::endl;

	std::system("pause");

	/*
		修改后的数值: 200
		字符串: hello lyshark 长度: 13
		自动推导: 2.19 类型: class boost::reference_wrapper<double>
		请按任意键继续
	*/
	return 0;
}

```

操作包装，ref库提供了用于模板源编程的特征类，`is_reference_wrapper`和`unwrap_reference`用于检测`reference_wrapper`对象，而`unwrap_ref()`用于解开包装，并返回包装对象的引用。

```c
#include <iostream>
#include <vector>
#include <set>
#include <functional>
#include <boost/ref.hpp>

using namespace std;
using namespace boost;

int main(int argc, char* argv[])
{
	// 验证容器是否被包装
	std::vector<int> vect(1, 2);

	auto int_vect_ptr = boost::cref(vect);
	std::cout << "是否包装: " << is_reference_wrapper<decltype(int_vect_ptr)>::value << std::endl;
	std::cout << "是否包装: " << is_reference_wrapper<decltype(vect)>::value << std::endl;

	// 解包类型
	std::string str;
	auto str_ptr = boost::ref(str);
	std::cout << "解包类型: " << typeid(unwrap_reference<decltype(str_ptr)>::type).name() << std::endl;
	std::cout << "解包类型: " << typeid(unwrap_reference<decltype(str)>::type).name() << std::endl;

	// 包装与解包
	std::set<int> vect_ptr;
	auto rw = boost::ref(vect_ptr);

	unwrap_ref(rw).insert(10);
	unwrap_ref(rw).insert(20);

	std::cout << "元素数: " << rw.get().size() << std::endl;

	std::system("pause");

	/*
		是否包装: 1
		是否包装: 0
		解包类型: class std::basic_string<char,struct std::char_traits<char>,class std::allocator<char> >
		解包类型: class std::basic_string<char,struct std::char_traits<char>,class std::allocator<char> >
		元素数: 2
		请按任意键继续. . .
		
	*/
	return 0;
}

```

如下案例中，我们首先定义一个`MyClass`类，其内部存在一个设置方法和一个获取方法，通过外部调用`void print(T item)`并传递对象，实现解包输出。

```c
#include <iostream>
#include <functional>
#include <boost/ref.hpp>

using namespace std;
using namespace boost;

class MyClass
{
private:
    int uuid;
public:
    MyClass() { uuid = 0; }

    void SetValue(int x)
    {
        uuid = x;
    }
    void ClassPrint()
    {
        std::cout << "当前数值: " << uuid++ << std::endl;
    }
};

template<typename T>
void print(T item)
{
    // 解包时赋值操作
    unwrap_ref(item).SetValue(20);

    for (int i = 0; i < 10; ++i)
    {
        // 输出解包数据 
        unwrap_ref(item).ClassPrint();
    }
}

int main(int argc, char* argv[])
{
    MyClass student;
    auto ptr = boost::ref(student);

    print(ptr);


    /*
    
        当前数值: 20
        当前数值: 21
        当前数值: 22
        当前数值: 23
        当前数值: 24
        当前数值: 25
        当前数值: 26
        当前数值: 27
        当前数值: 28
        当前数值: 29
        请按任意键继续. . .
    */
    std::system("pause");
    return 0;
}

```

## Bind

bind()是Boost库中的绑定函数，功能与标准库中的std::bind()函数类似，可以用于绑定一个可调用对象和一些参数，并返回一个新的可调用对象。使用boost::bind()函数可以方便地生成函数对象，在函数对象中保存一些函数参数。

bind()函数的一大优势是可以匹配任何可调用对象，包括函数、成员函数、函数指针、成员函数指针等。在使用boost::bind()函数时，需要通过占位符指定参数的位置，例如_1表示第一个参数，_2表示第二个参数，以此类推。

默认的bind通常是以适配器bind1st/bind2nd存在，而boost中的bind函数远远比默认的绑定函数强大，其最多可以绑定9个函数参数，且对绑定对象的要求也很低，可在没有result_type内部类型定义的情况下完成对函数对象的绑定操作。



首先来看一下使用bind完成针对普通函数的绑定，以及通过占位符实现指针函数绑定的操作。

```c
#include <iostream>
#include <string>
#include <boost/bind.hpp>

using namespace std;
using namespace boost;

int MyFunctionA(int x, int y)
{
	std::cout << "x = " << x << " y = " << y << std::endl;
	return x + y;
}

std::string MyFunctionB(std::string x, int y, int z)
{
	std::cout << "x = " << x << " y = " << y << " z = " << z << std::endl;
	return x;
}

int main(int argc, char* argv[])
{
	// 绑定普通函数
	auto ref_a = boost::bind(MyFunctionA, 20, 10)();
	cout << "绑定调用: " << ref_a << endl;

	auto ref_b = boost::bind(MyFunctionB, "lyshark", 10001, 25);
	std::cout << "绑定调用: " << ref_b() << std::endl;

	// 绑定时指定占位符
	int x = 10, y = 20;
	auto ref_c = boost::bind(MyFunctionA, _1, 9)(x);     // bind(MyFunctionA,x,9)
	auto ref_d = boost::bind(MyFunctionA, _1, _2)(x, y);  // bind(MyFunctionA,x,y)

	auto ref_e = boost::bind(MyFunctionB, _1, 1001, _2)("lyshark", 22); // bind(MyFunctionB,"lyshark",1001,22)
	auto ref_f = boost::bind(MyFunctionB, _3, _2, _2)(x, y, "admin");   // bind(MyFunctionB,10,20,"admin")

	// 绑定指针函数
	typedef decltype(&MyFunctionA) a_type;
	typedef decltype(&MyFunctionB) b_type;

	a_type a_ptr = MyFunctionA;
	b_type b_ptr = MyFunctionB;

	int a = 100, b = 200, c = 300;

	std::cout << "绑定A指针: " << boost::bind(a_ptr, _1, 10)(a) << std::endl;
	std::cout << "绑定B指针: " << boost::bind(b_ptr, _3, _2, _1)(a, b, "lyshark") << std::endl;


	/*
		是否包装: 1
		是否包装: 0
		解包类型: class std::basic_string<char,struct std::char_traits<char>,class std::allocator<char> >
		解包类型: class std::basic_string<char,struct std::char_traits<char>,class std::allocator<char> >
		元素数: 2
		请按任意键继续. . .	
	*/
	std::system("pause");
	return 0;
}

```

通常bind还可以绑定成员函数，在绑定成员函数时，必须将其绑定到对象或者指针上，因此使用`bind`绑定时需要牺牲一个占位符的位置，该绑定最多支持绑定8个参数。

```c
#include <iostream>
#include <string>
#include <algorithm>
#include <boost\bind.hpp>

using namespace std;
using namespace boost;

struct struct_function
{
    int func(int x, int y)
    {
        return x * y;
    }
};

int main(int argc, char* argv[])
{
    // 绑定成员函数
    struct_function struct_ptr;
    auto struct_ref = boost::bind(&struct_function::func, struct_ptr, _1, _2)(10, 20);
    cout << "绑定调用: " << struct_ref << endl;

    // 绑定到对组上
    typedef std::pair<int, std::string> pair_t;
    pair_t pair_ptr(1001, "hello lyshark");
    std::cout << "对组Key: " << boost::bind(&pair_t::first, pair_ptr)() << std::endl;
    std::cout << "对组Value: " << boost::bind(&pair_t::second, pair_ptr)() << std::endl;

    std::system("pause");

    /*
        绑定调用: 200
        对组Key: 1001
        对组Value: hello lyshark
        请按任意键继续. . .

    */
    return 0;
}

```

如下代码实现绑定到成员变量上，代码中`boost::bind(&point::x, _1)`取出`point`对象中的变量x，利用`std::transform`算法调用`bind`表达式操作容器`vect`，并逐个读取出来并把成员变量填充到`bind_vect`中。

```c
#include <iostream>
#include <string>
#include <algorithm>
#include<vector>
#include <time.h>
#include <boost\bind.hpp>

using namespace std;
using namespace boost;


struct point
{
    int x;
    point(int uuid = 0)
    {
        x = uuid;
    }
    void set_value(int uuid)
    {
        x = uuid;
    }
};


int main(int argc, char* argv[])
{
    std::vector<point> vect(10);
    srand(time(0));
    for (size_t i = 0; i < vect.size(); i++)
    {
        vect[i].x = rand() % 11;
    }

    std::vector<int> bind_vect(10);
    std::transform(vect.begin(), vect.end(), bind_vect.begin(), boost::bind(&point::x, _1));

    for (size_t i = 0; i < bind_vect.size(); i++)
    {
        std::cout << bind_vect[i] << std::endl;
    }
    return 0;
}

```

同理，bind同样支持绑定到任意函数对象上，包括标准库中的预定义对象。

如果函数对象中存在`result_type`定义，那么可以直接使用`bind`绑定，其会自动的推导出返回值类型，如果没有则需要在绑定时指定返回值类型。

```c
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <boost\bind.hpp>

using namespace std;
using namespace boost;

struct struct_function
{
    int operator()(int x, int y)
    {
        return x + y;
    }
};

int main(int argc, char* argv[])
{
    std::cout << boost::bind<int>(struct_function(), _1, _2)(10, 20) << std::endl;
    std::system("pause");

    /*
        30
        请按任意键继续. . .
    */
    return 0;
}

```



## Function

function是Boost库中的一个函数模板，与std::function类似，可以存储任何可调用对象，并且可以使用()运算符来调用存储的可调用对象。使用boost::function函数对象时，需要在实例化时指定函数对象的签名，从而指定输入参数和返回类型。

function使用起来非常灵活，可以将函数指针、函数对象、成员函数指针等各种可调用对象作为输入参数，并且可以绑定一部分函数参数，生成新的函数对象。



下面是一个简单的示例代码，演示了如何使用boost::function库来绑定函数：

```c
#include <iostream>
#include <boost/function.hpp>
#include <boost\bind.hpp>
using namespace boost;


double my_func(int x, double y) {
    return x * y;
}

class MyClass {
public:
    int my_member_func(int x, int y) {
        return x + y;
    }
};

int main() {
    using namespace boost;

    function<double(int, double)> f1 = bind(my_func, 10, _1);
    std::cout << "f1(2.0): " << f1(2.0) << std::endl; // 输出 20.0

    MyClass obj;
    function<int(int)> f2 = bind(&MyClass::my_member_func, &obj, _1, 20);
    std::cout << "f2(10): " << f2(10) << std::endl; // 输出 30

    return 0;
}

```

在本示例中，我们使用boost::function库分别定义了函数对象f1和函数对象f2，并分别绑定了函数my_func和类MyClass中的成员函数my_member_func。在使用boost::function时，需要先使用bind()函数将可调用对象和一些参数进行绑定，返回一个新的函数对象，然后将其赋值给boost::function对象。在bind()函数中，占位符_1表示绑定参数的位置。

在本示例中，函数对象f1将my_func的第一个参数设为10，第二个参数为绑定参数。函数对象f2将MyClass对象obj的成员函数my_member_func的第二个参数设为20，第一个参数为绑定参数。

boost::function灵活易用，能够支持各种可调用对象的绑定和操作，并且可以将函数对象存储在各种数据结构中。因此，在需要灵活处理函数对象时，boost::function通常是一个很好的选择。

function是一个函数对象的容器，是一种智能函数指针，其以对象形式封装，可用于函数的回调，暂时保管函数或函数对象，在需要的时候在调用，能够更好的实现回调

```c
#include <iostream>
#include <string>
#include <boost\function.hpp>
#include <boost\bind.hpp>

using namespace std;

float MyFunc(int x, int y)
{
    return x + y;
}

struct MyStruct
{
    int add(int x, int y)
    {
        return x * y;
    }
};

int main(int argc, char* argv[])
{
    // function 指向普通函数
    boost::function<float(int, int)> function_ptr;

    function_ptr = MyFunc;     // 将MyFunc用ptr来存储
    if (function_ptr)
    {
        cout << "调用指针: " << function_ptr(10, 20) << endl;
    }
    function_ptr = 0;

    // function 指向成员函数
    boost::function<int(int, int)> struct_ptr;
    MyStruct sc;

    struct_ptr = boost::bind(&MyStruct::add, &sc, _1, _2);
    cout << "调用指针: " << struct_ptr(10, 20) << endl;

    std::system("pause");

    /*
        调用指针: 30
        调用指针: 200
        请按任意键继续. . .
    */
    return 0;
}

```

function函数拷贝代价较大，此时可以使用`ref`库实现以引用的方式传递参数，从而降低`function`函数的拷贝代价。

```c
#include <iostream>
#include <string>
#include <vector>
#include <boost\bind.hpp>
#include <boost\function.hpp>

using namespace std;

template<typename T>
struct summary
{
    typedef void result_type;
    T sum;

    summary(T v = T()) : sum(v) {}
    void operator()(T const& x)
    {
        sum += x;
    }
};

int main(int argc, char* argv[])
{
    vector<int> vect = { 1, 3, 5, 7, 9 };
    summary<int> s;                                          // 定义有状态函数对象

    boost::function<void(int const&)> func(boost::ref(s));   // function包装引用

    std::for_each(vect.begin(), vect.end(), func);
    cout << "求和结果: " << s.sum << endl;

    std::system("pause");
    return 0;
}

```

function可用于替代函数指针，存储回调函数，其可以实现普通回调函数。

```c
#include <iostream>
#include <string>
#include <vector>
#include <boost\bind.hpp>
#include <boost\function.hpp>

using namespace std;

// 定义回调函数
void call_back_func(int x)
{
    cout << "执行回调函数(数值翻倍): " << x * 2 << endl;
}

// function 类型定义
class MyClass
{
private:
    typedef boost::function<void(int)> func_ptr;
    func_ptr func;
    int n;

public:
    // 定义构造函数
    MyClass(int i) :n(i) {}

    // 存储回调函数
    template<typename CallBack>
    void accept(CallBack call)
    {
        func = call;
    }
    // 运行函数
    void run()
    {
        func(n);
    }
};

int main(int argc, char* argv[])
{
    MyClass ptr(10);

    ptr.accept(call_back_func);    // 传入回调函数
    ptr.run();


    /*
        执行回调函数(数值翻倍): 20
        请按任意键继续. . .
    */
    std::system("pause");
    return 0;
}

```

通过ref库传递引用，实现带状态的回调函数。

```c
#include <iostream>
#include <string>
#include <vector>
#include <boost\bind.hpp>
#include <boost\function.hpp>

using namespace std;

class MyClass
{
private:
    typedef boost::function<void(int)> func_ptr;
    func_ptr func;
    int n;

public:
    // 定义构造函数
    MyClass(int i) :n(i) {}

    // 存储回调函数
    template<typename CallBack>
    void accept(CallBack call)
    {
        func = call;
    }
    // 运行函数
    void run()
    {
        func(n);
    }
};

class call_back_obj
{
private:
    int x;

public:
    call_back_obj(int i) :x(i) {}
    void operator()(int i)
    {
        cout << "回调函数: " << i * x << endl;
    }
};

int main(int argc, char* argv[])
{
    MyClass ptr(10);
    call_back_obj call_obj(2);

    ptr.accept(ref(call_obj));

    ptr.run();
    ptr.run();

    std::system("pause");
    return 0;
}

```

有时候我们需要一次性绑定多个回调函数，此时通过类绑定，即可实现多个`callback`共存。

```c
#include <iostream>
#include <string>
#include <vector>
#include <boost\bind.hpp>
#include <boost\function.hpp>

using namespace std;

class MyClass
{
private:
  typedef boost::function<void(int)> func_ptr;    // function 类型定义
  func_ptr func;
  int n;

public:
  // 定义构造函数
  MyClass(int i) :n(i){}

  // 存储回调函数
  template<typename CallBack>
  void accept(CallBack call)
  {
    func = call;
  }
  // 运行函数
  void run()
  {
    func(n);
  }
};

class call_back_factory
{
public:
  void call_back_func_a(int x)
  {
    cout << "回调函数1: " << x * 2 << endl;
  }

  void call_back_func_b(int x, int y)
  {
    cout << "回调函数2: " << x * y << endl;
  }
};

int main(int argc, char *argv[])
{
  MyClass ptr(10);
  call_back_factory factory;

  ptr.accept(bind(&call_back_factory::call_back_func_a, factory, _1));
  ptr.run();

  ptr.accept(bind(&call_back_factory::call_back_func_b, factory, _1, 200));
  ptr.run();

  std::system("pause");
  return 0;
}

```



## Signals



Boost.Signals2是Boost库中一个非常强大的信号/槽机制，它提供了类似于Qt中Signals and Slots机制的功能。Boost.Signals2库提供了一个boost::signals2::signal类，用于生成信号对象，并能够将槽函数与信号对象连接在一起。



与Qt Signals and Slots机制不同的是，Boost.Signals2库不需要特定的宏或标记来识别信号和槽函数，而是通过C类型的机制实现。由于它是一个标准的C库，并且不需要任何其他依赖，因此可以在不使用整个Qt库的情况下使用它。



下面是一个简单的示例代码，实一个简单的信号和槽函数的案例，如下案例定义信号，并分别连接到两个槽函数上。

```c
#include <iostream>
#include <string>
#include <boost\signals2.hpp>

using namespace std;

void slots_a()
{
	cout << "slots_a called" << endl;
}

void slots_b()
{
	cout << "slots_b called" << endl;
}

int main(int argc, char* argv[])
{
	boost::signals2::signal<void()> sig;    // 定义信号对象

	sig.connect(&slots_a);                  // 链接到槽函数
	sig.connect(&slots_b);
	sig();                                  // 发射信号

	std::system("pause");

	/*
		slots_a called
		slots_b called
		请按任意键继续. . .	
	*/
	return 0;
}

```

connect()函数提供了组号的概念，默认情况组号是`int`类型，组号可以指定组内成员的调用顺序，如下代码我们新建`slots`模板类，让其可以动态生成一些列插槽，演示组号与调用顺序之间的关系。

```c
#include <iostream>
#include <string>
#include <boost\signals2.hpp>

using namespace std;

template<int T>
struct MySlots
{
    void operator()()
    {
        std::cout << "槽函数: " << T << " 被调用" << std::endl;
    }
};

int main(int argc, char* argv[])
{
    boost::signals2::signal<void()> sig;

    // 普通的链接
    sig.connect(MySlots<1>(), boost::signals2::at_back);        // 最后被执行
    sig.connect(MySlots<25>(), boost::signals2::at_front);      // 第一个执行

    // 带有组号的链接
    sig.connect(6, MySlots<65>(), boost::signals2::at_back);    // 组号6 第三个执行
    sig.connect(6, MySlots<66>(), boost::signals2::at_front);

    sig.connect(3, MySlots<98>(), boost::signals2::at_back);    // 组号3 第二个执行
    sig.connect(3, MySlots<99>(), boost::signals2::at_front);

    sig.connect(10, MySlots<10>());                            // 组号10 倒数第二个执行

    sig();
    std::system("pause");
    /*
        槽函数: 25 被调用
        槽函数: 99 被调用
        槽函数: 98 被调用
        槽函数: 66 被调用
        槽函数: 65 被调用
        槽函数: 10 被调用
        槽函数: 1 被调用
        请按任意键继续. . .
    */
    return 0;
}

```

signal不仅可以把输入参数传递给插槽函数，也可以将函数执行结果返回给调用者，返回值默认使用`optional_last_value<T>`，他将使用`optional`对象返回最后被调用的槽函数的返回值。

```c
#include <iostream>
#include <string>
#include <boost\signals2.hpp>

using namespace std;

template<int T, int C>
struct MySlots
{
    int operator()(int x)
    {
        std::cout << "参数A: " << x << " 参数B: " << T << " 参数C: " << C << std::endl;
        return x + T + C;
    }
};

int main(int argc, char* argv[])
{
    boost::signals2::signal<int(int)> sig;

    sig.connect(0, MySlots<10, 20>());

    int ref = *sig(5);
    cout << "获取返回值: " << ref << endl;

    std::system("pause");

    /*
        参数A: 5 参数B: 10 参数C: 20
        获取返回值: 35
        请按任意键继续. . .
  
    */
    return 0;
}
```

有时候我们需要将多个插槽返回值经过处理后返回，signal允许自定义`合并器`来处理插槽返回值，并把多个插槽返回值合并为一个结果返回给调用者，代码如下所示。

```c
#include <iostream>
#include <string>
#include <numeric>
#include <boost\signals2.hpp>

using namespace std;

template<int T, int C>
struct MySlots
{
    int operator()(int x)
    {
        std::cout << "参数x: " << x << " 参数T: " << T << " 参数C: " << C << std::endl;
        return x + T + C;
    }
};

// 实现一个自定义合并器
template<typename T>
class combiner
{
    T v;       // 计算总和初始值
public:
    typedef std::pair<T, T> result_type;
    combiner(T t = T()) : v(t) {}   // 构造函数

    template<typename InputIterator>
    result_type operator()(InputIterator begin, InputIterator end) const
    {
        // 为空则返回0
        if (begin == end)
            return result_type();

        // 容器保存插槽调用结果
        vector<T> vec(begin, end);

        T sum = std::accumulate(vec.begin(), vec.end(), v);
        T max = *std::max_element(vec.begin(), vec.end());

        return result_type(sum, max);
    }
};

int main(int argc, char* argv[])
{
    // 定义信号并传递自定义合并器
    boost::signals2::signal<int(int), combiner<int>> sig;

    // 链接信号
    sig.connect(0, MySlots<10, 20>());
    sig.connect(0, MySlots<10, 15>());
    sig.connect(0, MySlots<24, 12>());

    // 调用等待返回值
    auto ref = sig(2);
    std::cout << "返回总和: " << ref.first << " 返回最大值: " << ref.second << endl;;

    std::system("pause");
    
    /*
        参数x: 2 参数T: 10 参数C: 20
        参数x: 2 参数T: 10 参数C: 15
        参数x: 2 参数T: 24 参数C: 12
        返回总和: 97 返回最大值: 38
        请按任意键继续. . .
    */
    return 0;
}

```

插槽有时不需要一直连接着，必要时可以使用`disconnect()`传入插槽序号实现断开操作，当需要使用时在动态连接上即可。

```c
#include <iostream>
#include <string>
#include <boost\signals2.hpp>

using namespace std;

void slots()
{
	cout << "slots called" << endl;
}

int main(int argc, char* argv[])
{
	boost::signals2::signal<void()> sig;    // 定义信号对象

	sig.connect(0, &slots);
	sig.connect(0, &slots);
	sig.connect(1, &slots);

	// 直接调用断开
	sig.disconnect(0);         // 断开0组插槽
	sig();

	// 指针断开与链接
	boost::signals2::connection drop_ptr = sig.connect(0, &slots);
	drop_ptr.disconnect();

	// 指针链接
	boost::signals2::scoped_connection connect_ptr = sig.connect(0, &slots);
	sig();

	std::system("pause");

	/*
		slots called
		slots called
		slots called
		请按任意键继续. . .
	*/
	return 0;
}

```

