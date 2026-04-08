import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChartBar, Calendar, Heart, Eye, Building, TrendUp } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function DashboardNew() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      let endpoint = '';
      if (user?.role === 'buyer') endpoint = '/api/analytics/buyer';
      else if (user?.role === 'seller') endpoint = '/api/analytics/seller';
      else if (user?.role === 'agent') endpoint = '/api/analytics/agent';

      if (endpoint) {
        const { data } = await axios.get(`${API_URL}${endpoint}`, { withCredentials: true });
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBuyerStats = () => [
    { title: 'Saved Properties', value: stats?.total_favorites || 0, icon: Heart, color: 'text-red-500' },
    { title: 'Scheduled Visits', value: stats?.total_appointments || 0, icon: Calendar, color: 'text-blue-500' },
    { title: 'Properties Viewed', value: stats?.total_views || 0, icon: Eye, color: 'text-green-500' }
  ];

  const getSellerStats = () => [
    { title: 'Listed Properties', value: stats?.total_properties || 0, icon: Building, color: 'text-blue-500' },
    { title: 'Total Inquiries', value: stats?.total_inquiries || 0, icon: TrendUp, color: 'text-green-500' },
    { title: 'Featured Properties', value: stats?.featured_properties || 0, icon: Heart, color: 'text-purple-500' }
  ];

  const getAgentStats = () => [
    { title: 'Total Earned', value: `₹${(stats?.total_earned || 0).toLocaleString()}`, icon: TrendUp, color: 'text-green-500' },
    { title: 'Pending Commission', value: `₹${(stats?.pending_commissions || 0).toLocaleString()}`, icon: ChartBar, color: 'text-orange-500' },
    { title: 'Total Clients', value: stats?.total_clients || 0, icon: Calendar, color: 'text-blue-500' }
  ];

  const statsData = user?.role === 'buyer' ? getBuyerStats() :
                    user?.role === 'seller' ? getSellerStats() :
                    user?.role === 'agent' ? getAgentStats() : [];

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Here's your overview.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="rounded-sm border-border/40">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <Icon className={`${stat.color}`} size={20} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-sm border-border/40">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/properties">
                    <Button variant="outline" className="w-full rounded-sm justify-start">
                      Browse Properties
                    </Button>
                  </Link>
                  <Link to="/appointments">
                    <Button variant="outline" className="w-full rounded-sm justify-start">
                      View Appointments
                    </Button>
                  </Link>
                  {user?.role === 'seller' && (
                    <Link to="/my-properties">
                      <Button variant="outline" className="w-full rounded-sm justify-start">
                        Manage My Properties
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile">
                    <Button variant="outline" className="w-full rounded-sm justify-start">
                      Edit Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="rounded-sm border-border/40">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'buyer' && 'Your recent property views and inquiries will appear here.'}
                    {user?.role === 'seller' && 'Recent inquiries on your properties will appear here.'}
                    {user?.role === 'agent' && 'Your recent client interactions will appear here.'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
