var express = require('express');
var router = express.Router();
var path = require('path')
var fs = require('fs')

var User = require('../models/User').User;

// ========================
// 处理表单 文件上传 的中间件
var multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, req.body.username + '-' + Date.now() + path.extname(file.originalname))
    }
})

var upload = multer({
    storage: storage
})
// ========================

// GET 注册页面
router.get('/', (req, res) => {
    // res.send('login');
    res.render('register');
});


// POST 用户注册
router.post('/', upload.single('avatar'), (req, res) => {
    // res.send('login');
    console.log('req.body', req.body)
    console.log('file', req.file)

    // 接收参数
    var username = req.body.username
    var password = req.body.password
    var gender = req.body.gender
    var profile = req.body.profile
    var avatar = req.file
    // 校验参数
    try {
        if ((username.length < 3) || (username.length > 10)) {
            throw new Error('请输入用户名3-10')
        }
        if (!password) {
            throw new Error('请输入密码')
        }
        if (!profile) {
            throw new Error('请输入个人简介')
        }
        if (!avatar) {
            throw new Error('请选择头像')
        }
    } catch (e) {
        // 注册失败，异步删除上传的头像
        if (req.file) {
            fs.unlink(avatar.path, (err) => {
                if (err) {
                    console.log('删除头像失败', err)
                }
            })
        }
        req.flash('error', e.message)
        return res.redirect('back')
    }

    // 写入数据库
    User.create({
        username: username,
        password: password,
        gender: gender,
        profile: profile,
        avatar: avatar.filename
    }, (err, result) => {
        if (err) {
            // 注册失败，异步删除上传的头像
            if (req.file) {
                fs.unlink(avatar.path, (err) => {
                    if (err) {
                        console.log('删除头像失败', err)
                    }
                })
            }
            // 提示
            req.flash('error', '用户名已被占用')
            res.redirect('back')
        } else {
            req.flash('success', '注册成功')
            res.redirect('login');
        }
    })

});

module.exports = router;