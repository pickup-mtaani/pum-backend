var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const AgentSchema = new Schema(
  {

    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    total_payment: {
      type: Number,
      default: 180
    },
    receipt_no: {
      type: String,
      // required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    packages:
      [
        {
          type: Schema.Types.ObjectId,
          ref: "sent_packages",
        }
      ]
  },
  { timestamps: true }
);

const Agent = mongoose.model("agent_agent_packages", AgentSchema);
module.exports = Agent;
