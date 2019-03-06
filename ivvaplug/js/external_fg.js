const externalPort = chrome.runtime.connect({
  name: "externalPort"
});
let resumeId = "";
let channel = "";
window.onload = function () {
  const href = window.location.href;
  //判断是否为简历详情 改变图标
  if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1)|| (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)||
     href.indexOf(tool.url.lg.resumeDetail.u)>-1||href.indexOf(tool.url.lg.resumeDetail2.u)>-1||href.indexOf(tool.url.tc58.resumeDetail.u)>-1||
    href.indexOf(tool.url.lp.resumeDetail.u)>-1||href.indexOf(tool.url.cjol.resumeDetail.u)>-1||href.indexOf(tool.url.offer.resumeDetail.u)>-1
    ||href.indexOf(tool.url.zl.resumeDetailFolder.u)>-1) {
    createTips('简历')
  }else if(href.indexOf(tool.url.boss.resumeSearch.u)>-1){
      $(".frame-container").contents().on("click",'#search-list li a',function () {
        inspectResume()
      });
    function inspectResume(){
      let resumetimer = setTimeout(()=>{
        let resumeLen = $('.dialog-resume-full').length;
        if(resumeLen===0){
          inspectResume();
          chrome.extension.sendMessage({
            status:"pageSetIcon",
            type:0
          });
        }else {
          chrome.extension.sendMessage({
            status:"pageSetIcon",
            type:1
          });
          createTips('简历')
        }
      },1000)
    }
  }


  const ivtype = tool.getUrlParam('ivtype');

  if (ivtype) {
    if (href.indexOf(tool.url.zl.positionList.u) !== -1) { //智联刷新
      $('.k-table__footer .k-checkbox__inner').click();
      $(`.k-table__footer .k-button[data-action='normal-refresh']`)[0].click()
    } else if (href.indexOf(tool.url.qc.positionList.u) !== -1) { //前程刷新
      $("#radSelactALLd").click();
      $("#batch_refresh")[0].click();
    }else if(href.indexOf(tool.url.lp.positionList.u) !== -1){
      $('.select-all .checkboxui').click();
      $('.float-left .btn-light.btn-small[data-selector="link-refresh"]')[0].click();

    }else if (href.indexOf(tool.url.zl.positionRelease.u) !== -1 || href.indexOf(tool.url.qc.positionRelease.u) !== -1|| href.indexOf(tool.url.lg.positionRelease.u) !== -1
      || href.indexOf(tool.url.cjol.positionRelease.u) !== -1|| href.indexOf(tool.url.tc58.positionRelease.u) !== -1
      || href.indexOf(tool.url.offer.positionRelease.u) !== -1) { //职位发布
      chrome.extension.sendMessage({
        status: "getPositionDetail"
      }, function (response) {
        if(href.indexOf(tool.url.zl.positionRelease.u) !== -1){  //智联
          // setTimeout(function () {
            $(".k-form-item_name .k-input input").val(response.data.jobName);
            $(".k-form-item_people .k-form-item__content .k-input__inner").val(response.data.number);
            $(".k-form-item_describe .jqte_editor").html(response.data.describe)
          // },200)
        }else if(href.indexOf(tool.url.qc.positionRelease.u) !== -1){
          $("#jobname-input .input").val(response.data.jobName);
          $("#hirenum-input .input").val(response.data.number);
          $("#jobdesc-editor .h-frame").contents().find("body").html(response.data.describe)
        }else if(href.indexOf(tool.url.lg.positionRelease.u) !== -1){
          $('#positionName').val(response.data.jobName)
          $('#positionDetail #ueditor_0').contents().find("body").html(response.data.describe)
        }else if(href.indexOf(tool.url.cjol.positionRelease.u) !== -1){
          $('#txtJobName').val(response.data.jobName);
          $('#RecruitCount').val(response.data.number);
          setTimeout(function () {
            $('#ueditor_0').contents().find("body").html(response.data.describe)
          },500)
        }else if(href.indexOf(tool.url.tc58.positionRelease.u) !== -1){
          $('#title').val(response.data.jobName);
          $('#personnumber').val(response.data.number);
          $('#content').val(regHtml(response.data.describe));
        }else if(href.indexOf(tool.url.offer.positionRelease.u) !== -1){
          $('#recruiter_position_job_letter').val(regHtml(response.data.describe))
        }
      })
    }else if(href.indexOf(tool.url.offer.resumeDetail.u) > -1){   //100offer获取简历联系方式
      $('.right-side .resume-panel .btn-container .btn.blue-btn').click()
    };
    const ivId = tool.getUrlParam('ivId');
    if (ivId) {
      if (href.indexOf(tool.url.zl.resumeSearch.u) !== -1) { //智联根据id搜索简历

        $('.k-tabs__nav .k-tabs__item').eq(2)[0].click();

        if(tool.getUrlParam('reload')){
          let LocalId = tool.LocalStorage.get('1002243352-id');
          LocalId[0].input = ivId;
          tool.LocalStorage.set('1002243352-id',LocalId);
          window.location.replace(tool.url.zl.resumeSearch.u+'?ivtype=1&ivId='+ivId)
        }else {
          // setTimeout(() => {
            $('.resume-filter .resume-filter-item #form-item-54 .k-input__inner').val(ivId)
          // },0);
            chrome.extension.sendMessage({
              status: "downloadResume",
              value: true
            }, function (response) {
              if (response.status === 'searchResult') {
                setTimeout(() => {
                  $('.talent-search').click();
                }, 100);
              }
            });
        }

      } else if (href.indexOf(tool.url.qc.resumeSearch.u) !== -1) {
        chrome.extension.sendMessage({
          status: "downloadResume",
          value: true
        })
        $('#search_keywod_txt').val(ivId);
        $('#search_submit')[0].click()

      }else if(href.indexOf(tool.url.lp.resumeSearch.u)!==-1){
        $('.search-input-box .search-input').val(ivId);
        chrome.extension.sendMessage({
          status: "downloadResume",
          value: true
        }, function (response) {
          if (response.status === 'searchResult') {
            $('.search-btn').click();
            setTimeout(function () {
              $('.resume-list li:first-child .resume-card .head-img a')[0].click();
            },1000)

          }
        });
      }else if(href.indexOf(tool.url.cjol.resumeSearch.u)!==-1){
        $('#a_search_by_resumeid')[0].click();
        chrome.extension.sendMessage({
          status: "downloadResume",
          value: true
        }, function (response) {
          if (response.status === 'searchResult') {
            $('#layui-layer1 #txt_jobseeker_id').val(ivId);
              $('#layui-layer1 .layui-layer-btn0')[0].click()
          }
        });
      }
    } else {
      chrome.extension.sendMessage({
        status: "downloadResume",
        value: false
      })
    }
    
    //获取前程外网职位列表
    if(window.location.host === 'search.51job.com'){
      console.log('search.51job.com')
      let listHtml = $('#resultList .el').not('.title');
      const positionList = []
      listHtml.each(function () {
        let item = {
          jobName: $(this).find('.t1 a').attr('title'),
          company: $(this).find('.t2 a').attr('title'),
          city: $(this).find('.t3').text(),
          positionURL: $(this).find('.t1 a').attr('href'),
          id: $(this).find('.t1 .delivery_jobid').val(),
        };
        positionList.push(item);
      });
      const req = {
        status: "qcPositionList",
        data: positionList
      };
      chrome.extension.sendMessage(req)
      window.close()
    }
    
  }else {
    if(href.indexOf(tool.url.boss.positionRelease.u)!==-1){
        chrome.extension.sendMessage({
          status: "getPositionDetail"
        }, function (response) {
          setTimeout(function () {
            if(response){
              $('.ipt-wrap .ipt[name="positionName"]').val(response.data.jobName);
              $('.ipt-wrap .ipt-area[name="description"]').val(regHtml(response.data.describe));
            }
          },1000)

        })
    }
  }
  //boss职位详情


  //简历搜索结果
  if (href.indexOf(tool.url.zl.resumeSearchResult.u) > -1 || href.indexOf(tool.url.qc.resumeSearchResult.u) > -1|| href.indexOf(tool.url.cjol.resumeSearchResult.u) > -1) {
    chrome.extension.sendMessage({
      status: "isDownload"
    }, function (response) {
      if (response && response.status === 'isDownload') {
        if (href.indexOf(tool.url.zl.resumeSearchResult.u) > -1) {
          setTimeout(() => {
            $('.k-table__body .resume-item__basic .k-table__column--has-checked .k-checkbox').click();
            $('.list-actions__wrapper').children('button').eq(0).click()
          }, 100);
        } else if (href.indexOf(tool.url.qc.resumeSearchResult.u) > -1) {
          $('#listDiv .Common_list-table .Common_list_table-id-text a')[0].click()
        }else if(href.indexOf(tool.url.cjol.resumeSearchResult.u) > -1){
          $('#div_search_list_tbody .searchlist-tr').eq(0).find('.txt-link.link-sumnum')[0].click()
        }
      }
    })
  }

  //简历详情
  if (href.indexOf(tool.url.zl.resumeDetail.u) > -1 || href.indexOf(tool.url.qc.resumeDetail.u) > -1|| href.indexOf(tool.url.lp.resumeDetail.u) > -1||
    href.indexOf(tool.url.cjol.resumeDetail.u) > -1) {
    chrome.extension.sendMessage({
      status: "isDownload",
      stop: true
    }, function (response) {

      if (response && response.status === 'isDownload') {
        if (href.indexOf(tool.url.zl.resumeDetail.u) > -1) {
          $('.is-download')[0].click();
        } else if (href.indexOf(tool.url.qc.resumeDetail.u) > -1) {
          $('#UndownloadLink')[0].click()
        }else if(href.indexOf(tool.url.lp.resumeDetail.u) > -1){
          $('.btns .btn-primary[data-selector="download"]').click()
        }else if( href.indexOf(tool.url.cjol.resumeDetail.u) > -1){
          setTimeout(()=>{
            $('#viewcontact')[0].click();
          },1000)
        }

      }
    })


  }


  function createTips(tip) {
    const iconUrl = chrome.extension.getURL("img/icon.png")
    let tooltip = `  <div id="iv-tooltip" style="color: #666;width: 250px;border-left: 3px solid #ef5877; position: fixed;right:-280px; top:10px;padding-left:17px;  z-index: 9999;background: #fff; box-shadow: 0 0 10px #cecece">
    <p style="font-size: 16px;margin: 10px 0;">温馨提示</p>
    <div style="display: flex; align-items: center;margin: 10px 0;">
      <img style="width: 40px; height: 40px;" src="${iconUrl}">
      <p style="flex: 1;margin-left: 10px;">点击浏览器右上角「ivva」图标将${tip}导入ivva</p>
    </div>
  </div>`
    $("body").append(tooltip);
    setTimeout(function () {
      $('#iv-tooltip').animate({
        right: "10px"
      });
      setTimeout(function () {
        $('#iv-tooltip').animate({
          right: "-280px",
          opacity: '0'
        }, function () {
          $('#iv-tooltip').remove()
        });
      }, 3500)
    }, 500);

  };

  function generateCanvas(channel, port) {
    let dom = "";
    if (channel === 'zl') {
      dom = $('.resume-detail__main.resume-detail__structure')
    } else if (channel === "qc") {
      dom = $('#divResume')
    }else if(channel === "lg1"){
      dom = $(".mr_myresume_l.mrcenter")
    }else if(channel==="lg2"){
      dom = $("#resumePreviewContainer .resume-info")
    }else if(channel==='lp'){
      dom = $('.board')
    }else if(channel==='cjol'){
      dom = $('.resume_div_wrap')
    }else if(channel==='boss'){
      dom = $('.dialog-resume-full .resume-dialog')
    }else if(channel==="tc58"){
      dom = $('.resume_preview')
    }else if(channel==='offer'){
      dom = $('.recruiter-resume-container .left-side')
    }else if(channel ==='zl2'){
      dom = $('.personage-resume-container')
    }
    html2canvas(dom, {
      allowTaint: false, //允许污染
      taintTest: false,
      useCORS: false, //使用跨域
      //  width:800,
      onrendered: function (canvas) {
        canvas.id = "mycanvas";
        //document.body.appendChild(canvas);  
        //生成base64图片数据  
        const dataUrl = canvas.toDataURL("image/png", 2); //将图片转为base64
        port.postMessage(dataUrl);
        // ivvaImportResume.postMessage(config)
        // let newImg = document.createElement("img");
        // newImg.src = dataUrl;
        // document.body.appendChild(newImg);
      }
    });
  };

  // 接收消息
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request,'request')
    if (request.status === 'getResumeDetail') {
      const href = window.location.href;
      //判断是否为简历详情
      if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1)|| (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)
        ||href.indexOf(tool.url.lg.resumeDetail.u) > -1||href.indexOf(tool.url.lg.resumeDetail2.u) > -1||href.indexOf(tool.url.lp.resumeDetail.u) > -1
        ||href.indexOf(tool.url.cjol.resumeDetail.u) > -1||(href.indexOf(tool.url.boss.resumeSearch.u)>-1&&$('.dialog-resume-full').length>0)||href.indexOf(tool.url.tc58.resumeDetail.u) > -1
      || href.indexOf(tool.url.offer.resumeDetail.u) >-1 || href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1) {
        let channel = "";
        if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1)||href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1) {
          channel = "zl"
        } else if ((href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1)|| (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)) {
          channel = "qc"
        }else if(href.indexOf(tool.url.lg.resumeDetail.u) > -1||href.indexOf(tool.url.lg.resumeDetail2.u) > -1){
          channel = "lg"
        }else if(href.indexOf(tool.url.tc58.resumeDetail.u) > -1){
          channel = "tc58"
        }else if(href.indexOf(tool.url.lp.resumeDetail.u) > -1){
          channel = "lp"
        }else if(href.indexOf(tool.url.cjol.resumeDetail.u)>-1){
          channel = "cjol"
        }else if(href.indexOf(tool.url.boss.resumeSearch.u)>-1&&$('.dialog-resume-full').length>0){
          channel = "boss"
        }else if(href.indexOf(tool.url.offer.resumeDetail.u)> -1){
          channel = 'offer'
        }
        let config = {
          status: 'resumeDetail',
          channel,
          data: $('html').html(),
        };
        if(href.indexOf(tool.url.lg.resumeDetail.u) > -1){
          config.subType = 1
        }else if(href.indexOf(tool.url.lg.resumeDetail2.u) > -1){
          config.subType = 2
        }else if(href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1){
          config.subType = 2
        }
        sendResponse(config);

        //  generateCanvas(channel, config)

      }
    } else if (request.status === 'getPageIconStatus') {
      let resumeLen = $('.dialog-resume-full').length;
      let reqdata={
        status:"getPageIconStatus"
      };
      if(resumeLen>0){
        reqdata.type = 1
        sendResponse(reqdata);
      }
    }
  });
  chrome.runtime.onConnect.addListener(function (port) {

    if (port.name === "canvasImage") {
      port.onMessage.addListener(function (msg) {
        const href = window.location.href;
        // if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1)) {
          let channel = "";
          if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1)) {
            channel = "zl"
          } else if ((href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1)|| (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)) {
            channel = "qc"
          }else if((href.indexOf(tool.url.lg.resumeDetail.u) > -1)){
            channel = "lg1"
          }else if((href.indexOf(tool.url.lg.resumeDetail2.u) > -1)){
            channel = "lg2"
          }else if(href.indexOf(tool.url.lp.resumeDetail.u) > -1){
            channel = "lp"
          }else if(href.indexOf(tool.url.cjol.resumeDetail.u) > -1){
            channel = "cjol"
          }else if(href.indexOf(tool.url.boss.resumeSearch.u)>-1&&$('.dialog-resume-full').length>0){
            channel = "boss"
          }else if(href.indexOf(tool.url.tc58.resumeDetail.u) > -1){
            channel = "tc58"
          }else if(href.indexOf(tool.url.offer.resumeDetail.u) > -1){
            channel = "offer"
          }else if(href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1){
            channel = "zl2"
          }
          if(channel){
            generateCanvas(channel, port)
          }

        // }
      });
    }

  });

  function regHtml(str){
    let reg=/<\/?.+?\/?>/g;
    return str.replace(reg,'')
  }
}
