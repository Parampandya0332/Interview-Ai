const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")

function setAuthCookie(res, token) {
    const crossSite = process.env.COOKIE_CROSS_SITE === "true"
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || crossSite,
        sameSite: crossSite ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    })
}
/**
 * @desc register user
 * @route POST /api/auth/register
 * @access public
 */ 
async function registerUserController(req,res){
    const {username, password} = req.body
    const normalizedUsername = typeof username === "string" ? username.trim() : ""
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""

    if(!normalizedUsername || !email || typeof password !== "string" || !password){
        return res.status(400).json({message:"All Fields Are Required"})
    }

    const isUserAlreadyExist = await userModel.findOne({ $or:[{username: normalizedUsername},{email}] })

    if(isUserAlreadyExist){
        return res.status(409).json({message: isUserAlreadyExist.email === email
            ? "An account with this email already exists. Please sign in."
            : "This username is already taken."})
    }
    const hash = await bcrypt.hash(password,10)

    let user
    try {
        user = await userModel.create({ username: normalizedUsername, email, password:hash })
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0]
            return res.status(409).json({message: field === "email"
                ? "An account with this email already exists. Please sign in."
                : "This username is already taken."})
        }
        throw error
    }

    const token = jwt.sign({id:user._id,username: user.username},process.env.JWT_SECRET,{expiresIn:"1d"})
    setAuthCookie(res, token)
    res.status(201).json({message:"User Registered Successfully",user:{
        id:user._id,
        username:user.username,
        email:user.email
    }}) 
}

/**
 * @name loginUserController
 * @desc login user
 * @route POST /api/auth/login
 * @access public
 */
async function loginUserController(req,res){
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : ""
    const {password} = req.body
    if (!email || typeof password !== "string" || !password) {
        return res.status(400).json({message:"Email and password are required"})
    }
    const user = await userModel.findOne({email})

    if( !user){
        return res.status(400).json({message:"Invalid Credentials"})
    }

    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid Credentials"})
    }

    const token = jwt.sign({id:user._id,username: user.username},process.env.JWT_SECRET,{expiresIn:"1d"})
    setAuthCookie(res, token)
    res.status(200).json({message:"User Logged In Successfully",user:{
        id:user._id,
        username:user.username,
        email:user.email
    }})
 }
/**
 * @name logoutUserController
 * @desc logout user
 * @route GET /api/auth/logout
 * @access public
 */
async function logoutUserController(req,res){
    const token = req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }
    const crossSite = process.env.COOKIE_CROSS_SITE === "true"
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || crossSite,
        sameSite: crossSite ? "none" : "lax",
        path: "/",
    })
    res.status(200).json({message:"User Logged Out Successfully"})
    
}
/**
 * @name getMeController
 * @desc get logged in user details
 * @route GET /api/auth/get-me
 * @access private   
 */
async function getMeController(req,res){
    const user = await userModel.findById(req.user.id)
    res.status(200).json({
        message:"User Details Fetched Successfully",
        user:{
        id:user._id,
        username:user.username,
        email:user.email
    }})
}   

module.exports = {registerUserController,loginUserController,logoutUserController,getMeController}
