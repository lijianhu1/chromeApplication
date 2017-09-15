String.prototype.format = function(opts) {//use 'my name is %{name}'.format({name:'huanghuanlai'})
    var source = this,
        data = Array.prototype.slice.call(arguments, 0),
        toString = Object.prototype.toString;
    if (data.length) {
        data = data.length == 1 ?
            (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) : data;
        return source.replace(/%\{(.+?)\}/g, function(match, key) {
            var replacer = data[key];
            // chrome 下 typeof /a/ == 'function'
            if ('[object Function]' == toString.call(replacer)) {
                replacer = replacer(key);
            }
            return ('undefined' == typeof replacer ? '' : replacer);
        });
    }
    return source;
}
/****************///图标
var curl = window.location.host;
var currIcon = chrome.runtime.connect({name: "currIcon"});//图标
currIcon.postMessage(curl);
/**************/

var port = chrome.runtime.connect({name: "zhilian"});//通道名称 :简历夹列表
var resumePort = chrome.runtime.connect({name: "getResume"});//通道名称  ：获取简历夹详情
var screenDetail = chrome.runtime.connect({name: "zlScreenDetail"});//简历详情 ：简历筛选详情
var folderList = chrome.runtime.connect({name: "zlResumeFolder"});//获取简历夹列表
var zlSetCookie = chrome.runtime.connect({name: "zlSetCookie"});//获取简历夹列表

var resumeTatal=0; //本次总导出简历分数
var folderId='';//文件夹id
var needExportNum=100;
var accountId = '';
//监听简历夹列表
var deliveryType;//投递类型  1：待处理  2：待沟通  3：已发出面试邀请  4：不合适

var screenFormData = {
    CurrentPageNum:1,
    SF_1_1_50:deliveryType,
    SF_1_1_51:'-1',
    PageType:'0',
    click_search_op_type:deliveryType,
    SF_1_1_52:'0',
    SF_1_1_49:'0',
    IsInvited:'0',
    'X-Requested-With':'XMLHttpRequest',
    PageList2:'',
};

var readyUrl = 'http://192.168.1.189:8082/resume/exportResumeReady',
    exportUrl = 'http://192.168.1.189:8083/resumeExport/resumeExport',
    updateExport='http://192.168.1.189:8082/resume/updateExportRecord';

function folderListFun(favoriteId,pageInd) {
    folderList.onMessage.addListener(function (resFolder) {
        console.log(resFolder)
        var zlListData = {
            favoriteId:'',
            isTemp:'n',
            resumeSourceId:'0',
            queryDateTime:'2016-08-17 15:07:09',
            pageIndex:pageInd?pageInd:1,
        }
        if(resFolder.Code==200){
            console.log(resFolder)
            var folderIndex = 0; //简历列表索引
            var resFolderLen = resFolder.Data.length;
            console.log(resFolder);

            function folderItemFun() {  //单个文件夹遍历
                if(resFolder.Data[folderIndex].LevelMark!=null){
                    console.log(resFolder.Data[folderIndex])
                    var id = resFolder.Data[folderIndex].Id;
                    folderId = favoriteId?favoriteId:id;
                    // folderId = id;
                    console.log(folderId)
                    zlListData.favoriteId = folderId;
                    var zlData={
                        curr:zlListData.pageIndex,
                        zlListData:$.param(zlListData)
                    }
                    console.log(zlData)
                    port.postMessage(zlData);//发送消息
                    portFun(folderIndex,resFolderLen,resFolder)
                }else {
                    if(folderIndex>resFolder.Data.length) return;
                    folderIndex+=1;
                    folderItemFun()
                }

            }
            folderItemFun()
        }
    });
}


function portFun(folderIndex,resFolderLen,resFolderData) {
    port.onMessage.addListener(function(response) {
        if(response.ResumeViewList.length>0){
            var pageCount = response.PageCount;  //总页数
            var zlListData = {   //简历夹列表请求数据
                favoriteId:folderId,   //简历夹ID
                isTemp:'n',
                resumeSourceId:'0',
                queryDateTime:'2016-08-17 15:07:09',
            }
            var currPage = response.currentPage;   //当前页数，原数据没有，自己添加的
            for (var ind=1;ind<=pageCount;ind++){
                if(currPage==ind){
                    zlListData.pageIndex = ind+1;
                    var resumeArr=[];
                    var zlData={
                        curr:ind+1,
                        zlListData:$.param(zlListData)
                    }
                    var resumeCount=0;
                    function resumeListFoo() {
                        console.log(resumeTatal)
                        if(resumeTatal>needExportNum){    //每次最多导出100份简历
                            clearInterval(resumeTime);
                            var resumeData={
                                source:3, // 2 前程、3智联  ----简历来源
                                s:1, //1 人才夹、2 收件箱
                                resumeDetailStr:resumeArr.join('AA&AA'),  //AA&AA用具分离每份简历的标识

                            }
                            var record = {
                                exportPage:currPage,  //第几页
                                talentFolderId:folderId,  //人才夹文件夹ID
                                id:accountId, //账户id
                                sourceFile:1, //1 人才夹、2 收件箱
                            }

                            console.log(record)
                            $.ajax({
                                url:exportUrl,
                                type:'POST',
                                async:false,
                                data:resumeData,
                                success:function (res) {
                                    console.log("当天提交")
                                    $.ajax({
                                        url:updateExport,
                                        type:'POST',
                                        data:record,
                                        success:function (allres) {
                                            console.log('当天导出完毕')
                                        }
                                    })
                                },
                                error:function (res) {
                                    console.log(res)
                                }
                            });
                            return
                        }
                        if(resumeCount==response.ResumeViewList.length) {  //导出分数与简历分数相等时请求到后台
                            port.postMessage(zlData);//发送消息
                            clearInterval(resumeTime);
                            var resumeData={
                                source:3, // 2 前程、3智联  ----简历来源
                                sourceFile:1, //1 人才夹、2 收件箱
                                resumeDetailStr:resumeArr.join('AA&AA'),
                            }
                            console.log("文件夹索引："+folderIndex);
                            console.log(resumeArr)
                            $.ajax({
                                url:exportUrl,
                                type:'POST',
                                async:false,
                                data:resumeData,
                                success:function (res) {
                                    console.log(res)
                                    var record = {
                                        deliveryType:1,
                                        exportPage:((folderIndex==resFolderLen-1)&&(currPage==pageCount))?(parseInt(currPage)+1):1,  //第几页
                                        talentFolderId:folderId,  //人才夹文件夹ID
                                        id:'', //账户id
                                        sourceFile:1
                                    }
                                    $.ajax({
                                        url:updateExport,
                                        type:'POST',
                                        async:false,
                                        data:record,
                                        success:function (allres) {
                                            if((folderIndex==resFolderLen-1)&&(currPage==pageCount)){
                                                screen.postMessage($.param(screenFormData));//发送消息
                                                return;
                                            }

                                        }
                                    });

                                },
                                error:function (res) {
                                    console.log(res)
                                }
                            });

                        }else {
                            var guidArr = response.ResumeViewList[resumeCount].Guid;
                            resumePort.postMessage({id:guidArr});//发送消息
                            resumeCount++;  //该页简历分数自加
                            resumeTatal+=1; //该次已导出总分数
                        }
                    }
                    var resumeTime= setInterval(function () {  //计时器，每2秒请求一次简历详情
                        resumeListFoo()
                    },2000)
                    resumePort.onMessage.addListener(function(response) {
                        if(response==''){
                            var resumeData={
                                source:3, // 2 前程、3智联  ----简历来源
                                sourceFile:1, //1 人才夹、2 收件箱
                                resumeDetailStr:resumeArr.join('AA&AA'),
                            };
                            var record = {
                                exportPage:currPage,  //第几页
                                talentFolderId:folderId,  //人才夹文件夹ID
                                id:accountId, //账户id
                                sourceFile:1, //1 人才夹、2 收件箱
                            }
                            $.ajax({
                                url:exportUrl,
                                type:'POST',
                                async:false,
                                data:resumeData,
                                success:function () {
                                    $.ajax({
                                        url:updateExport,
                                        type:'POST',
                                        data:record,
                                        success:function (allres) {
                                            console.log('打码了')
                                        }
                                    })
                                },
                                error:function (res) {
                                    console.log(res)
                                }
                            });
                            console.log(resumeArr)
                            clearInterval(resumeTime)
                        }else {
                            resumeArr.push(response);
                        }

                    });
                }
            }
        }else {
            console.log(folderIndex,resFolderData);
            folderIndex+=1;
            if(folderIndex>=resFolderData.Data.length){
                deliveryType = 1;
                screenFormData.SF_1_1_50 = deliveryType;
                screenFormData.click_search_op_type = deliveryType
                console.log(screenFormData)
                screen.postMessage($.param(screenFormData));//发送消息
                return;
            }else {
                if(resFolderData.Data[folderIndex].LevelMark!=null){
                    var nextid = resFolderData.Data[folderIndex].Id;
                    folderId = nextid
                    var zlListData = {
                        favoriteId:nextid,
                        isTemp:'n',
                        resumeSourceId:'0',
                        queryDateTime:'2016-08-17 15:07:09',
                        pageIndex:1,
                    }
                    var zlData={
                        curr:1,
                        zlListData:$.param(zlListData)
                    }
                    console.log(zlListData)
                    port.postMessage(zlData);//发送消息
                }
            }

        }
    });
}

