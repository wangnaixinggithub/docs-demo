# C++整合nlohmann/json

在C++中，可以使用第三方库进行 JSON 的序列化和反序列化。一个常用的 JSON 库是 `nlohmann/json`，它是一个现代的、轻量级的 JSON 库，使用单个头文件即可完成。

# 整合进项目

到Github上拉去项目，关注点在`simgle_include` ,里面是两个头文件，直接拷贝到你的工程。即可。

```
https://github.com/nlohmann/json
```



# HelloWorld

以下是一个简单的示例，演示如何使用 `nlohmann/json` 将对象序列化为 JSON 字符串并保存到文件，以及如何从 JSON 字符串中反序列化出对象。

```c
#include <iostream>
#include <fstream>
#include<string>
#include "nlohmann/json.hpp"
using namespace std;

//定义一个示范类
class Person
{
public:
    string name;
    int age;

public:
    //将对象序列化为JSON
    void ToJson(nlohmann::json& jsonParser) const
    {
        jsonParser = nlohmann::json{ {"name",name},{"age",age} };
    }
    //从JSON反序列化为对象
    void ToBean(const nlohmann::json& jsonParser)
    {
        jsonParser.at("name").get_to(name);
        jsonParser.at("age").get_to(age);
    }
};

int main() {
  
    Person person; 
    Person person2;
    string jsonStr; //解析得到的JSON字符串
    ofstream outputStream; //文件输出流
    ifstream inputStream; //文件输入流


    person.name = "JackSon Wang";  //创建一个Person对象
    person.age = 30;   

    //将对象序列化为 JSON字符串
    nlohmann::json jsonParser;
    person.ToJson(jsonParser);
    jsonStr = jsonParser.dump();


    //将JSON字符串保存到文件中 
    outputStream.open("person.json", ios::out | ios::app, _SH_DENYNO);//#define _SH_DENYNO      0x40    /* deny none mode */读取和写入许可
    if (!outputStream.is_open())
    {
        cout << "错误! 打开person.json文件失败" << endl;
        return false;
    }
    outputStream << jsonStr;
    outputStream.close();
    jsonParser.clear();
    cout << "成功! JSON字符串成功持久化到文件中!" << endl;

    //从文件中读取JSON字符串
    inputStream.open("person.json", ios::in, _SH_DENYNO);
    if (!inputStream.is_open())
    {
        cout << "错误! 打开person.json文件失败!" << endl;
    }
    inputStream >> jsonParser;
    inputStream.close();

    //JSON字符串反序列化为对象
    person2.ToBean(jsonParser);

    cout << "从person.json文件中加载并反序列化Person对象\n" << endl;
    std::cout << "Name: " << person2.name << "\n";
    std::cout << "Age: " << person2.age << "\n";

    return 0;
}
```

