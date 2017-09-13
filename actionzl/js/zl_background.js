var cookieFoo=function () {}  //新建全局函数
chrome.extension.onConnect.addListener(function(port) {

    if (port.name=="currIcon"){
        port.onMessage.addListener(function(req) {
            chrome.browserAction.setIcon({path: 'img/'+(req=='www.yifengjianli.com'?'dlbg.png':'icon.png')});
        });
    }

    //简历夹简历列表
    if (port.name=="zhilian"){
        port.onMessage.addListener(function(msg) {
            httpRequestPost('https://rd2.zhaopin.com/RdApply/Resumes/Resume/GetResumeList',msg.zlListData,
                function (res) {
                    var response = JSON.parse(res);
                    response.currentPage=msg.curr;
                    response.favoriteId = msg.zlListData.favoriteId
                    port.postMessage(response);
                })
        });
    }
  //获取简历夹简历详情
    if (port.name=="getResume"){
        port.onMessage.addListener(function(msg) {
            httpRequest('https://rd.zhaopin.com/resumepreview/resume/viewone/1/'+msg.id,
                function (res) {
                    // var response = JSON.parse(res)
                    port.postMessage(res);
                })
        });
    }


    //简历筛选
    if (port.name=="zlScreen"){
        port.onMessage.addListener(function(msg) {

            httpRequestPost('https://rd2.zhaopin.com/rdapply/resumes/apply/search?SF_1_1_38=2,9&orderBy=CreateTime',msg,
                function (res) {

                    port.postMessage(res);
                })

        });
    };

    //简历筛选详情
    if (port.name=="zlScreenDetail"){
        port.onMessage.addListener(function(req) {
            httpRequest('https://'+req,function (res) {

                    port.postMessage(res);
            })

        });
    }

    //简历夹列表
    if(port.name=="zlResumeFolder"){
        port.onMessage.addListener(function(req) {
            httpRequest('https://rd2.zhaopin.com/RdApply/Resumes/Resume/GetFavoriteFolderList',function (res) {
                var response = JSON.parse(res);
                port.postMessage(response);
            })
        });
    }
    if(port.name=="zlSetCookie"){
        port.onMessage.addListener(function(req) {
             var cookieText = req.cookie;
             var cookieData = new cookieFoo();
             cookieData.set(cookieText)
            setTimeout(function () {
                port.postMessage('cookie');
            },1000)

        });
    }

    //简历职位筛选
     if (port.name=="zlPositionList"){
        port.onMessage.addListener(function(req) {

            httpRequestPost('https://jobads.zhaopin.com/Position/PositionManageStatus',req,
                function (res) {

                    port.postMessage(res);
                })

        });
    };
    

});
//去除空格
function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
}
// var cookieText = "stayTimeCookie=0; referrerUrl=https%3A//rd2.zhaopin.com/RdApply/Resumes/Resume/GetResumeList%3FfavoriteId%3DD41813721%26isTemp%3Dn%26resumeSourceId%3D0%26queryDateTime%3D2016-08-19%252015%3A45%3A54%26pageIndex%3D1; urlfrom2=121113803; adfcid2=pzzhubiaoti1; adfbid2=0; __xsptplus30=30.3.1502863713.1502863713.1%234%7C%7C%7C%7C%7C%23%23O0GMP5ZJ89sCMDWP_jJKd_UZONHi48bK%23; _jzqa=1.1585780941605591300.1502766222.1502793664.1502863713.3; _jzqx=1.1502766222.1502863713.1.jzqsr=zhaopin%2Ecom|jzqct=/.-; JSShowname=; __zpWAM=1490946457363.61984.1503043068.1503134893.5; __zpWAMs2=1; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1502766221,1502863713,1503043068; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1503135962; at=97ee2a3735a6403089ed3e741e2ab385; Token=97ee2a3735a6403089ed3e741e2ab385; rt=850279528dfc404680f4685b6e5acc71; uiioit=3B622A6459640E6442644F6A5E6E5A6E5064553854775C7751682C622A6459640E644464466A5A6E516E5264513856775F776; xychkcontr=63123652%2c0; lastchannelurl=https%3A//passport.zhaopin.com/org/login; __utma=269921210.1282234123.1490433225.1503133532.1503287238.16; __utmc=269921210; __utmz=269921210.1502872746.10.6.utmcsr=jobads.zhaopin.com|utmccn=(referral)|utmcmd=referral|utmcct=/Position/PositionManage; __utmv=269921210.|2=Member=203073385=1; cgmark=2; NewPinLoginInfo=; JsNewlogin=658684108; NewPinUserInfo=; isNewUser=1; ihrtkn=; utype=0; RDpUserInfo=; rd_apply_lastsearchcondition=11%3B12%3B13%3B14%3B15%3B16; RDsUserInfo=36672168546B5D7544775D7141654F71516356655869536B4E713B653F7758771565056700681D6B59754177547144654C71306329655569506B3B7139654C775E773365276758685F6B58754077577144654171506355655369296B3B714A65271932248B3BEA3C5A0A2237A40BDB096C1627F31B209D305C653C69266B487145654A7720773C655E6757685C6B5A7545775671476544715563546528691A6B0471596512770A771C65586736683D6B567540775E713665237158635F654569596B44715765407752774B6550675368526B2F753577587141654471546355655B695D6B407145654A7721773F655E6733063E38912BF82C5A133C39B80FCF1D6E0238FF073A8D224C653D7728774C6553675568596B5A754A77267133654A71526353655169506B34713B654C7755774A6536672468546B5075327724714A653471266351655B695A6B4771446547775077436550675E682D6B2A754C77267134654171566356655A69586B43714265437756774A6527672668546B5B754A7736713E654A7156635C6521693B6B48714565457757775F6552675668506B5075247731714A6546715563546553691; dywez=95841923.1503308017.30.9.dywecsr=rd.zhaopin.com|dyweccn=(referral)|dywecmd=referral|dywectr=undefined|dywecct=/resumepreview/resume/validateuser; dywea=95841923.3813286963233487000.1490433225.1503315201.1503317197.32; dywec=95841923; getMessageCookie=1";

