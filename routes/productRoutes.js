import { getProduct,getProducts,addProduct,deleteProduct } from "../controller/productController.js";
import express from "express";
const router = express.Router();

router.route("/").get(getProducts).post(addProduct);
router.route("/:id").get(getProduct).delete(deleteProduct);

export default router;