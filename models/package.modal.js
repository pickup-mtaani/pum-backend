var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PackageSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    customerPhoneNumber: {
      type: String,
      required: true,
    },
    packageName: {
      type: String,
    },
    description: {
      type: String,
    },
    package_value: {
      type: Number,
    },
    total_fee: {
      type: Number,
      default: 180
    },
    delivery_fee: {
      type: Number,
      default: 180
    },
    senderAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    receieverAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    isProduct: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("agent_agent_sent_packages", PackageSchema);
module.exports = Package;
