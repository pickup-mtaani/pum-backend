var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const BizCaSchema = new Schema({
    
    business_catgory_name: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    deleted_at: {
        type: Date,
        default: null 
    }
  
},{timestamps:true});



const Biz = mongoose.model('business_category', BizCaSchema);
module.exports = Biz