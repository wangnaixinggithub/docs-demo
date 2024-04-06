# Spring Boot集成AJ-Captcha实现滑动验证码功能



## 1.AJ-Captcha介绍

### 行为验证码

采用嵌入式集成方式，接入方便，安全，高效。抛弃了传统字符型验证码展示-填写字符-比对答案的流程，采用验证码展示-采集用户行为-分析用户行为流程，用户只需要产生指定的行为轨迹，不需要键盘手动输入，极大优化了传统验证码用户体验不佳的问题；同时，快速、准确的返回人机判定结果





### AJ-Captcha行为验证码

AJ-Captcha行为验证码，包含滑动拼图、文字点选两种方式，UI支持弹出和嵌入两种方式。后端提供Java实现，前端提供了php、angular、html、vue、uni-app、flutter、android、ios等代码示例。



## 2.代码工程

### pom.xml

```xml

<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <artifactId>springboot-demo</artifactId>
        <groupId>com.et</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>Captcha</artifactId>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>
    <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-autoconfigure</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>com.anji-plus</groupId>
            <artifactId>spring-boot-starter-captcha</artifactId>
            <version>1.3.0</version>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
    </dependencies>
</project>

```

### application.yaml

```yaml

spring.application.name=captcha-service
server.port=8080

# 滑动验证，底图路径，不配置将使用默认图片
# 支持全路径
# 支持项目路径,以classpath:开头,取resource目录下路径,例：classpath:images/jigsaw
aj.captcha.jigsaw=classpath:images/jigsaw
# 滑动验证，底图路径，不配置将使用默认图片
# 支持全路径
# 支持项目路径,以classpath:开头,取resource目录下路径,例：classpath:images/pic-click
aj.captcha.pic-click=classpath:images/pic-click

# 对于分布式部署的应用，我们建议应用自己实现CaptchaCacheService，比如用Redis或者memcache，
# 参考CaptchaCacheServiceRedisImpl.java
# 如果应用是单点的，也没有使用redis，那默认使用内存。
# 内存缓存只适合单节点部署的应用，否则验证码生产与验证在节点之间信息不同步，导致失败。
# ！！！注意啦，如果应用有使用spring-boot-starter-data-redis，
# 请打开CaptchaCacheServiceRedisImpl.java注释。
# redis ----->  SPI：在resources目录新建META-INF.services文件夹(两层)，参考当前服务resources。
# 缓存local/redis...
aj.captcha.cache-type=local
# local缓存的阈值,达到这个值，清除缓存
#aj.captcha.cache-number=1000
# local定时清除过期缓存(单位秒),设置为0代表不执行
#aj.captcha.timing-clear=180
#spring.redis.host=10.108.11.46
#spring.redis.port=6379
#spring.redis.password=
#spring.redis.database=2
#spring.redis.timeout=6000

# 验证码类型default两种都实例化。
aj.captcha.type=default
# 汉字统一使用Unicode,保证程序通过@value读取到是中文，可通过这个在线转换
# https://tool.chinaz.com/tools/unicode.aspx 中文转Unicode
# 右下角水印文字(我的水印)
aj.captcha.water-mark=我的水印
# 右下角水印字体(不配置时，默认使用文泉驿正黑)
# 由于宋体等涉及到版权，我们jar中内置了开源字体【文泉驿正黑】
# 方式一：直接配置OS层的现有的字体名称，比如：宋体
# 方式二：自定义特定字体，请将字体放到工程resources下fonts文件夹，支持ttf\ttc\otf字体
# aj.captcha.water-font=WenQuanZhengHei.ttf
# 点选文字验证码的文字字体(文泉驿正黑)
# aj.captcha.font-type=WenQuanZhengHei.ttf
# 校验滑动拼图允许误差偏移量(默认5像素)
aj.captcha.slip-offset=5
# aes加密坐标开启或者禁用(true|false)
aj.captcha.aes-status=true
# 滑动干扰项(0/1/2)
aj.captcha.interference-options=2

#点选字体样式 默认Font.BOLD
aj.captcha.font-style=1
#点选字体字体大小
aj.captcha.font-size=25
#点选文字个数,存在问题，暂不支持修改
#aj.captcha.click-word-count=4


aj.captcha.history-data-clear-enable=false

# 接口请求次数一分钟限制是否开启 true|false
aj.captcha.req-frequency-limit-enable=false
# 验证失败5次，get接口锁定
aj.captcha.req-get-lock-limit=5
# 验证失败后，锁定时间间隔,s
aj.captcha.req-get-lock-seconds=360
# get接口一分钟内请求数限制
aj.captcha.req-get-minute-limit=30
# check接口一分钟内请求数限制
aj.captcha.req-check-minute-limit=30
# verify接口一分钟内请求数限制(暂用不上，可后台直接调用captchaService)
#aj.captcha.req-verify-minute-limit=30

```

