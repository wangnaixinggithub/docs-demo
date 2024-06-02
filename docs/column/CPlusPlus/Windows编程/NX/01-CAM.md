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

:::details `CAMGroupCollection.CreateProgram 创建程序组`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());


    //判断 如果CAM模块有没有被加载
    bool result1;
    result1 = theSession->IsCamSessionInitialized();

    //没有，则进行配置注入
    if (!result1)
    {
        //创建CAM会话
        theSession->CreateCamSession();
        CAM::CAMSetup* cAMSetup1;
        
        //并创建CAM设置
        cAMSetup1 = workPart->CreateCamSetup("mill_planar");
    }

    //创建程序组
    CAM::NCGroup* ncGroupObj = nullptr;
    ncGroupObj = workPart->CAMSetup()->CAMGroupCollection()->CreateProgram(
        workPart->CAMSetup()->GetRoot(CAM::CAMSetup::View::ViewProgramOrder),
        "mill_planar",
        "PROGRAM", 
        CAM::NCGroupCollection::UseDefaultNameTrue, "PROGRAM_1");
    ncGroupObj->SetName("WNX");

    //往程序组里添加成员
    CAM::ProgramOrderGroupBuilder* programOrderGroupBuilder1 = nullptr;
    programOrderGroupBuilder1 = workPart->CAMSetup()->CAMGroupCollection()->CreateProgramOrderGroupBuilder(ncGroupObj);


    NXObject* nXObject1 = nullptr;
    nXObject1 = programOrderGroupBuilder1->Commit();


    UF_UI_ONT_refresh();

    UF_terminate();
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

:::details `CAMGroupCollection.CreateGeometry 创建NC几何组 `

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());


    CAM::NCGroup* nCGroupObj = nullptr;
    CAM::MillOrientGeomBuilder* millOrientGeomBuilder1 = nullptr;
    CAM::NCGroup* nCGroupObj2 = nullptr;
    NXObject* nXObject1 = nullptr;
    NXObject* nXObject2 = nullptr;


    //创建加工坐标系
    nCGroupObj = workPart->CAMSetup()->CAMGroupCollection()->CreateGeometry(
        workPart->CAMSetup()->GetRoot(CAM::CAMSetup::View::ViewGeometry),
        "mill_planar", 
        "MCS", 
        CAM::NCGroupCollection::UseDefaultNameTrue, "MCS");
    nCGroupObj->SetName("MyMCS");
    millOrientGeomBuilder1 = workPart->CAMSetup()->CAMGroupCollection()->CreateMillOrientGeomBuilder(nCGroupObj);
    nXObject1 = millOrientGeomBuilder1->Commit();
    millOrientGeomBuilder1->Destroy();


    //添加workPiece到加工坐标系下
    nCGroupObj2 = workPart->CAMSetup()->CAMGroupCollection()->CreateGeometry(
        nCGroupObj, 
        "mill_planar", 
        "WORKPIECE", 
        CAM::NCGroupCollection::UseDefaultNameTrue, "WORKPIECE_1");
    nCGroupObj2->SetName("MyWorkPiece");
    millOrientGeomBuilder1 = workPart->CAMSetup()->CAMGroupCollection()->CreateMillOrientGeomBuilder(nCGroupObj2);
    nXObject2 = millOrientGeomBuilder1->Commit();
    millOrientGeomBuilder1->Destroy();

    UF_UI_ONT_refresh();   
    UF_terminate();
 }
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%9B%E5%BB%BANC%E5%87%A0%E4%BD%95%E7%BB%84.gif)



:::details  `UF_NCMTHD_create创建加工方法`

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

:::details `CAMGroupCollection.CreateMethod创建加工方法 `

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());


    //创建加工方法
    CAM::NCGroup* nCGroup1 = nullptr;
    nCGroup1 = workPart->CAMSetup()->CAMGroupCollection()->CreateMethod(
        workPart->CAMSetup()->GetRoot(CAM::CAMSetup::View::ViewMachineMethod),
        "mill_planar", "MILL_METHOD", CAM::NCGroupCollection::UseDefaultNameTrue, "MILL_METHOD");

    nCGroup1->SetName("MyCam");

    CAM::MillMethodBuilder* millMethodBuilder1;
    millMethodBuilder1 = workPart->CAMSetup()->CAMGroupCollection()->CreateMillMethodBuilder(nCGroup1);

    NXObject* nXObject1;
    nXObject1 = millMethodBuilder1->Commit();
    millMethodBuilder1->Destroy();


    UF_UI_ONT_refresh();
    UF_terminate();
    }
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%9B%E5%BB%BA%E5%8A%A0%E5%B7%A5%E6%96%B9%E6%B3%95.gif)







:::details `UF_NCGROUP_accept_member往程序组里添加成员`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();
 
  
    //获取加工设置
    tag_t setupTAG = NULL_TAG;
    UF_SETUP_ask_setup(&setupTAG);
    if (setupTAG == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境！", 1);
        return;
    }

    //创建程序组
    tag_t new_object = NULL_TAG;
    UF_NCPROG_create("mill_planar","PROGRAM", &new_object);

    //获取加工几何视图的根节点
    tag_t program_group = NULL_TAG;
    UF_SETUP_ask_program_root(setupTAG,&program_group);


    //往程序组里面添加成员
    UF_NCGROUP_accept_member(program_group, new_object);

    UF_OBJ_set_name(new_object,"WNX");


    //刷新加工导航器
    UF_UI_ONT_refresh();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%BE%80%E7%A8%8B%E5%BA%8F%E7%BB%84%E9%87%8C%E9%9D%A2%E6%B7%BB%E5%8A%A0%E6%88%90%E5%91%98.gif)

:::details `UF_NCGROUP_ask_object_of_name通过名称获得指定组(NCGroup)的TAG`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();
 
  
    //获取加工设置
    tag_t setupTAG = NULL_TAG;
    UF_SETUP_ask_setup(&setupTAG);
    if (setupTAG == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境！", 1);
        return;
    }

    //创建程序组
    tag_t new_object = NULL_TAG;
    UF_NCPROG_create("mill_planar","PROGRAM", &new_object);

    //获取加工几何视图的根节点
    tag_t program_group = NULL_TAG;
    UF_SETUP_ask_program_root(setupTAG,&program_group);


    //往程序组里面添加成员
    UF_NCGROUP_accept_member(program_group, new_object);

    UF_OBJ_set_name(new_object,"WNX");

    //通过名称获得指定组(NCGroup)的TAG
    tag_t programTAG = NULL_TAG;
    UF_NCGROUP_ask_object_of_name(program_group,"WNX",&programTAG);
    stringstream strStram;
    strStram << "programTAG " << programTAG << "\n";
    UF_UI_open_listing_window();
    UF_UI_write_listing_window(strStram.str().c_str());


    //刷新加工导航器
    UF_UI_ONT_refresh();
 }
```

:::



:::details `CAMGroupCollection.FindObject 通过名称获得指定组(NCGroup)的TAG`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());

    //获取加工设置
    tag_t setupTAG = NULL_TAG;
    UF_SETUP_ask_setup(&setupTAG);
    if (setupTAG == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境！", 1);
        return;
    }

    //创建程序组
    tag_t new_object = NULL_TAG;
    UF_NCPROG_create("mill_planar", "PROGRAM", &new_object);

    //获取加工几何视图的根节点
    tag_t program_group = NULL_TAG;
    UF_SETUP_ask_program_root(setupTAG, &program_group);


    //往程序组里面添加成员
    UF_NCGROUP_accept_member(program_group, new_object);

    UF_OBJ_set_name(new_object, "WNX");

    //通过名称获得指定组(NCGroup)的TAG
    tag_t programTAG = NULL_TAG;
    CAM::NCGroup* ncGroupObj = nullptr;
    try
    {
        ncGroupObj = workPart->CAMSetup()->CAMGroupCollection()->FindObject("WNX");
    }
    catch (const std::exception&)
    {
        ncGroupObj = nullptr;
    }


    stringstream strStram;
    strStram << "programTAG " << ncGroupObj->Tag() << "\n";
    UF_UI_open_listing_window();
    UF_UI_write_listing_window(strStram.str().c_str());


    //刷新加工导航器
    UF_UI_ONT_refresh();

    UF_terminate();
}
```



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240531233207591.png)



