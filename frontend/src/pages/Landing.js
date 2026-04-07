import { Link } from 'react-router-dom';
import { Building, MagnifyingGlass, Users, TrendUp, ArrowRight, Check } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="crystal-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <Building size={28} weight="bold" />
            <span className="text-xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/properties" data-testid="nav-properties-link">
              <Button variant="ghost" className="rounded-sm">Properties</Button>
            </Link>
            <Link to="/login" data-testid="nav-login-link">
              <Button variant="outline" className="rounded-sm">Sign In</Button>
            </Link>
            <Link to="/register" data-testid="nav-register-link">
              <Button className="rounded-sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-6 pt-20 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/ed8df817-38a5-4539-91b3-ca88af9532db/images/872d11e66c6182b14c14d935abd882883ee80b2efea1c4c97e14b7c4c4378e9f.png)',
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 tracking-tighter" style={{ fontFamily: 'Cabinet Grotesk' }} data-testid="hero-heading">
            Your Trusted Partner in Real Estate
          </h1>
          <p className="text-lg sm:text-xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover premium commercial and residential properties. Expert guidance for buyers, sellers, and channel partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button size="lg" className="rounded-sm text-base" data-testid="hero-explore-button">
                Explore Properties
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="rounded-sm text-base bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20" data-testid="hero-join-button">
                Join as Partner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="text-5xl font-black mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>15+</div>
              <div className="text-muted-foreground">Years of Experience</div>
            </div>
            <div className="text-center border-l border-r border-border/40">
              <div className="text-5xl font-black mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>500+</div>
              <div className="text-muted-foreground">Properties Sold</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>1000+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-center tracking-tight" style={{ fontFamily: 'Cabinet Grotesk' }}>
            Why Choose YourRoof
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            We provide comprehensive services for all your real estate needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-border/40 rounded-sm hover-lift bg-card">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center mb-6">
                <Building size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Premium Properties
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Curated selection of luxury residential and commercial properties in prime locations
              </p>
            </div>

            <div className="p-8 border border-border/40 rounded-sm hover-lift bg-card">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center mb-6">
                <Users size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Expert Guidance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Personalized service from experienced professionals who understand your needs
              </p>
            </div>

            <div className="p-8 border border-border/40 rounded-sm hover-lift bg-card">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center mb-6">
                <TrendUp size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Channel Partner Program
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Attractive commission structure and comprehensive support for our partners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-foreground text-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Cabinet Grotesk' }}>
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-lg mb-8 text-background/80">
            Join thousands of satisfied clients who found their perfect space with us
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="rounded-sm" data-testid="cta-register-button">
              Get Started Today
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Building size={24} weight="bold" />
              <span className="text-lg font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 YourRoof. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <a href="tel:+919068987898" className="hover:text-accent transition-colors">
                +91-9068987898
              </a>
              <a href="mailto:info@yourroof.com" className="hover:text-accent transition-colors">
                info@yourroof.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
