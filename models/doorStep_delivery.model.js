var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doorstepSchema = new Schema(
  {

    payment_phone_number: {
      type: String,
      // required: true,
    },

    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    packages:
      [
        {
          type: Schema.Types.ObjectId,
          ref: "doorStep_delivery_packages",
        }
      ]
    ,
    total_payment_amount: {
      type: Number,
      // default:180
    },
    receipt_no: {
      type: String,
      // required: true
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "rider",
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

const Doorstep = mongoose.model("doorStep_delivery", doorstepSchema);
module.exports = Doorstep;