:::details `修改操作所属的刀具,几何体,程序组等`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    //获取加工设置
    tag_t setupTAG = NULL_TAG;
    UF_SETUP_ask_setup(&setupTAG);
    if (setupTAG == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境！", 1);
        return;
    }

    //获取加工几何视图的根节点
    tag_t program_group = NULL_TAG;
    UF_SETUP_ask_program_root(setupTAG, &program_group);

    //获取当前加工导航器选中的对象数量和TAG
    int count = 0;
    tag_t* objects = NULL_TAG;
    UF_UI_ONT_ask_selected_nodes(&count,&objects);
    for (size_t i = 0; i < count; i++)
    {
        tag_t operTag = objects[i];
        tag_t objTag = NULL_TAG;
        UF_NCGROUP_ask_object_of_name(program_group,"PROGRAM_COPY_1",&objTag);
        //给PROGRAM_COPY_1组添加一个子组
        UF_NCGROUP_accept_member(objTag, objTag);
    }
    UF_terminate();
}
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E4%BF%AE%E6%94%B9%E7%A8%8B%E5%BA%8F%E7%BB%84%E5%9C%A8%E5%8A%A0%E5%B7%A5%E5%AF%BC%E8%88%AA%E5%99%A8%E7%9A%84%E4%BD%8D%E7%BD%AE.gif)



:::details `UF_CUTTER_create 创建刀具`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    //获取当前NX加工设置TAG
    tag_t setupTAG = NULL_TAG;
    UF_SETUP_ask_setup(&setupTAG);
    if (setupTAG == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境！", 1);
        return;
    }

    //获取机床视图的根节点
    tag_t mct_group = NULL_TAG;
    UF_SETUP_ask_mct_root(setupTAG,&mct_group);

    //创建刀具
    tag_t newToolTag = NULL_TAG;
    UF_CUTTER_create("mill_planar","MILL",&newToolTag);

    //添加刀具到机床视图的根节点下面
    UF_NCGROUP_accept_member(mct_group,newToolTag);
    UF_OBJ_set_name(newToolTag,"D14");


    //刷新加工导航器
    UF_UI_ONT_refresh();

    UF_terminate();


}
```

:::



:::details `CAMGroupCollection.CreateTool 创建刀具`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());

    //创建刀具
    CAM::NCGroup* nCGroup2 = nullptr;
    nCGroup2 = workPart->CAMSetup()->CAMGroupCollection()->CreateTool(
        workPart->CAMSetup()->GetRoot(CAM::CAMSetup::View::ViewMachineTool),
        "mill_planar", 
        "MILL", CAM::NCGroupCollection::UseDefaultNameTrue, "MILL");
    nCGroup2->SetName("D14");

    CAM::MillToolBuilder* millToolBuilder1;
    millToolBuilder1 = workPart->CAMSetup()->CAMGroupCollection()->CreateMillToolBuilder(nCGroup2);

    NXObject* nXObject1;
    nXObject1 = millToolBuilder1->Commit();
    millToolBuilder1->Destroy();

    UF_UI_ONT_refresh();
    UF_terminate();
 }
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%9B%E5%BB%BA%E5%88%80%E5%85%B7.gif)



:::details `UF_PARAM_ask_double_value获取刀具的直径,总长,刃长等`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    //获取当前NX加工设置TAG
    tag_t setupTAG = NULL_TAG;
    UF_SETUP_ask_setup(&setupTAG);
    if (setupTAG == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境！", 1);
        return;
    }

    //获取机床视图的根节点
    tag_t mct_group = NULL_TAG;
    UF_SETUP_ask_mct_root(setupTAG,&mct_group);

    //创建刀具
    tag_t newToolTag = NULL_TAG;
    UF_CUTTER_create("mill_planar","MILL",&newToolTag);

    //添加刀具到机床视图的根节点下面
    UF_NCGROUP_accept_member(mct_group,newToolTag);
   
    //设置刀具的名字
    UF_OBJ_set_name(newToolTag,"D14");


    //刷新加工导航器
    UF_UI_ONT_refresh();

    //获取刀具的直径
    double DIAMETERvalue = 0;
    UF_PARAM_ask_double_value(newToolTag,UF_PARAM_TL_DIAMETER,&DIAMETERvalue);
    
    //获取刀具总长
    double HEIGHTvalue = 0;
    UF_PARAM_ask_double_value(newToolTag, UF_PARAM_TL_HEIGHT,&HEIGHTvalue);

    //获取刀具刃长
    double FLUTE_LNvalue = 0;
    UF_PARAM_ask_double_value(newToolTag, UF_PARAM_TL_FLUTE_LN, &FLUTE_LNvalue);

   //获取刀具锥度 角度为弧度制 
    double TAPER_ANGvalue = 0;
    UF_PARAM_ask_double_value(newToolTag, UF_PARAM_TL_TAPER_ANG, &TAPER_ANGvalue);

    //获取设置刀具尖角
    double TIP_ANGvalue = 0;
    UF_PARAM_ask_double_value(newToolTag, UF_PARAM_TL_TIP_ANG, &TAPER_ANGvalue);

    //获取刀具切削刃数量
    int TL_NUM_FLUTESvalue = 0;
    UF_PARAM_ask_int_value(newToolTag, UF_PARAM_TL_NUM_FLUTES, &TL_NUM_FLUTESvalue);

    //获取刀具号 刀补号 补偿号
    int TL_NUMBEvalue = 0;
    UF_PARAM_ask_int_value(newToolTag, UF_PARAM_TL_NUMBER, &TL_NUMBEvalue);


    int TL_ADJ_REGvalue = 0;
    UF_PARAM_ask_int_value(newToolTag, UF_PARAM_TL_ADJ_REG, &TL_ADJ_REGvalue);

    int TL_CUTCOM_REGvalue = 0;
    UF_PARAM_ask_int_value(newToolTag, UF_PARAM_TL_CUTCOM_REG, &TL_CUTCOM_REGvalue);


    stringstream strStream;
    strStream
        << "刀具的直径 " << DIAMETERvalue
        << "刀具总长 " << HEIGHTvalue
        << "刀具刃长 " << FLUTE_LNvalue
        << "刀具锥度 " << TAPER_ANGvalue
        << "刀具尖角 " << TIP_ANGvalue
        << "刀具切削刃数量 " << TL_NUM_FLUTESvalue
        << "刀具号  " << TL_NUMBEvalue
        << "刀补号 " << TL_ADJ_REGvalue
        << "补偿号 " << TL_CUTCOM_REGvalue;

    UF_UI_open_listing_window();
    UF_UI_write_listing_window(strStream.str().c_str());


    UF_terminate();
}
```

:::



:::details `millToolBuilder1.xxxBuilder.Value获取刀具的直径,总长,刃长等`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());



    //获取当前NX加工设置TAG
    tag_t setupTAG = NULL_TAG;
    UF_SETUP_ask_setup(&setupTAG);
    if (setupTAG == NULL_TAG)
    {
        uc1601("提示:请初始化加工环境！", 1);
        return;
    }
    //获取机床视图的根节点
    tag_t mct_group = NULL_TAG;
    UF_SETUP_ask_mct_root(setupTAG, &mct_group);
    //创建刀具
    tag_t newToolTag = NULL_TAG;
    UF_CUTTER_create("mill_planar", "MILL", &newToolTag);
    //添加刀具到机床视图的根节点下面
    UF_NCGROUP_accept_member(mct_group, newToolTag);
    //设置刀具的名字
    UF_OBJ_set_name(newToolTag, "D14");
    //刷新加工导航器
    UF_UI_ONT_refresh();

    CAM::Tool* toolObj = dynamic_cast<CAM::Tool*>(NXObjectManager::Get(newToolTag));
    CAM::MillToolBuilder* millToolBuilder1;
    millToolBuilder1 = workPart->CAMSetup()->CAMGroupCollection()->CreateMillToolBuilder(toolObj);

    //获取刀具的直径
    double DIAMETERvalue = 0;
    DIAMETERvalue =  millToolBuilder1->TlDiameterBuilder()->Value();
    //获取刀具总长
    double HEIGHTvalue = 0;
    HEIGHTvalue = millToolBuilder1->TlHeightBuilder()->Value();
    //获取刀具刃长
    double FLUTE_LNvalue = 0;
    FLUTE_LNvalue = millToolBuilder1->TlFluteLnBuilder()->Value();
    //获取刀具锥度 角度为弧度制 
    double TAPER_ANGvalue = 0;
    TAPER_ANGvalue = millToolBuilder1->TlTaperAngBuilder()->Value();
    //获取设置刀具尖角
    double TIP_ANGvalue = 0;
    TIP_ANGvalue = millToolBuilder1->TlTipAngBuilder()->Value();
    //获取刀具切削刃数量
    int TL_NUM_FLUTESvalue = 0;
    TL_NUM_FLUTESvalue = millToolBuilder1->TlNumFlutesBuilder()->Value();
    //获取刀具号 刀补号 补偿号
    int TL_NUMBEvalue = 0;
    TL_NUMBEvalue = millToolBuilder1->TlNumberBuilder()->Value();
    int TL_ADJ_REGvalue = 0;
    TL_ADJ_REGvalue = millToolBuilder1->TlAdjRegBuilder()->Value();
    int TL_CUTCOM_REGvalue = 0;
    TL_CUTCOM_REGvalue = millToolBuilder1->TlCutcomRegBuilder()->Value();

    stringstream strStream;
    strStream
        << "刀具的直径 " << DIAMETERvalue
        << "刀具总长 " << HEIGHTvalue
        << "刀具刃长 " << FLUTE_LNvalue
        << "刀具锥度 " << TAPER_ANGvalue
        << "刀具尖角 " << TIP_ANGvalue
        << "刀具切削刃数量 " << TL_NUM_FLUTESvalue
        << "刀具号  " << TL_NUMBEvalue
        << "刀补号 " << TL_ADJ_REGvalue
        << "补偿号 " << TL_CUTCOM_REGvalue;

    UF_UI_open_listing_window();
    UF_UI_write_listing_window(strStream.str().c_str());

    UF_UI_ONT_refresh();
    UF_terminate();
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/image-20240601001600450.png)



