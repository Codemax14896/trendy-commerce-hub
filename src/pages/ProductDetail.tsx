
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Product } from "@/models/Product";
import { getProduct } from "@/services/productService";
import { createOrder } from "@/services/orderService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { MessageSquare, Send } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<string>("");
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productData = await getProduct(id);
        setProduct(productData);
        
        // Set default subscription option
        if (productData && productData.subscriptionOptions.length > 0) {
          setSelectedSubscription(productData.subscriptionOptions[0]);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Error loading product details");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // If no product is loaded yet, use placeholder data
  useEffect(() => {
    if (!product && !loading && id) {
      // This is placeholder data for development only
      const placeholderProduct = {
        id,
        name: "Premium Wireless Earbuds",
        description: "These top-of-the-line wireless earbuds feature active noise cancellation, 24-hour battery life, and crystal-clear sound quality. Perfect for workouts, commutes, or just enjoying your favorite music anywhere. Comes with a compact charging case that provides multiple charges on the go. Sweat and water-resistant design ensures durability in various conditions.",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
        subscriptionOptions: ["1 Year", "2 Years", "3 Years"],
        category: "Electronics"
      };
      
      setProduct(placeholderProduct);
      setSelectedSubscription(placeholderProduct.subscriptionOptions[0]);
    }
  }, [loading, product, id]);

  const handlePurchase = async () => {
    if (!currentUser) {
      toast("Please log in to purchase", {
        description: "You need to be logged in to make a purchase",
        action: {
          label: "Login",
          onClick: () => navigate("/login")
        }
      });
      return;
    }
    
    if (!product || !selectedSubscription) {
      toast.error("Please select a subscription option");
      return;
    }
    
    try {
      await createOrder(
        currentUser.uid,
        product.id,
        product.name,
        selectedSubscription,
        product.price
      );
      
      toast.success("Subscription purchased successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to purchase subscription");
    }
  };

  const handleContactWhatsApp = () => {
    if (!product) return;
    
    const phoneNumber = "1234567890"; // Replace with your actual phone number
    const message = `Hi I am interested in buying ${product.name} from TnTrendy.`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleContactTelegram = () => {
    if (!product) return;
    
    const username = "YourTelegramUsername"; // Replace with your actual Telegram username
    const message = `Hi I am interested in buying ${product.name} from TnTrendy.`;
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://t.me/${username}?text=${encodedMessage}`, "_blank");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tnTrendy-purple-vivid"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-tnTrendy-purple-dark mb-4">Product Not Found</h2>
          <p className="text-tnTrendy-gray mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/products")} className="btn-primary">
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-tnTrendy-purple-dark mb-2">{product.name}</h1>
          <div className="text-2xl font-semibold text-tnTrendy-purple-vivid mb-6">
            ${product.price.toFixed(2)}
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-tnTrendy-purple-dark mb-3">Description</h3>
            <p className="text-tnTrendy-gray">{product.description}</p>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-tnTrendy-purple-dark mb-3">Subscription Options</h3>
            <div className="grid grid-cols-3 gap-3">
              {product.subscriptionOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedSubscription(option)}
                  className={`border rounded-md py-3 px-4 text-center transition-colors ${
                    selectedSubscription === option
                      ? "border-tnTrendy-purple-vivid bg-tnTrendy-purple-soft text-tnTrendy-purple-vivid"
                      : "border-tnTrendy-gray-soft text-tnTrendy-gray hover:border-tnTrendy-purple"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Purchase and Contact Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Button onClick={handlePurchase} className="btn-primary">
              Purchase Subscription
            </Button>
            
            <Tabs defaultValue="whatsapp" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="telegram">Telegram</TabsTrigger>
              </TabsList>
              <TabsContent value="whatsapp">
                <Card>
                  <CardContent className="p-4">
                    <Button
                      onClick={handleContactWhatsApp}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact on WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="telegram">
                <Card>
                  <CardContent className="p-4">
                    <Button
                      onClick={handleContactTelegram}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Contact on Telegram
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Additional Info */}
          <div className="border-t border-tnTrendy-gray-soft pt-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-tnTrendy-gray">Category:</span>
                <span className="text-tnTrendy-purple-dark ml-2 font-medium">
                  {product.category || "Uncategorized"}
                </span>
              </div>
              <div>
                <span className="text-tnTrendy-gray">Warranty:</span>
                <span className="text-tnTrendy-purple-dark ml-2 font-medium">
                  Included in subscription
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
