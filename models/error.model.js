var mongoose = require('mongoose');

const Schema = mongoose.Schema;


const ErrorSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_sent_packages'
    },
    error: {

    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('user_errors', ErrorSchema);
