$(function () {
  let isCover = 0;
  let resumeDuplicateCheckData = null;
  let coverRusumeId = "";
  //向Content Script前程智联建立连接

  let ivvaImportResume = chrome.runtime.connect({
    name: "ivvaImportResume"
  }); //通道名称
  let resumeHtml = "";

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // var port = chrome.tabs.connect(tabs[0].id, {
    //   name: "getResumeDetail"
    // })
    chrome.tabs.sendMessage(tabs[0].id, {
      status: "getResumeDetail"
    }, function (response) {
      if (response) {
        if (response.status === 'resumeDetail') {
          resumeHtml = response.data;
          let resume = analysisResume(response.data, response.channel, response.subType,response.userid);
          initForm(resume);

          ivvaImportResume.postMessage({ //发送消息
            data: resume,
            status: "validateResume"
          });
        }
      }
    }); //end  sendMessage
  }); //end query


  $('#main').on('click', '#importBtn', function () {

    if (!$('#position').val() && !$('#talent').is(":checked")) {
      $('#tips').show()

    } else {
      $('#tips').hide();
      $('#main-loading').show()
      let reqdata = {
        resumeIdentification: $('#resumeId').val(),
        channelType: _matchChannelId($('#channel').val()),
        channelTypeName: $('#channel').val(),
        isPutTalentPool: $('#talent').is(":checked") ? 1 : 0,
        positionId: $('#position').val(),
        source: 2,
        fieldInfo: "123",
        // resumeChannerlId: 3,
        name: $('#name').val(),
        jobYear: $('#jobYear').val(),
        education: $('#education').val(),
        resumeHtml: resumeHtml,
        imgCode: $('#resumeImg').val(),
        isSchoolRecruit: 0,
        ischecking:1
      };
      /*if($('#cover').is(":checked")){
        reqdata.isCoverOriginalResume = 1
      }*/
      if(resumeDuplicateCheckData){
        if(resumeDuplicateCheckData.isCover){
          reqdata.isCoverOriginalResume = 1
        }else{
          reqdata.isIgnoreSuspected = 1
          reqdata.suspectedResumeList = JSON.stringify(resumeDuplicateCheckData.listData)
        }
      }
      ivvaImportResume.postMessage({
        data: reqdata,
        status: "importResume"
      }); //发送消息

    }
  });
  $("#main").on('change', '#talent', function () {
    if ($(this).is(":checked")) {
      $("#main #position").val('')
    }

  });
  $('#main').on("change", "#position", function () {
    $("#main #talent").prop("checked", false)
  });


  ivvaImportResume.onMessage.addListener(function (msg) { //监听接收消息
    if (msg.status === 'validateResume') {
      let text = "";
      if (msg.data.success) {
        $('#main .icon').attr('src', '../img/gou.png');
        if (!msg.data.data.listData) {
          text = '系统中未发现重复或疑似的简历'
        } else {
          resumeDuplicateCheckData = msg.data.data;
          isCover = msg.data.data.isCover;
          text = `系统中发现<strong style="color: red">${msg.data.data.listData.length}</strong>份${isCover?'重复':'疑似'}的简历`;
          let resumeList = "";
          for (let item of msg.data.data.listData) {
            resumeList += `<div class="similar-item-name-wrap"><a class="similar-item" href="#" data-resume-id=${item.resumeId}>${item.name}--的简历</a>
              ${msg.roleType <= 3&&item.isPermissionView ? '<a class="similar-item" data-resume-id=' + item.resumeId + ' href="#">点击查看</a>' : ''}
              ${msg.roleType <= 3&&isCover&&item.isPermissionView ? '<a class="cover-item" data-resume-id=' + item.resumeId + ' href="#"><span class="cover-text">覆盖<img src="../img/mark.png" class="mark" alt="" title="该简历手机号已在人才库原始简历发生重复，将覆盖人才库原始简历"/></span></a>' : ''}
              ${!item.isPermissionView ? '<span>无权操作该简历<img src="../img/mark.png" class="mark" alt="" title="库内重复的简历属于'+item.ownerName+'，如需使用请联系'+item.ownerName+'进行分配（放入公共人才库或直接推荐到您负责的职位）"/></span>' : ''}
            </div>`
          }
          $('#similar').html(resumeList);
        }
      } else {
        let errMsg = msg.data.message;
        if (msg.data.code === 444) {
          errMsg = "登录失效，请先登录ivva官网"
        }
        $('#main .icon').attr('src', '../img/close.png');
        text = '系统中检测失败'
        $('#main-loading').show();
        $('#main-loading .wrap').html(`<p class="text">${errMsg}</p>`);
        setTimeout(function () {
          $('#main-loading').hide();
          window.close();
        }, 2000)
      }
      $('#main .testing-text').html(text);
      $('.similar-item').click(function () {
        window.open(`${tool.ajaxUrl}/userUrl/social#/talentPool?resumeId=${$(this).data('resume-id')}&resumeShowType=1`);
      });
      $('.cover-item').click(function () {
        if (!$('#position').val() && !$('#talent').is(":checked")) {
          $('#tips').show()
        }else {
          $("#modal").show();
          coverRusumeId = $(this).data('resume-id')
        }
        // $('#modal').show();
      })

    } else if (msg.status === 'importResume') {
      if (msg.data.success) {
        console.log('msg.data.data', msg.data);
        importSuccess(msg.data.data)
      } else {
        $('#main-loading .wrap').html(`<p class="text">${msg.data.message}</p>`);
        setTimeout(function () {
          $('#main-loading').hide();
          window.close();
        }, 2000)
      }
    }
  });


  function initForm(resume) {
    let form = `<div class="form" data-id=${resume.id}>
        <div class="form-item">
          <div class="testing"><img class="icon" src="../img/gou.png" alt=""><span class="testing-text">系统中未发现重复或疑似的简历</span></div>
          <input id="resumeId" type="hidden" value=${resume.id} />
          <input id="channel" type="hidden" value=${resume.channel} />
          <input id="resumeImg" type="hidden" />
        </div>
        <div class="form-item"  id="similar"></div>
        <div class="form-item">
          <input id="name" type="text" class="form-item-45" placeholder="姓名" value='${resume.name}'>
          <select name="sex" id="sex" class="form-item-45"  placeholder="性别">
            <option value="1">男</option>
            <option value="2">女</option>
          </select>
        </div>
        <div  class="form-item">
        <select id = "position" placeholder="请选择职位">
         </select>
        </div>
        <div class="form-item">
          <input id="jobYear" type="text" class="form-item-45" placeholder="工作经验" value='${resume.jobYear}'>
          <input id="education" type="text" class="form-item-45" placeholder="学历" value='${resume.education}'>
        </div>
        <div  class="form-item">
          <input id="mobile" type="tel" placeholder="手机号码" value='${resume.mobile}'>
        </div>
        <div  class="form-item">
          <input id="email" type="email" placeholder="邮箱地址" value='${resume.email}'>
        </div>
        <div class="form-item">
          <input id="city" type="text" placeholder="现居地" value='${resume.city}'>
        </div>
        <div class="form-item">
          <div class="ivva-flexAlignCen ivva-flexSb">
            <div class="ivva-flexAlignCen"><input type="checkbox" class="checkbox" id="talent"> <label for="talent">放入人才库</label></div>
            <!--<div class="ivva-flexAlignCen"><input type="checkbox" class="checkbox" id="cover"> <label for="cover">覆盖原始简历</label><img src="../img/mark.png" class="mark" alt="" title="如该简历手机号已在人才库原始简历发生重复，将覆盖人才库原始简历"/></div>-->
          </div>
        </div>
        <div class="form-item">
          <button id="importBtn" type="button" disabled>
            <span class="importBtn">源文件生成中</span>
            <img src="/img/loading.gif" id="generateLoading" alt="">
          </button>
        </div>
      </div>`;

    $('#main').html(form);
    $('#main #sex').val(resume.sex);
    $('#main .icon').attr('src', '../img/loading.gif');
    $('#main .testing-text').text('简历检测中');

    // let bgPage = chrome.extension.getBackgroundPage();
    // console.log('bgPage', bgPage.ivvaPositionList);

    //获取列表
    let ivvaPositionList = chrome.runtime.connect({
      name: "ivvaPositionList"
    }); //通道名称
    ivvaPositionList.postMessage({
      status: "getIvvaPositionList"
    }); //发送消息
    ivvaPositionList.onMessage.addListener(function (msg) { //监听接收消息
      if (msg) {
        let option = "<option value=''>请选择职位</option>";
        for (let val of msg.positionList) {
          option += `<option value="${val.positionId}">${val.positionName}</option>`
        }
        ;
        $('#main #position').html(option)
      }
    });

    //获取base64截图

    chrome.tabs.query({
        active: true,
        currentWindow: true
      },
      function (tabs) {
        let canvasImage = chrome.tabs.connect( //建立通道
          tabs[0].id, {
            name: "canvasImage"
          } //通道名称
        );

        canvasImage.postMessage({
          status: "getImage"
        }); //发送消息
        canvasImage.onMessage.addListener(function (msg) { //监听接收消息
          if (msg) {
            $('#main #resumeImg').val(msg);
            $("#generateLoading").hide();
            if(isCover){
              $("#importBtn .importBtn").text("该简历已存在");
              $("#similar .cover-item").show();
            }else {
              $("#importBtn .importBtn").text("导入职位");
              $("#importBtn").attr("disabled",false);
            }
          }
        });
      });
  }

  function importSuccess(data) {
    let html = `<div class="success-page">
      <div class="logo">
        <img src="img/icon.png" class="logo-img" alt="">
        <span class="logo-text">Ivva</span>
      </div>
      <div class="success-icon">
        <img src="img/gou.png" class="icon-save" alt="">
        <p>保存成功</p>
      </div>
      ${data.roleType <= 3 ? '<div class="success-btn"><button type="button" id="detail-btn">打开候选人详情</button></div>' : ''}
    </div>`;
    $('#container .page2').html(html);
    $('#container .page1').hide();
    $('#main-loading').hide();
    //
    $('#container').on('click', '#detail-btn', function () {

      if (data.positionId) {
        window.open(`${tool.ajaxUrl}/userUrl/social#/candidates?resumeId=${data.resumeId}&positionId=${data.positionId}&recruitId=${data.recruitId}&recruitProcessId=${data.recruitProcessId}&stageId=${data.stageId}&resumeShowType=1`);
        // window.open(`${tool.ajaxUrl}/#/candidates?resumeId=${data.resumeId}&positionId=${data.positionId}&recruitId=${data.recruitId}&recruitProcessId=${data.recruitProcessId}&stageId=${data.stageId}&resumeShowType=1`);
      } else {
        window.open(`${tool.ajaxUrl}/userUrl/social#/talentPool?resumeId=${data.resumeId}&resumeShowType=1`);
        // window.open(`${tool.ajaxUrl}/#/talentPool?resumeId=${data.resumeId}&resumeShowType=1`);
      }
    });
    $('#container').on('click', '#recom-btn', function () {
      window.open(`${tool.ajaxUrl}/#/talentPool?resumeId=${data.resumeId}&positionId=${data.positionId}&recruitId=${data.recruitId}`);
    });
  }

  function modalBox(resumeId){

  }

