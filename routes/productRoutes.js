import { createProduct, getProducts, getProductById } from "../controllers/product.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";

const app = express.Router();

app.get("/", getProducts);
app.get("/:id", getProductById);
app.post("/new", verifyToken, createProduct);

export default app;