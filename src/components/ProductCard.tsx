
import { Link } from "react-router-dom";
import { Product } from "@/models/Product";
import placeholderImage from "../assets/placeholder-1.jpg";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Function to handle image loading errors
  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md card-hover transition-all duration-300 hover:shadow-lg">
        <div className="h-56 overflow-hidden relative">
          <img
            src={imageError ? placeholderImage : product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={handleImageError}
            loading="lazy" // Add lazy loading for better performance
          />
          <div className="absolute bottom-0 left-0 bg-tnTrendy-purple-vivid text-white px-3 py-1 rounded-tr-md">
            ${product.price.toFixed(2)}
          </div>
          {product.featured && (
            <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs rounded-md">
              Featured
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-tnTrendy-purple-dark truncate">{product.name}</h3>
          <p className="text-tnTrendy-gray text-sm mt-1 line-clamp-2">{product.description}</p>
          <div className="mt-3 inline-block btn-primary w-full text-center">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
