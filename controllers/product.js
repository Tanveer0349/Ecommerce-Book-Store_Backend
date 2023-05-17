const _ = require("lodash");
const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const mongoose=require('mongoose');
const ObjectId=mongoose.Schema.Types.ObjectId;

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).send("Could not create product");
    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send("All fields are required");
    }

    let product = new Product(fields);
    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).send("image size should be less than 1 mb");
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.type;
    }

    try {
      await product.save();
      res.send(product);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
};

exports.read = async (req, res) => {
  const product = await Product.findById(req.params.productId).populate(
    "category"
  );
  if (!product) return res.status(400).send("product not found");
  product.photo = undefined;
  res.send(product);
};
exports.remove = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.productId);
    return res.status(200).send("product deleted successfully");
  } catch (err) {
    return res.status(404).send("product is not available");
  }
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).send("Could not create product");
    const { name, description, price, category, quantity } = fields;

    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    let product = await Product.findById(req.params.productId);
    product = _.extend(product, fields);
    if (files.photo) {
      if (files.photo.size > 1000000)
        return res.status(400).send("image size should be less than 1 mb");
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.contentType = files.photo.type;
    }
    product = await product.save();
    res.send(product);
  });
};

exports.getProducts = async (req, res) => {
  const order = req.query.order ? req.query.order : "asc";
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const limit = req.query.limit ? req.query.limit : 6;

  const products = await Product.find()
    .populate("category")
    .select("-photo")
    .sort([[sortBy, order]])
    .limit(limit);
  if (!products) return res.status(400).send("products not found");
  res.send(products);
};

exports.getRelatedProducts = async (req, res) => {
  const order = req.query.order ? req.query.order : "asc";
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const limit = req.query.limit ? req.query.limit : 6;
  const product = await Product.findById(req.params.productId);

  const products = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .populate("category")
    .select("-photo")
    .sort([[sortBy, order]])
    .limit(limit);
  if (!products) return res.status(400).send("products not found");
  res.send(products);
};

// exports.listProductCategories = (req, res) => {
//   Product.distinct('category', {}, (err, categories) => {
//       if (err) {
//           return res.status(400).json({
//               error: 'Categories not found'
//           });
//       }
//       res.json(categories);
//   });
// };

// * list products by search
// * we will implement product search in react frontend
// * we will show categories in checkbox and price range in radio buttons
// * as the user clicks on those checkbox and radio buttons
// * we will make api request and show the products to users based on what he wants
// *

exports.listBySearch = async (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = req.body.skip;
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  const products = await Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit);
  if (!products) return res.status(400).send("No product found");
  res.send(products);
};

exports.photo = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  if (product.photo.data) {
    res.set("Content-Type", product.photo.contentType);
    return res.send(product.photo.data);
  }
  next();
};

exports.listSearch = async (req, res) => {
  const query = {};
  console.log(req.query);
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.category && req.query.category != "All") {
    query.category = req.query.category;
  }
  try {
    const products = await Product.find(query)
      .select("-photo")
    if (!products) return res.status(400).send("No product found");
    res.send(products);
  } catch (err) {
    console.log(err);
  }
};

 

