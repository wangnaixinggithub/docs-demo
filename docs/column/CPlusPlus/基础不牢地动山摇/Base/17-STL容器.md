# STL容器

## string

string是字符容器，内部维护了一个动态的字符数组。

与普通的字符数组相比，string容器有三个优点：使用的时候，不必考虑内存分配和释放的问题；动态管理内存（可扩展）提供了大量操作容器的API。缺点是效率略有降低，占用的资源也更多。



:::details `构造和析构`

静态常量成员`string::npos`为字符数组的最大长度（通常为unsigned int的最大值）

NBTS（null-terminated string）：C风格的字符串（以空字符0结束的字符串）。

**string**类有七个构造函数（C++11新增了两个）

```c
class string {
  public:
    	string(initializer_list<char> il) // 使用初始化列表来创建 string
        
    	string(const string &str); // 将string对象初始化为str（拷贝构造函数）。  
    	
        // 重载
        string(const string &str,size_t pos=0,size_t n=npos); // 将sring对象初始化为str从位置pos开始到结尾的字符（或从位置pos开始的n个字符）。
    
    	// C风格字符串转为 string
		string(const char *s); 
    	
    
    	// 重载
        string(const char *s,size_t n); // 将string对象初始化为s指向的地址后n字节的内容。
    
    
    template<class T> 
        string(T begin,T end); // 将string对象初始化为区间[begin,end]内的字符，其中begin和end的行为就像指针，用于指定位置，范围包括begin在内，但不包括end。

		string(size_t n,char c); // 创建一个由n个字符c组成的string对象。

}
```

我们使用无参构造函数来创建一个string类的对象。可以看到默认情况下，`string` 的容量是15个。当前存放字符个数为0.`string` 类的底层对 = 运算符进行了重载，可以把一个字符串常量直接赋值给s1.此时s1容器内部的容量会动态扩容。

```c++

		// 创建一个长度为0的string对象（默认构造函数）。
		string s1; 
		cout << "s1=" << s1 << endl;   // 将输出s1=
		cout << "s1.capacity()=" << s1.capacity() << endl; // 返回当前容量，可以存放字符的总数。
		cout << "s1.size()=" << s1.size() << endl; // 返回容器中字符的多小。
		cout << "容器动态数组的首地址：=" << (void*)s1.c_str() << endl;
    
    	string s1; 	
    
        // 将字符串常量 赋值给s1.
        s1 = "XXXXXXXXXXXXXXXXXXX";

        cout << "s1.capacity()=" << s1.capacity() << endl; // 返回当前容量，可以存放字符的总数。
        cout << "s1.size()=" << s1.size() << endl;  // 返回容器中数据的大小。
        cout << "容器动态数组的首地址=" << (void*)s1.c_str() << endl;
```

`string` 提供了C风格字符串 来构造 `string` 对象的构造方法，可以我们很轻松的把一个C风格字符串，转为C++的`string` 类。

```c
     const char* msg = "HelloWorld";
    char msg[] = "HelloWorld";
	string str(msg);
    string str("HelloWorld");
```

另外，他的重载方法，还支持我们第原来的字符串做**截断**操作。

```c

	// 4）string(const char* s, size_t n)：将string对象初始化为s指向的NBTS的前n个字符，即使超过了NBTS结尾。
	string s6("hello world", 5);
	cout << "s6=" << s6 << endl;       // 将输出s6=hello
	string s7("hello world", 50);
	cout << "s7=" << s7 << endl;       // 将输出s7=hello未知内容
```

拷贝构造

```c
// 拷贝构造
string s1("123456");
string s2(s1);

//重载
string s1("123456",0,3);
string s2(s1);
cout << s2; //123  
```

还有一个不常用的构造方法。

```c++
	string s1(10,'a');
	cout << s1; //aaaaaaaaaa
```

**C++11**新增的构造函数：

```c
	string s1{'A','B','C','D'};
```

:::



:::details `特性操作`

```java
class string {
    public:
 		size_t max_size() const;    // 返回string对象的最大长度string::npos，此函数意义不大。
		size_t capacity() const;     // 返回当前容量，可以存放字符的总数。
		size_t length() const;      // 返回容器中数据的大小（字符串语义）。
		size_t size() const;         // 返回容器中数据的大小（容器语义）。
		bool empty() const;     // 判断容器是否为空。
		void clear();             // 清空容器，清空后，size()将返回0。
		void shrink_to_fit();	      // 将容器的容量降到实际大小（需要重新分配内存）。
		void reserve( size_t size=0);  // 将容器的容量设置为至少size。
		void resize(size_t len,char c=0);  // 把容器的实际大小置为len，如果len<实际大小，会截断多出的部分；如果len>实际大小，就用字符c填充。resize()后，length()和size()将返回len。   
}
```

:::



:::details `字符操作`

```c++
class string 
{

    public:

    	char &operator[](size_t n); 
		const char &operator[](size_t n) const;  // 只读。
		char &at(size_t n); 
		const char &at(size_t n) const;          // 只读。
		//operator[]和at()返回容器中的第n个元素，但at()函数提供范围检查，当越界时会抛出out_of_range异常，
    	//operator[]不提供范围检查。
    
    
		const char *c_str() const; // 返回容器中动态数组的首地址，语义：寻找以null结尾的字符串。
		const char *data() const; // 返回容器中动态数组的首地址，语义：只关心容器中的数据。
		int copy(char *s, int n, int pos = 0) const; // 把当前容器中的内容，从pos开始的n个字节拷贝到s中，返回实际拷贝的数目。
    
}

```

:::



:::details `转换操作`

- 转为C风格字符串

```c++
    // char* => string
    char* cstr = const_cast<char*>("HelloWorld");
	string s1(cstr);
    
    //string => char*
    string s1("wangnaixing");
    char* cstr = const_cast<char*>( s1.c_str());
```

- 基本数据类型转string

```c++
//stirng.h 全局函数
string to_string (int val);
string to_string (long val);
string to_string (long long val);
string to_string (unsigned val);
string to_string (unsigned long val);
string to_string (unsigned long long val);
string to_string (float val);
string to_string (double val);
string to_string (long double val);
```

:::



:::details `赋值操作`

给已存在的容器赋值，将覆盖容器中原有的内容。

```c++
class string {
    public:
		string &operator=(const string &str); // 把容器str赋值给当前容器。
		string &assign(const char *s); // 将string对象赋值为s指向的NBTS。
		string &assign(const string &str); // 将string对象赋值为str。
		string &assign(const char *s,size_t n); // 将string对象赋值为s指向的地址后n字节的内容。
		string &assign(const string &str,size_t pos=0,size_t n=npos); // 将sring对象赋值为str从位置pos开始到结尾的字符（或从位置pos开始的n个字符）。

    	template<class T> string &assign(T begin,T end); // 将string对象赋值为区间[begin,end]内的字符。
		string &assign(size_t n,char c); // 将string对象赋值为由n个字符c。    	
}
```

:::



:::details `连接操作`

```c++
class string {
    public:
    	string &operator+=(const string &str); //把容器str连接到当前容器。
		string &append(const char *s); // 把指向s的NBTS连接到当前容器。
		string &append(const string &str); // 把容器str连接到当前容器。
		string &append(const char *s,size_t n); // 将s指向的地址后n字节的内容连接到当前容器。
		string &append(const string &str,size_t pos=0,size_t n=npos); // 将str从位置pos开始到结尾的字符（或从位置pos开始的n个字符）连接到当前容器。
		template<class T> string &append (T begin,T end); // 将区间[begin,end]内的字符连接到容器。
		string &append(size_t n,char c); // 将n个字符c连接到当前容器。   
}
```

:::



:::details `交换操作`

```c++
class string{
    public:
		void swap(string &str);    // 把当前容器与str交换。
		//如果数据量很小，交换的是动态数组中的内容，如果数据量比较大，交换的是动态数组的地址。
}

```

:::



:::details `截取操作`

```c
class string 
{
    public:
	  string substr(size_t pos = 0,size_t n = npos) const; // 返回pos开始的n个字节组成的子容器。
}
```

```c++
#include <iostream>
#include <string>
#include<iomanip>
#include<bitset>
using namespace std;

int main()
{
    //从C字节开始，一共3个字符构造的子容器 即C+
	string s1("HelloC++");
	cout << s1.substr(5, 3); //C++
	
}
```

:::





:::details `比较操作`

