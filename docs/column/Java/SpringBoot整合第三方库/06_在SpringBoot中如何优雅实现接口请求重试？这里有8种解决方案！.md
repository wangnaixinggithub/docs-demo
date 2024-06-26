# 在SpringBoot中如何优雅实现接口请求重试？这里有8种解决方案！

在跨境业务中，可能第三方的服务器分布在世界的各个角落，所以请求三方接口的时候，难免会遇到一些网络问题，这时候需要加入重试机制了，这期就给大家分享几个接口重试的写法。

# 重试机制实现

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221205501835.png)



## 循环重试

这是最简单也最直接的一种方式。在请求接口的代码块中加入循环，如果请求失败则继续请求，直到请求成功或达到最大重试次数。



示例代码：

```java
int retryTimes = 3;
for(int i = 0; i < retryTimes; i++){
    try{
        // 请求接口的代码
        break;
    }catch(Exception e){
        // 处理异常
        Thread.sleep(1000); // 延迟1秒后重试
    }
}
```

这段简单的示例代码里，直接用了一个`for`循环来进行重试，最大重试次数设置为3次。同时在发生异常的时候，为了避免频繁请求，使用`Thread.sleep()`加一个适当的延迟。



## 使用递归结构

除了循环，还可以使用递归来实现接口的请求重试。递归是我们都比较熟悉的编程技巧，在请求接口的方法中调用自身，如果请求失败则继续调用，直到请求成功或达到最大重试次数。

```java
public void requestWithRetry(int retryTimes){
    if(retryTimes <= 0) return;
    try{
        // 请求接口的代码
    }catch(Exception e){
        // 处理异常
        Thread.sleep(1000); // 延迟1秒后重试
        requestWithRetry(retryTimes - 1);
    }
}
```

这段代码里，我们定义了一个名为`requestWithRetry`的方法，其中`retryTimes`表示最大重试次数。如果重试次数小于等于0，则直接返回。否则，在捕获到异常后，我们使用`Thread.sleep()`方法来添加一个适当的延迟，然后调用自身进行重试。



## 使用网络工具的内置重试机制

我们常用的一些HTTP客户端通常内置了一些重试机制，只需要在创建对应的客户端实例的时候进行配置即可，以`Apache HttpClient`为例：

- 4.5+版本：使用 `HttpClients.custom().setRetryHandler()` 方法来设置重试机制

```c
 CloseableHttpClient httpClient = HttpClients.custom()
                .setRetryHandler(new DefaultHttpRequestRetryHandler(3, true))
                .build();
```

- 5.x版本：使用`HttpClients.custom().setRetryStrategy()`方法来设置重试机制

```java
 CloseableHttpClient httpClient = HttpClients.custom()
                .setRetryStrategy(new DefaultHttpRequestRetryStrategy(3,NEG_ONE_SECOND))
                .build();
```

在上面的示例代码中，我们使用`DefaultHttpRequestRetryHandler`或`DefaultHttpRequestRetryStrategy`来创建一个重试机制，最大重试次数为3次。如果请求失败，则会自动重试。

`Apache HttpClient`还支持自定义重试策略，可以可以实现`HttpRequestRetryHandler`接口（4.5+版本）或者`RetryStrategy`接口（5.x版本），并根据需要进行重试逻辑的实现。



这是一个自定义重试策略的示例：

```java
CloseableHttpClient httpClient = HttpClients.custom()
        .setRetryStrategy((response, executionCount, context) -> {
            if (executionCount > 3) {
                // 如果重试次数超过3次，则放弃重试
                return false;
            }
            int statusCode = response.getCode();
            if (statusCode >= 500 && statusCode < 600) {
                // 如果遇到服务器错误状态码，则进行重试
                return true;
            }
            // 其他情况不进行重试
            return false;
        })
        .build();
```

## 使用Spring Retry库

当在Spring项目中使用重试机制时，可以使用Spring Retry库来实现。Spring Retry提供了一组注解和工具类，可以方便地为方法添加重试功能。

```xml
<dependency>
    <groupId>org.springframework.retry</groupId>
    <artifactId>spring-retry</artifactId>
    <version>1.3.1</version>
</dependency>
```

Spring Retry的使用有两种方式，一种是使用RetryTemplate来显式调用需要重试的方法，一种实用注解来自动触发重试。



### 显式使用RetryTemplate

- 创建RetryTemplate对象并配置重试策略：

