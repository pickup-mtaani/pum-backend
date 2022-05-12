var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SalesSchema = new Schema({
    qty: {
        type: String,
        required: true
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

module.exports = mongoose.model('sales', SalesSchema);
