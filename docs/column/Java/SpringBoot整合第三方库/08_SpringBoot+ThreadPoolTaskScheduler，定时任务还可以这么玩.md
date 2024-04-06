# SpringBoot+ThreadPoolTaskScheduler，定时任务还可以这么玩

最近做了一个需求：将定时任务保存到数据库中，并在页面上实现定时任务的开关，以及更新定时任务时间后重新创建定时任务。



于是想到了SpringBoot中自带的`ThreadPoolTaskScheduler`。

在SpringBoot中提供的`ThreadPoolTaskScheduler`这个类，该类提供了一个`schedule(Runnable task, Trigger trigger)`的方法可以实现定时任务的创建，该方法是通过管理线程来实现。

`schedule(Runnable task, Trigger trigger)`源码：

```java
public ScheduledFuture<?> schedule(Runnable task, Trigger trigger) {
        ScheduledExecutorService executor = getScheduledExecutor();
        try {
                ErrorHandler errorHandler = this.errorHandler;
                if (errorHandler == null) {
                        errorHandler = TaskUtils.getDefaultErrorHandler(true);
                }
                return new ReschedulingRunnable(task, trigger, executor, errorHandler).schedule();
        }
        catch (RejectedExecutionException ex) {
                throw new TaskRejectedException("Executor [" + executor + "] did not accept task: " + task, ex);
        }
}
```

上述源码中，首先会获取定时任务执行服务，即：`ScheduledExecutorService executor = getScheduledExecutor();` ，然后创建重排线程类，并调用`schedule()` 方法来创建`ScheduledFuture<?> `。

在`ScheduledFuture<?>` 中提供了`cancel(boolean mayInterruptIfRunning)` 来实现定时任务的删除。通过这两个方法，我们可以实现上述的需求。

废话不多说，代码撸起。

# 代码实现

## 定时任务线程配置

```java
/**
 * @author: jiangjs
 * @description: 
 * @date: 2023/2/17 9:51
 **/
@Configuration
public class SchedulingTaskConfig {
    @Bean(name = "taskSchedulerPool")
    public ThreadPoolTaskScheduler threadPoolTaskScheduler(){
        ThreadPoolTaskScheduler taskScheduler = new ThreadPoolTaskScheduler();
        //设置线程池大小
        taskScheduler.setPoolSize(60);
        //线程名称前缀
        taskScheduler.setThreadNamePrefix("task-pool-");
        //设置终止时等待最大时间，单位s，即在关闭时，需等待其他任务完成执行
        taskScheduler.setAwaitTerminationSeconds(3000);
        //设置关机时是否等待计划任务完成，不中断正在运行的任务并执行队列中的所有任务，默认false
        taskScheduler.setWaitForTasksToCompleteOnShutdown(true);
        return taskScheduler;
    }
}
```

##  获取类工具

```java
/**
 * @author: jiangjs
 * @description: 上下文获取类
 * @date: 2023/1/30 10:28
 **/
@Component
public class SpringContextUtils implements ApplicationContextAware {
    private static ApplicationContext context;
    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        SpringContextUtils.context = applicationContext;
    }

    public static Object getBean(String name){
        return context.getBean(name);
    }
}
```

通过`ApplicationContext`中getBean通过类名来获取对应的类。



## 创建定时任务线程类

由于`ThreadPoolTaskScheduler`是基于线程来创建定时任务的，因此我们封装一个类来实现Runnable，其主要作用是获取数据参数，绑定定时任务类及定时任务方法，然后在通过反射拿到方法进行执行。参数则定义成泛型，便于直接传递，定时任务方法获取后不需要再次转换。

```java
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ReflectionUtils;
import java.lang.reflect.Method;
import java.util.Objects;
/**
 * @author: jiangjs
 * @description: 实现定时任务线程
 * @date: 2023/2/16 15:31
 **/
@Slf4j
public class SchedulingTaskRunnable<T> implements Runnable {
    /**
     * 其他参数
     */
    private final T t;
    /**
     * 定时任务类
     */
    private final String clazz;

    /**
     * 定时任务方法
     */
    private final String methodName;

    SchedulingTaskRunnable(T t,String clazz,String methodName){
        this.t = t;
        this.clazz = clazz;
        this.methodName = methodName;
    }

    @Override
    public void run() {
        Object bean = SpringContextUtils.getBean(clazz);
        Method method;
        try{
            method = Objects.nonNull(t) ? bean.getClass().getDeclaredMethod(methodName,t.getClass()) : bean.getClass().getDeclaredMethod(methodName);
            ReflectionUtils.makeAccessible(method);
            if (Objects.nonNull(t)){
                method.invoke(bean,t);
            } else {
                method.invoke(bean);
            }
        }catch (Exception e){
            log.error("获取方法信息报错：{}",e.getMessage());
        }
    }
}
```

## 封装管理定时任务工具

该工具主要实现定时任务的创建和删除方法，在创建定时任务时要先调用删除方法，确保当前任务是唯一的，因此在更新定时任务时间时，只需要调用创建方法即可。

其中定义了一个 `ConcurrentHashMap<String, ScheduledFuture<?>>` ，主要作用是为了管理定时任务，通过自定义的任务名称或Id，获取到`ScheduledFuture<?>`来进行相关操作，例如：调用关闭方法。