:::details `UF_PARAM_set_double_value修改刀具的直径,总长,刃长等`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{


UF_initialize();

//获取当前NX的加工设置TAG
tag_t setup_tag = NULL_TAG;
UF_SETUP_ask_setup(&setup_tag);
if (setup_tag == NULL_TAG)
{
    uc1601("提示:请先初始化加工环境!", 1);
    return;
}

//获取机床视图的根节点
tag_t mct_group = NULL_TAG;
UF_SETUP_ask_mct_root(setup_tag, &mct_group);

//创建刀具
tag_t newToolTag = NULL_TAG;
UF_CUTTER_create("mill_planar", "MILL", &newToolTag);

//添加刀具到机床视图的根节点下面
UF_NCGROUP_accept_member(mct_group, newToolTag);

//设置刀具的名字
UF_OBJ_set_name(newToolTag, "D14");

//修改刀具的直径
UF_PARAM_set_double_value(newToolTag, UF_PARAM_TL_DIAMETER, 12.0);

//刀具总长
UF_PARAM_set_double_value(newToolTag,UF_PARAM_TL_HEIGHT,113.0);

//刀具刃长
UF_PARAM_set_double_value(newToolTag,UF_PARAM_TL_FLUTE_LN,67.0);

//刀具锥度 角度为弧度，需将度转换为弧度 
UF_PARAM_set_double_value(newToolTag,UF_PARAM_TL_TAPER_ANG,0.0*DEGRA);

//设置刀具尖角
UF_PARAM_set_double_value(newToolTag,UF_PARAM_TL_TIP_ANG,45.0*DEGRA);

//刀具切削刃数量
UF_PARAM_set_int_value(newToolTag,UF_PARAM_TL_NUM_FLUTES, 3);

//刀具号 刀补号 补偿号
UF_PARAM_set_int_value(newToolTag,UF_PARAM_TL_NUMBER,2);
UF_PARAM_set_int_value(newToolTag,UF_PARAM_TL_ADJ_REG,6);
UF_PARAM_set_int_value(newToolTag,UF_PARAM_TL_CUTCOM_REG,9);

//刷新加工导航器
UF_UI_ONT_refresh();

UF_terminate();

}

```

:::

:::details `millToolBuilder1.XXBuilder.SetValue修改刀具的直径,总长,刃长等`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());

    //获取当前NX的加工设置TAG
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);
    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请先初始化加工环境!", 1);
        return;
    }

    //获取机床视图的根节点
    tag_t mct_group = NULL_TAG;
    UF_SETUP_ask_mct_root(setup_tag, &mct_group);

    //创建刀具
    tag_t newToolTag = NULL_TAG;
    UF_CUTTER_create("mill_planar", "MILL", &newToolTag);


    //添加刀具到机床视图的根节点下面
    UF_NCGROUP_accept_member(mct_group, newToolTag);

    //设置刀具的名字
    UF_OBJ_set_name(newToolTag, "D14");

    CAM::CAMObject* toolObj = dynamic_cast<CAM::CAMObject*>(NXObjectManager::Get(newToolTag));
    CAM::MillToolBuilder* millToolBuilder1;
    millToolBuilder1 =   workPart->CAMSetup()->CAMGroupCollection()->CreateMillToolBuilder(toolObj);


    //修改刀具的直径
    millToolBuilder1->TlDiameterBuilder()->SetValue(12.0);
    //刀具总长
    millToolBuilder1->TlHeightBuilder()->SetValue(113.0);
    //刀具刃长
    millToolBuilder1->TlFluteLnBuilder()->SetValue(67.0);
    //刀具锥度 角度为弧度，需将度转换为弧度 
    millToolBuilder1->TlTaperAngBuilder()->SetValue(0.0 * DEGRA);
    //设置刀具尖角
    millToolBuilder1->TlTipAngBuilder()->SetValue(45.0 * DEGRA);
    //刀具切削刃数量
    millToolBuilder1->TlNumFlutesBuilder()->SetValue(3);
    //刀具号 刀补号 补偿号
    millToolBuilder1->TlNumberBuilder()->SetValue(2);
    millToolBuilder1->TlAdjRegBuilder()->SetValue(6);
    millToolBuilder1->TlCutcomRegBuilder()->SetValue(9);

    NXObject* nXObject1;
    nXObject1 = millToolBuilder1->Commit();

    millToolBuilder1->Destroy();

    //刷新加工导航器
    UF_UI_ONT_refresh();
    UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E4%BF%AE%E6%94%B9%E5%88%80%E5%85%B7%E7%9A%84%E7%9B%B4%E5%BE%84%E6%80%BB%E9%95%BF%E5%88%83%E9%95%BF.gif)



:::details `UF_PARAM_generate生成刀路`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();


    //获取当前NX的加工设置TAG
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);
    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请先初始化加工环境!", 1);
        return;
    }

    //获取当前加工导航器选中的对象数量和TAG
    int count = 0;
    tag_t* objects = NULL_TAG;
    UF_UI_ONT_ask_selected_nodes(&count,&objects);

    for (size_t i = 0; i < count; i++)
    {
        //生成刀路
        logical generated = false;
        UF_PARAM_generate(objects[i],&generated);

        //重播刀路
        UF_PARAM_replay_path(objects[i]);

        //生成后处理NC程序
        UF_SETUP_generate_program(setup_tag,objects[i],"MILL_3_AXIS","D:\\123.nc", UF_SETUP_OUTPUT_UNITS_METRIC);
 
        //卸载刀路
        UF_OPER_unload_path(objects[i]);
         
    }

    UF_terminate();
}
```

:::



:::details  `UF_CAMGEOM_append_items附加几何实体列表到对象`

```c
static int select_filter_proc_fn(tag_t object, int type[3], void* user_data, UF_UI_selection_p_t select)
{
    if (object == NULL)
    {
        return UF_UI_SEL_REJECT;
    }
    else
    {
        return UF_UI_SEL_ACCEPT;
    }
}

static int init_proc(UF_UI_selection_p_t select, void* user_data)
{
    int num_triples = 1;//可选类型的数量
    UF_UI_mask_t mask_triples[] = 
    {UF_solid_type, UF_solid_body_subtype, UF_UI_SEL_FEATURE_BODY};//可选对象类型
    UF_UI_set_sel_mask(select, UF_UI_SEL_MASK_CLEAR_AND_ENABLE_SPECIFIC, num_triples, mask_triples);
    if ((UF_UI_set_sel_procs(select, select_filter_proc_fn, NULL, user_data)) == 0)
    {
        return UF_UI_SEL_SUCCESS;
    }
    else
    {
        return UF_UI_SEL_FAILURE;
    }
}

extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();


    //获取当前NX的加工设置TAG
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);
    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请先初始化加工环境!", 1);
        return;
    }

    //获取当前加工导航器选中的对象数量和TAG
    int count = 0;
    tag_t* objects = NULL_TAG;
    UF_UI_ONT_ask_selected_nodes(&count, &objects);
    for (int i = 0; i < count; i++)
    {
        //单对象选择对话框
        char sCue[] = "单对象选择对话框";
        char sTitle[] = "单对象选择对话框";
        int iScope = UF_UI_SEL_SCOPE_NO_CHANGE;
        int iResponse;
        tag_t partTag = NULL_TAG;
        tag_t tView = NULL_TAG;
        double adCursor[3];
        UF_UI_select_with_single_dialog(sCue, sTitle, iScope, init_proc, NULL, &iResponse, &partTag, adCursor, &tView);
        
        //单对象选择对话框
        char sCue1[] = "单对象选择对话框";
        char sTitle1[] = "单对象选择对话框";
        int iScope1 = UF_UI_SEL_SCOPE_NO_CHANGE;
        int iResponse1;
        tag_t blankTag = NULL_TAG;
        tag_t tView1 = NULL_TAG;
        double adCursor1[3];
        UF_UI_select_with_single_dialog(sCue1, sTitle1, iScope1, init_proc, NULL, &iResponse1, &blankTag, adCursor1, &tView1);
        
        //附加几何实体列表到对象
        //UF_CAM_part工件
        //UF_CAM_blank毛坯
        //UF_CAM_check检查体
        //UF_CAM_trim修剪体
        //UF_CAM_cut_area切削区域
        //UF_CAM_wall
        //UF_CAM_drive

        //设置工件
        tag_t part_list[1] = { partTag };
        UF_CAMGEOM_append_items(objects[0], UF_CAM_part, 1, part_list, NULL);
        
        //设置毛坯
        tag_t blank_list[1] = { blankTag };
        UF_CAMGEOM_append_items(objects[0], UF_CAM_blank, 1, blank_list, NULL);


        //释放
        UF_free(objects);



    }

    UF_terminate();
}
```

