import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import CartPage from "../pages/books/CartPage";
import CheckoutPage from "../pages/books/CheckoutPage";
import SingleBook from "../pages/books/SingleBook";
import PrivateRoute from "./PrivateRoute";
import OrderPage from "../pages/books/OrderPage";
import AdminRoute from "./AdminRoute";
import AdminLogin from "../components/AdminLogin";
import DashboardLayout from "../pages/dashboard/DashboardLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import ManageBooks from "../pages/dashboard/manageBooks/ManageBooks";
import AddBook from "../pages/dashboard/addBook/AddBook";
import UpdateBook from "../pages/dashboard/EditBook/UpdateBook";
import UserDashboard from "../pages/dashboard/users/UserDashboard";
import BooksByGenre from "../pages/books/BooksByGenre";
import WishlistPage from "../pages/books/WishlistPage";
import Profile from '../pages/home/Profile';
import ResetPassword from '../pages/home/ResetPassword';
import { ThemeProvider } from '../context/ThemeContext';
import NoResultsPage from '../pages/NoResultsPage';
import AllBooks from '../pages/books/AllBooks';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: "/",
            element: <Home/>
        },
        {
            path: "/books",
            element: <AllBooks/>
        },
        {
            path: "/books/genre/:genre",
            element: <BooksByGenre/>
        },
        {
            path: "/wishlist",
            element: <WishlistPage/>
        },
        {
            path: "/orders",
            element: <PrivateRoute><OrderPage/></PrivateRoute>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/cart",
          element: <CartPage/>
        },
        {
          path: "/checkout",
          element: <PrivateRoute><CheckoutPage/></PrivateRoute>
        },
        {
          path: "/books/:id",
          element: <SingleBook/>
        },
        {
          path: "/user-dashboard",
          element: <PrivateRoute><UserDashboard/></PrivateRoute>
        },
        {
          path: "/profile",
          element: <Profile/>
        },
        {
          path: "/reset-password/:token",
          element: <ResetPassword/>
        },
        {
          path: "/no-results",
          element: <NoResultsPage/>
        },
        {
          path: "*",
          element: <Home/>
        }
      ]
    },
    {
      path: "/admin",
      element: <AdminLogin/>
    },
    {
      path: "/dashboard",
      element: (
        <ThemeProvider>
          <AdminRoute>
            <DashboardLayout/>
          </AdminRoute>
        </ThemeProvider>
      ),
      children:[
        {
          path: "",
          element: <Dashboard/>
        },
        {
          path: "add-new-book",
          element: <AddBook/>
        },
        {
          path: "edit-book/:id",
          element: <UpdateBook/>
        },
        {
          path: "manage-books",
          element: <ManageBooks/>
        }
      ]
    }
]);

export default router;