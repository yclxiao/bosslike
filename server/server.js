// 处理css
import csshook from 'css-modules-require-hook/preset';
// 处理图片
import assethook from 'asset-require-hook';


/**
 * 插入react代码 进行服务端改造
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {
    createStore,
    applyMiddleware,
    compose
} from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
// 引入renderToString
import { renderToString, renderToStaticMarkup, renderToNodeStream } from 'react-dom/server';
// 服务端是没有BrowserRouter 所以用StaticRouter
import { StaticRouter } from "react-router-dom";
// 引入reducer
import reducers from "../src/reducer";
// 引入前端路由
import Routers from '../src/router';

// 引入css 和 js
import buildPath from '../build/asset-manifest.json';

assethook({
    extensions: ['png', 'jpg']
});

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const userRoute = require("./userRoute");
const app = express();
const path = require("path");

//express & socket.io关联
const server = require("http").Server(app);
const io = require("socket.io")(server);
const models = require("./model");
const Chat = models.getModel("chat"); //聊天表

io.on("connection", function(socket) {
  //收到前端发送过来的消息
  socket.on("sendMsg", function(data) {
    const { from, to, content } = data;
    const chatId = [from, to].sort().join("_");
    Chat.create({ chatId, ...data }, function(err, doc) {
      if (doc) {
        io.emit("noticeMsg", doc);
      }
    });
    //发送到全局
    // io.emit("noticeMsg",data)
  });
});

app.use(cookieParser());
app.use(bodyParser.json());

const store = createStore(reducers, compose(
    applyMiddleware(thunk),
));

// 用户接口模块
app.use("/user", userRoute);

// app.get("/",function(req,res){
//     res.send("wellcom to express!")
// });

// 映射到build后的路径
//设置build以后的文件路径 项目上线用
app.use((req, res, next) => {
    if (req.url.startsWith('/user/') || req.url.startsWith('/static/')) {
        return next()
    }
    const context = {}
    const frontComponents = renderToString(
        (<Provider store={store}>
            <StaticRouter
                location={req.url}
                context={context}>
                <Routers />
            </StaticRouter>
        </Provider>)
    )
    // 新建骨架
    const _frontHtml = `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <title>人才市场</title>
            <link rel="stylesheet" type="text/css" href="/${buildPath['main.css']}">
        </head>
        <body>
            <noscript>
            You need to enable JavaScript to run this app.
            </noscript>
            <div id="root">${frontComponents}</div>
            <script src="/${buildPath['main.js']}"></script>
        </body>
    </html>`
    res.send(_frontHtml)
    // return res.sendFile(path.resolve('build/index.html'))
});
app.use("/", express.static(path.resolve("build")));

server.listen("9093", function() {
  console.log("open Browser http://localhost:9093");
});

// app.use  使用模块
// app.get   app.post 分别开发get和 post接口
// res.send  返回文本   res.json  返回对象   res.sendfile 返回文件  / 分别用来响应不同内容
