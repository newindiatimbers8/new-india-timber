/**
 * ScreenReaderSupport Component
 * Provides screen reader compatibility and ARIA utilities
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertTriangle,
  Info
} from 'lucide-react';

interface ScreenReaderSupportProps {
  showDetails?: boolean;
  className?: string;
}

const ScreenReaderSupport: React.FC<ScreenReaderSupportProps> = ({
  showDetails = false,
  className
}) => {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [announcements, setAnnouncements] = useState<string[]>([]);
  const [liveRegion, setLiveRegion] = useState<string>('');

  useEffect(() => {
    // Detect screen reader usage
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = 
        window.speechSynthesis ||
        navigator.userAgent.includes('NVDA') ||
        navigator.userAgent.includes('JAWS') ||
        navigator.userAgent.includes('VoiceOver') ||
        document.querySelector('[aria-live]') !== null;

      setIsScreenReaderActive(hasScreenReader);
    };

    detectScreenReader();

    // Create live region for announcements
    const liveRegionElement = document.createElement('div');
    liveRegionElement.setAttribute('aria-live', 'polite');
    liveRegionElement.setAttribute('aria-atomic', 'true');
    liveRegionElement.className = 'sr-only';
    liveRegionElement.id = 'live-region';
    document.body.appendChild(liveRegionElement);

    return () => {
      const element = document.getElementById('live-region');
      if (element) {
        document.body.removeChild(element);
      }
    };
  }, []);

  const announce = (message: string) => {
    setAnnouncements(prev => [...prev, message]);
    setLiveRegion(message);
    
    // Update the live region element
    const liveRegionElement = document.getElementById('live-region');
    if (liveRegionElement) {
      liveRegionElement.textContent = message;
    }

    // Clear after a delay
    setTimeout(() => {
      setLiveRegion('');
      if (liveRegionElement) {
        liveRegionElement.textContent = '';
      }
    }, 1000);
  };

  const testScreenReader = () => {
    announce('Screen reader test: This is a test announcement for accessibility testing.');
  };

  const getAriaGuidelines = () => [
    {
      rule: 'Use semantic HTML elements',
      description: 'Use proper HTML elements like <button>, <nav>, <main>, <section>',
      example: '<button>Click me</button> instead of <div onclick="...">Click me</div>',
      importance: 'high'
    },
    {
      rule: 'Provide alt text for images',
      description: 'All images must have descriptive alt text',
      example: '<img src="product.jpg" alt="Red Sal Wood timber showing grain pattern" />',
      importance: 'high'
    },
    {
      rule: 'Use ARIA labels',
      description: 'Provide labels for form controls and interactive elements',
      example: '<input aria-label="Search products" type="text" />',
      importance: 'high'
    },
    {
      rule: 'Implement focus management',
      description: 'Ensure keyboard navigation works properly',
      example: 'Use tabindex and focus() methods appropriately',
      importance: 'high'
    },
    {
      rule: 'Use ARIA live regions',
      description: 'Announce dynamic content changes to screen readers',
      example: '<div aria-live="polite">Loading...</div>',
      importance: 'medium'
    },
    {
      rule: 'Provide skip links',
      description: 'Allow users to skip to main content',
      example: '<a href="#main-content" class="skip-link">Skip to main content</a>',
      importance: 'medium'
    },
    {
      rule: 'Use proper heading hierarchy',
      description: 'Maintain logical heading structure (h1 → h2 → h3)',
      example: '<h1>Page Title</h1><h2>Section Title</h2>',
      importance: 'medium'
    },
    {
      rule: 'Provide form validation feedback',
      description: 'Announce form errors and success messages',
      example: '<div role="alert">Please enter a valid email address</div>',
      importance: 'medium'
    }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Info className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  if (!showDetails) {
    return (
      <div className={className}>
        <div className="flex items-center gap-2">
          <Badge className={isScreenReaderActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {isScreenReaderActive ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
            {isScreenReaderActive ? 'Screen Reader Active' : 'Screen Reader Not Detected'}
          </Badge>
          {announcements.length > 0 && (
            <Badge variant="secondary">
              {announcements.length} announcements
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Screen Reader Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Screen Reader Status */}
        <div>
          <h4 className="font-semibold mb-2">Screen Reader Status</h4>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {isScreenReaderActive ? (
              <Volume2 className="w-6 h-6 text-green-600" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-400" />
            )}
            <div>
              <p className="font-medium">
                {isScreenReaderActive ? 'Screen Reader Detected' : 'No Screen Reader Detected'}
              </p>
              <p className="text-sm text-gray-600">
                {isScreenReaderActive 
                  ? 'Accessibility features are optimized for screen readers'
                  : 'Testing with screen reader simulation'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Live Announcements */}
        <div>
          <h4 className="font-semibold mb-2">Live Announcements</h4>
          <div className="space-y-2">
            <Button onClick={testScreenReader} variant="outline" size="sm">
              Test Screen Reader
            </Button>
            
            {announcements.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {announcements.slice(-5).map((announcement, index) => (
                  <div key={index} className="text-sm p-2 bg-blue-50 rounded border-l-2 border-blue-200">
                    {announcement}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ARIA Guidelines */}
        <div>
          <h4 className="font-semibold mb-2">ARIA Guidelines</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {getAriaGuidelines().map((guideline, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Badge className={getImportanceColor(guideline.importance)}>
                    {getImportanceIcon(guideline.importance)}
                    {guideline.importance}
                  </Badge>
                  <div className="flex-1">
                    <h5 className="font-medium mb-1">{guideline.rule}</h5>
                    <p className="text-sm text-gray-600 mb-2">{guideline.description}</p>
                    <code className="text-xs bg-white p-2 rounded border block">
                      {guideline.example}
                    </code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Screen Reader Tips */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Screen Reader Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use semantic HTML elements for better structure</li>
            <li>• Provide descriptive alt text for all images</li>
            <li>• Use ARIA labels for form controls</li>
            <li>• Implement proper focus management</li>
            <li>• Use live regions for dynamic content</li>
            <li>• Test with actual screen readers</li>
            <li>• Provide skip links for navigation</li>
            <li>• Use proper heading hierarchy</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScreenReaderSupport;

