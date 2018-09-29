const express = require('express');

const router = express.Router();
const UserController = require('../controller/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.signup);
router.route('/').get(checkAuth, UserController.get_user_all);
router.delete('/:id', checkAuth, UserController.delete_user_byId);
router.post('/login', UserController.login);
module.exports = router;
