import { IProduct } from "@/types/product";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import axios from "axios";
import { ProductInputDto } from "./dto/product-input.dto";
import { ProductQueryDto } from "./dto/product-query.dto";
import { PrismaService } from "@/prisma/prisma.service";
import { CategoryProductService } from "@/category_product/category_product.service";

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private confService: ConfigService,
    private categoryService: CategoryProductService
  ) {}
  getCategoryProduct = async () => {
    try {
      const res: any = await axios.get(
        `${this.confService.get<string>("API_PRODUCT")}/category-list`
      );
      let list: any = [];
      if (res.data && res.data.length > 0) {
        res.data.forEach((elmt) => {
          let item: any = { id: elmt, category_name: elmt };
          list.push(item);
        });
      }
      return list;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  getProducts = async (query: ProductQueryDto) => {
    try {
      const skip: number = (parseInt(query.page) - 1) * parseInt(query.limit);
      let where: any = {};
      if (query.q) {
        where["q"] = query.q;
      }
      where["limit"] = query.limit;
      where["skip"] = skip;
      let txtSearch: string = "";
      for (const [key, val] of Object.entries(where)) {
        txtSearch += `${key}=${val}&`;
      }
      txtSearch = txtSearch.slice(0, txtSearch.length - 1);
      let productUrl: string = "";
      let list: any = [];
      let total: number = 0;
      if (query.q && query.category_product_id) {
        productUrl = `${this.confService.get<string>("API_PRODUCT")}/category/${query.category_product_id}`;
      } else {
        if (query.q) {
          productUrl = `${this.confService.get<string>("API_PRODUCT")}/search?${txtSearch}`;
        } else {
          if (query.category_product_id) {
            productUrl = `${this.confService.get<string>("API_PRODUCT")}/category/${query.category_product_id}`;
          } else {
            productUrl = `${this.confService.get<string>("API_PRODUCT")}?${txtSearch}`;
          }
        }
      }
      const res: any = await axios.get(productUrl);
      if (res && res.data && res.data.products && res.data.products.length > 0) {
        if (query.q && query.category_product_id) {
          const pattern = new RegExp(query.q.toLowerCase());
          let productsDraf: any[] = res.data.products;
          productsDraf.forEach((elmt) => {
            if (pattern.test(elmt.title.toLowerCase())) {
              list.push(elmt);
            }
          });
          total = list.length;
        } else {
          list = res.data.products;
          total = parseInt(res.data.total);
        }
      }
      return { list, total };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  getProductDetail = async (id: number) => {
    try {
      let url: string = this.confService.get<string>("API_PRODUCT");
      if (id) {
        url += `/${id}`;
      }
      const res: any = await axios.get(url);
      let data: any = null;
      if (res && res.data) {
        data = res.data;
      }
      return data;
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  save = (prodInput: ProductInputDto) => {
    try {
      console.log("prodInput = ", prodInput);
      return {};
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  import = async () => {
    try {
      let productUrl: string = `${this.confService.get<string>("API_PRODUCT")}?limit=99999999&skip=0`;
      let products: any[] = [];
      const res: any = await axios.get(productUrl);
      if (res && res.data && res.data.products && res.data.products.length > 0) {
        products = res.data.products;
        for (let i = 0; i < products.length; i++) {
          let categoryItem: any = await this.categoryService.findByAlias(products[i].category);
          await this.prisma.product.create({
            data: {
              category_product_id: parseInt(categoryItem.id),
              title: products[i].title,
              price: parseFloat(products[i].price),
              stock: parseInt(products[i].stock),
              thumbnail: products[i].thumbnail,
              image: products[i].images[0]
            }
          });
        }
      }
      return { products, total: parseInt(products.length.toString()) };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
}
