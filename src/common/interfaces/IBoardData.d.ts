import { IList } from './IList';
export interface IBoardData {
  title: string;
  custom: { background?: string };
  users: { id: number; username: string }[];
  lists: IList[];
}
