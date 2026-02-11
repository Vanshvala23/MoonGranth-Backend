import {createOrder,getOrders,getOrderById,updateOrder,deleteOrder} from "../controller/orderController.js";
import express from "express";
const router=express.Router();

//create order
router.post("/",createOrder);
//get all orders
router.get("/",getOrders);
//get order by id
router.get("/:id",getOrderById);
//update order
router.put("/:id",updateOrder);
//delete order
router.delete("/:id",deleteOrder);

export default router;