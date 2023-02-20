var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SalesSchema = new Schema({
    packageName: {
        type: String,

    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'business'
    },
    package_value: {
        type: Number,

    },
    payment_status: {
        type: Boolean,
        default: false
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
