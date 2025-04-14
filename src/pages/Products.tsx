
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/models/Product";
import { getProducts, getProductsByCategory } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, FilterX, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

// Import local placeholder images for fallback
import placeholderImage1 from "../assets/placeholder-1.jpg";
import placeholderImage2 from "../assets/placeholder-2.jpg";
import placeholderImage3 from "../assets/placeholder-3.jpg";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialCategory = searchParams.get("category") || "";
    setSelectedCategory(initialCategory);
    
    loadProducts(initialCategory);
  }, [searchParams]);

  const loadProducts = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let loadedProducts: Product[];
      
      if (category) {
        loadedProducts = await getProductsByCategory(category);
      } else {
        loadedProducts = await getProducts();
      }
      
      console.log("Products loaded:", loadedProducts.length);
      setProducts(loadedProducts);
      
      // Extract unique categories from products
      const uniqueCategories = Array.from(
        new Set(loadedProducts.map((product) => product.category).filter(Boolean))
      ) as string[];
      
      setCategories(uniqueCategories);
      
      // Find max price for slider
      if (loadedProducts.length > 0) {
        const maxProductPrice = Math.max(...loadedProducts.map((product) => product.price));
        const roundedMaxPrice = Math.ceil(maxProductPrice / 100) * 100; // Round up to nearest 100
        setMaxPrice(roundedMaxPrice);
        setPriceRange([0, roundedMaxPrice]);
      }
      
      // Apply initial filter
      applyFilters(loadedProducts, searchTerm, category, [0, maxPrice]);
      
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products. Please try refreshing the page.");
      toast.error("Failed to load products");
      
      // Use placeholder data as fallback
      const placeholderProducts = getPlaceholderProducts();
      setProducts(placeholderProducts);
      
      // Extract categories from placeholder data
      const placeholderCategories = Array.from(
        new Set(placeholderProducts.map((product) => product.category).filter(Boolean))
      ) as string[];
      
      setCategories(placeholderCategories);
      applyFilters(placeholderProducts, searchTerm, category, [0, 250]);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const getPlaceholderProducts = (): Product[] => {
    return [
      {
        id: "placeholder1",
        name: "Wireless Earbuds Pro",
        description: "Premium sound quality with active noise cancellation and 24-hour battery life.",
        price: 129.99,
        image: placeholderImage1,
        subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
        category: "Electronics"
      },
      {
        id: "placeholder2",
        name: "Smart Home Hub",
        description: "Control your entire home with voice commands and smart automation features.",
        price: 199.99,
        image: placeholderImage2,
        subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
        category: "Electronics"
      },
      {
        id: "placeholder3",
        name: "Premium Fitness Tracker",
        description: "Track your health metrics, workouts, and sleep patterns with this waterproof device.",
        price: 89.99,
        image: placeholderImage3,
        subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
        category: "Electronics"
      },
      {
        id: "placeholder4",
        name: "Stylish Desk Lamp",
        description: "Modern design with adjustable brightness and color temperature.",
        price: 49.99,
        image: placeholderImage1,
        subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
        category: "Home"
      },
      {
        id: "placeholder5",
        name: "Portable Bluetooth Speaker",
        description: "Waterproof speaker with 20-hour battery life and immersive sound.",
        price: 79.99,
        image: placeholderImage2,
        subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
        category: "Electronics"
      },
      {
        id: "placeholder6",
        name: "Smart Watch",
        description: "Fitness tracking, notifications, and apps on your wrist.",
        price: 249.99,
        image: placeholderImage3,
        subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
        category: "Electronics"
      }
    ];
  };

  const applyFilters = (
    productsToFilter: Product[],
    search: string,
    category: string,
    price: [number, number]
  ) => {
    let result = [...productsToFilter];
    
    // Search term filter (case insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Category filter
    if (category) {
      result = result.filter(product => product.category === category);
    }
    
    // Price range filter
    result = result.filter(product => 
      product.price >= price[0] && product.price <= price[1]
    );
    
    setFilteredProducts(result);
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters(products, searchTerm, selectedCategory, priceRange);
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange([0, maxPrice]);
    setSearchParams({});
    
    // Reset filters and show all products
    applyFilters(products, "", "", [0, maxPrice]);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    loadProducts(selectedCategory);
  };

  // Apply filters when filter settings change
  useEffect(() => {
    if (products.length > 0 && !initialLoading) {
      applyFilters(products, searchTerm, selectedCategory, priceRange);
    }
  }, [searchTerm, selectedCategory, priceRange[0], priceRange[1], initialLoading]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-tnTrendy-purple-dark">Products</h1>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center"
          disabled={loading}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-tnTrendy-purple-dark mb-6">Filters</h2>
            
            <form onSubmit={handleSearch} className="mb-6">
              <div className="mb-6">
                <Label htmlFor="search" className="block mb-2">Search</Label>
                <div className="relative">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-tnTrendy-gray" />
                </div>
              </div>
              <Button type="submit" className="w-full">Search</Button>
            </form>
            
            <div className="mb-6">
              <h3 className="font-medium text-tnTrendy-purple-dark mb-3">Categories</h3>
              <div className="space-y-2">
                <div>
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("")}
                    className={`text-sm block w-full text-left px-2 py-1.5 rounded ${
                      selectedCategory === ""
                        ? "text-tnTrendy-purple-vivid bg-tnTrendy-purple-soft font-medium"
                        : "text-tnTrendy-gray hover:text-tnTrendy-purple-dark hover:bg-tnTrendy-gray-soft"
                    }`}
                  >
                    All Categories
                  </button>
                </div>
                
                {categories.map((category) => (
                  <div key={category}>
                    <button
                      type="button"
                      onClick={() => handleCategoryChange(category)}
                      className={`text-sm block w-full text-left px-2 py-1.5 rounded ${
                        selectedCategory === category
                          ? "text-tnTrendy-purple-vivid bg-tnTrendy-purple-soft font-medium"
                          : "text-tnTrendy-gray hover:text-tnTrendy-purple-dark hover:bg-tnTrendy-gray-soft"
                      }`}
                    >
                      {category}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-tnTrendy-purple-dark mb-3">Price Range</h3>
              <Slider
                defaultValue={[0, maxPrice]}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                max={maxPrice}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-tnTrendy-gray">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            <Button
              type="button"
              onClick={handleClearFilters}
              className="w-full flex items-center justify-center gap-2 btn-secondary"
            >
              <FilterX className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-tnTrendy-gray-soft animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-amber-800 mb-2">Notice</h3>
              <p className="text-amber-700 mb-4">{error}</p>
              <Button onClick={handleRefresh} className="bg-amber-600 hover:bg-amber-700 text-white">
                Try Again
              </Button>
              {filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-2">No products found</h3>
              <p className="text-tnTrendy-gray mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <Button
                type="button"
                onClick={handleClearFilters}
                className="btn-primary inline-flex items-center"
              >
                <FilterX className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
