var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StockSchema = new Schema({
    qty: {
        type: String,
        // required: true
    },
    current_stock: {
        type: Number,
        default: 0
    },

    unit: {
        type: String,

    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products'
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

module.exports = mongoose.model('stocks', StockSchema);
