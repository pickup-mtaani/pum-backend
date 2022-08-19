var mongoose = require('mongoose');

const Schema = mongoose.Schema;


const MpesaLogsSchema = new Schema({

    log: {

        type: String

    },
    user:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('mpesalog', MpesaLogsSchema)
