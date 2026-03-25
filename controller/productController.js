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
    const { name, category, price, description, stock, isNew } = req.body;

    if (!name || !category || !price)
      return res.status(400).json({ message: "Required fields missing" });

    // req.files is populated by upload.array("images") in the route
    const imageUrls = req.files?.map((file) => file.path) || [];

    const product = await Product.create({
      name,
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

/* UPDATE PRODUCT — optionally replace images */
export const updateProduct = async (req, res) => {
  try {
    const { name, category, price, description, stock, isNew } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // If new images uploaded → delete old ones from Cloudinary, replace with new
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const imageUrl of product.images) {
        // Extract public_id from URL  e.g. "uploads/abc123"
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      product.images = req.files.map((file) => file.path);
    }

    if (name)                        product.name        = name;
    if (category)                    product.category    = category;
    if (price)                       product.price       = price;
    if (description !== undefined)   product.description = description;
    if (stock !== undefined)         product.stock       = stock;
    if (isNew !== undefined)         product.isNew       = isNew;

    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE PRODUCT — also removes images from Cloudinary */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete all associated images from Cloudinary
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