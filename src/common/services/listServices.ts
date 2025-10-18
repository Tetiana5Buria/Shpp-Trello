/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../../api/request';

export const getListEndpoint = (boardId: string | number, listId: string | number): string =>
  `/board/${boardId}/list/${listId}`;

export const updateListColorRequest = async (
  boardId: string | number,
  listId: string | number,
  color: string,
  title: string
): Promise<void> => {
  await api.put(getListEndpoint(boardId, listId), {
    title,
    custom: { background: color },
  });
};
