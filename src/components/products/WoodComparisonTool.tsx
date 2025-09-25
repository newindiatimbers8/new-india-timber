import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  XCircle, 
  Star, 
  TrendingUp, 
  Shield, 
  Leaf,
  ArrowRight
} from "lucide-react";
// Temporarily disabled woodProducts import - migrating to general Product interface
// import { woodProducts, type WoodProduct } from "@/data/woodProducts";
import { Link } from "react-router-dom";

const WoodComparisonTool = () => {
  // Temporarily disabled - migrating to general product system
  return (
    <div className="text-center py-8">
      <h2 className="text-xl font-semibold mb-4">Wood Comparison Tool</h2>
      <p className="text-gray-600">This feature is being updated. Please check back soon.</p>
    </div>
  );
};

export default WoodComparisonTool;
