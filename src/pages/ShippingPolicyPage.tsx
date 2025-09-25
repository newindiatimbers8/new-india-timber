/**
 * Shipping Policy Page
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getLegalPage } from "@/services/legal";
import type { LegalPage } from "@/types/legal";

const BREADCRUMBS = [{ label: "Shipping Policy", href: "/shipping-policy", icon: "truck" }];

const ShippingPolicyPage = () => {
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadShippingPolicy = async () => {
      try {
        const page = await getLegalPage('shipping');
        setLegalPage(page);
      } catch (error) {
        console.error('Failed to load shipping policy:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadShippingPolicy();
  }, []);

  const defaultContent = `
# Shipping Policy

**Effective Date**: January 1, 2025
**Last Updated**: January 1, 2025

## Delivery Areas

New India Timber provides delivery services across:
- **Bangalore City**: All areas within Bangalore city limits
- **Bangalore Metropolitan Region**: Including Whitefield, Electronic City, Marathahalli, HSR Layout
- **Karnataka State**: Major cities and towns within Karnataka
- **Custom Deliveries**: Special arrangements for remote Karnataka locations

## Delivery Timeframes

### Standard Delivery
- **Bangalore City**: Same day or next day delivery
- **Bangalore Metropolitan**: 1-2 business days
- **Karnataka State**: 2-5 business days
- **Custom Orders**: 3-7 business days depending on specifications

### Express Delivery (Additional Charges Apply)
- **Bangalore City**: Within 4 hours (during business hours)
- **Bangalore Metropolitan**: Same day delivery
- **Emergency Orders**: Contact us for urgent requirements

## Delivery Charges

### Bangalore City
- **Small orders**: Delivery charge applies
- **Medium orders**: Reduced delivery charge
- **Large orders**: Free delivery

### Bangalore Metropolitan Region
- **Small orders**: Standard delivery charge
- **Medium orders**: Reduced delivery charge
- **Large orders**: Minimal delivery charge

### Karnataka State (Outside Bangalore)
- **Small orders**: Higher delivery charge
- **Medium orders**: Standard delivery charge
- **Large orders**: Reduced delivery charge

## Bulk Orders

### Large Quantity Deliveries
- **Full truck loads**: Negotiated delivery rates
- **Multiple locations**: Additional charges may apply
- **Scheduled deliveries**: Discounted rates for regular deliveries

### Construction Projects
- **Site delivery**: Special arrangements for construction sites
- **Phased delivery**: Delivery according to project schedule
- **Heavy equipment**: Additional charges for crane/lifting services

## Delivery Process

### 1. Order Confirmation
- All deliveries require confirmed orders
- Payment terms must be agreed upon before dispatch
- Special delivery instructions noted

### 2. Dispatch Notification
- SMS and call confirmation before dispatch
- Estimated delivery time provided
- Tracking information shared (where applicable)

### 3. Delivery Execution
- Professional delivery team
- Quality check before dispatch
- Installation assistance available (additional charges)

### 4. Delivery Confirmation
- Customer signature required
- Digital proof of delivery
- Installation verification (if applicable)

## Special Considerations

### Weather Conditions
- Deliveries may be delayed due to heavy rain or other severe weather
- Alternative delivery dates offered in such cases
- Customer safety is our priority

### Traffic and Road Conditions
- Bangalore traffic considered in delivery estimates
- Alternative routes planned for major traffic disruptions
- Real-time updates provided to customers

### Restricted Areas
- Some areas may have delivery restrictions
- Special permissions required for certain locations
- Additional charges may apply

## International Shipping

Currently, New India Timber only provides delivery services within India, with primary focus on Karnataka state. For international inquiries, please contact our sales team for special arrangements.

## Contact Information

For delivery-related questions or special requirements:

**New India Timber**  
Email: delivery@newindiatimber.com  
Phone: +91 9886033342  
Address: Bangalore, Karnataka, India

## Changes to This Policy

We may update this shipping policy periodically to reflect changes in our delivery processes, rates, or service areas. Customers will be notified of significant changes via email or order confirmations.

## Governing Law

This shipping policy is governed by the laws of India and the state of Karnataka. Any disputes will be resolved in the courts of Bangalore, Karnataka.

---

*This policy ensures reliable and professional delivery services across Bangalore and Karnataka.*
  `;

  return (
    <Layout>
      <Helmet>
        <title>Shipping & Delivery Policy | New India Timbers Bangalore</title>
        <meta
          name="description"
          content="Shipping and delivery policy for New India Timbers. Learn about timber delivery options, timelines, and coverage areas in Bangalore and Karnataka."
        />
        <meta
          name="keywords"
          content="timber delivery bangalore, wood shipping policy bangalore, timber delivery karnataka, wood delivery bangalore, timber shipping bangalore, delivery policy bangalore, timber transport bangalore, wood delivery service bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Shipping & Delivery Policy",
            "description": "Shipping and delivery policy for New India Timbers products"
          })}
        </script>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={BREADCRUMBS} withHomeLink className="text-xs mb-6" />

        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-forest-900 mb-4">Shipping Policy</h1>
            {legalPage && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Version {legalPage.version}</span>
                <span>•</span>
                <span>Effective {new Date(legalPage.effectiveDate).toLocaleDateString()}</span>
                <span>•</span>
                <span>Jurisdiction: {legalPage.jurisdiction}</span>
              </div>
            )}
          </header>

          <Card className="border border-timber-100">
            <CardContent className="p-8">
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="h-4 animate-pulse rounded bg-timber-100" />
                  ))}
                </div>
              ) : (
                <div
                  className="prose prose-neutral max-w-none prose-h1:text-forest-900 prose-h2:text-forest-800 prose-a:text-timber-600"
                  dangerouslySetInnerHTML={{
                    __html: legalPage?.content?.replace(/\n/g, '<br>') || defaultContent.replace(/\n/g, '<br>')
                  }}
                />
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Questions about our shipping policy? Contact our delivery team.
            </p>
            <a
              href="mailto:delivery@newindiatimber.com"
              className="text-timber-600 hover:text-timber-700 underline"
            >
              delivery@newindiatimber.com
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ShippingPolicyPage;
