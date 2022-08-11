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
      // required: true
    },
    
   delivery_fee:{
    type: Number,
    default:180
   },
    receipt_no: {
      type: String,
      // required: true
    },
    customer_location: {
      type: String,
    },
    house_no: {
      type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "rider",
    },
    isProduct: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Doorstep = mongoose.model("doorstep_delivery", doorstepSchema);
module.exports = Doorstep;
