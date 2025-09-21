import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getCurrentUser, getUsers, saveUsers, getEvents } from "../utils/storage";
import { User, Edit3, Trophy, Calendar, Star, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    rollNumber: ""
  });
  const [participatedEvents, setParticipatedEvents] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }

    // Load participated events
    const events = getEvents();
    const userEvents = events.filter(event => 
      currentUser.participatedEvents?.includes(event.id)
    );
    setParticipatedEvents(userEvents);

    // Set edit form initial values
    setEditForm({
      name: currentUser.name || "",
      phone: currentUser.phone || "",
      rollNumber: currentUser.rollNumber || ""
    });
  }, [currentUser, navigate]);

  const handleSaveProfile = () => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...editForm
      };
      saveUsers(users);
      setCurrentUser(users[userIndex]);
      setIsEditOpen(false);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    }
  };

  const handleDownloadCertificate = (eventName: string) => {
    // Mock certificate download
    toast({
      title: "Certificate Downloaded",
      description: `Certificate for "${eventName}" has been downloaded.`,
    });
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card className="bg-gradient-card border-border/50 shadow-medium">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <User className="w-10 h-10" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {currentUser.email}
                  </CardDescription>
                  {currentUser.rollNumber && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Roll: {currentUser.rollNumber}
                    </p>
                  )}
                </div>
              </div>
              
              <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your personal information
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        value={editForm.rollNumber}
                        onChange={(e) => setEditForm(prev => ({ ...prev, rollNumber: e.target.value }))}
                      />
                    </div>
                    <Button onClick={handleSaveProfile} className="w-full">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-token/10 rounded-lg">
                <div className="text-3xl font-bold text-token mb-2">
                  {currentUser.tokens}
                </div>
                <p className="text-sm text-muted-foreground">Total Tokens Earned</p>
              </div>
              
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">
                  {participatedEvents.length}
                </div>
                <p className="text-sm text-muted-foreground">Events Attended</p>
              </div>
              
              <div className="text-center p-4 bg-accent-orange/10 rounded-lg">
                <div className="text-3xl font-bold text-accent-orange mb-2">
                  {currentUser.starredEvents?.length || 0}
                </div>
                <p className="text-sm text-muted-foreground">Starred Events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Participated Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-token" />
              Participated Events
            </CardTitle>
            <CardDescription>
              Events you've attended and tokens earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {participatedEvents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No events attended yet</p>
                <p className="text-sm">Start participating in events to earn tokens!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {participatedEvents.map((event: any) => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{event.name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>{event.club}</span>
                        <span>•</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{event.venue}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Badge className="bg-token text-token-foreground">
                        +{event.tokens} tokens
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadCertificate(event.name)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Certificate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Token Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-accent-orange" />
              Token Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Events Participated</span>
                <span className="font-medium">{participatedEvents.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total Tokens Earned</span>
                <span className="font-bold text-token">{currentUser.tokens}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Average Tokens per Event</span>
                <span className="font-medium">
                  {participatedEvents.length > 0 
                    ? Math.round(currentUser.tokens / participatedEvents.length) 
                    : 0}
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Tokens can be redeemed for exclusive perks, priority event registration, 
                and special privileges. Keep participating to earn more!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;