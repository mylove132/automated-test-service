var ts = "randomstring";

const rs = ts.indexOf('randomint')

console.log(rs)

function randomChar(len) {
    //默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var tempLen = chars.length, tempStr='';
    for(var i=0; i<len; ++i){
        tempStr += chars.charAt(Math.floor(Math.random() * tempLen ));
    }
    return tempStr;
}
function randomNum(minNum,maxNum){
    return  Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
}
console.log(randomNum(100,300))
console.log(randomChar(18))
