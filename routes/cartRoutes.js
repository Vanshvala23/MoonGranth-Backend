import express from "express";
import { auth } from "../middleware/auth.js";
import { getCart, getCartByUser, addToCart, removeFromCart } from "../controller/cartController.js";

const router = express.Router();

router.get("/", auth, getCart); // logged-in user's cart
router.get("/user/:userId", auth, getCartByUser); // specific user cart
router.post("/", auth, addToCart);
router.delete("/:productId", auth, removeFromCart);

export default router;
