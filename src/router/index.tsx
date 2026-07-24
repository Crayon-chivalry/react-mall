import { createBrowserRouter } from "react-router-dom";

import Layout from "@/pages/Layout"
import Home from "@/pages/Home"
import Category from "@/pages/Category"
import Cart from "@/pages/Cart"
import User from "@/pages/User"
import Login from "@/pages/Auth/Login"
import Register from "@/pages/Auth/Register"
import ResetPassword from "@/pages/Auth/ResetPassword"
import Address from "@/pages/Address/index"
import AddressForm from "@/pages/Address/AddressForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/category",
        element: <Category />
      },
      {
        path: "/cart",
        element: <Cart />
      },
      {
        path: "/user",
        element: <User />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/address",
    element: <Address />
  },
  {
    path: "/address-form",
    element: <AddressForm />
  }
])

export default router