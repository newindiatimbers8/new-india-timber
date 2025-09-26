/**
 * PerformanceMonitor Component
 * Monitors and reports Core Web Vitals and performance metrics
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  loadTime?: number; // Page load time
}

interface PerformanceMonitorProps {
  showDetails?: boolean;
  className?: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDetails = false,
  className
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const measurePerformance = () => {
      const newMetrics: PerformanceMetrics = {};

      // Get navigation timing
      if (performance.getEntriesByType) {
        const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
        if (navigationEntries.length > 0) {
          const nav = navigationEntries[0];
          newMetrics.loadTime = nav.loadEventEnd - nav.fetchStart;
          newMetrics.ttfb = nav.responseStart - nav.fetchStart;
        }
      }

      // Get paint timing
      if (performance.getEntriesByType) {
        const paintEntries = performance.getEntriesByType('paint');
        paintEntries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            newMetrics.fcp = entry.startTime;
          }
        });
      }

      // Get Core Web Vitals (if available)
      if ('web-vital' in window) {
        // This would be populated by web-vitals library
        const webVitals = (window as any)['web-vital'];
        if (webVitals) {
          newMetrics.lcp = webVitals.lcp;
          newMetrics.fid = webVitals.fid;
          newMetrics.cls = webVitals.cls;
        }
      }

      setMetrics(newMetrics);
    };

    // Measure performance after page load
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
    }

    // Set up monitoring
    setIsMonitoring(true);

    return () => {
      window.removeEventListener('load', measurePerformance);
    };
  }, []);

  const getPerformanceScore = (metric: keyof PerformanceMetrics): 'good' | 'needs-improvement' | 'poor' => {
    const value = metrics[metric];
    if (value === undefined) return 'good';

    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'fcp':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      case 'ttfb':
        return value <= 800 ? 'good' : value <= 1800 ? 'needs-improvement' : 'poor';
      case 'loadTime':
        return value <= 2000 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const getScoreColor = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
    }
  };

  const getScoreIcon = (score: 'good' | 'needs-improvement' | 'poor') => {
    switch (score) {
      case 'good':
        return <Zap className="w-4 h-4" />;
      case 'needs-improvement':
        return <Clock className="w-4 h-4" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatMetric = (value: number | undefined, unit: string = 'ms'): string => {
    if (value === undefined) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  if (!showDetails && !isMonitoring) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Web Vitals */}
        <div>
          <h4 className="font-semibold mb-2">Core Web Vitals</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">LCP</p>
                <p className="text-xs text-gray-600">Largest Contentful Paint</p>
              </div>
              <Badge className={getScoreColor(getPerformanceScore('lcp'))}>
                {getScoreIcon(getPerformanceScore('lcp'))}
                {formatMetric(metrics.lcp)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">FID</p>
                <p className="text-xs text-gray-600">First Input Delay</p>
              </div>
              <Badge className={getScoreColor(getPerformanceScore('fid'))}>
                {getScoreIcon(getPerformanceScore('fid'))}
                {formatMetric(metrics.fid)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">CLS</p>
                <p className="text-xs text-gray-600">Cumulative Layout Shift</p>
              </div>
              <Badge className={getScoreColor(getPerformanceScore('cls'))}>
                {getScoreIcon(getPerformanceScore('cls'))}
                {formatMetric(metrics.cls, '')}
              </Badge>
            </div>
          </div>
        </div>

        {/* Additional Metrics */}
        <div>
          <h4 className="font-semibold mb-2">Additional Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">FCP</p>
                <p className="text-xs text-gray-600">First Contentful Paint</p>
              </div>
              <Badge className={getScoreColor(getPerformanceScore('fcp'))}>
                {getScoreIcon(getPerformanceScore('fcp'))}
                {formatMetric(metrics.fcp)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">TTFB</p>
                <p className="text-xs text-gray-600">Time to First Byte</p>
              </div>
              <Badge className={getScoreColor(getPerformanceScore('ttfb'))}>
                {getScoreIcon(getPerformanceScore('ttfb'))}
                {formatMetric(metrics.ttfb)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">Performance Tips</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use WebP images with JPEG fallbacks</li>
            <li>• Implement lazy loading for images</li>
            <li>• Optimize bundle size with code splitting</li>
            <li>• Use CDN for static assets</li>
            <li>• Enable gzip compression</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;

