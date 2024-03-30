#  C++ Boost 文件目录操作库

Boost 库是一个由C/C++语言的开发者创建并更新维护的开源类库，其提供了许多功能强大的程序库和工具，用于开发高质量、可移植、高效的C应用程序。Boost库可以作为标准C库的后备，通常被称为准标准库，是C标准化进程的重要开发引擎之一。使用Boost库可以加速C应用程序的开发过程，提高代码质量和性能，并且可以适用于多种不同的系统平台和编译器。Boost库已被广泛应用于许多不同领域的C++应用程序开发中，如网络应用程序、图像处理、数值计算、多线程应用程序和文件系统处理等。

在Boost库出现之前，C++对于文件和目录的操作需要调用底层接口操作，非常不友好，而且不同平台的接口差异也很大，难以移植。但是，Boost库中的filesystem库可以解决这个问题，它是一个可移植的文件系统操作库，可以跨平台的操作目录、文件等，并提供了友好的操作方法，并且在不失性能的情况下提供了良好的抽象和封装。



## 使用Path目录类

Path目录类是Boost库中非常实用的一个子模块，它提供了跨平台的操作系统路径解析和路径操作的功能，具有跨平台兼容性和通用性。使用Path目录类，我们可以很方便地对系统中的路径进行操作，例如查询路径是否存在、创建路径、获取路径中的元素、拼接路径等等。



在本节中，我们将重点介绍如何使用Path目录类，包括如何创建和初始化Path对象、如何获取和设置路径成员变量、如何查询路径是否存在和创建路径、如何拼接和规范化路径等。此外，还会探讨如何在不同操作系统中使用Path目录类以及如何处理Path异常。

```c
#include <iostream>
#include <string>
#include <boost/filesystem.hpp>

int main(int argc, char *argv[])
{
  boost::filesystem::path dir("C://windows/system32/drivers/service.dll");

  std::cout << "转为字符串: " << dir.string() << std::endl;
  std::cout << "盘符名称: " << dir.root_name() << std::endl;
  std::cout << "根目录标识: " << dir.root_directory() << std::endl;
  std::cout << "根路径标识: " << dir.root_path() << std::endl;
  std::cout << "相对路径: " << dir.relative_path() << std::endl;
  std::cout << "上级目录: " << dir.parent_path() << std::endl;
  std::cout << "文件名: " << dir.filename() << std::endl;
  std::cout << "文件名(非扩展): " << dir.stem() << std::endl;
  std::cout << "扩展名: " << dir.extension() << std::endl;

  std::cout << "是否为绝对路径: " << dir.is_absolute() << std::endl;
  std::cout << "只保留路径: " << dir.replace_extension() << std::endl;
  std::cout << "修改后缀扩展: " << dir.replace_extension("exe") << std::endl;

  std::system("pause");
  return 0;
}

```

![image-20240327215754205](28-C++%20Boost%20文件目录操作库.assets/image-20240327215754205-17115478751411.png)

## 路径拼接与追加操作

路径拼接和追加操作是在进行文件路径操作中非常常见的操作，可以用于将多个路径拼接成一个完整的路径，或者在已有的路径后面添加新的路径元素。Boost库中的Path目录类提供了一系列便捷的方法来实现路径拼接和追加操作，在本节中，我们将重点介绍如何在Boost库中进行路径拼接和追加操作，包括如何使用Path类成员函数来拼接路径、如何使用运算符/来追加新的路径元素、以及如何使用Path类提供的join()函数来拼接路径等。