:::



:::details `cavityMillingBuilder1->PartGeometry(BlankGeometry)附加几何实体列表到对象 `

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    //获取当前NX的加工设置TAG
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);
    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请先初始化加工环境!", 1);
        return;
    }

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());

    //获取指定操作的加工对象 型腔铣
    CAM::CavityMilling* cavityMilling1(dynamic_cast<CAM::CavityMilling*>(workPart->CAMSetup()->CAMOperationCollection()->FindObject("CAVITY_MILL")));
    CAM::CavityMillingBuilder* cavityMillingBuilder1;
    cavityMillingBuilder1 = workPart->CAMSetup()->CAMOperationCollection()->CreateCavityMillingBuilder(cavityMilling1);
    cavityMillingBuilder1->PartGeometry()->InitializeData(false);
    cavityMillingBuilder1->BlankGeometry()->InitializeData(false);


    TaggedObject* taggedObject1 = nullptr;
    TaggedObject* taggedObject2 = nullptr;
    ScCollector* scCollector1 = nullptr;
    ScCollector* scCollector2 = nullptr;
    std::vector<Body*> bodies1(1);
    std::vector<Body*> bodies2(1);

    //找到附加列表项为第一项
    taggedObject1 = cavityMillingBuilder1->PartGeometry()->GeometryList()->FindItem(0);
    taggedObject2 = cavityMillingBuilder1->BlankGeometry()->GeometryList()->FindItem(0);


    //操作定义几何集对象 注入数据
    CAM::GeometrySet* geometrySet1(dynamic_cast<CAM::GeometrySet*>(taggedObject1));
    CAM::GeometrySet* geometrySet2(dynamic_cast<CAM::GeometrySet*>(taggedObject2));

    scCollector1 = geometrySet1->ScCollector();
    scCollector2 = geometrySet2->ScCollector();

    char sCue[] = "单对象选择对话框";
    char sTitle[] = "单对象选择对话框";
    int iScope = UF_UI_SEL_SCOPE_NO_CHANGE;
    int iResponse;
    tag_t partTag = NULL_TAG;
    tag_t tView = NULL_TAG;
    double adCursor[3];
    UF_UI_select_with_single_dialog(sCue, sTitle, iScope, init_proc, NULL, &iResponse, &partTag, adCursor, &tView);
  


    //设置工件
    Body* body1 = dynamic_cast<Body*>(NXObjectManager::Get(partTag));
    bodies1[0] = body1;
    BodyDumbRule* bodyDumbRule1;
    bodyDumbRule1 = workPart->ScRuleFactory()->CreateRuleBodyDumb(bodies1);

    std::vector<SelectionIntentRule*> rules1(1);
    rules1[0] = bodyDumbRule1;
    scCollector1->ReplaceRules(rules1, false);

    //单对象选择对话框
    char sCue1[] = "单对象选择对话框";
    char sTitle1[] = "单对象选择对话框";
    int iScope1 = UF_UI_SEL_SCOPE_NO_CHANGE;
    int iResponse1;
    tag_t blankTag = NULL_TAG;
    tag_t tView1 = NULL_TAG;
    double adCursor1[3];
    UF_UI_select_with_single_dialog(sCue1, sTitle1, iScope1, init_proc, NULL, &iResponse1, &blankTag, adCursor1, &tView1);

    //设置毛坯 
    Body* body2 = dynamic_cast<Body*>(NXObjectManager::Get(blankTag));
    bodies2[0] = body2;
    BodyDumbRule* bodyDumbRule2;
    bodyDumbRule2 = workPart->ScRuleFactory()->CreateRuleBodyDumb(bodies2);

    std::vector<SelectionIntentRule*> rules2(1);
    rules2[0] = bodyDumbRule2;
    scCollector2->ReplaceRules(rules2, false);

    NXObject* nXObject1;
    nXObject1 = cavityMillingBuilder1->Commit();
    cavityMillingBuilder1->Destroy();

    UF_UI_ONT_refresh();
    UF_terminate();
}
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E9%99%84%E5%8A%A0%E5%87%A0%E4%BD%95%E5%AE%9E%E4%BD%93%E5%88%97%E8%A1%A8%E5%88%80%E5%AF%B9%E8%B1%A1.gif)





:::details `UF_CAMGEOM_append_items设置切削区域`

```c
static int select_filter_proc_fn(tag_t object, int type[3], void* user_data, UF_UI_selection_p_t select)
{
    if (object == NULL)
    {
        return UF_UI_SEL_REJECT;
    }
    else
    {
        return UF_UI_SEL_ACCEPT;
    }
}

static int init_proc(UF_UI_selection_p_t select, void* user_data)
{
    int num_triples = 1;//可选类型的数量
    UF_UI_mask_t mask_triples[] =
    { UF_solid_type, UF_solid_body_subtype, UF_UI_SEL_FEATURE_ANY_FACE };//可选对象类型
    UF_UI_set_sel_mask(select, UF_UI_SEL_MASK_CLEAR_AND_ENABLE_SPECIFIC, num_triples, mask_triples);
    if ((UF_UI_set_sel_procs(select, select_filter_proc_fn, NULL, user_data)) == 0)
    {
        return UF_UI_SEL_SUCCESS;
    }
    else
    {
        return UF_UI_SEL_FAILURE;
    }
}

extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();


    //获取当前加工导航器选中的对象数量和TAG
    int count = 0;
    tag_t* objects = NULL_TAG;
    UF_UI_ONT_ask_selected_nodes(&count, &objects);

    for (int i = 0; i < count; i++)
    {
        //单对象选择对话框
        char sCue[] = "单对象选择对话框";
        char sTitle[] = "单对象选择对话框";
        int iScope = UF_UI_SEL_SCOPE_NO_CHANGE;
        int iResponse;
        tag_t faceTag = NULL_TAG;
        tag_t tView = NULL_TAG;
        double adCursor[3];
        UF_UI_select_with_single_dialog(sCue, sTitle, iScope, init_proc, NULL, &iResponse, &faceTag, adCursor, &tView);


        //设置切削区域
        tag_t faceEntity[1] = { faceTag };
        UF_CAMGEOM_append_items(objects[i], UF_CAM_cut_area, 1, faceEntity, NULL);

        //释放
        UF_free(objects);

    }
    UF_terminate();
}
```

:::

