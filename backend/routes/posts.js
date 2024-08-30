const express = require('express');
const multer = require('multer')
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/post-controller");
const router = express.Router();

const MIME_TYPE = {
"image/jpeg": 'jpg',
"image/jpg": 'jpg',
"image/png": 'png'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let err = new Error("Invalid mime type");
    if (isValid) {
      err = null;
    }
    cb(err, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE[file.mimetype];
    cb(null, name + '-'+Date.now() + '.' + ext);
  }
})

router.post("", checkAuth, multer({storage: storage}).single('image'), PostController.post);

router.get( "", PostController.get);

router.get("/:id", checkAuth, PostController.getPost);

router.put("/:id", checkAuth, multer({storage: storage}).single('image'), PostController.update);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;