var screen = chrome.runtime.connect({name: "zlScreen"});//简历筛选
$("#pending").on("click",function () {
    var zlCookie = $.cookie('zl_cookie');
    console.log(zlCookie);
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie
    }
    biginZl(zlCookieData,zlCookie)
});
function biginZl(zlCookieData,zlCookie) {
    console.log("开始")
    $.get(readyUrl,zlCookieData,function (response) {
        console.log(response)
        if(response.code==200){
            for (var index in response.accountList){
                console.log(response.accountList[index])
                if(response.accountList[index].accountType == "zl"){
                    accountId = response.accountList[index].accountId;//用户ID
                    needExportNum = response.accountList[index].exportCount //导出简历数
                    var item = response.accountList[index];
                    if(zlCookieData.isGetCookie==0){
                        $.cookie('zl_cookie', item.zlCookie,{ path: "/"});
                        console.log('无本地cookie')
                        zlSetCookie.postMessage({cookie:item.zlCookie});//发送消息  简历夹列表
                    }else {
                        zlSetCookie.postMessage({cookie:zlCookie});//发送消息  简历夹列表
                        console.log('有本地cookie',zlCookie)
                    }
                    console.log(item)
                    zlSetCookie.onMessage.addListener(function (res) {
                        if(item.sourceFile=="0"){ //1:人才夹  2：投递  0：还未开始导出
                            console.log('sourceFile=0')
                            folderList.postMessage('0');
                            folderListFun()
                        }else if(item.sourceFile=="1"){
                            console.log('sourceFile=1')
                            folderList.postMessage('1');
                            console.log(item.folderId,item.exportPage)
                            folderListFun(item.folderId,item.exportPage)
                        }else if(item.sourceFile=="2"){
                            console.log('sourceFile=2')
                            deliveryType = item.deliveryType;
                            screenFormData.SF_1_1_50 = deliveryType;
                            screenFormData.click_search_op_type = deliveryType;
                            screenFormData.CurrentPageNum = item.exportPage
                            screen.postMessage($.param(screenFormData));//发送消息
                        }else {
                            console.log('sourceFile=else')
                        }
                    });
                }
            }
        }
    })
}

screen.onMessage.addListener(function(response) {
    // $("#yifengPlug").html(response);
    document.getElementById('yifengPlug').innerHTML = response

    if($(response).find('#zpResumeListTable').length>0){
        getScreenResumeDetail()
    }else {
        if(deliveryType<4){  //投递类型递增
            deliveryType+=1;
            var deliveryFormData={
                CurrentPageNum:'1',
                SF_1_1_50:deliveryType,
                SF_1_1_51:'-1',
                PageType:'0',
                click_search_op_type:deliveryType,
                SF_1_1_52:'0',
                SF_1_1_49:'0',
                IsInvited:'0',
                'X-Requested-With':'XMLHttpRequest',
                PageList2:'',
            };
            screen.postMessage($.param(deliveryFormData));//发送消息
        }else {
            console.log('deliveryType',deliveryType)
            var recordData = {
                deliveryType:deliveryType,
                isExportComplete:1 //是否全部导出完毕
            }
            $.ajax({
                url:updateExport,
                type:'POST',
                data:recordData,
                async:false,
                success:function (allres) {
                    console.log('简历投递导出完毕')
                }
            })
        }
    }

    var resumeArr = [];
    screenDetail.onMessage.addListener(function(res) {
        resumeArr.push(res);
    });
    function getScreenResumeDetail() {
        var screenDetailList=[]
        $.each($("td .link"),function (index,item) {
            var ahref = $(item).attr('href').split('//')[1];   //根据a标签获取详情连接地址
            screenDetailList.push(ahref)
        })
        var screenCount=0;
        var pages = $(".turnpageCon span.red12px").text();
        var currPage = pages.split('/')[0];  //当前页
        var totalPage = pages.split('/')[1]; //总页数
        function screenResumeDetail() {
            if(screenCount==screenDetailList.length){
                var resumeData={
                    source:3, // 2 前程、3智联  ----简历来源
                    sourceFile:2,//1:人才夹，2：收件箱
                    resumeDetailStr:resumeArr.join('AA&AA'),
                };
                console.log(resumeArr);
                console.log("当前类型："+deliveryType,"当前页数："+currPage,"总页数："+totalPage)
                $.ajax({
                    url:exportUrl,
                    type:'POST',
                    async:false,
                    data:resumeData,
                    success:function (res) {
                        var recordData = {
                            deliveryType:deliveryType,
                            exportPage:parseInt(currPage)+1, //第几页
                            sourceFile:2,
                            id:accountId
                        }
                        $.ajax({
                            url:updateExport,
                            type:'POST',
                            data:recordData,
                            async:false,
                            success:function (updateExportRes) {
                                console.log(updateExportRes)
                            }
                        })
                    },
                    error:function (res) {
                        console.log(res)
                    }
                });
                clearInterval(screenTime);
                if(currPage==totalPage ){
                    if(deliveryType<4){
                        deliveryType+=1;
                        var deliveryFormData={
                            CurrentPageNum:'1',
                            SF_1_1_50:deliveryType,
                            SF_1_1_51:'-1',
                            PageType:'0',
                            click_search_op_type:deliveryType,
                            SF_1_1_52:'0',
                            SF_1_1_49:'0',
                            IsInvited:'0',
                            'X-Requested-With':'XMLHttpRequest',
                            PageList2:'',
                        };
                        console.log(deliveryType)
                        screen.postMessage($.param(deliveryFormData));//发送消息
                    }else {
                        var recordData = {
                            deliveryType:deliveryType,
                            exportPage:1, //第几页
                            sourceFile:2,
                            id:accountId
                        }
                        $.ajax({
                            url:updateExport,
                            type:'POST',
                            data:recordData,
                            async:false,
                            success:function (allres) {
                                console.log('简历投递导出完毕');
                                return;
                            }
                        })
                    }
                }else if(currPage<totalPage){
                    var deliveryFormData={
                        CurrentPageNum:++currPage,
                        SF_1_1_50:deliveryType,
                        SF_1_1_51:'-1',
                        PageType:'0',
                        click_search_op_type:deliveryType,
                        SF_1_1_52:'0',
                        SF_1_1_49:'0',
                        IsInvited:'0',
                        'X-Requested-With':'XMLHttpRequest',
                        PageList2:'',
                    };
                    screen.postMessage($.param(deliveryFormData));//发送消息
                }
            }else {
                if(resumeTatal>needExportNum){
                    var resumeData={
                        source:3, // 2 前程、3智联  ----简历来源
                        sourceFile:2,//1:人才夹，2：收件箱
                        resumeDetailStr:resumeArr.join('AA&AA'),
                    }
                    var recordData={
                        deliveryType:deliveryType,
                        exportPage:currPage, //第几页
                        id:accountId,
                        sourceFile:2
                    }
                    $.ajax({
                        url:exportUrl,
                        type:'POST',
                        async:false,
                        data:resumeData,
                        success:function (res) {
                            $.ajax({
                                url:updateExport,
                                type:'POST',
                                data:recordData,
                                async:false,
                                success:function (allres) {
                                    console.log('当天导出完毕')
                                }
                            })
                        },
                        error:function (res) {
                            console.log(res)
                        }
                    });
                    return;
                }else {
                    screenDetail.postMessage(screenDetailList[screenCount]);//发送消息
                    screenCount++;
                    resumeTatal+=1;
                    console.log(screenCount)
                }

            }
        };
        var screenTime=setInterval(function () {
            screenResumeDetail();
        },1500);
    }
});

