const Order = require('../models/dborders');
const Product = require('../models/dbproduct');
const mongoose = require('mongoose');

exports.get_orders_all = (req, res) => {
  Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then((docs) => {
      res.status(201).json({
        count: docs.length,
        orders: docs.map(data => ({
          id: data._id,
          product: data.product,
          quantity: data.quantity,
          request: {
            type: 'GET',
            url: `http://localhost:3000/orders/${data._id}`,
          },
        })),
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};
exports.post_order_add = (req, res) => {
  Product.findById(req.body.productId)
    .then(() => {
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity,
      });
      return order.save();
    })
    .then(result => res.status(201).json({
      message: 'Orders Store',
      createOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity,
      },
      request: {
        type: 'POST',
        url: `http://localhost:3000/orders/${result._id}`,
      },
    }))
    .catch(err => res.status(500).json({ error: err }));
};
exports.get_order_byId = (req, res) => {
  const { id } = req.params;
  Order.findById(id)
    .populate('product')
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(201).json(doc);
      } else {
        res.status(500).json({ message: 'No valid entry found provided ID' });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};
exports.delete_order_byId = (req, res) => {
  Order.findOneAndRemove({ _id: req.params.id })
    .exec()
    .then(() => res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'GET',
        url: 'http://localhost:3000/orders/',
        body: { productId: 'ID', quantity: 'Number' },
      },
    }))
    .catch(err => res.status(500).json({ error: err }));
};
