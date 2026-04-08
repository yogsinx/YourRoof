import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building } from '@phosphor-icons/react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function RecentViewed() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentViewed();
  }, []);

  const fetchRecentViewed = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/recent-views`, { withCredentials: true });
      setProperties(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-4xl font-black mb-6 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }}>
          Recently Viewed
        </h1>
        {loading ? (
          <div>Loading...</div>
        ) : properties.length === 0 ? (
          <Card className="rounded-sm">
            <CardContent className="py-12 text-center text-muted-foreground">
              No recently viewed properties
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property._id} className="rounded-sm hover-lift">
                <div className="h-48 bg-muted flex items-center justify-center">
                  {property.images?.[0] ? (
                    <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <Building size={48} className="text-muted-foreground" />
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{property.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{property.location}, {property.city}</p>
                  <Link to={`/properties/${property._id}`}>
                    <Button size="sm" className="w-full rounded-sm">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
