/**
 * MobileResponsive Component
 * Provides mobile-first responsive design utilities and breakpoint management
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Maximize, 
  Minimize,
  RotateCcw,
  Eye,
  EyeOff
} from 'lucide-react';

interface Breakpoint {
  name: string;
  width: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface MobileResponsiveProps {
  showDetails?: boolean;
  className?: string;
}

const breakpoints: Breakpoint[] = [
  { name: 'Mobile', width: 375, icon: Smartphone, color: 'bg-blue-100 text-blue-800' },
  { name: 'Mobile Large', width: 425, icon: Smartphone, color: 'bg-blue-100 text-blue-800' },
  { name: 'Tablet', width: 768, icon: Tablet, color: 'bg-green-100 text-green-800' },
  { name: 'Laptop', width: 1024, icon: Monitor, color: 'bg-yellow-100 text-yellow-800' },
  { name: 'Desktop', width: 1440, icon: Monitor, color: 'bg-purple-100 text-purple-800' },
  { name: 'Large Desktop', width: 1920, icon: Maximize, color: 'bg-red-100 text-red-800' }
];

const MobileResponsive: React.FC<MobileResponsiveProps> = ({
  showDetails = false,
  className
}) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>(breakpoints[0]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });
      setOrientation(width > height ? 'landscape' : 'portrait');

      // Determine current breakpoint
      const breakpoint = breakpoints
        .slice()
        .reverse()
        .find(bp => width >= bp.width) || breakpoints[0];
      
      setCurrentBreakpoint(breakpoint);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleGrid = () => {
    setShowGrid(!showGrid);
    document.documentElement.classList.toggle('show-grid');
  };

  const getResponsiveClasses = () => {
    return {
      mobile: 'block md:hidden',
      tablet: 'hidden md:block lg:hidden',
      desktop: 'hidden lg:block',
      mobileTablet: 'block lg:hidden',
      tabletDesktop: 'hidden md:block'
    };
  };

  const getResponsiveText = () => {
    const { width } = viewport;
    if (width < 768) return 'Mobile';
    if (width < 1024) return 'Tablet';
    if (width < 1440) return 'Laptop';
    return 'Desktop';
  };

  if (!showDetails) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <Badge className={currentBreakpoint.color}>
            <currentBreakpoint.icon className="w-3 h-3 mr-1" />
            {currentBreakpoint.name}
          </Badge>
          <span className="text-sm text-gray-600">
            {viewport.width} × {viewport.height}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Mobile Responsive Design
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Viewport Info */}
        <div>
          <h4 className="font-semibold mb-2">Current Viewport</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Breakpoint</p>
              <Badge className={currentBreakpoint.color}>
                <currentBreakpoint.icon className="w-3 h-3 mr-1" />
                {currentBreakpoint.name}
              </Badge>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Dimensions</p>
              <p className="text-lg font-mono">{viewport.width} × {viewport.height}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Orientation</p>
              <p className="text-lg capitalize">{orientation}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium">Device Type</p>
              <p className="text-lg">{getResponsiveText()}</p>
            </div>
          </div>
        </div>

        {/* Breakpoint Controls */}
        <div>
          <h4 className="font-semibold mb-2">Breakpoint Testing</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {breakpoints.map((breakpoint) => (
              <Button
                key={breakpoint.name}
                variant="outline"
                size="sm"
                onClick={() => {
                  // This would resize the viewport in a real testing environment
                  console.log(`Testing breakpoint: ${breakpoint.name} (${breakpoint.width}px)`);
                }}
                className={currentBreakpoint.name === breakpoint.name ? 'bg-blue-100' : ''}
              >
                <breakpoint.icon className="w-3 h-3 mr-1" />
                {breakpoint.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Responsive Utilities */}
        <div>
          <h4 className="font-semibold mb-2">Responsive Utilities</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className={isFullscreen ? 'bg-blue-100' : ''}
            >
              {isFullscreen ? <Minimize className="w-4 h-4 mr-2" /> : <Maximize className="w-4 h-4 mr-2" />}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleGrid}
              className={showGrid ? 'bg-blue-100' : ''}
            >
              {showGrid ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Responsive Classes Reference */}
        <div>
          <h4 className="font-semibold mb-2">Tailwind Responsive Classes</h4>
          <div className="space-y-2">
            {Object.entries(getResponsiveClasses()).map(([name, classes]) => (
              <div key={name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium capitalize">{name}</span>
                <code className="text-xs bg-white px-2 py-1 rounded">{classes}</code>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile-First Guidelines */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Mobile-First Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Design for mobile first, then scale up</li>
            <li>• Use touch-friendly button sizes (44px minimum)</li>
            <li>• Ensure text is readable without zooming</li>
            <li>• Test on real devices, not just browser dev tools</li>
            <li>• Consider thumb-friendly navigation placement</li>
            <li>• Optimize images for different screen densities</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileResponsive;

