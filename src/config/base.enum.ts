//接口请求类型
export enum RequestType {
    STATELESS = 0, GET = 1, POST = 2, DELETE = 3, PUT = 4
}

//参数类型
export enum ParamType {
    STATELESS = 0, TEXT = 1, FILE = 2
}

//接口请求状态
export enum RequestStatusEnum {
    STATELESS = 0,
    SUCCESS = 1,
    FAIL = 2
}

//用例执行者
export enum Executor {
    STATELESS = 0,
    MANUAL = 1 //手动,
    , SCHEDULER = 1//定时任务
}

//用例等级
export enum CaseGrade {
    STATELESS = 0, HIGH = 1, IN = 2, LOW = 3
}

//用例类型
export enum CaseType {
    STATELESS = 0, SINGLE = 1, SCENE = 2, BLEND = 3
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
    STATELESS = 0, RUNNING = 1, STOP = 2, DELETE = 3
}

//定时任务类型
export enum TaskType {
    STATELESS = 0, SINGLE = 1, SCENE = 2
}