```c++
class string {
    public:
		bool operator==(const string &str1,const string &str2) const; // 比较两个字符串是否相等。
		int compare(const string &str) const; // 比较当前字符串和str1的大小。
		int compare(size_t pos, size_t n,const string &str) const; // 比较当前字符串从pos开始的n个字符组成的字符串与str的大小。
		int compare(size_t pos, size_t n,const string &str,size_t pos2,size_t n2)const; // 比较当前字符串从pos开始的n个字符组成的字符串与str中pos2开始的n2个字符组成的字符串的大小。

    	//以下几个函数用于和C风格字符串比较。
		int compare(const char *s) const; 
		int compare(size_t pos, size_t n,const char *s) const;
		int compare(size_t pos, size_t n,const char *s, size_t pos2) const;
		//compare()函数有异常，慎用    	
}
```

:::



:::details `查找操作`

```c++
class string {
    public:
		size_t find(const string& str, size_t pos = 0) const;
		size_t find(const char* s, size_t pos = 0) const;
		size_t find(const char* s, size_t pos, size_t n) const;
		size_t find(char c, size_t pos = 0) const;

		size_t rfind(const string& str, size_t pos = npos) const;
		size_t rfind(const char* s, size_t pos = npos) const;
		size_t rfind(const char* s, size_t pos, size_t n) const;
		size_t rfind(char c, size_t pos = npos) const;

		size_t find_first_of(const string& str, size_t pos = 0) const;
		size_t find_first_of(const char* s, size_t pos = 0) const;
		size_t find_first_of(const char* s, size_t pos, size_t n) const;
		size_t find_first_of(char c, size_t pos = 0) const;

		size_t find_last_of(const string& str, size_t pos = npos) const;
		size_t find_last_of(const char* s, size_t pos = npos) const;
		size_t find_last_of(const char* s, size_t pos, size_t n) const;
		size_t find_last_of(char c, size_t pos = npos) const;

		size_t find_first_not_of(const string& str, size_t pos = 0) const;
		size_t find_first_not_of(const char* s, size_t pos = 0) const;
		size_t find_first_not_of(const char* s, size_t pos, size_t n) const;
		size_t find_first_not_of(char c, size_t pos = 0) const;

		size_t find_last_not_of(const string& str, size_t pos = npos) const;
		size_t find_last_not_of(const char* s, size_t pos = npos) const;
		size_t find_last_not_of(const char* s, size_t pos, size_t n) const;
		size_t find_last_not_of(char c, size_t pos = npos) const;    	
}
```

通过`find()` 方法，我们可以得到查找到的字符串在主串的位置。 查不到字符串，则返回-1

```c++
	string s1("wangnaixing");
    size_t index = 	s1.find("g"); //3
    cout << index;
```

:::



:::details `替换操作`

```c++
class string 
{
	public:
    	string& replace(size_t pos, size_t len, const string& str);
		string& replace(size_t pos, size_t len, const string& str, size_t subpos, size_t sublen = npos);
		string& replace(size_t pos, size_t len, const char* s);
		string& replace(size_t pos, size_t len, const char* s, size_t n);
		string& replace(size_t pos, size_t len, size_t n, char c);
}
```

:::



:::details `插入和删除`

```c++
class string {
    public:
 		string& insert(size_t pos, const string& str);
		string& insert(size_t pos, const string& str, size_t subpos, size_t sublen = npos);
		string& insert(size_t pos, const char* s);
		string& insert(size_t pos, const char* s, size_t n);
		string& insert(size_t pos, size_t n, char c);
		string &erase(size_t pos = 0, size_t n = npos); // 删除pos开始的n个字符。   
}
```

:::

## 顺序容器

### vector

vector容器封装了动态数组。 包含头文件是 `#include<vector>`  vector类模板的声明

```c#
template<class T, class Alloc = allocator<T>>
class vector
{
private:
	T *start_; 
	T *finish_;
	T *end_;
	……
}
```

**分配器**

各种STL容器模板都接受一个可选的模板参数，该参数指定使用哪个分配器对象来管理内存

如果省略该模板参数的值，将默认使用`allocator<T>`，用new和delete分配和释放内存。





:::details `构造和析构`

`vector` 类有多个创建的方法，比如我们可以创建一个空的`vector`

```c++
class vector{
	public:
		vector(); // 创建一个空的vector容器。
}
```

```c++
	vector<int> v1;
	vector<int> v1 = vector<int>();
	cout << v1.empty() << endl;	
```

我们还可以使用统一的初始化列表来创建一个`vector`

```c++
class vector{
	public:
		vector(initializer_list<T> il); // 使用统一初始化列表。	
}
```

```c
vector<int> v1{1,2,3};    
vector<int> v1 = vector<int>{ 1,2,3 };
```

我们还可以通过一个已经存在的`vector` 来创建一个新的`vector`，拷贝构造函数。

```c++
class vector{
	public:
	vector(const vector<T>& v);  // 拷贝构造函数。
}
```

```c++
	vector<int> v1 = vector<int>{ 1,2,3 };
	vector<int> v2 = vector<int>(v1);
 	vector<int> v2(v1);
```

有的时候我们希望把一个`vector1`的一些元素放到`vector2` 中。这个时候就可以使用迭代器来创建`vector`

```c++
class vector {
	public:
		vector(Iterator first, Iterator last);
}
```

```c++
	vector<int> v1 = vector<int>{1,2,3,4};
	vector<int> v2 = vector<int>(v1.begin(),v1.end()-2);
	vector<int> v2(v1.begin(),v1.end()-2);
```

我们还可以在开始创建的时候就指定了`vector` 的初始大小。

```c++
class vector {
	public:
		explicit vector(const size_t n);  
}
```

```c++
	vector<int> v1 = vector<int>(10);
	cout << v1.size() << endl; //10
```

除了可以指定`vector` 的初始大小之外，我们还可以指定元素默认值。如果不指定的话默认采用泛型的默认值，比如这里的`vector<int>` 泛型是 `int` 则默认值就是0，通过可以指定默认值的构造函数，这个时候元素的初始值就是100了。

```c++
class vector {
	public:
	  vector(const size_t n, const T& value);
}
```

```c++
vector<int> v1 = vector<int>(10,100);
```

对象创建之后，最终都会被销毁，销毁`vector` 实例就会调用`vector` 函数了。 比如下面就演示了动态分配`vector` 指针的内存并最终销毁该内存。

```c++
class vector {
~vector() //释放vector对象指针占用的堆内存空间
}
```

```c++
	vector<int> * v1 = new vector<int>();
	printf("%p", v1);
	delete v1;
```

:::



:::details `特性操作`

```c++
class vector {
	size_t max_size() const;     // 返回容器的最大长度，此函数意义不大。
	size_t capacity() const;      // 返回容器的容量。
	size_t size() const;          // 返回容器的实际大小（已使用的空间）。
	bool empty() const;        // 判断容器是否为空。

	void clear();               // 清空容器。
	void reserve(size_t size);   // 将容器的容量设置为至少size。
	void shrink_to_fit();	       // 将容器的容量降到实际大小（需要重新分配内存）。
	void resize(size_t size);    // 把容器的实际大小置为size。
	void resize(size_t size,const T &value);  // 把容器的实际大小置为size，如果size<实际大小，会截断多出的部分；如果size>实际大小，就用value填充。

	T *data();            // 返回容器中动态数组的首地址。
	const T *data() const; // 返回容器中动态数组的首地址。    
}

```

对于基于数组实现的容器，他会有最大长度和容量的概念，比如说我们想知道这个容器存了多少个元素，一般都是用单词`size` 的，如果想知道容器能存多少个元素，一般是用`capacity` ,`capacity` 的值实际上就等于`vector`底层数组长度的值。

```c++
class vector { 
	public:
    	size_t capacity() const;      // 返回容器的容量。
		size_t size() const;          // 返回容器的实际大小（已使用的空间）。
}
```

```c++
	vector<int>  v1(10);
	v1.push_back(1);	
	cout << "v1容器最多能存多少个元素呢？" << v1.capacity() << endl;
	cout << "v1容器当前存储了多少个元素呢？" << v1.size()<<endl;
```

如果我们还关心底层数组的地址，可以通过 `data()` 函数获取到。

```c++
class vector {
	public:
		T *data();            // 返回容器中动态数组的首地址。
}
```

```c++
	vector<int>  v1(10);
	int* data = v1.data();
	printf("底层数组的地址 %p", data);
```

还有的时候我们需要判断这个`vector` 是不是一个空的`vector`。就可以通过`empty()` 来判断了。

```c++
class vector {
	public：
		bool empty() const;        // 判断容器是否为空。	
}
```

```c++
	vector<int> v1 = vector<int>();
	cout << v1.empty() << endl;
	v1.push_back(1);
	cout << v1.empty() << endl;
```

