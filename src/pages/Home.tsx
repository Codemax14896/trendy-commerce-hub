
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Product, Category } from "@/models/Product";
import { getFeaturedProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock categories for now (would come from Firebase in a real app)
  const categories: Category[] = [
    {
      id: "1",
      name: "Electronics",
      description: "Latest gadgets and tech accessories",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "2",
      name: "Fashion",
      description: "Trendy clothing and accessories",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "3",
      name: "Home",
      description: "Modern furniture and decor",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80"
    }
  ];

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  // If no featured products are available yet, use placeholder data
  useEffect(() => {
    if (featuredProducts.length === 0 && !loading) {
      setFeaturedProducts([
        {
          id: "1",
          name: "Wireless Earbuds Pro",
          description: "Premium sound quality with active noise cancellation and 24-hour battery life.",
          price: 129.99,
          image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          featured: true
        },
        {
          id: "2",
          name: "Smart Home Hub",
          description: "Control your entire home with voice commands and smart automation features.",
          price: 199.99,
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          featured: true
        },
        {
          id: "3",
          name: "Premium Fitness Tracker",
          description: "Track your health metrics, workouts, and sleep patterns with this waterproof device.",
          price: 89.99,
          image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=600&q=80",
          subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
          featured: true
        }
      ]);
    }
  }, [loading, featuredProducts.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tnTrendy-purple-soft to-tnTrendy-purple-light py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl sm:text-5xl font-bold text-tnTrendy-purple-dark leading-tight mb-4 animate-fade-in">
                The Latest Trends,<br /> <span className="text-tnTrendy-purple-vivid">Right at Your Fingertips</span>
              </h1>
              <p className="text-lg text-tnTrendy-purple-dark mb-8 animate-slide-up">
                Discover our curated collection of premium products with flexible subscription options.
              </p>
              <div className="space-x-4 animate-slide-up">
                <Link to="/products" className="btn-primary">
                  Shop Now
                </Link>
                <Link to="/register" className="btn-secondary">
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 animate-fade-in">
              <img
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80"
                alt="TnTrendy Hero"
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold text-tnTrendy-purple-dark">Featured Products</h2>
            <Link to="/products" className="flex items-center text-tnTrendy-purple-vivid hover:text-tnTrendy-purple-tertiary transition-colors font-semibold">
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-tnTrendy-gray-soft animate-pulse rounded-lg h-80"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-tnTrendy-gray-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-tnTrendy-purple-dark text-center mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link to={`/products?category=${category.name}`} key={category.id}>
                <div className="bg-white rounded-lg overflow-hidden shadow-md card-hover">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-2">{category.name}</h3>
                    <p className="text-tnTrendy-gray">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-tnTrendy-purple-dark text-center mb-12">Why Choose TnTrendy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-tnTrendy-purple-soft rounded-full p-4 inline-block mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tnTrendy-purple-vivid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-3">Quality Products</h3>
              <p className="text-tnTrendy-gray">Every product is carefully selected to ensure premium quality and durability.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-tnTrendy-purple-soft rounded-full p-4 inline-block mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tnTrendy-purple-vivid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-3">Flexible Subscriptions</h3>
              <p className="text-tnTrendy-gray">Choose from 1, 2, or 3-year subscription options to fit your needs and budget.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-tnTrendy-purple-soft rounded-full p-4 inline-block mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-tnTrendy-purple-vivid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-3">Easy Communication</h3>
              <p className="text-tnTrendy-gray">Contact us directly through WhatsApp or Telegram for quick and convenient support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 bg-tnTrendy-purple">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience TnTrendy?</h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover why we're the preferred choice for trendy products and flexible subscriptions.
          </p>
          <div className="space-x-4">
            <Link to="/products" className="bg-white text-tnTrendy-purple-vivid hover:bg-tnTrendy-gray-soft font-semibold py-3 px-6 rounded-md transition-colors">
              Browse Products
            </Link>
            <Link to="/register" className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-md transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
