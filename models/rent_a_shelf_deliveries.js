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

      enum: ["rejected", "expired", "picked-from-seller", "collected", "request"],
      default: "request"
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'business'
    },
    package_value: {
      type: String,

    },
    receipt_no: {
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
    location: {
      type: Schema.Types.ObjectId,
      ref: "thrifter_location",
      default: "6304d87a5be36ab5bfb66e2e"

    },

    // 6304d87a5be36ab5bfb66e2e
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
  },
  { timestamps: true }
);

const Doorstep = mongoose.model("rent_a_shelf_packages", doorstepSchema);
module.exports = Doorstep;
