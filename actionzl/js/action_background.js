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
            console.log('rd', cookie)
        });
//设置cookie
        chrome.cookies.set({
            'url': 'https://rd2.zhaopin.com',
            'name': cookieName,
            'value': cooKieVal,
            'secure': false,
            'httpOnly': false
        }, function (cookie) {
            console.log('rd2', cookie)
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
//监听简历夹列表
var deliveryType;//投递类型  1：待处理  2：待沟通  3：已发出面试邀请  4：不合适


var readyUrl = 'http://192.168.1.189:8082/resume/exportResumeReady',
    exportUrl = 'http://192.168.1.189:8083/resumeExport/resumeExport',
    updateExport = 'http://192.168.1.189:8082/resume/updateExportRecord';


chrome.extension.onConnect.addListener(function (port) {

    if (port.name == "zlAction") {
        port.onMessage.addListener(function (req) {
            var beginCount = 0;
             function beginZl() {
                $.get(readyUrl, {isGetCookie: req.isGetCookie}, function (zlActionRes) {
                    console.log(zlActionRes)
                    if (zlActionRes.code == 200) {
                        for (var index in zlActionRes.accountList) {
                            console.log(zlActionRes.accountList[index]);
                            if (zlActionRes.accountList[index].accountType == "zl") {
                                var item = zlActionRes.accountList[index];
                                needExportNum = item.exportCount //导出简历数
                                accountId = item.accountId;//用户ID
                                console.log(item)
                                var cookieData = new cookieFoo();
                                if (req.isGetCookie == 0) {
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
                                }, 2000)
                            }
                        }
                    } else if(zlActionRes.code == 301&&beginCount<2){
                        beginCount++;
                        beginZl()
                    }
                })
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
                                // port.postMessage(zlData);//发送消息
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
                                                                                console.log('当天导出完毕')
                                                                            }
                                                                        })
                                                                    },
                                                                    error: function (res) {
                                                                        console.log(res)
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
                                                                }
                                                                console.log("文件夹索引：" + folderIndex);
                                                                console.log(resumeArr)
                                                                GetResumeDetailList()
                                                                $.ajax({
                                                                    url: exportUrl,
                                                                    type: 'POST',
                                                                    async: false,
                                                                    data: resumeData,
                                                                    success: function (res) {
                                                                        console.log(res)
                                                                        var record = {
                                                                            deliveryType: 1,
                                                                            exportPage: 1,  //第几页
                                                                            talentFolderId: folderId,  //人才夹文件夹ID
                                                                            isExportComplete: 0, //是否全部导出完毕
                                                                            id: accountId //账户id
                                                                        }
                                                                        $.ajax({
                                                                            url: updateExport,
                                                                            type: 'POST',
                                                                            async: false,
                                                                            data: record,
                                                                            success: function (allres) {
                                                                                if ((folderIndex == resFolderLen - 1) && (currPage == pageCount)) {
                                                                                    deliveryType = 1;
                                                                                    screenData.SF_1_1_50 = deliveryType;
                                                                                    screenData.click_search_op_type = deliveryType
                                                                                    console.log(screenData)
                                                                                    screenList(screenData)
                                                                                }
                                                                            }
                                                                        });
                                                                    },
                                                                    error: function (res) {
                                                                        console.log(res)
                                                                    }
                                                                });

                                                            } else {
                                                                var guid = resumeListData.ResumeViewList[resumeCount].Guid;
                                                                $.get('https://rd.zhaopin.com/resumepreview/resume/viewone/1/' + guid, function (guidRes) {
                                                                    resumeArr.push(guidRes);
                                                                    resumeCount++;  //该页简历分数自加
                                                                    resumeTatal += 1; //该次已导出总分数
                                                                })

                                                            }
                                                        }

                                                        var resumeTime = setInterval(function () {  //计时器，每2秒请求一次简历详情
                                                            resumeListFoo()
                                                        }, 3000)
                                                    }
                                                    port.postMessage(resumeArr);
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
                    var screenDetailArr = [];
                    $.each($(screenHtml).find('td .link'), function (index, item) {
                        var ahref = $(item).attr('href').split('//')[1];   //根据a标签获取详情连接地址
                        screenDetailList.push(ahref)
                    });
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
                                };
                                console.log(screenDetailArr);
                                console.log("当前类型：" + deliveryType, "当前页数：" + currPage, "总页数：" + totalPage)
                                $.ajax({
                                    url: exportUrl,
                                    type: 'POST',
                                    async: false,
                                    data: resumeData,
                                    success: function (res) {
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
                                    },
                                    error: function (res) {
                                        console.log(res)
                                    }
                                });
                                clearInterval(screenTime);
                                if (currPage == totalPage) {
                                    if (deliveryType < 4) {
                                        deliveryType += 1;
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
                                            id: accountId
                                        }
                                        $.ajax({
                                            url: updateExport,
                                            type: 'POST',
                                            data: recordData,
                                            async: false,
                                            success: function (allres) {
                                                console.log('简历投递导出完毕');
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
                                                    console.log('当天导出完毕')
                                                }
                                            })
                                        },
                                        error: function (res) {
                                            console.log(res)
                                        }
                                    });
                                    return;
                                } else {
                                    $.get('https://' + screenDetailList[screenCount], function (res) {
                                        screenDetailArr.push(res)
                                    })
                                    screenCount++;
                                    resumeTatal += 1;
                                    console.log(screenCount)
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
                        }

                    }


                })
            }
        });
    }
});


