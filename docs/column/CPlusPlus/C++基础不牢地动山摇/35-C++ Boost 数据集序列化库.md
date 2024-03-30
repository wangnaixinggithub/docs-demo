# C++ Boost 数据集序列化库

Boost库提供了一组通用的数据序列化和反序列化库，包括archive、text_oarchive、text_iarchive、xml_oarchive、xml_iarchive等。可用于许多数据类型的持久化和传输。使用这些库，我们可以轻松地将各种数据类型序列化到文件或流中，并从文件或流中反序列化数据。

##  针对文本的序列化

```c
#include <iostream>
#include <fstream>

#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>

#include <boost/archive/xml_oarchive.hpp>
#include <boost/archive/xml_iarchive.hpp>

void txt_save(std::string path, std::string save_string)
{
	std::ofstream ptr(path, std::ios::in);
	boost::archive::text_oarchive archive(ptr);

	std::string string = save_string;
	archive << string;
}

std::string txt_load(std::string path)
{
	std::ifstream ptr(path);
	boost::archive::text_iarchive iarchive(ptr);
	std::string string;

	iarchive >> string;
	return string;
}

int main(int argc, char* argv[])
{
	// 文本格式序列化与反序列化
	std::string save = "hello lyshark \n";
	txt_save("c://txt_save.txt", save);

	std::string text_load = txt_load("c://txt_save.txt");
	std::cout << "输出字符串: " << text_load << std::endl;

	system("pause");
	return 0;
}

```

## 针对数组的序列化

针对数组的序列化是一种将数组数据结构进行持久化和传输的序列化技术，它可以将数组中的数据转化为二进制流，使得其可以被传输和存储。在实际开发中，我们经常需要进行数组的序列化操作，以便在需要时可以恢复出该数组的数据。Boost库中提供了一组非常方便的序列化工具，可以轻松地将数组从内存中打包创建成字符串，反序列化则是反之。



在本节中，我们将重点介绍Boost库中针对数组的序列化相关概念和用法，包括如何使用Boost.Serialization进行数组序列化和反序列化操作、如何定义自定义数组序列化函数、如何处理多维数组以及如何进行特定数据类型的序列化等。通过本节的学习，读者可掌握Boost库中针对数组的序列化技术的实际应用，提高C++程序开发能力。

```c
#include <iostream>
#include <fstream>
#include <vector>

#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>
#include <boost/serialization/vector.hpp>

void array_save(std::string path, int* my_array, int count)
{
	std::ofstream ptr(path);
	boost::archive::text_oarchive archive(ptr);

	std::vector<int> vect(my_array, my_array + count);
	archive& BOOST_SERIALIZATION_NVP(vect);
}

void array_load(std::string path)
{
	std::ifstream ptr(path);
	boost::archive::text_iarchive iarchive(ptr);

	std::vector<int> vect;
	iarchive >> BOOST_SERIALIZATION_NVP(vect);

	std::ostream_iterator<int> object(std::cout, " ");
	std::copy(vect.begin(), vect.end(), object);
}

int main(int argc, char* argv[])
{
	int my_array[10] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 };

	array_save("c://array_save.txt", my_array, 10);
	array_load("c://array_save.txt");

	system("pause");
	return 0;
}

```

## 针对结构体的序列化

针对结构体的序列化是一种将结构体数据类型进行持久化和传输的序列化技术，它可以将结构体中的数据转化为二进制流，使得其可以被传输和存储。在实际开发中，我们经常需要进行结构体的序列化操作，以便在需要时可以恢复出该结构体的数据。Boost库中提供了一组非常方便的序列化工具，可以轻松地将结构体从内存中打包创建成字符串，反序列化则是反之。



在本节中，我们将重点介绍Boost库中针对结构体的序列化相关概念和用法，包括如何使用Boost.Serialization进行结构体序列化和反序列化操作、如何定义自定义结构体序列化函数、如何处理结构体中的指针等。通过本节的学习，读者可掌握Boost库中针对结构体的序列化技术的实际应用，提高C++程序开发能力。

