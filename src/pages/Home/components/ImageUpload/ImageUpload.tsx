import React, { useState } from 'react';
import { toast } from 'sonner';
import { ImageUploadProps } from '../../../../common/interfaces/Interfaces';
import './imageUpload.scss';

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange }) => {
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Файл занадто великий! Максимальний розмір: 5 МБ');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageChange(base64);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(undefined);
      onImageChange(undefined);
    }
  };

  return (
    <div className="image-upload">
      <label>Фонове зображення для картки:</label>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <div
          className="image-preview-modal"
          style={{
            backgroundImage: `url(${preview})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>
      )}
    </div>
  );
};

export default ImageUpload;
