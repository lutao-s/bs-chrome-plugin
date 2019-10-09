// document.addEventListener('DOMContentLoaded', function() {
//     getBookmarks();
// });
document.addEventListener('DOMContentLoaded', function() {
    var bg = chrome.extension.getBackgroundPage();
    if(bg.document.url!=""&&bg.document.url!=undefined){
        $('#logindiv').hide();
        $('#functiondiv').show();
    }else {
        $('#logindiv').show();
        $('#functiondiv').hide();
    }
    $.ajax({
        url:'http://tyvip.wicp.io:1024/ls/blog/getDictVal/CD00006',
        type:'POST',
        data:{
        },
        dataType:'json',
        async:false,
        success:function(result){
            $('#blogType').select2({
                data:result,
                allowClear:true
            });
        },
        complete:function(resp){
        }
    });
});
$('#login').on('click',function () {
    $.ajax({
        type: "post", url: "http://tyvip.wicp.io:1024/ls/user/chromeLogin", async: "true",
        data: {
            'userName':$('#username').val(),
            'passWord':$('#password').val()
        }, success: function (data,status) {
            console.log(data);
            if(data.message!=''){
                var bg = chrome.extension.getBackgroundPage();
                bg.document.url = data.message;
                bg.document.userId = data.objectNo;
                $('#logindiv').hide();
                $('#functiondiv').show();
            }else{
                alert("登陆失败");
                $('#logindiv').show();
                $('#functiondiv').hide();
            }
        }, error: function (error) {
            alert("登陆失败");
            $('#logindiv').show();
            $('#functiondiv').hide();
        }
    });

})

$('#logout').on('click',function () {
    var bg = chrome.extension.getBackgroundPage();
    bg.document.url = '';
    bg.document.userId = '';
    $('#functiondiv').hide();
    $('#logindiv').show();
})

$('#collection').on('click',function () {
    var bg = chrome.extension.getBackgroundPage();
    var url = bg.document.url;
    var docType = $("#blogType").select2("data")[0].id;
    var tmpurl = "";
    //获取当前tab页中连接
    chrome.tabs.getSelected(null, function (tab) {
        tmpurl = tab.url;
        url = url + "&url="+tmpurl+"&docType="+docType;
        $('#message').html("正在收藏"+tmpurl+"请稍等!");
        $.get(url,function (result) {
            $('#message').html(result.message);
            // alert(result.message);
        })
    });
})

function message(msg){
    $('#message').html(msg);
}

$('#syncBookMarks').on('click',function () {
    getBookmarks()
})
// 回车
$('#logindiv').keydown(function() {
    if (event.keyCode == "13") {// keyCode=13是回车键
        $('#login').click();
    }
});

// $('#test').on('click',function () {
//     objectTmp = {};
//     objectTmp.url='http://lutao.info:1024/home';
//     objectTmp.index=12;
//     objectTmp.parentId='1';
//     objectTmp.title='mydream';
//     chrome.bookmarks.create(objectTmp,function (resNode) {
//             alert("回调");
//             alert(resNode);
//             alert(JSON.stringify(resNode));
//     });
// })

$('#downBookMarks').on('click',function () {
    $.post('http://tyvip.wicp.io:1024/ls/user/downChromeBookMarks',{userId:chrome.extension.getBackgroundPage().document.userId},function (result) {
        chrome.bookmarks.getTree(function(res){
            for(var i=0;i<res.length;i++){
                deletebookmarks(res[i])
            }
            var newParentId = '1';
            recursive(result,2,result.obj.length,newParentId);
        });
    })
})
//递归新增
function recursive(result,t,lenth,newParentId) {
    message("需要同步"+result.obj.length+"条记录！已同步"+t+"条记录！");
    var islog = false;
    if(result.obj[t].id=='7585'){
        islog = true
    }
    if(t<lenth){
        if(result.obj[t].parentId == '0'){
            t++;
            recursive(result,t,lenth,newParentId);
            return;
        };
        if(result.obj[t].parentId != '1'){
            result.obj[t].parentId = newParentId;
        }
        if(result.obj[t].url == 'None'){
            result.obj[t].url=null;
        }
        delete result.obj[t].id;
        delete result.obj[t].userId;
        // if(islog) {
        //     alert(JSON.stringify(result.obj[t]));
        // }
        chrome.bookmarks.create(result.obj[t],function (resNode) {
            // if(islog) {
            //     alert("回调" + t);
            //     alert(resNode);
            //     alert(JSON.stringify(resNode));
            // }
            if(resNode.url == undefined) {
                newParentId = resNode.id;
            }
            t++;
            recursive(result,t,lenth,newParentId);
        });
    }
}

function deletebookmarks(parms) {
    bookmarks = [];
    deletebookmark(parms);
    for(var index in bookmarks){
        chrome.bookmarks.removeTree(bookmarks[index]);
    }

}

function deletebookmark(res) {
    if(res==null){
        return;
    }
    bookmarks.push(res.id);
    if(res.children==null){
        return;
    }
    for(var i=0; i<res.children.length;i++){
        deletebookmark(res.children[i]);
    }
}

var bookmarks;
function getBookmarks(){
    bookmarks = []
    chrome.bookmarks.getTree(function(result){

        for(var i=0;i<result.length;i++){
            reversBookmarks(result[i]);
        }
        syncBook();
    });
}

function reversBookmarks(result){
    if(result==null){
        return;
    }
    var bookmark = {
        id:result.id == null ? 0 : result.id,
        parentId:result.parentId == null ? 0 : result.parentId,
        index:result.index == null ? 0 : result.index,
        url:result.url == null ? 'None' : result.url,
        title:result.title == null ? 'None' : result.title
    }

    bookmarks.push(bookmark)

    if(result.children==null){
        return;
    }

    for(var i=0; i<result.children.length;i++){
        reversBookmarks(result.children[i]);
    }
}

function syncBook(){
    jsonStr = JSON.stringify({data:bookmarks});
    $.ajax({
        type: "post", url: "http://tyvip.wicp.io:1024/ls/user/chromeBookMarks", async: "true",
        data: {
            'key':chrome.extension.getBackgroundPage().document.userId,
            'data':jsonStr
        }, success: function (data,status) {
            //obj = JSON.parse(data);
            if(data==1){
                message(data.message);
            }else{
                message(data.message);
            }
        }, error: function (error) {
            message('Failed! Error:'+error);
        }
    });
}