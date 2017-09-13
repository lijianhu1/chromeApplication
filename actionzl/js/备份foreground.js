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
var accountId = ''

//简历筛选简历夹  /**尚不完善**/

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

            for (var i=0;i<resFolderLen;i++){
                if(resFolder.Data[i].LevelMark!=null){
                    console.log(resFolder.Data[i])
                    var id = resFolder.Data[i].Id;
                    console.log("id:"+id);
                    console.log("favoriteId:"+favoriteId)
                    folderId = favoriteId?favoriteId:id;
                    // folderId = id;
                    console.log("folderId:"+folderId)
                    zlListData.favoriteId = folderId;
                    var zlData={
                        curr:zlListData.pageIndex,
                        zlListData:$.param(zlListData)
                    }
                    console.log(zlData)
                    port.postMessage(zlData);//发送消息
                    portFun(i,resFolderLen)
                }
            }
            // function folderItemFun() {  //单个文件夹遍历
            //     if(resFolder.Data[folderIndex].LevelMark!=null){
            //         console.log(resFolder.Data[folderIndex])
            //         var id = resFolder.Data[folderIndex].Id;
            //         folderId = favoriteId?favoriteId:id;
            //         // folderId = id;
            //         console.log(folderId)
            //         zlListData.favoriteId = folderId;
            //         var zlData={
            //             curr:zlListData.pageIndex,
            //             zlListData:$.param(zlListData)
            //         }
            //         console.log(zlData)
            //         port.postMessage(zlData);//发送消息
            //         portFun(folderIndex,resFolderLen)
            //     }
            //     if(folderIndex>resFolder.Data.length) return;
            //     folderIndex+=1;
            //     folderItemFun()
            // }
            // folderItemFun()
        }
    });
}

//监听简历夹列表
function portFun(folderIndex,resFolderLen) {
    port.onMessage.addListener(function(response) {
        console.log(response)
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
                            // $.ajax({
                            //     url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                            //     type:'POST',
                            //     async:false,
                            //     data:resumeData,
                            //     success:function (res) {
                            //         console.log("当天提交")
                            //         $.ajax({
                            //             url:'http://192.168.1.189:8082/resume/updateExportRecord',
                            //             type:'POST',
                            //             data:record,
                            //             success:function (allres) {
                            //                 console.log('当天导出完毕')
                            //             }
                            //         })
                            //     },
                            //     error:function (res) {
                            //         console.log(res)
                            //     }
                            // });
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

                            // $.ajax({
                            //     url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                            //     type:'POST',
                            //     async:false,
                            //     data:resumeData,
                            //     success:function (res) {
                            //         console.log(res)
                            if((folderIndex==resFolderLen-1)&&(currPage==pageCount)){
                                var record = {
                                    deliveryType:1,
                                    exportPage:1,  //第几页
                                    talentFolderId:folderId,  //人才夹文件夹ID
                                    isExportComplete:1, //是否全部导出完毕
                                    id:'' //账户id
                                }
                                console.log("文件夹完毕")
                                // $.ajax({
                                //     url:'http://192.168.1.189:8082/resume/updateExportRecord',
                                //     type:'POST',
                                //     async:false,
                                //     data:record,
                                //     success:function (allres) {
                                //         console.log('该用户文件夹导出完毕');
                                //         deliveryType = 1;
                                //         pendingFormData.SF_1_1_50 = deliveryType;
                                //         pendingFormData.click_search_op_type = deliveryType
                                //         screen.postMessage($.param(pendingFormData));//发送消息
                                //     }
                                // });
                                return;
                            }
                            //     },
                            //     error:function (res) {
                            //         console.log(res)
                            //     }
                            // });

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
                        resumeArr.push(response);
                    });
                }
            }
        }
    });
}

