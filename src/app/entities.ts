export type CartItem = {
  id: string,
  quantity: number,
  product: Product
}

export type Product = {
  id: string,
  name: string,
  netPrice: number,
  weight: number,
  discount: number,
  description: string;
}
