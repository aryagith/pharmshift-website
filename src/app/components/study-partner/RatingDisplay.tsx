"use client";

import Image from "next/image";

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
}

export default function RatingDisplay({
  rating,
  maxRating = 5,
}: RatingDisplayProps) {
  return (
    <div className="flex items-center justify-center mb-4">
      <h4 className="text-blue-700 mr-3 font-bold text-2xl">Rating</h4>
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, index) => (
          <Image
            key={index + 1}
            src="/horizontalpill.png"
            alt="Pill"
            width={30}
            height={30}
            className={`${
              index + 1 <= rating ? "opacity-100" : "opacity-30"
            } transition-opacity`}
          />
        ))}
      </div>
    </div>
  );
}
