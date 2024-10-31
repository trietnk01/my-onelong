import ldash from "lodash";
import styles from "@/assets/scss/frontpage.module.scss";
import { formatCurrency } from "@/utilities";
import axiosServices from "@/utils/axios";
import { Button, Flex, Image, Pagination } from "antd";
import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Item from "antd/es/list/Item";
interface IProduct {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  amount: number;
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
const HomePage = () => {
  const { categorySlug } = useParams();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const navigate = useNavigate();
  const [products, setProducts] = React.useState<IProduct[]>([]);
  const [productTotal, setProductTotal] = React.useState<number>(0);
  React.useEffect(() => {
    const loadProducts = async (categorySlug: string | undefined, currentPage: any) => {
      try {
        const res: any = await axiosServices.get("/product/get-by-category-slug", {
          params: {
            category_product_slug: categorySlug ? categorySlug : undefined,
            page: currentPage ? parseInt(currentPage as string) : 1,
            limit: 12
          },
          headers: { isShowLoading: false }
        });
        const { data, message, statusCode } = res.data;
        if (statusCode === 200 || statusCode === 201) {
          const { products, total } = data;
          setProducts(products);
          setProductTotal(total);
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
    loadProducts(categorySlug, searchParams.get("page"));
  }, [categorySlug, searchParams.get("page")]);
  const handlePageChange = (val: any) => {
    if (categorySlug) {
      navigate(`/${categorySlug}?page=${val as string}`);
    } else {
      navigate(`/?page=${val as string}`);
    }
  };
  const handleAddCart = (id: number) => () => {
    let product: IProduct | undefined = products.find((elmt) => elmt.id === id);
    if (product) {
      let cartData: IProduct[] = [];
      if (sessionStorage.getItem("cart")) {
        cartData = JSON.parse(sessionStorage.getItem("cart") as string);
        let cartItemFound: IProduct | undefined = cartData.find((elmt) => elmt.id === product.id);
        if (cartItemFound) {
          cartData.forEach((elmt: IProduct) => {
            if (elmt.id === cartItemFound.id) {
              elmt.quantity = cartItemFound.quantity + 1;
              elmt.amount = cartItemFound.price * elmt.quantity;
            }
          });
        } else {
          product.quantity = 1;
          product.amount = product.price;
          cartData.push(product);
        }
      } else {
        product.quantity = 1;
        product.amount = product.price;
        cartData.push(product);
      }
      console.log("cartData = ", cartData);
      sessionStorage.setItem("cart", JSON.stringify(cartData));
    }
  };
  return (
    <div>
      <div className={styles.productRows}>
        {products.length > 0 ? (
          <React.Fragment>
            {products.map((item: IProduct, idx: number) => {
              return (
                <div key={`product-item-${idx}`} className={styles.productBox}>
                  <Flex justify="center">
                    <Image src={item.thumbnail} width={190} />
                  </Flex>
                  <h3 className={styles.productName}>{item.title}</h3>
                  <div className={styles.productPrice}>{formatCurrency(item.price)}</div>
                  <div className={styles.addCart}>
                    <Button htmlType="button" type="primary" onClick={handleAddCart(item.id)}>
                      Add cart
                    </Button>
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ) : (
          <React.Fragment></React.Fragment>
        )}
      </div>
      <Flex justify="right" className={styles.pagination} gap={10}>
        <Pagination
          align="end"
          current={searchParams.get("page") ? parseInt(searchParams.get("page") as string) : 1}
          total={productTotal}
          onChange={handlePageChange}
        />
      </Flex>
    </div>
  );
};

export default HomePage;
