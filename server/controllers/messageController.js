const Message = require('../models/Message');
const User = require('../models/User');

// @desc Get active conversations
// @route GET /api/messages/conversations
exports.getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar headline role')
      .populate('recipient', 'name avatar headline role');

    const conversationMap = {};

    messages.forEach((msg) => {
      const partner = msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
      if (!partner) return;

      const partnerId = partner._id.toString();
      if (!conversationMap[partnerId]) {
        conversationMap[partnerId] = {
          user: partner,
          lastMessage: msg.content,
          lastMessageDate: msg.createdAt,
          unreadCount: 0,
        };
      }

      if (msg.recipient._id.toString() === userId.toString() && !msg.read) {
        conversationMap[partnerId].unreadCount += 1;
      }
    });

    const conversations = Object.values(conversationMap);

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get chat messages with a specific user
// @route GET /api/messages/:userId
exports.getMessagesWithUser = async (req, res, next) => {
  try {
    const currentUserId = req.user._id;
    const partnerId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, recipient: partnerId },
        { sender: partnerId, recipient: currentUserId },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar');

    // Mark partner's messages as read
    await Message.updateMany(
      { sender: partnerId, recipient: currentUserId, read: false },
      { read: true }
    );

    const partner = await User.findById(partnerId).select('name avatar headline role company location');

    res.status(200).json({
      success: true,
      partner,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Send a message
// @route POST /api/messages/:userId
exports.sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user._id;
    const recipientId = req.params.userId;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty' });
    }

    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content,
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar')
      .populate('recipient', 'name avatar');

    res.status(201).json({
      success: true,
      message: populated,
    });
  } catch (error) {
    next(error);
  }
};
