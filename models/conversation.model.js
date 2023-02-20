const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        members: [{
            type: mongoose.Schema.Types.ObjectId, ref: 'user',
        }],
        updated_at: {
            type: Date,
            default: new Date(),
        },
        last_message: {
            type: String,
            default: `Chat with me ${new Date()}`,
        }
    },

    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
