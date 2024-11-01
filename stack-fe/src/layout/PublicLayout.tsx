import React from "react";
import Swal from "sweetalert2";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "@/assets/scss/frontpage.module.scss";
import { ShoppingCartOutlined } from "@ant-design/icons";
import axiosServices from "@/utils/axios";
interface ICategory {
  id: number;
  category_name: string;
  slug: string;
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
const PublicLayout = () => {
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const location = useLocation();
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        const res: any = await axiosServices.get("/category-product/list");
        const { data, message, statusCode } = res.data;
        if (statusCode === 200 || statusCode === 201) {
          setCategories(data);
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
    loadCategories();
  }, []);
  return (
    <React.Fragment>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/admin/login">Login</Link>
              </li>
              <li>
                <Link to="/cart">Cart</Link>
              </li>
            </ul>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.colLeft}>
              <div className={styles.menu}>
                {categories.length > 0 && (
                  <ul>
                    {categories.map((item: ICategory, idx: number) => {
                      return (
                        <li key={`category-${idx}`}>
                          <Link to={`/${item.slug}`}>{item.category_name}</Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
            <div className={styles.colRight}>
              <div className={styles.rightMain}>
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PublicLayout;
