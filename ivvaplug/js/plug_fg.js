const ivvaFgPort = chrome.runtime.connect({
  name: "ivvaFgPort"
}); //构建链接
window.onload = function () {
  //设置插件，用于检测插件是否存在
  const isSchoolRecruit = $.cookie('isSchoolRecruit');
  let installNode = document.createElement('input');
  installNode.id = 'ivva-plug';
  installNode.setAttribute('type', 'hidden');
  installNode.setAttribute('value', chrome.runtime.getManifest().version); // 把版本号放到属性里
  installNode.setAttribute('data-recruit', isSchoolRecruit); // cookie
  document.body.appendChild(installNode);
  if(isSchoolRecruit){
    let req={
      status:"isSchoolRecruit",
      value:isSchoolRecruit
    }
    ivvaFgPort.postMessage(req);
  }
  
$('#plug_trigger').click(function() {
  const comfig = JSON.parse($(this).val());
  if(comfig.status === 'refresh'){ //刷新

    let url = tool.url[comfig.channel].positionList.u;
    if(comfig.channel==='lg'){
      window.open(`${url}&ivtype=1`);
    }else {
      window.open(`${url}?ivtype=1`);
    }
  }else if(comfig.status==='import'){  //导入职位
    let url = tool.url[comfig.channel].positionSearch.u;
    window.open(`${url}?ivtype=1`);
  }else if(comfig.status === 'resumeSearch'){  //简历搜索

    if(comfig.channel==='boss'){
      window.open(`${tool.url[comfig.channel].resumeSearch.u}&ivtype=1`)
    }else {
      const url = tool.url[comfig.channel].resumeSearch.u;
      window.open(`${url}?ivtype=1`);
    }

  } else if (comfig.status === 'resumeDetail') {  //获取简历联系方式
    if(comfig.channel==='offer'){
      const url = tool.url[comfig.channel].resumeDetail.u;
      window.open(`${url}/${comfig.id}?ivtype=1`)
    }else {
      const url = tool.url[comfig.channel].resumeSearch.u;
      window.open(`${url}?ivtype=1&ivId=${comfig.id}&reload=1`);
    }
  } else if (comfig.status === 'positionRelease') {   //职位发布
    // if(comfig.channel==="boss"){
    //   window.open(`${tool.url.boss.positionRelease.u}?ivtype=1&mu=%2Fbossweb%2Fjobedit%2F0.html`);
    // }else {
    //   const url = tool.url[comfig.channel].positionRelease.u;
    //   window.open(`${url}?ivtype=1`);
    // }
    const url = tool.url[comfig.channel].positionRelease.u;
    if (comfig.channel==='qc'){

      window.open(`${tool.url.qc.positionRelease.u}&ivtype=1`);
    } else  {
      window.open(`${url}?ivtype=1`);
    }
    let req={
      status:'setPositionDetail',
      positionDetail: comfig.positionDetail
    };
    console.log(req)
    ivvaFgPort.postMessage(req);
  }else if(comfig.status === "searchPositionList"){  //搜索外网职位列表
    let url="";
    console.log(comfig);
    if(comfig.channel==='qc'){
      url = `${tool.url.qc.searchExternalPosition.u}${comfig.condition.keyWord==""?"%20":comfig.condition.keyWord},2,${comfig.condition.pageIndex}.html?ivtype=1`;
    }else if(comfig.channel==='zl'){
      url = `${tool.url.zl.searchExternalPosition.u}&start=${60*comfig.condition.pageIndex}&kw=${comfig.condition.keyWord}`
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
    }
    let req={
      status:'searchPositionList',
      channel:comfig.channel,
      url,
      methodType:tool.url[comfig.channel].searchExternalPosition.t,
      comfig
    };
    ivvaFgPort.postMessage(req);
    ivvaFgPort.onMessage.addListener(function (msg) {
      if(msg.status==='positionList'){
        console.log(msg)
        $("#plug_infoWrap").val(JSON.stringify(msg)).click()
      };
    });
  }else if(comfig.status==="externalPositionDetail"){  //外网职位详情
    let req = {
      status:"externalPositionDetail",
      url:comfig.url
    }
    ivvaFgPort.postMessage(req);
    ivvaFgPort.onMessage.addListener(function (msg) {
      if(msg.status==='externalPositionDetail'){
        $("#plug_infoWrap").val(JSON.stringify(msg)).click()
      };
    });
  }else if(comfig.status==="radarResumeDetail"){  //雷达详情
    const url = tool.url[comfig.channel].resumeSearch.u;
    window.open(`${url}?ivtype=1`);
  }
});

  chrome.extension.onMessage.addListener(request=>{
    if(request.status==="positionList"){  //职位列表
      console.log(request);
      $("#plug_infoWrap").val(JSON.stringify(request)).click()
    }

  })
};


