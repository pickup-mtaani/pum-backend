var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const rejectSchema = new Schema({
    reason: {
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
    rejectedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('rejected_stock', rejectSchema);
