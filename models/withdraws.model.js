var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const withdrawalSchema = new Schema(
  {
    ConversationID: {
      type: String,
    },
    OriginatorConversationID: {
      type: String,
    },
    ResponseCode: {
      type: String,
    },
    ResponseDesc: {
      type: String,
    },
    business: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    amount: {
      type: Number,
    },
    packages: [
      {
        type: String,
      },
    ],
    logs: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "approved"],
    },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model("withdrawal", withdrawalSchema);
module.exports = Withdrawal;