:::details `cavityMillingBuilder1.CutAreaGeometry 设置切削区域`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    //获取当前NX的加工设置TAG
    tag_t setup_tag = NULL_TAG;
    UF_SETUP_ask_setup(&setup_tag);
    if (setup_tag == NULL_TAG)
    {
        uc1601("提示:请先初始化加工环境!", 1);
        return;
    }

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());
    using namespace CAM;
    

    CavityMilling* cavityMilling1(dynamic_cast<CAM::CavityMilling*>(workPart->CAMSetup()->CAMOperationCollection()->FindObject("CAVITY_MILL")));
    CAM::CavityMillingBuilder* cavityMillingBuilder1;
    cavityMillingBuilder1 = workPart->CAMSetup()->CAMOperationCollection()->CreateCavityMillingBuilder(cavityMilling1);
    cavityMillingBuilder1->CutAreaGeometry()->InitializeData(false);

    TaggedObject* taggedObject1;
    taggedObject1 = cavityMillingBuilder1->CutAreaGeometry()->GeometryList()->FindItem(0);
    CAM::GeometrySet* geometrySet1(dynamic_cast<CAM::GeometrySet*>(taggedObject1));


    //单对象选择对话框
    char sCue[] = "单对象选择对话框";
    char sTitle[] = "单对象选择对话框";
    int iScope = UF_UI_SEL_SCOPE_NO_CHANGE;
    int iResponse;
    tag_t faceTag = NULL_TAG;
    tag_t tView = NULL_TAG;
    double adCursor[3];
    UF_UI_select_with_single_dialog(sCue, sTitle, iScope, init_proc, NULL, &iResponse, &faceTag, adCursor, &tView);

    std::vector<Face*> faces1(1);
    Face* face1 = dynamic_cast<Face*>(NXObjectManager::Get(faceTag));
    faces1[0] = face1;
    FaceDumbRule* faceDumbRule1;
    faceDumbRule1 = workPart->ScRuleFactory()->CreateRuleFaceDumb(faces1);

    ScCollector* scCollector1;
    scCollector1 = geometrySet1->ScCollector();

    std::vector<SelectionIntentRule*> rules1(1);
    rules1[0] = faceDumbRule1;
    scCollector1->ReplaceRules(rules1, false);

    NXObject* nXObject1;
    nXObject1 = cavityMillingBuilder1->Commit();
    cavityMillingBuilder1->Destroy();
    
    UF_UI_ONT_refresh();
    UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%AE%BE%E7%BD%AE%E5%88%87%E5%89%8A%E5%8C%BA%E5%9F%9F.gif)







:::details `UF_CAMGEOM_append_items设置检查体`

```c
static int select_filter_proc_fn(tag_t object, int type[3], void* user_data, UF_UI_selection_p_t select)
{
    if (object == NULL)
    {
        return UF_UI_SEL_REJECT;
    }
    else
    {
        return UF_UI_SEL_ACCEPT;
    }
}
static int init_proc(UF_UI_selection_p_t select, void* user_data)
{
    int num_triples = 1;//可选类型的数量
    UF_UI_mask_t mask_triples[] =
    { UF_solid_type, UF_solid_body_subtype, UF_UI_SEL_FEATURE_BODY };//可选对象类型
    UF_UI_set_sel_mask(select, UF_UI_SEL_MASK_CLEAR_AND_ENABLE_SPECIFIC, num_triples, mask_triples);
    if ((UF_UI_set_sel_procs(select, select_filter_proc_fn, NULL, user_data)) == 0)
    {
        return UF_UI_SEL_SUCCESS;
    }
    else
    {
        return UF_UI_SEL_FAILURE;
    }
}
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    //获取当前加工导航器选中的对象数量和TAG
    int count = 0;
    tag_t* objects = NULL_TAG;
    UF_UI_ONT_ask_selected_nodes(&count, &objects);
    for (int i = 0; i < count; i++)
    {
        //单对象选择对话框
        char sCue[] = "单对象选择对话框";
        char sTitle[] = "单对象选择对话框";
        int iScope = UF_UI_SEL_SCOPE_NO_CHANGE;
        int iResponse;
        tag_t bodyTag = NULL_TAG;
        tag_t tView = NULL_TAG;
        double adCursor[3];
        UF_UI_select_with_single_dialog(sCue, sTitle, iScope, init_proc, NULL, &iResponse, &bodyTag, adCursor, &tView);

        //设置检查体
        tag_t entity_list[1] = { bodyTag };
        UF_CAMGEOM_append_items(objects[i], UF_CAM_check, 1, entity_list, NULL);
    }

    UF_terminate();
}
```

:::



:::details ` cavityMillingBuilder1->CheckGeometry 设置检查体`

```c
extern "C" DllExport void  ufusr(char *param, int *retcod, int param_len)
{
    UF_initialize();

    Session* theSession = Session::GetSession();
    Part* workPart(theSession->Parts()->Work());
    Part* displayPart(theSession->Parts()->Display());



    CAM::CavityMilling* cavityMilling1(dynamic_cast<CAM::CavityMilling*>(workPart->CAMSetup()->CAMOperationCollection()->FindObject("CAVITY_MILL")));
    CAM::CavityMillingBuilder* cavityMillingBuilder1;
    cavityMillingBuilder1 = workPart->CAMSetup()->CAMOperationCollection()->CreateCavityMillingBuilder(cavityMilling1);
    cavityMillingBuilder1->CheckGeometry()->InitializeData(false);

    TaggedObject* taggedObject1;
    taggedObject1 = cavityMillingBuilder1->CheckGeometry()->GeometryList()->FindItem(0);

    CAM::GeometrySet* geometrySet1(dynamic_cast<CAM::GeometrySet*>(taggedObject1));


    //单对象选择对话框
    char sCue[] = "单对象选择对话框";
    char sTitle[] = "单对象选择对话框";
    int iScope = UF_UI_SEL_SCOPE_NO_CHANGE;
    int iResponse;
    tag_t bodyTag = NULL_TAG;
    tag_t tView = NULL_TAG;
    double adCursor[3];
    UF_UI_select_with_single_dialog(sCue, sTitle, iScope, init_proc, NULL, &iResponse, &bodyTag, adCursor, &tView);


    std::vector<Body*> bodies1(1);
    Body* body1 = dynamic_cast<Body*>(NXObjectManager::Get(bodyTag));
    bodies1[0] = body1;
    BodyDumbRule* bodyDumbRule1;
    bodyDumbRule1 = workPart->ScRuleFactory()->CreateRuleBodyDumb(bodies1);

    ScCollector* scCollector1;
    scCollector1 = geometrySet1->ScCollector();

    std::vector<SelectionIntentRule*> rules1(1);
    rules1[0] = bodyDumbRule1;
    scCollector1->ReplaceRules(rules1, false);

    NXObject* nXObject1;
    nXObject1 = cavityMillingBuilder1->Commit();
    cavityMillingBuilder1->Destroy();

    UF_UI_ONT_refresh();
    UF_terminate();
    }
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%AE%BE%E7%BD%AE%E6%A3%80%E6%9F%A5%E4%BD%93.gif)



:::details `UFUN从对象中获取的给定类型的所有几何项目UF_CAMGEOM_ask_items`

```c
static int select_filter_proc_fn(tag_t object, int type[3], void* user_data, UF_UI_selection_p_t select)
{
	if (object == NULL)
	{
		return UF_UI_SEL_REJECT;
	}
	else
	{
		return UF_UI_SEL_ACCEPT;
	}
}
static int init_proc(UF_UI_selection_p_t select, void* user_data)
{
	int num_triples = 1;//可选类型的数量
	UF_UI_mask_t mask_triples[] =
	{ UF_solid_type, UF_solid_body_subtype, UF_UI_SEL_FEATURE_BODY };//可选对象类型
	UF_UI_set_sel_mask(select, UF_UI_SEL_MASK_CLEAR_AND_ENABLE_SPECIFIC, num_triples, mask_triples);
	if ((UF_UI_set_sel_procs(select, select_filter_proc_fn, NULL, user_data)) == 0)
	{
		return UF_UI_SEL_SUCCESS;
	}
	else
	{
		return UF_UI_SEL_FAILURE;
	}
}
static void ECHO(char* format, ...)
{
	char msg[200];
	va_list args;
	va_start(args, format);
	vsnprintf_s(msg, sizeof(msg), _TRUNCATE, format, args);
	va_end(args);
	UF_UI_open_listing_window();
	UF_UI_write_listing_window(msg);
	UF_print_syslog(msg, FALSE);
}
#define RX(X) report_object_info(#X, X)
static void report_object_info(char* what, tag_t object)
{
	logical is_occ;
	int status,subtype,type;
	tag_t owning_part,part = UF_PART_ask_display_part();
	char owning_part_name[UF_CFI_MAX_FILE_NAME_SIZE],msg[133];

	status = UF_OBJ_ask_status(object);
	UF_OBJ_ask_type_and_subtype(object, &type, &subtype);
	is_occ = UF_ASSEM_is_occurrence(object);

	ECHO("%s = %d, type=%d, subtype=%d, status=%d, occ=%d",
		what, object, type, subtype, status, is_occ);

	if (is_occ)
	{
		ECHO(", occurrence");
		owning_part = UF_ASSEM_ask_part_occurrence(object);
		if (owning_part != UF_ASSEM_ask_root_part_occ(part))
		{
			if (!UF_OBJ_ask_name(owning_part, msg))
				ECHO(" (from %s)", msg);
			else
				ECHO(" (from root occ of)", msg);
		}
	}
	else
	{
		int num_occs;
		tag_t* occurrences;

		ECHO(", prototype");
		num_occs = UF_ASSEM_ask_occs_of_entity(object, &occurrences);
		for (int ii = 0; ii < num_occs; ++ii)
		{
			ECHO(" (occ=%d)", occurrences[ii]);
		}
		UF_free(occurrences);
	}

	if (!UF_OBJ_ask_owning_part(object, &owning_part))
	{
		UF_PART_ask_part_name(owning_part, owning_part_name);
		ECHO(", owned by: %s", owning_part_name);
	}

	ECHO("\n\n");
}
static void report_container_objects(tag_t container)
{
	int n_rules;
	int* rule_types;
	UF_SC_input_data_t* rules;
	int n_entities;
	tag_t* entities;
	//获取指定部件的实体
	UF_MODL_ask_container(container, &n_rules, &rule_types, &rules, &n_entities, &entities);
	for (int ii = 0; ii < n_entities; ii++)
	{
		RX(entities[ii]);
	}
}
static void select_from_ONT(void)
{
	tag_t* objects, provider_tag;
	int object_count, type, subtype;
	char  msg[MAX_LINE_SIZE + 1], provider_name[33];
	logical is_initialized;

	//判断是不是初始化的CAM 会话
	if (UF_CAM_is_session_initialized(&is_initialized) || (is_initialized == FALSE))
	{
		return;
	}


	UF_UI_ONT_ask_selected_nodes(&object_count, &objects);
	if (object_count > 0)
	{
		UF_OBJ_ask_type_and_subtype(objects[0], &type, &subtype);

		if (type == UF_machining_geometry_grp_type || type == UF_machining_operation_type)
		{
			if (type == UF_machining_geometry_grp_type)
			{
				ECHO("Object is a UF_machining_geometry_grp_type\n");
			}
			else
			{
				ECHO("Object type is a UF_machining_operation_type\n"); //print..
			}
			/* Note: UF_CAMGEOM_ask_geom_provider() will return the provider tag of the
			  1) Geometry parent if the operation is highlighted ( and is using inherted geom )
			  2) Geometry parent if the Geometry parent is highlighted ( self )
			  3) Operation tag if the operation is highlighted ( and geom is in operation  - self )
			  */

			//获取 provider...
			UF_CAMGEOM_ask_geom_provider(objects[0], UF_CAM_part, &provider_tag);
			UF_OBJ_ask_name(provider_tag, provider_name);
		    ECHO("Provider name is %s and the tag is %u\n", provider_name, provider_tag);

			//使用provider 获取 GeomCount...
			int GeomCount = 0;
			UF_CAMGEOM_item_t* items;
			UF_CAMGEOM_ask_items(provider_tag, UF_CAM_part, &GeomCount, &items);
			for (int i = 0; i < GeomCount; i++)
			{
				//Get 实体项
				tag_t entity;
				UF_CAMGEOM_ask_item_entity(items[i], &entity);
				RX(entity);

				//获取实体容器中的对象
				report_container_objects(entity);
			}
		}
		else
		{
			ECHO("Object is neither UF_machining_geometry_grp_type nor UF_machining_operation_type\n");
		}
		UF_free(objects);
	} 
	else
	{
		ECHO("No objects selected in ONT.");
	}
		
	return;

}
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
	UF_initialize();
	select_from_ONT();
	UF_terminate();
}
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%8E%B7%E5%8F%96%E7%BB%99%E5%AE%9A%E7%B1%BB%E5%9E%8B%E7%9A%84%E6%89%80%E6%9C%89%E5%87%A0%E4%BD%95%E9%A1%B9%E7%9B%AE.gif)



