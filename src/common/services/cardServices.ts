// cardServices.ts
export const getCardEndpoint = (boardId: number | string, cardId: number | string) =>
  `/board/${boardId}/card/${cardId}`;
export const navigateToCard = (board_id: string | number, card_id: string | number) => `/b/${board_id}/c/${card_id}`;
