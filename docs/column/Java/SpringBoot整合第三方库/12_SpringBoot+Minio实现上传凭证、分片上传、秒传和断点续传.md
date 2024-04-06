# SpringBoot+Minio实现上传凭证、分片上传、秒传和断点续传

## 概述



Spring Boot整合Minio后，前端的文件上传有两种方式：

**1.文件上传到后端，由后端保存到Minio**



这种方式好处是完全由后端集中管理，可以很好的做到、身份验证、权限控制、文件与处理等，并且可以做一些额外的业务逻辑，比如生成缩略图、提取元数据等。

缺点也很明显：

- 延迟时间高了，本来花费上传一次文件的时间，现在多了后端保存到Minio的时间
- 后端资源占用，后端本来可以只处理业务请求，现在还要负责文件流，增加了性能压力
- 单点故障，Minio即便做了集群，但是如果后端服务器故障，也会导致Minio不可用

所以，实际上我们不会把文件传到后端，而是直接传给Minio，其实这也符合OSS服务的使用方式。



**2.文件向后端申请上传凭证，然后直接上传到Minio**

为了避免Minio被攻击，我们需要结合后端，让后端生成并返回一个有时效的上传凭证，前端拿着这个凭证才能去上传，通过这种方式，我们可以做到一定程度的权限控制，本文要分享的就是这种方式。

## 环境准备

部署好的Minio环境：



> http://mylocalhost:9001



## Spring Boot整合Minio



简单过一下整合方式把。



### 先引入Minio依赖

```xml
# pom.xml
<dependency>
    <groupId>io.minio</groupId>
    <artifactId>minio</artifactId>
    <version>7.1.0</version>
</dependency>
```

### 然后定义配置信息

```yaml
# application.yml
minio:
  endpoint: http://mylocalhost:9001
  accessKey: minio
  secretKey: minio123
  bucket: demo
```

### 定义一个属性类

```java
@Component
@ConfigurationProperties(prefix = "minio")
public class MinioProperties {
    /**
     * 对象存储服务的URL
     */
    private String endpoint;
    /**
     * Access key就像用户ID，可以唯一标识你的账户
     */
    private String accessKey;
    /**
     * Secret key是你账户的密码
     */
    private String secretKey;

    /**
     * 默认文件桶
     */
    private String bucket;
    
    ...
}
```

### 定义Minio配置类

```java
@Configuration
public class MinioConfig {
    @Bean
    public MinioClient minioClient(MinioProperties properties){
        try {
            MinioClient.Builder builder = MinioClient.builder();
            builder.endpoint(properties.getEndpoint());
            if (StringUtils.hasLength(properties.getAccessKey()) && StringUtils.hasLength(properties.getSecretKey())) {
                builder.credentials(properties.getAccessKey(),properties.getSecretKey());
            }
            return builder.build();
        } catch (Exception e) {
            return null;
        }
    }
}
```

现在启动服务即可。

### 上传凭证

写一个接口，返回上传凭证：

```java
@RequestMapping(value = "/presign", method = {RequestMethod.POST})
public Map<String, String> presign(@RequestBody PresignParam presignParam) {
    // 如果前端不指定桶，那么给一个默认的
    if (StringUtils.isEmpty(presignParam.getBucket())) {
        presignParam.setBucket("demo");
    }

    // 前端不指定文件名称，就给一个UUID
    if (StringUtils.isEmpty(presignParam.getFilename())) {
        presignParam.setFilename(UUID.randomUUID().toString());
    }

    // 如果想要以子目录的方式保存，就在前面加上斜杠来表示
    //        presignParam.setFilename("/2023/" + presignParam.getFilename());

    // 设置凭证过期时间
    ZonedDateTime expirationDate = ZonedDateTime.now().plusMinutes(10);
    // 创建一个凭证
    PostPolicy policy = new PostPolicy(presignParam.getBucket(), presignParam.getFilename(), expirationDate);
    // 限制文件大小，单位是字节byte，也就是说可以设置如：只允许10M以内的文件上传
    //        policy.setContentRange(1, 10 * 1024);
    // 限制上传文件请求的ContentType
    //        policy.setContentType("image/png");

    try {
        // 生成凭证并返回
        final Map<String, String> map = minioClient.presignedPostPolicy(policy);
        for (Map.Entry<String, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " = " + entry.getValue());
        }
        return map;
    } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
        e.printStackTrace();
    }

    return null;
}
```

上面的示例代码可以知道，我们还可以加一些权限认证，以判断用户是否有以下权限：

- 上传权限
- 可上传的文件大小
- 可上传的文件类型

请求参数类：

```java
public class PresignParam {
    // 桶名
    private String bucket;

    // 文件名
    private String filename;
    
    ...
}
```

这个接口的返回结果是：

