var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');


const Schema = mongoose.Schema;


const NarationsSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: moment()
    },

    dropped: {
        at: {
            type: Date,
            default: null
        },

        to: {
            type: Schema.Types.ObjectId,
            ref: 'agent_agent_packages'
        }
    },

    picked: {
        type: Date,
        default: null
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_packages'
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



module.exports = mongoose.model('rent-shelf-narations', NarationsSchema);
