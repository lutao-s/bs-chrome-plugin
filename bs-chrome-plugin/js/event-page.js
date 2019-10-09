console.log("background------");

setInterval(function () {
    console.log("后台更新时间："+getDate(2));
},1000)



function getDate(format) {
    /**
     * format=1表示获取年月日
     * format=0表示获取年月日时分秒
     * **/
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var date = now.getDate();
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    if (format==1){
        _time = year+"-"+month+"-"+date
    }
    else if (format==2){
        _time = year+"-"+month+"-"+date+" "+hour+":"+minu+":"+sec
    }
    return _time
}