cookieFoo.prototype.set = function (cookieText) {  //给全局函数添加设置cookie方法
    var resumeCookieList = cookieText.split(';');
    for (var index in resumeCookieList) {
        var cookieName = trim(resumeCookieList[index].split('=')[0]);
        var ind = resumeCookieList[index].indexOf('=');
        var cooKieVal = resumeCookieList[index].slice(ind+1)
//设置cookie
        chrome.cookies.set({
            'url':'https://rd.zhaopin.com',
            'name':cookieName,
            'value':cooKieVal,
            'secure':false,
            'httpOnly':false
        }, function(cookie){
        });
//设置cookie
        chrome.cookies.set({
            'url':'https://rd2.zhaopin.com',
            'name':cookieName,
            'value':cooKieVal,
            'secure':false,
            'httpOnly':false
        }, function(cookie){
        });
    }
}

var cookieText = ''
var positionCookieList = cookieText.split(';');
for (var index in positionCookieList) {
    var cookieName = trim(positionCookieList[index].split('=')[0]);
    var ind = positionCookieList[index].indexOf('=');
    var cooKieVal = positionCookieList[index].slice(ind+1)
//设置cookie
    chrome.cookies.set({
        'url':'https://jobads.zhaopin.com',
        'name':cookieName,
        'value':cooKieVal,
        'secure':false,
        'httpOnly':false
    }, function(cookie){
    });

}
        var resumeCookieList = cookieText.split(';');
        for (var index in resumeCookieList) {
            var cookieName = trim(resumeCookieList[index].split('=')[0]);
            var ind = resumeCookieList[index].indexOf('=');
            var cooKieVal = resumeCookieList[index].slice(ind+1)
//设置cookie
            chrome.cookies.set({
                'url':'https://rd.zhaopin.com',
                'name':cookieName,
                'value':cooKieVal,
                'secure':false,
                'httpOnly':false
            }, function(cookie){
            });

        }

