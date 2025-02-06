import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Mycars from './pages/Mycars';
import Login from './pages/Login';
import Notification from './pages/Notification';
import ManageCars from './pages/ManageCars';
import About from './pages/About';
import Contact from './pages/Contact';
import Upcoming from './pages/Upcoming';
import EditCar from './pages/EditCar';
import AddCar from './pages/AddCar';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPass from './pages/ResetPassword';
import Notify from './pages/Notify';
import { ToastContainer } from 'react-toastify';
const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      <Routes>
      <Route path='/' element={<Mycars/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/notification' element={<Notification/>}/>
      <Route path='/manage/:id' element={<ManageCars/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/upcoming' element={<Upcoming/>}/>
      <Route path='/edit-car/:carId' element={<EditCar/>}/>
      <Route path='/add-car' element={<AddCar/>}/>
      <Route path="/profile" element={<Profile/>} />
      <Route path="/edit-profile" element={<EditProfile/>} />
      <Route path='/forgot-password' element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPass/>} />
      <Route path="/notify/:bookingId" element={<Notify />} />
      </Routes>
    </div>
  )
}

export default App
