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
    console.log("Fetching All products");
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
export async function searchProducts(req, res) {
  try {
    const query = req.params.query?.trim();

    if (!query) {
      return res.json([]); // return empty array instead of 400
    }

    // escape special regex characters (prevents 500 error)
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const results = await Product.find({
      $or: [
        { name: { $regex: escaped, $options: "i" } },
        { altName: { $regex: escaped, $options: "i" } },
        { catagory: { $regex: escaped, $options: "i" } }
      ],
    }).limit(20);

    res.json(results);

  } catch (err) {
    console.log("searchProducts error:", err);
    res.status(500).json({ message: "Failed to search products" });
  }
}
//-------------------------------------------------------------
// export async function searchProducts(req, res) {
//   try {
//     const query = req.params.query;

//     if (!query || query.trim() === "") {
//       return res.status(400).json({ message: "Search query is required" });
//     }

//     const q = query.trim();

//     // Search by name / altName / catagory (your schema uses "catagory")
//     const results = await Product.find({
//       $or: [
//         { name: { $regex: q, $options: "i" } },
//         { altName: { $elemMatch: { $regex: q, $options: "i" } } },
        
//       ],
//     });

//     res.json(results);
//   } catch (err) {
//     console.log("searchProducts error:", err.message);
//     res.status(500).json({ message: "Failed to search products" });
//   }
// }
//-------------------------------------------------------------
// export async function getProductBySearch(req,res){
//     try{
//         const query = req.params.query;
//         const products = await Product.find(
//             {
//                 name : { $regex: query, $options: "i" }
//             }
//             );
//         res.json(products);

//     }catch(err){
//         console.error(err);
//         res.status(500).json({
//             message : "Failed to retrieve product by search"
//         });
//     }

// }



