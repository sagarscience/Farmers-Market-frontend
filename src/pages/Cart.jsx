import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const [selected, setSelected] = useState([]);

  const handleCheckbox = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const removeSelected = () => {
    if (selected.length === 0) return;
    if (window.confirm("Remove selected items?")) {
      selected.forEach((id) => removeFromCart(id));
      setSelected([]);
      toast.info("Selected items removed.");
    }
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.warn("Item removed from cart.");
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      toast.error("Cart cleared.");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-green-50 px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          🛒 Your Cart
        </h2>

        {cart.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="border border-gray-200 p-4 rounded-md bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(item._id)}
                      onChange={() => handleCheckbox(item._id)}
                      className="h-5 w-5 mt-1"
                    />

                    {/* Product Image */}
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded shadow"
                      />
                    )}

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-green-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      <p className="text-sm mt-1 font-medium text-gray-800">
                        ₹{item.price} × {item.quantity} ={" "}
                        <span className="font-bold">
                          ₹{item.price * item.quantity}
                        </span>
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            const newQty = item.quantity - 1;
                            if (newQty <= 0) {
                              handleRemove(item._id);
                            } else {
                              updateQuantity(item._id, newQty);
                            }
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          −
                        </button>

                        <span className="w-10 text-center font-semibold text-gray-800">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => {
                            if (item.quantity < item.stock) {
                              updateQuantity(item._id, item.quantity + 1);
                            } else {
                              toast.warn("Cannot exceed available stock.");
                            }
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm text-gray-500 mt-1">
                        In stock: {item.stock}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm mt-4 sm:mt-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xl font-semibold text-green-900">
                Total: ₹{total}
              </p>
              <div className="flex gap-4 flex-wrap">
                <button
                  onClick={removeSelected}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Remove Selected
                </button>
                <button
                  onClick={handleClearCart}
                  className="bg-red-700 hover:bg-gray-500 text-white px-4 py-2 rounded"
                >
                  🗑 Clear Cart
                </button>
                <Link
                  to="/checkout"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                  ✅ Checkout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