// var cookieText = 'pcc=r=1102920069&t=1; __xsptplus30=30.1.1503758331.1503758331.1%234%7C%7C%7C%7C%7C%23%23Njh8dhOXh18E9fm-LJdt3KqXL5PRBnb9%23; c_zwgl=b02863e00b08ed488b16dac14c0f563f; c_hrtool=2ef31ee6117a0b9201bc8c13ed559914; c_xcsj=6d1a8261364bf20242e12dcdc2422587; c_zxcp=ec8f03ffb238b540f2a312e86dfcfb19; c_fgzx=a9856487a055cdd08997c8e20fb8bffe; c_isnew=1; c_hyjb=6aa91c8aae344bca19ce823473e59a17; editiontype=v3; loginreleased=1; dywez=95841923.1503823717.3.2.dywecsr=rd2.zhaopin.com|dyweccn=(referral)|dywecmd=referral|dywectr=undefined|dywecct=/rdapply/resumes/resume/index; __zpWAM=1503758334814.414135.1503758335.1503823717.2; __zpWAMs1=1; __zpWAMs2=1; __utmt=1; businessInfo=33343F692C71567945320475416A5E71006A51684A6B2C74763348795C6B46345A695171537941320075496A58710F6A2A68356B447404334279526B423452695A715979463208753C6A2671096A5D68486B497405334D795F6B4334596959712B7905324275576A08715B6A04684A6B37747F334879106B1934056906710C791C325675176A0C714C6A00681F6B0D745D331B790D6B4A342B693E7156794F3261753D6A5671066A8; JSsUserInfo=2F7927735966536453715568506A427956735766556457715E68256A34795E731E660D640B710B680E6A127906730A6602641C710C68076A0E790C730A6602645F713068276A477919730C660A640A710268016A1F790D7303661D640D710B681D6A15790D7303665E6437713168546A4B79587326662164597153685E6A427950735C66576456715768526A3B79377359665D64497157685E6A5A79527353665F6450715568526A3B792F73596655645F713068286A477929732966526454715C68516A4F7950735466566456715E683C6A2E795E735566556456715E687; JSShowname=zhonghengxintong; urlfrom=121126445; urlfrom2=121126445; adfcid=none; adfcid2=none; adfbid=0; adfbid2=0; getMessageCookie=1; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1503758331; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1503826794; JsOrglogin=378036119; at=be9f3c847537443188603cdc401b3d47; Token=be9f3c847537443188603cdc401b3d47; rt=34b067d041844c6a92de0581f30b6988; uiioit=3D752C6452695A6A06355164587559645D695B6A07355E6453752A642B69566A0535546459755A645E695E6A0235506453751; xychkcontr=13121567%2c0; lastchannelurl=https%3A//passport.zhaopin.com/org/login; utype=2; ihrtkn=; NewPinUserInfo=; isNewUser=1; cgmark=2; NewPinLoginInfo=; JsNewlogin=126012039; RDpUserInfo=; __utma=269921210.1409729518.1503758332.1503823717.1503826547.3; __utmb=269921210.54.9.1503826806586; __utmc=269921210; __utmz=269921210.1503823717.2.2.utmcsr=rd2.zhaopin.com|utmccn=(referral)|utmcmd=referral|utmcct=/RdApply/Resumes/Resume/Index; __utmv=269921210.|2=Member=126012039=1; RDsUserInfo=3D753D68576459754B685C6458754868586458754A6853645375356824645575136819640075166804640F751D6805641D7542683F642675446851642A753D68576459754A685B645A7548685F645E754E6851642A75376857643719B6EAC81A2EF9E733702AC9F58426630338E31539923753752D682764557542682F6425754468026407751D68056400750B682A6459754F68596446751A6805640575426839643C7544685B64537538683E645575416847645A754E684A6459754E6850645C754B6851642C753D68576459754A685B645A7548685F645E754E6851642C75376857643719B6EAC81A2EF9E733702AC9F58426630338E315399237537535682764557549685A645875486851642B753D6857645E754A685C6453752C683E64557548685A645975426829642975446829642B754868596459754B685B645D754F685D64597542682E642975446829642B754868596459754B685B645D754F685D64597542682E642B754468596453752A68236455754A6851642175296857645A754D685864467548685B645A7542682B64247544685A6453753; dywea=95841923.68249295896907580.1503758331.1503815817.1503823717.3; dywec=95841923; dywem=95841923.y; dyweb=95841923.113.9.1503826806577'
// var resumeCookieList = cookieText.split(';');
// //去除空格
// function trim(str) {
//     return str.replace(/(^\s+)|(\s+$)/g, "");
// }
//
// for (var index in resumeCookieList) {
//     var cookieName = trim(resumeCookieList[index].split('=')[0]);
//     var ind = resumeCookieList[index].indexOf('=');
//     var cooKieVal = resumeCookieList[index].slice(ind+1)
// //设置cookie
//     chrome.cookies.set({
//         'url':'https://rd.zhaopin.com',
//         'name':cookieName,
//         'value':cooKieVal,
//         'secure':false,
//         'httpOnly':false
//     }, function(cookie){
//     });
// //设置cookie
//     chrome.cookies.set({
//         'url':'https://rd2.zhaopin.com',
//         'name':cookieName,
//         'value':cooKieVal,
//         'secure':false,
//         'httpOnly':false
//     }, function(cookie){
//     });
// }