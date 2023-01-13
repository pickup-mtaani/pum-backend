var mongoose = require("mongoose");

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
      enum: ["request", "delivered", "declined", "assigned", "complete", "rejected", "booked", 'pending-stock-doorstep',
        "pending-shelf-doorstep", "recieved-warehouse", "picked", "picked-from-sender", "pending-doorstep", "unavailable", "dropped", "assigned-warehouse", "warehouse-transit",
        "on-transit", "fail"],
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
      enum: ['customer', 'vendor', 'collection', 'booked'],
    },
    instant_bal: {
      type: Number,
    },
    on_delivery_balance: {
      type: Number,
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
    destination: {
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
      default: "doorstep",
    },
    toLocation: {
      type: String,

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

const Doorstep = mongoose.model("doorStep_delivery_packages", doorstepSchema);
module.exports = Doorstep;