```java
RetryTemplate retryTemplate = new RetryTemplate();

// 配置重试策略
RetryPolicy retryPolicy = new SimpleRetryPolicy(3);
retryTemplate.setRetryPolicy(retryPolicy);

// 配置重试间隔策略
FixedBackOffPolicy backOffPolicy = new FixedBackOffPolicy();
backOffPolicy.setBackOffPeriod(1000);
retryTemplate.setBackOffPolicy(backOffPolicy);
```

在代码里，我们创建了一个RetryTemplate对象，并配置了重试策略和重试间隔策略。这里使用了SimpleRetryPolicy来指定最大重试次数为3次，使用FixedBackOffPolicy来指定重试间隔为1秒。

- 使用RetryTemplate调用方法：

```java
retryTemplate.execute((RetryCallback<Void, Exception>) context -> {
    // 请求接口的代码
    return null;
});
```

代码里，我们使用`retryTemplate.execute()`方法来执行需要重试的代码块。在`RetryCallback`的`doWithRetry()`方法中，可以编写需要重试的逻辑。如果方法执行失败，RetryTemplate会根据配置的重试策略和重试间隔策略进行重试。





Spring Retry是一个提供重试机制的库，可以方便地在Spring项目中使用。使用@Retryable注解标记需要重试的方法，如果方法抛出异常则会自动重试。

```java
@Retryable(value = Exception.class, maxAttempts = 3)
public void request(){
    // 请求接口的代码
}
```

我们使用`@Retryable`注解标记了`request()`方法，指定了最大重试次数为3次。

- 调用被标记的方法：

```java
@Autowired
private HttpService httpService;

httpService.request();
```

Spring Retry提供了多种重试策略和重试间隔策略，我们可以根据具体的业务需求选择合适的策略：

- 重试策略：
  - SimpleRetryPolicy：指定最大重试次数。
  - TimeoutRetryPolicy：指定最大重试时间。
  - AlwaysRetryPolicy：无条件进行重试。
- 重试间隔策略：
  - FixedBackOffPolicy：固定间隔重试。
  - ExponentialBackOffPolicy：指数递增间隔重试。
  - UniformRandomBackOffPolicy：随机间隔重试。



通过配置不同的重试策略和重试间隔策略，可以灵活地控制重试行为。Spring Retry还提供了自定义重试策略和重试间隔策略，可以通过实现`RetryPolicy`接口和`BackOffPolicy`接口，分别实现自定义的重试策略和重试间隔策略。



### 使用注解调用

除了显式使用RetryTemplate调用，Spring Retry还提供了注解方式来触发重试。

- 配置重试切面：

```java
@Configuration
@EnableRetry
public class RetryConfig {
    // 配置其他的Bean
}
```

代码里，我们使用`@Configuration`注解将类标记为配置类，使用`@EnableRetry`注解启用重试功能。

- 使用@Retryable注解标记需要重试的方法：

```java
@Retryable(maxAttempts = 3)
public void request() {
    // 请求接口的代码
}
```

我们使用`@Retryable`注解标记了`request()`方法，指定了最大重试次数为3次。

- 调用被标记的方法

```java
@Autowired
private HttpService httpService;

httpService.request();
```

在SpringBoot项目里使用更加地简单，使用@EnableRetry注解启用Spring Retry功能，并在需要进行重试的方法上添加@Retryable注解。



示例代码：

```java
@SpringBootApplication
@EnableRetry // 启用Spring Retry功能
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}

@Service
public class MyService {
    @Retryable(value = {MyException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void doSomething() {
        // 需要进行重试的方法逻辑
    }
}
```

代码里，@EnableRetry注解启用了Spring Retry功能，@Retryable注解标记了需要进行重试的方法，并指定了重试的异常类型、最大重试次数和重试间隔。

其中，@Backoff注解用于指定重试间隔策略，delay属性表示每次重试之间的间隔时间。在这个例子中，每次重试之间的间隔时间为1秒。

需要注意的是，@Retryable注解只能标记在public方法上。如果需要在非public方法上使用重试功能，可以使用代理模式实现。

另外，如果需要在重试过程中进行一些特定的操作，比如记录日志、发送消息等，可以在重试方法中使用RetryContext参数，它提供了一些有用的方法来获取重试的上下文信息。例如：

```java
@Service
public class MyService {
    @Retryable(value = {MyException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void doSomething(RetryContext context) {
        // 获取重试次数
        int retryCount = context.getRetryCount();
        // 获取上一次异常
        Throwable lastThrowable = context.getLastThrowable();
        // 记录日志、发送消息等操作
        // ...
        // 需要进行重试的方法逻辑
    }
}
```

## 使用Resilience4j库

Resilience4j是一个轻量级的，易于使用的容错库，提供了重试、熔断、限流等多种机制。

