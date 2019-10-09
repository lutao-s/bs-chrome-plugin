//打开主页
$('#openIndex').on('click',function () {
    window.open("https://www.baishan.com/");
});

//获取backup中的时间 与 计数
$('#getBackInfo').on('click',function () {
   //获取background中信息
     var bg = chrome.extension.getBackgroundPage();
     $('#backpageTime').html(bg.document.getElementById("backupTime").innerText);
     $('#backTimes').html(bg.document.getElementById("excuteTime").innerText);
});

//显示通知
$('#notification').on('click',function () {
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'images/favicon.png',
        title: '通知标题',
        message: '通知信息！请关注！！！'
    });
})

$('#addNotice').on('click',function () {
    setTimeout(function (){
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'images/favicon.png',
            title: '10s后的通知',
            message: ''
        });
    },10000)
})

//
$('#addNoticeForBack').on('click',function () {
    sendMessageToContentScript({cmd:'修改', value:'您点击了header 哈哈哈哈哈'}, function(response)
    {
        console.log('来自content的回复：'+response);
    });
})

function sendMessageToContentScript(message, callback)
{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response)
        {
            if(callback) callback(response);
        });
    });
}
// 获取当前windowid
function getWindoId() {
    return new Promise((resolve,reject)=>(
        chrome.windows.getCurrent(function(currentWindow){
            console.log('当前窗口ID：' + currentWindow.id);
            resolve(currentWindow.id);
        })
    ))
}

// 获取当前tabid
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
    return new Promise((resolve,reject)=>(
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
        {
            if(callback) callback(tabs.length ? tabs[0].id: null);
            resolve( tabs[0].id);
        })
    ))
}

// 获取当前选项卡ID
function getCurrentTabId2(callback)
{
    return new Promise((resolve,reject)=>(
        chrome.windows.getCurrent(function(currentWindow)
        {
            chrome.tabs.query({active: true, windowId: currentWindow.id}, function(tabs)
            {
                if(callback) callback(tabs.length ? tabs[0].id: null);
                resolve( tabs[0].id);
            });
        })
    ))
}

$('#currentWindowId').on('click',function () {
    getWindoId().then(result =>{alert("当前窗口id为"+result)} );
    getCurrentTabId().then(result=> alert("方法1获取当前选项卡id为"+result));
    getCurrentTabId2().then(result=> alert("方法2获取当前选项卡id："+result))

   // alert("当前窗口id："+getWindoId().then(result => result)+"方法1获取当前选项卡id："+getCurrentTabId()+"方法2获取当前选项卡id："+getCurrentTabId2());
})


//动态注入js
$('#excuteJs').on('click',function () {
    // 动态执行JS代码
    //chrome.tabs.executeScript(getCurrentTabId2, {code: 'document.body.style.backgroundColor="red"'});
    // 动态执行JS文件
    getCurrentTabId().then(result=> chrome.tabs.executeScript(result, {file: 'js/testExecuteScript.js'}))

})

//动态注入css
$('#insertCss').on('click',function () {
    // 动态执行CSS代码
    getCurrentTabId().then(result=>chrome.tabs.insertCSS(result, {code: '#header {\n' +
             '    font-size: 50px;\n' +
             '}'}));
    // 动态执行CSS文件
    alert("动态加入css");
    //getCurrentTabId().then(result=>chrome.tabs.insertCSS(result, {file: 'css/insertCss.css'}));
})


//chrome.storage是针对插件全局的，即使你在background中保存的数据，在content-script也能获取到；
// chrome.storage.sync可以跟随当前登录用户自动同步，这台电脑修改的设置会自动同步到其它电脑，很方便，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络；
$('#storageTestInsert').on('click',function () {
    var bg = chrome.extension.getBackgroundPage();
    var date_time = bg.getDate(2);
    chrome.storage.sync.set({date:date_time}, function() {
        alert("保存成功");
    });
})

$('#storageTestQuery').on('click',function () {
    chrome.storage.sync.get({date:'sj' }, function(items) {
        alert(items.date);
    });
})


$('#webRequestTest').on('click',function () {
    myMain(document);
})








