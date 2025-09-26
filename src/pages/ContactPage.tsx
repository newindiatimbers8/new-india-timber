
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Please enter your name." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  subject: z.string().min(5, { message: "Please enter a subject." }),
  message: z.string().min(20, { message: "Please enter a message (at least 20 characters)." }),
});

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Handle pre-filled information from URL
  useEffect(() => {
    const productInfo = searchParams.get('product');
    const subject = searchParams.get('subject');
    const message = searchParams.get('message');
    
    if (productInfo) {
      const decodedProductInfo = decodeURIComponent(productInfo);
      form.setValue('subject', 'Price Inquiry');
      form.setValue('message', `Hi, I'm interested in getting a price quote for the following product:\n\n${decodedProductInfo}\n\nPlease provide me with pricing details and availability. Thank you!`);
    } else if (subject && message) {
      form.setValue('subject', decodeURIComponent(subject));
      form.setValue('message', decodeURIComponent(message));
    }
  }, [searchParams, form]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual form submission logic
      console.log("Contact form submitted:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Contact New India Timbers | Timber Suppliers in Bangalore</title>
        <meta
          name="description"
          content="Get in touch with New India Timbers for premium timber products in Bangalore. Call us or visit our store on Sarjapura Main Road today."
        />
        <meta
          name="keywords"
          content="contact timber suppliers bangalore, timber store bangalore, wood dealers contact bangalore, sarjapura road timber dealers, timber suppliers phone bangalore, visit timber store bangalore, timber suppliers address bangalore, wood suppliers contact karnataka, timber business hours bangalore"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact New India Timbers",
            "description": "Get in touch with us for timber products and services",
            "mainEntity": {
              "@type": "LocalBusiness",
              "name": "New India Timbers",
              "telephone": "+91-9886033342",
              "email": "newindiatimbers8@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "24/4 Sarjapura Main Road Doddakanna halli",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "postalCode": "560035",
                "addressCountry": "IN"
              }
            }
          })}
        </script>
      </Helmet>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions about our products or need a custom quote? We're here to help!
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin size={24} className="mr-4 text-forest-700" />
                <div>
                  <h3 className="font-semibold mb-1">Our Location</h3>
                  <p className="text-gray-600">
                    24/4 Sarjapura Main Road Doddakanna halli, beside Uber Verdant, Phase 1, apartments, Bengaluru, Karnataka 560035
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone size={24} className="mr-4 text-forest-700" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">
                    +91 9886033342
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail size={24} className="mr-4 text-forest-700" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">
                    newindiatimbers8@gmail.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock size={24} className="mr-4 text-forest-700" />
                <div>
                  <h3 className="font-semibold mb-1">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Saturday: 9:00 AM - 7:00 PM<br />
                    Sunday: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>

          </div>
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="newindiatimbers8@gmail.com" {...field} />
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
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+91 9886033342" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What is this regarding?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-[120px] resize-none" 
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
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