```xml
<dependency>
    <groupId>io.github.resilience4j</groupId>
    <artifactId>resilience4j-spring-boot2</artifactId>
    <version>1.7.0</version>
</dependency>
```

我们来看下Resilience4j的使用，Resilience4j也支持代码显式调用和注解配置调用。



### 通过代码显式调用

- 创建一个RetryRegistry对象：

首先，需要创建一个RetryRegistry对象，用于管理Retry实例。可以使用`RetryRegistry.ofDefaults()`方法创建一个默认的RetryRegistry对象。

```c
RetryRegistry retryRegistry = RetryRegistry.ofDefaults();
```

- 配置Retry实例：

接下来，可以通过RetryRegistry对象创建和配置Retry实例。可以使用`RetryConfig`类来自定义Retry的配置，包括最大重试次数、重试间隔等。

```java
RetryConfig config = RetryConfig.custom()
  .maxAttempts(3)
  .waitDuration(Duration.ofMillis(1000))
  .retryOnResult(response -> response.getStatus() == 500)
  .retryOnException(e -> e instanceof WebServiceException)
  .retryExceptions(IOException.class, TimeoutException.class)
  .ignoreExceptions(BusinessException.class, OtherBusinessException.class)
  .failAfterMaxAttempts(true)
  .build();

Retry retry = retryRegistry.retry("name", config);
```

通过以上代码，我们创建了一个名为"name"的Retry实例，并配置了最大重试次数为3次，重试间隔为1秒，当返回结果的状态码为500时进行重试，当抛出WebServiceException异常时进行重试，忽略BusinessException和OtherBusinessException异常，达到最大重试次数后抛出MaxRetriesExceededException异常。

- 使用Retry调用：

最后，可以使用`Retry`来装饰和执行需要进行重试的代码块。比如，可以使用`Retry.decorateCheckedSupplier()`方法来装饰一个需要重试的Supplier。

```java
CheckedFunction0<String> retryableSupplier = Retry.decorateCheckedSupplier(retry, () -> {
    // 需要进行重试的代码
    return "result";
});
```

### 通过注解调用

通过注解的方式，使用Resilience4j来使用重试功能，更加简洁。

在Spring Boot项目中，可以使用`@Retryable`注解来标记需要进行重试的方法。

```java
@Service
public class MyService {
    @Retryable(value = {MyException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    public void doSomething() {
        // 需要进行重试的方法逻辑
    }
}
```

代码里，`@Retryable`注解标记了`doSomething()`方法，指定了重试的异常类型为`MyException.class`，最大重试次数为3次，重试间隔为1秒。



## 自定义重试工具类

如果说我们不想在项目里额外地引入一些重试的框架，自己定义一个重试工具类也是可以的，这是我在某个第三方提供的client-sdk里发现的一套重试工具类，比较轻量级，给大家分享一下。

- 首先，定义一个实现了`Callback`抽象类的具体回调类，实现其中的`doProcess()`方法来执行需要重试的逻辑。回调类的`doProcess()`方法返回一个`RetryResult`对象，表示重试的结果。

```java
public abstract class Callback {
    public abstract RetryResult doProcess();
}
```

- 然后，定义一个`RetryResult`类，用于封装重试的结果。`RetryResult`类包含一个`isRetry`属性表示是否需要进行重试，以及一个`obj`属性表示重试的结果对象。

```java
public class RetryResult {
    private Boolean isRetry;
    private Object obj;

    // 构造方法和getter方法省略

    public static RetryResult ofResult(Boolean isRetry, Object obj){
        return new RetryResult(isRetry, obj);
    }

    public static RetryResult ofResult(Boolean isRetry){
        return new RetryResult(isRetry, null);
    }
}

```

- 最后，定义一个`RetryExecutor`类，其中的`execute()`方法接收一个重试次数和一个回调对象，根据重试次数循环执行回调对象的`doProcess()`方法，直到达到最大重试次数或回调对象返回不需要重试的结果。

```java
public class RetryExecutor {
    public static Object execute(int retryCount, Callback callback) {
        for (int curRetryCount = 0; curRetryCount < retryCount; curRetryCount++) {
            RetryResult retryResult = callback.doProcess();
            if (retryResult.isRetry()) {
                continue;
            }
            return retryResult.getObj();
        }
        return null;
    }
}
```

- 使用这个自定义的重试工具类时，只需要实现一个继承自`Callback`的回调类，并在其中实现具体的重试逻辑。然后，通过调用`RetryExecutor.execute()`方法来执行重试操作。这里直接用了一个匿名的实现：

