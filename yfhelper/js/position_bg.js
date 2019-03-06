var cookieFoo = function () {
};  //新建全局函数
cookieFoo.prototype.set = function (cookieText) {  //给全局函数添加设置cookie方法
    var resumeCookieList = cookieText.split(';');
    for (var index in resumeCookieList) {
        var cookieName = trim(resumeCookieList[index].split('=')[0]);
        var ind = resumeCookieList[index].indexOf('=');
        var cooKieVal = resumeCookieList[index].slice(ind + 1);
//设置cookie
        chrome.cookies.set({
            'url': 'https://rd.zhaopin.com',
            'name': cookieName,
            'value': cooKieVal,
            'domain': '.zhaopin.com',
            'secure': false,
            'httpOnly': false
        }, function (cookie) {
        });
//设置cookie
        chrome.cookies.set({
            'url': 'https://rd2.zhaopin.com',
            'name': cookieName,
            'value': cooKieVal,
            'domain': '.zhaopin.com',
            'secure': false,
            'httpOnly': false
        }, function (cookie) {
        });
        chrome.cookies.set({
            'url': 'https://jobads.zhaopin.com',
            'name': cookieName,
            'value': cooKieVal,
            'domain': '.zhaopin.com',
            'secure': false,
            'httpOnly': false
        }, function (cookie) {
        });
    }
};
cookieFoo.prototype.remove = function () {
    chrome.cookies.remove({
        'url': 'https://rd.zhaopin.com',
        'name': 'RDsUserInfo',
    });
    chrome.cookies.remove({
        'url': 'https://rd2.zhaopin.com',
        'name': 'RDsUserInfo',
    });
    chrome.cookies.remove({
        'url': 'https://jobads.zhaopin.com',
        'name': 'RDsUserInfo',
    });
};
//去除空格
function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
}
//智联匹配
function matchZl(str, type) {
    var result;
    if (type == 'jobYear') {  //工作年限
        switch (str) {
            case '-1':
            case '0':
                result = 0;
                break;
            case '1':
            case '103':
                result = 1;
                break;
            case '305':
                result = 2;
                break;
            case '510':
                result = 3;
                break;
            case '1099':
                result = 4;
                break;
        }
    } else if (type == 'monthlyPay') {   //月薪
        switch (str) {
            case '0000001000':
                result = '0-1000';
                break;
            case '0100002000':
                result = '1000-2000';
                break;
            case '0200104000':
                result = '2000-4000';
                break;
            case '0400106000':
                result = '4000-6000';
                break;
            case '0600108000':
                result = '6000-8000';
                break;
            case '0800110000':
                result = '8000-10000';
                break;
            case '1000115000':
                result = '10000-15000';
                break;
            case '1500120000':
                result = '15000-20000';
                break;
            case '2000130000':
                result = '20000-30000';
                break;
            case '3000150000':
                result = '30000-50000';
                break;
            case '5000170000':
                result = '50000-70000';
                break;
            case '70001100000':
                result = '70000-100000';
                break;
            case '100001150000':
                result = '100000-999999';
                break;
            default:
                result = str;
        }
    } else if (type == 'jobType') {      //工作性质
        switch (str) {
            case'2':
                result = '全职';
                break;
            case'1':
                result = '兼职';
                break;
            case'4':
                result = '实习';
                break;
            case'5':
                result = '校园';
                break;
        }
    } else if (type == 'welfaretab') {
        switch (str) {
            case '10022':
                result = '创业公司';
                break;
            case '10024':
                result = '14薪';
                break;
            case '10025':
                result = '住房补贴';
                break;
            case '10026':
                result = '无试用期';
                break;
            case '10027':
                result = '免息房贷';
                break;
            case '10028':
                result = '每年多次调薪';
                break;
            case '10029':
                result = '健身俱乐部';
                break;
            case '10000':
                result = '五险一金';
                break;
            case '10001':
                result = '年底双薪';
                break;
            case '10002':
                result = '绩效奖金';
                break;
            case '10003':
                result = '年终分红';
                break;
            case '10004':
                result = '股票期权';
                break;
            case '10005':
                result = '加班补助';
                break;
            case '10006':
                result = '全勤奖';
                break;
            case '10007':
                result = '包吃';
                break;
            case '10008':
                result = '包住';
                break;
            case '10009':
                result = '交通补助';
                break;
            case '10010':
                result = '餐补';
                break;
            case '10011':
                result = '房补';
                break;
            case '10012':
                result = '通讯补贴';
                break;
            case '10013':
                result = '采暖补贴';
                break;
            case '10014':
                result = '带薪年假';
                break;
            case '10015':
                result = '弹性工作';
                break;
            case '10016':
                result = '补充医疗保险';
                break;
            case '10017':
                result = '定期体检';
                break;
            case '10018':
                result = '免费班车';
                break;
            case '10019':
                result = '员工旅游';
                break;
            case '10020':
                result = '高温补贴';
                break;
            case '10021':
                result = '节日福利';
                break;
            case '10023':
                result = '不加班';
                break;
        }
    }
    return result;
}
var currHost;

var positionHtml = document.createElement('div');
positionHtml.id = 'positionHtml';
var positionDetailHtml = document.createElement('div');
positionDetailHtml.id = 'positionDetail';
var deliveryHtml = document.createElement('div');
deliveryHtml.id = 'deliveryHtml';


var online = {  //在线中职位
    pagesize: 100,
    pageindex: 1,
    status: 3,
    jobpositionType: 0,
    orderByType: 1,
    orderBy: 2
}, unline = {  //未上线职位
    pagesize: 100,
    pageindex: 1,
    status: 1,
    jobpositionType: 0,
    orderByType: 1,
    orderBy: 4
}, downline = {  //已下线职位
    pagesize: 100,
    pageindex: 1,
    status: 4,
    jobpositionType: 0,
    orderByType: 1,
    orderBy: 3,
    substatus: 0
}, inaudit = {   //审核中职位
    pagesize: 100,
    pageindex: 1,
    status: 2,
    jobpositionType: 0,
    orderByType: 1,
    orderBy: 2
}, unaudit = {   //未通过中职位
    pagesize: 100,
    pageindex: 1,
    status: 6,
    jobpositionType: 0,
    orderByType: 1,
    orderBy: 2
};

function matchYfToZl(str, type) {
    var result;
    if (type == "jobType") {  //工作性质
        switch (str) {
            case 2:
                result = 2;
                break;
            case 3:
                result = 1;
                break;
            case 4:
                result = 4;
                break;
        }
    } else if (type == 'jobYear') {
        switch (str) {
            case 0:
                result = '-1';
                break;
            case 1:
                result = '103';
                break;
            case 2:
                result = '305';
                break;
            case 3:
                result = '510';
                break;
            case 4:
            case 5:
                result = '1099';
                break;

        }
    } else if (type == 'welfaretab') {
    } else if (type == 'welfaretab2') {
        switch (str) {
            case '1':
                result = '10000';
                break;
            case '2':
                result = '10001';
                break;
            case '3':
                result = '10002';
                break;
            case '4':
                result = '10003';
                break;
            case '5':
                result = '10004';
                break;
            case '6':
                result = '10005';
                break;
            case '7':
                result = '10020';
                break;
            case '8':
                result = '10006';
                break;
            case '9':
                result = '10007';
                break;
            case '10':
                result = '10009';
                break;
            case '11':
                result = '10010';
                break;
            case '12':
                result = '10011';
                break;
            case '13':
                result = '10012';
                break;
            case '14':
                result = '10021';
                break;
            case '15':
                result = '10014';
                break;
            case '16':
                result = '10015';
                break;
            case '17':
                result = '10016';
                break;
            case '18':
                result = '10017';
                break;
            case '19':
                result = '10018';
                break;
            case '20':
                result = '10019';
                break;


        }
    } else if (type == 'jobStatus') {
        switch (str) {
            case 1://发布中
                result = '3';
                break;
            case 2://已下线
                result = '4';
                break;
            case 0://草稿箱（暂默认为未上线）
                result = '1';
                break;
        }
        switch (str) {
            // case '创业公司'://
            //     result='10022';
            //     break;
            // case '14薪'://
            //     result='10024';
            //     break;
            // case '住房补贴'://
            //     result='10025';
            //     break;
            // case '无试用期'://
            //     result='10026';
            //     break;
            // case '免息房贷'://
            //     result='10027';
            //     break;
            // case '每年多次调薪'://
            //     result='10028';
            //     break;
            // case '健身俱乐部'://
            //     result='10029';
            //     break;
            // case '包吃'://
            //     result='10007';
            //     break;
            // case '采暖补贴'://
            //     result='10013';
            //     break;
            // case '不加班'://
            //     result='10023';
            //     break;
            case '五险一金':
                result = '10000';
                break;
            case '年度双薪':
                result = '10001';
                break;
            case '绩效奖金':
                result = '10002';
                break;
            case '年终分红':
                result = '10003';
                break;
            case '股票期权':
                result = '10004';
                break;
            case '加班补助':
                result = '10005';
                break;
            case '高温补贴':
                result = '10020';
                break;
            case '全勤奖':
                result = '10006';
                break;
            case '包吃包住':
                result = '10008';
                break;
            case '交通补助':
                result = '10009';
                break;
            case '餐补':
                result = '10010';
                break;
            case '房补':
                result = '10011';
                break;
            case '通讯补贴':
                result = '10012';
                break;
            case '带薪年假':
                result = '10014';
                break;
            case '弹性工作':
                result = '10015';
                break;
            case '医疗保险':
                result = '10016';
                break;
            case '定期体检':
                result = '10017';
                break;
            case '免费班车':
                result = '10018';
                break;
            case '员工旅游':
                result = '10019';
                break;
            case '节日福利':
                result = '10021';
                break;

        }
    }
    return result;
}


