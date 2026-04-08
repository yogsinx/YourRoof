import { Link, useLocation } from 'react-router-dom';
import { House, ChartBar, Clock, Calendar, Heart, User, Building, Users, FileText, Star } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const buyerLinks = [
    { to: '/dashboard', icon: House, label: 'Dashboard' },
    { to: '/analytics', icon: ChartBar, label: 'Analytics' },
    { to: '/recent-viewed', icon: Clock, label: 'Recent Viewed' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/favorites', icon: Heart, label: 'Favorites' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const sellerLinks = [
    { to: '/dashboard', icon: House, label: 'Dashboard' },
    { to: '/analytics', icon: ChartBar, label: 'Analytics' },
    { to: '/my-properties', icon: Building, label: 'My Properties' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/featured-properties', icon: Star, label: 'Featured Properties' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const agentLinks = [
    { to: '/dashboard', icon: House, label: 'Dashboard' },
    { to: '/analytics', icon: ChartBar, label: 'Analytics' },
    { to: '/clients', icon: Users, label: 'Clients' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/leads', icon: FileText, label: 'Leads' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const adminLinks = [
    { to: '/dashboard', icon: House, label: 'Dashboard' },
    { to: '/admin', icon: Building, label: 'Admin Panel' },
    { to: '/analytics', icon: ChartBar, label: 'Analytics' },
    { to: '/profile', icon: User, label: 'Profile' }
  ];

  const links = user?.role === 'admin' ? adminLinks :
                user?.role === 'buyer' ? buyerLinks :
                user?.role === 'seller' ? sellerLinks :
                user?.role === 'agent' ? agentLinks : buyerLinks;

  return (
    <div className="w-64 bg-card border-r border-border/40 min-h-screen fixed left-0 top-0 pt-20">
      <div className="p-6">
        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-1">Welcome back,</div>
          <div className="font-semibold" style={{ fontFamily: 'Cabinet Grotesk' }}>{user?.name}</div>
          <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/10 hover:text-foreground'
                }`}
                data-testid={`sidebar-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}