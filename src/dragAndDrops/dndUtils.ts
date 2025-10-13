import { IMinimalCard } from './dndTypes';
import { DragData } from './dndTypes';
import './dnd.scss';

export const dndState = {
  draggedEl: null as HTMLElement | null,
  oldListEl: null as HTMLElement | null,
  sourceSlot: null as HTMLElement | null,
  targetSlot: null as HTMLElement | null,
  draggedData: null as DragData | null,
  enteredSameList: false,
};

export function createSlot(): HTMLElement {
  const slot = document.createElement('li');
  slot.className = 'card-slot';
  return slot;
}

export function insertSlot(listEl: HTMLElement, slot: HTMLElement, position: number) {
  const cards = Array.from(listEl.querySelectorAll('.card')) as HTMLElement[];
  //0
  if (cards.length === 0) {
    listEl.appendChild(slot);
    return;
  }
  let inserted = false;
  for (const card of cards) {
    const cardPos = Number(card.dataset.position);
    //0
    if (position <= 0) {
      listEl.insertBefore(slot, cards[0]);
      inserted = true;
      break;
    }
    if (position <= cardPos) {
      listEl.insertBefore(slot, card);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    // end of list
    listEl.appendChild(slot);
  }
}

export function removeTargetSlot() {
  if (dndState.targetSlot && dndState.targetSlot.parentElement) {
    dndState.targetSlot.parentElement.removeChild(dndState.targetSlot);
  }
  dndState.targetSlot = null;
}

export function removeSourceSlot() {
  if (dndState.sourceSlot && dndState.sourceSlot.parentElement) {
    dndState.sourceSlot.parentElement.removeChild(dndState.sourceSlot);
  }
  dndState.sourceSlot = null;
}

export function calculateInsertPosition(listEl: HTMLElement, clientY: number): number {
  const cards = Array.from(listEl.querySelectorAll('.card')) as HTMLElement[];
  if (cards.length === 0) return 0;

  const listRect = listEl.getBoundingClientRect();
  const BUFFER = 10;
  if (clientY < listRect.top + BUFFER) return 0;
  if (clientY > listRect.bottom - BUFFER) return cards.length;

  let insertPos = cards.length;
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const rect = card.getBoundingClientRect();
    const mid = rect.top + rect.height / 2;
    if (clientY < mid) {
      insertPos = Number(card.dataset.position);
      break;
    }
  }
  return insertPos;
}

export function updateTargetSlot(listEl: HTMLElement, position: number) {
  const listId = Number(listEl.dataset.listId);
  const isSame = dndState.draggedData ? dndState.draggedData.fromListId === listId : false;

  if (isSame && !dndState.enteredSameList && dndState.sourceSlot) {
    removeSourceSlot();
    dndState.enteredSameList = true;
  }

  removeTargetSlot();

  dndState.targetSlot = createSlot();
  dndState.targetSlot.dataset.position = position.toString();
  insertSlot(listEl, dndState.targetSlot, position);
}

export function getSlot() {
  if (!dndState.targetSlot) return null;
  const listEl = dndState.targetSlot.closest('.list-cards') as HTMLElement;
  return {
    listId: Number(listEl.dataset.listId),
    position: Number(dndState.targetSlot.dataset.position),
  };
}

export function removeSlot() {
  removeTargetSlot();
}

export function reposition(list: IMinimalCard[]): IMinimalCard[] {
  return list.map((card, index) => ({ ...card, position: index }));
}

// Reset
export function resetDndState() {
  removeTargetSlot();
  removeSourceSlot();
  dndState.enteredSameList = false;
  dndState.draggedData = null;
  dndState.draggedEl = null;
  dndState.oldListEl = null;
  dndState.sourceSlot = null;
  dndState.targetSlot = null;
}
