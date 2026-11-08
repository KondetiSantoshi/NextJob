const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

// @desc Get feed posts
// @route GET /api/posts
exports.getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    const query = { isFlagged: false };

    if (tag) {
      query.tags = tag;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * pageSize;

    const posts = await Post.find(query)
      .populate('author', 'name avatar headline location role company')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // Get comment counts and comments for each post
    const postIds = posts.map((p) => p._id);
    const comments = await Comment.find({ post: { $in: postIds } })
      .populate('author', 'name avatar headline')
      .sort({ createdAt: 1 });

    const commentMap = {};
    comments.forEach((c) => {
      const pid = c.post.toString();
      if (!commentMap[pid]) commentMap[pid] = [];
      commentMap[pid].push(c);
    });

    const enriched = posts.map((post) => {
      const p = post.toObject();
      p.comments = commentMap[p._id.toString()] || [];
      p.commentsCount = p.comments.length;
      p.isLiked = req.user ? post.likes.includes(req.user._id) : false;
      return p;
    });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      posts: enriched,
      total,
      hasMore: skip + posts.length < total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create a post
// @route POST /api/posts
exports.createPost = async (req, res, next) => {
  try {
    const { content, mediaUrl, mediaType, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Content cannot be empty' });
    }

    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    }

    const post = await Post.create({
      author: req.user._id,
      content,
      mediaUrl: mediaUrl || '',
      mediaType: mediaType || (mediaUrl ? 'image' : 'none'),
      tags: parsedTags || [],
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name avatar headline location role company'
    );

    res.status(201).json({
      success: true,
      post: {
        ...populatedPost.toObject(),
        comments: [],
        commentsCount: 0,
        isLiked: false,
      },
      message: 'Post created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Like or unlike post
// @route POST /api/posts/:id/like
exports.toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const index = post.likes.indexOf(req.user._id);
    let isLiked = false;

    if (index > -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(req.user._id);
      isLiked = true;

      // Notify post author if not self
      if (post.author.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'post_like',
          title: 'New Like on your post',
          message: `${req.user.name} liked your post: "${post.content.slice(0, 40)}..."`,
          link: '/network',
        });
      }
    }

    await post.save();

    res.status(200).json({
      success: true,
      isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add comment to post
// @route POST /api/posts/:id/comments
exports.addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment cannot be empty' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content,
    });

    // Notify author if not self
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'post_like',
        title: 'New Comment on your post',
        message: `${req.user.name} commented on your post: "${content.slice(0, 40)}..."`,
        link: '/network',
      });
    }

    const populated = await Comment.findById(comment._id).populate('author', 'name avatar headline');

    res.status(201).json({
      success: true,
      comment: populated,
      message: 'Comment posted',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Share post
// @route POST /api/posts/:id/share
exports.sharePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.sharesCount = (post.sharesCount || 0) + 1;
    await post.save();

    res.status(200).json({
      success: true,
      sharesCount: post.sharesCount,
      message: 'Post shared to your network!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete post
// @route DELETE /api/posts/:id
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
