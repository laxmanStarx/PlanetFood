import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import SignUp from "./components/SignUp"
import Login from "./components/Login"
import Admin from "./components/Admin"


import Home from "./components/Home"
import AddFoodForm from "./components/Food"
import CheckUserRole from "./components/pages/Fetchuser"
import AdminLogin from "./components/pages/Profile"

import Menu from "./components/Menu"
import Checkout from "./components/Checkout"
import SuccessPage from "./components/pages/Success"
import RestaurantForm from "./components/pages/RestaurantForm"
import OrderPage from "./components/Order"





function App() {


  

  return (
    <>   

      
        <BrowserRouter >
       <Navbar />
    <Routes>

      
      <Route path="/signup" element={<SignUp />}/>
      <Route path ="/login" element={<Login />} />
      <Route path ="/checkout" element={ <Checkout />} />
      <Route path ="/admin" element={<Admin />} />
      <Route path ="/" element={<Home />} />
      <Route path = "/usser" element ={ <CheckUserRole />} />
     
      <Route path = "/add-menu" element ={ <AddFoodForm  />} />
      <Route path = "/admi-form" element = {<AdminLogin />} />
      <Route path="/restaurant/:restaurantId/menu" element={<Menu />} />
      <Route path = "/success" element = {<SuccessPage />} />

      <Route path="/restaurant-form" element={<RestaurantForm />} />
      <Route path="/orders" element={<OrderPage />} />
      

   
    
     
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App