var zlCookie, compUserId;
var getPlugZlJobInfo = 'http://ats.yifengjianli.com/jobZl/getPlugZlJobInfo';//获取职位详情
// var getPlugZlJobInfo = 'http://192.168.1.253:8080/jobZl/getPlugZlJobInfo';//获取职位详情
var getZlJobInfo = 'http://ats.yifengjianli.com/jobZl/getZlJobInfo';//编辑职位详情
var updateZlJobInfo = 'http://ats.yifengjianli.com/jobZl/updateZlJobInfo';//发布成功后返回
var getCookie = 'http://www.yifengjianli.com/common/getJobZlCookie?type=zl';
var zl_Dama = 'http://www.yifengjianli.com/zlresume/zlDama';
var exportUrl = 'http://ats.yifengjianli.com/resume/exportResume';//投递夹导出
var sendStatus = 'http://ats.yifengjianli.com/jobZl';//邮件发送成功后返回后台接口
var deliveryType = 1; //投递夹状态
var resumeCurrPage = 1;//当前页数
var screenStatus = true,pisitionStatus = true;
var zl_citylist, zl_positionType;
var times = 400;
var damaErrTime = 0;

$.get('../json/zl_citylist.json', function (res) {
    zl_citylist = JSON.parse(res);

});
$.get('../json/zl_positionType.json', function (res) {
    zl_positionType = JSON.parse(res);
});
function removeCookie() {
    chrome.cookies.remove({
        'url': 'https://rd.zhaopin.com',
        'name': 'RDsUserInfo',
    });
    chrome.cookies.remove({
        'url': 'https://rd2.zhaopin.com',
        'name': 'RDsUserInfo',
    });
    chrome.cookies.remove({
        'url': 'https://jobads.zhaopin.com',
        'name': 'RDsUserInfo',
    });
}
chrome.extension.onConnect.addListener(function (port) {
    var cookieData = new cookieFoo();
    //*********投递************//
    var screenData = {
        CurrentPageNum: 1,
        SF_1_1_50: deliveryType,
        SF_1_1_51: '-1',
        PageType: '0',
        click_search_op_type: deliveryType,
        SF_1_1_52: '0',
        SF_1_1_49: '0',
        IsInvited: '0',
        'X-Requested-With': 'XMLHttpRequest',
        PageList2: ''
    };
    var screenHtml = document.createElement('div');
    screenHtml.id = 'screenHtml';
    var isDamaHtml = document.createElement('div');
    isDamaHtml.id = 'isDamaHtml';
    //打码
    function resumeDama(type, page) {
        damaErrTime++;
        if (damaErrTime <= 3) {
            var damaData = {
                zlCookie: zlCookie,
                type: 'resume'
            };
            $.get(zl_Dama, damaData, function (damaRes) {
                if (damaRes.code == 200) {
                    damaErrTime = 0;
                    var deliveryFormData = {
                        CurrentPageNum: page,
                        SF_1_1_50: type,
                        SF_1_1_51: '-1',
                        PageType: '0',
                        click_search_op_type: type,
                        SF_1_1_52: '0',
                        SF_1_1_49: '0',
                        IsInvited: '0',
                        'X-Requested-With': 'XMLHttpRequest',
                        PageList2: ''
                    };
                    screenList(deliveryFormData);
                    return;
                } else {
                    resumeDama(deliveryType, resumeCurrPage);
                    return;
                }
            });

        }
    }
    function zlDama(foo) {
        damaErrTime++;
        if (damaErrTime <= 3&&(typeof foo=='function')) {
            var damaData = {
                zlCookie: zlCookie,
                type: 'position'
            };
            $.get(zl_Dama, damaData, function (damaRes) {
                if (damaRes.code == 200) {
                    damaErrTime = 0;
                    foo();
                    return;
                } else {
                    zlDama();
                    return;
                }
            });
        }
    }
    //cookie过期
    function cookieOverdue(foo) {
        if(typeof foo=='function'){
            $.get(getCookie, function (cookieRes) {
                if (cookieRes.code == 200) {
                    cookieData.set(cookieRes.cookie);
                    zlCookie = cookieRes.cookie;
                    compUserId = cookieRes.compUserId;
                    chrome.cookies.set({
                        'url': 'http://' + currHost,
                        'name': 'zl_cookie',
                        'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                        'secure': false,
                        'httpOnly': false
                    }, function (cookie) {
                    });
                    chrome.cookies.set({
                        'url': 'http://' + currHost,
                        'name': 'zl_compUserId',
                        'value': cookieRes.compUserId,
                        'secure': false,
                        'httpOnly': false
                    }, function (cookie) {
                    });
                    setTimeout(function () {
                        foo();
                    }, 500);
                }
            });
        }
    }
    //投递夹
    function screenList(screenFormData) {
        $.ajax({
            url: 'https://rd2.zhaopin.com/rdapply/resumes/apply/search?SF_1_1_38=4,9&orderBy=CreateTime',
            type: 'POST',
            data: screenFormData,
            success: function (response, textStatus, conText) {
                if (conText.status == 200) {
                    screenHtml.innerHTML = response;
                    var damaText = $(screenHtml).find('.login-box .login-box-title').text();
                    if (damaText) {
                        console.log('确定打码');
                        resumeDama(deliveryType, resumeCurrPage);
                    } else {
                        var screenDetailList = [];
                        var screenDate = [];
                        var screenDetailArr = [];
                        var zlTableTr = $(screenHtml).find('#zpResumeListTable tbody tr[data-type=1]');
                        $.each(zlTableTr, function (index, item) {
                            var alink = $(item).find('td .link').attr('href');
                            var linkDate = $(item).find('td:last').attr('title').split(' ')[0];
                            screenDetailList.push(alink);
                            screenDate.push(linkDate);
                        });
                        console.log(screenDetailList, screenDate);
                        if (screenDetailList.length > 0) {
                            var screenCount = 0;
                            var pages = $(screenHtml).find('.turnpageCon span.red12px').text();
                            resumeCurrPage = parseInt(pages.split('/')[0]);  //当前页
                            var totalPage = parseInt(pages.split('/')[1]); //总页数
                            function screenResumeDetail() {
                                if (screenCount >= screenDetailList.length) {
                                    clearInterval(screenTime);
                                    var resumeData = {
                                        source: 3, // 2 前程、3智联  ----简历来源
                                        sourceFile: 2,//1:人才夹，2：收件箱
                                        resumeDetailStr: screenDetailArr.join('AA&AA'),
                                        compUserId: compUserId
                                    };
                                    console.log(screenDetailArr);
                                    console.log("当前类型：" + deliveryType, "当前页数：" + resumeCurrPage, "总页数：" + totalPage);
                                    $.ajax({
                                        url: exportUrl,
                                        type: 'POST',
                                        async: false,
                                        data: resumeData,
                                        success: function (res) {
                                            console.log('投递夹导出');
                                        },
                                        error: function (res) {
                                            console.log(res);
                                        }
                                    });

                                    if (resumeCurrPage == totalPage) {
                                        if (deliveryType < 4) {
                                            deliveryType = parseInt(deliveryType) + 1;
                                            var deliveryFormData = {
                                                CurrentPageNum: 1,
                                                SF_1_1_50: deliveryType,
                                                SF_1_1_51: '-1',
                                                PageType: '0',
                                                click_search_op_type: deliveryType,
                                                SF_1_1_52: '0',
                                                SF_1_1_49: '0',
                                                IsInvited: '0',
                                                'X-Requested-With': 'XMLHttpRequest',
                                                PageList2: ''
                                            };
                                            screenList(deliveryFormData);
                                        } else {
                                            console.log('简历投递导出完毕');
                                            removeCookie();
                                            screenStatus = true;
                                        }
                                    } else if (resumeCurrPage < totalPage) {
                                        var deliveryFormData = {
                                            CurrentPageNum: ++resumeCurrPage,
                                            SF_1_1_50: deliveryType,
                                            SF_1_1_51: '-1',
                                            PageType: '0',
                                            click_search_op_type: deliveryType,
                                            SF_1_1_52: '0',
                                            SF_1_1_49: '0',
                                            IsInvited: '0',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            PageList2: ''
                                        };
                                        screenList(deliveryFormData);
                                    }
                                } else {
                                    $.ajax({
                                        url: 'https:' + screenDetailList[screenCount],
                                        type: 'GET',
                                        success: function (res, textStatus, conText) {
                                            if (conText.status == 200) {
                                                $(isDamaHtml).html(res);
                                                var damaText = $(isDamaHtml).find('.login-box .login-box-title').text();
                                                if (damaText) {
                                                    console.log('确定打码');
                                                    clearInterval(screenTime);
                                                    resumeDama(deliveryType, resumeCurrPage);
                                                } else {
                                                    var detaliData = res + 'BBdateBB' + screenDate[screenCount];
                                                    screenDetailArr.push(detaliData);
                                                    screenCount++;
                                                }

                                            } else {
                                                console.log(res);
                                                clearInterval(screenTime);
                                                $.get(getCookie, function (cookieRes) {
                                                    if (cookieRes.code == 200) {
                                                        cookieData.set(cookieRes.cookie);
                                                        zlCookie = cookieRes.cookie;
                                                        compUserId = cookieRes.compUserId;
                                                        chrome.cookies.set({
                                                            'url': 'http://' + currHost,
                                                            'name': 'zl_cookie',
                                                            'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                                                            'secure': false,
                                                            'httpOnly': false
                                                        }, function (cookie) {
                                                        });
                                                        chrome.cookies.set({
                                                            'url': 'http://' + currHost,
                                                            'name': 'zl_compUserId',
                                                            'value': cookieRes.compUserId,
                                                            'secure': false,
                                                            'httpOnly': false
                                                        }, function (cookie) {
                                                        });
                                                        setTimeout(function () {
                                                            screenData.CurrentPageNum = resumeCurrPage;
                                                            screenList(screenData);
                                                        }, 500);
                                                    }
                                                });
                                            }

                                        },
                                        error: function (err) {
                                            clearInterval(screenTime);
                                        }
                                    });

                                }
                            }

                            var screenTime = setInterval(function () {
                                screenResumeDetail();
                            }, times);
                        } else {
                            if (deliveryType < 4) {
                                deliveryType = parseInt(deliveryType) + 1;
                                var deliveryFormData = {
                                    CurrentPageNum: 1,
                                    SF_1_1_50: deliveryType,
                                    SF_1_1_51: '-1',
                                    PageType: '0',
                                    click_search_op_type: deliveryType,
                                    SF_1_1_52: '0',
                                    SF_1_1_49: '0',
                                    IsInvited: '0',
                                    'X-Requested-With': 'XMLHttpRequest',
                                    PageList2: ''
                                };
                                screenList(deliveryFormData);
                            } else {
                                chrome.browserAction.setIcon({path: 'img/icon19.png'});
                                removeCookie();//移除原来cookie
                                screenStatus = true;
                            }
                        }
                    }
                } else { //cookie过期
                    $.get(getCookie, function (cookieRes) {
                        if (cookieRes.code == 200) {
                            cookieData.set(cookieRes.cookie);
                            zlCookie = cookieRes.cookie;
                            compUserId = cookieRes.compUserId;
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_cookie',
                                'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_compUserId',
                                'value': cookieRes.compUserId,
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            setTimeout(function () {
                                screenData.CurrentPageNum = resumeCurrPage;
                                screenList(screenData);
                            }, 500);
                        }
                    });
                }
            }
            ,
            error: function (err) {
                console.log(err);

            }
        });

    }
    if (port.name == "getResumeListAction") {
        port.onMessage.addListener(function (request) {
            console.log(request);
            currHost = request.host;
            if (screenStatus) {
                //移除原来cookie
                // removeCookie();
                screenStatus = false;
                var screenTime = 300;
                var screenTi = setInterval(function () {
                    screenTime--;
                    if (screenTime <= 0) {
                        clearInterval(screenTi);
                        screenStatus = true;
                    }
                }, 1000);
                if (request.isGetCookie) {
                    console.log('有本地cookie', request.zlCookie);
                    var cookieText = (request.zlCookie).split('DOUNINE').join(';');
                    compUserId = request.compUserId;
                    cookieData.set(cookieText);
                    zlCookie = cookieText;
                    setTimeout(function () {
                        deliveryType = 1;
                        screenList(screenData);
                    }, 500);
                } else {
                    console.log('获取cookie');
                    $.get(getCookie, function (cookieRes) {
                        if (cookieRes.code == 200) {
                            cookieData.set(cookieRes.cookie);
                            zlCookie = cookieRes.cookie;
                            compUserId = cookieRes.compUserId;
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_cookie',
                                'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_compUserId',
                                'value': cookieRes.compUserId,
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            setTimeout(function () {
                                deliveryType = 1;
                                screenList(screenData);
                            }, 500);
                        }
                    });
                }
            } else {
                console.log("重复导出中");
            }


        });

    }
    var positionTime;
    var positionManage = online;
    var getPositionList = function () {
        clearInterval(positionTime);
        console.log('当前状态：', positionManage);
        $.ajax({
            url: 'https://jobads.zhaopin.com/Position/PositionManageStatus',
            data: positionManage,
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            success: function (positionRes, textStatus, conText) {
                if (conText.status == 200) {
                    $(positionHtml).html(positionRes);
                    var damaText = $(positionHtml).find('.login-box .login-box-title').text();
                    if (damaText) {
                        console.log('确定打码');
                        clearInterval(positionTime);
                        zlDama(getPositionList);
                        // positionDama();

                    } else {
                        //职位列表数组
                        var positionsListArr = [];  //职位ID
                        var editidArr = [];       //editid
                        var releaseDateArr = [];     //发布时间
                        var departmentArr = [];   //部门
                        var offlineTypeArr = [];  // 下线类型
                        var deliveryResumeNumArr = [];    //投递数
                        var pageCount = $(positionHtml).find('#pageCount').val(); //总页数
                        var pageIndex = $(positionHtml).find('#pageIndex').val(); //当前页
                        $.each($(positionHtml).find('.tableBody tr'), function (index, item) {
                            positionsListArr.push($(item).children('td:eq(0)').find('.checkbox').data('value'));
                            editidArr.push($(item).children('td:eq(0)').find('input').data('editid'));
                            releaseDateArr.push($(item).children('td:eq(2)').text());
                            if (positionManage.status == 3) { //在线中
                                departmentArr.push($(item).children('td:eq(7)').text());
                                deliveryResumeNumArr.push($(item).children('td:eq(10)').find('a').text());
                            } else if (positionManage.status == 1) {  //未上线
                                departmentArr.push($(item).children('td:eq(3)').text());
                            } else if (positionManage.status == 4) { //下线
                                departmentArr.push($(item).children('td:eq(4)').text());
                                offlineTypeArr.push($(item).children('td:eq(6)').text());
                                deliveryResumeNumArr.push($(item).children('td:eq(8)').find('a').text());
                            }
                        });
                        if (positionsListArr.length > 0) {
                            var positionIndex = 0;
                            var dataArr = [];
                            // var deliveryNum;//投递数
                            // $.ajax({
                            //     url:'https://jobads.zhaopin.com/Resume/GetResumCount?editIds='+editidArr.join(';')+'&ntype=0',
                            //     type:'GET',
                            //     async:false,
                            //     success:function (resumCountRes) {
                            //         if(resumCountRes.Code==200){
                            //             deliveryNum = resumCountRes.Data;
                            //         }
                            //
                            //     },
                            //     error:function (err) {
                            //         console.log('打码');
                            //     }
                            // });
                            function getPositionDetail() {
                                console.log(positionIndex);

                                $.ajax({
                                    url: 'https://jobads.zhaopin.com/Position/PositionModify/' + positionsListArr[positionIndex],
                                    type: 'GET',
                                    async: false,
                                    success: function (positionDetailRes,textStatus,conText) {
                                        if(conText.status==200){
                                            $(positionDetailHtml).html(positionDetailRes);
                                            var damaText = $(positionDetailHtml).find('.login-box .login-box-title').text();
                                            var wuquanxian = $(positionDetailHtml).find('.wrong_box .fs30').text();
                                            if (damaText) {
                                                console.log('确定打码');
                                                clearInterval(positionTime);
                                                zlDama(getPositionList);
                                                return;
                                            }else if(wuquanxian.indexOf('您没有操作发布中职位的权限')!=-1){
                                                console.log('无权限');
                                                clearInterval(positionTime);
                                                positionManage=unline;
                                                getPositionList();
                                                return;
                                            }else {
                                                var loginPointId = $(positionDetailHtml).find('#LoginPointId').val();
                                                // if(loginPointId){
                                                if (positionIndex >= positionsListArr.length) {
                                                    clearInterval(positionTime);
                                                    console.log(dataArr);
                                                    var positionDetailData = {};
                                                    positionDetailData.jobList = JSON.stringify(dataArr);
                                                    positionDetailData.compUserId = compUserId;
                                                    console.log(positionDetailData);
                                                    $.ajax({
                                                        url: getPlugZlJobInfo,
                                                        type: 'POST',
                                                        data: positionDetailData,
                                                        success: function (suc) {
                                                            console.log('提交成功');
                                                        },
                                                        error: function (err) {
                                                            console.log('提交失败');
                                                        }
                                                    });
                                                    if (pageCount == pageIndex) {
                                                        console.log('该类型职位完毕');
                                                        var currStatus = positionManage.status;  //判断当前状态
                                                        if (currStatus == 3) {
                                                            positionManage = unline;
                                                            getPositionList();
                                                        } else if (currStatus == 1) {
                                                            positionManage = downline;
                                                            getPositionList();
                                                        } else if (currStatus == 4) {
                                                            positionManage = inaudit;
                                                            getPositionList();
                                                        }/*else if(currStatus==2){
                                                         positionManage=unaudit;
                                                         getPositionList();
                                                         }*/ else {
                                                            console.log('职位完毕');
                                                            pisitionStatus = true;
                                                            return;
                                                        }
                                                    } else {
                                                        positionManage.pageindex = parseInt(pageIndex) + 1;
                                                        console.log(pageCount, '该页完毕');
                                                        getPositionList();
                                                    }
                                                } else {

                                                    var $positionDetailHtml = $(positionDetailHtml);
                                                    var labelArr = [];
                                                    // var welfaretab = $positionDetailHtml.find('#welfaretab').val().split(',');
                                                    var welfaretab = $positionDetailHtml.find('#welfaretab').val();
                                                    if(welfaretab){
                                                        welfaretab=welfaretab.split(',');
                                                        $.each(welfaretab, function (index, item) {
                                                            labelArr.push(matchZl(item, 'welfaretab'));
                                                        });
                                                    }else {
                                                        welfaretab = '0000';
                                                    }

                                                    var MonthlyPay = matchZl($positionDetailHtml.find('#MonthlyPay').val(), 'monthlyPay');   //月薪
                                                    var salaryFrom = MonthlyPay.split('-')[0];
                                                    var salaryTo = MonthlyPay.split('-')[1];
                                                    var jobCityVal = $positionDetailHtml.find('#PositionPubPlace').val();
                                                    jobCityVal = jobCityVal.split('|')[0];
                                                    // if(jobCityVal.length>1){
                                                    //     jobCityVal = jobCityVal[1];
                                                    // }else {
                                                    //     jobCityVal = jobCityVal[0];
                                                    // }
                                                    if(jobCityVal.indexOf('@')==-1){
                                                        jobCityVal = jobCityVal
                                                    }else {
                                                        jobCityVal = jobCityVal.split('@')[1];
                                                    }
                                                    var jobCity = cityTool.getcityId(jobCityVal);
                                                    var JobDes = $positionDetailHtml.find('#JobDescription').val();
                                                    // var jobinfo = JobDes.replace(/<\/p[^>]*>/g,'\n').replace(/<br[^>]*>/g,'').replace(/&nbsp/g,'');
                                                    // var jobinfo = JobDes.replace(/<p[^>]*>/g, '').replace(/<\/p[^>]*>/g, '\n').replace(/<br[^>]*>/g, '').replace(/&nbsp;/g, '');
                                                    var jobinfo = JobDes.replace(/<.*?>/ig,"").replace(/&nbsp;/g, '').replace(/；/g,'；\n').replace(/任职资格：/g,'\n任职资格：\n').replace(/岗位职责：/,'岗位职责：\n');;
                                                    var data = {
                                                        jobId: $positionDetailHtml.find('#PositionNumber').val(), //职位id
                                                        jobStatus: $positionDetailHtml.find('#Status').val(),     //当前状态类型 3：在线中，1、未上线，4、已下线
                                                        jobName: $positionDetailHtml.find('#JobTitle').val(),      //职位名
                                                        merit: labelArr.join(','),       //福利标签
                                                        salaryFrom: salaryFrom ? salaryFrom : '999999',      //最低薪资
                                                        salaryTo: salaryTo ? salaryTo : '999999',          //最高薪资
                                                        jobCity: jobCity,      //工作地点
                                                        releaseTime: releaseDateArr[positionIndex],      //发布日期
                                                        jobType: matchZl($positionDetailHtml.find('.tab_dh input:checked').val(), 'jobType'),     //工作性质
                                                        jobYear: matchZl($positionDetailHtml.find('#WorkYears').val(), 'jobYear'),     //工作经验
                                                        EducationLevel: $positionDetailHtml.find('#EducationLevel').val(),      //最低学历
                                                        recruitNum: $positionDetailHtml.find('#Quantity').val(),      //招聘人数
                                                        jobTitle: $positionDetailHtml.find('#subJobTypeMain').val(),       //职位类别子
                                                        JobTypeMain: $positionDetailHtml.find('#jobTypeMain').val(),       //职位类别
                                                        jobTypeMinor: $positionDetailHtml.find('#jobTypeMinor').val(),   //次要职位类别
                                                        subJobTypeMinor: $positionDetailHtml.find('#subJobTypeMinor').val(),   //次要职位类别子
                                                        jobInfo: jobinfo,      //工作描述
                                                        workAdress: cityTool.getName(jobCityVal) + $positionDetailHtml.find('#WorkAddress').val(),     //上班地址
                                                        editid: editidArr[positionIndex],        //编辑id
                                                        department: departmentArr[positionIndex],        //部门
                                                        LoginPointId: $positionDetailHtml.find('#LoginPointId').val(),      //
                                                        CompanyAddress: $positionDetailHtml.find('#CompanyAddress').val(), //企业地址
                                                        endTime: $positionDetailHtml.find('#DateEnd').val(), //发布截至日期
                                                        ApplicationMethod: $positionDetailHtml.find('#ApplicationMethod').val(), //简历接收方式：1、仅通过智联系统接收简历；2、同时转发简历到邮箱
                                                        // DeliveryNum:currDeliveryCount?currDeliveryCount:0 //简历投递数
                                                    };
                                                    if (currStatus == 4 || currStatus == 3) {
                                                        data.deliveryResumeNum = deliveryResumeNumArr[positionIndex];
                                                        if (currStatus == 4) {
                                                            data.offlineType = offlineTypeArr[positionIndex];
                                                        }
                                                    }
                                                    if (positionIndex < positionsListArr.length) {
                                                        dataArr.push(data);
                                                        positionIndex++;
                                                    }

                                                }
                                            }

                                        }else {
                                            clearInterval(positionTime);
                                            cookieOverdue(getPositionList);
                                        }


                                    },
                                    error: function (err) {
                                        //打码处理
                                        clearInterval(positionTime);
                                    }
                                });
                            };
                            positionTime = setInterval(function () {
                                getPositionDetail();
                            }, times);
                        } else {
                            var currStatus = positionManage.status;
                            if (currStatus == 3) {
                                positionManage = unline;
                                getPositionList();
                            } else if (currStatus == 1) {
                                positionManage = downline;
                                getPositionList();
                            } else if (currStatus == 4) {
                                positionManage = inaudit;
                                getPositionList();
                            }/*else if(currStatus==2){
                             positionManage=unaudit;
                             getPositionList();
                             }*/ else {
                                pisitionStatus = true;
                                console.log('职位完毕');
                                return;
                            }
                        }
                    }
                }else { //cookie过期
                    cookieOverdue(getPositionList);
                }


            },
            error: function (err) {

            }
        });
    };
    if (port.name == 'getPosiAction') {
        port.onMessage.addListener(function (request) {
            currHost = request.host;
            // removeCookie();
            if(pisitionStatus){
                pisitionStatus = false;
                if (request.isGetCookie == 1) {
                    port.postMessage('有cookie');
                    console.log('有本地cookie', request.zlCookie);
                    var cookieText = (request.zlCookie).split('DOUNINE').join(';');
                    cookieData.set(cookieText);
                    zlCookie = cookieText;
                    compUserId = request.compUserId;
                    setTimeout(function () {
                        positionManage = online;
                        getPositionList();//获取职位列表数据
                    }, 500);
                } else {
                    console.log('无本地cookie');
                    port.postMessage('准备拿cookie');
                    $.get(getCookie, function (cookieRes) {
                        if (cookieRes.code == 200) {
                            port.postMessage('准备');
                            cookieData.set(cookieRes.cookie);
                            zlCookie = cookieRes.cookie;
                            compUserId = cookieRes.compUserId;
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_cookie',
                                'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_compUserId',
                                'value': cookieRes.compUserId,
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            setTimeout(function () {
                                positionManage = online;
                                getPositionList();//获取职位列表数据
                            }, 500);

                        }
                    });
                }
            }else {
                console.log('重复导出职位中');
            }
        });
    }
    if (port.name == 'addPosiAction') {
        port.onMessage.addListener(function (addRequest) {
            currHost = addRequest.host;
            var addRequestObj;
            // removeCookie();
            if (addRequest.isGetCookie) {
                var cookieText = (addRequest.zlCookie).split('DOUNINE').join(';');
                cookieData.set(cookieText);
                zlCookie = cookieText;
                setTimeout(function () {
                    positionAdd();
                }, 500);
            } else {
                $.get(getCookie, function (cookieRes) {
                    if (cookieRes.code == 200) {
                        cookieData.set(cookieRes.cookie);
                        zlCookie = cookieRes.cookie;

                        chrome.cookies.set({
                            'url': 'http://' + currHost,
                            'name': 'zl_cookie',
                            'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                            'secure': false,
                            'httpOnly': false
                        }, function (cookie) {
                        });
                        setTimeout(function () {
                            positionAdd();
                        }, 500);

                    }
                });
            }
            if (addRequest.unlinePosi) {
                $.get(getZlJobInfo, {jobId: addRequest.data}, function (response) {
                    if (response.code == 200) {
                        addRequestObj = response.jobNum;
                    }

                });
            } else {
                addRequestObj = JSON.parse(addRequest.data);
            }


            function positionAdd() {
                var getPositionType;
                var cityId;
                function city(citylist) {
                    for (var i in citylist) {
                        if (addRequestObj.jobCity == citylist[i].id) {
                            if (citylist[i].childList && citylist[i].superId != 0) {
                                cityId = citylist[i].id
                                console.log(citylist[i].id);
                            } else {
                                console.log(citylist[i].superId + '@' + citylist[i].id)
                                cityId = citylist[i].superId + '@' + citylist[i].id
                            }
                        } else if (citylist[i].childList && citylist[i].childList.length > 0) {
                            city(citylist[i].childList);
                        }
                    }
                }

                city(zl_citylist);
                for (var ind in zl_positionType) {   //获取职位类别
                    if (zl_positionType[ind].id == addRequestObj.jobTitle) {
                        getPositionType = zl_positionType[ind];
                    }
                }
                var meritYfId = addRequestObj.merit.split(',');
                var meritZlId = [];
                for (var index in meritYfId) {
                    meritZlId.push(matchYfToZl(meritYfId[index], 'welfaretab'));
                }

                //职位详情添加P标签
                function addTab(str) {
                    return "<p>" + str + "</p>";
                }

                var jobDesArr = addRequestObj.jobInfo.split(/[\n,]/g);
                for (var index in jobDesArr) {
                    jobDesArr[index] = addTab(jobDesArr[index]);
                }
                var addPosiFormData = {
                    EmploymentType: 2,
                    JobTitle: addRequestObj.jobName,
                    JobTypeMain: getPositionType.superId,
                    SubJobTypeMain: addRequestObj.jobTitle,
                    Quantity: addRequestObj.num,
                    EducationLevel: addRequestObj.education,
                    WorkYears: matchYfToZl(parseInt(addRequestObj.jobYear), 'jobYear'),
                    MonthlyPay: addRequestObj.salaryFrom + '-' + addRequestObj.salaryTo,
                    JobDescription: jobDesArr.join(''),
                    welfaretab: meritZlId.join(','),
                    PositionPubPlace: cityId,
                    WorkAddress: addRequestObj.adress,
                    ApplicationMethod: 1,
                    btnAddClick: 'saveandpub',
                };
                console.log(addPosiFormData);
                $.ajax({
                    url: 'https://jobads.zhaopin.com/Position/PositionAdd',
                    type: 'GET',
                    success: function (suc,textStatus,conText) {
                        if(conText.status==200){
                            $(positionDetailHtml).html(suc);
                            var damaText = $(positionDetailHtml).find('.login-box .login-box-title').text();
                            if (damaText) {
                                console.log('确定打码');
                                zlDama(positionAdd);
                            }else {
                                var loginPointId = $(positionDetailHtml).find('#LoginPointId').val();
                                var dateEnd = $(positionDetailHtml).find('#DateEnd').val();
                                addPosiFormData.LoginPointId = loginPointId;
                                addPosiFormData.DepartmentId = loginPointId;
                                addPosiFormData.DateEnd = dateEnd;
                                if (loginPointId) {
                                    $.ajax({
                                        url: 'https://jobads.zhaopin.com/Position/PositionAdd',
                                        data: addPosiFormData,
                                        type: 'POST',
                                        dataType: 'json',
                                        success: function (res) {
                                            port.postMessage(res);
                                            if (res.Code == 200) {
                                                var successData = {
                                                    jobId: addRequest.unlinePosi ? addRequestObj.id : addRequestObj.talentId,
                                                    zlJobId: res.Data.JobPositionNumber,
                                                    zlEditId: res.Data.EditId,
                                                    endTime: dateEnd
                                                };
                                                $.get(updateZlJobInfo, successData, function (updateZlJobInfoRes) {
                                                    console.log(updateZlJobInfoRes);
                                                });
                                                removeCookie();
                                                ;//清除cookie
                                            }
                                        },
                                        error: function () {
                                            //打码处理
                                            var damaData = {
                                                zlCookie: zlCookie,
                                                type: 'position'
                                            };
                                            zldama();
                                            function zldama() {
                                                damaErrTime++;
                                                if (damaErrTime <= 3) {
                                                    $.get(zlDama, damaData, function (damaRes) {
                                                        if (damaRes.code == 200) {
                                                            damaErrTime = 0;
                                                            positionAdd();
                                                        } else {
                                                            zldama();
                                                        }
                                                    });

                                                }
                                            }
                                        }
                                    });
                                } else {
                                    console.log('没有权限');
                                }
                            }

                        }else {
                            cookieOverdue(positionAdd);
                        }


                    }
                })
            }
            // function positionAddDama(foo) {
            //     damaErrTime++;
            //     if (damaErrTime <= 3) {
            //         var damaData = {
            //             zlCookie: zlCookie,
            //             type: 'resume'
            //         };
            //         $.get(zlDama, damaData, function (damaRes) {
            //             if (damaRes.code == 200) {
            //                 damaErrTime = 0;
            //                 positionAdd();
            //                 return;
            //             } else {
            //                 positionAddDama();
            //                 return;
            //             }
            //         });
            //     }
            // }

        })
    }
    // if(port.name=='unOnlineAction'){
    //     port.onMessage.addListener(function (addRequest) {
    //         // removeCookie();
    //         if(addRequest.isGetCookie){
    //             var cookieText = (addRequest.zlCookie).split('DOUNINE').join(';');
    //             cookieData.set(cookieText);
    //             zlCookie = cookieText;
    //             unlineAddPosi()
    //         }else {
    //             $.get(getCookie,function (cookieRes) {
    //                 if(cookieRes.code==200){
    //                     cookieData.set(cookieRes.cookie);
    //                     zlCookie=cookieRes.cookie;
    //                     chrome.cookies.set({
    //                         'url': 'http://'+addcurrHost,
    //                         'name': 'zl_cookie',
    //                         'value': (cookieRes.cookie).split(';').join('DOUNINE'),
    //                         'secure': false,
    //                         'httpOnly': false
    //                     }, function (cookie) {
    //                     });
    //                     setTimeout(function () {
    //                         unlineAddPosi();
    //                     },500);
    //
    //                 }
    //             });
    //         }
    //
    //         function unlineAddPosi() {
    //
    //             $.get(getZlJobInfo,{jobId:addRequest.data},function (response) {
    //                 if(response.code==200){
    //                     console.log(response)
    //                     // var addRequestObj = response.jobNum;
    //
    //                 }
    //
    //             });
    //         }
    //     });
    //
    //
    // }
    // if(port.name=='editPosiAction'){
    //     port.onMessage.addListener(function (editRequest) {
    //         console.log(editRequest);
    //         $.get(getZlJobInfo,editRequest.data,function (response) {
    //             console.log(response);
    //             cookieData.remove()
    //             if(response.code==200){
    //                 var editRes = response.jobNum;
    //                 var getCity,getPositionType;
    //                 for(var ind in zl_city){   //获取城市
    //                     if(zl_city[ind].id==editRes.jobCity){
    //                         getCity = zl_city[ind];
    //                     }
    //                 };
    //                 for (var ind in zl_positionType){   //获取职位类别
    //                     if(zl_positionType[ind].id==editRes.jobTitle){
    //                         getPositionType = zl_positionType[ind];
    //                     }
    //                 };
    //                 //薪资
    //                 var salary = editRes.salaryFrom+'-'+editRes.salaryTo;
    //                 //福利
    //                 var meritTextArr = editRes.merit.split(',');
    //                 var meritIdArr = [];
    //                 for(var ind in meritTextArr){
    //                     meritIdArr.push(matchYfToZl(meritTextArr[ind],'welfaretab'));
    //                 }
    //                 //职位详情添加P标签
    //                 function addTab(str) {
    //                     return "<p>"+str+"</p>";
    //                 }
    //                 var jobDesArr = editRes.jobInfo.split(/[\n,]/g);
    //                 for (var index in jobDesArr ){
    //                     jobDesArr[index] = addTab(jobDesArr[index]);
    //                 }
    //
    //                 var editPosiFormData={
    //                     PositionNumber: editRes.zlJobId,   //职位id
    //                     Status: matchYfToZl(editRes.status,'jobStatus'),                                 //z职位状态
    //                     EmploymentType: matchYfToZl(editRes.jobType,'jobType'),                          //职位性质
    //                     JobTitle: editRes.jobName,                  //职位名称
    //                     PositionPubPlace: getCity.superId+'@'+getCity.id,//?               //工作地点id
    //                     JobTypeMain: getPositionType.superId,      //?                   //职位类别大类id
    //                     SubJobTypeMain: editRes.jobTitle,                        //职位类别子类id
    //                     Quantity: editRes.num,                                //招聘人数
    //                     EducationLevel: editRes.education,                          //学历
    //                     WorkYears: matchYfToZl(editRes.jobYear,'jobYear'),                             //工作经验
    //                     MonthlyPay: salary,                   //月薪 '0800110000':智联模板月薪；'8000-15000':自定义月薪
    //                     ApplicationMethod: '1',                     //简历接收方式，1：仅通过智联系统接收；2、同时转发到邮箱
    //                     WorkAddress: editRes.adress,               //上班地址
    //                     JobDescription: jobDesArr.join(''),
    //                     welfaretab: meritIdArr.join(','),      //福利、亮点标签
    //                     // btnAddClick: editRes.status==3?'saveasnotpub':'saveandpub', //saveasnotpub:在线中保存；saveandpub：已下线发布    //发布方式
    //                     btnAddClick:'saveandpub', //saveasnotpub:在线中保存；saveandpub：已下线发布    //发布方式
    //                 };
    //                 if(editRequest.isGetCookie){
    //                     console.log('有本地cookie',editRequest.zlCookie);
    //                     let cookieText = (editRequest.zlCookie).split('DOUNINE').join(';');
    //                     cookieData.set(cookieText);
    //                     zlCookie = cookieText;
    //                     setTimeout(function () {
    //                         positionModify();
    //                     },500);
    //                 }else {
    //                     console.log('无本地cookie');
    //                     $.get(getCookie,function (cookieRes) {
    //                         if(cookieRes.code==200){
    //                             cookieData.set(cookieRes.cookie);
    //                             zlCookie=cookieRes.cookie;
    //                             chrome.cookies.set({
    //                                 'url': 'http://'+editRequest.host,
    //                                 'name': 'zl_cookie',
    //                                 'value': (cookieRes.cookie).split(';').join('DOUNINE'),
    //                                 'secure': false,
    //                                 'httpOnly': false
    //                             }, function (cookie) {
    //                             });
    //                             setTimeout(function () {
    //                                 positionModify();
    //                             },500);
    //
    //                         }
    //                     });
    //                 }
    //                 function positionModify() {
    //                     $.ajax({
    //                         url:'https://jobads.zhaopin.com/Position/PositionModify/'+editRes.zlJobId,
    //                         type:'GET',
    //                         success:function (sucres) {
    //                             $(positionDetailHtml).html(sucres);
    //                             var loginPointId = $(positionDetailHtml).find('#LoginPointId').val();
    //                             var endDate = $(positionDetailHtml).find('#DateEnd').val()
    //                             editPosiFormData.LoginPointId = loginPointId;
    //                             editPosiFormData.DepartmentId = loginPointId;
    //                             editPosiFormData.DateEnd = endDate;
    //
    //                             console.log(editPosiFormData);
    //                             if(loginPointId){
    //                                 $.ajax({
    //                                     url:'https://jobads.zhaopin.com/Position/PositionModify',
    //                                     data:editPosiFormData,
    //                                     type:'POST',
    //                                     dataType:'json',
    //                                     beforeSend: function(xhr) {
    //                                         xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    //                                     },
    //                                     success:function (res) {
    //                                         console.log(res);
    //                                         port.postMessage(res);
    //                                         if(res.Code==200){
    //                                             let successData={
    //                                                 jobId:editRequest,
    //                                                 zlJobId:res.Data.JobPositionNumber,
    //                                                 zlEditId:res.Data.EditId
    //                                             };
    //                                             $.get(updateZlJobInfo,successData,function (updateZlJobInfoRes) {
    //                                                 console.log(updateZlJobInfoRes);
    //                                             });
    //                                             cookieData.remove();
    //                                         }
    //                                     },
    //                                     error:function (err) {
    //                                         console.log(err);
    //                                     }
    //                                 });
    //                             }else {
    //                                 console.log('没有权限');
    //                                 cookieData.remove();
    //                             }
    //
    //                         },
    //                         error:function (err) {
    //                             //打码处理
    //                             var damaData={
    //                                 zlCookie:zlCookie
    //                             };
    //                             $.get(zlDama,damaData,function (damaRes) {
    //                                 if(damaRes.code==200){
    //                                     positionModify();
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 }
    //
    //             }
    //
    //         });
    //
    //     });
    // }
    if (port.name == 'operPosiAction') {
        port.onMessage.addListener(function (operRequest) {
            currHost = operRequest.host;
            // removeCookie();
            if (operRequest.isGetCookie) {
                console.log('有本地cookie', operRequest.zlCookie);
                var cookieText = (operRequest.zlCookie).split('DOUNINE').join(';');
                cookieData.set(cookieText);
                zlCookie = cookieText;
                setTimeout(function () {
                    operFoo();
                }, 500);
            } else {
                console.log('无本地cookie');
                $.get(getCookie, function (cookieRes) {
                    if (cookieRes.code == 200) {
                        cookieData.set(cookieRes.cookie);
                        zlCookie = cookieRes.cookie;
                        currHost = operRequest.host;
                        chrome.cookies.set({
                            'url': 'http://' + currHost,
                            'name': 'zl_cookie',
                            'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                            'secure': false,
                            'httpOnly': false
                        }, function (cookie) {
                        });
                        chrome.cookies.set({
                            'url': 'http://' + currHost,
                            'name': 'zl_compUserId',
                            'value': cookieRes.compUserId,
                            'secure': false,
                            'httpOnly': false
                        }, function (cookie) {
                        });
                        setTimeout(function () {
                            operFoo();
                        }, 500);

                    }
                });
            }
            function operFoo() {
                var req = JSON.parse(operRequest.data);
                if (req.type == 'unline') {
                    positionStop();
                    function positionStop() {
                        $.ajax({
                            url: 'https://jobads.zhaopin.com/Position/PositionStop',
                            data: 'positionNumbers=' + req.id,
                            type: 'post',
                            dataType: 'json',
                            success: function (res,textStatus,conText) {
                                if(conText.status==200){
                                    console.log('下线成功', res);
                                    removeCookie();
                                }else {
                                    cookieOverdueOper(positionStop)
                                }

                            }
                        });
                    }

                } else if (req.type == 'online') {
                    var onlineData = {
                        editid: req.editId,
                        jobpositionnumber: req.id
                    };
                    positionReIssuePost();
                    function positionReIssuePost() {
                        $.ajax({
                            url: 'https://jobads.zhaopin.com/Position/PositionReIssuePost',
                            data: onlineData,
                            type: 'post',
                            dataType: 'json',
                            success: function (res,textStatus,conText) {
                                if(conText.status==200){
                                    console.log('上线成功');
                                    removeCookie();
                                }else {
                                    positionStop(positionReIssuePost);
                                }

                            }
                        });
                    }

                } else if (req.type == 'delete') {
                    positionDelete();
                    function positionDelete() {
                        $.ajax({
                            url: 'https://jobads.zhaopin.com/Position/PositionDelete',
                            data: 'positionNumbers=' + req.id,
                            type: 'post',
                            dataType: 'json',
                            success: function (res,textStatus,conText) {
                                if(conText.status==200){
                                    console.log('删除成功');
                                    removeCookie();
                                }else {
                                    positionStop(positionDelete);
                                }

                            }

                        });
                    }

                }
            }
            function cookieOverdueOper(foo) {
                if(typeof foo=='function'){
                    $.get(getCookie, function (cookieRes) {
                        if (cookieRes.code == 200) {
                            cookieData.set(cookieRes.cookie);
                            zlCookie = cookieRes.cookie;
                            compUserId = cookieRes.compUserId;
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_cookie',
                                'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            chrome.cookies.set({
                                'url': 'http://' + currHost,
                                'name': 'zl_compUserId',
                                'value': cookieRes.compUserId,
                                'secure': false,
                                'httpOnly': false
                            }, function (cookie) {
                            });
                            setTimeout(function () {
                                foo();
                            }, 500);
                        }
                    });
                }
            }

        });
    }
    if (port.name == 'sendEmailAction') {
        port.onMessage.addListener(function (sendEmailRequest) {
            currHost = sendEmailRequest.host;
            var emailHtml = document.createElement('div');
            emailHtml.id = 'emailHtml';
            var reqObj = JSON.parse(sendEmailRequest.data);


            if (sendEmailRequest.isGetCookie) {
                var cookieText = (sendEmailRequest.zlCookie).split('DOUNINE').join(';');
                cookieData.set(cookieText);
                zlCookie = cookieText;
                setTimeout(function () {
                    sendEmail();
                }, 500);
            } else {
                console.log('无本地cookie');
                $.get(getCookie, function (cookieRes) {
                    if (cookieRes.code == 200) {
                        cookieData.set(cookieRes.cookie);
                        zlCookie = cookieRes.cookie;
                        chrome.cookies.set({
                            'url': 'http://' + currHost,
                            'name': 'zl_cookie',
                            'value': (cookieRes.cookie).split(';').join('DOUNINE'),
                            'secure': false,
                            'httpOnly': false
                        }, function (cookie) {
                        });
                        chrome.cookies.set({
                            'url': 'http://' + currHost,
                            'name': 'zl_compUserId',
                            'value': cookieRes.compUserId,
                            'secure': false,
                            'httpOnly': false
                        }, function (cookie) {
                        });
                        setTimeout(function () {
                            sendEmail()
                        }, 500);

                    }
                });
            }


            function sendEmail() {

                // var resumeUrl = 'https://rd.zhaopin.com/resumepreview/resume/viewone/1/7075325058?resume=7075325058&star=&companyid=16073821&pfd=3_201';
                // var aa ={"start_date":"2017-10-23","time":"11:00","place":"asdasda","linkPeson":"sdasdas","tel_type":0,"tel_num":"18531654654","remarks":["1","2","4","3"],"note":"dasdasdas","startGetDate":"2017-10-23","date_type":1,"contract_time":"11","fkt_zlb":0,"fkt_status":2}
                var resumeUrl = 'https://rd.zhaopin.com/resumepreview/resume/viewone/1/' + reqObj.fkt_guid + 'resume=' + reqObj.fkt_guid + '&star=&companyid=' + reqObj.candid + '&pfd=3_201';
                $.ajax({
                    url: resumeUrl,
                    type: 'GET',
                    success: function (resume) {
                        $(emailHtml).html(resume);
                        var resumeData = {
                            posiId: $(emailHtml).find('#positionid').val(),
                            candId: $(emailHtml).find('#resumeUserId').val(),
                            resnum: $(emailHtml).find('#extId').val(),
                            posiNum: $(emailHtml).find('#PositionNumber').val(),
                            resuid: $(emailHtml).find('#resume_id').val()
                        };
                        var fktlookData = {
                            oldstatus: 1,
                            status: 2,
                            guid: reqObj.zlresumeId
                        };
                        $.ajax({
                            url: 'https://rd.zhaopin.com/resumePreview/resume/_FktLook',
                            type: 'POST',
                            data: fktlookData,
                            success: function (res) {

                            }
                        });
                        var data = {
                            start_date: reqObj.start_date,
                            startGetDate: reqObj.startGetDate,
                            date_type: reqObj.date_type,    //1：上午；2：下午
                            contract_time: reqObj.contract_time,
                            place: reqObj.place, //面试地点
                            linkPeson: reqObj.linkPeson,        //hr姓名
                            tel_type: reqObj.tel_type,  //0:手机，1：座机
                            tel_num: reqObj.tel_num,    //hr电话
                            remarks: '3', //备注 1、携带请携带简历；2、请带笔纸，3、请带作品，4：请着正装
                            posiid: resumeData.posiId,
                            posinum: resumeData.posiNum,//职位id
                            candid: resumeData.candId,
                            resuid: resumeData.resuid,
                            resnum: resumeData.resnum,
                            fkt_guid: reqObj.zlresumeId,//简历id
                            fkt_zlb: 0, //写死
                            fkt_status: 2,//写死
                            areaCode: reqObj.areaCode ? reqObj.areaCode : '区号',
                            landlineCode: reqObj.landlineCode ? reqObj.landlineCode : '座机号',
                            extenCode: reqObj.landlineCode ? reqObj.landlineCode : '分机号',
                        };
                        setTimeout(function () {
                            $.ajax({
                                url: 'https://rd.zhaopin.com/resumepreview/resume/_fktoksubmit',
                                type: 'POST',
                                data: data,
                                success: function (res) {
                                    if (res.Code == 200) {
                                        port.postMessage('已发送邀约')
                                        $.get(sendStatus, function (response) {

                                        });
                                    }
                                },
                                error: function (err) {
                                    console.log(err);
                                }
                            });
                        }, 2000)

                    },
                    error: function (err) {

                    }
                })


                // var fktlookData={
                //     oldstatus:1,
                //     status:2,
                //     guid:'7052233103'
                // };
                // $.ajax({
                //     url:'https://rd.zhaopin.com/resumePreview/resume/_FktLook',
                //     type:'POST',
                //     data:fktlookData,
                //     success:function (res) {
                //
                //     }
                // });
                //
                // var data={
                //     start_date:'2017-10-17',
                //     startGetDate:'2017-10-17',
                //     date_type:2,    //1：上午；2：下午
                //     contract_time:'17.5',
                //     place:'深圳市南山区科技园', //面试地点
                //     linkPeson:'张小炮',        //hr姓名
                //     tel_type:0,  //0:手机，1：座机
                //     tel_num:'13926540967',    //hr电话
                //     remarks:'3', //备注 1、携带请携带简历；2、请带笔纸，3、请带作品，4：请着正装
                //     posiid:'31332923412',
                //     posinum:'CC160738218J90250499000',//职位id
                //     candid:'112492582',
                //     resuid:'205031159',
                //     resnum:'GyjYAzk8A97RVxuMY(qS0g',
                //     fkt_guid:'7052233103',//简历id
                //     fkt_zlb:0, //写死
                //     fkt_status:2,//写死
                //     areaCode:'区号',
                //     landlineCode:'座机号',
                //     extenCode:'分机号',
                // };
                // $.ajax({
                //     url:'https://rd.zhaopin.com/resumepreview/resume/_fktoksubmit',
                //     type:'POST',
                //     data:data,
                //     success:function (res) {
                //        if(res.Code==200){
                //             $.get(sendStatus,function (response) {
                //
                //             });
                //        }
                //     },
                //     error:function (err) {
                //         console.log(err);
                //     }
                // });
                //
            }


        });
    }

    var cityTool = {
        getcityId: function (cityVal) {//匹配城市id
            var cityArr = cityVal.split('|');
            var cityIdArr = [];
            var provinceIdArr = [];
            if (cityArr.length > 1) {  //多城市
                var cityId;
                for (var i in cityArr) {
                    if (cityArr[i].indexOf('@') != -1) {
                        cityId = cityArr[i].split('@')[0];
                    } else {
                        cityId = cityArr[i]
                    }
                    if (cityIdArr.indexOf(cityId) == -1) {
                        cityIdArr.push(cityId)
                    }
                }
                province(zl_citylist);
                function province(citylist) {  //便利查找省级id
                    for (var j in citylist) {
                        for (var k in cityIdArr) {
                            var provinceId;
                            if (cityIdArr[k] == citylist[j].id) {
                                if (citylist[j].id + '0' == citylist[j].superId) {//判断直辖市  直辖市superId多个'0'
                                    provinceId = citylist[j].id;
                                } else {
                                    provinceId = citylist[j].superId;
                                }
                                if (provinceIdArr.indexOf(provinceId) == -1) {
                                    provinceIdArr.push(provinceId);
                                }
                            } else {
                                province(citylist[j].childList);
                            }
                        }
                    }
                }
            } else {		//单个城市
                if (cityArr[0].indexOf('@') == -1) {  //市级id
                    provinceIdArr.push(cityArr[0]);
                } else {
                    provinceIdArr.push(cityArr[0].split('@')[1]);  //区级id
                }

            }
            return provinceIdArr[0];
        },
        getName: function (cityVal) {
            if (cityVal) {
                var cityName;
                for (var i in zl_citylist) {
                    if (zl_citylist[i].id == cityVal) {
                        cityName = zl_citylist[i].value;
                    } else {
                        var _citylist = zl_citylist[i].childList;
                        for (var j in _citylist) {
                            if (_citylist[j].id == cityVal) {
                                cityName = zl_citylist[i].value + '-' + _citylist[j].value
                            } else {
                                var _district = _citylist[j].childList
                                for (var k in _district) {
                                    if (_district[k].id == cityVal) {
                                        cityName = zl_citylist[i].value + '-' + _citylist[j].value + '-' + _district[k].value
                                    }
                                }
                            }
                        }
                    }
                }

                var allProvince = "广东 湖北 陕西 四川 辽宁 吉林 江苏 山东 浙江 广西 安徽 河北 山西 内蒙古 黑龙江 福建 江西 河南 湖南 海南 贵州 云南 西藏 甘肃 青海 宁夏 新疆 ";
                cityName = cityName.split('-');

                if (allProvince.indexOf(cityName[0]) != -1) {
                    cityName.shift();
                }
                cityName[0] = cityName[0] + "市";

                return cityName.join(' ');
            }

        }
    };

});

