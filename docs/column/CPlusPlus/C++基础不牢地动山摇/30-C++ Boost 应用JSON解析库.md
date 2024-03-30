# C++ Boost 应用JSON解析库

property_tree 是 Boost 库中的一个头文件库，用于处理和解析基于 XML、Json 或者 INFO 格式的数据。 property_tree 可以提供一个轻量级的、灵活的、基于二叉数的通用容器，可以处理包括简单值（如 int、float）和复杂数据结构（如结构体和嵌套容器）在内的各种数据类型。它可以解析数据文件到内存中，然后通过迭代器访问它们。

在 Boost 库中，property_tree 通常与 boost/property_tree/xml_parser.hpp、boost/property_tree/json_parser.hpp 或 boost/property_tree/info_parser.hpp 文件一起使用。这些文件分别提供了将 XML、JSON 或 INFO 格式数据解析为 property_tree 结构的功能。



首先我们需要自行创建一个测试config.json文件，后期的所有案例演示及应用都需要这个库的支持。

```json
{
  "username": "lyshark",
  "age": 24,
  "get_dict": { "username": "lyshark" },
  "get_list": [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ],
  "user_data": [
    [ "192.168.1.1", "root", "123456" ],
    [ "192.168.1.2", "admin", "123456" ],
    [ "192.168.1.3", "mysql", "123456" ]
  ],

  "user_dict": [
    {
      "uid": 1001,
      "uname": "admin"
    },
    {
      "uid": 1002,
      "uname": "lyshark"
    },
    {
      "uid": 1003,
      "uname": "root"
    }
  ],

  "get_root": [
    {
      "firstName": "admin",
      "lastName": "JackWang",
      "email": "admin@lyshark.com"
    },
    {
      "firstName": "lyshark",
      "lastName": "xusong",
      "email": "me@lyshark.com"
    }
  ],

  "get_my_list": {
    "get_uint": "[1,2,3,4,5,6,7,8,9,0]",
    "get_string": "['admin','lyshark','root']"
  }
}

```

## 8.1 解析单个节点

