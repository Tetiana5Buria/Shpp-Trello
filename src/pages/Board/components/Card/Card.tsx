import React from 'react';
import { ICardProps } from '../../../../common/interfaces/ICardProps';
import { validateTitle } from '../validateTitle';
import './card.scss';
import { toast } from 'sonner';
import { onDragStart, onDragEnd } from '../../../../dragAndDrops/dndHandlers';
import { useColorUpdate } from '../Board/hooks/useColorUpdate';
import { useEditableTitle } from '../Board/hooks/useEditableTitle';
import { confirmAndDelete } from '../../../../utils/confirmAndDelete';
import { handleKeyDownFactory } from '../../../../utils/handleKeyDownFactory';
import api from '../../../../api/request';

const Card: React.FC<ICardProps> = ({
  title,
  listId,
  boardId,
  description,
  cardId,
  position,
  onCardUpdated,
  color: initialColor,
}) => {
  const endpoint = `/board/${boardId}/card/${cardId}`;

  const { isEditing, editedTitle, error, setIsEditing, setEditedTitle, setError } = useEditableTitle(
    title,
    endpoint,
    onCardUpdated
  );

  const { color, handleColorChange } = useColorUpdate(
    initialColor || '#ffffff',
    endpoint,
    onCardUpdated,
    editedTitle,
    listId,
    description
  );

  const handleUpdateCardTitle = async () => {
    if (editedTitle.trim() === title.trim()) {
      toast.info('Ви не внесли жодних змін');
      setIsEditing(false);
      return;
    }

    const { isValid, errorMessage } = validateTitle(editedTitle);
    if (!isValid) {
      setError(errorMessage);
      return;
    }

    try {
      await api.put(endpoint, {
        title: editedTitle,
        list_id: listId,
        description: description || '',
        custom: { background: color },
      });
      toast.success('Картка оновлена!');
      setIsEditing(false);
      setError(null);
      onCardUpdated();
    } catch {
      setError('Помилка при оновленні картки');
    }
  };

  const handleDeleteCard = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Ви впевнені, що хочете видалити картку?')) return;
    try {
      await confirmAndDelete('Ви впевнені, що хочете видалити картку?', endpoint, onCardUpdated);
    } catch {
      toast.error('Помилка при видаленні картки');
    }
  };

  const handleKeyDown = handleKeyDownFactory(handleUpdateCardTitle, () => setIsEditing(false));

  return (
    <li
      className="card"
      style={{ background: color }}
      draggable={true}
      data-position={position}
      data-card-id={cardId}
      onDragStart={(e) => onDragStart(e.nativeEvent, cardId, listId, position)}
      onDragEnd={(e) => onDragEnd(e.nativeEvent)}
    >
      {isEditing ? (
        <input
          value={editedTitle}
          onChange={(e) => {
            setEditedTitle(e.target.value);
            setError(null);
          }}
          onBlur={handleUpdateCardTitle}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <div className="card-content">
          <span
            onClick={() => {
              setIsEditing(true);
              setEditedTitle(title);
            }}
            className="card-title"
          >
            {title}
          </span>
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="color-picker"
            title="Обрати колір картки"
          />
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <button className="delete-card-button" onClick={handleDeleteCard}>
        Видалити
      </button>
    </li>
  );
};

export default Card;
