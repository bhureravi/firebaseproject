import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Trophy, 
  Users, 
  Shield, 
  Gift, 
  Calendar, 
  ArrowRight,
  Star,
  Zap
} from "lucide-react";
import heroImage from "../assets/hero-image.jpg";
import { getCurrentUser } from "../utils/storage";

const Index = () => {
  const currentUser = getCurrentUser();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  Participate.
                </span>{" "}
                <span className="text-foreground">Earn Tokens.</span>{" "}
                <span className="bg-gradient-token bg-clip-text text-transparent">
                  Prove Impact.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Join IITM's blockchain-inspired token system. Earn rewards for event participation, 
                build your profile, and showcase your campus involvement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-hero hover:opacity-90 shadow-medium"
              >
                <Link to="/events">
                  <Calendar className="w-5 h-5 mr-2" />
                  Explore Events
                </Link>
              </Button>
              
              {!currentUser && (
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-primary/20 hover:bg-primary/5"
                >
                  <Link to="/signin">
                    <Users className="w-5 h-5 mr-2" />
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              )}
            </div>

            {currentUser && (
              <div className="flex items-center space-x-4 p-4 bg-gradient-card rounded-lg border border-border/50">
                <div className="flex items-center bg-token text-token-foreground px-3 py-1 rounded-full text-sm font-medium">
                  <Star className="w-4 h-4 mr-1" />
                  {currentUser.tokens} tokens
                </div>
                <span className="text-muted-foreground">
                  Welcome back, <strong className="text-foreground">{currentUser.name}</strong>!
                </span>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-strong">
              <img 
                src={heroImage} 
                alt="Students celebrating successful college event" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-token text-token-foreground p-4 rounded-full shadow-medium">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-accent-orange text-accent-orange-foreground p-4 rounded-full shadow-medium">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What's in it for you?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience transparent, rewarding participation in campus events
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:shadow-medium transition-all duration-smooth border-border/50 bg-gradient-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-token/10 text-token rounded-full group-hover:scale-110 transition-transform duration-smooth">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Earn Tokens</h3>
                <p className="text-muted-foreground">
                  Get rewarded for every workshop, hackathon, and event you participate in
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-smooth border-border/50 bg-gradient-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform duration-smooth">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Transparent Credits</h3>
                <p className="text-muted-foreground">
                  Blockchain-inspired tracking ensures your contributions are permanently recorded
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-smooth border-border/50 bg-gradient-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-orange/10 text-accent-orange rounded-full group-hover:scale-110 transition-transform duration-smooth">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Redeem Rewards</h3>
                <p className="text-muted-foreground">
                  Use your tokens for exclusive perks, priority registration, and special privileges
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-medium transition-all duration-smooth border-border/50 bg-gradient-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform duration-smooth">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Build Profile</h3>
                <p className="text-muted-foreground">
                  Create a comprehensive record of your campus involvement and achievements
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Club Information */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powered by <span className="text-primary">WebOps</span> & <span className="text-accent-orange">Blockchain Club</span> IITM
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              We organize cutting-edge workshops, hackathons, and technical events that bridge the gap between 
              academic learning and industry skills. From web development to blockchain technologies, 
              our events are designed to empower the next generation of innovators.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">WebOps Club</h3>
                  <p className="text-muted-foreground">
                    Web development, DevOps, and full-stack engineering workshops and projects
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-accent-orange/10 text-accent-orange rounded-full flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold">Blockchain Club</h3>
                  <p className="text-muted-foreground">
                    Blockchain technology, smart contracts, DeFi, and Web3 development education
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="pt-8">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-primary/20 hover:bg-primary/5"
              >
                <Link to="/contact">
                  Learn More About Our Clubs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;