export enum ApiErrorCode {
  //通用code
  TIMEOUT = -1, // 系统繁忙
  SUCCESS = 0, // 成功
  REQUESTID_NULL = 101,

  //用户code
  USER_ID_INVALID = 10001, // 用户id无效
  CREATE_USER_FAIL = 10002,

  //catalog
  CATALOG_PARENT_INVALID = 20001  //catalog parentid无效
  
}
