var express = require('express');
var router = express.Router();

var User = require('../models/User').User;

router.get('/', (req, res) => {
    // res.send('login');
    res.render('login');
});

router.post('/', (req, res) => {
    // res.send('login');
    // res.render('login');
    // 接收参数
    var username = req.body.username
    var password = req.body.password
    // 校验参数
    try {
        if ((username.length < 3) || (username.length > 10)) {
            throw new Error('请输入用户名')
        }
        if (!password) {
            throw new Error('请输入密码')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    // 读取数据库
    User.findOne({
        username: username
    }, (err, result) => {
        // console.log(result)
        if (!result) {
            req.flash('error', '用户名不存在')
            return res.redirect('back')
        }
        if (result.password != password) {
            req.flash('error', '密码错误')
            return res.redirect('back')
        } else {
            // 删除密码敏感信息 将用户信息写入 session
            var user = result
            delete user.password
            req.session.user = user
            console.log('req.session.user', user)

            req.flash('success', '登陆成功')
            res.redirect('/posts')
        }
    })
});

module.exports = router;