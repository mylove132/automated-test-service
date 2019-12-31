export enum ApiErrorCode {
  //通用code
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 0, // 成功
  PARAM_VALID_FAIL = 19999, //参数验证失败
  RUN_SQL_EXCEPTION = 20000, //数据库执行失败

  RUN_INTERFACE_FAIL = 5000,
  //用户code
  USER_ID_INVALID = 10001, // 用户id无效
  CREATE_USER_FAIL = 10002,

  //catalog
  CATALOG_ID_INVALID = 20002, //catalog ID无效
  CATALOG_PARENT_INVALID = 20001,  //catalog parentid无效

  //env
  ENDPOINT_ID_INVALID = 30001,
  ENV_ID_INVALID = 30002,
  ENV_NAME_INVAILD = 30003,
  ENDPOINT_NAME_REPEAT = 30004,

  //case
  CASE_ID_INVALID = 40001, //接口id无效

  //caselist

  CASELIST_ID_INVALID = 50001,

  //scheduler
  SCHEDULER_MD5_REPEAT = 60001,
  SCHEDULER_MD5_INVAILD = 60002,
  SCHEDULER_STOP_OR_DELETE = 60003,
}
