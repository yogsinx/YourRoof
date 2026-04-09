import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChartBar, Calendar, Heart, Eye, Building, TrendUp, Users, MapPin, Envelope } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Admin Management Tabs Component
function AdminManagementTabs() {
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [leadsRes, appointmentsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/leads`, { withCredentials: true }),
        axios.get(`${API_URL}/api/appointments`, { withCredentials: true }),
        axios.get(`${API_URL}/api/users`, { withCredentials: true })
      ]);

      setLeads(leadsRes.data);
      setAppointments(appointmentsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load management data');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, status) => {
    try {
      await axios.put(
        `${API_URL}/api/leads/${leadId}`,
        { status },
        { withCredentials: true }
      );
      toast.success('Lead status updated');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `${API_URL}/api/appointments/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      toast.success('Appointment status updated');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading management data...</div>;
  }

  return (
    <Tabs defaultValue="leads" className="space-y-6">
      <TabsList className="grid w-full max-w-lg grid-cols-3 rounded-sm">
        <TabsTrigger value="leads" className="rounded-sm" data-testid="leads-tab">
          Leads ({leads.length})
        </TabsTrigger>
        <TabsTrigger value="appointments" className="rounded-sm" data-testid="appointments-tab">
          Appointments ({appointments.length})
        </TabsTrigger>
        <TabsTrigger value="users" className="rounded-sm" data-testid="users-tab">
          Users ({users.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="leads" className="space-y-4">
        {leads.length === 0 ? (
          <Card className="rounded-sm border-border/40">
            <CardContent className="py-12 text-center text-muted-foreground">
              No leads yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="rounded-sm border-border/40">
                <CardContent className="py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{lead.name}</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Email: {lead.email}</div>
                        <div>Phone: {lead.phone}</div>
                        <div>Message: {lead.message}</div>
                        <div>Source: {lead.source}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="px-3 py-1 rounded-sm text-sm border border-border/40"
                        data-testid={`lead-status-${lead.id}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="appointments" className="space-y-4">
        {appointments.length === 0 ? (
          <Card className="rounded-sm border-border/40">
            <CardContent className="py-12 text-center text-muted-foreground">
              No appointments yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <Card key={appt.id} className="rounded-sm border-border/40">
                <CardContent className="py-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold mb-1">{appt.user_name}</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Email: {appt.user_email}</div>
                        <div>Phone: {appt.user_phone}</div>
                        <div>Date: {appt.date} at {appt.time}</div>
                        {appt.message && <div>Message: {appt.message}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={appt.status}
                        onChange={(e) => updateAppointmentStatus(appt.id, e.target.value)}
                        className="px-3 py-1 rounded-sm text-sm border border-border/40"
                        data-testid={`appointment-status-${appt.id}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="users" className="space-y-4">
        {users.length === 0 ? (
          <Card className="rounded-sm border-border/40">
            <CardContent className="py-12 text-center text-muted-foreground">
              No users yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {users.map((user, index) => (
              <Card key={index} className="rounded-sm border-border/40">
                <CardContent className="py-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold mb-1">{user.name}</div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Email: {user.email}</div>
                        <div>Phone: {user.phone}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-sm text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'seller' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

export default function DashboardNew() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [adminStats, setAdminStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'admin') {
        // Fetch admin overview
        const { data } = await axios.get(`${API_URL}/api/analytics/overview`, { withCredentials: true });
        setAdminStats(data);
      } else {
        // Fetch role-specific analytics
        let endpoint = '';
        if (user?.role === 'buyer') endpoint = '/api/analytics/buyer';
        else if (user?.role === 'seller') endpoint = '/api/analytics/seller';
        else if (user?.role === 'agent') endpoint = '/api/analytics/agent';

        if (endpoint) {
          const { data } = await axios.get(`${API_URL}${endpoint}`, { withCredentials: true });
          setStats(data);
        }
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

  const getAdminStats = () => [
    { title: 'Total Properties', value: adminStats?.total_properties || 0, icon: MapPin, color: 'text-blue-500', subtitle: 'Listed on platform' },
    { title: 'Total Appointments', value: adminStats?.total_appointments || 0, icon: Calendar, color: 'text-green-500', subtitle: `${adminStats?.pending_appointments || 0} pending` },
    { title: 'Total Leads', value: adminStats?.total_leads || 0, icon: Envelope, color: 'text-orange-500', subtitle: `${adminStats?.new_leads || 0} new` },
    { title: 'Total Users', value: adminStats?.total_users || 0, icon: Users, color: 'text-purple-500', subtitle: 'Registered users' }
  ];

  const statsData = user?.role === 'admin' ? getAdminStats() :
                    user?.role === 'buyer' ? getBuyerStats() :
                    user?.role === 'seller' ? getSellerStats() :
                    user?.role === 'agent' ? getAgentStats() : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">Loading...</div>
      </DashboardLayout>
    );
  }

  // Admin Dashboard - Different Layout
  if (user?.role === 'admin') {
    return (
      <DashboardLayout>
        <div>
          <div className="mb-8">
            <h1 className="text-4xl font-black mb-2 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Platform overview and management
            </p>
          </div>

          {/* Stats Grid - 4 columns for admin */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="rounded-sm border-border/40">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <Icon className={`${stat.color}`} size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-black mb-1" style={{ fontFamily: 'Cabinet Grotesk' }}>
                      {stat.value}
                    </div>
                    {stat.subtitle && (
                      <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Management Tabs */}
          <AdminManagementTabs />
        </div>
      </DashboardLayout>
    );
  }

  // Regular User Dashboard
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
      </div>
    </DashboardLayout>
  );
}
