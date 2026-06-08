import { createProduct, getProducts, getProductById, getUserProducts, updateProduct } from "../controllers/product.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const app = express.Router();

app.get("/", getProducts);
app.get("/my-products/list", verifyToken, getUserProducts);
app.get("/:id", getProductById);
app.post("/new", verifyToken, createProduct);
app.put("/:id", verifyToken, updateProduct);

export default app;