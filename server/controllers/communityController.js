const CommunityTopic = require('../models/CommunityTopic');
const CommunityAnswer = require('../models/CommunityAnswer');
const Notification = require('../models/Notification');

// @desc Get community topics
// @route GET /api/community/topics
exports.getTopics = async (req, res, next) => {
  try {
    const { category, q, sort = 'newest', page = 1, limit = 15 } = req.query;

    const query = { isFlagged: false };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { viewsCount: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const topics = await CommunityTopic.find(query)
      .populate('author', 'name avatar headline role')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    // Get answers count for each topic
    const topicIds = topics.map((t) => t._id);
    const answersCounts = await CommunityAnswer.aggregate([
      { $match: { topic: { $in: topicIds } } },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    answersCounts.forEach((a) => {
      countMap[a._id.toString()] = a.count;
    });

    const enriched = topics.map((t) => {
      const obj = t.toObject();
      obj.answersCount = countMap[obj._id.toString()] || 0;
      obj.isUpvoted = req.user ? t.upvotes.includes(req.user._id) : false;
      return obj;
    });

    const total = await CommunityTopic.countDocuments(query);

    res.status(200).json({
      success: true,
      topics: enriched,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      currentPage: pageNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single topic by ID with answers
// @route GET /api/community/topics/:id
exports.getTopicById = async (req, res, next) => {
  try {
    const topic = await CommunityTopic.findById(req.params.id).populate('author', 'name avatar headline role');

    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    topic.viewsCount = (topic.viewsCount || 0) + 1;
    await topic.save();

    const answers = await CommunityAnswer.find({ topic: topic._id })
      .populate('author', 'name avatar headline role')
      .sort({ isAccepted: -1, upvotes: -1, createdAt: 1 });

    const enrichedAnswers = answers.map((a) => {
      const obj = a.toObject();
      obj.isUpvoted = req.user ? a.upvotes.includes(req.user._id) : false;
      return obj;
    });

    const isUpvoted = req.user ? topic.upvotes.includes(req.user._id) : false;

    res.status(200).json({
      success: true,
      topic: { ...topic.toObject(), isUpvoted },
      answers: enrichedAnswers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create a new community question / topic
// @route POST /api/community/topics
exports.createTopic = async (req, res, next) => {
  try {
    const { category, title, content, tags } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ success: false, message: 'Please provide category, title, and content' });
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const topic = await CommunityTopic.create({
      author: req.user._id,
      category,
      title,
      content,
      tags: parsedTags || [],
    });

    const populated = await CommunityTopic.findById(topic._id).populate('author', 'name avatar headline role');

    res.status(201).json({
      success: true,
      topic: populated,
      message: 'Discussion topic created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Answer / reply to topic
// @route POST /api/community/topics/:id/answers
exports.answerTopic = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Answer content cannot be empty' });
    }

    const topic = await CommunityTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const answer = await CommunityAnswer.create({
      topic: topic._id,
      author: req.user._id,
      content,
    });

    // Notify question author
    if (topic.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: topic.author,
        sender: req.user._id,
        type: 'system',
        title: 'New Community Answer',
        message: `${req.user.name} answered your discussion: "${topic.title.slice(0, 40)}..."`,
        link: `/community`,
      });
    }

    const populated = await CommunityAnswer.findById(answer._id).populate('author', 'name avatar headline role');

    res.status(201).json({
      success: true,
      answer: { ...populated.toObject(), isUpvoted: false },
      message: 'Your answer has been posted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Upvote or remove upvote on topic
// @route POST /api/community/topics/:id/upvote
exports.toggleUpvoteTopic = async (req, res, next) => {
  try {
    const topic = await CommunityTopic.findById(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }

    const index = topic.upvotes.indexOf(req.user._id);
    let isUpvoted = false;

    if (index > -1) {
      topic.upvotes.splice(index, 1);
    } else {
      topic.upvotes.push(req.user._id);
      isUpvoted = true;
    }

    await topic.save();

    res.status(200).json({
      success: true,
      isUpvoted,
      upvotesCount: topic.upvotes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Upvote answer
// @route POST /api/community/answers/:id/upvote
exports.toggleUpvoteAnswer = async (req, res, next) => {
  try {
    const answer = await CommunityAnswer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ success: false, message: 'Answer not found' });
    }

    const index = answer.upvotes.indexOf(req.user._id);
    let isUpvoted = false;

    if (index > -1) {
      answer.upvotes.splice(index, 1);
    } else {
      answer.upvotes.push(req.user._id);
      isUpvoted = true;
    }

    await answer.save();

    res.status(200).json({
      success: true,
      isUpvoted,
      upvotesCount: answer.upvotes.length,
    });
  } catch (error) {
    next(error);
  }
};
