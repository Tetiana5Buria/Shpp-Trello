import api from '../../api/request';
import { IBoardData } from '../../common/interfaces/Interfaces';
import { ICard } from '../../common/interfaces/Interfaces';
export async function getBoard(boardId: string): Promise<IBoardData> {
  const response = await api.get(`/board/${boardId}`);
  return response.data;
}
export async function updateCards(boardId: number, cards: Partial<ICard>[]): Promise<void> {
  await api.put(`/board/${boardId}/card`, cards);
}
export const updateBoardColorRequest = async (
  boardId: string | number,
  color: string,
  title: string
): Promise<void> => {
  await api.put(`/board/${boardId}`, {
    title,
    custom: { background: color },
  });
};
export const navigateToHome = () => `/`;
export const navigateToBoard = (boardId: string | number) => `/board/${String(boardId)}`;
