var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    shelf_location: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details '
    }
    ,
    desc: {
        type: String,

    },
    type: {
        type: String,

    },
    images: {
        type: Array

    },
    colors: {
        type: Array,

    },
    price: {
        type: Number,
        required: true
    },
    qty: {
        type: Number,
        default: 0

    },
    pending_stock_confirmed: {
        type: Boolean,
        default: false
    },
    pending_stock: {
        type: Number,
    },
    unit: {
        type: String,

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
