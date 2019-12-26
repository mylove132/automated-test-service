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
    "daata":{
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
- **接口地址：** /api/catalog/?

#### 2.4.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;目录ids				|string		|R			|目录id，删除多个用英文逗号隔开	

请求示例：

```
/api/catalog/8,9,10

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
&emsp;type			        |number		|O			|请求类型（0:GET,1:POST,2:DELETE,3:PUT）默认0


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
&emsp;scriptId				|number		|R			|脚本id


请求示例：

```
{
   "scriptId": 1001
}

```
返回结果

参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---	
code						|int		|R			|响应码，代码定义请见“附录A 响应吗说明”
message						|string		|R			|&nbsp;
data						|object		|R			|&nbsp;true表示删除用例成功

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
&emsp;type			        |string		|O			|请求类型（GET,POST,DELETE,PUT）默认GET


请求示例：

```
{
   "scriptId": 1001,
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
data						|object		|R			|&nbsp;true表示添加用例成功

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

#### 3.1.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---
&emsp;name			        |string		|R			|endpoint名称
&emsp;endpoint			    |string	    |R		    |前缀地址
&emsp;envs			        |string		|R			|环境id（多个环境用英文逗号隔开,eg:1,2,3）

请求示例：

```
{
  "name": "百度",
  "endponit": "http://www.baidu.com",
  "envs": "1,2,3"
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
        "name": "腾讯",
        "endpoint": "http://www.sina.com",
        "envs": [
            {
                "id": 1,
                "name": "dev"
            },
            {
                "id": 2,
                "name": "hotfix"
            },
            {
                "id": 3,
                "name": "online"
            }
        ],
        "id": 6
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
&emsp;envIds			    |string		|R			|环境id(多个id用英文逗号隔开:eg：1,2,3)

请求示例：

```
/api/env?envIds=1,2,3

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
&emsp;endpointIds			|string		|R			|endpoint ID(多个id用英文逗号隔开:eg：1,2,3)

请求示例：

```
/api/env/endpoint?endpointIds=1,2,3

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

#### 3.4.1 请求参数
  
参数名称						|类型		|出现要求	|描述  
:----						|:---		|:------	|:---


请求示例：

```
/api/env?envIds=1,2,3

```
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

<span id="jump"></span>
## 响应码说明

响应码	|说明  
:----	|:---
0		|处理成功
-1		|未知错误
10001	|用户ID不存在
10002	|创建用户失败
20001	|目录ID无效