$("#plugBtn").click(function () {
    var zlCookie = $.cookie('zl_cookie');
    console.log(zlCookie);
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie
    }
    biginZl(zlCookieData,zlCookie)
});


var zlAction = chrome.runtime.connect({name: "zlAction"});//获取简历夹列表
$("#screenDetail").click(function () {
    console.log('开始')
    var zlCookie = $.cookie('zl_cookie');
    var isCookie = zlCookie?1:0;
    var zlCookieData = {
        isGetCookie:isCookie,
        zlCookie:zlCookie
    }
    zlAction.postMessage(zlCookieData);
    zlAction.onMessage.addListener(function (res) {
        console.log(res)
    });
});

var posiAction = chrome.runtime.connect({name: "posiAction"});//获取职位列表
var addposiAction = chrome.runtime.connect({name: "addposiAction"});//获取新增职位页面
var delposiAction = chrome.runtime.connect({name: "delposiAction"});//删除职位
var unlineposiAction = chrome.runtime.connect({name: "unlineposiAction"});//下线职位
var onlineposiAction = chrome.runtime.connect({name: "onlineposiAction"});//上线职位
var editposiAction = chrome.runtime.connect({name: "editposiAction"});//编辑职位
$("#getPosi").click(function () {
    console.log('测试开始');
    posiAction.postMessage('智联职位');
});

