"use client";

interface ProfileActionsProps {
  onEditProfile: () => void;
}

export default function ProfileActions({ onEditProfile }: ProfileActionsProps) {
  return (
    <div className="mt-auto divide-y divide-gray-700">
      <div
        onClick={onEditProfile}
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
    </div>
  );
}
