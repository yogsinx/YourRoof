import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, MapPin, Bed, Bathtub, ArrowsOut, Calendar, Heart, ArrowLeft } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    message: ''
  });

  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProperty = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/properties/${id}`);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Property not found');
      navigate('/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/appointments`,
        { ...appointmentData, property_id: id },
        { withCredentials: true }
      );
      toast.success('Appointment booked successfully!');
      setAppointmentOpen(false);
      setAppointmentData({ date: '', time: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to book appointment');
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="crystal-glass border-b border-border/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Building size={28} weight="bold" />
            <span className="text-xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/properties">
              <Button variant="ghost" className="rounded-sm">
                <ArrowLeft className="mr-2" size={20} />
                Back to Properties
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Property Image */}
        <div className="relative h-96 md:h-[500px] bg-muted rounded-sm overflow-hidden mb-12">
          {property.images && property.images.length > 0 ? (
            <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building size={64} className="text-muted-foreground" />
            </div>
          )}
          {property.featured && (
            <div className="absolute top-6 left-6 bg-accent text-accent-foreground px-4 py-2 rounded-sm text-sm font-bold">
              FEATURED
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="property-title">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin size={20} />
              <span className="text-lg">{property.location}, {property.city}</span>
            </div>

            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border/40">
              {property.bedrooms && (
                <div className="flex items-center gap-2">
                  <Bed size={24} />
                  <span className="text-lg">{property.bedrooms} Bedrooms</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-2">
                  <Bathtub size={24} />
                  <span className="text-lg">{property.bathrooms} Bathrooms</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ArrowsOut size={24} />
                <span className="text-lg">{property.area_sqft} sqft</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>Description</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border border-border/40 rounded-sm">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-border/40 rounded-sm p-6 bg-card">
                <div className="mb-6">
                  <div className="text-sm text-muted-foreground mb-2">Price</div>
                  <div className="text-4xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>
                    {formatPrice(property.price)}
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-border/40">
                  <div className="text-sm text-muted-foreground mb-2">Status</div>
                  <div className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-sm text-sm font-medium">
                    {property.status.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>

                <div className="mb-6 pb-6 border-b border-border/40">
                  <div className="text-sm text-muted-foreground mb-2">Type</div>
                  <div className="text-lg font-medium capitalize">{property.property_type}</div>
                </div>

                <Dialog open={appointmentOpen} onOpenChange={setAppointmentOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full rounded-sm mb-3" data-testid="book-appointment-button">
                      <Calendar className="mr-2" size={20} />
                      Book Site Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-sm">
                    <DialogHeader>
                      <DialogTitle>Schedule Site Visit</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleBookAppointment} className="space-y-4">
                      <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          className="rounded-sm mt-1.5"
                          value={appointmentData.date}
                          onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                          required
                          data-testid="appointment-date-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          className="rounded-sm mt-1.5"
                          value={appointmentData.time}
                          onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                          required
                          data-testid="appointment-time-input"
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea
                          id="message"
                          className="rounded-sm mt-1.5"
                          placeholder="Any specific requirements?"
                          value={appointmentData.message}
                          onChange={(e) => setAppointmentData({ ...appointmentData, message: e.target.value })}
                          data-testid="appointment-message-input"
                        />
                      </div>
                      <Button type="submit" className="w-full rounded-sm" data-testid="submit-appointment-button">
                        Confirm Booking
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <div className="text-center text-sm text-muted-foreground">
                  <p>Need help?</p>
                  <a href="tel:+919068987898" className="text-accent hover:underline">
                    Call +91-9068987898
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
