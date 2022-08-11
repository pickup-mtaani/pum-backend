var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const ParcelSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    customerPhoneNumber: {
      type: String,
      required: true,
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    packageName: {
      type: String,
    },
    description: {
      type: String,
    },
    package_value: {
      type: String,
    },
    
   delivery_fee:{
    type: Number,
    default:180
   },
    receipt_no: {
      type: String,
      // required: true
    },
    senderAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    receieverAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    isProduct: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("package", ParcelSchema);
module.exports = User;