```c
#include <iostream>
#include <string>
#include <boost/filesystem.hpp>

int main(int argc, char* argv[])
{
    namespace fs = boost::filesystem;

    // 获取当前目录
    fs::path current = fs::current_path();
    std::cout << "当前目录: " << current << std::endl;

    fs::path init_path = fs::initial_path();
    std::cout << "初始目录: " << init_path << std::endl;

    // 在当前目录后面拼接/lyshark
    fs::path new_current = current / "lyshark";
    std::cout << "拼接后: " << new_current << std::endl;

    // 提取区间字符
    char str[] = "hello / lyshark";
    fs::path str_path(str + 6, str + 7);
    std::cout << "区间提取: " << str_path.string() << std::endl;

    // 追加字符串
    fs::path _path = "/etc";
    std::string append_file_name = "xinetd.conf";

    _path.append(append_file_name.begin(), append_file_name.end());
    std::cout << "追加后: " << _path << std::endl;

    // 特定位置追加
    str_path += "etc/";
    std::string file_name = "lyshark.log";
    str_path.concat(file_name.begin(), file_name.end());
    std::cout << "追加后: " << str_path << std::endl;

    // 字符路径分割
    fs::path path_f("c://windows/system32/etc/lyshark.cpp");
    for (fs::path::iterator itFn = path_f.begin(); itFn != path_f.end(); itFn++)
    {
        std::cout << "[" << *itFn << "]" << std::endl;
    }
    std::system("pause");
    return 0;
}

```

![image-20240327220328115](28-C++%20Boost%20文件目录操作库.assets/image-20240327220328115-17115482092972.png)

## 针对文件属性操作

在文件操作中，文件属性操作是非常重要的一部分，常用的操作包括获取和修改文件的时间戳、大小、权限等属性信息。Boost库中也提供了一些方便的函数和类来实现文件属性操作，这些操作可以用于读取和修改文件属性等操作。



在本节中，我们将重点介绍如何使用Boost库中的函数和类来进行文件属性操作，包括如何使用Path类来获取和修改文件属性、如何使用文件流操作来实现属性访问等。

```c
#include <iostream>
#include <string>
#include <boost/filesystem.hpp>

int main(int argc, char* argv[])
{
    namespace fs = boost::filesystem;
    fs::path ptr("C://windows/");

    // 基础属性判断
    if (!ptr.empty())
    {
        std::cout << "目录是否存在: " << fs::exists(ptr) << std::endl;
        std::cout << "是否为目录: " << fs::is_directory(ptr) << std::endl;
        std::cout << "文件是否为空: " << fs::is_empty(ptr) << std::endl;
        std::cout << "是否普通文件: " << fs::is_regular_file(ptr) << std::endl;
        std::cout << "是否链接文件: " << fs::is_symlink(ptr) << std::endl;
    }

    // 日期检测
    fs::path ptr_file = "C://windows/SysWOW64/acledit.dll";
    std::time_t timer = fs::last_write_time(ptr_file);
    std::cout << "(修改时间)时间戳: " << timer << std::endl;

    // 文件状态检测
    fs::path ptr_status = "C://windows/SysWOW64/acledit.dll";
    std::cout << "类型检测: " << fs::status(ptr_status).type() << std::endl;
    std::cout << "权限检测: " << fs::status(ptr_status).permissions() << std::endl;

    std::system("pause");
    return 0;
}

```

![image-20240327220448988](28-C++%20Boost%20文件目录操作库.assets/image-20240327220448988-17115482900693.png)

##  文件流计算文件大小

```c
#include <iostream>
#include<fstream>
#include <string>
#include <boost/filesystem.hpp>

// 读取文本文件
void get_file(std::string path)
{

  std::ifstream ifs(path.c_str());

  if (ifs.is_open() == 1)
  {
    std::cout << ifs.rdbuf() << std::endl;
  }
}

int main(int argc, char *argv[])
{
  namespace fs = boost::filesystem;

  fs::path ptr("E:\\journal.cxx");

  // 读取文件大小
  try
  {
     //get_file(ptr.string());
     
    std::cout << "文件大小: " << fs::file_size(ptr) / 1024 << " KB" << std::endl;
  }
  catch (boost::filesystem::filesystem_error& e)
  {
    std::cout << "异常: " << e.path1() << e.what() << std::endl;
  }

  // 获取盘符容量
  boost::filesystem::space_info size = fs::space("c://");
  std::cout << "总容量: " << size.capacity / 1024 / 1024 << " MB" << std::endl;
  std::cout << "剩余容量: " << size.free / 1024 / 1024 << " MB" << std::endl;
  std::cout << "可用容量: " << (size.capacity - size.free) / 1024 / 1024 << " MB" << std::endl;

  std::system("pause");
  return 0;
}

```

