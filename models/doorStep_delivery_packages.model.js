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
      lat: {
        type: String,
        // required: true
      },
      lng: {
        type: String,
      },
      name: {
        type: String,
      }

    },

    isProduct: {
      type: Boolean,
      default: false,
    },

    payment_phone_number: {
      type: String,
      // required: true,
    },

    type: {
      type: String,
      default: "doorstep",
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },

    total_payment_amount: {
      type: Number,
      // default:180
    },
    payment_status: {
      type: String,
      default: "Not Paid"
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



  },
  { timestamps: true }
);

const Doorstep = mongoose.model("doorStep_delivery_packages", doorstepSchema);
module.exports = Doorstep;
