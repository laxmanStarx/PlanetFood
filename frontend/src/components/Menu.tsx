
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../contextApi/CartContext";


interface MenuItem {
  id: string;
  image: string;
  name: string;
  description: string;
  price: number;
}

const Menu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const  {menuItems, setMenuItems } = useCart();
  // const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { cartItems, addToCart, updateQuantity } = useCart();
  const [navbarVisible, setNavbarVisible] = useState(false); 
  

  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current image index
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`http://localhost:8080/menu/${restaurantId}`);
        if (!response.ok) throw new Error("Failed to fetch menu items");
        const data = await response.json();
        setMenuItems(data);

        // Set carousel images
        const images = data.map((item: MenuItem) => item.image);
        setCarouselImages(images);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchMenuItems();
  }, [restaurantId]);



  
  




  // const handleAddToCart = (menuId: string,) => {
  //   addToCart(menuId,1);
  //   setNavbarVisible(true)
  // };



  const handleAddToCart = (menuId: string, name: string, image: string, price: number) => {
    addToCart(menuId, name, image, price, 1);
    setNavbarVisible(true)
  };







  const handleDecreaseQuantity = (menuId: string) => {
    const item = cartItems.find(item => item.menuId === menuId);
    if (item && item.quantity > 1) {
      updateQuantity(menuId, item.quantity - 1);
      setNavbarVisible(true)
    } else {
      // Remove item if the quantity is 0 or 1 (depending on your logic)
      updateQuantity(menuId, 0); 
      setNavbarVisible(false) // Or remove the item entirely if you prefer
    }
  };





const calculateTotalPrice = (): number => {
  return cartItems.reduce((total, cartItem) => {
    const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
    return item ? total + cartItem.quantity * item.price : total;
  }, 0);
};


const navigate = useNavigate();

const handleCheckout = () => {
  navigate("/checkout");
};











  

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center text-center">
      {/* Carousel */}
      <div className="relative w-full md:w-3/4 lg:w-2/3 mb-8 flex items-center justify-center">
        {/* Side-by-side images */}
        <div className="flex space-x-4 overflow-hidden">
          {carouselImages.slice(currentIndex, currentIndex + 3).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Carousel ${index}`}
              className="w-96 h-64 object-cover rounded-lg shadow-lg"
            />
          ))}
        </div>

       
        <button
          onClick={handlePrevious}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800"
        >
          &#8249;
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md hover:bg-gray-800"
        >
          &#8250;
        </button>
      </div>

      {/* Food Menu */}
      <h1 className="text-3xl font-bold text-center mb-8">Menu</h1>
      <div className="w-full md:w-3/4 lg:w-2/3 divide-y divide-gray-300 justify-center pb-20">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center md:items-start py-6 space-y-4 md:space-y-0"
          >
            {/* Food Description */}
            <div className="flex-1 text-left md:pr-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">{item.name}</h2>
              <p className="text-gray-600 mt-2">{item.description}</p>
              <p className="text-lg font-bold text-gray-800 mt-4">Rs{item.price.toFixed(2)}</p>
            </div>
            {/* Food Image */}


            <div className="relative w-40 h-40">
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-full object-cover border border-gray-200 rounded-lg"
    />
    <FontAwesomeIcon
      icon={faPlus}
      className="absolute bottom-2 left-2 text-green-500 bg-slate-50 rounded-2xl text-2xl cursor-pointer"
      onClick={() => handleAddToCart(item.id, item.name, item.image, item.price)}
      
    />   


                     <div>
              {cartItems.find((cartItem) => cartItem.menuId === item.id)?.quantity || 0}
            </div>

     




        <FontAwesomeIcon
      icon={faMinus}
      className="absolute bottom-2 right-2 text-red-500 bg-slate-50 rounded-3xl text-2xl cursor-pointer"
      onClick={()=>handleDecreaseQuantity(item.id)}
    />
  </div>
           
          </div>
        ))}
        </div>
        {navbarVisible && (
        <div className=" fixed bottom-0 w-full  bg-green-500 text-white p-4 z-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Cart Items Display */}
              {cartItems.map((cartItem) => {
                const item = menuItems.find((menuItem) => menuItem.id === cartItem.menuId);
                return item ? (
                  <div key={cartItem.menuId} className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-8 h-8 object-cover rounded-lg" />
                    <div className="text-sm">{item.name}</div>
                    <div className="text-sm">${cartItem.quantity * item.price}</div>
                  </div>
                ) : null;
              })}
            </div>
            <div className="flex justify-end text-end mx-3 space-x-4 p-4 px-5 cursor-pointer">

            <FontAwesomeIcon icon={faBagShopping} />
             <button onClick={handleCheckout}>Submit</button> 
             </div>
          
            {/* Total Price */}
            <div className="text-lg font-bold">
              Total: ${calculateTotalPrice().toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>


        
      
   
  );
};

export default Menu;
