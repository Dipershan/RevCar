import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookingCar from "./pages/BookingCar";
import UserBookings from "./pages/UserBookings";
import AdminHome from "./pages/admin/AdminHome";
import EditCar from "./pages/admin/EditCar";
import AddCar from "./pages/admin/AddCar";
import PrivateRoute from "./components/PrivateRoute"; 
import AdminRoute from './components/AdminRoute';
import AdminLogin from "./pages/admin/AdminHome";  
import AdminUserList from "./pages/admin/AdminUserList";    
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Cars from "./pages/Cars";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    
 <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/" element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />

      <Route path="/booking/:carid" element={<BookingCar />} />
      <Route path="/userbookings" element={<UserBookings />} />

      <Route path="/adminlogin" element={<AdminLogin />} />

      {/* ✅ Admin Protected Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminHome />
        </AdminRoute>
      } />
      <Route path="/admin/editcar/:carid" element={
        <AdminRoute>
          <EditCar />
        </AdminRoute>
      } />
      <Route path="/admin/addcar" element={
        <AdminRoute>
          <AddCar />
        </AdminRoute>
      } />
      <Route path="/admin/users" element={
        <AdminRoute>
          <AdminUserList />
        </AdminRoute>
      } />
    </Routes>
  
    
  );
};

export default App;
