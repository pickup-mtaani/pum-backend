var mongoose = require('mongoose');


const Schema = mongoose.Schema;


const RecieveSchema = new Schema({
    package: {
        type: Schema.Types.ObjectId,
        ref: 'package'
    },
    reciver_name: {
        type: String,
        required: true
    },
    reciver_phone_no: {
        type: String,
        required: true
    },
    reciver_id_no: {
        type: String,
        required: true
    },
    deleted_at: {
        type: Date,
        default: null 
    }
  
},{timestamps:true});



const Reciever = mongoose.model('reciever', RecieveSchema);
module.exports = Reciever