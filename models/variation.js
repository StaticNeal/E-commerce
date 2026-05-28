import mongoose from "mongoose";

const variationSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    images: {
        type: Array,
        default: [],
    },
    heroImage: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 4,
        min: 0,
        max: 5
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
}, { timestamps: true });

export default mongoose.model('Variation', variationSchema);