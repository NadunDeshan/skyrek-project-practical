import express from "express";
import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import studentRouter from "./routes/studentsRouter.js";
import User from "./models/user.js";
import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import productRouter from "./routes/productRouter.js";

const app = express()

//code clean setup part
app.use(express.json())


//Aythontication part
app.use(
    (req,res,next)=>{
        let token = req.header("Authorization")

        if(token != null){
            token = token.replace("Bearer ","")
            // console.log(token)
            jwt.verify(token,"jwt-secret",
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


const connectionString = "mongodb+srv://admin:123@cluster0.q7aypud.mongodb.net/?appName=Cluster0"

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
app.use("/students",studentRouter) 
app.use("/users",userRouter)
app.use ("/products",productRouter)

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