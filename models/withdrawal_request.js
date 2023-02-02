var mongoose = require("mongoose");

const Schema = mongoose.Schema;
const withdrawalRequestSchema = new Schema(
  {
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
    phone: {
      type: String,
    },
    packages: [
      {
        type: String,
      },
    ],
    withdrawalID: {
      type: Schema.Types.ObjectId,
      ref: "withdrawal",
    },
  },
  { timestamps: true }
);

const Withdrawal = mongoose.model(
  "withdrawal_request",
  withdrawalRequestSchema
);
module.exports = Withdrawal;
