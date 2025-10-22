"use client";

interface MatchProfile {
  name: string;
  goal: string;
  studyTopics: string;
  hoursAvailable: number;
  phoneNumber: string;
  profileImage: string;
}

interface GoalMessageProps {
  matchProfile?: MatchProfile | null;
}

export default function GoalMessage({ matchProfile }: GoalMessageProps) {
  return (
    <div className="flex items-center justify-center mb-4">
      <h4 className="text-white text-center text-lg">
        {matchProfile ? (
          <>
            Goal: {matchProfile.goal}
            <br />
            Strong in {matchProfile.studyTopics.split(",")[0]}
          </>
        ) : (
          <>
            Goal: Ace OSCE by July,
            <br />
            Prefers flashcards + Group Chat
          </>
        )}
      </h4>
    </div>
  );
}