![image-20240327221157007](28-C++%20Boost%20文件目录操作库.assets/image-20240327221157007-17115487180434.png)



## 文件与目录增删改

文件与目录的增删改操作是在文件操作中非常常见的操作，可以用于创建新文件或目录、删除不需要的文件或目录等操作。Boost库中提供了一些非常方便的函数和类来实现文件和目录的增删改操作。在本节中，我们将重点介绍如何使用Boost库中的函数和类来进行文件和目录的增删改操作，包括如何使用Path类来创建新文件或目录、如何删除已有的文件或目录、以及如何对已有的文件或目录进行修改等操作。

注意无法删除的情况下，务必检查下权限。

```c
#include <iostream>
#include <fstream>
#include <boost/filesystem.hpp>

using namespace std;
using namespace boost;

int main(int argc, char *argv[])
{
  namespace fs = boost::filesystem;

  // 创建空目录
  auto directory_ref = filesystem::create_directory(filesystem::path("c://lyshark"));
  cout << "是否创建成功: " << directory_ref << endl;

  // 创建递归目录
  filesystem::path root_tree = filesystem::path("c://");
  auto directorys_ref = filesystem::create_directories(root_tree / "sub_dir_a" / "sub_dir_b");
  cout << "是否创建成功: " << directorys_ref << endl;

  // 文件或目录拷贝命令
  filesystem::copy_directory("c://lyshark", "d://lyshark");
  filesystem::copy_file("c://lyshark.exe", "d://lyshark/lyshark.exe");

  // 重命名文件或目录
  filesystem::rename("c://lyshark.exe", "c://www.exe");

  // 删除文件或目录
  auto remove_ref = filesystem::remove("c://lyshark");
  cout << "是否已删除(空目录): " << remove_ref << endl;
  
  auto remove_all_ref = filesystem::remove_all("c://lyshark");
  cout << "是否已删除(非空目录): " << remove_all_ref << endl;

  std::system("pause");
  return 0;
}

```

## 迭代输出单层目录

迭代输出单层目录是对目录操作中常见的一项操作，可以用于展示目录中所有的文件和目录名称。Boost库中，我们可以使用迭代器来遍历目录，读取目录中的子目录和文件的名称，并输出这些信息。

在本节中，我们将重点介绍如何使用Boost库中的迭代器来迭代输出单层目录，包括如何打开目录的迭代器、如何使用遍历器遍历目录、如何读取迭代器中的文件和目录名称等操作。

```c
#include <iostream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>

using namespace std;
using namespace boost;
using namespace boost::filesystem;

// 定义结构体,将完整数据放入结构体中
typedef struct
{
  std::string file_path;
  bool is_directory;
  long file_size;
}CatalogData;

// 遍历文件函数,并将结果存入RefVect
void GetFilePath(const string& pathName, std::vector <std::string> &RefVect)
{
  // 枚举当前路径下的所有目录
  directory_iterator end;
  for (directory_iterator pos(pathName); pos != end; ++pos)
  {
    // cout << "文件路径:" << pos->path().string() << endl;
    RefVect.push_back(pos->path().string());
  }
}

// 简单的输出文件路径
void PrintFilePath(const string& pathName)
{
  std::vector<std::string> vect;
  GetFilePath(pathName, vect);

  for (int x = 0; x < vect.size(); x++)
  {
    std::cout << vect[x] << std::endl;
  }
}

// 输出特定目录下文件路径与文件大小,并以结构链表返回
std::vector<CatalogData> GetStructFilePath(const string& pathName)
{
  std::vector<std::string> vect;
  GetFilePath(pathName, vect);

  // 定义结构,并将数据放入结构中
  std::vector<CatalogData> ref_vect;

  for (int x = 0; x < vect.size(); x++)
  {
    CatalogData data_ptr;

    try
    {
      // 判断是否为目录
      bool ref = boost::filesystem::is_directory(vect[x]);
      if (ref == true)
      {
        //std::cout << "目录: " << vect[x] << std::endl;
        data_ptr.is_directory = true;
        data_ptr.file_path = vect[x];
        data_ptr.file_size = 0;
      }
      else
      {
        data_ptr.is_directory = false;
        data_ptr.file_path = vect[x];
        data_ptr.file_size = boost::filesystem::file_size(vect[x]);
        //std::cout << "文件: " << vect[x] << "大小: " << boost::filesystem::file_size(vect[x]) << std::endl;
      }
    }
    catch (...)
    {
      data_ptr.is_directory = false;
      data_ptr.file_size = -1;
      data_ptr.file_path = vect[x];
    }
    // 最后将结构放入ref_vect中返回
    ref_vect.push_back(data_ptr);
  }
  return ref_vect;
}

int main(int argc, char *argv[])
{
  // 获取特定目录下的一级文件结构体
  std::vector<CatalogData> ptr = GetStructFilePath("C://");
  for (int x = 0; x < ptr.size(); x++)
  {
    std::cout << "文件路径: " << ptr[x].file_path << std::endl;
    std::cout << "文件大小: " << ptr[x].file_size << " bytes" << std::endl;
    std::cout << std::endl;
  }

  std::system("pause");
  return 0;
}

```

