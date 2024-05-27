# REPEAT 程序

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240124202717005-17167372000771.png)



该片段中从 A = A + 4 所在的行到 A = A + 8 所在的行都在第一行的循环两次中。

REPEAT 6: 所在的行到 A = A + 7 所在的行都在 REPEAT 5: 循环中。

A = A + 5 实际总共的循环次数是 2 × 5 × 6 = 60 次。

请问该程序执行完毕之后，A 的值是多少？

题目给出的 prog.txt 文件：

```
A = 0
REPEAT 2:
    A = A + 4
    REPEAT 5:
        REPEAT 6:
            A = A + 5
        A = A + 7
    REPEAT 6:
        A = A + 7
        REPEAT 4:
            A = A + 2
            A = A + 7
        A = A + 2
    REPEAT 7:
        REPEAT 4:
            A = A + 8
            A = A + 7
            A = A + 4
            A = A + 5
        A = A + 8
    REPEAT 8:
        A = A + 5
        REPEAT 1:
            A = A + 2
        REPEAT 7:
            A = A + 5
        A = A + 5
    REPEAT 2:
        REPEAT 3:
            A = A + 1
        A = A + 1
    REPEAT 5:
        A = A + 1
    REPEAT 9:
        REPEAT 6:
            A = A + 5
            A = A + 1
        REPEAT 6:
            A = A + 2
            A = A + 8
            A = A + 3
        REPEAT 2:
            A = A + 5
        REPEAT 3:
            A = A + 9
        REPEAT 1:
            A = A + 4
        REPEAT 2:
            A = A + 9
        REPEAT 1:
            A = A + 6
            A = A + 6
            A = A + 4
        REPEAT 3:
            A = A + 7
        A = A + 1
        REPEAT 2:
            A = A + 3
        REPEAT 5:
            A = A + 2
            A = A + 5
            A = A + 2
        A = A + 4
    A = A + 3
REPEAT 4:
    A = A + 4
    A = A + 3
    A = A + 7
    REPEAT 5:
        REPEAT 4:
            A = A + 5
            A = A + 7
        REPEAT 5:
            A = A + 3
        REPEAT 3:
            A = A + 3
            A = A + 1
        A = A + 8
        A = A + 2
        REPEAT 9:
            A = A + 5
        REPEAT 1:
            A = A + 5
        A = A + 2
    A = A + 8
A = A + 6
REPEAT 3:
    REPEAT 4:
        A = A + 9
        REPEAT 5:
            A = A + 2
        A = A + 1
    REPEAT 9:
        A = A + 9
        A = A + 2
        REPEAT 1:
            A = A + 6
            A = A + 8
        REPEAT 2:
            A = A + 9
            A = A + 4
        A = A + 7
    REPEAT 2:
        REPEAT 7:
            A = A + 3
            A = A + 5
        REPEAT 3:
            A = A + 5
            A = A + 3
            A = A + 6
            A = A + 4
        REPEAT 9:
            A = A + 2
            A = A + 8
            A = A + 2
        A = A + 3
    REPEAT 2:
        REPEAT 8:
            A = A + 5
            A = A + 1
        A = A + 6
        A = A + 1
    A = A + 2
    REPEAT 6:
        REPEAT 1:
            A = A + 3
        REPEAT 1:
            A = A + 2
        REPEAT 4:
            A = A + 7
            A = A + 1
        A = A + 8
        REPEAT 6:
            A = A + 5
        REPEAT 6:
            A = A + 3
        REPEAT 2:
            A = A + 2
            A = A + 9
        A = A + 7
    REPEAT 9:
        A = A + 8
        REPEAT 9:
            A = A + 8
            A = A + 9
            A = A + 3
        A = A + 2
        REPEAT 6:
            A = A + 3
        REPEAT 9:
            A = A + 1
        A = A + 9
        A = A + 5
        REPEAT 2:
            A = A + 4
            A = A + 9
        A = A + 8
        REPEAT 5:
            A = A + 6
            A = A + 9
        A = A + 1
    REPEAT 1:
        A = A + 4
    A = A + 2
    REPEAT 9:
        REPEAT 3:
            A = A + 4
        REPEAT 7:
            A = A + 8
            A = A + 3
        REPEAT 5:
            A = A + 9
        REPEAT 8:
            A = A + 9
            A = A + 8
        REPEAT 4:
            A = A + 7
        A = A + 7
    A = A + 3
A = A + 5
REPEAT 6:
    A = A + 7
REPEAT 7:
    A = A + 2
    A = A + 2
A = A + 1
REPEAT 8:
    REPEAT 1:
        REPEAT 4:
            A = A + 6
            A = A + 6
            A = A + 2
        REPEAT 5:
            A = A + 4
            A = A + 8
            A = A + 4
        REPEAT 1:
            A = A + 5
        REPEAT 7:
            A = A + 8
        REPEAT 6:
            A = A + 4
        A = A + 4
        A = A + 8
        REPEAT 4:
            A = A + 2
        REPEAT 2:
            A = A + 4
        REPEAT 2:
            A = A + 3
        REPEAT 1:
            A = A + 2
        A = A + 8
        REPEAT 2:
            A = A + 7
        REPEAT 8:
            A = A + 6
            A = A + 1
        A = A + 7
    REPEAT 8:
        A = A + 2
    REPEAT 8:
        REPEAT 6:
            A = A + 1
            A = A + 6
        REPEAT 2:
            A = A + 4
            A = A + 1
        A = A + 7
    A = A + 4
REPEAT 4:
    REPEAT 9:
        A = A + 2
    REPEAT 1:
        A = A + 2
    A = A + 5
REPEAT 8:
    REPEAT 6:
        A = A + 3
    REPEAT 4:
        A = A + 1
        A = A + 6
        A = A + 1
    REPEAT 7:
        A = A + 7
        REPEAT 7:
            A = A + 3
            A = A + 9
            A = A + 1
            A = A + 9
        REPEAT 3:
            A = A + 5
        A = A + 5
        A = A + 6
        A = A + 2
    REPEAT 1:
        A = A + 4
    REPEAT 2:
        A = A + 7
    REPEAT 1:
        A = A + 7
        REPEAT 4:
            A = A + 7
        A = A + 2
        REPEAT 5:
            A = A + 9
            A = A + 1
            A = A + 9
            A = A + 5
            A = A + 9
        REPEAT 5:
            A = A + 5
        REPEAT 1:
            A = A + 6
        REPEAT 2:
            A = A + 3
            A = A + 2
            A = A + 6
            A = A + 8
            A = A + 8
            A = A + 7
        A = A + 5
    A = A + 5
REPEAT 2:
    A = A + 1
    A = A + 7
A = A + 3
REPEAT 2:
    A = A + 7
A = A + 1
A = A + 4
REPEAT 1:
    REPEAT 7:
        REPEAT 2:
            A = A + 3
            A = A + 5
            A = A + 2
        A = A + 6
    A = A + 1
A = A + 2
A = A + 4
A = A + 9
REPEAT 1:
    A = A + 8
REPEAT 8:
    REPEAT 4:
        REPEAT 8:
            A = A + 4
        REPEAT 3:
            A = A + 1
            A = A + 8
        REPEAT 7:
            A = A + 8
        REPEAT 7:
            A = A + 7
        A = A + 7
        REPEAT 7:
            A = A + 6
        REPEAT 5:
            A = A + 9
        A = A + 3
        REPEAT 4:
            A = A + 5
        A = A + 5
    A = A + 4
    REPEAT 9:
        REPEAT 3:
            A = A + 4
            A = A + 3
            A = A + 6
        REPEAT 1:
            A = A + 3
            A = A + 3
            A = A + 6
        REPEAT 6:
            A = A + 7
            A = A + 7
            A = A + 5
            A = A + 5
            A = A + 1
            A = A + 2
        A = A + 6
        A = A + 6
    REPEAT 9:
        A = A + 6
    REPEAT 1:
        REPEAT 2:
            A = A + 4
            A = A + 7
        REPEAT 3:
            A = A + 6
        REPEAT 5:
            A = A + 3
        A = A + 6
        REPEAT 9:
            A = A + 3
        A = A + 6
    REPEAT 5:
        A = A + 8
        A = A + 8
        REPEAT 3:
            A = A + 7
            A = A + 9
            A = A + 8
            A = A + 3
        A = A + 3
    A = A + 9
REPEAT 6:
    A = A + 9
A = A + 1
REPEAT 4:
    REPEAT 1:
        A = A + 7
    REPEAT 9:
        A = A + 2
        A = A + 9
    A = A + 1
A = A + 2
A = A + 8
A = A + 7
A = A + 9
A = A + 6
REPEAT 4:
    REPEAT 2:
        A = A + 3
    REPEAT 3:
        A = A + 4
    A = A + 4
REPEAT 6:
    A = A + 6
A = A + 1
A = A + 5
A = A + 8
REPEAT 2:
    A = A + 6
    REPEAT 1:
        REPEAT 2:
            A = A + 2
        REPEAT 3:
            A = A + 1
        REPEAT 1:
            A = A + 8
            A = A + 7
            A = A + 4
            A = A + 2
            A = A + 8
        A = A + 4
    REPEAT 5:
        REPEAT 6:
            A = A + 8
        REPEAT 9:
            A = A + 5
        A = A + 5
    REPEAT 5:
        A = A + 5
    REPEAT 3:
        REPEAT 5:
            A = A + 4
        REPEAT 4:
            A = A + 6
            A = A + 3
        REPEAT 7:
            A = A + 3
            A = A + 3
            A = A + 1
            A = A + 7
            A = A + 7
            A = A + 6
            A = A + 5
            A = A + 5
        A = A + 6
    REPEAT 1:
        A = A + 9
    A = A + 3
    REPEAT 1:
        REPEAT 1:
            A = A + 1
        REPEAT 8:
            A = A + 5
        REPEAT 8:
            A = A + 6
        REPEAT 4:
            A = A + 9
        A = A + 4
    REPEAT 2:
        A = A + 3
        A = A + 7
        REPEAT 5:
            A = A + 7
            A = A + 5
            A = A + 8
        A = A + 7
        A = A + 8
    A = A + 5
    REPEAT 2:
        A = A + 5
    A = A + 7
    A = A + 8
A = A + 5
A = A + 9
REPEAT 2:
    REPEAT 6:
        A = A + 9
        A = A + 1
        A = A + 8
        A = A + 7
        A = A + 1
        A = A + 5
    REPEAT 3:
        A = A + 3
        A = A + 9
        A = A + 7
    REPEAT 3:
        A = A + 9
    A = A + 1
    REPEAT 6:
        A = A + 1
    REPEAT 9:
        REPEAT 7:
            A = A + 3
        REPEAT 5:
            A = A + 5
            A = A + 8
            A = A + 8
            A = A + 1
            A = A + 2
        REPEAT 4:
            A = A + 6
        REPEAT 3:
            A = A + 3
        A = A + 7
    REPEAT 8:
        REPEAT 1:
            A = A + 7
        A = A + 8
        A = A + 3
    A = A + 1
A = A + 2
A = A + 4
A = A + 7
REPEAT 1:
    REPEAT 1:
        REPEAT 1:
            A = A + 4
            A = A + 6
        REPEAT 1:
            A = A + 3
            A = A + 9
            A = A + 6
        REPEAT 9:
            A = A + 1
            A = A + 6
        REPEAT 5:
            A = A + 3
            A = A + 9
        A = A + 5
        A = A + 5
    A = A + 7
    A = A + 2
    REPEAT 2:
        A = A + 7
    A = A + 7
    REPEAT 7:
        REPEAT 4:
            A = A + 6
        A = A + 8
        REPEAT 6:
            A = A + 6
        REPEAT 2:
            A = A + 1
        A = A + 7
        A = A + 6
    A = A + 7
    REPEAT 4:
        REPEAT 7:
            A = A + 1
        REPEAT 2:
            A = A + 2
            A = A + 5
        A = A + 8
    A = A + 2
A = A + 1
A = A + 4
REPEAT 8:
    A = A + 5
A = A + 6
REPEAT 7:
    REPEAT 6:
        REPEAT 9:
            A = A + 7
            A = A + 8
        REPEAT 4:
            A = A + 6
            A = A + 4
            A = A + 3
            A = A + 6
        REPEAT 9:
            A = A + 3
        REPEAT 9:
            A = A + 2
        A = A + 7
    A = A + 5
    A = A + 2
REPEAT 7:
    REPEAT 8:
        REPEAT 6:
            A = A + 4
            A = A + 9
            A = A + 5
            A = A + 3
        A = A + 9
    REPEAT 4:
        REPEAT 1:
            A = A + 6
            A = A + 8
        REPEAT 1:
            A = A + 6
        A = A + 4
        A = A + 6
    REPEAT 3:
        A = A + 7
        REPEAT 3:
            A = A + 4
            A = A + 4
            A = A + 2
        A = A + 3
        A = A + 7
    REPEAT 5:
        A = A + 6
        A = A + 5
    REPEAT 1:
        REPEAT 8:
            A = A + 5
        REPEAT 3:
            A = A + 6
        REPEAT 9:
            A = A + 4
        A = A + 3
    REPEAT 6:
        REPEAT 2:
            A = A + 1
        A = A + 5
    A = A + 2
A = A + 2
A = A + 7
REPEAT 4:
    A = A + 7
A = A + 9
A = A + 2
REPEAT 8:
    A = A + 9
    REPEAT 9:
        REPEAT 2:
            A = A + 3
            A = A + 2
            A = A + 1
            A = A + 5
        REPEAT 9:
            A = A + 1
            A = A + 3
        A = A + 9
        REPEAT 7:
            A = A + 2
        REPEAT 5:
            A = A + 9
            A = A + 3
        REPEAT 2:
            A = A + 4
        REPEAT 8:
            A = A + 9
        REPEAT 5:
            A = A + 5
            A = A + 4
        A = A + 2
    A = A + 4
    REPEAT 6:
        A = A + 2
        REPEAT 5:
            A = A + 7
            A = A + 7
            A = A + 8
            A = A + 3
        REPEAT 8:
            A = A + 2
            A = A + 5
        REPEAT 1:
            A = A + 8
            A = A + 5
            A = A + 1
            A = A + 1
        A = A + 5
        REPEAT 2:
            A = A + 6
        REPEAT 6:
            A = A + 9
            A = A + 2
        A = A + 5
        REPEAT 4:
            A = A + 7
        A = A + 1
        REPEAT 6:
            A = A + 8
        A = A + 4
    REPEAT 3:
        REPEAT 2:
            A = A + 1
            A = A + 5
        REPEAT 2:
            A = A + 7
        REPEAT 9:
            A = A + 6
            A = A + 8
            A = A + 9
        A = A + 5
    REPEAT 9:
        REPEAT 3:
            A = A + 7
            A = A + 7
        A = A + 9
        A = A + 7
        REPEAT 5:
            A = A + 7
            A = A + 2
        A = A + 1
    A = A + 8
    A = A + 3
    A = A + 5
A = A + 1
REPEAT 8:
    A = A + 4
A = A + 2
A = A + 2
A = A + 8
REPEAT 4:
    REPEAT 4:
        A = A + 8
        REPEAT 7:
            A = A + 5
            A = A + 2
        REPEAT 2:
            A = A + 6
        REPEAT 4:
            A = A + 8
            A = A + 6
        A = A + 1
    A = A + 3
A = A + 2
A = A + 7
A = A + 4
REPEAT 8:
    A = A + 2
    A = A + 4
REPEAT 5:
    REPEAT 3:
        REPEAT 6:
            A = A + 8
            A = A + 1
        A = A + 6
    A = A + 5
    A = A + 9
REPEAT 8:
    A = A + 7
REPEAT 6:
    A = A + 4
A = A + 5
REPEAT 3:
    A = A + 1
    REPEAT 1:
        REPEAT 5:
            A = A + 6
        A = A + 2
    REPEAT 9:
        REPEAT 5:
            A = A + 9
            A = A + 3
        REPEAT 9:
            A = A + 9
        A = A + 8
    REPEAT 8:
        REPEAT 5:
            A = A + 9
            A = A + 4
        REPEAT 9:
            A = A + 3
        A = A + 4
    A = A + 5
REPEAT 9:
    REPEAT 7:
        A = A + 5
    REPEAT 3:
        A = A + 7
    REPEAT 9:
        REPEAT 6:
            A = A + 4
        A = A + 6
    REPEAT 5:
        REPEAT 6:
            A = A + 5
            A = A + 3
        A = A + 3
    A = A + 3
    A = A + 5
    REPEAT 7:
        A = A + 5
        REPEAT 2:
            A = A + 5
            A = A + 6
        REPEAT 2:
            A = A + 2
        A = A + 5
    A = A + 3
A = A + 5
A = A + 5
REPEAT 4:
    A = A + 2
    A = A + 1
    REPEAT 9:
        A = A + 9
        A = A + 5
        A = A + 6
        A = A + 2
        A = A + 2
        A = A + 5
    REPEAT 9:
        A = A + 5
    A = A + 4
    REPEAT 4:
        REPEAT 4:
            A = A + 1
            A = A + 2
        REPEAT 6:
            A = A + 9
            A = A + 3
        REPEAT 2:
            A = A + 5
            A = A + 1
            A = A + 1
            A = A + 3
        A = A + 8
        REPEAT 7:
            A = A + 4
        REPEAT 6:
            A = A + 9
        REPEAT 5:
            A = A + 9
            A = A + 8
            A = A + 3
        A = A + 9
        A = A + 4
    A = A + 6
REPEAT 7:
    A = A + 9
REPEAT 9:
    A = A + 4
    A = A + 9
    A = A + 1
    A = A + 3
    REPEAT 5:
        REPEAT 1:
            A = A + 4
            A = A + 4
        REPEAT 8:
            A = A + 9
            A = A + 6
            A = A + 2
        REPEAT 3:
            A = A + 4
            A = A + 4
        REPEAT 3:
            A = A + 5
            A = A + 2
            A = A + 8
            A = A + 3
            A = A + 6
            A = A + 4
            A = A + 9
            A = A + 1
        A = A + 9
        A = A + 5
        A = A + 3
        REPEAT 3:
            A = A + 2
            A = A + 5
            A = A + 8
            A = A + 2
        A = A + 5
    REPEAT 8:
        REPEAT 2:
            A = A + 6
        A = A + 7
    A = A + 6
    A = A + 9
    A = A + 2
REPEAT 2:
    A = A + 3
    REPEAT 8:
        A = A + 7
        A = A + 2
        A = A + 1
        A = A + 4
        A = A + 1
        A = A + 5
    A = A + 2
    A = A + 1
    REPEAT 1:
        A = A + 1
    REPEAT 6:
        A = A + 4
        A = A + 3
    A = A + 3
    REPEAT 5:
        A = A + 3
    REPEAT 6:
        REPEAT 1:
            A = A + 5
            A = A + 7
            A = A + 7
            A = A + 7
        REPEAT 5:
            A = A + 9
        A = A + 7
        REPEAT 5:
            A = A + 9
            A = A + 1
            A = A + 9
        A = A + 8
        REPEAT 1:
            A = A + 2
        REPEAT 5:
            A = A + 8
        REPEAT 3:
            A = A + 2
            A = A + 9
        A = A + 6
        A = A + 3
    REPEAT 5:
        REPEAT 6:
            A = A + 5
            A = A + 5
        REPEAT 4:
            A = A + 5
        A = A + 4
        REPEAT 8:
            A = A + 9
            A = A + 1
        REPEAT 8:
            A = A + 8
            A = A + 1
        A = A + 4
        REPEAT 6:
            A = A + 6
        REPEAT 2:
            A = A + 3
            A = A + 9
            A = A + 6
            A = A + 9
        REPEAT 1:
            A = A + 4
        REPEAT 3:
            A = A + 3
            A = A + 4
            A = A + 2
            A = A + 8
        REPEAT 2:
            A = A + 4
        A = A + 1
        REPEAT 9:
            A = A + 2
        A = A + 9
    A = A + 7
REPEAT 7:
    REPEAT 7:
        REPEAT 5:
            A = A + 7
        REPEAT 5:
            A = A + 1
        A = A + 1
    REPEAT 5:
        A = A + 6
        REPEAT 1:
            A = A + 4
        REPEAT 9:
            A = A + 4
        A = A + 1
    REPEAT 6:
        A = A + 8
        A = A + 5
        REPEAT 1:
            A = A + 4
        REPEAT 5:
            A = A + 8
            A = A + 7
        A = A + 2
    REPEAT 3:
        A = A + 3
    REPEAT 8:
        REPEAT 8:
            A = A + 4
        A = A + 7
        REPEAT 5:
            A = A + 1
        REPEAT 8:
            A = A + 7
            A = A + 8
            A = A + 4
        A = A + 7
        A = A + 6
    A = A + 9
    A = A + 5
REPEAT 3:
    A = A + 5
    REPEAT 9:
        A = A + 1
    A = A + 7
REPEAT 1:
    A = A + 8
A = A + 4
REPEAT 8:
    REPEAT 7:
        A = A + 2
        REPEAT 4:
            A = A + 6
        A = A + 6
    REPEAT 1:
        A = A + 7
    A = A + 1
REPEAT 9:
    REPEAT 5:
        A = A + 6
        A = A + 5
        REPEAT 7:
            A = A + 3
            A = A + 6
        A = A + 8
    REPEAT 2:
        A = A + 7
    A = A + 1
    A = A + 9
    REPEAT 3:
        REPEAT 3:
            A = A + 5
```

