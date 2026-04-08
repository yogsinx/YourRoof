import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Building, MagnifyingGlass, Users, TrendUp, ArrowRight, Check, Phone, Envelope, MapPin, Star } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function LandingNew() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await axios.post(`${API_URL}/api/contact`, contactForm);
      toast.success('Thank you! We will get back to you soon.');
      setContactForm({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="crystal-glass fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" data-testid="nav-logo">
            <Building size={28} weight="bold" />
            <span className="text-xl font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">About Us</a>
            <a href="#features" className="text-sm font-medium hover:text-accent transition-colors">Features</a>
            <Link to="/properties" className="text-sm font-medium hover:text-accent transition-colors">Properties</Link>
            <a href="#contact" className="text-sm font-medium hover:text-accent transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 border-r border-border/40">
              <div className="text-5xl font-black mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>15+</div>
              <div className="text-muted-foreground">Years of Experience</div>
            </div>
            <div className="text-center p-6 border-r border-border/40">
              <div className="text-5xl font-black mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>500+</div>
              <div className="text-muted-foreground">Properties Sold</div>
            </div>
            <div className="text-center p-6 border-r border-border/40">
              <div className="text-5xl font-black mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>1000+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl font-black mb-4" style={{ fontFamily: 'Cabinet Grotesk' }}>50+</div>
              <div className="text-muted-foreground">Channel Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-xs tracking-[0.2em] uppercase font-bold text-accent mb-4">About YourRoof</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Building Trust, Creating Homes
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Since 2009, YourRoof has been at the forefront of the real estate industry, specializing in premium residential and commercial properties across Delhi NCR. Our commitment to excellence and personalized service has made us the trusted partner for thousands of families and businesses.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We believe in building lasting relationships with our clients, understanding their unique needs, and delivering solutions that exceed expectations. Our extensive network of channel partners ensures that you get access to the best properties and the most competitive deals in the market.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-accent" weight="bold" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Expert Guidance</div>
                    <div className="text-sm text-muted-foreground">15+ years of industry expertise at your service</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-accent" weight="bold" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Verified Properties</div>
                    <div className="text-sm text-muted-foreground">All listings verified for authenticity and legal compliance</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={14} className="text-accent" weight="bold" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">End-to-End Support</div>
                    <div className="text-sm text-muted-foreground">From search to registration, we're with you every step</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/ed8df817-38a5-4539-91b3-ca88af9532db/images/c245e3817612b7ecb85e2346865ba66433bf67c445d5ab11e974a273cd3c1633.png"
                alt="About YourRoof"
                className="rounded-sm w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-accent mb-4">Why Choose Us</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Cabinet Grotesk' }}>
              Comprehensive Real Estate Solutions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to find, buy, sell, or invest in real estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-border/40 rounded-sm hover-lift bg-background">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center mb-6">
                <Building size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Premium Properties
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Curated selection of luxury residential and commercial properties in prime locations across Delhi NCR
              </p>
            </div>

            <div className="p-8 border border-border/40 rounded-sm hover-lift bg-background">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center mb-6">
                <Users size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Expert Guidance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Personalized service from experienced professionals who understand your unique needs and budget
              </p>
            </div>

            <div className="p-8 border border-border/40 rounded-sm hover-lift bg-background">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center mb-6">
                <TrendUp size={24} className="text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Channel Partner Program
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Attractive commission structure and comprehensive support for our growing network of partners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs tracking-[0.2em] uppercase font-bold text-accent mb-4">Testimonials</div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Cabinet Grotesk' }}>
              What Our Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 border border-border/40 rounded-sm bg-card">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} weight="fill" className="text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "YourRoof helped us find our dream home in Noida. Their team was professional, patient, and went above and beyond to ensure we got the best deal. Highly recommended!"
              </p>
              <div className="font-semibold">Rajesh Kumar</div>
              <div className="text-sm text-muted-foreground">Homebuyer, Sector 128</div>
            </div>

            <div className="p-8 border border-border/40 rounded-sm bg-card">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} weight="fill" className="text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "As a seller, I was impressed by their market knowledge and ability to close deals quickly. They handled everything professionally and got me an excellent price."
              </p>
              <div className="font-semibold">Priya Sharma</div>
              <div className="text-sm text-muted-foreground">Property Seller, Greater Noida</div>
            </div>

            <div className="p-8 border border-border/40 rounded-sm bg-card">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} weight="fill" className="text-accent" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "Being a channel partner with YourRoof has been extremely rewarding. Great commission structure, excellent support, and a steady flow of quality leads."
              </p>
              <div className="font-semibold">Amit Verma</div>
              <div className="text-sm text-muted-foreground">Channel Partner</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="text-xs tracking-[0.2em] uppercase font-bold text-accent mb-4">Get In Touch</div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-tight" style={{ fontFamily: 'Cabinet Grotesk' }}>
                Let's Find Your Perfect Property
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-12">
                Have questions? Our team is here to help. Reach out to us and we'll get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Phone</div>
                    <a href="tel:+919068987898" className="text-muted-foreground hover:text-accent transition-colors">
                      +91-9068987898
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <Envelope size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <a href="mailto:info@yourroof.com" className="text-muted-foreground hover:text-accent transition-colors">
                      info@yourroof.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Office</div>
                    <div className="text-muted-foreground">
                      Sector 51, Noida<br />
                      Uttar Pradesh, India
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background p-8 rounded-sm border border-border/40">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name *</label>
                  <Input
                    className="rounded-sm"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    data-testid="contact-name-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input
                      type="email"
                      className="rounded-sm"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      data-testid="contact-email-input"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone *</label>
                    <Input
                      type="tel"
                      className="rounded-sm"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      required
                      data-testid="contact-phone-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <Input
                    className="rounded-sm"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    data-testid="contact-subject-input"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Message *</label>
                  <Textarea
                    className="rounded-sm min-h-[120px]"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    data-testid="contact-message-input"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full rounded-sm" 
                  disabled={submitting}
                  data-testid="contact-submit-button"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
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
      <footer className="py-12 px-6 border-t border-border/40 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building size={24} weight="bold" />
                <span className="text-lg font-black" style={{ fontFamily: 'Cabinet Grotesk' }}>YourRoof</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner in finding the perfect property since 2009.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><a href="#about" className="hover:text-accent transition-colors">About Us</a></div>
                <div><Link to="/properties" className="hover:text-accent transition-colors">Properties</Link></div>
                <div><a href="#features" className="hover:text-accent transition-colors">Services</a></div>
                <div><a href="#contact" className="hover:text-accent transition-colors">Contact</a></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Partners</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div><Link to="/register" className="hover:text-accent transition-colors">Become a Partner</Link></div>
                <div><Link to="/register" className="hover:text-accent transition-colors">List Property</Link></div>
                <div><a href="#" className="hover:text-accent transition-colors">Partner Resources</a></div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>Sector 51, Noida</div>
                <div>Uttar Pradesh, India</div>
                <div><a href="tel:+919068987898" className="hover:text-accent transition-colors">+91-9068987898</a></div>
                <div><a href="mailto:info@yourroof.com" className="hover:text-accent transition-colors">info@yourroof.com</a></div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 YourRoof. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
