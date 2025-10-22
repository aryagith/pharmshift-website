"use client";

import { Button } from "@mui/material";
import { motion } from "framer-motion";

interface MatchProfile {
  name: string;
  goal: string;
  studyTopics: string;
  hoursAvailable: number;
  phoneNumber: string;
  profileImage: string;
}

interface MatchProfileCardProps {
  matchProfile: MatchProfile;
  loading: boolean;
  onBackToProfile: () => void;
  onFindNewMatch: () => void;
}

export default function MatchProfileCard({
  matchProfile,
  loading,
  onBackToProfile,
  onFindNewMatch,
}: MatchProfileCardProps) {
  return (
    <motion.div
      key={matchProfile.phoneNumber}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {loading && (
        <div className="flex justify-center my-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="contained"
          color="primary"
          onClick={onBackToProfile}
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
              `https://wa.me/${encodeURIComponent(matchProfile.phoneNumber)}`
            )
          }
        >
          Start Chat
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={onFindNewMatch}
          disabled={loading}
        >
          {loading ? "Finding Match..." : "Find Another Match"}
        </Button>
      </div>

      <div className="bg-[#0b162d] text-white rounded-md p-5 mb-6 border border-blue-800">
        <p className="text-blue-400 font-medium mb-1">Study Match</p>
        <p className="mb-2">
          Matched with {matchProfile.name.split(" ")[0]}{" "}
          {matchProfile.name.split(" ")[1]?.[0]}.
        </p>
        <p className="mb-2">
          Strong in {matchProfile.studyTopics.split(",")[0]}
        </p>
        <p className="mb-2">Goal: {matchProfile.goal}</p>
        <p className="mb-2">Study Topics: {matchProfile.studyTopics}</p>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1 text-white">
            <span>Hours available to study</span>
            <span>{matchProfile.hoursAvailable} / 50</span>
          </div>
          <div className="w-full bg-[#1f2937] rounded-full h-2.5">
            <div
              className="bg-blue-500 h-2.5 rounded-full"
              style={{
                width: `${(matchProfile.hoursAvailable / 50) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
