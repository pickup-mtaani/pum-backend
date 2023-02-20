var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const NarationsSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'doorStep_delivery_packages'
    },
    descriptions: {
        type: String,
        required: true
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('door-step-narations', NarationsSchema);
