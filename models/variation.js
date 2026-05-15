import mongoose from "mongoose";

const variationSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

export default mongoose.model('Variation', variationSchema);