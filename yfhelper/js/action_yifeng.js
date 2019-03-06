/****************///图标
var curl = window.location.host;

var currIcon = chrome.runtime.connect({name: "currIcon"});//图标
var isNew = chrome.runtime.connect({name: "isNew"});//图标
currIcon.postMessage(curl);

var zlAction = chrome.runtime.connect({name: "zlAction"});//获取简历夹列表
var isActivity = chrome.runtime.connect({name: "isActivity"});//活动触发

var getPosiAction = chrome.runtime.connect({name: "getPosiAction"});//获取职位列表
var addPosiAction = chrome.runtime.connect({name: "addPosiAction"});//新增职位页面
// var editPosiAction = chrome.runtime.connect({name: "editPosiAction"});//编辑职位
var operPosiAction = chrome.runtime.connect({name: "operPosiAction"});//操作职位
var deliveryDetailAction = chrome.runtime.connect({name: "deliveryDetailAction"});//投递职位详情
var sendEmailAction = chrome.runtime.connect({name: "sendEmailAction"});
var getResumeListAction = chrome.runtime.connect({name: "getResumeListAction"});
var unOnlineAction = chrome.runtime.connect({name: "unOnlineAction"});//下线后发布

$.cookie('zl_version','v2.1');

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
                console.log(res);
            });
    //     }else {
    //         console.log("已在导出中！")
    //     }
    // });

});

$("#activityBtn").click(function () {
   console.log('活动准备');
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie,
        host:curl,
        isActivity:true
    };
    zlAction.postMessage(zlCookieData);
    zlAction.onMessage.addListener(function (res) {
        console.log(res);
    });
});

$("#webChange").click(function () {
    isNew.postMessage('isNew');
});

$("#updatePosition").click(function () {
    console.log('导出职位');
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie,
        host:curl,
        compUserId:$.cookie('zl_compUserId')

    };
    getPosiAction.postMessage(zlCookieData);
    getPosiAction.onMessage.addListener(function (res) {
        console.log(res);
    });
});
$("#addPosition").click(function () {
    console.log('新增职位');
    var addPositionData = $("#addPosition").val();
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie,
        host:curl,
        data:addPositionData
    };

    addPosiAction.postMessage(zlCookieData);
    addPosiAction.onMessage.addListener(function (res) {
        $("#zl-feedback-release").val(JSON.stringify(res)).click();
    });
});

// $("#editPosition").click(function () {
//     console.log('编辑职位');
//     var editJobId = {
//         jobId:$("#editPosition").val()
//     };
//     var zlCookie = $.cookie('zl_cookie');
//     var isCookie = zlCookie?1:0;
//     var zlCookieData = {
//         isGetCookie:isCookie,
//         zlCookie:zlCookie,
//         host:curl,
//         data:$("#editPosition").val()
//     };
//     editPosiAction.postMessage(zlCookieData);
// });

$("#operPosition").click(function () {
    console.log('操作职位');
    var operData=$("#operPosition").val();
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie,
        host:curl,
        data:operData
    };
    operPosiAction.postMessage(zlCookieData);

});
// RDsUserInfo
// 2265362C5866466550794D644665402C52664F65507941644C653E2C2B664A65117900644565472C53664465517940644E65432C066612655F79216439654F2C5E6639652A7949644C65302C21664A65567941644165412C506643655D7945644C65302C2B664A65BF2FA93975E69A5C9F38261E1E1F89E4613697716E1C7E0234EF18358F36492C31663A6559794F6432653F2C586643655379426444654A2C5666436553794D643765032C1466596507791B641A65492C36662365597945644C65332C31664A65557944645A65402C55665765557940644D65462C52664C65207930644A65402C506641655779416443654B2C54664C6520793A644A65A97AB83B75E68C098E3A261E084A98E6613681247F1E7E0222BA09378F365F7938643A654F2C55664765547945644C65312C21664A655C7944644665492C24663B65597944644C65272C24664A655F79376436654F2C26663465567941644165412C506643655D7945644465492C21663665597937643465402C506641655779416443654B2C546644655F79306434654F2C54664C6537793D644A65412C5E663E65347949644565462C57665965557945644465492C30662365597945644765432C5E665

$("#resumeDetail").click(function () {
   console.log('简历投递详情');
   var resumeLink = $("#resumeDetail").val();
    deliveryDetailAction.postMessage(resumeLink);
});
$("#sendEmail").click(function () {
   console.log('发送邀约邮箱');
   var emailData=$("#zlInviSendData").val();
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie,
        host:curl,
        data:emailData
    };
   sendEmailAction.postMessage(zlCookieData);
});
$("#getResumeList").click(function () {
   console.log('获取cookie');
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie,
        host:curl,
        compUserId:$.cookie('zl_compUserId')
    };
    getResumeListAction.postMessage(zlCookieData);
});
$("#unOnline").click(function () {
   console.log('下线发布');
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie,
        host:curl,
        data:$("#unOnline").val(),
        unlinePosi:true
    };
    addPosiAction.postMessage(zlCookieData);
    addPosiAction.onMessage.addListener(function (res) {
        $("#zl-feedback-release").val(JSON.stringify(res)).click();
    });
});



