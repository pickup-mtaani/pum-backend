const router = require("express").Router();
const { request } = require("express");
var Conversation = require('models/conversation.model')
const Message = require("models/messages.model");
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
router.post('/conversation', [authMiddleware, authorized], async (req, res) => {

  try {
    const exists = await Conversation.findOne({ _id: req.body.conversation_id })
    await Conversation.findOneAndUpdate({ _id: exists._id }, { updated_at: new Date(), last_message: req.body.text }, { new: true, useFindAndModify: false })
    await new Message({ conversationId: exists._id, sender: req.user._id, text: req.body.text }).save()
    return res.status(200).json(exists)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});
router.get('/conversations', [authMiddleware, authorized], async (req, res) => {
  try {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const Conversations = await Conversation.find({
      members: { $in: [req.user._id] },
      // createdAt: { $gte: startOfToday }
    }).populate('members', "f_name l_name name").sort({ createdAt: 1 })
    res.status(200).json(Conversations)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});
router.get('/messages/:id', [authMiddleware, authorized], async (req, res) => {
  try {
    const Messages = await Message.find({
      conversationId: req.params.id
    }).populate('sender').sort({ createdAt: 1 })
    res.status(200).json(Messages)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});

router.post('/conversations/search', async (req, res) => {

  var word = req.query.word
  var searchKey = new RegExp(`${word}`, 'i')
  Conversation.find({ title: searchKey }, function (err, note) {
    if (note) {
      return res.status(200).json({ success: true, message: 'note  retrieved successfully ', note });
    }
  });
})
module.exports = router;