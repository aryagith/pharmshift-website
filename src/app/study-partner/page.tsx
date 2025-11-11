"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import React from "react";
import { Button, Card, CardContent } from "@mui/material";
import axios from "axios";
import { AnimatePresence } from "framer-motion";

// Import components
import ProfileHeader from "../components/study-partner/ProfileHeader";
import RatingDisplay from "../components/study-partner/RatingDisplay";
import ProgressCard from "../components/study-partner/ProgressCard";
import MatchProfileCard from "../components/study-partner/MatchProfileCard";
import EditProfileForm from "../components/study-partner/EditProfileForm";
import ProfileActions from "../components/study-partner/ProfileActions";
import GoalMessage from "../components/study-partner/GoalMessage";

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
  const [loading, setLoading] = useState(false);
  const [aiChatsUsed, setAiChatsUsed] = useState(127);

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
          setProfileImage(data.profileImage || session?.user?.image || null);
        } else {
          // No profile data found, use session defaults
          setProfileImage(session?.user?.image || null);
        }
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
        // Set default values on error, including session image as fallback
        setGoal("");
        setTopics("");
        setHoursAvailable(0);
        setPhoneNumber("");
        setProfileImage(session?.user?.image || null);
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
          <ProfileHeader
            profileImage={profileImage || session?.user?.image || null}
            matchProfileImage={matchProfile?.profileImage}
            userName={
              matchProfile?.name || session?.user?.name || "No name available"
            }
            onImageUpload={handleImageUpload}
          />

          <RatingDisplay rating={2} />

          <GoalMessage matchProfile={matchProfile} />

          {/* Matched person's Info */}
          <AnimatePresence mode="wait">
            {matchProfile && (
              <MatchProfileCard
                matchProfile={matchProfile}
                loading={loading}
                onBackToProfile={() => setMatchProfile(null)}
                onFindNewMatch={handleFindMatch}
              />
            )}
          </AnimatePresence>

          {/* My Info */}
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

              {/* Enhanced Progress Cards */}
              <div className="space-y-6 mb-6">
                <ProgressCard
                  title="Study Hours Available"
                  subtitle="Weekly commitment"
                  currentValue={hoursAvailable}
                  maxValue={maxHours}
                  unit="h"
                  isEditable={true}
                  onValueChange={setHoursAvailable}
                  icon={
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  }
                />

                <ProgressCard
                  title="AI Chat Sessions"
                  subtitle="Monthly usage"
                  currentValue={aiChatsUsed}
                  maxValue={aiChatsMax}
                  isEditable={true}
                  onValueChange={setAiChatsUsed}
                  icon={
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  }
                  showUsageBadge={true}
                />
              </div>

              {/* Editing mode */}
              {editMode ? (
                <EditProfileForm
                  hoursAvailable={hoursAvailable}
                  topics={topics}
                  goal={goal}
                  phoneNumber={phoneNumber}
                  maxHours={maxHours}
                  onHoursChange={setHoursAvailable}
                  onTopicsChange={setTopics}
                  onGoalChange={setGoal}
                  onPhoneChange={setPhoneNumber}
                  onSave={handleSave}
                  onCancel={() => setEditMode(false)}
                />
              ) : (
                <ProfileActions onEditProfile={() => setEditMode(true)} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