```c
bucket: demo
x-amz-date: 20230831T042351Z
x-amz-signature: 79cc2ae0baee274d1d47cb29bdd5e99127059033503c2a02f904f0478a73ecac
key: 寂寞的季节.mp4
x-amz-algorithm: AWS4-HMAC-SHA256
x-amz-credential: minio/20230831/us-east-1/s3/aws4_request
policy: eyJleHBpcmF0aW9uIjoiMjAyMy0wOC0zMVQwNDozMzo1MS42MzZaIiwiY29uZGl0aW9ucyI6W1siZXEiLCIkYnVja2V0IiwiZGVtbyJdLFsiZXEiLCIka2V5Iiwi5a+C5a+e55qE5a2j6IqCLm1wNCJdLFsiZXEiLCIkeC1hbXotYWxnb3JpdGhtIiwiQVdTNC1ITUFDLVNIQTI1NiJdLFsiZXEiLCIkeC1hbXotY3JlZGVudGlhbCIsIm1pbmlvLzIwMjMwODMxL3VzLWVhc3QtMS9zMy9hd3M0X3JlcXVlc3QiXSxbImVxIiwiJHgtYW16LWRhdGUiLCIyMDIzMDgzMVQwNDIzNTFaIl1dfQ==
```

- `bucket`：表示目标桶
- `x-amz-date`：时间戳
- `x-amz-signature`：签名
- `key`：文件名
- `x-amz-algorithm`：签名算法
- `x-amz-credential`：认证授权
- `policy`：凭证token

前端收到后，将该凭证连同文件流一并上传到Minio服务器：

```js
uploadFile(file, policy) {
    console.log("准备上传文件：")
    console.log("file：" + file)
    console.log("policy：" + policy)
    var formData = new FormData()

    formData.append('file', file)
    formData.append('key', policy['key'])
    formData.append('x-amz-algorithm', policy['x-amz-algorithm'])
    formData.append('x-amz-credential', policy['x-amz-credential'])
    formData.append('x-amz-signature', policy['x-amz-signature'])
    formData.append('x-amz-date', policy['x-amz-date'])
    formData.append('policy', policy['policy'])

    return new Promise(((resolve, reject) => {
        $.ajax({
            method: 'POST',
            url: 'http://mylocalhost:9001/' + policy['bucket'],
            data: formData,
            dataType: 'json',
            contentType: false, // 必须设置为 false，不设置 contentType，让浏览器自动设置
            processData: false, // 必须设置为 false，不对 FormData 进行序列化处理
            // async: false, // 设置同步，方便等下做分片上传
            xhr: function xhr() {
                //获取原生的xhr对象
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    //添加 progress 事件监听
                    xhr.upload.addEventListener('progress', function (e) {
                        //e.loaded 已上传文件字节数
                        //e.total 文件总字节数
                        var percentage = parseInt(e.loaded / e.total * 100)
                        vm.uploadResult = percentage + "%" + "：" + policy['key']
                    }, false);
                }
                return xhr;
            },
            success: function (result) {
                vm.uploadResult = '文件上传成功：' + policy['key']
                resolve(result)
            },
            error: function (e) {
                reject()
            }
        })
    }))
},
```

这样就完成了获取上传凭证并上传文件。



### 分片上传、秒传、断点续传



#### 分片上传

分片上传可以用在大文件上传上，一个100M的文件可以分成10份，每份10M，一共传输10次，这有以下好处：

- Minio做了集群，用Nginx转发，那么分片上传可以降低单台Minio服务器的性能压力
- 多线程上传可以加快上传效率



#### 秒传

现在说说秒传，我们上传一个文件之前，可以用工具生成MD5字符串，就好像这样：

```
3cc1f3c3c2d1a29ecf60ffad4de278c7
```

然后拼接上文件名：

```
3cc1f3c3c2d1a29ecf60ffad4de278c7_寂寞的季节.mp4
```

这时候去向后端申请上传凭证的时候，后端可以先去看看文件是否已存在，如果文件已存在，就不用生成凭证了，直接告诉前端该文件已经上传完毕，由此实现文件秒传。



这样的好处是：

- 降低Minio服务器压力
- 响应秒回，用户体验提高

#### 断点续传

结合分片上传和秒传的原理，我们可以来做到断点续传。



**场景：** 当我们要上传一个大文件的时候，进度到一半了，这时候网络掉线导致上传失败，网络恢复后又要重新上传，这就很崩溃。



**处理方式：** 大文件也可以分成一个个小文件来上传，这样即便上传到一半网络掉线，恢复上传的时候可以跳过前一半已上传的部分，接着上传后面一半。



##### 文件合并

当我们分片上传后，后端还需要提供接口，来将所有分片数据合并：

