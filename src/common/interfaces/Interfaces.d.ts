export interface CreateModalEntityProps {
  entity: string;
  buttonText: string;
  buttonClass: string;
  colorPickerClass: string;
  defaultColor?: string;
  onCreate: (
    title: string,
    color: string,
    reset: () => void,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
}
import { IList } from './IList';
export interface IBoardData {
  title: string;
  custom: { background?: string };
  users: { id: number; username: string }[];
  lists: IList[];
}
export interface IBoardType {
  id: number;
  title: string;
  custom: {
    background: string;
  };
}
export interface ICard {
  id: number;
  title: string;
  description: string;
  list_id: string | number;
  board_id: string | number;
  position: number;
  isSlot?: boolean;
  custom?: {
    background?: string;
    deadline?: string;
  };
}
export interface ICardProps {
  title: string;
  list_id: number;
  description: string;
  board_id: number;
  card_id: number;
  color?: string;
  position: number;
  draggable?: boolean;
  color?: string;
  deadline?: string;
  onCardUpdated: () => void;
  onOpenModal: () => void;
  setAllCards: Dispatch<SetStateAction<ICard[]>>;
  onNativeDragStart?: (evt: DragEvent) => void;
  onNativeDragEnd?: (evt: DragEvent) => void;
}
export interface ICreateBoardProps {
  onBoardCreated: () => void;
}
export interface ICreateCardProps {
  boardId: number;
  listId: number;
  onCardCreated: () => void;
}
export interface ICreateListProps {
  boardId: number;
  color?: string;
  onListCreated: () => void;
}
import { ICard } from './ICard';
export interface IList {
  id: number;
  title: string;
  cards: ICard[];
  custom?: {
    background?: string;
  };
}
export interface IListProps {
  title: string;
  cards: ICard[];
  listId: number;
  boardId: number;
  onListCreated: () => void;
  color?: string;
  slot?: number;
  onCardMoved: () => void;
  onCardUpdated: () => void;
  allBoardCards: ICard[];
}
export interface BoardProps {
  title: string;
  custom?: {
    background?: string;
    backgroundType?: 'color' | 'image';
  };
}
export interface CreateBoardProps {
  onBoardCreated: () => void;
}
export interface ICreateModalEntityPropsBoard {
  entity: string;
  buttonText: string;
  buttonClass: string;
  colorPickerClass: string;
  defaultColor?: string;
  onCreate: (
    title: string,
    background: { color?: string; image?: string },
    reset: () => void,
    setError: (error: string | null) => void
  ) => void;
}
export interface ImageUploadProps {
  onImageChange: (base64: string | undefined) => void;
}
export interface ICardModalProps {
  onCardUpdated: () => void;
}
