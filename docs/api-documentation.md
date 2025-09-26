# API Documentation - Product Pages

## Overview

This document provides comprehensive API documentation for the product pages implementation in the New India Timbers e-commerce application. The API follows RESTful principles and includes comprehensive error handling, validation, and documentation.

## Base URL

```
https://newindiatimbers.com/api/v1
```

## Authentication

Currently, the API does not require authentication for read operations. Future versions may include API key authentication for write operations.

## Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Error Handling

Error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details"
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Endpoints

### Products

#### Get All Products

Retrieve a list of all available products.

**Endpoint:** `GET /products`

**Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of products per page (default: 20, max: 100)
- `category` (optional): Filter by product category
- `grade` (optional): Filter by product grade
- `search` (optional): Search term for product name or description
- `sort` (optional): Sort order (name, category, grade, created_at)
- `order` (optional): Sort direction (asc, desc)

**Example Request:**
```bash
GET /products?page=1&limit=10&category=hardwood&sort=name&order=asc
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "red-sal-wood",
        "name": "Red Sal Wood",
        "scientificName": "Shorea robusta",
        "category": "hardwood",
        "grade": "A",
        "description": "Premium hardwood timber with exceptional strength and durability",
        "shortDescription": "Premium hardwood for construction and furniture",
        "specifications": {
          "density": {
            "min": 800,
            "max": 900
          },
          "grainPattern": "straight",
          "texture": "coarse",
          "color": "Reddish-brown",
          "workability": "good",
          "durability": "excellent",
          "moistureResistance": "excellent",
          "insectResistance": "excellent"
        },
        "applications": [
          "Construction",
          "Furniture making",
          "Flooring"
        ],
        "pricing": {
          "type": "quote_based",
          "displayText": "Contact for Price",
          "ctaButton": {
            "text": "Get Quote",
            "action": "contact",
            "style": "primary"
          },
          "internalPricing": {
            "basePrice": 1500,
            "currency": "INR",
            "unit": "cubic-foot"
          },
          "isVisible": true
        },
        "images": [
          {
            "id": "img1",
            "productId": "red-sal-wood",
            "url": "/images/red-sal-wood.jpg",
            "altText": "Red Sal Wood",
            "context": "hero",
            "sequence": 1,
            "dimensions": {
              "width": 800,
              "height": 600,
              "aspectRatio": "4:3"
            },
            "metadata": {
              "generatedAt": "2024-01-01T00:00:00Z",
              "prompt": "Premium hardwood timber",
              "optimized": true,
              "seoKeywords": ["red sal wood", "hardwood", "timber"]
            },
            "isActive": true
          }
        ],
        "seo": {
          "metaTitle": "Red Sal Wood - Premium Hardwood | New India Timbers",
          "metaDescription": "Premium Red Sal Wood hardwood in Bangalore. 25+ years experience.",
          "keywords": ["red sal wood", "hardwood", "bangalore", "timber"],
          "canonicalUrl": "https://newindiatimbers.com/products/red-sal-wood",
          "ogTitle": "Red Sal Wood - Premium Hardwood",
          "ogDescription": "Premium Red Sal Wood hardwood with excellent quality.",
          "ogImage": "/images/red-sal-wood.jpg",
          "twitterCard": "summary_large_image"
        },
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 6,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  },
  "message": "Products retrieved successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

#### Get Product by ID

Retrieve detailed information about a specific product.

**Endpoint:** `GET /products/{productId}`

**Parameters:**
- `productId` (required): Unique identifier for the product

**Example Request:**
```bash
GET /products/red-sal-wood
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "product": {
      "id": "red-sal-wood",
      "name": "Red Sal Wood",
      "scientificName": "Shorea robusta",
      "category": "hardwood",
      "grade": "A",
      "description": "Premium hardwood timber with exceptional strength and durability",
      "shortDescription": "Premium hardwood for construction and furniture",
      "specifications": {
        "density": {
          "min": 800,
          "max": 900
        },
        "grainPattern": "straight",
        "texture": "coarse",
        "color": "Reddish-brown",
        "workability": "good",
        "durability": "excellent",
        "moistureResistance": "excellent",
        "insectResistance": "excellent"
      },
      "applications": [
        "Construction",
        "Furniture making",
        "Flooring"
      ],
      "pricing": {
        "type": "quote_based",
        "displayText": "Contact for Price",
        "ctaButton": {
          "text": "Get Quote",
          "action": "contact",
          "style": "primary"
        },
        "internalPricing": {
          "basePrice": 1500,
          "currency": "INR",
          "unit": "cubic-foot"
        },
        "isVisible": true
      },
      "images": [
        {
          "id": "img1",
          "productId": "red-sal-wood",
          "url": "/images/red-sal-wood.jpg",
          "altText": "Red Sal Wood",
          "context": "hero",
          "sequence": 1,
          "dimensions": {
            "width": 800,
            "height": 600,
            "aspectRatio": "4:3"
          },
          "metadata": {
            "generatedAt": "2024-01-01T00:00:00Z",
            "prompt": "Premium hardwood timber",
            "optimized": true,
            "seoKeywords": ["red sal wood", "hardwood", "timber"]
          },
          "isActive": true
        }
      ],
      "seo": {
        "metaTitle": "Red Sal Wood - Premium Hardwood | New India Timbers",
        "metaDescription": "Premium Red Sal Wood hardwood in Bangalore. 25+ years experience.",
        "keywords": ["red sal wood", "hardwood", "bangalore", "timber"],
        "canonicalUrl": "https://newindiatimbers.com/products/red-sal-wood",
        "ogTitle": "Red Sal Wood - Premium Hardwood",
        "ogDescription": "Premium Red Sal Wood hardwood with excellent quality.",
        "ogImage": "/images/red-sal-wood.jpg",
        "twitterCard": "summary_large_image"
      },
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Product retrieved successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

#### Search Products

Search for products based on various criteria.

**Endpoint:** `GET /products/search`

**Parameters:**
- `q` (required): Search query
- `category` (optional): Filter by category
- `grade` (optional): Filter by grade
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

**Example Request:**
```bash
GET /products/search?q=hardwood&category=hardwood&page=1&limit=10
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "red-sal-wood",
        "name": "Red Sal Wood",
        "category": "hardwood",
        "grade": "A",
        "description": "Premium hardwood timber with exceptional strength and durability",
        "images": [
          {
            "id": "img1",
            "url": "/images/red-sal-wood.jpg",
            "altText": "Red Sal Wood",
            "context": "hero"
          }
        ],
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "pages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "searchInfo": {
      "query": "hardwood",
      "filters": {
        "category": "hardwood"
      },
      "totalResults": 3,
      "searchTime": "0.045s"
    }
  },
  "message": "Search completed successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

### Categories

#### Get All Categories

Retrieve a list of all product categories.

**Endpoint:** `GET /categories`

**Example Request:**
```bash
GET /categories
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "hardwood",
        "name": "Hardwood",
        "description": "Premium hardwood timbers",
        "productCount": 3,
        "isActive": true
      },
      {
        "id": "teak",
        "name": "Teak",
        "description": "Teak varieties from different regions",
        "productCount": 2,
        "isActive": true
      },
      {
        "id": "imported",
        "name": "Imported",
        "description": "International timber varieties",
        "productCount": 1,
        "isActive": true
      }
    ]
  },
  "message": "Categories retrieved successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

