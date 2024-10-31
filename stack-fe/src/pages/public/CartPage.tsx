import React from "react";
import { Button, Flex, Input, Space, Spin, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { formatCurrency } from "@/utilities";
import styles from "@/assets/scss/frontpage.module.scss";
import { useNavigate } from "react-router-dom";
interface ICart {
  key: string;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
  amount: number;
}
const CartPage = () => {
  const navigate = useNavigate();
  const ImageProduct = React.lazy(async () => {
    const promi: any = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(import("@/components/ImageProduct"));
      }, 2000);
    });
    const val = await promi;
    return val;
  });
  const columns: TableProps<ICart>["columns"] = [
    {
      title: "Product name",
      dataIndex: "product_name",
      key: "product_name"
    },
    {
      title: "Image",
      dataIndex: "product_image",
      key: "product_image",
      render: (_, record) => {
        return (
          <React.Fragment>
            {record.product_image ? (
              <React.Suspense
                fallback={
                  <Flex justify="center" align="center" style={{ width: "100%", height: "100%" }}>
                    <Spin size="large" />
                  </Flex>
                }
              >
                <ImageProduct urlImage={record.product_image} width={50} />
              </React.Suspense>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </React.Fragment>
        );
      }
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (_, record) => {
        return formatCurrency(record.product_price);
      }
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (_, record) => {
        return <Input placeholder="Quantity..." value={record.quantity ? record.quantity : 0} />;
      }
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => {
        return formatCurrency(record.amount);
      }
    }
  ];
  const data: ICart[] = [
    {
      key: "1",
      product_name: "Abc",
      product_image: "https://cdn.dummyjson.com/products/images/womens-shoes/Red%20Shoes/1.png",
      product_price: 1500,
      quantity: 20,
      amount: 5000
    }
  ];
  const handleCheckout = () => {
    navigate("/checkout");
  };
  return (
    <div>
      <Table<ICart> columns={columns} dataSource={data} pagination={false} />
      <Flex justify="right" className={styles.cartControl}>
        <Button htmlType="button" type="primary" onClick={handleCheckout}>
          Checkout
        </Button>
      </Flex>
    </div>
  );
};

export default CartPage;
