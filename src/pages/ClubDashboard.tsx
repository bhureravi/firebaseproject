import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "@/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, Trophy } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { updateDoc } from "firebase/firestore";


const ClubDashboard = () => {
  const navigate = useNavigate();

  const [clubId, setClubId] = useState<string | null>(null);
  const [clubAdmins, setClubAdmins] = useState<string[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // 🔐 Auth + role check
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate("/signin");
        return;
      }

      const snap = await getDoc(doc(db, "users", u.uid));
      if (!snap.exists() || snap.data().role !== "club") {
        navigate("/dashboard");
        return;
      }

      const cid = snap.data().clubId;
      setClubId(cid);

      const clubSnap = await getDoc(doc(db, "clubs", cid));
      if (clubSnap.exists()) {
        setClubAdmins(clubSnap.data().admins || []);
      }
    });

    return () => unsub();
  }, [navigate]);

  // 📡 Load club events
  useEffect(() => {
    if (!clubId) return;

    const q = query(collection(db, "events"), where("clubId", "==", clubId));
    const unsub = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => unsub();
  }, [clubId]);

  // 🧮 Majority rule
  const requiredVotes =
    clubAdmins.length === 1 ? 1 :
    clubAdmins.length === 2 ? 2 : 2;

  // 🗳 Create reward proposal
  const createProposal = async () => {
    if (!selectedEvent || selectedUsers.length === 0) return;

    await addDoc(collection(db, "rewardProposals"), {
      eventId: selectedEvent.id,
      clubId,
      users: selectedUsers,
      tokens: selectedEvent.tokens,
      votes: {},
      approved: false,
      requiredVotes,
      createdAt: serverTimestamp()
    });

    setSelectedEvent(null);
    setSelectedUsers([]);
    alert("Reward proposal submitted for voting");
  };

  if (loading) return <div className="p-10">Loading club…</div>;

  return (
    <div className="container mx-auto p-8 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/club/proposals">Reward Proposals</Link>
          </Button>

          <Button asChild>
            <Link to="/club/new-event">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Events */}
      {events.map(ev => (
        <Card key={ev.id}>
          <CardHeader>
            <CardTitle>{ev.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {ev.date}
            </div>

            {ev.status !== "completed" && (
  <Button
    variant="outline"
    onClick={async () => {
      await updateDoc(doc(db, "events", ev.id), {
        status: "completed"
      });
    }}
  >
    Mark Completed
  </Button>
)}

{ev.status === "completed" && (
  <Button
    className="bg-token text-token-foreground"
    onClick={() => setSelectedEvent(ev)}
  >
    <Trophy className="w-4 h-4 mr-2" />
    Create Reward Proposal
  </Button>
)}

          </CardContent>
        </Card>
      ))}

      {/* Proposal Modal */}
      {selectedEvent && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Reward Proposal – {selectedEvent.name}
          </h2>

          {Array.isArray(selectedEvent.participants) &&
  selectedEvent.participants.map((uid: string) => (

            <div key={uid} className="flex items-center space-x-2">
              <Checkbox
                checked={selectedUsers.includes(uid)}
                onCheckedChange={(v) =>
                  v
                    ? setSelectedUsers([...selectedUsers, uid])
                    : setSelectedUsers(selectedUsers.filter(id => id !== uid))
                }
              />
              <span>{uid}</span>
            </div>
          ))}

          <Button className="mt-4" onClick={createProposal}>
            Submit Proposal
          </Button>
        </Card>
      )}

    </div>
  );
};

export default ClubDashboard;
