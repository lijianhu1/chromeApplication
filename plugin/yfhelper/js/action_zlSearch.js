var zlSearch = chrome.runtime.connect({name: "zlSearch"});	//点击智联搜索按钮
var initOnMessage = false;
$('#zlSearchConditionPlugin').attr('hasPlugin','1');
$("#zlSearchConditionPlugin").click(function () {
  zlSearch.postMessage({
  	searchValue: $("#zlSearchConditionPlugin").val(),
  	searchCookie: $("#zlSearchCookie").html()
  });
  if(!initOnMessage){
  	zlSearch.onMessage.addListener(function (resObj) {
  		//插件请求成功之后，把数据写回页面
  		//console.log('000');
  	  //$('#zlResultPlugin').data('htmlResult',res).trigger('click')
  	  $.cookie('zlSearchCookie', resObj.headerCookie);
  	  $('#zlResultPlugin').attr('htmlResult',resObj.res).trigger('click');
  	});
  }
	initOnMessage = true;
});


