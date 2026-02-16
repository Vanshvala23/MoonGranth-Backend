import Product from "../models/Products.js";

/* GET ALL PRODUCTS */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET SINGLE PRODUCT */
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CREATE PRODUCT */
export const addProduct = async (req, res) => {
  try {
    const { name, category, price, description, images, stock, isNew } = req.body;

    if (!name || !category || !price)
      return res.status(400).json({ message: "Required fields missing" });

    const product = await Product.create({
      name,
      category,
      price,
      description,
      images: images || [],  // Default to empty array if not provided
      stock: stock || 0,     // Default to 0 if not provided
      isNew: isNew || false,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE PRODUCT */
export const updateProduct = async (req, res) => {
  try {
    const { name, category, price, description, images, stock, isNew } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Update fields
    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (description !== undefined) product.description = description;
    if (images) product.images = images;
    if (stock !== undefined) product.stock = stock;
    if (isNew !== undefined) product.isNew = isNew;

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE PRODUCT */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};