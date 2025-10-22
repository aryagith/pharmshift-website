"use client";

import Image from "next/image";
import { useRef } from "react";

interface ProfileHeaderProps {
  profileImage: string | null;
  matchProfileImage?: string;
  userName: string;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileHeader({
  profileImage,
  matchProfileImage,
  userName,
  onImageUpload,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDisplayName = (fullName: string) => {
    if (fullName === "No name available") return fullName;

    const nameParts = fullName.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0];

    const firstName = nameParts[0];
    const lastNameInitial = nameParts[nameParts.length - 1]?.[0] || "";
    return `${firstName} ${lastNameInitial}.`;
  };

  return (
    <div className="flex flex-col items-center mb-6 mt-20">
      <div
        onClick={() => fileInputRef.current?.click()}
        className="w-32 h-32 rounded-full overflow-hidden cursor-pointer border bg-gray-700 flex items-center justify-center"
      >
        <Image
          src={matchProfileImage || profileImage || "/default-avatar.png"}
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
          onChange={onImageUpload}
        />
      </div>

      <div className="text-white px-4 py-2 mt-2 text-4xl font-bold">
        {formatDisplayName(userName)}
      </div>
    </div>
  );
}
