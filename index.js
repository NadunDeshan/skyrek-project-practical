import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import studentRouter from "./routes/studentsRouter.js";
import User from "./models/user.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";
import cors from "cors";
import dotenv from "dotenv";
import orderRouter from "./routes/orderRouter.js";

dotenv.config();

const app = express()

app.use(cors())

//code clean setup part
app.use(express.json())


//Aythontication part
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization")

        if(token != null){
            token = token.replace("Bearer ","")
            // console.log(token)
            jwt.verify(token,process.env.JWT_SECRET,
                (err,decoded)=>{
                    if(decoded == null){
                        res.json(
                            {
                                message: "Invalid token please login again"
                            }
                        )
                        return
                    }else{
                         req.user = decoded
                    }
                }
            )
        }next()
            
    }
        )

//mongodb link hide in .env file
const connectionString = process.env.MONGO_URI

mongoose.connect(connectionString).then(
    ()=>{
        console.log("Database connected successfully")
    }
    )
.catch(
    (err)=>{
        console.log("Database connected failed",err.message)
    }
)
//connect student route
app.use("/api/students",studentRouter) 
app.use("/api/users",userRouter)
app.use ("/api/products",productRouter)
app.use("/api/orders",orderRouter)

// app.delete("/",
//     (req,res)=>{
//         console.log("Delete request recived")
//     }
// )

app.listen(5000,
    ()=>{
        console.log("Server is running port 5000")
    }
)