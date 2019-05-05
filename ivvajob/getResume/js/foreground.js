window.onload = ()=>{
  const ivvaFgPort = chrome.runtime.connect({
    name: "ivvaFgPort"
  }); //构建链接
  ivvaFgPort.onMessage.addListener(function (msg) {
    if(msg.status==="condition"){
      const config={
        jobType:msg.data.jobId,
        age:msg.data.age,
        city:msg.data.cityId,
      }
      zl.search(config,1);
    }
  });
  const [searchUrl,listUrl,detailUrl,loginUrl,loginUrl2] = ["/custom/searchv2","/custom/searchv2/result","/resume/detail","/org/login","/org"];
  const pathname = location.pathname;
  const jobType = [4010200,7001000,7002000,4000000,4082000,4084000,7004000,2060000,5002000,3010000,201300,2023405,1050000,160000,160300,160200,160400,200500,200300,5001000,141000,140000,142000,2071000,2070000,7006000,200900,4083000,4010300,4010400,121100,160100,7003000,7003100,5003000,7005000,5004000,121300,120500,2120000,2100708,2140000,2090000,2080000,2120500,5005000,4040000,201100,2050000,2051000,6270000,130000,2023100,100000,200100,5006000,200700,300100,300200];
  const defaultCondition = [{"filterId":38,"selected":"3,days"}];
  class paChong {
      constructor(){
        this.age = tool.getUrlParam('age')||18;
        this.jobType = tool.getUrlParam('jobType')||4010200;
        this.city = tool.getUrlParam('city');
      }
      search({city=this.city,jobType=this.jobType,age=this.age}={},type){
        if(type){
          this.age = age;
          this.jobType = jobType;
          this.city = city;
        }
          let searchCondetion = defaultCondition;
          searchCondetion.push({filterId: 15, left:age,right: age});
          searchCondetion.push({filterId: 14, value: [jobType]});
          searchCondetion.push({filterId: 11, value: [city]});
          const uid = $.cookie('zp-route-meta').split(',')[0];
          const userId = uid && uid.split("=")[1];
          tool.LocalStorage.set(`resume_apply_filter_expand`, true);
          tool.LocalStorage.set(`${userId}-filter`, searchCondetion);
          window.location.href=`${location.origin}${listUrl}?age=${this.age}&jobType=${this.jobType}&city=${this.city}`
      }
      resultList(){
        let total = $('.k-pagination__total').text();
        if(total){
          total = total.split(' ')[1];
          if(total>0){
            this.currentPage = $('.k-pager .number.is-active').text();
            this.totalPage = total;
            this.searchList = $('.search-list .resume-item__user-name').length;
            this.jumpDetail(0);
          }else {
            this.switchCondition()
          }
        }

      }
      jumpDetail(i){
        if(i<this.searchList){
          $('.search-list .resume-item__user-name').eq(i).find('a')[0].click();
          tool.LocalStorage.set(`resume_apply_filter_expand`, true);
          const time = Math.ceil(Math.random()*5)*1000;
          setTimeout(()=>{
            this.jumpDetail(i+1);
          },time)
        }else {
          this.jumpPage()
        }
      }
      jumpPage(){
        if(this.currentPage<this.totalPage){
          $('.btn-next').click();
          setTimeout(()=>{
            this.resultList()
          },2000)
        }else {
          this.switchCondition()
        }
      }
      switchCondition(){
        if(this.age<60){
          this.age = this.age-0+1;
          this.search({city:this.city})
        }else {
          const index = jobType.findIndex(o=>o==this.jobType);
          if(index!==-1&&index<jobType.length){
            this.jobType = jobType[index+1];
            this.age = 18;
            this.search({city:this.city,age:18})
          }else {
            chrome.extension.sendMessage({
              status:"jobFinish"
            })
          }
        }
      }
      getDetail(){
        const uid = $.cookie('zp-route-meta').split(',')[0];
        const userId = uid && uid.split("=")[1];
        const condition = tool.LocalStorage.get(`${userId}-filter`);
        setTimeout(()=>{
          if($('.k-message-box.is-danger').length>0){  //达到上限
            chrome.extension.sendMessage({status:"stop"});
          }else {
            chrome.storage.local.get('userName', (result) => {
              let [age,cityId,jobId]=['','',''];
              condition.map(item=>{
                switch (item.filterId) {
                  case 11:
                    cityId = item.value[0];
                    break;
                  case 15:
                    age = item.left;
                    break;
                  case 14:
                    jobId = item.value[0];
                    break;
                  default:break;
                }
              });
              let reqdata={
                cityId:cityId,
                age:age,
                jobId:jobId,
                userName:result.userName,
                resumeHtml:$('html').html(),
                source:3
              };
              let config={
                status:"resumeDetail",
                data:reqdata
              }
              chrome.extension.sendMessage(config)
            });
          }

          setTimeout(()=>{
            window.close()
          },1000)
        },1000)
      }
    };
    let zl = new paChong();
    switch (pathname) {
      case searchUrl:
        ivvaFgPort.postMessage({status:'begin'});
        break;
      case listUrl:
        chrome.extension.sendMessage({status:"searchResult"});
        setTimeout(()=>{zl.resultList();},1000);
        chrome.runtime.onMessage.addListener(request=>{
          console.log(request)
          if(request.status=="stop"){
            window.location.href="about:blank";
          }
        });
        break;
      case detailUrl:
        zl.getDetail();
        break;
      case loginUrl:
        $('#loginbutton').on("click",()=>{
          chrome.storage.local.set({'userName': $('#loginName').val()});
        });

        break;
      case loginUrl2:
        chrome.extension.sendMessage({status:"stop"});
        break;
      default:break
    }
}

