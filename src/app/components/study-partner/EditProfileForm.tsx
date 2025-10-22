"use client";

import { TextField, Button } from "@mui/material";

interface EditProfileFormProps {
  hoursAvailable: number;
  topics: string;
  goal: string;
  phoneNumber: string;
  maxHours: number;
  onHoursChange: (hours: number) => void;
  onTopicsChange: (topics: string) => void;
  onGoalChange: (goal: string) => void;
  onPhoneChange: (phone: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditProfileForm({
  hoursAvailable,
  topics,
  goal,
  phoneNumber,
  maxHours,
  onHoursChange,
  onTopicsChange,
  onGoalChange,
  onPhoneChange,
  onSave,
  onCancel,
}: EditProfileFormProps) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-5 border border-gray-700 space-y-4">
      <TextField
        label="Hours Available"
        type="number"
        value={hoursAvailable}
        onChange={(e) => {
          const value = Math.min(Math.max(Number(e.target.value), 0), maxHours);
          onHoursChange(value);
        }}
        fullWidth
        margin="normal"
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "#9CA3AF" },
        }}
      />

      <TextField
        label="Study Topics"
        value={topics}
        onChange={(e) => onTopicsChange(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "#9CA3AF" },
        }}
      />

      <TextField
        label="Your Goal"
        value={goal}
        onChange={(e) => onGoalChange(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "#9CA3AF" },
        }}
      />

      <TextField
        label="Phone Number"
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneChange(e.target.value)}
        fullWidth
        margin="normal"
        InputProps={{
          style: { color: "white" },
        }}
        InputLabelProps={{
          style: { color: "#9CA3AF" },
        }}
      />

      <div className="flex justify-between pt-4">
        <Button variant="contained" color="primary" onClick={onSave}>
          Save
        </Button>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