$("#addPosi").click(function () {
    console.log('获取新增前端职位');
    var badTitle = addPosiFormData.JobTitle;
    var badDesc = addPosiFormData.JobDescription+addPosiFormData.editorValue;
    var badWordStr = badTitle + badDesc;
    var data ={
        message:encodeURIComponent(badWordStr),
        addPosi:$.param(addPosiFormData)
        // addPosi:'LoginPointId=15380991&PublicPoints=0&HavePermissionToPubPosition=True&TemplateId=&EmploymentType=2&IsJyywl=true&JobTitle=web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%B7%A5%E7%A8%8B%E5%B8%88&JobTypeMain=160000&SubJobTypeMain=864&JobTypeMinor=&SubJobTypeMinor=&Quantity=1&EducationLevel=4&WorkYears=103&MonthlyPay=0800110000&JobDescription=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E7%E3%80%81%E7%86%9F%E7%BB%83%E5%88%87%E5%9B%BE%EF%BC%8C%E5%B0%86UI%E8%AE%BE%E8%AE%A1%E8%BD%AC%E5%8C%96%E4%B8%BA%E7%AC%A6%E5%90%88W3C%E8%A7%84%E8%8C%83%E7%9A%84DIV%2BCSS%E9%9D%99%E6%80%81%E9%A1%B5%E9%9D%A2%EF%BC%8C%E7%A1%AE%E4%BF%9D%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%8A%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%80%A7%E8%83%BD%E5%92%8C%E5%85%BC%E5%AE%B9%E6%80%A7%3C%2Fp%3E%3Cp%3E8%E3%80%81%E6%9C%89%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6%E6%9E%84%E5%BB%BA%EF%BC%8C%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9B%A2%E9%98%9F%E5%B7%A5%E4%BD%9C%E7%BB%84%E7%BB%87%E3%80%81%E7%AE%A1%E7%90%86%E5%B7%A5%E4%BD%9C%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E9%E3%80%81%E4%BA%86%E8%A7%A3JQuery+%2CEasyUI%E3%80%81ExtJS%E3%80%81Bootstrap%E3%80%81Angular.js%E7%AD%89%E6%A1%86%E6%9E%B6%E3%80%81%E6%9C%89%E7%BE%8E%E5%B7%A5%E8%AE%BE%E8%AE%A1%E7%BB%8F%E9%AA%8C%E8%80%85%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E10%E3%80%81%E6%9C%89%E5%A4%A7%E5%9E%8B%E7%B3%BB%E7%BB%9F%E3%80%81%E9%97%A8%E6%88%B7%E5%BC%80%E5%8F%91%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E&welfaretab=10000%2C10002%2C10006%2C10010%2C10013%2C10014%2C10020%2C10021&CanPubPositionQty=0&PositionPubPlace=765%402041&ContractCityList=&PositionPubPlaceInitCityId=&WorkAddress=%E5%8D%8E%E7%BE%8E%E5%B1%85&WorkAddressCoordinate=0%2C0&CompanyAddress=%E6%80%BB%E9%83%A8%E9%9D%A2%E8%AF%95%E5%9C%B0%E5%9D%80-%E7%9C%81%E4%BD%93%E8%82%B2%E5%9C%BA%E4%B8%9C%E9%97%A8%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E5%A4%A7%E5%8E%A65%E6%A5%BC(%E7%9C%81%E4%BD%93%E8%82%B2%E5%9C%BA%E7%AB%99%E4%B8%8B%E8%BD%A6%E5%8D%B3%E5%88%B0%EF%BC%8C%E4%BA%94%E7%8E%AF%E4%BD%93%E8%82%B25%E6%A5%BC)&DateEnd=2017-10-06&ApplicationMethod=1&EmailList=&ApplicationMethodOptionsList=1%2C2&ESUrl=&IsCorpUser=False&IsShowRootCompanyIntro=True&IsShowSubCompanyIntro=False&DepartmentId=15380991&FilterId=&PositionApplyReply=-1&JobNo=&SeqNumber=&btnAddClick=saveandpub&editorValue=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E7%E3%80%81%E7%86%9F%E7%BB%83%E5%88%87%E5%9B%BE%EF%BC%8C%E5%B0%86UI%E8%AE%BE%E8%AE%A1%E8%BD%AC%E5%8C%96%E4%B8%BA%E7%AC%A6%E5%90%88W3C%E8%A7%84%E8%8C%83%E7%9A%84DIV%2BCSS%E9%9D%99%E6%80%81%E9%A1%B5%E9%9D%A2%EF%BC%8C%E7%A1%AE%E4%BF%9D%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%8A%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%80%A7%E8%83%BD%E5%92%8C%E5%85%BC%E5%AE%B9%E6%80%A7%3C%2Fp%3E%3Cp%3E8%E3%80%81%E6%9C%89%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6%E6%9E%84%E5%BB%BA%EF%BC%8C%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9B%A2%E9%98%9F%E5%B7%A5%E4%BD%9C%E7%BB%84%E7%BB%87%E3%80%81%E7%AE%A1%E7%90%86%E5%B7%A5%E4%BD%9C%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E9%E3%80%81%E4%BA%86%E8%A7%A3JQuery+%2CEasyUI%E3%80%81ExtJS%E3%80%81Bootstrap%E3%80%81Angular.js%E7%AD%89%E6%A1%86%E6%9E%B6%E3%80%81%E6%9C%89%E7%BE%8E%E5%B7%A5%E8%AE%BE%E8%AE%A1%E7%BB%8F%E9%AA%8C%E8%80%85%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E10%E3%80%81%E6%9C%89%E5%A4%A7%E5%9E%8B%E7%B3%BB%E7%BB%9F%E3%80%81%E9%97%A8%E6%88%B7%E5%BC%80%E5%8F%91%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E'
    }
    addposiAction.postMessage(data);
    addposiAction.onMessage.addListener(function (res) {
        console.log(res)
    })
});
$("#addPosi2").click(function () {
    console.log('获取新增JAVA职位');
    var badTitle = addPosiFormDataJava.JobTitle;
    var badDesc = addPosiFormDataJava.JobDescription+addPosiFormDataJava.editorValue;
    var badWordStr = badTitle + badDesc;
    var data ={
        message:encodeURIComponent(badWordStr),
        addPosi:$.param(addPosiFormDataJava)
        // addPosi:'LoginPointId=15380991&PublicPoints=0&HavePermissionToPubPosition=True&TemplateId=&EmploymentType=2&IsJyywl=true&JobTitle=web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%B7%A5%E7%A8%8B%E5%B8%88&JobTypeMain=160000&SubJobTypeMain=864&JobTypeMinor=&SubJobTypeMinor=&Quantity=1&EducationLevel=4&WorkYears=103&MonthlyPay=0800110000&JobDescription=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E7%E3%80%81%E7%86%9F%E7%BB%83%E5%88%87%E5%9B%BE%EF%BC%8C%E5%B0%86UI%E8%AE%BE%E8%AE%A1%E8%BD%AC%E5%8C%96%E4%B8%BA%E7%AC%A6%E5%90%88W3C%E8%A7%84%E8%8C%83%E7%9A%84DIV%2BCSS%E9%9D%99%E6%80%81%E9%A1%B5%E9%9D%A2%EF%BC%8C%E7%A1%AE%E4%BF%9D%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%8A%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%80%A7%E8%83%BD%E5%92%8C%E5%85%BC%E5%AE%B9%E6%80%A7%3C%2Fp%3E%3Cp%3E8%E3%80%81%E6%9C%89%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6%E6%9E%84%E5%BB%BA%EF%BC%8C%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9B%A2%E9%98%9F%E5%B7%A5%E4%BD%9C%E7%BB%84%E7%BB%87%E3%80%81%E7%AE%A1%E7%90%86%E5%B7%A5%E4%BD%9C%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E9%E3%80%81%E4%BA%86%E8%A7%A3JQuery+%2CEasyUI%E3%80%81ExtJS%E3%80%81Bootstrap%E3%80%81Angular.js%E7%AD%89%E6%A1%86%E6%9E%B6%E3%80%81%E6%9C%89%E7%BE%8E%E5%B7%A5%E8%AE%BE%E8%AE%A1%E7%BB%8F%E9%AA%8C%E8%80%85%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E10%E3%80%81%E6%9C%89%E5%A4%A7%E5%9E%8B%E7%B3%BB%E7%BB%9F%E3%80%81%E9%97%A8%E6%88%B7%E5%BC%80%E5%8F%91%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E&welfaretab=10000%2C10002%2C10006%2C10010%2C10013%2C10014%2C10020%2C10021&CanPubPositionQty=0&PositionPubPlace=765%402041&ContractCityList=&PositionPubPlaceInitCityId=&WorkAddress=%E5%8D%8E%E7%BE%8E%E5%B1%85&WorkAddressCoordinate=0%2C0&CompanyAddress=%E6%80%BB%E9%83%A8%E9%9D%A2%E8%AF%95%E5%9C%B0%E5%9D%80-%E7%9C%81%E4%BD%93%E8%82%B2%E5%9C%BA%E4%B8%9C%E9%97%A8%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E5%A4%A7%E5%8E%A65%E6%A5%BC(%E7%9C%81%E4%BD%93%E8%82%B2%E5%9C%BA%E7%AB%99%E4%B8%8B%E8%BD%A6%E5%8D%B3%E5%88%B0%EF%BC%8C%E4%BA%94%E7%8E%AF%E4%BD%93%E8%82%B25%E6%A5%BC)&DateEnd=2017-10-06&ApplicationMethod=1&EmailList=&ApplicationMethodOptionsList=1%2C2&ESUrl=&IsCorpUser=False&IsShowRootCompanyIntro=True&IsShowSubCompanyIntro=False&DepartmentId=15380991&FilterId=&PositionApplyReply=-1&JobNo=&SeqNumber=&btnAddClick=saveandpub&editorValue=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E7%E3%80%81%E7%86%9F%E7%BB%83%E5%88%87%E5%9B%BE%EF%BC%8C%E5%B0%86UI%E8%AE%BE%E8%AE%A1%E8%BD%AC%E5%8C%96%E4%B8%BA%E7%AC%A6%E5%90%88W3C%E8%A7%84%E8%8C%83%E7%9A%84DIV%2BCSS%E9%9D%99%E6%80%81%E9%A1%B5%E9%9D%A2%EF%BC%8C%E7%A1%AE%E4%BF%9D%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%8A%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%80%A7%E8%83%BD%E5%92%8C%E5%85%BC%E5%AE%B9%E6%80%A7%3C%2Fp%3E%3Cp%3E8%E3%80%81%E6%9C%89%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6%E6%9E%84%E5%BB%BA%EF%BC%8C%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9B%A2%E9%98%9F%E5%B7%A5%E4%BD%9C%E7%BB%84%E7%BB%87%E3%80%81%E7%AE%A1%E7%90%86%E5%B7%A5%E4%BD%9C%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E9%E3%80%81%E4%BA%86%E8%A7%A3JQuery+%2CEasyUI%E3%80%81ExtJS%E3%80%81Bootstrap%E3%80%81Angular.js%E7%AD%89%E6%A1%86%E6%9E%B6%E3%80%81%E6%9C%89%E7%BE%8E%E5%B7%A5%E8%AE%BE%E8%AE%A1%E7%BB%8F%E9%AA%8C%E8%80%85%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E10%E3%80%81%E6%9C%89%E5%A4%A7%E5%9E%8B%E7%B3%BB%E7%BB%9F%E3%80%81%E9%97%A8%E6%88%B7%E5%BC%80%E5%8F%91%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E'
    }
    addposiAction.postMessage(data);
    addposiAction.onMessage.addListener(function (res) {
        console.log(res)
    })
});
$("#addPosi3").click(function () {
    console.log('获取新增UI职位');
    var badTitle = addPosiFormDataUI.JobTitle;
    var badDesc = addPosiFormDataUI.JobDescription+addPosiFormDataUI.editorValue;
    var badWordStr = badTitle + badDesc;
    var data ={
        message:encodeURIComponent(badWordStr),
        addPosi:$.param(addPosiFormDataUI)
        // addPosi:'LoginPointId=15380991&PublicPoints=0&HavePermissionToPubPosition=True&TemplateId=&EmploymentType=2&IsJyywl=true&JobTitle=web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%B7%A5%E7%A8%8B%E5%B8%88&JobTypeMain=160000&SubJobTypeMain=864&JobTypeMinor=&SubJobTypeMinor=&Quantity=1&EducationLevel=4&WorkYears=103&MonthlyPay=0800110000&JobDescription=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E7%E3%80%81%E7%86%9F%E7%BB%83%E5%88%87%E5%9B%BE%EF%BC%8C%E5%B0%86UI%E8%AE%BE%E8%AE%A1%E8%BD%AC%E5%8C%96%E4%B8%BA%E7%AC%A6%E5%90%88W3C%E8%A7%84%E8%8C%83%E7%9A%84DIV%2BCSS%E9%9D%99%E6%80%81%E9%A1%B5%E9%9D%A2%EF%BC%8C%E7%A1%AE%E4%BF%9D%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%8A%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%80%A7%E8%83%BD%E5%92%8C%E5%85%BC%E5%AE%B9%E6%80%A7%3C%2Fp%3E%3Cp%3E8%E3%80%81%E6%9C%89%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6%E6%9E%84%E5%BB%BA%EF%BC%8C%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9B%A2%E9%98%9F%E5%B7%A5%E4%BD%9C%E7%BB%84%E7%BB%87%E3%80%81%E7%AE%A1%E7%90%86%E5%B7%A5%E4%BD%9C%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E9%E3%80%81%E4%BA%86%E8%A7%A3JQuery+%2CEasyUI%E3%80%81ExtJS%E3%80%81Bootstrap%E3%80%81Angular.js%E7%AD%89%E6%A1%86%E6%9E%B6%E3%80%81%E6%9C%89%E7%BE%8E%E5%B7%A5%E8%AE%BE%E8%AE%A1%E7%BB%8F%E9%AA%8C%E8%80%85%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E10%E3%80%81%E6%9C%89%E5%A4%A7%E5%9E%8B%E7%B3%BB%E7%BB%9F%E3%80%81%E9%97%A8%E6%88%B7%E5%BC%80%E5%8F%91%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E&welfaretab=10000%2C10002%2C10006%2C10010%2C10013%2C10014%2C10020%2C10021&CanPubPositionQty=0&PositionPubPlace=765%402041&ContractCityList=&PositionPubPlaceInitCityId=&WorkAddress=%E5%8D%8E%E7%BE%8E%E5%B1%85&WorkAddressCoordinate=0%2C0&CompanyAddress=%E6%80%BB%E9%83%A8%E9%9D%A2%E8%AF%95%E5%9C%B0%E5%9D%80-%E7%9C%81%E4%BD%93%E8%82%B2%E5%9C%BA%E4%B8%9C%E9%97%A8%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E5%A4%A7%E5%8E%A65%E6%A5%BC(%E7%9C%81%E4%BD%93%E8%82%B2%E5%9C%BA%E7%AB%99%E4%B8%8B%E8%BD%A6%E5%8D%B3%E5%88%B0%EF%BC%8C%E4%BA%94%E7%8E%AF%E4%BD%93%E8%82%B25%E6%A5%BC)&DateEnd=2017-10-06&ApplicationMethod=1&EmailList=&ApplicationMethodOptionsList=1%2C2&ESUrl=&IsCorpUser=False&IsShowRootCompanyIntro=True&IsShowSubCompanyIntro=False&DepartmentId=15380991&FilterId=&PositionApplyReply=-1&JobNo=&SeqNumber=&btnAddClick=saveandpub&editorValue=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E7%E3%80%81%E7%86%9F%E7%BB%83%E5%88%87%E5%9B%BE%EF%BC%8C%E5%B0%86UI%E8%AE%BE%E8%AE%A1%E8%BD%AC%E5%8C%96%E4%B8%BA%E7%AC%A6%E5%90%88W3C%E8%A7%84%E8%8C%83%E7%9A%84DIV%2BCSS%E9%9D%99%E6%80%81%E9%A1%B5%E9%9D%A2%EF%BC%8C%E7%A1%AE%E4%BF%9D%E6%B5%8F%E8%A7%88%E5%99%A8%E5%8F%8A%E5%B9%B3%E5%8F%B0%E7%9A%84%E6%80%A7%E8%83%BD%E5%92%8C%E5%85%BC%E5%AE%B9%E6%80%A7%3C%2Fp%3E%3Cp%3E8%E3%80%81%E6%9C%89%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A1%86%E6%9E%B6%E6%9E%84%E5%BB%BA%EF%BC%8C%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E5%9B%A2%E9%98%9F%E5%B7%A5%E4%BD%9C%E7%BB%84%E7%BB%87%E3%80%81%E7%AE%A1%E7%90%86%E5%B7%A5%E4%BD%9C%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E9%E3%80%81%E4%BA%86%E8%A7%A3JQuery+%2CEasyUI%E3%80%81ExtJS%E3%80%81Bootstrap%E3%80%81Angular.js%E7%AD%89%E6%A1%86%E6%9E%B6%E3%80%81%E6%9C%89%E7%BE%8E%E5%B7%A5%E8%AE%BE%E8%AE%A1%E7%BB%8F%E9%AA%8C%E8%80%85%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E10%E3%80%81%E6%9C%89%E5%A4%A7%E5%9E%8B%E7%B3%BB%E7%BB%9F%E3%80%81%E9%97%A8%E6%88%B7%E5%BC%80%E5%8F%91%E7%BB%8F%E9%AA%8C%E4%BC%98%E5%85%88%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E'
    }
    addposiAction.postMessage(data);
    addposiAction.onMessage.addListener(function (res) {
        console.log(res)
    })
});

