import React, { useEffect } from 'react';
import { ICardProps } from '../../../../common/interfaces/Interfaces';
import { validateTitle } from '../../../../utils/validateTitle';
import './card.scss';
import { toast } from 'sonner';
import { onDragStart, onDragEnd } from '../../../../dragAndDrops/index';
import { useEditableTitle } from '../Board/hooks/useEditableTitle';
import { confirmAndDelete } from '../../../../utils/confirmAndDelete';
import * as handleKeyDownFactory from '../../../../utils/handleKeyDownFactory';
import api from '../../../../api/request';
import { useAppDispatch } from '../../../../featchers/hooks';
import { openModal } from '../../../../featchers/store/modal-slice';
import { useNavigate } from 'react-router-dom';
import { Edit3 } from 'lucide-react'; // імпорт іконк
import { getCardEndpoint, navigateToCard } from '../../../../common/services/cardServices';
import { Tilt } from 'react-tilt';

const Card: React.FC<ICardProps> = ({
  title,
  list_id,
  board_id,
  description,
  card_id,
  position,
  onCardUpdated,
  color,
  deadline,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isEditing, editedTitle, error, setIsEditing, setEditedTitle, setError } = useEditableTitle(
    title,
    getCardEndpoint(board_id, card_id),
    onCardUpdated
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
      await api.put(getCardEndpoint(board_id, card_id), {
        title: editedTitle,
        list_id: list_id,
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
    try {
      await confirmAndDelete(
        'Ви впевнені, що хочете видалити картку?',
        getCardEndpoint(board_id, card_id),
        onCardUpdated
      );
    } catch {
      toast.error('Помилка при видаленні картки');
    }
  };

  const handleKeyDown = handleKeyDownFactory.handleKeyDownFactory(handleUpdateCardTitle, () => setIsEditing(false));

  const handleCardClick = () => {
    dispatch(
      openModal({
        id: card_id,
        title,
        description: description || '',
        list_id,
        board_id,
        custom: {
          background: color || '#ffffff',
        },
        position: 1,
      })
    );
    navigate(navigateToCard(board_id, card_id));
  };

  useEffect(() => {
    const el = document.querySelector(`[data-card-id="${card_id}"]`);
    if (el) {
      (el as HTMLElement).draggable = true;
    }
  }, [card_id]);

  /*   const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e.nativeEvent, card_id, list_id, position);
  }; */

  return (
    <li
      className="card"
      style={{ background: color }}
      draggable={true}
      data-position={position}
      data-card-id={card_id}
      onDragStart={(e) => onDragStart(e.nativeEvent, card_id, list_id, position)}
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
          <div className="item">
            <span onClick={handleCardClick} className="card-title">
              <p className="deadline">{deadline ? `Дедлайн: ${deadline}` : ''}</p> {/* Використовуємо проп deadline */}
              {title}
              <div className="item-edit">
                <Edit3 className="edit-icon" size={18} />
              </div>
            </span>
          </div>
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
