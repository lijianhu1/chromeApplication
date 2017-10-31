var referer = '';
var headerCookie = '';
var resumeSearchCookieList = '';
var domainUrl = 'http://www.yifengjianli.com';
//var domainUrl = 'http://127.0.0.1:8082';

function removeCookie(){
	//删除cookie
	if(typeof resumeSearchCookieList != 'string' && resumeSearchCookieList.length > 0){
		for (var index in resumeSearchCookieList) {
			var cookieName = trim(resumeSearchCookieList[index].split('=')[0]);
	    var ind = resumeSearchCookieList[index].indexOf('=');
	    var cooKieVal = resumeSearchCookieList[index].slice(ind+1);
	    
			//删除cookie
	    chrome.cookies.remove({
	        'url':'https://rdsearch.zhaopin.com',
	        'name':cookieName,
	    }, function(cookieObj){
	    	console.log(cookieObj)
	    });
	  }
	}
}

function addCookie(){
	//var cookieTextSearch = 'dywez=95841923.1501141733.3.3.dywecsr=rd2.zhaopin.com|dyweccn=(referral)|dywecmd=referral|dywectr=undefined|dywecct=/s/homepage.asp; urlfrom=121126445; urlfrom2=121126445; adfcid=none; adfcid2=none; adfbid=0; adfbid2=0; _jzqa=1.3565627271329395000.1502693010.1505964579.1507688403.10; _jzqc=1; LastCity=%e6%b7%b1%e5%9c%b3; LastCity%5Fid=765; FSSBBIl1UgzbN7N80T=1jBJGAwPUqQxaeF3ZhKFcIE7SQmOZC6J3XcrQecdxo8oHmX2PG1PCRJCvOqLZNZ_DuffTjVPux7ohbr_Ez5cMfESIZl.eDvTpUewdLUO1iPJGM7yo1d2_ASVsj93AwqaFnXQGFIFbcrWMhIOBksDRhQSBfykTy3lflzBTIw6LD5.SDwKdg7HfkNnvjv4KbU0aYATyL_VLUEx3dZHM3zCmLKECCyHsnKeRsvtQ68MHVlmlDUnRcXgtcWBrEjP8AD4xXqD_4o6JZvMOyvKvQC927cafY0E3DQknCydEKWzzt6ZvCNjITBNb._BJafxY3aTfedHqOWFJOlr8HHMPUeBFQydn; Home_ResultForCustom_isOpen=true; dywez=95841923.1501141733.3.3.dywecsr=rd2.zhaopin.com|dyweccn=(referral)|dywecmd=referral|dywectr=undefined|dywecct=/s/homepage.asp; FSSBBIl1UgzbN7N443S=luFUibwjI.g..huXovahz.smcHIn9jBZRfEykhZPbI2rGxtWpJggXaBEyLP7SfEc; Home_1_CustomizeFieldList=22%3b11%3b17%3b21%3b23%3b13%3b2%3b16%3b3; __zpWAM=1501120704821.56516.1504851638.1505896531.4; urlfrom=121126445; urlfrom2=121126445; adfcid=none; adfcid2=none; adfbid=0; adfbid2=0; _jzqa=1.3565627271329395000.1502693010.1505964579.1507688403.10; _jzqc=1; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1505801681,1505896432,1505964579,1507688403; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1507688403; LastCity=%e6%b7%b1%e5%9c%b3; LastCity%5Fid=765; at=b84ba895baa54f40a68a7ba4790b74ee; Token=b84ba895baa54f40a68a7ba4790b74ee; rt=d038dc71963e45a0b7c4b08ba0c9e191; uiioit=2264202C55795869083746795D6B4664572C5F795F6908374E792A6B3364592C5B7953690D3744795F6B4064552C5A7951695; JsNewlogin=203513750; utype=2; ihrtkn=; cgmark=2; NewPinLoginInfo=; NewPinUserInfo=; RDpUserInfo=; isNewUser=1; RDsUserInfo=36672168546B59754177567142654671566350655D695B6B4E713B653F775877076507671F68106B58754877507146654071526356655A69506B207139654C773A1B023C883F5E682B6B2F754C7756714E654271546350655F695A6B47714C6533772B774C65AF3CBDF2416B7C26DD394C71E20733FCC4186111610E3BFD19208F364A7731773C655E675E682C6B26754C770F711E6516710B6300650469026B1B71376501770777426555675568476B08751F775E71246523715863556553692A6B21714A65407755775C6552675468496B5A7541775F71456547715E6323652C69566B46714E65447754774665546754685B6B507535772B714A65BB2ABDF94F657F3AC7255C71E20735FAC40C77116A0035FE053A93264A7729713A654A715563576558695A6B4E71346535775877446550675568526B3E75257758714665477154635C652B692A6B48713465327756774865566754685E6B5C754077577147654C71216326655569286B3671446548775077406554675268586B597541775E7133653471586357655369386B3C714A6542775E773865336758685B6B5F7543774B714665467155635C652969276B487147654A771; __utma=269921210.513505966.1501067104.1505964579.1507688403.18; __utmc=269921210; __utmz=269921210.1501141733.3.3.utmcsr=rd2.zhaopin.com|utmccn=(referral)|utmcmd=referral|utmcct=/s/homepage.asp; __utmv=269921210.|2=Member=203513750=1; getMessageCookie=1; dywea=95841923.3661804070217011700.1501067104.1505964579.1507688403.24; dywec=95841923; dyweb=95841923.2.9.1507790292071; JSShowname=; utype=203513750; LoginCity=530; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1505801681,1505896432,1505964579,1507688403; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1507798480; __zpWAM=1501120704821.56516.1505896531.1507798480.5; __zpWAMs1=1; __zpWAMs2=1; JsOrglogin=610541252; at=37c4c99cf66e42d296845b2dbaa496c2; Token=37c4c99cf66e42d296845b2dbaa496c2; rt=fb79d9ddc3ab412994c46ec846e2226b; uiioit=3D753D6A44640B385B6D5D620335556846795D795139086B566E2036716455754A6A40640C385A6D596201355568477951799; lastchannelurl=https%3A//passport.zhaopin.com/org/login; __utmt=1; NewPinUserInfo=; ihrtkn=; cgmark=2; NewPinLoginInfo=; JsNewlogin=203513750; RDpUserInfo=; isNewUser=1; RDsUserInfo=3D753D6857645A75496859645D75486859645F754C685A6453753568246455750F680E6412750068596451754C685B645F754E685B645A7542683F642675446835081B2C923051642A753D6857645B7540685F6459754E685D6459754B6851642A7537685764A42EA1F242647F26D5264364FD173DE5CB1F6E01700F3AF20424813B51643C753468576453753C682764557513680364097517680D640475106804642875096808645B754F685A6446751A68046453752A683E6455754B68516429752D68576459754968476459754B684A6459754F6850645D75406851642C753D6857645B7540685F6459754E685D6459754B6851642C7537685764A42EA1F242647F26D5264364FD173DE5CB1F6E01700F3AF20424813B5164247534685764587549685A645975426829642C7544685F645B75496851643D752D685764597549685B6453753A682B6455753A6829645B7540685F6459754E685D6459754B685A6453753D682B6455753A6829645B7540685F6459754E685D6459754B685A6453753D6829645575496851643B75306857645B75426823643875446858645C754B684464597548685A645375386826645575496851643; getMessageCookie=1; SearchHead_Erd=rd; __utma=269921210.513505966.1501067104.1505964579.1507688403.18; __utmb=269921210.13.9.1507798758231; __utmc=269921210; __utmz=269921210.1501141733.3.3.utmcsr=rd2.zhaopin.com|utmccn=(referral)|utmcmd=referral|utmcct=/s/homepage.asp; __utmv=269921210.|2=Member=203513750=1; SearchHistory_StrategyId_1=%2fHome%2fResultForCustom%3fSF_1_1_1%3djava%26orderBy%3dDATE_MODIFIED%252c1%26SF_1_1_27%3d0%26exclude%3d1; FSSBBIl1UgzbN7N80S=fVXk4Rn6Y3mXLYP1_8HZ5_a2HD67UA7QcEj725P0Zl.TqKgSPr0Ce_7LrZXZeZN9; Home_ResultForCustom_orderBy=DATE_MODIFIED%2C1; dywea=95841923.3661804070217011700.1501067104.1505964579.1507688403.24; dywec=95841923; dyweb=95841923.3.9.1507790292071; FSSBBIl1UgzbN7N443T=1M8TdbU3Z_x_b_Psdx5dvBSh6kvuUgPTyweigcjjnmSF7esOX_0qhJksBCKk6iRpmw5L81BGRUzn8XqnKADuKtxoId999rYkiTl_t5bxShWsfDTW9PneZFq6Tgv1AJXgQh1iYfmfpvglZzWZnlj1uggIklq4HuTdbWAK30.DF2T3rnUw5wuYJI.umpqBNbiPZHEyzv_SYx_Atu1q0qpuNA7BHXFvi7G5J.oeSdao53Xek.gfQ1hYUunnvKxc51APmQEGWnMEV0XDx8KqZBWxojoc6JyL3VLvaW68jAGGpIwO7d249Zu25d8Hqm4qm94VbJ7ovTYUcM7Rr8OyuoO467_.E';
	removeCookie();
	//去除空格
	function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
	}
	for (var index in resumeSearchCookieList) {
    var cookieName = trim(resumeSearchCookieList[index].split('=')[0]);
    var ind = resumeSearchCookieList[index].indexOf('=');
    var cooKieVal = resumeSearchCookieList[index].slice(ind+1);
    //删除cookie
    chrome.cookies.remove({
      'url':'https://rdsearch.zhaopin.com',
      'name':cookieName,
    }, function(cookieObj){
    	console.log(cookieObj)
    });
  
		//设置cookie
    chrome.cookies.set({
      'url':'https://rdsearch.zhaopin.com',
      'name':cookieName,
      'value':cooKieVal,
      'secure':false,
      'httpOnly':false
    }, function(cookie){
    	
    });
	};
}

