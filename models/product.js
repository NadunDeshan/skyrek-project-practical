import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
      productID : {
        type : String,
        required : true,
        unique : true
      },
      name : {
        type : String,
        required : true
      },
      altName : {
        type : [String],
        default: [],
        required : true
      },
      description : {
        type :String,
        required: true
      },
      images : {
        type : [String],
        default : [],
        required : true
      },
      price :{
        type : Number,
        required : true
      },
      labalPrice :{
        type : Number,
        required : true
      },
      catagory :{
        type : String,
        required :true
        }
    }
)
const Product = mongoose.model("Product",productSchema);
export default Product;