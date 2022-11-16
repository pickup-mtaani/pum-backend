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

    droppedTo: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details'
    },
    booked: {
        bookedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        bookedAt: {
            type: Date,
            default: null
        }, bookedFor: {
            type: String,

        }

    },

    droppedAt: {
        type: Date,
        default: null
    },
    reciept: {
        type: String,
    },

    collectedby: {
        type: Schema.Types.ObjectId,
        ref: 'collector'
    },
    collectedAt: {
        type: Date,
        default: null
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'rent_a_shelf_packages'
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



module.exports = mongoose.model('rent-shelf-package_track', NarationsSchema);
