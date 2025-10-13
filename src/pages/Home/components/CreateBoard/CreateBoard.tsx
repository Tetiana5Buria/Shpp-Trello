import React from 'react';
import api from '../../../../api/request';
import './createBoard.scss';
import CreateModalEntityBoard from '../../components/CreateModalEntityBoard';
import { toast } from 'sonner';
import { CreateBoardProps } from '../../../../common/interfaces/Interfaces';

const CreateBoard: React.FC<CreateBoardProps> = ({ onBoardCreated }) => {
  return (
    <CreateModalEntityBoard
      entity="дошку"
      buttonText="+ Створити дошку"
      buttonClass="create-board-button"
      colorPickerClass="color-picker-board"
      onCreate={async (title, background, reset, setError) => {
        try {
          const custom = {
            background: background.color || background.image || '',
            backgroundType: background.color ? 'color' : 'image',
          };

          await api.post('/board', {
            title,
            custom,
          });
          reset();
          toast.success('Дошку успішно створено!');
          onBoardCreated();
        } catch (err) {
          setError('Помилка при створенні дошки');
          // eslint-disable-next-line no-console
          console.error(err);
        }
      }}
    />
  );
};

export default CreateBoard;
