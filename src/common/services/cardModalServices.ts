// --- API endpoints ---
export const getCardEndpoint = (boardId: string, cardId: string) => `/board/${boardId}/card/${cardId}`;

export const updateCardEndpoint = (boardId: string, cardId: string) => `/board/${boardId}/card/${cardId}`;

export const copyCardEndpoint = (boardId: string) => `/board/${boardId}/card`;

export const archiveCardEndpoint = (boardId: string, cardId: string) => `/board/${boardId}/card/${cardId}/archive`;

// --- Navigation helpers ---
export const navigateToBoard = (boardId: string | number) => `/board/${boardId}`;
export const navigateToHome = () => `/`;

/**
 * Якщо потрібна навігація з card до board
 * (приклад: закриття модалки з картки)
 */
export const navigateToBoardFromCard = (card: { board_id: string | number }) => `/board/${String(card.board_id)}`;
