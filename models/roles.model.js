var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;


const RoleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    descriptions: {
        type: String,
        required: true
    },
    
    deleted_at: {
        type: Date,
        default: null 
    }
  
},{timestamps:true});



const Role = mongoose.model('role', RoleSchema);
module.exports = Role