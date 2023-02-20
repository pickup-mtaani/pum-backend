// product sub Category 
var mongoose = require('mongoose');



const Schema = mongoose.Schema;


const SubProductchema = new Schema({
    
   name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'business_category'
    },
    other: {
        type: Boolean,
        default: false
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



const category = mongoose.model('product_sub_category', SubProductchema);
module.exports = category