:::details `UF_CAMBND_append_bnd_from_curve附加从边界或曲线创建的边界对象`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
	UF_initialize();

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    tag_t operTag = objects[0];

    //附加从边界或曲线创建的边界对象
    int lineCount=vLineTags.size();
    tag_t curves[1000];
    for (int i=0; i<lineCount; i++)
    {
        if (i<1000)
            curves[i]=vLineTags[i];
    }

    UF_CAMBND_boundary_data_t boundary_data;
    boundary_data.boundary_type=UF_CAM_boundary_type_closed;
    boundary_data.plane_type=1;
    boundary_data.origin[0]=0;
    boundary_data.origin[1]=0;
    boundary_data.origin[2]=0;
    boundary_data.matrix[0]=1;
    boundary_data.matrix[1]=0;
    boundary_data.matrix[2]=0;
    boundary_data.matrix[3]=0;
    boundary_data.matrix[4]=1;
    boundary_data.matrix[5]=0;
    boundary_data.matrix[6]=0;
    boundary_data.matrix[7]=0;
    boundary_data.matrix[8]=1;
    boundary_data.material_side=UF_CAM_material_side_in_left;
    boundary_data.ignore_holes=0;
    boundary_data.ignore_islands=0;
    boundary_data.ignore_chamfers=0;
    boundary_data.app_data=NULL;
    UF_CAMBND_append_bnd_from_curve(operTag, UF_CAM_trim, lineCount, curves, &boundary_data,NULL);

}
UF_free(objects);
UF_terminate();
}
```

:::







:::details `UF_CAMBND_append_bnd_from_curve指定检查边界`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{ 
    UF_initialize();
//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    tag_t operTag = objects[0];

    //附加从边界或曲线创建的边界对象
    //指定检查
    int lineCount=vLineTags.size();
    tag_t curves[1000];
    for (int i=0; i<lineCount; i++)
    {
        if (i<1000)
            curves[i]=vLineTags[i];
    }
    UF_CAMBND_boundary_data_t boundary_data;
    boundary_data.boundary_type=UF_CAM_boundary_type_closed;
    boundary_data.plane_type=1;
    boundary_data.origin[0]=0;
    boundary_data.origin[1]=0;
    boundary_data.origin[2]=0;
    boundary_data.matrix[0]=1;
    boundary_data.matrix[1]=0;
    boundary_data.matrix[2]=0;
    boundary_data.matrix[3]=0;
    boundary_data.matrix[4]=1;
    boundary_data.matrix[5]=0;
    boundary_data.matrix[6]=0;
    boundary_data.matrix[7]=0;
    boundary_data.matrix[8]=1;
    boundary_data.material_side=UF_CAM_material_side_in_left;
    boundary_data.ignore_holes=0;
    boundary_data.ignore_islands=0;
    boundary_data.ignore_chamfers=0;
    boundary_data.app_data=NULL;
    UF_CAMBND_append_bnd_from_curve(operTag, UF_CAM_check, lineCount, curves, &boundary_data, NULL);

}

//释放
UF_free(objects);

UF_terminate();
}

```

:::

:::details `UF_CAMBND_append_bnd_from_curve指定部件边界`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
UF_initialize();

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    tag_t operTag = objects[0];

    int edgeCount=vEdgeTags.size();
    tag_t curves[1000];
    for (int i=0; i<edgeCount; i++)
    {
        if (i<1000)
            curves[i]=vEdgeTags[i];
    }
    //指定部件边界
    UF_CAMBND_boundary_data_t boundary_data;
    boundary_data.boundary_type=UF_CAM_boundary_type_closed;
    boundary_data.plane_type=1;
    boundary_data.origin[0]=0;
    boundary_data.origin[1]=0;
    boundary_data.origin[2]=0;
    boundary_data.matrix[0]=1;
    boundary_data.matrix[1]=0;
    boundary_data.matrix[2]=0;
    boundary_data.matrix[3]=0;
    boundary_data.matrix[4]=1;
    boundary_data.matrix[5]=0;
    boundary_data.matrix[6]=0;
    boundary_data.matrix[7]=0;
    boundary_data.matrix[8]=1;
    boundary_data.material_side=UF_CAM_material_side_in_left;
    boundary_data.ignore_holes=0;
    boundary_data.ignore_islands=0;
    boundary_data.ignore_chamfers=0;
    boundary_data.app_data=NULL;
    UF_CAMBND_append_bnd_from_curve(operTag, UF_CAM_part, edgeCount, curves, &boundary_data, NULL);
}

//释放
UF_free(objects);

UF_terminate();
}