`empty()` 还可以结合`while` 循环来使用。比如依次清空`vector` 中的元素。

```c++
while( !v.empty() ) {
    cout << v.back() << endl;
    v.pop_back();
  }
```

把整个`vector` 进行一个清空，可以使用`clear()`

```c++
class vector {
	public:
		void clear();               // 清空容器。
}
```

```c++
	vector<int> v1(10); //有10个元素，都是元素的值等于0
	v1.clear();
	cout << v1.empty();
```

`vector`元素的容量是自动扩容的，底层扩容的机制是，把原来数组的元素拷贝到一个新的数组中去。只有当添加元素进来，已经超过了`vector.size()` 才会做添加操作。扩容默认是原来的vector的50%， 如果我们想让容量迅速扩大，可以使用`resize()` 方法。

```c++
class vector{
	public:
       // 把容器的实际大小置为size。
    void resize(size_t size); 
    // 重载，扩容空间用指定value 填充
	void resize(size_t size,const T &value);  
}
```

```c++
int main()
{
	vector<int> v1({ 1,2,3,4 });
	cout << "vector的容量为" << v1.capacity() << endl;
	//容量从4变成100
	v1.resize(100);
	cout << "vector的容量为" << v1.capacity() << endl;
	
}

```

```c++
int main()
{
	vector<int> v1({ 1,2,3,4 });
	cout << "vector的容量为" << v1.capacity() << endl;

	v1.resize(100, 5);
	cout << "vector的容量为" << v1.capacity() << endl;
	for_each(v1.begin(), v1.end(), [](int item) {

		cout << item << " ";
    });
}

```

:::



:::details `元素读取`

```c++
class vector {
	public:
		T &operator[](size_t n); 
		const T &operator[](size_t n) const;  //快速随机访问元素 只读。
		
    	T &at(size_t n); 
		const T &at(size_t n) const;          // 作用同[]重载， 只读。

		T &front();        // 第一个元素。
		const T &front();  // 第一个元素，只读。

		const T &back();  // 最后一个元素，只读。
		T &back();        // 最后一个元素。
}
```

`vector` 类对 运算符`[]` 进行了重载，因为`vector` 的底层是一个可变大小数组，重载之后`[]` 运算符和数组一样，可以通过下标快速随机访问元素。

```c++
class vector {
	public:
	    T &operator[](size_t n); 
		const T &operator[](size_t n) const;  //快速随机访问元素 只读。
}
```

```c++
	vector<int>  v1;
	v1.push_back(10);
	v1.push_back(20);
	v1.push_back(30);
	cout << "v1[0] = " << v1[0] << endl;
	cout << "v1[1] = " << v1[1] << endl;
	cout << "v1[2] = " << v1[2] << endl;
```

如果你不喜欢用重载的`[]` 运算符，`at()` 成员方法也可以满足你通过下标获取元素的需要。

```c++
class vector { 
	public:
	   T &at(size_t n); 
	   const T &at(size_t n) const;          // 作用同[]重载， 只读。	
}
```

```c++
	vector<int>  v1;
	v1.push_back(10);
	v1.push_back(20);
	v1.push_back(30);
	cout << "v1[0] = " << v1.at(0) << endl;
	cout << "v1[1] = " << v1.at(1) << endl;
	cout << "v1[2] = " << v1.at(2) << endl;
```

如果仅仅是想要获取`vector` 中的第一个元素或者最后一个元素的话，建议你可以试试使用 `front()` `back()` 方法。

```c++
class vector {
	public:
		T &front();        // 第一个元素。
		const T &front();  // 第一个元素，只读。

		const T &back();  // 最后一个元素，只读。
		T &back();        // 最后一个元素。
}
```

```c++
	vector<int>  v1;
    v1.push_back(10);
	v1.push_back(20);
	v1.push_back(30);
	cout << "v1[0] = " << v1.front() << endl;
	cout << "v1[1] = " << v1.at(1) << endl;
	cout << "v1[2] = " << v1.back() << endl;
```

:::



:::details `赋值操作`

```c++
class vector{
    public:
 		vector &operator=(const vector<T> &v);    // 把容器v赋值给当前容器。
		vector &operator=(initializer_list<T> il); // 用统一初始化列表给当前容器赋值。

		void assign(initializer_list<T> il);        // 使用统一初始化列表赋值。
		void assign(Iterator first, Iterator last);  // 用迭代器赋值。
		void assign(const size_t n, const T& value);  // 把n个value给容器赋值。   	
}
```

`vector` 类对运算符` =` 进行了重载，从而让`vector`实例之间可以进行赋值操作，即给已存在的容器v1赋值v2，将覆盖容器v1中原有的内容,全部替换乘v2值。

该`=` 还有一个重载方法，还可以让`vector` 实例直接接受一个初始化列表去完成赋值操作。

```c++
class vector{
	public:
		vector &operator=(const vector<T> &v);    // 把容器v赋值给当前容器。
		vector &operator=(initializer_list<T> il); // 用统一初始化列表给当前容器赋值。
}
```

```c++
	vector<int> v1 = { 1,2,3,4,5 };  // 使用统一初始化列表赋值。
	for (size_t i = 0; i < v1.size(); i++) 	cout << v1[i] << " ";

	cout << endl;

	vector<int> v2;
	v2 = v1;   // 把容器v1赋值给当前容器。
	for (size_t i = 0; i < v2.size(); i++) 	cout << v2[i] << " ";
	cout << endl;

```

如果你不喜欢使用重载的`=` 运算符，还可以使用`assign()` 来接受一个统一初始化列表赋值。

```c++
class vector {
	public:
		void assign(initializer_list<T> il);        // 使用统一初始化列表赋值。
		void assign(Iterator first, Iterator last);  // 用迭代器赋值。
		void assign(const size_t n, const T& value);  // 把n个value给容器赋值。   
}
```

```c++
	 vector<int> v3;
	v3.assign({ 1,2,3,4,5 }); //  用assign()函数给当前容器赋值，参数是统一初始化列表。
	for (size_t i = 0; i < v3.size(); i++) 	cout << v3[i] << " ";
	cout << endl;
```

该`assign()` 方法比较强的。能支持迭代器的赋值和指定元素初始化值、个数的的。呵呵嘿，是不是贼像构造方法。

```c++
   vector<int> v1 = { 1,2,3,4,5 };

	vector<int> v2;
	v2.assign(v1.begin(),v1.end()-2);

	for (size_t i = 0; i < v2.size(); i++)
	{
		cout << v2[i] << " ";
	}
```

```c++
	vector<int> v2;
	v2.assign(5,10);
	for (size_t i = 0; i < v2.size(); i++)
	{
		cout << v2[i] << " ";
	}
```

:::



:::details `交换`

```c++
class vector {
	public:
		void swap(vector<T> &v);    // 把当前容器与v交换。
}
```

还记得我们写过的传入引用，交换两个数的值吗？哈哈哈，想不到吧，`vector` 类也提供着这样的方法，可以交换两个vector容器之间存储的值。

```c++

	vector<int> v1 = { 1,2,3 };
	vector<int> v2 = { 4,5,6 };

	v1.swap(v2);

	for (int item : v1) {
		cout << item << " ";
	}
	cout << endl;


	for (int item : v2) {
		cout << item << " ";
	}
	cout << endl;
```

:::



:::details `比较`

```c
class vector 
{
    public:
 		bool operator == (const vector<T> & v) const;
		bool operator != (const vector<T> & v) const;   
}
```

`vector` 类对 `==` 运算符和 `!=` 运算符 进行了重载，让`vector` 实例之间的比较工作变得简单起来。

```c++
	vector<int> v1 = { 1,2,3 };
	vector<int> v2 = { 4,5,6 };

	cout << (v1 == v2); //0
	cout << (v1 != v2); //1
```

:::



:::details `插入和删除`

```c++
class vector {
    public:
 		 void push_back(const T& value);  // 在容器的尾部追加一个元素。
		
         void emplace_back(…);           // 在容器的尾部追加一个元素，…用于构造元素。C++11
		
        iterator insert(iterator pos, const T& value);  // 在指定位置插入一个元素，返回指向插入元素的迭代器。
		
        iterator emplace (iterator pos, …);  // 在指定位置插入一个元素，…用于构造元素，返回指向插入元素的迭代器。C++11

		iterator insert(iterator pos, iterator first, iterator last);  // 在指定位置插入一个区间的元素，返回指向第一个插入元素的迭代器。

		void pop_back();                      // 从容器尾部删除一个元素。
		
        iterator erase(iterator pos);             // 删除指定位置的元素，返回下一个有效的迭代器。

    	iterator erase(iterator first, iterator last); // 删除指定区间的元素，返回下一个有效的迭代器。   	
}
```

