import React from "react";
import { Outlet } from "react-router-dom";
import styles from "@/assets/scss/frontpage.module.scss";
const PublicLayout = () => {
  return (
    <React.Fragment>
      <div className={styles.main}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.colLeft}>
              <div className={styles.menu}>
                <ul>
                  <li>
                    <a href="javascript:void(0);">Beauty</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Fragrances</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Furniture</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Groceries</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Home decoration</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.colRight}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PublicLayout;
