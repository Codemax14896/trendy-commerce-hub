
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/models/Product";

const PRODUCTS_COLLECTION = "products";

export async function getProducts(): Promise<Product[]> {
  const productsCollection = collection(db, PRODUCTS_COLLECTION);
  const productsSnapshot = await getDocs(productsCollection);
  
  return productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const productsCollection = collection(db, PRODUCTS_COLLECTION);
  const q = query(
    productsCollection,
    where("featured", "==", true),
    orderBy("createdAt", "desc")
  );
  
  const productsSnapshot = await getDocs(q);
  
  return productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const productsCollection = collection(db, PRODUCTS_COLLECTION);
  const q = query(
    productsCollection,
    where("category", "==", category),
    orderBy("createdAt", "desc")
  );
  
  const productsSnapshot = await getDocs(q);
  
  return productsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  const productSnapshot = await getDoc(productDoc);
  
  if (!productSnapshot.exists()) {
    return null;
  }
  
  return {
    id: productSnapshot.id,
    ...productSnapshot.data()
  } as Product;
}

export async function addProduct(product: Omit<Product, "id">, imageFile: File): Promise<string> {
  // Upload image first
  const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
  await uploadBytes(storageRef, imageFile);
  const imageUrl = await getDownloadURL(storageRef);
  
  // Add product with image URL
  const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    image: imageUrl,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
}

export async function updateProduct(
  id: string,
  product: Partial<Product>,
  imageFile?: File
): Promise<void> {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  
  let updatedData: Partial<Product> & { updatedAt: any } = {
    ...product,
    updatedAt: serverTimestamp()
  };
  
  // If there's a new image, upload it
  if (imageFile) {
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);
    updatedData.image = imageUrl;
  }
  
  await updateDoc(productDoc, updatedData);
}

export async function deleteProduct(id: string): Promise<void> {
  const productDoc = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(productDoc);
}
