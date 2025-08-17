import { DragData } from './dndTypes';
import { ICard } from '../common/interfaces/ICard';
import { addSlot, removeSlot, getSlot } from './dndUtils';
import api from '../api/request';
import { toast } from 'sonner';
import './dnd.scss';

// Утиліта для оновлення позицій
function reposition(cards: ICard[]): ICard[] {
  return cards.map((card, index) => ({ ...card, position: index }));
}

// Старт перетягування
export function onDragStart(e: DragEvent, id: number, fromListId: number, fromPosition: number) {
  const dragPayload: DragData = { id, fromListId, fromPosition };
  e.dataTransfer?.setData('application/json', JSON.stringify(dragPayload));
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
  }

  if (e.target instanceof HTMLElement) {
    e.target.classList.add('dragging');
  }
}

// Коли картка залишає список
export function onDragLeave(e: DragEvent, listEl: HTMLElement) {
  e.preventDefault();
  document.querySelectorAll('.card-slot').forEach((el) => el.remove());
}

// Кінець перетягування
export function onDragEnd(e: DragEvent) {
  if (e.target instanceof HTMLElement) {
    e.target.classList.remove('dragging');
  }
  removeSlot();
}

// Коли картка заходить у список
export function onDragEnter(e: DragEvent, listEl: HTMLElement) {
  e.preventDefault();

  if (!(e.target instanceof HTMLElement)) return;
  const target = e.target;

  const isCard = target.classList.contains('card');

  if (isCard) {
    const cardRect = target.getBoundingClientRect();
    const mouseY = e.clientY - cardRect.top;
    const cardPos = Number(target.dataset.position);

    const insertPos = mouseY < cardRect.height / 2 ? cardPos : cardPos + 1;
    addSlot(listEl, insertPos);
  } else if (target.classList.contains('list-cards')) {
    const children = Array.from(target.children) as HTMLElement[];
    const lastCard = children[children.length - 1];
    const lastPos = lastCard ? Number(lastCard.dataset.position) + 1 : 0;
    addSlot(listEl, lastPos);
  }
}

// Обробка дропа
export async function onDrop(
  e: DragEvent,
  listEl: HTMLElement,
  boardId: number,
  allCards: ICard[],
  setAllCards: (cards: ICard[]) => void
) {
  e.preventDefault();
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
  }

  const slot = getSlot();
  if (!slot) return;

  const rawData = e.dataTransfer?.getData('application/json');
  if (!rawData) return;

  let dragData: DragData;
  try {
    dragData = JSON.parse(rawData);
  } catch {
    toast.error('Неможливо прочитати дані перетягування');
    return;
  }

  const { id: movedCardId, fromListId, fromPosition } = dragData;
  const movedCard = allCards.find((c) => c.id === movedCardId);
  if (!movedCard) return;

  if (fromListId === slot.listId && fromPosition === slot.position) {
    removeSlot();
    return;
  }

  let withoutMoved = allCards.filter((c) => c.id !== movedCardId);

  if (fromListId !== slot.listId) {
    withoutMoved = withoutMoved.map((c) =>
      c.list_id === fromListId && c.position > fromPosition ? { ...c, position: c.position - 1 } : c
    );
  }

  const newList = withoutMoved.filter((c) => c.list_id === slot.listId).sort((a, b) => a.position - b.position);

  const insertPos = Math.max(0, Math.min(slot.position, newList.length));
  newList.splice(insertPos, 0, {
    ...movedCard,
    list_id: slot.listId,
    position: insertPos,
  });

  const newListRepositioned = reposition(newList);

  const updatedCards = [
    ...withoutMoved.filter((c) => c.list_id !== fromListId && c.list_id !== slot.listId),
    ...newListRepositioned,
  ];

  setAllCards(updatedCards);

  const updatePayload = [
    ...newListRepositioned.map((c) => ({
      id: c.id,
      position: c.position,
      list_id: slot.listId,
    })),
    ...(fromListId !== slot.listId
      ? withoutMoved
          .filter((c) => c.list_id === fromListId)
          .map((c) => ({
            id: c.id,
            position: c.position,
            list_id: c.list_id,
          }))
      : []),
  ];

  const isValidPayload = updatePayload.every(
    (item) => typeof item.id === 'number' && typeof item.position === 'number' && typeof item.list_id === 'number'
  );

  if (!isValidPayload) {
    toast.error('Некоректні дані для оновлення');
    return;
  }

  try {
    await api.put(`/board/${boardId}/card`, updatePayload);
    toast.success('Картка переміщена');
  } catch {
    toast.error('Помилка при переміщенні картки');
  }

  removeSlot();
}
