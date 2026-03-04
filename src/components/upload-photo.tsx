'use client';
import { useState } from 'react';
import Image from 'next/image';

interface UploadPhotoProps {
  onUpload: (file: File) => void;
}

export default function UploadPhoto({ onUpload }: UploadPhotoProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewUrl && (
        <div className="mt-4 relative w-48 h-48">
          <Image
            src={previewUrl}
            alt="תצוגה מקדימה"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
