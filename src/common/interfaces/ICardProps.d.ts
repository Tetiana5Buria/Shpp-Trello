export interface ICardProps {
  title: string;
  listId: number;
  description: string;
  boardId: number;
  cardId: number;
  color?: string;
  position: number;
  onCardUpdated: () => void;
}