```java
@GetMapping("/compose")
public void merge() {
    List<ComposeSource> sources = new ArrayList<>();
    // 分片数据放到另一个桶里面：slice
    sources.add(ComposeSource.builder()
                .bucket("slice")
                .object("0寂寞的季节.mp4")
                .build());
    sources.add(ComposeSource.builder()
                .bucket("slice")
                .object("1寂寞的季节.mp4")
                .build());
    sources.add(ComposeSource.builder()
                .bucket("slice")
                .object("2寂寞的季节.mp4")
                .build());
    final ComposeObjectArgs args = ComposeObjectArgs.builder()
        .bucket("demo")
        .object("寂寞的季节.mp4")
        .sources(sources)
        .build();

    try {
        minioClient.composeObject(args);
    } catch (MinioException | InvalidKeyException | IOException | NoSuchAlgorithmException e) {
        e.printStackTrace();
    }
}
```

上面的示例很简单，因为只做演示说明。

前端需要传的参数是：

- 分片桶：slice
- 分片数据数组：
  - 0寂寞的季节.mp4
  - 1寂寞的季节.mp4
  - 2寂寞的季节.mp4
- 目标桶：demo

然后调用composeObject函数完成合并。





### 前端示例代码分享

上面就是关于实战经验分享的全部了，因为需要前端配置来使用，所以这里给出我这篇文章的前端示例，很简单的单页面（技术栈就别吐槽了）：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://cdn.bootcdn.net/ajax/libs/vue/2.7.14/vue.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/spark-md5/3.0.2/spark-md5.min.js"></script>
</head>
<body>
<div id="app">

    <h1>{{title}}</h1>
    <br>

    <form @submit.prevent="getPolicyForm">

        <label>
            桶名
            <input type="text" v-model="policyParams.bucket">
        </label>
        <br>
        <label>
            文件名
            <input type="text" v-model="policyParams.filename">
        </label>
        <br>
        <button type="submit">获取上传凭证</button>
        <br>
        <div v-for="(val, key) in policy" :key="key">{{ key }}: <span>{{ val }}</span></div>
    </form>

    <br>

    <form @submit.prevent="uploadFileForm" v-show="policy != null">
        <label>
            文件
            <input type="file" @change="fileChange">
        </label>
        <br>
        <br>
        <button type="submit" v-show="file != null">上传文件</button>

    </form>

    ---
    <br>


    <div v-show="file != null">
        <button @click="sliceEvent">测试文件分片上传</button>
        |
        <button @click="sliceComposeEvent">分片文件合并</button>
    </div>


    <br>
    <br>
    <br>
    <p>{{uploadResult}}</p>
    <ul>
        <!--        <li v-for="item in sliceUploadResult">{{ item }}</li>-->
        <li v-for="(item, index) in sliceUploadResult" :key="index">{{ item }}</li>

    </ul>
    <br>

</div>

