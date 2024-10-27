import { Flex, Image, Spin } from "antd";
import React from "react";
import { useSelector } from "@/store";
import styleProductDetail from "@/assets/scss/product-detail.module.scss";
interface ImageProductProps {
  urlImage: string;
  width?: number;
}
const ImageProduct: React.FC<ImageProductProps> = ({ urlImage, width }) => {
  return (
    <React.Fragment>
      {width ? (
        <Image src={urlImage} width={width} className={styleProductDetail.productImage} />
      ) : (
        <Image src={urlImage} className={styleProductDetail.productImage} />
      )}
    </React.Fragment>
  );
};

export default ImageProduct;
