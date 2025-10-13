import api from '../../api/request';
import { ICreateListProps } from '../interfaces/Interfaces';

export async function createList(boardId: number, title: string, color: string): Promise<ICreateListProps> {
  const { data } = await api.post(`/board/${boardId}/list`, {
    title,
    position: 1,
    custom: { background: color },
  });
  return data;
}
