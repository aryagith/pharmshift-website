"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Double check the API calls by checking the browser's Network tab
 * Check if API routes exist in the pro-file folder
 * The axios usage may be wrong because of the connection to the backend
 */

type StudyProfile = {
  goal: string;
  studyTopics: string;
  hoursAvailable: number;
  phoneNumber: string;
  profileImage: string;
};

type MatchProfile = {
  name: string;
  goal: string;
  studyTopics: string;
  hoursAvailable: number;
  phoneNumber: string;
  profileImage: string;
};

export default function StudyPartnerPage() {
  const { data: session, status } = useSession();
  const [studyProfile, setStudyProfile] = useState<StudyProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [goal, setGoal] = useState("");
  const [topics, setTopics] = useState("");
  const [hoursAvailable, setHoursAvailable] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [matchProfile, setMatchProfile] = useState<MatchProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const aiChatsUsed = 127;
  const aiChatsMax = 200;

  const maxHours = 50;

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "loading" || !session?.user?.email) return;

      try {
        const res = await axios.get<StudyProfile>(
          `/api/pro-file/get?email=${encodeURIComponent(session.user.email)}`
        );

        if (res.data) {
          const data = res.data;
          setStudyProfile(data);
          setGoal(data.goal || "");
          setTopics(data.studyTopics || "");
          setHoursAvailable(data.hoursAvailable || 0);
          setPhoneNumber(data.phoneNumber || "");
          setProfileImage(data.profileImage || null);
        }
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        // Set default values on error
        setGoal("");
        setTopics("");
        setHoursAvailable(0);
        setPhoneNumber("");
        setProfileImage(null);
      }
    };
    fetchProfile();
  }, [session?.user?.email, status]);

  const handleSave = async () => {
    if (!session?.user?.email) return;

    const payload = {
      email: session.user.email,
      goal,
      studyTopics: topics,
      hoursAvailable,
      phoneNumber,
      profileImage: profileImage || "",
    };

    try {
      const res = await axios.post<StudyProfile>(
        "/api/pro-file/update",
        payload
      );

      if (res.data) {
        setStudyProfile(res.data);
        setEditMode(false);
      }
    } catch (err) {
      console.error("Failed to save study profile:", err);
      alert("Failed to save profile. Please try again.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // const handleFindMatch = async () => {
  //   try {
  //     const res = await axios.get<MatchProfile>('/api/pro-file/random');
  //     setMatchProfile(res.data);
  //   } catch (err) {
  //     console.error('Failed to find match:', err);
  //   }
  // };
  const handleFindMatch = async () => {
    setLoading(true);
    try {
      const res = await axios.get<MatchProfile>("/api/pro-file/random");
      if (res.data) {
        setMatchProfile(res.data);
      }
    } catch (err) {
      console.error("Failed to find match:", err);
      alert("Failed to find a study partner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black/80">
        <p className="text-white text-center">Loading...</p>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black/80">
        <p className="text-white text-center">
          Please wait your magic profile is being cooked...
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6 bg-black/80 min-h-screen backdrop-blur-md">
      <Card className="w-full max-w-xl shadow-xl bg-black/60 backdrop-blur-sm border border-gray-800 text-white rounded-xl">
        <CardContent className="flex flex-col p-4 gap-4">
          <div className="flex flex-col items-center mb-20 mt-20">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full overflow-hidden cursor-pointer border bg-gray-700 flex items-center justify-center"
            >
              <Image
                src={
                  matchProfile?.profileImage ||
                  profileImage ||
                  "/default-avatar.png"
                }
                alt="Profile"
                width={128}
                height={128}
                className="object-cover"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            <div className="text-white px-4 py-2 mt-2 text-4xl">
              {(() => {
                const fullName =
                  matchProfile?.name ||
                  session?.user?.name ||
                  "No name available";
                if (fullName === "No name available") return fullName;

                const nameParts = fullName.trim().split(" ");
                if (nameParts.length === 1) return nameParts[0];

                const firstName = nameParts[0];
                const lastNameInitial =
                  nameParts[nameParts.length - 1]?.[0] || "";
                return `${firstName} ${lastNameInitial}.`;
              })()}
            </div>
          </div>

          {/* Display the rating 
          For the rating stuff, we want to use some pills instead of stars so use the pill png file and edit it on figma to make it straight
          */}
          <div className="flex items-center justify-center mb-4">
            <h4 className="text-blue-700 mr-3 font-bold text-2xl">Rating</h4>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((pill) => (
                <Image
                  key={pill}
                  src="/horizontalpill.png"
                  alt="Pill"
                  width={30}
                  height={30}
                  className={`${
                    pill <= 2 ? "opacity-100" : "opacity-30"
                  } transition-opacity`}
                />
              ))}
            </div>
          </div>

          {/* Goal messages */}
          <div className="flex items-center justify-center mb-4">
            <h4 className="text-white text-center text-lg">
              Goal: Ace OSCE by July,
              <br />
              Prefers flashcards + Group Chat
            </h4>
          </div>

          {/* Matched person's Info */}
          <AnimatePresence mode="wait">
            {matchProfile && (
              <motion.div
                key={matchProfile.phoneNumber}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <>
                  {loading && (
                    <div className="flex justify-center my-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                    </div>
                  )}

                  <div className="fixed top-4 right-4 z-50">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setMatchProfile(null)}
                      size="small"
                    >
                      Back to My Profile
                    </Button>
                  </div>

                  <div className="flex justify-center gap-4 mb-6 flex-wrap">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${encodeURIComponent(
                            matchProfile.phoneNumber
                          )}`
                        )
                      }
                    >
                      Start Chat
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleFindMatch}
                      disabled={loading}
                    >
                      {loading ? "Finding Match..." : "Find Another Match"}
                    </Button>
                  </div>

                  <div className="bg-[#0b162d] text-white rounded-md p-5 mb-6 border border-blue-800">
                    <p className="text-blue-400 font-medium mb-1">
                      Study Match
                    </p>
                    <p className="mb-2">Goal: {matchProfile.goal}</p>
                    <p className="mb-2">
                      Study Topics: {matchProfile.studyTopics}
                    </p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1 text-white">
                        <span>Hours available to study</span>
                        <span>{matchProfile.hoursAvailable} / 50</span>
                      </div>
                      <div className="w-full bg-[#1f2937] rounded-full h-2.5">
                        <div
                          className="bg-blue-500 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (matchProfile.hoursAvailable / 50) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              </motion.div>
            )}
          </AnimatePresence>

          {/* My  Info */}
          {!matchProfile && (
            <>
              <div className="flex justify-center mb-6">
                {loading && (
                  <div className="flex justify-center my-4">
                    <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
                  </div>
                )}
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleFindMatch}
                  disabled={loading}
                >
                  {loading ? "Finding Match..." : "Find Another Match"}
                </Button>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1 text-white">
                  <span>Hours available to study</span>

                  <span>
                    {hoursAvailable} / {maxHours}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{
                      width: `${(hoursAvailable / maxHours) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1 text-white">
                  <span>AI chats used</span>
                  <span>
                    {aiChatsUsed} / {aiChatsMax}
                  </span>
                </div>
                <div className="w-full bg-[#1f2937] rounded-full h-2.5">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${(aiChatsUsed / aiChatsMax) * 100}%` }}
                  />
                </div>
              </div>

              {/* Editing mode */}
              {editMode && (
                <>
                  <TextField
                    label="Hours Available"
                    type="number"
                    value={hoursAvailable}
                    onChange={(e) => {
                      const value = Math.min(
                        Math.max(Number(e.target.value), 0),
                        maxHours
                      );
                      setHoursAvailable(value);
                    }}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Study Topics"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Your Goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    fullWidth
                    margin="normal"
                  />

                  <TextField
                    label="Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </>
              )}

              <div className="mt-auto divide-y divide-gray-700">
                {editMode ? (
                  <div className="flex justify-between">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <div
                      onClick={() => setEditMode(true)}
                      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#111827] rounded transition"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="white"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                          />
                        </svg>
                        <span className="text-white">Edit Profile</span>
                      </div>
                      <span className="text-gray-400">&gt;</span>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[#111827] rounded transition">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="white"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.857 17.082a1.682 1.682 0 01-1.357.668h-2a1.682 1.682 0 01-1.357-.668M18 8a6 6 0 00-12 0c0 7.5-3 9-3 9h18s-3-1.5-3-9"
                          />
                        </svg>
                        <span className="text-white">Preferences</span>
                      </div>
                      <span className="text-gray-400">&gt;</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