```c
#include <iostream>
#include <fstream>
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>

typedef struct MyDate
{
  unsigned int m_day;
  unsigned int m_month;
  unsigned int m_year;

  MyDate(int d, int m, int y)
  {
    m_day = d;
    m_month = m;
    m_year = y;
  }
  MyDate()
  {
    m_day = 0;
    m_month = 0;
    m_year = 0;
  }

  template<typename Archive>
  void serialize(Archive& archive, const unsigned int version)
  {
    archive & BOOST_SERIALIZATION_NVP(m_day);
    archive & BOOST_SERIALIZATION_NVP(m_month);
    archive & BOOST_SERIALIZATION_NVP(m_year);
  }
}MyDate;

void struct_save(std::string path,MyDate *ptr)
{
  std::ofstream file(path);
  boost::archive::text_oarchive oa(file);
  // MyDate d(15, 8, 1947);
  oa & BOOST_SERIALIZATION_NVP(*ptr);
}

MyDate struct_load(std::string path)
{
  MyDate ref;
  std::ifstream file(path);
  boost::archive::text_iarchive ia(file);
  
  ia >> BOOST_SERIALIZATION_NVP(ref);
  return ref;
}

int main(int argc, char * argv[])
{
  // 序列化
  MyDate save_data(12, 7, 1997);
  struct_save("c://archive.txt", &save_data);

  // 反序列化
  MyDate load_data;
  load_data = struct_load("c://archive.txt");
  std::cout << "反序列化: " << load_data.m_day << std::endl;

  system("pause");
  return 0;
}

```

##  嵌套结构体的序列化

嵌套结构体的序列化是一种将复杂数据类型进行持久化和传输的序列化技术，它不仅可以序列化单一的结构体，还可以将多个结构体嵌套在一起进行序列化。在实际开发中，我们经常需要进行嵌套结构体的序列化操作，以便在需要时可以恢复出该结构体的数据。



在本节中，我们将重点介绍Boost库中针对嵌套结构体的序列化相关概念和用法，包括如何使用Boost.Serialization进行嵌套结构体序列化和反序列化操作、如何定义自定义嵌套结构体序列化函数、如何处理结构体中的指针等。通过本节的学习，读者可掌握Boost库中针对嵌套结构体的序列化技术的实际应用，提高C++程序开发能力。

```c
#include <iostream>
#include <fstream>
#include <vector>
#include <boost/serialization/vector.hpp>
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>

using namespace std;

struct User
{
    string name;
    string email;
    int age;
    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& ar, const unsigned version)
    {
        ar& name& email& age;
    }
};

struct Group
{
    string gid;
    User leader;
    vector<User> members;
    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& ar, const unsigned version)
    {
        ar& gid& leader& members;
    }
};

ostream& operator<<(ostream& os, const User& user)
{
    return os << user.name << ", " << user.email << ", " << user.age << endl;
}

int main(int argc, char* argv[])
{
    User user1 = { "admin", "admin@email.com", 40 };
    User user2 = { "guest", "guest@email.com", 30 };
    User user3 = { "lyshark", "lyshark@email.com", 42 };
    User user4 = { "root", "root@email.com", 37 };

    Group group;
    group.gid = "10001";
    group.leader = user1;
    group.members.push_back(user2);
    group.members.push_back(user3);
    group.members.push_back(user4);

    // 序列化到文件
    ofstream fout("c://save.txt");
    boost::archive::text_oarchive oa(fout);
    oa << group;
    fout.close();

    // 反序列化
    Group group_load;
    ifstream fin("c://save.txt");
    boost::archive::text_iarchive ia(fin);
    ia >> group_load;

    cout << group_load.leader;
    copy(group_load.members.begin(), group_load.members.end(), ostream_iterator<User>(cout));

    system("pause");
    return 0;
}

```

## 针对类的序列化

针对类的序列化是一种将类数据类型进行持久化和传输的序列化技术，它可以将类中的数据转化为二进制流，使得其可以被传输和存储。



在实际开发中，我们经常需要进行类的序列化操作，以便在需要时可以恢复出该类的数据。Boost库中提供了一组非常方便的序列化工具，可以轻松地将类从内存中打包创建成字符串，反序列化则是反之。

