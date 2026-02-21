import axios from "axios";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import OTP from "../models/otpModel.js";
import getDesignedEmail from "../lib/emailDesigner.js";

dotenv.config();

const transporter = nodemailer.createTransport({
    service : "gmail",
    host: "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.APP_PASSWORD
    }
})

export function createUser(req,res){

    const hashPassword = bcrypt.hashSync(req.body.password,10)
    const user = new User(
        {
            email : req.body.email,
            firstName :req.body.firstName,
            lastName : req.body.lastName,
            password : hashPassword
        }
    )
    user.save().then(
        ()=>{
            res.json({
                message : "User created successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message : "Failed to create user"
            })
        }
    )
}
export function loginUser(req,res){
    User.findOne(
        {
            email : req.body.email
        }
    ).then(
        (user)=>{
            if(user == null){
                res.status(404).json(
                    {
                        message:"User not found"
                    }
                )
            }else{
                if(user.isBlock){
                    res.status(403).json({
                        message : "Your account has been blocked.please contact admin"
                    })
                }
                const isPasswordMatching = bcrypt.compareSync(req.body.password,user.password)
                if(isPasswordMatching){

                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isEmailVerified : user.isEmailVerified,
                            image:user.image
                        },
                        process.env.JWT_SECRET
                    )
                    res.json({
                        message : "Login successful",
                        token:token,
                        user:{
                            email : user.email,
                            firstName:user.firstName,
                            lastName: user.lastName,
                            role: user.role,
                            isEmailVerified: user.isEmailVerified,
                            image:user.image
                        }
                    })
                }else{
                    res.status(401).json({
                        message : "Inavalid password"
                    })

                    }
                 }
             }
    )
}

export function isAdmin(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role != "admin"){
        return false;
    }
    return true;
}

