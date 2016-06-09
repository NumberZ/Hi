(function($){
    var oldFriends = [];
    var onlineFriends = $("#onlineFriends");
    window.sayHi = {
        socket:null,
        updataOnlineFriends(type,newFriends,self){
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
            this.socket.emit('newUser',{username:username});
            this.socket.on('online', function(res){
                sayHi.updataOnlineFriends('online',res,username);
            });
            this.socket.on('offline',function(res){
                sayHi.updataOnlineFriends('offline',res);
            });
        }
    }
})(jQuery);
