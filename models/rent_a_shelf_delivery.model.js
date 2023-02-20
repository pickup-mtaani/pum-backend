var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doorstepSchema = new Schema(
  {

    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    type: {
      type: String,
      default: "shelf",
    },
    packages:
      [
        {
          type: Schema.Types.ObjectId,
          ref: "rent_a_shelf_packages",
        }
      ]
    ,
    payment_status: {
      type: String,
      default: "Not Paid"
    },
    receipt_no: {
      type: String,

    },
  },
  { timestamps: true }
);

const Doorstep = mongoose.model("rent_a_shelf_deliveries", doorstepSchema);
module.exports = Doorstep;