![image-20240327222818802](28-C++%20Boost%20文件目录操作库.assets/image-20240327222818802-17115497000235.png)



## 正则迭代搜索文件

正则表达式是在文件操作中常见的一项操作，可以用于快速定位到匹配指定模式的文件。Boost库中，我们可以使用正则表达式来实现迭代搜索文件操作，读取符合正则表达式模式的文件名称，并输出这些信息。



在本节中，我们将重点介绍如何使用Boost库中的正则表达式和迭代器来实现正则迭代搜索文件，包括如何使用正则表达式进行文件匹配、如何打开目录的迭代器、如何使用迭代器遍历目录并匹配文件、如何读取迭代器中的文件名称等操作

```c
#include <iostream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include <boost/algorithm/string/replace.hpp>
#include <boost/xpressive/xpressive.hpp>

using namespace std;
using namespace boost;
using namespace boost::filesystem;
using namespace boost::xpressive;

// 递归寻找文件(不支持正则处理)
boost::optional<path> recursive_find_file(const path& dir, const string& filename)
{
  // 定义返回值类型,这个optional返回容器
  typedef boost::optional<path> result_type;

  // 检测如果不是目录则直接退出
  if (!exists(dir) || !is_directory(dir))
  {
    return result_type();
  }

  recursive_directory_iterator end;
  for (recursive_directory_iterator pos(dir); pos != end; ++pos)
  {
    // 如果不是目录并且文件名相同则返回这个路径
    if (!is_directory(*pos) && pos->path().filename() == filename)
    {
      return result_type(pos->path());
    }
  }
  return result_type();
}

// 递归寻找文件(支持正则处理)
std::vector<path> recursive_find_file_regx(const path& dir, const string& filename)
{
  // 定义正则表达式静态对象
  static boost::xpressive::sregex_compiler rc;

  // 先判断正则对象是否正常
  if (!rc[filename].regex_id())
  {
    // 处理文件名 将.替换为\\. 将 * 替换为 .*
    std::string str = replace_all_copy(replace_all_copy(filename, ".", "\\."), "*", ".*");
    rc[filename] = rc.compile(str);     // 创建正则
  }

  typedef std::vector<path> result_type;
  result_type vct;
  if (!exists(dir) || !is_directory(dir))
  {
    return vct;
  }

  recursive_directory_iterator end;
  
  for (recursive_directory_iterator pos(dir); pos != end; ++pos)
  {
    if (!is_directory(*pos) && regex_match(pos->path().filename().string(), rc[filename]))
    {
      // 如果找到了就加入到vector里面
      vct.push_back(pos->path());
    }
  }
  return vct;
}

int main(int argc, char *argv[])
{
  // 不使用通配符 (在H://目录下寻找zabbix_agentd.conf文件)
  auto ref = recursive_find_file("H://", "zabbix_agentd.conf");
  if (ref)
  {
    filesystem::path file_path = *ref;
    std::cout << "[+] 已找到文件路径: " << file_path.string() << std::endl;
  }

  // 使用通配符 (寻找E://logsession目录下所有的*.txt结尾的文本)
  auto  regx_ref = recursive_find_file_regx("E://logsession", "*.txt");

  cout << "找到文件数量: " << regx_ref.size() << endl;
  for (boost::filesystem::path &ptr : regx_ref)
  {
    cout << "找到文件路径: " << ptr.string() << endl;
  }

  std::system("pause");
  return 0;
}

```

