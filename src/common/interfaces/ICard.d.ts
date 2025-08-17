export interface ICard {
  id: number;
  title: string;
  description: string;
  list_id: number;
  board_id: number;
  position: number;
  custom?: {
    background?: string;
    deadline?: string;
  };
}
