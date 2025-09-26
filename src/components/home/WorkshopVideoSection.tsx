import { Play, Factory, Users, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WorkshopVideoSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const navigate = useNavigate();

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleScheduleVisit = () => {
    // Navigate to contact page with pre-filled workshop visit subject
    navigate('/contact?subject=Workshop Visit&message=Hi, I would like to schedule a visit to your workshop to see your timber processing facilities and discuss my project requirements. Please let me know your available timings.');
  };

  const handleContactUs = () => {
    // Navigate to contact page
    navigate('/contact');
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-timber-50 to-white">
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
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-2xl transform rotate-45 animate-float opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute top-80 right-10 w-24 h-24 bg-accent/10 rounded-full animate-float opacity-40" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary/10 rounded-3xl transform -rotate-12 animate-float opacity-20" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Badge variant="secondary" className="mb-4 bg-primary/10 border-primary/20 text-primary">
              <Factory className="w-4 h-4 mr-1" />
              Behind the Scenes
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 md:mb-6">
              Visit Our Workshop
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Take a virtual tour of our state-of-the-art workshop
              <br className="hidden md:block" />
              and see how we craft premium timber solutions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Video Section */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Card className="relative bg-card border border-border shadow-xl overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative aspect-video bg-gradient-to-br from-timber-100 to-timber-200 sm:aspect-[16/9]">
                  {!isVideoLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-timber-100 to-timber-200">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </div>
                        <p className="text-timber-600 font-medium">Loading video...</p>
                      </div>
                    </div>
                  )}
                  <video
                    className={cn(
                      "w-full h-full object-cover transition-opacity duration-500",
                      isVideoLoaded ? "opacity-100" : "opacity-0"
                    )}
                    controls
                    preload="metadata"
                    onLoadedData={handleVideoLoad}
                    onPlay={handleVideoPlay}
                    onPause={handleVideoPause}
                    playsInline
                    muted
                    controlsList="nodownload"
                    disablePictureInPicture
                  >
                    <source src="/video/new-india-timber-workshop.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Play Button Overlay */}
                  {!isVideoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary ml-1" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Section */}
          <div className="animate-slide-up space-y-6" style={{ animationDelay: '0.6s' }}>
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Crafting Excellence Since 2005
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Our workshop is equipped with modern machinery and staffed by skilled craftsmen 
                who bring decades of experience to every project. Watch as we transform raw timber 
                into premium products that meet the highest quality standards.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Card className="bg-card border border-border hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Factory className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Modern Equipment</h4>
                      <p className="text-sm text-muted-foreground">State-of-the-art machinery</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Expert Craftsmen</h4>
                      <p className="text-sm text-muted-foreground">Skilled professionals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Quality Control</h4>
                      <p className="text-sm text-muted-foreground">Rigorous testing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Play className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Custom Solutions</h4>
                      <p className="text-sm text-muted-foreground">Tailored to your needs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to Action */}
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Ready to see our craftsmanship in action? Visit our workshop or contact us for a personalized consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleScheduleVisit}
                  className="px-4 py-3 sm:px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
                >
                  Schedule Visit
                </button>
                <button 
                  onClick={handleContactUs}
                  className="px-4 py-3 sm:px-6 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors text-sm sm:text-base"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopVideoSection;
