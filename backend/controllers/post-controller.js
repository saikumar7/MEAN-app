const Post = require('../models/post');

exports.post = (req,res,next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  })

  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...result,
        id: result._id
      }
    })
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Saving post failed'
    })
  })

}

exports.get = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const getQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage) {
    getQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
  getQuery
  .then((documents) => {
    fetchedPosts = documents
    return Post.countDocuments();
  })
  .then((count) => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: fetchedPosts,
      maxCount: count
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Fetching posts failed'
    })
  });
}

exports.update = (req, res, next) => {

  let imagePath = req.body.imagePath;
  console.log(req.file)
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }

  const post = new Post( {
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })

  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then( result => {
    if(result.modifiedCount > 0) {
      res.status(200).json({
        message: 'Update successful'
      })
    } else {
      res.status(401).json({
        message: 'Unauthorized'
      })
    }
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Updating post failed'
    })
  });
}

exports.getPost = (req, res, next) => {
  Post.findById({_id: req.params.id}).then( post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: "Post not found!"
      })
    }
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Fetching post failed'
    })
  })
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then((result) => {
    if(result.deletedCount > 0) {
      res.status(200).json({
        message: 'Delete successful'
      })
    } else {
      res.status(401).json({
        message: 'Unauthorized'
      })
    }
  })
  .catch(err => {
    return res.status(401).json({
      message: 'Deleting post failed'
    })
  })
}