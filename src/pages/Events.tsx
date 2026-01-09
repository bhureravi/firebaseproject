// src/pages/ClubNewEvent.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Users, Trophy, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";

type ClubUser = {
  uid: string;
  name?: string;
  email?: string;
  role?: string;
  clubId?: string;
  // any other fields you store
};

const ClubNewEvent = () => {
  const [loadingUser, setLoadingUser] = useState(true);
  const [clubUser, setClubUser] = useState<ClubUser | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    capacity: "", // optional
    tokens: ""
  });

  // -> Listen auth and load Firestore user doc (reliable check)
  useEffect(() => {
    setLoadingUser(true);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setClubUser(null);
        setAccessDenied(false);
        setLoadingUser(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (!snap.exists()) {
          setClubUser(null);
          setAccessDenied(true);
        } else {
          const data: any = snap.data();
          const role = (data.role || "").toString().trim();
          if (role !== "club") {
            setClubUser({ uid: u.uid, ...data });
            setAccessDenied(true);
          } else {
            setClubUser({ uid: u.uid, ...data });
            setAccessDenied(false);
          }
        }
      } catch (err) {
        console.error("Error loading user doc:", err);
        setClubUser(null);
        setAccessDenied(true);
      } finally {
        setLoadingUser(false);
      }
    });

    return () => unsub();
  }, []);

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  // form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // must be logged in and role=club
    if (!clubUser || accessDenied) {
      toast({ title: "Access denied", description: "You must be logged in as a club account to create events.", variant: "destructive" });
      return;
    }

    // required validations
    if (!form.name || !form.date || !form.startTime || !form.endTime || !form.tokens) {
      toast({ title: "Missing fields", description: "Please fill in required fields (name, date, start/end time, tokens).", variant: "destructive" });
      return;
    }

    const tokensNum = Number(form.tokens);
    if (isNaN(tokensNum) || tokensNum <= 0) {
      toast({ title: "Invalid tokens", description: "Tokens must be a positive number.", variant: "destructive" });
      return;
    }

    const capacityNum = form.capacity ? Number(form.capacity) : 0;
    if (form.capacity && (isNaN(capacityNum) || capacityNum < 0)) {
      toast({ title: "Invalid capacity", description: "Capacity must be a non-negative number.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const eventDoc = {
        name: form.name,
        description: form.description || "",
        venue: form.venue || "",
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        capacity: capacityNum,
        tokens: tokensNum,
        club: clubUser.clubId || "Unknown Club",
        clubId: clubUser.clubId || null,
        participants: [],
        starredBy: [],
        createdBy: clubUser.uid,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "events"), eventDoc);

      toast({ title: "Event created", description: `"${form.name}" was created.`, });
      // go back to club dashboard or events
      navigate("/club");
    } catch (err) {
      console.error(err);
      toast({ title: "Create failed", description: "Failed to create event. Try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI states
  if (loadingUser) return <div className="p-8">Checking account...</div>;

  if (!auth.currentUser) {
    // Not logged in
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Sign in required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You must sign in to create a club event.</p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/signin")}>Sign in</Button>
              <Button variant="ghost" onClick={() => navigate("/")}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Your account does not have club permissions. If you should have club access, ask the main admin to assign your account the `club` role in Firestore.</p>
            <div className="flex gap-3">
              <Button onClick={() => navigate("/profile")}>Profile</Button>
              <Button variant="ghost" onClick={() => navigate("/")}>Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // clubUser && allowed
  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/club")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground">Set up a new event for students to participate in and earn tokens</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Plus className="w-5 h-5 mr-2 text-primary" /> Event Details</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Event Name *</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Date *</Label>
                  <Input type="date" min={minDate} value={form.date} onChange={(e) => update("date", e.target.value)} required />
                </div>

                <div>
                  <Label>Start Time *</Label>
                  <Input type="time" value={form.startTime} onChange={(e) => update("startTime", e.target.value)} required />
                </div>

                <div>
                  <Label>End Time *</Label>
                  <Input type="time" value={form.endTime} onChange={(e) => update("endTime", e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Venue (optional)</Label>
                  <Input placeholder="Enter venue (e.g., Lecture Hall 3)" value={form.venue} onChange={(e) => update("venue", e.target.value)} />
                </div>

                <div>
                  <Label>Capacity (optional)</Label>
                  <Input type="number" min="0" placeholder="e.g., 50" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Tokens per participant *</Label>
                <Input type="number" min="1" value={form.tokens} onChange={(e) => update("tokens", e.target.value)} required />
                <p className="text-sm text-muted-foreground mt-1">Recommended: 5–20 for workshops, 20–50 for hackathons</p>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => navigate("/club")}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Event"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubNewEvent;
