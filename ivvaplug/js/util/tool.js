//1外网， 0内网
const type=1;
const tool = {
  url: {
    zl: {
      positionList: {
        u: 'https://rd5.zhaopin.com/job/manage',
        t: 'get',
      },
      positionDetail: {
        u: '',
        t: 'get'
      },
      resumeSearch: {
        u: 'https://rd5.zhaopin.com/custom/searchv2',
        t: 'get'
      },
      resumeSearchResult: {
        u: 'https://rd5.zhaopin.com/custom/searchv2/result',
        t: 'get'
      },
      resumeDetail: {
        u: 'https://rd5.zhaopin.com/resume/detail',
        t: 'get'
      },
      resumeDetailFolder: {  //收件箱简历
        u: "https://ihr.zhaopin.com/resume/details/",
        t: "get"
      },
      positionRelease: {
        u: 'https://rd5.zhaopin.com/job/publish',
        t: 'get'
      },
      searchExternalPosition:{ //搜索外网职位
        u:"https://fe-api.zhaopin.com/c/i/sou?pageSize=60&workExperience=-1&education=-1&companyType=-1&employmentType=-1&jobWelfareTag=-1&kt=3",
        t:"get",
      }
    },
    qc: {
      positionList: {  //职位列表  刷新
        u: 'https://ehire.51job.com/Jobs/JobSearchPost.aspx',
        t: 'get',
      },
      positionSearch: {  //职位搜索
        u: 'https://search.51job.com',
        t: 'get'
      },
      positionDetail: {  //职位详情
        u: 'https://jobs.51job.com',
        t: 'get'
      },
      resumeSearch: { //简历搜索
        u: "https://ehire.51job.com/Candidate/SearchResumeIndexNew.aspx",
        t: "get"
      },
      resumeDetail: {  //简历详情
        u: "https://ehire.51job.com/Candidate/ResumeView.aspx",
        t: "get"
      },
      resumeDetailFolder: {  //收件箱简历
        u: "https://ehire.51job.com/Candidate/ResumeViewFolder.aspx",
        t: "get"
      },
      resumeDetailFolderV2: {  //收件箱简历
        u: "https://ehire.51job.com/Candidate/ResumeViewFolderV2.aspx",
        t: "get"
      },
      positionRelease: {
        u: 'https://ehire.51job.com/Jobs/JobEdit.aspx?Mark=New',
        t: 'get'
      },
      resumeSearchResult: {  //简历搜索结果
        u: 'https://ehire.51job.com/Candidate/SearchResumeNew.aspx',
        t: 'get'
      },
      searchExternalPosition:{ //搜索外网职位
        u:"https://search.51job.com/list/000000,000000,0000,00,9,99,",
        t:"get",
        parms:{
          keyword:"",
          pageIndex:1
        }
      }
    },
    lg:{
      resumeSearch:{
        u:'https://easy.lagou.com/search/index.htm',
        t:'get'
      },
      resumeDetail:{
        u:'https://easy.lagou.com/search/resume',
        t:'get'
      },
      resumeDetail2:{
        u:'https://easy.lagou.com/can/new/details.htm',
        t:'get'
      },
      searchExternalPosition:{
        // referer:'https://www.lagou.com/jobs/list_',
        // u:'https://www.lagou.com/jobs/positionAjax.json?px=new&needAddtionalResult=false',
        u:'https://www.lagou.com/jobs/list_',
        t:'get'
      },
      positionRelease: {
        u: 'https://easy.lagou.com/position/multiChannel/createPosition.htm',
        t: 'get'
      },
      positionRelease2: {
        u: 'https://www.zhipin.com/bossweb/jobedit/0.html',
        t: 'get'
      },
      positionList:{
        u:"https://easy.lagou.com/position/my_online_positions.htm?pageNo=1",
        t:"get"
      }
    },
    boss:{
      resumeSearch:{
        u:"https://www.zhipin.com/chat/im?mu=search",
        t:"get"
      },
      searchExternalPosition:{
        u:"https://www.zhipin.com/c100010000/",
        t:"get"
      },
      positionRelease: {
        u: 'https://www.zhipin.com/chat/im?mu=%2Fbossweb%2Fjobedit%2F0.html',
        t: 'get'
      },
      positionList:{
        u:"https://www.zhipin.com/chat/im?mu=%2Fbossweb%2Fjoblist.html",
        t:"get"
      }
    },
    tc58:{
      resumeSearch:{
        u:"https://quanguo.58.com/searchjob",
        t:"get"
      },
      resumeDetail:{
        u:"https://jianli.58.com/resumedetail/",
        t:"get"
      },
      searchExternalPosition:{
        u:"https://quanguo.58.com/job/",
        t:"get"
      },
      positionRelease: {
        u: 'https://zppost.58.com/zhaopin/1/9224/j5',
        t: 'get'
      },
      positionList:{
        u:"https://employer.58.com/jobmgr/recruit",
        t:"get"
      }
    },
    lp:{
      resumeSearch:{
        u:"https://lpt.liepin.com/cvsearch/showcondition/",
        t:"get"
      },
      resumeDetail:{
        u:"https://lpt.liepin.com/cvview/showresumedetail",
        t:"get"
      },
      searchExternalPosition:{
        u:"https://www.liepin.com/zhaopin/?fromSearchBtn=2&d_pageSize=40",
        t:"get"
      },
      positionList:{
        u:"https://lpt.liepin.com/ejob/showpublishejoblist/",
        t:"get"
      }

    },
    cjol:{
      resumeSearch:{
        u:"http://newrms.cjol.com/searchengine",
        t:"get"
      },
      resumeDetail:{
        u:"cjol.com/resume/detail",
        t:"get"
      },
      resumeSearchResult:{
        u:"http://newrms.cjol.com/SearchEngine/List"
      },
      searchExternalPosition:{
        u:"http://s.cjol.com/service/joblistjson.aspx?RecentSelected=43&SearchType=3&ListType=2"
      },
      positionRelease: {
        u: 'http://newrms.cjol.com/jobpost/jobpost',
        t: 'get'
      },
      positionList:{
        u:"http://newrms.cjol.com/jobpost",
        t:"get"
      }
    },
    offer:{
      resumeSearch:{
        u:"https://cn.100offer.com/recruiters/home",
        t:"get"
      },
      resumeDetail:{
        u:"https://cn.100offer.com/recruiters/resumes",
        t:"get"
      },
      positionRelease: {
        u: 'https://cn.100offer.com/recruiters/positions/new',
        t: 'get'
      },
      positionList:{
        u:"https://cn.100offer.com/recruiters/positions",
        t:"get"
      }

    }
  },
  //获取url中的参数
  getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
  },
  /* 学历列表    */
  getEducation: () => ([
    {
      id: '',
      value: '不限'
    }, {
      id: '9',
      value: '初中及以下'
    }, {
      id: '13',
      value: '高中'
    }, {
      id: '7',
      value: '中技'
    }, {
      id: '12',
      value: '中专'
    }, {
      id: '5',
      value: '大专'
    }, {
      id: '4',
      value: '本科'
    }, {
      id: '3',
      value: '硕士'
    }, {
      id: '10',
      value: 'MBA'
    }, {
      id: '11',
      value: 'EMBA'
    }, {
      id: '1',
      value: '博士'
    }, {
      id: '8',
      value: '其他'
    }
  ]),
  LocalStorage: {
    on: function() {
      this.events.addListener.apply(this.events, arguments);
    },
    off: function() {
      this.events.removeListener.apply(this.events, arguments);
    },
    fireEvent: function(name, event) {
      if(this.events) {
        this.events.fireEvent(name, event);
      }
    },
    get: function get(name) {
      var s = localStorage.getItem(name),
        obj;
      try {
        obj = s ? JSON.parse(s) : null;
      } catch(e) {
        console.log(name + " : " + s);
      }
      return obj;
    },
    set: function(name, obj) {
      var args = {};
      args[name] = {
        oldValue: this.get(name),
        value: null
      };
      if(obj === undefined) {
        localStorage.removeItem(name);
      } else {
        try {
          localStorage.setItem(name, JSON.stringify(obj));
        } catch(e) {
          if(e.name == 'QuotaExceededError') {
            localStorage.clear();
          }
        }
      }
      args[name].value = obj;
      this.fireEvent("PropertyChanged", args);
    },
    destory: function(name) {
      localStorage.removeItem(name);
    }
  },


  ajaxUrl: type?'https://www.ivvajob.com':'http://192.168.1.154:8080',  //外网IP
  // ajaxUrl: 'http://192.168.1.154:8080',  //内网IP
};
