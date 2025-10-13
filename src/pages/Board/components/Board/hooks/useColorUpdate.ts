// hooks/useColorUpdate.ts
import { useState } from 'react';
import api from '../../../../../api/request';
import { toast } from 'sonner';

export const useColorUpdate = (
  initialColor: string,
  endpoint: string,
  onSuccess?: () => void,
  title?: string // ← додаємо назву
) => {
  const [color, setColor] = useState(initialColor);

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);

    try {
      await api.put(endpoint, {
        title: title ?? '', // ← передаємо поточну назву дошки
        custom: { background: newColor },
      });

      toast.success('Колір успішно змінено');
      onSuccess?.();
    } catch {
      toast.error('Помилка при оновленні кольору');
    }
  };

  return { color, handleColorChange };
};
