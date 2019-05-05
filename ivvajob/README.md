>####插件功能
1. 简藏外网简历
2. 更新外网简历联系方式
3. 导入外网职位列表、职位详情
4. 发布职位到外网（职位名、招聘人数、职位描述），刷新外网简历
5. 更新雷达简历

>####渠道
前程、智联、拉勾、猎聘、boss、中华人才热线、58、100offer、卓博

>####目录结果
```
  -img    //图片
  -js
    -util 
      Canvas2Image.js     //canvas转化为base64
      html2canvas.js     //html转为canvas
      tool.js     //外网链接及配置
    background.js       //后台运行js
    external_fg.js      //外网注入js
    plug_fg.js          //ivva注入js
    popup.js            //popup.js
  manifest.json         //插件基本配置（不可缺）
```

>####manifest.json   配置
```
{
  "manifest_version": 2, 
  "name": "ivvajob助手",
  "description": "一键导入简历至您的ivvajob招聘系统",
  "version": "1.1.4",     //版本
  "browser_action": {       //图标配置
    "default_icon": {
      "19": "img/icon19.png",
      "38": "img/icon38.png"
    } ,
    "default_title": "ivva",
    "default_popup": "popup.html"
  },
  "icons": {          //图标配置
    "16": "img/icon16.png",
    "48": "img/icon48.png",
    "128": "img/icon128.png"
  },
  "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'",
  "background": {  //后台运行js，与依赖顺序有关
    "scripts": [
      "js/util/jquery.min.js",
      "js/util/encodeToGb2312.js",
      "js/util/tool.js",
      "js/background.js"
     ]
  },

  "permissions": [    //插件权限
    "*://*/*",
    "http://localhost:8080/*",
    "cookies",    
    "webRequest",
    "webRequestBlocking",
    "tabs",
    "storage"
  ],
  "content_scripts": [    //注入js的url，
    {
      "matches": ["*://*/*"],  //标示所有地址都注入下面的js
      "all_frames": true,
      "js": ["js/util/jquery.min.js","js/util/jquery.cookie.js","js/util/tool.js","js/plug_fg.js"],
      "run_at": "document_end"
    },
    {
      "matches": ["*://*.zhaopin.com/*","*://*.51job.com/*","*://*.lagou.com/*","*://*.zhipin.com/*","*://*.58.com/*","*://*.liepin.com/*","*://*.cjol.com/*","*://*.100offer.com/*","*://*.jobcn.com/*"],
      "all_frames": true,
      "js": ["js/util/jquery.min.js", "js/util/jquery.cookie.js", "js/util/tool.js", "js/util/html2canvas.js","js/util/Canvas2Image.js", "js/external_fg.js"],
      "run_at": "document_end"
    }
  ],
   "externally_connectable": {
     "matches": []
   },
  "web_accessible_resources":["/img/*.png","js/plug_fg.js"]    //页面注入js可请求的文件
}

```
