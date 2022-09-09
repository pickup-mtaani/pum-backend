var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doorstepSchema = new Schema(
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
    state: {
      type: String,
      enum: ["pending", "delivered", "cancelled", "on-transit"],
      default: "pending"
    },
    package_value: {
      type: String,
      // required: true
    },

    payment_amount: {
      type: Number,
      default: 180
    },

    customer_location: {
      type: String,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },

    payment_option: {
      type: String,
      enum: ['customer', 'vendor', 'collection'],
    },
    location: {
      type: String,

    },

    isProduct: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Doorstep = mongoose.model("doorStep_delivery_packages", doorstepSchema);
module.exports = Doorstep;
