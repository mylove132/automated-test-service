export class CommonUtil {

    static isNumber(val) {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    //生成从minNum到maxNum的随机数
    static randomNum(minNum,maxNum){
       return  Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    }

    static randomChar(len) {
        var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var tempLen = chars.length, tempStr='';
        for(var i=0; i<len; ++i){
            tempStr += chars.charAt(Math.floor(Math.random() * tempLen ));
        }
        return tempStr;
    }

    static compare(property){
        return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
        }
    }
}