```c
#include <iostream>
#include <fstream>
#include <boost/serialization/vector.hpp>
#include <boost/archive/text_oarchive.hpp>
#include <boost/archive/text_iarchive.hpp>

using namespace std;

class User
{
public:
    User()
    {
        name = "";
        email = "";
        age = 0;
    }

    User(const string& _name, const string& _email, const int& _age)
    {
        name = _name;
        email = _email;
        age = _age;
    }

    string getName() const
    {
        return name;
    }
    string getEmail() const
    {
        return email;
    }
    int getAge() const
    {
        return age;
    }

private:
    string name;
    string email;
    int age;

    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& archive, const unsigned version)
    {
        archive& name& email& age;
    }
};

int main(int argc, char* argv[])
{
    User ptr[3] =
    {
      User("admin", "admin@lyshark.com", 22),
      User("guest", "guest@lyshark.com", 24),
      User("lyshark", "lyshark@lyshark.com", 44)
    };

    // 序列化到文件
    ofstream file("c://save.txt");
    boost::archive::text_oarchive oa(file);
    oa << ptr;
    file.close();

    // 反序列化加载到类中
    User buf[3];
    ifstream file_in("c://save.txt");
    boost::archive::text_iarchive ia(file_in);

    ia >> buf;
    cout << "姓名1: " << buf[0].getName() << "," << "姓名2: " << buf[1].getName() << endl;
    system("pause");
    return 0;
}

```

## 序列化文本到字符串

将序列化文本转换成字符串是序列化和反序列化过程中的一项常见需求，可以用于网络传输、文件存储等场景。Boost库中提供了一组非常方便的序列化工具，可以将序列化文本打包成字符串，反序列化则是反之。



在本节中，我们将重点介绍如何将序列化文本转换为字符串，包括如何将二进制流进行编码、如何进行限长编码以及如何使用Boost.Serialization中的相关类进行编码操作等。此外，还会介绍如何进行序列化和反序列化过程中的错误处理。通过本节的学习，读者可掌握Boost库中序列化文本到字符串的技术实现，提高C++程序开发能力。

```c
#include <iostream>
#include <sstream>

#include <boost/archive/binary_iarchive.hpp>
#include <boost/archive/binary_oarchive.hpp>

std::string binary_save(std::string save_string)
{
	std::ostringstream os;

	boost::archive::binary_oarchive archive(os);

	archive << save_string;

	std::string content = os.str();
	return content;
}

std::string binary_load(std::string load_string)
{
	std::istringstream is(load_string);
	boost::archive::binary_iarchive archive(is);

	std::string item;
	archive >> item;

	return item;
}

int main(int argc, char* argv[])
{

	// 将字符串序列化,并存入get变量
	std::string get = binary_save(std::string("hello lyshark"));
	std::cout << "序列化后: " << get << std::endl;

	std::string load = binary_load(get);
	std::cout << "反序列化: " << load << std::endl;

	system("pause");
	return 0;
}

```

## 序列化数组到字符串

将序列化的数组数据转换成字符串是序列化和反序列化过程中的一项常见需求，可以用于网络传输、文件存储等场景。Boost库中提供了一组非常方便的序列化工具，可以将序列化的数组数据打包成字符串，反序列化则是反之。



在本节中，我们将重点介绍如何将序列化的数组转换为字符串，包括如何将二进制流进行编码、如何进行限长编码以及如何使用Boost.Serialization中的相关类进行编码操作等。此外，还会介绍如何进行序列化和反序列化过程中的错误处理。通过本节的学习，读者可掌握Boost库中序列化数组到字符串的技术实现，提高C++程序开发能力。

```C
#include <iostream>
#include <sstream>
#include <vector>

#include <boost/archive/binary_oarchive.hpp>
#include <boost/archive/binary_iarchive.hpp>
#include <boost/serialization/vector.hpp>

std::string array_save(int* my_array, int count)
{
    std::ostringstream os;

    boost::archive::binary_oarchive archive(os);

    std::vector<int> vect(my_array, my_array + count);
    archive& BOOST_SERIALIZATION_NVP(vect);

    std::string content = os.str();
    return content;
}

std::vector<int> array_load(std::string load_string)
{
    std::istringstream is(load_string);
    boost::archive::binary_iarchive archive(is);

    std::vector<int> vect;
    archive >> BOOST_SERIALIZATION_NVP(vect);
    return vect;
}

int main(int argc, char* argv[])
{
    int my_array[10] = { 1, 2, 3, 4, 5, 6, 7, 8, 9, 0 };

    std::string str = array_save(my_array, 10);

    std::cout << "序列化后: " << str << std::endl;

    std::vector<int> vect = array_load(str);

    for (int x = 0; x < 10; x++)
    {
        std::cout << "反序列化输出: " << vect[x] << std::endl;
    }

    system("pause");
    return 0;
}

```



