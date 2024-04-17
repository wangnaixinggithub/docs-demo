# SpringBoot 对接支付宝完成扫码支付，完整流程梳理！

> 需求：系统A对接支付宝，实现支持用户扫码支付

# **1、支付方式选择**

对接的API文档：

- *https://open.alipay.com/api*



可选的支付方式有：

- `扫码付`：出示付款码或者用户扫码付款
- `APP支付`：在APP中唤起支付宝
- `手机网站支付`：在移动端网页中唤起支付宝 App 或支付宝网页
- `电脑网站支付`：在PC端唤起支付宝App或者网页登录支付宝账户
- `刷脸付`：需硬件支持
- `商家扣款`：类似每月会员扣款
- `预授权支付`：冻结对应额度，交易完成后给商家
- `JSAPI支付`：小程序

这里选择扫码付的方式，点击下单后，返回支付二维码，用户扫码支付。



# **2、交互流程**

画个下单流程的时序图：

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221211501375.png)

- 用户下单，系统A组装信息后（订单信息、回调地址、签名），调用支付宝预下单接口，返回二维码链接
- 系统A将二维码链接转二维码图片
- 用户扫码，唤醒本地支付宝，完成支付
- 支付宝返回支付成功信息给用户
- 支付宝异步通知系统A支付成功的消息（回调地址），如果用户支付成功，支付宝就调用回调地址的API，回调接口中自然是系统A收到用户支付成功消息后的动作
- 上一步如果通知失败，比如网络异常或支付宝调用异步通知接口时系统A正好挂了 ⇒ 可主动调支付宝提供的查询支付结果接口，或者加定时任务轮询来查询交易状态，如3s-5s
- 还可以考虑在第一步请求支付宝接口时加上二维码的有效时间，过期就重新发起

查询支付结果流程：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221211544278.png)





退款流程同上查询支付结果。PS：注意下单、退款过程中，相关订单的业务数据落库到系统A。



# **3、对接准备**

## **加密解密 + 签名验签**

支付信息不能在网络上明文传输，以防被篡改。系统A到支付宝的方向，采用：

- 支付宝公钥加密 + 系统A的私钥签名（系统A做的事）
- 支付宝私钥解密 + 系统A的公钥验签（收到信息后，支付宝做的事）



同理，支付宝返回支付结果时，就是在支付宝中用系统A的公钥加密+支付宝的私钥签名，传输到系统A后，则是先用支付宝的公钥验签，再用系统A的私钥解密支付结果





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221211711086.png)

## 沙箱环境

调试过程中，可采用支付宝提供的沙箱环境，点击右上角控制台，登录后选择沙箱：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221211752327.png)



这里有一套可调试的APPID、系统A的公钥、密钥、支付宝的公钥、支付宝的网关地址，以及商家账户和用户账户（用于后续登录沙箱版本支付宝APP完成支付）



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221211824866.png)





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221211845015.png)



点击【沙箱工具】侧边栏，下载沙箱版支付宝APP，等于上面的买家账户。

## 内网穿透

前面提到，用户支付成功后，支付宝需要回调系统A接口来通知系统A，但我的开发环境在内网，支付宝访问不到，考虑做内网穿透，让支付宝通知到一个中转地址，再由中转地址到我的内网。穿透工具选择cpolar，下载地址 `https://dashboard.cpolar.com/get-started`，下载后，解压并安装msi包



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221211936030-17085215772536.png)



双击exe文件，执行认证：

```c
cpolar authtoken xxxx
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221212005170.png)





创建隧道，建立链接：

```
cpolar http 9527

//返回结果
Forwarding http://maggie.cpolar.io  -> localhost:9527
Forwarding https://maggie.cpolar.io  -> localhost:9527
```

转发成功。此时，给支付宝访问forward的地址即可，比如系统A的异步通知接口：

```c
localhost:9527/notify
```

那就是：

```c
http://maggie.cpolar.io/notify
```

## 二维码

二维码是消息的载体。平时玩可直接在草料二维码UI页面，这里需要给系统A的订单服务用代码生成二维码。二维码中的信息自然是支付宝预下单返回的url。

Java生成二维码可集成zxing库，但这样得自己两层for填充方格子，这里选择hutool工具类库（对zxing的二次封装），引入依赖：

```xml
<dependency>
    <groupId>cn.hutool</groupId>
    <artifactId>hutool-all</artifactId>
    <version>5.7.22</version>
</dependency>

<dependency>
    <groupId>com.google.zxing</groupId>
    <artifactId>core</artifactId>
    <version>3.4.1</version>
