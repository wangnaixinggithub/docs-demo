# STL算法



STL提供了很多处理容器的函数模板，它们的设计是相同的，有以下特点：

- 用迭代器表示需要处理数据的区间。

- 返回迭代器放置处理数据的结果（如果有结果）。

- 接受一个函数对象参数（结构体模板），用于处理数据（如果需要）

## 迭代器



:::details `向前偏移`

我们在遍历标准库容器的时候习惯用iterator([迭代器](https://so.csdn.net/so/search?q=迭代器&spm=1001.2101.3001.7020))去访问容器里面的元素，常用的习惯用法是：

```c
std::vector<int> vec;
vec.push_back(100);
vec.push_back(101);
vec.push_back(102);
vec.push_back(103);
vec.push_back(104);

std::vector<int>::iterator it;
std::cout << *it << std::endl;
it+=2;
std::cout << *it << std::endl;
```

上述程序中`it+=2`是将迭代器向后移动两个元素。标准库为我们提供了一个标准的模板操作来代替上述表达式，即std::advance(it, 2), advance的英文含义是增加、向前推。顾名思义就是讲迭代器向前推n个位置。

```c
template<class InputIt, class Distance>
void advance(InputIt& it, Distance n);
```

- it: 迭代器变量
- n 需要增加的向量长度

```c
#include <iostream>
#include <iterator>
#include <vector>

int main() 
{
    std::vector<int> v{ 3, 1, 4 };

    auto vi = v.begin();

    std::advance(vi, 2);

    std::cout << *vi << '\n';
}
```

- std::advance用来对迭代器做偏移操作
- 在使用前要包含`<iterator>`头文件

:::

## 函数对象

很多STL算法都使用函数对象，也叫函数符（functor），包括函数名、函数指针和仿函数。



函数符的概念：

- 生成器（generator）：不用参数就可以调用的函数符。

- 一元函数（unary function）：用一个参数可以调用的函数符。

- 二元函数（binary function）：用两个参数可以调用的函数符。



改进的概念：

- 一元谓词（predicate）：返回bool值的一元函数。

- 二元谓词（binary predicate）：返回bool值的二元函数。



STL定义了多个基本的函数符，用于支持STL的算法函数。包含头文件

```c
#include <functional>
```



**预定义的函数对象**

|        函数对象         |                             用途                             |
| :---------------------: | :----------------------------------------------------------: |
|    `negate<type>()`     |                      对element 取负符号                      |
|     `plus<type>()`      |                      对element + param2                      |
|     `minus<type>()`     |                      对element - param2                      |
|  `multiplies<type>()`   |                      对element × param2                      |
|    `divides<type>()`    |                      对element % param2                      |
|    `modulus<type>()`    | 如果element mod param 如果等于非零的数，返回true,如果等于0，返回false.通常配合not1一起用 |
|   `equal_to<type>()`    |        如果element == param2,则返回true,反之返回false        |
| `not_equal_to<type>()`  |       如果 element !=param2,则返回true,反之返回false.        |
|     `less<type>()`      |        如果element <param2,则返回true,反之返回false.         |
|    `greater<type>()`    |        如果element >param2,则返回true,反之返回false.         |
|  `less_equal<type>()`   |        如果element <=param2,则返回true,反之返回false.        |
| `greater_equal<type>()` |       如果element >=param2,则返回true,反之则返回false        |
|  `logical_not<type>()`  |                                                              |
|  `logical_and<type>()`  |                                                              |
|   `logical_or<type>`    |                                                              |

## 函数适配器

> 预定义的函数适配器

|       函数适配器        |                 作用                 |
| :---------------------: | :----------------------------------: |
| bind1st(函数对象,value) |     替换函数对象第一个参数的位置     |
| bind2nd(函数对象,value) |     替换函数对象第二个参数的位置     |
|     not1(函数对象)      | 对函数对象一个参数位置进行布尔值取反 |
|     not2(函数对象)      | 对函数对象二个参数位置进行布尔值取反 |
|  mem_fun_ref(函数对象)  |                                      |
|    mem_fun(函数对象)    |                                      |
|    ptr_fun(函数对象)    |                                      |



## 算法函数

STL将算法函数分成四组：

- 非修改式序列操作：对区间中的每个元素进行操作，这些操作不修改容器的内容。
- 修改式序列操作：对区间中的每个元素进行操作，这些操作可以容器的内容（可以修改值，也可以修改排列顺序
- 排序和相关操作：包括多个排序函数和其它各种函数，如集合操作。
- 通用数字运算：包括将区间的内容累积、计算两个容器的内部乘积、计算小计、计算相邻对象差的函数。通常，这些都是数组的操作特性，因此vector是最有可能使用这些操作的容器。

前三组在头文件`#include <algorithm>`中，有相关的函数定义。

第四组专用于数值数据，在`#include <numeric>`中，有相关的函数定义。





### 汇总算法

:::details `元素计数 count()&count_if()`

如果我们想知道容器中某个元素，在整个容器中出现了几次，有多少个。可以使用`count()` 方法。

```c
#include<algorithm>

// 接受容器的迭代器头指针 迭代器尾指针 要做计数的元素  
int count(begin,end,T element);
int count_if(begin, end,op);
```

比如下方演示了使用`count()`  方法，来判断整数4 在容器中有多少个。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
using namespace std;
int main()
{
    vector<int> ivec;
	for (size_t i = 0; i < 10; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	ivec.push_back(4);
	ivec.push_back(4);
	int num = count(ivec.begin(), ivec.end(), 4);
	cout << "容器中有" << num << "个4"<<endl;
	return 0;
}
```

结合函数适配器和函数对象，也是可以完成上述获取`vector` 中的整数操作的。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
using namespace std;

int main()
{

	vector<int> ivec;
	for (size_t i = 0; i < 10; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	ivec.push_back(4);
	ivec.push_back(4);

	int num = count_if(ivec.begin(), ivec.end(),not1(bind2nd(modulus<int>(),2)));
	cout << "容器中有" << num << "个偶数" << endl;
	return 0;
}
```

 `count_if()` 支持我们使用谓词进行过滤，我们可以通过定义`isEven()`函数 作为一元谓词过滤，对容器中每一个元素，都执行谓词过滤，将为`true`的结果过滤处理，比如如下就从`vector` 中过滤出来了偶数。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
using namespace std;

//一元谓词
bool isEven(int elem) {

	//输出偶数
	return elem % 2 == 0;
}

int main()
{
    vector<int> ivec;
	for (size_t i = 0; i < 10; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	ivec.push_back(4);
	ivec.push_back(4);

	int num = count_if(ivec.begin(), ivec.end(), isEven);
	cout << "容器中有" << num << "个偶数"<<endl;
	return 0;
}
```

另外`count_if()` 还支持使用函数对象的方式，比如使用`greater<int>()` 对象，该对象的比较逻辑是 判断 `param1> param2`,如果是，则返回true,如果不是，则返回false. `vector` 最终会保留下`true`情况下的元素。`bind2nd()` 是一个函数适配器，在这里会智能的将`param2替换成4`。所以下面的计数是针对大于4的元素个数进行的。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
using namespace std;

int main()
{
    vector<int> ivec;
	for (size_t i = 0; i < 10; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	ivec.push_back(4);
	ivec.push_back(4);
								
	int num = count_if(ivec.begin(), ivec.end(),bind2nd(greater<int>(), 4));
	cout << "容器中有" << num << "个数大于4"<<endl;
	return 0;
}
```

不仅仅是通过`vector` 可以使用，`set` `list` 等其他数据结构也是通用的。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
using namespace std;

int main()
{
	multiset<int> mset;
	for (size_t i = 1; i <= 9; i++)
	{
		mset.insert(i);
	}
	mset.insert(2);
	mset.insert(7);
	mset.insert(7);

	for (multiset<int>::iterator it = mset.begin(); it != mset.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	int num = count(mset.begin(), mset.end(), 7);
	cout << "multiset 里有" << num << "个7";
	return 0;
}
```

:::



:::details `最小值和最大值min/max_element()`

```c
#include<algorithm>
iterator min_element(begin,end);
iterator min_element(begin,end,op);
iterator max_element(begin,end);
iterator max_element(iterator begin,iterator end,op);
```

比如下面就演示了输出`deque<int>` 容器的最小值和最大值。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{
	deque<int> idep;
	for (size_t i = 2; i <=8; i++)
	{
		idep.insert(idep.end(), i);
	}
	for (int i = -3; i <=5; i++)
	{
		idep.insert(idep.end(), i);
	}

	for (deque<int>::iterator it = idep.begin(); it != idep.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//要得到最小值，需要使用*进行解引用。
	cout << "最小值"<<  *min_element(idep.begin(), idep.end()) << endl;
	cout << "最大值" << *max_element(idep.begin(), idep.end()) << endl;


	return 0;
}
```

定义比较元素之间比较大小的谓词，来求算最大值和最小值。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;


bool absLess(int element1,int element2) {
	return abs(element1) < abs(element2);
}

int main()
{
	deque<int> idep;
	for (size_t i = 2; i <=8; i++)
	{
		idep.insert(idep.end(), i);
	}
	for (int i = -3; i <=5; i++)
	{
		idep.insert(idep.end(), i);
	}

	for (deque<int>::iterator it = idep.begin(); it != idep.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	cout << "最小值"<< * min_element(idep.begin(), idep.end(), absLess) << endl;
	cout << "最大值" << *max_element(idep.begin(), idep.end(), absLess) << endl;


	return 0;
}
```

:::



:::details `汇总求和reduce()`

类似与`Java` 中的`reduce()` 方法，得到一个累计值。

```c
vector<int> vi{1, 2, 3};
cout << accumulate(vi.begin(), vi.end(), 0);    // 6
```

这个例子中，accumulate接收了三个参数，一对迭代器用来标识开始和结束区间，第三个参数0，是accumulate操作的初始值. accumulate遍历[begin, end)这个区间，把每个值累加到0这个初始值上面，并最终返回累加结束的值(0 + 1 + 2 + 3) == 6.

```c++

template <class InputIterator, class T>
   T accumulate (InputIterator first, InputIterator last, T init);


template <class InputIterator, class T, class BinaryOperation>
   T accumulate (InputIterator first, InputIterator last, T init,
                 BinaryOperation binary_op);
```

第一个例子只是accumulate特例的情况，其实它不仅仅能完成累加操作，它更一般的含义, 我觉得可以这样理解：

> 给定一个区间和初值`init`以及一个可选的操作函数op，返回一个和`init`一样类型的结果，该结果是通过对给定区间内的每个元素逐个累积用op操作作用于init而得到的。



op是一个二元操作函数，默认的op是 `+` 运算, 这就是第一个例子执行累加的原因.



因此可以说第一种原型和用法只是第二种的一个特例，accumulate更通用的用法是指定一个操作函数op.可以这样来重写第一个例子，

```c++
vector<int> vi{ 1, 2, 3 };
// 显示指定op为二元操作符 ： plus<int>()
cout << accumulate(vi.begin(), vi.end(), 0, plus<int>());   // 6
```

虽然结果是一样的，但是第二个例子是一种更为通用的用法。





从accumulate的原型中能看到，init是按值传递的，在调用完成后局部变量init的值并没有被修改

要想使得其值等于累积后的值，需要接收accumulate的返回值。

所以下面例子中的init在调用accumulate之后并不会被改变

```c++
vector<int> vi{ 1, 2, 3 };

int init(0);
accumulate(vi.begin(), vi.end(), init, plus<int>());
EXPECT_EQ(0, init);                 // test pass

init = accumulate(vi.begin(), vi.end(), init, plus<int>());
EXPECT_EQ(6, init);                 // test pass
```

`init`在第一个调用完之后仍然是0. 那能不能不接受返回值，让`init`被修改呢, 就想传引用那样？

这个问题放在后面来讨论，使用reference_wrapper来尝试对`init`进行包装.









可以看出，迭代器区间没什么特别需要说的，初值的选择也还好，和其它非数值类型的算法一样，accumulate的灵活性用法关键就在于op操作函数的选取上，函数对象(functors)一类东西都可以往这里塞，下面由简单到复杂给出accumulate的一些实用用法。

```c++
int func(int i, int j) 
{
    return i + j;
}

struct Functor
{
    int operator () (int i, int j)
    {
        return i + j;
    }
};

RUN_GTEST(NumericAlgorithm, MoreExamples, @);

vector<int> vi{ 1, 2, 3 };
EXPECT_EQ(6, accumulate(vi.begin(), vi.end(), 0, func));        // 使用函数
EXPECT_EQ(6, accumulate(vi.begin(), vi.end(), 0, Functor()));   // 使用函数对象
EXPECT_EQ(6, accumulate(vi.begin(), vi.end(), 0, [](int i, int j) ->int {return i + j;})); // 使用lambda


// 使用函数组合: init + v[i] * 2
int res = accumulate(vi.begin(), vi.end(), 
                        0, 
                        bind(plus<int>(), _1, 
                            bind(multiplies<int>(), _2, 2)
                        )
                    );

EXPECT_EQ(12, res);

// or use lambda. 与函数组合等效的lambda
res = accumulate(vi.begin(), vi.end(), 0, [](int i, int j) ->int { return i + 2*j; });
EXPECT_EQ(12, res);


// 使用类成员变量
struct Account
{
    int money;
};
vector<Account> va  = {Account{1}, Account{100}, Account{}};
int total = accumulate(va.begin(), va.end(), 
                        0, 
                        bind(plus<int>(), _1,
                            bind(&Account::money, _2)
                        )
                      );

EXPECT_EQ(101, total);

END_TEST;
```

在一个map里有各种动物–数量的映射，使用accumulate统计动物总数：

```c++
RUN_GTEST(NumericAlgorithm, AdvancedUse, @);

map<string, int> m;
m.insert({ "dog",   3 });
m.insert({ "cat",   2 });
m.insert({ "fox",   1 });
m.insert({ "crow",  2 });

int animals(0);

animals = accumulate(m.begin(), m.end(),
                        0,
                        bind(plus<int>(), _1,
                            bind(&map<string, int>::value_type::second, _2)
                        )
                    );

EXPECT_EQ(8, animals);                  // animail totoal count is 8

END_TEST;
```

:::

### 查找算法

> 下面的查找算法适配全部的容器，并且不要求容器里面的元素是有序的。



:::details `元素位置find()&find_if()`

```c++
#include<algorithm>
// 查找元素 返回指向这个元素的迭代器
iterator find(start,end,element);
//重载，查找满足为此的元素
iterator find_if(start,end,op);	
```

```c++
int main()
{
	list<int> ilist;
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.push_back(i);
	}
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	//查找第一个4 到 第二个4 之间的元素
	list<int>::iterator position1;
	position1 = find(ilist.begin(), ilist.end(), 4);
	
    list<int>::iterator position2;
	if (position1 != ilist.end()) {
		position2 = find(++position1, ilist.end(), 4);
	}
	
    if (position1 != ilist.end() && position2 != ilist.end()) {
		for (list<int>::iterator it = position1; it != position2; it++)
		{
			cout << *it << " ";
		}
	}
	return 0;
}
```

如果我们希望，把两个4也一带查找出来，我们可以通过修改迭代器`position1`,让其指向上一个位置，`position2`，让其指向下一个位置。

```c++
	...
	--position1;
	++position2;
	if (position1 != ilist.end() && position2 != ilist.end()) {
		for (list<int>::iterator it = position1; it != position2; it++)
		{
			cout << *it << " ";
		}
	}
```



`find_if()`,可以配置函数对象使用，来输出符合谓词的元素。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{
	vector<int> ivector;
	for (size_t i = 1; i <=9; i++)
	{
		ivector.push_back(i);
	}
	for (vector<int>::iterator it = ivector.begin(); it != ivector.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
    
	// 输出比3大的数 后面的区间
	vector<int>::iterator position1;
	position1 = find_if(ivector.begin(),ivector.end(),bind2nd(greater<int>(),3));
	if (position1 != ivector.end()) {
		for (vector<int>::iterator it = position1; it != ivector.end(); it++)
		{
			cout << *it << " ";

		}
	}
	return 0;
}
```

还可以输出，能被3整除的数。

```c++
    //找到第一个能被3整除的数
	vector<int>::iterator position1;
	position1 = find_if(ivector.begin(), ivector.end(),not1(bind2nd(modulus<int>(),3)));
	cout << *position1 << endl;
```

:::



:::details `元素连续出现位置search_n()`



> STL算法提供了找到连续匹配值的算法，比如查找连续的4个3，5个8之类的情况。

```c++
#include<algorithm>
//查找连续匹配值 
iterator search_n(begin, end,int count,T value);
iterator search_n(begin,end,int count,op);
```

如下就找到了连续的4个3的下标位置。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{
	deque<int> ideque;
	for (size_t i = 1; i <= 9; i++)
	{	
		if (i == 3) {
			ideque.push_back(i);
			ideque.push_back(i);
			ideque.push_back(i);
			ideque.push_back(i);
		}
		else
		{
			ideque.push_back(i);
		}
	}
	for (deque<int>::iterator it = ideque.begin(); it != ideque.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	deque<int>::iterator position;
	position = search_n(ideque.begin(), ideque.end(), 4, 3);
	if (position != ideque.end()) {
		cout << "找到连续的4个3,下标位置" << distance(ideque.begin(),position) << endl;
	}
	else
	{
		cout << "没找到" << endl;
	}
	return 0;
}
```

我们还可以结合函数对象进行使用，比如找到连续的3个大于6的下标位置。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{
	deque<int> ideque;
	for (size_t i = 1; i <= 9; i++)
	{	
		if (i == 3) {
			ideque.push_back(i);
			ideque.push_back(i);
			ideque.push_back(i);
			ideque.push_back(i);
		}
		else
		{
			ideque.push_back(i);
		}
	}
	for (deque<int>::iterator it = ideque.begin(); it != ideque.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	deque<int>::iterator position;
	position = search_n(ideque.begin(), ideque.end(), 3, 6, greater<int>());
	if (position != ideque.end()) {
		cout << "找到连续的3个大于6的数，下标位置 " << distance(ideque.begin(), position) << endl;
	}
	else
	{
		cout << "没找到" << endl;
	}

	return 0;
}
```

:::



:::details `一批元素出现位置search()&find_end()`

```c
#include<algorithm>
// 查找A容器一批数据在B容器中都有的元素
//在哪里开始找？---在A里找
//找什么数据？--- 找B容器构成的数据
iterator search(AStart,AEnd,BStart,BEnd);

//功能一样，只是从后面往前找
iterator find_end(AStart,AEnd,BStart,BEnd);
```

比如容器B的数据是12345671234567，容器A的数据是3456,那么要在容器B中找到同样是3456的数据元素的那一段数据的，返回指向该段数据的第一个元素的迭代器指针。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{
	list<int> ilist;
	deque<int> ideque;
	for (size_t i = 1; i <= 7; i++)
	{
		ideque.insert(ideque.end(),i);
	}
	for (size_t i = 1; i <=7; i++)
	{
		ideque.insert(ideque.end(), i);
	}
	for (size_t i = 3; i <=6; i++)
	{
		ilist.insert(ilist.end(), i);
	}
	for (deque<int>::iterator it = ideque.begin(); it != ideque.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
    
	// 要在容器B(12345671234567) 找到容器A(3456)的下标
	deque<int>::iterator position;
	position = search(ideque.begin(), ideque.end(), ilist.begin(), ilist.end());

	if (position != ideque.end()) {
		cout << "找到了，下标是" << distance(ideque.begin(), position);
	}
	else
	{
		cout << "没找到" << endl;
	}

	return 0;
}
```

因为3456，实际上出现不止一次，我们可以再继续找。

```c
	....
	deque<int>::iterator position;
	position = search(ideque.begin(), ideque.end(), ilist.begin(), ilist.end());
	if (position != ideque.end()) {
		cout << "找到了，下标是" << distance(ideque.begin(), position);
	}
	else
	{
		cout << "没找到" << endl;
	}
	//移动position下标 继续找
	cout << endl;
	++position;
	position = search(position, ideque.end(), ilist.begin(), ilist.end());
	if (position != ideque.end()) {
		cout << "找到了，下标是" << distance(ideque.begin(), position);
	}
	else
	{
		cout << "没找到" << endl;
	}
	cout << endl;
```

实际上，我们根本就不知道实际上到底会出现几次，我们可以利用循环再继续找。

```c
	....
    deque<int>::iterator position;
	position = search(ideque.begin(), ideque.end(), ilist.begin(), ilist.end());
	while (position != ideque.end())
	{
		cout << "找到了 位置" << distance(ideque.begin(), position) << endl;
		++position;
		position = search(position, ideque.end(), ilist.begin(), ilist.end());
	}
	cout << endl;
```

`find_end()` 和`search()` 的功能，没有什么区别，只是他是从后面开始查找。

```c
	deque<int>::iterator position;
	position = find_end(ideque.begin(), ideque.end(),ilist.begin(),ilist.end());
	while (position != ideque.begin()+1)
	{
		cout << "找到了 位置" << distance(ideque.begin(), position)<<endl;
		--position;
		position = find_end(ideque.begin(), position, ilist.begin(), ilist.end());
	}
```

`search()` 他们还能配合函数对象去使用。比如下面查找在`vector` 中出现偶数奇数偶数的元素下标位置。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
/// <summary>
/// 函数
/// </summary>
/// <param name="elem">元素</param>
/// <param name="even">如果为true 则判断是偶数 反之判断是奇数</param>
/// <returns></returns>
bool checkEven(int elem, bool even) {
	if (even) {

		return elem % 2 == 0;
	}
	else
	{
		return elem % 2 == 1;
	}
}

int main()
{
	vector<int> ivec;
	for (size_t i = 1; i <=9; i++)
	{
		ivec.insert(ivec.end(), i);
	}

	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	//查找 偶数 奇数 偶数
	bool checkEvenArgs[3] = { true,false,true };
	vector<int>::iterator pos;
	pos = search(ivec.begin(), ivec.end(), checkEvenArgs, checkEvenArgs + 3, checkEven);
	if (pos != ivec.end()) {
		cout << "找到了 位置" << distance(ivec.begin(),pos )<<endl;
	}
	else
	{
		cout << "没找到" << endl;
	}
	return 0;
}
```

```c
//查找A容器在B容器中有的元素
// A容器是要查找元素的容器，B容器是提供查找元素的容器 匹配到第一个就返回了，顺序是从容器B 头部开始的
iterator find_first_of(Astart,Aend,Bstart,Bend)
    
 //C++没有提供 find_last_of() 方法. 但是可以通过逆向迭代器，让顺序从后面开始。从而查找最后一个
iterator find_first_of(rAbegin,rAend,Bstart,Bend)

    
  //支持谓词用法。  
iterator find_first_of(rAbegin,rAend,Bstart,Bend,op);
```

- 找第一个元素

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{	

	vector<int> ivec;
	list<int> searchList;
	for (size_t i = 1; i < 11; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it;
	}
	cout << endl;
	//找到searchList中匹配的数字，先匹配3，类推。
	searchList.push_back(3);
	searchList.push_back(6);
	searchList.push_back(9);
	vector<int>::iterator ops;
    //ivec 容器也有3 返回3的位置。
	ops = find_first_of(ivec.begin(), ivec.end(), searchList.begin(), searchList.end());
	if (ops != ivec.end()) {
		cout << "找到了！位置" << distance(ivec.begin(), ops) << endl;
	}
	else
	{
		cout << "没找到" << endl;
	}
	return 0;
}
```

- 找最后一个元素

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
//如果为true 则判断是偶数 反之判断是奇数
bool checkEven(int elem, bool even) {
	if (even) {

		return elem % 2 == 0;
	}
	else
	{
		return elem % 2 == 1;
	}
}

int main()
{	

	vector<int> ivec;
	list<int> searchList;
	for (size_t i = 1; i < 11; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it;
	}
	cout << endl;
	//找到searchList中匹配的数字，先匹配3，类推。
	searchList.push_back(3);
	searchList.push_back(6);
	searchList.push_back(9);
	
	vector<int>::reverse_iterator rops;
	rops = find_first_of(ivec.rbegin(), ivec.rend(), searchList.begin(), searchList.end());
	cout << "找到了,位置：" << distance(ivec.begin(), rops.base()-1) << endl;

	return 0;
}
```

:::



:::details `连续相等元素位置adjacent_find()`

```c++
adjacent_find(b,e);
adjecent_find(b,e,p);
```

- 找连续两个相等的元素

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{	

	vector<int> ivec;
	ivec.push_back(1);
	ivec.push_back(3);
	ivec.push_back(2);
	ivec.push_back(4);
	ivec.push_back(5);
	ivec.push_back(5);
	ivec.push_back(0);

	vector<int>::iterator pos;
	pos = adjacent_find(ivec.begin(), ivec.end());
	//找到容器中连续相等的两个数
	if (pos != ivec.end()) {
		cout << "找到了，位置" << distance(ivec.begin(),pos);
	}
	else
	{
		cout << "没找到";
	}
	return 0;
}
```

- 找满足谓词的元素

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

//谓词 后面的等于前面的两倍
bool doubled(int element1, int element2) {
	return element1 * 2 == element2;
}
int main()
{	

	vector<int> ivec;
	ivec.push_back(1);
	ivec.push_back(3);
	ivec.push_back(2);
	ivec.push_back(4);
	ivec.push_back(8);
	ivec.push_back(6);
	ivec.push_back(0);

	vector<int>::iterator pos;
	pos = adjacent_find(ivec.begin(), ivec.end(),doubled);
	//找到容器中连续相等的两个数
	if (pos != ivec.end()) {
		cout << "找到了，位置" << distance(ivec.begin(),pos);
	}
	else
	{
		cout << "没找到";
	}
	return 0;
}
```

:::



:::details `计算元素下标distance()`

```c++
// 如果是计算指向第一个元素的迭代器，到容器某个元素的距离，那么这个距离等价于 下标
int distance(begin,op);
```

```c++
int main()
{
	deque<int> d;
	d.push_back(5);
	d.push_back(4);
	d.push_back(3);
	d.push_back(2);
	d.push_back(1);

	deque<int>::iterator ops;
	ops = find(d.begin(), d.end(), 4);

	cout  << "距离：" << distance(d.begin(), ops);
}

```

:::



### 已序区间查找算法

> 下面算法使用前提是，容器必须已经排好序了。



:::details `二分查找binary_search()`

```c++
// 二分查找算法，如果元素存在返回true 如果元素不存在返回false
bool binary_search(begin,end,elemnt);
//谓词是指定排序规则
bool binary_search(begin,end,elemnt，p);
```

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{	

	list<int> ilist;
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.insert(ilist.end(), i);
	}

	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	if (binary_search(ilist.begin(), ilist.end(), 5)) {
		cout << "找到了";
	}
	else
	{
		cout << "没找到";
	}


	return 0;
}
```



```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{	

	list<int> ilist;
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.insert(ilist.end(), i);
	}
	vector<int> search;
	search.push_back(3);
	search.push_back(4);
	search.push_back(7);

	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	if (includes(ilist.begin(), ilist.end(), search.begin(), search.end())) {
		cout << "都有，都找到了";
	}
	else
	{
		cout << "没有找到";
	}

	return 0;
}
```

:::



:::details `元素包含includes()`

这个方法，实际上是确认容器之间的子集问题，包含和不包含的问题

```c
// A容器 包含 B容器的全部元素吗？包含返回true 不包含返回false

//确保A B容器都是排好序的
bool includes(Abegin,Aend,Bbegin,Bend);
bool includes(Abegin,Aend,Bbegin,Bend,op);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{	

	list<int> ilist;
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.insert(ilist.end(), i);
	}
	vector<int> search;
	search.push_back(3);
	search.push_back(4);
	search.push_back(7);
	
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//判断容器ilist 是不是包含了search容器中的全部元素
	if (includes(ilist.begin(), ilist.end(), search.begin(), search.end())) {
		cout << "都有，都找到了";
	}
	else
	{
		cout << "没有找打";
	}

	return 0;
}
```

:::



:::details `元素位置lower_bound()&upper_bound()`

从功能角度出发，有点像`find()`

```c++
//查找元素第一次出现的位置
itertor lower_bound(begin, end, element)
// 最后一次
itertor upper_bound(begin, end, element)
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{	

	list<int> ilist;
	for (size_t i = 1; i <= 9 ; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.push_back(i);
	}
	ilist.sort();
	for (list<int>::iterator it = ilist.begin(); it !=ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	list<int>::iterator pos1;


	pos1 = lower_bound(ilist.begin(), ilist.end(),5);

	cout << "第一个5的位置" << distance(ilist.begin(), pos1);
	return 0;
}
```

```c++
//查找元素最后一次出现的位置
iterator lower_bound(begin, end, element)
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{	

	list<int> ilist;
	for (size_t i = 1; i <= 9 ; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.push_back(i);
	}
		ilist.sort();
	for (list<int>::iterator it = ilist.begin(); it !=ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	list<int>::iterator pos1;


	pos1 = upper_bound(ilist.begin(), ilist.end(),5);

	cout << "第一个5的位置" << distance(ilist.begin(), pos1);
	return 0;
}
```

通常，`lower_bound() OR upper_bound()` 通常是配置插入一个一样的元素的。

```c++
	//插入一个5
	ilist.insert(lower_bound(ilist.begin(), ilist.end(), 5), 5);
	ilist.insert(upper_bound(ilist.begin(), ilist.end(), 5), 5);
```

:::



:::details `equal_range()`

```c++
// 组合了lower_bound upper_bound 将他们的结果放在pair中
//用来表示查找一个元素，第一个出现的位置 最后一次出现的位置
pair<iterator,iterator> equal_range(begin, end, element)
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>

using namespace std;

int main()
{	

	list<int> ilist;
	for (size_t i = 1; i <= 9 ; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.push_back(i);
	}
		ilist.sort();
	for (list<int>::iterator it = ilist.begin(); it !=ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	pair<list<int>::iterator, list<int>::iterator> range;
	range = equal_range(ilist.begin(), ilist.end(),5);

	
	cout << "第一个5的位置" << distance(ilist.begin(), range.first);
	cout << "第二个5的位置" << distance(ilist.begin(), range.second);
	return 0;
}
```

:::



:::details `区间的比较equal()`

`equal()` 是用来判断两个容器之间的元素是不是相等的。

```c++
//判断A区间 和B区间容器元素是不是相等的
bool equal(aBegin,aEnd,bBegin);
bool equal(aBegin,aEnd,bBegin,op);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;


int main()
{
	vector<int> ivec;
	list<int> ilist;

	for (size_t i = 1; i <=7 ; i++)
	{
		ivec.push_back(i);
	}
	for (size_t i = 1; i <=7 ; i++)
	{
		ilist.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	if (equal(ivec.begin(), ivec.end(), ilist.begin())) {
		cout << "这两个区间相等" << endl;
	}
	else
	{
		cout << "这两个区间不相等" << endl;
	}
	cout << endl;


	return 0;
}
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

//两个数，同奇同偶则为TRUE
bool bothEvenOrOdd(int element1,int element2) {
	return element1 % 2 == element2 % 2;
}

int main()
{
	vector<int> ivec;
	list<int> ilist;

	for (size_t i = 1; i <=7 ; i++)
	{
		ivec.push_back(i);
	}
	for (size_t i = 3; i <=9; i++)
	{
		ilist.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	if (equal(ivec.begin(), ivec.end(), ilist.begin(),bothEvenOrOdd)) {
		cout << "这两个区间是奇数对应奇数，偶数对应偶数。" << endl;
	}
	else
	{
		cout << "不是的" << endl;
	}
	cout << endl;


	return 0;
}
```

:::



:::details `mismatch()`

```c++
// 找到两个容器不相等的元素那一部分
pair<Aiterator,Biterator> mismatch(Abegin,Aend,Bbegin);
pair<Aiterator,Biterator> mismatch(Abegin,Aend,Bbegin,op);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

//两个数，同奇同偶则为TRUE
bool bothEvenOrOdd(int element1,int element2) {
	return element1 % 2 == element2 % 2;
}

int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=6 ; i++)
	{
		ivec.push_back(i);
	}
	
	for (size_t i = 1; i <= 16; i*=2)
	{
		ilist.push_back(i);
	}
	ilist.push_back(3);


	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	for (list<int> ::iterator it = ilist.begin(); it !=  ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	pair<vector<int>::iterator, list<int>::iterator> values;
	values = mismatch(ivec.begin(), ivec.end(), ilist.begin());
	if (values.first == ivec.end()) { //考虑全是相等的情况
		cout << "没有找到不相等的数: no mismatch"<<endl;
	}
	else
	{
		cout << "first mismatch:" << *values.first << " second mismatch" <<
			*values.second << endl;
	}


	return 0;
}
```

​	

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;



int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=6 ; i++)
	{
		ivec.push_back(i);
	}
	
	for (size_t i = 1; i <= 16; i*=2)
	{
		ilist.push_back(i);
	}
	ilist.push_back(3);


	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	for (list<int> ::iterator it = ilist.begin(); it !=  ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	pair<vector<int>::iterator, list<int>::iterator> values;
	values = mismatch(ivec.begin(), ivec.end(), ilist.begin(),less_equal<int>());
	if (values.first == ivec.begin()) {
		cout << "没有找到第一个数大于第二个数的情况";
	}
	else
	{
		cout << "找到了first mismatch" << *values.first << ",two mismatch" << *values.second
			<< endl;
	}

	return 0;
}
```

:::



:::details `lexicographical_compare()`

检查第一个区间比第二个区间小的算法。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

void printCollection(const list<int>& ilist) {
	for (list<int>::const_iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}

int main()
{
	list<int> c1, c2, c3, c4;
	for (size_t i = 1; i <=5; i++)
	{
		c1.push_back(i);
	}
	c4 = c3 = c2 = c1;
	c1.push_back(7);
	c3.push_back(2);
	c3.push_back(0);
	c4.push_back(2);

	printCollection(c1);
	printCollection(c2);
	printCollection(c3);
	printCollection(c4);

	//前面的数都相等 7 > 2
	if (lexicographical_compare(c4.begin(), c4.end(), c1.begin(), c1.end())) {
		cout << "c4小于c1" << endl;
	}
	else
	{
		cout << "c4 和 c1 相等" << endl;
	}
	return 0;
}
```

:::

### 修改性算法

:::details `删除元素remove()&remove_if()`

这个删除方法只是逻辑删除，并不会真正的删除掉容器中的元素，只是做了元素覆盖操作。

```c
//返回新的逻辑终点 
iterator remove(begin,end,T element);
iterator remove_if(begin, end,op);
```

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

int main()
{
	list<int> ilist;
	for (size_t i = 1; i <= 6; i++)
	{
		ilist.push_front(i);
		ilist.push_back(i);
	}
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//删除容器元素3
	remove(ilist.begin(), ilist.end(), 3);
	//需要理解，此删除只是逻辑删除，底层是把元素前移了。元素总数还是不变的。
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	return 0;
}
```

我们对`remove()`返回值进行接收，遍历时以此返回值替换`vector.end()`,将能得到逻辑删除之后的元素列表。也正是我们想要的。

```c
	list<int>::iterator end;
	end = remove(ilist.begin(), ilist.end(), 3);
	for (list<int>::iterator it = ilist.begin(); it != end; it++) // 这样遍历，才会得到我们期望时是物理删除的结果。
	{
		cout << *it << " ";
	}
```

如果我们想知道，元素例如3，被删除了几次，可以这样处理：

```c
	....
	list<int>::iterator end;
	end = remove(ilist.begin(), ilist.end(), 3);
	cout << "一共删除了" <<distance(end, ilist.end()) << "个3.";
	cout << endl;
```

如果我们想做真正的删除，可以使用容器的`erase()` 方法。

```c
	...
	//删除容器元素3，配置erase()来做到物理删除
	list<int>::iterator end;
	end = remove(ilist.begin(), ilist.end(), 3);
	ilist.erase(end, ilist.end());
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}

// 简洁写法
ilist.erase(remove(ilist.begin(), ilist.end(), 3), ilist.end());
```

:::





:::details `复制元素copy()&copy_backward()`

```c++
//将A容器的数据拷贝到B容器中
void copy(iterator Abegin,iterator Aend,iterator Bbegin);

//从A容器的最后开始拷贝
void copy_backward(iterator Abegin,iterator Aend,Bend);

//实现复制过程中逆转元素次序
void reverse_copy(iterator Abegin,iterator Aend,iterator Bbegin);

```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

void printCollection(const list<int>& ilist) {
	for (list<int>::const_iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}

int main()
{
	list<int> ilist;
	for (size_t i = 0; i < 10; i++)
	{
		ilist.push_back(i);
	}
	for (list<int>::iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	vector<int> ivec(ilist.size() * 2);
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	copy(ilist.begin(), ilist.end(), ivec.begin());
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	copy_backward(ilist.begin(), ilist.end(), ivec.end());
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	return 0;
}
```

如果要复制的容器刚刚被创建出来，急着需要复制。可以使用`back_inserter()` 方法。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

void printCollection(const list<int>& ilist) {
	for (list<int>::const_iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}

int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	// back_inserter 针对容器新创建要复制的情况
	copy(ivec.begin(), ivec.end(), back_inserter(ilist));
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	return 0;
}
```

也可以把容器元素复制给一个流。比如复制给输入流，实现元素打印操作。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

void printCollection(const list<int>& ilist) {
	for (list<int>::const_iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}

int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	copy(ivec.begin(), ivec.end(), back_inserter(ilist));
	// 直接复制给一个输出流迭代器
	copy(ivec.begin(), ivec.end(), ostream_iterator<int>(cout, " "));
	return 0;
}
```

同样我们也可以使用逆向迭代器，让复制过去的元素，从后往前迁移复制。STL也提供了``reverse_copy()` 实现这种操作。

```c++
int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
    //逆向迭代器，实现复制过程中要逆转元素的顺序。
	copy(ivec.rbegin(), ivec.rend(), back_inserter(ilist));
    //也可以使用STL算法的reverse_copy()
    reverse_copy(ivec.begin(), ivec.end(), back_inserter(ilist));
    
	copy(ilist.begin(), ilist.end(), ostream_iterator<int>(cout, " "));
	return 0;
}
```

:::



:::details `遍历元素 for_each()`

可以让遍历的时候接受一个函数，比如`print()` 函数，接受遍历到的每一个元素，从而做打印每一个元素的逻辑。

```c
for_each(b,e,p);
```



```c
void print(int elem) {
	cout << elem << " ";
}
int main()
{	
	vector<int> ivec;
	for_each(ivec.begin(), ivec.end(), print);

	return 0;
}
```

还可以写成`Lamba` 的形式。

```c
	
class Student {
	
    // 类想直接输出，需要定义类的友元方法 重载 << 运算符。
	friend ostream& operator<<(ostream& cout,Student& item){
		cout << "Student(id = " << item.id << ",name=" << item.name << ",age=" << item.age << ")" << endl;
		return cout;
	}
}
int main(){
	for_each(vec.begin(), vec.end(), [](Student item) {
		cout << item;
	});
}
```



我们还可以通过一个函数对象，在遍历的同时，修改元素。比如让容器的每一个元素都加10。

```c
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

template<class T>
class AddValue {
private:
	T thevalue;
public:
	//对thevalue 进行初始化
	AddValue(const T& v) {
		this->thevalue = v;
	}
	//作为函数对象使用时，每次都会调用该方法，达到每一个元素加上thevalue的效果
	void operator()(T& elem) const {
		elem += thevalue;
	}
};
int main()
{	
	vector<int> ivec;
	for (size_t i = 1; i <=9; i++)
	{
		ivec.push_back(i);
	}
	for_each(ivec.begin(), ivec.end(), print);
	cout << endl;
	for_each(ivec.begin(), ivec.end(), AddValue<int>(10));
	for_each(ivec.begin(), ivec.end(), print);


	return 0;
}
```



我们还可以接收`for_each()` 的返回值，返回的是执行完全流程的函数对象，我们通过这种操作来得到容器的全部数据的平均值。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;

class MeanValue {
private:
	long num;
	long sum;
public:
	MeanValue():num(0),sum(0) {}
	void operator()(int element) { //实现对容器里面的元素求和 求数量
		num++;
		sum += element;
	}
	// 计算容器平均数
	double value() {
		return static_cast<double>(sum) / static_cast<double>(num);
	}
};
int main()
{	
	vector<int> ivec;
	for (size_t i = 1; i <=9; i++)
	{
		ivec.push_back(i);
	}

	MeanValue mv = 	for_each(ivec.begin(), ivec.end(), MeanValue());
	cout << "容器平均值：" << mv.value();

	return 0;
}
```

:::

:::details `变换元素transform()`

```c++
void transform(begin, end, begin, op);

//可以把A B容器经过op处理，再把处理元素放到C容器中，特殊情况 A B C 容器都是A容器。
void transform(Abegin, Aend, 
		Bbegin,
	    Cbegin,
		op);
```

对所有的容器元素进行取负符号操作，再放到这个容器中。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	transform(ivec.begin(), ivec.end(), ivec.begin(), negate<int>());
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	
	return 0;
}
```

同样，也支持放到另一个容器中。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

    // 因为容器没有初始化，又要复制元素所以使用back_inserter()包装处理
	transform(ivec.begin(), ivec.end(), back_inserter(ilist),bind2nd(multiplies<int>(),10));
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	return 0;
}
```

同样，他也支持变换的结果交给一个流迭代器。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	transform(ivec.begin(), ivec.end(), back_inserter(ilist),bind2nd(multiplies<int>(),10));
	transform(ilist.begin(), ilist.end(), ostream_iterator<int>(cout," "),negate<int>());
	cout << endl;
	return 0;
}
```

也可以把两个容器进行变换后，再把变换之后的元素放到一个容器中。

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//自己和自己× 之后放到自己那
	transform(ivec.begin(), ivec.end(), 
		ivec.begin(),
		ivec.begin(),
		multiplies<int>());
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	//自己和自己 加 放到 list中 (第一个加最后一个 第二个加倒数第二个）
	transform(ivec.begin(), ivec.end(),
		ivec.rbegin(),
		back_inserter(ilist),
		plus<int>()
	);
	cout << endl;
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}

	return 0;
}
```

:::



:::details `交换元素swap_ranges()`

```c++
//将A容器 的数和B容器进行交换
// 如果A容器小于B容器，则返回指向B容器没有交换的数的迭代器
iterator  swap_ranges(Abegin, Aend, Begin);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	vector<int> ivec;
	deque<int> ideq;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (size_t i = 11; i <= 23; i++)
	{
		ideq.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	for (deque<int>::iterator it = ideq.begin(); it != ideq.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	deque<int>::iterator pos;

	pos = swap_ranges(ivec.begin(), ivec.end(), ideq.begin());
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	for (deque<int>::iterator it = ideq.begin(); it != ideq.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	if (pos != ideq.end()) {
		cout << "第一个没有交换的数：" << *pos << endl;
	}

	return 0;
}
```

同样的他还可以自己和自己做交换。

```c++
//前面三个和后面三个交换
	swap_ranges(ideq.begin(), ideq.begin() + 3, ideq.rbegin());
	for (deque<int>::iterator it = ideq.begin(); it != ideq.end(); it++)
	{
		cout << *it << " ";
	}
```

:::



:::details `填充元素fill()&fill_n()`

```c++
// 将指定区间内元素填充成指定元素
void fill(begin, end,elment);

// 填充一定数量的元素
void fill_n(begin, count,element);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	list<string> slist;
	slist.push_back("hello");
	slist.push_back("hi");
	slist.push_back("good m morning");
	fill(slist.begin(), slist.end(),"hao");

	for (list<string>::iterator it = slist.begin(); it !=slist.end() ; it++)
	{
		cout << *it;
	}
	cout << endl;
	

	return 0;
}
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	list<string> slist;
	fill_n(back_inserter(slist), 9, "hello\n");
	for (list<string>::iterator it = slist.begin(); it != slist.end(); it++)
	{
		cout << *it;
	}

	return 0;
}
```

```c++
int main()
{
    //搭配输出流迭代器也是可以的
	fill_n(ostream_iterator<double>(cout, " "), 10, 7.7);
	return 0;
}
```

:::



:::details `generate&generate_n()`

```c++
//也是生成指定数量的随机数，但是可以使用函数对象更加灵活
void generate_n(begin,count,op);

void generate(begin,end,op);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	list<int> ilist;
	generate_n(back_inserter(ilist), 5, rand);
	generate_n(back_inserter(ilist), 5, rand);
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
}
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	list<int> ilist;
	generate_n(back_inserter(ilist), 5, rand);
	generate(ilist.begin(), ilist.end(), rand);
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
}

```

:::



:::details `更新元素replace()&replace_if()`

```c++
//把容器的某个元素值更新为新的值
void replace(begin,end, oldVal,newVal);

//符合谓词条件，则更新值
void replace_if(begin,end,op,newVal);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	list<int> ilist;
	for (size_t i = 2; i <=7 ; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 4; i <= 9; i++)
	{
		ilist.push_back(i);
	}
	for (list<int>::iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	replace(ilist.begin(), ilist.end(), 6,42);
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}	

```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	list<int> ilist;
	for (size_t i = 2; i <=7 ; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 4; i <= 9; i++)
	{
		ilist.push_back(i);
	}
	for (list<int>::iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//小于5的数替换成0
	replace_if(ilist.begin(),ilist.end(),bind2nd(less<int>(),5),0);
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}	

```

:::





:::details `去重元素unique()`

**基本数据类型去重**

```c++
// 容器去重，注意底层并不会直接删除去重元素，而是把重复的元素往后放置。返回指向第一个重复元素的迭代器
// 去重是说连续出现元素才交重复，满足索引连续条件。
iterator  unique(begin, end)
iterator  unique(begin, end，op)
```

```c++
int main()
{		
    //所以，我们去重要排序，让重复元素连续出现。
    vector<int> ivec;
	sort(ivec.begin(), ivec.end());
    // 再调用容器成员方法erase() 删除重复元素区间。
	ivec.erase(unique(ivec.begin(), ivec.end()),ivec.end());
}
```

```c++
int main()
{
	int source[] = { 1,4,4,6,1,2,2,3,1,6,6,5,7,5,4,4 };
	int sourceNum = sizeof(source) / sizeof(source[0]);

	list<int> ilist;
	copy(source, source + sourceNum, back_inserter(ilist));
	cout << endl;
	list<int>::iterator pos;
    // 接收函数对象。定义去重条件
	//ele1 >ele2 返回true 则把ele2删除 
	pos = unique(ilist.begin(), ilist.end(),greater<int>());
	cout << endl;
}
```

**类去重**

```c++

#include <iostream>
#include<vector>
#include<algorithm>
#include<functional>
#include<string>
using namespace std;
class Student {
public:

	int id;
	string name;
	int age;
	// 排序规则
	bool operator <(const Student& student) {
		if (this->id < student.id) {
			return true;
		}
		else
		{
			return false;
		}
	}
    // 去重规则
	bool operator ==(const Student & studnet) {
		if (
			this->id == studnet.id &&
			this->name == studnet.name &&
			this->age == studnet.age
			) {
			return true;
		}
		else
		{
			return false;
		}
	}
};

int main()
{
	vector<Student> ivec;
	sort(ivec.begin(), ivec.end(), compare);
	ivec.erase(unique(ivec.begin(), ivec.end(), equalFun), ivec.end());
	cout << endl;

}
```

同样也可以通过指定函数对象，来告知排序规则和去重规则。

**结构体去重**

```c++

#include <iostream>
#include<vector>
#include<algorithm>
#include<functional>

using namespace std;


struct Student
{
	int id;
	string name;
	int age;
};

void printStudent(Student& stu) {
	//打印
	cout << "学号：" << stu.id << "，姓名：" << stu.name << ",年龄：" << stu.age << endl;
}
bool compare(const Student& ele1, const Student& ele2) {
	if (ele1.id> ele2.id)
	{
		return true;
	}
	else
	{
		return false;
	}
}
bool equalFun(const Student& s1, const Student& s2) {
	if (
		s1.id == s2.id &&
		s1.name == s2.name &&
		s1.age == s2.age
		){
		return true;
	}
	else
	{
		return false;
	}


}


int main()
{	
	vector<Student> ivec;
	ivec.push_back(Student{1,"张三",22});
	ivec.push_back(Student{1,"张三",22});
	ivec.push_back(Student{2,"李四",22});
	ivec.push_back(Student{2,"李四",22});
	cout << "去重前---------\n";
	for_each(ivec.begin(), ivec.end(), [](Student item) {
		printStudent(item);
	});

	sort(ivec.begin(), ivec.end(), compare);
	ivec.erase(unique(ivec.begin(), ivec.end(), equalFun),ivec.end());
	cout << "去重后---------\n";
	for_each(ivec.begin(), ivec.end(), [](Student item) {
		printStudent(item);
		});


	cout << endl;
   
}


```

或者也可以，写到结构体中，重写`==`  和 `<` 运算符。

```c++
struct Student
{
	int id;
	string name;
	int age;

	bool operator<(Student& student) {
		if (id>student.id)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	bool operator==(Student& student) {
		if (
			id == student.id &&
			name == student.name &&
			age == student.age
			) {
			return true;
		}
		else
		{
			return false;
		}
	}
};
int main(){
    ...
    sort(ivec.begin(), ivec.end());
	ivec.erase(unique(ivec.begin(), ivec.end()),ivec.end());
    ...
}
```

:::



:::details `更新复制元素replace_copy()&replace_copy_if()`

```c++
// 替换容器A的元素后，拷贝到B容器。
void replace_copy(Abegin,Aend, Bbegin, oldVal, newVal);

void replace_copy_if(Abegin, Aend, Bbegin,op,newVal);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{

	list<int> ilist2;
	for (size_t i = 2; i <=6 ; i++)
	{
		ilist2.push_back(i);
	}
	for (size_t i = 4; i <= 9; i++)
	{
		ilist2.push_back(i);
	}
	for (list<int>::iterator it = ilist2.begin(); it != ilist2.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//等于5的数全部替换成55 再拷贝
	replace_copy(ilist2.begin(), ilist2.end(), ostream_iterator<int>(cout, " "), 5, 55);
	cout << endl;
	//小于5的数全部替换成 666再拷贝
	replace_copy_if(ilist2.begin(), ilist2.end(), ostream_iterator<int>(cout, " "),bind2nd(less<int>(),5),666);

}	

```

:::



:::details `删除复制元素remove_copy_if()&remove_copy()`

```c++

// 先移除A容器符合条件的元素之后，再复制元素到B容器中
void remove_copy_if(Abegin, Aend, Bbegin, op);

// 先移除A容器指定元素之后，再复制元素到B容器中
void remove_copy(Abegin, Aend, Bbegin, element);
```

```c++
#include <iostream>
#include <string>
#include<iomanip>
#include<bitset>
#include <algorithm>
#include <vector>
#include<fstream>
#include<set>
#include<list>
#include<functional>
using namespace std;



int main()
{
	list<int> ilist;
	for (size_t i = 1; i <=6 ; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.push_back(i);
	}
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	multiset<int> iset;
    // 把ilist所有小于4的元素全部删除了之后，再复制到iset中  set不能用back_inserter() 
	remove_copy_if(ilist.begin(), ilist.end(), inserter(iset,iset.begin()), bind2nd(less<int>(), 4));
	for (multiset<int>::iterator it = iset.begin(); it != iset.end(); it++)
	{
		cout << *it << " ";
	}


}

```

```c++
#include <iostream>
#include <string>
#include<iomanip>
#include<bitset>
#include <algorithm>
#include <vector>
#include<fstream>
#include<set>
#include<list>
#include<functional>
using namespace std;



int main()
{
	list<int> ilist;
	for (size_t i = 1; i <=6 ; i++)
	{
		ilist.push_back(i);
	}
	for (size_t i = 1; i <= 9; i++)
	{
		ilist.push_back(i);
	}
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	multiset<int> iset;
	remove_copy(ilist.begin(), ilist.end(), inserter(iset, iset.begin()), 6);
	for (multiset<int>::iterator it = iset.begin(); it != iset.end(); it++)
	{
		cout << *it << " ";
	}


}



```

:::



:::details `去重复制元素unique_copy()`

```c++

// 先把连续重复的元素去重后，再复制到一个新的容器中
void unique_copy(Abegin, Aend,Bbegin);
void unique_copy(Abegin, Aend,Bbegin,op);
```

```c++
#include <iostream>
#include <string>
#include<iomanip>
#include<bitset>
#include <algorithm>
#include <vector>
#include<fstream>
#include<set>
#include<list>
#include<functional>
using namespace std;



int main()
{
	int source[] = { 1,4,4,6,1,2,2,3,1,6,6,5,7,5,4,4 };
	int sourceNum = sizeof(source) / sizeof(source[0]);

	list<int> ilist;
	list<int>::iterator pos;
    // 4，4 ->2 2,2->2 6,6->6 4,4->4  
    unique_copy(source, source + sourceNum, back_inserter(ilist));
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	cout << endl;

}
```

```c++
#include <iostream>
#include <string>
#include<iomanip>
#include<bitset>
#include <algorithm>
#include <vector>
#include<fstream>
#include<set>
#include<list>
#include<functional>
using namespace std;

//前一个数加1 或者 减1 都等于 后一个数。则去重。
bool differenceOne(int element1,int element2) {
	return element1 + 1 == element2 || element1 - 1 == element2;
}

int main()
{
	int source[] = { 1,4,4,6,1,2,2,3,1,6,6,5,7,5,4,4 };
	int sourceNum = sizeof(source) / sizeof(source[0]);

	list<int> ilist;
	list<int>::iterator pos;
    unique_copy(source, source + sourceNum, back_inserter(ilist));
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	unique_copy(ilist.begin(), ilist.end(), ostream_iterator<int>(cout, " "), differenceOne);


}


```

:::

### 变序性算法

:::details `逆转元素reverse()`

```c++
void reverse(begin, end);
```

```c++
#include <iostream>
#include <string>
#include<iomanip>
#include<bitset>
#include <algorithm>
#include <vector>
#include<fstream>
#include<set>
#include<list>
#include<functional>
using namespace std;

int main()
{
	vector<int> ivec;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//123456789 ->987654321
	reverse(ivec.begin(), ivec.end());

	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}

```

:::



:::details `逆转复制元素reverse_copy()`

```c
//将容器A的元素反转之后，再复制到B容器中
void 	reverse_copy(Abegin, Aend,Bbegin);
```

```c++
#include <iostream>
#include <string>
#include<iomanip>
#include<bitset>
#include <algorithm>
#include <vector>
#include<fstream>
#include<set>
#include<list>
#include<functional>
using namespace std;

int main()
{
	vector<int> ivec;
	list<int> ilist;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	// 先反转再复制
	reverse_copy(ivec.begin(), ivec.end(),back_inserter(ilist));
	for (list<int>::iterator it = ilist.begin(); it != ilist.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
}
```

:::



:::details `元素重排random_shuffle()`

```c++
void random_shuffle(begin, end);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	vector<int> ivec;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	//随机重排
	random_shuffle(ivec.begin(), ivec.end());

	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
}	

```

:::



:::details `元素分区partition()&stable_partition`

```c++
iterator partition(begin, end, op);
iterator stable_partition(begin, end, op);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	vector<int> ivec;
	vector<int> ivec2;
	vector<int> ivec3;
	for (size_t i = 1; i <=9 ; i++)
	{
		ivec.push_back(i);
		ivec2.push_back(i);
		ivec3.push_back(i);
	}
	for (vector<int>::iterator it = ivec.begin(); it != ivec.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	//分区，把偶数的放一边 把奇数的放在一边
	vector<int>::iterator pos;
	pos = partition(ivec.begin(), ivec.end(), not1(bind2nd(modulus<int>(), 2)));

	for (vector<int>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//返回区分两个分区的位置元素迭代器 
	for (vector<int>::iterator it = ivec.begin(); it != pos; it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	for (vector<int>::iterator it = pos; it != ivec.end(); it++)
	{
		cout << *it << " ";
	}

}	

一样的用法
pos = stable_partition(ivec.begin(), ivec.end(), not1(bind2nd(modulus<int>(), 2)));
```

:::

### 排序算法



:::details `全排序sort()&stable_sort()`

```c++
// 容器排序 注意不适用于list容器
void sort(begin, end);
void sort(begin, end,op);
void stable_sort(begin,end,op);
void stable_sort(begin,end);
```

**基本数据类型排序**

```c++

#include <iostream>
#include<vector>
#include<algorithm>
#include<functional>

using namespace std;
int main()
{	

	vector<int> ivec;
	ivec.push_back(1);
	ivec.push_back(5);
	ivec.push_back(4);
	ivec.push_back(2);
	ivec.push_back(3);
	cout << "------------排序前"<<endl;
	for_each(ivec.begin(), ivec.end(), [](int ele) {
		cout << ele << " ";
	});
	cout << endl;
	sort(ivec.begin(), ivec.end());
	cout << "------------排序后,从小到大"<<endl;
	for_each(ivec.begin(), ivec.end(), [](int ele) {
		cout << ele << " ";
		});
	cout << endl;
	cout << "------------排序后,从大到小" << endl;
	sort(ivec.begin(), ivec.end(),greater<int>());
	for_each(ivec.begin(), ivec.end(), [](int ele) {
		cout << ele << " ";
		});

	cout << endl;
   
}

```

```c++

bool lessLength(const string& s1, const string& s2) {
	return s1.length() < s2.length();
}
int main()
{
	vector<string> svec;
	vector<string> svec2;
	svec.push_back("1xxx");
	svec.push_back("2x");
	svec.push_back("3x");
	svec.push_back("4x");
	svec.push_back("5xx");
	svec.push_back("6xxxx");
	svec.push_back("7xx");
	svec.push_back("8xxx");
	svec.push_back("9xx");
	svec.push_back("10xxx");
	svec.push_back("17");
	svec.push_back("11");
	svec.push_back("12");
	svec.push_back("13");
	svec.push_back("14xx");
	svec.push_back("15");
	svec.push_back("16");

	svec2 = svec;
	sort(svec.begin(), svec.end(), lessLength);
	// 稳定的排序，排序前的相对位置也会记录 比sort排序的更加精准
	stable_sort(svec2.begin(), svec2.end(), lessLength);
}

```

**类排序**

如果是`自己的的类`，需要排序。要么自己指定一个二元谓词。来告诉`sort()` 算法，你的元素排序比较规则是什么？

```c++
...
bool compareStudent(Student s1, Student s2) {
	if (s1.id < s2.id) {
		return true;
	}
	else
	{
		return false;
	}
}

int main()
{

	
	vector<Student> vec;
	....

	cout << "排序前------------------------\n";
	for_each(vec.begin(), vec.end(), [](Student item) {
		cout << item;
	});

	cout << "排序后------------------------\n";
	
	sort(vec.begin(), vec.end(), compareStudent);
	for_each(vec.begin(), vec.end(), [](Student item) {
		cout << item;
		});
	
	cout << endl;
   
}
```

要么，你可以在类中，对 `< `运算符进行方法重写。间接告知`sort()`算法，该类的排序规则。

```c++
class Student {
public:

	int id;
	.....
	
	bool operator <(const Student& student) { // 我的排序规则是按照ID大小来的
		if (this->id < student.id) {
			return true;
		}
		else
		{
		return false;
		}
	}
	
};
int main()
{
    
    sort(vec.begin(), vec.end());
}

```

**结构体排序**

```c++

#include <iostream>
#include<vector>
#include<algorithm>
#include<functional>

using namespace std;


struct Student
{
	int id;
	string name;
	int age;

	bool operator<(Student& student) {
		if (id>student.id)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

};

void printStudent(Student& stu) {
	//打印
	cout << "学号：" << stu.id << "，姓名：" << stu.name << ",年龄：" << stu.age << endl;
}
bool compare(const Student& ele1, const Student& ele2) {
	if (ele1.id> ele2.id)
	{
		return true;
	}
	else
	{
		return false;
	}
}


int main()
{	
	vector<Student> ivec;
	ivec.push_back(Student{1,"张三",26});
	ivec.push_back(Student{2,"张三",26});
	ivec.push_back(Student{4,"张三",26});
	ivec.push_back(Student{5,"李四",18});
	ivec.push_back(Student{3,"张三",26});
	cout << "排序前："<<endl;
	for (vector<Student>::iterator it = ivec.begin(); it != ivec.end(); it++)
	{
		Student item = *it;
		printStudent(item);
	}
	cout << endl;
	cout << "排序后："<<endl;
	sort(ivec.begin(), ivec.end());
	for (vector<Student>::iterator it = ivec.begin(); it!=ivec.end(); it++)
	{
		Student item = *it;
		printStudent(item);
	}
	cout << endl;
   
}
```

:::



:::details `局部排序partial_sort()`

```c++

//对容器进行局部排序  排序区间[begin,sort_end]
void partial_sort(begin,sort_end,end);
void partial_sort(begin,sort_end,end,p);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{

	deque<int> ideq;
	for (size_t i = 3; i <=7; i++)
	{
		ideq.push_back(i);
	}
	for (size_t i = 2; i <=6 ; i++)
	{
		ideq.push_back(i);
	}
	for (deque<int>::iterator it = ideq.begin(); it != ideq.end() ; it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	// 前面5个数进行排序
	partial_sort(ideq.begin(),ideq.begin()+5,ideq.end());
	for (deque<int>::iterator it = ideq.begin(); it != ideq.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;
	//前面5个数 从大到小排序 
	partial_sort(ideq.begin(), ideq.begin() + 5, ideq.end(), greater<int>());
	for (deque<int>::iterator it = ideq.begin(); it != ideq.end(); it++)
	{
		cout << *it << " ";
	}
}	

```

:::



:::details `局部排序复制partial_sort_copy()`

```c++
//给A容器排序后，复制到B容器中。如果容器不够大，就就用A填充满了就好
//如果容器B很大，就返回A最后一个元素的迭代器
interator partial_sort_copy(Abegin, Aend, Bbegin, Bend);
interator partial_sort_copy(Abegin, Aend, Bbegin, Bend,op);
```

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	deque<int> ideque;
	vector<int> ivec6(6);
	vector<int> ivec30(30);
	for (size_t i = 3; i <=7 ; i++)
	{
		ideque.push_back(i);
	}
	for (size_t i = 2; i <= 6; i++)
	{
		ideque.push_back(i);
	}
	for (size_t i = 1; i <= 5; i++)
	{
		ideque.push_back(i);
	}
	for (deque<int>::iterator it = ideque.begin(); it != ideque.end(); it++)
	{
		cout << *it << " ";
	}
	// B容器不够装情况
	cout << endl;
	partial_sort_copy(ideque.begin(), ideque.end(), ivec6.begin(), ivec6.end());
	copy(ivec6.begin(), ivec6.end(), ostream_iterator<int>(cout, " "));
	cout << endl;

	// B容器够装的情况
	vector<int>::iterator pos;
	pos = partial_sort_copy(ideque.begin(), ideque.end(), ivec30.begin(), ivec30.end(), greater<int>());
	copy(ivec30.begin(), pos, ostream_iterator<int>(cout, " "));
	cout << endl;


}	

```

:::



:::details `根据第n个元素排序nth_element`

```c++
#include <iostream>
#include <string>
#include<vector>
#include<algorithm>
#include<functional>
#include<set>
#include<list>
#include<deque>
using namespace std;
int main()
{
	deque<int> ideq;
	for (size_t i = 3; i <=7 ; i++)
	{
		ideq.push_back(i);
	}
	for (size_t i = 2; i <= 6; i++)
	{
		ideq.push_back(i);
	}
	for (size_t i = 1; i <= 5; i++)
	{
		ideq.push_back(i);
	}
	for (deque<int>::iterator it = ideq.begin(); it != ideq.end(); it++)
	{
		cout << *it << " ";
	}
	cout << endl;

	nth_element(ideq.begin(), ideq.begin() + 3, ideq.end());
	copy(ideq.begin(), ideq.begin() + 4, ostream_iterator<int>(cout, " "));

}	

```

:::





:::details `并集、交集、补集 set_union/set_intersection/set_difference`

```c
// A容器和B容器的并集，放到容器C保存
void set_union(Abegin, Aend, Bbegin, Bend, Cbegin)
    
   
// A容器和B容器的交集，放到容器C保存
void set_intersection(Abegin, Aend, Bbegin, Bend, Cbegin)
    
// 补集    
// A-B    
void set_difference(Abegin, Aend, Bbegin, Bend, Cbegin) 
 // B-A
void set_difference(Bbegin, Bend, Abegin, Aend, Cbegin)   
```

```c

#include <iostream>
#include<vector>
#include<algorithm>
#include<functional>

using namespace std;


class Student {
public:

	int id;
	string name;
	int age;
	Student() {
		id = 0;
		name = "";
		age = 0;
	}
	Student(int id, const string& name, int age):id(id), name(name), age(age) {}
	// 重载 == 用于判断集合关系的依据
	bool operator==(const Student& student) {
		if (
			this->name == student.name &&
			this->age == student.age
			) {
			return true;
		}
		else
		{
			return false;
		}
	}
	//重载 < 运算符 排序和判断集合关系的依据
	bool operator <(const Student& student) {
		if (this->id < student.id) {
			return true;
		}
		else
		{
			return false;
		}
	}



};
void print(const Student& item) {
	cout << "Student(id = " << item.id << ",name=" << item.name << ",age=" << item.age << ")";
	cout << endl;
}


int main()
{
	Student s1(1, "王乃醒", 25);
	Student s2(2, "黄洁莹", 25);
	Student s3(3, "赵六", 18);
	Student s4(4, "王五", 18);
	Student s5(5, "张三", 25);
	Student s6(6, "李四", 25);



	vector<Student> v1;
	vector<Student> v2;

	v1.push_back(s1);
	v1.push_back(s2);
	v1.push_back(s3);

	v2.push_back(s1);
	v2.push_back(s2);
	v2.push_back(s4);
	v2.push_back(s5);
	v2.push_back(s6);
	 
	// 注意，求并、差、交 必须排序！

	//求并集 set_union
	vector<Student> unionV(20);
	sort(v1.begin(), v1.end());
	sort(v2.begin(), v2.end());
	set_union(v1.begin(), v1.end(), v2.begin(), v2.end(), unionV.begin());



	//求交集 set_intersection
	vector<Student> intersectionV;
	set_intersection(v1.begin(), v1.end(), v2.begin(), v2.end(), back_inserter(intersectionV));



	
	//求差集 set_difference
	vector<Student> aDirfferenceb;
	vector<Student> bDirfferencea;

	set_difference(v1.begin(), v1.end(), v2.begin(), v2.end(), back_inserter(aDirfferenceb));
	set_difference(v2.begin(), v2.end(), v1.begin(), v1.end(), back_inserter(bDirfferencea));
	for_each(bDirfferencea.begin(), bDirfferencea.end(), print);


	
	cout << endl;
   
}

```

:::
