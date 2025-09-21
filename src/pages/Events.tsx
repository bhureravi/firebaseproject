import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Trophy,
  Filter
} from "lucide-react";
import { getCurrentUser, getEvents, toggleStarEvent, registerForEvent, unregisterFromEvent } from "../utils/storage";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [sortBy, setSortBy] = useState("date");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const allEvents = getEvents();
    // Update event statuses based on current date
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    const updatedEvents = allEvents.map(event => {
      if (event.date < today) {
        return { ...event, status: 'completed' };
      } else if (event.date === today) {
        return { ...event, status: 'ongoing' };
      } else {
        return { ...event, status: 'upcoming' };
      }
    });
    
    setEvents(updatedEvents);
  };

  const filteredEvents = useMemo(() => {
    let filtered = events;

    // Filter by status
    filtered = filtered.filter(event => event.status === selectedTab);

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.club.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by starred only
    if (showStarredOnly && currentUser) {
      filtered = filtered.filter(event =>
        event.starredBy.includes(currentUser.id)
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'tokens':
          return b.tokens - a.tokens;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, selectedTab, searchQuery, showStarredOnly, sortBy, currentUser]);

  const handleStarToggle = (eventId: string) => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to star events",
        variant: "destructive"
      });
      return;
    }

    toggleStarEvent(eventId, currentUser.id);
    loadEvents();
    setCurrentUser(getCurrentUser()); // Refresh user data
  };

  const handleRegistration = (eventId: string) => {
    if (!currentUser) {
      toast({
        title: "Sign in required",
        description: "Please sign in to register for events",
        variant: "destructive"
      });
      return;
    }

    const event = events.find(e => e.id === eventId);
    const isRegistered = event?.participants.includes(currentUser.id);

    if (isRegistered) {
      unregisterFromEvent(eventId, currentUser.id);
      toast({
        title: "Registration cancelled",
        description: `You've been unregistered from "${event?.name}"`,
      });
    } else {
      registerForEvent(eventId, currentUser.id);
      toast({
        title: "Successfully registered!",
        description: `You've registered for "${event?.name}"`,
      });
    }

    loadEvents();
    setCurrentUser(getCurrentUser());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary text-primary-foreground';
      case 'ongoing': return 'bg-accent-orange text-accent-orange-foreground';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Campus Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover workshops, hackathons, and tech events. Participate to earn tokens and build your profile.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search events or clubs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="tokens">Tokens</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={showStarredOnly ? "secondary" : "outline"}
                onClick={() => setShowStarredOnly(!showStarredOnly)}
                className="w-full md:w-auto"
              >
                <Star className="w-4 h-4 mr-2" />
                Starred Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-8">
            {filteredEvents.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="space-y-4">
                    <Calendar className="w-16 h-16 mx-auto text-muted-foreground/50" />
                    <h3 className="text-xl font-semibold">No events found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search or filters"
                        : selectedTab === 'upcoming' 
                          ? "No upcoming events right now — check back later or explore past events"
                          : `No ${selectedTab} events to show`
                      }
                    </p>
                    {!currentUser && (
                      <Button asChild className="mt-4">
                        <Link to="/signin">Sign In to Register for Events</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event: any) => {
                  const isStarred = currentUser && event.starredBy.includes(currentUser.id);
                  const isRegistered = currentUser && event.participants.includes(currentUser.id);
                  const canRegister = selectedTab === 'upcoming' && currentUser?.role === 'student';

                  return (
                    <Card 
                      key={event.id} 
                      className="group hover:shadow-medium transition-all duration-smooth border-border/50 bg-gradient-card"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge className={`${getStatusColor(event.status)} text-xs`}>
                            {event.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStarToggle(event.id)}
                            className="text-muted-foreground hover:text-accent-orange -mt-2 -mr-2"
                          >
                            <Star className={`w-4 h-4 ${isStarred ? 'fill-current text-accent-orange' : ''}`} />
                          </Button>
                        </div>
                        
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                          {event.name}
                        </CardTitle>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {event.club}
                          </Badge>
                          <Badge className="bg-token text-token-foreground text-xs">
                            <Trophy className="w-3 h-3 mr-1" />
                            {event.tokens} tokens
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.startTime} - {event.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.venue}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            {event.registered} / {event.capacity} registered
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>

                        {canRegister && (
                          <Button
                            onClick={() => handleRegistration(event.id)}
                            variant={isRegistered ? "outline" : "default"}
                            className="w-full"
                            disabled={!isRegistered && event.registered >= event.capacity}
                          >
                            {isRegistered 
                              ? "Cancel Registration" 
                              : event.registered >= event.capacity 
                                ? "Event Full" 
                                : "Register"
                            }
                          </Button>
                        )}

                        {selectedTab === 'completed' && isRegistered && (
                          <div className="text-center p-2 bg-token/10 rounded">
                            <span className="text-sm text-token font-medium">
                              ✓ Earned {event.tokens} tokens
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Events;