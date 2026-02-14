import express from"express";
import {createStudent,getStudents} from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.get("/",getStudents);
studentRouter.post("/",createStudent);
// studentRouter.delete("/",
//     ()=>{
//         console.log("Delete request into studentsRouter")
//     }
// )
// studentRouter.put("/",
//     ()=>{
//         console.log("Put request into studentsRouter")
//     }
// )
export default studentRouter;