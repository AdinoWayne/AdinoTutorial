const Product = require('../models/dbproduct');
const mongoose = require('mongoose');

exports.get_product_all = (req, res) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        product: docs.map(data => ({
          name: data.name,
          price: data.price,
          productImage: data.productImage,
          _id: data._id,
          request: {
            type: 'GET',
            url: `http://localhost:3000/product/${data._id}`,
          },
        })),
      };
      res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ error: err }));
};
exports.post_product_add = (req, res) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product.save()
    .then((result) => {
      res.status(201).json({
        message: 'Created product succesfully',
        createProduct: result,
      });
    })
    .catch(err => res.status(500).json({ error: err }));
};
exports.get_product_byId = (req, res) => {
  const { id } = req.params;
  Product.findById(id)
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(500).json({ message: 'No valid entry found provided ID' });
      }
    })
    .catch(err => res.status(500).json({ error: err }));
};
exports.patch_product_byId = (req, res) => {
  const { id } = req.params;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  // {name: req.body.newName, price: req.body.newPrice }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err }));
};
exports.delete_product_byId = (req, res) => {
  const { id } = req.params;
  Product.findOneAndRemove({ _id: id })
    .exec()
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json({ error: err }));
};
