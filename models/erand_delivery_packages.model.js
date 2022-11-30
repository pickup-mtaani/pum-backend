var mongoose = require("mongoose");

const Schema = mongoose.Schema;

const erandSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    customerPhoneNumber: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
    },
    packageName: {
      type: String,
    },
    description: {
      type: String,
    },
    ticket: {
      type: String,
    },
    state: {
      type: String,
      enum: ["request", "delivered", "declined", "assigned", "complete", "rejected", "booked",
        "recieved-warehouse", "picked", "picked-from-sender", "pending-doorstep", "unavailable", "dropped", "assigned-warehouse", "warehouse-transit",
        "on-transit", "fail",],
      default: "request"
    },
    package_value: {
      type: Number,
    },
    delivery_fee: {
      type: Number,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    reject_Id: {
      type: Schema.Types.ObjectId,
      ref: "rejected",
    },
    courier: {
      type: Schema.Types.ObjectId,
      ref: "courier",
    },

    total_payment: {
      type: Number,

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
    origin: {
      lat: {
        type: String,
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
    },
    type: {
      type: String,
      default: "courier",
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },

    payment_status: {
      type: String,
      default: "Not Paid"
    },
    receipt_no: {
      type: String,

    },
    hasBalance: {
      type: Boolean,
      default: false
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "agents_details ",
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

module.exports = mongoose.model("erand_delivery_packages", erandSchema);

