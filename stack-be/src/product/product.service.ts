import { PrismaService } from "@/prisma/prisma.service";
import { IUser } from "@/types/user";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import axios from "axios";
import { ProductInputDto } from "./dto/product-input.dto";
import { ProductQueryDto } from "./dto/product-query.dto";

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private confService: ConfigService,
    private elastic: ElasticsearchService
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
      const skip: number = (query.page - 1) * query.limit;
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
  getProductByCategorySlug = async (query: ProductQueryDto) => {
    try {
      let where: any = {};
      if (query.category_product_slug) {
        where = {
          ...where,
          category_product: { slug: query.category_product_slug }
        };
      }
      const skip: number = (parseInt(query.page.toString()) - 1) * parseInt(query.limit.toString());
      const total: number = await this.prisma.product.count({ where });
      const products: any = await this.prisma.product.findMany({
        where,
        select: {
          id: true,
          sku: true,
          title: true,
          thumbnail: true,
          price: true
        },
        skip,
        take: query.limit ? parseInt(query.limit.toString()) : 10
      });
      return { products, total };
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
  index = () => {
    try {
      return this.elastic.index({
        index: "product",
        body: {
          sku: "775774",
          title: "Abcgh"
        }
      });
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
}
