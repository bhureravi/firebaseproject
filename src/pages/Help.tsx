import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  Trophy, 
  Users, 
  Calendar, 
  Shield, 
  Star,
  MessageSquare,
  User,
  Zap,
  Award,
  ExternalLink
} from "lucide-react";

const Help = () => {
  const faqs = [
    {
      category: "Getting Started",
      icon: <User className="w-5 h-5" />,
      questions: [
        {
          question: "How do I create an account on Insti Chain?",
          answer: "Simply click on 'Sign In' in the navigation bar and choose whether you're a Student or Club. For students, enter your email address and we'll create your account. For quick access, you can use the 'Demo Student' or 'Demo Club' buttons to explore the platform."
        },
        {
          question: "What's the difference between Student and Club accounts?",
          answer: "Student accounts can register for events, earn tokens, and track participation. Club accounts can create events, manage registrations, and issue tokens to participants. Choose the account type that matches your role."
        },
        {
          question: "Is Insti Chain free to use?",
          answer: "Yes! Insti Chain is completely free for all students and clubs at IIT Madras. There are no hidden fees or premium features."
        }
      ]
    },
    {
      category: "Tokens & Rewards",
      icon: <Trophy className="w-5 h-5" />,
      questions: [
        {
          question: "What are tokens and how do I earn them?",
          answer: "Tokens are digital rewards you earn by participating in events. Each event has a specific token value (usually 5-30 tokens). You earn tokens when you attend and complete an event. Tokens appear in your profile automatically after the club marks the event as completed."
        },
        {
          question: "How are token amounts decided?",
          answer: "Token amounts are set by the organizing club based on factors like event duration, complexity, and learning outcomes. Workshops typically offer 5-15 tokens, while hackathons and intensive programs offer 20-30 tokens."
        },
        {
          question: "Can I lose tokens or do they expire?",
          answer: "No, tokens never expire and cannot be lost. Once earned, they're permanently added to your profile. This ensures your participation history is always preserved."
        },
        {
          question: "What can I do with my tokens?",
          answer: "Currently, tokens serve as a record of your participation and achievement. In the future, we plan to introduce token redemption for exclusive perks, priority event registration, merchandise, and special privileges."
        }
      ]
    },
    {
      category: "Events",
      icon: <Calendar className="w-5 h-5" />,
      questions: [
        {
          question: "How do I register for events?",
          answer: "Navigate to the Events page, find an event you're interested in, and click 'Register'. You must be signed in as a student to register. You can see your registered events in your Dashboard."
        },
        {
          question: "Can I cancel my event registration?",
          answer: "Yes, you can cancel your registration for upcoming events by clicking 'Cancel Registration' on the event card. However, you cannot cancel after an event has started or completed."
        },
        {
          question: "What does 'starring' an event do?",
          answer: "Starring an event adds it to your favorites list for easy access. You can view all your starred events in your Dashboard or by using the 'Starred Only' filter on the Events page."
        },
        {
          question: "How do I know if I've earned tokens for an event?",
          answer: "Once a club marks an event as 'Completed' and issues tokens, they'll automatically appear in your profile. You'll see the tokens credited for each specific event you attended."
        }
      ]
    },
    {
      category: "Profile & Dashboard",
      icon: <User className="w-5 h-5" />,
      questions: [
        {
          question: "How do I update my profile information?",
          answer: "Go to your Profile page and click 'Edit Profile'. You can update your name, phone number, and roll number. Your email cannot be changed as it's used for account identification."
        },
        {
          question: "Can I download certificates for events I attended?",
          answer: "Yes! On your Profile page, you'll see a 'Download Certificate' button for each event you've completed. This feature generates a participation certificate for your records."
        },
        {
          question: "What's the difference between Dashboard and Profile?",
          answer: "Your Dashboard shows recent activity, upcoming events, and quick stats. Your Profile is a comprehensive view of all your tokens, participated events, and achievement history."
        }
      ]
    },
    {
      category: "Club Features",
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          question: "How do I create a new event as a club?",
          answer: "Sign in with a Club account, go to your Club Dashboard, and click 'Create New Event'. Fill in the event details including date, time, venue, capacity, and token reward. The event will be visible to students immediately."
        },
        {
          question: "How do I issue tokens to participants?",
          answer: "After marking an event as 'Completed', you'll see an 'Issue Tokens' button. Select the participants who attended and click 'Issue Tokens'. The tokens will be automatically added to their profiles."
        },
        {
          question: "Can I export the participant list?",
          answer: "Yes! Each event in your Club Dashboard has an 'Export' button that downloads a CSV file with participant names, emails, roll numbers, and registration details."
        }
      ]
    },
    {
      category: "Technical Support",
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          question: "Is my data safe on Insti Chain?",
          answer: "Yes, we take data security seriously. While this is currently a demo using local storage, the production version will implement proper security measures including encrypted data storage and secure authentication."
        },
        {
          question: "Why do I see a 'mock authentication' warning?",
          answer: "This is a demo version of Insti Chain that uses mock authentication for testing purposes. The production version will integrate with proper authentication systems."
        },
        {
          question: "Can I use Insti Chain on mobile devices?",
          answer: "Absolutely! Insti Chain is fully responsive and works great on smartphones and tablets. All features are accessible on mobile devices."
        },
        {
          question: "What browsers are supported?",
          answer: "Insti Chain works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Help & <span className="bg-gradient-hero bg-clip-text text-transparent">FAQ</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about using Insti Chain
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Need personal assistance? Reach out to our team
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/contact">
                  Contact Us
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 text-token mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Quick Start</h3>
              <p className="text-sm text-muted-foreground mb-4">
                New to Insti Chain? Start here
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/signin">
                  Get Started
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all cursor-pointer">
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 text-accent-orange mx-auto mb-3" />
              <h3 className="font-semibold mb-2">About Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn more about our mission and vision
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/about">
                  Learn More
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about Insti Chain
            </p>
          </div>

          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center">
                  {category.icon}
                  <span className="ml-2">{category.category}</span>
                  <Badge variant="outline" className="ml-auto">
                    {category.questions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="bg-gradient-to-r from-primary/5 via-token/5 to-accent-orange/5 border-border/50">
          <CardContent className="p-8 text-center">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find what you're looking for? Our team is always happy to help! 
              Reach out through our contact form and we'll get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-hero hover:opacity-90">
                <Link to="/contact">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/about">
                  Learn About Insti Chain
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;