通过观察`prog.txt` 文件，`REPEAT 关键字 就等价于我们编程之中的for循环`，并且其中对齐进行求和还是很有规律的。

![image-20240124203742958](19_REPEAT 程序.assets/image-20240124203742958-17060998641401.png)

| 式子     | A = A + 4 | A = A + 5 | A = A + 7 | A = A + 8 | A = A + 9 |
| :------- | :-------- | :-------- | :-------- | :-------- | :-------- |
| 循环次数 | 2         | 2 * 5 * 6 | 2 * 5     | 2         | 1         |

计算A的和： 2 * 4 + 2 * 5 * 6 * 5 + 2 * 5 * 7 + 2 * 8 + 1 * 9 = [403](https://so.csdn.net/so/search?q=403&spm=1001.2101.3001.7020)

规律是每一项的循环次数分别乘以这个被加的数字 这里称为 x，x在上图的取值可以是4，可以是5，或者7，或者8 或者9.



到这里，大前提已经建立了，这时候，我们就可以开始写代码了，废话不多说，直接上代码：

```c
#include <iostream>
int main()
{
	char szBuf[256] = {0};//读文件每一行内容存到该缓冲区中
	int fact[10]; //下标表示for循环层数，值存循环走多少次
	FILE* fp = NULL;
	int now = 0; //存循环层级
	int resultSum = 0; //存最终结果总和

	fp = fopen("prog.txt", "r");
	if (!fp)
	{
		printf("错误!文件以只读的方式打开失败了!");
		return -1;
	}

	//跳过第一行 A初始化
	fgets(szBuf, 255, fp);

	//读每一行
	while (fgets(szBuf, 255, fp))
	{
		//查循环层数
		int p = 0;
		while (szBuf[p] == ' ')
		{
			p++;
		}
		now = p / 4;//4个空格为一层循环

		//查当前循环次数
		if (szBuf[p] == 'R')
		{
			fact[now] = (szBuf[p + 7] - '0'); //存 循环层数（下标）找循环次数的关系
		}

		//计算一次总和
		if (szBuf[p] == 'A')
		{
			int times = 1;
			int x = szBuf[p + 8] - '0'; //拿到要加的数x

			//层级*次数 得到最终循环总次数Number1
			for (int i = 0; i < now; i++)
			{
				times = times * fact[i];
			}
			//上规律，结果值等价于 循环总次数Number1 * 要加的数x
			resultSum = resultSum + times * x;

			// 注意：这里不要这样！！ memset(fact, 0, sizeof(int) * 10);
		}
	}
	std::cout << resultSum;

}


```

笔者要读者注意的原因是，还有一个情况，层数刚开始增加，后面会慢慢出去，也就是层数减少。

![image-20240124205838473](19_REPEAT 程序.assets/image-20240124205838473-17061011196902.png)

这个时候清空了，就没办法应对这种情况了。