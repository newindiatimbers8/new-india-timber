
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import BulkOrderForm from "@/components/bulk/BulkOrderForm";
// import CostCalculator from "@/components/bulk/CostCalculator"; // COMMENTED OUT
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet-async";

const BulkOrdersPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <Helmet>
        <title>Bulk Timber Orders in Bangalore | Wholesale Wood Suppliers</title>
        <meta
          name="description"
          content="Wholesale timber suppliers in Bangalore for bulk orders. Get competitive pricing on teak, plywood, and hardwood for large construction projects."
        />
        <meta
          name="keywords"
          content="bulk timber orders bangalore, wholesale timber suppliers bangalore, bulk wood orders karnataka, wholesale plywood bangalore, bulk teak wood bangalore, construction timber wholesale bangalore, bulk timber pricing bangalore, wholesale wood dealers bangalore, bulk timber delivery bangalore, wholesale timber rates bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Bulk Timber Orders",
            "description": "Wholesale timber products for large construction projects",
            "offers": {
              "@type": "Offer",
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "price": "Contact for bulk pricing"
              }
            }
          })}
        </script>
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bulk Orders</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            For large projects and commercial requirements, our bulk order service offers competitive pricing and customized solutions.
          </p>
        </div>
        
        <Tabs defaultValue="order-form" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-1 mb-8">
            <TabsTrigger value="order-form">Request Bulk Order</TabsTrigger>
            {/* <TabsTrigger value="calculator">Calculate Wood Cost</TabsTrigger> COMMENTED OUT */}
          </TabsList>
          
          <TabsContent value="order-form" className="p-4 bg-white rounded-lg border">
            <BulkOrderForm />
          </TabsContent>
          
          {/* CALCULATOR TAB COMMENTED OUT
          <TabsContent value="calculator" className="p-4 bg-white rounded-lg border">
            <div className="max-w-2xl mx-auto">
              <CostCalculator />
            </div>
          </TabsContent>
          */}
        </Tabs>
      </div>
    </Layout>
  );
};

export default BulkOrdersPage;
