import { createProduct } from "../controllers/product.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const app = express.Router();

app.post("/new", verifyToken, createProduct);

export default app;