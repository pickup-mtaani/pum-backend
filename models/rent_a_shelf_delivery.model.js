var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const doorstepSchema = new Schema(
  {
    
    businessId: {
      type: Schema.Types.ObjectId,
      ref: "business",
    },
    packages:
      [
        {
          type: Schema.Types.ObjectId,
          ref: "rent_a_shelf_packages",
        }
      ]
    ,
    receipt_no: {
      type: String,
      // required: true
    },
  },
  { timestamps: true }
);

const Doorstep = mongoose.model("rent_a_shelf_deliveries", doorstepSchema);
module.exports = Doorstep;
