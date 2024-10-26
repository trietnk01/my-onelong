import { PayloadAction } from "@reduxjs/toolkit";
import React from "react";
import ldash from "lodash";
interface ICart {
  id: number;
  product_name?: string;
  price?: number;
  quantity?: number;
}

const CartPage = () => {
  const cartReducer = (state: ICart[], action: PayloadAction<ICart>) => {
    switch (action.type) {
      case "add_cart":
        return [...state, action.payload];
      case "update_cart":
        let nextState: ICart[] = ldash.cloneDeep(state);
        nextState.forEach((elmt: ICart) => {
          elmt.quantity = action.payload.quantity;
        });
        return nextState;
      default:
        return state;
    }
  };
  const [cart, cartDispatch] = React.useReducer(cartReducer, []);
  const addCart = (id: number, product_name: string, price: number) => () => {
    cartDispatch({ type: "add_cart", payload: { id, product_name, price, quantity: 1 } });
  };
  const updateCart = (id: number, quantity: number) => () => {
    cartDispatch({ type: "update_cart", payload: { id, quantity } });
  };
  return <div></div>;
};

export default CartPage;
