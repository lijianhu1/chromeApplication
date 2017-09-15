/****************///图标
var curl = window.location.host;
var currIcon = chrome.runtime.connect({name: "currIcon"});//图标
var isRuning = chrome.runtime.connect({name: "isRuning"});//图标
currIcon.postMessage(curl);

var zlAction = chrome.runtime.connect({name: "zlAction"});//获取简历夹列表
$("#plugBtn").click(function () {
    console.log('准备');
    // isRuning.postMessage('isRuning');
    // isRuning.onMessage.addListener(function (res) {
    //     if (!res){
            var zlCookie = $.cookie('zl_cookie');
            var isCookie = zlCookie?1:0;
            var zlCookieData = {
                isGetCookie:isCookie,
                zlCookie:zlCookie,
                host:curl
            };
            zlAction.postMessage(zlCookieData);
            zlAction.onMessage.addListener(function (res) {
                console.log(res)
            });
    //     }else {
    //         console.log("已在导出中！")
    //     }
    // });

});


