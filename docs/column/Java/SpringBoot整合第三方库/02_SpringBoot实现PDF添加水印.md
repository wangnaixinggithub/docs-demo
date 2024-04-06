# SpringBoot 实现 PDF 添加水印



PDF（Portable Document Format，便携式文档格式）是一种流行的文件格式，它可以在多个操作系统和应用程序中进行查看和打印。在某些情况下，我们需要对 PDF 文件添加水印，以使其更具有辨识度或者保护其版权。本文将介绍如何使用 Spring Boot 来实现 PDF 添加水印的方式。

## 使用 Apache PDFBox 库

PDFBox 是一个流行的、免费的、用 Java 编写的库，它可以用来创建、修改和提取 PDF 内容。PDFBox 提供了许多 API，包括添加文本水印的功能。

```xml
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

        <!--pdfbox 添加水印的Java库-->
        <dependency>
            <groupId>org.apache.pdfbox</groupId>
            <artifactId>pdfbox</artifactId>
            <version>2.0.24</version>
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

下面是使用 PDFBox 来实现 PDF 添加水印的完整代码：

```java
package com.wnx.naizi.springbootmerge.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
public class PdfBoxWatermarkService
{
    public void AddWaterMark(String pdfPath)
    {

        try
        {
            // 读取原始 PDF 文件
            PDDocument document = PDDocument.load(new File(pdfPath));


            // 遍历 PDF 中的所有页面
            for (int i = 0; i < document.getNumberOfPages(); i++)
            {
                PDPage page = document.getPage(i);
                PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true, true);

                // 设置字体和字号
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 36);

                // 设置透明度
                contentStream.setNonStrokingColor(200, 200, 200);

                // 添加文本水印
                contentStream.beginText();
                contentStream.newLineAtOffset(100, 100); // 设置水印位置
                contentStream.showText("Watermark-JacksonWang"); // 设置水印内容
                contentStream.endText();
                contentStream.close();
            }

            document.save(new File("output.pdf"));

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
}

```

```java
package com.wnx.naizi.springbootmerge;

import com.wnx.naizi.springbootmerge.service.PdfBoxWatermarkService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class PdfAddWatermarkServiceTest
{
    @Autowired
    private PdfBoxWatermarkService pdfBoxWatermarkService;

    @Test
    @DisplayName("给PDF添加水印")
    public void testAddWaterMark()
    {
        String pdfPath = "E:\\Effective_STL_中文版_50条有效使用STL的经验.pdf";
        pdfBoxWatermarkService.AddWaterMark(pdfPath);
    }
}
```

## 使用 iText 库

iText 是一款流行的 Java PDF 库，它可以用来创建、读取、修改和提取 PDF 内容。iText 提供了许多 API，包括添加文本水印的功能。

```xml
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



        <!--PDF处理库-->
        <dependency>
            <groupId>com.itextpdf</groupId>
            <artifactId>itextpdf</artifactId>
            <version>5.5.13</version>
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

```java
package com.wnx.naizi.springbootmerge.service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import org.springframework.stereotype.Component;

import java.io.FileOutputStream;

@Component
public class ItextWatermarkService {

    public void AddWaterMark(String pdfPath)
    {
        try {
            // 读取原始 PDF 文件
            PdfReader reader = new PdfReader(pdfPath);
            PdfStamper stamper = new PdfStamper(reader, new FileOutputStream("output.pdf"));

            // 获取 PDF 中的页数
            int pageCount = reader.getNumberOfPages();


            // 添加水印
            for (int i = 1; i <= pageCount; i++) {
                PdfContentByte contentByte = stamper.getOverContent(i); // 或者 getOverContent()
                contentByte.beginText();
                contentByte.setFontAndSize(BaseFont.createFont(), 36f);
                contentByte.setColorFill(BaseColor.LIGHT_GRAY);
                contentByte.showTextAligned(Element.ALIGN_CENTER, "Watermark", 300, 400, 45);
                contentByte.endText();
            }

            // 保存修改后的 PDF 文件并关闭文件流
            stamper.close();
            reader.close();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}

```



