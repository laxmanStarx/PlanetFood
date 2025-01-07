import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import SignUp from "./components/SignUp"
import Login from "./components/Login"
import Admin from "./components/Admin"


function App() {
  

  return (
    <>
        <BrowserRouter >
       <Navbar />
    <Routes>

      
      <Route path="/signup" element={<SignUp />}/>
      <Route path ="/login" element={<Login />} />
      <Route path ="/admin" element={<Admin />} />

   
    
     
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
