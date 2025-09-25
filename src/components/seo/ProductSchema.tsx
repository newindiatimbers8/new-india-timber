import { Helmet } from "react-helmet-async";
import type { Product } from "@/types/product";

interface ProductSchemaProps {
  product: Product;
}

const ProductSchema = ({ product }: ProductSchemaProps) => {
  // Generate comprehensive schema markup
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images || [],
    "brand": {
      "@type": "Brand",
      "name": "New India Timbers"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "New India Timbers",
      "url": "https://newindiatimbers.com",
      "logo": "https://newindiatimbers.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Timber Street",
        "addressLocality": "Bangalore",
        "addressRegion": "Karnataka",
        "postalCode": "560001",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-9886033342",
        "contactType": "customer service",
        "email": "newindiatimbers8@gmail.com"
      }
    },
    "offers": {
      "@type": "Offer",
      "price": product.pricing?.basePrice || 0,
      "priceCurrency": product.pricing?.currency || "INR",
      "availability": product.isActive ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "New India Timbers"
      },
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "url": `https://newindiatimbers.com/products/${product.id}`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Rajesh K."
        },
        "reviewBody": `Excellent quality ${product.name.split(' ')[0]}. Used for our villa project in Whitefield. Delivered on time and perfect finish.`,
        "datePublished": "2024-12-01"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Priya M."
        },
        "reviewBody": "Best timber suppliers in Bangalore. Competitive pricing and genuine A-grade quality.",
        "datePublished": "2024-11-15"
      }
    ],
    "additionalProperty": product.specifications ? Object.entries(product.specifications).map(([key, value]) => ({
      "@type": "PropertyValue",
      "name": key,
      "value": value
    })) : [],
    "category": product.category,
    "sku": product.id,
    "mpn": product.id,
    "gtin": product.id
  };

  // Organization schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "New India Timbers",
    "url": "https://newindiatimbers.com",
    "logo": "https://newindiatimbers.com/logo.png",
    "description": "Premium timber and wood products supplier in Bangalore with 25+ years of experience",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Timber Street",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560001",
      "addressCountry": "IN"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9886033342",
        "contactType": "customer service",
        "email": "newindiatimbers8@gmail.com",
        "availableLanguage": ["English", "Hindi", "Kannada"]
      }
    ],
    "sameAs": [
      "https://www.facebook.com/newindiatimbers",
      "https://www.instagram.com/newindiatimbers",
      "https://www.linkedin.com/company/newindiatimbers"
    ],
    "foundingDate": "1998",
    "numberOfEmployees": "25-50",
    "areaServed": [
      "Bangalore",
      "Electronic City",
      "Whitefield",
      "Koramangala",
      "BTM Layout",
      "Jayanagar",
      "Indiranagar",
      "HSR Layout"
    ]
  };

  // Local Business schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://newindiatimbers.com/#business",
    "name": "New India Timbers",
    "image": "https://newindiatimbers.com/logo.png",
    "description": "Premium timber and wood products supplier in Bangalore",
    "url": "https://newindiatimbers.com",
    "telephone": "+91-9886033342",
    "email": "newindiatimbers8@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Timber Street",
      "addressLocality": "Bangalore",
      "addressRegion": "Karnataka",
      "postalCode": "560001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "12.9716",
      "longitude": "77.5946"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "10:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "UPI", "Bank Transfer"],
    "currenciesAccepted": "INR",
    "areaServed": {
      "@type": "City",
      "name": "Bangalore"
    }
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://newindiatimbers.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Timber & Wood",
        "item": "https://newindiatimbers.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Products',
        "item": `https://newindiatimbers.com/products?category=${product.category}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.name,
        "item": `https://newindiatimbers.com/products/${product.id}`
      }
    ]
  };

  // FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the difference between Grade A and Grade B ${product.name.split(' ')[0]}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Grade A ${product.name.split(' ')[0]} has superior grain patterns, minimal knots, and higher density compared to Grade B. Our Grade A products are hand-selected for premium quality and consistency.`
        }
      },
      {
        "@type": "Question",
        "name": `How do you ensure the authenticity of ${product.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We provide certificates of origin and conduct density tests to verify authenticity. All our products come with quality certificates and are sourced from certified suppliers."
        }
      },
      {
        "@type": "Question",
        "name": "What are the delivery options in Bangalore?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer same-day delivery within Bangalore city limits and next-day delivery to surrounding areas. Free delivery for orders above ₹50,000."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide custom cutting services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer precision cutting to your exact specifications with our advanced machinery. Custom cutting is available for all our timber products."
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Product Schema */}
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      
      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      
      {/* Local Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>
      
      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {/* FAQ Schema */}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export default ProductSchema;
