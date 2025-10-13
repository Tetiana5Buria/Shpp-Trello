import { useState } from 'react';
import { validateTitle } from '../../../../../utils/validateTitle';
import api from '../../../../../api/request';
import { toast } from 'sonner';

export const useEditableTitle = (initialTitle: string, endpoint: string, onSuccess?: () => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateTitle = async () => {
    if (editedTitle.trim() === initialTitle.trim()) {
      toast.info('Ви не внесли жодних змін');
      setIsEditing(false);
      return;
    }

    const { isValid, errorMessage } = validateTitle(editedTitle);
    if (!isValid) {
      setError(errorMessage);
      return;
    }

    try {
      await api.put(endpoint, { title: editedTitle });
      toast.success('Назву успішно оновлено');
      setIsEditing(false);
      setError(null);
      onSuccess?.();
    } catch {
      toast.error('Помилка при оновленні назви');
      setError('Не вдалося оновити назву');
    }
  };

  return {
    isEditing,
    editedTitle,
    error,
    setIsEditing,
    setEditedTitle,
    setError,
    handleUpdateTitle,
  };
};
