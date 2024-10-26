import { Skeleton } from "antd";
import styles from "@/assets/scss/loader.module.scss";
const Loader = () => {
  return (
    <div className={styles.loaderBox}>
      <Skeleton active />
    </div>
  );
};

export default Loader;