$("#delPosi").click(function () {
    console.log('删除职位');
    var delId = 'positionNumbers='+userId;
    var reqdata={
        code:200,
        data:delId
    }
    delposiAction.postMessage(reqdata);
    delposiAction.onMessage.addListener(function (res) {
        console.log(res)
    })
});

$("#downlinePosi").click(function () {
    console.log('下线职位');
    var unlineId = 'positionNumbers='+userId;
    var reqdata={
        code:200,
        data:unlineId
    }
    unlineposiAction.postMessage(reqdata);
    unlineposiAction.onMessage.addListener(function (res) {
        console.log(res)
    })
})
$("#onlinePosi").click(function () {
    console.log('上线职位');
    var unlineData = onlinePosiFormData;
    // var unlineData = 'editid=208040563&jobpositionnumber=CC420388316J90250060000&priorityRule=1&enddate=undefined';
    var reqdata={
        code:200,
        data:unlineData
    }
    onlineposiAction.postMessage(reqdata);
    onlineposiAction.onMessage.addListener(function (res) {
        console.log(res)
    })
});
$("#editPosi").click(function () {
    console.log('编辑职位');
    var reqdata={
        code:200,
        data:$.param(editPosiFormData)
    };
    editposiAction.postMessage(reqdata);
    editposiAction.onMessage.addListener(function (res) {
        console.log(res)
    })
})


var screenData = {
    CurrentPageNum: 1,
    SF_1_1_50: 1,
    SF_1_1_51: '-1',
    PageType: '0',
    click_search_op_type: 1,
    SF_1_1_52: '0',
    SF_1_1_49: '0',
    IsInvited: '0',
    'X-Requested-With': 'XMLHttpRequest',
    PageList2: '',
};
var resumeOnline = chrome.runtime.connect({name: "resumeOnline"});//编辑职位
$("#getDeliveryResumeOnline1").click(function () {
    console.log('获取投递简历列表(待处理)');
    screenData.SF_1_1_50=1;
    screenData.click_search_op_type=1;
    resumeOnline.postMessage(screenData);
    resumeOnline.onMessage.addListener(function (res) {
        $("#table").html(res)
    })
});
$("#getDeliveryResumeOnline2").click(function () {
    console.log('获取投递简历列表(待沟通)');
    screenData.SF_1_1_50=2;
    screenData.click_search_op_type=2;
    resumeOnline.postMessage(screenData);
    resumeOnline.onMessage.addListener(function (res) {
        $("#table").html(res)
    })
})
$("#getDeliveryResumeOnline3").click(function () {
    console.log('获取投递简历列表(已发面试邀请)');
    screenData.SF_1_1_50=3;
    screenData.click_search_op_type=3;
    resumeOnline.postMessage(screenData);
    resumeOnline.onMessage.addListener(function (res) {
        $("#table").html(res)
    });
})
$("#getDeliveryResumeOnline4").click(function () {
    console.log('获取投递简历列表(不合适)');
    screenData.SF_1_1_50=4;
    screenData.click_search_op_type=4;
    resumeOnline.postMessage(screenData);
    resumeOnline.onMessage.addListener(function (res) {
        $("#table").html(res)
    });
});

var getResumeDetail = chrome.runtime.connect({name: "getResumeDetail"});//获取简历详情
$("#table").on('click','.link',function () {
    var href = $(this).attr('href');
    getResumeDetail.postMessage(href);

    getResumeDetail.onMessage.addListener(function (res) {
        var newWin = window.open();
        newWin.document.write(res)
    });
    return false;
});


var userId = 'CC324696311J90250240000'

