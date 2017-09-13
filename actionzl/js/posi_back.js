var cookieText = 'editiontype=v3; welfaretab=10000%7c10002%7c10006%7c10010%7c10013%7c10014%7c10020%7c10021; JSShowname=; xychkcontr=43131452%2c0; urlfrom=121113803; urlfrom2=121113803; adfcid=pzzhubiaoti1; adfcid2=pzzhubiaoti1; adfbid=0; adfbid2=0; dywez=95841923.1505199751.8.4.dywecsr=zhaopin.com|dyweccn=(referral)|dywecmd=referral|dywectr=undefined|dywecct=/; __xsptplus30=30.3.1505199750.1505199750.1%234%7C%7C%7C%7C%7C%23%23vi5rfjludsTpfPW4K3eAbOpbcKQijC5d%23; pcc=r=1431757493&t=0; __zpWAM=1504668293271.399633.1504752268.1505199759.5; __zpWAMs2=1; JsOrglogin=607772717; at=680af3ffc06642b59b16c7ec53af2f21; Token=680af3ffc06642b59b16c7ec53af2f21; rt=4c2916cc75ed45ac81dbf84ff093ebfd; uiioit=213671340F69476B5D6A5A7941644A7406350D3259755E6D51683B742073493606340069416B5B6A51794264407407350F328; lastchannelurl=https%3A//passport.zhaopin.com/org/login; __utma=269921210.700443274.1504599171.1504752268.1505199751.7; __utmc=269921210; __utmz=269921210.1505199751.7.6.utmcsr=zhaopin.com|utmccn=(referral)|utmcmd=referral|utmcct=/; __utmv=269921210.|2=Member=651636024=1; RDpUserInfo=; JsNewlogin=202590905; NewPinLoginInfo=; cgmark=2; utype=202590905; ihrtkn=; NewPinUserInfo=; isNewUser=1; LoginCity=739; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1504509168,1504513458,1504597527,1504668278; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1505203193; RDsUserInfo=36672168546B59754177577142654E7155635E6558695E6B4E713B653F7758774265516751685F6B52754777567146650171106316650169506B207139654C773319663608F30000526B25753F7758714C65357121635A655B69596B4171416548775377426552675E682B6B25754C77331F60361CE5000B691FC93B6335FE3FD637781035E152E89829093991385075257728714A654C7120632A655569586B44714065457755774765536756685B6B2B7500771471596514710A630A655369386B21714A6543775E77306537675868506B4675407757715765467153635D655969506B317133654C775677436557675368506B5D75427754714C6533712B635A653E077C381EE5120D7F0DC425793BE829C43A600C3BE352FA9E3F1B348F225E632B652569566B45714765417754774A6520672168546B5C7542775C714C65367129635A655869506B207136654C775E773265226758682A6B287542775771436541715C6351655B695A6B44714C65357724774C65206726685A6B5975457753714E654171566356655969506B317134654C7755774A6530672C68546B58754A772C7127654A71576353655A69456B4471466545775E77246537675868586B5B7540775E711; dywea=95841923.2606911612629862400.1504599171.1504749111.1505199751.8; dywec=95841923; dyweb=95841923.79.5.1505202986623';
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
        'url':'https://rd.zhaopin.com',
        'name':cookieName,
        'value':cooKieVal,
        'secure':false,
        'httpOnly':false
    }, function(cookie){
    });
// //设置cookie
//     chrome.cookies.set({
//         'url':'https://rd2.zhaopin.com',
//         'name':cookieName,
//         'value':cooKieVal,
//         'secure':false,
//         'httpOnly':false
//     }, function(cookie){
//     });

    //设置cookie
    chrome.cookies.set({
        'url':'https://jobads.zhaopin.com',
        'name':cookieName,
        'value':cooKieVal,
        'secure':false,
        'httpOnly':false
    }, function(cookie){
    });
    //设置cookie
    chrome.cookies.set({
        'url':'https://rd2.zhaopin.com',
        'name':cookieName,
        'value':cooKieVal,
        'secure':false,
        'httpOnly':false
    }, function(cookie){
    });
};

var positionHtml = document.createElement('div');
positionHtml.id = 'positionHtml';

