var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    pv: {
        type: Number,
        default: 0
    },
    comments: {
        type: Number,
        default: 0
    },
    createdTime: Date
});

exports.Post = mongoose.model("Post", postSchema);