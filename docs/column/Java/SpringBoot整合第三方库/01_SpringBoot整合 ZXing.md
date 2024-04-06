# SpringBoot整合 ZXing

# 前言

在数字化时代，二维码已经成为了信息交流的一种常见方式。它们被广泛用于各种应用，从产品标签到活动传单，以及电子支付。本文将向您展示如何在Spring Boot应用程序中整合ZXing库，以创建和解析QR码。

# 介绍QR码和ZXing

QR码，全名Quick Response码，是一种二维码（2D barcode）的类型，最早由日本公司Denso Wave于1994年开发。它是一种能够存储各种数据类型的矩阵二维条码，通常以黑色模块和白色背景的方式呈现。QR码可以存储文本、URL、联系信息、地理位置等多种信息，因此在移动设备、广告传播、商品标识等领域广泛使用。



ZXing，全名为"Zebra Crossing"，是一个开源的Java库，用于二维码的生成和解析。它是一个强大的工具，可以用于生成QR码以及解析包括QR码在内的多种二维码格式。ZXing提供了多种编程语言的API，使开发者能够轻松集成二维码功能到他们的应用中。它支持多种平台，包括Android、iOS、Java等。除了QR码，ZXing还支持解析其他一维码和二维码，例如EAN、UPC、DataMatrix等。

使用ZXing库，你可以轻松地将QR码功能集成到你的软件开发项目中，无论是生成QR码以供分享，还是解析QR码以获取其中的信息。在实际使用中，你可以添加注释来解释代码中的关键部分，以帮助其他开发者理解你的实现。这对于团队协作和维护代码非常有帮助。



# SpringBoot 整合zxing

### 添加Zxing依赖

在你的Maven项目的pom.xml文件中添加ZXing库的依赖非常简单。你可以在`<dependencies>`标签内添加以下ZXing依赖：

```java
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.wnx.naizi</groupId>
    <artifactId>SpringBootMerge</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>SpringBootMerge</name>
    <description>SpringBootMerge</description>
    <properties>
        <java.version>17</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/com.google.zxing/core -->
        <dependency>
            <groupId>com.google.zxing</groupId>
            <artifactId>core</artifactId>
            <version>3.5.2</version>
        </dependency>


        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```

### 编写组件

```java
package com.wnx.naizi.springbootmerge.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.util.HashMap;
import java.util.Map;
import java.io.File;

@Component
public class BarcodeGeneratorService
{

    /**
     * 生成条形码
     * @param data 要存储在条形码中的数据，可以是商品条形码等。
     * @param width 条形码的宽度（像素）。
     * @param height 条形码的高度（像素）。
     * @param filePath 生成的条形码文件的保存路径。
     */
    public void generateBarcode(String data, int width, int height, String filePath) {
        try {
            Map<EncodeHintType, Object> hints = new HashMap<>();

            // 设置字符编码
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

            MultiFormatWriter writer = new MultiFormatWriter();
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.CODE_128, width, height, hints);

            // 创建BufferedImage对象来表示条形码
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);


            // 生成黑色条和白色背景的条形码
            for (int x = 0; x < width; x++)
            {
                for (int y = 0; y < height; y++) {
                    image.setRGB(x, y, bitMatrix.get(x, y) ? 0 : 0xFFFFFF);
                }
            }

            // 将条形码保存到文件
            File barcodeFile = new File(filePath);
            ImageIO.write(image, "png", barcodeFile);

            System.out.println("条形码已生成并保存到: " + filePath);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

```

```java
package com.wnx.naizi.springbootmerge.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Component;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Component
public class QRCodeGeneratorService
{
    /**
     * 生成二维码
     * @param data 要存储在QR码中的数据，可以是文本、URL等。
     * @param width QR码的宽度（像素）
     * @param height QR码的高度（像素）
     * @param filePath 生成的QR码文件的保存路径
     */
    public void generateQRCode(String data, int width, int height, String filePath) {
        try {

            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8"); // 设置字符编码
            hints.put(EncodeHintType.ERROR_CORRECTION, com.google.zxing.qrcode.decoder.ErrorCorrectionLevel.H); // 错误纠正级别
            hints.put(EncodeHintType.MARGIN, 1); // 二维码边距

            MultiFormatWriter writer = new MultiFormatWriter();
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, width, height, hints);

            // 创建BufferedImage对象来表示QR码
            BufferedImage image = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
            for (int x = 0; x < width; x++) {
                for (int y = 0; y < height; y++) {
                    image.setRGB(x, y, bitMatrix.get(x, y) ? Color.BLACK.getRGB() : Color.WHITE.getRGB());
                }
            }

            // 将QR码保存到文件
            File qrCodeFile = new File(filePath);
            ImageIO.write(image, "png", qrCodeFile);

            System.out.println("QR码已生成并保存到: " + filePath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}

```

### 测试验证

```java
package com.wnx.naizi.springbootmerge;

import com.wnx.naizi.springbootmerge.service.BarcodeGeneratorService;
import com.wnx.naizi.springbootmerge.service.QRCodeGeneratorService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringBootMergeApplicationTests {

    @Autowired
    private QRCodeGeneratorService qrCodeGenerator;

    @Autowired
    private BarcodeGeneratorService barcodeGeneratorService;

    @Test
    @DisplayName("生成二维码")
    void GenQRCode()
    {
        String data = "https://todoitbo.fun"; // 要存储在QR码中的数据
        int width = 300; // QR码的宽度
        int height = 300; // QR码的高度
        String filePath = "qrcode.png"; // 生成的QR码文件的路径

        qrCodeGenerator.generateQRCode(data, width, height, filePath);


        System.out.println("HelloWorld!");
    }

    @Test
    @DisplayName("生成条形码")
    void GenBarCode()
    {
        BarcodeGeneratorService barcodeGenerator = new BarcodeGeneratorService();
        String data = "123456789"; // 要存储在条形码中的数据
        int width = 200; // 条形码的宽度
        int height = 100; // 条形码的高度
        String filePath = "barcode.png"; // 生成的条形码文件的路径
        barcodeGenerator.generateBarcode(data, width, height, filePath);
    }

}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231204213515041.png)