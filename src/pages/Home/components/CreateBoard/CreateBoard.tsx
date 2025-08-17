import React from 'react';
import api from '../../../../api/request';
import './createBoard.scss';
import CreateModalEntity from '../../../Board/components/CreateModalEntity/CreateModalEntity';
import { toast } from 'sonner';

interface CreateBoardProps {
  onBoardCreated: () => void;
}

const CreateBoard: React.FC<CreateBoardProps> = ({ onBoardCreated }) => {
  return (
    <CreateModalEntity
      entity="дошку"
      buttonText="+ Створити дошку"
      buttonClass="create-board-button"
      colorPickerClass="color-picker-board"
      onCreate={async (title, color, image, reset, setError) => {
        try {
          await api.post('/board', {
            title,
            custom: { background: color, image },
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
