import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import SignUp from "./components/SignUp"
import Login from "./components/Login"
import Admin from "./components/Admin"


import Home from "./components/Home"
import AddFoodForm from "./components/Food"
import CheckUserRole from "./components/pages/Fetchuser"
import AdminLogin from "./components/pages/Profile"
import { AuthProvider } from "./contextApi/AuthContext"
import Menu from "./components/Menu"



function App() {


  

  return (
    <>   

       <AuthProvider>
        <BrowserRouter >
       <Navbar />
    <Routes>

      
      <Route path="/signup" element={<SignUp />}/>
      <Route path ="/login" element={<Login />} />
      <Route path ="/admin" element={<Admin />} />
      <Route path ="/" element={<Home />} />
      <Route path = "/usser" element ={ <CheckUserRole />} />
     
      <Route path = "/add-menu" element ={ <AddFoodForm  />} />
      <Route path = "/admi-form" element = {<AdminLogin />} />
      <Route path="/restaurant/:restaurantId/menu" element={<Menu />} />

   
    
     
    </Routes>
    </BrowserRouter>
    </AuthProvider>
    </>
  )
}

export default App
