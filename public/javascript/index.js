$(document).ready(function(){
  var socket;
  var username;
  var user;
  var roomname="1";
  $("#login").click(function(){
      username=$("#username").val();
      if(username==null||username==""||username==undefined){
        alert("用户名不能为空");
        return;
      }
      socket=io.connect();
      socket.on("connect",function(){
          socket.emit("login",username);
          socket.on("exituser",function(data){
            //必须要移除没有登陆成功时给socket定义的事件，因为用户还没有登陆成功，
            //但是socket已经创建了，如果不销毁socket
            //这个没有登陆的用户页面还是可以收到服务器端广播的消息的，当然也可以将所有的代码放在用户
            //真正的登陆成功的回调函数中
            // socket.disconnect();调用这个函数也会触发客户端的disconnect事件
            socket.removeAllListeners();
              alert("用户名已存在");
          });
      window.location.reload=function(){
        //刷新页面的时候需要做的事情
      }
      socket.on("disconnect",function(){
        socketException();
        enableLogin();
        addToContentTxt("与服务器端断开连接");
      });
      socket.on("error",function(){
         socketException();
         enableLogin();
         addToContentTxt("与服务器之间的连接发送错误");
      });
          socket.on("notexituser",function(data){
            username=data;
              $("#login").attr("disabled","disabled").css("backgroundColor","#7A8485");
              $("#exit").removeAttr("disabled").css("backgroundColor","#0080FF");
              $("#sendMsg").removeAttr("disabled").css("backgroundColor","#0080FF");
              $("#addtoroom").removeAttr("disabled");
          });
          socket.on("login",function(data){
            $("#userlist").empty();
            //login success or exit,you need to update user list 
            data.forEach(function(ele){
                // $("#userlist").append("<li><a href='/sigchat?username="+ele+"'>"+ele+"</a></li>");
                $("#userlist").append("<li>"+ele+"</li>");
            });
          });
          socket.on("userloginmsg",function(data){
            // $("#userlist").append("<li><a href='/sigchat?username="+data+"'>"+data+"</a></li>");
            $("#userlist").append("<li>"+data+"</li>");
            var str=$("#contentTxt").val();
            if(str==""||str==null||str==undefined){
              str=data+"加入聊天室";
            }else{
              str=str+"\n"+data+"加入聊天室";
            }
            $("#contentTxt").val(str);
          });
          socket.on("sendMsg",function(data){
            addToContentTxt(data);
              // var str=$("#contentTxt").val()+"\n"+data;
              // $("#contentTxt").val(str);
          });
          socket.on("exit",function(data){
            addToContentTxt(data+"退出聊天室");
              // var str=$("#contentTxt").val()+"\n"+data+"退出聊天室";
              // $("#contentTxt").val(str);
          });
          socket.on("r",function(data){
            addToContentTxt(data);
              // var str=$("#contentTxt").val()+"\n"+data;
              // $("#contentTxt").val(str);
          });
          socket.on("toSomeone",function(data){
            addToContentTxt(data);
              // var str=$("#contentTxt").val()+"\n"+data;
              // $("#contentTxt").val(str);
          });
      });
  });
  $("#exit").click(function(){
       if(username!=$("#username").val()){
        alert("请输入你登陆的用户名"+username+"退出");
        return;
       }
       enableLogin();
       // socket.emit("exit",username);不需要触发一个专门的exit事件，
       // 因为socket.disconnect会触发服务器端的disconnect事件，在disconnect事件中处理就行了
       socketException();
       addToContentTxt(username+"退出聊天室");
       // var str=$("#contentTxt").val()+"\n"+username+"退出聊天室";
       // $("#contentTxt").val(str);
       //once the user logout,the user list should be empty,rather than delete the logout user
       // $("#userlist li a").each(function(i,ele){
       //    if($(ele).text()==username){
       //      $(ele).parent().remove();
       //    }
       // });
       $("#userlist").empty();
  });
  $("#sendMsg").click(function(){
    var str=$("#msgTxt").val();
       if(str==null||str==""||str==undefined){
        alert("发送的消息不能为空");
        return;
       }
       socket.emit("sendMsg",username+":"+str);
  });
  $("#addtoroom").click(function(){
          socket.emit("enter",roomname);
          alert("成功加入1号房间");
          $("#sendmsgtoroom").removeAttr("disabled");
  });
  $("#sendmsgtoroom").click(function(){
    var d=username+"发送到1号房间:"+$("#roommsg").val();
    socket.emit("room",d);
  });
  $("#userlist").on("dblclick","li",function(){
        user=$(this).text();
        if(user==username){
          alert("不能给自己发消息");
          return;
        }
        $("#tosomeonebtn").removeAttr("disabled");
        alert("现在，你可以给"+user+"发送消息了");
  });
  $("#tosomeonebtn").click(function(){
    var d={};
    var str=$("#tosomeone").val();
    if(str==null||str==""||str==undefined){
      alert("发送的消息不能为空");
      return;
    }
    d.str="来自"+username+":"+str;
    d.user=user;
    socket.emit("someMsg",d);
  });
  function addToContentTxt(str){
      var s=$("#contentTxt").val()+"\n"+str;
      $("#contentTxt").val(s);
  }
  function enableLogin(){
    $("#exit").attr("disabled","disabled").css("backgroundColor","#7A8485");
       $("#login").removeAttr("disabled").css("backgroundColor","#0080FF");
       $("#sendMsg").attr("disabled","disabled");
       $("#addtoroom").attr("disabled","disabled");
        $("#sendmsgtoroom").attr("disabled","disabled");
        $("#tosomeonebtn").attr("disabled","disabled");
  }
  function socketException(){
    socket.disconnect();
    socket.removeAllListeners("connect");
    io.sockets={};
  }
});


//还有一个用户直接关闭聊天室的情况，应该要告诉别人，该用户已经退出聊天室了