
function test() {
    let a ;
    let as = "https://oapi.t.blingabc.com//auth/open-api/autotest/useradmin/v1/login/";
    a = as;
    if (as.charAt(as.length -1) == "/"){
        a = as.substring(0, as.length-1);
    }

    console.log(a)
}

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
test()