## 递归遍历层级目录

递归遍历层级目录是目录操作中常见的一项操作，可以用于展示目录中所有的文件和目录，包括子目录及其内容。Boost库中，我们可以使用递归函数来遍历所有目录及其文件，并输出这些信息。

在本节中，我们将重点介绍如何使用Boost库中的递归函数来遍历层级目录，包括如何打开目录、如何使用递归函数遍历目录、如何读取文件名称等操作。


```c
#include <iostream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include <boost/algorithm/string/replace.hpp>
#include <boost/xpressive/xpressive.hpp>

using namespace std;
using namespace boost;
using namespace boost::filesystem;
using namespace boost::xpressive;

// 遍历文件函数版
void recursive_file(const string& pathName, std::vector <std::string> &recusiveFileVec)
{
  boost::filesystem::recursive_directory_iterator rdi(pathName);
  boost::filesystem::recursive_directory_iterator end_rdi;
  recusiveFileVec.empty();

  for (; rdi != end_rdi; rdi++)
  {
    if (is_directory(*rdi))
    {
      //std::cout << *rdi << "is pathName" << std::endl;
    }
    else
    {
      recusiveFileVec.push_back(rdi->path().string());
      //std::cout << *rdi << " is a file" << std::endl;
    }
  }
}

// 递归迭代目录(低效率版)
void recursive_dir(const path& dir)
{
  directory_iterator end;

  for (directory_iterator pos(dir); pos != end; ++pos)
  {
    // 判断是否为目录
    if (is_directory(*pos))
    {
      recursive_dir(*pos);
    }
    else
    {
      cout << *pos << endl;
    }
  }
}

// 递归目录(高效版)
void recursive_dir_new(const path& dir)
{
  // level() 返回当前目录深度
  recursive_directory_iterator end;
  for (recursive_directory_iterator pos(dir); pos != end; ++pos)
  {
    // 只输出只有一层的路径
    if (pos.level() == 0)
    {
      cout << "目录深度: " << pos.level() << " 路径: " << *pos << endl;
    }
  }
}

int main(int argc, char *argv[])
{
  // 输出枚举内容
  std::vector <std::string> file_path;

  recursive_file("H://", file_path);
  for (int x = 0; x < file_path.size(); x++)
  {
    std::cout << file_path[x] << std::endl;
  }

  // 递归目录输出
  recursive_dir_new("d://");

  std::system("pause");
  return 0;
}

```

## 递归实现文件拷贝

递归实现文件拷贝是目录操作中非常常见的一项操作，可以用于将一个目录及其子目录中的所有文件拷贝到另一个目录中。Boost库中，我们可以使用递归函数来实现文件拷贝操作。在本节中，我们将重点介绍如何使用Boost库中的递归函数来实现文件拷贝操作，包括如何打开目录、如何使用递归函数遍历目录并拷贝文件、如何处理文件拷贝过程中可能遇到的异常等操作。

