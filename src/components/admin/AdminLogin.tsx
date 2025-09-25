import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NavigationIcon } from "@/components/navigation/Icon";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    console.log("Login attempt:", { email, password });
    setIsLoading(true);
    setError("");

    // Simple credential check
    if (email === "newindiatimbers8@gmail.com" && password === "nit181124") {
      console.log("Credentials valid, logging in...");
      // Store login state in sessionStorage
      sessionStorage.setItem("adminLoggedIn", "true");
      sessionStorage.setItem("adminEmail", email);
      // Force a page reload to ensure the ProtectedAdmin component picks up the session
      window.location.href = "/admin";
    } else {
      console.log("Invalid credentials");
      setError("Invalid credentials. Please check your email and password.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-timber-50 to-forest-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-timber-600">
            <NavigationIcon name="shield" className="text-white" size={24} />
          </div>
          <CardTitle className="text-2xl font-bold text-forest-900">
            Admin Access
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the admin dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@newindiatimber.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              onClick={handleLogin}
              className="w-full bg-timber-600 hover:bg-timber-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          {/* Debug button for testing */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEmail("newindiatimbers8@gmail.com");
                setPassword("nit181124");
              }}
              className="w-full text-xs"
            >
              Auto-fill Credentials (Debug)
            </Button>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              New India Timbers Admin Portal
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
