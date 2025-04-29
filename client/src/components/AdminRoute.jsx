
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === 'admin';

  return isAdmin ? children : <Navigate to="/adminlogin" />;
};

export default AdminRoute;
