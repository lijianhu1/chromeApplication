var begin = chrome.runtime.connect({name: "begin"});//开始抢票
$("#train").click(function () {
    console.log('开始')
    begin.postMessage('begin')
});