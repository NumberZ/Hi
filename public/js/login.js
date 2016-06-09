(function($){
    var loginBtn = $("#loginBtn"),login = $('.login');
    var nickname = $("#nickname");
    var labelError = $("#labelError");
    nickname.focus(function(){
        nickname.removeClass('invalid');
    });
    loginBtn.on('click',function(){
        var nickVal = $("#nickname").val();
        if(!nickVal){
            labelError.attr("data-error",'用户名不能为空');
            nickname.addClass('invalid');
            return false;
        }
        $.post("/nickname",{nickname:nickVal},function(res){
            if(res.msg === 0){
                labelError.attr("data-error",'用户名已被占用');
                nickname.removeClass('valid');
                nickname.addClass('invalid');
            }else{
                login.fadeOut();
                $('.container').fadeIn();
                $('#panelNickname').html(nickVal);
                window.sayHi.init(nickVal);
            }
        });
    })
})(jQuery);
