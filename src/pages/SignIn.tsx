import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { signInMock, signInDemoStudent, signInDemoClub } from "../utils/storage";
import { User, Users, Zap } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'club'>('student');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    try {
      const user = signInMock(email, selectedRole);
      
      toast({
        title: "Welcome!",
        description: `Successfully signed in as ${user.name}. You have ${user.tokens} tokens.`,
      });

      // Redirect based on role
      if (selectedRole === 'student') {
        navigate("/dashboard");
      } else {
        navigate("/club");
      }
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDemoLogin = (type: 'student' | 'club') => {
    const user = type === 'student' ? signInDemoStudent() : signInDemoClub();
    
    toast({
      title: `Welcome back, ${user.name}!`,
      description: `You have ${user.tokens} tokens.`,
    });

    navigate(type === 'student' ? "/dashboard" : "/club");
  };

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Insti Chain</h1>
          <p className="text-muted-foreground">
            Sign in to track your participation and earn tokens
          </p>
        </div>

        <Card className="bg-gradient-card border-border/50 shadow-medium">
          <CardHeader>
            <CardTitle className="text-center">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp 
                ? 'Join the Insti Chain community'
                : 'Access your participation dashboard'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Demo Login Buttons */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">Quick demo access:</p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('student')}
                  className="flex items-center justify-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>Demo Student</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('club')}
                  className="flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Demo Club</span>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Role Selection */}
            <Tabs 
              value={selectedRole} 
              onValueChange={(value) => setSelectedRole(value as 'student' | 'club')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="student" className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Student</span>
                </TabsTrigger>
                <TabsTrigger value="club" className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Club</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="student" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@student.iitm.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {isSignUp && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone (optional)</Label>
                        <Input
                          id="phone"
                          placeholder="+91 9876543210"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90">
                    <Zap className="w-4 h-4 mr-2" />
                    {isSignUp ? 'Create Student Account' : 'Sign In as Student'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="club" className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="club-email">Club Email</Label>
                    <Input
                      id="club-email"
                      type="email"
                      placeholder="admin@yourclub.iitm.ac.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-hero hover:opacity-90">
                    <Users className="w-4 h-4 mr-2" />
                    {isSignUp ? 'Create Club Account' : 'Sign In as Club'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-primary hover:underline"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            <div className="text-xs text-muted-foreground text-center leading-relaxed">
              <p>
                ⚠️ This is a demo application using mock authentication. 
                In production, this would use secure authentication.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;