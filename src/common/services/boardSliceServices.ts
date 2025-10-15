/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../../api/request';

export const updateCardRequest = (boardId: number | string, cardId: number | string, data: any) =>
  api.put(`/board/${boardId}/card/${cardId}`, data);

export const copyCardRequest = (boardId: number | string, data: any) => api.post(`/board/${boardId}/card`, data);
export const archiveCardRequest = (boardId: number | string, cardId: number | string, data: any) =>
  api.put(`/board/${boardId}/card/${cardId}`, { ...data, archived: true });
