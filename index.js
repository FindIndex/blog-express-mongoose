var express = require('express');
var bodyParser = require('body-parser')
var path = require('path')
var app = express();

// 引入 session
var session = require("express-session");
// 保存 session 到数据库
var MongoStore = require("connect-mongo")(session);
// 页面通知插件 依赖 sesion
var flash = require("connect-flash");

// 设置静态文件托管目录
app.use(express.static(path.join(__dirname, "public")));

// 设置模板引擎目录
app.set("views", path.join(__dirname, "views"));
// 设置使用哪一种模板引擎
app.set("view engine", "ejs");

// 使用 bodyParser中间件解析 POST表单
app.use(bodyParser.urlencoded({
    extended: false
}));


// =====================
// 引入lib里面连接的数据库
var db = require("./lib/mongoose").db;
// 设置使用 session 中间件
app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 3600000
        },
        store: new MongoStore({
            mongooseConnection: db
        })
    })
);

// 设置使用 flash 页面通知中间件
app.use(flash());
// =====================

// 添加模板使用的几个变量 提示
app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
})


// 使用路由
app.use('/', require('./routes/indexRouter'));
app.use('/login', require('./routes/loginRouter'));
app.use('/logout', require('./routes/logoutRouter'));
app.use('/register', require('./routes/registerRouter'));
app.use('/posts', require('./routes/postsRouter'));
app.use('/comments', require('./routes/commentsRouter'));


// 404 页面
app.use(function (req, res) {
    if (!res.headersSent) {
        res.status(404).render("404");
    }
});

app.listen(8080, () => {
    console.log('App listening on port 8080!');
});