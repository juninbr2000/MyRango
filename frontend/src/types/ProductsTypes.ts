export interface ProductData {
    _id: string,
    title: string,
    description: string,
    price: number,
    imageUrl?: string,
    amount?: number,
}

export interface ProductFullData {
    _id: string,
    title: string,
    description: string,
    available: boolean,
    price: number,
    imageUrl?: string,
    amount?: number,
    createdBy: string
}

export interface ProductOrder {
  _id: string
  product: string
  name: string
  quantity: number
  priceAtTimeOfPurchase: number
}
