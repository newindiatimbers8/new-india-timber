/**
 * Custom Solutions Page
 */

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/navigation/Breadcrumbs";
import { NavigationIcon } from "@/components/navigation/Icon";

const BREADCRUMBS = [
  { label: "Services", href: "/services", icon: "briefcase" },
  { label: "Custom Solutions", href: "/services/custom", icon: "puzzle" }
];

const CustomSolutionsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const solutions = [
    {
      title: "Architectural Timber",
      description: "Custom-cut timber for unique architectural designs and heritage restorations in Bangalore",
      features: ["Precision cutting", "Heritage wood matching", "Structural engineering support"]
    },
    {
      title: "Furniture Grade Wood",
      description: "Premium wood selection and processing for high-end furniture makers",
      features: ["Grain matching", "Moisture control", "Custom dimensions"]
    },
    {
      title: "Commercial Interiors",
      description: "Large-scale timber solutions for offices, hotels, and commercial spaces",
      features: ["Project management", "Bulk pricing", "Installation coordination"]
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Custom Timber Solutions Bangalore | Architectural & Furniture Wood</title>
        <meta
          name="description"
          content="Custom timber solutions for architectural projects, furniture making, and commercial interiors in Bangalore. Expert consultation and precision cutting services."
        />
        <meta
          name="keywords"
          content="custom timber solutions bangalore, architectural wood bangalore, furniture grade timber bangalore, custom wood cutting bangalore, precision timber cutting bangalore, bespoke timber bangalore, custom wood solutions karnataka, architectural timber bangalore, furniture timber bangalore, commercial timber solutions bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Custom Timber Solutions",
            "description": "Custom timber cutting and solutions for architectural and furniture projects",
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
        <Breadcrumbs items={BREADCRUMBS} withHomeLink className="text-xs mb-6" />
        
        <header className="max-w-3xl space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-forest-900 md:text-4xl">
            Custom Timber Solutions
          </h1>
          <p className="text-lg text-muted-foreground">
            Tailored wood solutions for unique projects across Bangalore and Karnataka. 
            From architectural restoration to bespoke furniture, we deliver precision and quality.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3 mb-12">
          {solutions.map((solution, index) => (
            <Card key={index} className="border border-timber-100">
              <CardHeader>
                <CardTitle className="text-xl text-forest-900">{solution.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-timber-600" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-forest-900 mb-8 text-center">Our Custom Process</h2>
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { step: "1", title: "Consultation", desc: "Discuss your project requirements" },
              { step: "2", title: "Design", desc: "Create detailed specifications" },
              { step: "3", title: "Sourcing", desc: "Select optimal timber materials" },
              { step: "4", title: "Delivery", desc: "Precision cutting and delivery" }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-timber-600 text-white font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-forest-900 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-timber-50 to-forest-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-forest-900 mb-4">
            Ready for Your Custom Project?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Contact our timber specialists to discuss your custom requirements. 
            We'll help you find the perfect solution for your Bangalore project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-timber-600 hover:bg-timber-700">
                <NavigationIcon name="phone" className="mr-2" />
                Get Custom Quote
              </Button>
            </Link>
            <Link to="/bulk-orders">
              <Button size="lg" variant="outline" className="border-timber-200">
                <NavigationIcon name="truck" className="mr-2" />
                Bulk Order Form
              </Button>
            </Link>
          </div>
        </section>
      </section>
    </Layout>
  );
};

export default CustomSolutionsPage;
