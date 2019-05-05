const externalPort = chrome.runtime.connect({
  name: "externalPort"
});
let resumeId = "";
let channel = "";
window.onload = function () {
  const href = window.location.href;
  //判断是否为简历详情 改变图标
  if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1) ||
     href.indexOf(tool.url.lg.resumeDetail2.u) > -1 || href.indexOf(tool.url.tc58.resumeDetail.u) > -1 ||href.indexOf(tool.url.lg.resumeDetail3.u) > -1 ||
    href.indexOf(tool.url.lp.resumeDetail.u) > -1 || href.indexOf(tool.url.cjol.resumeDetail.u) > -1 || href.indexOf(tool.url.offer.resumeDetail.u) > -1
    || href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1 || location.pathname === tool.url.zb.resumeDetail.pathname) {
    createTips('简历')
  } else if (href.indexOf(tool.url.boss.resumeSearch.u) > -1) {
    $(".frame-container").contents().on("click", '#search-list li a', function () {
      inspectResume()
    });
    function inspectResume() {
      let resumetimer = setTimeout(() => {
        let resumeLen = $('.dialog-resume-full').length;
        if (resumeLen === 0) {
          inspectResume();
          chrome.extension.sendMessage({
            status: "pageSetIcon",
            type: 0
          });
        } else {
          chrome.extension.sendMessage({
            status: "pageSetIcon",
            type: 1
          });
          createTips('简历')
        }
      }, 1000)
    }
  }else if(href.indexOf(tool.url.lg.resumeDetail.u) > -1){
    $('body').on("click",".talent-item,.resume-dialog",()=>{
      let beforeStatus = $('.resume-dialog').length&&!$('.resume-dialog').is(':hidden');
      setTimeout(()=>{
        let afterStatus = $('.resume-dialog').length&&!$('.resume-dialog').is(':hidden')
        if(afterStatus){
          if(afterStatus!=beforeStatus){
            createTips('简历')
          }
          chrome.extension.sendMessage({
            status: "pageSetIcon",
            type: 1
          });
        }else {
          chrome.extension.sendMessage({
            status: "pageSetIcon",
            type: 0
          });
        }
      },1000)
    })
  }

  const ivtype = tool.getUrlParam('ivtype');      //判断是否ivva跳转的页面

  if (ivtype) {
    if (href.indexOf(tool.url.zl.positionList.u) !== -1) { //智联刷新
      $('.k-table__footer .k-checkbox__inner').click();
      $(`.k-table__footer .k-button[data-action='normal-refresh']`)[0].click()
    } else if (href.indexOf(tool.url.qc.positionList.u) !== -1) { //前程刷新
      $("#radSelactALLd").click();
      $("#batch_refresh")[0].click();
    } else if (href.indexOf(tool.url.lp.positionList.u) !== -1) {
      $('.select-all .checkboxui').click();
      $('.float-left .btn-light.btn-small[data-selector="link-refresh"]')[0].click();

      //职位发布
    } else if (href.indexOf(tool.url.zl.positionRelease.u) !== -1 || href.indexOf(tool.url.qc.positionRelease.u) !== -1 || href.indexOf(tool.url.lg.positionRelease.u) !== -1
      || href.indexOf(tool.url.cjol.positionRelease.u) !== -1 || href.indexOf(tool.url.tc58.positionRelease.u) !== -1
      || href.indexOf(tool.url.offer.positionRelease.u) !== -1 || href.indexOf(tool.url.zb.positionRelease.u) !== -1 || href.indexOf(tool.url.lp.positionRelease.u) !== -1) { //职位发布
      chrome.extension.sendMessage({
        status: "getPositionDetail"
      }, function (response) {
        if (href.indexOf(tool.url.zl.positionRelease.u) !== -1) {  //智联
          // setTimeout(function () {
          $(".k-form-item_name .k-input input").val(response.data.jobName);
          $(".k-form-item_people .k-form-item__content .k-input__inner").val(response.data.number);
          $(".k-form-item_describe .jqte_editor").html(response.data.describe)
          // },200)
        } else if (href.indexOf(tool.url.qc.positionRelease.u) !== -1) {
          $("#jobname-input .input").val(response.data.jobName);
          $("#hirenum-input .input").val(response.data.number);
          $("#jobdesc-editor .h-frame").contents().find("body").html(response.data.describe)
        } else if (href.indexOf(tool.url.lg.positionRelease.u) !== -1) {
          $('#positionName').val(response.data.jobName)
          $('#positionDetail #ueditor_0').contents().find("body").html(response.data.describe)
        } else if (href.indexOf(tool.url.cjol.positionRelease.u) !== -1) {
          $('#txtJobName').val(response.data.jobName);
          $('#RecruitCount').val(response.data.number);
          setTimeout(function () {
            $('#ueditor_0').contents().find("body").html(response.data.describe)
          }, 500)
        } else if (href.indexOf(tool.url.tc58.positionRelease.u) !== -1) {
          $('#title').val(response.data.jobName);
          $('#personnumber').val(response.data.number);
          $('#content').val(regHtml(response.data.describe));
        } else if (href.indexOf(tool.url.offer.positionRelease.u) !== -1) {
          $('#recruiter_position_job_letter').val(regHtml(response.data.describe))
        } else if (href.indexOf(tool.url.zb.positionRelease.u) !== -1) {
          console.log(response)
          $(".form_text input.text[name='posName']").val(response.data.jobName)
          $(".form_text input.text[name='CandidatesNum']").val(response.data.number);
          $('#posDescription').val(regHtml(response.data.describe))
        } else if (href.indexOf(tool.url.lp.positionRelease.u) !== -1) {
          $("input[name='ejobTitle']").val(response.data.jobName);
          $(".job-description").val(regHtml(response.data.describe));
        }
      })
    } else if (href.indexOf(tool.url.offer.resumeDetail.u) > -1) {   //100offer获取简历联系方式
      $('.right-side .resume-panel .btn-container .btn.blue-btn').click()
    }
    ;
    const ivId = tool.getUrlParam('ivId');
    if (ivId) {
      // 从存储中读取数据
      getLocal('ivResumeDetail').then(res => {
        const resumeDetail = res.ivResumeDetail;
        console.log(resumeDetail)
        if (href.indexOf(tool.url.zl.resumeSearch.u) !== -1) { //智联根据id搜索简历
          if (tool.getUrlParam('reload')) {
            const uid = $.cookie('zp-route-meta').split(',')[0];
            const userId = uid && uid.split("=")[1];
            const local = [{"filterId": 9, "input": resumeDetail.company}, {
              "filterId": 27,
              "input": resumeDetail.school
            }, {"filterId": 17, "selected": resumeDetail.sex}];

            tool.LocalStorage.set(`resume_apply_filter_expand`, true);
            tool.LocalStorage.set(`${userId}-filter`, local);
            window.location.replace(tool.url.zl.resumeSearch.u + '?ivtype=1&ivId=' + ivId)
          } else {
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


          // if(tool.getUrlParam('reload')){
          //   const rd55 = $(".rd55-header").length;  //判断类型
          //   console.log(rd55,'rd55',$.cookie('zp-route-meta'));
          //   const uid = $.cookie('zp-route-meta').split(',')[0];
          //   const userId = uid&&uid.split("=")[1];
          //   const local = [{"filterId":54,"input":ivId}];
          //   tool.LocalStorage.set(`${userId}-id`,local);
          //   window.location.replace(tool.url.zl.resumeSearch.u+'?ivtype=1&ivId='+ivId)
          // }else {
          //   // setTimeout(() => {
          //     $('.resume-filter .resume-filter-item #form-item-54 .k-input__inner').val(ivId)
          //   // },0);
          //     chrome.extension.sendMessage({
          //       status: "downloadResume",
          //       value: true
          //     }, function (response) {
          //       if (response.status === 'searchResult') {
          //         setTimeout(() => {
          //           $('.talent-search').click();
          //         }, 100);
          //       }
          //     });
          // }

        } else if (href.indexOf(tool.url.qc.resumeSearch.u) !== -1) {
          chrome.extension.sendMessage({
            status: "downloadResume",
            value: true
          })
          $('#search_keywod_txt').val(resumeDetail.school);
          $('#change_search_term')[0].click();
          $("#search_lastcompany_txt").val(resumeDetail.company);
          if (resumeDetail.sex == 1) {
            $('#man_sex_cn').attr('checked', true);
          } else if (resumeDetail.sex == 2) {
            $('#woman_sex_cn').attr('checked', true);
          }
          $('#search_submit')[0].click()

        } else if (href.indexOf(tool.url.lp.resumeSearch.u) !== -1) {
          $('.search-input-box .search-input').val(resumeDetail.school+' '+resumeDetail.company);
          $('.more-condition-switch')[0].click();
          $("input[data-selector='sexOptions']").val(resumeDetail.sex==1?'男':resumeDetail.sex==2?'女':'')
          chrome.extension.sendMessage({
            status: "downloadResume",
            value: true
          }, function (response) {
            if (response.status === 'searchResult') {
              $('.search-btn').click();
              setTimeout(function () {
                const num = $("div[data-selector='list-filter'] .num i").text();
                if(num==1){
                  $('.resume-list li:first-child .resume-card .head-img a')[0].click();
                }
              }, 1000)

            }
          });
        } else if (href.indexOf(tool.url.cjol.resumeSearch.u) !== -1) {
          // $('#a_search_by_resumeid')[0].click();
          chrome.extension.sendMessage({
            status: "downloadResume",
            value: true
          }, function (response) {
            if (response.status === 'searchResult') {
              // $('#layui-layer1 #txt_jobseeker_id').val(ivId);
              $('#txt_keyword').val(`+${resumeDetail.school} +${resumeDetail.company}`);
              $('#a_search_resume')[0].click()
            }
          });
        } else if (location.pathname === tool.url.zb.resumeSearchId.pathname) {
          $(".search_bar_keywork").val(ivId)
          $("#quickSearch").click()
          chrome.extension.sendMessage({
            status: "downloadResume",
            value: true
          });

        }
      });
      // chrome.storage.local.get('ivResumeDetail', function (result) {
      //   console.log("缓存数据ivResumeDetail", result);
      //
      // });

    } else {
      chrome.extension.sendMessage({
        status: "downloadResume",
        value: false
      })
    }

    //获取前程外网职位列表
    if (window.location.host === 'search.51job.com') {
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
      const pageText = $(".dw_page .p_in .td").text();
      const totalPage = pageText.split('共')[1].split('页')[0];
      const req = {
        status: "qcPositionList",
        data: positionList,
        totalPage
      };
      chrome.extension.sendMessage(req)
      window.close()
    } else if (window.location.pathname.includes('/jobs/list_')) {
      let page = tool.getUrlParam('ivPage');
      let positionList = [];

      //lg职位列表
      function findPositionList() {
        let listHtml = $('#s_position_list .item_con_list .con_list_item');
        listHtml.each(function () {
          let item = {
            jobName: $(this)[0].dataset.positionname,
            company: $(this)[0].dataset.company,
            id: $(this)[0].dataset.positionid,
            city: $(this).find('.add em').text(),
            positionURL: $(this).find('.position_link').attr('href'),
          };
          positionList.push(item)
        });
        const req = {
          status: "lgPositionList",
          data: positionList,
          totalPage: $('#order .page-number .totalNum').text()
        };
        chrome.extension.sendMessage(req);
        window.close()
      }

      if (page == 1) {
        setTimeout(() => {
          findPositionList()
        }, 100);

      } else {
        setTimeout(() => {
          findPage();
        }, 100);

        function findPage() {
          const pager_container = $('.item_con_pager .pager_container span:not(".pager_prev"):not(".pager_next")');
          const currPage = [];
          pager_container.each(function () {
            currPage.push($(this).attr('page'));

          });
          if (currPage.includes(page)) {
            $(".item_con_pager .pager_container").find(`span[page=${page}]`).click();
            setTimeout(() => {
              findPositionList()
            }, 500)
          } else {
            $(".item_con_pager .pager_container").find(`span[page=${currPage[currPage.length - 2]}]`).click();
            setTimeout(() => {
              findPage()
            }, 200)
          }
        }
      }
    } else if (location.pathname === "/search/result.xhtml") {
      let page = tool.getUrlParam('ivPage');
      let positionList = [];
      if (page == 1) {
        findZbPositionList()
      } else {
        findZbPage()
      }


      function findZbPositionList() {
        let listHtml = $('#result_data .item_box');
        let origin = location.origin
        listHtml.each(function () {
          let item = {
            jobName: $(this).find('.job_name a').text(),
            company: $(this).find('.job_info  a:first-child').text(),
            id: $(this).find('.job_check').data('value'),
            city: $.trim($(this).find('.job_info p').text().split('|')[1]),
            positionURL: origin + $(this).find('.job_name a').attr('href'),
          };
          positionList.push(item)
        });
        setTimeout(() => {
          const req = {
            status: "zbPositionList",
            data: positionList,
            totalPage: $('#pagination .pagination_count span').text()
          };
          console.log(req)
          chrome.extension.sendMessage(req);
          window.close()
        }, 100);

      }

      function findZbPage() {
        const pager_container = $('#pagination .pagination_page .page-wrap:not(".page_siblings"):not(":last")').children();
        const currPage = [];
        pager_container.each(function () {
          currPage.push($(this).text())
        });
        if (currPage.includes(page)) {
          $("#pagination .pagination_page").find(`.page-wrap a:contains(${page})`)[0].click();
          setTimeout(() => {
            findZbPositionList()
          }, 500)
        } else {
          $("#pagination .pagination_page").find(`.page-wrap a:contains(${currPage[currPage.length - 1]})`)[0].click();
          setTimeout(() => {
            findZbPage()
          }, 200)
        }
      }

      // let keyword = tool.getUrlParam('ivKw');
      // $('#search-keyword').val(decodeFromGb2312(keyword));
      // $(".i_search_bar .btn button").click()
    }


  } else {
    if (href.indexOf(tool.url.boss.positionRelease.u) !== -1) {
      chrome.extension.sendMessage({
        status: "getPositionDetail"
      }, function (response) {
        setTimeout(function () {
          if (response) {
            $('.ipt-wrap .ipt[name="positionName"]').val(response.data.jobName);
            $('.ipt-wrap .ipt-area[name="description"]').val(regHtml(response.data.describe));
          }
        }, 1000)

      })
    }
  }

  //雷达简历
  if (tool.getUrlParam('ivStatus') === 'radarResume') {
    switch (location.pathname) {
      case tool.url.qc.resumeSearch.pathname:   //前程搜索页面
        // 从存储中读取数据
        chrome.storage.local.get('ivRradarResume', function (result) {
          console.log("缓存数据ivRradarResume", result);
          const {school, sex, company, evaluation} = result.ivRradarResume;
          $('#more_search_term').show();
          $('#search_lastcompany_txt').val(company);
          let keyword = evaluation ? school + ' ' + evaluation : school;
          $('#search_keywod_txt').val(keyword);
          $('#search_area_hid').val('');
          if (sex == 1) {
            $('#man_sex_cn').attr('checked', true);
          } else if (sex == 2) {
            $('#woman_sex_cn').attr('checked', true);
          }
          chrome.extension.sendMessage({
            status: "openRadarResume",
            value: true,
            ivRadarResumeId: result.ivRradarResume.ivRadarResumeId
          });
          $('#search_submit')[0].click();
        });

        break;
      case tool.url.qc.resumeDetail.pathname:  //前程详情页面

        if (tool.getUrlParam('ivRadarResumeId')) {
          const detailInfo = $('.box1 .infr').children('tbody').children('tr').eq(1).html();
          let info = {
            phone: $(detailInfo).find('table tr td').eq(3).text() || $(detailInfo).find('table tr td').eq(1).text(),
            email: $(detailInfo).find('table tr td').eq(5).find('.rv_mail_limit a').text() || $(detailInfo).find('table tr td').eq(2).find('.m_com a').text()
          };
          if (info.phone) {   //有联系方式
            info.name = $.trim($('#Head1 title').text());
            info.resumeId = tool.getUrlParam('ivRadarResumeId');
            updataRadarResume(info)
          }
        }

        break;
      default:
        break;

    }


  } //雷达简历

  //简历搜索结果
  if (href.indexOf(tool.url.zl.resumeSearchResult.u) > -1 || href.indexOf(tool.url.qc.resumeSearchResult.u) > -1 ||
    href.indexOf(tool.url.cjol.resumeSearchResult.u) > -1 || location.pathname === tool.url.zb.resumeSearchResult.pathname) {
    chrome.extension.sendMessage({
      status: "isDownload"
    }, function (response) {
      if (response && response.status === 'isDownload') {
        if (href.indexOf(tool.url.zl.resumeSearchResult.u) > -1) {
          setTimeout(() => {
            const total = $('.k-pagination__total .total-number').text();
            if(total==1){
              $('.k-table__body .resume-item__basic .k-table__column--has-checked .k-checkbox').click();
              $('.list-actions__wrapper').children('button').eq(0).click()
            }
          }, 200);
        } else if (href.indexOf(tool.url.qc.resumeSearchResult.u) > -1) {
          const labAllResumes = $('#labAllResumes').text();
          if (labAllResumes === "共1条") {
            $('#listDiv .Common_list-table .Common_list_table-id-text a')[0].click()
          }
        } else if (href.indexOf(tool.url.cjol.resumeSearchResult.u) > -1) {
          const total = $("#em_search_total_count").text();
          if(total==1){
            $('#div_search_list_tbody .searchlist-tr').eq(0).find('.txt-link.link-sumnum')[0].click()
          }

        } else if (location.pathname === tool.url.zb.resumeSearchResult.pathname) {
          const resultTotal = $("#resultTotal").text();
          if (resultTotal > 0) {
            $(".jobcn-input-checkbox.resultSelectAll")[0].click();
            $(".filter_operate_active.viewResume")[0].click()
          }
        }
      } else if (response && response.status === 'isOpenRadarResume') {
        switch (location.pathname) {
          case tool.url.qc.resumeSearchResult.pathname:
            const labAllResumes = $('#labAllResumes').text();
            if (labAllResumes === "共1条") {
              const href = $('#trBaseInfo_1 .Common_list_table-id-text a').attr('href');
              console.log(href);
              console.log(response)
              window.open(location.origin + href + '&ivtype=1&ivStatus=radarResume&ivRadarResumeId=' + response.ivRadarResumeId)
              // $('#listDiv .Common_list-table .Common_list_table-id-text a')[0].click()
            }
            break;
          default:
            break;
        }
      }
    })
  }

  //简历详情
  if (href.indexOf(tool.url.zl.resumeDetail.u) > -1 || href.indexOf(tool.url.qc.resumeDetail.u) > -1 || href.indexOf(tool.url.lp.resumeDetail.u) > -1 ||
    href.indexOf(tool.url.cjol.resumeDetail.u) > -1 || location.pathname === tool.url.zb.resumeDetail.pathname) {
    chrome.extension.sendMessage({
      status: "isDownload",
      stop: true
    }, function (response) {
      //判断是否或许简历详情联系方式
      if (response && response.status === 'isDownload') {
        if (href.indexOf(tool.url.zl.resumeDetail.u) > -1) {
          $('.is-download')[0].click();
        } else if (href.indexOf(tool.url.qc.resumeDetail.u) > -1) {
          $('#UndownloadLink')[0].click()
        } else if (href.indexOf(tool.url.lp.resumeDetail.u) > -1) {
          $('.btns .btn-primary[data-selector="download"]').click()
        } else if (href.indexOf(tool.url.cjol.resumeDetail.u) > -1) {
          setTimeout(() => {
            $('#viewcontact')[0].click();
          }, 1000)
        } else if (location.pathname === tool.url.zb.resumeDetail.pathname) {
          $(".resume_action.action-download")[0].click();
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


  //根据html生成图片
  function generateCanvas(channel, port) {
    let dom = "";
    if (channel === 'zl') {
      dom = $('.resume-detail__main.resume-detail__structure')
    } else if (channel === "qc") {
      dom = $('#divResume')
    } else if (channel === "lg1") {
      dom = $(".react-modal-content")
    } else if (channel === "lg2") {
      dom = $(".scrollarea-content")
    }else if (channel === "lg3") {
      dom = $("#home-view-root .resume-content .content-wrap")
    } else if (channel === 'lp') {
      dom = $('.board')
    } else if (channel === 'cjol') {
      dom = $('.resume_div_wrap')
    } else if (channel === 'boss') {
      dom = $('.dialog-resume-full .resume-dialog')
    } else if (channel === "tc58") {
      dom = $('.resume_preview')
    } else if (channel === 'offer') {
      dom = $('.recruiter-resume-container .left-side')
    } else if (channel === 'zl2') {
      dom = $('.personage-resume-container')
    } else if (channel === 'zb') {
      dom = $(".resume_item_bd")
    }
    html2canvas(dom, {
      allowTaint: false, //允许污染
      taintTest: false,
      useCORS: false, //使用跨域
      // timeout:1000,
      //  width:800,
      onrendered: function (canvas) {
        canvas.id = "mycanvas";
        //document.body.appendChild(canvas);  
        //生成base64图片数据  
        let dataUrl = canvas.toDataURL("image/png", 2); //将图片转为base64
        dataUrl = dataUrl.replace(/=/g, "AA_AA");
        console.log("图片生成完成");
        port.postMessage(dataUrl);
        if(channel === "lg2"){
          $(".container").css("position","fixed")
        }
        // ivvaImportResume.postMessage(config)
        // let newImg = document.createElement("img");
        // newImg.src = dataUrl;
        // document.body.appendChild(newImg);
      }
    });
  };

  // 接收消息监听
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request, 'request')
    if (request.status === 'getResumeDetail') {
      const href = window.location.href;
      //判断是否为简历详情
      if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)
        || href.indexOf(tool.url.lg.resumeDetail.u) > -1 || href.indexOf(tool.url.lg.resumeDetail2.u) > -1|| href.indexOf(tool.url.lg.resumeDetail3.u) > -1 || href.indexOf(tool.url.lp.resumeDetail.u) > -1
        || href.indexOf(tool.url.cjol.resumeDetail.u) > -1 || (href.indexOf(tool.url.boss.resumeSearch.u) > -1 && $('.dialog-resume-full').length > 0) || href.indexOf(tool.url.tc58.resumeDetail.u) > -1
        || href.indexOf(tool.url.offer.resumeDetail.u) > -1 || href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1 || href.indexOf(tool.url.zb.resumeDetail.u) > -1) {
        let channel = "";
        $('html').scrollTop(0);
        if ((href.indexOf(tool.url.zl.resumeDetail.u) > -1) || href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1) {
          channel = "zl"
        } else if ((href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)) {
          channel = "qc"
        } else if (href.indexOf(tool.url.lg.resumeDetail.u) > -1 || href.indexOf(tool.url.lg.resumeDetail2.u) > -1|| href.indexOf(tool.url.lg.resumeDetail3.u) > -1) {
          channel = "lg"
        } else if (href.indexOf(tool.url.tc58.resumeDetail.u) > -1) {
          channel = "tc58"
        } else if (href.indexOf(tool.url.lp.resumeDetail.u) > -1) {
          channel = "lp"
        } else if (href.indexOf(tool.url.cjol.resumeDetail.u) > -1) {
          channel = "cjol"
        } else if (href.indexOf(tool.url.boss.resumeSearch.u) > -1 && $('.dialog-resume-full').length > 0) {
          channel = "boss"
        } else if (href.indexOf(tool.url.offer.resumeDetail.u) > -1) {
          channel = 'offer'
        } else if (location.pathname === tool.url.zb.resumeDetail.pathname) {
          channel = "zb"
        }
        let config = {
          status: 'resumeDetail',
          channel,
          // data: channel === "zb" ? $("html body .resume_item_bd").html() : $('html').html(),
        };
        if (href.indexOf(tool.url.lg.resumeDetail.u) > -1) {
          config.subType = 1
        } else if (href.indexOf(tool.url.lg.resumeDetail2.u) > -1) {
          config.subType = 2
        }else if (href.indexOf(tool.url.lg.resumeDetail3.u) > -1) {
          config.subType = 3
        } else if (href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1) {
          config.subType = 2
        }
        switch (config.channel) {
          case "lg":
            if(config.subType === 1){
              const name =$('.react-modal .p-name span').text();
              config.userid = $(`.talent-list .talent-item .item-user .name:contains(${name})`).parents('.talent-item').data('userid')
              config.data = $('.react-modal').html();
            }else if(config.subType === 2){
              $('.container').css("position","static")
              config.data =$('.scrollarea-content ').html();
              // $('.scrollarea-content')
            }else if(config.subType===3){
              config.data =$('#home-view-root .content-wrap').html();
            }
            break;
          case "zb":
            config.data =$("html body .resume_item_bd").html();
            break;
          default:
            config.data = $('html').html()
            break;
        }

        sendResponse(config);

        //  generateCanvas(channel, config)

      }
    } else if (request.status === 'getPageIconStatus') {
      const href = window.location.href;
      let reqdata = {
        status: "getPageIconStatus",
        type:0
      };
      if(href.indexOf(tool.url.lg.resumeDetail.u) > -1){  //拉勾
        if($('.resume-dialog').length&&!$('.resume-dialog').is(':hidden')){
          reqdata.type = 1;
        }
      }else {
        let resumeLen = $('.dialog-resume-full').length;
        if (resumeLen > 0) {
          reqdata.type = 1;
        }
      }
      sendResponse(reqdata);

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
        } else if ((href.indexOf(tool.url.qc.resumeDetail.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolder.u) > -1) || (href.indexOf(tool.url.qc.resumeDetailFolderV2.u) > -1)) {
          channel = "qc"
        } else if ((href.indexOf(tool.url.lg.resumeDetail.u) > -1)) {
          channel = "lg1"
        } else if ((href.indexOf(tool.url.lg.resumeDetail2.u) > -1)) {
          channel = "lg2"
        }else if ((href.indexOf(tool.url.lg.resumeDetail3.u) > -1)) {
          channel = "lg3"
        } else if (href.indexOf(tool.url.lp.resumeDetail.u) > -1) {
          channel = "lp"
        } else if (href.indexOf(tool.url.cjol.resumeDetail.u) > -1) {
          channel = "cjol"
        } else if (href.indexOf(tool.url.boss.resumeSearch.u) > -1 && $('.dialog-resume-full').length > 0) {
          channel = "boss"
        } else if (href.indexOf(tool.url.tc58.resumeDetail.u) > -1) {
          channel = "tc58"
        } else if (href.indexOf(tool.url.offer.resumeDetail.u) > -1) {
          channel = "offer"
        } else if (href.indexOf(tool.url.zl.resumeDetailFolder.u) > -1) {
          channel = "zl2"
        } else if (location.pathname === tool.url.zb.resumeDetail.pathname) {
          channel = "zb"
        }
        if (channel) {
          generateCanvas(channel, port)
        }

        // }
      });
    }

  });

  function regHtml(str) {
    let reg = /<\/?.+?\/?>/g;
    return str.replace(reg, '')
  }

  function updataRadarResume(resume) {
    const req = {
      status: "updataRadarResume",
      resume
    };
    chrome.extension.sendMessage(req);
  }

  function getLocal(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        resolve(result)
      });
    });

  }
};
