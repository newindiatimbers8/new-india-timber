/**
 * AccessibilityChecker Component
 * Checks and reports accessibility issues for WCAG 2.1 AA compliance
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  MousePointer, 
  Keyboard,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  wcagLevel?: string;
  suggestion?: string;
}

interface AccessibilityCheckerProps {
  showDetails?: boolean;
  className?: string;
}

const AccessibilityChecker: React.FC<AccessibilityCheckerProps> = ({
  showDetails = false,
  className
}) => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for user preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    setHighContrast(prefersHighContrast);

    // Run accessibility checks
    runAccessibilityChecks();
  }, []);

  const runAccessibilityChecks = () => {
    setIsChecking(true);
    const newIssues: AccessibilityIssue[] = [];

    // Check for missing alt text on images
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.alt || img.alt.trim() === '') {
        newIssues.push({
          type: 'error',
          message: 'Image missing alt text',
          element: `img[${index}]`,
          wcagLevel: '1.1.1',
          suggestion: 'Add descriptive alt text to all images'
        });
      }
    });

    // Check for missing form labels
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input, index) => {
      const id = input.getAttribute('id');
      const label = document.querySelector(`label[for="${id}"]`);
      const ariaLabel = input.getAttribute('aria-label');
      const ariaLabelledBy = input.getAttribute('aria-labelledby');
      
      if (!label && !ariaLabel && !ariaLabelledBy) {
        newIssues.push({
          type: 'error',
          message: 'Form control missing label',
          element: `input[${index}]`,
          wcagLevel: '1.3.1',
          suggestion: 'Add a label or aria-label to form controls'
        });
      }
    });

    // Check for heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      if (level > previousLevel + 1) {
        newIssues.push({
          type: 'warning',
          message: 'Heading hierarchy skipped',
          element: `h${level}[${index}]`,
          wcagLevel: '1.3.1',
          suggestion: 'Maintain proper heading hierarchy (h1 → h2 → h3)'
        });
      }
      previousLevel = level;
    });

    // Check for color contrast (simplified check)
    const textElements = document.querySelectorAll('p, span, div, a, button');
    textElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // This is a simplified check - in a real implementation, you'd use a proper contrast checker
      if (color === backgroundColor) {
        newIssues.push({
          type: 'error',
          message: 'Insufficient color contrast',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          wcagLevel: '1.4.3',
          suggestion: 'Ensure text has sufficient contrast with background'
        });
      }
    });

    // Check for focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    focusableElements.forEach((element, index) => {
      const styles = window.getComputedStyle(element);
      const outline = styles.outline;
      const outlineWidth = styles.outlineWidth;
      
      if (outline === 'none' && outlineWidth === '0px') {
        newIssues.push({
          type: 'warning',
          message: 'Focus indicator missing',
          element: `${element.tagName.toLowerCase()}[${index}]`,
          wcagLevel: '2.4.7',
          suggestion: 'Add visible focus indicators for keyboard navigation'
        });
      }
    });

    setIssues(newIssues);
    setIsChecking(false);
  };

  const getIssueIcon = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getIssueColor = (type: AccessibilityIssue['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast');
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    document.documentElement.classList.toggle('reduced-motion');
  };

  const increaseFontSize = () => {
    setFontSize(prev => Math.min(prev + 2, 24));
    document.documentElement.style.fontSize = `${fontSize + 2}px`;
  };

  const decreaseFontSize = () => {
    setFontSize(prev => Math.max(prev - 2, 12));
    document.documentElement.style.fontSize = `${fontSize - 2}px`;
  };

  const resetFontSize = () => {
    setFontSize(16);
    document.documentElement.style.fontSize = '16px';
  };

  if (!showDetails) {
    return (
      <div className={className}>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleHighContrast}
            className={highContrast ? 'bg-blue-100' : ''}
          >
            {highContrast ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            High Contrast
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleReducedMotion}
            className={reducedMotion ? 'bg-blue-100' : ''}
          >
            {reducedMotion ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            Reduced Motion
          </Button>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={decreaseFontSize}>
              A-
            </Button>
            <Button variant="outline" size="sm" onClick={resetFontSize}>
              A
            </Button>
            <Button variant="outline" size="sm" onClick={increaseFontSize}>
              A+
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Accessibility Checker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Accessibility Controls */}
        <div>
          <h4 className="font-semibold mb-2">Accessibility Controls</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleHighContrast}
              className={highContrast ? 'bg-blue-100' : ''}
            >
              {highContrast ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              High Contrast
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleReducedMotion}
              className={reducedMotion ? 'bg-blue-100' : ''}
            >
              {reducedMotion ? <VolumeX className="w-4 h-4 mr-2" /> : <Volume2 className="w-4 h-4 mr-2" />}
              Reduced Motion
            </Button>
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={decreaseFontSize}>
                A-
              </Button>
              <Button variant="outline" size="sm" onClick={resetFontSize}>
                A
              </Button>
              <Button variant="outline" size="sm" onClick={increaseFontSize}>
                A+
              </Button>
            </div>
          </div>
        </div>

        {/* Accessibility Issues */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Accessibility Issues</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={runAccessibilityChecks}
              disabled={isChecking}
            >
              {isChecking ? 'Checking...' : 'Check Again'}
            </Button>
          </div>
          
          {issues.length === 0 ? (
            <div className="text-center py-4 text-green-600">
              <CheckCircle className="w-8 h-8 mx-auto mb-2" />
              <p>No accessibility issues found!</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium">{issue.message}</p>
                      <Badge className={getIssueColor(issue.type)}>
                        {issue.wcagLevel}
                      </Badge>
                    </div>
                    {issue.element && (
                      <p className="text-xs text-gray-600 mb-1">Element: {issue.element}</p>
                    )}
                    {issue.suggestion && (
                      <p className="text-xs text-gray-700">{issue.suggestion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* WCAG Guidelines */}
        <div className="pt-4 border-t">
          <h4 className="font-semibold mb-2">WCAG 2.1 AA Guidelines</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 1.1.1: Non-text content has text alternatives</li>
            <li>• 1.3.1: Information and relationships are preserved</li>
            <li>• 1.4.3: Text has sufficient color contrast (4.5:1)</li>
            <li>• 2.4.7: Focus is visible and keyboard accessible</li>
            <li>• 3.2.1: Focus doesn't trigger unexpected changes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityChecker;