容器就是用来将多个基本数据类型或者自定义类型的数据保存起来的。所在往容器里面添加一个元素，删除一个元素的成员方法，会在实际开发中被大量使用到。如果我们想在`vector` 容器的尾部插入一个元素或者尾部删除一个元素。可以对应使用`push_back()` 和 `pop_back()` 来操作。

```c++
class vector {
	public:
		void push_back(const T& value);  // 在容器的尾部追加一个元素。
		void pop_back();                      // 从容器尾部删除一个元素。
	
}
```

```c++
	vector<int> v1;

	v1.push_back(10);
	v1.push_back(20);

	v1.pop_back();
	v1.pop_back();

	cout << v1.empty();
```

但注意，建议在`vector` 中 不要在中间插入或者删除元素。因为在一次插入删除操作之后，需要移动插入/删除位置之后的所有元素，来保存连续存储。而且添加一个元素，有时还可能需要额外分配存储空间。在这种情况下，每一个元素都必须移动到新的存储空间中。这种时候，建议换一个容器吧比如`list` `forward_list`。但是 `vector` 类也是提供了在指定位置插入/删除的API的。比如`insert()`  `erase()`.

```c++
class vector{
	public:
		  iterator insert(iterator pos, const T& value);  // 在指定位置插入一个元素，返回指向插入元素的迭代器。
    	  
          iterator insert(iterator pos, iterator first, iterator last);  // 在指定位置插入一个区间的元素，返回指向第一个插入元素的迭代器。
    
    		
          iterator erase(iterator pos);             // 删除指定位置的元素，返回下一个有效的迭代器。

    	   iterator erase(iterator first, iterator last); // 删除指定区间的元素，返回下一个有效的迭代器。   	
    
}
```

```c++
	vector<int> v1;
	v1.insert(v1.begin(), 1);
	v1.insert(v1.begin()+1, 2);
	v1.insert(v1.end(), 3);

	v1.erase(v1.end()-1);
	v1.erase(v1.end()-2);
	v1.erase(v1.begin());
	cout << v1.empty();
```

:::



:::details `遍历`

```c++
  class vector{
      public:
   		 iterator end(); // 返回一个指向当前vector起始元素的迭代器
 		 iterator begin();// 函数返回一个指向当前vector末尾元素的下一位置的迭代器.注意,如果你要访问末尾元素,需要先将此迭代器自减1.   	
  }
```

我们可以通过最原始的下标遍历。来访问`vector` 容器中每一个元素。如果是一个`vector`指针,嘿嘿 `at()` 方法就发挥作用了。

```c++
	vector<int> v1 = { 1,2,3,4,5 };
	for (size_t i = 0; i < v1.size(); i++)
	{
		cout << v1[i] << " ";
	}
```

```c++
 vector<int>* v1 = new vector<int>{ 1,2,3,4,5 };
	for (size_t i = 0; i < v1->size(); i++)
	{
	
		cout << v1->at(i) << endl;
	}
	delete v1;
```

还可以通过增强for循环进行遍历。

```c++
	vector<int> v1 =  vector<int>{ 1,2,3,4,5 };
	for (int item : v1) {
		cout << item;
	}
```

还有一种是迭代器的方式。

```c++
	vector<int> v1 =  vector<int>{ 1,2,3,4,5 };
	for (vector<int>::iterator it = v1.begin(); it != v1.end(); it++)
	{
		cout << *it << " ";
	}
```

**迭代器失效的问题**

resize()、reserve()、assign()、push_back()、pop_back()、insert()、erase()等函数会引起vector容器的动态数组发生变化，可能导致vector迭代器失效。



容器可以嵌套使用。

:::

### list

list容器封装了双链表。`包含头文件： #include<list>`

list类模板的声明：

```c++
template<class T, class Alloc = allocator<T>>
class list{
private:
	iterator head;
	iterator tail;
	……
}
```



:::details `构造/析构函数`

```c
class list{
    public:
		list();  // 创建一个空的list容器。
		list(initializer_list<T> il); // 使用统一初始化列表。
		list(const list<T>& l);  // 拷贝构造函数。
    
       // 用迭代器创建list容器。
		list(Iterator first, Iterator last); 
    
    	// 创建list容器，元素个数为n。
		explicit list(const size_t n);   
	
       // 创建list容器，元素个数为n，值均为value。  
       list(const size_t n, const T& value);      
}
```

析构函数`~list() `释放内存空间。

```c
#define _CRT_SECURE_NO_WARNINGS
#include <iostream>
#include<vector>
#include<list>
using  namespace std;

int main()
{
	// 1) list() 创建一个空的list容器
	list<int> l1;

	// cout << "li.capacity()=" << l1.capacity() << endl;  // 链表没有容量说法。
	cout << "li.size()=" << l1.size() << endl;


	// 2）list(initializer_list<T> il); // 使用统一初始化列表。
	list<int> l2({ 1,2,3,4,5,6,7,8,9,10 });
	//list<int> l2 = { 1,2,3,4,5,6,7,8,9,10 };
	//list<int> l2{ 1,2,3,4,5,6,7,8,9,10 };

	for (int item : l2)
		cout << item << " ";
	cout << endl;


	// 3）list(const list<T>& l);  // 拷贝构造函数。
	list<int> l3(l2);
	//list<int> l3 = l2;
	for (int item : l3)
		cout << item << " ";
	cout << endl;


	// 4）list(Iterator first, Iterator last);  // 用迭代器创建list容器。
	list<int> l4(l3.begin(), l3.end());

	for (int item : l4)
			cout << item << " ";
	cout << endl;
	

	vector<int> v1 = { 1,2,3,4,5,6,7,8,9,10 };     // 创建vector容器。
	list<int> l5(v1.begin() + 2, v1.end() - 3);    // 用vector容器的迭代器创建list容器。
	for (int value : l5) cout << value << " ";
	cout << endl;


	int a1[] = { 1,2,3,4,5,6,7,8,9,10 }; // 创建数组。
	list<int> l6(a1 + 2, a1 + 10 - 3); // 用数组的指针作为迭代器创建list容器。
	for (int value : l6) {
		cout << value << " ";
	}
	cout << endl;


	char str[] = "hello world";  // 定义C风格字符串。
	string s1(str + 1, str + 7); // 用C风格字符串创建string容器。
	for (auto value : s1) { // 遍历string容器。
		cout << value << " ";
	}
	cout << endl;
	cout << s1 << endl;   // 以字符串的方式显示string容器。
	

	vector<int> v2(l3.begin(), l3.end());  // 用list迭代器创建vector容器。

	for (auto value : v2)  // 遍历vector容器。
		cout << value << " ";
	cout << endl;

}
```

:::



:::details `特性操作`

```c++
class list{
    public:
 		size_t max_size() const;     // 返回容器的最大长度，此函数意义不大。
		size_t size() const;        // 返回容器的实际大小（已使用的空间）。
		bool empty() const;      // 判断容器是否为空。
		void clear();             // 清空容器。
		void resize(size_t size);   // 把容器的实际大小置为size。
		void resize(size_t size,const T &value);  // 把容器的实际大小置为size，如果size<实际大小，会截断多出的部分；如果size>实际大小，就用value填充。   	
}
```

:::



:::details `元素操作`

```c++
class list{
    public:
 		T &front();        // 第一个元素。
		const T &front();  // 第一个元素，只读。
		const T &back();  // 最后一个元素，只读。
		T &back();        // 最后一个元素。   
}
```

:::



:::details `赋值操作`

给已存在的容器赋值，将覆盖容器中原有的内容。

```c++
class list{
    public:
 		list &operator=(const list<T> &l);         // 把容器l赋值给当前容器。
		list &operator=(initializer_list<T> il);  // 用统一初始化列表给当前容器赋值。
		list assign(initializer_list<T> il);        // 使用统一初始化列表赋值。
		list assign(Iterator first, Iterator last);  // 用迭代器赋值。
		void assign(const size_t n, const T& value);  // 把n个value给容器赋值。   	
}
```

:::



:::details `交换、反转、排序、归并`

```c++
class list{
    public:
   	 // 把当前容器与l交换，交换的是链表结点的地址。
		void swap(list<T> &l);   
    
        //反转元素顺序 原来123 之后321
    	void reverse();
    
  		 // 对容器中的元素进行升序排序。
		void sort();           
    
    	// 对容器中的元素进行排序，排序的方法由_Pred决定（二元谓词函数）。
		void sort(_Pr2 _Pred);   
		
     // 采用归并法合并两个已排序的list容器，合并后的list容器仍是有序的。
    	void merge(list<T> &l); 
}
```

