

# OpenCV初探

## 显示图片



:::details `一个简单加载并显示图像的OpenCV程序`

```c
#include<opencv2/opencv.hpp>
#include<iostream>
using namespace std;
using namespace cv;

void help(char** argv)
{
	std::cout << "\n"
		<< "A simple OpenCV program that loads and displays an image from disk\n"
		<< argv[0] << " <path/filename>\n"
		<< "For example:\n"
		<< argv[0] << " ../fruits.jpg\n"
		<< std::endl;
}
int main(int argc, char** argv) 
{
	if (argc != 2) 
	{
		help(argv);
		return 0;
	}
	cv::Mat img = cv::imread(argv[1], -1);
	if (img.empty()) return -1;

	cv::namedWindow("Example 2-1", cv::WINDOW_AUTOSIZE);
	cv::imshow("Example 2-1", img);
	cv::waitKey(0);
	cv::destroyWindow("Example 2-1");
	return 0;
}
```

:::





:::details `与示例2-1不同的时直接使用了using namespace`

```c
// Example 2-2. Same as Example 2-1 but employing the “using namespace” directive
#include<opencv2/opencv.hpp>
#include<iostream>
using namespace std;
using namespace cv;

void help(char** argv)
{
	std::cout << "\n"
		<< "2.2: Like 2.1, but 'using namespace cv: \n"
		<< argv[0] << " <path/image>\n"
		<< "For example:\n"
		<< argv[0] << " ../fruits.jpg\n"
		<< std::endl;
}

int main(int argc, char** argv)
{

	if (argc != 2) 
	{
		help(argv);
		return 0;
	}
	Mat img = imread(argv[1], -1);
	if (img.empty()) return -1;
	namedWindow("Example 2-2", cv::WINDOW_AUTOSIZE);
	imshow("Example 2-2", img);
	waitKey(0);
	destroyWindow("Example 2-2");
}

```

:::



## 第二个程序：视频



:::details `一个简单播放视频文件的OpenCV程序`

```c
// Example 2-3. A simple OpenCV program for playing a video file from disk

#include<opencv2/opencv.hpp>
#include<iostream>
using namespace std;
using namespace cv;
void help(char** argv)
{
	std::cout << "\n"
		<< "2-03: play video from disk \n"
		<< argv[0] << " <path/video>\n"
		<< "For example:\n"
		<< argv[0] << " ../tree.avi\n"
		<< std::endl;
}
int main(int argc, char** argv) 
{
	if (argc != 2) 
	{
		help(argv);
		return 0;
	}
	cv::namedWindow("Example 2-3", cv::WINDOW_AUTOSIZE);
	cv::VideoCapture cap;

	cap.open(string(argv[1]));
		cout << "Opened file: " << argv[1] << endl;
	cv::Mat frame;
	for (;;)
	{
		cap >> frame;
		if (frame.empty()) break; // Ran out of film
		cv::imshow("Example 2-3", frame);
		if ((char)cv::waitKey(33) >= 0) break;
	}
	return 0;
}

```

:::



:::details `加入了滚动条的基本浏览窗口`

```
1
```

:::