//监听简历夹列表
// port.onMessage.addListener(function(response) {
//     console.log(response)
//     var html = '<tr><th>姓名</th><th>年龄</th><th>Gender</th><th>AuthUrl</th><th>CityId</th><th>EducationLevel</th><th>获取简历</th>></tr>';
//     for (var index in response.ResumeViewList){
//         html+="<tr><td>"+response.ResumeViewList[index].Name+"</td><td>"+response.ResumeViewList[index].Age+"</td>" +
//             "<td>"+response.ResumeViewList[index].Gender+"</td><td>"+response.ResumeViewList[index].AuthUrl+"</td>" +
//             "<td>"+response.ResumeViewList[index].CityId+"</td><td>"+response.ResumeViewList[index].EducationLevel+"</td>" +
//             "<td><button data-resume='"+response.ResumeViewList[index].Guid+"' class='getresume'>获取简历</button></td></tr>"
//     }
//     $("#table").html(html);
//     var pageCount = response.PageCount;  //总页数
//     var zlListData = {   //简历夹列表请求数据
//         favoriteId:folderId,   //简历夹ID
//         isTemp:'n',
//         resumeSourceId:'0',
//         queryDateTime:'2016-08-17 15:07:09',
//     }
//     var currPage = response.currentPage;   //当前页数，原数据没有，自己添加的
//
//     for (var ind=1;ind<=pageCount;ind++){
//         if(currPage==ind){
//             zlListData.pageIndex = ind+1;
//             var resumeArr=[];
//             var zlData={
//                 curr:ind+1,
//                 zlListData:$.param(zlListData)
//             }
//             var resumeCount=0;
//             function resumeListFoo() {
//                 if(resumeTatal>100){    //每次最多导出100份简历
//
//                     clearInterval(resumeTime);
//                     var resumeData={
//                         source:3, // 2 前程、3智联  ----简历来源
//                         SourceFile:1, //1 人才夹、2 收件箱
//                         resumeDetailStr:resumeArr.join('AA&AA'),  //AA&AA用具分离每份简历的标识
//                         isExportComplete:exportNum==response.RecordCount?1:0, //是否全部导出完毕：1为全部导出、2为没有全部导出。
//                         exportPage:currPage,  //第几页
//                         talentFolderId:folderId  //人才夹文件夹ID
//                     }
//                     console.log(resumeTatal)
//                     $.ajax({
//                         url:'http://192.168.1.189:8083/resumeExport/resumeExport',
//                         type:'POST',
//                         async:false,
//                         data:resumeData,
//                         success:function (res) {
//                             console.log("100完毕")
//                         },
//                         error:function (res) {
//                             console.log(res)
//                         }
//                     });
//                     return
//                 }
//                 if(resumeCount==response.ResumeViewList.length) {  //导出分数与简历分数相等时请求到后台
//                     port.postMessage(zlData);//发送消息
//                     clearInterval(resumeTime);
//                     var resumeData={
//                         source:3, // 2 前程、3智联  ----简历来源
//                         SourceFile:1, //1 人才夹、2 收件箱
//                         resumeDetailStr:resumeArr.join('AA&AA'),
//                         isExportComplete:exportNum==response.RecordCount?1:0, //是否全部导出完毕
//                         exportPage:currPage,  //第几页
//                         talentFolderId:folderId  //人才夹文件夹ID
//                     }
//                     $.ajax({
//                         url:'http://192.168.1.189:8083/resumeExport/resumeExport',
//                         type:'POST',
//                         async:false,
//                         data:resumeData,
//                         success:function (res) {
//                             console.log(res)
//                         },
//                         error:function (res) {
//                             console.log(res)
//                         }
//                     });
//                 }else {
//                     var guidArr = response.ResumeViewList[resumeCount].Guid;
//                     resumePort.postMessage({id:guidArr});//发送消息
//                     resumeCount++;
//                     exportNum+=1;
//                     resumeTatal+=1;
//                 }
//             }
//             var resumeTime= setInterval(function () {  //计时器，每2秒请求一次简历详情
//                 resumeListFoo()
//             },2000)
//             resumePort.onMessage.addListener(function(response) {
//                 resumeArr.push(response);
//             });
//
//         }
//
//     }
//
// });


