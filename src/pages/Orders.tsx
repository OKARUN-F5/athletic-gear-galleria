
import { useEffect, useState } from 'react';
import { Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTemplate from './PageTemplate';
import { Button } from "@/components/ui/button";
import { useRegion } from '@/contexts/RegionContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface Order {
  id: string;
  date: string;
  status: string;
  items: number;
  total: string;
  statusClass: string;
}

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'in transit':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'pending':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Orders = () => {
  const { getCurrencySymbol } = useRegion();
  const { user } = useAuth();
  const currencySymbol = getCurrencySymbol();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (error) {
          console.error('Error fetching orders:', error);
          return;
        }
        
        const formattedOrders: Order[] = data.map(order => ({
          id: order.id,
          date: new Date(order.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          status: order.status,
          items: order.items,
          total: order.total,
          statusClass: getStatusClass(order.status),
        }));
        
        setOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user]);

  return (
    <PageTemplate title="My Orders">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-6 w-20 mt-2" />
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-t pt-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                  <div>
                    <h4 className="font-semibold">Order #{order.id.substring(0, 8)}</h4>
                    <p className="text-sm text-gray-600">Placed on {order.date}</p>
                    <div className="mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${order.statusClass}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    {order.status.toLowerCase() === 'in transit' && (
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-t pt-4">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{order.items} items</span>
                  <span className="text-sm font-medium">{currencySymbol}{parseFloat(order.total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
            <p className="mt-2 text-gray-600">
              When you place an order, it will appear here
            </p>
            <Button className="mt-4" asChild>
              <Link to="/products">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default Orders;
