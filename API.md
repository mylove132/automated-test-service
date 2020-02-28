# 自动化平台接口文档 v1.0.0

## 1 规范说明

### 1.1 通信协议

HTTP协议

### 1.2 格式说明
符号				|说明
:----:			|:---
R				|报文中该元素必须出现（Required）
O				|报文中该元素可选出现（Optional）

### 1.3 接口形式

restful风格

#### 1.4 响应报文示例

#### 1.4.1 SUCCESS
```
{
    "Code":0,
    "message":"success",
    "data":{
    }
}
```
#### 1.4.2 FAIL

```
{
    "Code":10001,
    "message":"userId not invaild",
    "data":{
    }
}
```

## 2. 接口定义
### 2.1 通过平台code码获取目录结构
- **接口说明：** 获取目录结构
- **请求方式：** GET
- **接口地址：** /api/catalog
- `注意事项` 查询的目录isPub以根目录的为准


### 2.1.1 请求参数

  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
&emsp;platformCode				|string		|R			|平台code码,多个用逗号隔开


请求示例：

```
/api/catalog?platformCode=0003,0001

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，[点击跳转](#jump)
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;
&emsp;&emsp;&emsp;isPub     |bool       |R          |目录类型
&emsp;&emsp;&emsp;name      |string     |R          |目录名称
&emsp;&emsp;&emsp;parentId  |number     |R          |父级目录Id
&emsp;&emsp;&emsp;children  |[]         |R          |目录子目录
&emsp;&emsp;&emsp;createDate|date       |R          |创建时间
&emsp;&emsp;&emsp;updateDate|date       |R          |更新时间

返回成功示例

```
{
    "data": [
        {
            "id": 10,
            "createDate": "2019-12-23T09:44:10.599Z",
            "updateDate": "2019-12-23T11:19:34.670Z",
            "name": "上山",
            "isPub": false,
            "parentId": null,
            "children": [
                {
                    "id": 12,
                    "createDate": "2019-12-24T01:56:46.010Z",
                    "updateDate": "2019-12-24T01:56:46.010Z",
                    "name": "武夷山",
                    "isPub": false,
                    "parentId": 10
                },
                {
                    "id": 13,
                    "createDate": "2019-12-24T01:58:39.798Z",
                    "updateDate": "2019-12-24T01:58:39.798Z",
                    "name": "华夏",
                    "isPub": true,
                    "parentId": 10,
                    "children": [
                        {
                            "id": 14,
                            "createDate": "2019-12-24T01:59:42.870Z",
                            "updateDate": "2019-12-24T01:59:42.870Z",
                            "name": "华夏一条龙",
                            "isPub": false,
                            "parentId": 13
                        }
                    ]
                }
            ]
        },
        {
            "id": 11,
            "createDate": "2019-12-23T09:44:18.586Z",
            "updateDate": "2019-12-24T03:31:32.844Z",
            "name": "上山",
            "isPub": false,
            "parentId": null
        }
    ],
    "code": 0,
    "message": "success"
}
```


### 2.2 添加目录
- **接口说明：** 添加目录
- **请求方式：** POST
- **接口地址：** /api/catalog

#### 2.2.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
&emsp;platformCode				|string		|R			|平台code码
&emsp;isPub                 |bool       |O          |是否获取公共的目录,子目录不能为true（default：false）
&emsp;name                  |string     |R          |目录名称
&emsp;parentId              |number     |O          |父级目录ID(null则表示添加为根目录)

请求示例：

```
{
   "name": "课标目录",
   "parentId": 1002 
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示创建成功



### 2.3 更新目录
- **接口说明：** 更新目录
- **请求方式：** PUT
- **接口地址：** /api/catalog

#### 2.3.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;catalogId				|number		|R			|目录id	
&emsp;isPub                 |bool       |O          |是否获取公共的目录,,子目录不能为true（default：false）
&emsp;name                  |string     |R          |目录名称

请求示例：

```
{
   "catalogId": 1001,
   "isPub": false,
   "name": "课标目录",
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示更新成功

返回成功示例
```
{
    "data": {
        "generatedMaps": [],
        "raw": []
    },
    "code": 0,
    "message": "success"
}

```

### 2.4   删除目录
- **接口说明：** 删除目录
- **请求方式：** DELETE
- **接口地址：** /api/catalog

#### 2.4.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;目录ids				|number[]		|R			|目录id集合

请求示例：

```
{
 "ids":[1,2]
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示删除成功
&nbsp;&nbsp;&nbsp;id		|object		|R			|&nbsp;删除的id
&nbsp;&nbsp;&nbsp;result	|object		|R			|&nbsp;删除的结果

返回成功示例

```
{
    "data": [
        {
            "id": "4",
            "result": true
        },
        {
            "id": "5",
            "result": true
        }
    ],
    "code": 0,
    "message": "success"
}

```

### 2.5  查询接口用例
- **接口说明：** 查询用例接口
- **请求方式：** GET
- **接口地址：** /api/case

#### 2.5.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
catalogId				    |number		|O			|目录id(默认查询所有用例)
envId				    |number		|R			|运行环境ID
page	                    |number		|O			|页数(默认1)
limit	                    |number		|O			|每页展示个数(默认10)

请求示例：

```
/api/case?page=1&limit=5&catalogId=1
```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;name |string		|R			|&nbsp;接口名称
&nbsp;&nbsp;&nbsp;&nbsp;header |string		|R			|&nbsp;接口header值
&nbsp;&nbsp;&nbsp;&nbsp;param |string		|R			|&nbsp;接口参数
&nbsp;&nbsp;&nbsp;&nbsp;path |string		|R			|&nbsp;接口url
&nbsp;&nbsp;&nbsp;&nbsp;type |number		|R			|&nbsp;请求类型（GET = 0,POST = 1,DELETE = 2,PUT = 3）
&nbsp;&nbsp;&nbsp;&nbsp;paramType |number		|R			|&nbsp参数类型（TEXT = 0,FILE = 1）
&nbsp;&nbsp;&nbsp;&nbsp;assertText |string		|R			|&nbsp;断言结果
&nbsp;&nbsp;&nbsp;&nbsp;assertKey |string		|R			|&nbsp;断言表达式
&nbsp;&nbsp;&nbsp;&nbsp;isNeedToken |bool		|R			|&nbsp;接口是否需要token
&nbsp;&nbsp;&nbsp;&nbsp;endpointObject |Object		|R			|&nbsp;关联的endpoint实体
&nbsp;&nbsp;&nbsp;&nbsp;assertType |Object		|R			|&nbsp;关联的断言类型
&nbsp;&nbsp;&nbsp;&nbsp;assertJudge |Object		|R			|&nbsp;关联的断言条件

返回成功示例
```
{
    "data": {
        "items": [
            {
                "id": 50,
                "name": "获取测试列表",
                "header": "{}",
                "param": "{\"stuNum\":\"795571161\",\"page\":1,\"size\":5,\"type\":0}",
                "paramType": 0,
                "path": "/cms/user-api/student/homework/v2/homeworklist",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 1,
                "createDate": "2020-01-20T10:29:36.707Z",
                "updateDate": "2020-01-20T10:29:36.707Z",
                "assertText": "10",
                "assertKey": "data.list.length",
                "isNeedToken": true,
                "endpointObject": {
                    "id": 1,
                    "name": "smix1",
                    "endpoint": "https://oapi-smix1.t.blingabc.com"
                },
                "assertType": {
                    "id": 1,
                    "type": "响应参数"
                },
                "assertJudge": {
                    "id": 4,
                    "name": "大于"
                }
            },
            {
                "id": 49,
                "name": "获取百度首页105",
                "header": "{}",
                "param": "{\"stuNum\":\"795571161\",\"page\":1,\"size\":5,\"type\":0}",
                "paramType": 0,
                "path": "/cms/user-api/student/homework/v2/homeworklist",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 1,
                "createDate": "2020-01-20T08:11:41.944Z",
                "updateDate": "2020-01-20T08:11:41.944Z",
                "assertText": "10000",
                "assertKey": "data.code",
                "isNeedToken": true,
                "endpointObject": {
                    "id": 5,
                    "name": "test",
                    "endpoint": "https://oapi.t.blingabc.com"
                },
                "assertType": {
                    "id": 1,
                    "type": "响应参数"
                },
                "assertJudge": {
                    "id": 1,
                    "name": "等于"
                }
            },
            {
                "id": 48,
                "name": "获取百度首页104",
                "header": "{}",
                "param": "{\"stuNum\":\"795571161\",\"page\":1,\"size\":5,\"type\":0}",
                "paramType": 0,
                "path": "/cms/user-api/student/homework/v2/homeworklist",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 1,
                "createDate": "2020-01-20T08:10:29.039Z",
                "updateDate": "2020-01-20T08:10:29.039Z",
                "assertText": "10000",
                "assertKey": "data.code",
                "isNeedToken": true,
                "endpointObject": {
                    "id": 5,
                    "name": "test",
                    "endpoint": "https://oapi.t.blingabc.com"
                },
                "assertType": {
                    "id": 1,
                    "type": "响应参数"
                },
                "assertJudge": {
                    "id": 1,
                    "name": "等于"
                }
            },
            {
                "id": 47,
                "name": "获取百度首页103",
                "header": "{}",
                "param": "{\"stuNum\":\"795571161\",\"page\":1,\"size\":5,\"type\":0}",
                "paramType": 0,
                "path": "/cms/user-api/student/homework/v2/homeworklist",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 1,
                "createDate": "2020-01-20T07:55:13.024Z",
                "updateDate": "2020-01-20T07:55:13.024Z",
                "assertText": "10000",
                "assertKey": "data.code",
                "isNeedToken": true,
                "endpointObject": {
                    "id": 5,
                    "name": "test",
                    "endpoint": "https://oapi.t.blingabc.com"
                },
                "assertType": {
                    "id": 1,
                    "type": "响应参数"
                },
                "assertJudge": {
                    "id": 1,
                    "name": "等于"
                }
            },
            {
                "id": 46,
                "name": "获取百度首页102",
                "header": "{}",
                "param": "{\"stuNum\":\"795571161\",\"page\":1,\"size\":5,\"type\":0}",
                "paramType": 0,
                "path": "/cms/user-api/student/homework/v2/homeworklist",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 1,
                "createDate": "2020-01-20T05:41:20.020Z",
                "updateDate": "2020-01-20T05:41:20.020Z",
                "assertText": "测试-",
                "assertKey": "data.data.list[0].className",
                "isNeedToken": true,
                "endpointObject": {
                    "id": 5,
                    "name": "test",
                    "endpoint": "https://oapi.t.blingabc.com"
                },
                "assertType": {
                    "id": 1,
                    "type": "响应参数"
                },
                "assertJudge": {
                    "id": 7,
                    "name": "包含"
                }
            },
            {
                "id": 45,
                "name": "获取百度首页102",
                "header": "{}",
                "param": null,
                "paramType": 0,
                "path": "/api/catalog",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 0,
                "createDate": "2020-01-19T11:44:35.266Z",
                "updateDate": "2020-01-19T11:48:54.508Z",
                "assertText": "\"code\":0",
                "assertKey": "data.code",
                "isNeedToken": true,
                "endpointObject": {
                    "id": 1,
                    "name": "smix1",
                    "endpoint": "https://oapi-smix1.t.blingabc.com"
                },
                "assertType": {
                    "id": 1,
                    "type": "响应参数"
                },
                "assertJudge": {
                    "id": 1,
                    "name": "等于"
                }
            },
            {
                "id": 20,
                "name": "获取外教排班",
                "header": null,
                "param": "\"{\\\"foreignTeacherId\\\":2413,\\\"beginTime\\\":\\\"2020-01-12 00:00:00\\\",\\\"endTime\\\":\\\"2020-01-18 23:59:59\\\"}\"",
                "paramType": 0,
                "path": "/foreign/user-api/foreign/v1/schedule_red_point",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 1,
                "createDate": "2020-01-17T07:12:42.394Z",
                "updateDate": "2020-01-17T07:12:42.394Z",
                "assertText": "\"code\":0",
                "assertKey": null,
                "isNeedToken": true,
                "endpointObject": {
                    "id": 2,
                    "name": "smix2",
                    "endpoint": "https://oapi-smix2.t.blingabc.com"
                },
                "assertType": null,
                "assertJudge": null
            },
            {
                "id": 15,
                "name": "获取目录定时任务列表",
                "header": "{\"age\":2,\"oa\":3}",
                "param": "{\"gae\":1}",
                "paramType": 0,
                "path": "/api/scheduler",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 0,
                "createDate": "2020-01-16T12:48:08.688Z",
                "updateDate": "2020-01-16T12:48:08.688Z",
                "assertText": "\"code\":0",
                "assertKey": null,
                "isNeedToken": false,
                "endpointObject": {
                    "id": 2,
                    "name": "smix2",
                    "endpoint": "https://oapi-smix2.t.blingabc.com"
                },
                "assertType": null,
                "assertJudge": null
            },
            {
                "id": 12,
                "name": "获取目录定时任务列表",
                "header": {},
                "param": null,
                "paramType": 0,
                "path": "/api/scheduler",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 0,
                "createDate": "2020-01-15T10:45:32.277Z",
                "updateDate": "2020-01-15T10:45:32.277Z",
                "assertText": "\"code\":0",
                "assertKey": null,
                "isNeedToken": false,
                "endpointObject": {
                    "id": 2,
                    "name": "smix2",
                    "endpoint": "https://oapi-smix2.t.blingabc.com"
                },
                "assertType": null,
                "assertJudge": null
            },
            {
                "id": 11,
                "name": "获取腾讯视频次页",
                "header": "{\"name\":\"zhangsan\",\"age\":15}",
                "param": "{\"name\":\"zhangsan\",\"age\":12}",
                "paramType": 0,
                "path": "/api/catalog",
                "endpoint": "https://oapi.t.blingabc.com",
                "type": 0,
                "createDate": "2020-01-14T09:01:08.903Z",
                "updateDate": "2020-01-14T09:01:08.903Z",
                "assertText": "\"code\":0",
                "assertKey": null,
                "isNeedToken": false,
                "endpointObject": {
                    "id": 1,
                    "name": "smix1",
                    "endpoint": "https://oapi-smix1.t.blingabc.com"
                },
                "assertType": null,
                "assertJudge": null
            }
        ],
        "itemCount": 10,
        "totalItems": 20,
        "pageCount": 2,
        "next": "",
        "previous": ""
    },
    "code": 0,
    "message": "success"
}

```


### 2.6  更新接口用例
- **接口说明：** 更新用例接口
- **请求方式：** PUT
- **接口地址：** /api/case

#### 2.6.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;id				    |number		|R			|脚本ID
&emsp;catalogId				|number		|O			|目录ID
&emsp;name			        |string		|O			|脚本名称
&emsp;assertText			        |string		|O			|断言内容
&emsp;assertKey			        |string		|O			|断言key
&emsp;assertType			        |number		|O			|断言类型
&emsp;assertJudge			        |number		|O			|断言关系
&emsp;header			    |string		|O			|header参数{JSON类型}
&emsp;param			        |string		|O			|接口参数{JSON类型}
&emsp;type			        |number		|O			|请求类型（0:GET,1:POST,2:DELETE,3:PUT）
&emsp;paramType			        |number		|O			|请求类型（0:TEXT,1:FILE)
&emsp;endpointId			        |number		|O			|
&emsp;isNeedToken			        |boolean		|O			|

请求示例：

```
{
   "id": 1001,
   "name": "测试",
   "header":{
     "Content-Type": "application/json"
     }
   "param": {
     "name":"zhangsan"
    },
   "type": 1,
   "catalogId": 1
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示更新用例成功


返回成功示例
```
{
"data": {
        "status": true
    },
    "code": 0,
    "message": "success"
}

```

### 2.7  删除接口用例
- **接口说明：** 删除用例接口
- **请求方式：** DETELE
- **接口地址：** /api/case

#### 2.7.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;ids				|number[]		|R			|接口id集合


请求示例：

```
{
	"ids": [11,12]
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|
&nbsp;&nbsp;&nbsp;&nbsp;list						|object		|R			|
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id						|number		|R			|删除的接口ID
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status						|number		|R			|true表示删除成功,false表示删除失败

返回成功示例
```
{
    "data": [
        {
            "id": 11,
            "status": true
        },
        {
            "id": 12,
            "status": true
        }
    ],
    "code": 0,
    "message": "success"
}
```

### 2.8  添加接口用例
- **接口说明：** 添加用例接口
- **请求方式：** POST
- **接口地址：** /api/case

#### 2.8.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;catalogId				|number		|R			|目录id
&emsp;scriptName			|string		|R			|脚本名称
&emsp;header			    |Object		|O			|header参数
&emsp;param			        |string		|O			|接口参数
&emsp;type			        |string		|O			|请求类型（0:GET,1:POST,2:DELETE,3:PUT）默认GET
&emsp;assertText			        |string		|R			|断言value
&emsp;assertKey			        |string		|R			|断言key
&emsp;assertType			        |number		|R			|断言类型
&emsp;assertJudge			        |number		|R			|断言关系
&emsp;endpoint			|string		|O			|endpoint值
&emsp;path			|string		|R			|接口路径
&emsp;endpointId			|number		|R			|endpointId
&emsp;isNeedToken			        |boolean		|O			|

请求示例：

```
{
"name":"小米",
"endpoint":"http://www.lsl.com",
"path":"/api/lsl",
"assertText":"\"code\":0",
"type":1,
"catalogId":3,
"endpointId":3
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id						|object		|R			|&nbsp;添加成功的id

返回成功示例

```
{
    "data": {
        "id": 18
    },
    "code": 0,
    "message": "success"
}
```

### 2.8.1  获取断言类型
- **接口说明：** 添加用例接口
- **请求方式：** GET
- **接口地址：** /api/case/assert-type

#### 2.8.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---


返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id						|number		|R			|&nbsp;类型ID
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type						|string		|R			|&nbsp;类型名称

返回成功示例

```
{
    "data": [
        {
            "id": 1,
            "type": "header"
        },
        {
            "id": 2,
            "type": "data-json"
        }
    ],
    "code": 0,
    "message": "success"
}
```

### 2.8.2  获取断言关系
- **接口说明：** 添加用例接口
- **请求方式：** GET
- **接口地址：** /api/case/assert-judge

#### 2.8.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---


返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id						|number		|R			|&nbsp;关系ID
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name						|string		|R			|&nbsp;关系名称

返回成功示例

```
{
    "data": [
        {
            "id": 1,
            "name": "等于"
        },
        {
            "id": 2,
            "name": "小于"
        },
        {
            "id": 3,
            "name": "小于等于"
        },
        {
            "id": 4,
            "name": "大于"
        },
        {
            "id": 5,
            "name": "大于等于"
        },
        {
            "id": 6,
            "name": "不等于"
        },
        {
            "id": 7,
            "name": "包含"
        },
        {
            "id": 8,
            "name": "不包含"
        }
    ],
    "code": 0,
    "message": "success"
}
```


### 2.8 执行接口用例
- **接口说明：** 执行用例接口
- **请求方式：** POST
- **接口地址：** /api/run/script

#### 2.8.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;endpoint			    |string		|R			|endpoint
&emsp;path			    |string		|O			|接口path
&emsp;header			    |string（json）		|O			|接口header
&emsp;param			    |string（json）		|O			|接口参数
&emsp;paramType			    |number		|O			|参数类型（0：text,1:file）
&emsp;type			    |number		|O			|请求方式(0:get,1:post)
&emsp;assertText			    |string		|O			|断言内容
&emsp;token			    |string		|O			|接口cookie值


请求示例：

```



```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;&nbsp;startTime |date		|R			|&nbsp;接口开始执行时间
&nbsp;&nbsp;&nbsp;&nbsp;endTime |date		|R			|&nbsp;接口结束执行时间
&nbsp;&nbsp;&nbsp;&nbsp;caseId |number		|R			|&nbsp;接口ID
&nbsp;&nbsp;&nbsp;&nbsp;expect |string		|R			|&nbsp;接口断言结果
&nbsp;&nbsp;&nbsp;&nbsp;rumTime |number		|R			|&nbsp;接口执行耗时（毫秒）
&nbsp;&nbsp;&nbsp;&nbsp;result |OBject		|R			|&nbsp;接口执行返回结果（毫秒）

返回示例

```
{
    "data": [
        {
            "startTime": "2020-01-17T03:55:03.981Z",
            "caseId": 1,
            "expect": "\"code\":0",
            "endTime": "2020-01-17T03:55:04.265Z",
            "rumTime": 284,
            "result": {
                "data": [
                    {
                        "id": 3,
                        "createDate": "2020-01-08T08:21:00.207Z",
                        "updateDate": "2020-01-10T09:34:56.086Z",
                        "name": "外教产品线",
                        "isPub": true,
                        "parentId": null,
                        "children": [
                            {
                                "id": 5,
                                "createDate": "2020-01-10T05:50:20.986Z",
                                "updateDate": "2020-01-10T05:50:20.986Z",
                                "name": "外教相关API",
                                "isPub": false,
                                "parentId": 3
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "createDate": "2020-01-08T08:20:17.715Z",
                        "updateDate": "2020-01-10T09:34:48.816Z",
                        "name": "基础业务线",
                        "isPub": true,
                        "parentId": null,
                        "children": [
                            {
                                "id": 4,
                                "createDate": "2020-01-10T05:50:07.168Z",
                                "updateDate": "2020-01-10T05:50:07.168Z",
                                "name": "课件相关API",
                                "isPub": false,
                                "parentId": 2
                            }
                        ]
                    },
                    {
                        "id": 1,
                        "createDate": "2020-01-07T09:49:50.402Z",
                        "updateDate": "2020-01-10T08:31:39.154Z",
                        "name": "唐朝",
                        "isPub": true,
                        "parentId": null,
                        "children": [
                            {
                                "id": 11,
                                "createDate": "2020-01-10T08:55:03.359Z",
                                "updateDate": "2020-01-10T08:55:03.359Z",
                                "name": "12312aadsas",
                                "isPub": false,
                                "parentId": 1
                            }
                        ]
                    }
                ],
                "code": 0,
                "message": "success"
            }
        },
        {
            "startTime": "2020-01-17T03:55:04.714Z",
            "caseId": 2,
            "expect": "\"code\":0",
            "endTime": "2020-01-17T03:55:04.829Z",
            "rumTime": 115,
            "result": "失败的请求: TypeError: name.toUpperCase is not a function"
        }
    ],
    "code": 0,
    "message": "success"
}
```


### 2.9  通过用例Id执行接口用例
- **接口说明：** 执行用例接口
- **请求方式：** POST
- **接口地址：** /api/run/case-script

#### 2.9.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;caseIds			    |number[]		|R			|需要运行的接口ID集合
&emsp;envId			    |number		|R			|环境ID
&emsp;token			    |string		|O			|登录的token值


请求示例：

```
{
	"caseIds": [1,2],
	"envId": 1,
    "token":""
}


```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;&nbsp;startTime |date		|R			|&nbsp;接口开始执行时间
&nbsp;&nbsp;&nbsp;&nbsp;endTime |date		|R			|&nbsp;接口结束执行时间
&nbsp;&nbsp;&nbsp;&nbsp;caseId |number		|R			|&nbsp;接口ID
&nbsp;&nbsp;&nbsp;&nbsp;expect |string		|R			|&nbsp;接口断言结果
&nbsp;&nbsp;&nbsp;&nbsp;rumTime |number		|R			|&nbsp;接口执行耗时（毫秒）
&nbsp;&nbsp;&nbsp;&nbsp;result |Object		|R			|&nbsp;接口执行返回结果（毫秒）
&nbsp;&nbsp;&nbsp;&nbsp;errMsg |string		|R			|&nbsp;执行失败信息
&nbsp;&nbsp;&nbsp;&nbsp;assert |Object		|R			|&nbsp;断言结果
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;relation |string		|R			|&nbsp;判断条件
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;expect |string		|R			|&nbsp;期望结果
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;actual |string		|R			|&nbsp;实际结果
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;result |string		|R			|&nbsp;断言结果

返回示例

```
{
    "data": [
        {
            "startTime": "2020-01-20T07:00:05.305Z",
            "caseId": 46,
            "caseName": "获取百度首页102",
            "endTime": "2020-01-20T07:00:05.697Z",
            "rumTime": 392,
            "result": {
                "code": 10000,
                "msg": "操作成功",
                "data": {
                    "total": 49,
                    "list": [
                        {
                            "classId": 8345,
                            "className": "测试-暑季绘本作业课程L2",
                            "schoolTime": "2_9:00,2_10:00,3_10:40,3_13:00,4_9:20,4_13:50,5_15:30,5_16:20,6_10:10,6_13:50",
                            "classStartDate": "2018-07-10 09:00:00",
                            "classEndDate": "2018-07-13 17:00:00",
                            "courseType": 40,
                            "courseTypeName": "技术服务",
                            "studentLessonList": [
                                {
                                    "classLessonId": 119887,
                                    "classLessonName": "A Day at the Beach",
                                    "beginDate": "2018-07-10 09:00:00",
                                    "endDate": "2018-07-10 09:40:00",
                                    "stuNum": null,
                                    "lessonId": 295,
                                    "classLessonNum": 1,
                                    "coveUrl": "http://img.blingabc.com/f94ec055b5da49799e846952dfe14cf1.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 76935,
                                            "studentNum": "795571161",
                                            "homeworkId": 329,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-12-17 17:42:17",
                                            "grade": 64,
                                            "praise": 0,
                                            "createDate": "2018-07-09 21:27:50",
                                            "status": 1,
                                            "timenum": 8,
                                            "classLessonId": 119887,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 69240,
                                            "studentNum": "795571161",
                                            "homeworkId": 304,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-03-14 20:34:01",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-08-22 23:56:38",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119887,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119888,
                                    "classLessonName": "A Beach Bag",
                                    "beginDate": "2018-07-10 10:00:00",
                                    "endDate": "2018-07-10 10:40:00",
                                    "stuNum": null,
                                    "lessonId": 296,
                                    "classLessonNum": 2,
                                    "coveUrl": "http://img.blingabc.com/1fb6bb7d616543dc823e20ba638b2665.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 76053,
                                            "studentNum": "795571161",
                                            "homeworkId": 338,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-03-15 01:02:13",
                                            "grade": 0,
                                            "praise": 0,
                                            "createDate": "2018-07-09 20:15:04",
                                            "status": 1,
                                            "timenum": 2,
                                            "classLessonId": 119888,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 69665,
                                            "studentNum": "795571161",
                                            "homeworkId": 305,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-03-15 01:02:14",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-08-09 21:15:02",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119888,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119889,
                                    "classLessonName": "On My Street",
                                    "beginDate": "2018-07-11 10:40:00",
                                    "endDate": "2018-07-11 11:20:00",
                                    "stuNum": null,
                                    "lessonId": 297,
                                    "classLessonNum": 3,
                                    "coveUrl": "http://img.blingabc.com/51f8ffbdfad84e02b66369dbcaaedf4e.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 81536,
                                            "studentNum": "795571161",
                                            "homeworkId": 363,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-05-30 23:36:35",
                                            "grade": 41,
                                            "praise": 0,
                                            "createDate": "2018-07-13 21:57:34",
                                            "status": 1,
                                            "timenum": 4,
                                            "classLessonId": 119889,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 70093,
                                            "studentNum": "795571161",
                                            "homeworkId": 306,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-05-30 23:37:03",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-05-30 23:55:37",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119889,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119890,
                                    "classLessonName": "Neighborhood Pride",
                                    "beginDate": "2018-07-11 13:00:00",
                                    "endDate": "2018-07-11 13:40:00",
                                    "stuNum": null,
                                    "lessonId": 298,
                                    "classLessonNum": 4,
                                    "coveUrl": "http://img.blingabc.com/aa03d60ddae744d88db2dbb5fb40abc0.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 83981,
                                            "studentNum": "795571161",
                                            "homeworkId": 364,
                                            "homeworkResourceId": null,
                                            "finish": 2,
                                            "finishDate": "2019-05-30 21:46:05",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-16 16:45:27",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119890,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 70519,
                                            "studentNum": "795571161",
                                            "homeworkId": 307,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:34:05",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119890,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119891,
                                    "classLessonName": "African Adventure",
                                    "beginDate": "2018-07-12 09:20:00",
                                    "endDate": "2018-07-12 10:00:00",
                                    "stuNum": null,
                                    "lessonId": 299,
                                    "classLessonNum": 5,
                                    "coveUrl": "http://img.blingabc.com/25dd346fadec457993fa3635ee3cb294.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 86769,
                                            "studentNum": "795571161",
                                            "homeworkId": 371,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-07-19 17:05:33",
                                            "grade": 0,
                                            "praise": 0,
                                            "createDate": "2018-07-19 17:05:33",
                                            "status": 1,
                                            "timenum": 1,
                                            "classLessonId": 119891,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 70950,
                                            "studentNum": "795571161",
                                            "homeworkId": 308,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:34:41",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119891,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119892,
                                    "classLessonName": "Where Do They Sleep?",
                                    "beginDate": "2018-07-12 13:50:00",
                                    "endDate": "2018-07-12 14:30:00",
                                    "stuNum": null,
                                    "lessonId": 300,
                                    "classLessonNum": 6,
                                    "coveUrl": "http://img.blingabc.com/e099ebd7e40648ccbce28e9226d244fe.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 87219,
                                            "studentNum": "795571161",
                                            "homeworkId": 862,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-05-30 13:46:48",
                                            "grade": 0,
                                            "praise": 0,
                                            "createDate": "2018-07-18 18:01:00",
                                            "status": 1,
                                            "timenum": 1,
                                            "classLessonId": 119892,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 71378,
                                            "studentNum": "795571161",
                                            "homeworkId": 309,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:35:49",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119892,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                }
                            ]
                        },
                        {
                            "classId": 8346,
                            "className": "测试-暑季绘本作业课程L3",
                            "schoolTime": "2_9:00,2_10:00,3_10:40,3_13:00,4_9:20,4_13:50,5_15:30,5_16:20,6_10:10,6_13:50",
                            "classStartDate": "2018-07-10 09:00:00",
                            "classEndDate": "2018-07-13 17:00:00",
                            "courseType": 40,
                            "courseTypeName": "技术服务",
                            "studentLessonList": [
                                {
                                    "classLessonId": 119895,
                                    "classLessonName": "That Much?",
                                    "beginDate": "2018-07-10 09:00:00",
                                    "endDate": "2018-07-10 09:40:00",
                                    "stuNum": null,
                                    "lessonId": 303,
                                    "classLessonNum": 1,
                                    "coveUrl": "http://img.blingabc.com/5a8d7a61325e42d09c17c348af9c645a.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 77343,
                                            "studentNum": "795571161",
                                            "homeworkId": 330,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-12-18 19:34:59",
                                            "grade": 31,
                                            "praise": 0,
                                            "createDate": "2018-07-09 21:28:17",
                                            "status": 1,
                                            "timenum": 10,
                                            "classLessonId": 119895,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 72622,
                                            "studentNum": "795571161",
                                            "homeworkId": 312,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-02-15 13:39:18",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-05-17 14:01:04",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119895,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119896,
                                    "classLessonName": "Save or Spend?",
                                    "beginDate": "2018-07-10 10:00:00",
                                    "endDate": "2018-07-10 10:40:00",
                                    "stuNum": null,
                                    "lessonId": 304,
                                    "classLessonNum": 2,
                                    "coveUrl": "http://img.blingabc.com/0cc9117b9cfc4ca1bb77b594c92da74e.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 76460,
                                            "studentNum": "795571161",
                                            "homeworkId": 339,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-12-18 19:41:58",
                                            "grade": 19,
                                            "praise": 0,
                                            "createDate": "2018-07-09 20:15:22",
                                            "status": 1,
                                            "timenum": 5,
                                            "classLessonId": 119896,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 72911,
                                            "studentNum": "795571161",
                                            "homeworkId": 313,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-07-17 17:17:33",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-07-17 17:18:43",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119896,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119897,
                                    "classLessonName": "Hike in the Forest",
                                    "beginDate": "2018-07-11 10:40:00",
                                    "endDate": "2018-07-11 11:20:00",
                                    "stuNum": null,
                                    "lessonId": 305,
                                    "classLessonNum": 3,
                                    "coveUrl": "http://img.blingabc.com/7653b37987344d6f9c3e3da4705a73b4.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 84409,
                                            "studentNum": "795571161",
                                            "homeworkId": 365,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-05-30 13:53:17",
                                            "grade": 0,
                                            "praise": 0,
                                            "createDate": "2018-07-16 16:45:55",
                                            "status": 1,
                                            "timenum": 1,
                                            "classLessonId": 119897,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 73201,
                                            "studentNum": "795571161",
                                            "homeworkId": 314,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:38:02",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119897,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119898,
                                    "classLessonName": "Beware of Snakes!",
                                    "beginDate": "2018-07-11 13:00:00",
                                    "endDate": "2018-07-11 13:40:00",
                                    "stuNum": null,
                                    "lessonId": 306,
                                    "classLessonNum": 4,
                                    "coveUrl": "https://img.blingabc.com/39d19c5eaee74f37b5f7f0593386934f.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 84719,
                                            "studentNum": "795571161",
                                            "homeworkId": 984,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-16 16:46:13",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119898,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 73490,
                                            "studentNum": "795571161",
                                            "homeworkId": 315,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:38:21",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119898,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119899,
                                    "classLessonName": "History of My City",
                                    "beginDate": "2018-07-12 09:20:00",
                                    "endDate": "2018-07-12 10:00:00",
                                    "stuNum": null,
                                    "lessonId": 307,
                                    "classLessonNum": 5,
                                    "coveUrl": "http://img.blingabc.com/4183da0586ac447b86851c2dff0d65c4.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 87642,
                                            "studentNum": "795571161",
                                            "homeworkId": 985,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-18 18:01:41",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119899,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 73782,
                                            "studentNum": "795571161",
                                            "homeworkId": 316,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:38:40",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119899,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119900,
                                    "classLessonName": "Before Computers",
                                    "beginDate": "2018-07-12 13:50:00",
                                    "endDate": "2018-07-12 14:30:00",
                                    "stuNum": null,
                                    "lessonId": 308,
                                    "classLessonNum": 6,
                                    "coveUrl": "http://img.blingabc.com/cd3b0abdc3884e9ca65297408d708b35.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 87952,
                                            "studentNum": "795571161",
                                            "homeworkId": 374,
                                            "homeworkResourceId": null,
                                            "finish": 2,
                                            "finishDate": "2019-05-30 21:39:12",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-18 18:02:09",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119900,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 74071,
                                            "studentNum": "795571161",
                                            "homeworkId": 317,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:38:57",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119900,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119901,
                                    "classLessonName": "Happy Independence Day!",
                                    "beginDate": "2018-07-13 15:30:00",
                                    "endDate": "2018-07-13 16:10:00",
                                    "stuNum": null,
                                    "lessonId": 309,
                                    "classLessonNum": 7,
                                    "coveUrl": "http://img.blingabc.com/9ccff0e81ee14022855c93255d5ffcb8.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 91868,
                                            "studentNum": "795571161",
                                            "homeworkId": 379,
                                            "homeworkResourceId": null,
                                            "finish": 2,
                                            "finishDate": "2019-05-30 21:44:54",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-25 12:06:05",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119901,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 74361,
                                            "studentNum": "795571161",
                                            "homeworkId": 318,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:39:18",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119901,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119902,
                                    "classLessonName": "Show Me!",
                                    "beginDate": "2018-07-13 16:20:00",
                                    "endDate": "2018-07-13 17:00:00",
                                    "stuNum": null,
                                    "lessonId": 310,
                                    "classLessonNum": 8,
                                    "coveUrl": "http://img.blingabc.com/a67cbbd6eba6436a8e895f6bc70e5d89.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 92277,
                                            "studentNum": "795571161",
                                            "homeworkId": 319,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-04-26 14:55:09",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-04-26 14:55:09",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119902,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                }
                            ]
                        },
                        {
                            "classId": 8347,
                            "className": "测试-暑季绘本作业课程L4",
                            "schoolTime": "2_9:00,2_10:00,3_10:40,3_13:00,4_9:20,4_13:50,5_15:30,5_16:20,6_10:10,6_13:50",
                            "classStartDate": "2018-07-10 09:00:00",
                            "classEndDate": "2018-07-13 17:00:00",
                            "courseType": 40,
                            "courseTypeName": "技术服务",
                            "studentLessonList": [
                                {
                                    "classLessonId": 119903,
                                    "classLessonName": "My Weekend",
                                    "beginDate": "2018-07-10 09:00:00",
                                    "endDate": "2018-07-10 09:40:00",
                                    "stuNum": null,
                                    "lessonId": 311,
                                    "classLessonNum": 1,
                                    "coveUrl": "http://img.blingabc.com/c3c4c7ed8f914028a91a50a582fb37a7.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 77603,
                                            "studentNum": "795571161",
                                            "homeworkId": 845,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-05-22 19:28:13",
                                            "grade": 0,
                                            "praise": 0,
                                            "createDate": "2018-07-09 21:28:42",
                                            "status": 1,
                                            "timenum": 3,
                                            "classLessonId": 119903,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 74614,
                                            "studentNum": "795571161",
                                            "homeworkId": 320,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-05-22 19:28:47",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-06-21 16:17:03",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119903,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119904,
                                    "classLessonName": "When Are You Free?",
                                    "beginDate": "2018-07-10 10:00:00",
                                    "endDate": "2018-07-10 10:40:00",
                                    "stuNum": null,
                                    "lessonId": 312,
                                    "classLessonNum": 2,
                                    "coveUrl": "http://img.blingabc.com/84fa92b045ad47dd83c8e0e98e433a19.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 76720,
                                            "studentNum": "795571161",
                                            "homeworkId": 340,
                                            "homeworkResourceId": null,
                                            "finish": 2,
                                            "finishDate": "2019-03-28 20:20:51",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 20:15:38",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119904,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 74711,
                                            "studentNum": "795571161",
                                            "homeworkId": 321,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:40:53",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119904,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119905,
                                    "classLessonName": "Trip to the Stars",
                                    "beginDate": "2018-07-11 10:40:00",
                                    "endDate": "2018-07-11 11:20:00",
                                    "stuNum": null,
                                    "lessonId": 313,
                                    "classLessonNum": 3,
                                    "coveUrl": "http://img.blingabc.com/53dd1aaf027441d0b8336b7f02107f45.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 84990,
                                            "studentNum": "795571161",
                                            "homeworkId": 976,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-06-11 18:17:02",
                                            "grade": 13,
                                            "praise": 0,
                                            "createDate": "2018-07-16 16:46:36",
                                            "status": 1,
                                            "timenum": 4,
                                            "classLessonId": 119905,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 74807,
                                            "studentNum": "795571161",
                                            "homeworkId": 322,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-06-11 18:17:03",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-11-06 16:46:32",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119905,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119906,
                                    "classLessonName": "My Friend the Alien",
                                    "beginDate": "2018-07-11 13:00:00",
                                    "endDate": "2018-07-11 13:40:00",
                                    "stuNum": null,
                                    "lessonId": 314,
                                    "classLessonNum": 4,
                                    "coveUrl": "http://img.blingabc.com/3eb39a18449f41809828ced128662c19.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 85087,
                                            "studentNum": "795571161",
                                            "homeworkId": 977,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-16 16:47:02",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119906,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 74903,
                                            "studentNum": "795571161",
                                            "homeworkId": 323,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:41:35",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119906,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119907,
                                    "classLessonName": "Can You Speak English?",
                                    "beginDate": "2018-07-12 09:20:00",
                                    "endDate": "2018-07-12 10:00:00",
                                    "stuNum": null,
                                    "lessonId": 315,
                                    "classLessonNum": 5,
                                    "coveUrl": "http://img.blingabc.com/5239fa998c1a43aa82d3309ffbd923ec.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 88219,
                                            "studentNum": "795571161",
                                            "homeworkId": 978,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-18 18:02:43",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119907,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 74999,
                                            "studentNum": "795571161",
                                            "homeworkId": 324,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:41:52",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119907,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119908,
                                    "classLessonName": "Practice Makes Perfect",
                                    "beginDate": "2018-07-12 13:50:00",
                                    "endDate": "2018-07-12 14:30:00",
                                    "stuNum": null,
                                    "lessonId": 316,
                                    "classLessonNum": 6,
                                    "coveUrl": "http://img.blingabc.com/c5cdb95a431f402bad6acfe68b1be432.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 88315,
                                            "studentNum": "795571161",
                                            "homeworkId": 979,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-18 18:03:08",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119908,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 75095,
                                            "studentNum": "795571161",
                                            "homeworkId": 325,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:44:03",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119908,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119909,
                                    "classLessonName": "Happy Columbus Day!",
                                    "beginDate": "2018-07-13 15:30:00",
                                    "endDate": "2018-07-13 16:10:00",
                                    "stuNum": null,
                                    "lessonId": 317,
                                    "classLessonNum": 7,
                                    "coveUrl": "http://img.blingabc.com/803972cb495b458eb1d8d666cb430211.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 92134,
                                            "studentNum": "795571161",
                                            "homeworkId": 380,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-05-23 19:31:20",
                                            "grade": 0,
                                            "praise": 0,
                                            "createDate": "2018-07-25 12:06:29",
                                            "status": 1,
                                            "timenum": 1,
                                            "classLessonId": 119909,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 75191,
                                            "studentNum": "795571161",
                                            "homeworkId": 326,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:44:21",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119909,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119910,
                                    "classLessonName": "Show Me!",
                                    "beginDate": "2018-07-13 16:20:00",
                                    "endDate": "2018-07-13 17:00:00",
                                    "stuNum": null,
                                    "lessonId": 318,
                                    "classLessonNum": 8,
                                    "coveUrl": "http://img.blingabc.com/0bf1f0088cb144b79300be0dafd81363.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 75289,
                                            "studentNum": "795571161",
                                            "homeworkId": 327,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:46:09",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119910,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                }
                            ]
                        },
                        {
                            "classId": 8348,
                            "className": "测试-暑季绘本作业课程L1新",
                            "schoolTime": "2_9:00,2_10:00,3_10:40,3_13:00,4_9:20,4_13:50,5_15:30,5_16:20,6_10:10,6_13:50",
                            "classStartDate": "2018-07-10 09:00:00",
                            "classEndDate": "2018-07-13 17:00:00",
                            "courseType": 40,
                            "courseTypeName": "技术服务",
                            "studentLessonList": [
                                {
                                    "classLessonId": 119911,
                                    "classLessonName": "Head to Toe",
                                    "beginDate": "2018-07-10 09:00:00",
                                    "endDate": "2018-07-10 09:40:00",
                                    "stuNum": null,
                                    "lessonId": 287,
                                    "classLessonNum": 1,
                                    "coveUrl": "http://img.blingabc.com/0d188c839c0d4878952d34f1aab23126.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 65641,
                                            "studentNum": "795571161",
                                            "homeworkId": 328,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:17:13",
                                            "grade": 67,
                                            "praise": 0,
                                            "createDate": "2018-07-09 17:18:07",
                                            "status": 1,
                                            "timenum": 6304,
                                            "classLessonId": 119911,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 66040,
                                            "studentNum": "795571161",
                                            "homeworkId": 296,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:17:17",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2019-09-16 16:31:20",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119911,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119912,
                                    "classLessonName": "Touch Your Toes!",
                                    "beginDate": "2018-07-10 10:00:00",
                                    "endDate": "2018-07-10 10:40:00",
                                    "stuNum": null,
                                    "lessonId": 288,
                                    "classLessonNum": 2,
                                    "coveUrl": "http://img.blingabc.com/66f7539e361a45f792275941a069cf4a.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 75650,
                                            "studentNum": "795571161",
                                            "homeworkId": 337,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:25:33",
                                            "grade": 80,
                                            "praise": 0,
                                            "createDate": "2018-07-09 20:14:10",
                                            "status": 1,
                                            "timenum": 1,
                                            "classLessonId": 119912,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 66443,
                                            "studentNum": "795571161",
                                            "homeworkId": 297,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:26:01",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-12-12 15:48:37",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119912,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119913,
                                    "classLessonName": "A Day at the Zoo",
                                    "beginDate": "2018-07-11 10:40:00",
                                    "endDate": "2018-07-11 11:20:00",
                                    "stuNum": null,
                                    "lessonId": 289,
                                    "classLessonNum": 3,
                                    "coveUrl": "http://img.blingabc.com/1203f4c0497e4d5b8616648a3bd70369.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 83153,
                                            "studentNum": "795571161",
                                            "homeworkId": 362,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:34:16",
                                            "grade": 16,
                                            "praise": 0,
                                            "createDate": "2018-07-16 16:43:59",
                                            "status": 1,
                                            "timenum": 2,
                                            "classLessonId": 119913,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 66843,
                                            "studentNum": "795571161",
                                            "homeworkId": 298,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:34:42",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-11-29 23:34:42",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119913,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119914,
                                    "classLessonName": "Animal Friends",
                                    "beginDate": "2018-07-11 13:00:00",
                                    "endDate": "2018-07-11 13:40:00",
                                    "stuNum": null,
                                    "lessonId": 290,
                                    "classLessonNum": 4,
                                    "coveUrl": "http://img.blingabc.com/b896905d250f4e6dac69fb29b45a07e8.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 83565,
                                            "studentNum": "795571161",
                                            "homeworkId": 361,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:48:51",
                                            "grade": 5,
                                            "praise": 0,
                                            "createDate": "2018-07-16 16:44:31",
                                            "status": 1,
                                            "timenum": 2,
                                            "classLessonId": 119914,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 67242,
                                            "studentNum": "795571161",
                                            "homeworkId": 299,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-30 00:08:16",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-11-30 00:08:16",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119914,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119915,
                                    "classLessonName": "Thirsty!",
                                    "beginDate": "2018-07-12 09:20:00",
                                    "endDate": "2018-07-12 10:00:00",
                                    "stuNum": null,
                                    "lessonId": 291,
                                    "classLessonNum": 5,
                                    "coveUrl": "http://img.blingabc.com/ecb810d99a784054b16e682862b8e8f9.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 85937,
                                            "studentNum": "795571161",
                                            "homeworkId": 369,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-29 23:49:48",
                                            "grade": 0,
                                            "praise": 0,
                                            "createDate": "2018-11-29 23:57:10",
                                            "status": 1,
                                            "timenum": 3,
                                            "classLessonId": 119915,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 67647,
                                            "studentNum": "795571161",
                                            "homeworkId": 300,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2018-11-30 00:07:55",
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-11-30 00:07:55",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119915,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119916,
                                    "classLessonName": "I Can Make Lemonade",
                                    "beginDate": "2018-07-12 13:50:00",
                                    "endDate": "2018-07-12 14:30:00",
                                    "stuNum": null,
                                    "lessonId": 292,
                                    "classLessonNum": 6,
                                    "coveUrl": "http://img.blingabc.com/da956b7cbc104adbb18763ced75563ce.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 86350,
                                            "studentNum": "795571161",
                                            "homeworkId": 886,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-18 17:59:36",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119916,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 68048,
                                            "studentNum": "795571161",
                                            "homeworkId": 301,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:30:08",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119916,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119917,
                                    "classLessonName": "Happy National Day!",
                                    "beginDate": "2018-07-13 15:30:00",
                                    "endDate": "2018-07-13 16:10:00",
                                    "stuNum": null,
                                    "lessonId": 293,
                                    "classLessonNum": 7,
                                    "coveUrl": "https://img.blingabc.com/14d75dd66ec44edc99b97e47f5059cdd.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 91004,
                                            "studentNum": "795571161",
                                            "homeworkId": 971,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-25 12:04:32",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119917,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 91019,
                                            "studentNum": "795571161",
                                            "homeworkId": 971,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-25 12:04:32",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119917,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 68448,
                                            "studentNum": "795571161",
                                            "homeworkId": 302,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:30:40",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119917,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 80896,
                                            "studentNum": "795571161",
                                            "homeworkId": 302,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-13 15:15:45",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119917,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119918,
                                    "classLessonName": "Show Me!",
                                    "beginDate": "2018-07-13 16:20:00",
                                    "endDate": "2018-07-13 17:00:00",
                                    "stuNum": null,
                                    "lessonId": 294,
                                    "classLessonNum": 8,
                                    "coveUrl": "http://img.blingabc.com/24a40d1035ed4d2e902c2a2f325aa55d.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 68848,
                                            "studentNum": "795571161",
                                            "homeworkId": 303,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-09 18:31:14",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119918,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        },
                                        {
                                            "id": 80897,
                                            "studentNum": "795571161",
                                            "homeworkId": 303,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-13 15:15:45",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119918,
                                            "type": 2,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                }
                            ]
                        },
                        {
                            "classId": 8350,
                            "className": "测试-暑季自然拼读课程L1",
                            "schoolTime": "2_9:00,2_10:00,3_10:40,3_13:00,4_9:20,4_13:50,5_15:30,5_16:20,6_10:10,6_13:50",
                            "classStartDate": "2018-07-10 09:00:00",
                            "classEndDate": "2018-07-12 14:30:00",
                            "courseType": 40,
                            "courseTypeName": "技术服务",
                            "studentLessonList": [
                                {
                                    "classLessonId": 119925,
                                    "classLessonName": "Aa, Ee, Ss, Tt",
                                    "beginDate": "2018-07-10 09:00:00",
                                    "endDate": "2018-07-10 09:40:00",
                                    "stuNum": null,
                                    "lessonId": 449,
                                    "classLessonNum": 1,
                                    "coveUrl": "http://img.blingabc.com/9e2f742b5b574508a63208ebaf2e52ff.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 65509,
                                            "studentNum": "795571161",
                                            "homeworkId": 333,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-01-17 22:47:52",
                                            "grade": 2,
                                            "praise": 0,
                                            "createDate": "2018-07-09 16:00:01",
                                            "status": 1,
                                            "timenum": 12,
                                            "classLessonId": 119925,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119926,
                                    "classLessonName": "Cc, Hh, Ii, Nn, Rr",
                                    "beginDate": "2018-07-10 10:00:00",
                                    "endDate": "2018-07-10 10:40:00",
                                    "stuNum": null,
                                    "lessonId": 450,
                                    "classLessonNum": 2,
                                    "coveUrl": "http://img.blingabc.com/4415e2bb9ec644ccbe6a10cebd610e15.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 77693,
                                            "studentNum": "795571161",
                                            "homeworkId": 341,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-02-15 13:14:43",
                                            "grade": 7,
                                            "praise": 0,
                                            "createDate": "2018-07-09 21:30:03",
                                            "status": 1,
                                            "timenum": 7,
                                            "classLessonId": 119926,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119927,
                                    "classLessonName": "Oo, Dd, Ll, Pp",
                                    "beginDate": "2018-07-11 10:40:00",
                                    "endDate": "2018-07-11 11:20:00",
                                    "stuNum": null,
                                    "lessonId": 451,
                                    "classLessonNum": 3,
                                    "coveUrl": "http://img.blingabc.com/d148d05b277a456993345f81f155b5b9.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 78818,
                                            "studentNum": "795571161",
                                            "homeworkId": 345,
                                            "homeworkResourceId": null,
                                            "finish": 1,
                                            "finishDate": "2019-10-12 16:50:30",
                                            "grade": 82,
                                            "praise": 0,
                                            "createDate": "2018-07-11 18:14:01",
                                            "status": 1,
                                            "timenum": 1,
                                            "classLessonId": 119927,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 10
                                },
                                {
                                    "classLessonId": 119928,
                                    "classLessonName": "Gg, Jj, Kk, Mm, Uu",
                                    "beginDate": "2018-07-11 13:00:00",
                                    "endDate": "2018-07-11 13:40:00",
                                    "stuNum": null,
                                    "lessonId": 452,
                                    "classLessonNum": 4,
                                    "coveUrl": "http://img.blingabc.com/6a98561150f94f1fbaccd9affb572ab4.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 79552,
                                            "studentNum": "795571161",
                                            "homeworkId": 349,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-12 14:10:34",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119928,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119929,
                                    "classLessonName": "Bb, Ff, Qq, Vv",
                                    "beginDate": "2018-07-12 09:20:00",
                                    "endDate": "2018-07-12 10:00:00",
                                    "stuNum": null,
                                    "lessonId": 453,
                                    "classLessonNum": 5,
                                    "coveUrl": "http://img.blingabc.com/718edb436a3d4f1cb6eb8bfaed37cfac.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 79830,
                                            "studentNum": "795571161",
                                            "homeworkId": 353,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-12 17:45:17",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119929,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                },
                                {
                                    "classLessonId": 119930,
                                    "classLessonName": "Ww, Xx, Yy, Zz",
                                    "beginDate": "2018-07-12 13:50:00",
                                    "endDate": "2018-07-12 14:30:00",
                                    "stuNum": null,
                                    "lessonId": 454,
                                    "classLessonNum": 6,
                                    "coveUrl": "http://img.blingabc.com/f6a401d1b78146068652c3f60bf8105b.jpg",
                                    "studentHomeworkList": [
                                        {
                                            "id": 80449,
                                            "studentNum": "795571161",
                                            "homeworkId": 357,
                                            "homeworkResourceId": null,
                                            "finish": 0,
                                            "finishDate": null,
                                            "grade": null,
                                            "praise": 0,
                                            "createDate": "2018-07-12 20:55:11",
                                            "status": 1,
                                            "timenum": 0,
                                            "classLessonId": 119930,
                                            "type": 1,
                                            "scores": null,
                                            "stars": null,
                                            "recordList": null,
                                            "vodComposeMediaQuerys": null
                                        }
                                    ],
                                    "report": null,
                                    "stuState": null,
                                    "studentVideo": null,
                                    "homeworkState": 20
                                }
                            ]
                        }
                    ],
                    "pageNum": 1,
                    "pageSize": 5,
                    "size": 5,
                    "startRow": 1,
                    "endRow": 5,
                    "pages": 10,
                    "prePage": 0,
                    "nextPage": 2,
                    "isFirstPage": true,
                    "isLastPage": false,
                    "hasPreviousPage": false,
                    "hasNextPage": true,
                    "navigatePages": 8,
                    "navigatepageNums": [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7,
                        8
                    ],
                    "navigateFirstPage": 1,
                    "navigateLastPage": 8
                }
            },
            "status": true,
            "assert": {
                "relation": "包含",
                "expect": "测试-",
                "actual": "测试-暑季绘本作业课程L2",
                "result": true
            },
            "errMsg": null
        }
    ],
    "code": 0,
    "message": "success"
}

```

### 3.0  添加环境
- **接口说明：** 添加环境接口
- **请求方式：** POST
- **接口地址：** /api/env

#### 3.0.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;name			        |string		|R			|环境名称

请求示例：

```
{
  "name": "dev"
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|object		|R			|&nbsp;生成的环境id

返回成功示例
```
{
    "data": {
        "id": 3
    },
    "code": 0,
    "message": "success"
}

```

### 3.1  添加endpoint
- **接口说明：** 添加endpoint接口
- **请求方式：** POST
- **接口地址：** /api/env/endpoint
- `注意事项` endpoint值唯一，不能重复

#### 3.1.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;name			        |string		|R			|endpoint名称
&emsp;endpoint			    |string	    |R		    |前缀地址
&emsp;envs			        |number[]		|R			|环境id集合

请求示例：

```
{
  "name": "百度",
  "endpoint": "http://www.baidu.com",
  "envs": [2,3,4]
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name		|object		|R			|&nbsp;endpoint名称
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endpoint		|object		|R			|&nbsp;endpoint地址
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|object		|R			|&nbsp;生成的endpoint ID
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;envs		|list		|R			|&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|number		|R			|&nbsp;关联的环境id
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name		|string		|R			|&nbsp;关联的环境名称
返回成功示例
```
{
    "data": {
        "name": "百度",
        "endpoint": "http://www.baidu.co",
        "envs": [
            {
                "id": 2,
                "name": "hotfix"
            },
            {
                "id": 3,
                "name": "stress"
            },
            {
                "id": 4,
                "name": "prod"
            }
        ],
        "id": 4
    },
    "code": 0,
    "message": "success"
}
```

### 3.2  获取环境和endpoint
- **接口说明：** 获取环境和endpoint接口
- **请求方式：** GET
- **接口地址：** /api/env/endpoint

#### 3.2.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;envIds			        |number[]		|O			|环境ID集合(如果为空，查询所有)


请求示例：
```
{
"envIds": [1,2,3]
}
```


返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;list		|list		|R			|&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|number		|R			|&nbsp;环境ID
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name		|object		|R			|&nbsp;环境名称
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endpoints		|list		|R			|&nbsp;关联的endpoint
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|number		|R			|&nbsp;endpoint ID
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name		|string		|R			|&nbsp;endpoint名称
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endpoint		|string		|R			|&nbsp;endpoint地址

返回成功示例
```
{
    "data": [
        {
            "id": 1,
            "name": "dev",
            "endpoints": [
                {
                    "id": 5,
                    "name": "百度",
                    "endpoint": "http://www.baidu.com"
                },
                {
                    "id": 6,
                    "name": "腾讯",
                    "endpoint": "http://www.sina.com"
                }
            ]
        },
        {
            "id": 2,
            "name": "hotfix",
            "endpoints": [
                {
                    "id": 5,
                    "name": "百度",
                    "endpoint": "http://www.baidu.com"
                },
                {
                    "id": 6,
                    "name": "腾讯",
                    "endpoint": "http://www.sina.com"
                }
            ]
        },
        {
            "id": 3,
            "name": "online",
            "endpoints": [
                {
                    "id": 5,
                    "name": "百度",
                    "endpoint": "http://www.baidu.com"
                },
                {
                    "id": 6,
                    "name": "腾讯",
                    "endpoint": "http://www.sina.com"
                }
            ]
        }
    ],
    "code": 0,
    "message": "success"
}
```
### 3.3  删除环境
- **接口说明：** 删除环境接口
- **请求方式：** DELETE
- **接口地址：** /api/env

#### 3.3.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;ids			    |number[]		|R			|环境id集合

请求示例：

```
{
"ids":[1,2,3]
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|object		|R			|&nbsp;删除的环境id
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status    |object		|R			|&nbsp;删除的环境结果
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;message    |object		|R			|&nbsp;删除的环境失败原因

返回成功示例
```
{
    "data": [
        {
            "id": "6",
            "status": true
        },
        {
            "id": "7",
            "status": false,
            "message": "id不存在"
        },
        {
            "id": "8",
            "status": false,
            "message": "id不存在"
        }
    ],
    "code": 0,
    "message": "success"
}

```

### 3.4  删除endpoint
- **接口说明：** 删除endpoint接口
- **请求方式：** DELETE
- **接口地址：** /api/env/endpoint

#### 3.4.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;endpointIds			|string		|R			|endpoint ID集合

请求示例：

```
{
	"endpointIds": [1,"2"]
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|object		|R			|&nbsp;删除的环境id
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status    |object		|R			|&nbsp;删除的环境结果
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;message    |object		|R			|&nbsp;删除的环境失败原因

返回成功示例
```
{
    "data": [
        {
            "id": "7",
            "status": false,
            "message": "id不存在"
        },
        {
            "id": "8",
            "status": false,
            "message": "id不存在"
        },
        {
            "id": "9",
            "status": false,
            "message": "id不存在"
        }
    ],
    "code": 0,
    "message": "success"
}

```


### 3.5  获取所有环境
- **接口说明：** 获取所有环境接口
- **请求方式：** GET
- **接口地址：** /api/env

#### 3.5.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---


返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;list						|list		|R			|&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id		|object		|R			|&nbsp;环境id
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name    |object		|R			|&nbsp;环境名称

返回成功示例
```
{
    "data": [
        {
            "id": 2,
            "name": "hotfix"
        },
        {
            "id": 3,
            "name": "online"
        },
        {
            "id": 1,
            "name": "env___"
        },
        {
            "id": 4,
            "name": "test"
        },
        {
            "id": 5,
            "name": "prod"
        }
    ],
    "code": 0,
    "message": "success"
}
```


### 3.6  获取用例信息
- **接口说明：** 获取用例信息接口
- **请求方式：** GET
- **接口地址：** /api/caseList

#### 3.6.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;isTask			    |string		|O		    |true(查询定时任务类型的用例)
&emsp;envId			        |number		|O		    |查询该环境下的用例
page	                    |number		|O			|页数(默认1)
limit	                    |number		|O			|每页展示个数(默认10)
请求示例：

```
/api/caselist?isTask=false&envId=1

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;cases					|list		|R			|&nbsp;接口数组
&nbsp;&nbsp;&nbsp;env       |object		|R			|&nbsp;环境信息
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endpoints       |object		|R			|&nbsp;环境对应的endpoints

返回成功示例
```
{
    "data": {
        "items": [
            {
                "id": 4,
                "name": "测试用例2.1",
                "desc": "注册信息如下：",
                "cron": "2 * * * * *",
                "isTask": false,
                "createDate": "2019-12-30T08:28:39.193Z",
                "updateDate": "2019-12-30T08:28:39.193Z",
                "cases": [],
                "env": null
            }
        ],
        "itemCount": 1,
        "totalItems": 1,
        "pageCount": 1,
        "next": "",
        "previous": ""
    },
    "code": 0,
    "message": "success"
}
```


### 3.7  添加定时任务
- **接口说明：** 添加定时任务接口
- **请求方式：** POST
- **接口地址：** /api/scheduler

#### 3.7.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;caseListId			|string		|R		|caseList ID
&emsp;envIds                |number[]		|R		|env ID集合

请求示例：

```
{
	"caseListId": 3,
	"envIds": [1,2,3]
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;md5		|string		|R			|&nbsp; 定时任务名称ID(用于查找运行中的定时任务)
&nbsp;&nbsp;&nbsp;env		|Object		|R			|&nbsp; 定时任务运行的环境
&nbsp;&nbsp;&nbsp;caseList		|Object		|R			|&nbsp; 定时任务运行的用例
&nbsp;&nbsp;&nbsp;status		|number		|R			|&nbsp; 定时任务运行的状态(0:RUNNING,1:STOP,2:DELETE)
&nbsp;&nbsp;&nbsp;&nbsp;id		|number		|R			|&nbsp;定时任务id


返回成功示例
```
{
    "data": [
        {
            "md5": "7225de143eaaf349cffc09ef7269ffa03ffde8dc658fb8323484f1f575da4c41",
            "createDate": "2019-12-27T09:51:25.708Z",
            "env": {
                "id": 1,
                "name": "dev"
            },
            "caseList": {
                "id": 1,
                "name": "测试用例1",
                "desc": "注册信息如下：",
                "cron": "1 * * * * *",
                "isTask": true,
                "createDate": "2019-12-27T04:03:43.154Z",
                "updateDate": "2019-12-27T04:03:43.154Z"
            },
            "status": "0",
            "id": 93,
            "updateDate": "2019-12-27T09:51:25.888Z"
        },
        {
            "md5": "4d67b5de0426a9e22db0eddd7e23de7105e7605bf4c46bd54887239db28746b7",
            "createDate": "2019-12-27T09:51:26.060Z",
            "env": {
                "id": 1,
                "name": "dev"
            },
            "caseList": {
                "id": 2,
                "name": "测试用例2",
                "desc": "注册信息如下：",
                "cron": "1 * * * * *",
                "isTask": true,
                "createDate": "2019-12-27T04:04:06.756Z",
                "updateDate": "2019-12-27T04:04:06.756Z"
            },
            "status": "0",
            "id": 94,
            "updateDate": "2019-12-27T09:51:26.133Z"
        }
    ],
    "code": 0,
    "message": "success"
}
```

### 3.8  获取运行中的定时任务
- **接口说明：** 获取运行中的定时任务接口
- **请求方式：** GET
- **接口地址：** /api/scheduler/running

#### 3.8.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---



返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;md5		|string		|R			|&nbsp; 定时任务名称ID(用于查找运行中的定时任务)
&nbsp;&nbsp;&nbsp;env		|Object		|R			|&nbsp; 定时任务运行的环境
&nbsp;&nbsp;&nbsp;caseList		|Object		|R			|&nbsp; 定时任务运行的用例
&nbsp;&nbsp;&nbsp;status		|number		|R			|&nbsp; 定时任务运行的状态(0:RUNNING,1:STOP,2:DELETE)
&nbsp;&nbsp;&nbsp;&nbsp;id		|number		|R			|&nbsp;定时任务id


返回成功示例
```
{
    "data": [
        {
            "id": 91,
            "md5": "d6dad2892106ce0e5270972af0dc269584ea1a91d1aa56f51fb782bd498a694a",
            "createDate": "2019-12-27T09:24:21.216Z",
            "updateDate": "2019-12-27T09:24:21.384Z",
            "status": 0,
            "env": {
                "id": 1,
                "name": "dev"
            },
            "caseList": {
                "id": 1,
                "name": "测试用例1",
                "desc": "注册信息如下：",
                "cron": "1 * * * * *",
                "isTask": true,
                "createDate": "2019-12-27T04:03:43.154Z",
                "updateDate": "2019-12-27T04:03:43.154Z"
            }
        },
        {
            "id": 92,
            "md5": "4e333e1a4c073c0fdf7b20cc85b79dcd9156ae1cb6226c301fb190f349d2caf5",
            "createDate": "2019-12-27T09:24:21.558Z",
            "updateDate": "2019-12-27T09:24:21.728Z",
            "status": 0,
            "env": {
                "id": 1,
                "name": "dev"
            },
            "caseList": {
                "id": 2,
                "name": "测试用例2",
                "desc": "注册信息如下：",
                "cron": "1 * * * * *",
                "isTask": true,
                "createDate": "2019-12-27T04:04:06.756Z",
                "updateDate": "2019-12-27T04:04:06.756Z"
            }
        }
    ],
    "code": 0,
    "message": "success"
}
```

### 3.9  停止运行中的定时任务
- **接口说明：** 获取运行中的定时任务接口
- **请求方式：** GET
- **接口地址：** /api/scheduler/stop

#### 3.9.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;md5List			        |string[]		|O		    |定时任务的md5集合

请求示例

```
{
	"md5List":["11188194ab9275621c041f5eab4aaaa5ec462600c6bb8876aa44a0fba38421e9"]
}
```


返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;success	|[]		    |R			|&nbsp; 停止成功的任务ID
&nbsp;&nbsp;&nbsp;fail		|【】		|R			|&nbsp; 停止失败的任务ID



返回成功示例
```
{
    "data": {
        "success": [
            91,
            92
        ],
        "fail": []
    },
    "code": 0,
    "message": "success"
}
```

### 4.0  删除运行中的定时任务
- **接口说明：** 删除运行中的定时任务接口
- **请求方式：** DETELE
- **接口地址：** /api/scheduler/running

#### 3.9.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;md5List			        |string[]		|O		    |定时任务的md5集合

请求示例

```
{
	"md5List":["11188194ab9275621c041f5eab4aaaa5ec462600c6bb8876aa44a0fba38421e9"]
}
```


返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;success	|[]		    |R			|&nbsp; 停止成功的任务ID
&nbsp;&nbsp;&nbsp;fail		|【】		|R			|&nbsp; 停止失败的任务ID



返回成功示例
```

    "data": [
        {
            "id": 91,
            "md5": "d6dad2892106ce0e5270972af0dc269584ea1a91d1aa56f51fb782bd498a694a",
            "createDate": "2019-12-27T09:24:21.216Z",
            "updateDate": "2019-12-27T09:24:21.384Z",
            "status": 0,
            "env": {
                "id": 1,
                "name": "dev"
            },
            "caseList": {
                "id": 1,
                "name": "测试用例1",
                "desc": "注册信息如下：",
                "cron": "1 * * * * *",
                "isTask": true,
                "createDate": "2019-12-27T04:03:43.154Z",
                "updateDate": "2019-12-27T04:03:43.154Z"
            }
        },
        {
            "id": 92,
            "md5": "4e333e1a4c073c0fdf7b20cc85b79dcd9156ae1cb6226c301fb190f349d2caf5",
            "createDate": "2019-12-27T09:24:21.558Z",
            "updateDate": "2019-12-27T09:24:21.728Z",
            "status": 0,
            "env": {
                "id": 1,
                "name": "dev"
            },
            "caseList": {
                "id": 2,
                "name": "测试用例2",
                "desc": "注册信息如下：",
                "cron": "1 * * * * *",
                "isTask": true,
                "createDate": "2019-12-27T04:04:06.756Z",
                "updateDate": "2019-12-27T04:04:06.756Z"
            }
        }
    ],
    "code": 0,
    "message": "success"
}

```


### 4.1  停止数据库扫描监控
- **接口说明：** 停止数据库扫描监控接口
- **请求方式：** GET
- **接口地址：** /api/scheduler/stop_system_task
- `使用说明`: 用于服务更新时暂停扫描数据库监控

#### 4.1.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---




返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;status	|boolean	    |R			|&nbsp; true表示删除成功



返回成功示例
```
{
    "data": {
        "status": true
    },
    "code": 0,
    "message": "success"
}
```

### 4.2  检查定时任务cron表达式
- **接口说明：** 停止数据库扫描监控接口
- **请求方式：** GET
- **接口地址：** /api/scheduler/check-cron
- `使用说明`: 用于服务更新时暂停扫描数据库监控

#### 4.2.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;cron			        |string		|O		    |定时任务的cron表达式



返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功
&nbsp;&nbsp;&nbsp;result	|boolean	    |R			|&nbsp; true表示正确，false表示错误



返回成功示例
```
{
    "data": {
        "status": true
    },
    "code": 0,
    "message": "success"
}
```

### 5.1  登录
- **接口说明：** 登录接口
- **请求方式：** POST
- **接口地址：** /api/user/login

#### 5.1.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;userName			        |string		|R		    |用户名
&emsp;password			        |string		|R		    |密码

请求示例

```
{
	"userName": "crmadmin",
	"password": "bling123!@#"
}
```


### 6.1 获取历史记录
- **接口说明：** 获取历史记录
- **请求方式：** GET
- **接口地址：** /api/history/list

##### 参数类型说明

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;path			        |string		|O		    |模糊匹配接口路径

##### 返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|any		|R			|&nbsp;返回历史记录值
&nbsp;&nbsp;&nbsp;&nbsp;items|any		|R			|&nbsp;返回历史记录值
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id|number		|R			|&nbsp;历史记录ID
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;createDate|date		|R			|&nbsp;历史记录创建时间
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status|bool		|R			|&nbsp;接口执行结果
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;executor|number		|R			|&nbsp;执行者（0：手动执行，1：定时任务执行）
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;executor|number		|R			|&nbsp;调用接口返回结果
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;startTime|date		|R			|&nbsp;调用接口开始时间
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;endTime|date		|R			|&nbsp;调用接口结束时间
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;case|Objecr		|R			|&nbsp;调用接口的case实体



返回示例

```
{
    "data": {
        "items": [
            {
                "id": 317,
                "createDate": "2020-01-19T10:42:47.235Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:42:47.222Z",
                "endTime": "2020-01-19T10:42:47.233Z",
                "case": {
                    "id": 5,
                    "name": "获取百度首页3",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": null,
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T08:59:26.158Z",
                    "updateDate": "2020-01-14T08:59:26.158Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 316,
                "createDate": "2020-01-19T10:42:47.220Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:42:47.205Z",
                "endTime": "2020-01-19T10:42:47.217Z",
                "case": {
                    "id": 6,
                    "name": "获取百度首页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":15}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:00:02.756Z",
                    "updateDate": "2020-01-14T09:00:02.756Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 315,
                "createDate": "2020-01-19T10:42:47.202Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:42:47.186Z",
                "endTime": "2020-01-19T10:42:47.199Z",
                "case": {
                    "id": 7,
                    "name": "获取百度首页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":14}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:00:22.163Z",
                    "updateDate": "2020-01-14T09:00:22.163Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 314,
                "createDate": "2020-01-19T10:42:47.184Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:42:47.172Z",
                "endTime": "2020-01-19T10:42:47.182Z",
                "case": {
                    "id": 8,
                    "name": "获取百度首页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":13}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:00:26.765Z",
                    "updateDate": "2020-01-14T09:00:26.765Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 313,
                "createDate": "2020-01-19T10:42:47.169Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:42:47.156Z",
                "endTime": "2020-01-19T10:42:47.166Z",
                "case": {
                    "id": 10,
                    "name": "获取腾讯视频首页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":12}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:00:56.851Z",
                    "updateDate": "2020-01-14T09:00:56.851Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 312,
                "createDate": "2020-01-19T10:42:47.153Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:42:47.138Z",
                "endTime": "2020-01-19T10:42:47.151Z",
                "case": {
                    "id": 11,
                    "name": "获取腾讯视频次页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":12}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:01:08.903Z",
                    "updateDate": "2020-01-14T09:01:08.903Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 311,
                "createDate": "2020-01-19T10:41:45.500Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:41:45.486Z",
                "endTime": "2020-01-19T10:41:45.497Z",
                "case": {
                    "id": 5,
                    "name": "获取百度首页3",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": null,
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T08:59:26.158Z",
                    "updateDate": "2020-01-14T08:59:26.158Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 310,
                "createDate": "2020-01-19T10:41:45.483Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:41:45.465Z",
                "endTime": "2020-01-19T10:41:45.481Z",
                "case": {
                    "id": 6,
                    "name": "获取百度首页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":15}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:00:02.756Z",
                    "updateDate": "2020-01-14T09:00:02.756Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 309,
                "createDate": "2020-01-19T10:41:45.463Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:41:45.451Z",
                "endTime": "2020-01-19T10:41:45.460Z",
                "case": {
                    "id": 7,
                    "name": "获取百度首页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":14}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:00:22.163Z",
                    "updateDate": "2020-01-14T09:00:22.163Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            },
            {
                "id": 308,
                "createDate": "2020-01-19T10:41:45.448Z",
                "status": 1,
                "executor": 0,
                "result": null,
                "startTime": "2020-01-19T10:41:45.433Z",
                "endTime": "2020-01-19T10:41:45.446Z",
                "case": {
                    "id": 8,
                    "name": "获取百度首页",
                    "header": "{\"name\":\"zhangsan\",\"age\":15}",
                    "param": "{\"name\":\"zhangsan\",\"age\":13}",
                    "paramType": 0,
                    "path": "/api/catalog",
                    "endpoint": "http://127.0.0.1:3000",
                    "type": 0,
                    "createDate": "2020-01-14T09:00:26.765Z",
                    "updateDate": "2020-01-14T09:00:26.765Z",
                    "assertText": "\"code\":0",
                    "assertKey": null,
                    "isNeedToken": false
                }
            }
        ],
        "itemCount": 10,
        "totalItems": 123,
        "pageCount": 13,
        "next": "",
        "previous": ""
    },
    "code": 0,
    "message": "success"
}
```











响应码	|说明  
:----	|:---
0		|处理成功
-1		|未知错误
19999	|参数验证失败
20000	| 执行数据库操作失败
10001	|用户ID无效
20002	|目录ID无效
20001   |目录parentID无效
30001   |endpoint ID无效
30002   |环境ID无效
30003   |环境名称无效
30004   |endpoint重复
40001   |接口ID无效
50001   |用例ID无效
60001   |定时任务md5值重复
60002   |定时任务md5值无效
60003   |定时任务已删除或已停止
60004   |定时任务cron表达式不正确


<span id="jump"></span>
## 响应码说明

响应码	|说明  
:----	|:---
0		|处理成功
-1		|未知错误
19999	|参数验证失败
20000	| 执行数据库操作失败
10001	|用户ID无效
20002	|目录ID无效
20001   |目录parentID无效
30001   |endpoint ID无效
30002   |环境ID无效
30003   |环境名称无效
30004   |endpoint重复
40001   |接口ID无效
50001   |用例ID无效
60001   |定时任务md5值重复
60002   |定时任务md5值无效
60003   |定时任务已删除或已停止
60004   |定时任务cron表达式不正确


