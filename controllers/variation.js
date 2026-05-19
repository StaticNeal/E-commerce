import Variation from "../models/variation.js";
import Product from "../models/product.js";

// Upload image and return filename
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
};

export const createVariation = async (req, res) => {
    try {
        const { productId, name, value, price, heroImage, images, rating, stock } = req.body;
        
        if (!productId || !name || !value || price === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, name, value, and price are required'
            });
        }

        // Verify product exists
        const productData = await Product.findById(productId);
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Validate price
        const priceNum = parseFloat(price);
        if (isNaN(priceNum) || priceNum < 0) {
            return res.status(400).json({
                success: false,
                message: 'Price must be a valid positive number'
            });
        }

        // Validate rating if provided
        let variationRating = 4;
        if (rating !== undefined) {
            const ratingNum = parseFloat(rating);
            if (ratingNum < 0 || ratingNum > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 0 and 5'
                });
            }
            variationRating = ratingNum;
        }

        const newVariation = new Variation({
            product: productId,
            name,
            value,
            price: priceNum,
            heroImage: heroImage || '',
            images: images || [],
            rating: variationRating,
            stock: stock || 0
        });

        await newVariation.save();
        
        res.status(201).json({
            success: true,
            message: 'Variation created successfully',
            data: newVariation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating variation',
            error: error.message
        });
    }
};

export const getVariationsByProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        
        const variations = await Variation.find({ product: productId });
        
        res.status(200).json({
            success: true,
            data: variations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching variations',
            error: error.message
        });
    }
};

export const getVariationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const variation = await Variation.findById(id).populate('product');
        
        if (!variation) {
            return res.status(404).json({
                success: false,
                message: 'Variation not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: variation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching variation',
            error: error.message
        });
    }
};

export const updateVariation = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, value, price, heroImage, images, rating, stock } = req.body;
        
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (value !== undefined) updateData.value = value;
        if (price !== undefined) {
            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum < 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Price must be a valid positive number'
                });
            }
            updateData.price = priceNum;
        }
        if (heroImage !== undefined) updateData.heroImage = heroImage;
        if (images !== undefined) updateData.images = images;
        if (rating !== undefined) {
            const ratingNum = parseFloat(rating);
            if (ratingNum < 0 || ratingNum > 5) {
                return res.status(400).json({
                    success: false,
                    message: 'Rating must be between 0 and 5'
                });
            }
            updateData.rating = ratingNum;
        }
        if (stock !== undefined) updateData.stock = stock;
        
        const variation = await Variation.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!variation) {
            return res.status(404).json({
                success: false,
                message: 'Variation not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Variation updated successfully',
            data: variation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating variation',
            error: error.message
        });
    }
};

export const deleteVariation = async (req, res) => {
    try {
        const { id } = req.params;
        
        const variation = await Variation.findByIdAndDelete(id);
        
        if (!variation) {
            return res.status(404).json({
                success: false,
                message: 'Variation not found'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Variation deleted successfully',
            data: variation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting variation',
            error: error.message
        });
    }
};
