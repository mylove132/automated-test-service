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
### 2.1 通过用户id获取目录结构
- **接口说明：** 获取目录结构
- **请求方式：** GET
- **接口地址：** /api/catalog
- `注意事项` 查询的目录isPub以根目录的为准


### 2.1.1 请求参数

  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
&emsp;userId				|number		|R			|用户id
&emsp;isPub                 |bool       |O          |是否获取公共的目录（default：true）


请求示例：

```
/api/catalog?userId=1&isPub=false

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
&emsp;userId				|number		|R			|用户id
&emsp;isPub                 |bool       |O          |是否获取公共的目录,子目录不能为true（default：false）
&emsp;name                  |string     |R          |目录名称
&emsp;parentId              |number     |O          |父级目录ID(null则表示添加为根目录)

请求示例：

```
{
   "userId": 1,
   "isPub": false,
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
&nbsp;&nbsp;&nbsp;&nbsp;url |string		|R			|&nbsp;接口url
&nbsp;&nbsp;&nbsp;&nbsp;type |number		|R			|&nbsp;请求类型（GET = 0,POST = 1,DELETE = 2,PUT = 3）
&nbsp;&nbsp;&nbsp;&nbsp;paramType |number		|R			|&nbsp参数类型（TEXT = 0,FILE = 1）


返回成功示例
```
{
    "data": {
        "items": [
            {
                "id": 2,
                "name": "获取腾讯信息",
                "header": null,
                "param": null,
                "url": "http://www.sina.com",
                "type": 0,
                "createDate": "2019-12-24T10:04:02.792Z",
                "updateDate": "2019-12-24T10:04:02.792Z"
            },
            {
                "id": 1,
                "name": "获取首页信息",
                "header": null,
                "param": null,
                "url": "http://www.baidu.com",
                "type": 0,
                "createDate": "2019-12-24T10:00:18.744Z",
                "updateDate": "2019-12-24T10:00:18.744Z"
            }
        ],
        "itemCount": 2,
        "totalItems": 2,
        "pageCount": 1,
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
&emsp;header			    |string		|O			|header参数{JSON类型}
&emsp;param			        |string		|O			|接口参数{JSON类型}
&emsp;type			        |number		|O			|请求类型（0:GET,1:POST,2:DELETE,3:PUT）
&emsp;paramType			        |number		|O			|请求类型（0:TEXT,1:FILE)

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
- **接口地址：** /api/script

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
- **接口地址：** /api/script

#### 2.8.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;catalogId				|number		|R			|目录id
&emsp;scriptName			|string		|R			|脚本名称
&emsp;header			    |Object		|O			|header参数
&emsp;param			        |string		|O			|接口参数
&emsp;type			        |string		|O			|请求类型（0:GET,1:POST,2:DELETE,3:PUT）默认GET
&emsp;assertText			        |string		|O			|断言
&emsp;endpoint			|string		|R			|endpoint值
&emsp;path			|string		|R			|接口路径
&emsp;endpointId			|number		|R			|endpointId

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

### 2.9  执行接口用例
- **接口说明：** 执行用例接口
- **请求方式：** POST
- **接口地址：** /api/run/script

#### 2.9.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;scriptName			|string		|R			|脚本名称
&emsp;header			    |Object		|O			|header参数
&emsp;param			        |string		|O			|接口参数
&emsp;type			        |string		|O			|请求类型（GET,POST,DELETE,PUT）默认GET


请求示例：

```
{
   "scriptName": "测试",
   "header":{
     "Content-Type": "application/json"
     }
   "param": "",
   "type": "GET"
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功

### 2.9  通过用例Id执行接口用例
- **接口说明：** 执行用例接口
- **请求方式：** POST
- **接口地址：** /api/run/scriptById

#### 2.9.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;scriptId			    |number		|R			|脚本名称

请求示例：

```
{
   "scriptName": "测试",
   "header":{
     "Content-Type": "application/json"
     }
   "param": "",
   "type": "GET"
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示执行用例成功

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


### 6.1 运行临时接口
- **接口说明：** 运行临时接口
- **请求方式：** POST
- **接口地址：** /api/run/script
##### 参数类型说明
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;userName			        |string		|R		    |用户名
&emsp;password			        |string		|R		    |密码

##### 返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|any		|R			|&nbsp;运行case结果的返回值



### 6.2 运行某接口请求
- **接口说明：** 运行某具体样例请求
- **请求方式：** POST
- **接口地址：** /api/run/case-script
##### 参数类型说明

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;caseId			        |number		|R		    |case id
&emsp;envId			        |number		|R		    |环境 id
&emsp;executor			        |number		|R		    |0手动 1定时任务

##### 返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|any		|R			|&nbsp;运行case结果的返回值




### 6.3 运行样例里的所有接口请求
- **接口说明：** 运行样例里的所有接口请求
- **请求方式：** POST
- **接口地址：** /api/run/script
##### 参数类型说明
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;caseListId			        |number		|R		   |用例 id
&emsp;envId			        |number		|R		    |环境 id
&emsp;executor			        |number		|R		    |0手动 1定时任务

##### 返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|any[]		|R			|&nbsp;运行结果的返回值列表












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


