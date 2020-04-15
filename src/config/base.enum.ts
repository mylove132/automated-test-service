//接口请求类型
export enum RequestType {
   GET = 0, POST = 1, DELETE = 2, PUT = 3
}

//参数类型
export enum ParamType {
     TEXT = 0, FILE = 1
}

//接口请求状态
export enum RequestStatusEnum {
    SUCCESS = 0,
    FAIL = 1
}

//用例执行者
export enum Executor {
    MANUAL = 0 //手动,
    , SCHEDULER = 1//定时任务
}

//用例等级
export enum CaseGrade {
  HIGH = 0, IN = 1, LOW = 2
}


//操作记录类型
export enum OperateType {
    CREAT = 1, UPDATE = 2, DELETE = 3, RUNIDCASE = 4, RUNTMPCASE = 5, RUNSCENE = 6, COVERT = 7, STOPTASK = 8, RESTARTTASK = 9
}

//操作记录模块
export enum OperateModule {
    CASE = 1, CATALOG = 2, ENV = 3, ENDPOINT = 4, HISTORY = 5, OPERATE = 6, RUN = 7, SENCE = 8, TASK = 9, TOKEN = 10
}

//定时任务状态
export enum RunStatus {
     RUNNING = 1, STOP = 2, DELETE = 3
}

