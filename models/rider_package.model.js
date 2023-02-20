var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const RiderPackageSchema = new Schema({


    rider: {
        type: Schema.Types.ObjectId,
        ref: 'rider'
    },

    package: {
        type: Schema.Types.ObjectId,
        ref: 'agent_agent_sent_packages'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Biz = mongoose.model('rider_package', RiderPackageSchema);
module.exports = Biz