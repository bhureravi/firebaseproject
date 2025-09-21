import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp,
  Edit,
  Eye,
  Settings,
  Download,
  CheckCircle
} from "lucide-react";
import { getCurrentUser, getEvents, saveEvents, getUsers, issueTokensToParticipants, updateEventStatus } from "../utils/storage";
import { useToast } from "@/hooks/use-toast";

const ClubDashboard = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [clubEvents, setClubEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isIssueTokensOpen, setIsIssueTokensOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'club') {
      navigate("/signin");
      return;
    }

    loadClubEvents();
  }, [currentUser, navigate]);

  const loadClubEvents = () => {
    const events = getEvents();
    const myEvents = events.filter(event => event.clubId === currentUser.clubId);
    
    // Sort by date (newest first)
    myEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setClubEvents(myEvents);
  };

  const handleStatusUpdate = (eventId: string, newStatus: string) => {
    updateEventStatus(eventId, newStatus);
    loadClubEvents();
    
    toast({
      title: "Event updated",
      description: `Event status changed to ${newStatus}`,
    });
  };

  const handleIssueTokens = () => {
    if (!selectedEvent || selectedParticipants.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select participants to issue tokens to",
        variant: "destructive"
      });
      return;
    }

    issueTokensToParticipants(selectedEvent.id, selectedParticipants);
    
    toast({
      title: "Tokens issued!",
      description: `Successfully issued ${selectedEvent.tokens} tokens to ${selectedParticipants.length} participants`,
    });

    setIsIssueTokensOpen(false);
    setSelectedParticipants([]);
    setSelectedEvent(null);
    loadClubEvents();
  };

  const exportParticipants = (event: any) => {
    const users = getUsers();
    const participants = users.filter(user => event.participants.includes(user.id));
    
    const csvContent = [
      ['Name', 'Email', 'Roll Number', 'Phone', 'Registration Date'].join(','),
      ...participants.map(user => [
        user.name,
        user.email,
        user.rollNumber || 'N/A',
        user.phone || 'N/A',
        new Date().toLocaleDateString() // Mock registration date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `${event.name}_participants.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: "Participants list has been downloaded as CSV",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-primary text-primary-foreground';
      case 'ongoing': return 'bg-accent-orange text-accent-orange-foreground';
      case 'completed': return 'bg-token text-token-foreground';
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

  if (!currentUser) {
    return null;
  }

  const upcomingEvents = clubEvents.filter(event => event.status === 'upcoming').length;
  const completedEvents = clubEvents.filter(event => event.status === 'completed').length;
  const totalParticipants = clubEvents.reduce((sum, event) => sum + event.participants.length, 0);
  const totalTokensIssued = clubEvents
    .filter(event => event.status === 'completed')
    .reduce((sum, event) => sum + (event.participants.length * event.tokens), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Club Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your events, track participation, and issue tokens
            </p>
          </div>
          <Button asChild size="lg" className="bg-gradient-hero hover:opacity-90">
            <Link to="/club/new-event">
              <Plus className="w-5 h-5 mr-2" />
              Create New Event
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Events</p>
                  <p className="text-3xl font-bold text-primary">{clubEvents.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Upcoming</p>
                  <p className="text-3xl font-bold text-accent-orange">{upcomingEvents}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-accent-orange" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Participants</p>
                  <p className="text-3xl font-bold text-foreground">{totalParticipants}</p>
                </div>
                <Users className="w-8 h-8 text-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-token text-token-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-token-foreground/80 text-sm font-medium">Tokens Issued</p>
                  <p className="text-3xl font-bold">{totalTokensIssued}</p>
                </div>
                <Trophy className="w-8 h-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Manage Events
            </CardTitle>
            <CardDescription>
              View, edit, and manage your club's events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clubEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first event to start engaging with students
                </p>
                <Button asChild>
                  <Link to="/club/new-event">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {clubEvents.map((event: any) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium">{event.name}</h3>
                        <Badge className={`${getStatusColor(event.status)} text-xs`}>
                          {event.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(event.date)}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {event.participants.length} / {event.capacity}
                        </div>
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          {event.tokens} tokens
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {event.venue}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Select
                        value={event.status}
                        onValueChange={(value) => handleStatusUpdate(event.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportParticipants(event)}
                        disabled={event.participants.length === 0}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>

                      {event.status === 'completed' && event.participants.length > 0 && (
                        <Dialog open={isIssueTokensOpen} onOpenChange={setIsIssueTokensOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedEvent(event)}
                              className="bg-token text-token-foreground hover:bg-token/90"
                            >
                              <Trophy className="w-4 h-4 mr-1" />
                              Issue Tokens
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Issue Tokens</DialogTitle>
                              <DialogDescription>
                                Select participants to receive {event.tokens} tokens for "{event.name}"
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="max-h-60 overflow-y-auto space-y-2">
                                {getUsers()
                                  .filter(user => event.participants.includes(user.id))
                                  .map(user => (
                                    <div key={user.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={user.id}
                                        checked={selectedParticipants.includes(user.id)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setSelectedParticipants(prev => [...prev, user.id]);
                                          } else {
                                            setSelectedParticipants(prev => prev.filter(id => id !== user.id));
                                          }
                                        }}
                                      />
                                      <label htmlFor={user.id} className="text-sm font-medium">
                                        {user.name}
                                      </label>
                                      <span className="text-xs text-muted-foreground">
                                        ({user.email})
                                      </span>
                                    </div>
                                  ))}
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    const allParticipants = getUsers()
                                      .filter(user => event.participants.includes(user.id))
                                      .map(user => user.id);
                                    setSelectedParticipants(allParticipants);
                                  }}
                                  className="flex-1"
                                >
                                  Select All
                                </Button>
                                <Button
                                  onClick={handleIssueTokens}
                                  disabled={selectedParticipants.length === 0}
                                  className="flex-1 bg-token text-token-foreground hover:bg-token/90"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Issue Tokens
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
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

export default ClubDashboard;