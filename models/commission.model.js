var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const CommisionSchema = new Schema({
    doorstep_package: {
        type: Schema.Types.ObjectId,
        ref: 'doorStep_delivery_packages'
    },
    agent_package: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_sent_packages'
    },
    rent_shelf: {
        type: Schema.Types.ObjectId,
        ref: 'rent_a_shelf_packages'
    },
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    commision: {
        type: Number,
        required: true
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });

module.exports = mongoose.model('commision', CommisionSchema);