:::



:::details `比较操作`

```c++
class list<T>{
    public:
		bool operator == (const vector<T> & l) const;
		bool operator != (const vector<T> & l) const;
}
```

:::



:::details `插入和删除`

```c
class list<T>
{
    public:		
    // 在链表的头部插入一个元素。
    push_front(const T& value); 
    
     // 在链表的尾部追加一个元素。
	void push_back(const T& value); 
    
    //从链表尾部删除一个元素。
    void pop_back();       
    
    // 在指定位置插入一个元素，返回指向插入元素的迭代器。
	iterator insert(iterator pos, const T& value);  
    
    // 重载 插入n个value
    iterator insert(iterator pos, int n, const T& value);  
    
    // 重载 插入区间 适用于将另一个容器B直接插入容器A
   iterator insert(iterator Apos, iterator Bfirst, iterator Blast); 
    
     // 在链表的尾部追加一个元素，…用于构造元素。C++11
	void emplace_back(…);          

    // 在指定位置插入一个元素，…用于构造元素，返回指向插入元素的迭代器。C++11
	iterator emplace (iterator pos, …);  

    // 删除指定位置的元素，返回下一个有效的迭代器。    
	iterator erase(iterator pos);       
    
    
     // 重载 删除区间。返回下一个有效的迭代器。
	iterator erase(iterator first, iterator last);



    
	emplace_front(…);          // 在链表的头部插入一个元素，…用于构造元素。C++11
	splice(iterator pos, const vector<T> & l);	  // 把另一个链表连接到当前链表。
	splice(iterator pos, const vector<T> & l, iterator first, iterator last);	// 把另一个链表指定的区间连接到当前链表。
	splice(iterator pos, const vector<T> & l, iterator first);	// 把另一个链表从first开始的结点连接到当前链表。
	void remove(const T& value);	 // 删除链表中所有值等于value的元素。
	void remove_if(_Pr1 _Pred);    // 删除链表中满足条件的元素，参数_Pred是一元函数。
	void unique();                 // 删除链表中相邻的重复元素，只保留一个。
	void pop_front();              // 从链表头部删除一个元素。   	
}
```

如果我们需要从另一个容器A,复制一些元素过来到容器B,可以使用`insert()` 方法。

```c

int main()
{
	list<int> ilist({ 1,2,3,4,5 });
	list<int> ilist2({ 6,7,8,9 });
	list<int>::iterator ops;
	ops = ilist.insert(ilist.begin(), ilist2.begin(), ilist2.end());

	for (list<int>::iterator it = ilist.begin(); it != ilist.end() ; it++)
	{
		cout << *it << " ";
	}
	// ilist {6,7,8,9,1,2,3,4,5} 容器变化
	cout << endl;

	cout << *ops; // 返回指向复制位置的迭代器
}
```

删除一个元素可以使用`erase()` 方法，通过指向这个元素的迭代器进行删除，并返回指向删除元素的下一个元素的迭代器。

```c
int main()
{
	list<int> ilist({ 1,2,3,4,5 });
	list<int>::iterator ops;
	ops = find(ilist.begin(), ilist.end(), 4);
	ops = ilist.erase(ops); // 返回下一个有效的迭代器 这里是指向 5的迭代器

	cout << *ops;
}
```

:::



### deque

`deque` 代表是双端队列。



物理结构：

deque容器存储数据的空间是多段等长的连续空间构成，各段空间之间并不一定是连续的。

为了管理这些连续空间的分段，deque容器用一个数组存放着各分段的首地址。



通过建立数组，deque容器的分段的连续空间能实现整体连续的效果。

当deque容器在头部或尾部增加元素时，会申请一段新的连续空间，同时在数组中添加指向该空间的指针。



迭代器：

随机访问迭代器。



特点：

- 提高了在两端插入和删除元素的效率，扩展空间的时候，不需要拷贝以前的元素。

- 在中间插入和删除元素的效率比vector更糟糕。
- 随机访问的效率比vector容器略低。

各种操作，与vector容器相同。

```c
class deque<T>
{
	public:
	 void push_front(T item);
}
```





## 顺序容器适配器

#### stack

 栈，后进先出的数据结构。

栈是一种容器适配器，可以使用deque 、list、vector. 作为栈实现的底层容器。

```c
int main()
{
    //构造底层容器是队列的栈 默认规则容器
	stack<int, deque<int>> s1;
    
    // 构造底层容器是vector的栈
	stack<int, vector<int>> s2;
	
    //构造底层容器是list的栈
    stack<int, list<int>> s3;
}

```

:::details `新增和删除`

```c++
class stack<T,Container>{
	
    //元素入栈
    void push(T ele);
    
    //栈顶元素出栈
    void pop();
    
    //查看栈顶指针指向的栈顶元素
    void top(); 	
    
    //查看栈容量
    int size();
	
}
```

我们可以打印出元素出栈的情况。 

```c++
	int main()
	{
		stack<int,list<int>> s1;
		s1.push(1);
		s1.push(2);
		s1.push(3);
		s1.push(4);
		
		//元素出栈
		while (s1.size() != 0)
		{
			cout << s1.top() << " ";
			s1.pop();
		}

	}
```

:::

#### queue

queue容器的逻辑结构是队列，物理结构可以是数组或链表，主要用于多线程之间的数据共享。

数据结构：先进先出。

`queue` 是一种容器适配器，可以使用`deque` `list` 作为底层容器。默认是`list`

```c++
	int main()
	{
		queue<int,list<int>> v1;
		queue<int, deque<int>>v2;

	}
```

包含头文件： `#include<queue>`

queue类模板的声明：

```c++
template <class T, class _Container = deque<T>>
class queue{
	……
}
```

queue容器不支持迭代器。



:::details `插入和删除`

```c#
class queue<T,Containter>{
	public:
      // 元素队尾入队
      void push(T ele);
    
     // 队列个数
      int size();
    	
     // 队首指针指向的队首元素
      T front();
    
    // 返回队尾指针 指向的元素
      T back();
    
    // 元素队首出队
     void pop();
	    
}
```

:::





:::details `构造函数`

```c++
class queue{
	public:
		queue();  // 创建一个空的队列。
    	queue(const queue<T>& q);  // 拷贝构造函数。
   		~queue(); // 析构函数,释放内存空间。
}
```

:::



:::details `常用操作`

```c++
class queue
{
	public:
		void push(const T& value);  // 元素入队。	
		void emplace(…);           // 元素入队，…用于构造元素。C++11
		size_t size() const;          // 返回队列中元素的个数。
	    bool empty() const;        // 判断队列是否为空。
		T &front();                 // 返回队头元素。
		const T &front();           // 返回队头元素，只读。
		T &back();                 // 返回队尾元素。
		const T &back();           // 返回队头元素，只读。
		void pop();                // 出队，删除队头的元素。
}
```

```c++
#include <iostream>
#include <queue>
#include <deque>
#include <list>
using  namespace std;

class girl       // 超女类。
{
public:
	int m_bh;             // 编号。
	string m_name;  // 姓名。
	girl(const int& bh, const string& name) : m_bh(bh), m_name(name) {}
};

int main()
{
	// template <class T, class _Container = deque<T>>
	// class queue {
	//	 ……
	// }
	// 第一个模板参数T：元素的数据类型。
	// 第二个模板参数_Container：底层容器的类型，缺省是std::deque，可以用std::list，还可以用自定义的类模板。

	queue<girl, list<girl>> q;          // 物理结构为链表。
	//queue<girl, deque<girl>> q;    // 物理结构为数组。
	//queue<girl> q;                           // 物理结构为数组。
	//queue<girl, vector<girl>> q;    // 物理结构为vector，不可以。	

	q.push(girl(3, "西施"));   // 效率不高。
	q.emplace(8, "冰冰");     // 效率更高。
	q.push(girl(5, "幂幂"));
	q.push(girl(2, "西瓜"));

	while (q.empty() == false)
	{
		cout << "编号：" << q.front().m_bh << "，姓名：" << q.front().m_name << endl;
		q.pop();
	}
}
```

:::



:::details`其它操作`

```c++
class queue {
    public:
 		queue &operator=(const queue<T> &q);    // 赋值。
		void swap(queue<T> &q);    // 交换。
		bool operator == (const queue<T> & q) const; // 重载==操作符。
		bool operator != (const queue<T> & q) const; // 重载!=操作符   
}
```

:::



:::details `插入和删除`

