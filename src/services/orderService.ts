
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Order } from "@/models/Product";

const ORDERS_COLLECTION = "orders";

export async function createOrder(
  userId: string, 
  productId: string, 
  productName: string,
  subscriptionOption: string, 
  price: number
): Promise<string> {
  // Calculate expiry date based on subscription option
  const purchaseDate = new Date();
  const expiryDate = new Date(purchaseDate);
  
  if (subscriptionOption === "1 Year") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  } else if (subscriptionOption === "2 Years") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 2);
  } else if (subscriptionOption === "3 Years") {
    expiryDate.setFullYear(expiryDate.getFullYear() + 3);
  }
  
  const orderData = {
    userId,
    productId,
    productName,
    subscriptionOption,
    price,
    purchaseDate: purchaseDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    createdAt: serverTimestamp()
  };
  
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
  return docRef.id;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const ordersCollection = collection(db, ORDERS_COLLECTION);
  const q = query(ordersCollection, where("userId", "==", userId));
  
  const ordersSnapshot = await getDocs(q);
  
  return ordersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Order[];
}