//设置Referer
var editId = 'CC455380318J90250226000';
chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.type === 'xmlhttprequest') {
            var exists = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    exists = true;
                    details.requestHeaders[i].value = 'https://jobads.zhaopin.com/Position/PositionModify/' + editId;
                    break;
                }
            }
            // https://jobads.zhaopin.com/Position/PositionManageStatus
            if (!exists) {
                details.requestHeaders.push({
                    name: 'Referer',
                    value: 'https://jobads.zhaopin.com/Position/PositionModify/' + editId
                });
            }
            return {requestHeaders: details.requestHeaders};
        }
    },
    {urls: ['https://jobads.zhaopin.com/Position/PositionModify']},
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.type === 'xmlhttprequest') {
            var exists = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    exists = true;
                    details.requestHeaders[i].value = 'https://jobads.zhaopin.com/Position/PositionReIssuePost';
                    break;
                }
            }
            // https://jobads.zhaopin.com/Position/PositionManageStatus
            if (!exists) {
                details.requestHeaders.push({
                    name: 'Referer',
                    value: 'https://jobads.zhaopin.com/Position/PositionReIssuePost'
                });
            }

            return {requestHeaders: details.requestHeaders};
        }
    },
    {urls: ['https://jobads.zhaopin.com/Position/PositionReIssuePost']},
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.type === 'xmlhttprequest') {
            var exists = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    exists = true;
                    details.requestHeaders[i].value = 'https://jobads.zhaopin.com/Position/PositionManage';
                    break;
                }
            }
            // https://jobads.zhaopin.com/Position/PositionManageStatus
            if (!exists) {
                details.requestHeaders.push({
                    name: 'Referer',
                    value: 'https://jobads.zhaopin.com/Position/PositionManage'
                });
            }

            return {requestHeaders: details.requestHeaders};
        }
    },
    {urls: ['https://jobads.zhaopin.com/Position/PositionManageStatus', 'https://jobads.zhaopin.com/Position/PositionAdd', 'https://jobads.zhaopin.com/Position/PositionStop']},
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        if (details.type === 'xmlhttprequest') {
            var exists = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    exists = true;
                    details.requestHeaders[i].value = 'https://rd2.zhaopin.com/rdapply/resumes/apply/position?SF_1_1_46=0&SF_1_1_44=286017892&JobTitle=web%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88&JobStatus=3&IsInvited=0&jobNum=CC160738218J90250499000';
                    break;
                }
                if (details.requestHeaders[i].name === 'Cookie') {
                    existsCookie = true;
                    details.requestHeaders[i].value = zlCookie;
                }
            }
            // https://jobads.zhaopin.com/Position/PositionManageStatus
            if (!exists) {
                details.requestHeaders.push({
                    name: 'Referer',
                    value: 'https://rd2.zhaopin.com/rdapply/resumes/apply/position?SF_1_1_46=0&SF_1_1_44=286017892&JobTitle=web%E5%89%8D%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88&JobStatus=3&IsInvited=0&jobNum=CC160738218J90250499000'
                });
            }

            return {requestHeaders: details.requestHeaders};
        }
    },
    {urls: ['https://rd.zhaopin.com/resumepreview/resume/viewone/1/*', 'https://jobads.zhaopin.com/Position/PositionModify/*']},
    ["blocking", "requestHeaders"]
);