### Images

#### Get Product Images

Retrieve images for a specific product.

**Endpoint:** `GET /products/{productId}/images`

**Parameters:**
- `productId` (required): Product identifier
- `context` (optional): Image context (hero, gallery, detail)
- `size` (optional): Image size (small, medium, large, xlarge)

**Example Request:**
```bash
GET /products/red-sal-wood/images?context=gallery&size=medium
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "images": [
      {
        "id": "img1",
        "productId": "red-sal-wood",
        "url": "/images/red-sal-wood-medium.jpg",
        "webpUrl": "/images/red-sal-wood-medium.webp",
        "altText": "Red Sal Wood",
        "context": "gallery",
        "sequence": 1,
        "dimensions": {
          "width": 800,
          "height": 600,
          "aspectRatio": "4:3"
        },
        "metadata": {
          "generatedAt": "2024-01-01T00:00:00Z",
          "prompt": "Premium hardwood timber",
          "optimized": true,
          "seoKeywords": ["red sal wood", "hardwood", "timber"]
        },
        "isActive": true
      }
    ]
  },
  "message": "Images retrieved successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

### SEO

#### Get Product SEO Data

Retrieve SEO metadata for a specific product.

**Endpoint:** `GET /products/{productId}/seo`

**Parameters:**
- `productId` (required): Product identifier

**Example Request:**
```bash
GET /products/red-sal-wood/seo
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "seo": {
      "metaTitle": "Red Sal Wood - Premium Hardwood | New India Timbers",
      "metaDescription": "Premium Red Sal Wood hardwood in Bangalore. 25+ years experience.",
      "keywords": ["red sal wood", "hardwood", "bangalore", "timber"],
      "canonicalUrl": "https://newindiatimbers.com/products/red-sal-wood",
      "ogTitle": "Red Sal Wood - Premium Hardwood",
      "ogDescription": "Premium Red Sal Wood hardwood with excellent quality.",
      "ogImage": "/images/red-sal-wood.jpg",
      "twitterCard": "summary_large_image",
      "structuredData": {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Red Sal Wood",
        "description": "Premium hardwood timber with exceptional strength and durability",
        "category": "hardwood",
        "brand": {
          "@type": "Brand",
          "name": "New India Timbers"
        },
        "offers": {
          "@type": "Offer",
          "seller": {
            "@type": "Organization",
            "name": "New India Timbers",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Timber Street",
              "addressLocality": "Bangalore",
              "addressRegion": "Karnataka",
              "postalCode": "560001",
              "addressCountry": "IN"
            }
          }
        }
      }
    }
  },
  "message": "SEO data retrieved successfully",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Error Codes

