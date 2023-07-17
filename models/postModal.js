const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post: {
        type: String,
        required: [true, "please write a post"]
    },
    post_description: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: [true, "write a category"]
    },
    media_link: {
        type: String,
        required: false
    },
    media_type: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("Post", postSchema);