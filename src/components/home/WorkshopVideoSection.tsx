import { Play, Factory, Users, Award, Volume2, VolumeX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/utils";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const WorkshopVideoSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showYouTubePlayer, setShowYouTubePlayer] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // YouTube video ID extracted from the URL
  const youtubeVideoId = "MdkVvDU-TLs";
  const youtubeThumbnail = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`;

  useEffect(() => {
    // Auto-load and auto-play the video after a short delay
    const timer = setTimeout(() => {
      setIsVideoLoaded(true);
      setShowYouTubePlayer(true);
      setIsVideoPlaying(true);
      
      // Check if autoplay failed after a delay
      setTimeout(() => {
        if (!isVideoPlaying) {
          setAutoplayFailed(true);
        }
      }, 3000);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isVideoPlaying]);

  // Intersection Observer for auto-play when in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !showYouTubePlayer) {
          setIsInView(true);
          // Auto-play when section comes into view
          setTimeout(() => {
            setShowYouTubePlayer(true);
            setIsVideoPlaying(true);
          }, 500);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [showYouTubePlayer]);

  const handlePlayVideo = () => {
    setShowYouTubePlayer(true);
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
    <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-timber-50 to-white">
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
                  {!showYouTubePlayer ? (
                    <>
                      {/* YouTube Thumbnail Background */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${youtubeThumbnail})` }}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                      
                      {/* Loading State */}
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
                      
                      {/* Play Button Overlay */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center cursor-pointer"
                        onClick={handlePlayVideo}
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary ml-1" />
                        </div>
                      </div>
                      
                      {/* Video Title Overlay */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
                          <p className="text-white font-medium text-sm">New India Timbers Workshop Tour</p>
                          <p className="text-white/80 text-xs">Click to watch our craftsmanship in action</p>
                          <p className="text-white/60 text-xs mt-1">Video starts muted - click to unmute</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* YouTube Embed */
                    <div className="relative w-full h-full">
                      <iframe
                        ref={videoRef}
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&rel=0&modestbranding=1&showinfo=0&controls=1&loop=1&playlist=${youtubeVideoId}&start=0&enablejsapi=1`}
                        title="New India Timbers Workshop Tour"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        loading="eager"
                      />
                      
                      {/* Mute indicator */}
                      {isMuted && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2">
                            <VolumeX className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Muted</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Fallback play button if autoplay fails */}
                      {autoplayFailed && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <button
                            onClick={handlePlayVideo}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
                          >
                            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-primary ml-1" />
                          </button>
                        </div>
                      )}
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
