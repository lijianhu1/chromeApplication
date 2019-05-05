let [positionDetail = "", channelList = [], isSchoolRecruit = 0, lgReferer = "", ivTabId = "", ivvaPositionList = [], downloadStatus = false,openRadarResumeStatus=false,ivRadarResumeId=""] = [];
let userInfo={};
/*positionDetail=职位详情,channelList=渠道列表,isSchoolRecruit=是否校招,lgReferer=拉勾Referer,ivTabId=当前标签页Id,ivvaPositionList=职位列表 downloadStatus="下载状态 openRadarResumeStatus=是否打开雷达简历 ivRadarResumeId=雷达简历id*/

window.onload = () => {
  /**
   * 注册切换标签页时的事件，用于改变图标是否高亮
   */
  chrome.tabs.onSelectionChanged.addListener(function (tabId, selectInfo) {
    setIcon()
  });


  function getIvvaPosition(port) { //获取iv用户在招职位 //获取职位
    let reqdata = {
      recruitStatus: 1,
      isSchoolRecruit: isSchoolRecruit,
    };
    if(userInfo.roleType>3){
      reqdata.isNetWorkCollection = 1
    }
    $.ajax({
      url: tool.ajaxUrl + '/Recommend/getAllPositionList',
      type: "get",
      data: reqdata,
      success: function (res) {
        if (res.success) {
          ivvaPositionList = res.data;
          if (port) {
            port.postMessage({
              positionList: ivvaPositionList
            });
          }
        }
      }
    })
  };

  //获取渠道列表
  function getChannelList(message, port) {
    let reqdata = {
      recruitType: isSchoolRecruit,
      isSchoolRecruit: isSchoolRecruit
    };
    $.ajax({
      url: tool.ajaxUrl + '/ChannelSet/getAllNetWorkChannelList',
      type: "get",
      data: reqdata,
      success: function (res) {
        if (res.success) {
          channelList = res.data;
          if (message) {
            for (let channel of channelList) {
              if (message.data.channelType == channel.source) {
                message.data.resumeChannerlId = channel.id;
                break;
              }
            }
            message.data.isCheckNetWork = 1;
            importResume(message, port)
          }
        }
      }
    })
  }

  //导入简历
  function importResume(message, port) {
    message.data.isSchoolRecruit = isSchoolRecruit
    $.ajax({
      url: tool.ajaxUrl + "/resumeEdit/addResumeInfo",
      type: "POST",
      data: message.data,
      success: function (res) {

        if(res.success){
          res.data.roleType = userInfo.roleType;
        }
        let config = {
          status: 'importResume',
          data: res
        };
        port.postMessage(config);
      },
      error(e){
        console.log(e)
      }
    })
  };

  //设置图标
  function setIcon() {
    chrome.tabs.getSelected(null, function (tab) {
      const currentUrl = tab.url;
      if ((currentUrl.indexOf(tool.url.qc.resumeDetail.u) > -1) || (currentUrl.indexOf(tool.url.zl.resumeDetail.u) > -1) || (currentUrl.indexOf(tool.url.qc.resumeDetailFolder.u) > -1) || (currentUrl.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)
         || currentUrl.indexOf(tool.url.lg.resumeDetail2.u) > -1|| currentUrl.indexOf(tool.url.lg.resumeDetail3.u) > -1 || currentUrl.indexOf(tool.url.tc58.resumeDetail.u) > -1 ||
        currentUrl.indexOf(tool.url.lp.resumeDetail.u) > -1 || currentUrl.indexOf(tool.url.cjol.resumeDetail.u) > -1 || currentUrl.indexOf(tool.url.offer.resumeDetail.u) > -1
        || currentUrl.indexOf(tool.url.zl.resumeDetailFolder.u) > -1|| currentUrl.indexOf(tool.url.zb.resumeDetail.u) > -1) {
          chrome.browserAction.setIcon({path: "img/icon.png"});

          //boss和lg需特殊配置
      } else if (currentUrl.indexOf(tool.url.boss.resumeSearch.u) > -1|| currentUrl.indexOf(tool.url.lg.resumeDetail.u) > -1) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {status: "getPageIconStatus"}, function (response) {
            pageSetIcon(response&&response.type||0)
          });
        });

        // chrome.extension.sendMessage({
        //   status: "getPageIconStatus"
        // },function (response) {
        //   console.log('getPageIconStatus',response)
        //   // pageSetIcon(response.type)
        // })
      } else {
        chrome.browserAction.setIcon({path: "img/icon19.png"})
      }
    });
  };

  //用于检测简历是否重复、疑似
  function talentSearch(message, port) {
    let jobYear = "";
    let educationId = "";
    if (message.data.jobYear) {
      jobYear = message.data.jobYear.split("年")[0]
    }
    if (message.data.education) {
      let educationList = tool.getEducation();
      for (let val of educationList) {
        if (val.value.indexOf(message.data.education) != -1) {
          educationId = val.id;
          break;
        }
      }
    }
    let reqdata = {
      resume_company_t: $.trim(message.data.company),
      resume_schoolName_t: $.trim(message.data.school),
      resume_sex_i: message.data.sex,
      resumeIdentification: message.data.id,
      phone:message.data.mobile||'',
      // resume_keyWords_t: message.data.keyword,
      // resume_jobYear_i:`${jobYear},${jobYear}`,
      // resume_education_i:educationId,
      // livingCity:message.data.city,
      // pageIndex: 1,
      // pageSize: 30,
      // isCheckNetWork: 1,
      isSchoolRecruit: isSchoolRecruit
    };
    for (let i in reqdata) {
      if (reqdata[i] == "") {
        delete reqdata[i]
      }
    }
    $.ajax({
      // url: tool.ajaxUrl + "/talentSearch/talentSearch",
      url: tool.ajaxUrl + "/resume/resumeDuplicateChecking",
      type: "POST",
      data: reqdata,
      success: function (res) {
        /*res.data.isCover = 1;
        for(let i in res.data.listData){
          res.data.listData[i].isPermissionView = 0;
          res.data.listData[i].ownerName = 'zqs';
        }*/
        // if(userInfo.roleType){
          let config = {
            status: 'validateResume',
            data: res,
            roleType:userInfo.roleType
          };
          port.postMessage(config);
        // }//else {
        //   getUserInfo();
        // }
      }
    })
  }

  //导入外网职位详情
  function externalPositionDetail(url, port) {
    $.ajax({
      url,
      type: "get",
      success: function (response) {
        let req = {
          status: "externalPositionDetail",
          data: response
        }
        port.postMessage(req);
      }
    })
  };

  //动态设置图标
  function pageSetIcon(type) {
    if (type) {
      chrome.browserAction.setIcon({path: "img/icon.png"});
    } else {
      chrome.browserAction.setIcon({path: "img/icon19.png"})
    }
  }

  //获取职位列表
  function getPositionList(url, channel, port, comfig,methodType) {
    let data={
      "p.querySwitch":0,
      "p.searchSource":"default",
      "p.keyword":"前端开发",
      "p.keywordType":1,
      "p.pageNo":2,
      "p.pageSize":40,
      "p.sortBy":"postdate",
      "p.statistics":false,
      "p.totalRow":1000,
      "p.cachePageNo":1,
      "p.cachePosIds":"3986097,3805961,3706222,3976823,4023049,3808769,3061921,4023929,3742940,3269242,3850744,3964538,4011357,2516711,3046481,3702080,3284373,2807028,4015923,3502345,3804055,4034255,4010175,4015917,3983670,3760438,3926987,3926984,4019041,3674939,3984720,3908892,4014889,3930481,3667732,3724086,3928634,4026744,4013659,3901849,1603574,3976628,3822674,3910969,3763038,3815581,3844153,3646900,3961686,3997798,4036799,4036345,3919640,3936542,3637524,4030246,4031632,3955012,3929148,3927860,4021063,4031782,4036984,4040091,1509656,3899643,3458943,3924907,4037389,4004034,3984278,3984228,3984266,4040923,4037980,4024114,3925313,3857494,3827751,4036585,4032578,4016197,4012358,4040048,3938065,3667731,3881998,3966651,3933827,4038430,3991396,3991365,3984483,3994086,3994072,3927475,3913310,3984722,3906428,3958947,3735946,3986870,3740023,3960449,4017370,3955403,4017403,3325491,4034817,3767429,4037716,4037713,4037702,2117732,3258538,4037431,3931943,4029257,4020309,4020305,4016431,4016429,3461272,3836400,4028041,4033289,4033267,3951152,4009091,4021396,4014195,4009104,4009099,4009085,4023200,3787745,3998982,3796544,3981762,3981474,3047937,3610371,3938050,2786066,1523523,217381,3169891,4025543,4005333,4002431,4022041,3940379,4005016,3978359,3899619,3871950,3999966,3807409,4009509,4012669,3956640,3956613,3940312,4010306,3764400,3764345,3926090,3903395,4003026,4003567,3930791,3955292,3980892,3902960,3897454,3825791,3737555,3980890,3878201,3934723,3934715,3943512,3915456,3902924,3902913,3902518,3812596,3867066,3940502,3940481,3940478,3955876,3902800,3912233,3938153,3934961,3798451,3906361,3906358,3917661",
      // "p.cachePosUpddates":"201903131059,201903131057,201903131057,201903131056,201903131056,201903131056,201903131056,201903131055,201903131053,201903131052,201903131052,201903131052,201903131052,201903131052,201903131052,201903131051,201903131051,201903131051,201903131051,201903131051,201903131050,201903131050,201903131050,201903131050,201903131050,201903131050,201903131050,201903131050,201903131050,201903131048,201903131048,201903131047,201903131047,201903131047,201903131047,201903131046,201903131046,201903131045,201903131045,201903131045,201903131045,201903131045,201903131045,201903131044,201903131043,201903131043,201903131042,201903131042,201903131042,201903131042,201903131042,201903131042,201903131042,201903131042,201903131041,201903131041,201903131041,201903131040,201903131040,201903131040,201903131038,201903131038,201903131038,201903131037,201903131037,201903131037,201903131036,201903131036,201903131035,201903131035,201903131035,201903131035,201903131034,201903131034,201903131034,201903131034,201903131034,201903131033,201903131033,201903131033,201903131033,201903131033,201903131033,201903131033,201903131032,201903131032,201903131032,201903131032,201903131031,201903131031,201903131031,201903131031,201903131031,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131030,201903131029,201903131028,201903131028,201903131027,201903131027,201903131026,201903131026,201903131026,201903131026,201903131026,201903131026,201903131025,201903131025,201903131025,201903131025,201903131025,201903131025,201903131025,201903131025,201903131025,201903131025,201903131025,201903131024,201903131023,201903131023,201903131023,201903131023,201903131022,201903131022,201903131022,201903131022,201903131022,201903131022,201903131022,201903131022,201903131021,201903131021,201903131020,201903131020,201903131020,201903131020,201903131020,201903131020,201903131020,201903131020,201903131020,201903131019,201903131019,201903131019,201903131019,201903131019,201903131019,201903131018,201903131018,201903131018,201903131017,201903131017,201903131017,201903131017,201903131016,201903131016,201903131016,201903131016,201903131016,201903131016,201903131016,201903131015,201903131015,201903131015,201903131015,201903131015,201903131015,201903131015,201903131015,201903131014,201903131014,201903131014,201903131014,201903131014,201903131014,201903131013,201903131013,201903131013,201903131013,201903131012,201903131012,201903131012",
      "p.jobnature":15,
      "p.comProperity":0,
      "p.salary":-1,
      "p.highSalary":100000,
      "p.salarySearchType":1,
      "p.includeNeg":1,
      "p.inputSalary":-1,
      "p.workYear1":-1,
      "p.workYear2":-11,
      "p.degreeId1":10,
      "p.degreeId2":70,
      "p.posPostDate":366,
      "p.otherFlag":3,
    };
    $.ajax({
      url,
      // data:data,
      type: methodType,
      success(response) {
        let positionList = [];
        let totalPage="";
        if (channel === 'qc') {
          let listHtml = $(response).find('#resultList .el').not('.title');
          listHtml.each(function () {
            let item = {
              jobName: $(this).find('.t1 a').attr('title'),
              company: $(this).find('.t2 a').attr('title'),
              city: $(this).find('.t3').text(),
              positionURL: $(this).find('.t1 a').attr('href'),
              id: $(this).find('.t1 .delivery_jobid').val(),
            };
            positionList.push(item)
          });
          const pageText = $(response).find(".p_in .td").text();
          totalPage = pageText.split('共')[1].split('页')[0];
        } else if (channel === 'zl') {
          let list = response.data.results;
          for (let i in list) {
            let item = {
              jobName: list[i].jobName,
              company: list[i].company.name,
              city: list[i].city.display,
              positionURL: list[i].positionURL,
              id: list[i].company.number,
            };
            positionList.push(item)
          }
          totalPage = response.data.numTotal
        } else if (channel === 'cjol') {
          let listHtml = $(response.JobListHtml)[1];
          $(listHtml).find('ul').each(function () {
            let item = {
              jobName: $(this).find('.list_type_first a').text(),
              company: $(this).find('.list_type_second a').text(),
              city: $(this).find('.list_type_third').text(),
              positionURL: $(this).find('.list_type_first a').attr('href'),
              id: $(this).find('.list_type_checkbox .checkbox').val()
            };
            positionList.push(item)
          })
        } else if (channel === 'lp') {
          let listHtml = $(response).find('.sojob-result .sojob-list li');
          listHtml.each(function () {
            let item = {
              jobName: $(this).find('.job-info h3 a').text(),
              company: $(this).find('.company-info .company-name a').text(),
              city: $(this).find('.job-info .condition .area').text(),
              positionURL: $(this).find('.job-info h3 a').attr('href'),
              id: $(this).find('.job-info h3 a').attr('data-promid'),
            };
            positionList.push(item)
          })
        } else if (channel === 'boss') {
          let listHtml = $(response).find('#main .job-list ul li');
          listHtml.each(function () {
            let item = {
              jobName: $(this).find('.info-primary .job-title').text(),
              company: $(this).find('.info-company h3.name a').text(),
              city: $(this).find('.info-primary').children('p').html().split('<em')[0],
              positionURL: 'https://www.zhipin.com' + $(this).find('.info-primary .job-title').parent().attr('href'),
              id: $(this).find('.info-primary .job-title').parent().attr('data-jid'),
            };
            positionList.push(item)
          })
        } else if (channel === 'tc58') {
          let listHtml = $(response).find("#list_con .job_item");
          listHtml.each(function () {
            let item = {
              jobName: $(this).find(".job_name a").text(),
              company: $(this).find(".job_comp a").text(),
              city: "",
              positionURL: $(this).find(".job_name a").attr('href'),
              id: $(this).find(".job_name").attr('sortid'),
            };
            positionList.push(item);
            totalPage = $(response).find('.total_page').text()
          });
        } else if (channel === 'lg') {
          let reqdata = {
            first: false,
            pn: comfig.condition.pageIndex,
            kd: comfig.condition.keyWord,
          };
          $.ajax({
            url:"https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false",
            type:"post",
            data:reqdata,
            headers: {
              Accept: "application/json, text/javascript, */*; q=0.01",
              'X-Requested-With':'XMLHttpRequest'
            },
            success(res){
              if(res.success){
                for(let position of res.content.positionResult.result){
                  let item={
                    jobName:position.positionName,
                    company:position.companyFullName,
                    city:position.city,
                    positionURL:`https://www.lagou.com/jobs/${position.positionId}.html`,
                    id:position.positionId,
                  }
                  positionList.push(item);
                }
                let reqdata = {
                  status: "positionList",
                  data: positionList
                };
                port.postMessage(reqdata);
              }

            }
          })
        }else if(channel==="zb"){
          console.log($(response).find(".job_name").text())
        }
        if(channel !== 'lg'){
          let reqdata = {
            status: "positionList",
            data: positionList,
            totalPage
          };
          port.postMessage(reqdata);
        }

      },
      beforeSend(xhr){
      }
    });

  }

  //获取用户信息
  function getUserInfo(){
    let reqdata={
      isSchoolRecruit
    };
    $.ajax({
      url: tool.ajaxUrl + '/user/getUserInfoPc',
      type: "get",
      data: reqdata,
      success: function (res) {
        if (res.success) {
          userInfo = res.data;
          getIvvaPosition();
          getChannelList();
        }
      }
    })
  }

  //一次性请求监听
  chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.status) {
      case 'downloadResume':  //下载简历
        downloadStatus = request.value;
        sendResponse({status: "searchResult"});
        break;
      case 'isDownload': //是否下载 或打开雷达简历
        if (downloadStatus) {
          sendResponse({status: "isDownload"});
          if (request.stop) {  //已点击下载
            downloadStatus = false
          }
        }else if(openRadarResumeStatus){  //打开雷达简历

          sendResponse({status: "isOpenRadarResume",ivRadarResumeId});
          openRadarResumeStatus = false;
          ivRadarResumeId="";
        }
        break;
      case 'getPositionDetail':  //获取简历详情
        if (positionDetail) {
          sendResponse({status: "getPositionDetail", data: positionDetail});
          positionDetail = "";
        }
        break;
      case "pageSetIcon":
        pageSetIcon(request.type);
        break;
      case "qcPositionList": //前程职位列表，这3个职位由于编码格式问题，不能后台请求，直接前端打开页面爬取数据
      case "lgPositionList":
      case "zbPositionList":
        if(ivTabId){
          let reqdata={
            status:"positionList",
            data:request.data,
            totalPage:request.totalPage
          };
          chrome.tabs.sendMessage(ivTabId, reqdata);
        }
        break;
      case "openRadarResume":  //打开雷达简历详情
        openRadarResumeStatus = request.value;
        ivRadarResumeId = request.ivRadarResumeId;

        break;
      case "updataRadarResume":
        $.ajax({
          url: tool.ajaxUrl + '/radar/updateRadarResumeInfo',
          type: "post",
          data: request.resume,
          success: function (res) {
            let reqdata={
              status:"updataRadarResume",
            };
            if(ivTabId){
              chrome.tabs.sendMessage(ivTabId, reqdata);
            }

          }
        });
        break;
      default:
        break;
    }
  });

  //长请求监听
  chrome.extension.onConnect.addListener(port=>{
    if (port.name === 'ivvaImportResume'){
      port.onMessage.addListener(message=>{
        switch (message.status) {
          case  'importResume': //导入简历
            for (let i in message.data) {
              if (message.data[i] == "") {
                delete message.data[i]
              }
            };
            console.log(tool.LocalStorage.get('userInfo'),"tool.LocalStorage.get('userInfo')");
            if (channelList.length === 0) {
              getChannelList(message, port)
            } else {
              for (let channel of channelList) {
                if (message.data.channelType == channel.source) {
                  message.data.resumeChannerlId = channel.id;
                  break;
                }
              }
              message.data.isCheckNetWork = 1;
              importResume(message, port)
            }
            break;
          case 'validateResume'://验证简历是否重复
            talentSearch(message, port)
            break;
          default:
            break;
        }
      })
    }else if(port.name === "ivvaPositionList"){
      if (ivvaPositionList.length === 0) {
        getIvvaPosition(port)
      } else {
        port.postMessage({
          positionList: ivvaPositionList
        });
      }
    }else if(port.name === "ivvaFgPort"){
      port.onMessage.addListener(message=>{
        switch (message.status) {
          case "setPositionDetail": //保存职位详情
            positionDetail = message.positionDetail;
            break;
          case 'searchPositionList': //搜索职位列表
            if(message.channel==='lg'){
              lgReferer = message.url
            }
            if(message.channel==='qc'){ //前程单独处理
              ivTabId = port.sender.tab.id;
              window.open(message.url, '', 'width=10,height=10');
            }else if(message.channel==='lg'){
              ivTabId = port.sender.tab.id;
              let url = `${message.url}&ivtype=1&ivPage=${message.comfig.condition.pageIndex}`;
              window.open(url, '', 'width=10,height=10');
            }else if(message.channel==='zb'){
              ivTabId = port.sender.tab.id;
              let url = `${message.url}&ivtype=1&ivPage=${message.comfig.condition.pageIndex}&p.keyword=${encodeToGb2312(message.comfig.condition.keyWord)}`;
              window.open(url, '', 'width=10,height=10');
            }else {
              getPositionList(message.url, message.channel, port, message.comfig,message.methodType);
            }
            break;
          case 'externalPositionDetail':
            externalPositionDetail(message.url, port);
            break;
          case 'isSchoolRecruit':
            isSchoolRecruit = message.value;
            getUserInfo();

            break;
          case "getIvTabId":
            ivTabId = port.sender.tab.id;
            break;
          default:
            break;
        }
      })
    }
  });

  //请求头添加参数
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      if (details.type === 'xmlhttprequest') {
        var exists = false;
        for (var i = 0; i < details.requestHeaders.length; ++i) {
          if (details.requestHeaders[i].name === 'Referer') {
            exists = true;
            details.requestHeaders[i].value = "http://www.cmogu.cn/bcsaas/login";
            break;
          }
        }
        console.log(details)
        if (!exists) {
          details.requestHeaders.push({
            name: 'Referer',
            value: lgReferer
          });
        }
        return {requestHeaders: details.requestHeaders};
      }
    },
    {urls: ['http://www.cmogu.cn/*']},
    ["blocking", "requestHeaders"]
  );
}
