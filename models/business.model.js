var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const BizSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    logo: {
        type: String,

    },
    has_shelf: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'business_category'
    },
    shelf_location: {
        type: Schema.Types.ObjectId,
        ref: 'agents_details '
    },
    shelf_state: {
        type: String,
        default: 'Not a shelf'
    },


    details: {
        type: Schema.Types.ObjectId,
        ref: 'business_details'
    },

    till_No: {
        type: Number,

    },
    Mpesa_No: {
        type: Number,

    },
    // loc: {
    //     type: { type: String },
    //     coordinates: []
    // },

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
    agent: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Biz = mongoose.model('business', BizSchema);
module.exports = Biz