### HTTP Status Codes

- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Codes

- `PRODUCT_NOT_FOUND`: Product with specified ID not found
- `INVALID_PRODUCT_ID`: Invalid product ID format
- `INVALID_CATEGORY`: Invalid category specified
- `INVALID_GRADE`: Invalid grade specified
- `SEARCH_QUERY_REQUIRED`: Search query is required
- `INVALID_PAGINATION`: Invalid pagination parameters
- `IMAGE_NOT_FOUND`: Image not found
- `SEO_DATA_NOT_FOUND`: SEO data not found

## Rate Limiting

- **Rate Limit**: 100 requests per minute per IP
- **Burst Limit**: 10 requests per second
- **Headers**: Rate limit information included in response headers

## Caching

- **Product Data**: Cached for 1 hour
- **Images**: Cached for 24 hours
- **SEO Data**: Cached for 1 hour
- **Categories**: Cached for 6 hours

## Versioning

- **Current Version**: v1.0.0
- **Version Header**: `API-Version: 1.0.0`
- **Backward Compatibility**: Maintained for 12 months

## SDKs and Libraries

### JavaScript/TypeScript

```typescript
import { ProductAPI } from '@newindiatimbers/api-client';

const api = new ProductAPI({
  baseURL: 'https://newindiatimbers.com/api/v1'
});

// Get all products
const products = await api.products.getAll({
  page: 1,
  limit: 10,
  category: 'hardwood'
});

// Get product by ID
const product = await api.products.getById('red-sal-wood');

// Search products
const searchResults = await api.products.search({
  q: 'hardwood',
  category: 'hardwood'
});
```

### Python

```python
from newindiatimbers import ProductAPI

api = ProductAPI(base_url='https://newindiatimbers.com/api/v1')

# Get all products
products = api.products.get_all(
    page=1,
    limit=10,
    category='hardwood'
)

# Get product by ID
product = api.products.get_by_id('red-sal-wood')

# Search products
search_results = api.products.search(
    q='hardwood',
    category='hardwood'
)
```

## Testing

### Test Environment

- **Base URL**: `https://staging.newindiatimbers.com/api/v1`
- **Test Data**: Available in test environment
- **Rate Limits**: Higher limits for testing

### Postman Collection

A Postman collection is available for testing all endpoints:

```json
{
  "info": {
    "name": "New India Timbers API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/products"
          }
        }
      ]
    }
  ]
}
```

## Support

For API support and questions:

- **Documentation**: This file and inline code comments
- **Issues**: GitHub issues for bug reports
- **Email**: api-support@newindiatimbers.com
- **Status Page**: https://status.newindiatimbers.com

---

*Last updated: January 2024*
*Version: 1.0.0*