### CaptchaConfig.java

```java

package com.et.captcha.config;

import com.et.captcha.service.CaptchaCacheServiceRedisImpl;
import com.anji.captcha.properties.AjCaptchaProperties;
import com.anji.captcha.service.CaptchaCacheService;
import com.anji.captcha.service.impl.CaptchaServiceFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.StringRedisTemplate;

@Configuration
public class CaptchaConfig {

    @Autowired
    StringRedisTemplate redisTemplate;

    @Bean(name = "CaptchaCacheService")
    @Primary
    public CaptchaCacheService captchaCacheService(AjCaptchaProperties config){
        //缓存类型redis/local/....
        CaptchaCacheService ret = CaptchaServiceFactory.getCache(config.getCacheType().name());
        if(ret instanceof CaptchaCacheServiceRedisImpl){
            ((CaptchaCacheServiceRedisImpl)ret).setStringRedisTemplate(redisTemplate);
        }
        return ret;
    }
}
```

CaptchaCacheService有很多种实现类，可以动态扩展，具体方式可以参考官方教程，下面提出默认local的实现方式DefaultCaptchaServiceImpl

```java

package com.anji.captcha.service.impl;

import com.anji.captcha.model.common.RepCodeEnum;
import com.anji.captcha.model.common.ResponseModel;
import com.anji.captcha.model.vo.CaptchaVO;
import com.anji.captcha.service.CaptchaService;
import com.anji.captcha.util.StringUtils;
import java.util.Iterator;
import java.util.Properties;

public class DefaultCaptchaServiceImpl extends AbstractCaptchaService {
    public DefaultCaptchaServiceImpl() {
    }

    public String captchaType() {
        return "default";
    }

    public void init(Properties config) {
        Iterator var2 = CaptchaServiceFactory.instances.keySet().iterator();

        while(var2.hasNext()) {
            String s = (String)var2.next();
            if (!this.captchaType().equals(s)) {
                this.getService(s).init(config);
            }
        }

    }

    public void destroy(Properties config) {
        Iterator var2 = CaptchaServiceFactory.instances.keySet().iterator();

        while(var2.hasNext()) {
            String s = (String)var2.next();
            if (!this.captchaType().equals(s)) {
                this.getService(s).destroy(config);
            }
        }

    }

    private CaptchaService getService(String captchaType) {
        return (CaptchaService)CaptchaServiceFactory.instances.get(captchaType);
    }

    public ResponseModel get(CaptchaVO captchaVO) {
        if (captchaVO == null) {
            return RepCodeEnum.NULL_ERROR.parseError(new Object[]{"captchaVO"});
        } else {
            return StringUtils.isEmpty(captchaVO.getCaptchaType()) ? RepCodeEnum.NULL_ERROR.parseError(new Object[]{"类型"}) : this.getService(captchaVO.getCaptchaType()).get(captchaVO);
        }
    }

    public ResponseModel check(CaptchaVO captchaVO) {
        if (captchaVO == null) {
            return RepCodeEnum.NULL_ERROR.parseError(new Object[]{"captchaVO"});
        } else if (StringUtils.isEmpty(captchaVO.getCaptchaType())) {
            return RepCodeEnum.NULL_ERROR.parseError(new Object[]{"类型"});
        } else {
            return StringUtils.isEmpty(captchaVO.getToken()) ? RepCodeEnum.NULL_ERROR.parseError(new Object[]{"token"}) : this.getService(captchaVO.getCaptchaType()).check(captchaVO);
        }
    }

    public ResponseModel verification(CaptchaVO captchaVO) {
        if (captchaVO == null) {
            return RepCodeEnum.NULL_ERROR.parseError(new Object[]{"captchaVO"});
        } else if (StringUtils.isEmpty(captchaVO.getCaptchaVerification())) {
            return RepCodeEnum.NULL_ERROR.parseError(new Object[]{"二次校验参数"});
        } else {
            try {
                String codeKey = String.format(REDIS_SECOND_CAPTCHA_KEY, captchaVO.getCaptchaVerification());
                if (!CaptchaServiceFactory.getCache(cacheType).exists(codeKey)) {
                    return ResponseModel.errorMsg(RepCodeEnum.API_CAPTCHA_INVALID);
                }

                CaptchaServiceFactory.getCache(cacheType).delete(codeKey);
            } catch (Exception var3) {
                this.logger.error("验证码坐标解析失败", var3);
                return ResponseModel.errorMsg(var3.getMessage());
            }

            return ResponseModel.success();
        }
    }
}

```

