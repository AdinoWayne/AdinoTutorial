const express = require('express');

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controller/order');

router.route('/').get(checkAuth, OrderController.get_orders_all);
router.route('/').post(checkAuth, OrderController.post_order_add);
router.route('/:id').get(checkAuth, OrderController.get_order_byId);
router.route('/:id').delete(checkAuth, OrderController.delete_order_byId);
module.exports = router;
