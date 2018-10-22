var express = require('express');
var router = express.Router();
var checkLogin = require('../middlewares/check').checkLogin

router.get('/', checkLogin, (req, res) => {
    // res.send('logout');

    req.session.user = null
    req.flash('success', '退出成功')
    res.redirect('back');
});

module.exports = router;