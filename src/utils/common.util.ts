/* eslint-disable no-prototype-builtins */
import { Md5 } from "ts-md5";
import { ConfigService } from "../config/config.service";
import * as os from 'os';

export class CommonUtil {


  /**
   * 判断参数是否是数字
   * @param val
   */
  static isNumber(val: string) {
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true;
    } else {
      return false;
    }
  }

  //生成从minNum到maxNum的随机数
  static randomNum(minNum: number, maxNum: number) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }

  /**
   * 生成随机位数字符串
   * @param len
   */
  static randomChar(len: number) {
    var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    var tempLen = chars.length, tempStr = "";
    for (var i = 0; i < len; ++i) {
      tempStr += chars.charAt(Math.floor(Math.random() * tempLen));
    }
    return tempStr;
  }

  /**
   * 生成sign
   * @param param
   * @param app_key
   */
  static generateSign(param: string, isProdEnv: boolean) {
    let jsonParam = JSON.parse(param);
    const timeUnix = (Math.round(new Date().getTime() / 1000).toString());
    jsonParam["ts"] = timeUnix;
    jsonParam = this.sort_ASCII(jsonParam);
    let paramValue: string = "";
    for (let key in jsonParam) {
      paramValue += key + "=" + jsonParam[key] + "&";
    }
    const config = new ConfigService(`env/${process.env.NODE_ENV}.env`);
    const app_key = !isProdEnv ? config.testAppKey : config.prodAppKey;
    paramValue += "app_key=" + app_key;
    const md5 = new Md5();
    return { md5: md5.appendAsciiStr(paramValue).end(), ts: timeUnix };
  }

  /**
   * 对象ascii排序
   * @param obj 
   */
  private static sort_ASCII(obj: any) {
    var arr = new Array();
    var num = 0;
    for (var i in obj) {
      arr[num] = i;
      num++;
    }
    var sortArr = arr.sort();
    var sortObj = {};
    for (var i in sortArr) {
      sortObj[sortArr[i]] = obj[sortArr[i]];
    }
    return sortObj;
  }

  /**
   * 处理path
   * @param path
   */
  static handlePath(path: string) {
    if (path.charAt(0) != "/") path = "/" + path;
    return path;
  }

  /**
   * 处理url
   * @param url
   */
  static handleUrl(url: string) {
    url = url.charAt(url.length - 1) == "/" ? url.substr(0, url.length - 1) : url;
    return url;
  }

  /**
   * 目录改为树结构输出
   * @param oldArr
   * @param isPub
   */
  static getTree(oldArr: any) {
    oldArr.forEach(element => {
      let parentId = element.parentId;
      if (parentId !== 0) {
        oldArr.forEach(ele => {
          if (ele.id == parentId) { //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
            if (!ele.children) {
              ele.children = [];
            }
            ele.children.push(element);
          }
        });
      }
    });
    oldArr = oldArr.filter(ele => ele.parentId === null); //这一步是过滤，按树展开，将多余的数组剔除；
    return oldArr;
  }


  /**
   * 递归查询对象中某个属性值
   * @param data 对象值
   * @param field 属性字段 
   */
  static getFiledFromResult(field: string, data: any) {
    let result: string;
    for (var key in data) {
      if (result) {
        break
      }
      if (data.hasOwnProperty(key) === true) {
        if (key === field) {
          result = data[key];
          break
        } else {
          if (data[key] instanceof Object) {
            result = this.getFiledFromResult(field, data[key]);
          }
        }
      }
    }
    if (result) {
      return result;
    } else {
      return null
    }
  }

  /**
   * 获取操作系统信息
   */
  getOperatingSystem() {
    return os.totalmem();
  }


}
