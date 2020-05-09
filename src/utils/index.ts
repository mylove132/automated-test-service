// type转换成method文字
import {Method} from 'axios';

export function getRequestMethodTypeString(type: number): Method {
	switch (type) {
		case 0:
			return 'GET';
		case 1:
			return 'POST';
		case 2:
			return 'DELETE';
		case 3:
			return 'PUT';
		default:
			return 'GET';
	}
}

// 根据环境转换endpoint
export function generateEndpointByEnv(env: string, endpoint: string): string {
	return endpoint
}

/**
 * 获取断言的值
 * @param {any, string} 接口返回值， 断言逗号分割的key
 */
export function getAssertObjectValue(obj: any, keys: string): any {
	// 断言的key列表
  let keyList = [];
  if (keys.indexOf('.') != -1){
    keyList = keys.split('.');
  }else {
	  if(obj == null || obj == '') {
		  return null;
	  }
    return JSON.stringify(obj);
  }
	keyList.shift();
	const haveArray = new RegExp('\[[0-9]+\]');
	return keyList.reduce((preValue, currentValue, currentIndex) => {
		const currentObj = currentIndex == 0 ? obj : preValue;
		// 含有数组的情况
		if (haveArray.test(currentValue)) {
			const temp = haveArray.exec(currentValue).toString();
			const arrIndex = temp.slice(1, temp.length -1);
			const key = currentValue.slice(0, currentValue.indexOf(temp));
			return currentObj[key][arrIndex];
		} else {
			return currentObj[currentValue];
		}
	}, null)
}
