/**
 * CrossBrowserCompatibility Component
 * Checks and reports browser compatibility issues
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Chrome,
  Firefox,
  Safari,
  Edge,
  Smartphone
} from 'lucide-react';

interface BrowserInfo {
  name: string;
  version: string;
  icon: React.ComponentType<any>;
  color: string;
  support: 'full' | 'partial' | 'none';
}

interface FeatureSupport {
  feature: string;
  supported: boolean;
  fallback?: string;
  browserSpecific?: Record<string, boolean>;
}

interface CrossBrowserCompatibilityProps {
  showDetails?: boolean;
  className?: string;
}

const CrossBrowserCompatibility: React.FC<CrossBrowserCompatibilityProps> = ({
  showDetails = false,
  className
}) => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [featureSupport, setFeatureSupport] = useState<FeatureSupport[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    detectBrowser();
    checkFeatureSupport();
  }, []);

  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    let browser: BrowserInfo;

    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      browser = {
        name: 'Chrome',
        version: getVersion(userAgent, 'Chrome/'),
        icon: Chrome,
        color: 'bg-green-100 text-green-800',
        support: 'full'
      };
    } else if (userAgent.includes('Firefox')) {
      browser = {
        name: 'Firefox',
        version: getVersion(userAgent, 'Firefox/'),
        icon: Firefox,
        color: 'bg-orange-100 text-orange-800',
        support: 'full'
      };
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = {
        name: 'Safari',
        version: getVersion(userAgent, 'Version/'),
        icon: Safari,
        color: 'bg-blue-100 text-blue-800',
        support: 'full'
      };
    } else if (userAgent.includes('Edg')) {
      browser = {
        name: 'Edge',
        version: getVersion(userAgent, 'Edg/'),
        icon: Edge,
        color: 'bg-blue-100 text-blue-800',
        support: 'full'
      };
    } else {
      browser = {
        name: 'Unknown',
        version: 'Unknown',
        icon: Globe,
        color: 'bg-gray-100 text-gray-800',
        support: 'partial'
      };
    }

    setBrowserInfo(browser);
  };

  const getVersion = (userAgent: string, prefix: string): string => {
    const index = userAgent.indexOf(prefix);
    if (index === -1) return 'Unknown';
    
    const version = userAgent.substring(index + prefix.length);
    const endIndex = version.indexOf(' ');
    return endIndex === -1 ? version : version.substring(0, endIndex);
  };

  const checkFeatureSupport = () => {
    setIsChecking(true);
    const features: FeatureSupport[] = [];

    // Check WebP support
    const webpSupported = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    })();

    features.push({
      feature: 'WebP Images',
      supported: webpSupported,
      fallback: 'Use JPEG/PNG fallbacks',
      browserSpecific: {
        Chrome: true,
        Firefox: true,
        Safari: true,
        Edge: true
      }
    });

    // Check CSS Grid support
    const gridSupported = CSS.supports('display', 'grid');
    features.push({
      feature: 'CSS Grid',
      supported: gridSupported,
      fallback: 'Use Flexbox fallbacks',
      browserSpecific: {
        Chrome: true,
        Firefox: true,
        Safari: true,
        Edge: true
      }
    });

    // Check CSS Flexbox support
    const flexboxSupported = CSS.supports('display', 'flex');
    features.push({
      feature: 'CSS Flexbox',
      supported: flexboxSupported,
      fallback: 'Use float/positioning fallbacks',
      browserSpecific: {
        Chrome: true,
        Firefox: true,
        Safari: true,
        Edge: true
      }
    });

    // Check Intersection Observer support
    const intersectionObserverSupported = 'IntersectionObserver' in window;
    features.push({
      feature: 'Intersection Observer',
      supported: intersectionObserverSupported,
      fallback: 'Use scroll event listeners',
      browserSpecific: {
        Chrome: true,
        Firefox: true,
        Safari: true,
        Edge: true
      }
    });

    // Check Web Components support
    const webComponentsSupported = 'customElements' in window;
    features.push({
      feature: 'Web Components',
      supported: webComponentsSupported,
      fallback: 'Use polyfills or alternative implementations',
      browserSpecific: {
        Chrome: true,
        Firefox: true,
        Safari: true,
        Edge: true
      }
    });

    // Check Service Worker support
    const serviceWorkerSupported = 'serviceWorker' in navigator;
    features.push({
      feature: 'Service Workers',
      supported: serviceWorkerSupported,
      fallback: 'Use traditional caching strategies',
      browserSpecific: {
        Chrome: true,
        Firefox: true,
        Safari: true,
        Edge: true
      }
    });

    // Check Local Storage support
    const localStorageSupported = (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })();

    features.push({
      feature: 'Local Storage',
      supported: localStorageSupported,
      fallback: 'Use cookies or server-side storage',
      browserSpecific: {
        Chrome: true,
        Firefox: true,
        Safari: true,
        Edge: true
      }
    });

    setFeatureSupport(features);
    setIsChecking(false);
  };

  const getSupportIcon = (supported: boolean) => {
    return supported ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-red-500" />
    );
  };

  const getSupportColor = (supported: boolean) => {
    return supported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (!showDetails) {
    return (
      <div className={className}>
        {browserInfo && (
          <Badge className={browserInfo.color}>
            <browserInfo.icon className="w-3 h-3 mr-1" />
            {browserInfo.name} {browserInfo.version}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Cross-Browser Compatibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Browser Detection */}
        <div>
          <h4 className="font-semibold mb-2">Browser Information</h4>
          {browserInfo && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <browserInfo.icon className="w-6 h-6" />
              <div>
                <p className="font-medium">{browserInfo.name}</p>
                <p className="text-sm text-gray-600">Version {browserInfo.version}</p>
              </div>
              <Badge className={browserInfo.color}>
                {browserInfo.support === 'full' ? 'Full Support' : 
                 browserInfo.support === 'partial' ? 'Partial Support' : 'Limited Support'}
              </Badge>
            </div>
          )}
        </div>

        {/* Feature Support */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Feature Support</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={checkFeatureSupport}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check Again'}
            </Button>
          </div>
          
          <div className="space-y-2">
            {featureSupport.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getSupportIcon(feature.supported)}
                  <div>
                    <p className="font-medium">{feature.feature}</p>
                    {feature.fallback && !feature.supported && (
                      <p className="text-sm text-gray-600">Fallback: {feature.fallback}</p>
                    )}
                  </div>
                </div>
                <Badge className={getSupportColor(feature.supported)}>
                  {feature.supported ? 'Supported' : 'Not Supported'}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Browser Support Matrix */}
        <div>
          <h4 className="font-semibold mb-2">Browser Support Matrix</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Feature</th>
                  <th className="text-center py-2">Chrome</th>
                  <th className="text-center py-2">Firefox</th>
                  <th className="text-center py-2">Safari</th>
                  <th className="text-center py-2">Edge</th>
                </tr>
              </thead>
              <tbody>
                {featureSupport.map((feature, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{feature.feature}</td>
                    <td className="text-center py-2">
                      {feature.browserSpecific?.Chrome ? '✅' : '❌'}
                    </td>
                    <td className="text-center py-2">
                      {feature.browserSpecific?.Firefox ? '✅' : '❌'}
                    </td>
                    <td className="text-center py-2">
                      {feature.browserSpecific?.Safari ? '✅' : '❌'}
                    </td>
                    <td className="text-center py-2">
                      {feature.browserSpecific?.Edge ? '✅' : '❌'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compatibility Tips */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Compatibility Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use feature detection instead of browser detection</li>
            <li>• Provide fallbacks for unsupported features</li>
            <li>• Test on real devices and browsers</li>
            <li>• Use polyfills for missing features</li>
            <li>• Consider progressive enhancement</li>
            <li>• Monitor browser usage analytics</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CrossBrowserCompatibility;

