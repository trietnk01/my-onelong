import axios from "@/utils/axios";
import { Button, Card, Flex, Form, FormProps, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
type FieldType = {
  orders_name: string;
  orders_mobile: string;
  payment_method_id: number;
  orders_address: string;
};
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
const CheckoutPage = () => {
  const [frmCheckout] = Form.useForm();
  const navigate = useNavigate();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {};
  const handleLogin = () => {
    navigate("/admin/login");
  };
  const handlePaymentMethodChange = (value: string) => {
    console.log(`selected ${value}`);
  };
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
          <Form.Item<FieldType> label="Payment method" name="payment_method_id">
            <Select
              defaultValue="lucy"
              size="large"
              onChange={handlePaymentMethodChange}
              options={[
                { value: "jack", label: "Jack" },
                { value: "lucy", label: "Lucy" },
                { value: "Yiminghe", label: "yiminghe" }
              ]}
            />
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
