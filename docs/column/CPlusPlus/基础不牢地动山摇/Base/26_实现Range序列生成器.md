# 使用C++实现Range序列生成器

在`C++编程`中，经常需要迭代一系列数字或其他可迭代对象。通常，这需要编写复杂的循环结构，但有一种精妙的方法可以使这一过程变得更加简单和可读。如果你使用过Python语言那么一定对Range语句非常的数据，我们可以使用C++来实现一个简单的Range封装，如下代码定义了一个名为Range的命名空间，其中包含一个`RangeImpl`类和相关的函数，用于生成指定范围内的数值序列。这序列生成器支持指定开始值、结束值和可选步长，确保生成的序列满足指定的条件。此代码简化了迭代数值序列的过程，提高了代码的可读性和可维护性，适用于处理不同数据类型的序列。

```c
//针对业务封装的Range范围实现，可用于用户指定一个区间范围，将属于在此区间范围内的数都遍历出来，遍历区间采用前闭后开 ∈[最小下限值，最大上限值)
#include<stdexcept>
namespace Range
{
    template<typename value_t>
    class RangeImpl
    {
        class Iterator;

    public:
        RangeImpl(value_t begin, value_t end, value_t step = 1) :m_begin(begin), m_end(end), m_step(step)
        {
            if (step > 0 && m_begin >= m_end)
                throw std::logic_error("end must greater than begin.");
            else if (step < 0 && m_begin <= m_end)
                throw std::logic_error("end must less than begin.");

            m_step_end = (m_end - m_begin) / m_step;
            if (m_begin + m_step_end * m_step != m_end)
            {
                m_step_end++;
            }
        }

        Iterator begin()
        {
            return Iterator(0, *this);
        }

        Iterator end()
        {
            return Iterator(m_step_end, *this);
        }

        value_t operator[](int s)
        {
            return m_begin + s * m_step;
        }

        int size()
        {
            return m_step_end;
        }

    private:
        value_t m_begin;
        value_t m_end;
        value_t m_step;
        int m_step_end;

        class Iterator
        {
        public:
            Iterator(int start, RangeImpl& range) : m_current_step(start), m_range(range)
            {
                m_current_value = m_range.m_begin + m_current_step * m_range.m_step;
            }

            value_t operator*() { return m_current_value; }

            const Iterator* operator++()
            {
                m_current_value += m_range.m_step;
                m_current_step++;
                return this;
            }

            bool operator==(const Iterator& other)
            {
                return m_current_step == other.m_current_step;
            }

            bool operator!=(const Iterator& other)
            {
                return m_current_step != other.m_current_step;
            }

            const Iterator* operator--()
            {
                m_current_value -= m_range.m_step;
                m_current_step--;
                return this;
            }

        private:
            value_t m_current_value; //当前值
            int m_current_step; //当前步长
            RangeImpl& m_range; //范围对象
        };
    };



    template<typename T, typename V>
    auto Range(T begin, T end, V stepsize) -> RangeImpl<decltype(begin + end + stepsize)>
    {
        return RangeImpl<decltype(begin + end + stepsize)>(begin, end, stepsize);
    }

    template<typename T>
    RangeImpl<T> Range(T begin, T end)
    {
        return RangeImpl<T>(begin, end, 1);
    }

    template<typename T>
    RangeImpl<T> Range(T end)
    {
        return RangeImpl<T>(T(), end, 1);
    }
}

```



```c
#include <iostream>
#include "Range.hpp"

using namespace std;

int main(int argc, char* argv[])
{
  
    /

    //使用Range::Range(15)创建一个整数序列，范围从0到14。 
    for (int i : Range::Range(15))
    {
        std::cout << i << std::endl;
    }
    //Range::Range(2, 6)创建一个整数序列，范围从2到5。
    for (int i : Range::Range(2, 6))
    {
        std::cout << i << std::endl;
    }

    //Range::Range(10.5, 15.5)创建一个浮点数序列，范围从10.5到14.5。
    for (float i : Range::Range(10.5, 15.5))
    {
        std::cout << i << std::endl;
    }


    //Range::Range(35, 27, -1)创建一个递减的整数序列，范围从35到28。
    for (int i : Range::Range(35, 27, -1))
    {
        std::cout << i << std::endl;
    }
    
    //Range::Range(2, 8, 0.5)创建一个浮点数序列，范围从2到8，步长为0.5。
    for (float i : Range::Range(2, 8, 0.5))
    {
        std::cout << i << std::endl;
    }

    //Range::Range(8, 7, -0.1)创建一个浮点数序列，范围从8到7.1，步长为-0.1。
    for (auto i : Range::Range(8, 7, -0.1))
    {
        std::cout << i << std::endl;
    }
    
    //Range::Range(‘a’, ‘z’)创建一个字符序列，范围从’a’到’z’。
    for (auto i : Range::Range('a', 'z'))
    {
        std::cout << i << std::endl;
    }

    std::system("pause");
    return 0;
}

```

