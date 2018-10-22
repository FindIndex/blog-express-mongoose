var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog-express-mongoose', (err) => {
    if (err) {
        console.log('数据库连接失败', 'err')
    } else {
        console.log('数据库连接成功')
    }
})

exports.db = mongoose.connection