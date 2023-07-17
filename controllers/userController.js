const asyncHandler = require('express-async-handler');
const user = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = asyncHandler(async (req,res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable  = await user.findOne({email});
    console.log("userAvailable", userAvailable)
    if (userAvailable) {
        console.log('confirming')
        res.status(400).json({message: "user already registered!"});
        throw new Error("user already registered!");
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('hashed password', hashedPassword);
    const User = await user.create({
        username, email, password: hashedPassword
    })
    if (User) {
        res.status(200).json({_id: User.id, email: User.email, username: User.username})
    }
    else {
        res.status(400);
        throw new Error("userdata is not valid!");
    }
    res.json({message: 'user registered!'})
});


const loginUser = asyncHandler(async (req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({message: "All fields are mandatory!"})
        throw new Error("All fields are mandatory");
    }
    const User = await user.findOne({ email });
    // compare pass with the hashed
    if (User && (await bcrypt.compare(password, User.password))) {
        const accessToken = jwt.sign({
            user: {
                username: User.username,
                email: User.email,
                id: User._id 
            }
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "60m"}    
    )
    res.status(200).json({accessToken})
    } else {
        res.status(401).json({message: "email or password is not valid"});
        throw new Error("email or password is not valid")
    }
});


//private
const currentUser = asyncHandler(async (req,res) => {
    res.json(req.user);
});



module.exports = { registerUser, loginUser, currentUser };