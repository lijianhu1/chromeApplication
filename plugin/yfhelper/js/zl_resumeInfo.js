var local = 'www.yifengjianli.com';
//var local = '127.0.0.1:8082';
var cookieText='';
var resumeSearchCookieList='';
chrome.cookies.get({
	url: "http://" + local,
	name: "zlSearchCookie"
}, function(cookie) {
	console.log(cookie);
})

function removeCookie(){
	//删除cookie
	if(typeof resumeSearchCookieList != 'string' && resumeSearchCookieList.length > 0){
		for (var index in resumeSearchCookieList) {
			var cookieName = trim(resumeSearchCookieList[index].split('=')[0]);
	    var ind = resumeSearchCookieList[index].indexOf('=');
	    var cooKieVal = resumeSearchCookieList[index].slice(ind+1);
	    
			//删除cookie
	    chrome.cookies.remove({
        'url':'https://rd.zhaopin.com/resumepreview/resume/viewone/2/*',
        'name':cookieName,
	    }, function(cookieObj){
	    	console.log(cookieObj)
	    });
	  }
	}
}

chrome.extension.onConnect.addListener(function(port) {
	if(port.name == 'getResume') {
		port.onMessage.addListener(function(config) {
			var request = config.zlResume;
			cookieText = config.zlSearchCookie;
			resumeSearchCookieList = cookieText.split(';');
			//console.log('https://' + request);
			//      	request = 'rd.zhaopin.com/resumepreview/resume/viewone/2/Gl(Pah)h)CZK(RfKpdrUmw_1_1?searchresume=1&t=1507860485&k=E5C8713D38E8AB25463AF140D02C07D4&v=0';
			var zlTime = request.split('&t=')[1].split('&k=')[0];

			function zlDetailAnalysis() {
				$.ajax({
					type: "get",
					url: 'https://' + request,
					async: true,
					success: function(res,status,jqXHR) {
						if(jqXHR.status==200){
							port.postMessage(res)
							var config = {
								detailHtml: res,
								resumeId: res.split('<span class="resume-left-tips-id">ID:&nbsp;')[1].split('</span>')[0]
							}
							$.ajax({
								type: "post",
								url: "http://" + local + "/zlresume/zlDetailAnalysis",
								async: true,
								data: config,
								success: function(data) {
									if(data.code == 200) {
										chrome.cookies.set({
											'url': 'http://'+local,
											'name': 'zlResume' + zlTime,
											'value': '1',
											'secure': false,
											'httpOnly': false
										}, function(cookie) {});
										removeCookie();
									} else {
										chrome.cookies.set({
											'url': 'http://' + local,
											'name': 'zlResume' + zlTime,
											'value': '2',
											'secure': false,
											'httpOnly': false
										}, function(cookie) {});
									}
								},
							});
						}else{
							zlDama();
						}
					},
					error: function() {
						zlDama();
					}
				});

			}
			
			var Captcha = 0;
			function zlDama(){
				var config = {
					zlCookie: cookieText
				}
				$.ajax({
					type: "post",
					url: "http://" + local + "/zlresume/zlDama",
					data: config,
					async: true,
					success: function(data) {
						++Captcha;
						if(Captcha > 4) {
							chrome.cookies.set({
								'url': 'http://' + local,
								'name': 'zlResume' + zlTime,
								'value': '2',
								'secure': false,
								'httpOnly': false
							}, function(cookie) {});
							port.postMessage('');
							Captcha=0;
							return false;
						}
						if(data.code == 200) {
							zlDetailAnalysis();
							Captcha=0;
						} else {
							zlDama()
						}
					}
				});
			}

			zlDetailAnalysis()
		})
	}
});

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        if (details.type === 'xmlhttprequest') {
            var existsCookie = false;
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if(details.requestHeaders[i].name === 'Cookie'){
                	existsCookie = true;
                	details.requestHeaders[i].value = cookieText;
                }
            }
            if (!existsCookie) {
                details.requestHeaders.push({ name: 'Cookie', value: cookieText});
            }

            return { requestHeaders: details.requestHeaders };
        }
    },
    {urls: ['https://rd.zhaopin.com/resumepreview/resume/viewone/2/*']},
    ["blocking", "requestHeaders"]
);