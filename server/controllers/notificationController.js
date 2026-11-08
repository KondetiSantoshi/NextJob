const Notification = require('../models/Notification');

// @desc Get user notifications
// @route GET /api/notifications
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar');

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Mark notification as read
// @route PUT /api/notifications/:id/read
exports.markAsRead = async (req, res, next) => {
  try {
    if (req.params.id === 'all') {
      await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
      return res.status(200).json({ success: true, message: 'All notifications marked as read' });
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (notification) {
      notification.read = true;
      await notification.save();
    }

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error) {
    next(error);
  }
};