```java
//最大重试次数
int maxRetryCount = 3;
Object result = RetryExecutor.execute(maxRetryCount, new Callback() {
    @Override
    public RetryResult doProcess() {
        // 执行需要重试的逻辑
        // 如果需要重试，返回 RetryResult.ofResult(true)
        // 如果不需要重试，返回 RetryResult.ofResult(false, result)
    }
});
```

## 并发框架异步重试

在有些需要快速响应的场景下，我们可以使用并发框架，来实现异步的重试。

比如使用线程池`ThreadPoolExecutor`，把请求接口转化成一个异步任务，将任务放入线程池中异步执行，并发地重试请求接口。可以在任务执行完成后，判断任务执行结果，如果失败则继续重试。



```java
int maxRetryTimes = 3;
int currentRetryTimes = 0;

ThreadPoolExecutor executor = new ThreadPoolExecutor(
        10,  // 核心线程数
        10,  // 最大线程数
        0L,  // 空闲线程存活时间
        TimeUnit.MILLISECONDS,  // 时间单位
        new LinkedBlockingQueue<>()  // 任务队列
);

Callable<String> task = () -> {
    // 请求接口的代码
    return "result";
};

Future<String> future;
while (currentRetryTimes < maxRetryTimes) {
    try {
        future = executor.submit(task);
        String result = future.get();
        // 判断任务执行结果
        break;
    } catch (Exception e) {
        currentRetryTimes++;
        // 处理异常
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }
}
```

在这个示例中，我们直接使用`ThreadPoolExecutor`来创建线程池，设置核心线程数和最大线程数为10，使用`LinkedBlockingQueue`作为任务队列。然后，我们定义了一个`Callable`类型的任务，用于执行请求接口的代码。在重试的过程中，我们使用`executor.submit(task)`提交任务并获得一个`Future`对象，通过`future.get()`获取任务的执行结果。如果任务执行成功，则跳出循环；如果任务执行失败，则继续重试，直到达到最大重试次数。



## 消息队列重试

在某些情况下，我们希望尽可能保证重试的可靠性，不会因为服务中断，而导致重试任务的丢失，我们可以引入消息队列。我们直接把消息投递到消息队列里，通过对消息的消费，来实现重试机制。



使用RocketMQ的示例代码如下：

```java
@Component
@RocketMQMessageListener(topic = "myTopic", consumerGroup = "myConsumerGroup")
public class MyConsumer implements RocketMQListener<String> {

    @Override
    public void onMessage(String message) {
        try {
            // 请求接口的代码
        } catch (Exception e) {
            // 处理异常
            DefaultMQProducer producer = new DefaultMQProducer("myProducerGroup");
            producer.setNamesrvAddr("127.0.0.1:9876");
            try {
                producer.start();
                Message msg = new Message("myTopic", "myTag", message.getBytes());
                producer.send(msg);
            } catch (Exception ex) {
                // 处理发送异常
            } finally {
                producer.shutdown();
            }
        }
    }
}
```

上面的代码里，我们使用`@RocketMQMessageListener`注解标记`MyConsumer`类，并指定了消费者的相关配置，包括消费者组和订阅的主题。

在`onMessage()`方法中，我们处理请求的逻辑。如果请求失败，我们创建一个RocketMQ的生产者，并将请求重新发送到消息队列中，等待下一次处理。

通过使用消息队列（如RocketMQ）来实现重试机制，可以提高系统的可靠性和稳定性。即使在服务中断的情况下，重试任务也不会丢失，而是等待服务恢复后再次进行处理。



# 最佳实践和注意事项

在请求重试的时候，我们也要注意一些关键点，以免因为重试，引发更多的问题：

- 合理设置重试次数和重试间隔时间，避免频繁地发送请求，同时也不要设置过大的重试次数，以免影响系统的性能和响应时间。
- 考虑接口幂等性：如果请求是写操作，而且下游的服务不保证请求的幂等性，那么在重试时需要谨慎处理，可以通过查询等幂等的方式进行重试
- 在重试过程中，需要考虑并发的问题。如果多个线程同时进行重试，可能会导致请求重复发送或请求顺序混乱等问题。可以使用锁或者分布式锁来解决并发问题。
- 在处理异常时，需要根据具体的异常类型来进行处理。有些异常是可以通过重试来解决的，例如网络超时、连接异常等；而有些异常则需要进行特殊的处理，例如数据库异常、文件读写异常等。
- 在使用重试机制时，需要注意不要陷入死循环。如果请求一直失败，重试次数一直增加，可能会导致系统崩溃或者资源耗尽等问题。







