import Cart from "../models/Cart.js";

/* ===== GET LOGGED-IN USER CART ===== */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    res.json(cart || { items: [] }); // always return an object with items
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET CART BY USER ID (ADMIN OR LOGGED USER) ===== */
export const getCartByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Make sure logged-in user can only see their own cart
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    res.json(cart || { items: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== ADD TO CART ===== */
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity: quantity || 1 });
    }

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== REMOVE FROM CART ===== */
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => i.product.toString() !== req.params.productId);

    await cart.save();
    const populatedCart = await cart.populate("items.product");
    res.json(populatedCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
