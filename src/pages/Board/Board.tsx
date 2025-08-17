import { useEffect, useState } from 'react';
import List from './components/List/List';
import './board.scss';
import { useParams, useNavigate } from 'react-router-dom';
import CreateList from './components/CreateList/CreateList';
import { IBoardData } from '../../common/interfaces/IBoardData';
import { useColorUpdate } from '../Board/components/Board/hooks/useColorUpdate';
import { useEditableTitle } from '../Board/components/Board/hooks/useEditableTitle';
import { confirmAndDelete } from '../../utils/confirmAndDelete';
import { handleKeyDownFactory } from '../../utils/handleKeyDownFactory';
import api from '../../api/request';

function Board(): React.ReactElement {
  const { board_id } = useParams<{ board_id: string }>();
  const [boardData, setBoardData] = useState<IBoardData | null>(null);
  const navigate = useNavigate();

  const fetchBoard = async () => {
    try {
      const data: IBoardData = await api.get(`/board/${board_id}`);
      setBoardData(data);
    } catch {}
  };

  useEffect(() => {
    fetchBoard();
  }, [board_id]);

  const { color, handleColorChange } = useColorUpdate(
    boardData?.custom?.background || '#ffffff',
    `/board/${board_id}`,
    fetchBoard
  );

  const { isEditing, editedTitle, error, setIsEditing, setEditedTitle, setError, handleUpdateTitle } = useEditableTitle(
    boardData?.title || '',
    `/board/${board_id}`,
    fetchBoard
  );
  const handleKeyDown = handleKeyDownFactory(handleUpdateTitle, () => setIsEditing(false));

  const handleDeleteBoard = async () => {
    await confirmAndDelete('Ви впевнені, що хочете видалити дошку?', `/board/${board_id}`, () => navigate('/'));
  };

  if (!boardData) return <p>Loading...</p>;

  return (
    <div>
      <div className="board-header">
        <button className="to-home-button" onClick={() => navigate('/')}>
          ⇐ Додому
        </button>
        <div className="board-title">
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value);
                setError(null);
              }}
              onBlur={handleUpdateTitle}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <h1
              onClick={() => {
                setIsEditing(true);
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
          {error && <p className="error">{error}</p>}
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
