import { lazy } from "react";

// project imports
import Loadable from "@/components/Loadable";
import GuestGuard from "@/guards/GuestGuard";
import PublicLayout from "@/layout/PublicLayout";
const HomePage = Loadable(lazy(() => import("@/pages/public/HomePage")));
const CartPage = Loadable(lazy(() => import("@/pages/public/CartPage")));
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
      path: "/",
      element: <HomePage />
    },
    {
      path: "cart",
      element: <CartPage />
    }
  ]
};
export default PublicRoutes;
