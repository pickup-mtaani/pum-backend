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
        // required: true
    },
    what_u_sale: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'business_category'
    },
    deleted_at: {
        type: Date,
        default: null
    }

}, { timestamps: true });



const Biz = mongoose.model('business', BizSchema);
module.exports = Biz