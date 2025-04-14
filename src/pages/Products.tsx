
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/models/Product";
import { getProducts, getProductsByCategory } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Search, FilterX } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        
        let loadedProducts: Product[];
        if (selectedCategory) {
          loadedProducts = await getProductsByCategory(selectedCategory);
        } else {
          loadedProducts = await getProducts();
        }
        
        setProducts(loadedProducts);
        setFilteredProducts(loadedProducts);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(loadedProducts.map((product) => product.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCategories);

        // Find max price for slider
        if (loadedProducts.length > 0) {
          const maxPrice = Math.max(
            ...loadedProducts.map((product) => product.price)
          );
          setPriceRange([0, Math.ceil(maxPrice)]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  // If no products are available yet, use placeholder data
  useEffect(() => {
    if (products.length === 0 && !loading) {
      const placeholderProducts = [
        {
          id: "1",
          name: "Wireless Earbuds Pro",
          description: "Premium sound quality with active noise cancellation and 24-hour battery life.",
          price: 129.99,
          image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          category: "Electronics"
        },
        {
          id: "2",
          name: "Smart Home Hub",
          description: "Control your entire home with voice commands and smart automation features.",
          price: 199.99,
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          category: "Electronics"
        },
        {
          id: "3",
          name: "Premium Fitness Tracker",
          description: "Track your health metrics, workouts, and sleep patterns with this waterproof device.",
          price: 89.99,
          image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          category: "Electronics"
        },
        {
          id: "4",
          name: "Stylish Desk Lamp",
          description: "Modern design with adjustable brightness and color temperature.",
          price: 49.99,
          image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          category: "Home"
        },
        {
          id: "5",
          name: "Portable Bluetooth Speaker",
          description: "Waterproof speaker with 20-hour battery life and immersive sound.",
          price: 79.99,
          image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          category: "Electronics"
        },
        {
          id: "6",
          name: "Smart Watch",
          description: "Fitness tracking, notifications, and apps on your wrist.",
          price: 249.99,
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          category: "Electronics"
        }
      ];
      
      setProducts(placeholderProducts);
      setFilteredProducts(placeholderProducts);
      setCategories(["Electronics", "Home"]);
      setPriceRange([0, 250]);
    }
  }, [loading, products.length]);

  useEffect(() => {
    // Apply filters
    const result = products.filter((product) => {
      // Search term filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      
      // Price range filter
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect above
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange([0, Math.max(...products.map(p => p.price))]);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-tnTrendy-purple-dark mb-8">Products</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-tnTrendy-purple-dark mb-6">Filters</h2>
            
            <form onSubmit={handleSearch}>
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
            </form>
            
            <div className="mb-6">
              <h3 className="font-medium text-tnTrendy-purple-dark mb-3">Categories</h3>
              <div className="space-y-2">
                <div>
                  <button
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
                defaultValue={[0, 250]}
                value={priceRange}
                onValueChange={setPriceRange}
                max={Math.max(...products.map(p => Math.ceil(p.price)), 250)}
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
