import { useEffect } from "react";
import Layout from "../components/layout/Layout";
import WoodComparisonTool from "../components/products/WoodComparisonTool";

const ComparisonPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <WoodComparisonTool />
      </div>
    </Layout>
  );
};

export default ComparisonPage;