```c++
class queue<T>{
    public:
     // 将元素插入到队列的前面
     void push_front(T element);
     // 将元素插入到队列的后面
     void push_back(T element);
    // 队头元素删除
     void pop_front();
    // 队尾元素删除
	 void pop_back();

}
```

```c++
int main()
{
	deque<int> d;
	d.push_front(5);
	d.push_front(4);
	d.push_front(3);
	d.push_front(2);
	d.push_front(1);
	// d  = {1,2,3,4,5}
}
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
	
	// d  = {5,4,3,2,1}	
}
```

:::

#### priority_queue

priority_queue 是一种自适应容器，底层容器可以使用`deque` `vector`

优先级队列相当于一个有权值的单向队列queue，在这个队列中，所有元素是按照优先级排列的。各种操作与queue容器相同。

```c
int main()
{
	priority_queue<int, deque<int>> priorityDeque1;
	priority_queue<int, vector<int>> priorityDeque2;
}
```

```c
class priority_queue
{
	public:
       // 优先级队列，最大值优先级，先出队的总是容器中最大的元素，队首指针指向的总是最大的元素
        int top();
    	int pop();
}
```

这种优先级队列，虽然和队列的操作基本相同，但是出队，输出栈顶指针指向的栈顶元素时，有优先级的区别，这就是优先级队列的特性。 

```c++
int main(){
	priority_queue<int> ideque;
	ideque.push(-100);
	ideque.push(100);
	ideque.push(500);
	while (!ideque.empty())
	{
		cout << ideque.top() << " ";
		ideque.pop();
	}

}
```

默认表示的时最大值队列，我们也可以修改成最小值队列。

```c++
	priority_queue<int> max; //最大值优先级队列
	priority_queue<int,deque<int>,greater<int>> min; // 最小值优先级队列
```



#### array

`array` 类表示的是一个静态数组。

物理结构：

在栈上分配内存，创建数组的时候，数组长度必须是常量，创建后的数组大小不可变。

```c++
template<class T, size_t size>

class array{

private:
	T elems_[size]; 
	……

};
```

迭代器:

随机访问迭代器。

特点:

部分场景中，比常规数组更方便（能用于模板），可以代替常规数组。



:::details `常用操作`

```c++
1）void fill(const T & val);     // 给数组填充值（清零）。
2）size_t size();               // 返回数组的大小。
3）bool empty() const;        // 无意义。
4）T &operator[](size_t n); 
5）const T &operator[](size_t n) const;  // 只读。
6）T &at(size_t n); 
7）const T &at(size_t n) const;          // 只读。
8）T *data();            // 返回数组的首地址。
9）const T *data() const; // 返回数组的首地址。
10）T &front();          // 第一个元素。
11）const T &front();    // 第一个元素，只读。
12）const T &back();    // 最后一个元素，只读。
13）T &back();        // 最后一个元素。

```

```c++
#include <iostream>
#include <array>
using  namespace std;

////void func(int arr[][6],int len)
//void func(int (* arr)[6], int len)
//{
//	for (int ii = 0; ii < len; ii++)
//	{
//		for (int jj = 0; jj < 6; jj++)
//			cout << arr[ii][jj] << " ";
//		cout << endl;
//	}
//}

//void func(const array < array<int, 5>, 10 >& arr)  
//{
//	for (int ii = 0; ii < arr.size(); ii++)
//	{
//		for (int jj = 0; jj < arr[ii].size(); jj++)
//			cout << arr[ii][jj] << " ";
//		cout << endl;
//	}
//}

template <typename T>
void func(const T& arr)
{
	for (int ii = 0; ii < arr.size(); ii++)
	{
		for (int jj = 0; jj < arr[ii].size(); jj++)
			cout << arr[ii][jj] << " ";
		cout << endl;
	}
}

int main()
{
	//int aa[11] = {1,2,3,4,5,6,7,8,9,10,11};         // 一维数组。
	//array<int, 10> aa = { 1,2,3,4,5,6,7,8,9,10 };         // 一维数组。
	//for (int ii = 0; ii < 10; ii++)            // 传统的方法。
	//	cout << aa[ii] << " ";
	//cout << endl;
	//
	//for (int ii = 0; ii < aa.size(); ii++)  // 利用array的size()方法。
	//	cout << aa[ii] << " ";
	//cout << endl;
	//
	//for (auto it= aa.begin(); it < aa.end(); it++)      // 使用迭代器。
	//	cout << *it << " ";
	//cout << endl;

	//for (auto val : aa)                           // 基于范围的for循环。
	//	cout << val << " ";
	//cout << endl;

	//int bb[10][6];
	//for (int ii = 0; ii < 10; ii++)  // 对二维数组赋值。
	//{
	//	for (int jj = 0; jj < 6; jj++)
	//		bb[ii][jj] = jj * 10 + ii;
	//}

	//func(bb,10);  // 把二维数组传给函数。

	array< array<int, 5>, 10 > bb;  // 二维数组，相当于int bb[10][5]。
	 
	for (int ii = 0; ii < bb.size(); ii++)  // 对二维数组赋值。
	{
		for (int jj = 0; jj < bb[ii].size(); jj++)
			bb[ii][jj] = jj * 10 + ii;
	}

	func(bb);  // 把二维数组传给函数。
}
```

:::







## 关系容器

### map 

:::details `pair键值对`

pair是类模板，一般用于表示key/value数据，其实现是结构体。

pair结构模板的定义如下：

```c++
template <class T1, class T2>
struct pair 
{ 
    T1 first;     // 第一个成员，一般表示key。
    T2 second;  // 第二个成员，一般表示value。
	pair();       // 默认构造函数。
	pair(const T1 &val1,const T2 &val2);   // 有两个参数的构造函数。
	pair(const pair<T1,T2> &p);           // 拷贝构造函数。
	void swap(pair<T1,T2> &p);           // 交换两个pair。
};
```

make_pair函数模板的定义如下：

```c++
template <class T1, class T2>
make_pair(const T1 &first,const T2 &second)
{
	return pair<T1,T2>(first, second);
}

```

示例：

```c++
#include <iostream>
using  namespace std;

template <class T1, class T2>
struct Pair
{
	T1 first;        // 第一个成员，一般表示key。
	T2 second;  // 第二个成员，一般表示value。
	Pair()  {
		cout << "调用了有默认的构造函数。\n";
	}
	Pair(const T1& val1, const T2& val2) :first(val1), second(val2)  {
		cout << "调用了有两个参数的构造函数。\n";
	}
	Pair(const Pair<T1, T2>& p) : first(p.first),second(p.second)  {
		cout << "调用了拷贝构造函数。\n";
	}
};

template <class T1, class T2>
Pair<T1, T2> make_Pair(const T1& first, const T2& second)
{
	// Pair<T1, T2> p(first, second);
	// return p;        // 返回局部对象。
	return Pair<T1, T2>(first, second);  // 返回临时对象。
}

int main()
{
	//pair<int, string> p0;
	//cout << "p0 first=" << p0.first << ",second=" << p0.second << endl;

	//pair<int, string> p1(1, "西施1");    // 两个参数的构造函数。
	//cout << "p1 first=" << p1.first << ",second=" << p1.second << endl;

	//pair<int, string> p2 = p1;             // 拷贝构造。
	//cout << "p2 first=" << p2.first << ",second=" << p2.second << endl;

	//pair<int, string> p3 = { 3, "西施3" };   // 两个参数的构造函数。
	//// pair<int, string> p3 { 3, "西施3" };   // 两个参数的构造函数，省略了等于号。
	//cout << "p3 first=" << p3.first << ",second=" << p3.second << endl;

	auto p4 = Pair<int, string>(4, "西施4");   // 匿名对象（显式调用构造函数）。
	cout << "p4 first=" << p4.first << ",second=" << p4.second << endl;

	auto p5 = make_Pair<int, string>(5, "西施5");   // make_pair()返回的临时对象。
	cout << "p5 first=" << p5.first << ",second=" << p5.second << endl;

	//pair<int, string> p6 = make_pair(6, "西施6");  // 慎用，让make_pair()函数自动推导，再调用拷贝构造，再隐式转换。
	//cout << "p6 first=" << p6.first << ",second=" << p6.second << endl;

	//auto p7 = make_pair(7, "西施7");    // 慎用，让make_pair()函数自动推导，再调用拷贝构造。
	//cout << "p7 first=" << p7.first << ",second=" << p7.second << endl;

	//p5.swap(p4);   // 交换两个pair。

	//cout << "p4 first=" << p4.first << ",second=" << p4.second << endl;
	//cout << "p5 first=" << p5.first << ",second=" << p5.second << endl;

	//struct st_girl
	//{
	//	string name;
	//	int   age;
	//	double height;
	//};
	//// 用pair存放结构体数据。
	//pair<int, st_girl> p = { 3,{"西施",23,48.6} };
	//cout << "p first=" << p.first << endl;
	//cout << "p second.name=" << p.second.name << endl;
	//cout << "p second.age=" << p.second.age << endl;
	//cout << "p second.height=" << p.second.height << endl;
}

```

