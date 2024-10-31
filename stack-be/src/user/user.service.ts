import { PrismaService } from "@/prisma/prisma.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import axios from "axios";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private confService: ConfigService
  ) {}
  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };
  importData = async () => {
    try {
      const resCategories: any = await axios.get(
        `${this.confService.get<string>("API_PRODUCT")}/categories`
      );
      const { data } = resCategories;
      let categoryLst = null;
      let productLst = null;
      let paymentMethodLst = null;
      let categories: any[] = [];
      let productData: any[] = [];
      if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          let categoryItem: any = { category_name: data[i].name, slug: data[i].slug };
          categories.push(categoryItem);
        }
        categoryLst = await this.prisma.categoryProduct.createMany({ data: categories });
        const resProduct: any = await axios.get(
          `${this.confService.get<string>("API_PRODUCT")}?limit=99999999&skip=0`
        );
        const { products } = resProduct.data;
        for (let j = 0; j < products.length; j++) {
          let categoryItem: any | undefined = await this.prisma.categoryProduct.findUnique({
            where: { slug: products[j].category }
          });
          if (categoryItem) {
            let sku: string = "";
            const characters = "123456789";
            const charactersLength = characters.length;
            let counter = 0;
            while (counter < charactersLength) {
              sku += characters.charAt(Math.floor(Math.random() * charactersLength));
              counter += 1;
            }
            let productItem: any = {
              sku,
              category_product_id: categoryItem.id,
              title: products[j].title,
              price: parseFloat(products[j].price),
              stock: parseInt(products[j].stock),
              thumbnail: products[j].thumbnail,
              image: products[j].images[0]
            };
            productData.push(productItem);
          }
        }
        productLst = await this.prisma.product.createMany({ data: productData });
      }
      paymentMethodLst = await this.prisma.paymentMethod.createMany({
        data: [{ title: "Cash payment" }, { title: "Credit card" }, { title: "Debit card" }]
      });
      return { categoryLst, productLst, paymentMethodLst };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  };
  create = (createUserDto: CreateUserDto) => {
    const hasPassword = this.getHashPassword(createUserDto.password);
    return this.prisma.user.create({
      data: {
        username: createUserDto.username,
        password: hasPassword,
        email: createUserDto.email,
        fullname: createUserDto.fullname
      }
    });
  };
  findByUsername = (username: string) => {
    return this.prisma.user.findUnique({ where: { username } });
  };
  isValidPassword = (password: string, hash: string) => {
    return compareSync(password, hash);
  };
  updateUserToken = (id: number, token: string) => {
    return this.prisma.user.update({ where: { id }, data: { token } });
  };
  findUserByToken = (token: string) => {
    return this.prisma.user.findFirstOrThrow({ where: { token } });
  };
  findUserByIdUsernameEmail = (id: number, username: string, email: string) => {
    return this.prisma.user.findFirstOrThrow({ where: { id, username, email } });
  };
}
