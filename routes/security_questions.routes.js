const router = require("express").Router();
var _ = require("lodash");

const {
  authMiddleware,
  authorized,
} = require("middlewere/authorization.middlewere");
const Question = require("../models/security_question");

// fetch all withdrawals by admin
router.post("/", [authMiddleware, authorized], async (req, res) => {
  try {
    const { question } = req?.body;

    const newQuiz = await new Question({ question }).save();

    return res.status(200).json(newQuiz);
  } catch (error) {
    console.log("SECURITY QUESTION CREATION ERROR: ", error);
    res?.status(400).json(error?.message);
  }
});
router.get("/", [authMiddleware, authorized], async (req, res) => {
  try {
    const questions = await Question.find();

    return res.status(200).json(questions);
  } catch (error) {
    console.log("SECURITY QUESTION FETCH ERROR: ", error);
    res?.status(400).json(error?.message);
  }
});
router.delete("/:id", [authMiddleware, authorized], async (req, res) => {
  try {
    const { id } = req?.params;

    const toDeleteQuiz = await Question.findByIdAndDelete(id);

    return res.status(200).json(toDeleteQuiz);
  } catch (error) {
    console.log("SECURITY QUESTION DELETE ERROR: ", error);
    res?.status(400).json(error?.message);
  }
});

module.exports = router;
