
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Clock, 
  Star,
  MapPin,
  Phone,
  Calculator,
  Package
} from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[100vh] md:min-h-[90vh] overflow-hidden">
      {/* Animated Background with Multiple Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-timber-900 via-forest-800 to-timber-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-timber-600/20 to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] animate-pulse">
          </div>
        </div>
      </div>
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-timber-400/10 rounded-full blur-xl animate-bounce [animation-delay:0s]">
        </div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-forest-300/10 rounded-full blur-lg animate-bounce [animation-delay:2s]">
        </div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-timber-500/10 rounded-full blur-2xl animate-bounce [animation-delay:4s]">
        </div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-forest-400/10 rounded-full blur-lg animate-bounce [animation-delay:1s]">
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[80vh]">
          
          {/* Main Content - Left Side */}
          <div className="lg:col-span-7 text-white space-y-6 md:space-y-8">
            
            {/* Trust Badge */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <Badge className="bg-timber-500/20 border border-timber-400/30 text-timber-100 px-3 py-1 text-sm backdrop-blur-sm">
                <Star className="w-4 h-4 mr-1 fill-current" />
                18+ Years Trusted
              </Badge>
              <Badge className="bg-forest-500/20 border border-forest-400/30 text-forest-100 px-3 py-1 text-sm backdrop-blur-sm">
                <MapPin className="w-4 h-4 mr-1" />
                Bangalore's #1 Choice
              </Badge>
            </div>
            
            {/* Main Headline with Animation */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
                <span className="block text-white animate-fade-in [animation-delay:0.2s]">
                  Premium
                </span>
                <span className="block bg-gradient-to-r from-timber-300 via-timber-100 to-timber-300 bg-clip-text text-transparent animate-fade-in [animation-delay:0.4s]">
                  Timber Solutions
                </span>
                <span className="block text-white/90 text-2xl md:text-3xl lg:text-4xl font-medium mt-2 animate-fade-in [animation-delay:0.6s]">
                  for Every Project
                </span>
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl text-center lg:text-left animate-fade-in [animation-delay:0.8s]">
              From premium teak to budget-friendly plywood - we've been crafting 
              <span className="text-timber-200 font-semibold">Bangalore's finest spaces</span> since 2005.
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in [animation-delay:1s]">
              <Button asChild size="lg" className="bg-timber-600 hover:bg-timber-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Link to="/login" className="inline-flex items-center justify-center">
                  Start Your Project
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg rounded-xl">
                <Link to="/products" className="inline-flex items-center justify-center">
                  <Package className="mr-2" size={18} />
                  Browse Products
                </Link>
              </Button>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4 animate-fade-in [animation-delay:1.2s]">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-timber-300">18+</div>
                <div className="text-sm text-white/70">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-timber-300">5000+</div>
                <div className="text-sm text-white/70">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-timber-300">24/7</div>
                <div className="text-sm text-white/70">Support</div>
              </div>
            </div>
          </div>
          
          {/* Floating Cards - Right Side */}
          <div className="lg:col-span-5 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 max-w-md mx-auto lg:max-w-none">
              
              {/* Price Estimator Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fade-in [animation-delay:1.4s]">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-timber-500/20 rounded-lg">
                      <Calculator className="w-6 h-6 text-timber-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Free Estimate</h3>
                      <p className="text-sm text-white/70">Get instant pricing</p>
                    </div>
                  </div>
                  <Button asChild size="sm" className="w-full bg-timber-600/80 hover:bg-timber-600 text-white">
                    <Link to="/estimator">Calculate Now</Link>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Quality Guarantee Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fade-in [animation-delay:1.6s]">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Shield className="w-6 h-6 text-green-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Quality Guaranteed</h3>
                      <p className="text-sm text-white/70">Certified materials</p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-green-200">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Premium Grade Timber
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Delivery Card */}
              <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 animate-fade-in [animation-delay:1.8s] md:col-span-2 lg:col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Clock className="w-6 h-6 text-blue-200" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Fast Delivery</h3>
                      <p className="text-sm text-white/70">Same day delivery available</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-200">Across Bangalore</span>
                    <Button asChild size="sm" variant="ghost" className="text-white hover:bg-white/10 p-2">
                      <a href="tel:+918095701235">
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
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      
    </section>
  );
};

export default Hero;
