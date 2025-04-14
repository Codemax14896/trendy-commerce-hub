
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "@/models/Product";
import { getProduct } from "@/services/productService";
import ProductForm from "@/components/ProductForm";
import { toast } from "sonner";

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        navigate("/admin/products");
        return;
      }
      
      try {
        setLoading(true);
        const productData = await getProduct(id);
        
        if (!productData) {
          toast.error("Product not found");
          navigate("/admin/products");
          return;
        }
        
        setProduct(productData);
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product details");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tnTrendy-purple-vivid"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-tnTrendy-purple-dark mb-8">
        Edit Product: {product?.name}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {product && <ProductForm product={product} isEditing={true} />}
      </div>
    </div>
  );
};

export default EditProduct;