```java
 import lombok.extern.slf4j.Slf4j;
 import org.apache.poi.ss.formula.functions.T;
 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
 import org.springframework.scheduling.support.CronTrigger;
 import org.springframework.stereotype.Component;

 import java.util.Objects;
 import java.util.concurrent.ConcurrentHashMap;
 import java.util.concurrent.ScheduledFuture;

 /**
  * @author: jiangjs
  * @description: 定时任务管理方法
  * @date: 2023/2/16 15:48
  **/
 @Component
 @Slf4j
 public class SchedulingTaskManage {

     /**
      * 将任务放入map便于管理
      */
     private final ConcurrentHashMap<String, ScheduledFuture<?>> cache = new ConcurrentHashMap<>();

     @Resource(name = "taskSchedulerPool")
     private ThreadPoolTaskScheduler threadPoolTaskScheduler;

     /**
      * 删除定时任务
      * @param key 自定义定时任务名称
      */
     public void stopSchedulingTask(String key){
         if (Objects.isNull(cache.get(key))){
             log.info(String.format(".......当前key【%s】没有定时任务......",key));
             return;
         }
         ScheduledFuture<?> future = cache.get(key);
         if (Objects.nonNull(future)){
             //关闭当前定时任务
             future.cancel(Boolean.TRUE);
             cache.remove(key);
             log.info(String.format("删除【%s】对应定时任务成功",key));
         }
     }

     /**
      * 创建定时任务
      * @param key 任务key
      * @param runnable 当前线程
      * @param cron 定时任务cron
      */
     public void createSchedulingTask(String key,SchedulingTaskRunnable<T> runnable, String cron){
         ScheduledFuture<?> schedule = taskScheduler.schedule(runnable, new CronTrigger(cron));
         assert schedule != null;
         cache.put(key,schedule);
         log.info(String.format("【%s】创建定时任务成功",key));
     }
 }
```

# 测试

创建的线程类与工具已经封装完成，接下来我们来进行下测试。

先创建定时任务表：

```sql
create table t_schedule_task(
    id int auto_increment primary key not null comment '主键Id',
    task_clazz varchar(200) not null comment '定时任务类',
    task_method varchar(200) not null comment '定时任务执行方法',
    cron varchar(200) not null comment '定时任务时间',
    status smallint not null default 0 comment '定时任务状态，0:开启，1:关闭'
) ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8 comment '定时任务管理
```

## 创建定时任务执行类

```java
/**
* @author: jiangjs
* @description:
* @date: 2023/2/16 16:24
**/
@Slf4j
@Component(value = "testSchedulingTask")
public class TestSchedulingTask {
    public void taskMethod(UserInfo obj){
        log.info(String.format("调用了当前定时任务:输出参数：参数1：%s,参数2：%s",obj.getUserName(),obj.getPassword()));
    }
}
```

简单获取用户信息，进行显示。

## 创建实现方法

```java
/**
 * @author: jiangjs
 * @description:
 * @date: 2023/1/12 10:53
 **/
@Service
public class ScheduledTaskManageServiceImpl implements ScheduledTaskManageService {
    @Autowired
    private SchedulingTaskManage taskManage;
    @Resource
    private ScheduleTaskMapper scheduleTaskMapper;

    @Override
    public ResultUtil<?> addTask(ScheduleTask task) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserName("张三");
        userInfo.setPassword("121212121212");
        String cron = task.getCron();
        boolean validExpression = CronExpression.isValidExpression(cron);
        if (!validExpression){
            return ResultUtil.error("无效的cron格式，请重新填写");
        }
        scheduleTaskMapper.insert(task);
        SchedulingTaskRunnable<UserInfo> taskRunnable = new SchedulingTaskRunnable<>(userInfo, task.getTaskClazz(), task.getTaskMethod());
        taskManage.createSchedulingTask(String.valueOf(task.getId()), taskRunnable,task.getCron());
        return ResultUtil.success();
    }

    @Override
    public ResultUtil<?> deleteTask(Integer id) {
        scheduleTaskMapper.deleteById(id);
        taskManage.stopSchedulingTask(String.valueOf(id));
        return ResultUtil.success();
    }

    @Override
    public ResultUtil<?> editTask(ScheduleTask task) {
        scheduleTaskMapper.updateById(task);
        UserInfo userInfo = new UserInfo();
        userInfo.setUserName("张三");
        userInfo.setPassword("33333333");
        SchedulingTaskRunnable<UserInfo> taskRunnable = new SchedulingTaskRunnable<>(userInfo, task.getTaskClazz(), task.getTaskMethod());
        taskManage.createSchedulingTask(String.valueOf(task.getId()), taskRunnable,task.getCron());
        return ResultUtil.success();
    }
}
```

上述代码中`ScheduleTaskMapper`是继承Mybatis-plus中的BaseMapper实现单表操作，小伙伴们可自行实现。



## 执行结果

我们创建了三个方法，分别是：`addTask`，`editTask`，`deleteTask`来实现定时任务的删除，添加，具体实现参考上面代码。看看执行结果：

创建定时任务：

提交参数：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221213946465-17085227876211.png)



- **taskClazz：** 对应测试类 `@Component(value = "testSchedulingTask")`中的value值
- **taskMethod：** 测试内中的执行方法。如：`TestSchedulingTask`中的taskMethod方法
- **cron：** 定时任务的cron格式时间

从执行结果动态图可以看到，任务每隔5s就会获取一次用户信息。



删除定时任务：



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221214106897-17085228687472.png)



删除Id为1000的数据库任务，同时也是删除key为1000的定时任务



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240221214132236-17085228932263.png)



任务被删除后，即使过了5s依然没有任务在执行。



## 总结

`ThreadPoolTaskScheduler`实现定时任务主要是通过对线程的管理来进行操作，添加任务时即创建一个线程，删除时即将该线程删除。因此在创建定时任务只需要创建线程就可以，在创建线程时，通过反射来获取对应的方法及传递参数。

上述就是使用SprngBoot中的`ThreadPoolTaskScheduler`来实现定时任务，我们只要使用前端连接相应的接口就可以实现管理人员管理定时任务的功能。



