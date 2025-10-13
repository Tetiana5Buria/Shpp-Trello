export function onDragEnd(e: DragEvent) {
  if (e.target instanceof HTMLElement) {
    e.target.classList.remove('dragging');
  }
}
