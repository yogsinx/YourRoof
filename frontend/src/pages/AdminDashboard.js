import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, SignOut, Users, MapPin, CalendarCheck, Envelope, CurrencyDollar, TrendUp } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [leads, setLeads] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [analyticsRes, leadsRes, appointmentsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/api/analytics/overview`, { withCredentials: true }),
        axios.get(`${API_URL}/api/leads`, { withCredentials: true }),
        axios.get(`${API_URL}/api/appointments`, { withCredentials: true }),
        axios.get(`${API_URL}/api/users`, { withCredentials: true })
      ]);

      setAnalytics(analyticsRes.data);
      setLeads(leadsRes.data);
      setAppointments(appointmentsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const updateLeadStatus = async (leadId, status) => {
    try {
      await axios.put(
        `${API_URL}/api/leads/${leadId}`,
        { status },
        { withCredentials: true }
      );
      toast.success('Lead status updated');
      fetchData();
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
      fetchData();
    } catch (error) {
      toast.error('Failed to update appointment status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="crystal-glass border-b border-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <Building size={28} weight="bold" />
            <span className="text-xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof Admin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" className="rounded-sm">My Dashboard</Button>
            </Link>
            <Button variant="outline" className="rounded-sm" onClick={handleLogout} data-testid="logout-button">
              <SignOut className="mr-2" size={20} />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="admin-heading">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage properties, leads, and track performance
          </p>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="rounded-sm border-border/40 grid-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <MapPin className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="total-properties">
                {analytics?.total_properties || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-border/40 grid-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Envelope className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="total-leads">
                {analytics?.total_leads || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics?.new_leads || 0} new leads
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-border/40 grid-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <CalendarCheck className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="total-appointments">
                {analytics?.total_appointments || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics?.pending_appointments || 0} pending
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-border/40 grid-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="total-users">
                {analytics?.total_users || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Management */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3 rounded-sm">
            <TabsTrigger value="leads" className="rounded-sm" data-testid="leads-tab">
              Leads
            </TabsTrigger>
            <TabsTrigger value="appointments" className="rounded-sm" data-testid="appointments-tab">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="users" className="rounded-sm" data-testid="users-tab">
              Users
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
      </div>
    </div>
  );
}
