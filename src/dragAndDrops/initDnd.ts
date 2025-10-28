import { onDragStart } from './dndDrop';
import { dndDrop } from './dndDrop';

export function initDnd(
  nativeEvent: DragEvent,
  boardId: number,
  list_id: number,
  position: number,
  onSuccess: () => void
) {
  const lists = document.querySelectorAll('.list-cards') as NodeListOf<HTMLElement>;
  lists.forEach((listEl) => {
    // Запобігаємо перетягуванню списків
    listEl.addEventListener('dragstart', (event: DragEvent) => {
      event.preventDefault();
      // eslint-disable-next-line no-console
      console.log('Prevented dragstart on list:', listEl);
    });

    // Додаємо обробники для карток
    const cards = listEl.querySelectorAll('.card') as NodeListOf<HTMLElement>;
    cards.forEach((card) => {
      card.setAttribute('draggable', 'true');
      const id = Number(card.getAttribute('data-card-id'));
      const listId = Number(listEl.getAttribute('data-list-id'));
      const position = Number(card.getAttribute('data-position'));
      card.addEventListener('dragstart', (e: DragEvent) => onDragStart(e, id, listId, position));
    });

    // Додаємо обробники для drop
    dndDrop(listEl, boardId, onSuccess);
  });
  // eslint-disable-next-line no-console
  console.log('Dnd initialized for lists:', lists.length);
}