```c
#include <iostream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include <boost/algorithm/string/replace.hpp>
#include <boost/xpressive/xpressive.hpp>

using namespace std;
using namespace boost;
using namespace boost::filesystem;
using namespace boost::xpressive;

// 递归寻找文件
std::vector<path> recursive_find_file_regx(const path& dir, const string& filename)
{
  // 定义正则表达式静态对象
  static boost::xpressive::sregex_compiler rc;

  // 先判断正则对象是否正常
  if (!rc[filename].regex_id())
  {
    // 处理文件名 将.替换为\\. 将 * 替换为 .*
    std::string str = replace_all_copy(replace_all_copy(filename, ".", "\\."), "*", ".*");
    rc[filename] = rc.compile(str);     // 创建正则
  }

  typedef std::vector<path> result_type;
  result_type vct;
  if (!exists(dir) || !is_directory(dir))
  {
    return vct;
  }

  recursive_directory_iterator end;

  for (recursive_directory_iterator pos(dir); pos != end; ++pos)
  {
    if (!is_directory(*pos) && regex_match(pos->path().filename().string(), rc[filename]))
    {
      // 如果找到了就加入到vector里面
      vct.push_back(pos->path());
    }
  }
  return vct;
}

// 文件复制操作函数 [from_dir = 源目录 to_dir = 拷贝到 filename = 通配符]
size_t my_copy_file(const path& from_dir, const path& to_dir, const string& filename = "*")
{
  // 判断源文件路径必须为目录
  if (!is_directory(from_dir))
  {
    cout << "原始文件不能为文件" << endl;
    return 0;
  }

  // 查找原目录下的所有文件
  auto vec = recursive_find_file_regx(from_dir, filename);
  if (vec.empty())
  {
    cout << "目录中没有文件,自动跳过拷贝" << endl;
    return 0;
  }

  path path_ptr;
  for (auto& ptr : vec)
  {
    // 拆分基本路径与目标路径
    path_ptr = to_dir / ptr.string().substr(from_dir.string().length());

    // 判断并创建子目录
    if (!exists(path_ptr.parent_path()))
    {
      create_directories(path_ptr.parent_path());
    }
    cout << "源文件: " << path_ptr.string() << " 拷贝到: " << to_dir.string() << endl;

    // 开始拷贝文件
    boost::filesystem::copy_file(ptr, path_ptr);
  }
  cout << "拷贝总文件数: " << vec.size() << endl;
  return vec.size();
}

int main(int argc, char *argv[])
{
  // 将C:\\MinGW目录下的所有文件拷贝到 d:\\MinGW
  my_copy_file("c:\\MinGW", "d:\\MinGW");

  std::system("pause");
  return 0;
}

```

## 递归实现文件删除

递归实现文件删除是目录操作中非常常见的一项操作，可以用于删除一个目录及其子目录中的所有文件。Boost库中，我们可以使用递归函数来实现文件删除操作。在本节中，我们将重点介绍如何使用Boost库中的递归函数来实现文件删除操作，包括如何打开目录、如何使用递归函数遍历目录并删除文件、如何处理文件删除过程中可能遇到的异常等操作



```c
#include <iostream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include <boost/algorithm/string/replace.hpp>
#include <boost/xpressive/xpressive.hpp>

using namespace std;
using namespace boost;
using namespace boost::filesystem;
using namespace boost::xpressive;

// 递归寻找文件
std::vector<path> recursive_find_file_regx(const path& dir, const string& filename)
{
  // 定义正则表达式静态对象
  static boost::xpressive::sregex_compiler rc;

  // 先判断正则对象是否正常
  if (!rc[filename].regex_id())
  {
    // 处理文件名 将.替换为\\. 将 * 替换为 .*
    std::string str = replace_all_copy(replace_all_copy(filename, ".", "\\."), "*", ".*");
    rc[filename] = rc.compile(str);
  }

  typedef std::vector<path> result_type;
  result_type vct;
  if (!exists(dir) || !is_directory(dir))
    return vct;

  recursive_directory_iterator end;
  for (recursive_directory_iterator pos(dir); pos != end; ++pos)
  {
    if (!is_directory(*pos) && regex_match(pos->path().filename().string(), rc[filename]))
    {
      // 如果找到了就加入到vector里面
      vct.push_back(pos->path());
    }
  }
  return vct;
}

// 文件删除操作函数 [from_dir = 需要删除目录 filename = 通配符]
size_t my_delete_file(const path& from_dir, const string& filename = "*")
{
  // 判断源文件路径必须为目录
  if (!is_directory(from_dir))
    return 0;

  // 查找原目录下的所有文件
  auto vec = recursive_find_file_regx(from_dir, filename);
  if (vec.empty())
    return 0;

  for (auto& ptr : vec)
  {
    try
    {
      // 判断是文件还是目录
      if (!is_directory(ptr.string()))
      {
        bool ref = filesystem::remove(ptr.string());
        if (ref == true)
        {
          std::cout << "[+] 已删除(文件): " << ptr.string() << std::endl;
        }
      }
    }
    catch (...)
    { continue; }
  }
  return vec.size();
}

int main(int argc, char *argv[])
{
  std::string del_file_path = "c://mingw730_32";
  std::string del_file_regx = "*.txt";

  // 删除通配符匹配的文件
  int ref = my_delete_file(del_file_path, del_file_regx);
  std::cout << "删除文件数: " << ref << std::endl;

  // 如果通配符是*最后的话需要再把所有空目录删掉
  if (del_file_regx == "*")
  {
    int del_ref = remove_all(del_file_path);
    std::cout << "删除目录: " << del_ref << std::endl;
  }

  std::system("pause");
  return 0;
}

```