代码中使用了 Boost C++ 库中的 property_tree 和 json_parser 来解析 [JSON](https://so.csdn.net/so/search?q=JSON&spm=1001.2101.3001.7020) 文件。它的主要功能是读取指定路径下的 “项目目录//config.json” 文件，然后获取其中的用户名和年龄信息（如果存在的话），并将它们输出到控制台。

```c
#include <iostream>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

using namespace std;

int main(int argc, char* argv[])
{
    boost::property_tree::ptree ptr;
    boost::property_tree::read_json("config.json", ptr);

    cout << "是否存在: " << ptr.count("username") << endl;
    if (ptr.count("username") != 0)
    {
        std::string username = ptr.get<std::string>("username");
        std::cout << "用户名: " << username << std::endl;
    }

    if (ptr.count("age") != 0)
    {
        int age = ptr.get<int>("age");
        std::cout << "年龄: " << age << std::endl;
    }

    system("pause");
    return 0;
}

```

![image-20240330103418907](/docs/column/CPlusPlus/C++基础不牢地动山摇/30-C++%20Boost%20应用JSON解析库.assets/image-20240330103418907-17117660600881.png)

## 8.2 解析单个列表

代码中使用了 Boost C++ 库中的 property_tree 和 json_parser 来解析 JSON 文件。它的功能是读取指定路径下的 “config.json” 文件，并提取名为 “get_list” 的字段的值，并将其输出到控制台。

```c
#include <iostream>
#include <vector>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

using namespace std;

void GetJson(std::string& filePath)
{
    boost::property_tree::ptree ptr;
    std::vector<std::string> item;

    boost::property_tree::read_json(filePath, ptr);

    // 先判断是否存在字段
    if (ptr.count("get_list") == 1)
    {
        boost::property_tree::ptree pChild = ptr.get_child("get_list");
        for (auto pos = pChild.begin(); pos != pChild.end(); ++pos)
        {
            // 迭代循环,将元素房补vector列表中
            std::string list = pos->second.get_value<string>();
            item.push_back(list);
        }
    }

    // 迭代输出vector中的数据
    for (auto x = item.begin(); x != item.end(); ++x)
    {
        cout << *x << endl;
    }
}

int main(int argc, char* argv[])
{
    GetJson(std::string("config.json"));
    system("pause");
    return 0;
}

```

## 8.3 解析嵌套列表

这段代码依然使用了 Boost C++ 库中的 property_tree 和 json_parser 来解析 JSON 文件。它的功能是读取指定路径下的 “config.json” 文件，并提取名为 “user_data” 的字段的第二列数据，并将其输出到控制台。

```c
#include <iostream>
#include <vector>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

using namespace std;

void GetJson(std::string &filePath)
{
  boost::property_tree::ptree ptr;
  boost::property_tree::read_json(filePath, ptr);

  std::vector<std::string> item;

  for (auto& root_child : ptr.get_child("user_data"))
  {
    int count = 1;
    for (auto& x : root_child.second)
    {
      // count 用于指定需要那一列的记录
      if (count == 2)
      {
        std::string sub_data = x.second.get_value<std::string>();
        cout << "输出元素: " << sub_data << endl;
        item.push_back(sub_data);
      }
      count++;
    }
  }

  // 迭代输出vector中的数据
  for (auto x = item.begin(); x != item.end(); ++x)
  {
    cout << *x << endl;
  }
}

int main(int argc, char* argv[])
{
  GetJson(std::string("config.json"));
  system("pause");
  return 0;
}

```

## 8.4 解析多层字典

代码同样使用了 Boost C++ 库中的 property_tree 和 json_parser 来解析 JSON 文件。它的功能是读取指定路径下的 “config.json” 文件，并提取名为 “get_dict” 和 “user_dict” 的字段数据，并将其输出到控制台。

```c
#include <iostream>
#include <vector>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

using namespace std;

void GetJson(std::string& filePath)
{
    boost::property_tree::ptree ptr;
    boost::property_tree::read_json(filePath, ptr);

    // 解析单一字典
    std::string username = ptr.get_child("get_dict").get<std::string>("username");
    cout << "姓名: " << username << endl;

    // 解析多层字典
    boost::property_tree::ptree root_ptr, item;
    root_ptr = ptr.get_child("user_dict");

    // 输出第二层
    for (boost::property_tree::ptree::iterator it = root_ptr.begin(); it != root_ptr.end(); ++it)
    {
        item = it->second;
        cout << "UID: " << item.get<int>("uid") << " 姓名: " << item.get<string>("uname") << endl;
    }
}

int main(int argc, char* argv[])
{
    GetJson(std::string("config.json"));
    system("pause");
    return 0;
}

```

第二种方式，通过多次迭代解析多层字典，并将字典中的特定value放入到vector容器内。

```c
#include <iostream>
#include <string>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

using namespace std;
using namespace boost;
using namespace boost::property_tree;

int main(int argc, char* argv[])
{
    boost::property_tree::ptree ptr;
    boost::property_tree::read_json("config.json", ptr);

    // 判断是否存在get_root
    if (ptr.count("get_root") == 1)
    {
        std::vector<string> vecStr;
        std::string get_first_name;

        boost::property_tree::ptree p1, p2;

        // 读取到根节点
        p1 = ptr.get_child("get_root");

        // 循环枚举
        for (ptree::iterator it = p1.begin(); it != p1.end(); ++it)
        {
            // 获取到字典的value值
            p2 = it->second;
            get_first_name = p2.get<string>("firstName");

            // 将获取到的value转换为vector容器
            vecStr.push_back(get_first_name);
        }

        // 输出容器中的内容
        for (int x = 0; x < vecStr.size(); x++)
        {
            std::cout << vecStr[x] << std::endl;
        }
    }
    std::system("pause");
    return 0;
}

```

## 8.5 写出JSON文件

```c
#include <iostream>
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/json_parser.hpp>

using namespace std;

// 初始化字符串
bool InitJSON()
{
    string str = "{\"uuid\":1001,\"Student\":[{\"Name\":\"admin\"},{\"Name\":\"lyshark\"}]}";
    stringstream stream(str);
    boost::property_tree::ptree strTree;

    try {
        read_json(stream, strTree);
    }
    catch (boost::property_tree::ptree_error& e) {
        return false;
    }
    write_json("c://config.json", strTree);
    return true;
}

// 初始化列表
void InitArray()
{
    boost::property_tree::ptree ptr;
    boost::property_tree::ptree children;
    boost::property_tree::ptree child1, child2, child3;

    child1.put("", 1);
    child2.put("", 2);
    child3.put("", 3);

    children.push_back(std::make_pair("", child1));
    children.push_back(std::make_pair("", child2));
    children.push_back(std::make_pair("", child3));

    ptr.add_child("MyArray", children);
    write_json("c://Array.json", ptr);
}

// 初始化字典
void InitDict()
{
    boost::property_tree::ptree ptr;
    boost::property_tree::ptree children;
    boost::property_tree::ptree child1, child2, child3;

    child1.put("childkeyA", 1);
    child1.put("childkeyB", 2);

    child2.put("childkeyA", 3);
    child2.put("childkeyB", 4);

    child3.put("childkeyA", 5);
    child3.put("childkeyB", 6);

    children.push_back(std::make_pair("", child1));
    children.push_back(std::make_pair("", child2));
    children.push_back(std::make_pair("", child3));

    ptr.put("testkey", "testvalue");
    ptr.add_child("MyArray", children);

    write_json("c://MyDict.json", ptr);
}

int main(int argc, char* argv[])
{
    InitArray();
    InitDict();
    InitJSON();

    boost::property_tree::ptree ptr;
    boost::property_tree::read_json("c://config.json", ptr);

    // 修改uuid字段
    if (ptr.count("uuid") != 0)
    {
        ptr.put("uuid", 10002);
    }
    boost::property_tree::write_json("c://config.json", ptr);

    system("pause");
    return 0;
}

```



