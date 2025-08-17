export const handleKeyDownFactory = (onEnter: () => void, onEscape: () => void) => {
  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onEnter();
    if (e.key === 'Escape') onEscape();
  };
};
