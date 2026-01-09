// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
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

import { getEvents } from "../utils/storage";

const Dashboard = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [starredEvents, setStarredEvents] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  // 🔐 AUTH CHECK (Firebase only)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
        return;
      }

      const firebaseUser = {
        id: user.uid,
        name: user.displayName || user.email,
        email: user.email,
        tokens: 0,
        participatedEvents: [],
        starredEvents: []
      };

      setCurrentUser(firebaseUser);
      loadDashboardData(firebaseUser);
    });

    return () => unsubscribe();
  }, [navigate]);

  const loadDashboardData = (user: any) => {
    const events = getEvents();
    const today = new Date().toISOString().split("T")[0];

    const updatedEvents = events.map((event: any) => {
      if (event.date < today) return { ...event, status: "completed" };
      if (event.date === today) return { ...event, status: "ongoing" };
      return { ...event, status: "upcoming" };
    });

    setUpcomingEvents(
      updatedEvents.filter(
        (e: any) => e.status === "upcoming" || e.status === "ongoing"
      ).slice(0, 3)
    );

    setStarredEvents(
      updatedEvents.filter((e: any) =>
        e.starredBy?.includes(user.id)
      ).slice(0, 3)
    );

    setRegisteredEvents(
      updatedEvents.filter(
        (e: any) =>
          e.participants?.includes(user.id) &&
          (e.status === "upcoming" || e.status === "ongoing")
      )
    );

    setRecentEvents(
      updatedEvents.filter((e: any) =>
        user.participatedEvents?.includes(e.id)
      ).slice(0, 3)
    );
  };

  const calculateProgress = () => {
    return Math.min((currentUser.tokens / 100) * 100, 100);
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser.name} 👋
        </h1>
        <p className="text-muted-foreground">
          Track events and earn rewards
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Tokens</p>
            <p className="text-3xl font-bold">{currentUser.tokens}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Registered</p>
            <p className="text-3xl font-bold">{registeredEvents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Starred</p>
            <p className="text-3xl font-bold">{starredEvents.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Attended</p>
            <p className="text-3xl font-bold">
              {currentUser.participatedEvents.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>Earn more tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} />
        </CardContent>
      </Card>

      {/* Registered Events */}
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>Registered Events</CardTitle>
          <Button asChild variant="ghost">
            <Link to="/events">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {registeredEvents.length === 0 ? (
            <p className="text-muted-foreground">No registered events</p>
          ) : (
            registeredEvents.map((event: any) => (
              <div key={event.id} className="p-3 border rounded mb-2">
                <p className="font-medium">{event.name}</p>
                <Badge>{event.status}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
