var mongoose = require('mongoose');

const Schema = mongoose.Schema;


const rejectSchema = new Schema({

    deleted_at: {
        type: Date,
        default: null
    },
    reject_reason: {
        type: String,
        default: "not specified"
    },
    return_reason: {
        type: String,
    },

}, { timestamps: true });

module.exports = mongoose.model('rejected', rejectSchema);
