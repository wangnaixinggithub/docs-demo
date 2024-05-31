# CAM



:::details  `UF_NCPROG_create 创建程序组`

```c

#include <uf_setup.h>
#include<uf_ncgroup.h>
#include<uf_ui.h>
#include<uf_ui_ont.h>
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();
 
    uc1601("1", 1);

    //获取加工设置
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);
    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境!", 1);
        return;
    }

    //创建程序组
    tag_t new_object = NULL_TAG;
    UF_NCPROG_create("mill_planar","PROGRAM",&new_object);

    //获取加工几何视图的根节点
    tag_t program_group = NULL_TAG;
    UF_SETUP_ask_program_root(setup_tag,&program_group);

    //往程序组里添加成员
    UF_NCGROUP_accept_member(program_group,new_object);

    //设置成员
    UF_OBJ_set_name(new_object, "WNX");

    UF_UI_ONT_refresh();
 	   
    UF_terminate();
 }
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%9B%E5%BB%BA%E7%A8%8B%E5%BA%8F%E7%BB%84.gif)

:::details `UF_NCGEOM_create创建NC几何组`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();


    //获取当前NX的加工设置TAG
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);

    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境", 1);
        return;
    }

    //获取几何视图的根节点
    tag_t geom_group = NULL_TAG;
    UF_SETUP_ask_geom_root(setup_tag,&geom_group);

    //创建加工坐标系
    tag_t mcsTag = NULL_TAG;
    UF_NCGEOM_create("mill_planar","MCS",&mcsTag);

    //添加成员
    UF_NCGROUP_accept_member(geom_group,mcsTag);

    //修改加工坐标系的名称
    UF_OBJ_set_name(mcsTag,"MyMCS");

    tag_t workpieceTag = NULL_TAG;
    UF_NCGEOM_create("mill_planar", "WORKPIECE", &workpieceTag);
    
    //添加workPiece到加工坐标系下
    UF_NCGROUP_accept_member(mcsTag, workpieceTag);
    UF_OBJ_set_name(workpieceTag, "MyWorkPiece");


    //刷新加工导航器
    UF_UI_ONT_refresh();
    UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%9B%E5%BB%BANC%E5%87%A0%E4%BD%95%E7%BB%84.gif)

:::detail `UF_NCMTHD_create创建加工方法`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();
 
    //获取当前NX的加工设置TAG
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);

    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境", 1);
        return;
    }

   //获取加工方法视图的根节点
    tag_t mthd_group = NULL_TAG;
    UF_SETUP_ask_mthd_root(setup_tag, &mthd_group);


    //创建加工方法
    tag_t new_object = NULL_TAG;
    UF_NCMTHD_create("mill_planar","MILL_METHOD",&new_object);

    //添加成员
    UF_NCGROUP_accept_member(mthd_group, new_object);

    //修改加工方法的名字
    UF_OBJ_set_name(new_object,"MyCam");


    //刷新加工导航器
    UF_UI_ONT_refresh();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%9B%E5%BB%BA%E5%8A%A0%E5%B7%A5%E6%96%B9%E6%B3%95.gif)