## 序列化结构体到字符串

将嵌套结构序列化数据转换成字符串是序列化和反序列化过程中的一项常见需求，可以用于网络传输、文件存储等场景。Boost库中提供了一组非常方便的序列化工具，可以将序列化的嵌套结构数据打包成字符串，反序列化则是反之。



在本节中，我们将重点介绍如何将序列化的嵌套结构数据转换为字符串，包括如何将二进制流进行编码、如何进行限长编码、基于文本的序列化操作以及如何使用Boost.Serialization中的相关类进行编码操作等。此外，还会介绍如何进行序列化和反序列化过程中的错误处理。通过本节的学习，读者可掌握Boost库中序列化嵌套结构到字符串的技术实现，提高C++程序开发能力。

```c
#include <iostream>
#include <sstream>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/archive/binary_iarchive.hpp>

typedef struct MyDate
{
    unsigned int m_day;
    unsigned int m_month;
    unsigned int m_year;

    MyDate(int d, int m, int y)
    {
        m_day = d;
        m_month = m;
        m_year = y;
    }
    MyDate()
    {
        m_day = 0;
        m_month = 0;
        m_year = 0;
    }

    template<typename Archive>
    void serialize(Archive& archive, const unsigned int version)
    {
        archive& BOOST_SERIALIZATION_NVP(m_day);
        archive& BOOST_SERIALIZATION_NVP(m_month);
        archive& BOOST_SERIALIZATION_NVP(m_year);
    }
}MyDate;

std::string struct_save(MyDate* ptr)
{
    std::ostringstream os;
    boost::archive::binary_oarchive archive(os);
    archive& BOOST_SERIALIZATION_NVP(*ptr);

    std::string content = os.str();
    return content;
}

MyDate struct_load(std::string load_string)
{
    MyDate item;
    std::istringstream is(load_string);
    boost::archive::binary_iarchive archive(is);

    archive >> item;
    return item;
}

int main(int argc, char* argv[])
{
    // 序列化
    MyDate save_data(12, 7, 1997);
    std::string save_string = struct_save(&save_data);
    std::cout << "序列化后: " << save_string << std::endl;

    // 反序列化
    MyDate ptr;
    ptr = struct_load(save_string);
    std::cout << "反序列化: " << ptr.m_year << std::endl;

    system("pause");
    return 0;
}

```

## 序列化嵌套结构到字符串

将嵌套结构序列化数据转换成字符串是序列化和反序列化过程中的一项常见需求，可以用于网络传输、文件存储等场景。Boost库中提供了一组非常方便的序列化工具，可以将序列化的嵌套结构数据打包成字符串，反序列化则是反之。



在本节中，我们将重点介绍如何将序列化的嵌套结构数据转换为字符串，包括如何将二进制流进行编码、如何进行限长编码、基于文本的序列化操作以及如何使用Boost.Serialization中的相关类进行编码操作等。此外，还会介绍如何进行序列化和反序列化过程中的错误处理。通过本节的学习，读者可掌握Boost库中序列化嵌套结构到字符串的技术实现，提高C++程序开发能力。


```c
#include <iostream>
#include <sstream>
#include <vector>
#include <boost/serialization/vector.hpp>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/archive/binary_iarchive.hpp>

using namespace std;

struct User
{
    string name;
    string email;
    int age;
    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& ar, const unsigned version)
    {
        ar& name& email& age;
    }
};

struct Group
{
    string gid;
    User leader;
    vector<User> members;
    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& ar, const unsigned version)
    {
        ar& gid& leader& members;
    }
};

// 序列化
std::string struct_save(Group* ptr)
{
    std::ostringstream os;
    boost::archive::binary_oarchive archive(os);
    archive& BOOST_SERIALIZATION_NVP(*ptr);

    std::string content = os.str();
    return content;
}

// 反序列化
Group struct_load(std::string load_string)
{
    Group item;
    std::istringstream is(load_string);
    boost::archive::binary_iarchive archive(is);

    archive >> item;
    return item;
}

int main(int argc, char* argv[])
{
    User user1 = { "admin", "admin@email.com", 40 };
    User user2 = { "guest", "guest@email.com", 30 };
    User user3 = { "lyshark", "lyshark@email.com", 42 };
    User user4 = { "root", "root@email.com", 37 };

    Group group;
    group.gid = "10001";
    group.leader = user1;
    group.members.push_back(user2);
    group.members.push_back(user3);
    group.members.push_back(user4);

    // 序列化
    std::string save = struct_save(&group);
    std::cout << "序列化后: " << save << std::endl;

    // 反序列化
    Group load;

    load = struct_load(save);
    std::cout << "UUID: " << load.gid << std::endl;
    std::cout << "Uname: " << load.members[0].name << std::endl;
    std::cout << "Uname2: " << load.members[1].name << std::endl;

    system("pause");
    return 0;
}

```

