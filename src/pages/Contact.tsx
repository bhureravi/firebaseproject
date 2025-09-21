import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Github, 
  Instagram, 
  ExternalLink, 
  MessageSquare, 
  Users, 
  Code, 
  Blocks,
  MapPin,
  Phone,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
      category: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Get in <span className="bg-gradient-hero bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions about Insti Chain? Want to collaborate? Need technical support? 
            We're here to help and always excited to connect with the community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card border-border/50 shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll respond as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@student.iitm.ac.in"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="event">Event Related</SelectItem>
                        <SelectItem value="partnership">Partnership/Collaboration</SelectItem>
                        <SelectItem value="feedback">Feedback/Suggestions</SelectItem>
                        <SelectItem value="bug">Bug Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your inquiry"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry, question, or feedback..."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-hero hover:opacity-90"
                    size="lg"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Quick Contact */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a 
                      href="mailto:contact@instichain.iitm.ac.in" 
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      contact@instichain.iitm.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">
                      IIT Madras, Chennai, India
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WebOps Club */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center text-primary">
                  <Code className="w-5 h-5 mr-2" />
                  WebOps Club IITM
                </CardTitle>
                <CardDescription>Web Development & Operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  For web development, DevOps, and technical workshops
                </p>
                
                <div className="space-y-2">
                  <a 
                    href="mailto:webops@iitm.ac.in"
                    className="flex items-center text-sm hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    webops@iitm.ac.in
                  </a>
                  
                  <a 
                    href="https://github.com/webops-iitm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                  
                  <a 
                    href="https://instagram.com/webops_iitm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-primary transition-colors"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Club */}
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center text-accent-orange">
                  <Blocks className="w-5 h-5 mr-2" />
                  Blockchain Club IITM
                </CardTitle>
                <CardDescription>Blockchain & Web3 Education</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  For blockchain workshops, smart contracts, and Web3 events
                </p>
                
                <div className="space-y-2">
                  <a 
                    href="mailto:blockchain@iitm.ac.in"
                    className="flex items-center text-sm hover:text-accent-orange transition-colors"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    blockchain@iitm.ac.in
                  </a>
                  
                  <a 
                    href="https://github.com/blockchain-iitm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-accent-orange transition-colors"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                  
                  <a 
                    href="https://instagram.com/blockchain_iitm" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-sm hover:text-accent-orange transition-colors"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Link */}
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6 text-center">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Check our FAQ section for common questions and answers
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <a href="/help">
                    View FAQ
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Community Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Built by students, for students. We value community feedback and contributions.
                </p>
              </div>
              
              <div>
                <Code className="w-8 h-8 text-token mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Open Source</h3>
                <p className="text-sm text-muted-foreground">
                  Interested in contributing? Check out our GitHub repositories and get involved.
                </p>
              </div>
              
              <div>
                <MessageSquare className="w-8 h-8 text-accent-orange mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Always Listening</h3>
                <p className="text-sm text-muted-foreground">
                  Your feedback helps us improve. We respond to every message we receive.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;