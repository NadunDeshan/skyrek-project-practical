import mongoose from "mongoose";
const studentSchema = new mongoose.Schema(
    {
        name:String,
        age: Number,
        city: String
    }
    
)
// Difine model connect collection and back end
const Student = mongoose.model("Student",studentSchema)
export default Student