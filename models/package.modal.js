var mongoose = require("mongoose");
const { default: Date_range } = require("../frontend/src/components/Seller/modals/date_range.modal");

const Schema = mongoose.Schema;

const PackageSchema = new Schema(
  {


    type: {
      type: String,
      default: "agent",
    },
    payment_phone_number: {
      type: String,

    },

    hasBalance: {
      type: Boolean,
      default: false
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    total_payment: {
      type: Number,

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
    customerName: {
      type: String,
      required: true,
    },
    fromLocation: {
      type: String,
      // required: true,
    },
    toLocation: {
      type: String,
      // required: true,
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

    },
    delivery_fee: {
      type: Number,

    },
    rejectedId: {
      type: Schema.Types.ObjectId,
      ref: "rejected",
    },
    servedById: {
      type: Schema.Types.ObjectId,
      ref: "collector",
    },

    senderAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agents_details ",
    },
    receieverAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agents_details ",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    color: {
      type: String
    },
    state: {
      type: String,
      enum: ["request", "delivered", "booked", "pending-doorstep", "pending-agent", "early_collection", "collected",
        "cancelled", "rejected", "on-transit", "dropped-to-agent", 'collected', "assigned", "recieved-warehouse",
        "picked", "picked-from-sender", "unavailable", "dropped", "assigned-warehouse", "warehouse-transit"],
      default: "request"
    },

    isProduct: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,

    },
    updatedAt: {
      type: Date,
      default: new Date()

    },
    time: {
      type: String,

    },
  },

);

const Package = mongoose.model("agent_agent_sent_packages", PackageSchema);
module.exports = Package;