</dependency>
```

调用方式：

```c
//生成直到url对应的二维码，宽高均300像素，可到路径，也可到Http响应
QrCodeUtil.generate("https://url/path", 300, 300, "png", httpServletResponse.getOutPutStream());
```

也可引入QrConfig对象，设置其他属性：

```java
QrConfig config = new QrConfig(300, 300);
//纠错级别
config.setErrorCorrection(ErrorCorrectionLevel.H);
//二维码颜色
config.setBackColor(Color.BLUE);
QrCodeUtil.generate("https://www.baidu.com", config, new File("D:\\code.png"));
```

## 下单

支付宝提供的SDK 中已经对加签验签逻辑做了封装，使用 SDK 时传入支付宝公钥等内容可直接通过 SDK 自动进行加验签。SDK文档地址：`https://opendocs.alipay.com/open/54/103419?pathHash=d6bc7c2b` 。支付宝提供了两种SDK：

- 通用版SDK
- 简易版SDK

官网有通用版的API代码示例，这里走简易版的。引入简易版SDK的依赖：

```xml
<!-- https://mvnrepository.com/artifact/com.alipay.sdk/alipay-easysdk -->
<dependency>
    <groupId>com.alipay.sdk</groupId>
    <artifactId>alipay-easysdk</artifactId>
    <version>2.2.0</version>
</dependency>
```

在application.yml配置文件中统一写密钥、通知地址等（生产环境不要将私钥信息配置在源码中，例如配置为常量或储存在配置文件中，这样源码一丢，这些保密信息都泄漏了，放安全区域或服务器，运行时读取即可）

```yaml
alipay:
  easy:
    protocol: https
    gatewayHost: openapi-sandbox.dl.alipaydev.com
    signType: RSA2
    appId: 9021000133624745
    merchantPrivateKey: MIIEvQIBADANBgkqhkiG9w0B
    alipayPublicKey: MIIBIjANBgkqhkiG9w0BAQEFAAOC
    notifyUrl: http://maggie.cpolar.io/notify
server:
  port: 9527
```

@ConfigurationProperties注解统一读到：

```java
@Configuration
@Data
@ConfigurationProperties(prefix = "alipay.easy")
public class AliPayConfigInfo {

    /**
     * 请求协议
     */
    private String protocol;
    /**
     * 请求网关
     */
    private String gatewayHost;
    /**
     * 签名类型
     */
    private String signType;
    /**
     * 应用ID（来自支付宝申请）
     */
    private String appId;
    /**
     * 应用秘钥
     */
    private String merchantPrivateKey;
    /**
     * 支付宝公钥
     */
    private String alipayPublicKey;
    /**
     * 支付结果异步通知的地址
     */
    private String notifyUrl;
    /**
     * 设施AES秘钥
     */
    private String encryptKey;
}
```

将配置处理成Config类型的Bean，方便后面传入Config对象：

```java
@Configuration
public class AliPayConfig {

    @Bean
    public Config config(AliPayConfigInfo configInfo){
        Config config = new Config();
        config.protocol = configInfo.getProtocol();
        config.gatewayHost = configInfo.getGatewayHost();
        config.signType = configInfo.getSignType();
        config.appId = configInfo.getAppId();
        config.merchantPrivateKey = configInfo.getMerchantPrivateKey();
        config.alipayPublicKey = configInfo.getAlipayPublicKey();
        config.notifyUrl = configInfo.getNotifyUrl();
        config.encryptKey = "";
        return config;
    }
}
```

写下单接口，响应一个二维码给前端，这里业务数据、订单编号直接写死，只做示意：

```java
@RestController
@Slf4j
public class PayController {

    @Resource
    private Config config;
    /**
     * 收银台点击结账
     * 发起下单请求
     */
    @GetMapping("/pay")
    public void pay(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Factory.setOptions(config);
        //调用支付宝的接口
        AlipayTradePrecreateResponse payResponse = Factory.Payment.FaceToFace().preCreate("订单主题：Mac笔记本", "LS123qwe123", "19999");
        //参照官方文档响应示例，解析返回结果
        String httpBodyStr = payResponse.getHttpBody();
        JSONObject jsonObject = JSONObject.parseObject(httpBodyStr);
        String qrUrl = jsonObject.getJSONObject("alipay_trade_precreate_response").get("qr_code").toString();
        QrCodeUtil.generate(qrUrl, 300, 300, "png", response.getOutputStream());
    }
}
```

## 异步通知回调

异步回调参考文档：`https://opendocs.alipay.com/open/194/103296?pathHash=e43f422e&ref=api`，实现先全放Controller层了：

