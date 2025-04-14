
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  subscriptionOptions: string[];
  featured?: boolean;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  subscriptionOption: string;
  price: number;
  purchaseDate: string;
  expiryDate: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}
