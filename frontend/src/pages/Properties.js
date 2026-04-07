import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Building, MagnifyingGlass, Funnel, MapPin, Bed, Bathtub, ArrowsOut, Heart } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    property_type: '',
    status: '',
    city: '',
    featured: null
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.property_type) params.append('property_type', filters.property_type);
      if (filters.status) params.append('status', filters.status);
      if (filters.city) params.append('city', filters.city);
      if (filters.featured !== null) params.append('featured', filters.featured);

      const { data } = await axios.get(`${API_URL}/api/properties?${params.toString()}`);
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
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
            {user ? (
              <Link to="/dashboard">
                <Button className="rounded-sm" data-testid="nav-dashboard-button">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="rounded-sm" data-testid="nav-login-button">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button className="rounded-sm" data-testid="nav-register-button">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="properties-heading">
            Discover Properties
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse our curated collection of premium real estate
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 p-6 border border-border/40 rounded-sm bg-card" data-testid="filters-section">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select value={filters.property_type} onValueChange={(value) => setFilters({ ...filters, property_type: value === 'all' ? '' : value })}>
                <SelectTrigger className="rounded-sm" data-testid="filter-property-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? '' : value })}>
                <SelectTrigger className="rounded-sm" data-testid="filter-status">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ready_to_move">Ready to Move</SelectItem>
                  <SelectItem value="under_construction">Under Construction</SelectItem>
                  <SelectItem value="new_launch">New Launch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">City</label>
              <Input
                placeholder="Search by city"
                className="rounded-sm"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                data-testid="filter-city-input"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Featured</label>
              <Select value={filters.featured === null ? 'all' : String(filters.featured)} onValueChange={(value) => setFilters({ ...filters, featured: value === 'all' ? null : value === 'true' })}>
                <SelectTrigger className="rounded-sm" data-testid="filter-featured">
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="true">Featured Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12" data-testid="loading-state">
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <p className="text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="properties-grid">
            {properties.map((property) => (
              <div key={property.id} className="border border-border/40 rounded-sm overflow-hidden hover-lift bg-card" data-testid={`property-card-${property.id}`}>
                <div className="relative h-56 bg-muted overflow-hidden">
                  {property.images && property.images.length > 0 ? (
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building size={48} className="text-muted-foreground" />
                    </div>
                  )}
                  {property.featured && (
                    <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-sm text-xs font-bold">
                      FEATURED
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-sm text-xs font-medium">
                    {property.status.replace(/_/g, ' ').toUpperCase()}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2" style={{ fontFamily: 'Cabinet Grotesk' }}>
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin size={16} />
                    <span>{property.location}, {property.city}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed size={16} />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bathtub size={16} />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <ArrowsOut size={16} />
                      <span>{property.area_sqft} sqft</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="text-2xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>
                      {formatPrice(property.price)}
                    </div>
                    <Link to={`/properties/${property.id}`}>
                      <Button className="rounded-sm" data-testid={`view-details-button-${property.id}`}>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
