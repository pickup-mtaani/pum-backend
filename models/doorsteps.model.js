var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const RoadsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },

    road: {
      type: Schema.Types.ObjectId,
      ref: "Roads",
    },
    lng: {
      type: Number,
    },
    lat: {
      type: Number,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("doorstep_destinations", RoadsSchema);
