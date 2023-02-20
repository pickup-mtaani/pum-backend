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
    phone: {
      type: String,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: Number,
      enum: [0, 1, 2], // approved, pending, rejected
    },
    code: {
      type: String,
    },
    transaction_code: {
      type: String,
    },
    amount: {
      type: Number,
    },
    packages: [
      {
        _id: { type: String },
        del_type: { type: String },
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
