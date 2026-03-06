import express from "express";
import { blockOrUnblockUser, changePasswordViaOTP, createUser, getAllusers, getUser, googleLogin, loginUser, sendOTP, updatePassword, updateUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/me",getUser)
userRouter.post("/google-login",googleLogin)
userRouter.get("/all-users",getAllusers)
userRouter.put("/block/:email",blockOrUnblockUser)
userRouter.post("/send-otp", sendOTP);
userRouter.post("/change-password", changePasswordViaOTP);
userRouter.put("/me",updateUserData)
userRouter.put("/me/password",updatePassword)

export default userRouter;