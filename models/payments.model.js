var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const paymentSchema = new Schema({

    reciever_name: {
        type: String,
        required: true
    },

    phone_number: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    package: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_packages'
    },
    recievedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



module.exports = mongoose.model('payment', paymentSchema);