<script>
    var vm = new Vue({
        el: "#app",
        data() {
            return {
                title: "Minio测试"
                // 请求凭证参数
                , policyParams: {
                    bucket: null
                    , filename: null
                }
                // 请求到的凭证
                , policy: null
                // 待上传文件
                , file: null

                // 上传文件参数
                , uploadParams: {
                    file: null
                }

                // 分片上传参数
                , sliceParams: {
                    bucket: ""
                    , filename: ""
                    , file: null
                }
                , slicePolicys: []
                , sliceCount: 0

                // 上传结果回调
                , uploadResult: null
                // 分片上传结果回调
                , sliceUploadResult: null
            };
        },
        methods: {
            getPolicyForm() {
                this.policyParams.bucket = "demo"
                this.policyParams.filename = "寂寞的季节.mp4"
                this.requestPolicy(this.policyParams)
            },
            requestPolicy(params) {
                return new Promise(((resolve, reject) => {
                    $.ajax({
                        type: "POST",
                        url: "http://localhost:8888/presign",
                        contentType: "application/json",
                        data: JSON.stringify(params),
                        // async: false,
                        success: function (result) {
                            console.log(result)
                            vm.policy = result;
                            resolve(result)
                        },
                        error: function (e) {
                            reject()
                        }
                    });
                }))

            },
            fileChange(event) {
                const file = event.target.files[0]
                this.file = file
            },
            uploadFileForm() {
                this.uploadFile(this.file, this.policy)
            },

            uploadFile(file, policy) {
                console.log("准备上传文件：")
                console.log("file：" + file)
                console.log("policy：" + policy)
                var formData = new FormData()

                formData.append('file', file)
                formData.append('key', policy['key'])
                formData.append('x-amz-algorithm', policy['x-amz-algorithm'])
                formData.append('x-amz-credential', policy['x-amz-credential'])
                formData.append('x-amz-signature', policy['x-amz-signature'])
                formData.append('x-amz-date', policy['x-amz-date'])
                formData.append('policy', policy['policy'])

                return new Promise(((resolve, reject) => {
                    $.ajax({
                        method: 'POST',
                        url: 'http://mylocalhost:9001/' + policy['bucket'],
                        data: formData,
                        dataType: 'json',
                        contentType: false, // 必须设置为 false，不设置 contentType，让浏览器自动设置
                        processData: false, // 必须设置为 false，不对 FormData 进行序列化处理
                        // async: false, // 设置同步，方便等下做分片上传
                        xhr: function xhr() {
                            //获取原生的xhr对象
                            var xhr = $.ajaxSettings.xhr();
                            if (xhr.upload) {
                                //添加 progress 事件监听
                                xhr.upload.addEventListener('progress', function (e) {
                                    //e.loaded 已上传文件字节数
                                    //e.total 文件总字节数
                                    var percentage = parseInt(e.loaded / e.total * 100)
                                    vm.uploadResult = percentage + "%" + "：" + policy['key']
                                }, false);
                            }
                            return xhr;
                        },
                        success: function (result) {
                            vm.uploadResult = '文件上传成功：' + policy['key']
                            resolve(result)
                        },
                        error: function (e) {
                            reject()
                        }
                    })
                }))
            },
            sliceEvent() {
                // 获取文件
                var file = this.file
                // 设置分片大小：5MB
                var chunkSize = 5 * 1024 * 1024
                // 计算总共有多少个分片
                var totalChunk = Math.ceil(file.size / chunkSize)
                // 数组存放所有分片
                var chunks = []
                // 遍历所有分片
                for (var i = 0; i < totalChunk; i++) {
                    // 利用slice获取分片
                    var start = i * chunkSize
                    var end = Math.min(file.size, start + chunkSize)
                    var blob = file.slice(start, end)
                    // 添加分片到数组
                    chunks.push(blob)
                }

                console.log(totalChunk)

                this.sliceUploadResult = Array(totalChunk).fill(0)

                for (let i = 0; i < chunks.length; i++) {
                    var file = chunks[i];
                    this.calculateMD5(file)
                        .then((md5) => {
                            console.log(md5);  // 输出计算出的 MD5 值
                        })
                        .catch((error) => {
                            console.error(error);  // 处理错误
                        });
                }


                return

                // 创建序号
                var index = 0;
                // 循环上传分片
                while (index < totalChunk) {
                    console.log('------------------------------')
                    params = {
                        "bucket": "slice",
                        "filename": index + "寂寞的季节.mp4"
                    }
                    var policyPromise = this.requestPolicy(params);
                    (function (index) {
                        var file = chunks[index]
                        policyPromise.then(function (result) {
                            var filename = result['key']
                            console.log('准备上传文件：', filename, '，序号为：', index)
                            vm.uploadFile(file, result).then(function (result) {
                                console.log('上传完成：' + filename)
                                vm.sliceUploadResult[index] = ('分片文件上传成功：' + filename)
                            })
                        })
                    })(index)

                    index++
                }
            },
            sliceComposeEvent() {
                var parmas = {}

                $.ajax({
                    method: 'POST',
                    url: 'http://localhost:8888/compose',
                    data: formData,
                    dataType: 'json',
                    contentType: false, // 必须设置为 false，不设置 contentType，让浏览器自动设置
                    processData: false, // 必须设置为 false，不对 FormData 进行序列化处理
                    // async: false, // 设置同步，方便等下做分片上传
                    xhr: function xhr() {
                        //获取原生的xhr对象
                        var xhr = $.ajaxSettings.xhr();
                        if (xhr.upload) {
                            //添加 progress 事件监听
                            xhr.upload.addEventListener('progress', function (e) {
                                //e.loaded 已上传文件字节数
                                //e.total 文件总字节数
                                var percentage = parseInt(e.loaded / e.total * 100)
                                vm.uploadResult = percentage + "%" + "：" + policy['key']
                            }, false);
                        }
                        return xhr;
                    },
                    success: function (result) {
                        vm.uploadResult = '文件上传成功：' + policy['key']
                        resolve(result)
                    },
                    error: function (e) {
                        reject()
                    }
                })
            },
            calculateMD5(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();

                    // 读取文件内容
                    reader.readAsArrayBuffer(file);

                    reader.onload = () => {
                        const spark = new SparkMD5.ArrayBuffer();
                        spark.append(reader.result);  // 将文件内容添加到 MD5 计算器中
                        const md5 = spark.end();  // 计算 MD5 值

                        resolve(md5);
                    };

                    reader.onerror = (error) => {
                        reject(error);
                    };
                });
            }
        },
        mounted() {
        },
        created() {
        },
    });

</script>
</body>
</html>
```



