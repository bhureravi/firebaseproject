import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebaseConfig";
import { useNavigate } from "react-router-dom";

const CreateClub = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Enter club name");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "clubs"), {
        name,
        createdBy: auth.currentUser?.uid,
        admins: [],
        allowance: 0,
        createdAt: serverTimestamp(),
      });

      alert("Club created");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to create club");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h1 className="text-xl font-bold mb-4">Create Club</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Club name"
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={handleCreate}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Create Club
      </button>
    </div>
  );
};

export default CreateClub;
