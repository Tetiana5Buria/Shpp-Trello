import { useEffect, useState } from 'react';
import List from './components/List/List';
import './board.scss';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/request';
import { validateTitle } from '../../utils/validateTitle';
import CreateList from './components/CreateList/CreateList';
import { ICard } from '../../common/interfaces/ICard';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface IList {
  id: number;
  title: string;
  cards: ICard[];
  custom?: {
    background?: string;
  };
}

interface BoardData {
  title: string;
  custom: { background?: string };
  users: { id: number; username: string }[];
  lists: IList[];
}

function Board(): React.ReactElement {
  const { board_id } = useParams<{ board_id: string }>();
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [color, setColor] = useState('#ffffff');

  const navigate = useNavigate();

  const fetchBoard = useCallback(async () => {
    try {
      const data: BoardData = await api.get(`/board/${board_id}`);
      // eslint-disable-next-line no-console
      console.log('Fetched board data:', data);
      setBoardData(data);
      setColor(data.custom?.background || '#ffffff');
    } catch (error) {
      // eslint-disable-next-line no-console
      toast.error('Помилка при завантаженні дошки:');
    }
  }, [board_id]);

  const handleUpdateTitle = async () => {
    const { isValid, errorMessage } = validateTitle(editedTitle);
    if (!isValid) {
      setTitleError(errorMessage);
      return;
    }

    try {
      await api.put(`/board/${board_id}`, {
        title: editedTitle,
      });
      await fetchBoard();
      setIsEditingTitle(false);
      setTitleError(null);
      toast.success('Дошку успішно відредаговано');
    } catch (err) {
      // eslint-disable-next-line no-console
      toast.error('Помилка при оновленні назви:');
      setTitleError('Не вдалося оновити назву');
    }
  };

  const handleColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    try {
      await api.put(`/board/${board_id}`, {
        custom: { background: newColor },
      });
      await fetchBoard();
      toast.success('Колір успішно змінено');
    } catch (err) {
      // eslint-disable-next-line no-console
      toast.error('Помилка при оновленні кольору:');
    }
  };
  const handleDeleteBoard = async () => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Ви впевнені, що хочете видалити дошку?');
    if (!confirmed || !board_id) return;
    toast.success('Дошку видалено!');
    try {
      await api.delete(`/board/${board_id}`);
      navigate('/');
    } catch (err) {
      toast.error('Помилка при видаленні дошки');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleUpdateTitle();
    if (e.key === 'Escape') setIsEditingTitle(false);
  };

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  if (!boardData) return <p>Loading...</p>;

  return (
    <div>
      <div className="board-header">
        <button className="to-home-button" onClick={() => navigate('/')}>
          ⇐ Додому
        </button>
        <div className="board-title">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value);
                setTitleError(null);
              }}
              onBlur={handleUpdateTitle}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <h1
              onClick={() => {
                setIsEditingTitle(true);
                setEditedTitle(boardData.title);
              }}
            >
              {boardData.title}
            </h1>
          )}
          <input
            type="color"
            value={color}
            onChange={handleColorChange}
            className="color-picker"
            title="Обрати колір дошки"
          />
          {titleError && <p className="error">{titleError}</p>}
        </div>
      </div>
      <div className="board-container">
        <div className="lists">
          {boardData.lists.map((list) =>
            board_id ? (
              <List
                key={list.id}
                title={list.title}
                cards={list.cards}
                boardId={Number(board_id)}
                listId={list.id}
                color={list.custom?.background}
                onListCreated={fetchBoard}
              />
            ) : null
          )}
          {board_id && <CreateList boardId={Number(board_id)} onListCreated={fetchBoard} />}
        </div>
        <button className="delete-board-button" onClick={handleDeleteBoard}>
          🗑 Видалити дошку
        </button>
      </div>
    </div>
  );
}

export default Board;
