import product from "../models/product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await product.find().populate('seller', 'username email');
        res.status(200).json({
            success: true,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = await product.findById(id).populate('seller', 'username email');
        
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: productData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, images, variations } = req.body;
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        const newProduct = new product({
            name, description, price, category, images: images || [], variations: variations || [], seller: req.user.id
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