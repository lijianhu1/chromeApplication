/****************///图标
var curl = window.location.host;
var currIcon = chrome.runtime.connect({name: "currIcon"});//图标
currIcon.postMessage(curl);

var zlAction = chrome.runtime.connect({name: "zlAction"});//获取简历夹列表
$("#plugBtn").click(function () {
    console.log('开始')
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie
    }
    zlAction.postMessage(zlCookieData);
    zlAction.onMessage.addListener(function (res) {
    });
});