export function isCustomer(req){
    if(req.user == null){
        return false;
    }
    if(req.user.role !="user"){
        return false;
    }
    return true;
}
export function getUser(req,res){
    if(req.user == null){
        res.status(401).json({
            message : "Unauthorized user"
        });
        return;
    }else{
        res.json(req.user);
    }
}
export async function googleLogin(req,res){
    const token = req.body.token;

    if(token == null){
        res.status(401).json({
            message : "Token is required"
        });
        return;
    }
    try{
        const googleResponse= await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",{
        headers : {
            Authorization : `Bearer ${token}`
        }
    }
    )
    const googleUser = googleResponse.data;
    const user = await User.findOne({email : googleUser.email});
    
   if(user == null){
    const newUser = new User({
        email : googleUser.email,
        firstName : googleUser.given_name,
        lastName : googleUser.family_name,
        password : "abc",
        isEmailVerified : googleUser.email_verified,
        image : googleUser.picture,
    })
        
    let savedUser = await newUser.save()

    const jwttoken = jwt.sign({
        email : savedUser.email,
        firstName : savedUser.firstName,
        lastName : savedUser.lastName,
        role : savedUser.role,
        isEmailVerified : savedUser.isEmailVerified,
        image:savedUser.image
    },process.env.JWT_SECRET);
    res.json({
        message : "Login successfully",
        token : jwttoken,
        user : {
            email : savedUser.email,
            firstName : savedUser.firstName,
            lastName : savedUser.lastName,
            role : savedUser.role,
            isEmailVerified : savedUser.isEmailVerified,
            image:savedUser.image
        }
    });
    return
    
    }else{
        if(user.isBlock){
            res.status(403).json({
                message : "Your account has been blocked.please contact admin.."
            })
        }
        const jwtToken = jwt.sign({
            email : user.email,
            firstName : user.firstName,
            lastName : user.lastName,
            role : user.role,
            isEmailVerified : user.isEmailVerified,
            image:user.image
        },process.env.JWT_SECRET);
        res.json({
            message : "Login successfully",
            token : jwtToken,
            user : {
                email : user.email,
                firstName : user.firstName,
                lastName : user.lastName,
                role : user.role,
                isEmailVerified : user.isEmailVerified,
                image:user.image
            }
        });
        return;
    }  
    }catch(err){
        res.status(500).json({
            message : "Failed to login with google"
        })
        return;
    }
}
export async function getAllusers(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to view all users"
        });
        return;
    }try{
        const users = await User.find();
    res.json(users);
    }catch(err){
        res.status(500).json({
            message : "Failed to get users"
        });
    }
    
}
export async function blockOrUnblockUser(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "You are not authorized to block or unblock a user"
        });
        return;
    }
    if(req.user.email == req.params.email){
        res.status(400).json({
            message : "You can not block or unblock yourself"
        });
        return;
    }
    try{
        await User.updateOne({email : req.params.email},{isBlock : req.body.isBlock});
        res.json({
            message : "User block status updated successfully"
        });

    }catch(err){
        res.status(500).json({
            message : "Failed to block or unblock user"
        });
    }
}
export async function sendOTP(req,res){

    const email= req.params.email;
    if(email == null){
        res.status(400).json({
            message : "Email is required"
        });
        return;
    }
    //100000 - 999999
    const otp = Math.floor(100000 + Math.random()*900000);

    try{
        await OTP.deleteMany({
            email : email
        });

        const newOTP = new OTP({
            email : email,
            otp : otp
        });

        await newOTP.save();

        const html = getDesignedEmail({
        brandName: "ND • Crystal Beauty Clear",
        accentColor: "#fa812f",
        primaryColor: "#fef3e2",
        secondaryColor: "#393e46",
        otp: otp,              // make sure otp is a string
        minutesValid: 10,
        supportEmail: "support@nd.com", // optional
        });

        await transporter.sendMail({
        from: `"ND Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset Verification Code",
        html,
        });

        // await transporter.sendMail({
        //     from : process.env.EMAIL_USER,
        //     to : email,
        //     subject : "Your OTP for password reset",
        //     text : `Your OTP for password reset is ${otp}.It is valid for 10 minutes.`
        // });

        res.json({
            message : "OTP sent your email."
        });

        } catch (err) {
  console.log("sendOTP error:", err.message);
  console.log(err);
  return res.status(500).json({
    message: "Failed to send OTP",
    error: err.message,
  });
}

    // }catch(err){
    //     res.status(500).json({
    //         message : "Failed to send OTP"
    //     });
    // }
}

export async function changePasswordViaOTP(req,res){
    const email = req.body.email;
    const otp = req.body.otp;
    const newPassword = req.body.newPassword;
    try{
    const otpRecord = await OTP.findOne({
        email : email,
        otp : otp
    });
    if(otpRecord == null){
        res.status(400).json({
            message : "Invalid OTP"
        });
        return;
    }

    await OTP.deleteMany({
        email : email
    });

    const hashPassword = bcrypt.hashSync(newPassword,10);
    
        await User.updateOne({email : email},{password : hashPassword});
        res.json({
            message : "Password changed successfully"
        });
    }catch(err){
        res.status(500).json({
            message : "Failed to change password"
        });
    }
}

export async function updateUserData(req,res){
    if(req.user == null){
        res.status(401).json({
            message : "Unauthorized user"
        });
        return;
    }
    try{
        await User.updateOne({
            email : req.user.email
        },{
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            image : req.body.image
        
        });
        res.json({
            message : "User data updated successfully"
        });
    }catch(err){
        res.status(500).json({
            message : "Failed to update user data"
        });
    }
}

export async function updatePassword(req,res){
    if(req.user == null){
        res.status(401).json({
            message : "Unauthorized user"
        });
        return;
    }
    try{
        const hashPassword = bcrypt.hashSync(req.body.password,10);
        await User.updateOne({email : req.user.email},{password : hashPassword});
        res.json({
            message : "Password updated successfully"
        });
    }catch(err){
        res.status(500).json({
            message : "Failed to update password"
        });
    }
}