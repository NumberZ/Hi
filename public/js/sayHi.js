(function($){
    var oldFriends = [];
    var onlineFriends = $("#onlineFriends");
    var pMsg = $("#pMsg");
    var pMsgContainer = $("#pMsgContainer");
    window.sayHi = {
        username:'',
        socket:null,
        submitPublicMsg:function(msg,username){
            this.socket.emit('publicMsg',{
                from:username,
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
                        onlineFriends.append('<li class="collection-item" ' + 'data-name=' + item + ' ><div>' + item + '<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>')
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
        }
    }

    //发送公共消息
    function sendPublicMsg(){
        var pVal = pMsg.val();
        if(!pVal){
             Materialize.toast('发送的消息不能为空！', 1000);
             return ;
        }
        sayHi.submitPublicMsg(pVal,sayHi.username);
        pMsg.val('');
    }

    $("#pMsgBtn").on("click",function(){
        sendPublicMsg();
    });
    $("#pMsg").keydown(function(event){
        if(event.keyCode === 13){
            sendPublicMsg();
        }
    })
})(jQuery);
