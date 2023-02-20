var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("security_question", QuizSchema);
