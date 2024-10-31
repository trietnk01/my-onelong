// project imports
import Loadable from "@/components/Loadable";
import GuestGuard from "@/guards/GuestGuard";
import PublicLayout from "@/layout/PublicLayout";
import React from "react";
const RegisterPage = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/public/RegisterPage"));
      }, 2000);
    });
    const val = await promi;
    return val;
  })
);
const HomePage = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/public/HomePage"));
      }, 2000);
    });
    const val = await promi;
    return val;
  })
);
const CartPage = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/public/CartPage"));
      }, 2000);
    });
    const val = await promi;
    return val;
  })
);
const CheckoutPage = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/public/CheckoutPage"));
      }, 2000);
    });
    const val = await promi;
    return val;
  })
);
// ==============================|| AUTH ROUTING ||============================== //

const PublicRoutes = {
  path: "/",
  element: (
    <GuestGuard>
      <PublicLayout />
    </GuestGuard>
  ),
  children: [
    {
      path: "register",
      element: <RegisterPage />
    },
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: ":categorySlug",
      element: <HomePage />
    },
    {
      path: "cart",
      element: <CartPage />
    },
    {
      path: "checkout",
      element: <CheckoutPage />
    }
  ]
};
export default PublicRoutes;
