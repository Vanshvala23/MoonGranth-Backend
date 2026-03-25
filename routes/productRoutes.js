import express from "express";
import {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(upload.array("images", 5), addProduct);   // max 5 images

router
  .route("/:id")
  .get(getProduct)
  .put(upload.array("images", 5), updateProduct)  // optional new images on update
  .delete(deleteProduct);

export default router;
