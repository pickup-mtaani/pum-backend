var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const AgentSchema = new Schema(
  {
    type: {
      type: String,
      default: "agent",
    },
    payment_phone_number: {
      type: String,

    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    total_payment: {
      type: Number,
      default: 180
    },
    payment_status: {
      type: String,
      default: "Not Paid"
    },
    receipt_no: {
      type: String,

    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    packages:
      [
        {
          type: Schema.Types.ObjectId,
          ref: "agent_agent_sent_packages",
        }
      ]
  },
  { timestamps: true }
);

const Agent = mongoose.model("agent_agent_packages", AgentSchema);
module.exports = Agent;
