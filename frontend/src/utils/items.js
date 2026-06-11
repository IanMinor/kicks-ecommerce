export const calculateTotalItems = (cartItems) => {
  return cartItems.reduce((acc, item) => acc + item.quantity, 0);
};

export const calculateSubtotal = (cartItems) => {
  return cartItems
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
};