var online = {  //在线中职位
    pagesize:100,
    pageindex:1,
    status:3,
    jobpositionType:0,
    orderByType:1,
    orderBy:2
},unline={  //未上线职位
    pagesize:100,
    pageindex:1,
    status:1,
    jobpositionType:0,
    orderByType:1,
    orderBy:4
},downline={  //已下线职位
    pagesize:100,
    pageindex:1,
    status:4,
    jobpositionType:0,
    orderByType:1,
    orderBy:3,
    substatus:0
},inaudit={   //审核中职位
    pagesize:100,
    pageindex:1,
    status:2,
    jobpositionType:0,
    orderByType:1,
    orderBy:2
},unaudit={   //未通过中职位
    pagesize:100,
    pageindex:1,
    status:6,
    jobpositionType:0,
    orderByType:1,
    orderBy:2
}

chrome.extension.onConnect.addListener(function (port) {
    if (port.name=='posiAction'){
         port.onMessage.addListener(function (request) {
             console.log(request)
             var positionManage=online;
             function getPositionList() {
                console.log('当前状态：',positionManage)
                $.ajax({
                    url:'https://jobads.zhaopin.com/Position/PositionManageStatus',
                    data:positionManage,
                    type:'POST',
                    headers:{'X-Requested-With':'XMLHttpRequest','Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
                    success:function (positionRes) {
                        positionHtml.innerHTML = positionRes;
                        console.log(positionHtml)
                        //职位列表数组
                        var positionsListArr=[];
                        var positionsDetailArr=[];
                        var pageCount = $(positionHtml).find('#pageCount').val(); //总页数
                        var pageIndex = $(positionHtml).find('#pageIndex').val(); //当前页
                        $.each($(positionHtml).find('.tableBody td span.checkbox'),function (index,item) {
                            positionsListArr.push($(item).data('value'));
                        });
                        console.log(positionsListArr);
                        if(positionsListArr.length>0){
                            var positionIndex=0;
                            function getPositionDetail() {
                                console.log(positionIndex);
                                $.ajax({
                                    url:'https://jobads.zhaopin.com/Position/PositionPreview/'+positionsListArr[positionIndex],
                                    type:'GET',
                                    success:function (positionDetailRes) {
                                        if(positionIndex==positionsListArr.length){
                                            clearInterval(positionTime);
                                            console.log(positionsDetailArr);
                                            if(pageCount==pageIndex){
                                                console.log('该类型职位完毕');
                                                var currStatus = positionManage.status;  //判断当前状态
                                                if(currStatus==3){
                                                    positionManage = unline;
                                                    getPositionList();
                                                }else if(currStatus==1){
                                                    positionManage = downline;
                                                    getPositionList();
                                                }else if(currStatus==4){
                                                    positionManage = inaudit
                                                    getPositionList();
                                                }else if(currStatus==2){
                                                    positionManage=unaudit
                                                    getPositionList();
                                                }else {
                                                    console.log('职位完毕');
                                                    return
                                                }
                                            }else {
                                                positionManage.pageindex = pageIndex+1;
                                                console.log(pageCount,'该页完毕')
                                                getPositionList()
                                            }
                                        }else {
                                            positionsDetailArr.push(positionDetailRes);
                                            positionIndex++
                                        }
                                    },
                                    error:function (err) {
                                        console.log(err)
                                    }
                                });
                            };
                            var positionTime = setInterval(function () {
                                getPositionDetail()
                            },3000)
                        }else {
                            var currStatus = positionManage.status
                            if(currStatus==3){
                                positionManage = unline;
                                getPositionList();
                            }else if(currStatus==1){
                                positionManage = downline;
                                getPositionList();
                            }else if(currStatus==4){
                                positionManage = inaudit
                                getPositionList();
                            }else if(currStatus==2){
                                positionManage=unaudit;
                                getPositionList();
                            }else {
                                console.log('职位完毕');
                                return
                            }
                        }
                    },
                    error:function (err) {
                        console.log(err)
                    }
                });
            }
             getPositionList()

         })
    }
    if(port.name=='addposiAction'){
        port.onMessage.addListener(function (request) {
            console.log(request);
                $.ajax({
                    url:'https://jobads.zhaopin.com/Position/PositionAdd',
                    data:request.addPosi,
                    type:'post',
                    dataType:'json',
                    success:function (res) {
                        port.postMessage(res)
                    }
                })

        })
    }
    if(port.name=='delposiAction'){
        port.onMessage.addListener(function (request) {
            console.log(request);
            if(request.code==200){
                $.ajax({
                    url:'https://jobads.zhaopin.com/Position/PositionDelete',
                    data:request.data,
                    type:'post',
                    dataType:'json',
                    success:function (res) {
                        port.postMessage(res)
                    },
                    error:function (err) {
                        port.postMessage(err)
                    }
                })
            }


        })
    }
    if(port.name=='unlineposiAction'){
        port.onMessage.addListener(function (request) {
            if(request.code==200){
                $.ajax({
                    url:'https://jobads.zhaopin.com/Position/PositionStop',
                    data:request.data,
                    type:'post',
                    dataType:'json',
                    success:function (res) {
                        port.postMessage(res)
                    },
                    error:function (err) {
                        port.postMessage(err)
                    }
                })
            }

        })
    }
    if(port.name=='onlineposiAction'){
        port.onMessage.addListener(function (request) {
            if(request.code==200){
                console.log(request);
                for(var i=0;i<request.data.list.length;i++){
                    console.log(request.data.list[i])
                    $.ajax({
                        url:'https://jobads.zhaopin.com/Position/PositionReIssuePost',
                        data:request.data.list[i],
                        type:'post',
                        dataType:'json',
                        success:function (res) {
                            port.postMessage(res)
                        },
                    })
                }
                // $.ajax({
                //     url:'https://jobads.zhaopin.com/Position/PositionReIssuePost',
                //     data:request.data,
                //     type:'post',
                //     dataType:'json',
                //     success:function (res) {
                //         port.postMessage(res)
                //     },
                // })
            }

        })
    }

    if(port.name=='editposiAction'){
        port.onMessage.addListener(function (request) {
            if(request.code==200){
                $.ajax({
                    url:'https://jobads.zhaopin.com/Position/PositionModify',
                    data:request.data,
                    type:'post',
                    dataType:'json',
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    },
                    success:function (res) {
                        port.postMessage(res)
                    },
                })
            }

        })
    }

    if(port.name=='resumeOnline'){
        port.onMessage.addListener(function (request) {
            $.post('https://rd2.zhaopin.com/rdapply/resumes/apply/search?SF_1_1_44=235384114&orderBy=CreateTime',request,function (res) {
                console.log(res)
                port.postMessage(res)
            })
        })
    }
    if(port.name=='getResumeDetail'){
        port.onMessage.addListener(function (request) {
            $.get('https://'+request,function (res) {
                port.postMessage(res)
            })
        })
    }
});
var editId = 'CC455380318J90250226000';
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.type === 'xmlhttprequest') {
            var exists = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'Referer') {
                    exists = true;
                    details.requestHeaders[i].value = 'https://jobads.zhaopin.com/Position/PositionModify/'+editId;
                    break;
                }
            }
            // https://jobads.zhaopin.com/Position/PositionManageStatus
            if (!exists) {
                details.requestHeaders.push({ name: 'Referer', value: 'https://jobads.zhaopin.com/Position/PositionModify/'+editId});
            }

            return { requestHeaders: details.requestHeaders };
        }
    },
    {urls: ['https://jobads.zhaopin.com/Position/PositionModify']},
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
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
                details.requestHeaders.push({ name: 'Referer', value: 'https://jobads.zhaopin.com/Position/PositionReIssuePost'});
            }

            return { requestHeaders: details.requestHeaders };
        }
    },
    {urls: ['https://jobads.zhaopin.com/Position/PositionReIssuePost']},
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
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
                details.requestHeaders.push({ name: 'Referer', value: 'https://jobads.zhaopin.com/Position/PositionManage'});
            }

            return { requestHeaders: details.requestHeaders };
        }
    },
    {urls: ['https://jobads.zhaopin.com/Position/PositionManageStatus','https://jobads.zhaopin.com/Position/PositionAdd','https://jobads.zhaopin.com/Position/PositionStop']},
    ["blocking", "requestHeaders"]
);

// var wR=chrome.webRequest||chrome.experimental.webRequest; //兼容17之前版本的chrome，若需要使用chrome.experimental，需要在 about:flags 中“启用“实验用。。API”
// if(wR){
//     wR.onBeforeSendHeaders.addListener(
//         function(details) {
//             if (details.type === 'xmlhttprequest') {
//                 var exists = false;
//                 console.log('details',details)
//                 for (var i = 0; i < details.requestHeaders.length; ++i) {
//                     if (details.requestHeaders[i].name === 'Referer') {
//                         exists = true;
//                         details.requestHeaders[i].value = 'https://jobads.zhaopin.com';
//                         break;
//                     }
//                 }
//                 if (!exists) {//不存在 Referer 就添加
//                     details.requestHeaders.push({ name: 'Referer', value: 'https://jobads.zhaopin.com'});
//                 }
//                 return { requestHeaders: details.requestHeaders };
//             }
//         },
//         {urls: ["https://jobads.zhaopin.com/Position/PositionReIssue"]},//匹配访问的目标url
//         ["blocking", "requestHeaders"]
//     );
// }