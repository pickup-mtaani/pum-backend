var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


const Schema = mongoose.Schema;

const thrifterLocationSchema = new Schema({
    agent_location: {
        type: String,
        required: true
    },
    agent_area: {
        type: String,
        
    },
    agent_description: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    loc: {
        type: { type: String },
        coordinates: []
    },
   
    deleted_at: {
        type: Date,
        default: null
    },
    
    

}, { timestamps: true });

// thrifterLocationSchema.index({ "loc": "2dsphere" });

const Location = mongoose.model('thrifter_location', thrifterLocationSchema);
module.exports = Location