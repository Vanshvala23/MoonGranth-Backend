import Product from "../models/Products.js";
import cloudinary from "../config/cloudinary.js";

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
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CREATE PRODUCT */
export const addProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, isNew, images } = req.body;

    if (!name || !category || !price)
      return res.status(400).json({ message: "Required fields missing" });

    // Support both: file upload (multipart) OR raw JSON images array
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => file.path);  // Cloudinary URLs from upload
    } else if (images) {
      imageUrls = Array.isArray(images) ? images : [images]; // raw JSON array or single string
    }

    // Check if product already exists
    const existingProduct = await Product.findOne({ name: name.trim() });
    if (existingProduct)
      return res.status(409).json({ message: `Product "${name}" already exists` });

    const product = await Product.create({
      name: name.trim(),
      category,
      price,
      description,
      images: imageUrls,
      stock: stock || 0,
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
    const { name, category, price, description, stock, isNew, images } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Handle images: file upload takes priority, then JSON array, then keep existing
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary before replacing
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      product.images = req.files.map((file) => file.path);
    } else if (images) {
      // Raw JSON images array provided (e.g. from Postman raw JSON)
      product.images = Array.isArray(images) ? images : [images];
    }
    // else: no images provided → keep existing ones

    if (name !== undefined)          product.name        = name.trim();
    if (category !== undefined)      product.category    = category;
    if (price !== undefined)         product.price       = price;
    if (description !== undefined)   product.description = description;
    if (stock !== undefined)         product.stock       = stock;
    if (isNew !== undefined)         product.isNew       = isNew;

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
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const imageUrl of product.images) {
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};