$("#zlBtn").on("click",function () {
    var zlListData = {
        favoriteId:folderId,
        isTemp:'n',
        resumeSourceId:'0',
        queryDateTime:'2016-08-17 15:07:09',
        pageIndex:1,
    }
    var zlData={
        curr:zlListData.pageIndex,
        zlListData:$.param(zlListData)
    }
    folderList.postMessage({folderList:'folderList'});//发送消息  简历夹列表
    // port.postMessage(zlData);//发送消息

});
$("#table").on("click",'.getresume',function () {
    var resume = $(this).data('resume');

    resumePort.postMessage({id:resume});//发送消息
})
var deliveryType;//投递类型  1：待处理  2：待沟通  3：已发出面试邀请  4：不合适

var screen = chrome.runtime.connect({name: "zlScreen"});//简历筛选
$("#pending").on("click",function () {
    console.log('开始')
    $.get("http://192.168.1.189:8082/resume/exportResumeReady",function (response) {
        console.log(response)
        for (var index in response.accountList){
            console.log(response.accountList[index])
            if(response.accountList[index].accountType == "zl"){
                accountId = response.accountList[index].accountId;//用户ID
                // needExportNum = response.accountList[index].exportCount //导出简历数
                var item = response.accountList[index];
                zlSetCookie.postMessage({cookie:item.zlCookie});//发送消息  简历夹列表
                console.log(item)
                zlSetCookie.onMessage.addListener(function (res) {

                    if(item.sourceFile=="0"){ //1:人才夹  2：投递  0：还未开始导出
                        console.log('sourceFile=0')
                        folderList.postMessage('0');
                        folderListFun()
                    }else if(item.sourceFile=="1"){
                        console.log('sourceFile=1')
                        folderList.postMessage('1');
                        folderListFun(item.folderId,item.exportPage)
                    }else if(item.sourceFile=="2"){
                        console.log('sourceFile=2')
                        deliveryType = item.deliveryType;
                        pendingFormData.SF_1_1_50 = deliveryType;
                        pendingFormData.click_search_op_type = deliveryType;
                        pendingFormData.CurrentPageNum = item.exportPage
                        screen.postMessage($.param(pendingFormData));//发送消息
                    }else {
                        console.log('sourceFile=else')
                    }
                });
            }
        }
    })
});

