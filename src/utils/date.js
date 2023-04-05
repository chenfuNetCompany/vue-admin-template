
export function formatDate(d){
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();
    var milliSeconds = d.getMilliseconds();
    var resStr = year + "-" + lpadNum(month, 2) + "-" + lpadNum(day, 2) + "T" + lpadNum(hours,2) + ":" + lpadNum(minutes,2) + ":" + lpadNum(seconds,2) + "." + lpadNum(milliSeconds, 3);
    return resStr;
}

//UTC时间转换为YYYY-MM-DD HH:mm:ss
export function timeUTCToStandard(utcTime) {
    var date = new Date(utcTime);
    if (!date) return '';
    var y = date.getFullYear();
    if (isNaN(y)) return '';
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
    var minute = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    let str = y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
    return str;
}

//将num左补0为len长度的字符串
function lpadNum(num, len) {
    var l = num.toString().length;
    while(l < len) {
        num = "0" + num;
        l++;
    }
    return num;
}