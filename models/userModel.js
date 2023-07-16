const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add the username"]
    },
    email: {
        type: String,
        required: [true, "Please add the useremail"],
        unique: [true, "Email address already taken!"]
    },
    password: {
        type: String,
        required: [true, "Please add the userpassword"]
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("User", usersSchema);