import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Calendar, 
  Star, 
  TrendingUp, 
  Users, 
  Award,
  ArrowRight,
  Clock
} from "lucide-react";
import { getCurrentUser, getEvents } from "../utils/storage";

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [starredEvents, setStarredEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      navigate("/signin");
      return;
    }

    loadDashboardData();
  }, [currentUser, navigate]);

  const loadDashboardData = () => {
    const events = getEvents();
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Update event statuses
    const updatedEvents = events.map(event => {
      if (event.date < today) {
        return { ...event, status: 'completed' };
      } else if (event.date === today) {
        return { ...event, status: 'ongoing' };
      } else {
        return { ...event, status: 'upcoming' };
      }
    });

    // Filter events based on user interactions
    const upcoming = updatedEvents.filter(event => 
      event.status === 'upcoming' || event.status === 'ongoing'
    ).slice(0, 3);

    const starred = updatedEvents.filter(event => 
      event.starredBy.includes(currentUser.id)
    ).slice(0, 3);

    const registered = updatedEvents.filter(event => 
      event.participants.includes(currentUser.id) && (event.status === 'upcoming' || event.status === 'ongoing')
    );

    const recent = updatedEvents
      .filter(event => currentUser.participatedEvents?.includes(event.id))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);

    setUpcomingEvents(upcoming);
    setStarredEvents(starred);
    setRegisteredEvents(registered);
    setRecentEvents(recent);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    const totalPossibleTokens = 100; // Example target
    return Math.min((currentUser.tokens / totalPossibleTokens) * 100, 100);
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">
            Welcome back, <span className="bg-gradient-hero bg-clip-text text-transparent">{currentUser.name}</span>!
          </h1>
          <p className="text-muted-foreground">
            Track your participation, discover new events, and manage your token rewards.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-token text-token-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-token-foreground/80 text-sm font-medium">Total Tokens</p>
                  <p className="text-3xl font-bold">{currentUser.tokens}</p>
                </div>
                <Trophy className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Events Attended</p>
                  <p className="text-3xl font-bold text-primary">{currentUser.participatedEvents?.length || 0}</p>
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Registered</p>
                  <p className="text-3xl font-bold text-accent-orange">{registeredEvents.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-accent-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Starred Events</p>
                  <p className="text-3xl font-bold text-foreground">{currentUser.starredEvents?.length || 0}</p>
                </div>
                <Star className="w-8 h-8 text-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-token" />
              Your Progress
            </CardTitle>
            <CardDescription>
              Keep participating to earn more tokens and unlock rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Token Progress</span>
                <span>{currentUser.tokens} / 100 tokens</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
            <p className="text-sm text-muted-foreground">
              🎯 Next milestone: Earn {Math.max(25 - currentUser.tokens, 0)} more tokens to unlock exclusive perks!
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Registered Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary" />
                  Registered Events
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/events">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Events you've registered for
              </CardDescription>
            </CardHeader>
            <CardContent>
              {registeredEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No upcoming registrations</p>
                  <Button asChild size="sm">
                    <Link to="/events">Browse Events</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {registeredEvents.map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span>{formatDate(event.date)}</span>
                          <span>•</span>
                          <span>{event.venue}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${event.status === 'ongoing' ? 'bg-accent-orange text-accent-orange-foreground' : 'bg-primary text-primary-foreground'}`}>
                          {event.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.tokens} tokens
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Starred Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-accent-orange" />
                  Starred Events
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/events?starred=1">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                Events you've marked as favorites
              </CardDescription>
            </CardHeader>
            <CardContent>
              {starredEvents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-2">No starred events</p>
                  <p className="text-xs">Star events to keep track of ones that interest you</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {starredEvents.map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.name}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <span>{event.club}</span>
                          <span>•</span>
                          <span>{formatDate(event.date)}</span>
                        </div>
                      </div>
                      <Badge className="bg-token text-token-foreground text-xs">
                        {event.tokens} tokens
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-muted-foreground" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Events you've recently participated in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">No recent activity</p>
                <p className="text-sm">Start participating in events to build your history</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentEvents.map((event: any) => (
                  <div key={event.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{event.name}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>{event.club}</span>
                        <span>•</span>
                        <span>{formatDate(event.date)}</span>
                        <span>•</span>
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-token text-token-foreground">
                        +{event.tokens} tokens
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;