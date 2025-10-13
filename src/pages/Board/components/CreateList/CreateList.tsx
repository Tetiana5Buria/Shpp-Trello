import { ICreateListProps } from '../../../../common/interfaces/Interfaces';
import './createList.scss';
import CreateModalEntity from '../../../Board/components/CreateModalEntity/CreateModalEntity';
import { toast } from 'sonner';
import { createList } from '../../../../common/services/createListServices';

const CreateList: React.FC<ICreateListProps> = ({ boardId, onListCreated }) => {
  return (
    <CreateModalEntity
      entity="список"
      buttonText="+ Створити список"
      buttonClass="add-list-button"
      colorPickerClass="color-picker-list"
      onCreate={async (title, color, reset, setError) => {
        try {
          await createList(boardId, title, color);
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
