/**
 * Privacy Policy Page
 */

import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { getLegalPage } from "@/services/legal";
import type { LegalPage } from "@/types/legal";

const BREADCRUMBS = [{ label: "Privacy Policy", href: "/privacy", icon: "scale" }];

const PrivacyPage = () => {
  const [legalPage, setLegalPage] = useState<LegalPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadPrivacyPolicy = async () => {
      try {
        const page = await getLegalPage('privacy');
        setLegalPage(page);
      } catch (error) {
        console.error('Failed to load privacy policy:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrivacyPolicy();
  }, []);

  const defaultContent = `
# Privacy Policy

**Effective Date**: January 1, 2025  
**Last Updated**: January 1, 2025

## Information We Collect

New India Timber collects information you provide directly to us when you:
- Contact us for timber consultations
- Request quotes for bulk orders
- Subscribe to our Bangalore timber insights newsletter
- Visit our showroom in Karnataka

### Personal Information
- Name and contact details
- Project requirements and specifications
- Delivery addresses within Bangalore and Karnataka
- Payment information for timber purchases

### Usage Information
- Website browsing patterns
- Product preferences and search queries
- Communication preferences

## How We Use Your Information

We use collected information to:
- Provide timber consultation and quotations
- Process and fulfill your orders
- Communicate about delivery schedules across Bangalore
- Send relevant timber industry updates for Karnataka projects
- Improve our services and website experience

## Information Sharing

New India Timber does not sell, trade, or rent your personal information to third parties. We may share information with:
- Delivery partners for timber transportation in Karnataka
- Payment processors for secure transactions
- Legal authorities when required by Indian law

## Data Security

We implement appropriate security measures to protect your information:
- Secure data storage in Indian servers
- Encrypted transmission of sensitive information
- Regular security audits and updates
- Restricted access to personal information

## Your Rights

Under Indian data protection laws, you have the right to:
- Access your personal information
- Request corrections to inaccurate data
- Request deletion of your information
- Opt-out of marketing communications
- File complaints with relevant authorities

## Cookies and Tracking

Our website uses cookies to:
- Remember your preferences and settings
- Analyze website traffic and usage patterns
- Provide personalized content recommendations
- Improve website performance and user experience

## Contact Information

For privacy-related questions or requests, contact us:

**New India Timber**  
Email: privacy@newindiatimber.com  
Phone: +91 9886033342  
Address: Bangalore, Karnataka, India

## Changes to This Policy

We may update this privacy policy periodically. We will notify users of significant changes via email or website notice. Continued use of our services constitutes acceptance of the updated policy.

## Governing Law

This privacy policy is governed by the laws of India and the state of Karnataka. Any disputes will be resolved in the courts of Bangalore, Karnataka.

---

*This policy complies with the Information Technology Act 2000 and Consumer Protection Act 2019.*
  `;

  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | New India Timbers Bangalore</title>
        <meta
          name="description"
          content="Privacy policy for New India Timbers. Learn how we protect your personal information and data when you use our timber services in Bangalore."
        />
        <meta
          name="keywords"
          content="privacy policy new india timbers, data protection bangalore, timber company privacy policy, wood suppliers privacy bangalore, customer data protection bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy",
            "description": "Privacy policy for New India Timbers website and services"
          })}
        </script>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={BREADCRUMBS} withHomeLink className="text-xs mb-6" />
        
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-forest-900 mb-4">Privacy Policy</h1>
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
                  {Array.from({ length: 8 }).map((_, index) => (
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
              Questions about our privacy policy? Contact our team.
            </p>
            <a 
              href="mailto:privacy@newindiatimber.com" 
              className="text-timber-600 hover:text-timber-700 underline"
            >
              privacy@newindiatimber.com
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage;
