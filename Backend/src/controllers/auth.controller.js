const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
/**
 * @desc register user
 * @route POST /api/auth/register
 * @access public
 */ 
async function registerUserController(req,res){
    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({message:"All Fields Are Required"})
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isUserAlreadyExist){
        /*isUser Already Exists.username ==  username*/
        return res.status(400).json({message:"User Already Exist"})
    }
    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign({id:user._id,username: user.username},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
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
    const {email,password} = req.body
    const user = await userModel.findOne({email})

    if( !user){
        return res.status(400).json({message:"Invalid Credentials"})
    }

    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid Credentials"})
    }

    const token = jwt.sign({id:user._id,username: user.username},process.env.JWT_SECRET,{expiresIn:"1d"})
    res.cookie("token",token)
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
    res.clearCookie("token")
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