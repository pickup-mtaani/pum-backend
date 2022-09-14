const router = require("express").Router();
const { request } = require("express");
var Conversation = require('models/conversation.model')
const Message = require("models/messages.model");
var { authMiddleware, authorized } = require('middlewere/authorization.middlewere');
router.post('/conversation', [authMiddleware, authorized], async (req, res) => {

  try {
    let conversationId
    const exists = await Conversation.findOne({
      "members": {
        $all: [
          req.user._id, req.body.recieverId
        ]
      }
    })

    if (exists) {
      conversationId = exists._id
      await Conversation.findOneAndUpdate({ _id: exists._id }, { updated_at: new Date() }, { new: true, useFindAndModify: false })
      await new Message({ conversationId, sender: req.user._id, text: req.body.text }).save()
      return res.status(200).json(exists)
    } else {
      const newConversation = new Conversation({
        members: [req.user._id, req.body.recieverId]
      });

      const savedConversation = await newConversation.save()
      conversationId = savedConversation._id
      await new Message({ conversationId, sender: req.user._id, text: req.body.text }).save()
      return res.status(200).json(savedConversation)

    }

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
      createdAt: { $gte: startOfToday }
    }).populate('members', "f_name l_name name").sort({ createdAt: -1 })
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
    }).populate('sender').sort({ createdAt: -1 })
    res.status(200).json(Messages)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
});
module.exports = router;