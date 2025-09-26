import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import WoodComparisonTool from "@/components/products/WoodComparisonTool";
import { Helmet } from "react-helmet-async";

const ComparisonPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Helmet>
        <title>Compare Timber Products in Bangalore | Wood Comparison Tool</title>
        <meta
          name="description"
          content="Compare different timber products, grades, and prices in Bangalore. Make informed decisions with our comprehensive wood comparison tool."
        />
        <meta
          name="keywords"
          content="compare timber products bangalore, wood comparison tool bangalore, timber grade comparison bangalore, teak wood comparison bangalore, plywood comparison bangalore, timber price comparison bangalore, wood quality comparison bangalore, timber specifications comparison bangalore, wood selection tool bangalore, timber comparison guide bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Timber Comparison Tool",
            "description": "Compare different timber products and specifications",
            "applicationCategory": "BusinessApplication"
          })}
        </script>
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <WoodComparisonTool />
      </div>
    </Layout>
  );
};

export default ComparisonPage;