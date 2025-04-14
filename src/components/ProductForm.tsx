
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/models/Product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { addProduct, updateProduct } from "@/services/productService";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
}

const ProductForm = ({ product, isEditing = false }: ProductFormProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [subscriptionOptions, setSubscriptionOptions] = useState<string[]>(["1 Year", "2 Years", "3 Years"]);
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product && isEditing) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setImagePreview(product.image);
      setSubscriptionOptions(product.subscriptionOptions);
      setCategory(product.category || "");
      setFeatured(product.featured || false);
    }
  }, [product, isEditing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubscriptionOptionChange = (option: string, checked: boolean) => {
    if (checked) {
      setSubscriptionOptions([...subscriptionOptions, option]);
    } else {
      setSubscriptionOptions(subscriptionOptions.filter(opt => opt !== option));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!name || !description || !price) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      if (!isEditing && !imageFile) {
        toast.error("Please upload an image");
        setIsSubmitting(false);
        return;
      }
      
      if (subscriptionOptions.length === 0) {
        toast.error("Please select at least one subscription option");
        setIsSubmitting(false);
        return;
      }
      
      // Convert price to number
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        toast.error("Please enter a valid price");
        setIsSubmitting(false);
        return;
      }
      
      if (isEditing && product) {
        // Update existing product
        await updateProduct(
          product.id,
          {
            name,
            description,
            price: priceValue,
            subscriptionOptions,
            category,
            featured
          },
          imageFile || undefined
        );
        toast.success("Product updated successfully");
      } else {
        // Add new product
        if (!imageFile) throw new Error("Image is required");
        
        // Add new product
        await addProduct(
          {
            name,
            description,
            price: priceValue,
            image: "",  // This will be set by the addProduct function
            subscriptionOptions,
            category,
            featured
          },
          imageFile
        );
        toast.success("Product added successfully");
      }
      
      // Navigate back to admin products
      navigate("/admin/products");
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "add"} product`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter product description"
          rows={4}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="price">Price ($)</Label>
        <Input
          id="price"
          type="number"
          min="0.01"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter product price"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter product category"
        />
      </div>
      
      <div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={featured}
            onCheckedChange={(checked) => setFeatured(checked as boolean)}
          />
          <Label htmlFor="featured">Featured Product</Label>
        </div>
      </div>
      
      <div>
        <Label>Subscription Options</Label>
        <div className="space-y-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="option1"
              checked={subscriptionOptions.includes("1 Year")}
              onCheckedChange={(checked) => 
                handleSubscriptionOptionChange("1 Year", checked as boolean)
              }
            />
            <Label htmlFor="option1">1 Year</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="option2"
              checked={subscriptionOptions.includes("2 Years")}
              onCheckedChange={(checked) => 
                handleSubscriptionOptionChange("2 Years", checked as boolean)
              }
            />
            <Label htmlFor="option2">2 Years</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="option3"
              checked={subscriptionOptions.includes("3 Years")}
              onCheckedChange={(checked) => 
                handleSubscriptionOptionChange("3 Years", checked as boolean)
              }
            />
            <Label htmlFor="option3">3 Years</Label>
          </div>
        </div>
      </div>
      
      <div>
        <Label htmlFor="image">Product Image</Label>
        <div className="mt-1 flex items-center">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="flex-1"
            required={!isEditing}
          />
        </div>
        
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm text-tnTrendy-gray mb-2">Image Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-md border border-tnTrendy-gray-soft"
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/admin/products")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