//解析简历
  function analysisResume(domHtml, channel, type,userid) {
    let resume = {};
    resume.channel = channel;
    if (channel === "zl") {
      if (type === 2) {
        resume.id = $(domHtml).find('.r-resume-time .fl span:nth-child(2)').text();
        resume.name = $(domHtml).find('.userNameContainer').text();
        let sex = $(domHtml).find('.dave-baseInfo-cont .icon-sex').next().text();
        resume.sex = sex && sex.split(' ')[1] === '男' ? 1 : 2;
        // resume.sex = $.trim($(domHtml).find('.dave-baseInfo-cont .icon-sex').next().text())==='男'?1:2;
        resume.jobYear = $(domHtml).find('.dave-baseInfo-cont .icon-bag').next().text();
        resume.education = $(domHtml).find('.dave-baseInfo-cont .icon-hat').next().text().split('/')[1];
        let phoneEmailContainer = $(domHtml).find('.phoneEmailContainer');
        if (phoneEmailContainer.length > 0) {
          resume.mobile = $(domHtml).find('.phoneEmailContainer .telephone').text().split('电话：')[1];
          resume.email = $(domHtml).find('.phoneEmailContainer .email').text().split('邮箱：')[1];
        } else {
          resume.mobile = '';
          resume.email = '';
        }
        resume.city = $(domHtml).find(".dave-resDetail-baseInfo .icon-address").next().text();
        resume.school = $(domHtml).find(".dave-resDetail-baseInfo .icon-hat").next().text().split("/")[0];
        resume.company = $(domHtml).find(".dave-resDetail-workExpInfo .dave-workExpInfo-cont .dave-workExpInfo:first-child .company_name").text();
      } else {
        let id = $(domHtml).find('.resume-content__header .resume-content--letter-spacing').text();
        if (id) {
          resume.id = id.split('：')[1];
        }
        resume.name = $(domHtml).find('.resume-content__candidate-name').text();
        resume.sex = $(domHtml).find(".resume-content__labels span[data-bind='$key: genderDesc']").text() == '男' ? 1 : 2;
        resume.jobYear = $(domHtml).find(".resume-content__labels span[data-bind='text: workYears']").text();
        resume.education = $(domHtml).find(".resume-content__labels span[data-bind='text: eduLevel()']").text();
        resume.mobile = $(domHtml).find(".resume-content__mobile-phone span[data-bind='textQ: mobilePhone']").text();
        resume.email = $(domHtml).find(".resume-content__email span[data-bind='textQ: email']").text();
        resume.city = $(domHtml).find(".resume-content__labels--sub span[data-bind='textQ: currentCity()']").text();
        resume.school = $(domHtml).find(".resume-content__section span[data-bind='textQ: data.schoolName']").eq(0).text();
        resume.company = $(domHtml).find(".resume-content__section span[data-bind='textQ: data.companyName']").eq(0).text();
        let desc = $(domHtml).find("#resumeDetail dd[data-bind='textQ: data.workDescription']").eq(1).text();
        resume.keyword = forKeyword(desc);
      }

    } else if (channel === "qc") {
      resume.id = $(domHtml).find('#hidUserID').val();
      let name = $($(domHtml)[0]).text();
      if (name.indexOf('ID') == -1) {
        resume.name = $.trim(name)
        // resume.name = $.trim(name && name.split('流程')[0]);
        // resume.name = $.trim(resume.name && resume.name.split('和Ta聊聊')[0])
      } else {
        resume.name = $.trim(name && name.split('ID：')[1]);
      }
      ;
      let info = "";
      if (resume.name) {
        info = $(domHtml).find('.infr').children('tbody').children('tr').eq(2).html();
        let detailInfo = $(domHtml).find('.infr').children('tbody').children('tr').eq(1).html();
        resume.mobile = $(detailInfo).find('table tr td').eq(3).text() || $(detailInfo).find('table tr td').eq(1).text();
        resume.email = $(detailInfo).find('table tr td').eq(5).find('.rv_mail_limit a').text() || $(detailInfo).find('table tr td').eq(2).find('.m_com a').text();
      } else {
        info = $(domHtml).find('.infr').children('tbody').children('tr').eq(2).html();
        resume.mobile = "";
        resume.email = "";
      }
      let infoArr = $(info).text().split('|');
      resume.sex = $.trim((infoArr[0].indexOf('男') != -1) ? 1 : (infoArr[0].indexOf('女') != -1) ? 2 : '');
      resume.jobYear = $.trim(infoArr[3]);
      resume.city = $.trim(infoArr[2].split('现居住')[1]);
      resume.education = $(domHtml).find('.box2 .tb2').eq(1).find('tbody tr').eq(3).children('.txt2').text();
      resume.school = $(domHtml).find('.box2 .tba .tb2').eq(1).find('tbody tr').eq(2).children('.txt2').text();
      resume.company = $(domHtml).find('.box2 .tba .tb2').eq(0).find('tbody tr').eq(2).children('.txt2').text();
      let desc = $(domHtml).find('#divInfo').find(".keys:contains('工作描述')").eq(1).next().text();
      resume.keyword = forKeyword(desc);
    } else if (channel === "lg") {
      resume.id = "";
      if (type == 1) {
        resume.name = $(domHtml).find('.p-name span').text();
        resume.sex = $(domHtml).find('.p-name i').hasClass('icon-lg-man')? 1 : 2;
        resume.jobYear = $(domHtml).find('.p-name').next().next().find('.label').eq(0).text();
        resume.education = $(domHtml).find('.p-name').next().next().find('.label').eq(1).text();
        resume.city = $(domHtml).find('.base_info .d').text()||"";
        // resume.education = $(domHtml).find('.base_info .x').text();
        let company = $(domHtml).find('.resume-basic .basic-info .p-nor .label').eq(0).text();
        if (company) {
          resume.company = company.split('/')[0]
        }
        resume.school = $(domHtml).find('.edu-bottom-dis .main-info .line-f .line-f-name').text()
        resume.mobile = "";
        resume.email = "";
        resume.id = userid
      } else if (type == 2) {
        resume.name = $(domHtml).find('.information-body').eq(0).find('.candidate-name').text();
        resume.sex = $(domHtml).find('.information-body .icon-lg-man').attr('title') === '男' ? 1 : 2;
        resume.jobYear = $(domHtml).find('.information-body .base-info-workyear-education span').eq(0).text();
        resume.city = $(domHtml).find('.information-body .phone-tips span').eq(1).text();
        resume.education = $(domHtml).find('.information-body .base-info-workyear-education span').eq(1).text();
        resume.mobile = $(domHtml).find('.information-body .phone-tips span').eq(0).text();
        resume.email = $(domHtml).find('.information-body').eq(0).find('.p-four span:nth-child(2) .info-hover').text();
        resume.company = $(domHtml).find('.resume-section .section-title:contains("工作经历")').parent().find('.exp-single:first-child .main-info .line-f span:first-child').text();
        resume.school = $(domHtml).find('.edu-bottom-dis .section-content .exp-single:first-child .line-f-name').text();
      }else if(type==3){
        resume.id = $(domHtml).find('.paiId').text()
        resume.name = $(domHtml).find("span[data-reactid='85']").text();
        resume.sex = resume.name.includes("先生")?1:2;
        resume.jobYear = $(domHtml).find("span[data-reactid='86']").text();
        resume.city = $(domHtml).find("span[data-reactid='88']").text();
        resume.education = $(domHtml).find("span[data-reactid='87']").text();
        resume.mobile = "";
        resume.email = "";
        resume.company = "某公司";
        resume.school = $(domHtml).find(".edu-exp-item span").eq(0).text();
      }
    } else if (channel == 'tc58') {
      resume.id = "";
      resume.name = $(domHtml).find("#name").text();
      resume.city = $.trim($(domHtml).find("#expectLocation").text());
      resume.school = $(domHtml).find(".education.experience .edu-detail").eq(0).find('.college-name').text();
      resume.company = $(domHtml).find(".work.experience .experience-detail").eq(0).find('.itemName').text();
      resume.sex = "";
      resume.jobYear = "";
      resume.mobile = "";
      resume.email = "";
      resume.education = "";
    } else if (channel === "lp") {
      resume.id = $(domHtml).find('.title-info .clearfix').eq(0).find('.float-left small:nth-child(2)').text();
      let baseinfo = $(domHtml).find('.individual-cont .individual-info li:first-child .individual-info-cont').text().split('·');
      const name = baseinfo[0].indexOf('****') !== -1 ? '' : baseinfo[0];
      resume.name = name;
      resume.sex = baseinfo[1].indexOf('男') !== -1 ? 1 : 2;
      resume.jobYear = $(domHtml).find('.individual-cont .individual-info li:nth-child(2) .individual-info-cont').text().split('·')[2];
      resume.city = $(domHtml).find('.occupation-survey .table tr:nth-child(4) p.float-right span.occupation-survey-cont').text();
      resume.education = $(domHtml).find('.individual-cont .individual-info li:nth-child(3) .individual-info-cont').text().split('·')[0];
      const mobile = $(domHtml).find('.individual-cont .individual-info li:nth-child(4) .individual-info-cont em:first-child').text()
      resume.mobile = mobile.indexOf('****') === -1 ? mobile : '';
      const email = $(domHtml).find('.individual-cont .individual-info li:nth-child(4) .individual-info-cont em').eq(1).text()
      resume.email = email.indexOf('****') === -1 ? email : '';
      resume.company = $(domHtml).find('.work-experience .work-cont-company-name').eq(0).find('p:first-child .filter-zone').text();
      resume.school = $(domHtml).find('.individual-cont .individual-info li:nth-child(3) .individual-info-cont').text().split('·')[0];
      const desc = $(domHtml).find('.work-experience .work-cont-list .content').text();
      resume.keyword = forKeyword(desc);
    } else if (channel === 'cjol') {
      resume.id = $(domHtml).find('#div_resume .head_box .resume_info_up').text().split('：')[1];
      const name = $(domHtml).find('#div_resume .head_box .jobseeker_name').text().split('(')[0];
      resume.name = name.indexOf("隐藏姓名") == -1 ? name : "";
      resume.sex = $(domHtml).find(".jobseekerbaseinfo_box .jobseekerbaseinfo_con tr:nth-child(4) td:nth-child(4)").text() === '男' ? 1 : 2;
      resume.jobYear = $(domHtml).find(".jobseekerbaseinfo_box .jobseekerbaseinfo_con tr:nth-child(2) td").text();
      resume.city = $(domHtml).find(".resume_div_wrap .common_box").eq(0).find('.common_con tr:nth-child(3) td:nth-child(2)').text();
      resume.education = $(domHtml).find(".jobseekerbaseinfo_box .jobseekerbaseinfo_con tr:nth-child(4) td:nth-child(2)").text();
      resume.mobile = "";
      resume.email = "";
      resume.company = $(domHtml).find(".resume_div_wrap .common_box").eq(2).find('table:first-child .work_experience strong').text();
      resume.school = $(domHtml).find(".jobseekerbaseinfo_box .jobseekerbaseinfo_con tr:nth-child(5) td:nth-child(2)").text();
      const desc = $(domHtml).find(".resume_div_wrap .common_box").eq(6).find('.common_con td').text();
      resume.keyword = forKeyword(desc);
    } else if (channel === 'boss') {
      let id = $(domHtml).find('.dialog-footer .btn-getcontact').attr('ka').split('_');

      resume.id = id[id.length - 1];
      resume.name = "";
      resume.mobile = "";
      resume.email = "";
      resume.city = "";
      resume.sex = $(domHtml).find('h2.name .fz').hasClass('fz-male') ? 1 : 2;
      resume.jobYear = $(domHtml).find('.item-base .info-labels .fz-experience').parent().text();
      resume.company = $(domHtml).find('.resume-dialog .resume-item').eq(2).find('.history-list .history-item:first-child h4.name').html().split('<em')[0].replace(/\s+/g, "");
      resume.education = $(domHtml).find('.item-base .info-labels .fz-degree').parent().text();
      resume.school = $(domHtml).find('.resume-dialog .resume-item').eq(4).find('.history-list .history-item:first-child h4.name b').text();
      const desc = $(domHtml).find('.resume-dialog .resume-item').eq(2).find('.history-list .history-item:first-child .item-text:first-child .text').text();
      resume.keyword = forKeyword(desc);
    } else if (channel === 'offer') {
      resume.id = $(domHtml).find('.basic-info-container .info-container .float-container:first-child .no').text().split('No.')[1];
      resume.name = $(domHtml).find('.basic-info-container .info-container .float-container:first-child .name').text();
      resume.sex = $(domHtml).find('.basic-info-container .info-container .float-container:nth-child(2) .detail span:first-child').text() === '男' ? 1 : 2;
      resume.city = $(domHtml).find('.basic-info-container .info-container .float-container:nth-child(2) .detail span:nth-child(3)').text();
      resume.jobYear = $(domHtml).find('.skill-container .skills .tsurvey-skill:first-child span').text();
      resume.education = $(domHtml).find('.left-side .exp-container .title:contains("教育经历")').next().find(".exp-item:first-child .exp-post").text();
      resume.school = $(domHtml).find('.left-side .exp-container .title:contains("教育经历")').next().find(".exp-item:first-child .exp-place").text();
      resume.company = $(domHtml).find('.left-side .exp-container .title:contains("工作经历")').next().find(".exp-item:nth-child(2) .exp-place").text();
      const desc = $(domHtml).find('.left-side .exp-container .title:contains("工作经历")').next().find(".exp-item:nth-child(2) .description").text();
      resume.keyword = forKeyword(desc);
      resume.mobile = $(domHtml).find('.basic-info-container .info-container .float-container:nth-child(2) .contact .phone').text().split(':')[1] || '';
      resume.email = $(domHtml).find('.basic-info-container .info-container .float-container:nth-child(2) .contact span:first-child').text().split(':')[1] || '';
    } else if (channel === "zb") {

      resume.id = $(domHtml).find(".resumeCode").text();
      resume.name = $(domHtml).find(".basicInfo .list .title").text();
      try {
        resume.sex = $.trim($(domHtml).find(".basicInfo .list .title").next().text().split("/")[0].split("[")[1]) == '男' ? 1 : 2;
      } catch (e) {
        console.log(e, '性别错误')
      }
      resume.sex = resume.sex ? resume.sex : "1";
      resume.city = $.trim($(domHtml).find(".basicInfo td:contains('现居')").next().text());
      resume.jobYear = $(domHtml).find(".basicInfo td:contains('工作经验')[width=300]").text();
      resume.education = $(domHtml).find(".basicInfo td:contains('工作经验')[width=300]").prev().prev().text();
      resume.school = $(domHtml).find(".print_width th:contains('教育经历')").parents('.item').children('.item_tb').find('.item_bd >tr >td >table:first-child span').parent().text().split("（")[0];
      if (!resume.school.includes('无工作经验')) {
        const company = $(domHtml).find(".print_width th:contains('工作经历')").parents('.item').children('.item_tb.print_width').find('tbody tr:nth-child(2) >td >table:first-child span').parent().text()
        resume.company = company ? company.split('（')[0] : ""
      } else {
        resume.company = "";
      }
      const desc = $(domHtml).find(".print_width th:contains('工作经历')").parents('.item').children('.item_tb.print_width').find('tbody tr:nth-child(2) >td >table:nth-child(4) td').text()
      resume.keyword = forKeyword(desc);
      resume.mobile = $.trim($(domHtml).find(".basicInfo td:contains('手机')").next().text()).split(' ').join("");
      resume.email = $.trim($(domHtml).find(".basicInfo td:contains('邮箱')").next().text());

    }
    if(resume.school[resume.school.length-1]==')'||resume.school[resume.school.length-1]=='）'){
      if(resume.school.indexOf('(')>-1){
        resume.school=resume.school.split('(')[0]
      }else if(resume.school.indexOf('（')>-1){
        resume.school=resume.school.split('（')[0]
      }
    }
    console.log(resume)
    return resume

  };

  function forKeyword(data) {
    var descList = data.split("；")
    for (var j in descList) {
      if (descList[j].length > 12) {
        let keyword = descList[j].substring(0, 50).replace(/&gt;/, ">");
        return keyword;
        break
      }
    }
  }

  //匹配渠道source
  function _matchChannelId(value) {
    let result = "";
    switch (value) {
      case 'lp':
        result = 1;
        break;
      case 'qc':
        result = 2;
        break;
      case 'zl':
        result = 3;
        break;
      case 'boss':
        result = 4;
        break;
      case "lg":
        result = 9;
        break;
      case "cjol":
        result = 10
        break;
      case "tc58":
        result = 11
        break;
      case "offer":
        result = 12
        break;
      case "zb":
        result = 13
        break;
      default:
        break;
    }
    return result;

  }
  $('#modal .cancel').click(function () {
    $("#modal").hide()
  });
  $('#modal .comfirm').click(function () {
    $('#main-loading').show();
    $('#modal').hide()
    let reqdata = {
      resumeIdentification: $('#resumeId').val(),
      channelType: _matchChannelId($('#channel').val()),
      channelTypeName: $('#channel').val(),
      isPutTalentPool: $('#talent').is(":checked") ? 1 : 0,
      positionId: $('#position').val(),
      source: 2,
      fieldInfo: "123",
      // resumeChannerlId: 3,
      name: $('#name').val(),
      jobYear: $('#jobYear').val(),
      education: $('#education').val(),
      resumeHtml: resumeHtml,
      imgCode: $('#resumeImg').val(),
      isSchoolRecruit: 0,
      isCover:isCover,
      oldResumeId:coverRusumeId,
      isCoverOriginalResume:1,
      ischecking:1,
    };
    ivvaImportResume.postMessage({
      data: reqdata,
      status: "importResume"
    }); //发送消息
  })
});


