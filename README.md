# socket.io-express-SingleChatAndMultiplyChat
使用socket.io+express写的聊天系统，主要实现了多人的聊天室、加入特定房间的聊天和单独聊天

技术简介：
我使用的socket.io的版本是1.4.8，express的版本是4.13.4，因为不同的版本可能函数的使用方式不一样，特别是express，4开头的版本不再托管
像cookie-parser,body-parser,express-session等中间件，这就意味着你需要重新npm并require这些中间件，但是4开头的还托管着static中间件，
你不需要npm这个中间件，express中集成了。

运行方式：
下载这个项目，然后命令行中输入node app.js，打开浏览器输入127.0.0.1:1337/就能看到聊天室了。

结尾：
如果有任何疑问，或者我做的不好的地方，欢迎指出，共同学习，QQ:724183433，欢迎烧扰
