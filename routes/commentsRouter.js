var express = require('express');
var router = express.Router();
var Post = require('../models/Post').Post;
var Comment = require('../models/Comment').Comment;
var checkLogin = require('../middlewares/check').checkLogin


// POST /comment 创建留言
router.post('/', checkLogin, (req, res) => {
    // res.send('comment');
    // console.log(req.body.content)

    var author = req.session.user._id
    var postId = req.body.postId
    var content = req.body.content
    // console.log(postId)

    // 校验参数
    try {
        if (!author) {
            throw new Error('登陆之后才能评论')
        }
        if (!content) {
            throw new Error('内容不能为空')
        }
        if (!postId) {
            throw new Error('不知道要评论哪一篇文章')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back')
    }

    Comment.create({
        author: author,
        postId: postId,
        content: content,
        createdTime: Date.now()
    }, (err) => {
        if (err) {
            req.flash('error', '发表评论失败')
        } else {
            req.flash('success', '发表评论成功')

            // 更新评论数
            Post.findById(postId, (err1, result1) => {
                Post.findByIdAndUpdate(postId, {
                    comments: result1.comments + 1
                }, (err2, result2) => {
                    // console.log('result2', result2)

                    res.redirect('back');
                })
            })
        }

    })

});

//  GET comment/:commentId/remove 删除留言
router.get('/:commentId/remove', checkLogin, (req, res) => {
    // res.send('comment');

    var commentId = req.params.commentId
    Comment.findById(commentId).populate('author').exec((err, result) => {
        // 判断评论是否是当前登陆用户发布的
        if (result.author._id.toString() !== req.session.user._id.toString()) {
            req.flash('error', '没有权限删除')
            return res.redirect('back');
        } else {
            Comment.findByIdAndRemove(commentId, (err1) => {
                if (err) {
                    req.flash('error', '删除评论失败')
                } else {
                    req.flash('success', '删除评论成功')

                    // 更新评论数
                    Post.findById(result.postId, (err2, result2) => {
                        Post.findByIdAndUpdate(result.postId, {
                            comments: result2.comments - 1
                        }, (err3, result3) => {
                            // console.log('result3', result3)

                            res.redirect('back');
                        })
                    })
                }

            })
        }
    })

});

module.exports = router;