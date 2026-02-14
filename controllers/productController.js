import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req,res){
// Check authorized part long verion
    // if (req.user == null){
    //     res.status(401).json({
    //         message : "Please Login and try again"
    //     });
    //     return;
    // }
    // if (req.user.role!== "admin"){
    //     res.status(403).json({
    //         message : "You are not authorized to create a product"
    //     });
    //     return;
    // }
    //------------------------------------------------------
//short form
if(!isAdmin(req)){
    res.status(403).json({
        message: "You are not authorized to create a product"
    });
    return;
} 
    try{
        const productData = req.body;

        const product = new Product(productData);

        await product.save();

        res.json(
            {
                message :"Product created Sucsessfully",
                product : product,
            }
        );
       }catch(err){
        console.error(err);
        res.status(500).json(
            {
                message : "Failed to crdeate product"
            }
        )
       }
}
export async function getProducts(req,res){
    try{
        const products = await Product.find()
        res.json(products);
    }catch (err){
        console.error(err);
        res.status(500).json({
            message : "Failed to retrive products"
        });
    }
}
//Product delet option------------------------------
export async function deleteProduct(req,res){
    if(!isAdmin(req)){
    res.status(403).json({
        message: "You are not authorized to create a product"
    });
    return;
} 
try{
    const productID = req.params.productID

    await Product.deleteOne({
        productID:productID
    })
    res.json({
        message : "Product deleted successfully"
    });
}catch(err){
    console.error(err);
    res.status(500).json({
        message : "Failed to delete product"
    });
}
}

//Update option------------------------------
export async function updateProduct(req,res){
    if(!isAdmin(req)){
    res.status(403).json({
        message: "You are not authorized to create a product"
    });
    return;
} 
try{
    const productID = req.params.productID;
    const updatedData = req.body;

    await Product.updateOne(
        {productID : productID},
        updatedData
    );
    res.json({
        message : "Product updated successfully"
    });
}catch(err){
    console.error(err);
    res.status(500).json({
        message : "Failed to update product"
    });
}
}

export async function getProductID(req,res){
try{
    const productID = req.params.productID;
    const product = await Product.findOne(

        {productID : productID},
        
    )
    if(product == null){
        res.status(404).json({
        message : "Product not found"
        });
    }else{
        res.json(product);
    }

}catch(err){
    console.error(err);
    res.status(500).json({
        message : "Failed to retrieve product by id"
    });
}
}


