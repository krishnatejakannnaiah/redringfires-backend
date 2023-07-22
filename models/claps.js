const mongoose = require('mongoose');

const clapSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

module.exports = mongoose.model("Clap", clapSchema);