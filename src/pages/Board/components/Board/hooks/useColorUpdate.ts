import { useState } from 'react';
import { toast } from 'sonner';
import { updateListColorRequest } from '../../../../../common/services/listServices';
import { useAppDispatch } from '../../../../../featchers/hooks';
import { fetchBoard } from '../../../../../featchers/store/board-slice';

export const useColorUpdate = (initialColor: string, endpoint: string, onSuccess?: () => void, title?: string) => {
  const [color, setColor] = useState(initialColor);
  const dispatch = useAppDispatch();

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    setColor(newColor);

    try {
      const [boardId, listId] = endpoint.split('/board/')[1].split('/list/');
      await updateListColorRequest(boardId, listId, newColor, title ?? '');

      toast.success('Колір успішно змінено');
      dispatch(fetchBoard(boardId.toString()));
      onSuccess?.();
    } catch (error) {
      toast.error('Помилка при оновленні кольору');
    }
  };

  return { color, setColor, handleColorChange };
};
