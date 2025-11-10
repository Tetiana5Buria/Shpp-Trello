import { useState } from 'react';
import { toast } from 'sonner';
import { updateListColorRequest } from '../../../../../common/services/listServices';
import { updateBoardColorRequest } from '../../../../../common/services/boardServices';
import { useAppDispatch } from '../../../../../featchers/hooks';
import { fetchBoard } from '../../../../../featchers/store/board-slice';

export const useColorUpdate = (initialColor: string, endpoint: string, onSuccess?: () => void, title?: string) => {
  const [color, setColor] = useState(initialColor);
  const dispatch = useAppDispatch();

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;

    setColor(newColor);

    try {
      const boardMatch = endpoint.match(/\/board\/(\d+)/);
      const listMatch = endpoint.match(/\/list\/(\d+)/);

      if (!boardMatch) throw new Error('Board ID not found');

      const boardId = boardMatch[1];

      if (listMatch) {
        const listId = listMatch[1];
        await updateListColorRequest(boardId, listId, newColor, title ?? '');
      } else {
        await updateBoardColorRequest(boardId, newColor, title ?? '');
      }

      toast.success('Колір успішно змінено');
      dispatch(fetchBoard(boardId));
      onSuccess?.();
    } catch (error) {
      toast.error('Помилка при оновленні кольору');
    }
  };

  return { color, setColor, handleColorChange };
};