var loginPointId='32469631'
var addPosiFormData={
    LoginPointId:loginPointId,
    PublicPoints:0,
    HavePermissionToPubPosition:'True',
    TemplateId:'',
    EmploymentType:2,
    IsJyywl:true,
    JobTitle:'web前端开发',
    JobTypeMain:160000,
    SubJobTypeMain:864,
    JobTypeMinor:'',
    SubJobTypeMinor:'',
    Quantity:1,
    EducationLevel:4,
    WorkYears:103,
    MonthlyPay:'0800110000',
    JobDescription:'<p>岗位职责：</p><p>1、利用HTML/CSS/JavaScript等Web技术进行产品的开发</p><p>2、配合后台开发人员实现产品功能，独立完成Web前端开发任务</p><p>3、能够理解后端架构，与后端工程师配合，为项目提供最优化的技术解决方案</p><p>4、能够理解基础需求和UI设计并进行分析，设计出符合用户使用习惯的前端操作界面，优化前端用户操作体验</p><p>任职要求：</p><p>1、精通HTML 5/CSS 3/Javascript等主流WEB前端技术</p><p>2、精通DIV+CSS布局的HTML代码编写，能够书写符合W3C标准的代码，并有严苛的编码风格和良好的编码习惯；</p><p>3、精通jQuery、bootstrip等主流的js框架和库，并能够对其特性和应用有深入的了解；</p><p>4、精通面向组件的前端开发模式，对组件规划、封装工作有相关经验；</p><p>4、熟悉CommonJS标准，对Requirejs或同类型加载器的原理和使用有一定经验；</p><p>5、熟悉一门Web服务器端编程语言（如Node/Java），并有相关项目经验；</p><p>6、熟悉ajax/xml/json等网络通信技术和数据交换格式；</p><p><br/></p>',
    welfaretab:'10000,10002,10006,10010,10013,10014,10020,10021',
    CanPubPositionQty:0,
    PositionPubPlace:'765@2041',
    ContractCityList:'',
    PositionPubPlaceInitCityId:'',
    WorkAddress:'华美居',
    WorkAddressCoordinate:'0,0',
    CompanyAddress:'总部面试地址-省体育场东门奥林匹克大厦5楼(省体育场站下车即到，五环体育5楼)',
    DateEnd:'2017-10-06',
    ApplicationMethod:1,
    EmailList:'',
    ApplicationMethodOptionsList:'1,2',
    ESUrl:'',
    IsCorpUser:'False',
    IsShowRootCompanyIntro:'True',
    IsShowSubCompanyIntro:'False',
    DepartmentId:loginPointId,
    FilterId:'',
    PositionApplyReply:	'-1',
    JobNo:'',
    SeqNumber:'',
    btnAddClick:'saveandpub',
    editorValue:'<p>岗位职责：</p><p>1、利用HTML/CSS/JavaScript等Web技术进行产品的开发</p><p>2、配合后台开发人员实现产品功能，独立完成Web前端开发任务</p><p>3、能够理解后端架构，与后端工程师配合，为项目提供最优化的技术解决方案</p><p>4、能够理解基础需求和UI设计并进行分析，设计出符合用户使用习惯的前端操作界面，优化前端用户操作体验</p><p>任职要求：</p><p>1、精通HTML 5/CSS 3/Javascript等主流WEB前端技术</p><p>2、精通DIV+CSS布局的HTML代码编写，能够书写符合W3C标准的代码，并有严苛的编码风格和良好的编码习惯；</p><p>3、精通jQuery、bootstrip等主流的js框架和库，并能够对其特性和应用有深入的了解；</p><p>4、精通面向组件的前端开发模式，对组件规划、封装工作有相关经验；</p><p>4、熟悉CommonJS标准，对Requirejs或同类型加载器的原理和使用有一定经验；</p><p>5、熟悉一门Web服务器端编程语言（如Node/Java），并有相关项目经验；</p><p>6、熟悉ajax/xml/json等网络通信技术和数据交换格式；</p><p><br/></p>'
};

var addPosiFormDataJava = {
    LoginPointId: loginPointId,
    PublicPoints: '0',
    HavePermissionToPubPosition: 'True',
    TemplateId: '',
    EmploymentType: '2',
    IsJyywl: true,
    JobTitle: 'java软件开发',
    JobTypeMain: '160000',
    SubJobTypeMain: '2040',
    JobTypeMinor: '',
    SubJobTypeMinor: '',
    Quantity: 1,
    EducationLevel: 4,
    WorkYears: 103,
    MonthlyPay: '0800110000',
    JobDescription: '<p>岗位职责：</p><p>1、在软件项目经理的领导下，配合完成程序设计和开发。</p><p>2、按产品需求进行软件设计和编码实现，确保安全、质量和性能。</p><p>3、参与内部测试、部署、实施等工作。</p><p>4、分析并解决软件开发过程中的问题。</p><p>任职要求：</p><p>1、大学本科以上学历，计算机相关专业，有一年以上JAVA开发经验；</p><p>2、熟悉Java&nbsp;EE技术，包括Servlet/JSP、JDBC、JMS、Web&nbsp;Service等，对各种开源的软件如Spring、Struts、hibernate/ibatis、Tomcat等有深入的了解。；&nbsp;</p><p>3、熟悉css/xml等网页技术，熟练Ajax（jquery、mootools）、Javascript技术；</p><p>4、熟悉Oracle、Mysql数据库。</p><p>5、熟悉面向对象编程，具有良好的编程风格、习惯；了解软件开发流程，熟悉MVC模式；并有在MVC模式下进行中大型web开发的经验；&nbsp;</p><p>6、可以单独对已有的系统进行维护，工作认真细致负责，有良好的自学能力，独立思考能力，能够在短时间内学习并应用新技术；</p><p>7、积极热情、沟通能力强，有强烈的责任心，具有良好的团队合作精神和敬业精神；</p><p>8、能够承受工作压力，能在规定的时间内高效完成任务，具有良好的团队合作精神</p><p><br/></p>',
    welfaretab: '10000,10002,10006,10010,10013,10014,10020,10021',
    CanPubPositionQty: 0,
    PositionPubPlace: '765@2041',
    ContractCityList: '',
    PositionPubPlaceInitCityId: '',
    WorkAddress: '华美居',
    WorkAddressCoordinate: '0,0',
    CompanyAddress: '',
    DateEnd: '2017-10-08',
    ApplicationMethod: 1,
    EmailList: '',
    ApplicationMethodOptionsList: '1,2',
    ESUrl: '',
    IsCorpUser: 'False',
    IsShowRootCompanyIntro: 'True',
    IsShowSubCompanyIntro: 'False',
    DepartmentId: loginPointId,
    FilterId: '',
    PositionApplyReply: '-1',
    JobNo: '',
    SeqNumber: '',
    btnAddClick: 'saveandpub',
    editorValue: '<p>岗位职责：</p><p>1、在软件项目经理的领导下，配合完成程序设计和开发。</p><p>2、按产品需求进行软件设计和编码实现，确保安全、质量和性能。</p><p>3、参与内部测试、部署、实施等工作。</p><p>4、分析并解决软件开发过程中的问题。</p><p>任职要求：</p><p>1、大学本科以上学历，计算机相关专业，有一年以上JAVA开发经验；</p><p>2、熟悉Java&nbsp;EE技术，包括Servlet/JSP、JDBC、JMS、Web&nbsp;Service等，对各种开源的软件如Spring、Struts、hibernate/ibatis、Tomcat等有深入的了解。；&nbsp;</p><p>3、熟悉css/xml等网页技术，熟练Ajax（jquery、mootools）、Javascript技术；</p><p>4、熟悉Oracle、Mysql数据库。</p><p>5、熟悉面向对象编程，具有良好的编程风格、习惯；了解软件开发流程，熟悉MVC模式；并有在MVC模式下进行中大型web开发的经验；&nbsp;</p><p>6、可以单独对已有的系统进行维护，工作认真细致负责，有良好的自学能力，独立思考能力，能够在短时间内学习并应用新技术；</p><p>7、积极热情、沟通能力强，有强烈的责任心，具有良好的团队合作精神和敬业精神；</p><p>8、能够承受工作压力，能在规定的时间内高效完成任务，具有良好的团队合作精神</p><p><br/></p>'
};
var addPosiFormDataUI = {
    LoginPointId: loginPointId,
    PublicPoints: '0',
    HavePermissionToPubPosition: 'True',
    TemplateId: '',
    EmploymentType: '2',
    IsJyywl: true,
    JobTitle: 'UI设计师',
    JobTypeMain: '160000',
    SubJobTypeMain: '2040',
    JobTypeMinor: '',
    SubJobTypeMinor: '',
    Quantity: 1,
    EducationLevel: 4,
    WorkYears: 103,
    MonthlyPay: '0800110000',
    JobDescription: '<p>岗位职责：</p><p>1、负责收集客户端的界面视觉设计。</p><p>2、负责网页、网站前后台的设计搭建。</p><p>3、在充分理解产品交互文档基础上，进行界面UI设计。</p><p>4、充分发挥创意，设计简洁，精致的UI界面，提高产品易用性。</p><p>5、负责输出样式坐标文档和技术用图，配合开发人员实现产品</p><p>任职要求：</p><p>1、美术，平面设计，数字媒体艺术等相关专业专科以上学历，三年以上手机、移动互联网等相关行业UI工作经验；</p><p>2、熟练使用photoshop、dreamweaver、flash、illustator、moments、mocking bot、coreldraw、Axure、InDesign等相关设计软件;</p><p>3、熟悉Android、ios等移动系统平台特性，做过手机界面设计；</p><p>4、了解手机UI界面设计流程，有较强的图案界面设计功底，有较强的色彩把控能力，极具设计创意。</p><p>5、对UI设计有良好的认知和深刻的理解，有人机设计经验；</p>',
    welfaretab: '10000,10002,10006,10010,10013,10014,10020,10021',
    CanPubPositionQty: 0,
    PositionPubPlace: '765@2041',
    ContractCityList: '',
    PositionPubPlaceInitCityId: '',
    WorkAddress: '华美居',
    WorkAddressCoordinate: '0,0',
    CompanyAddress: '',
    DateEnd: '2017-10-08',
    ApplicationMethod: 1,
    EmailList: '',
    ApplicationMethodOptionsList: '1,2',
    ESUrl: '',
    IsCorpUser: 'False',
    IsShowRootCompanyIntro: 'True',
    IsShowSubCompanyIntro: 'False',
    DepartmentId: loginPointId,
    FilterId: '',
    PositionApplyReply: '-1',
    JobNo: '',
    SeqNumber: '',
    btnAddClick: 'saveandpub',
    editorValue: '<p>岗位职责：</p><p>1、负责收集客户端的界面视觉设计。</p><p>2、负责网页、网站前后台的设计搭建。</p><p>3、在充分理解产品交互文档基础上，进行界面UI设计。</p><p>4、充分发挥创意，设计简洁，精致的UI界面，提高产品易用性。</p><p>5、负责输出样式坐标文档和技术用图，配合开发人员实现产品</p><p>任职要求：</p><p>1、美术，平面设计，数字媒体艺术等相关专业专科以上学历，三年以上手机、移动互联网等相关行业UI工作经验；</p><p>2、熟练使用photoshop、dreamweaver、flash、illustator、moments、mocking bot、coreldraw、Axure、InDesign等相关设计软件;</p><p>3、熟悉Android、ios等移动系统平台特性，做过手机界面设计；</p><p>4、了解手机UI界面设计流程，有较强的图案界面设计功底，有较强的色彩把控能力，极具设计创意。</p><p>5、对UI设计有良好的认知和深刻的理解，有人机设计经验；</p>'
}