screen.onMessage.addListener(function(response) {
    $("#yifeng").html(response);

    for(var i=0;i<4;i++){
        if($(response).find('#zpResumeListTable').length>0){
            getScreenResumeDetail()
        }
    }

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
            var recordData = {
                deliveryType:deliveryType,
                isExportComplete:1 //是否全部导出完毕
            }
            $.ajax({
                url:'http://192.168.1.189:8082/resume/updateExportRecord',
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

        function screenResumeDetail() {
            var pages = $(".turnpageCon span.red12px").text();
            var currPage = pages.split('/')[0];  //当前页
            var totalPage = pages.split('/')[1]; //总页数
            if(screenCount==screenDetailList.length){
                var resumeData={
                    source:3, // 2 前程、3智联  ----简历来源
                    sourceFile:2,//1:人才夹，2：收件箱
                    resumeDetailStr:resumeArr.join('AA&AA'),
                };
                console.log(resumeArr);
                console.log("当前类型："+deliveryType,"当前页数："+currPage)
                $.ajax({
                    url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                    type:'POST',
                    async:false,
                    data:resumeData,
                    success:function (res) {
                        console.log(res)
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
                        screen.postMessage($.param(deliveryFormData));//发送消息
                    }else {
                        var recordData = {
                            deliveryType:deliveryType,
                            exportPage:currPage, //第几页
                            isExportComplete:1 //是否全部导出完毕
                        }
                        $.ajax({
                            url:'http://192.168.1.189:8082/resume/updateExportRecord',
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
                        CurrentPageNum:currPage+1,
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
                        id:accountId
                    }
                    $.ajax({
                        url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                        type:'POST',
                        async:false,
                        data:resumeData,
                        success:function (res) {
                            $.ajax({
                                url:'http://192.168.1.189:8082/resume/updateExportRecord',
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
                }

            }
        };
        var screenTime=setInterval(function () {
            screenResumeDetail();
        },1000);
    }
});





$("#screenDetail").on("click",function () {

    var screenDetailData = {
        resume:'300503716910',
        start:'',
        companyid:'41813721',
        pfd:'3_201'
    }
    screenDetail.postMessage(screenDetailData);//发送消息
});






var positionList = chrome.runtime.connect({name: "zlPositionList"});//职位列表

positionList.onMessage.addListener(function(response) {

});

$('#onlinePosi').on('click',function(){ //在线中职位
    var posiData={
        pageindex:'1',
        status:'3',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'2'
    }

    positionList.postMessage($.param(posiData));//发送消息
});
$('#unlinePosi').on('click',function(){ //未上线职位
    var posiData ={
        pageindex:'1',
        status:'1',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'4'
    }
    positionList.postMessage($.param(posiData));//发送消息
});
$('#offlinePosi').on('click',function(){ //以下线职位
    var posiData ={
        pageindex:'1',
        status:'4',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'3',
        substatus:'0'
    }
    positionList.postMessage($.param(posiData));//发送消息
});
$('#examinePosi').on('click',function(){ //审核中职位
    var posiData ={
        pageindex:'1',
        status:'2',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'2'
    }
    positionList.postMessage($.param(posiData));//发送消息
});
$('#nopassPosi').on('click',function(){ //未通过职位
    var posiData ={
        pageindex:'1',
        status:'6',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'2'
    }
    positionList.postMessage($.param(posiData));//发送消息

});



//待处理
var pendingFormData = {
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

//待沟通

var communFormData = {
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
//已发面试邀请
var invitedFormData = {
    CurrentPageNum:'1',
    SF_1_1_50:3,
    SF_1_1_51:'-1',
    PageType:'0',
    click_search_op_type:3,
    SF_1_1_52:'0',
    SF_1_1_49:'0',
    IsInvited:'0',
    'X-Requested-With':'XMLHttpRequest',
    PageList2:'',
};
//不合适
var improperFormData = {
    CurrentPageNum:'1',
    SF_1_1_50:4,
    SF_1_1_51:'-1',
    PageType:'0',
    click_search_op_type:4,
    SF_1_1_52:'0',
    SF_1_1_49:'0',
    IsInvited:'0',
    'X-Requested-With':'XMLHttpRequest',
    PageList2:'',
};

$("#plugBtn").on("click",function () {
    alert('plug')
});



/////////////////////**********************************************************************************************////////////////////////////
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
var accountId = ''

//简历筛选简历夹  /**尚不完善**/

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

            // for (var i=0;i<resFolderLen;i++){
            //     if(resFolder.Data[i].LevelMark!=null){
            //         console.log(resFolder.Data[i])
            //         var id = resFolder.Data[i].Id;
            //         console.log("id:"+id);
            //         console.log("favoriteId:"+favoriteId)
            //         folderId = favoriteId?favoriteId:id;
            //         // folderId = id;
            //         console.log("folderId:"+folderId)
            //         zlListData.favoriteId = folderId;
            //         var zlData={
            //             curr:zlListData.pageIndex,
            //             zlListData:$.param(zlListData)
            //         }
            //         console.log(zlData)
            //         port.postMessage(zlData);//发送消息
            //         portFun(i,resFolderLen)
            //     }
            // }
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

//监听简历夹列表
function portFun(folderIndex,resFolderLen,resFolderData) {
    port.onMessage.addListener(function(response) {
        console.log(response);
        console.log('简历夹：',resFolderData)
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
                            // $.ajax({
                            //     url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                            //     type:'POST',
                            //     async:false,
                            //     data:resumeData,
                            //     success:function (res) {
                            //         console.log("当天提交")
                            //         $.ajax({
                            //             url:'http://192.168.1.189:8082/resume/updateExportRecord',
                            //             type:'POST',
                            //             data:record,
                            //             success:function (allres) {
                            //                 console.log('当天导出完毕')
                            //             }
                            //         })
                            //     },
                            //     error:function (res) {
                            //         console.log(res)
                            //     }
                            // });
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
                            // $.ajax({
                            //     url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                            //     type:'POST',
                            //     async:false,
                            //     data:resumeData,
                            //     success:function (res) {
                            //         console.log(res)
                            if((folderIndex==resFolderLen-1)&&(currPage==pageCount)){
                                var record = {
                                    deliveryType:1,
                                    exportPage:1,  //第几页
                                    talentFolderId:folderId,  //人才夹文件夹ID
                                    isExportComplete:1, //是否全部导出完毕
                                    id:'' //账户id
                                }
                                console.log("文件夹完毕")
                                // $.ajax({
                                //     url:'http://192.168.1.189:8082/resume/updateExportRecord',
                                //     type:'POST',
                                //     async:false,
                                //     data:record,
                                //     success:function (allres) {
                                //         console.log('该用户文件夹导出完毕');
                                //         deliveryType = 1;
                                //         pendingFormData.SF_1_1_50 = deliveryType;
                                //         pendingFormData.click_search_op_type = deliveryType
                                //         screen.postMessage($.param(pendingFormData));//发送消息
                                //     }
                                // });
                                return;
                            }
                            //     },
                            //     error:function (res) {
                            //         console.log(res)
                            //     }
                            // });

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
                        resumeArr.push(response);
                    });
                }
            }
        }else {
            console.log(folderIndex,resFolderData);
            folderIndex+=1;
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
    });
}

//监听简历夹列表
// port.onMessage.addListener(function(response) {
//     console.log(response)
//     var html = '<tr><th>姓名</th><th>年龄</th><th>Gender</th><th>AuthUrl</th><th>CityId</th><th>EducationLevel</th><th>获取简历</th>></tr>';
//     for (var index in response.ResumeViewList){
//         html+="<tr><td>"+response.ResumeViewList[index].Name+"</td><td>"+response.ResumeViewList[index].Age+"</td>" +
//             "<td>"+response.ResumeViewList[index].Gender+"</td><td>"+response.ResumeViewList[index].AuthUrl+"</td>" +
//             "<td>"+response.ResumeViewList[index].CityId+"</td><td>"+response.ResumeViewList[index].EducationLevel+"</td>" +
//             "<td><button data-resume='"+response.ResumeViewList[index].Guid+"' class='getresume'>获取简历</button></td></tr>"
//     }
//     $("#table").html(html);
//     var pageCount = response.PageCount;  //总页数
//     var zlListData = {   //简历夹列表请求数据
//         favoriteId:folderId,   //简历夹ID
//         isTemp:'n',
//         resumeSourceId:'0',
//         queryDateTime:'2016-08-17 15:07:09',
//     }
//     var currPage = response.currentPage;   //当前页数，原数据没有，自己添加的
//
//     for (var ind=1;ind<=pageCount;ind++){
//         if(currPage==ind){
//             zlListData.pageIndex = ind+1;
//             var resumeArr=[];
//             var zlData={
//                 curr:ind+1,
//                 zlListData:$.param(zlListData)
//             }
//             var resumeCount=0;
//             function resumeListFoo() {
//                 if(resumeTatal>100){    //每次最多导出100份简历
//
//                     clearInterval(resumeTime);
//                     var resumeData={
//                         source:3, // 2 前程、3智联  ----简历来源
//                         SourceFile:1, //1 人才夹、2 收件箱
//                         resumeDetailStr:resumeArr.join('AA&AA'),  //AA&AA用具分离每份简历的标识
//                         isExportComplete:exportNum==response.RecordCount?1:0, //是否全部导出完毕：1为全部导出、2为没有全部导出。
//                         exportPage:currPage,  //第几页
//                         talentFolderId:folderId  //人才夹文件夹ID
//                     }
//                     console.log(resumeTatal)
//                     $.ajax({
//                         url:'http://192.168.1.189:8083/resumeExport/resumeExport',
//                         type:'POST',
//                         async:false,
//                         data:resumeData,
//                         success:function (res) {
//                             console.log("100完毕")
//                         },
//                         error:function (res) {
//                             console.log(res)
//                         }
//                     });
//                     return
//                 }
//                 if(resumeCount==response.ResumeViewList.length) {  //导出分数与简历分数相等时请求到后台
//                     port.postMessage(zlData);//发送消息
//                     clearInterval(resumeTime);
//                     var resumeData={
//                         source:3, // 2 前程、3智联  ----简历来源
//                         SourceFile:1, //1 人才夹、2 收件箱
//                         resumeDetailStr:resumeArr.join('AA&AA'),
//                         isExportComplete:exportNum==response.RecordCount?1:0, //是否全部导出完毕
//                         exportPage:currPage,  //第几页
//                         talentFolderId:folderId  //人才夹文件夹ID
//                     }
//                     $.ajax({
//                         url:'http://192.168.1.189:8083/resumeExport/resumeExport',
//                         type:'POST',
//                         async:false,
//                         data:resumeData,
//                         success:function (res) {
//                             console.log(res)
//                         },
//                         error:function (res) {
//                             console.log(res)
//                         }
//                     });
//                 }else {
//                     var guidArr = response.ResumeViewList[resumeCount].Guid;
//                     resumePort.postMessage({id:guidArr});//发送消息
//                     resumeCount++;
//                     exportNum+=1;
//                     resumeTatal+=1;
//                 }
//             }
//             var resumeTime= setInterval(function () {  //计时器，每2秒请求一次简历详情
//                 resumeListFoo()
//             },2000)
//             resumePort.onMessage.addListener(function(response) {
//                 resumeArr.push(response);
//             });
//
//         }
//
//     }
//
// });


$("#zlBtn").on("click",function () {
    var zlListData = {
        favoriteId:folderId,
        isTemp:'n',
        resumeSourceId:'0',
        queryDateTime:'2016-08-17 15:07:09',
        pageIndex:1,
    }
    var zlData={
        curr:zlListData.pageIndex,
        zlListData:$.param(zlListData)
    }
    folderList.postMessage({folderList:'folderList'});//发送消息  简历夹列表
    // port.postMessage(zlData);//发送消息

});
$("#table").on("click",'.getresume',function () {
    var resume = $(this).data('resume');

    resumePort.postMessage({id:resume});//发送消息
})
var deliveryType;//投递类型  1：待处理  2：待沟通  3：已发出面试邀请  4：不合适

var screen = chrome.runtime.connect({name: "zlScreen"});//简历筛选
$("#pending").on("click",function () {
    console.log('开始')
    $.get("http://192.168.1.189:8082/resume/exportResumeReady",function (response) {
        console.log(response)
        for (var index in response.accountList){
            console.log(response.accountList[index])
            if(response.accountList[index].accountType == "zl"){
                accountId = response.accountList[index].accountId;//用户ID
                // needExportNum = response.accountList[index].exportCount //导出简历数
                var item = response.accountList[index];
                zlSetCookie.postMessage({cookie:item.zlCookie});//发送消息  简历夹列表
                console.log(item)
                zlSetCookie.onMessage.addListener(function (res) {

                    if(item.sourceFile=="0"){ //1:人才夹  2：投递  0：还未开始导出
                        console.log('sourceFile=0')
                        folderList.postMessage('0');
                        folderListFun()
                    }else if(item.sourceFile=="1"){
                        console.log('sourceFile=1')
                        folderList.postMessage('1');
                        folderListFun(item.folderId,item.exportPage)
                    }else if(item.sourceFile=="2"){
                        console.log('sourceFile=2')
                        deliveryType = item.deliveryType;
                        pendingFormData.SF_1_1_50 = deliveryType;
                        pendingFormData.click_search_op_type = deliveryType;
                        pendingFormData.CurrentPageNum = item.exportPage
                        screen.postMessage($.param(pendingFormData));//发送消息
                    }else {
                        console.log('sourceFile=else')
                    }
                });
            }
        }
    })
});

screen.onMessage.addListener(function(response) {
    $("#yifeng").html(response);

    for(var i=0;i<4;i++){
        if($(response).find('#zpResumeListTable').length>0){
            getScreenResumeDetail()
        }
    }

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
            var recordData = {
                deliveryType:deliveryType,
                isExportComplete:1 //是否全部导出完毕
            }
            $.ajax({
                url:'http://192.168.1.189:8082/resume/updateExportRecord',
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

        function screenResumeDetail() {
            var pages = $(".turnpageCon span.red12px").text();
            var currPage = pages.split('/')[0];  //当前页
            var totalPage = pages.split('/')[1]; //总页数
            if(screenCount==screenDetailList.length){
                var resumeData={
                    source:3, // 2 前程、3智联  ----简历来源
                    sourceFile:2,//1:人才夹，2：收件箱
                    resumeDetailStr:resumeArr.join('AA&AA'),
                };
                console.log(resumeArr);
                console.log("当前类型："+deliveryType,"当前页数："+currPage)
                $.ajax({
                    url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                    type:'POST',
                    async:false,
                    data:resumeData,
                    success:function (res) {
                        console.log(res)
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
                        screen.postMessage($.param(deliveryFormData));//发送消息
                    }else {
                        var recordData = {
                            deliveryType:deliveryType,
                            exportPage:currPage, //第几页
                            isExportComplete:1 //是否全部导出完毕
                        }
                        $.ajax({
                            url:'http://192.168.1.189:8082/resume/updateExportRecord',
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
                        CurrentPageNum:currPage+1,
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
                        id:accountId
                    }
                    $.ajax({
                        url:'http://192.168.1.189:8083/resumeExport/resumeExport',
                        type:'POST',
                        async:false,
                        data:resumeData,
                        success:function (res) {
                            $.ajax({
                                url:'http://192.168.1.189:8082/resume/updateExportRecord',
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
                }

            }
        };
        var screenTime=setInterval(function () {
            screenResumeDetail();
        },1000);
    }
});





$("#screenDetail").on("click",function () {

    var screenDetailData = {
        resume:'300503716910',
        start:'',
        companyid:'41813721',
        pfd:'3_201'
    }
    screenDetail.postMessage(screenDetailData);//发送消息
});






var positionList = chrome.runtime.connect({name: "zlPositionList"});//职位列表

positionList.onMessage.addListener(function(response) {

});

$('#onlinePosi').on('click',function(){ //在线中职位
    var posiData={
        pageindex:'1',
        status:'3',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'2'
    }

    positionList.postMessage($.param(posiData));//发送消息
});
$('#unlinePosi').on('click',function(){ //未上线职位
    var posiData ={
        pageindex:'1',
        status:'1',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'4'
    }
    positionList.postMessage($.param(posiData));//发送消息
});
$('#offlinePosi').on('click',function(){ //以下线职位
    var posiData ={
        pageindex:'1',
        status:'4',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'3',
        substatus:'0'
    }
    positionList.postMessage($.param(posiData));//发送消息
});
$('#examinePosi').on('click',function(){ //审核中职位
    var posiData ={
        pageindex:'1',
        status:'2',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'2'
    }
    positionList.postMessage($.param(posiData));//发送消息
});
$('#nopassPosi').on('click',function(){ //未通过职位
    var posiData ={
        pageindex:'1',
        status:'6',
        jobpositionType:'0',
        orderByType:'1',
        orderBy:'2'
    }
    positionList.postMessage($.param(posiData));//发送消息

});



//待处理
var pendingFormData = {
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

//待沟通

var communFormData = {
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
//已发面试邀请
var invitedFormData = {
    CurrentPageNum:'1',
    SF_1_1_50:3,
    SF_1_1_51:'-1',
    PageType:'0',
    click_search_op_type:3,
    SF_1_1_52:'0',
    SF_1_1_49:'0',
    IsInvited:'0',
    'X-Requested-With':'XMLHttpRequest',
    PageList2:'',
};
//不合适
var improperFormData = {
    CurrentPageNum:'1',
    SF_1_1_50:4,
    SF_1_1_51:'-1',
    PageType:'0',
    click_search_op_type:4,
    SF_1_1_52:'0',
    SF_1_1_49:'0',
    IsInvited:'0',
    'X-Requested-With':'XMLHttpRequest',
    PageList2:'',
};

$("#plugBtn").on("click",function () {
    alert('plug')
})