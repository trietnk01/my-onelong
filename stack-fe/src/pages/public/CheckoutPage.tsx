import React from "react";
import axios from "@/utils/axios";
import { Button, Card, Flex, Form, FormProps, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosServices from "@/utils/axios";
import { produce } from "immer";
type FieldType = {
  orders_name: string;
  orders_mobile: string;
  payment_method_id: string;
  orders_address: string;
};

interface ICart {
  key: string;
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  amount: number;
  product_id: number;
  orders_product_name: string;
  orders_product_image: string;
  orders_price: number;
  orders_quantity: number;
  orders_amount: number;
}
const Toast = Swal.mixin({
  toast: true,
  position: "bottom-start",
  showConfirmButton: false,
  timer: 8000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});
interface IPaymentMethod {
  value: string;
  label: string;
}
const CheckoutPage = () => {
  const [frmCheckout] = Form.useForm();
  const navigate = useNavigate();
  const [paymentMethodData, setPaymentMethodData] = React.useState<IPaymentMethod[]>([
    {
      value: "1",
      label: "--Please select payment method--"
    }
  ]);
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { orders_name, orders_mobile, orders_address, payment_method_id } = values;
    try {
      let checked: boolean = true;
      if (!sessionStorage.getItem("cart")) {
        checked = false;
        Toast.fire({
          icon: "error",
          title: "Please update cart"
        });
      }
      if (checked) {
        const cartSession: ICart[] = JSON.parse(sessionStorage.getItem("cart") as string);
        const cartOrder: ICart[] = produce(cartSession, (draft: ICart[]) => {
          draft.forEach((elmt: ICart) => {
            elmt.product_id = elmt.id;
            elmt.orders_product_name = elmt.title;
            elmt.orders_product_image = elmt.orders_product_image;
            elmt.orders_price = elmt.price;
            elmt.orders_quantity = elmt.quantity;
          });
        });
        const orders_product_json: string = JSON.stringify(cartOrder);
        let dataSaved: any = {
          orders_name,
          orders_mobile,
          orders_address,
          payment_method_id,
          orders_product_json
        };
        let res: any = await axios.post("/orders/create", dataSaved, {
          headers: { isShowLoading: true, "content-type": "application/json" }
        });
        const { statusCode, message } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          sessionStorage.removeItem("cart");
          Toast.fire({
            icon: "success",
            title: "Create order successfully"
          });
          setTimeout(() => {
            navigate(`/admin/login`);
          }, 2000);
        } else {
          Toast.fire({
            icon: "error",
            title: message
          });
        }
      }
    } catch (err: any) {
      Toast.fire({
        icon: "error",
        title: err.message
      });
    }
  };
  const handleLogin = () => {
    navigate("/admin/login");
  };

  React.useEffect(() => {
    const loadPaymentMethod = async () => {
      try {
        const res: any = await axiosServices.get("/payment-method/dropdown-box");
        const { data, message, statusCode } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          const paymentMethodLst: any[] = data;
          let nextState: IPaymentMethod[] = produce(paymentMethodLst, (draft: any[]) => {
            draft.forEach((elmt: any) => {
              elmt.value = elmt.id.toString();
              elmt.label = elmt.title;
            });
          });
          setPaymentMethodData(nextState);
        } else {
          Toast.fire({
            icon: "error",
            title: message
          });
        }
      } catch (err: any) {
        Toast.fire({
          icon: "error",
          title: err.statusText
        });
      }
    };
    loadPaymentMethod();
  }, []);
  return (
    <Form form={frmCheckout} layout="vertical" onFinish={onFinish} name="checkoutFrm">
      <Flex justify="center">
        <Card
          title="Checkout"
          extra={
            <Button type="primary" size="large" onClick={handleLogin}>
              Login
            </Button>
          }
          style={{ width: 300 }}
        >
          <Form.Item<FieldType>
            label="Fullname"
            name="orders_name"
            rules={[{ required: true, message: "Please input your fullname!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Mobile"
            name="orders_mobile"
            rules={[{ required: true, message: "Please input your mobile!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType> label="Payment method" name="payment_method_id" initialValue="1">
            <Select size="large" options={paymentMethodData} />
          </Form.Item>
          <Form.Item<FieldType>
            label="Address"
            name="orders_address"
            rules={[{ required: true, message: "Please input your address!" }]}
          >
            <Input />
          </Form.Item>
          <Button htmlType="submit" type="primary" size="large">
            Submit
          </Button>
        </Card>
      </Flex>
    </Form>
  );
};

export default CheckoutPage;