var editPosiFormData = {
    LoginPointId: '45538031',
    PositionNumber: 'CC455380318J90250226000',
    DisplayType: '',
    Status: 3,
    hide_JobTitle: 'web前端开发攻城狮',
    PublicPoints: '0',
    HavePermissionToPubPosition: 'True',
    EmploymentType: 2,
    IsJyywl: false,
    JobTitle: 'web前端开发攻城狮',
    JobTypeMain: 160000,
    SubJobTypeMain: 864,
    JobTypeMinor: '',
    SubJobTypeMinor: '',
    Quantity: 1,
    EducationLevel: 5,
    WorkYears: 305,
    MonthlyPay: '0800110000',
    JobDescription: '<p>岗位职责：</p><p>1、利用HTML(5)/CSS(3)/JavaScript（es6）等Web技术完成UI设计图的产品的开发</p><p>2、配合后台开发人员实现产品功能，独立完成Web前端开发任务</p><p>3、能够理解后端架构，与后端工程师配合，为项目提供最优化的技术解决方案</p><p>4、能够理解基础需求和UI设计并进行分析，设计出符合用户使用习惯的前端操作界面，优化前端用户操作体验</p><p>任职要求：</p><p>1、精通HTML 5/CSS 3/Javascript等主流WEB前端技术</p><p>2、精通DIV+CSS布局的HTML代码编写，能够书写符合W3C标准的代码，并有严苛的编码风格和良好的编码习惯；</p><p>3、精通jQuery、bootstrip等主流的js框架和库，并能够对其特性和应用有深入的了解；</p><p>4、精通面向组件的前端开发模式，对组件规划、封装工作有相关经验；</p><p>4、熟悉CommonJS标准，对Requirejs或同类型加载器的原理和使用有一定经验；</p><p>5、熟悉一门Web服务器端编程语言（如Node/Java），并有相关项目经验；</p><p>6、熟悉ajax/xml/json等网络通信技术和数据交换格式；</p><p><br/></p>',
    welfaretab: '10000,10002,10006,10010,10013,10014,10020,10021',
    CanPubPositionQty: 0,
    PositionPubPlace: '765@2041',
    ContractCityList: '',
    PositionPubPlaceInitCityId: '',
    WorkAddress: '华美居商务中心BB座A区',
    WorkAddressCoordinate: '0,0',
    CompanyAddress: '石家庄桥西区红旗大街581号古韵文化广场B座427室',
    DateEnd: '2017-10-07',
    ApplicationMethod: '1',
    EmailList: '',
    ApplicationMethodOptionsList: '1,2',
    ESUrl: '',
    IsCorpUser: 'False',
    IsShowRootCompanyIntro: 'True',
    IsShowSubCompanyIntro: 'False',
    DepartmentId: '45538031',
    FilterId: '',
    PositionApplyReply: '-1',
    JobNo: '',
    SeqNumber: '500',
    btnAddClick: 'saveandpub',
    DateRefresh: '',
    editorValue: '<p>岗位职责：</p><p>1、利用HTML(5)/CSS(3)/JavaScript（es6）等Web技术完成UI设计图的产品的开发</p><p>2、配合后台开发人员实现产品功能，独立完成Web前端开发任务</p><p>3、能够理解后端架构，与后端工程师配合，为项目提供最优化的技术解决方案</p><p>4、能够理解基础需求和UI设计并进行分析，设计出符合用户使用习惯的前端操作界面，优化前端用户操作体验</p><p>任职要求：</p><p>1、精通HTML 5/CSS 3/Javascript等主流WEB前端技术</p><p>2、精通DIV+CSS布局的HTML代码编写，能够书写符合W3C标准的代码，并有严苛的编码风格和良好的编码习惯；</p><p>3、精通jQuery、bootstrip等主流的js框架和库，并能够对其特性和应用有深入的了解；</p><p>4、精通面向组件的前端开发模式，对组件规划、封装工作有相关经验；</p><p>4、熟悉CommonJS标准，对Requirejs或同类型加载器的原理和使用有一定经验；</p><p>5、熟悉一门Web服务器端编程语言（如Node/Java），并有相关项目经验；</p><p>6、熟悉ajax/xml/json等网络通信技术和数据交换格式；</p><p><br/></p>'
};

var onlinePosiFormData={
    list:[{
        editid:'238802534',
        jobpositionnumber:'CC324696311J90250240000',
        // priorityRule:1,
        // enddate:''
    }],

}

$("#zlBtn").click(function () {
    console.log("测试")
})