### 获取验证码

```java

package com.anji.captcha.controller;

import com.anji.captcha.model.common.ResponseModel;
import com.anji.captcha.model.vo.CaptchaVO;
import com.anji.captcha.service.CaptchaService;
import com.anji.captcha.util.StringUtils;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/captcha"})
public class CaptchaController {
    @Autowired
    private CaptchaService captchaService;

    public CaptchaController() {
    }

    @PostMapping({"/get"})
    public ResponseModel get(@RequestBody CaptchaVO data, HttpServletRequest request) {
        assert request.getRemoteHost() != null;

        data.setBrowserInfo(getRemoteId(request));
        return this.captchaService.get(data);
    }

    @PostMapping({"/check"})
    public ResponseModel check(@RequestBody CaptchaVO data, HttpServletRequest request) {
        data.setBrowserInfo(getRemoteId(request));
        return this.captchaService.check(data);
    }

    public ResponseModel verify(@RequestBody CaptchaVO data, HttpServletRequest request) {
        return this.captchaService.verification(data);
    }

    public static final String getRemoteId(HttpServletRequest request) {
        String xfwd = request.getHeader("X-Forwarded-For");
        String ip = getRemoteIpFromXfwd(xfwd);
        String ua = request.getHeader("user-agent");
        return StringUtils.isNotBlank(ip) ? ip + ua : request.getRemoteAddr() + ua;
    }

    private static String getRemoteIpFromXfwd(String xfwd) {
        if (StringUtils.isNotBlank(xfwd)) {
            String[] ipList = xfwd.split(",");
            return StringUtils.trim(ipList[0]);
        } else {
            return null;
        }
    }
}

```

### 验证验证码

```java
package com.et.captcha.controller;

import com.anji.captcha.model.common.ResponseModel;
import com.anji.captcha.model.vo.CaptchaVO;
import com.anji.captcha.service.CaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 后端二次校验接口示例
 */
@RestController
@RequestMapping("/auth")
public class LoginController {

    @Autowired
    private CaptchaService captchaService;

    @PostMapping("/login")
    public ResponseModel get(@RequestParam("captchaVerification") String captchaVerification) {
        CaptchaVO captchaVO = new CaptchaVO();
        captchaVO.setCaptchaVerification(captchaVerification);
        ResponseModel response = captchaService.verification(captchaVO);
        if(response.isSuccess() == false){
            //验证码校验失败，返回信息告诉前端
            //repCode  0000  无异常，代表成功
            //repCode  9999  服务器内部异常
            //repCode  0011  参数不能为空
            //repCode  6110  验证码已失效，请重新获取
            //repCode  6111  验证失败
            //repCode  6112  获取验证码失败,请联系管理员
        }
        return response;
    }

}
```

前端工程代码太多就不贴出来了，具体可以查看web-ui文件家里面的内容，以上只是一些关键代码，所有代码请参见下面代码仓库





## 3.测试

第一步:启动后端，启动service/springboot的StartApplication。

第二步:启动前端，终端进入文件夹view/vue，

```
yarn install
yarn run dev
```

浏览器登录 http://localhost:8081/#/





![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240404090907190.png)

## 4.引用

- https://gitee.com/anji-plus/captcha
- http://www.liuhaihua.cn/archives/710384.html