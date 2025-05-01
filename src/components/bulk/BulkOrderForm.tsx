
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  purpose: z.enum(["commercial", "residential"], {
    required_error: "Please select a purpose.",
  }),
  frames: z.string().refine(
    (val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 30;
    }, 
    { message: "Minimum 30 frames required for residential, 40 for commercial." }
  ),
  deliveryRequired: z.boolean().default(false),
  address: z.string().optional(),
  name: z.string().min(2, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  customization: z.string().optional(),
});

const BookYourWoodStep = ({ 
  stepNumber, 
  title, 
  description 
}: { 
  stepNumber: number; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 bg-forest-700 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4">
        {stepNumber}
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const BulkOrderForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purpose, setPurpose] = useState<"commercial" | "residential">("residential");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "residential",
      frames: "",
      deliveryRequired: false,
      address: "",
      name: "",
      email: "",
      phone: "",
      customization: "",
    },
  });
  
  const deliveryRequired = form.watch("deliveryRequired");
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual submission logic
      console.log("Form submitted:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Bulk order request submitted",
        description: "We'll contact you within 48 hours to confirm the details.",
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Request a Bulk Order</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <Select 
                    onValueChange={(value: "commercial" | "residential") => {
                      field.onChange(value);
                      setPurpose(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Different minimum quantities apply based on purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="frames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Frames</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum: {purpose === "commercial" ? "40" : "30"} frames
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="deliveryRequired"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Home Delivery</FormLabel>
                    <FormDescription>
                      Do you need delivery to your location?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {deliveryRequired && (
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Address</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your complete delivery address" 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {!deliveryRequired && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h4 className="font-medium text-amber-800 mb-2">Pickup Information</h4>
                <p className="text-amber-700 text-sm">
                  You can pick up your order from our store at:
                  <br />
                  No. 134/20, 5th Main, HSR Layout Sector 7, Bangalore - 560068
                  <br />
                  We'll contact you when your order is ready for pickup.
                </p>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+91 1234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customization Requirements</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe any specific requirements for your bulk order (e.g., frame size, polish finish)" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-forest-700 hover:bg-forest-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Bulk Order Request"}
            </Button>
          </form>
        </Form>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold mb-6">Book Your Wood Process</h3>
        <div className="space-y-8">
          <BookYourWoodStep 
            stepNumber={1} 
            title="Submit Your Request" 
            description="Fill out the bulk order form with your requirements and contact information."
          />
          
          <BookYourWoodStep 
            stepNumber={2} 
            title="Receive a Call" 
            description="Our team will contact you within 48 hours to confirm details and provide a quote."
          />
          
          <BookYourWoodStep 
            stepNumber={3} 
            title="Delivery or Pickup" 
            description="Once confirmed, arrange for delivery or pickup from our HSR Layout store."
          />
        </div>
        
        <div className="mt-10 p-6 bg-timber-50 rounded-lg border border-timber-100">
          <h3 className="text-xl font-bold mb-4">Why Choose Our Bulk Order Service?</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-forest-700 font-bold mr-2">✓</span>
              <span>Competitive pricing for large-scale orders</span>
            </li>
            <li className="flex items-start">
              <span className="text-forest-700 font-bold mr-2">✓</span>
              <span>Customized products tailored to your specifications</span>
            </li>
            <li className="flex items-start">
              <span className="text-forest-700 font-bold mr-2">✓</span>
              <span>Quality assurance and consistent supply</span>
            </li>
            <li className="flex items-start">
              <span className="text-forest-700 font-bold mr-2">✓</span>
              <span>Dedicated support throughout your project</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BulkOrderForm;
