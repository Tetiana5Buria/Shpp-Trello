export interface IListProps {
  title: string;
  cards: ICard[];
  listId: number;
  boardId: number;
  onListCreated: () => void;
  color?: string;
}
