import { isAuth } from "../middlewares/isAuth.js";
import express from "express";
import { createProduct, getAllProducts, getSingleProduct, updateProduct, updateProductImage } from "../controller/product.js";
import uploadFiles from "../middlewares/multer.js";

const router = express.Router();

router.post("/product/new", isAuth, uploadFiles, createProduct); // post - create the data
router.get("/product/all", getAllProducts);  // get - fetch the data
router.get("/product/:id", getSingleProduct);  
router.put("/product/:id", isAuth, updateProduct);  // put - update the data
router.post("/product/:id", isAuth, uploadFiles, updateProductImage)

export default router;



// fetch ke liye - get 
// update ke liye - put
// for create the product we used - post