var positionCookie = "utype=203073385; urlfrom=121113803; urlfrom2=121113803; adfcid=pzzhubiaoti1; adfcid2=pzzhubiaoti1; adfbid=0; adfbid2=0; pcc=r=1881841816&t=1; dywez=95841923.1502863713.11.7.dywecsr=zhaopin.com|dyweccn=(referral)|dywecmd=referral|dywectr=undefined|dywecct=/; __xsptplus30=30.3.1502863713.1502863713.1%234%7C%7C%7C%7C%7C%23%23O0GMP5ZJ89sCMDWP_jJKd_UZONHi48bK%23; _jzqa=1.1585780941605591300.1502766222.1502793664.1502863713.3; _jzqc=1; _jzqx=1.1502766222.1502863713.1.jzqsr=zhaopin%2Ecom|jzqct=/.-; _jzqckmp=1; __zpWAM=1490946457363.61984.1502766227.1502863716.3; __zpWAMs2=1; at=d0def667db854e0b8db50e66abc896b1; Token=d0def667db854e0b8db50e66abc896b1; rt=603d0071e88548c69dfcfa9cdb554f38; uiioit=3D79306C4D73566554644464013253684A745F704B6450645F77263176645579406C41735C655564446406325668487457702; xychkcontr=41813721%2c0; lastchannelurl=https%3A//passport.zhaopin.com/org/login%3FDYWE%3D1490946457363.61984.1502766227.1502863716.3%26y7bRbP%3DdpDrrRP3bxP3bxP3nnCUVyo0Z6m3IR1dBNU6w5WWBxG; JsNewlogin=203073385; cgmark=2; NewPinLoginInfo=; NewPinUserInfo=; RDpUserInfo=; isNewUser=1; ihrtkn=; companyCuurrentCity=703; __utma=269921210.1282234123.1490433225.1502863713.1502872746.10; __utmc=269921210; __utmz=269921210.1502872746.10.6.utmcsr=jobads.zhaopin.com|utmccn=(referral)|utmcmd=referral|utmcct=/Position/PositionManage; __utmv=269921210.|2=Member=203073385=1; RDsUserInfo=36672168546B597541775671476540715663546550695E6B4E713B653F7758771C6504671368006B5F7540775D7146654471526355655969506B207139654C775E773F652D675868526B297535775871436546715D6356655B695C6B477146654A7727773F655E6737FFF2376E1B6739290492386D3FDBE8603C610E3BFD19208F364A7731773C655E675E682C6B26754C775471466546715663556551695C6B4071456544772577006512674B680A6B04751C775E71246523715863566553692A6B21714A6549774877406555674568586B5C754B77517144654C712163236555695F6B44714F6540775677466551675468526B2F753F77587125F2EC2D600D712B241C8E366F3FC9EE762E6C1021F30F369D3B526B27753C77587147654771556356655369286B31714A6546775577426558672468256B567541775E712265367158635C652B692A6B487134653277517740655B6754685A6B5C754377547142654C71216326655569286B3671436540775D774065506752685B6B5A7544775E7133653471586356655369386B3C714A6542775E773865336758685B6B5F7543774B71466544715D6342655A69086B44714265427756774A6536673168546B5A75417754714C651; LoginCity=703; Hm_lvt_38ba284938d5eddca645bb5e02a02006=1502766221,1502863713; Hm_lpvt_38ba284938d5eddca645bb5e02a02006=1502878108; getMessageCookie=1; dywea=95841923.3813286963233487000.1490433225.1502870350.1502874666.14; dywec=95841923; dyweb=95841923.8.10.1502874666"
        var positionCookieList = positionCookie.split(';');
        for (var index in positionCookieList) {

            var cookieName = trim(positionCookieList[index].split('=')[0]);
            var ind = positionCookieList[index].indexOf('=');
            var cooKieVal = positionCookieList[index].slice(ind+1)
//设置cookie
            chrome.cookies.set({
                'url':'https://jobads.zhaopin.com',
                'name':cookieName,
                'value':cooKieVal,
                'secure':false,
                'httpOnly':false
            }, function(cookie){
            });

        }



//ajax
function httpRequest(url,callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET',url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send();
}



function httpRequestPost(url,data,callback){
   
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;"); 
    xhr.setRequestHeader("X-Requested-With","XMLHttpRequest;"); 
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(xhr.responseText);
        }
    }
    xhr.send(data);
}






