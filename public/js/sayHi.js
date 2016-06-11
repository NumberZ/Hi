(function($){
    var oldFriends = [],tabs = [];
    var onlineFriends = $("#onlineFriends");
    var pMsg = $("#pMsg");
    var pMsgContainer = $("#pMsgContainer");
    window.sayHi = {
        username:'',
        socket:null,
        //公屏消息
        submitPublicMsg:function(msg,username){
            this.socket.emit('publicMsg',{
                from:username,
                msg:msg
            });
        },
        //私信
        submitPrivateMsg:function(msg,toUser){
            this.socket.emit('privateMsg',{
                from:sayHi.username,
                to:toUser,
                msg:msg
            });
        },
        //更新在线人数
        updataOnlineFriends:function(type,newFriends,self){
            if(type  === 'online'){
                var arr = _.difference(newFriends,oldFriends);
                oldFriends = newFriends;
                arr.forEach(function(item,index,array){
                    if(item != self){
                        onlineFriends.append('<li class="collection-item" ' + 'data-name=' + item + ' ><div>' + item + '<div  class="secondary-content"><i class="material-icons">send</i></div></div></li>')
                    }
                });
            }else if(type === 'offline'){
                var arr = _.difference(oldFriends,newFriends);
                oldFriends = newFriends;
                arr.forEach(function(item,index,array){
                    $("li[data-name=" + item + "]").remove();
                });
            }
        },
        init:function(username){
            this.socket = io.connect('http://localhost:5000');
            this.username = username;
            this.socket.emit('newUser',{username:username});
            this.socket.on('online', function(res){
                sayHi.updataOnlineFriends('online',res,username);
            });
            this.socket.on('offline',function(res){
                sayHi.updataOnlineFriends('offline',res);
            });
            this.socket.on('pMsg',function(res){
                pMsgContainer.append('<div><div class="p-chip"><span class="p-chip-username">' + res.from + '</span> : ' + res.msg + '</span></div>');
            });
            this.socket.on('messagePrivate',function(res){
                handlePrivateMsg(res);
            });
        }
    }

    function createTab(username,msg){
        tabs.push(username);
        $("#chatTabs").append('<li class="tab col"><a href="#to' + username + '">To ' + username + '</a></li>');
        $("#tabsContainer").append(' <div id="to' + username + '" class="col s12 dis-no">'
                                +       '<div class="card-panel" style="padding:0px">'
                                +           '<div class="p-msg" id="to' + username +'MsgContainer"></div>'
                                +           '<div class="p-control">'
                                +               '<div class="row" style="margin-bottom:0px;">'
                                +                   '<div class="input-field col s9">'
                                +                       '<i class="material-icons prefix">chat_bubble_outline</i>'
                                +                       '<input id="to' + username + 'Msg" type="text" />'
                                +                   '</div>'
                                +                   '<div class="input-field col s3">'
                                +                           '<a class="btn waves-effect waves-teal" id="to' + username + 'Btn">Send</a>'
                                +                   '</div>'
                                +               '</div>'
                                +            '</div>'
                                +       '</div>'
                                +   '</div>'
        );
        if(msg){
            $("#to" + username + 'MsgContainer').append('<div><div class="p-chip"><span class="p-chip-username">' + username+ '</span> : ' + msg + '</span></div>');
        }
        $("#to" + username + "Btn").on('click',function(){
                var msg = $("#to" + username + "Msg").val();
                $("#to" + username + 'MsgContainer').append('<div class="t-r"><div class="p-chip"><span class="p-chip-username">Me</span> : ' + msg + '</span></div>');
                sayHi.submitPrivateMsg(msg,username);
        });
    }
    function handlePrivateMsg(res){
        if(tabs.indexOf(res.from) === -1){
            createTab(res.from,res.msg);
        }else{
            $("#to" + res.from + 'MsgContainer').append('<div><div class="p-chip"><span class="p-chip-username">' + res.from + '</span> : ' + res.msg + '</span></div>');
        }
    }
    //发送公共消息
    function sendPublicMsg(){
        var pVal = pMsg.val();
        if(!pVal){
             Materialize.toast('发送的消息不能为空！', 2000);
             return ;
        }
        sayHi.submitPublicMsg(pVal,sayHi.username);
        pMsg.val('');
    };

    $("#pMsgBtn").on("click",function(){
        sendPublicMsg();
    });
    $("#pMsg").keydown(function(event){
        if(event.keyCode === 13){
            sendPublicMsg();
        }
    })


    $('#onlineFriends').delegate("li","click",function(){
        var username = $(this).attr('data-name');
        //创建tab
        if(tabs.indexOf(username) === -1){
            createTab(username,null);
        }else {
            return ;
        }

    });
})(jQuery);
