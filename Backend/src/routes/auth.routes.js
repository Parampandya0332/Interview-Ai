const express = require("express")
const authController = require("../controllers/auth.controller")
const authRouter = express.Router()
const authMiddleware = require("../middlewares/auth.middleware")

/**
 * @route POST /api/auth/register
 * @description Register A New User
 * @access Public 
 */
authRouter.post("/register",authController.registerUserController)

/**
 * @route POST /api/auth/login
 * @description Login A User
 * @access Public 
 */
authRouter.post("/login",authController.loginUserController)

/**
 * @route GET /api/auth/logout
 * @description Logout A User and clear cookie and add token in blacklist
 * @access Public 
 */
authRouter.get("/logout",authController.logoutUserController)

/**
 * @route GET /api/auth/get-me
 * @description Get Logged In User Details
 * @access Private
 */
authRouter.get("/get-me",authMiddleware.authUser,authController.getMeController)

module.exports = authRouter