//设置 图标的badge(标记)
chrome.browserAction.setBadgeText({text: 'new'});
chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});

var times = 0;
setInterval(function () {
    console.log("后台更新时间："+getDate(2));
    document.getElementById("backupTime").innerText=getDate(2);
    document.getElementById("excuteTime").innerText = times;
    times++;
},1000)


//获取时间
function getDate(format) {
    /**
     * format=1表示获取年月日
     * format=0表示获取年月日时分秒
     * **/
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth()+1;
    var date = now.getDate();
    var day = now.getDay();//得到周几
    var hour = now.getHours();//得到小时
    var minu = now.getMinutes();//得到分钟
    var sec = now.getSeconds();//得到秒
    if (format==1){
        _time = year+"-"+month+"-"+date
    }
    else if (format==2){
        _time = year+"-"+month+"-"+date+" "+hour+":"+minu+":"+sec
    }
    return _time
}

// 创建只有百度显示的pageAction
chrome.runtime.onInstalled.addListener(function(){
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
        chrome.declarativeContent.onPageChanged.addRules([
            {
                conditions: [
                    // 只有打开百度才显示pageAction
                    new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
                ],
                actions: [new chrome.declarativeContent.ShowPageAction()]
            }
        ]);
    });
});

//创建右键菜单
chrome.contextMenus.create({
    title: "测试右键菜单",
    onclick: function(){alert('右键菜单点击！');}
});

//创建选中出现的右键菜单
chrome.contextMenus.create({
    title: '百度搜索：%s', // %s表示选中的文字
    contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
    onclick: function(params)
    {
        // 注意不能使用location.href，因为location是属于background的window对象
        chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
    }
});

// omnibox
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
    console.log('inputChanged: ' + text);
    if(!text) return;
    if(text == '白山') {
        suggest([
            {content:  text + '主页', description: '你要找“白山主页”吗？'},
            {content:  text + '邮箱', description: '你要找“白山邮箱”吗？'}
        ]);
    }
    else if(text == '微博') {
        suggest([
            {content: '新浪' + text, description: '新浪' + text},
            {content: '腾讯' + text, description: '腾讯' + text},
            {content: '搜狐' + text, description: '搜索' + text},
        ]);
    }
    else {
        suggest([
            {content: '百度搜索 ' + text, description: '百度搜索 ' + text},
            {content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text},
        ]);
    }
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
    console.log('inputEntered: ' + text);
    if(!text) return;
    var href = '';
    if(text.startsWith('白山')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
    else if(text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
    else if(text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
    else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
    openUrlCurrentTab(href);
});
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        if(callback) callback(tabs.length ? tabs[0].id: null);
    });
}

// 当前标签打开某个链接
function openUrlCurrentTab(url)
{
    getCurrentTabId(tabId => {
        chrome.tabs.update(tabId, {url: url});
    })
}



// 通知信息
function noticeInfo( ){
    setTimeout(function (){
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'images/favicon.png',
            title: '10s后的通知',
            message: ''
        });
    },10000)
}

chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        console.log(request);
        alert(12);
        chrome.cookies.getAll({
            url: request.url
        }, (cks) => {
            let cookie = cks.map((item) => {
                return item.name + "=" + item.value
            }).join(";") + ";";
            alert("coock123"+request.url+cookie);
        });
    });

// webRequest 测试代码
// chrome.webRequest.onBeforeRequest.addListener(details => {
//     // cancel 表示取消本次请求
//     if(details.type == 'image') {
//         // chrome.notifications.create(null, {
//         //     type: 'basic',
//         //     iconUrl: 'images/favicon.png',
//         //     title: '检测到图片',
//         //     message: '图片地址：' + details.url,
//         // });
//         return {cancel: true};
//     }
//     // 简单的音视频检测
//     // 大部分网站视频的type并不是media，且视频做了防下载处理，所以这里仅仅是为了演示效果，无实际意义
//     if(details.type == 'media') {
//         chrome.notifications.create(null, {
//             type: 'basic',
//             iconUrl: 'img/icon.png',
//             title: '检测到音视频',
//             message: '音视频地址：' + details.url,
//         });
//     }
// }, {urls: ["<all_urls>"]}, ["blocking"]);