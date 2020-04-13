function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

function getTokenFromResult(result){
  console.log(result)
  const res = JSON.parse(result);
  let token;
  for (let resKey in res) {
    console.log(res[resKey])
    if (resKey == "token"){
      token = res[resKey];
    }else if (isJSON(res[resKey])) {
      this.getTokenFromResult(res[resKey]);
    }
  }
  return token;
}

const result = "{\"parentInfo\":{\"id\":265860,\"type\":null,\"areaCode\":null,\"areaName\":null,\"cityCode\":null,\"cityName\":null,\"headImg\":\"https://img.blingabc.com/37f4cb171072497b8ab2f8a52031c46d.png\",\"name\":\"雪景\",\"wechatOpenid\":\"oyVF70mWTA6ERx5DDX0qpzOMaPGw\",\"parentNum\":\"59952933\",\"provinceCode\":null,\"provinceName\":null,\"smsStatus\":1,\"wechatStatus\":0,\"channelCodeOne\":10,\"channelCodeTwo\":11,\"mobile\":\"17635282378\",\"initPwdFlag\":0},\"studentList\":[{\"id\":212239,\"enName\":\"Abel\",\"headImg\":\"\",\"name\":\"伊森\",\"age\":null,\"level\":0,\"stuNum\":\"599529331\",\"sex\":null,\"birthday\":null,\"integral\":0}],\"token\":\"eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJjb20ueGRmLmJsaW5nIiwiYXVkIjoiY2xpZW50IiwidXNlcmNvZGUiOiI1OTk1MjkzMyIsImV4cCI6MTU4NzM1ODQ0NCwiaWF0IjoxNTg2NzUzNjQ0fQ.019cFpcmtQQoPDbsfipy_puQVKr5yT496g00QVDKzzYiN_zt5R3ulAd8g707koX8wtlXZVQA5EJ8y1je_bXWCg\",\"userSig\":null}";

getTokenFromResult(result);
