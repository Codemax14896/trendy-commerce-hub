
import { Link } from "react-router-dom";
import { Product } from "@/models/Product";
import placeholderImage from "../assets/placeholder-1.jpg";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = placeholderImage;
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md card-hover">
        <div className="h-56 overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={handleImageError}
            loading="lazy" // Add lazy loading for better performance
          />
          <div className="absolute bottom-0 left-0 bg-tnTrendy-purple-vivid text-white px-3 py-1 rounded-tr-md">
            ${product.price.toFixed(2)}
          </div>
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