## 递归目录CRC计算

递归目录计算CRC32是目录操作中常见的一项操作，可以用于计算一个目录及其子目录中所有文件的CRC32校验和。Boost库中，我们可以使用递归函数和CRC32算法来实现这一操作。在本节中，我们将重点介绍如何使用Boost库中的递归函数和CRC32算法来计算目录中所有文件的CRC32校验和，包括如何打开目录、如何使用递归函数遍历目录并计算CRC32值、如何处理计算过程中可能遇到的异常等操作。



实现对特定文件夹下的目录的递归，并计次计算文件的CRC32值，存储到map容器中，CRC32是循环冗余校验码，可用于计算特定字符串的Hash值，在Boost库中默认支持CRC计算，如下所示；

```c
#include <iostream>
#include <string>
#include <boost/crc.hpp>

using namespace std;
using namespace boost;

int main(int argc, char *argv[])
{
  crc_32_type crc32;
  std::string str = "hello lyshark";

  // 输出字符串crc32值 hex=十六进制输出
  cout << hex;
  crc32.process_bytes(str.c_str(), str.length());
  cout << "字符串CRC: " << crc32.checksum() << endl;

  // 迭代输出
  crc32.reset();
  cout << "第二种输出: " << std::for_each(str.begin(), str.end(), crc32)() << std::endl;

  std::system("pause");
  return 0;
}

```

当我们需要计算特定文件时，需要先打开文件，然后获取文件长度，并传入到CRC函数中完成计算。

```c
#include <iostream>
#include <string>
#include <fstream>

#include <boost/filesystem.hpp>
#include <boost/lexical_cast.hpp>
#include <boost/crc.hpp>

using namespace std;
using namespace boost;

std::string calcFileCrc32(const string& fileName,long calcSize)
{
  //计算文件的CRC32校验值 
  ifstream ifs(fileName, ios_base::in | ios_base::binary);
  if (!ifs)
    return 0;

  // 指定计算前几个字节
  char *fileData = new char[calcSize];
  ifs.read(fileData, calcSize);
  ifs.close();

  boost::crc_32_type crc32;
  crc32.process_bytes(fileData, calcSize);
  return lexical_cast<string>(crc32.checksum());
}

int main(int argc, char *argv[])
{
  // 获取长度
  namespace fs = boost::filesystem;
  long filesize = fs::file_size("c://write.log");

  // 计算CRC32
  std::string crc_ref = calcFileCrc32("c://write.log", filesize);
  std::cout << "CRC32: " << crc_ref << std::endl;
  
  std::system("pause");
  return 0;
}

```

如下案例，我们将文件枚举功能，与CRC32校验结合起来，实现计算特定目录下，所有文件的CRC32值，并将计算结果放入到`crc_map`映射容器中。

