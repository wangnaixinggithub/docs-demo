# SpringBoot 中实现订单30分钟自动取消的策略

# 简介

在电商和其他涉及到在线支付的应用中，通常需要实现一个功能：如果用户在生成订单后的一定时间内未完成支付，系统将自动取消该订单。

本文将详细介绍基于Spring Boot框架实现订单30分钟内未支付自动取消的几种方案，并提供实例代码。



## 方案一：定时任务

利用Spring Boot中的@Scheduled注解，我们可以轻松地实现定时任务。该任务将周期性地扫描数据库，检查未支付的订单，如果订单生成30分钟未支付，则自动取消。



```java
@Component
public class OrderCancelSchedule {

    @Autowired
    private OrderService orderService;

    @Scheduled(cron = "0 0/1 * * * ?")
    public void cancelUnpaidOrders() {
        List<Order> unpaidOrders = orderService.getUnpaidOrders();
        unpaidOrders.forEach(order -> {
            if (order.getCreationTime().plusMinutes(30).isBefore(LocalDateTime.now())) {
                orderService.cancelOrder(order.getId());
            }
        });
    }
}
```

## 方案二：延迟队列

使用消息队列（如RabbitMQ）的延迟队列功能，当订单生成时将订单ID推送到延迟队列，设置30分钟后过期，过期后消费该消息，取消订单。

```java
@Service
public class OrderService {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void createOrder(Order order) {
        // 保存订单至数据库
        saveOrderToDB(order);

        // 将订单ID推送至延迟队列
        rabbitTemplate.convertAndSend("orderDelayExchange", "orderDelayKey", order.getId(), message -> {
            message.getMessageProperties().setDelay(30 * 60 * 1000); // 设置延迟时间
            return message;
        });
    }
}

@Component
@RabbitListener(queues = "orderDelayQueue")
public class OrderDelayConsumer {

    @Autowired
    private OrderService orderService;

    @RabbitHandler
    public void process(String orderId) {
        // 取消订单
        orderService.cancelOrder(orderId);
    }
}
```

## 方案三：Redis过期事件

利用Redis的键过期事件功能，当订单生成时在Redis中存储一个键，设置30分钟过期，键过期时通过Redis的过期事件通知功能触发订单取消操作。

```java
Service
public class OrderService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    public void createOrder(Order order) {
        // 保存订单至数据库
        saveOrderToDB(order);

        // 在Redis中存储一个键，设置30分钟过期
        redisTemplate.opsForValue().set("order:" + order.getId(), order.getId(), 30, TimeUnit.MINUTES);
    }

    // 当键过期时，Redis会自动调用该方法（需要配置Redis的过期事件通知功能）
    public void onOrderKeyExpired(String orderId) {
        cancelOrder(orderId);
    }
}
```

补充一下配置Redis的过期事件通知功能如下：

Redis的键过期通知是一种典型的发布-订阅模式。在Redis中，我们可以订阅到某些特定的事件。键过期事件就是其中之一。但需要注意，要使用这个功能，需要确保你的Redis服务器开启了相关配置。 下面是具体的步骤和示例：



- 1.首先需要确保Redis的配置文件（通常是redis.conf）中开启了键空间通知功能。你可以通过在配置文件中添加或修改如下配置实现：

```c
notify-keyspace-events "Ex"
```

这里的"Ex"表示只监听键过期事件。如果需要监听其他类型的事件，可以参考Redis官方文档进行配置。



- 2.然后在Spring Boot应用中，可以使用`RedisMessageListenerContainer`来订阅Redis的键过期事件，并指定回调方法进行处理。示例如下：

```java
@Configuration
public class RedisConfig {

    @Autowired
    private RedisConnectionFactory redisConnectionFactory;

    @Bean
    RedisMessageListenerContainer container() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory);
        // 订阅所有db的过期事件
        container.addMessageListener(new MessageListener() {
            @Override
            public void onMessage(Message message, byte[] pattern) {
                String expiredKey = message.toString();
                if (expiredKey.startsWith("order:")) {
                    // 处理订单超时逻辑
                    String orderId = expiredKey.split(":")[1];
                    // 这里调用你的服务类方法，处理订单超时逻辑
                    // orderService.cancelOrder(orderId);
                }
            }
        }, new PatternTopic("__keyevent@*__:expired"));
        return container;
    }
}
```

在这个示例中，"`__keyevent@*__:expired`"是一个模式匹配的主题，它可以匹配所有数据库的键过期事件。当一个键过期时，onMessage方法会被调用，你可以在这里加入你的逻辑来处理订单的超时取消。



请注意，这里的代码只是一个基本示例。在实际使用中，你可能需要根据自己的需要对代码进行相应的调整和优化。



# 总结

以上三种方案都可以实现订单在30分钟内未支付则自动取消的需求。根据实际业务需求、系统负载和其他因素，可以选择最适合自己系统的实现方案。每种方案都有其优缺点，需要根据具体情况权衡。