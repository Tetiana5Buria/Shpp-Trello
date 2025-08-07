import React, { useState } from 'react';
import api from '../../../../api/request';
import { validateTitle } from '../../../../utils/validateTitle';
import './card.scss';
import { toast } from 'sonner';

interface CardProps {
  title: string;
  listId: number;
  description: string;
  boardId: number;
  cardId: number;
  color?: string;
  onCardUpdated: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  listId,
  boardId,
  description,
  cardId,
  onCardUpdated,
  color: initialColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(initialColor);

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    try {
      await api.put(`/board/${boardId}/card/${cardId}`, {
        title: editedTitle,
        list_id: listId,
        description: description || '',
        custom: { background: newColor, deadline: '' },
      });
      toast.success('Колір картки успішно змінено!');
    } catch (err) {
      // eslint-disable-next-line no-console
      toast.error('Помилка при оновленні кольору:');
    }
  };

  const handleUpdateCardTitle = async () => {
    const { isValid, errorMessage } = validateTitle(editedTitle);
    if (!isValid) {
      setError(errorMessage);
      return;
    }
    // eslint-disable-next-line no-console
    console.log('cardId:', cardId, 'title:', editedTitle);

    try {
      await api.put(`/board/${boardId}/card/${cardId}`, {
        title: editedTitle,
        list_id: listId,
        description: description || '',
        custom: { background: color, deadline: '' },
      });
      toast.success('Картка успішно відредагована!');

      setIsEditing(false);
      setError(null);
      onCardUpdated();
    } catch (err) {
      setError('Помилка при оновленні картки');
    }
  };
  const handleDeleteCard = async () => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Ви впевнені, що хочете видалити картку?');
    if (!confirmed || !cardId) return;

    try {
      await api.delete(`/board/${boardId}/card/${cardId}`);
      toast.success('Картку видалено!');
      onCardUpdated();
    } catch (err) {
      toast.error('Помилка при видаленні картки');
      // eslint-disable-next-line no-console
      toast.error('Delete card error:');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleUpdateCardTitle();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div className="card" style={{ background: color }}>
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
        <div onClick={() => setIsEditing(true)}>
          {title}
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="color-picker"
            title="Обрати колір списку"
          />
        </div>
      )}
      {error && <p className="error">{error}</p>}
      <button className="delete-card-button" onClick={handleDeleteCard}>
        Видалити картку
      </button>
    </div>
  );
};

export default Card;
