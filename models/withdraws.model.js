var mongoose = require('mongoose');
const bcrypt = require('bcryptjs')

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    ConversationID: {
        type:String
    },
    OriginatorConversationID: {
        type:String
    },
    ResponseCode: {
        type:String
    },
    ResponseDesc: {
        type:String
    },
    business: {
        type: Schema.Types.ObjectId,
        ref: "business",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    amount: {
        type: Number
    },
    packages: [{
        type: String,
    }], 
    logs: {
        type:String
    }

}, { timestamps: true });

UserSchema.methods.comparePassword = (password, hashPassword) => {
    return bcrypt.compareSync(password, hashPassword);
};

const User = mongoose.model('user', UserSchema);
module.exports = User
