import CreateModalEntity from '../CreateModalEntity/CreateModalEntity';
import api from '../../../../api/request';
import { ICreateCardProps } from '../../../../common/interfaces/ICreateCardProps';
import './createCard.scss';
import { toast } from 'sonner';

const CreateCard: React.FC<ICreateCardProps> = ({ boardId, listId, onCardCreated }) => {
  return (
    <CreateModalEntity
      entity="картку"
      buttonClass="add-card-button"
      buttonText="+ Додати картку"
      colorPickerClass="color-picker-list"
      onCreate={async (title, color, image, reset, setError) => {
        try {
          await api.post(`/board/${boardId}/card`, {
            title,
            list_id: listId,
            position: 1,
            description: '',
            custom: { background: color, image },
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
