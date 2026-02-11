import { createContact,getContactById,getContacts } from "../controller/contactController.js";
import express from "express";

const router = express.Router();

//create contact
router.post("/",createContact);

//get all contacts
router.get("/",getContacts);

//get contact by id
router.get("/:id",getContactById);

export default router;