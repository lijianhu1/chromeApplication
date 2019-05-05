let searchResuktTabId=""
chrome.extension.onConnect.addListener(port => {
  if (port.name === "ivvaFgPort") {
    port.onMessage.addListener(message => {
      switch (message.status) {
        case "begin":
          getAccountCondition().then(res=>{
            const config={
              status:"condition",
              data:res
            };
            port.postMessage(config);
          });
          break;
        default:
          break;
      }
    })
  }
})

//一次性请求监听
chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.status) {
    case 'searchResult':
      searchResuktTabId = sender.tab.id;
      break;
    case 'resumeDetail':
      $.ajax({
        url: `${tool.ajaxUrl}/solr/importResumeDetailByPlugInUnit`,
        type: "post",
        data: request.data,
        success(res){

        }
      });
      break;
    case "jobFinish":
      chrome.storage.local.get('userName', (result) => {
        $.ajax({
          url: `${tool.ajaxUrl}/solr/updateAccountStatus`,
          type: "get",
          data: {
            userName: result.userName,
            accountStatus:2
          },
          success(res){

          }
        });
      });
      break;
    case "stop":
      if(searchResuktTabId){
        chrome.tabs.sendMessage(searchResuktTabId, {status:'stop'});
      }
      break;
    default:
      break;
  }
});

function getAccountCondition() {
  return new Promise(resolve => {
    chrome.storage.local.get('userName', (result) => {
      $.ajax({
        url: `${tool.ajaxUrl}/solr/getAccountCondition`,
        type: "get",
        data: {
          userName: result.userName,
        },
        success(res) {
          resolve(res.data);
        }
      });
    });
  })
};

