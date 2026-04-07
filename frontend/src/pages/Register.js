import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, User, Phone, Envelope, Lock, UserCircle } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'buyer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8" data-testid="logo-link">
            <Building size={32} weight="bold" />
            <span className="text-2xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
          </Link>

          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Cabinet Grotesk' }}>Create Account</h1>
          <p className="text-muted-foreground mb-8">Join us to find your dream property</p>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-sm mb-6" data-testid="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="name"
                  type="text"
                  className="pl-10 rounded-sm"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="name-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  className="pl-10 rounded-sm"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="phone"
                  type="tel"
                  className="pl-10 rounded-sm"
                  placeholder="+91-9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  data-testid="phone-input"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role">I am a</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="mt-1.5 rounded-sm" data-testid="role-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="seller">Seller</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 rounded-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  data-testid="password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-sm"
              disabled={loading}
              data-testid="register-submit-button"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline" data-testid="login-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/ed8df817-38a5-4539-91b3-ca88af9532db/images/872d11e66c6182b14c14d935abd882883ee80b2efea1c4c97e14b7c4c4378e9f.png)'
        }}
      />
    </div>
  );
}
