import api from '../../../../api/request';
import { ICreateListProps } from '../../../../common/interfaces/ICreateListProps';
import './createList.scss';
import CreateModalEntity from '../../../Board/components/CreateModalEntity/CreateModalEntity';
import { toast } from 'sonner';

const CreateList: React.FC<ICreateListProps> = ({ boardId, onListCreated }) => {
  return (
    <CreateModalEntity
      entity="список"
      buttonText="+ Створити список"
      buttonClass="add-list-button"
      colorPickerClass="color-picker-list"
      onCreate={async (title, color, image, reset, setError) => {
        try {
          await api.post(`/board/${boardId}/list`, {
            title,
            position: 1,
            custom: { background: color, image },
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
