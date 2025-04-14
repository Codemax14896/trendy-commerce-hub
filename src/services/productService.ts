
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
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/models/Product";

const PRODUCTS_COLLECTION = "products";

// Optimized to fetch products with a limit to improve loading speed
export async function getProducts(limitCount = 20): Promise<Product[]> {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsCollection, orderBy("createdAt", "desc"), limit(limitCount));
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return empty array instead of throwing error
  }
}

export async function getFeaturedProducts(limitCount = 6): Promise<Product[]> {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsCollection,
      where("featured", "==", true),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return []; // Return empty array instead of throwing error
  }
}

export async function getProductsByCategory(category: string, limitCount = 20): Promise<Product[]> {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsCollection,
      where("category", "==", category),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return []; // Return empty array instead of throwing error
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const productDoc = doc(db, PRODUCTS_COLLECTION, id);
    const productSnapshot = await getDoc(productDoc);
    
    if (!productSnapshot.exists()) {
      return null;
    }
    
    return {
      id: productSnapshot.id,
      ...productSnapshot.data()
    } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null; // Return null instead of throwing error
  }
}

export async function addProduct(product: Omit<Product, "id">, imageFile: File): Promise<string> {
  try {
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
  } catch (error) {
    console.error("Error adding product:", error);
    throw error; // Keep throwing error for admin operations
  }
}

export async function updateProduct(
  id: string,
  product: Partial<Product>,
  imageFile?: File
): Promise<void> {
  try {
    const productDoc = doc(db, PRODUCTS_COLLECTION, id);
    
    let updatedData: any = {
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
  } catch (error) {
    console.error("Error updating product:", error);
    throw error; // Keep throwing error for admin operations
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const productDoc = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productDoc);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error; // Keep throwing error for admin operations
  }
}
