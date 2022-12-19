var mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ErrorSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    error: {

    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('user_errors', ErrorSchema);
