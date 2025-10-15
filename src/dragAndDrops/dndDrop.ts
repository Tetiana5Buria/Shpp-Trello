import { DragData } from './dndTypes';
import './dnd.scss';
import {
  dndState,
  createSlot,
  insertSlot,
  removeTargetSlot,
  removeSourceSlot,
  calculateInsertPosition,
  updateTargetSlot,
  resetDndState,
  reposition,
} from './dndUtils';
import { toast } from 'sonner';
import { IMinimalCard } from './dndTypes';
import { updateCardPositions } from '../common/services/dndDropServices';

export function dndDrop(listEl: HTMLElement, boardId: number, onSuccess: () => void) {
  listEl.addEventListener('dragenter', (event) => {
    event.preventDefault();
  });

  listEl.addEventListener('dragover', (event) => {
    event.preventDefault();
    if (!dndState.draggedData || !listEl.dataset.listId) return;

    const pos = calculateInsertPosition(listEl, event.clientY);
    updateTargetSlot(listEl, pos);
  });

  listEl.addEventListener('dragleave', (event) => {
    event.preventDefault();
    if (dndState.targetSlot && dndState.targetSlot.parentElement === listEl) {
      removeTargetSlot();
    }
  });

  listEl.addEventListener('drop', async (event) => {
    event.preventDefault();
    if (!dndState.draggedData || !dndState.targetSlot || !listEl.dataset.listId) return;

    const currentListId = Number(listEl.dataset.listId);
    const { id: draggedId, fromListId } = dndState.draggedData;
    const isSame = fromListId === currentListId;

    const lis: HTMLElement[] = Array.from(listEl.children).filter(
      (c): c is HTMLElement => c.tagName === 'LI' && (c.classList.contains('card') || c === dndState.targetSlot)
    );
    const slotIndex = lis.findIndex((li) => li === dndState.targetSlot);
    const cardsBefore: IMinimalCard[] = lis
      .slice(0, slotIndex)
      .filter((c) => c.classList.contains('card'))
      .map((c) => ({
        id: Number(c.dataset.cardId),
        position: Number(c.dataset.position),
        list_id: currentListId,
      }));
    const cardsAfter: IMinimalCard[] = lis
      .slice(slotIndex + 1)
      .filter((c) => c.classList.contains('card'))
      .map((c) => ({
        id: Number(c.dataset.cardId),
        position: Number(c.dataset.position),
        list_id: currentListId,
      }));

    const draggedCard: IMinimalCard = {
      id: draggedId,
      list_id: currentListId,
      position: cardsBefore.length,
    };
    const newListCards: IMinimalCard[] = [...cardsBefore, draggedCard, ...cardsAfter];
    const repositionedNew = reposition(newListCards);

    try {
      if (!isSame) {
        const oldListEl = document.querySelector(`[data-list-id="${fromListId}"]`) as HTMLElement;
        if (oldListEl) {
          const oldCards: IMinimalCard[] = Array.from(oldListEl.querySelectorAll('.card')).map((c) => ({
            id: Number((c as HTMLElement).dataset.cardId),
            position: Number((c as HTMLElement).dataset.position),
            list_id: fromListId,
          }));
          const repositionedOld = reposition(oldCards);
          await updateCardPositions(boardId, repositionedOld);
        }
      }

      await updateCardPositions(boardId, repositionedNew);
      toast.success('Картка переміщена!');
    } catch (error) {
      toast.error('Помилка переміщення');
      onSuccess(); // Синхронізація
    } finally {
      removeTargetSlot();
      if (!isSame && dndState.sourceSlot) removeSourceSlot();
      resetDndState();
      onSuccess();
    }
  });
}
//Start

export function onDragStart(e: DragEvent, id: number, fromListId: number, fromPosition: number) {
  resetDndState();

  const dragPayload: DragData = { id, fromListId, fromPosition };
  e.dataTransfer?.setData('application/json', JSON.stringify(dragPayload));
  dndState.draggedData = dragPayload;

  const target = e.currentTarget as HTMLElement;
  if (!target.classList.contains('card')) return;

  dndState.draggedEl = target;
  dndState.oldListEl = target.closest('.list-cards') as HTMLElement;
  if (!dndState.oldListEl) return;

  dndState.sourceSlot = createSlot();
  dndState.sourceSlot.dataset.position = fromPosition.toString();
  insertSlot(dndState.oldListEl, dndState.sourceSlot, fromPosition);

  const isDragging = true;
  if (isDragging) {
    target.classList.add('tilted-card');

    target.style.background = target.style.background || '#ffffff';
  }

  const transparentImage = new Image();
  transparentImage.src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjwvc3ZnPg==';
  e.dataTransfer?.setDragImage(transparentImage, 0, 0);

  const onDragOver = (e: DragEvent) => {
    if (dndState.draggedEl && isDragging) {
      const tiltX = (e.clientX / window.innerWidth - 0.5) * 10;
      const tiltY = (e.clientY / window.innerHeight - 0.5) * 5;
      dndState.draggedEl.style.transform = `rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale(1.05)`;
    }
  };
  document.addEventListener('dragover', onDragOver);

  const onDragEnd = () => {
    if (dndState.draggedEl) {
      dndState.draggedEl.classList.remove('tilted-card');
      dndState.draggedEl.style.transform = '';
      dndState.draggedEl.style.background = '';
    }
    if (dndState.sourceSlot) removeSourceSlot();
    if (dndState.targetSlot) removeTargetSlot();
    resetDndState();
    document.removeEventListener('dragover', onDragOver);
    document.removeEventListener('dragend', onDragEnd);
  };
  document.addEventListener('dragend', onDragEnd);
}
