var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    businesses: [{
        type: Schema.Types.ObjectId,
        ref: 'business'
    }
    ],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'business_category'
    },
    images: {
        type: Array
        // required: true
    },
    colors: {
        type: Array,
        // required: true
    },
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        // required: true
    },
    min_order: {
        type: Number,
        required: true
    },
    size: {
        type: Array,

    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('products', ProductSchema);
