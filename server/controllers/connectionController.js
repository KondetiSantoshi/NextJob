const Connection = require('../models/Connection');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc Get current user's connections and pending requests
// @route GET /api/connections
exports.getConnections = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Accepted connections
    const accepted = await Connection.find({
      $or: [
        { requester: userId, status: 'accepted' },
        { recipient: userId, status: 'accepted' },
      ],
    })
      .populate('requester', 'name avatar headline location role company')
      .populate('recipient', 'name avatar headline location role company');

    const connectionsList = accepted.map((c) => {
      return c.requester._id.toString() === userId.toString() ? c.recipient : c.requester;
    });

    // Received pending requests
    const pendingReceived = await Connection.find({
      recipient: userId,
      status: 'pending',
    }).populate('requester', 'name avatar headline location role company');

    // Sent pending requests
    const pendingSent = await Connection.find({
      requester: userId,
      status: 'pending',
    }).populate('recipient', 'name avatar headline location role company');

    res.status(200).json({
      success: true,
      connections: connectionsList,
      pendingReceived,
      pendingSent,
      counts: {
        totalConnections: connectionsList.length,
        pendingRequests: pendingReceived.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Send connection request
// @route POST /api/connections/request/:recipientId
exports.sendRequest = async (req, res, next) => {
  try {
    const recipientId = req.params.recipientId;

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot connect with yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let connection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
    });

    if (connection) {
      if (connection.status === 'accepted') {
        return res.status(400).json({ success: false, message: 'Already connected' });
      }
      if (connection.status === 'pending') {
        return res.status(400).json({ success: false, message: 'Connection request is already pending' });
      }
    }

    connection = await Connection.create({
      requester: req.user._id,
      recipient: recipientId,
      status: 'pending',
    });

    // Notify recipient
    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${req.user.name} sent you a connection request.`,
      link: '/network',
    });

    res.status(201).json({
      success: true,
      connection,
      message: 'Connection request sent',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Respond to connection request (accept / reject)
// @route PUT /api/connections/:id/respond
exports.respondRequest = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ success: false, message: 'Connection request not found' });
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to respond' });
    }

    if (action === 'accept') {
      connection.status = 'accepted';
      await connection.save();

      // Notify requester
      await Notification.create({
        recipient: connection.requester,
        sender: req.user._id,
        type: 'connection_request',
        title: 'Connection Accepted',
        message: `${req.user.name} accepted your connection request.`,
        link: '/network',
      });

      return res.status(200).json({
        success: true,
        message: 'Connection accepted',
      });
    } else {
      await connection.deleteOne();
      return res.status(200).json({
        success: true,
        message: 'Connection request declined',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get suggested professionals to connect
// @route GET /api/connections/suggestions
exports.getSuggestedConnections = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get all existing connections or pending requests
    const existing = await Connection.find({
      $or: [{ requester: userId }, { recipient: userId }],
    });

    const excludedIds = existing.map((c) =>
      c.requester.toString() === userId.toString() ? c.recipient : c.requester
    );
    excludedIds.push(userId);

    const suggestions = await User.find({
      _id: { $nin: excludedIds },
      isActive: true,
    })
      .select('name avatar headline location role company')
      .populate('company', 'name')
      .limit(10);

    res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
};
