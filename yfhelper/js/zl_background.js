var cookieFoo = function () {
};  //新建全局函数
cookieFoo.prototype.set = function (cookieText) {  //给全局函数添加设置cookie方法
    var resumeCookieList = cookieText.split(';');
    for (var index in resumeCookieList) {
        var cookieName = trim(resumeCookieList[index].split('=')[0]);
        var ind = resumeCookieList[index].indexOf('=');
        var cooKieVal = resumeCookieList[index].slice(ind + 1)
//设置cookie
        chrome.cookies.set({
            'url': 'https://rd.zhaopin.com',
            'name': cookieName,
            'value': cooKieVal,
            'secure': false,
            'httpOnly': false
        }, function (cookie) {
        });
//设置cookie
        chrome.cookies.set({
            'url': 'https://rd2.zhaopin.com',
            'name': cookieName,
            'value': cooKieVal,
            'secure': false,
            'httpOnly': false
        }, function (cookie) {
        });
    }
};
//去除空格
function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
}


var resumeTatal = 0; //本次总导出简历分数
var folderId = '';//文件夹id
var needExportNum = 200;
var accountId = '';
var compUserId='';
//监听简历夹列表
var deliveryType;//投递类型  1：待处理  2：待沟通  3：已发出面试邀请  4：不合适

//本地
// var readyUrl = 'http://192.168.1.189:8082/resume/exportResumeReady',
//     exportUrl = 'http://192.168.1.189:8083/resumeExport/resumeExport',
//     updateExport = 'http://192.168.1.189:8082/resume/updateExportRecord';
//线上
var readyUrl = 'http://ats.yifengjianli.com/resume/exportResumeReady',
    exportUrl = 'http://ats.yifengjianli.com/resume/exportResume',
    updateExport = 'http://ats.yifengjianli.com/resume/updateExportRecord';


