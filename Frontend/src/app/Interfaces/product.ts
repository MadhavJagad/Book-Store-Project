export interface Product {
  _id: string;
  title: string;
  author: string;
  category: string;
  publicationYear: string;
  description: string;
  price: number;
  stock: number;
  image: string; // base64
  ratings?: number;
}

export interface CartItem {
  book: Product;
  quantity: number;
}
