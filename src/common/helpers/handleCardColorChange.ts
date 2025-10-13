import { AppDispatch } from '../../featchers/store/store';
import { updateCardThunk } from '../../featchers/store/board-slice';
import { toast } from 'sonner';

interface CardMinimal {
  id: number;
  board_id: number | string;
  list_id: number | string;
  title: string;
  description?: string;
  custom?: { background?: string };
}

interface ExtraData {
  title?: string;
  description?: string;
}

export const handleCardColorChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  card: CardMinimal,
  dispatch: AppDispatch,
  extraData?: ExtraData
) => {
  const newColor = e.target.value;
  // eslint-disable-next-line no-console
  console.log('handleCardColorChange called with newColor:', newColor);

  dispatch(
    updateCardThunk({
      boardId: String(card.board_id),
      cardId: String(card.id),
      data: {
        title: extraData?.title ?? card.title,
        description: extraData?.description ?? card.description ?? '',
        list_id: card.list_id,
        custom: { ...card.custom, background: newColor },
      },
    })
  )
    .unwrap()
    .then(() => toast.success('Колір оновлено'))
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error in handleCardColorChange:', err);
      toast.error('Помилка при зміні кольору');
    });
};