```

:::details `UF_CAMBND_append_bnd_from_curve设置毛坯边界`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

 UF_initialize();

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    tag_t operTag = objects[0];

    int edgeCount=vEdgeTags.size();
    tag_t curves[1000];
    for (int i=0; i<edgeCount; i++)
    {
        if (i<1000)
            curves[i]=vEdgeTags[i];
    }
    //设置毛坯边界
    UF_CAMBND_boundary_data_t boundary_data;
    boundary_data.boundary_type=UF_CAM_boundary_type_closed;
    boundary_data.plane_type=1;
    boundary_data.origin[0]=0;
    boundary_data.origin[1]=0;
    boundary_data.origin[2]=0;
    boundary_data.matrix[0]=1;
    boundary_data.matrix[1]=0;
    boundary_data.matrix[2]=0;
    boundary_data.matrix[3]=0;
    boundary_data.matrix[4]=1;
    boundary_data.matrix[5]=0;
    boundary_data.matrix[6]=0;
    boundary_data.matrix[7]=0;
    boundary_data.matrix[8]=1;
    boundary_data.material_side=UF_CAM_material_side_in_left;
    boundary_data.ignore_holes=0;
    boundary_data.ignore_islands=0;
    boundary_data.ignore_chamfers=0;
    boundary_data.app_data=NULL;
    UF_CAMBND_append_bnd_from_curve(operTag, UF_CAM_blank, edgeCount, curves, &boundary_data, NULL);
}

//释放
UF_free(objects);

UF_terminate();

}
```

:::



:::details `UF_CAMBND_append_bnd_from_curve指定修建边界`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
	UF_initialize();

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    tag_t operTag = objects[0];

    //附加从边界或曲线创建的边界对象
    int lineCount=vLineTags.size();
    tag_t curves[1000];
    for (int i=0; i<lineCount; i++)
    {
        if (i<1000)
            curves[i]=vLineTags[i];
    }

    UF_CAMBND_boundary_data_t boundary_data;
    boundary_data.boundary_type=UF_CAM_boundary_type_closed;
    boundary_data.plane_type=1;
    boundary_data.origin[0]=0;
    boundary_data.origin[1]=0;
    boundary_data.origin[2]=0;
    boundary_data.matrix[0]=1;
    boundary_data.matrix[1]=0;
    boundary_data.matrix[2]=0;
    boundary_data.matrix[3]=0;
    boundary_data.matrix[4]=1;
    boundary_data.matrix[5]=0;
    boundary_data.matrix[6]=0;
    boundary_data.matrix[7]=0;
    boundary_data.matrix[8]=1;
    boundary_data.material_side=UF_CAM_material_side_in_left;
    boundary_data.ignore_holes=0;
    boundary_data.ignore_islands=0;
    boundary_data.ignore_chamfers=0;
    boundary_data.app_data=NULL;
    UF_CAMBND_append_bnd_from_curve(operTag, UF_CAM_trim, lineCount, curves, &boundary_data,NULL);

}

//释放
UF_free(objects);

UF_terminate();

}
```

:::

:::details `UF_CAMBND_append_bnd_from_curve设置毛坯边界`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
UF_initialize();

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    tag_t operTag = objects[0];

    int edgeCount=vEdgeTags.size();
    tag_t curves[1000];
    for (int i=0; i<edgeCount; i++)
    {
        if (i<1000)
            curves[i]=vEdgeTags[i];
    }
    //设置毛坯边界
    UF_CAMBND_boundary_data_t boundary_data;
    boundary_data.boundary_type=UF_CAM_boundary_type_closed;
    boundary_data.plane_type=1;
    boundary_data.origin[0]=0;
    boundary_data.origin[1]=0;
    boundary_data.origin[2]=0;
    boundary_data.matrix[0]=1;
    boundary_data.matrix[1]=0;
    boundary_data.matrix[2]=0;
    boundary_data.matrix[3]=0;
    boundary_data.matrix[4]=1;
    boundary_data.matrix[5]=0;
    boundary_data.matrix[6]=0;
    boundary_data.matrix[7]=0;
    boundary_data.matrix[8]=1;
    boundary_data.material_side=UF_CAM_material_side_in_left;
    boundary_data.ignore_holes=0;
    boundary_data.ignore_islands=0;
    boundary_data.ignore_chamfers=0;
    boundary_data.app_data=NULL;
    UF_CAMBND_append_bnd_from_curve(operTag, UF_CAM_blank, edgeCount, curves, &boundary_data, NULL);
}

//释放
UF_free(objects);

UF_terminate();

}
```

:::



:::details `UF_CAMBND_append_bnd_from_face设置面铣操作的面边界`

```c
static int select_filter_proc_fn(tag_t object, int type[3], void* user_data, UF_UI_selection_p_t select)
{
    if (object == NULL)
    {
        return UF_UI_SEL_REJECT;
    }
    else
    {
        return UF_UI_SEL_ACCEPT;
    }
}

static int init_proc(UF_UI_selection_p_t select, void* user_data)
{
    int num_triples = 1;//可选类型的数量
    UF_UI_mask_t mask_triples[] = 
    {UF_solid_type, UF_all_subtype, UF_UI_SEL_FEATURE_PLANAR_FACE};//可选对象类型
    UF_UI_set_sel_mask(select, UF_UI_SEL_MASK_CLEAR_AND_ENABLE_SPECIFIC, num_triples, mask_triples);
    if ((UF_UI_set_sel_procs(select, select_filter_proc_fn, NULL, user_data)) == 0)
    {
        return UF_UI_SEL_SUCCESS;
    }
    else
    {
        return UF_UI_SEL_FAILURE;
    }
}

extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    tag_t operTag = objects[i];

    //单对象选择对话框
    char sCue[] = "单对象选择对话框";
    char sTitle[] = "单对象选择对话框";
    int iScope = UF_UI_SEL_SCOPE_NO_CHANGE;
    int iResponse;
    tag_t faceTag = NULL_TAG;
    tag_t tView = NULL_TAG;
    double adCursor[3];
    UF_UI_select_with_single_dialog(sCue, sTitle, iScope, init_proc, NULL, &iResponse, &faceTag, adCursor, &tView);

    //设置面铣操作的面边界
    UF_CAMBND_boundary_data_t boundary_data;
    boundary_data.boundary_type=UF_CAM_boundary_type_closed;
    boundary_data.plane_type=1;
    boundary_data.origin[0]=0;
    boundary_data.origin[1]=0;
    boundary_data.origin[2]=0;
    boundary_data.matrix[0]=1;
    boundary_data.matrix[1]=0;
    boundary_data.matrix[2]=0;
    boundary_data.matrix[3]=0;
    boundary_data.matrix[4]=1;
    boundary_data.matrix[5]=0;
    boundary_data.matrix[6]=0;
    boundary_data.matrix[7]=0;
    boundary_data.matrix[8]=1;
    boundary_data.material_side=UF_CAM_material_side_in_left;
    boundary_data.ignore_holes=0;
    boundary_data.ignore_islands=0;
    boundary_data.ignore_chamfers=0;
    boundary_data.app_data=NULL;
    UF_CAMBND_append_bnd_from_face(operTag, UF_CAM_blank, faceTag, &boundary_data);
}

//释放
UF_free(objects);
UF_terminate();
}
```

:::



![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%8C%87%E5%AE%9A%E9%9D%A2%E9%93%A3%E6%93%8D%E4%BD%9C%E7%9A%84%E9%9D%A2%E8%BE%B9%E7%95%8C.gif)



:::details `UF_SETUP_ask_mthd_root获得加工方法视图的根节点`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
UF_initialize();

//获取加工设置
tag_t setup_tag = NULL_TAG;
UF_SETUP_ask_setup(&setup_tag);
if (setup_tag == NULL_TAG)
{
    uc1601("提示:请先初始化加工环境", 1);
    return;
}

//获得加工方法视图的根节点
tag_t mthd_group = NULL_TAG;
UF_SETUP_ask_mthd_root(setup_tag, &mthd_group);

//打印
char msg[256];
sprintf_s(msg, "%d", mthd_group);
uc1601(msg, 1);

UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%8E%B7%E5%8F%96%E5%8A%A0%E5%B7%A5%E8%A7%86%E5%9B%BE%E7%9A%84%E6%A0%B9%E8%8A%82%E7%82%B9.gif)

:::details `UF_SETUP_ask_mct_root获得机床(刀具)视图的根节点`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//获取加工设置
tag_t setup_tag = NULL_TAG;
UF_SETUP_ask_setup(&setup_tag);
if (setup_tag == NULL_TAG)
{
    uc1601("提示:请先初始化加工环境", 1);
    return;
}

//获得机床(刀具)视图的根节点
tag_t mct_group = NULL_TAG;
UF_SETUP_ask_mct_root(setup_tag, &mct_group);

