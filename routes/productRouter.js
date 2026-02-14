import express from "express";
import { createProduct, deleteProduct, getProductID, getProducts, updateProduct } from "../controllers/productController.js";
const productRouter = express.Router();

productRouter.get("/",getProducts)
productRouter.post("/",createProduct)
productRouter.delete("/:productID",deleteProduct)
productRouter.put("/:productID",updateProduct)
productRouter.get("/:productID",getProductID)

export default productRouter;