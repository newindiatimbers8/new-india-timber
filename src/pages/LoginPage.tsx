
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Layout>
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
