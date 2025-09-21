import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Users, 
  Zap, 
  Trophy, 
  Code, 
  Blocks,
  ArrowRight,
  Heart,
  Target,
  Award,
  Calendar
} from "lucide-react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              About <span className="bg-gradient-hero bg-clip-text text-transparent">Insti Chain</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A blockchain-inspired participation tracking system that revolutionizes how students 
              engage with campus events and showcase their involvement.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-primary text-primary-foreground">Transparent</Badge>
            <Badge className="bg-token text-token-foreground">Rewarding</Badge>
            <Badge className="bg-accent-orange text-accent-orange-foreground">Student-Centric</Badge>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gradient-card border-border/50 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-2 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                To create a transparent, engaging, and rewarding ecosystem where every student's 
                participation in campus activities is recognized, tracked, and celebrated through 
                blockchain-inspired technology.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Shield className="w-4 h-4 mr-2 text-token" />
                  <span>Transparent participation tracking</span>
                </div>
                <div className="flex items-center text-sm">
                  <Trophy className="w-4 h-4 mr-2 text-accent-orange" />
                  <span>Merit-based token rewards</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  <span>Community-driven engagement</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-6 h-6 mr-2 text-accent-orange" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                To become the standard for student engagement across educational institutions, 
                empowering students to build comprehensive profiles that reflect their true 
                campus involvement and achievements.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Zap className="w-4 h-4 mr-2 text-token" />
                  <span>Gamified learning experiences</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="w-4 h-4 mr-2 text-primary" />
                  <span>Verifiable achievement records</span>
                </div>
                <div className="flex items-center text-sm">
                  <Heart className="w-4 h-4 mr-2 text-accent-orange" />
                  <span>Motivational participation culture</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-gradient-card border-border/50 shadow-medium">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">How Insti Chain Works</CardTitle>
            <CardDescription className="text-lg">
              Simple, transparent, and rewarding participation tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Participate</h3>
                <p className="text-muted-foreground">
                  Register and attend workshops, hackathons, seminars, and other campus events 
                  organized by student clubs.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-token/10 text-token rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Earn Tokens</h3>
                <p className="text-muted-foreground">
                  Receive tokens for each event you complete. Token amounts vary based on 
                  event duration, complexity, and impact.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-accent-orange/10 text-accent-orange rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold">Build Profile</h3>
                <p className="text-muted-foreground">
                  Create a comprehensive record of your involvement, skills gained, and 
                  achievements for future opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* The Clubs Behind Insti Chain */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">The Clubs Behind Insti Chain</h2>
            <p className="text-lg text-muted-foreground">
              Built with <Heart className="w-5 h-5 inline text-red-500" /> by student communities for student communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gradient-card border-border/50 shadow-medium">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-primary">WebOps Club IITM</CardTitle>
                    <CardDescription>Web Development & Operations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Focused on full-stack web development, DevOps practices, and modern web technologies. 
                  We organize workshops on React, Node.js, cloud computing, and deployment strategies.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">What we offer:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Full-stack development workshops</li>
                    <li>• DevOps and deployment training</li>
                    <li>• Open source project contributions</li>
                    <li>• Industry collaboration projects</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-medium">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-accent-orange/10 text-accent-orange rounded-lg flex items-center justify-center">
                    <Blocks className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-accent-orange">Blockchain Club IITM</CardTitle>
                    <CardDescription>Blockchain & Web3 Education</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Dedicated to blockchain education, smart contract development, and Web3 innovation. 
                  We bridge the gap between theory and practical blockchain applications.
                </p>
                <div className="space-y-2">
                  <h4 className="font-medium">What we offer:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Blockchain fundamentals workshops</li>
                    <li>• Smart contract development</li>
                    <li>• DeFi and Web3 applications</li>
                    <li>• Crypto and tokenomics education</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Blockchain-Inspired? */}
        <Card className="bg-gradient-card border-border/50 shadow-medium">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 mr-2 text-token" />
              Why Blockchain-Inspired?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground text-lg">
              We adopted blockchain principles to ensure transparency, immutability, and trust in student participation tracking.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <Shield className="w-8 h-8 text-token mx-auto" />
                <h4 className="font-semibold">Transparency</h4>
                <p className="text-sm text-muted-foreground">
                  Every participation is recorded transparently, creating trust between students and organizers.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <Blocks className="w-8 h-8 text-primary mx-auto" />
                <h4 className="font-semibold">Immutability</h4>
                <p className="text-sm text-muted-foreground">
                  Once earned, tokens and participation records cannot be altered, ensuring integrity.
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <Trophy className="w-8 h-8 text-accent-orange mx-auto" />
                <h4 className="font-semibold">Decentralized</h4>
                <p className="text-sm text-muted-foreground">
                  Multiple clubs can issue tokens, creating a diverse ecosystem of opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-6 bg-gradient-to-r from-primary/5 via-token/5 to-accent-orange/5 p-8 rounded-2xl border border-border/50">
          <h2 className="text-3xl font-bold">Ready to Join the Revolution?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your journey with Insti Chain today. Participate in events, earn tokens, 
            and build a profile that truly reflects your campus involvement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-hero hover:opacity-90">
              <Link to="/events">
                <Calendar className="w-5 h-5 mr-2" />
                Explore Events
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;