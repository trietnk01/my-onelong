import styles from "@/assets/scss/frontpage.module.scss";
import { formatCurrency } from "@/utilities";
import { DeleteOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Flex, Input, Space, Spin, Table, Tooltip } from "antd";
import { produce } from "immer";
import ldash from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
interface ICart {
  key: string;
  id: number;
  sku: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  amount: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = React.useState<ICart[]>([]);
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
      title: "Product sku",
      dataIndex: "sku",
      key: "sku"
    },
    {
      title: "Product name",
      dataIndex: "title",
      key: "title"
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (_, record) => {
        return (
          <React.Fragment>
            {record.thumbnail ? (
              <React.Suspense
                fallback={
                  <Flex justify="center" align="center" style={{ width: "100%", height: "100%" }}>
                    <Spin size="large" />
                  </Flex>
                }
              >
                <ImageProduct urlImage={record.thumbnail} width={50} />
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
      dataIndex: "price",
      key: "price",
      render: (_, record) => {
        return formatCurrency(record.price);
      }
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (_, record) => {
        return (
          <React.Fragment>
            <Input
              min={1}
              value={record.quantity ? record.quantity : 0}
              onChange={handleQuantityChange(record.id)}
            />
          </React.Fragment>
        );
      }
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) => {
        return formatCurrency(record.amount);
      }
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <React.Fragment>
            <Space size="middle">
              <Tooltip title="Remove item from cart">
                <Button
                  type="primary"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={handleRemoveItem(record.id)}
                />
              </Tooltip>
            </Space>
          </React.Fragment>
        );
      }
    }
  ];

  React.useEffect(() => {
    if (sessionStorage.getItem("cart")) {
      const cartData: ICart[] = JSON.parse(sessionStorage.getItem("cart") as string);
      const cartNextState: ICart[] = ldash.cloneDeep(cartData);
      cartNextState.forEach((elmt: ICart) => {
        elmt.key = elmt.id.toString();
      });
      setCart(cartNextState);
    }
  }, []);
  const handleQuantityChange =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const quantity: number = parseInt(e.target.value as string);
      let cartClone: ICart[] = [];
      if (quantity === 0) {
        cartClone = cart.filter((item: ICart) => item.id != id);
      } else {
        cartClone = produce(cart, (draft: ICart[]) => {
          draft.forEach((elmt: ICart) => {
            if (elmt.id === id) {
              elmt.quantity = quantity;
              elmt.amount = elmt.price * quantity;
            }
          });
        });
      }
      sessionStorage.setItem("cart", JSON.stringify(cartClone));
      setCart(cartClone);
    };
  const handleRemoveItem = (id: number) => () => {
    const nextCartState: ICart[] = cart.filter((item: ICart) => item.id != id);
    sessionStorage.setItem("cart", JSON.stringify(nextCartState));
    setCart(nextCartState);
  };
  const handleCheckout = () => {
    navigate("/checkout");
  };
  const handleClearCart = () => {
    setCart([]);
    sessionStorage.removeItem("cart");
  };
  return (
    <div>
      <Table<ICart> columns={columns} dataSource={cart} pagination={false} />
      <Flex justify="right" className={styles.cartControl} gap={10}>
        <Button htmlType="button" type="primary" onClick={handleClearCart}>
          Clear all
        </Button>
        <Button htmlType="button" type="primary" onClick={handleCheckout}>
          Checkout
        </Button>
      </Flex>
    </div>
  );
};

export default CartPage;