//打印
char msg[256];
sprintf_s(msg, "%d", mct_group);
uc1601(msg, 1);

UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%9C%BA%E5%BA%8A%E5%8A%A0%E5%B7%A5%E8%A7%86%E5%9B%BE%E6%A0%B9%E8%8A%82%E7%82%B9.gif)



:::details `UF_SETUP_ask_program_root获得程序组视图的根节点`

```c

extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
UF_initialize();

//获取加工设置
tag_t setup_tag = NULL_TAG;
UF_SETUP_ask_setup(&setup_tag);
if (setup_tag == NULL_TAG)
{
    uc1601("提示:请先初始化加工环境", 1);
    return;
}

//获得程序组视图的根节点
tag_t program_group = NULL_TAG;
UF_SETUP_ask_program_root(setup_tag, &program_group);

//打印
char msg[256];
sprintf_s(msg, "%d", program_group);
uc1601(msg, 1);

UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%8E%B7%E5%8F%96%E7%A8%8B%E5%BA%8F%E7%BB%84%E5%8A%A0%E5%B7%A5%E8%A7%86%E5%9B%BE%E7%9A%84%E6%A0%B9%E8%8A%82%E7%82%B9.gif)



:::details `UF_SETUP_delete_setup删除加工设置`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//删除加工设置
UF_SETUP_delete_setup();

UF_terminate();

}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%A0%E9%99%A4%E5%8A%A0%E5%B7%A5%E8%AE%BE%E7%BD%AE.gif)

:::details `UF_SETUP_ask_setup获取加工设置`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//创建加工设置
UF_SETUP_create(UF_ASSEM_ask_work_part(), "mill_planar");

//获取加工设置
tag_t setup_tag = NULL_TAG;
UF_SETUP_ask_setup(&setup_tag);

//打印
char msg[256];
sprintf_s(msg, "%d", setup_tag);
uc1601(msg, 1);

UF_terminate();

}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%8E%B7%E5%8F%96%E5%8A%A0%E5%B7%A5%E8%AE%BE%E7%BD%AE.gif)



:::details `UF_SETUP_create创建加工设置`

```cython

extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
UF_initialize();

//创建加工设置
UF_SETUP_create(UF_ASSEM_ask_work_part(), "mill_planar");

UF_terminate();
}

```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%9B%E5%BB%BA%E5%8A%A0%E5%B7%A5%E8%AE%BE%E7%BD%AE.gif)



:::details `UF_SETUP_generate_program生成后处理NC程序`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{
 UF_initialize();

//获取加工设置
tag_t setup_tag = NULL_TAG;
UF_SETUP_ask_setup(&setup_tag);

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

for (int i = 0; i < count; i++)
{
    //生成刀路
    logical generated;
    UF_PARAM_generate(objects[i], &generated);

    //重播刀路
    UF_PARAM_replay_path(objects[i]);

    //生成后处理NC程序
    UF_SETUP_generate_program(setup_tag, objects[i], "MILL_3_AXIS", "D:\\123.nc", UF_SETUP_OUTPUT_UNITS_METRIC);

    //卸载刀路
    UF_OPER_unload_path(objects[i]);
}

//释放
UF_free(objects);

UF_terminate();
}
```

:::



:::details `UF_UI_ONT_refresh刷新当前操作导视器`

```c

extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//获取加工设置
tag_t setup_tag = NULL_TAG;
UF_SETUP_ask_setup(&setup_tag);
if (setup_tag == NULL_TAG)
{
    uc1601("提示:请先初始化加工环境", 1);
    return;
}

//创建程序组
tag_t new_object = NULL_TAG;
UF_NCPROG_create("mill_planar", "PROGRAM", &new_object);

//获得加工几何视图的根节点
tag_t program_group = NULL_TAG;
UF_SETUP_ask_program_root(setup_tag, &program_group);

//往程序组里添加成员
UF_NCGROUP_accept_member(program_group, new_object);

//设置名字
UF_OBJ_set_name(new_object, "LSY");

//刷新当前操作导视器
UF_UI_ONT_refresh();

UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%B7%E6%96%B0%E5%BD%93%E5%89%8D%E5%B7%A5%E4%BD%9C%E5%AF%BC%E8%88%AA%E5%99%A8.gif)



:::details `UF_UI_ONT_switch_view切换当前加工导航器指定的视图`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//切换当前加工导航器指定的视图
//UF_UI_ONT_order = 0,      /*  program view  */
//UF_UI_ONT_machine_mode,   /*  method view   */
//UF_UI_ONT_geometry_mode,  /*  geometry view */
//UF_UI_ONT_machine_tool,   /*  tool view     */
UF_UI_ONT_switch_view(UF_UI_ONT_geometry_mode);

UF_terminate();

}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%88%87%E6%8D%A2%E5%BD%93%E5%89%8D%E5%8A%A0%E5%B7%A5%E5%AF%BC%E8%88%AA%E5%99%A8%E6%8C%87%E5%AE%9A%E7%9A%84%E8%A7%86%E5%9B%BE.gif)



:::details `UF_UI_ONT_expand_view展开当前加工导航器中所有节点`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//展开当前加工导航器中所有节点
UF_UI_ONT_expand_view();

UF_terminate();

}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E5%B1%95%E5%BC%80%E5%BD%93%E5%89%8D%E5%8A%A0%E5%B7%A5%E5%AF%BC%E8%88%AA%E5%99%A8%E4%B8%AD%E6%89%80%E6%9C%89%E8%8A%82%E7%82%B9.gif)



:::details `UF_UI_ONT_collapse_view折叠当前加工导航器中所有节点`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//折叠当前加工导航器中所有节点
UF_UI_ONT_collapse_view();

UF_terminate();
}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E6%8A%98%E5%8F%A0%E5%BD%93%E5%89%8D%E5%8A%A0%E5%B7%A5%E5%AF%BC%E8%88%AA%E5%99%A8%E4%B8%AD%E6%89%80%E6%9C%89%E8%8A%82%E7%82%B9%E3%80%91.gif)

:::details `UF_UI_ONT_ask_view获取当前加工导航器所在的视图`

```c
extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//UF_UI_ONT_order = 0,      /*  program view  */
//UF_UI_ONT_machine_mode,   /*  method view   */
//UF_UI_ONT_geometry_mode,  /*  geometry view */
//UF_UI_ONT_machine_tool,   /*  tool view     */
//获取当前加工导航器所在的视图
UF_UI_ONT_tree_mode_t view;
UF_UI_ONT_ask_view(&view);
if (view == UF_UI_ONT_order)
{
    uc1601("当前在程序视图", 1);
}
else if(view == UF_UI_ONT_machine_mode)
{
    uc1601("当前在加工方法视图", 1);
}
else if(view == UF_UI_ONT_geometry_mode)
{
    uc1601("当前在几何视图", 1);
}
else if(view == UF_UI_ONT_machine_tool)
{
    uc1601("当前在机床视图", 1);
}

UF_terminate();

}
```

:::
![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%8E%B7%E5%8F%96%E5%BD%93%E5%89%8D%E5%8A%A0%E5%B7%A5%E5%AF%BC%E8%88%AA%E5%99%A8%E6%89%80%E5%9C%A8%E7%9A%84%E8%A7%86%E5%9B%BE.gif)



:::details `UF_UI_ONT_ask_selected_nodes获取当前加工导航器选中的对象数量和TAG`

```c

extern "C" DllExport void  ufusr(char* param, int* retcod, int param_len)
{

UF_initialize();

//获取当前加工导航器选中的对象数量和TAG
int count = 0;
tag_t* objects = NULL_TAG;
UF_UI_ONT_ask_selected_nodes(&count, &objects);

UF_UI_open_listing_window();
for (int i = 0; i < count; i++)
{
    //打印
    char name[256];
    UF_OBJ_ask_name(objects[i], name);
    UF_UI_write_listing_window(name);
    UF_UI_write_listing_window("\n");
}

//释放
UF_free(objects);

UF_terminate();

}
```

:::

![](https://blogwnx-bucket.oss-cn-beijing.aliyuncs.com/img/%E8%8E%B7%E5%8F%96%E5%BD%93%E5%89%8D%E5%8A%A0%E5%B7%A5%E5%AF%BC%E8%88%AA%E5%99%A8%E9%80%89%E4%B8%AD%E5%AF%B9%E8%B1%A1%E6%95%B0%E9%87%8F%E5%92%8CTAG.gif)



:::details `UF_OPER_create用指定的操作及子操作创建一个操作`

```
1
```

:::
