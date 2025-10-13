import api from '../../api/request';
import { ICreateCardProps } from '../interfaces/Interfaces';
import { toast } from 'sonner';

export async function createCard(
  boardId: number,
  listId: number,
  title: string,
  color: string
): Promise<ICreateCardProps> {
  try {
    const { data } = await api.post<ICreateCardProps>(`/board/${boardId}/card`, {
      title,
      list_id: listId,
      position: 1,
      description: '',
      custom: { background: color },
    });
    return data;
  } catch (error) {
    toast.error('Помилка при створенні картки:');
    throw error;
  }
}
