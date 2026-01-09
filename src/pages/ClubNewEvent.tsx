// src/pages/ClubNewEvent.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Plus,
  ArrowLeft,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

import { useToast } from "@/hooks/use-toast";

const ClubNewEvent = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "",
    tokens: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load current user's Firestore doc (role, clubId)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/signin");
        return;
      }

      try {
        const userSnap = await getDoc(doc(db, "users", u.uid));
        if (!userSnap.exists()) {
          // No user doc -> force sign out or redirect
          toast({ title: "User not found", description: "No user record. Sign in again.", variant: "destructive" });
          navigate("/signin");
          return;
        }
        const data = userSnap.data();
        setCurrentUser({ uid: u.uid, ...data });
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to load user data", variant: "destructive" });
      }
    });

    return () => unsub();
  }, [navigate, toast]);

  // allow both 'club' and 'head' roles
  useEffect(() => {
    if (currentUser) {
      const role = currentUser.role;
      if (!(role === "club" || role === "head")) {
        toast({ title: "Access denied", description: "Only club/head accounts may create events", variant: "destructive" });
        navigate("/signin");
      }
    }
  }, [currentUser, navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.date || !formData.startTime || !formData.endTime || !formData.venue || !formData.capacity || !formData.tokens) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (parseInt(formData.capacity) <= 0 || parseInt(formData.tokens) <= 0) {
      toast({
        title: "Invalid values",
        description: "Capacity and tokens must be positive numbers",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Build the event object
      const clubName = currentUser?.clubId === "club_webops" ? "WebOps Club IITM" : (currentUser?.clubName || "Unknown Club");
      const clubLogo = currentUser?.clubLogo || (currentUser?.clubId === "club_webops" ? "/assets/webops-logo.svg" : "/assets/blockchain-logo.svg");

      const eventData: any = {
        name: formData.name,
        description: formData.description || "",
        venue: formData.venue,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        capacity: parseInt(formData.capacity),
        tokens: parseInt(formData.tokens),
        clubId: currentUser?.clubId || null,
        club: clubName,
        clubLogo,
        createdBy: currentUser?.uid,
        createdAt: serverTimestamp(),
        status: "upcoming",
        participants: [], // will be filled later
      };

      // Save to Firestore 'events' collection
      const docRef = await addDoc(collection(db, "events"), eventData);

      toast({
        title: "Event created successfully!",
        description: `"${formData.name}" has been created.`,
      });

      // optional: navigate to club dashboard or event detail
      navigate("/club");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating event",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  // Prevent rendering before currentUser is known
  if (!currentUser) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/club")}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Set up a new event for students to participate in and earn tokens</p>
        </div>

        {/* Form */}
        <Card className="bg-gradient-card border-border/50 shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2 text-primary" />
              Event Details
            </CardTitle>
            <CardDescription>Fill in the information about your event</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Event Name *
                  </Label>
                  <Input id="name" placeholder="e.g., React Masterclass Workshop" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea id="description" placeholder="Describe what participants will learn..." value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={4} />
                </div>
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium flex items-center"><Calendar className="w-4 h-4 mr-1" /> Date *</Label>
                  <Input id="date" type="date" min={minDate} value={formData.date} onChange={(e) => handleInputChange("date", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime" className="text-sm font-medium flex items-center"><Clock className="w-4 h-4 mr-1" /> Start Time *</Label>
                  <Input id="startTime" type="time" value={formData.startTime} onChange={(e) => handleInputChange("startTime", e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime" className="text-sm font-medium flex items-center"><Clock className="w-4 h-4 mr-1" /> End Time *</Label>
                  <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => handleInputChange("endTime", e.target.value)} required />
                </div>
              </div>

              {/* Venue and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue" className="text-sm font-medium flex items-center"><MapPin className="w-4 h-4 mr-1" /> Venue *</Label>
                  <Select onValueChange={(value) => handleInputChange("venue", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Lecture Hall 1">Lecture Hall 1</SelectItem>
                      <SelectItem value="Lecture Hall 2">Lecture Hall 2</SelectItem>
                      <SelectItem value="Lecture Hall 3">Lecture Hall 3</SelectItem>
                      <SelectItem value="Computer Lab 1">Computer Lab 1</SelectItem>
                      <SelectItem value="Computer Lab 2">Computer Lab 2</SelectItem>
                      <SelectItem value="CS Seminar Hall">CS Seminar Hall</SelectItem>
                      <SelectItem value="Innovation Lab">Innovation Lab</SelectItem>
                      <SelectItem value="Auditorium">Auditorium</SelectItem>
                      <SelectItem value="Conference Room">Conference Room</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.venue === "Other" && <Input placeholder="Enter custom venue" onChange={(e) => handleInputChange("venue", e.target.value)} />}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-sm font-medium flex items-center"><Users className="w-4 h-4 mr-1" /> Capacity *</Label>
                  <Input id="capacity" type="number" min="1" max="500" placeholder="e.g., 50" value={formData.capacity} onChange={(e) => handleInputChange("capacity", e.target.value)} required />
                </div>
              </div>

              {/* Token Reward */}
              <div className="space-y-2">
                <Label htmlFor="tokens" className="text-sm font-medium flex items-center"><Trophy className="w-4 h-4 mr-1" /> Token Reward *</Label>
                <div className="flex items-center space-x-4">
                  <Input id="tokens" type="number" min="1" max="50" placeholder="e.g., 10" value={formData.tokens} onChange={(e) => handleInputChange("tokens", e.target.value)} className="w-32" required />
                  <p className="text-sm text-muted-foreground">tokens per participant</p>
                </div>
              </div>

              {/* Preview */}
              {formData.name && (
                <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <h4 className="font-medium text-sm mb-2">Preview:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>{formData.name}</strong></p>
                    {formData.date && formData.startTime && <p>📅 {new Date(formData.date).toLocaleDateString()} at {formData.startTime}</p>}
                    {formData.venue && <p>📍 {formData.venue}</p>}
                    {formData.capacity && <p>👥 Capacity: {formData.capacity} students</p>}
                    {formData.tokens && <p>🏆 Reward: {formData.tokens} tokens</p>}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate("/club")}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-hero hover:opacity-90">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" /> Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" /> Create Event
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubNewEvent;