chrome.extension.onConnect.addListener(function (port) {
    if (port.name == "zlAction") {
        port.onMessage.addListener(function (req) {
             function beginZl(overdue) {
                $.get(readyUrl, {isGetCookie: overdue?0:(req.isGetCookie?1:0)}, function (zlActionRes) {
                    console.log(zlActionRes)
                    if (zlActionRes.code == 200) {
                        chrome.browserAction.setIcon({path: 'img/icon.png'});
                        for (var index in zlActionRes.accountList) {
                            console.log(zlActionRes.accountList[index]);
                            if (zlActionRes.accountList[index].accountType == "zl") {
                                var item = zlActionRes.accountList[index];
                                needExportNum = item.exportCount //导出简历数
                                accountId = item.accountId;//用户ID
                                compUserId = item.compUserId
                                console.log(item)
                                var cookieData = new cookieFoo();
                                if (req.isGetCookie == 0||overdue) {
                                    console.log('无本地cookie');
                                    cookieData.set(item.zlCookie);
                                    chrome.cookies.set({
                                        'url': 'http://test.yifengjianli.com',
                                        'name': 'zl_cookie',
                                        'value': (item.zlCookie).split(';').join('LIJIANHUI'),
                                        'secure': false,
                                        'httpOnly': false
                                    }, function (cookie) {
                                    });
                                    console.log(item.zlCookie);
                                } else {
                                    console.log('有本地cookie');
                                    cookieData.set((req.zlCookie).split('LIJIANHUI').join(';'));
                                    console.log(req.zlCookie)
                                }
                                setTimeout(function () {
                                    if (item.sourceFile == "0") {//1:人才夹  2：投递  0：还未开始导出
                                        console.log('sourceFile=0')
                                        folderListFun()
                                    } else if (item.sourceFile == "1") {
                                        folderListFun(item.folderId, item.exportPage)
                                    } else if (item.sourceFile == "2") {
                                        console.log('sourceFile=2')
                                        deliveryType = item.deliveryType;
                                        screenData.SF_1_1_50 = deliveryType;
                                        screenData.click_search_op_type = deliveryType;
                                        screenData.CurrentPageNum = item.exportPage;
                                        screenList(screenData)
                                    }
                                }, 2000);

                            }
                        }
                    }
                });

            }
            beginZl()

            function folderListFun(favoriteId, pageInd) {
                $.get('https://rd2.zhaopin.com/RdApply/Resumes/Resume/GetFavoriteFolderList', function (folderResponse) {
                    console.log(folderResponse);
                    var zlListData = {
                        favoriteId: '',
                        isTemp: 'n',
                        resumeSourceId: '0',
                        queryDateTime: '2016-08-17 15:07:09',
                        pageIndex: pageInd ? pageInd : 1,
                    }


                    if (folderResponse.Code == 200) {
                        var resFolderLen = folderResponse.Data.length;
                        var folderIndex = 0; //简历列表索引
                        function folderItemFun() {  //单个文件夹遍历
                            if (folderResponse.Data[folderIndex].LevelMark != null) {
                                console.log(folderResponse.Data[folderIndex])
                                var id = folderResponse.Data[folderIndex].Id;
                                console.log("id:" + id);
                                console.log("favoriteId:" + favoriteId)
                                folderId = favoriteId ? favoriteId : id;
                                // folderId = id;
                                console.log("folderId:" + folderId)
                                zlListData.favoriteId = folderId;
                                var zlData = {
                                    curr: zlListData.pageIndex,
                                    zlListData: zlListData
                                }
                                console.log(zlData)
                                function GetResumeDetailList() {
                                    $.ajax({
                                        url: 'https://rd2.zhaopin.com/RdApply/Resumes/Resume/GetResumeList',
                                        type: 'post',
                                        data: zlData.zlListData,
                                        async: false,
                                        success: function (resumeListData) {
                                            console.log('文件夹列表', resumeListData);
                                            resumeListData.currentPage = zlData.curr;
                                            if (resumeListData.ResumeViewList.length > 0) {
                                                var pageCount = resumeListData.PageCount;  //总页数
                                                zlListData = {   //简历夹列表请求数据
                                                    favoriteId: folderId,   //简历夹ID
                                                    isTemp: 'n',
                                                    resumeSourceId: '0',
                                                    queryDateTime: '2016-08-17 15:07:09',
                                                }
                                                var currPage = resumeListData.currentPage;
                                                for (var ind = 1; ind <= pageCount; ind++) {
                                                    if (currPage == ind) {
                                                        zlListData.pageIndex = ind + 1;
                                                        var resumeArr = [];
                                                        zlData = {
                                                            curr: ind + 1,
                                                            zlListData: zlListData
                                                        }
                                                        var resumeCount = 0;

                                                        function resumeListFoo() {
                                                            console.log(resumeTatal)
                                                            if (resumeTatal > needExportNum) {    //每次最多导出100份简历
                                                                clearInterval(resumeTime);
                                                                var resumeData = {
                                                                    source: 3, // 2 前程、3智联  ----简历来源
                                                                    sourceFile: 1, //1 人才夹、2 收件箱
                                                                    resumeDetailStr: resumeArr.join('AA&AA'),  //AA&AA用具分离每份简历的标识
                                                                    compUserId:compUserId
                                                                }
                                                                var record = {
                                                                    exportPage: currPage,  //第几页
                                                                    talentFolderId: folderId,  //人才夹文件夹ID
                                                                    id: accountId, //账户id
                                                                    sourceFile: 1, //1 人才夹、2 收件箱

                                                                }

                                                                console.log(record)
                                                                $.ajax({
                                                                    url: exportUrl,
                                                                    type: 'POST',
                                                                    async: false,
                                                                    data: resumeData,
                                                                    success: function (res) {
                                                                        console.log("当天提交")
                                                                        $.ajax({
                                                                            url: updateExport,
                                                                            type: 'POST',
                                                                            data: record,
                                                                            success: function (allres) {
                                                                                console.log('当天导出完毕');
                                                                                chrome.browserAction.setIcon({path: 'img/icon19.png'});
                                                                            }
                                                                        })
                                                                    },
                                                                    error: function (res) {
                                                                        console.log(res);
                                                                        chrome.browserAction.setIcon({path: 'img/icon19.png'});
                                                                    }
                                                                });
                                                                return
                                                            }
                                                            if (resumeCount == resumeListData.ResumeViewList.length) {  //导出分数与简历分数相等时请求到后台

                                                                clearInterval(resumeTime);
                                                                var resumeData = {
                                                                    source: 3, // 2 前程、3智联  ----简历来源
                                                                    sourceFile: 1, //1 人才夹、2 收件箱
                                                                    resumeDetailStr: resumeArr.join('AA&AA'),
                                                                    compUserId:compUserId
                                                                }
                                                                console.log("文件夹索引：" + folderIndex);
                                                                console.log(resumeArr)
                                                                $.ajax({
                                                                    url: exportUrl,
                                                                    type: 'POST',
                                                                    async: false,
                                                                    data: resumeData,
                                                                    success: function (res) {
                                                                        console.log(res)
                                                                        if(res.code==200){
                                                                            var record = {
                                                                                deliveryType: 1,
                                                                                exportPage: parseInt(currPage)+1,  //第几页
                                                                                talentFolderId: folderId,  //人才夹文件夹ID
                                                                                id: accountId //账户id
                                                                            }
                                                                            $.ajax({
                                                                                url: updateExport,
                                                                                type: 'POST',
                                                                                async: false,
                                                                                data: record,
                                                                                success: function (allres) {
                                                                                    GetResumeDetailList()
                                                                                    if ((folderIndex == resFolderLen - 1) && (currPage == pageCount)) {
                                                                                        deliveryType = 1;
                                                                                        screenData.SF_1_1_50 = deliveryType;
                                                                                        screenData.click_search_op_type = deliveryType
                                                                                        console.log(screenData)
                                                                                        screenList(screenData)
                                                                                    }
                                                                                }
                                                                            });
                                                                        }

                                                                    },
                                                                    error: function (res) {
                                                                        console.log(res);
                                                                        chrome.browserAction.setIcon({path: 'img/icon19.png'});
                                                                    }
                                                                });

                                                            } else {
                                                                var guid = resumeListData.ResumeViewList[resumeCount].Guid;
                                                                $.ajax({
                                                                    url:'https://rd.zhaopin.com/resumepreview/resume/viewone/1/' + guid,
                                                                    type:'get',
                                                                    success:function (guidRes) {
                                                                        resumeArr.push(guidRes);
                                                                        resumeCount++;  //该页简历分数自加
                                                                        resumeTatal += 1; //该次已导出总分数
                                                                    },
                                                                    error:function (err) {
                                                                        console.log('err',err)
                                                                        clearInterval(resumeTime);
                                                                        $.get('resume/clearZlCookie',function (res) {
                                                                            console.log('终止：',res)
                                                                        })
                                                                    }
                                                                })

                                                            }
                                                        }

                                                        var resumeTime = setInterval(function () {  //计时器，每2秒请求一次简历详情
                                                            resumeListFoo()
                                                        }, 3000)
                                                    }
                                                }

                                            } else {
                                                folderIndex += 1;
                                                zlListData.pageIndex = 1
                                                if (folderIndex >= resFolderLen) {
                                                    deliveryType = 1;
                                                    screenData.SF_1_1_50 = deliveryType;
                                                    screenData.click_search_op_type = deliveryType
                                                    console.log(screenData)
                                                    screenList(screenData)
                                                    // return;
                                                } else {
                                                    folderItemFun()
                                                }
                                            }
                                        }
                                    })
                                }

                                GetResumeDetailList()
                                // portFun(i,resFolderLen)

                            } else {
                                if (folderIndex > resFolderLen) return;
                                folderIndex += 1;
                                folderItemFun()
                            }

                        }
                        folderItemFun()
                    }else {
                        beginZl(true)
                    }
                })
            }
            //*********投递************//
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
            var screenHtml = document.createElement('div');
            screenHtml.id = 'screenHtml';
            function screenList(screenFormData) {
                $.post('https://rd2.zhaopin.com/rdapply/resumes/apply/search?SF_1_1_38=2,9&orderBy=CreateTime', screenFormData, function (response) {
                    screenHtml.innerHTML = response;
                    var screenDetailList = [];
                    var screenDate = [];
                    var screenDetailArr = [];
                    var zlTableTr = $(screenHtml).find('#zpResumeListTable tbody tr[data-type=1]')
                    $.each(zlTableTr,function (index,item) {
                        var alink = $(item).find('td .link').attr('href');
                        var linkDate = $(item).find('td:last').attr('title').split(' ')[0];
                        screenDetailList.push(alink)
                        screenDate.push(linkDate)
                    })
                    console.log(screenDetailList,screenDate)
                    // $.each($(screenHtml).find('td .link'), function (index, item) {
                    //     var ahref = $(item).attr('href').split('//')[1];   //根据a标签获取详情连接地址
                    //     screenDetailList.push(ahref)
                    // });
                    if (screenDetailList.length > 0) {
                        var screenCount = 0;
                        var pages = $(screenHtml).find('.turnpageCon span.red12px').text();
                        var currPage = pages.split('/')[0];  //当前页
                        var totalPage = pages.split('/')[1]; //总页数
                        function screenResumeDetail() {
                            if (screenCount == screenDetailList.length) {
                                var resumeData = {
                                    source: 3, // 2 前程、3智联  ----简历来源
                                    sourceFile: 2,//1:人才夹，2：收件箱
                                    resumeDetailStr: screenDetailArr.join('AA&AA'),
                                    compUserId:compUserId
                                };
                                console.log(screenDetailArr);
                                console.log("当前类型：" + deliveryType, "当前页数：" + currPage, "总页数：" + totalPage)
                                $.ajax({
                                    url: exportUrl,
                                    type: 'POST',
                                    async: false,
                                    data: resumeData,
                                    success: function (res) {
                                        if(res.code==200){
                                            var recordData = {
                                                deliveryType: deliveryType,
                                                exportPage: parseInt(currPage) + 1, //第几页
                                                sourceFile: 2,
                                                id: accountId
                                            }
                                            $.ajax({
                                                url: updateExport,
                                                type: 'POST',
                                                data: recordData,
                                                async: false,
                                                success: function (updateExportRes) {
                                                    console.log(updateExportRes)
                                                }
                                            })
                                        }

                                    },
                                    error: function (res) {
                                        console.log(res)
                                    }
                                });
                                clearInterval(screenTime);
                                if (currPage == totalPage) {
                                    if (deliveryType < 4) {
                                        deliveryType = parseInt(deliveryType)+1;
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
                                            PageList2: '',
                                        };
                                        screenList(deliveryFormData)
                                    } else {
                                        var recordData = {
                                            deliveryType: deliveryType,
                                            exportPage: 1, //第几页
                                            sourceFile: 2,
                                            id: accountId,
                                            isExportComplete:1
                                        }
                                        $.ajax({
                                            url: updateExport,
                                            type: 'POST',
                                            data: recordData,
                                            async: false,
                                            success: function (allres) {
                                                console.log('简历投递导出完毕');
                                                chrome.browserAction.setIcon({path: 'img/icon19.png'});
                                                return;
                                            }
                                        })
                                    }
                                } else if (currPage < totalPage) {
                                    var deliveryFormData = {
                                        CurrentPageNum: ++currPage,
                                        SF_1_1_50: deliveryType,
                                        SF_1_1_51: '-1',
                                        PageType: '0',
                                        click_search_op_type: deliveryType,
                                        SF_1_1_52: '0',
                                        SF_1_1_49: '0',
                                        IsInvited: '0',
                                        'X-Requested-With': 'XMLHttpRequest',
                                        PageList2: '',
                                    };
                                    screenList(deliveryFormData)
                                }
                            } else {
                                if (resumeTatal > needExportNum) {
                                    var resumeData = {
                                        source: 3, // 2 前程、3智联  ----简历来源
                                        sourceFile: 2,//1:人才夹，2：收件箱
                                        resumeDetailStr: screenDetailArr.join('AA&AA'),
                                        compUserId:compUserId
                                    }
                                    var recordData = {
                                        deliveryType: deliveryType,
                                        exportPage: currPage, //第几页
                                        id: accountId,
                                        sourceFile: 2
                                    }
                                    $.ajax({
                                        url: exportUrl,
                                        type: 'POST',
                                        async: false,
                                        data: resumeData,
                                        success: function (res) {
                                            $.ajax({
                                                url: updateExport,
                                                type: 'POST',
                                                data: recordData,
                                                async: false,
                                                success: function (allres) {
                                                    console.log('当天导出完毕');
                                                    chrome.browserAction.setIcon({path: 'img/icon19.png'});
                                                    $.get('resume/clearZlCookie',function (res) {
                                                        console.log('终止：',res)
                                                    })
                                                    return
                                                }
                                            })
                                        },
                                        error: function (res) {
                                            console.log(res);
                                            chrome.browserAction.setIcon({path: 'img/icon19.png'});
                                        }
                                    });
                                    return;
                                } else {
                                    $.ajax({
                                        url:'https:'+screenDetailList[screenCount],
                                        type:'GET',
                                        success:function (res) {
                                            var detaliData = res+'BBdateBB'+screenDate[screenCount]
                                            screenDetailArr.push(detaliData);
                                            screenCount++;
                                            resumeTatal += 1;
                                        },
                                        error:function (err) {
                                            if (err){
                                                $.get('resume/clearZlCookie',function (res) {
                                                    console.log('终止：',res)
                                                })
                                                clearInterval(screenTime)
                                            }
                                        }
                                    })
                                }
                            }
                        };
                        var screenTime = setInterval(function () {
                            screenResumeDetail();
                        }, 3000);
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
                                PageList2: '',
                            };
                            screenList(deliveryFormData)
                        }else {
                            $.get('resume/clearZlCookie',function (res) {
                                console.log('终止：',res)
                            })
                            chrome.browserAction.setIcon({path: 'img/icon19.png'});
                        }
                    }
                })
            }
        });
    };

});
