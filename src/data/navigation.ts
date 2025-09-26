import type { NavigationMenu } from '@/types/navigation';

export const navigationData: NavigationMenu[] = [
  {
    "id": "main-navigation",
    "name": "main",
    "displayName": "Main Navigation",
    "type": "main",
    "items": [
      {
        "id": "nav-home",
        "label": "Home",
        "url": "/",
        "type": "page",
        "icon": "home",
        "description": "Return to the New India Timber homepage",
        "order": 1,
        "isExternal": false,
        "isVisible": true
      },
      {
        "id": "nav-products",
        "label": "Products",
        "url": "/products",
        "icon": "package",
        "description": "Premium timber solutions for Bangalore projects",
        "order": 2,
        "isExternal": false,
        "isVisible": true,
        "type": "page",
        "children": [
          {
            "id": "nav-products-teak",
            "label": "Teak Wood",
            "url": "/products?category=teak",
            "icon": "tree-pine",
            "description": "Imported and local teak varieties",
            "order": 1,
            "isExternal": false,
            "isVisible": true,
            "children": [
              {
                "id": "nav-products-teak-burma",
                "label": "Burma Teak",
                "url": "/products/wood/burma-teak",
                "order": 1,
                "isExternal": false,
                "isVisible": true,
                "type": "page"
              },
              {
                "id": "nav-products-teak-ghana",
                "label": "Ghana Teak",
                "url": "/products/wood/ghana-teak",
                "order": 2,
                "isExternal": false,
                "isVisible": true,
                "type": "page"
              }
            ],
            "type": "category"
          },
          {
            "id": "nav-products-plywood",
            "label": "Plywood",
            "url": "/products?category=plywood",
            "icon": "layers",
            "description": "Marine grade, commercial, and premium plywood",
            "order": 2,
            "isExternal": false,
            "isVisible": true,
            "children": [
              {
                "id": "nav-products-plywood-marine",
                "label": "Marine Grade",
                "url": "/products?category=plywood&grade=marine",
                "order": 1,
                "isExternal": false,
                "isVisible": true,
                "type": "category"
              },
              {
                "id": "nav-products-plywood-commercial",
                "label": "Commercial",
                "url": "/products?category=plywood&grade=commercial",
                "order": 2,
                "isExternal": false,
                "isVisible": true,
                "type": "category"
              }
            ],
            "type": "category"
          },
          {
            "id": "nav-products-hardwood",
            "label": "Hardwood Logs",
            "url": "/products?category=hardwood",
            "icon": "logs",
            "description": "Structural hardwood logs sourced within Karnataka",
            "order": 3,
            "isExternal": false,
            "isVisible": true,
            "type": "category"
          }
        ]
      },
      {
        "id": "nav-services",
        "label": "Services",
        "url": "/services",
        "icon": "briefcase",
        "description": "Bulk orders, custom solutions, and delivery support",
        "order": 3,
        "isExternal": false,
        "isVisible": true,
        "children": [
          {
            "id": "nav-services-bulk-orders",
            "label": "Bulk Orders",
            "url": "/bulk-orders",
            "icon": "truck",
            "order": 1,
            "isExternal": false,
            "isVisible": true,
            "type": "page"
          },
          {
            "id": "nav-services-custom-solutions",
            "label": "Custom Solutions",
            "url": "/services/custom",
            "icon": "puzzle",
            "order": 2,
            "isExternal": false,
            "isVisible": true,
            "type": "page"
          },
          {
            "id": "nav-services-delivery",
            "label": "Delivery",
            "url": "/services/delivery",
            "icon": "route",
            "order": 3,
            "isExternal": false,
            "isVisible": true,
            "type": "page"
          }
        ],
        "type": "page"
      },
      {
        "id": "nav-blog",
        "label": "Blog",
        "url": "/blog",
        "icon": "newspaper",
        "description": "Insights and guides for Bangalore timber projects",
        "order": 4,
        "isExternal": false,
        "isVisible": true,
        "children": [
          {
            "id": "nav-blog-timber-tips",
            "label": "Timber Tips Bangalore",
            "url": "/blog/category/timber-tips-bangalore",
            "order": 1,
            "isExternal": false,
            "isVisible": true,
            "type": "category"
          },
          {
            "id": "nav-blog-sustainability",
            "label": "Sustainability",
            "url": "/blog/category/sustainability",
            "order": 2,
            "isExternal": false,
            "isVisible": true,
            "type": "category"
          },
          {
            "id": "nav-blog-construction",
            "label": "Construction Guide",
            "url": "/blog/category/construction-guide",
            "order": 3,
            "isExternal": false,
            "isVisible": true,
            "type": "category"
          },
          {
            "id": "nav-blog-maintenance",
            "label": "Maintenance Tips",
            "url": "/blog/category/maintenance-tips",
            "order": 4,
            "isExternal": false,
            "isVisible": true,
            "type": "category"
          }
        ],
        "type": "page"
      },
      {
        "id": "nav-about",
        "label": "About",
        "url": "/about",
        "icon": "info",
        "order": 5,
        "isExternal": false,
        "isVisible": true,
        "type": "page"
      },
      {
        "id": "nav-contact",
        "label": "Contact",
        "url": "/contact",
        "icon": "phone",
        "order": 6,
        "isExternal": false,
        "isVisible": true,
        "type": "page"
      },
      {
        "id": "nav-estimator",
        "label": "Price Estimator",
        "url": "/estimator",
        "icon": "calculator",
        "description": "Get instant price estimates for your timber needs",
        "order": 7,
        "isExternal": false,
        "isVisible": true,
        "type": "page"
      },
      {
        "id": "nav-comparison",
        "label": "Product Comparison",
        "url": "/compare",
        "icon": "git-compare",
        "description": "Compare different timber products side by side",
        "order": 8,
        "isExternal": false,
        "isVisible": true,
        "type": "page"
      },
      {
        "id": "nav-dashboard",
        "label": "My Dashboard",
        "url": "/dashboard",
        "icon": "layout-dashboard",
        "description": "Track your orders and manage your account",
        "order": 9,
        "isExternal": false,
        "isVisible": true,
        "type": "page"
      },
      {
        "id": "nav-legal",
        "label": "Legal",
        "url": "#",
        "icon": "file-text",
        "description": "Terms, privacy policy, and legal information",
        "order": 10,
        "isExternal": false,
        "isVisible": true,
        "type": "category",
        "children": [
          {
            "id": "nav-legal-terms",
            "label": "Terms of Service",
            "url": "/terms",
            "order": 1,
            "isExternal": false,
            "isVisible": true,
            "type": "page"
          },
          {
            "id": "nav-legal-privacy",
            "label": "Privacy Policy",
            "url": "/privacy",
            "order": 2,
            "isExternal": false,
            "isVisible": true,
            "type": "page"
          },
          {
            "id": "nav-legal-refund",
            "label": "Refund Policy",
            "url": "/refund",
            "order": 3,
            "isExternal": false,
            "isVisible": true,
            "type": "page"
          },
          {
            "id": "nav-legal-shipping",
            "label": "Shipping Policy",
            "url": "/shipping-policy",
            "order": 4,
            "isExternal": false,
            "isVisible": true,
            "type": "page"
          }
        ]
      },
      {
        "id": "nav-directions",
        "label": "Get Directions",
        "url": "https://share.google/wy5zsZJlZLGB41zl7",
        "icon": "map-pin",
        "description": "Find our workshop location",
        "order": 11,
        "isExternal": true,
        "isVisible": true,
        "type": "external"
      }
    ],
    "settings": {
      "maxDepth": 3,
      "showIcons": true,
      "showDescriptions": true,
      "mobileCollapsible": true,
      "theme": "auto"
    },
    "isActive": true,
    "version": 1,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
];

export default navigationData;
