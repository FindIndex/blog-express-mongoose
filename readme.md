## 安装依赖

```
npm isntall
```

## 启动项目

```
node index.js
```

- WEB 框架使用 `express`
- 数据库操作框架使用 `mongoose`
- 模板引擎使用 `ejs`
- 前端布局框架使用 `BootStrap 3`

## 数据库配置文件 `./lib/mongoose.js`

## 路由

### 首页 /

- GET / 访问所有文章

### 登陆页 /login

- GET /login 访问登陆页面
- POST /login 提交账户密码表单

### 登陆页 /register

- GET /register 访问注册页面
- POST /register 提交注册表单

### 退出 /logout

- GET /logout 退出登录

### 查看文章 /posts

- GET /posts/xxx 查看特定某一篇文章页面 文章内页 包括留言
- GET /posts?author=xxx 查看某个作者发布的所有文章 个人主页

### 文章发布页 /posts/create

- GET /posts/create 发表文章页
- POST /posts/create 提交文章信息表单

### 修改文章 /posts/:postsId/edit

- GET /posts/:postsId/edit 查看特定某一篇文章页面 文章内页包括留言
- POST /posts/:postsId/edit 查看某一篇文章页面

### 删除文章 /posts/:postsId/remove

- GET /posts/:postsId/remove

### 留言 /comments

- POST /comments 创建留言
- GET /comments/:commentId/remove 删除留言