var formData='LoginPointId=32469631&PublicPoints=0&HavePermissionToPubPosition=True&TemplateId=&EmploymentType=2&IsJyywl=true&JobTitle=web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91&JobTypeMain=160000&SubJobTypeMain=864&JobTypeMinor=&SubJobTypeMinor=&Quantity=1&EducationLevel=4&WorkYears=103&MonthlyPay=0600108000&JobDescription=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E&welfaretab=10000%2C10002%2C10006%2C10010%2C10013%2C10014%2C10020%2C10021&CanPubPositionQty=0&PositionPubPlace=765%402041&ContractCityList=&PositionPubPlaceInitCityId=&WorkAddress=%E5%8D%8E%E7%BE%8E%E5%B1%85&WorkAddressCoordinate=0%2C0&CompanyAddress=%E5%AE%9C%E6%98%8C%E5%B8%82%E8%A5%BF%E9%99%B5%E4%B8%80%E8%B7%AF18%E5%8F%B7%E4%B8%AD%E7%8E%AF%E5%A4%A7%E5%8E%A69%E6%A5%BC&DateEnd=2017-10-06&ApplicationMethod=1&EmailList=&ApplicationMethodOptionsList=1%2C2&ESUrl=&IsCorpUser=False&IsShowRootCompanyIntro=True&IsShowSubCompanyIntro=False&DepartmentId=32469631&FilterId=&PositionApplyReply=-1&JobNo=&SeqNumber=&btnAddClick=saveandpub&editorValue=%3Cp%3E%E5%B2%97%E4%BD%8D%E8%81%8C%E8%B4%A3%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E5%88%A9%E7%94%A8HTML%2FCSS%2FJavaScript%E7%AD%89Web%E6%8A%80%E6%9C%AF%E8%BF%9B%E8%A1%8C%E4%BA%A7%E5%93%81%E7%9A%84%E5%BC%80%E5%8F%91%3C%2Fp%3E%3Cp%3E2%E3%80%81%E9%85%8D%E5%90%88%E5%90%8E%E5%8F%B0%E5%BC%80%E5%8F%91%E4%BA%BA%E5%91%98%E5%AE%9E%E7%8E%B0%E4%BA%A7%E5%93%81%E5%8A%9F%E8%83%BD%EF%BC%8C%E7%8B%AC%E7%AB%8B%E5%AE%8C%E6%88%90Web%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E4%BB%BB%E5%8A%A1%3C%2Fp%3E%3Cp%3E3%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%90%8E%E7%AB%AF%E6%9E%B6%E6%9E%84%EF%BC%8C%E4%B8%8E%E5%90%8E%E7%AB%AF%E5%B7%A5%E7%A8%8B%E5%B8%88%E9%85%8D%E5%90%88%EF%BC%8C%E4%B8%BA%E9%A1%B9%E7%9B%AE%E6%8F%90%E4%BE%9B%E6%9C%80%E4%BC%98%E5%8C%96%E7%9A%84%E6%8A%80%E6%9C%AF%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%3C%2Fp%3E%3Cp%3E4%E3%80%81%E8%83%BD%E5%A4%9F%E7%90%86%E8%A7%A3%E5%9F%BA%E7%A1%80%E9%9C%80%E6%B1%82%E5%92%8CUI%E8%AE%BE%E8%AE%A1%E5%B9%B6%E8%BF%9B%E8%A1%8C%E5%88%86%E6%9E%90%EF%BC%8C%E8%AE%BE%E8%AE%A1%E5%87%BA%E7%AC%A6%E5%90%88%E7%94%A8%E6%88%B7%E4%BD%BF%E7%94%A8%E4%B9%A0%E6%83%AF%E7%9A%84%E5%89%8D%E7%AB%AF%E6%93%8D%E4%BD%9C%E7%95%8C%E9%9D%A2%EF%BC%8C%E4%BC%98%E5%8C%96%E5%89%8D%E7%AB%AF%E7%94%A8%E6%88%B7%E6%93%8D%E4%BD%9C%E4%BD%93%E9%AA%8C%E3%80%82%3C%2Fp%3E%3Cp%3E%E4%BB%BB%E8%81%8C%E8%A6%81%E6%B1%82%EF%BC%9A%3C%2Fp%3E%3Cp%3E1%E3%80%81%E7%B2%BE%E9%80%9AHTML+5%2FCSS+3%2FJavascript%E7%AD%89%E4%B8%BB%E6%B5%81WEB%E5%89%8D%E7%AB%AF%E6%8A%80%E6%9C%AF%3C%2Fp%3E%3Cp%3E2%E3%80%81%E7%B2%BE%E9%80%9ADIV%2BCSS%E5%B8%83%E5%B1%80%E7%9A%84HTML%E4%BB%A3%E7%A0%81%E7%BC%96%E5%86%99%EF%BC%8C%E8%83%BD%E5%A4%9F%E4%B9%A6%E5%86%99%E7%AC%A6%E5%90%88W3C%E6%A0%87%E5%87%86%E7%9A%84%E4%BB%A3%E7%A0%81%EF%BC%8C%E5%B9%B6%E6%9C%89%E4%B8%A5%E8%8B%9B%E7%9A%84%E7%BC%96%E7%A0%81%E9%A3%8E%E6%A0%BC%E5%92%8C%E8%89%AF%E5%A5%BD%E7%9A%84%E7%BC%96%E7%A0%81%E4%B9%A0%E6%83%AF%EF%BC%9B%3C%2Fp%3E%3Cp%3E3%E3%80%81%E7%B2%BE%E9%80%9AjQuery%E3%80%81bootstrip%E7%AD%89%E4%B8%BB%E6%B5%81%E7%9A%84js%E6%A1%86%E6%9E%B6%E5%92%8C%E5%BA%93%EF%BC%8C%E5%B9%B6%E8%83%BD%E5%A4%9F%E5%AF%B9%E5%85%B6%E7%89%B9%E6%80%A7%E5%92%8C%E5%BA%94%E7%94%A8%E6%9C%89%E6%B7%B1%E5%85%A5%E7%9A%84%E4%BA%86%E8%A7%A3%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%B2%BE%E9%80%9A%E9%9D%A2%E5%90%91%E7%BB%84%E4%BB%B6%E7%9A%84%E5%89%8D%E7%AB%AF%E5%BC%80%E5%8F%91%E6%A8%A1%E5%BC%8F%EF%BC%8C%E5%AF%B9%E7%BB%84%E4%BB%B6%E8%A7%84%E5%88%92%E3%80%81%E5%B0%81%E8%A3%85%E5%B7%A5%E4%BD%9C%E6%9C%89%E7%9B%B8%E5%85%B3%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E4%E3%80%81%E7%86%9F%E6%82%89CommonJS%E6%A0%87%E5%87%86%EF%BC%8C%E5%AF%B9Requirejs%E6%88%96%E5%90%8C%E7%B1%BB%E5%9E%8B%E5%8A%A0%E8%BD%BD%E5%99%A8%E7%9A%84%E5%8E%9F%E7%90%86%E5%92%8C%E4%BD%BF%E7%94%A8%E6%9C%89%E4%B8%80%E5%AE%9A%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E5%E3%80%81%E7%86%9F%E6%82%89%E4%B8%80%E9%97%A8Web%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%88%E5%A6%82Node%2FJava%EF%BC%89%EF%BC%8C%E5%B9%B6%E6%9C%89%E7%9B%B8%E5%85%B3%E9%A1%B9%E7%9B%AE%E7%BB%8F%E9%AA%8C%EF%BC%9B%3C%2Fp%3E%3Cp%3E6%E3%80%81%E7%86%9F%E6%82%89ajax%2Fxml%2Fjson%E7%AD%89%E7%BD%91%E7%BB%9C%E9%80%9A%E4%BF%A1%E6%8A%80%E6%9C%AF%E5%92%8C%E6%95%B0%E6%8D%AE%E4%BA%A4%E6%8D%A2%E6%A0%BC%E5%BC%8F%EF%BC%9B%3C%2Fp%3E%3Cp%3E%3Cbr%2F%3E%3C%2Fp%3E';




