
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  MapPin,
  Phone,
  Calculator,
  Package,
  CheckCircle,
  Truck,
  Award
} from "lucide-react";
import { cn } from "@/utils";

const Hero = () => {
  return (
    <section data-testid="hero-section" className="relative min-h-[100vh] md:min-h-[90vh] overflow-hidden bg-white">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
      </div>

      {/* Modern Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-timber-50 rounded-2xl transform rotate-45 animate-float opacity-60" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-timber-100 rounded-full animate-float opacity-50" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-timber-50 rounded-3xl transform -rotate-12 animate-float opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-timber-100 rounded-full animate-float opacity-55" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">

          {/* Main Content - Left Side */}
          <div className="lg:col-span-7 text-foreground space-y-6 md:space-y-8">

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Badge variant="secondary" className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/15 transition-colors">
                <Award className="w-4 h-4 mr-1" />
                18+ Years Trusted
              </Badge>
              <Badge variant="secondary" className="bg-timber-100 border-timber-300 text-timber-800 hover:bg-timber-200 transition-colors font-semibold shadow-sm">
                <MapPin className="w-4 h-4 mr-1" />
                Bangalore's #1 Choice
              </Badge>
            </div>

            {/* Main Headline with Enhanced Animation */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-4">
                <span className="block text-foreground animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Premium
                </span>
                <span className="block text-primary animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  Timber Solutions
                </span>
                <span className="block text-muted-foreground text-2xl md:text-3xl lg:text-4xl font-medium mt-2 animate-slide-up" style={{ animationDelay: '0.6s' }}>
                  for Every Project
                </span>
              </h1>
            </div>

            {/* Enhanced Description */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl text-center lg:text-left animate-slide-up" style={{ animationDelay: '0.8s' }}>
              From premium teak to budget-friendly plywood - we've been crafting
              <span className="text-primary font-semibold"> Bangalore's finest spaces</span> since 2005.
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up" style={{ animationDelay: '1s' }}>
              <Button
                asChild
                size="lg"
                className={cn(
                  "bg-primary hover:bg-primary/90 text-primary-foreground",
                  "px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl",
                  "transition-all duration-300 group transform hover:scale-105"
                )}
              >
                <a href="https://wa.me/919886033342?text=Hello%20I%20am%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                  Get a Quote
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className={cn(
                  "bg-timber-600 hover:bg-timber-700 text-white border-2 border-timber-600",
                  "hover:border-timber-700 hover:shadow-lg hover:shadow-timber-500/25",
                  "px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl",
                  "transition-all duration-300 transform hover:scale-105 group"
                )}
              >
                <Link to="/products" className="inline-flex items-center justify-center">
                  <Package className="mr-2" size={18} />
                  Browse Products
                </Link>
              </Button>
            </div>

            {/* Enhanced Quick Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4 animate-slide-up" style={{ animationDelay: '1.2s' }}>
              <div className="text-center group">
                <div className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">18+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">5000+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>

          {/* Enhanced Floating Cards - Right Side */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-md mx-auto lg:max-w-none">

              <Card className={cn(
                "bg-card border border-border shadow-lg hover:shadow-xl",
                "transition-all duration-300 transform hover:scale-105 animate-slide-up"
              )} style={{ animationDelay: '1.4s' }}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calculator className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Free Estimate</h3>
                      <p className="text-sm text-muted-foreground">Get instant pricing</p>
                    </div>
                  </div>
                  <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a href="https://wa.me/919886033342?text=Hello%20I%20am%20interested%20in%20your%20services" target="_blank" rel="noopener noreferrer">WhatsApp Now</a>
                  </Button>
                </CardContent>
              </Card>

              {/* Enhanced Quality Guarantee Card */}
              <Card className={cn(
                "bg-card border border-border shadow-lg hover:shadow-xl",
                "transition-all duration-300 transform hover:scale-105 animate-slide-up"
              )} style={{ animationDelay: '1.6s' }}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Quality Guaranteed</h3>
                      <p className="text-sm text-muted-foreground">Certified materials</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Premium Grade Timber
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Quick Delivery Card */}
              <Card className={cn(
                "bg-card border border-border shadow-lg hover:shadow-xl",
                "transition-all duration-300 transform hover:scale-105 animate-slide-up md:col-span-2 lg:col-span-1"
              )} style={{ animationDelay: '1.8s' }}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Truck className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Fast Delivery</h3>
                      <p className="text-sm text-muted-foreground">Same day delivery available</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-600">Across Bangalore</span>
                    <Button asChild size="sm" variant="ghost" className="text-muted-foreground hover:bg-accent/10 p-2">
                      <a href="tel:+919886033342">
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