:::

map 容器封装了红黑树（平衡二叉排序树），用于查找。

包含头文件： `#include<map>`

map容器的元素是pair键值对。

map类模板的声明：

```c++
template <class K, class V, class P = less<K>, class _Alloc = allocator<pair<const K, V >>>
class map : public _Tree<_Tmap_traits< K, V, P, _Alloc, false>> 
{
   	… 
}
```

- 第一个模板参数K：key的数据类型（pair.first）。

- 第二个模板参数V：value的数据类型（pair.second）。

- 第三个模板参数P：排序方法，缺省按key升序。

- 第四个模板参数_Alloc：分配器，缺省用new和delete。

map提供了双向迭代器。

二叉链表：   

```c++
struct BTNode                        
{                                  
   	pair<K,V> p;       // 键值对。      
	BTNode *parent;   // 父节点。   
	BTNode *lchirld;    // 左子树。 
	BTNode *rchild;    // 右子树。 
};                             
```

:::details `构造函数`

那么如何创建一个`map` 对象呢？

```c++
class map{
	public:
	 // 创建一个空的map容器
	map();  
	// 使用统一初始化列表
    map(initializer_list<pair<K,V>> il); 
    // 拷贝构造函数
    map(const map<K,V>& m); 
    // 用迭代器创建map容器。
    map(Iterator first, Iterator last);  
    // 移动构造函数（C++11标准）
    map(map<K,V>&& m);		
}
```

```c++
#include <iostream>
#include <map>
using  namespace std;

int main()
{
	// 1）map();  // 创建一个空的map容器。
	map<int, string> m1;

	// 2）map(initializer_list<pair<K, V>> il); // 使用统一初始化列表。
	map<int, string> m2( { { 8,"冰冰" }, { 3,"西施" }, { 1,"幂幂" }, { 7,"金莲" }, { 5,"西瓜" } } );
	// map<int, string> m2={ { 8,"冰冰" }, { 3,"西施" }, { 1,"幂幂" }, { 7,"金莲" }, { 5,"西瓜" } };
	// map<int, string> m2   { { 8,"冰冰" }, { 3,"西施" }, { 1,"幂幂" }, { 7,"金莲" }, { 5,"西瓜" } };
	for (auto& val : m2)
		cout << val.first << "," << val.second << "  ";
	cout << endl;

	// 3）map(const map<K, V>&m);  // 拷贝构造函数。
	map<int, string> m3 = m2;
	for (auto& val : m3)
		cout << val.first << "," << val.second << "  ";
	cout << endl;

	// 4）map(Iterator first, Iterator last);  // 用迭代器创建map容器。
	auto first = m3.begin();  first++;
	auto last = m3.end();  last--;
	map<int, string> m4(first,last);
	for (auto& val : m4)
		cout << val.first << "," << val.second << "  ";
	cout << endl;
	
	// 5）map(map<K, V> && m);  // 移动构造函数（C++11标准）。
}
```

:::



:::details `特性操作`

map`特性方法`。比如判断这个容器是否为空，这个容器的大小，清空容器。

```c++
class map{
	public:
    	// 返回容器的实际大小（已使用的空间）。
		size_t size() const;    
    
        // 判断容器是否为空。
   		bool empty() const;  
    	
    	// 清空容器。
    	void clear();    
}
```

:::



:::details `元素操作`

那么如何对容器的`元素进行访问`呢？

```c++
class map {
	public:
		V &operator[](K key);             // 用给定的key访问元素。
    	const V &operator[](K key) const;  // 用给定的key访问元素，只读。
    	V &at(K key);                     // 用给定的key访问元素。
   		const V &at(K key) const;         // 用给定的key访问元素，只读。
}
```

注意：

1）[ ]运算符：如果指定键不存在，会向容器中添加新的键值对；如果指定键不存在，则读取或修改容器中指定键的值。

2）at()成员函数：如果指定键不存在，不会向容器中添加新的键值对，而是直接抛出out_of_range 异常。

```c++
#include <iostream>
#include <map>
using  namespace std;

int main()
{
	map<string, string> m( { { "08","冰冰" }, { "03","西施" }, { "01","幂幂" }, { "07","金莲" }, { "05","西瓜" } } );
	
	cout << "m[08]=" << m["08"] << endl;     // 显示key为08的元素的value。
	cout << "m[09]=" << m["09"] << endl;    // 显示key为09的元素的value。key为09的元素不存在，将添加新的键值对。
	m["07"] = "花花";                                          // 把key为07的元素的value修改为花花。
	m["12"] = "小乔";                                          // 将添加新的键值对。

	for (auto& val : m)
		cout << val.first << "," << val.second << "  ";
	cout << endl;
}
```

:::



:::details `赋值操作`

如果给`已经存在的元素赋值`呢？

```c++
class map{
	public:
		map<K,V> &operator=(const map<K,V>& m);         // 把容器m赋值给当前容器。
		map<K,V> &operator=(initializer_list<pair<K,V>> il);  // 用统一初始化列表给当前容器赋值。

}
```

给已存在的容器赋值，将覆盖容器中原有的内容。

:::



:::details `交换操作`

如何对两个 `map 进行交换`操作呢？

```c++
class map{
	public:
		void swap(map<K,V>& m);    // 把当前容器与m交换。
}
```

交换的是树的根结点。

:::



:::details `比较操作`

如何`比较`两个map呢？

```c++
class map{
	public:
		bool operator == (const map<K,V>& m) const;
		bool operator != (const map<K,V>& m) const;
}
```

:::



:::details `查找操作`

map还提供了一些**查找**操作的方法，

```c++
class map{
	public:
    	//查找键值为key的键值对 在map容器中查找键值为key的键值对，如果成功找到，则返回指向该键值对的迭代器；失败返回end()。
		iterator find(const K &key); 
    	const_iterator find(const K &key) const;  // 只读。
}
```

```c++
class map{
	public:
		//在map容器中查找第一个键值>=key的键值对，成功返回迭代器；失败返回end()。
		iterator lower_bound(const K &key); 
		const_iterator lower_bound(const K &key) const;  // 只读。
}
```

```c++
class map{
	public:
    	//在map容器中查找第一个键值>key的键值对，成功返回迭代器；失败返回end()。
		iterator upper_bound(const K &key); 
		const_iterator upper_bound(const K &key) const;  // 只读。
}
```

```c++
class map{
	public:
    	//统计map容器中键值为key的键值对的个数。
		size_t count(const K &key) const;
}
```

```c++
#include <iostream>
#include <map>
using  namespace std;

int main()
{
	map<string, string> m( { { "08","冰冰" }, { "03","西施" }, { "01","幂幂" }, { "07","金莲" }, { "05","西瓜" } } );

	for (auto& val : m)
		cout << val.first << "," << val.second << "  ";
	cout << endl;
	
	// 在map容器中查找键值为key的键值对，如果成功找到，则返回指向该键值对的迭代器；失败返回end()。
	auto it1 = m.find("05");
	if (it1 != m.end())
		cout << "查找成功：" << it1->first << "," << it1->second << endl;
	else
		cout << "查找失败。\n";

	// 在map容器中查找第一个键值 >= key的键值对，成功返回迭代器；失败返回end()。
	auto it2 = m.lower_bound("05");
	if (it2 != m.end())
		cout << "查找成功：" << it2->first << "," << it2->second << endl;
	else
		cout << "查找失败。\n";

	//	在map容器中查找第一个键值 > key的键值对，成功返回迭代器；失败返回end()。
	auto it3 = m.upper_bound("05");
	if (it3 != m.end())
		cout << "查找成功：" << it3->first << "," << it3->second << endl;
	else
		cout << "查找失败。\n";

	//	统计map容器中键值为key的键值对的个数。
	cout << "count(05)=" << m.count("05") << endl;   // 返回1。
	cout << "count(06)=" << m.count("06") << endl;   // 返回0。
}
```

:::



:::details `插入和删除`

如果我们想要`插入或者删除元素` map中的元素呢？

