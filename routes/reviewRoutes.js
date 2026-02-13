import express from "express";
import { createReview,getReviews,getUserReviews,deleteReview } from "../controller/reviewController.js";
import {auth} from "../middleware/auth.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getReviews);
router.get("/user/:userId", getUserReviews);

/* PRIVATE */
router.post("/", auth, createReview);
router.delete("/:id", auth, deleteReview);

export default router;