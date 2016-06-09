(function($){
    var oldFriends = [];
    var onlineFriends = $("#onlineFriends");
    window.sayHi = {
        socket:null,
        updataOnlineFriends(newFriends,self){
            var arr = _.difference(newFriends,oldFriends);
            oldFriends = newFriends;
            arr.forEach(function(item,index,array){
                if(item != self){
                    onlineFriends.append('<li class="collection-item"><div>' + item + '<a href="#!" class="secondary-content"><i class="material-icons">send</i></a></div></li>')
                }
            });
        },
        init:function(username){
            this.socket = io.connect('http://localhost:5000');
            this.socket.emit('newUser',{username:username});
            this.socket.on('addCount', function(res){
                sayHi.updataOnlineFriends(res,username);

            });
        }
    }
})(jQuery);
