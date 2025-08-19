'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@mui/material';

export default function ProfileCard({
  user,
  isEditable,
  onFindMatch,
  matchedUser
}: {
  user: any;
  isEditable?: boolean;
  onFindMatch: () => void;
  matchedUser: any;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user.image || null);
  const [name, setName] = useState(user.name || '');
  const [goal, setGoal] = useState(user.goal || '');
  const [topics, setTopics] = useState(user.studyTopics || '');
  const [hoursAvailable, setHoursAvailable] = useState(user.hoursAvailable || 0);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || '');

  const maxHours = 50;

  useEffect(() => {
    setName(user.name || '');
    setGoal(user.goal || '');
    setTopics(user.studyTopics || '');
    setPhoneNumber(user.phoneNumber || '');
    setHoursAvailable(user.hoursAvailable || 0);
    setProfileImage(user.image || null);
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#0d1326] text-white p-6 rounded-xl shadow-md w-full max-w-xl mx-auto">
      <div className="flex flex-col items-center">
        <div
          onClick={() => isEditable && fileInputRef.current?.click()}
          className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden border border-white cursor-pointer"
        >
          {profileImage ? (
            <Image src={profileImage} alt="Profile" width={144} height={144} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600 text-white">Upload</div>
          )}
          {isEditable && (
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          )}
        </div>

        <p className="mt-3 px-3 py-1 bg-blue-700 rounded-md text-sm font-semibold">{goal}</p>
        <p className="mt-1 text-gray-300 text-sm italic">{name}</p>
      </div>

      <div className="mt-4">
        <label className="block text-xs text-gray-400 mb-1">Study Topics</label>
        <p className="text-sm mb-3">{topics}</p>

        <label className="block text-xs text-gray-400 mb-1">Hours Available</label>
        <div className="w-full bg-gray-700 h-2 rounded-full mb-1">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: `${(hoursAvailable / maxHours) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-400 mb-4">{hoursAvailable} / {maxHours}</p>

        {phoneNumber && (
          <div className="mb-3">
            <a
              href={`https://wa.me/${phoneNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 text-sm hover:underline"
            >
              Chat on WhatsApp
            </a>
          </div>
        )}

        {isEditable ? null : (
          <div className="flex justify-end">
            <Button
              variant="outlined"
              color="primary"
              onClick={onFindMatch}
              className="text-sm"
            >
              Find another match
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
