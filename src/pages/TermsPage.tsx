/**
 * Terms of Service Page
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getLegalPage } from "@/services/legal";
import type { LegalPage } from "@/types/legal";

const BREADCRUMBS = [{ label: "Terms of Service", href: "/terms", icon: "scale" }];

const TermsPage = () => {
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadTermsOfService = async () => {
      try {
        const page = await getLegalPage('terms');
        setLegalPage(page);
      } catch (error) {
        console.error('Failed to load terms of service:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTermsOfService();
  }, []);

  const defaultContent = `
# Terms of Service

**Effective Date**: January 1, 2025  
**Last Updated**: January 1, 2025

## Acceptance of Terms

By accessing and using New India Timber's services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.

## Description of Service

New India Timber provides premium timber and plywood products to customers across Bangalore and Karnataka, including:
- Premium teak wood varieties (Burma, Ghana, Brazilian, Indian Sal)
- High-quality plywood solutions (Marine, Commercial, Laminated)
- Hardwood logs for construction and furniture projects
- Custom cutting and delivery services
- Expert consultation and project support

## User Obligations

### Accurate Information
- Provide accurate contact and delivery information
- Specify correct project requirements and quantities
- Maintain updated payment information

### Proper Use
- Use our services only for legitimate timber and construction needs
- Respect intellectual property rights
- Comply with local building codes and regulations in Karnataka

### Payment Terms
- Payment is due as per agreed terms (typically 50% advance, 50% on delivery)
- All prices are in Indian Rupees (INR)
- Additional charges may apply for delivery outside Bangalore city limits

## Product Information and Availability

### Quality Assurance
- All timber products undergo quality inspection before delivery
- We guarantee authenticity of wood species and grades
- Defective products will be replaced at no additional cost

### Availability
- Product availability is subject to seasonal and market conditions
- We reserve the right to substitute equivalent quality materials with customer approval
- Delivery timelines may vary based on order size and location within Karnataka

## Intellectual Property

### Our Content
- All website content, including text, images, and designs, is owned by New India Timber
- Product specifications and technical information are proprietary
- Unauthorized reproduction or distribution is prohibited

### Customer Content
- Customers retain rights to their project designs and specifications
- We may use anonymized project photos for marketing with permission

## Limitation of Liability

### Service Limitations
- New India Timber's liability is limited to the value of the specific product or service
- We are not responsible for construction delays due to external factors
- Weather-related delivery delays are beyond our control

### Exclusions
- We are not liable for indirect, incidental, or consequential damages
- Customer is responsible for proper storage and handling of delivered materials
- Installation services are provided by third-party contractors

## Delivery and Installation

### Delivery Terms
- Delivery is available across Bangalore and major Karnataka cities
- Customer must provide safe and accessible delivery location
- Additional charges apply for crane or special equipment requirements

### Installation Services
- Installation services are optional and provided by certified contractors
- Installation warranty is separate from product warranty
- Customer is responsible for obtaining necessary permits and approvals

## Returns and Refunds

### Return Conditions
- Custom-cut materials cannot be returned unless defective
- Standard products may be returned within 7 days in original condition
- Return shipping costs are borne by the customer unless product is defective

### Refund Process
- Refunds are processed within 7-10 business days
- Refund amount excludes delivery charges unless product is defective
- Custom orders require 25% restocking fee for cancellations

## Governing Law and Jurisdiction

### Applicable Law
- These terms are governed by the laws of India and the state of Karnataka
- All disputes are subject to the jurisdiction of courts in Bangalore, Karnataka
- Any legal proceedings must be conducted in English or Kannada

### Dispute Resolution
- We encourage resolution of disputes through direct communication
- Mediation services are available through Karnataka Chamber of Commerce
- Legal action should be a last resort after exhausting other options

## Privacy and Data Protection

Your privacy is important to us. Please review our Privacy Policy for information about how we collect, use, and protect your personal information in compliance with Indian data protection laws.

## Changes to Terms

### Modification Rights
- New India Timber reserves the right to modify these terms at any time
- Significant changes will be communicated via email or website notice
- Continued use of services constitutes acceptance of modified terms

### Notification Process
- Users will be notified of changes at least 30 days in advance
- Modified terms become effective on the specified date
- Users may discontinue services if they disagree with changes

## Contact Information

For questions about these terms of service:

**New India Timber**  
Email: legal@newindiatimber.com  
Phone: +91 9886033342  
Address: Bangalore, Karnataka, India  
Business Hours: Monday-Saturday 9:00 AM - 7:00 PM

---

*These terms comply with the Indian Contract Act 1872 and Consumer Protection Act 2019.*
  `;

  return (
    <Layout>
      <Helmet>
        <title>Terms of Service | New India Timbers Bangalore</title>
        <meta
          name="description"
          content="Terms of service for New India Timbers. Read our terms and conditions for timber products and services in Bangalore and Karnataka."
        />
        <meta
          name="keywords"
          content="terms of service new india timbers, timber company terms bangalore, wood suppliers terms bangalore, timber business terms karnataka, terms and conditions bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service",
            "description": "Terms of service for New India Timbers website and services"
          })}
        </script>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={BREADCRUMBS} withHomeLink className="text-xs mb-6" />
        
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-forest-900 mb-4">Terms of Service</h1>
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
              Questions about our terms of service? Contact our legal team.
            </p>
            <a 
              href="mailto:legal@newindiatimber.com" 
              className="text-timber-600 hover:text-timber-700 underline"
            >
              legal@newindiatimber.com
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;
