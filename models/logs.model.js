var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const LogsSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        required: true
    },
   
    initiator: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('log', LogsSchema);
