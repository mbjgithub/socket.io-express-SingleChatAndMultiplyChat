var express=require("express");
var sio=require("socket.io");
var http=require("http");
var index=require("./routers/index");
var app=express();
var server=http.createServer(app);
server.listen(1337,"127.0.0.1");
var io=sio.listen(server);
app.set("view engine","ejs");
app.set("views",__dirname+"/views");
app.use(express.static(__dirname+"/public"));
app.use("/",index);

var socketList={};
var names=[];
io.sockets.on("connection",function(socket){
    // socket.emit("login",names);you haven't login,so you cann't see the user list
    socket.on("login",function(data){
         for(var i=0;i<names.length;i++){
         	if(names[i]==data){
         		socket.emit("exituser",data);
         		return;
         	}
         }
         socket.emit("login",names);//if you login success,then you can see the user list,
         names.push(data);
         socketList[data]=socket;
         socket.emit("notexituser",data);
         io.sockets.emit("userloginmsg",data);
    });
    function splice(names,data){
    	//删除names数组中等于data的元素
    	for(var i=0;i<names.length;i++){
         	if(names[i]==data){
         		names.splice(i,1);
         		break;
         	}
         }
     }
    // socket.on("exit",function(data){
    //      splice(names,data);
    //      io.sockets.emit("exit",data);
    //      io.sockets.emit("login",names);
    // });
    socket.on("sendMsg",function(data){
         io.sockets.emit("sendMsg",data);
    });
    var roomname;
    socket.on("enter",function(data){
    	 roomname=data;
         socket.join(data);
    });
    socket.on("room",function(data){
    	// io.sockets.in(roomname).emit("r",data);work，但是也发给了自己，可能的原因是她自己页在room里面
         io.to(roomname).emit("r",data);//work
//socket.broadcast.to(roomid).emit('event_name', data);//事件一直触发不了，客户端不能监听到roomdata事件的触发
    });

    socket.on("someMsg",function(data){
    	//client socket only can send message to his server socket,
    	//when server client got the message,he send to other server socket,
    	//then,other socket sends the message to his socket
        socket.broadcast.to(socketList[data.user].id).emit("toSomeone",data.str);
    });
    //下面这个函数用于当用户没有点击退出按钮关闭而需要做的操作，将被关闭的用户从names和socketList中删除
    socket.on("disconnect",function(){
    	console.log(12);
        var flag;
        for(var key in socketList){
        	flag=false;
        	for(var k in io.sockets.sockets){
        		if(k==socketList[key].id){
        			flag=true;
        			console.log(1);
                    break;
        		}
        	}
        	if(flag==false){
        		console.log(2);
        		delete socketList[key];
                splice(names,key);
                io.sockets.emit("exit",key);
                io.sockets.emit("login",names);
        		break;
        	}
        }
    });
});