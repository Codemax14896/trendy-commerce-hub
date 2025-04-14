export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  subscriptionOptions: string[];
  featured?: boolean;
  category?: string;
  createdAt?: any; // Allow for both Timestamp and string
  updatedAt?: any; // Allow for both Timestamp and string
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
