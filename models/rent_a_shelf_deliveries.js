var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doorstepSchema = new Schema(
  {

    packageName: {
      type: String,
    },
    state: {
      type: String,

      enum: ["rejected", "expired", "picked-from-seller", "doorstep", "agent", "early_collection", "collected", "request"],
      default: "request"
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'business'
    },
    package_value: {
      type: String,

    },
    payment_option: {
      type: String,

    },
    hasBalance: {
      type: Boolean,
      default: false
    },
    booked: {
      type: Boolean,
      default: false
    },
    on_delivery_balance: {
      type: Number,
    },
    pipe: {
      type: String,

    },
    receipt_no: {
      type: String,

    },
    color: {
      type: String,

    },
    customerName: {
      type: String,
      required: true,
    },

    customerPhoneNumber: {
      type: String,
      required: true,
    },

    payment_amount: {
      type: Number,

    },
    rejectedId: {
      type: Schema.Types.ObjectId,
      ref: "rejected",

    },
    location: {
      type: Schema.Types.ObjectId,
      ref: "agents_details ",

    },


    customer_location: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
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

const Doorstep = mongoose.model("rent_a_shelf_packages", doorstepSchema);
module.exports = Doorstep;
