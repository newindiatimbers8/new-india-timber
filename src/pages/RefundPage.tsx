/**
 * Refund Policy Page
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getLegalPage } from "@/services/legal";
import type { LegalPage } from "@/types/legal";

const BREADCRUMBS = [{ label: "Refund Policy", href: "/refund", icon: "scale" }];

const RefundPage = () => {
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadRefundPolicy = async () => {
      try {
        const page = await getLegalPage('refund');
        setLegalPage(page);
      } catch (error) {
        console.error('Failed to load refund policy:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRefundPolicy();
  }, []);

  const defaultContent = `
# Refund & Return Policy

**Effective Date**: January 1, 2025  
**Last Updated**: January 1, 2025

## Return Conditions

### Eligible Returns
- Standard timber products in original condition within 7 days of delivery
- Defective or damaged products (report within 24 hours of delivery)
- Products that do not match specifications as agreed

### Non-Returnable Items
- Custom-cut timber pieces made to specific dimensions
- Products that have been installed or used
- Items damaged due to improper storage or handling
- Special order items sourced specifically for your project

## Return Process

### Step 1: Contact Us
Contact New India Timber within the return period:
- Phone: +91 9886033342
- Email: returns@newindiatimber.com
- Provide order number and reason for return

### Step 2: Inspection
- Our team will inspect the products at your location in Bangalore
- Products must be in original condition with all packaging
- Photos may be required for initial assessment

### Step 3: Approval
- Return approval will be provided within 2 business days
- Approved returns will receive pickup instructions
- Return shipping costs are borne by customer unless product is defective

### Step 4: Pickup
- Scheduled pickup from your location in Bangalore/Karnataka
- Products must be properly packaged for transport
- Return receipt will be provided upon pickup

## Refund Process

### Processing Time
- Refunds are processed within 7-10 business days after return approval
- Bank transfers typically take 3-5 additional business days
- Credit card refunds may take 5-7 business days depending on your bank

### Refund Amount
- Full purchase price for defective or incorrect products
- Purchase price minus delivery charges for customer-initiated returns
- Custom orders subject to 25% restocking fee if cancellation is after cutting

### Refund Method
- Refunds will be issued to the original payment method
- Bank transfer available for cash payments
- Check payments for large commercial orders

## Damaged or Defective Products

### Immediate Reporting
- Report damage or defects within 24 hours of delivery
- Provide photos of damaged items and packaging
- Do not attempt to use or install damaged products

### Our Response
- Immediate replacement for defective products
- Full refund including delivery charges
- Compensation for any installation delays caused by our defective products

### Quality Guarantee
- All timber products are guaranteed to meet specified grades and quality standards
- Moisture content and dimensional accuracy are verified before shipment
- Certificates of authenticity provided for premium wood species

## Special Circumstances

### Weather-Related Issues
- Delivery delays due to monsoon or extreme weather are not grounds for refund
- Customers are responsible for proper storage during weather delays
- We will coordinate with customers to ensure safe delivery timing

### Installation Issues
- Installation services are provided by third-party contractors
- Installation warranty is separate from product warranty
- Installation-related issues do not qualify for product refunds

### Bulk Orders
- Bulk orders have modified return terms due to logistics complexity
- Partial returns may be accepted for large orders
- Commercial customers may negotiate specific return terms

## Cancellation Policy

### Order Cancellation
- Orders can be cancelled within 2 hours of placement without penalty
- Cancellation after cutting/processing incurs 25% restocking fee
- Custom orders cannot be cancelled once cutting has begun

### Delivery Rescheduling
- Delivery can be rescheduled up to 2 times without charge
- Additional rescheduling may incur storage and handling fees
- Customer must provide 24-hour notice for rescheduling

## Contact Information

For returns, refunds, or questions about this policy:

**New India Timber Returns Department**  
Email: returns@newindiatimber.com  
Phone: +91 9886033342  
Address: Bangalore, Karnataka, India  
Business Hours: Monday-Saturday 9:00 AM - 7:00 PM

## Governing Law

This refund policy is governed by:
- Consumer Protection Act 2019
- Indian Contract Act 1872
- Karnataka state commercial regulations
- Disputes will be resolved in Bangalore, Karnataka courts

---

*This policy ensures compliance with Indian consumer protection laws and Karnataka commercial regulations.*
  `;

  return (
    <Layout>
      <Helmet>
        <title>Refund Policy | New India Timbers Bangalore</title>
        <meta
          name="description"
          content="Refund and return policy for New India Timbers. Learn about our timber product return and refund procedures in Bangalore."
        />
        <meta
          name="keywords"
          content="refund policy new india timbers, timber return policy bangalore, wood products refund bangalore, timber company refund policy, return policy bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Refund Policy",
            "description": "Refund and return policy for New India Timbers products and services"
          })}
        </script>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={BREADCRUMBS} withHomeLink className="text-xs mb-6" />
        
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-forest-900 mb-4">Refund & Return Policy</h1>
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
                  {Array.from({ length: 10 }).map((_, index) => (
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
              Need help with a return or refund? Contact our support team.
            </p>
            <a 
              href="mailto:returns@newindiatimber.com" 
              className="text-timber-600 hover:text-timber-700 underline"
            >
              returns@newindiatimber.com
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RefundPage;
