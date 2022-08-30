var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doorstepSchema = new Schema(
  {
   
    packageName: {
      type: String,
    },
  
    package_value: {
      type: String,
      // required: true
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
      default: 180
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
  },
  { timestamps: true }
);

const Doorstep = mongoose.model("rent_a_shelf_packages", doorstepSchema);
module.exports = Doorstep;
