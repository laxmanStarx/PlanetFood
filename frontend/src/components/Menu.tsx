
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faPlus, faMinus, faBagShopping, faTimes, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../contextApi/CartContext";

interface MenuItem {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Menu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const { menuItems, setMenuItems, cartItems, addToCart, updateQuantity } = useCart();
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`${backendUrl}/menu/${restaurantId}`);
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };
    fetchMenuItems();
  }, [restaurantId, setMenuItems]);

  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % menuItems.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1));

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, cartItem) => {
      const item = menuItems.find((m) => m.id === cartItem.menuId);
      return item ? total + cartItem.quantity * item.price : total;
    }, 0);
  };

  if (error) return <div className="p-20 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa] pb-32">
      {/* 1. KINETIC HERO CAROUSEL */}
      <section className="relative h-[50vh] w-full overflow-hidden bg-black">
        {menuItems.length > 0 && (
          <>
            <img 
              src={menuItems[currentIndex]?.image} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 blur-sm scale-110 transition-all duration-1000"
              alt="bg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9fa] via-transparent to-black/40" />
            
            <div className="relative z-10 flex items-center justify-between h-full px-4 md:px-20">
              <button onClick={handlePrev} className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all">
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              
              <div className="text-center text-white animate-in fade-in zoom-in duration-700">
                <span className="bg-orange-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Chef's Choice</span>
                <h1 className="text-4xl md:text-6xl font-black mt-4 drop-shadow-lg">{menuItems[currentIndex]?.name}</h1>
                <p className="mt-2 text-white/80 max-w-md mx-auto hidden md:block italic">"{menuItems[currentIndex]?.description}"</p>
              </div>

              <button onClick={handleNext} className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all">
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </>
        )}
      </section>

      {/* 2. MENU GRID - TRENDING STYLE */}
      <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => {
            const quantity = cartItems.find(c => c.menuId === item.id)?.quantity || 0;
            
            return (
              <div key={item.id} className="group bg-white rounded-[2.5rem] p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-2xl transition-all duration-500 border border-gray-100">
                <div className="relative h-56 w-full rounded-[2rem] overflow-hidden mb-6">
                  <img 
                    src={item.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer" 
                    onClick={() => setSelectedFood(item)}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1 rounded-full font-black text-sm">
                    ₹{item.price}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(0, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-red-500 shadow-sm hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span className="font-black text-lg w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => addToCart(item.id, item.name, item.image, item.price, 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-black text-white shadow-sm hover:bg-gray-800 transition-colors"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedFood(item)}
                    className="text-xs font-black uppercase tracking-tighter text-gray-400 hover:text-black"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* 3. FLOATING TRENDING CART BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-black text-white rounded-[2rem] p-4 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-4 ml-2">
              <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center relative">
                <FontAwesomeIcon icon={faBagShopping} />
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                  {cartItems.length}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-black text-white/50 tracking-widest">Total Payable</p>
                <p className="text-xl font-black">₹{calculateTotalPrice().toFixed(2)}</p>
              </div>
            </div>

            <button 
              onClick={() => navigate("/checkout")}
              className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95"
            >
              Checkout Now
            </button>
          </div>
        </div>
      )}

      {/* 4. DETAILS MODAL */}
      {selectedFood && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/40" onClick={() => setSelectedFood(null)}>
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedFood(null)} className="absolute top-6 right-6 z-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <img src={selectedFood.image} className="w-full h-72 object-cover" />
            <div className="p-8">
              <h2 className="text-3xl font-black text-gray-900">{selectedFood.name}</h2>
              <p className="mt-4 text-gray-500 leading-relaxed font-medium">{selectedFood.description}</p>
              <div className="mt-8 flex items-center justify-between">
                <span className="text-2xl font-black">₹{selectedFood.price}</span>
                <button 
                  onClick={() => {
                    addToCart(selectedFood.id, selectedFood.name, selectedFood.image, selectedFood.price, 1);
                    setSelectedFood(null);
                  }}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest"
                >
                  Quick Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;




































// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useEffect, useState } from "react";
// import { faPlus, faMinus, faBagShopping, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { useNavigate, useParams } from "react-router-dom";
// import { useCart } from "../contextApi/CartContext";

// interface MenuItem {
//   id: string;
//   image: string;
//   name: string;
//   description: string;
//   price: number;
// }

// const backendUrl = import.meta.env.VITE_BACKEND_URL;

// const Menu = () => {
//   const { restaurantId } = useParams<{ restaurantId: string }>();
//   const { menuItems, setMenuItems } = useCart();
//   const { cartItems, addToCart, updateQuantity } = useCart();
//   const [navbarVisible, setNavbarVisible] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);

//   useEffect(() => {
//     const fetchMenuItems = async () => {
//       try {
//         const response = await fetch(`${backendUrl}/menu/${restaurantId}`);
//         if (!response.ok) throw new Error("Failed to fetch menu items");
//         const data = await response.json();
//         setMenuItems(data);
//       } catch (err: any) {
//         setError(err.message || "Something went wrong");
//       }
//     };

//     fetchMenuItems();
//   }, [restaurantId]);

//   const handleAddToCart = (menuId: string, name: string, image: string, price: number) => {
//     addToCart(menuId, name, image, price, 1);
//     setNavbarVisible(true);
//   };

//   const handleDecreaseQuantity = (menuId: string) => {
//     const item = cartItems.find((item) => item.menuId === menuId);
//     if (item && item.quantity > 1) {
//       updateQuantity(menuId, item.quantity - 1);
//       setNavbarVisible(true);
//     } else {
//       updateQuantity(menuId, 0);
//       setNavbarVisible(false);
//     }
//   };

//   const calculateTotalPrice = (): number => {
//     return cartItems.reduce((total, cartItem) => {
//       const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
//       return item ? total + cartItem.quantity * item.price : total;
//     }, 0);
//   };












  

//   const navigate = useNavigate();
//   const handleCheckout = () => {
//     navigate("/checkout");
//   };

//   if (error) {
//     return <p className="text-red-500">{error}</p>;
//   }

//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center justify-center text-center">
//       <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>
//       <div className="w-full md:w-3/4 lg:w-2/3 divide-y divide-gray-300 justify-center pb-20">
//         {menuItems.map((item) => (
//           <div key={item.id} className="flex flex-col md:flex-row items-center md:items-start py-6 space-y-4 md:space-y-0">
//             {/* Food Description */}
//             <div className="flex-1 text-left md:pr-4">
//               <h2 className="text-xl md:text-2xl font-bold text-gray-800">{item.name}</h2>
//               <p className="text-gray-600 mt-2">{item.description}</p>
//               <p className="text-lg font-bold text-gray-800 mt-4">Rs {item.price.toFixed(2)}</p>
//             </div>
//             {/* Food Image */}
//             <div className="relative w-40 h-40">
//               <img
//                 src={item.image}
//                 alt={item.name}
//                 className="w-full h-full object-cover border border-gray-200 rounded-lg cursor-pointer"
//                 onClick={() => setSelectedFood(item)}
//               />
//               <FontAwesomeIcon
//                 icon={faPlus}
//                 className="absolute bottom-2 left-2 text-green-500 bg-slate-50 rounded-2xl text-2xl cursor-pointer"
//                 onClick={() => handleAddToCart(item.id, item.name, item.image, item.price)}
//               />
//               <div>{cartItems.find((cartItem) => cartItem.menuId === item.id)?.quantity || 0}</div>
//               <FontAwesomeIcon
//                 icon={faMinus}
//                 className="absolute bottom-2 right-2 text-red-500 bg-slate-50 rounded-3xl text-2xl cursor-pointer"
//                 onClick={() => handleDecreaseQuantity(item.id)}
//               />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Navbar Cart Summary */}
//       {navbarVisible && (
//         <div className="fixed bottom-0 w-full bg-green-500 text-white p-4 z-50">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               {cartItems.map((cartItem) => {
//                 const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
//                 return item ? (
//                   <div key={cartItem.menuId} className="flex items-center space-x-4">
//                     <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-lg" />
//                     <div className="text-sm">{item.name}</div>
//                     <div className="text-sm">Rs {cartItem.quantity * item.price}</div>
//                   </div>
//                 ) : null;
//               })}
//             </div>
//             <div className="flex justify-end text-end mx-3 space-x-4 p-4 px-5 cursor-pointer">
//               <FontAwesomeIcon icon={faBagShopping} />
//               <button onClick={handleCheckout}>Submit</button>
//             </div>
//             <div className="text-lg font-bold">Total: Rs {calculateTotalPrice().toFixed(2)}</div>
//           </div>
//         </div>
//       )}

//       {/* Modal for Food Details */}
//       {selectedFood && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//           onClick={() => setSelectedFood(null)}
//         >
//           <div
//             className= " bg-slate-50 p-6 rounded-lg shadow-lg shadow-cyan-900 max-w-md text-center"
//             onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
//           >
//             <button
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//               onClick={() => setSelectedFood(null)}
//             >
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//             <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-64 object-cover rounded-lg" />
//             <h2 className="text-2xl font-bold mt-4">{selectedFood.name}</h2>
//             <p className="text-gray-600 mt-2">{selectedFood.description}</p>
//             <p className="text-lg font-bold mt-4">Rs {selectedFood.price.toFixed(2)}</p>
//             <button
//               className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
//               onClick={() => {
//                 handleAddToCart(selectedFood.id, selectedFood.name, selectedFood.image, selectedFood.price);
//                 setSelectedFood(null);
//               }}
//             >
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Menu;











