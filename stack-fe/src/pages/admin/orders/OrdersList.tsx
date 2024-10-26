import styles from "@/assets/scss/admin.module.scss";
import axios from "@/utils/axios";
import { Button, GetProp, Input, Select, Space, Table, TableProps } from "antd";
import { produce } from "immer";
import ldash from "lodash";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
interface IOrders {
  key: string;
  id: number;
  orders_name: string;
  orders_mobile: string;
  orders_date: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, "onChange">>[1];
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

const TIMEOUT_DEBOUNCE = 30;
const OrdersList = () => {
  const navigate = useNavigate();
  const [ordersData, setOrdersData] = React.useState<IOrders[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [ordersName, setOrdersName] = React.useState<string>("");
  const [ordersMobile, setOrdersMobile] = React.useState<string>("");
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });
  const columns: TableProps<IOrders>["columns"] = [
    {
      title: "Customer",
      dataIndex: "orders_name",
      key: "orders_name",
      render: (text) => text
    },
    {
      title: "Mobile",
      dataIndex: "orders_mobile",
      key: "orders_mobile",
      render: (text) => text
    },
    {
      title: "Orders date",
      dataIndex: "orders_date",
      key: "orders_date",
      render: (text) => text
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <React.Fragment>
            <Space size="middle">
              <Button type="primary" onClick={handleDetail(record.id)}>
                Detail
              </Button>
            </Space>
          </React.Fragment>
        );
      }
    }
  ];
  const handleDetail = (id: number) => () => {
    navigate(`/admin/orders/form/detail/${id}`);
  };
  const loadOrdersTable = (
    ordersName: string,
    ordersMobile: string,
    current: string | undefined
  ) => {
    axios
      .get("/orders/list", {
        params: {
          orders_name: ordersName ? ordersName.trim() : undefined,
          orders_mobile: ordersMobile ? ordersMobile.trim() : undefined,
          page: current ? current.toString() : "1",
          limit: tableParams.pagination?.pageSize?.toString()
        }
      })
      .then((res) => {
        const { statusCode, data, message } = res.data;
        if (parseInt(statusCode) === 200 || parseInt(statusCode) === 201) {
          const { orders, total } = data;
          setLoading(false);
          const items: IOrders[] = orders;
          const nextState: IOrders[] = produce(items, (drafState) => {
            drafState.forEach((item) => {
              item.key = item.id.toString();
              const d = new Date(item.orders_date.toString());
              item.orders_date = `${d.getFullYear()}-${(d.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")} ${d
                .getHours()
                .toString()
                .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d
                .getSeconds()
                .toString()
                .padStart(2, "0")}`;
            });
          });
          setOrdersData(nextState);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total
            }
          });
        } else {
          Toast.fire({
            icon: "error",
            title: message
          });
        }
      })
      .catch((err: any) => {
        Toast.fire({
          icon: "error",
          title: err.message
        });
      });
  };
  React.useEffect(() => {
    setLoading(true);
    loadOrdersTable("", "", "1");
  }, []);

  const handleOrdersNameChange = (e: any) => {
    setOrdersName(e.target.value.toString());
  };

  const handleOrdersMobileChange = (e: any) => {
    setOrdersMobile(e.target.value.toString());
  };

  const handleTableChange: TableProps<IOrders>["onChange"] = (pagination, filters) => {
    setTableParams({
      pagination,
      filters
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setOrdersData([]);
    }
  };
  const handleSearch = () => {
    loadOrdersTable(ordersName, ordersMobile, tableParams.pagination?.current?.toString());
  };
  return (
    <React.Fragment>
      <h2 className={styles.titleHeading}>Orders</h2>
      <div className={styles.controlBox}>
        <div className={styles.filterBox}>
          <Input
            placeholder="Name..."
            size="large"
            className={styles.searchText}
            onChange={handleOrdersNameChange}
            value={ordersName}
          />
          <Input
            placeholder="Mobile..."
            size="large"
            className={styles.searchText}
            onChange={handleOrdersMobileChange}
            value={ordersMobile}
          />
          <Button type="primary" htmlType="button" onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={ordersData}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </React.Fragment>
  );
};

export default OrdersList;
