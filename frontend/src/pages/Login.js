import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building, Envelope, Lock } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
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

          <h1 className="text-4xl font-black mb-2" style={{ fontFamily: 'Cabinet Grotesk' }}>Welcome Back</h1>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-sm mb-6" data-testid="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1.5">
                <Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="email"
                  type="email"
                  className="pl-10 rounded-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="email-input"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-accent hover:underline" data-testid="forgot-password-link">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  id="password"
                  type="password"
                  className="pl-10 rounded-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="password-input"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-sm"
              disabled={loading}
              data-testid="login-submit-button"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent hover:underline" data-testid="register-link">
              Create account
            </Link>
          </p>
        </div>
      </div>

      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/ed8df817-38a5-4539-91b3-ca88af9532db/images/c245e3817612b7ecb85e2346865ba66433bf67c445d5ab11e974a273cd3c1633.png)'
        }}
      />
    </div>
  );
}
