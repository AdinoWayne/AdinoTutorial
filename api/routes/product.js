const express = require('express');

const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controller/product');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + file.originalname);
  },
});
  // const fileFilter = ((req, file, cb) => {
  //   if (file.minetype === 'image/png' || file.minetype === 'image/jpg') {
  //     cb(null, true);
  //   } else {
  //     cb(null, false);
  //   }
  // });
const upload = multer({ storage });
router.route('/').get(checkAuth, ProductController.get_product_all);
router.post('/', checkAuth, upload.single('productImage'), ProductController.post_product_add);
router.route('/:id').get(checkAuth, ProductController.get_product_byId);
router.route('/:id').patch(checkAuth, ProductController.patch_product_byId);
router.route('/:id').delete(checkAuth, ProductController.delete_product_byId);
module.exports = router;
