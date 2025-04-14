
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/models/Product";
import { getProducts, deleteProduct, seedProducts } from "@/services/productService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, Plus, RefreshCcw, Database } from "lucide-react";
import placeholderImage from "../../assets/placeholder-1.jpg";

// Sample products for seeding the database
const sampleProducts = [
  {
    name: "Wireless Earbuds Pro",
    description: "Premium sound quality with active noise cancellation and 24-hour battery life.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
    subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
    featured: true,
    category: "Electronics"
  },
  {
    name: "Smart Home Hub",
    description: "Control your entire home with voice commands and smart automation features.",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
    featured: true,
    category: "Smart Home"
  },
  {
    name: "Premium Fitness Tracker",
    description: "Track your health metrics, workouts, and sleep patterns with this waterproof device.",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=600&q=80",
    subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
    featured: true,
    category: "Fitness"
  },
  {
    name: "Smartphone Gimbal",
    description: "Stabilize your smartphone videos with this professional-grade gimbal.",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1587860154305-eedea40ac482?auto=format&fit=crop&w=600&q=80",
    subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
    featured: false,
    category: "Electronics"
  },
  {
    name: "Mechanical Keyboard",
    description: "Responsive tactile feedback for gaming and typing enthusiasts.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=600&q=80",
    subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
    featured: false,
    category: "Electronics"
  }
];

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seedingProducts, setSeedingProducts] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products. Please try again.");
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete);
      setProducts(products.filter(product => product.id !== productToDelete));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };
  
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderImage;
  };

  // Add a function to seed sample products
  const handleSeedProducts = async () => {
    try {
      setSeedingProducts(true);
      await seedProducts(sampleProducts);
      toast.success("Sample products added successfully");
      // Reload products to see the newly added ones
      await loadProducts();
    } catch (error) {
      console.error("Error seeding products:", error);
      toast.error("Failed to add sample products");
    } finally {
      setSeedingProducts(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tnTrendy-purple-dark">Manage Products</h1>
        <div className="flex gap-2">
          <Button
            onClick={loadProducts}
            variant="outline"
            className="flex items-center"
            disabled={loading}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          
          {products.length === 0 && (
            <Button
              onClick={handleSeedProducts}
              variant="outline"
              className="flex items-center"
              disabled={seedingProducts}
            >
              <Database className="mr-2 h-4 w-4" />
              {seedingProducts ? "Adding..." : "Add Sample Products"}
            </Button>
          )}
          
          <Button
            onClick={() => navigate("/admin/products/add")}
            className="btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tnTrendy-purple-vivid"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Products</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadProducts} className="bg-red-600 hover:bg-red-700 text-white">
            Try Again
          </Button>
        </div>
      ) : products.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: "50px" }}>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Subscription Options</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                      onError={handleImageError}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.category || "Uncategorized"}</TableCell>
                  <TableCell>{product.subscriptionOptions.join(", ")}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="text-tnTrendy-gray hover:text-tnTrendy-purple-dark mr-1"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="text-tnTrendy-gray hover:text-tnTrendy-purple-vivid mr-1"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(product.id)}
                      className="text-tnTrendy-gray hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-4">No products found</h3>
          <p className="text-tnTrendy-gray mb-6">
            Start by adding your first product to the store or use the "Add Sample Products" button to quickly populate your store.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleSeedProducts}
              className="btn-secondary inline-flex items-center"
              disabled={seedingProducts}
            >
              <Database className="mr-2 h-4 w-4" />
              {seedingProducts ? "Adding..." : "Add Sample Products"}
            </Button>
            <Button
              onClick={() => navigate("/admin/products/add")}
              className="btn-primary inline-flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Product
            </Button>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this product. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProducts;
