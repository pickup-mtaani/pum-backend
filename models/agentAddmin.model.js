var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const agentadminSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    business_name: {
        type: String,
    },
    agent_description: {
        type: String,
    },
    opening_hours: {
        type: String,
    },
    working_days: {
        type: String,
    },

    closing_hours: {
        type: String,
    },
    prefix: {
        type: String,
    },
    isOpen: {
        type: Boolean,
        default: false
    },
    isSuperAgent: {
        type: Boolean,
        default: false
    },
    images: {
        type: Array
    },
    hasShelf: {
        type: Boolean,
        default: false
    },
    working_hours: {
        type: String
    },
    location_id: {
        type: Schema.Types.ObjectId,
        ref: 'agent-location'
    },
    rider: {
        type: Schema.Types.ObjectId,
        ref: 'rider'
    },
    riders:
        [
            {
                type: Schema.Types.ObjectId,
                ref: "rider",
            }
        ],
    zone: {
        type: Schema.Types.ObjectId,
        ref: 'zone'
    },
    mpesa_number: {
        type: String,
    },
    package_count: {
        type: Number,
        default: 5000,
    },
    loc: {
        lat: {
            type: String,
        },
        lng: {
            type: String,
        },
        name: {
            type: String,
        }
    },
    deleted_at: {
        type: Date,
        default: null
    }
}, { timestamps: true });



module.exports = mongoose.model('agents_details ', agentadminSchema);