## 序列化类到字符串

在本节中，我们将重点介绍如何将序列化的类数据转换为字符串，包括如何将二进制流进行编码、如何进行限长编码、基于文本的序列化操作以及如何使用Boost.Serialization中的相关类进行编码操作等。此外，还会介绍如何进行序列化和反序列化过程中的错误处理



```c
#include <iostream>
#include <sstream>
#include <boost/serialization/vector.hpp>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/archive/binary_iarchive.hpp>

using namespace std;

class User
{
public:
    User()
    {
        name = "";
        email = "";
        age = 0;
    }

    User(const string& _name, const string& _email, const int& _age)
    {
        name = _name;
        email = _email;
        age = _age;
    }

    string getName() const
    {
        return name;
    }
    string getEmail() const
    {
        return email;
    }
    int getAge() const
    {
        return age;
    }

private:
    string name;
    string email;
    int age;

    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& archive, const unsigned version)
    {
        archive& name& email& age;
    }
};

int main(int argc, char* argv[])
{
    User ptr[3] =
    {
      User("admin", "admin@lyshark.com", 22),
      User("guest", "guest@lyshark.com", 24),
      User("lyshark", "lyshark@lyshark.com", 44)
    };

    // 序列化数据
    std::ostringstream os;
    boost::archive::binary_oarchive archive_save(os);
    archive_save& BOOST_SERIALIZATION_NVP(ptr);

    std::string content = os.str();
    std::cout << content << std::endl;

    // 返序列化
    User item[3];

    std::istringstream is(content);
    boost::archive::binary_iarchive archive_load(is);

    archive_load >> item;

    cout << "姓名1: " << item[0].getName() << "," << "姓名2: " << item[1].getName() << endl;

    system("pause");
    return 0;
}

```

## 序列化派生类到字符串

```c
#include <iostream>
#include <sstream>
#include <vector>
#include <boost/serialization/vector.hpp>
#include <boost/archive/binary_oarchive.hpp>
#include <boost/archive/binary_iarchive.hpp>

using namespace std;

struct User
{
    string name;
    string email;
    int age;
    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& ar, const unsigned version)
    {
        ar& name& email& age;
    }
};

struct Group :public User
{
    int level;
    friend class boost::serialization::access;

    template<class Archive>
    void serialize(Archive& archive, const unsigned version)
    {
        // 将父类序列化,不管父类有多少个成员
        archive& boost::serialization::base_object<User>(*this);
        archive& level;
    }
};

// 序列化
std::string struct_save(Group* ptr)
{
    std::ostringstream os;
    boost::archive::binary_oarchive archive(os);
    archive& BOOST_SERIALIZATION_NVP(*ptr);

    std::string content = os.str();
    return content;
}

// 反序列化
Group struct_load(std::string load_string)
{
    Group item;
    std::istringstream is(load_string);
    boost::archive::binary_iarchive archive(is);

    archive >> item;
    return item;
}

int main(int argc, char* argv[])
{
    Group group_ptr;

    group_ptr.name = "lyshark";
    group_ptr.age = 24;
    group_ptr.email = "me@lyshark.com";
    group_ptr.level = 1024;

    // 序列化到字符串
    std::string save = struct_save(&group_ptr);
    std::cout << "序列化后: " << save << std::endl;

    // 反序列化到字符串
    Group load;
    load = struct_load(save);
    std::cout << "名字: " << load.name << "序号: " << load.level << std::endl;

    system("pause");
    return 0;
}

```









