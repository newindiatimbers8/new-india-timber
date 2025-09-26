
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";

const DashboardPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Customer Dashboard | New India Timbers</title>
        <meta
          name="description"
          content="Manage your timber orders, track deliveries, and access exclusive pricing through your New India Timbers customer dashboard."
        />
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Customer Dashboard",
            "description": "Customer dashboard for managing timber orders and account"
          })}
        </script>
      </Helmet>
      <DashboardLayout>
        <DashboardOverview />
      </DashboardLayout>
    </>
  );
};

export default DashboardPage;