```java
@RestController
@Slf4j
public class PayController {

    @Resource
    private Config config;
 
    /**
     * 给支付宝的回调接口
     */
    @PostMapping("/notify")
    public void notify(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Map<String, String> params = new HashMap<>();
        //获取支付宝POST过来反馈信息，将异步通知中收到的待验证所有参数都存放到map中
        Map<String, String[]> parameterMap = request.getParameterMap();
        for (String name : parameterMap.keySet()) {
            String[] values = parameterMap.get(name);
            String valueStr = "";
            for (int i = 0; i < values.length; i++) {
                valueStr = (i == values.length - 1) ? valueStr + values[i]
                        : valueStr + values[i] + ",";
            }
            //乱码解决
            valueStr = new String(valueStr.getBytes("ISO-8859-1"), "utf-8");
            params.put(name, valueStr);
        }
        //验签
        Boolean signResult = Factory.Payment.Common().verifyNotify(params);
        if (signResult) {
            log.info("收到支付宝发送的支付结果通知");
            String out_trade_no = request.getParameter("out_trade_no");
            log.info("交易流水号：{}", out_trade_no);
            //交易状态
            String trade_status = new String(request.getParameter("trade_status").getBytes("ISO-8859-1"), "UTF-8");
            //交易成功
            switch (trade_status) {
                case "TRADE_SUCCESS":
                    //支付成功的业务逻辑，比如落库，开vip权限等
                    log.info("订单：{} 交易成功", out_trade_no);
                    break;
                case "TRADE_FINISHED":
                    log.info("交易结束，不可退款");
                    //其余业务逻辑
                    break;
                case "TRADE_CLOSED":
                    log.info("超时未支付，交易已关闭，或支付完成后全额退款");
                    //其余业务逻辑
                    break;
                case "WAIT_BUYER_PAY":
                    log.info("交易创建，等待买家付款");
                    //其余业务逻辑
                    break;
            }
            response.getWriter().write("success");   //返回success给支付宝，表示消息我已收到，不用重调

        } else {
            response.getWriter().write("fail");   ///返回fail给支付宝，表示消息我没收到，请重试
        }
    }
}
```

到此，看下效果，请求下单接口：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221212443038-17085218843578.png)





用沙箱版app扫码：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221212517171.png)









![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221212537110.png)

## 查询支付结果

主动查询用户的支付结果，订单编号依然写死：

```java
@RestController
@Slf4j
public class PayController {

    @Resource
    private Config config;
    
    @GetMapping("/query")
    public String query() throws Exception {
        Factory.setOptions(config);
        AlipayTradeQueryResponse result = Factory.Payment.Common().query("LS123qwe123");
        return result.getHttpBody();
    }

}
```

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221212623161-170852198441911.png)





## 退款

退款操作：

```java
@RestController
@Slf4j
public class PayController {

    @Resource
    private Config config;

    @GetMapping("/refund")
    public String refund() throws Exception {
        Factory.setOptions(config);
        AlipayTradeRefundResponse refundResponse = Factory.Payment.Common().refund("LS123qwe123", "19999");
        return refundResponse.getHttpBody();
    }
}
```



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221212731329-170852205233912.png)



## 通用版SDK

官方文档就是以这个SDK为例的，贴个代码示例：

```java
private static final String GATEWAY_URL = "https://openapi.alipaydev.com/gateway.do";
private static final String FORMAT = "JSON";
private static final String CHARSET = "UTF-8";
    //签名方式
    private static final String SIGN_TYPE = "RSA2";
@Resource
private AliPayConfig aliPayConfig;

@Resource
private OrdersMapper ordersMapper;

@GetMapping("/pay") // &subject=xxx&traceNo=xxx&totalAmount=xxx
public void pay(AliPay aliPay, HttpServletResponse httpResponse) throws Exception {
    // 1. 创建Client，通用SDK提供的Client，负责调用支付宝的API
    AlipayClient alipayClient = new DefaultAlipayClient(GATEWAY_URL, aliPayConfig.getAppId(),
            aliPayConfig.getAppPrivateKey(), FORMAT, CHARSET, aliPayConfig.getAlipayPublicKey(), SIGN_TYPE);

    // 2. 创建 Request并设置Request参数
    AlipayTradePagePayRequest request = new AlipayTradePagePayRequest();  // 发送请求的 Request类
    request.setNotifyUrl(aliPayConfig.getNotifyUrl());
    JSONObject bizContent = new JSONObject();
    bizContent.set("out_trade_no", aliPay.getTraceNo());  // 我们自己生成的订单编号
    bizContent.set("total_amount", aliPay.getTotalAmount()); // 订单的总金额
    bizContent.set("subject", aliPay.getSubject());   // 支付的名称
    bizContent.set("product_code", "FAST_INSTANT_TRADE_PAY");  // 固定配置
    request.setBizContent(bizContent.toString());

    // 执行请求，拿到响应的结果，返回给浏览器
    String form = "";
    try {
        form = alipayClient.pageExecute(request).getBody(); // 调用SDK生成表单
    } catch (AlipayApiException e) {
        e.printStackTrace();
    }
    httpResponse.setContentType("text/html;charset=" + CHARSET);
    httpResponse.getWriter().write(form);// 直接将完整的表单html输出到页面
    httpResponse.getWriter().flush();
    httpResponse.getWriter().close();
}
```

具体有业务数据逻辑的对接支付宝接口，可跳转支付宝业务对接：

- *https://llg-notes.blog.csdn.net/article/details/130357977*