var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment');


const Schema = mongoose.Schema;

// "request", "delivered", "collected", "cancelled", "rejected", "on-transit", "dropped-to-agent", 'collected', "assigned", "recieved-warehouse", "picked", "picked-from-sender", "unavailable", "dropped", "assigned-warehouse", "warehouse-transit"
const ErandSchema = new Schema({
    state: {
        type: String,
        required: true
    },
    created: {
        createdAt: {
            type: Date,
            default: moment()
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    },

    dropped: {
        droppedBy: {
            type: Schema.Types.ObjectId,
            ref: 'rider'
        },
        droppedTo: {
            type: Schema.Types.ObjectId,
            ref: 'agents_details'
        },
        recievedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        droppedAt: {
            type: Date,
            default: null
        }
    },

    warehouse: {
        recievedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },

        warehouseAt: {
            type: Date,
            default: null
        }
    },
    recievedTo: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details'
    },
    recievedAt: {
        type: Date,
        default: null
    },
    assigned: {
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'rider'
        },
        assignedAt: {
            type: Date,
            default: null
        },
        assignedBy: {
            type: Schema.Types.ObjectId,
            ref: 'rider'
        },
    },
    rejected: {

        rejectedAt: {
            type: Date,
            default: null
        },
        reason: {
            type: String,

        },
    },
    reAssigned: {
        reAssignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'rider'
        },
        reAssignedAt: {
            type: Date,
            default: null
        },
        reAssignedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
    },
    delivered: {
        deliveredto: {
            type: Schema.Types.ObjectId,
            ref: 'agents_details'
        },
        deliveredAt: {
            type: Date,
            default: null
        },
        recievedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
    },
    droppedToagent: {
        droppedToagentBy: {
            type: Schema.Types.ObjectId,
            ref: 'rider'
        },
        recievedAt: {
            type: Date,
            default: null
        },
        recievedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
        droppedToagent: {
            type: Schema.Types.ObjectId,
            ref: 'agents_details'
        },
    },
    reciept: {
        type: String,
    },

    collected: {
        collectedby: {
            type: Schema.Types.ObjectId,
            ref: 'collector'
        },
        collectedAt: {
            type: Date,
            default: null
        },
        dispatchedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user'
        },
    },

    package: {
        type: Schema.Types.ObjectId,
        ref: 'erand_delivery_packages'
    },
    descriptions: {
        type: Array,
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('erand_package_track', ErandSchema);