chrome.extension.onConnect.addListener(function (port) {
    if(port.name=='zlSearch'){    //投递职位列表
        port.onMessage.addListener(function (requestData) {
        	referer = 'https://rdsearch.zhaopin.com/Home/ResultForCustom?SF_1_1_1=Java&SF_1_1_27=0&orderBy=DATE_MODIFIED,1&exclude=1';
        	headerCookie = requestData.searchCookie;
					resumeSearchCookieList = headerCookie.split(';');
        	//请求打码函数
        	var tryNum = 0;
        	var tryDamaNUm = 0;
        	function dama(){
        		tryDamaNUm++;
        		if(tryDamaNUm>3){
        			tryDamaNUm=0;
        			tryNum = 0;
        			port.postMessage('');
        			return false;
        		}
        		$.ajax({
	            url: domainUrl+'/zlresume/zlDama',
	            data: {zlCookie: requestData.searchCookie},
	            type:'post',
	            dataType:'json',
	            success:function (res) {
	            	//打码完成之后，重新请求cookie
	            	$.ajax({
			            url: domainUrl+'/zlresume/getZlSearchCookie',
			            data: '',
			            type:'post',
			            dataType:'json',
			            success:function (res) {
			            	if(res.code == 200){
				            	tryNum = 0;
				            	//dealCookie(requestData.headerCookie);
				            	headerCookie = res.zl_cookie;
				              getResult();
			            	}else{
			            		dama();
			            	}
			            },
			            error:function (res) {
			            	dama();
			              console.log(res);
			            }
			          })
	            },
	            error:function (res) {
	              console.log(res);
	            }
	          })
        	}
        	//正常请求
        	function getResult(){
		        $.ajax({
	            url:'https://rdsearch.zhaopin.com/Home/ResultForCustom',
	            data: JSON.parse(requestData.searchValue) ,
	            //data: 'SF_1_1_1=Java&SF_1_1_25=COMPANY_NAME_ALL:%E6%8A%80%E6%9C%AF&SF_1_1_27=0&orderBy=DATE_MODIFIED,1&exclude=1',
	            type:'get',
	            dataType:'text',
	            success:function (res,status,jqXHR) {
	              //var objStr = JSON.stringify({"code":200,"message":"获取成功","resumeList":{"total":"4000","resumeList":[{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-03 ～ 至今     西安捷众软件公司（7个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：设计并制作项目产品的登录注册页面，主页面，内容页面，添加和编辑页面等;调整框架中的样式和功能，使其符合客户和大众的审美标准;完善页面前端的功能部分，编写原声js 代码，用ajax 请求后台数据，将获取的数据用h-chart等显示到前台页面上。 ","work_base":"居住地：陕西-西安    期望月薪：4001-6000元/月","work_compSize":"    计算机软件  |  -  |  -  ","updateTime":"17-10-12","adder":"陕西-西安","salary":"4001-6000元/月","url":"GublXDv)x1wODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=00B3C82EA97C0A8653AAEF97EEDDD3ED","resumeName":"web前端","work_edu":" 2012-09 ～ 2016-07    上海第二工业大学    数字媒体技术    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"本科","age":"25","isRead":"1","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-09 ～ 2017-09     河南中云微迅信息技术有限公司（2年）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：1、网站制作与维护2、移动端页面制作与维护3、微信公众号页面制作与维护4、专题活动页面制作与维护 ","work_base":"居住地：河南-郑州    期望月薪：保密","work_compSize":"    计算机软件  |  民营  |  100-499人  ","updateTime":"17-10-12","adder":"河南-郑州","salary":"保密","url":"Udet5mBoa3EODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=6DDF3BAD265756734BFDF8600CD11C52","resumeName":"web前端","work_edu":" 2009-05 ～ 2011-12    华北水利水电学院    计算机科学与技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"27","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-04 ～ 至今     江苏老账房金融有限公司（2年6个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：1、负责公司产品Web前端研发2、与产品经理、设计师、后端工程师紧密工作在一起，负责公司各产品易用性改进、界面技术优化和网站性能优化3、Web前沿技术研究 ","work_base":"居住地：江苏-苏州    期望月薪：6001-8000元/月","work_compSize":"    互联网/电子商务  |  -  |  20-99人  ","updateTime":"17-10-12","adder":"江苏-苏州","salary":"6001-8000元/月","url":"LN6R6nCIkL8ODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=828C75161D7261F56107A4D336DE8853","resumeName":"web前端","work_edu":" 2011-09 ～ 2014-07    江阴职业技术学院    计算机科学与技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"26","isRead":"1","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-06 ～ 2017-08     郑州星石科技有限公司（2个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：使用Ｈtml+CSS等网页制作技术和js脚本语言Dom操作等前端web技术进行网站开发。 ","work_base":"居住地：河南-郑州    期望月薪：保密","work_compSize":"    IT服务(系统/数据/维护)  |  民营  |  20人以下  ","updateTime":"17-10-12","adder":"河南-郑州","salary":"保密","url":"HF8N8KWc9j0ODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=D9EF1D8618A46B0697388665C289F34B","resumeName":"web前端","work_edu":" 2014-09 ～ 2017-06    开封大学    电子商务    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"21","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-04 ～ 至今     江苏健康无忧网络科技有限公司（1年6个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：1、与设计团队密切合作，实现设计师的想法，还原UI设计。了解产品设计逻辑及交互设计，在效果图或交互原型的基础上独立快速完成前端开发。2、根据工作安排，高效、高质的编写公司软件项目中 Web 或其他前端的JavaScript代码，确保编写的代码符合业内JavaScript代码常规规范。3、移动端开发，以flex与rem布局为主，适配不同手机浏览器，确保产品在 ","work_base":"居住地：江苏-南京    期望月薪：保密","work_compSize":"    医药/生物工程  |  民营  |  100-499人  ","updateTime":"17-10-12","adder":"江苏-南京","salary":"保密","url":"PilRbxwZ7FAODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=0C2F7F82FA29E32924B95694092A93A4","resumeName":"web前端","work_edu":" 2011-02 ～ 2014-01    重庆交通大学    航海技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  8001-10000元/月","edu":"大专","age":"25","isRead":"1","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-01 ～ 2017-05     北京千晨科技（1年4个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：主要负责将设计稿转化为页面，用户交互及过渡效果的处理，页面跳转及分类的梳理。 ","work_base":"居住地：天津-滨海新区    期望月薪：4001-6000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"天津-滨海新区","salary":"4001-6000元/月","url":"GJeA)JEGJWMODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=E75B537ABAB06FF90668A9D12F1EA6F0","resumeName":"web前端","work_edu":" 2012-09 ～ 2016-06    长春科技学院    机械设计制造及其自动化    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  6001-8000元/月","edu":"本科","age":"23","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-11 ～ 2017-08     上海华腾（1年9个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：根据项目story进行开发，及测试工作，主要进行项目前端开发，使用技术，js css html配合同事能按时完成项目要求，主动发现defect并及时改正，在开发功能阶段同时对accessibility进行开发，防止后期因为代码冲突而进度延迟。熟练使用，html css JavaScript 开发前端页面，熟练掌握jQuery bootstrap angul ","work_base":"居住地：陕西-西安    期望月薪：保密","work_compSize":"    计算机软件  |  上市公司  |  1000-9999人  ","updateTime":"17-10-12","adder":"陕西-西安","salary":"保密","url":"iYdm8mA(xcd88RoTQKmMNw_1_1?searchresume=1&t=1507803934&k=A7638BD608496F9BE3C5173136A13459","resumeName":"WEB前端开发 ","work_edu":" 2010-09 ～ 2013-07    西安理工大学    其他    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"26","isRead":"1","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-06 ～ 2017-05     西安设色广告文化传播有限公司（11个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：担任页面的切图，生成html静态页面，利用JavaScript和jQuery实现页面的动态效果，bootstrap实现响应式 。利用ajax进行前后台交互http //ywt.zhonghuass.cn/ 药王堂http //dmg.zhonghuass.cn/ 大明宫复建http //zhonghuass.cn/ 中华盛世http //phot ","work_base":"居住地：陕西-西安    期望月薪：4001-6000元/月","work_compSize":"    互联网/电子商务  |  民营  |  20-99人  ","updateTime":"17-10-12","adder":"陕西-西安","salary":"4001-6000元/月","url":"4y6ZvwDzoa4ODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=D056CD254D0A50546485717F08E97987","resumeName":"web前端开发 西安","work_edu":" 2008-08 ～ 2012-06    四川核工业职工大学    机械设计制造及其自动化    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  2001-4000元/月","edu":"大专","age":"27","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-07 ～ 2017-09     武汉安创乐科技有限公司（1年2个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：在该公司主要负责两部分内容：前端页面开发和后台数据接口调用1. 负责公司前端页面的开发，脚本效果的功能开发，项目产品展示以及活动页面的开发。2. 负责后台接口的数据调用，通过ajax静态模式把数据调用到静态页面上，实现数据的同步，日常维护页面的内容更新。 ","work_base":"居住地：湖北-武汉-江汉区    期望月薪：6001-8000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"湖北-武汉-江汉区","salary":"6001-8000元/月","url":"5h0Pqgze3wkODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=E1E5E3CE52FBE759BCAD60881AC69219","resumeName":"WEB前端开发","work_edu":" 2009-09 ～ 2012-06    中南民族大学工商学院    计算机科学与技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  6001-8000元/月","edu":"大专","age":"25","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-12 ～ 2017-08     广州银迅通网络支付有限公司（8个月）","jobTitle":"web前端开发","sex":"男","work_desc":" 工作描述：独立负责WEB前端开发，确保符合规范的前端代码规范，还原成设计图要求的页面，制作成优秀的动画效果，配合后端完成良好的数据交互。 ","work_base":"居住地：广东-广州-天河区    期望月薪：4001-6000元/月","work_compSize":"    互联网/电子商务  |  民营  |  100-499人  ","updateTime":"17-10-12","adder":"广东-广州-天河区","salary":"4001-6000元/月","url":"1N19)ZhOjtgODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=BFB72F13D5065A2EEE15610A9E1ECF45","resumeName":"web","work_edu":" 2012-09 ～ 2016-06    南昌大学    热能与动力工程    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端开发  |  4001-6000元/月","edu":"本科","age":"24","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-08 ～ 至今     厦门房地产联合网（1年2个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：小程序，基于angular2开发网站，ionic2应用开发 ","work_base":"居住地：福建-厦门-集美区    期望月薪：4001-6000元/月","work_compSize":"    计算机软件  |  上市公司  |  100-499人  ","updateTime":"17-10-12","adder":"福建-厦门-集美区","salary":"4001-6000元/月","url":"azBoniQxONQODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=94B416490FCB66CFFD6FCF67E6D32006","resumeName":"web前端","work_edu":" 2012-09 ～ 2016-07    莆田学院    电子信息科学与技术    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"本科","age":"25","isRead":"1","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-11 ～ 至今     深圳顺势新媒体有限公司（11个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：1、负责项目页面前端HTML+CSS的开发，小版块设计，根据网页需求，熟练运用 HTML CSS 写出兼容于目前主流浏览器的前端页面，在项目组工程师的指导下，利用各种Web技术进行网页产品的界面开发，配合后台开发人员实现网站界面和功能；2、将前端程序套用织梦，之后测试上线；3、对网站进行维护，写伪原创、发外链、交换友情链接等。 ","work_base":"居住地：广东-深圳-龙岗区    期望月薪：6001-8000元/月","work_compSize":"    互联网/电子商务  |  上市公司  |  20-99人  ","updateTime":"17-10-12","adder":"广东-深圳-龙岗区","salary":"6001-8000元/月","url":"xkYKTxFWezwODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=D9CD4486CAE5E75F6025FB8719738411","resumeName":"web前端","work_edu":" 2013-09 ～ 2016-06    武汉信息传播职业技术学院    电子信息工程    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"23","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-08 ～ 2017-08     思亿欧中心（2年）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：2015到2016初，基本是做静态网站和企业网站，做过的网站有很多，比如http //xiaomicz.net/ 整个网页的切片和前端都是自己负责，在很多项目中，多数是前端整写，顺便和后台对接。保存代码github。传输工具ftp。了解域名后台，虚拟空间。海内海外等网站搭乘的需要东西。遇到的问题基本上有很多，比如1：png图为什么在ie6不显示，后来直接用 ","work_base":"居住地：广东-深圳-宝安区    期望月薪：10001-15000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"广东-深圳-宝安区","salary":"10001-15000元/月","url":"Gl(Pah)h)CbYCIqY09Jb0w_1_1?searchresume=1&t=1507803934&k=6F7C39F937A6DA8021DEEDDBCF610648","resumeName":"web前端","work_edu":" 2011-09 ～ 2014-06    长沙民政职业技术学院    软件开发与项目管理    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  8001-10000元/月","edu":"大专","age":"24","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-09 ～ 2017-09     上海卓致信息技术有限公司（1年）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：在该公司主要负责移动端微信端网站的开发，配合设计师完成网站的交互设计和UI设计工作，且与后端工程师配合，为项目提供最优化的技术解决方案。主要的内容有：移动端官网和微信公众号 h5 页面的开发与优化移动端体彩购票系统的开发足球射门游戏 H5 宣传页足球分组抽签页面的开发等 ","work_base":"居住地：上海-闵行区    期望月薪：8001-10000元/月","work_compSize":"    互联网/电子商务  |  民营  |  100-499人  ","updateTime":"17-10-12","adder":"上海-闵行区","salary":"8001-10000元/月","url":"vbzo3d1Q5VkODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=23D26C5B01260DA5E92AFE31BCA4CA7F","resumeName":"web前端","work_edu":" 2012-09 ～ 2016-07    中原工学院    测控技术与仪器    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  6001-8000元/月","edu":"本科","age":"25","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-09 ～ 至今     苏醒文化传播有限公司（1个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：主要负责微信项目前端界面设计及页面编写工作 ","work_base":"居住地：河南-郑州    期望月薪：4001-6000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"河南-郑州","salary":"4001-6000元/月","url":"ldHy8unAFLgODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=0A55887BD2BED5948EEB5FC5F86CE27E","resumeName":"求职web前端","work_edu":" 2016-01 ～ 至今    自学web前端    其他    其它 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"其他","age":"24","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-08 ～ 2017-06     艾邦视觉文化（1年10个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：精通前端开发 ","work_base":"居住地：四川-成都    期望月薪：6001-8000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"四川-成都","salary":"6001-8000元/月","url":"KvHfwDRGWQkODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=AD135D7969C9734742A532C44C30536C","resumeName":"WEB前端开发 成都","work_edu":" 2011-09 ～ 2014-07    西南大学(自考)    艺术学    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"本科","age":"24","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-02 ～ 2017-07     途欢医疗健康科技有限公司（5个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：负责网站页面的搭建，以及后台数据交换 ","work_base":"居住地：四川-成都-锦江区    期望月薪：6001-8000元/月","work_compSize":"    IT服务(系统/数据/维护)  |  -  |  -  ","updateTime":"17-10-12","adder":"四川-成都-锦江区","salary":"6001-8000元/月","url":"YFwT3hyg2X)YCIqY09Jb0w_1_1?searchresume=1&t=1507803934&k=96B9C548C490A8A165664636DFFBE89F","resumeName":"WEB前端开发 成都","work_edu":" 2014-09 ～ 2017-07    民办四川天一学院    房地产经营与估价    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"22","isRead":"1","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-05 ～ 至今     江苏千玑信息技术有限公司（5个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：根据公司产品的需求 绘制前端页面以及与公司后台进行数据交互。在公司主要的工作是协助后端并完成前端开发项目，担任web前端开发工程师一职，主要负责公司官网中前端工作的开发以及代码优化，同时也负责公司旗下项目网站的制作及优化，还有图片优化处理和PC端的网站页面设计。 ","work_base":"居住地：江苏-南京-雨花台区    期望月薪：保密","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"江苏-南京-雨花台区","salary":"保密","url":"8dT7ASQb1irYCIqY09Jb0w_1_1?searchresume=1&t=1507803934&k=1D64872A9F7D158155A8E6EAED33B6C1","resumeName":"WEB前端开发 ","work_edu":" 2013-09 ～ 2016-07    淮南职业技术学院    计算机应用技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"22","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-05 ～ 至今     冰风网络工作室（5个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：主要编写页面，增加效果。 ","work_base":"居住地：江西-南昌-青山湖区    期望月薪：4001-6000元/月","work_compSize":"    IT服务(系统/数据/维护)  |  -  |  -  ","updateTime":"17-10-12","adder":"江西-南昌-青山湖区","salary":"4001-6000元/月","url":"5ECVYhGLyg6skWjs9tnzJg_1_1?searchresume=1&t=1507803934&k=5D40347673232947C6028AEE9CFAF3C8","resumeName":"WEB前端开发 半年 南昌","work_edu":" 2014-09 ～ 2019-07    上饶职业技术学院    计算机科学与技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  2001-4000元/月","edu":"大专","age":"20","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2014-11 ～ 2016-04     南京东软睿道信息技术有限公司（1年5个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：完成领导给的项目指标 根据UI给的效果图去完成页面构建并根据客户的需求去更改项目的部分需求 ","work_base":"居住地：陕西-西安    期望月薪：6001-8000元/月","work_compSize":"    计算机软件  |  民营  |  20人以下  ","updateTime":"17-10-12","adder":"陕西-西安","salary":"6001-8000元/月","url":"thv987q1kQ4ODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=1C38CCB96786C349C60BD0339957586A","resumeName":"web前端 2年半","work_edu":" 2007-10 ～ 2011-07    南京晓庄学院    国际经济与贸易    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"本科","age":"29","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-06 ～ 2017-06     山西布莱德瑞克科技有限公司（1年）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：1：负责移动端Web展现页面的设计与开发；2：配合相关后台系统完成产品功能与设计；3：负责网站的前端性能优化和用户体验优化工作； 4：负责用户交互模式，提升产品界面易用性和人性化。 ","work_base":"居住地：山西-太原    期望月薪：保密","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"山西-太原","salary":"保密","url":"2)M6I)fnbkIODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=CD2DDB799F80EBC3D44FFB449612D114","resumeName":"WEB前端开发 3年","work_edu":" 2011-09 ～ 2015-06    山西工商学院    计算机科学与技术    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"本科","age":"25","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-03 ～ 2017-02     武汉佳网科技有限公司（1年11个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：在该公司主要负责三大部分，网站设计、网站制作以及套后台；网站设计：采集客户的公司信息，网站风格等，进行设计初稿，发给客户按照客户的想法进行相应的修改；网站制作：就是把设计确认的首页，进行图转码下来然后添加合适的JS/JQ特效，和延时动态特效，制作完成后发给客户确认，之后在制作内页制作。套后台：把静态转化动态，制作完成HTML的网页，套用CMS内容管理系统， ","work_base":"居住地：湖北    期望月薪：保密","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"湖北","salary":"保密","url":"h(8jgQ5iw74ODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=DA2F8B1532FFD0C385CE80FD89AE70CF","resumeName":"WEB前端开发 美工 湖北","work_edu":" 2012-09 ～ 2015-06    武汉职业技术学院    其他    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  2001-4000元/月","edu":"大专","age":"24","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-07 ～ 2017-08     佰邦达科技（北京）有限公司（2年1个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：根据设计图，用代码还原设计界面（pc端和移动端），使用js脚本完成输入验证、页面效果以及和服务器的交互，处理浏览器兼容和优化等。 ","work_base":"居住地：湖南-长沙    期望月薪：6001-8000元/月","work_compSize":"    计算机软件  |  -  |  -  ","updateTime":"17-10-12","adder":"湖南-长沙","salary":"6001-8000元/月","url":"8)u382)QhOg0Ge0(yz(PFA_1_1?searchresume=1&t=1507803934&k=2422F415E23B684FAE426D57A1CB3E1B","resumeName":"WEB前端开发 2年 长沙","work_edu":" 2011-09 ～ 2015-07    湖南理工学院    计算机科学与技术    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"本科","age":"24","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-08 ～ 至今     本初网络（1年2个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：主要负责手机移动端、web app、PC端响应式网站开发，根据项目需求用bootstrap框架或者HTML5对网站进行响应式开发；根据用户需求或产品需求对网页设计提出建议，对业务逻辑以及用户操作与后台讨论分析接口的设计；合理重构整合代码。 ","work_base":"居住地：陕西-西安-雁塔区    期望月薪：4001-6000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"陕西-西安-雁塔区","salary":"4001-6000元/月","url":"UMx(z5LIWhMODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=9757C629E511C9BBF566B546E574D149","resumeName":"WEB前端开发 1年 西安","work_edu":" 2014-09 ～ 至今    西安翻译学院    软件工程    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"23","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-02 ～ 至今     湖北百穗健康科技有限公司（8个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：1.分配组员的前端工作任务；2.项目前期主要根据UI设计完成效果图；3.根据后台接口实现数据的交互；4.项目接近完成时，讨论哪些需求的修改及实现，判断是否符合页面逻辑；5.修改测试人员的测试的bugger； ","work_base":"居住地：湖北-武汉-洪山区    期望月薪：4001-6000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"湖北-武汉-洪山区","salary":"4001-6000元/月","url":"ddzOYqu7jUQODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=D0DFD5CF6BB032F38416E2BC7FB918F2","resumeName":"WEB前端开发 2年 武汉","work_edu":" 2010-09 ～ 2013-07    湖北财经高等专科学校    会计学    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"25","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-03 ～ 2017-09     万森网络科技（西安）有限公司（6个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：1.利用HTML5，css3，JavaScript，jQuery，angularjs等web技术进行产品开发；2.利用jquery，css3等技术开发实现项目所需的各种交互效果；3.利用ajax技术实现前端数据与服务端进行异步交互处理；4.解决项目在IE8/9/10/11，Edge、chrome、safari、firefox等不同浏览器中存在的兼容性问题。 ","work_base":"居住地：广东-深圳-宝安区    期望月薪：4001-6000元/月","work_compSize":"    计算机软件  |  民营  |  20-99人  ","updateTime":"17-10-12","adder":"广东-深圳-宝安区","salary":"4001-6000元/月","url":"BF5ILXN0f9sODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=C8C323BDF8D5FF93AAAC78201E9675D7","resumeName":"web前端工程师","work_edu":" 2013-09 ～ 2016-01    西安思源学院    电气工程及其自动化    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  4001-6000元/月","edu":"大专","age":"21","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2017-04 ～ 2017-07     深圳角度广告有限公司（3个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：担任web前端开发，根据客户需求，利用html、css、js等语言和框架协同设计师完成网站的前端页面以及一些交互效果； ","work_base":"居住地：广东-深圳    期望月薪：保密","work_compSize":"    广告/会展/公关  |  -  |  -  ","updateTime":"17-10-12","adder":"广东-深圳","salary":"保密","url":"5I8v6JRre1UODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=E1CB58C60CC929A63D319F28EF9000E4","resumeName":"web前端 深圳","work_edu":" 2013-09 ～ 2016-06    河源职业技术学院    计算机运用技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  6001-8000元/月","edu":"大专","age":"23","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-01 ～ 至今     广州爱特安为科技股份有限公司（2年9个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：主要负责稳定端页面制作、公司活动页面的制作、app端h5页面的实现。以html+div+css实现网页布局、javascript、jquery实现交互效果。根据项目需求,独立按时完成网站开发任务。根据产品要求对现有项目进行修改。能使用ajax和后台进行数据的交互。 ","work_base":"居住地：广东-广州    期望月薪：保密","work_compSize":"    互联网/电子商务  |  股份制企业  |  20-99人  ","updateTime":"17-10-12","adder":"广东-广州","salary":"保密","url":"Oip2)sd1xTkODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=64A5D39EFB3B03A47635DD719CB5DE98","resumeName":"web前端开发","work_edu":" 2013-01 ～ 2015-06    河源职业技术学院    计算机应用技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  6001-8000元/月","edu":"大专","age":"24","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2015-12 ～ 2017-09     深圳嗅虎科技有限公司（1年9个月）","jobTitle":"web前端","sex":"女","work_desc":" 工作描述：1、与UI沟通，讨论页面的细节，负责项目的页面开发2、与后台沟通，负责页面的数据绑定3、负责公司项目的基本维护和改版 ","work_base":"居住地：广东-深圳    期望月薪：6001-8000元/月","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"广东-深圳","salary":"6001-8000元/月","url":"mD4qGR)nMYH3jbLJ75bOig_1_1?searchresume=1&t=1507803934&k=A9381CD4F970F6FB6995F4160672DCB7","resumeName":"web前端 深圳","work_edu":" 2011-09 ～ 2015-06    湖南工业大学    软件工程    本科 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  6001-8000元/月","edu":"本科","age":"25","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1},{"jobStatus":"我目前处于离职状态，可立即上岗 ","work_date":"2016-06 ～ 2017-07     小鹿科技（1年1个月）","jobTitle":"web前端","sex":"男","work_desc":" 工作描述：1、负责产品设计的PC/移动前端页面构建工作；2、利用各种Web技术将设计原型转化为最终页面利用；3、与设计团队紧密配合，能够实现设计师的设计想法；4、与后端开发团队及相关同事紧密配合，完成数据交互、动态信息展现，确保代码有效对接5、优化网站前端性能； ","work_base":"居住地：广东-广州    期望月薪：保密","work_compSize":"    互联网/电子商务  |  -  |  -  ","updateTime":"17-10-12","adder":"广东-广州","salary":"保密","url":"NjLy0xLkFOoODaw5FcaVww_1_1?searchresume=1&t=1507803934&k=7C73622967110537D41D0B145DCDF65F","resumeName":"web前端开发","work_edu":" 2014-09 ～ 2017-06    广东工商职业学院    计算机科学与技术    大专 ","work_jobState":"   当前状态：我目前处于离职状态，可立即上岗 ","work_jobTitle":" -  |   web前端  |  2001-4000元/月","edu":"大专","age":"22","isRead":"0","userId":"7","emailCheck":"1","searchId":1901743,"ipCheck":1}],"rowcount":"1/134"}})
	              //有时候会返回为空
	              if(!res || jqXHR.status!=200){
	              	//失败的话，最多请求3次
	              	if(tryNum<3){
	              		getResult();
	              		tryNum++;
	              	}else{
	              		if(jqXHR.status==202){
	              			res = '';
	              		}
	              		tryNum = 0;
	              		port.postMessage(res);
	              	}
	              }else{
	              	tryNum = 0;
	              	removeCookie();
	              	port.postMessage({
	              		res: res,
	              		headerCookie: headerCookie
	              	});
	              }
	            },
	            error:function (res,status,jqXHR) {
	            	if(res.status!=302){
	            		if(tryNum<3){
		            		getResult();
	              		tryNum++;
	            		}else{
	            			//dama();
	            			port.postMessage('');
	            		}
	            	}else{
	            		dama();
	            	}
	            }
	          })
        	}
        	getResult();
        })
    };
});

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (details.type === 'xmlhttprequest') {
      var existsReferer = false;
      var existsCookie = false;
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'Referer') {
          existsReferer = true;
          //details.requestHeaders[i].value = 'https://rdsearch.zhaopin.com/Home/ResultForCustom?SF_1_1_1=Java&SF_1_1_25=COMPANY_NAME_ALL:%E6%8A%80%E6%9C%AF&SF_1_1_27=0&orderBy=DATE_MODIFIED,1&exclude=1';
          details.requestHeaders[i].value = referer;
        }
        if(details.requestHeaders[i].name === 'Accept'){
        	details.requestHeaders[i].value = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8';
        }
        if(details.requestHeaders[i].name === 'Cookie'){
        	existsCookie = true;
        	details.requestHeaders[i].value = headerCookie;
        }
      }
      if (!existsReferer) {
        //details.requestHeaders.push({ name: 'Referer', value: 'https://rdsearch.zhaopin.com/Home/ResultForCustom?SF_1_1_1=Java&SF_1_1_25=COMPANY_NAME_ALL:%E6%8A%80%E6%9C%AF&SF_1_1_27=0&orderBy=DATE_MODIFIED,1&exclude=1'});
        details.requestHeaders.push({ name: 'Referer', value: referer});
      }
      if (!existsCookie) {
        //details.requestHeaders.push({ name: 'Referer', value: 'https://rdsearch.zhaopin.com/Home/ResultForCustom?SF_1_1_1=Java&SF_1_1_25=COMPANY_NAME_ALL:%E6%8A%80%E6%9C%AF&SF_1_1_27=0&orderBy=DATE_MODIFIED,1&exclude=1'});
        details.requestHeaders.push({ name: 'Cookie', value: headerCookie});
      }

      return { requestHeaders: details.requestHeaders };
    }
  },
  {urls: ['https://rdsearch.zhaopin.com/Home/ResultForCustom*']},
  ["blocking", "requestHeaders"]
);
