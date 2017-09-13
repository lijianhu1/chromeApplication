var cookieText = 'JSESSIONID=FAD413B2ACE735DABBBB5BED3B274328; BIGipServerotn=1926824202.64545.0000; BIGipServerpassport=820510986.50215.0000; __guid=14023341.3349396412768525300.1505183315269.561; fp_ver=4.5.1; RAIL_EXPIRATION=1505472103703; RAIL_DEVICEID=Pz71G8NSIW5EAU5TR5dyhJQWohePO2fZMl1EfpHv_94zR_DHP8Ta1dZrTx7AL_YND7h8usAszMWfGyMZ_oRxuBdjA0JHB-WVtTuHDA0WkeF-1rZP6iwkhUZelkH15f-TJj8U7OxDkU5-oz9_4Xgxtg6O6AfVmqrW; current_captcha_type=Z; route=c5c62a339e7744272a54643b3be5bf64; monitor_count=11; _jc_save_fromDate=2017-09-30; _jc_save_toDate=2017-09-30; _jc_save_fromStation=%u6DF1%u5733%2CSZQ; _jc_save_toStation=%u6C55%u5C3E%2COGQ; _jc_save_wfdc_flag=dc';
var resumeCookieList = cookieText.split(';');
//去除空格
function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
}
for (var index in resumeCookieList) {
    var cookieName = trim(resumeCookieList[index].split('=')[0]);
    var ind = resumeCookieList[index].indexOf('=');
    var cooKieVal = resumeCookieList[index].slice(ind+1);


//设置cookie
    chrome.cookies.set({
        'url':'https://kyfw.12306.cn',
        'name':cookieName,
        'value':cooKieVal,
        'secure':false,
        'httpOnly':false
    }, function(cookie){
    });
};
chrome.extension.onConnect.addListener(function (port) {
    if (port.name=='begin'){
        port.onMessage.addListener(function (req) {
            $.get('https://kyfw.12306.cn/otn/leftTicket/log?leftTicketDTO.train_date=2017-09-30&leftTicketDTO.from_station=SZQ&leftTicketDTO.to_station=OGQ&purpose_codes=ADULT',function (res) {
                console.log(res)
            });
        });
    }
});
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.type === 'xmlhttprequest') {
            var exists = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    exists = true;
                    details.requestHeaders[i].value = 'https://kyfw.12306.cn/otn/leftTicket/init';
                    break;
                }
            }
            // https://jobads.zhaopin.com/Position/PositionManageStatus
            if (!exists) {
                details.requestHeaders.push({ name: 'Referer', value: 'https://kyfw.12306.cn/otn/leftTicket/init'});
            }

            return { requestHeaders: details.requestHeaders };
        }
    },
    {urls: ['https://kyfw.12306.cn/otn/leftTicket/queryX']},
    ["blocking", "requestHeaders"]
);