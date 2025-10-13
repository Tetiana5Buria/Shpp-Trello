import api from '../../api/request';
import { IMinimalCard } from '../../dragAndDrops';
import { toast } from 'sonner';
export async function updateCardPositions(boardId: number, cards: IMinimalCard[]) {
  try {
    await api.put(`/board/${boardId}/card`, cards);
  } catch (error) {
    toast.error('Failed to update card positions:');
    throw error;
  }
}
