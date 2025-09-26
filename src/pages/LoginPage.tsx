
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
      <Helmet>
        <title>Login | New India Timbers Customer Portal</title>
        <meta
          name="description"
          content="Access your New India Timbers account to manage orders, track deliveries, and access exclusive timber pricing in Bangalore."
        />
        <meta
          name="keywords"
          content="new india timbers login, timber customer portal bangalore, wood suppliers login bangalore, timber account access bangalore, customer login bangalore"
        />
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Customer Login",
            "description": "Customer portal login for New India Timbers"
          })}
        </script>
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Account Access</h1>
            <p className="text-gray-600">Login to your account or create a new one</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
