
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Order } from "@/models/Product";
import { getUserOrders } from "@/services/orderService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar, Package2 } from "lucide-react";

const Orders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const userOrders = await getUserOrders(currentUser.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [currentUser]);

  // If no orders are loaded yet, use placeholder data for development
  useEffect(() => {
    if (orders.length === 0 && !loading && currentUser) {
      // Placeholder data
      const currentDate = new Date();
      const oneYearLater = new Date(currentDate);
      oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
      
      const twoYearsLater = new Date(currentDate);
      twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);
      
      const placeholderOrders = [
        {
          id: "order1",
          userId: currentUser.uid,
          productId: "product1",
          productName: "Wireless Earbuds Pro",
          subscriptionOption: "1 Year",
          price: 129.99,
          purchaseDate: currentDate.toISOString(),
          expiryDate: oneYearLater.toISOString()
        },
        {
          id: "order2",
          userId: currentUser.uid,
          productId: "product2",
          productName: "Smart Home Hub",
          subscriptionOption: "2 Years",
          price: 199.99,
          purchaseDate: currentDate.toISOString(),
          expiryDate: twoYearsLater.toISOString()
        }
      ];
      
      setOrders(placeholderOrders);
    }
  }, [loading, orders.length, currentUser]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPP");
  };

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-tnTrendy-purple-dark mb-8">My Orders</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-tnTrendy-purple-dark flex items-center">
            <Package2 className="mr-2 h-5 w-5" />
            Your Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tnTrendy-purple-vivid"></div>
            </div>
          ) : orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Purchase Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.productName}</TableCell>
                    <TableCell>{order.subscriptionOption}</TableCell>
                    <TableCell>${order.price.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.purchaseDate)}</TableCell>
                    <TableCell>{formatDate(order.expiryDate)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isExpired(order.expiryDate)
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isExpired(order.expiryDate) ? "Expired" : "Active"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-tnTrendy-gray mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-tnTrendy-purple-dark mb-2">No subscriptions found</h3>
              <p className="text-tnTrendy-gray mb-4">
                You haven't purchased any subscriptions yet.
              </p>
              <a
                href="/products"
                className="btn-primary inline-block"
              >
                Browse Products
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
