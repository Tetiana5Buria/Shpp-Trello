import { SlotPosition } from './dndTypes';

let currentSlot: SlotPosition | null = null;

export function addSlot(listEl: HTMLElement, position: number) {
  removeSlot();

  const slot = document.createElement('div');
  slot.classList.add('card-slot');
  slot.dataset.position = String(position);

  const children = Array.from(listEl.children) as HTMLElement[];
  const insertBeforeCard =
    children.find((card) => card.classList.contains('card') && Number(card.dataset.position) >= position) || null;
  listEl.insertBefore(slot, insertBeforeCard);

  currentSlot = {
    id: Number(listEl),
    listId: Number(listEl.dataset.listId),
    position,
  };
}

export function removeSlot() {
  document.querySelectorAll('.card-slot').forEach((slot) => slot.remove());
  currentSlot = null;
}

export function getSlot(): SlotPosition | null {
  return currentSlot;
}
