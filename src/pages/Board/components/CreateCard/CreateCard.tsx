import CreateModalEntity from '../CreateModalEntity/CreateModalEntity';
import api from '../../../../api/request';
import './createCard.scss';
import { toast } from 'sonner';
interface CreateCardProps {
  boardId: number;
  listId: number;
  onCardCreated: () => void;
}

const CreateCard: React.FC<CreateCardProps> = ({ boardId, listId, onCardCreated }) => {
  return (
    <CreateModalEntity
      entity="картку"
      buttonText="+ Додати картку"
      buttonClass="create-card-button"
      colorPickerClass="color-picker-list"
      onCreate={async (title, color, reset, setError) => {
        try {
          await api.post(`/board/${boardId}/card`, {
            title,
            list_id: listId,
            position: 1,
            description: '',
            custom: { background: color },
          });
          reset();
          toast.success('Картку успішно створено!');
          onCardCreated();
        } catch (err) {
          setError('Помилка при створенні картки');
        }
      }}
    />
  );
};

export default CreateCard;
