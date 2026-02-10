// src/pages/Complaints.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteDoc } from "firebase/firestore";


type Complaint = {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  subject?: string;
  message?: string;
  category?: string;
  status?: string;
  seenBy?: string[];
  createdAt?: any;
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubSnapshot: (() => void) | null = null;
    let mounted = true;

    async function init() {
      const currentUser = auth.currentUser;
      // If there's no auth state immediately available, wait a bit by reading from getAuth()
      if (!currentUser) {
        // redirect to sign in
        setAccessDenied("You must be signed in as a club admin to view complaints.");
        setLoading(false);
        return;
      }

      // fetch user's Firestore role to confirm 'club'
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await (await import("firebase/firestore")).getDoc(userRef);
        if (!userSnap.exists()) {
          setAccessDenied("User profile missing. Please complete your profile.");
          setLoading(false);
          return;
        }
        const role = userSnap.data()?.role || "student";
        if (role !== "club") {
          setAccessDenied("Access denied. Only club admins can view complaints.");
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.error("Error checking role:", err);
        setAccessDenied("Unexpected error while checking permissions.");
        setLoading(false);
        return;
      }

      // If role ok, subscribe to complaints collection
      const complaintsRef = collection(db, "complaints");
      const q = query(complaintsRef, orderBy("createdAt", "desc"));
      unsubSnapshot = onSnapshot(
        q,
        (snapshot) => {
          if (!mounted) return;
          const items: Complaint[] = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));
          setComplaints(items);
          setLoading(false);
        },
        (err) => {
          console.error("Failed to load complaints:", err);
          setAccessDenied("Failed to load complaints.");
          setLoading(false);
        }
      );
    }

    init();

    return () => {
      mounted = false;
      if (unsubSnapshot) unsubSnapshot();
    };
  }, [navigate]);

  // Mark this complaint as seen by current admin (adds uid to seenBy array)
  const markSeen = async (complaintId: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    try {
      const cRef = doc(db, "complaints", complaintId);
      await updateDoc(cRef, {
        seenBy: arrayUnion(currentUser.uid),
      });
    } catch (err) {
      console.error("markSeen error", err);
      alert("Failed to mark as seen. Try again.");
    }
  };

  // Close complaint (set status = "closed")
  const closeComplaint = async (complaintId: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const confirmClose = window.confirm(
    "Are you sure you want to close and remove this complaint?"
  );
  if (!confirmClose) return;

  try {
    const cRef = doc(db, "complaints", complaintId);
    await deleteDoc(cRef);
  } catch (err) {
    console.error("closeComplaint error", err);
    alert("Failed to close complaint. Try again.");
  }
};

  if (loading) {
    return <div className="p-6 text-center">Loading complaints…</div>;
  }

  if (accessDenied) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{accessDenied}</p>
            <div className="mt-4">
              <Button onClick={() => navigate("/signin")}>Sign in</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Complaints / Feedback</h1>
        {complaints.length === 0 && (
          <div className="p-4 text-muted-foreground">No complaints yet.</div>
        )}

        <div className="space-y-4">
          {complaints.map((c) => {
            const isSeen = !!(c.seenBy && auth.currentUser && c.seenBy.includes(auth.currentUser.uid));
            return (
              <Card key={c.id} className="border">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{c.subject || "No subject"}</h3>
                        <Badge variant={c.status === "closed" ? "secondary" : "outline"}>
                          {c.status ?? "open"}
                        </Badge>
                        <span className="text-sm text-muted-foreground ml-2">{c.category}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        From: {c.userName || c.userEmail} • {c.userEmail}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap">{c.message}</p>
                      <div className="mt-3 text-xs text-muted-foreground">
                        {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ""}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Button size="sm" onClick={() => markSeen(c.id)} disabled={isSeen}>
                        {isSeen ? "Seen" : "Mark seen"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => closeComplaint(c.id)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
