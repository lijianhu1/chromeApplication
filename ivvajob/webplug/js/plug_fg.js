//构建长链接
const ivvaFgPort = chrome.runtime.connect({
  name: "ivvaFgPort"
});
let num = 0;
window.onload = function () {
  //给ivva页面添加节点并放置版本号，用于检测插件是否存在和是否需要更新
  const isSchoolRecruit = $.cookie('isSchoolRecruit');
  let installNode = document.createElement('input');
  installNode.id = 'ivva-plug';
  installNode.setAttribute('type', 'hidden');
  installNode.setAttribute('value', chrome.runtime.getManifest().version); // 把版本号放到属性里
  installNode.setAttribute('data-recruit', isSchoolRecruit); // cookie
  document.body.appendChild(installNode);
  //判断是否为校招并获取用户信息
  if(isSchoolRecruit){
    let req={
      status:"isSchoolRecruit",
      value:isSchoolRecruit
    }
    ivvaFgPort.postMessage(req);
  }


  //通过点击事件和所传递的status判断用户操作
$('#plug_trigger').click(function() {
  const comfig = JSON.parse($(this).val());
  num+=1;
  if(comfig.status === 'refresh'){ //刷新外网简历，跳到对应渠道的在线职位并触发刷新按钮
    let url = tool.url[comfig.channel].positionList.u;
    if(comfig.channel==='lg'){
      window.open(`${url}&ivtype=1`);
    }else {
      window.open(`${url}?ivtype=1`);
    }
  }else if(comfig.status==='import'){  //导入职位
    let url = tool.url[comfig.channel].positionSearch.u;
    window.open(`${url}?ivtype=1`);
  }else if(comfig.status === 'resumeSearch'){  //简历搜索,跳转至简历搜索列表即可

    if(comfig.channel==='boss'){
      window.open(`${tool.url[comfig.channel].resumeSearch.u}&ivtype=1`)
    }else {
      const url = tool.url[comfig.channel].resumeSearch.u;
      window.open(`${url}?ivtype=1`);
    }

  } else if (comfig.status === 'resumeDetail') {  //获取简历联系方式，调整至简历搜索页面并根据携带的搜索条件搜索，如仅有一份简历则跳转至详情并触发下载功能
    const resume = _matchResume(comfig);
    // 往存储中写入数据，可在插件任意地方读写
    chrome.storage.local.set({'ivResumeDetail': resume}, function() {  //将简历详情写入缓存，用于建立搜索时回显条件
      console.log('ivResumeDetail保存成功local',resume);
      if(comfig.channel==='offer'){
        const url = tool.url[comfig.channel].resumeDetail.u;
        window.open(`${url}/${comfig.id}?ivtype=1`)
      }else if(comfig.channel==='zb'){
        const url = tool.url[comfig.channel].resumeSearchId.u;
        window.open(`${url}?ivtype=1&ivId=${comfig.id}`)
      }else {
        const url = tool.url[comfig.channel].resumeSearch.u;
        window.open(`${url}?ivtype=1&ivId=${comfig.id}&reload=1`);
      }
    });
    // if(comfig.channel==='offer'){
    //   const url = tool.url[comfig.channel].resumeDetail.u;
    //   window.open(`${url}/${comfig.id}?ivtype=1`)
    // }else if(comfig.channel==='zb'){
    //   const url = tool.url[comfig.channel].resumeSearchId.u;
    //   window.open(`${url}?ivtype=1&ivId=${comfig.id}`)
    // }else {
    //   const url = tool.url[comfig.channel].resumeSearch.u;
    //   window.open(`${url}?ivtype=1&ivId=${comfig.id}&reload=1`);
    // }
  } else if (comfig.status === 'positionRelease') {   //职位发布，跳转至发布职位页面并回显职位名、招聘人数、职位描述这2个条件即可
    // if(comfig.channel==="boss"){
    //   window.open(`${tool.url.boss.positionRelease.u}?ivtype=1&mu=%2Fbossweb%2Fjobedit%2F0.html`);
    // }else {
    //   const url = tool.url[comfig.channel].positionRelease.u;
    //   window.open(`${url}?ivtype=1`);
    // }
    const url = tool.url[comfig.channel].positionRelease.u;
    if (comfig.channel==='qc'||comfig.channel==='lp'){

      window.open(`${tool.url[comfig.channel].positionRelease.u}&ivtype=1`);
    } else  {
      window.open(`${url}?ivtype=1`);
    }
    let req={
      status:'setPositionDetail',
      positionDetail: comfig.positionDetail
    };
    console.log(req)
    ivvaFgPort.postMessage(req);
  }else if(comfig.status === "searchPositionList"){  //搜索外网职位列表，跳转至职位列表并爬取对应的职位列表回显至ivva
    let url="";
    console.log(comfig);
    if(comfig.channel==='qc'){
      url = `${tool.url.qc.searchExternalPosition.u}${comfig.condition.keyWord==""?"%20":comfig.condition.keyWord},2,${comfig.condition.pageIndex}.html?ivtype=1`;
    }else if(comfig.channel==='zl'){
      url = `${tool.url.zl.searchExternalPosition.u}&start=${60*(comfig.condition.pageIndex-1)}&kw=${comfig.condition.keyWord}`
    }else if(comfig.channel==='cjol'){
      url=`${tool.url.cjol.searchExternalPosition.u}&KeyWord=${comfig.condition.keyWord}&page=${comfig.condition.pageIndex||1}`
    }else if(comfig.channel==='lp'){
      url = `${tool.url.lp.searchExternalPosition.u}&curPage=${comfig.condition.pageIndex-1}&key=${comfig.condition.keyWord}`
    }else if(comfig.channel==='boss'){
      url = `${tool.url.boss.searchExternalPosition.u}?query=${comfig.condition.keyWord}&page=${comfig.condition.pageIndex||1}`
    }else if(comfig.channel==='boss'){
      url = `${tool.url.boss.searchExternalPosition.u}?query=${comfig.condition.keyWord}&page=${comfig.condition.pageIndex||1}`
    }else if(comfig.channel === 'lg'){
      // url = `${tool.url.lg.searchExternalPosition.u}`;
      url = `${tool.url.lg.searchExternalPosition.u}${encodeURIComponent(comfig.condition.keyWord)}?city=%E5%85%A8%E5%9B%BD&cl=false&fromSearch=true&labelWords=&suginput=`
    }else if(comfig.channel === 'tc58'){
      url = `${tool.url.tc58.searchExternalPosition.u}pn${comfig.condition.pageIndex}/?key=${comfig.condition.keyWord}`
    }else if(comfig.channel === 'zb'){
      url = `${tool.url.zb.searchExternalPosition.u}`
    }
    let req={
      status:'searchPositionList',
      channel:comfig.channel,
      url,
      methodType:tool.url[comfig.channel].searchExternalPosition.t,
      comfig
    };
    ivvaFgPort.postMessage(req);

  }else if(comfig.status==="externalPositionDetail"){  //外网职位详情，跳转至职位详情并将详情导入
    let req = {
      status:"externalPositionDetail",
      url:comfig.url
    };
    ivvaFgPort.postMessage(req);
  }else if(comfig.status==="radarResumeDetail"){  //雷达详情，跟获取简历联系方式功能一致
    // comfig.channel="zl";
    const req = {
      status:"getIvTabId"
    };
    ivvaFgPort.postMessage(req);
    const url = tool.url[comfig.channel].resumeSearch.u;
    const resume =_matchResume(comfig);
    
    // tool.LocalStorage.set('ivRradarResume',resume);
    // 往存储中写入数据
    chrome.storage.local.set({'ivRradarResume': resume}, function() {
      console.log('ivRradarResume保存成功local',resume);
    });
    window.open(`${url}?ivStatus=radarResume`);
    // window.open(`${url}?ivtype=1&ivStatus=radarResume&resume=${encodeURIComponent(JSON.stringify($.param(resume)))}`);
  }
});

  chrome.extension.onMessage.addListener(request=>{   //建立一次性请求监听
    if(request.status==="positionList"){  //职位列表
      console.log(request);
      $("#plug_infoWrap").val(JSON.stringify(request)).click()
    }else if(request.status==='updataRadarResume'){ //更新雷达简历
      $("#getResumeBtn").click()
    }

  });
  ivvaFgPort.onMessage.addListener(function (msg) {   //简历长请求监听
    if(msg.status==='positionList'){
      $("#plug_infoWrap").val(JSON.stringify(msg)).click()
    }else if(msg.status==='externalPositionDetail'){
      $("#plug_infoWrap").val(JSON.stringify(msg)).click()
    };
  });

  function _matchResume(comfig) {     //匹配简历详情格式
    console.log(comfig)
    let resume = {
      channel:comfig.channel,
      resumeId:comfig.resumeId
    };
    for (const item of comfig.resumeMap){
      switch (item.customFieldModuleId) {
        case "1":
          for(const childItem of item.childList){
            switch (childItem.customFieldId) {
              case 42:
                resume.school = childItem.fieldValue;
                break;
              case 5:
                resume.sex = childItem.fieldValue;
                break;
              default:
                break;
            }
          }
          break;
        case "3":
          if(item.childList.length>0){
            resume.evaluation = item.childList[0].fieldValue&&item.childList[0].fieldValue.substring(0,30);
          }
          break;
        case "4":
          if(item.childList.length>0){
            resume.company = item.childList[0][0].fieldValue;
          }
          break;
        default:
          break;
      }
    };
    return resume
  }
};


