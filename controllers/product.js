import product from "../models/product.js";

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, images } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newProduct = new product({
            name, description, price, category, images: images || [], seller: req.user.id
        });
        
        await newProduct.save();
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: newProduct
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
}