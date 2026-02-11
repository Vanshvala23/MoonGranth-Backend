import Orders from "../models/Orders.js";
import Cart from "../models/Cart.js";

/* CREATE ORDER FROM CART */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const cartItems = await Cart.find({ user: userId }).populate("product");

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order = await Orders.create({
      user: userId,
      items: cartItems,
      totalAmount: total,
      status: "Pending",
    });

    // Clear cart
    await Cart.deleteMany({ user: userId });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET ALL ORDERS (ADMIN) */
export const getOrders = async (req, res) => {
  try {
    const orders = await Orders.find().populate("user");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* GET SINGLE ORDER */
export const getOrderById = async (req, res) => {
  try {
    const order = await Orders.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE ORDER */
export const updateOrder = async (req, res) => {
  try {
    const order = await Orders.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* DELETE ORDER */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Orders.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
