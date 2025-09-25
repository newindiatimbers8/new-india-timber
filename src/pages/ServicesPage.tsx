/**
 * Services Page - Main services overview
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { NavigationIcon } from "@/components/navigation/Icon";
import { cn } from "@/lib/utils";

const SERVICES_BREADCRUMBS = [{ label: "Services", href: "/services", icon: "briefcase" }];

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      id: "bulk-orders",
      title: "Bulk Orders",
      description: "Large quantity timber orders for commercial projects and construction sites across Bangalore",
      icon: "truck",
      features: ["Volume discounts", "Project scheduling", "Quality assurance", "Direct delivery"],
      link: "/bulk-orders",
      badge: "Popular"
    },
    {
      id: "custom-solutions",
      title: "Custom Solutions",
      description: "Tailored timber solutions for unique architectural and design requirements",
      icon: "puzzle",
      features: ["Custom cutting", "Design consultation", "Material selection", "Installation support"],
      link: "/services/custom",
      badge: "Premium"
    },
    {
      id: "delivery",
      title: "Delivery & Logistics",
      description: "Professional delivery services across Bangalore and Karnataka with tracking",
      icon: "route",
      features: ["Same-day delivery", "Installation support", "Damage protection", "Flexible scheduling"],
      link: "/services/delivery",
      badge: "Fast"
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Timber Services in Bangalore | Custom Wood Solutions & Delivery</title>
        <meta
          name="description"
          content="Professional timber services in Bangalore including custom sizing, finishing, bulk orders, and delivery across Karnataka. Expert wood solutions for all projects."
        />
        <meta
          name="keywords"
          content="timber services bangalore, custom wood solutions bangalore, timber delivery bangalore, bulk timber orders bangalore, wood finishing services karnataka, custom timber sizing bangalore, timber consultation bangalore, wood treatment services bangalore, timber installation bangalore, professional timber services karnataka"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Timber Services",
            "description": "Professional timber services including custom sizing, finishing, and delivery",
            "provider": {
              "@type": "LocalBusiness",
              "name": "New India Timbers"
            },
            "areaServed": {
              "@type": "State",
              "name": "Karnataka"
            }
          })}
        </script>
      </Helmet>

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={SERVICES_BREADCRUMBS} withHomeLink className="text-xs mb-6" />
        
        <header className="max-w-2xl space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-forest-900 md:text-4xl">
            Professional Timber Services
          </h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive timber solutions for builders, architects, and homeowners across Bangalore and Karnataka.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="group overflow-hidden border border-timber-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <NavigationIcon name={service.icon} className="text-timber-600" size={24} />
                  <Badge variant="outline" className="rounded-full border-timber-200 text-xs">
                    {service.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-forest-900 group-hover:text-timber-600 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-timber-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to={service.link}>
                  <Button className="w-full mt-4 bg-timber-600 hover:bg-timber-700">
                    Learn More
                    <NavigationIcon name="chevron-right" className="ml-2" size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact CTA */}
        <section className="mt-16 rounded-3xl bg-gradient-to-r from-timber-50 to-forest-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-forest-900 mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our timber experts are ready to help you find the perfect solution for your Bangalore project. 
            Get personalized recommendations and quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-timber-600 hover:bg-timber-700">
                <NavigationIcon name="phone" className="mr-2" />
                Contact Our Experts
              </Button>
            </Link>
            <Link to="https://wa.me/919886033342?text=Hello%20I%20need%20custom%20timber%20solutions">
              <Button size="lg" variant="outline" className="border-timber-200">
                <NavigationIcon name="phone" className="mr-2" />
                WhatsApp Consultation
              </Button>
            </Link>
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default ServicesPage;
