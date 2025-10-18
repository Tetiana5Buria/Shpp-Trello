/* eslint-disable @typescript-eslint/no-explicit-any */

export const getListEndpoint = (boardId: string | number, listId: string | number): string =>
  `/board/${boardId}/list/${listId}`;
