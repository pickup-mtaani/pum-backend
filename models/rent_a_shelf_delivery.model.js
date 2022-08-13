var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doorstepSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    payment_phone_number: {
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
    
   payment_amount:{
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
    from_agent_shelf: {
      type: Schema.Types.ObjectId,
        ref: "thrifter_location",
    },
    to_agent_shelf: {
      type: Schema.Types.ObjectId,
        ref: "agent",
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
  payment_option: {
      type: String,
            enum: ['customer','vendor','collection'],
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

const Doorstep = mongoose.model("rent_a_shelf_deliveries", doorstepSchema);
module.exports = Doorstep;
