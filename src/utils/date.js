
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

//将num左补0为len长度的字符串
function lpadNum(num, len) {
    var l = num.toString().length;
    while(l < len) {
        num = "0" + num;
        l++;
    }
    return num;
}