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
    // category: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'business_category'
    // },
    images: {
        type: Array
        // required: true
    },
    color: {
        type: String,
        // required: true
    },
    price: {
        type: Number,
        required: true
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
