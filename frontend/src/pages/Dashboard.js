import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, SignOut, Calendar, Heart, User, ChartBar } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const [apptRes, favRes] = await Promise.all([
        axios.get(`${API_URL}/api/appointments`, { withCredentials: true }),
        axios.get(`${API_URL}/api/favorites`, { withCredentials: true })
      ]);
      setAppointments(apptRes.data);
      setFavorites(favRes.data);

      if (user?.role === 'agent') {
        const commRes = await axios.get(`${API_URL}/api/commissions`, { withCredentials: true });
        setCommissions(commRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="crystal-glass border-b border-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <Building size={28} weight="bold" />
            <span className="text-xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/properties">
              <Button variant="ghost" className="rounded-sm">Browse Properties</Button>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline" className="rounded-sm" data-testid="admin-dashboard-link">
                  Admin Dashboard
                </Button>
              </Link>
            )}
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
          <h1 className="text-4xl sm:text-5xl font-black mb-2 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
            Welcome, {user?.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your properties and appointments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-sm border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Appointments</CardTitle>
              <Calendar className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>
                {appointments.length}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-sm border-border/40">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Saved Properties</CardTitle>
              <Heart className="text-muted-foreground" size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>
                {favorites.length}
              </div>
            </CardContent>
          </Card>

          {user?.role === 'agent' && (
            <Card className="rounded-sm border-border/40">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Commissions</CardTitle>
                <ChartBar className="text-muted-foreground" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>
                  {commissions.length}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded-sm">
            <TabsTrigger value="appointments" className="rounded-sm" data-testid="appointments-tab">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-sm" data-testid="favorites-tab">
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            {appointments.length === 0 ? (
              <Card className="rounded-sm border-border/40">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No appointments yet
                </CardContent>
              </Card>
            ) : (
              appointments.map((appt, index) => (
                <Card key={index} className="rounded-sm border-border/40">
                  <CardContent className="py-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold mb-1">Site Visit Appointment</div>
                        <div className="text-sm text-muted-foreground">
                          Date: {appt.date} at {appt.time}
                        </div>
                        {appt.message && (
                          <div className="text-sm text-muted-foreground mt-2">
                            Message: {appt.message}
                          </div>
                        )}
                      </div>
                      <div className={`px-3 py-1 rounded-sm text-xs font-medium ${
                        appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appt.status}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <Card className="rounded-sm border-border/40">
                <CardContent className="py-12 text-center text-muted-foreground">
                  No favorite properties yet
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((property) => (
                  <Card key={property.id} className="rounded-sm border-border/40 hover-lift">
                    <div className="relative h-48 bg-muted overflow-hidden rounded-t-sm">
                      {property.images && property.images.length > 0 ? (
                        <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building size={48} className="text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{property.location}, {property.city}</p>
                      <Link to={`/properties/${property.id}`}>
                        <Button size="sm" className="w-full rounded-sm">View Details</Button>
                      </Link>
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
