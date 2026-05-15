import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    heroImage:{
        type: String,
        default: ''
    },
    images: {
        type: Array,
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    variations: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Variation',
        default: [],
    },
}, { timestamps: true });

export default mongoose.model("product", productSchema);