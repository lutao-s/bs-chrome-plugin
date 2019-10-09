//该种js无法让页面调用其中方法，但是可以访问当前使用的DOM
$('#logout').on('click',function () {
   alert("执行注入的js");
})
function contentJsClick() {
    alert("inject click");
}
var msg = "您点击了header";
document.addEventListener('DOMContentLoaded', function() {
    //注入默认的inject js
    injectCustomJs();
    console.log(document.getElementById("header"));
    document.getElementById("header").onclick=function () {
        show(msg);
    }

})

function show(msg) {
    alert(msg);
}

function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function()
    {
        // 放在页面不好看，执行完后移除掉
        this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
    if(request.cmd == '修改') alert("将提示消息修改为:"+request.value);
    msg = request.value;
    sendResponse('我收到了你的消息,并已对msg进行了修改！');
});

// 获取当前页面session
//window.addEventListener("load", myMain, false);

function getCookies(url) {
    chrome.runtime.sendMessage({url: url}, async function (response) {
        console.log(response);
    });
}

function myMain(evt) {
    console.log("Cookie share helper running!");
    getCookies(evt.URL)
}

