import api from '../../api/request';
import { IBoardData } from '../../common/interfaces/Interfaces';
import { ICard } from '../../common/interfaces/Interfaces';
export async function getBoard(boardId: string): Promise<IBoardData> {
  const data: IBoardData = await api.get(`/board/${boardId}`);
  return data;
}
export async function updateCards(boardId: number, cards: Partial<ICard>[]): Promise<void> {
  await api.put(`/board/${boardId}/card`, cards);
}
export const navigateToHome = () => `/`;
export const navigateToBoard = (boardId: string | number) => `/board/${String(boardId)}`;
