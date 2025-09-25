import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";

interface ProtectedAdminProps {
  children: React.ReactNode;
}

const ProtectedAdmin = ({ children }: ProtectedAdminProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const adminLoggedIn = sessionStorage.getItem("adminLoggedIn");
    const adminEmail = sessionStorage.getItem("adminEmail");
    
    if (adminLoggedIn === "true" && adminEmail === "newindiatimbers8@gmail.com") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminLoggedIn");
    sessionStorage.removeItem("adminEmail");
    setIsAuthenticated(false);
    navigate("/admin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-timber-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="relative">
      {/* Admin Header with Logout */}
      <div className="bg-white border-b border-timber-100 px-4 py-3">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-timber-600 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-forest-900">Admin Panel</p>
              <p className="text-xs text-muted-foreground">newindiatimbers8@gmail.com</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-muted-foreground hover:text-forest-900 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Admin Content */}
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default ProtectedAdmin;
