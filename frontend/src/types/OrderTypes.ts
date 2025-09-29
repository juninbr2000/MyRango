import type { Address } from "./AddressTypes"
import type { ProductOrder } from "./ProductsTypes"

export interface Order {
  _id: string
  user: {
    name: string,
    phone: string,
    _id: string
  }
  ProductStatus: string
  paymentMethod: string
  paymentStatus: string
  totalPrice: number
  products: ProductOrder[]
  address: Address
  createdAt: string,
  updatedAt: string
}

export interface CartItem {
  _id: string;
  title: string;
  price: number;
  amount: number;
  observation?: string;
  imageUrl?: string;
}