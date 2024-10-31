import axios from "@/utils/axios";
import type { DatePickerProps, GetProps } from "antd";
import { Button, DatePicker, GetProp, Input, Space, Table, TableProps } from "antd";
import { produce } from "immer";
import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "@/assets/scss/admin.module.scss";
type TablePaginationConfig = Exclude<GetProp<TableProps, "pagination">, boolean>;
interface IOrders {
  key: string;
  id: number;
  orders_sku: string;
  orders_name: string;
  orders_mobile: string;
  orders_date: string;
}
interface IFilter {
  ordersSku?: string;
  ordersName?: string;
  ordersMobile?: string;
  ordersStartDate?: string;
  ordersEndDate?: string;
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
const OrdersList = () => {
  const navigate = useNavigate();
  const [ordersData, setOrdersData] = React.useState<IOrders[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState<IFilter>({});
  const [tableParams, setTableParams] = React.useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10
    }
  });
  const columns: TableProps<IOrders>["columns"] = [
    {
      title: "Sku",
      dataIndex: "orders_sku",
      key: "orders_sku",
      render: (text) => text
    },
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
  const loadOrdersTable = (filter: IFilter, current: string | undefined) => {
    axios
      .get("/orders/list", {
        params: {
          orders_sku: filter.ordersSku ? filter.ordersSku.trim() : undefined,
          orders_name: filter.ordersName ? filter.ordersName.trim() : undefined,
          orders_mobile: filter.ordersMobile ? filter.ordersMobile.trim() : undefined,
          orders_start_date: filter.ordersStartDate ? filter.ordersStartDate : undefined,
          orders_end_date: filter.ordersEndDate ? filter.ordersEndDate : undefined,
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
    loadOrdersTable({}, "1");
  }, []);

  const handleOrdersNameChange = (e: any) => {
    setFilter({ ...filter, ordersName: e.target.value.toString() });
  };
  const handleOrdersMobileChange = (e: any) => {
    setFilter({ ...filter, ordersMobile: e.target.value.toString() });
  };
  const handleOrdersSkuChange = (e: any) => {
    setFilter({ ...filter, ordersSku: e.target.value.toString() });
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
    loadOrdersTable(filter, tableParams.pagination?.current?.toString());
  };
  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

  const { RangePicker } = DatePicker;

  const onOk = (val: DatePickerProps["value"] | RangePickerProps["value"]) => {};
  const handleChangeRangePicker = (value: any, dateString: any) => {
    if (dateString && dateString.length > 0) {
      setFilter({ ...filter, ordersStartDate: dateString[0], ordersEndDate: dateString[1] });
    }
  };
  return (
    <React.Fragment>
      <h2 className={styles.titleHeading}>Orders</h2>
      <div className={styles.controlBox}>
        <div className={styles.filterBox}>
          <Input
            placeholder="Sku..."
            size="large"
            className={styles.searchText}
            onChange={handleOrdersSkuChange}
            value={filter.ordersSku ? filter.ordersSku : ""}
          />
          <Input
            placeholder="Name..."
            size="large"
            className={styles.searchText}
            onChange={handleOrdersNameChange}
            value={filter.ordersName ? filter.ordersName : ""}
          />
          <Input
            placeholder="Mobile..."
            size="large"
            className={styles.searchText}
            onChange={handleOrdersMobileChange}
            value={filter.ordersMobile ? filter.ordersMobile : ""}
          />
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            onChange={handleChangeRangePicker}
            onOk={onOk}
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
