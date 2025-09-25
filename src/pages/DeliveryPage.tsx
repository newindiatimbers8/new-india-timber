/**
 * Delivery Services Page
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

const BREADCRUMBS = [
  { label: "Services", href: "/services", icon: "briefcase" },
  { label: "Delivery", href: "/services/delivery", icon: "route" }
];

const DeliveryPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deliveryZones = [
    { zone: "Central Bangalore", time: "Same Day", areas: ["MG Road", "Brigade Road", "Commercial Street"] },
    { zone: "South Bangalore", time: "Next Day", areas: ["Koramangala", "BTM Layout", "HSR Layout"] },
    { zone: "North Bangalore", time: "1-2 Days", areas: ["Hebbal", "Yelahanka", "Devanahalli"] },
    { zone: "East Bangalore", time: "1-2 Days", areas: ["Whitefield", "Marathahalli", "Sarjapur"] },
    { zone: "West Bangalore", time: "1-2 Days", areas: ["Rajajinagar", "Vijayanagar", "Malleshwaram"] }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Timber Delivery Services Bangalore | Fast & Secure Transport</title>
        <meta
          name="description"
          content="Professional timber delivery across Bangalore and Karnataka. Same-day delivery available with installation support and damage protection."
        />
      </Helmet>

      <section className="container mx-auto px-4 py-12">
        <Breadcrumbs items={BREADCRUMBS} withHomeLink className="text-xs mb-6" />
        
        <header className="max-w-3xl space-y-4 mb-12">
          <h1 className="text-3xl font-bold text-forest-900 md:text-4xl">
            Delivery & Logistics
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional timber delivery services across Bangalore and Karnataka with tracking, 
            insurance, and installation support.
          </p>
        </header>

        {/* Delivery Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {[
            { icon: "truck", title: "Fast Delivery", desc: "Same-day delivery available in central Bangalore" },
            { icon: "shield", title: "Damage Protection", desc: "Full insurance coverage during transport" },
            { icon: "phone", title: "Live Tracking", desc: "Real-time updates on your delivery status" },
            { icon: "briefcase", title: "Installation", desc: "Professional installation services available" }
          ].map((feature, index) => (
            <Card key={index} className="text-center border border-timber-100">
              <CardContent className="p-6">
                <NavigationIcon name={feature.icon} className="mx-auto mb-4 text-timber-600" size={32} />
                <h3 className="font-semibold text-forest-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Delivery Zones */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-forest-900 mb-6">Delivery Zones & Timelines</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {deliveryZones.map((zone, index) => (
              <Card key={index} className="border border-timber-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-forest-900">{zone.zone}</h3>
                    <Badge variant="outline" className="border-timber-200 text-timber-700">
                      {zone.time}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {zone.areas.map((area, idx) => (
                      <span key={idx} className="text-xs bg-timber-50 text-timber-700 px-2 py-1 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-forest-900 mb-6">Delivery Pricing</h2>
          <Card className="border border-timber-100">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <h3 className="font-semibold text-forest-900 mb-2">Standard Delivery</h3>
                  <p className="text-2xl font-bold text-timber-600 mb-2">₹500</p>
                  <p className="text-sm text-muted-foreground">Within 10km of our warehouse</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-forest-900 mb-2">Extended Delivery</h3>
                  <p className="text-2xl font-bold text-timber-600 mb-2">₹1000</p>
                  <p className="text-sm text-muted-foreground">10-25km from warehouse</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-forest-900 mb-2">Premium Service</h3>
                  <p className="text-2xl font-bold text-timber-600 mb-2">₹1500</p>
                  <p className="text-sm text-muted-foreground">Includes installation support</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-timber-50 rounded-xl">
                <p className="text-sm text-muted-foreground text-center">
                  <strong>Free delivery</strong> on orders above ₹50,000 within Bangalore city limits
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-timber-50 to-forest-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-forest-900 mb-4">
            Schedule Your Delivery
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Need delivery for your timber order? Contact us to schedule pickup or delivery 
            across Bangalore and Karnataka.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-timber-600 hover:bg-timber-700">
              <NavigationIcon name="phone" className="mr-2" />
              Schedule Delivery
            </Button>
          </Link>
        </section>
      </section>
    </Layout>
  );
};

export default DeliveryPage;
