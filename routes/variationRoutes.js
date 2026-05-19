import { 
    uploadImage,
    createVariation, 
    getVariationsByProduct, 
    getVariationById, 
    updateVariation, 
    deleteVariation 
} from "../controllers/variation.js";
import express from "express";
import { verifyToken } from "../middleware/auth.js";
import upload from "../utils/multer.js";

const app = express.Router();

app.post("/upload", verifyToken, upload.single('image'), uploadImage);
app.post("/", verifyToken, createVariation);
app.get("/product/:productId", getVariationsByProduct);
app.get("/:id", getVariationById);
app.put("/:id", verifyToken, updateVariation);
app.delete("/:id", verifyToken, deleteVariation);

export default app;
