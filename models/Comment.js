var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
    postId: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdTime: Date
});

exports.Comment = mongoose.model("Comment", commentSchema);