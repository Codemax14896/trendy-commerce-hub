
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
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Product } from "@/models/Product";
import { toast } from "sonner";

const PRODUCTS_COLLECTION = "products";
const PRODUCTS_PER_PAGE = 12;

// Optimized to fetch products with pagination for better performance
export async function getProducts(limitCount = PRODUCTS_PER_PAGE): Promise<Product[]> {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsCollection, 
      orderBy("createdAt", "desc"), 
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    console.log(`Fetched ${products.length} products from Firestore`);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error; // Throw the error to handle it in the component
  }
}

// Pagination function to load more products
export async function getMoreProducts(
  lastDoc: QueryDocumentSnapshot<DocumentData>,
  limitCount = PRODUCTS_PER_PAGE
): Promise<Product[]> {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const q = query(
      productsCollection,
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(limitCount)
    );
    
    const productsSnapshot = await getDocs(q);
    
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  } catch (error) {
    console.error("Error fetching more products:", error);
    throw error;
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
    const products = productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
    
    console.log(`Fetched ${products.length} featured products from Firestore`);
    return products;
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
}

export async function getProductsByCategory(category: string, limitCount = PRODUCTS_PER_PAGE): Promise<Product[]> {
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
    throw error;
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
    throw error;
  }
}

export async function addProduct(product: Omit<Product, "id">, imageFile: File): Promise<string> {
  try {
    // Upload image first
    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);
    
    console.log("Image uploaded successfully:", imageUrl);
    
    // Add product with image URL
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...product,
      image: imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log("Product added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
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
      // Get the current product to find its image URL
      const currentProduct = await getProduct(id);
      
      // If the product has an existing image, delete it
      if (currentProduct && currentProduct.image) {
        try {
          // Extract the path from the URL
          const imagePath = currentProduct.image.split('products%2F')[1].split('?')[0];
          const oldImageRef = ref(storage, `products/${decodeURIComponent(imagePath)}`);
          await deleteObject(oldImageRef);
          console.log("Old image deleted successfully");
        } catch (error) {
          console.warn("Could not delete old image, it may not exist:", error);
        }
      }
      
      // Upload new image
      const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      updatedData.image = imageUrl;
      
      console.log("New image uploaded successfully:", imageUrl);
    }
    
    await updateDoc(productDoc, updatedData);
    console.log("Product updated successfully:", id);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    // Get the product to find its image URL
    const product = await getProduct(id);
    
    // Delete the product document
    const productDoc = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productDoc);
    
    // If the product has an image, delete it from storage
    if (product && product.image) {
      try {
        // Extract the path from the URL
        const imagePath = product.image.split('products%2F')[1].split('?')[0];
        const imageRef = ref(storage, `products/${decodeURIComponent(imagePath)}`);
        await deleteObject(imageRef);
        console.log("Product image deleted successfully");
      } catch (error) {
        console.warn("Could not delete product image, it may not exist:", error);
      }
    }
    
    console.log("Product deleted successfully:", id);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

// Function to seed initial products if none exist
export async function seedProducts(sampleProducts: Omit<Product, "id">[]): Promise<void> {
  try {
    // Check if products already exist
    const existingProducts = await getProducts(1);
    
    if (existingProducts.length === 0) {
      console.log("No products found, seeding initial data...");
      
      // Add each sample product
      for (const product of sampleProducts) {
        // Create a dummy image from a placeholder URL
        const response = await fetch(product.image);
        const blob = await response.blob();
        const file = new File([blob], `product_${Date.now()}.jpg`, { type: 'image/jpeg' });
        
        await addProduct(product, file);
      }
      
      console.log("Initial products seeded successfully");
    } else {
      console.log("Products already exist, skipping seed");
    }
  } catch (error) {
    console.error("Error seeding products:", error);
    toast.error("Error initializing product data");
  }
}
