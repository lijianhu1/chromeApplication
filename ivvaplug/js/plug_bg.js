let positionDetail = ""; //职位详情
let channelList = [];  //渠道列表
let isSchoolRecruit = 0;  //是否校招
let lgReferer = ""; //拉勾Referer
let ivTabId=""; //用于前程tab id
window.onload = function () {
  getIvvaPosition();
  getChannelList();
  setIcon();

  //设置cookie
  chrome.cookies.set({
    'url': 'https://www.lagou.com',
    'name': 'user_trace_token',
    'value': '20190115182414-b4f0e498-18af-11e9-b29c-525400f775ce',
    'domain': '.lagou.com',
    'secure': false,
    'httpOnly': false
  }, function (cookie) {
  });


  chrome.extension.onConnect.addListener(function (port) {
    if (port.name === 'ivvaImportResume') {
      port.onMessage.addListener(message => {
        if (message.status === 'importResume') {   //导入简历
          for (let i in message.data) {
            if (message.data[i] == "") {
              delete message.data[i]
            }
          }
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
        } else if (message.status === 'validateResume') {  //验证简历是否重复
          talentSearch(message, port)
        }
      });
    } else if (port.name === "ivvaPositionList") {
      if (ivvaPositionList.length === 0) {
        getIvvaPosition(port)
      } else {
        port.postMessage({
          positionList: ivvaPositionList
        });
      }

    } else if (port.name === "ivvaFgPort") {
      port.onMessage.addListener(message => {
        if (message.status === "setPositionDetail") {  //保存职位详情
          positionDetail = message.positionDetail;
        } else if (message.status === 'searchPositionList') {
          if(message.channel==='lg'){
            lgReferer = message.url
          }
          console.log(message);
          if(message.channel==='qc'){ //前程单独处理
            ivTabId = port.sender.tab.id;
            console.log('前程单独处理',ivTabId);
            window.open(message.url, '', 'width=10,height=10');
          }else {
            getPositionList(message.url, message.channel, port, message.comfig,message.methodType);
          }
          
        } else if (message.status === "externalPositionDetail") {
          externalPositionDetail(message.url, port)
        } else if (message.status === 'isSchoolRecruit') {
          isSchoolRecruit = message.value
          getIvvaPosition()
          getChannelList()
          console.log(message)
        }
      })
    }
  });

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
      resume_company_t: message.data.company,
      resume_schoolName_t: message.data.school,
      resume_sex_i: message.data.sex,
      // resume_keyWords_t: message.data.keyword,
      // resume_jobYear_i:`${jobYear},${jobYear}`,
      // resume_education_i:educationId,
      // livingCity:message.data.city,
      pageIndex: 1,
      pageSize: 30,
      isCheckNetWork: 1,
      isSchoolRecruit: isSchoolRecruit
    };
    for (let i in reqdata) {
      if (reqdata[i] == "") {
        delete reqdata[i]
      }
    }
    $.ajax({
      url: tool.ajaxUrl + "/talentSearch/talentSearch",
      type: "POST",
      data: reqdata,
      success: function (res) {
        let config = {
          status: 'validateResume',
          data: res
        };
        port.postMessage(config);
      }
    })
  }

  function importResume(message, port) {
    message.data.isSchoolRecruit = isSchoolRecruit
    $.ajax({
      url: tool.ajaxUrl + "/resumeEdit/addResumeInfo",
      type: "POST",
      data: message.data,
      success: function (res) {
        let config = {
          status: 'importResume',
          data: res
        };
        port.postMessage(config);
      }
    })
  }

  /**
   * 注册切换标签页时的事件
   */
  chrome.tabs.onSelectionChanged.addListener(function (tabId, selectInfo) {
    setIcon()
  });

  //设置图标
  function setIcon() {
    chrome.tabs.getSelected(null, function (tab) {
      const currentUrl = tab.url;
      if ((currentUrl.indexOf(tool.url.qc.resumeDetail.u) > -1) || (currentUrl.indexOf(tool.url.zl.resumeDetail.u) > -1) || (currentUrl.indexOf(tool.url.qc.resumeDetailFolder.u) > -1)|| (currentUrl.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)
        || currentUrl.indexOf(tool.url.lg.resumeDetail.u) > -1 || currentUrl.indexOf(tool.url.lg.resumeDetail2.u) > -1 || currentUrl.indexOf(tool.url.tc58.resumeDetail.u) > -1 ||
        currentUrl.indexOf(tool.url.lp.resumeDetail.u) > -1 || currentUrl.indexOf(tool.url.cjol.resumeDetail.u) > -1 || currentUrl.indexOf(tool.url.offer.resumeDetail.u) > -1
        || currentUrl.indexOf(tool.url.zl.resumeDetailFolder.u) > -1) {
        chrome.browserAction.setIcon({path: "img/icon.png"});

      } else if (currentUrl.indexOf(tool.url.boss.resumeSearch.u) > -1) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {status: "getPageIconStatus"}, function (response) {
            pageSetIcon(response.type)
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


//动态设置图标
  function pageSetIcon(type) {
    if (type) {
      chrome.browserAction.setIcon({path: "img/icon.png"});
    } else {
      chrome.browserAction.setIcon({path: "img/icon19.png"})
    }
  }

//将data数据以桌面通知的方式显示给用户
  function _showDataOnPage(data) {
    //显示一个桌面通知
    if (window.webkitNotifications) {
      var notification = window.webkitNotifications.createNotification(
        '温馨提醒',  // icon url - can be relative
        '通知的title!',  // notification title
        data  // notification body text
      );
      notification.show();
      // 设置3秒后，将桌面通知dismiss
      setTimeout(function () {
        notification.cancel();
      }, 3000);
    } else if (chrome.notifications) {
      var opt = {
        type: 'basic',
        title: '温馨提醒!',
        message: data,
        iconUrl: 'img/icon.png',
      }
      chrome.notifications.create('', opt, function (id) {
        setTimeout(function () {
          chrome.notifications.clear(id, function () {
          });
        }, 3000);
      });
    } else {
      alert('亲，你的浏览器不支持啊！');
    }
  }

  let ivvaPositionList = [];

  function getIvvaPosition(port) {
    //获取职位
    let reqdata = {
      recruitStatus: 1,
      isSchoolRecruit: isSchoolRecruit
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
  let downloadStatus = false;
  chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.status === 'downloadResume') {
        downloadStatus = request.value;
        sendResponse({status: "searchResult"});
      } else if (request.status === 'isDownload') {
        if (downloadStatus) {
          sendResponse({status: "isDownload"});
          if (request.stop) {  //已点击下载
            downloadStatus = false
          }
        }
      } else if (request.status === "getPositionDetail") {  //获取发布职位所需的信息
        if (positionDetail) {
          sendResponse({status: "getPositionDetail", data: positionDetail});
          positionDetail = "";
        }
      } else if (request.status === 'pageSetIcon') {
        pageSetIcon(request.type)
      }else if(request.status ==='qcPositionList'){  //前程职位列表
        if(ivTabId){
          let reqdata={
            status:"positionList",
            data:request.data
          }
          chrome.tabs.sendMessage(ivTabId, reqdata);
        }
      }
    }
  );

  function getPositionList(url, channel, port, comfig,methodType) {
    $.ajax({
      url,
      type: methodType,
      success(response) {
        let positionList = [];
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
          })
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
            positionList.push(item)
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
                }
                port.postMessage(reqdata);
              }

            }
          })
        }
        if(channel !== 'lg'){
          let reqdata = {
            status: "positionList",
            data: positionList
          }
          port.postMessage(reqdata);
        }

      },
      beforeSend(xhr){
      }
    });

  }

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

  chrome.webRequest.onHeadersReceived.addListener(function (details) {
    details.responseHeaders.push({name: 'Content-Type', value: "charset=GBK"});
    return {responseHeaders: details.responseHeaders};
  }, {urls: ["https://search.51job.com/*"]}, ["responseHeaders", "blocking"]);


  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      if (details.type === 'xmlhttprequest') {
        var exists = false;
        for (var i = 0; i < details.requestHeaders.length; ++i) {
          if (details.requestHeaders[i].name === 'Referer') {
            exists = true;
            details.requestHeaders[i].value = 'https://www.51job.com/';
            break;
          }
        }
        if (!exists) {
          details.requestHeaders.push({
            name: 'Referer',
            value: 'https://www.51job.com/'
          });
        }
        return {requestHeaders: details.requestHeaders};
      }
    },
    {urls: ['https://search.51job.com/*']},
    ["blocking", "requestHeaders"]
  );


  // chrome.webRequest.onHeadersReceived.addListener(function (details) {
  //   details.responseHeaders.push({name: 'Content-Type', value: "application/x-www-form-urlencoded; charset=UTF-8"});
  //   return {responseHeaders: details.responseHeaders};
  // }, {urls: ["https://www.lagou.com/*"]}, ["responseHeaders", "blocking"]);
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
      if (details.type === 'xmlhttprequest') {
        var exists = false;
        for (var i = 0; i < details.requestHeaders.length; ++i) {
          if (details.requestHeaders[i].name === 'Referer') {
            exists = true;
            details.requestHeaders[i].value = lgReferer;
            break;
          }
        }
        if (!exists) {
          details.requestHeaders.push({
            name: 'Referer',
            value: lgReferer
          });
        }
        return {requestHeaders: details.requestHeaders};
      }
    },
    {urls: ['https://www.lagou.com/*']},
    ["blocking", "requestHeaders"]
  );

};


