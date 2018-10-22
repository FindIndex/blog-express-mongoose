var express = require('express');
var router = express.Router();
var url = require('url');
var Post = require('../models/Post').Post;
var Comment = require('../models/Comment').Comment;
var checkLogin = require('../middlewares/check').checkLogin

// GET /posts 主页和作者页面
router.get('/', (req, res) => {
    // res.send('login');
    // console.log(url.parse(req.url, true))
    var author = url.parse(req.url, true).query.author
    var whereStr
    if (author) {
        // GET /posts 主页
        whereStr = {
            author: author
        }
    } else {
        // GET /posts?author=xxx
        whereStr = {}
    }

    Post.find(whereStr).sort({
        _id: -1
    }).populate('author').exec((err, result) => {
        // console.log('result', result)

        // 截取文章内容的一部分作为 预览
        result.forEach(element => {
            // console.log(element.content)
            element.content = element.content.substr(0, 120)
        });

        // 渲染页面
        res.render('post-list', {
            posts: result,
        });
    })

});

//==================
// GET 渲染发表文章页面
router.get('/create', checkLogin, (req, res) => {
    // res.send('login');
    res.render('post-create', {
        user: req.session.user
    });
});

// POST 发表文章
router.post('/create', checkLogin, (req, res) => {
    // console.log('req.session.user', req.session.user)
    // res.send('login');
    var title = req.body.title
    var content = req.body.content
    var author = req.session.user._id

    // 校验参数
    try {
        if (!title) {
            throw new Error('标题不能为空')
        }
        if (!content) {
            throw new Error('内容不能为空')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    // 写入数据库
    Post.create({
        title: title,
        content: content,
        author: author,
        createdTime: Date.now()
    }, (err, result) => {
        if (err) {
            req.flash('error', '文章发布失败')
        } else {
            req.flash('success', '文章发布成功')
            res.redirect('/posts/' + result._id)
        }
    })

});

// ====================
// 根据ID获取单一篇文章详情
router.get('/:postId', (req, res) => {
    // res.send('login');
    Post.findById(req.params.postId).populate('author').exec((err, result) => {
        // console.log('result', result)
        if (!result) {
            return res.render('404');
        }

        // 增加一次浏览量
        Post.findByIdAndUpdate(req.params.postId, {
            pv: result.pv + 1
        }, (err1) => {
            if (err1) {
                console.log('pv更新失败', err1)
            } else {
                console.log('pv更新成功')
            }

        })

        // 查找评论
        Comment.find({
            postId: req.params.postId
        }).populate('author').exec((err1, result1) => {
            // console.log('comments', result1)
            res.render('post-details', {
                post: result,
                comments: result1
            });
        })



    })

});

// ====================
// 渲染修改文章页面 GET posts/:postsId/edit 查看特定某一篇文章页面 文章内页包括留言
router.get('/:postsId/edit', (req, res) => {
    // console.log(req.params.postsId)

    Post.findById(req.params.postsId, (err, result) => {
        if (err) {
            console.log('编辑文章失败', err)
        } else {
            res.render('post-edit', {
                post: result
            });
        }
    })
});


// POST posts/:postsId/edit 编辑某一篇文章提交
router.post('/:postsId/edit', (req, res) => {
    console.log(req.params.postsId)

    Post.findByIdAndUpdate(req.params.postsId, {
        title: req.body.title,
        content: req.body.content
    }, (err, result) => {
        if (err) {
            console.log('编辑文章失败', err)
        } else {
            res.redirect('/posts/' + req.params.postsId);
        }
    })
});


// 文章删除 GET posts/:postsId/remove
router.get('/:postsId/remove', checkLogin, (req, res) => {
    // res.send('posts/:postsId/remove');

    var postsId = req.params.postsId
    Post.findById(postsId).populate('author').exec((err, result) => {
        // 判断评论是否是当前登陆用户发布的
        // console.log(result.author._id)
        // console.log(req.session.user._id)
        if (result.author._id.toString() !== req.session.user._id.toString()) {
            req.flash('error', '没有权限删除')
            return res.redirect('back');
        } else {
            Post.findByIdAndRemove(postsId, (err) => {
                if (err) {
                    req.flash('error', '文章删除失败')
                } else {
                    req.flash('success', '文章删除成功')
                }
                res.redirect('/posts?author=' + req.session.user._id);
            })
            // 删除相关评论
            Comment.deleteMany({
                postId: postsId
            }, (err) => {
                console.log('文章及相关评论已删除')
            })
        }
    })

});

module.exports = router;