var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const ZoneSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    abr: {
        type: String,
        // required: true
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Zone = mongoose.model('zone', ZoneSchema);
module.exports = Zone