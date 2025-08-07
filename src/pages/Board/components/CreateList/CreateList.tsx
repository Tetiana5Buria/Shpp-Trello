import api from '../../../../api/request';
import './createList.scss';
import CreateModalEntity from '../../../Board/components/CreateModalEntity/CreateModalEntity';
import { toast } from 'sonner';

interface CreateListProps {
  boardId: number;
  color?: string;
  onListCreated: () => void;
}

const CreateList: React.FC<CreateListProps> = ({ boardId, onListCreated, color }) => {
  return (
    <CreateModalEntity
      entity="список"
      buttonText="+ Створити список"
      buttonClass="add-list-button"
      colorPickerClass="color-picker-list"
      defaultColor={color}
      onCreate={async (title, color, reset, setError) => {
        try {
          await api.post(`/board/${boardId}/list`, {
            title,
            position: 1,
            custom: { background: color },
          });
          reset();
          toast.success('Список успішно створено!');
          onListCreated();
        } catch (err) {
          setError('Помилка при створенні списку');
        }
      }}
    />
  );
};

export default CreateList;
