var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const ParcelSchema = new Schema(
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
      ref: "user",
    },
    description: {
      type: String,
      ref: "user",
    },
    package_value: {
      type: String,
      // required: true
    },

    receipt_no: {
      type: String,
      // required: true
    },
    senderAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    receieverAgentID: {
      type: Schema.Types.ObjectId,
      ref: "agent",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    isProduct: {
      type: Boolean,
      default: false,
    },

    // pack_color: {
    //     type: String,
    //     // required: true
    // },

    // package_position: {
    //     type: String,
    //     default: 'Not Specified'
    // },
    // current_custodian: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'thrifter_location'
    // },
    // rejected_reasons: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'reason'
    // },
    // recieved: {
    //     type: Boolean,
    //     default: false
    // },
    // collected: {
    //     type: Boolean,
    //     default: false
    // },
    // collected_at: {
    //     type: Date,
    //     default: null
    // },
    // rejected: {
    //     type: Boolean,
    //     default: false
    // },
    // recieved_at: {
    //     type: Date,
    //     default: null
    // },
    // rejected_at: {
    //     type: Date,
    //     default: null
    // },
    // returned: {
    //     type: Boolean,
    //     default: false
    // },
    // deleted_at: {
    //     type: Date,
    //     default: null
    // },
  },
  { timestamps: true }
);

const User = mongoose.model("package", ParcelSchema);
module.exports = User;
