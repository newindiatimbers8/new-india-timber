/**
 * CodeSplitting Component
 * Implements dynamic imports and code splitting for better performance
 */

import React, { Suspense, lazy, ComponentType } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

// Loading component for suspense fallback
const LoadingSpinner: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  </div>
);

// Skeleton loader for different content types
const ProductSkeleton: React.FC = () => (
  <div className="space-y-4">
    <Skeleton className="h-64 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

const ImageSkeleton: React.FC = () => (
  <div className="space-y-2">
    <Skeleton className="h-48 w-full" />
    <div className="flex gap-2">
      <Skeleton className="h-12 w-12" />
      <Skeleton className="h-12 w-12" />
      <Skeleton className="h-12 w-12" />
    </div>
  </div>
);

// Lazy-loaded components
const LazyProductImages = lazy(() => import('@/components/products/ProductImages'));
const LazyProductSpecifications = lazy(() => import('@/components/products/ProductSpecifications'));
const LazyProductApplications = lazy(() => import('@/components/products/ProductApplications'));
const LazyProductPricing = lazy(() => import('@/components/products/ProductPricing'));
const LazyProductComparison = lazy(() => import('@/components/products/ProductComparison'));
const LazyImageGallery = lazy(() => import('@/components/products/ImageGallery'));
const LazyPerformanceMonitor = lazy(() => import('@/components/performance/PerformanceMonitor'));

// Higher-order component for code splitting
export const withCodeSplitting = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(() => import(`@/components/${Component.name}`));
  
  return (props: P) => (
    <Suspense fallback={fallback ? <fallback /> : <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Route-based code splitting
export const LazyProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
export const LazyProductsPage = lazy(() => import('@/pages/ProductsPage'));
export const LazyBlogPage = lazy(() => import('@/pages/Blog'));
export const LazyAboutPage = lazy(() => import('@/pages/AboutPage'));
export const LazyContactPage = lazy(() => import('@/pages/ContactPage'));

// Feature-based code splitting
export const LazyAdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'));
export const LazyAdminProducts = lazy(() => import('@/pages/admin/ProductsPage'));
export const LazyAdminOrders = lazy(() => import('@/pages/admin/OrdersPage'));

// Component-based code splitting
export const LazyProductImagesWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ImageSkeleton />}>
    <LazyProductImages {...props} />
  </Suspense>
);

export const LazyProductSpecificationsWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ProductSkeleton />}>
    <LazyProductSpecifications {...props} />
  </Suspense>
);

export const LazyProductApplicationsWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ProductSkeleton />}>
    <LazyProductApplications {...props} />
  </Suspense>
);

export const LazyProductPricingWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ProductSkeleton />}>
    <LazyProductPricing {...props} />
  </Suspense>
);

export const LazyProductComparisonWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ProductSkeleton />}>
    <LazyProductComparison {...props} />
  </Suspense>
);

export const LazyImageGalleryWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<ImageSkeleton />}>
    <LazyImageGallery {...props} />
  </Suspense>
);

export const LazyPerformanceMonitorWithSuspense: React.FC<any> = (props) => (
  <Suspense fallback={<LoadingSpinner message="Loading performance monitor..." />}>
    <LazyPerformanceMonitor {...props} />
  </Suspense>
);

// Preload function for critical components
export const preloadComponent = (importFunction: () => Promise<any>) => {
  return () => {
    importFunction();
  };
};

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload product images component
  preloadComponent(() => import('@/components/products/ProductImages'))();
  
  // Preload product specifications component
  preloadComponent(() => import('@/components/products/ProductSpecifications'))();
  
  // Preload product pricing component
  preloadComponent(() => import('@/components/products/ProductPricing'))();
};

// Hook for managing code splitting
export const useCodeSplitting = () => {
  const [loadedComponents, setLoadedComponents] = React.useState<Set<string>>(new Set());
  
  const loadComponent = React.useCallback((componentName: string) => {
    if (loadedComponents.has(componentName)) {
      return Promise.resolve();
    }
    
    // This would be implemented based on your component structure
    return Promise.resolve().then(() => {
      setLoadedComponents(prev => new Set(prev).add(componentName));
    });
  }, [loadedComponents]);
  
  const isComponentLoaded = React.useCallback((componentName: string) => {
    return loadedComponents.has(componentName);
  }, [loadedComponents]);
  
  return {
    loadComponent,
    isComponentLoaded,
    loadedComponents: Array.from(loadedComponents)
  };
};

// Main CodeSplitting component for demonstration
const CodeSplitting: React.FC = () => {
  const [showDemo, setShowDemo] = React.useState(false);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Splitting Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          This component demonstrates code splitting and lazy loading. Components are loaded on-demand to improve performance.
        </p>
        
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          {showDemo ? 'Hide' : 'Show'} Lazy Components
        </button>
        
        {showDemo && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Lazy Product Images</h4>
              <LazyProductImagesWithSuspense />
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Lazy Performance Monitor</h4>
              <LazyPerformanceMonitorWithSuspense showDetails={true} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CodeSplitting;

