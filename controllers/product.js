import product from "../models/product.js";
import variation from "../models/variation.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Validates image size from base64 string
 */
function validateBase64ImageSize(base64String) {
    // Base64 encoded size is approximately 4/3 of the original size
    const sizeInBytes = Buffer.byteLength(base64String, 'utf8') * (3 / 4);
    return sizeInBytes <= MAX_FILE_SIZE;
}

/**
 * Saves base64 image to disk and returns the filename
 */
function saveBase64Image(base64String, filename = null) {
    try {
        // Generate unique filename if not provided
        if (!filename) {
            filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
        }

        // Extract base64 data (remove data URL prefix if present)
        let base64Data = base64String;
        if (base64String.includes(',')) {
            base64Data = base64String.split(',')[1];
        }

        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // Save file
        const filepath = path.join(uploadsDir, filename);
        fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));

        // Return just the filename (path prefix will be added by frontend)
        return filename;
    } catch (error) {
        console.error('Error saving image:', error);
        throw new Error('Failed to save image');
    }
}

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
        const { title, description, variantType, variants } = req.body;
        
        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: 'Product title and description are required'
            });
        }
        
        if (!variants || variants.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one variant is required'
            });
        }

        // Validate image sizes
        for (const variant of variants) {
            // Check both single image and array of images
            const imagesToCheck = variant.images || (variant.image ? [variant.image] : []);
            for (const img of imagesToCheck) {
                if (img && !validateBase64ImageSize(img)) {
                    return res.status(413).json({
                        success: false,
                        message: 'Image size exceeds maximum limit of 50MB'
                    });
                }
            }
        }

        // Create the product
        const newProduct = new product({
            name: title,
            description: description,
            category: variantType || 'General',
            seller: req.user.id
        });
        
        await newProduct.save();

        // Create variants for this product
        const variantsData = [];
        for (const variant of variants) {
            const imagePaths = [];
            let heroImagePath = null;
            
            console.log('Processing variant:', { 
                hasImages: Array.isArray(variant.images) && variant.images.length > 0,
                imagesCount: Array.isArray(variant.images) ? variant.images.length : 0,
                hasHeroImage: !!variant.heroImage,
                hasSingleImage: !!variant.image
            });
            
            // Handle multiple images array
            if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
                for (const img of variant.images) {
                    if (img) {
                        try {
                            const imagePath = saveBase64Image(img);
                            imagePaths.push(imagePath);
                            console.log('Saved image:', imagePath);
                            // First image is hero
                            if (!heroImagePath) {
                                heroImagePath = imagePath;
                            }
                        } catch (error) {
                            console.error('Error saving image:', error);
                        }
                    }
                }
            }
            // Handle single image (backward compatibility)
            else if (variant.image) {
                try {
                    heroImagePath = saveBase64Image(variant.image);
                    imagePaths.push(heroImagePath);
                    console.log('Saved single image:', heroImagePath);
                } catch (error) {
                    console.error('Error saving image:', error);
                    return res.status(500).json({
                        success: false,
                        message: 'Error saving product image',
                        error: error.message
                    });
                }
            }
            
            // Handle explicit heroImage (if no images were processed above)
            if (variant.heroImage && !heroImagePath) {
                try {
                    heroImagePath = saveBase64Image(variant.heroImage);
                    if (!imagePaths.includes(heroImagePath)) {
                        imagePaths.push(heroImagePath);
                    }
                    console.log('Saved hero image:', heroImagePath);
                } catch (error) {
                    console.error('Error saving hero image:', error);
                }
            }

            console.log('Creating variant with:', {
                imagesCount: imagePaths.length,
                heroImage: heroImagePath,
                images: imagePaths
            });

            const newVariant = new variation({
                product: newProduct._id,
                type: variantType || '',
                name: variantType || 'Default',
                value: variant.type || 'Original',
                price: variant.price || 0,
                images: imagePaths,
                heroImage: heroImagePath || ''
            });
            
            await newVariant.save();
            variantsData.push(newVariant);
        }

        res.status(201).json({
            success: true,
            message: 'Product created successfully with variants',
            data: {
                product: newProduct,
                variants: variantsData
            }
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
}