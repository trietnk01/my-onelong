import styles from "@/assets/scss/admin.module.scss";
import styleProductDetail from "@/assets/scss/product-detail.module.scss";
import axios from "@/utils/axios";
import { BackwardFilled } from "@ant-design/icons";
import type { TableProps } from "antd";
import { Button, Col, Flex, Row, Spin, Splitter, Table } from "antd";
import { produce } from "immer";
import React from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { formatCurrency } from "@/utilities";
interface IOrder {
  ordersSku?: string;
  ordersDate?: string;
  ordersName?: string;
  ordersMobile?: string;
  ordersAmount?: number;
  paymentMethod?: string;
}
interface ICart {
  id: number;
  key: string;
  orders_product_sku: string;
  orders_product_name: string;
  orders_price: number;
  orders_quantity: number;
  orders_amount: number;
  orders_product_image: string;
}

const OrdersFrm = () => {
  const navigate = useNavigate();
  const { action, orderId } = useParams();
  const [orderItem, setOrderItem] = React.useState<IOrder>({});
  const [cart, setCart] = React.useState<ICart[]>([]);
  const handleBack = () => {
    navigate("/admin/orders/list");
  };
  React.useEffect(() => {
    const loadOrdersDetail = async () => {
      if (action && orderId && action === "detail") {
        setOrderItem({});
        const res: any = await axios.get(`/orders/detail/${orderId.toString()}`, {
          headers: { isShowLoading: false }
        });
        const { statusCode, data } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          const {
            orders_sku,
            orders_date,
            orders_name,
            orders_mobile,
            payment_method,
            orders_detail
          } = data;
          const d = new Date(orders_date);
          const ordersDate: string = `${d.getFullYear()}-${(d.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
            .getHours()
            .toString()
            .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
            .getSeconds()
            .toString()
            .padStart(2, "0")}`;

          if (orders_detail && orders_detail.length > 0) {
            const ordersData: ICart[] = orders_detail;
            const nextState: ICart[] = produce(ordersData, (draft: ICart[]) => {
              draft.forEach((elmt: ICart, idx: number) => {
                elmt.key = (idx + 1).toString();
                elmt.orders_amount = elmt.orders_price * elmt.orders_quantity;
              });
            });
            const totalAmount: number = nextState.reduce((total: number, cartItem: ICart) => {
              return total + cartItem.orders_amount;
            }, 0);
            setOrderItem({
              ordersSku: orders_sku,
              ordersDate,
              ordersName: orders_name,
              ordersMobile: orders_mobile,
              paymentMethod: payment_method["title"],
              ordersAmount: totalAmount
            });
            setCart(nextState);
          }
        }
      }
    };
    loadOrdersDetail();
  }, [orderId, action]);
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
      dataIndex: "orders_product_sku",
      key: "orders_product_sku"
    },
    {
      title: "Product name",
      dataIndex: "orders_product_name",
      key: "orders_product_name"
    },
    {
      title: "Price",
      dataIndex: "orders_price",
      key: "orders_price",
      render: (_, record) => {
        return formatCurrency(record.orders_price);
      }
    },
    {
      title: "Quantity",
      dataIndex: "orders_quantity",
      key: "orders_quantity"
    },
    {
      title: "Amount",
      dataIndex: "orders_amount",
      key: "orders_amount",
      render: (_, record) => {
        return formatCurrency(record.orders_amount);
      }
    },
    {
      title: "Image",
      dataIndex: "orders_product_image",
      key: "orders_product_image",
      render: (_, record) => {
        return (
          <React.Fragment>
            {record.orders_product_image ? (
              <React.Suspense
                fallback={
                  <Flex justify="center" align="center" style={{ width: "100%", height: "100%" }}>
                    <Spin size="large" />
                  </Flex>
                }
              >
                <ImageProduct urlImage={record.orders_product_image} width={50} />
              </React.Suspense>
            ) : (
              <React.Fragment></React.Fragment>
            )}
          </React.Fragment>
        );
      }
    }
  ];
  return (
    <React.Fragment>
      <Row>
        <Col span={24}>
          <Row>
            <Col span={24}>
              <h2 className={styles.titleHeading}>Order detail</h2>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Flex justify="flex-end" gap={10}>
                <Button
                  type="primary"
                  icon={<BackwardFilled />}
                  size="large"
                  danger
                  onClick={handleBack}
                />
              </Flex>
            </Col>
          </Row>
          <Row style={{ marginTop: 20 }}>
            <Col span={12}>
              <Table<ICart> columns={columns} dataSource={cart} pagination={false} />
            </Col>
            <Col span={12}>
              <Splitter style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", padding: 20 }}>
                <Splitter.Panel>
                  <Row>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Name</div>
                      <div>{orderItem.ordersName ? orderItem.ordersName : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Payment method</div>
                      <div>{orderItem.paymentMethod ? orderItem.paymentMethod : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Order sku</div>
                      <div>{orderItem.ordersSku ? orderItem.ordersSku : ""}</div>
                    </Col>
                  </Row>
                  <Row className={styleProductDetail.productRowDetail}>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Mobile</div>
                      <div>{orderItem.ordersMobile ? orderItem.ordersMobile : ""}</div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Amount</div>
                      <div>
                        {orderItem.ordersAmount ? formatCurrency(orderItem.ordersAmount) : "0"}
                      </div>
                    </Col>
                    <Col span={8}>
                      <div className={styleProductDetail.productLabel}>Order date</div>
                      <div>{orderItem.ordersDate ? orderItem.ordersDate : ""}</div>
                    </Col>
                  </Row>
                </Splitter.Panel>
              </Splitter>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OrdersFrm;
