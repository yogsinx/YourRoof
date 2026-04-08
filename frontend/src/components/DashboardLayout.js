import { Link, useNavigate } from 'react-router-dom';
import { Building, SignOut, Settings } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="crystal-glass border-b border-border/40 fixed top-0 left-0 right-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 ml-64" data-testid="nav-logo">
            <Building size={28} weight="bold" />
            <span className="text-xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/properties">
              <Button variant="ghost" className="rounded-sm">Browse Properties</Button>
            </Link>
            <Button variant="outline" className="rounded-sm" onClick={handleLogout} data-testid="logout-button">
              <SignOut className="mr-2" size={20} />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 pt-20 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
