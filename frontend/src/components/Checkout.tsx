import { useCart } from "../contextApi/CartContext";

const Checkout = () => {
  const { cartItems, menuItems, updateCart } = useCart();

  const handleIncrement = (menuId: string) => {
    updateCart(menuId, 1); // Increment quantity by 1
  };

  const handleDecrement = (menuId: string) => {
    updateCart(menuId, -1); // Decrement quantity by 1
  };

   


  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
      <div className="w-full md:w-3/4 lg:w-2/3 mx-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">Image</th>
              <th className="border border-gray-200 p-2">Description</th>
              <th className="border border-gray-200 p-2">Quantity</th>
              <th className="border border-gray-200 p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((cartItem) => {
              const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
              return item ? (
                <tr key={cartItem.menuId}>
                  <td className="border border-gray-200 p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="border border-gray-200 p-2">
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </td>
                  <td className="border border-gray-200 p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDecrement(cartItem.menuId)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        disabled={cartItem.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-lg">{cartItem.quantity}</span>
                      <button
                        onClick={() => handleIncrement(cartItem.menuId)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-200 p-2 text-right">
                    ${(cartItem.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ) : null;
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="border border-gray-200 p-2 text-right font-bold">
                Total Price
              </td>
              <td className="border border-gray-200 p-2 text-right font-bold">
                ${cartItems
                  .reduce((total, cartItem) => {
                    const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
                    return item ? total + cartItem.quantity * item.price : total;
                  }, 0)
                  .toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Checkout;
