import React from 'react';
import CreateModalEntity from '../CreateModalEntity/CreateModalEntity';
import './createCard.scss';
import { toast } from 'sonner';
import { createCard } from '../../../../common/services/createCardService';
import { ICreateCardProps } from '../../../../common/interfaces/Interfaces';

const CreateCard: React.FC<ICreateCardProps> = ({ boardId, listId, onCardCreated }) => {
  return (
    <CreateModalEntity
      entity="картку"
      buttonClass="add-card-button"
      buttonText="+ Додати картку"
      colorPickerClass="color-picker-list"
      onCreate={async (title, color, reset) => {
        try {
          await createCard(boardId, listId, title, color);
          reset();
          toast.success('Картку успішно створено!');
          onCardCreated();
        } catch (err) {
          toast.error('Помилка при створенні картки');
        }
      }}
    />
  );
};

export default CreateCard;