```c
#include <iostream>
#include <string>
#include <fstream>

#include <map>
#include <vector>

#include <boost/filesystem.hpp>
#include <boost/lexical_cast.hpp>
#include <boost/crc.hpp>

using namespace std;
using namespace boost;

// 计算文件的CRC32校验值 
std::string calcFileCrc32(const string& fileName,long calcSize)
{
  ifstream ifs(fileName, ios_base::in | ios_base::binary);
  if (!ifs)
    return "None";

  char *fileData = new char[calcSize];
  ifs.read(fileData, calcSize);
  ifs.close();

  boost::crc_32_type crc32;
  crc32.process_bytes(fileData, calcSize);
  return lexical_cast<string>(crc32.checksum());
}

// 迭代输出目录
void recursive_file(const string& pathName, std::vector <std::string> &recusiveFileVec)
{
  boost::filesystem::recursive_directory_iterator rdi(pathName);
  boost::filesystem::recursive_directory_iterator end_rdi;
  recusiveFileVec.empty();

  for (; rdi != end_rdi; rdi++)
  {
    if (is_directory(*rdi))
    { }
    else
    {
      recusiveFileVec.push_back(rdi->path().string());
    }
  }
}

int main(int argc, char *argv[])
{
  std::vector<std::string> FileVect;
  std::map<std::string, std::string> crc_map;

  recursive_file("H://", FileVect);

  // 计算所有文件的CRC32值
  for (int x = 0; x < FileVect.size(); x++)
  {
    std::string file_name = FileVect[x];
    long calc_size = 4096;
    std::string ref_crc32;

    // 开始计算CRC
    ref_crc32 = calcFileCrc32(file_name, calc_size);
    if (ref_crc32 != "None")
    {
      // std::cout << "计算CRC结果: " << ref_crc32 << std::endl;
      // 将计算后的结果连同目录一起插入到crc_map
      crc_map.insert(std::pair<std::string, std::string>(file_name, ref_crc32));
    }
  }

  // 输出校验后的CRC结果
  for (std::map<std::string, std::string>::iterator it = crc_map.begin(); it != crc_map.end(); it++)
  {
    std::cout << "CRC校验: " << it->second << " 路径: " << it->first << std::endl;
  }
  std::system("pause");
  return 0;
}

```

## 递归输出目录属性

```c
#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <boost/filesystem.hpp>

using namespace std;
using namespace boost;
using namespace boost::filesystem;

// 定义结构体,将完整数据放入结构体中
typedef struct
{
  char file_path[2048];
  bool is_directory;
  long file_size;
}CatalogData;

// 利用流获取文件大小
long GetFileSize(std::string filename)
{
  long ref_kb;
  std::ifstream ptr(filename, std::ios::in | std::ios::binary);

  if (ptr.is_open() == true)
  {
    ptr.seekg(0, std::ios::end);   // 移动到末尾
    ref_kb = ptr.tellg();          // 获取字节数
    ptr.close();
    return ref_kb;
  }
  return 0;
}

// 遍历文件函数,并将结果存入RefVect
void GetFilePath(const string& pathName, std::vector <std::string> &RefVect)
{
  directory_iterator end;
  for (directory_iterator pos(pathName); pos != end; ++pos)
  {
    RefVect.push_back(pos->path().string());
  }
}

// 获取到当前目录详细信息,并依次取出数据
std::vector<CatalogData> GetFileState(const string& pathName)
{
  std::vector < std::string > ref_file_path;
  GetFilePath(pathName,ref_file_path);

  // 循环获取目录属性
  std::vector<CatalogData> ref_date;
  for (int x = 0; x < ref_file_path.size(); x++)
  {
    CatalogData ptr;
    // 判断如果是目录,则不计算文件大小
    if (is_directory(ref_file_path[x]))
    {
      ptr.is_directory = true;
      ptr.file_size = 0;
      strcpy(ptr.file_path, ref_file_path[x].c_str());
    }
    // 如果是文件则计算大小
    else
    {
      ptr.is_directory = false;
      ptr.file_size = GetFileSize(ref_file_path[x]);
      strcpy(ptr.file_path, ref_file_path[x].c_str());
    }
    // 依次放入容器
    ref_date.push_back(ptr);
  }
  return ref_date;
}

int main(int argc, char *argv[])
{
  // 定义结果并获取单层目录
  std::vector<CatalogData> path_date;
  path_date = GetFileState("c://usr");

  // 循环输出目录属性
  for (int x = 0; x < path_date.size(); x++)
  {
    std::cout << "目录: " << path_date[x].file_path
      << " 是否为目录: " << path_date[x].is_directory
      << " 文件大小: " << path_date[x].file_size
      << std::endl;
  }
  std::system("pause");
  return 0;
}

```

