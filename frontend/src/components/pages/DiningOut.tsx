// import RestaurantMenu from "../RestaurantMenu"
// import Foodypaste from "./Foodypaste"


// const DiningOut = () => {
//   return (
//     <>
//     <div className="relative">
//         <Foodypaste />
//     </div>
//     <div>
//             <RestaurantMenu />
//     </div>
//     </>
//   )
// }

// export default DiningOut






import Foodypaste from "./Foodypaste";

export default function FoodInspiration() {
  const items = [
    { label: "Biryani", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1765471778/Screenshot_2025-12-11_221908_t8gddp.png" },
    { label: "Pizza", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1737967371/pizzas_dhkq9l.jpg" },
    { label: "Cake", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1737995138/cakke_ehnumt.jpg" },
    { label: "Rasgulla", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1737802470/rasgulla_uoquhz.jpg" },
    { label: "Noodles", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1753547653/Screenshot_2025-07-26_220130_b9ur7q.png" },
    { label: "Paneer", img: "https://res.cloudinary.com/dykahal7o/image/upload/v1753728673/Screenshot_2025-07-29_002104_cfgebm.png" }
  ];

  return (
    <div className="w-full px-6 py-10">
      <h2 className="text-3xl font-semibold mb-8">Inspiration for your first order</h2>

      <div className="flex items-center gap-8 overflow-x-auto pb-4 scrollbar-hide">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center flex-shrink-0">
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-md">
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="mt-3 text-lg font-medium">{item.label}</p>
          </div>
        ))}

        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 shadow-md flex-shrink-0">
          ➤
        </button>
      </div>
      <div className="relative">
        <Foodypaste />
      </div>
    </div>
  );
}
