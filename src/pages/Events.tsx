// src/pages/Events.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Calendar, Clock, MapPin, Users, Trophy } from "lucide-react";
import { registerForEvent, unregisterFromEvent, subscribeEvents, getUserDoc,addStar, removeStar } from "@/utils/firebaseHelpers";

// import { subscribeEvents, getUserDoc, registerForEvent, unregisterFromEvent,  } from "@/utils/firebaseHelpers";
import { auth } from "@/firebaseConfig";
import { useToast } from "@/hooks/use-toast";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("upcoming");
  const [sortBy, setSortBy] = useState("date");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // subscribe to events
    const unsub = subscribeEvents((evts) => {
      setEvents(evts);
    });
    // load current user profile from Firestore (if logged in)
    const uid = auth.currentUser?.uid;
    if (uid) {
      getUserDoc(uid).then((u) => setCurrentUser(u));
    } else {
      setCurrentUser(null);
    }
    return () => unsub();
  }, []);

  // derived list
  const filteredEvents = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    // map status
    const withStatus = events.map((e) => {
      let status = "upcoming";
      if (!e.date) status = "upcoming";
      else if (e.date < today) status = "completed";
      else if (e.date === today) status = "ongoing";
      return { ...e, status };
    });

    let filtered = withStatus.filter((ev) => ev.status === selectedTab);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (ev) =>
          (ev.name || "").toLowerCase().includes(q) ||
          (ev.club || "").toLowerCase().includes(q)
      );
    }

    if (showStarredOnly && currentUser) {
      filtered = filtered.filter((ev) => Array.isArray(ev.starredBy) && ev.starredBy.includes(currentUser.uid));
    }

    switch (sortBy) {
      case "date":
        filtered.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
        break;
      case "tokens":
        filtered.sort((a, b) => (b.tokens || 0) - (a.tokens || 0));
        break;
      case "name":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
    }

    return filtered;
  }, [events, selectedTab, searchQuery, showStarredOnly, sortBy, currentUser]);

  const ensureSignedIn = () => {
    if (!auth.currentUser) {
      toast({ title: "Sign in required", description: "Please sign in to do that", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleStarToggle = async (eventId: string, isStarred: boolean) => {
    if (!ensureSignedIn()) return;
    const uid = auth.currentUser!.uid;
    try {
      if (isStarred) await removeStar(eventId, uid);
      else await addStar(eventId, uid);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed", description: "Couldn't update star", variant: "destructive" });
    }
  };

  const handleRegistration = async (eventId: string, isRegistered: boolean) => {
    if (!ensureSignedIn()) return;
    const uid = auth.currentUser!.uid;
    try {
      if (isRegistered) {
        await unregisterFromEvent(eventId, uid);
        toast({ title: "Unregistered", description: "You are no longer registered" });
      } else {
        await registerForEvent(eventId, uid);
        toast({ title: "Registered", description: "You've registered for the event" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed", description: "Couldn't update registration", variant: "destructive" });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Campus Events</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover workshops, hackathons, and tech events. Participate to earn tokens and build your profile.
          </p>
        </div>

        <div className="mb-4">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search events or clubs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            <div>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
                <option value="date">Date</option>
                <option value="tokens">Tokens</option>
                <option value="name">Name</option>
              </select>
            </div>
            <Button variant={showStarredOnly ? "secondary" : "outline"} onClick={() => setShowStarredOnly((s) => !s)}>
              <Star className="w-4 h-4 mr-2" /> Starred Only
            </Button>
          </div>
        </div>

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
                      {searchQuery ? "Try adjusting your search or filters" : selectedTab === "upcoming" ? "No upcoming events right now — check back later or explore past events" : `No ${selectedTab} events to show`}
                    </p>
                    {!currentUser && <Button asChild className="mt-4"><Link to="/signin">Sign In to Register for Events</Link></Button>}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => {
                  const isStarred = currentUser && Array.isArray(event.starredBy) && event.starredBy.includes(currentUser.uid);
                  const isRegistered = currentUser && Array.isArray(event.participants) && event.participants.includes(currentUser.uid);
                  const canRegister = selectedTab === "upcoming" && currentUser?.role === "student";

                  return (
                    <Card key={event.id} className="group hover:shadow-medium transition-all duration-smooth border-border/50 bg-gradient-card">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <Badge className="text-xs">{event.status}</Badge>
                          <Button variant="ghost" size="sm" onClick={() => handleStarToggle(event.id, !!isStarred)} className="text-muted-foreground hover:text-accent-orange -mt-2 -mr-2">
                            <Star className={`w-4 h-4 ${isStarred ? "fill-current text-accent-orange" : ""}`} />
                          </Button>
                        </div>
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{event.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{event.club}</Badge>
                          <Badge className="bg-token text-token-foreground text-xs"><Trophy className="w-3 h-3 mr-1" />{event.tokens || 0} tokens</Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />{formatDate(event.date)}</div>
                          <div className="flex items-center"><Clock className="w-4 h-4 mr-2" />{event.startTime} - {event.endTime}</div>
                          <div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{event.venue}</div>
                          <div className="flex items-center"><Users className="w-4 h-4 mr-2" />{(event.participants?.length) || 0} / {event.capacity || "—"} registered</div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

                        {canRegister && (
                          <Button onClick={() => handleRegistration(event.id, !!isRegistered)} variant={isRegistered ? "outline" : "default"} className="w-full" disabled={!isRegistered && event.capacity && event.participants && event.participants.length >= event.capacity}>
                            {isRegistered ? "Cancel Registration" : event.participants && event.participants.length >= (event.capacity || Infinity) ? "Event Full" : "Register"}
                          </Button>
                        )}

                        {selectedTab === "completed" && isRegistered && (
                          <div className="text-center p-2 bg-token/10 rounded">
                            <span className="text-sm text-token font-medium">✓ Earned {event.tokens} tokens</span>
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
