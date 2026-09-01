import { createBrowserRouter } from "react-router-dom";

import Layout from "@/pages/Layout";
import Home from "@/pages/Home";
import Category from "@/pages/Category";
import Cart from "@/pages/Cart";
import User from "@/pages/User/Profile";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ResetPassword from "@/pages/Auth/ResetPassword";
import Address from "@/pages/Address/List";
import AddressForm from "@/pages/Address/Form";
import Product from "@/pages/Product/Detail";
import ProductList from "@/pages/Product/List";
import Search from "@/pages/Search";
import OrderConfirm from "@/pages/Order/Confirm";
import OrderList from "@/pages/Order/List";
import Notice from "@/pages/Notice";
import Settings from "@/pages/User/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/user",
        element: <User />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/address",
    children: [
      {
        index: true,
        element: <Address />,
      },
      {
        path: "form",
        element: <AddressForm />,
      },
    ],
  },
  {
    path: "/product",
    children: [
      {
        index: true,
        element: <Product />,
      },
      {
        path: "list",
        element: <ProductList />,
      },
    ],
  },
  {
    path: "/order",
    children: [
      {
        path: "confirm",
        element: <OrderConfirm />,
      },
      {
        path: "list",
        element: <OrderList />,
      },
    ],
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/notice",
    element: <Notice />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
]);

export default router;