```java
package com.wnx.naizi.springbootmerge.service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import org.springframework.stereotype.Component;

import java.io.FileOutputStream;

@Component
public class ItextWatermarkService {

    public void AddWaterMark(String pdfPath)
    {
        try {
            // 读取原始 PDF 文件
            PdfReader reader = new PdfReader(pdfPath);
            PdfStamper stamper = new PdfStamper(reader, new FileOutputStream("output.pdf"));

            // 获取 PDF 中的页数
            int pageCount = reader.getNumberOfPages();


            // 添加水印
            for (int i = 1; i <= pageCount; i++) {
                PdfContentByte contentByte = stamper.getOverContent(i); // 或者 getOverContent()
                contentByte.beginText();
                contentByte.setFontAndSize(BaseFont.createFont(), 36f);
                contentByte.setColorFill(BaseColor.LIGHT_GRAY);
                contentByte.showTextAligned(Element.ALIGN_CENTER, "Watermark", 300, 400, 45);
                contentByte.endText();
            }

            // 保存修改后的 PDF 文件并关闭文件流
            stamper.close();
            reader.close();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }
}
```

## SpringBoot接口整合

```java
package com.wnx.naizi.springbootmerge.controller;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Element;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/api/pdf")
public class PdfController {


    @PostMapping("/addTextWatermark")
    public ResponseEntity<byte[]> addTextWatermark(@RequestParam("file") MultipartFile file) throws Exception
    {

        // 读取原始 PDF 文件
        PdfReader reader = new PdfReader(file.getInputStream());

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        //构建PDF盖章器
        PdfStamper stamper = new PdfStamper(reader, outputStream);

        // 获取 PDF 中的页数
        int pageCount = reader.getNumberOfPages();

        // 添加水印
        for (int i = 1; i <= pageCount; i++) {
            PdfContentByte contentByte = stamper.getOverContent(i); // 或者 getOverContent()
            contentByte.beginText();
            contentByte.setFontAndSize(BaseFont.createFont(), 36f);
            contentByte.setColorFill(BaseColor.LIGHT_GRAY);
            contentByte.showTextAligned(Element.ALIGN_CENTER, "Watermark", 300, 400, 45);
            contentByte.endText();
        }

        // 保存修改后的 PDF 文件并关闭文件流
        stamper.close();
        reader.close();
        
        //响应流数据返回
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"watermarked.pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(outputStream.toByteArray());

    }

}
```

这里使用了两个 RESTful API：`/addTextWatermark` 分别用于添加文本水印。在请求中通过 `file` 参数传递 PDF 文件。

下面介绍如何使用 Postman 来测试 Spring Boot 应用程序的 API。

1. 下载并安装 Postman。
2. 打开 Postman，选择 POST 请求方法。
3. 在 URL 地址栏中输入 `http://localhost:8080/api/pdf/addTextWatermark`。
4. 在 Headers 标签页中设置 Content-Type 为 multipart/form-data。
5. 在 Body 标签页中选择 form-data 类型，然后设置 key 为 `file`，value 选择本地的 PDF 文件。
6. 点击 Send 按钮发送请求，等待应答结果。



处理结果将会在响应的 Body 中返回，也可以选择浏览器下载或保存到本地磁盘。可以看到文件是带上水印的。





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231205224249683-17017873711701.png)

一般情况下，SpringMVC会限制用户上传文件的大小，如果文件太大，则会出现如下错误，因此我们可以对配置进行微调完成本次测试。

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231205224510519.png)

```yaml
spring:
  servlet:
    multipart:
      max-file-size: 500MB
      enabled: true
      max-request-size: 500MB
```

## 扩展

一般来说，通过还有需求是给PDF添加图片的，类似电子印章。我们可以通过给PDF插入图片实现。类似红框处，读者可以自行使用上述库进行尝试。



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20231205224734031-17017876554502.png)