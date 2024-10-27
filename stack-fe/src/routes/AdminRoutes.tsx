import React from "react";

// project imports

import Loadable from "@/components/Loadable";
const ProductList = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/admin/product/ProductList"));
      }, 1000);
    });
    const val: any = await promi;
    return val;
  })
);
const ProductFrm = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/admin/product/ProductFrm"));
      }, 1000);
    });
    const val = await promi;
    return val;
  })
);
const OrdersList = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/admin/orders/OrdersList"));
      }, 1000);
    });
    const val: any = await promi;
    return val;
  })
);
const OrdersFrm = Loadable(
  React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/pages/admin/orders/OrdersFrm"));
      }, 1000);
    });
    const val: any = await promi;
    return val;
  })
);
import AdminLayout from "@/layout/AdminLayout";
import AuthGuard from "@/guards/AuthGuard";
// ==============================|| AUTH ROUTING ||============================== //

const AdminRoutes = {
  path: "admin",
  element: (
    <AuthGuard>
      <AdminLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: "product",
      children: [
        {
          path: "list",
          element: <ProductList />
        },
        {
          path: "form/:action/:productId",
          element: <ProductFrm />
        }
      ]
    },
    {
      path: "orders",
      children: [
        {
          path: "list",
          element: <OrdersList />
        },
        {
          path: "form/:action/:orderId",
          element: <OrdersFrm />
        }
      ]
    }
  ]
};
export default AdminRoutes;
