import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'

// desc "Auth user/ set token"
// route POST /api/users/auth
// @desc public
export const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(401);
        throw new Error("Password is incorrect");
    }
    generateToken(res, user._id)
    res.status(201).json(user)

})

// desc "register user"
// route POST /api/users/register
// @desc public
export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email })
    if (userExists) {
        res.status(400);
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    const { password: pwd, ...rest } = user._doc

    if (user) {
        generateToken(res, user._id)
        res.status(200).json(rest)
    }
})

// desc "logout user/ remove token"
// route POST /api/users/logout
// @desc public
export const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: "Logged out successfully" })
})

// desc "get user profile"
// route GET /api/users/profile
// @desc private
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email
    }
    res.status(200).json(user)
})

// desc "update user profile"
// route PUT /api/users/profile
// @desc private
export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10) || user.password;
        }

        const updatedUser = await user.save();
        const { password: pwd, ...rest } = updatedUser._doc
        res.status(200).json(rest)
    } else {
        res.status(404);
        throw new Error("User not found")
    }
})