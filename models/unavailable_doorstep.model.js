var mongoose = require('mongoose');

const Schema = mongoose.Schema;


const unavailableSchema = new Schema({
    package: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_sent_packages'
    },
    reason: {
        type: String,
        required: true
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('unavailable_doorstep_packages', unavailableSchema);