```c++
class map {
	public:
		void insert(initializer_list<pair<K,V>> il);  // 用统一初始化列表在容器中插入多个元素。
    	
    	pair<iterator,bool> insert(const pair<K,V> &value);  // 在容器中插入一个元素，返回值pair：first是已插入元素的迭代器，second是插入结果。
    
    	void insert(iterator first,iterator last);  // 用迭代器插入一个区间的元素。
    
    
    	pair<iterator,bool> emplace (...);  // 将创建新键值对所需的数据作为参数直接传入，map容器将直接构造元素。返回值pair：first是已插入元素的迭代器，second是插入结果。
    
    例：mm.emplace(piecewise_construct, forward_as_tuple(8), forward_as_tuple("冰冰", 18));
    
    
    iterator emplace_hint (const_iterator pos,...); //同上，第一个参数提示插入位置，该参数只有参考意义，如果提示的位置是正确的，对性能有提升，如果提示的位置不正确，性能反而略有下降，但是，插入是否成功与该参数元关。该参数常用end()和begin()。成功返回新插入元素的迭代器；如果元素已经存在，则插入失败，返回现有元素的迭代器。
    
    
    size_t erase(const K & key);  // 从容器中删除指定key的元素，返回已删除元素的个数。
    
    
    iterator erase(iterator pos);  // 用迭代器删除元素，返回下一个有效的迭代器。
    
    
    iterator erase(iterator first,iterator last);  // 用迭代器删除一个区间的元素，返回下一个有效的迭代器。
    
}
```

```c++
#include <iostream>
#include <map>
using  namespace std;

class CGirl        // 超女类。
{
public:
	string m_name;   // 超女姓名。
	int      m_age;       // 超女年龄。

	/*CGirl() : m_age(0) {
		cout << "默认构造函数。\n";
	}*/
	CGirl(const string name, const int age) : m_name(name), m_age(age) {
		cout << "两个参数的构造函数。\n";
	}
	CGirl(const CGirl& g) : m_name(g.m_name), m_age(g.m_age) {
		cout << "拷贝构造函数。\n";
	}
};

int main()
{
	map<int, CGirl> mm;
	mm.insert(pair<int, CGirl>(8, CGirl("冰冰", 18)));                // 一次构造函数，两次拷贝构造函数。
	mm.insert(make_pair<int, CGirl>(8, CGirl("冰冰", 18)));     // 一次构造函数，两次拷贝构造函数。
	mm.emplace(pair<int, CGirl>(8, CGirl("冰冰", 18)));                // 一次构造函数，两次拷贝构造函数。
	mm.emplace(make_pair<int, CGirl>(8, CGirl("冰冰", 18)));     // 一次构造函数，两次拷贝构造函数。
	mm.emplace(8, CGirl("冰冰", 18));                                             // 一次构造函数，一次拷贝构造函数。
	mm.emplace(8, "冰冰", 18);                                                        // 错误。
	mm.emplace(piecewise_construct, forward_as_tuple(8), forward_as_tuple("冰冰", 18));  // 一次构造函数。

	for (const auto& val : mm) {
		cout << val.first << "," << val.second.m_name << "," << val.second.m_name << "  ";
		cout << endl;
	}
	return 0;


}
```

:::





### multimap

底层是红黑树

multimap和map的区别在：multimap允许关键字重复，而map不允许重复。

各种操作与map容器相同。

### set

底层是红黑树。

set和map的区别在：map中存储的是键值对，而set只保存关键字。

multiset和set的区别在：multiset允许关键字重复，而set不允许重复。

各种操作与map容器相同。



### multiset



### unordered_map

底层是哈希表。

unordered_multimap和unordered_map的区别在：unordered_multimap允许关键字重复，而unordered_map不允许重复。

各种操作与unordered_map容器相同。





### unordered_multimap





### unordered_set

底层是哈希表。

unordered_set和unordered_map的区别在：unordered_map中存储的是键值对，而unordered_set只保存关键字。

unordered_multiset和unordered_set的区别在：unordered_multiset允许关键字重复，而unordered_set不允许重复。

各种操作与unordered_map容器相同。





### unordered_multiset



## 链表容器



### forward_list

`forward_list`类表示单链表。



物理结构：

单链表



迭代器：

正向迭代器。



特点：

比双链表少了一个指针，可节省一丢丢内存，减少了两次对指针的赋值操作。

如果单链表能满足业务需求，建议使用单链表而不是双链表。



各种操作：

与list容器相同。













## 迭代器

迭代器是访问容器中元素的通用方法。如果使用迭代器，不同的容器，访问元素的方法是相同的。



迭代器支持的基本操作：赋值（=）、解引用（*）、比较（==和!=）、从左向右遍历（++）。



一般情况下，迭代器遍历元素是采用指针和移动指针的方法。



:::details `迭代器分类`

**正向迭代器**

只能使用++运算符从左向右遍历容器，每次沿容器向右移动一个元素。

```c++
  // 正向迭代器。
容器名<元素类型>::iterator 迭代器名;   

 // 常正向迭代器。
容器名<元素类型>::const_iterator 迭代器名;

//中间元素的迭代器
容器名<元素类型>::iterator mid = 容器对象.begin() + 容器对象.size() / 2;
```

相关的成员函数：

```c++
iterator begin();
const_iterator begin();
const_iterator cbegin();  // 配合auto使用。
iterator end();
const_iterator end();
const_iterator cend();
```

**双向迭代器**

具备正向迭代器的功能，还可以反向（从右到左）遍历容器（也是用++），不管是正向还是反向遍历，都可以用`--`让迭代器后退一个元素。

```c++
容器名<元素类型>:: reverse_iterator 迭代器名;        // 反向迭代器。
容器名<元素类型>:: const_reverse_iterator 迭代器名;  // 常反向迭代器。
```

相关的成员函数：

```c++
reverse_iterator rbegin();
const_reverse_iterator crbegin();
reverse_iterator rend();
const_reverse_iterator crend();
```

**随机访问迭代器**

具备双向迭代器的功能，还支持以下操作：

- 用于比较两个迭代器相对位置的关系运算（<、<=、>、>=）。
- 迭代器和一个整数值的加减法运算（+、+=、-、-=）。
- 支持下标运算（iter[n]）。

数组的指针是纯天然的随机访问迭代器。



**输入和输出迭代器**

这两种迭代器比较特殊，它们不是把容器当做操作对象，而是把输入/输出流作为操作对象。

:::



:::details `迭代器范围`

```c

//指向容器第一个元素的迭代器 
容器对象.begin()/first

// 指向容器最后一个元素的下一个位置的迭代器 
容器对象.end()/last

//中间元素的迭代器 仅仅对 vector deque 有效
容器名<元素类型>::iterator mid = 容器对象.begin() + 容器对象.size() / 2;
```

迭代器就是指针，所以我们可以使用指针，使用容器的迭代器方法，给容器创建并初始化。

```c++
int main(){
	 char* msg[] = {
		 const_cast<char*>("wangnaixing"),
		 const_cast<char*>("helloWorld"),
		 const_cast<char*>("zhangshan"),
		 const_cast<char*>("lisi"),
		 const_cast<char*>("wangwu")
	 };
	 size_t msg_size = sizeof(msg) / sizeof(char*);

	 list<string> word(msg, msg+msg_size);

	 cout << word.size();


}
```

:::



:::details `迭代器操作`



**通用操作**

```c++
*iter // 解引用，得到迭代器指向的值
    
++iter // 迭代器下移
    
--iter // 上移

iter1 == iter2 // 判断是不是相等的

iter1 != iter2 // 不等
```

如果是`vector`  `deque` 的话，支持的额外操作有

```
iter + n

iter - n

iter1 > iter2

iter1 >= iter2

iter1 < iter2

iter1 <= iter2
```

**遍历操作**

```c++

// while 循环遍历
int main(){
	vector<int> v1({1,2,3,4,5});
	vector<int>::iterator begin = v1.begin();
	vector<int>::iterator end = v1.end();
	while (begin != end)
	{
		cout << *begin << " ";
		begin++;
	}

}

//for循环遍历
	for (vector<int>::iterator it = v1.begin(); it != v1.end() ; it++)
	{
		cout << *begin << " ";
	}
```

:::



:::details `容器支持相互嵌套`

```c++
#include <iostream>
#include<vector>
using  namespace std;


int main()
{
	vector <vector<int>> vv; //不同的容器也可以的！
	vector<int> v;

	v = { 1,2,3,4,5 };
	vv.push_back(v);

	v = { 11,12,13,14,15 };
	vv.push_back(v);

	for (size_t i = 0; i < vv.size(); i++)
	{
		for (size_t j = 0;  j < vv[i].size();  j++)
		{
			cout << vv[i][j]<<" ";
		}
		cout << endl;

	}

}
```

:::
