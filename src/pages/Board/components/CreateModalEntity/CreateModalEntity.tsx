// src/components/CreateModalEntity/CreateModalEntity.tsx
import React, { useState } from 'react';
import { colorOptions } from '../../../../common/constants/ColorOptions';
import { validateTitle } from '../../../../utils/validateTitle';
import './createModalEntity.scss';

interface CreateModalEntityProps {
  entity: string;
  buttonText: string;
  buttonClass: string;
  colorPickerClass: string;
  defaultColor?: string;
  onCreate: (
    title: string,
    color: string,
    reset: () => void,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => void;
}

const CreateModalEntity: React.FC<CreateModalEntityProps> = ({
  entity,
  buttonText,
  buttonClass,
  colorPickerClass,
  defaultColor,
  onCreate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(defaultColor || colorOptions[0]);

  const reset = () => {
    setTitle('');
    setColor(colorOptions[0]);
    setIsOpen(false);
    setError(null);
  };

  const handleSubmit = () => {
    const { isValid, errorMessage } = validateTitle(title);
    if (!isValid) {
      setError(errorMessage);
      return;
    }
    onCreate(title, color, reset, setError);
  };

  return (
    <div>
      <button className={buttonClass} onClick={() => setIsOpen(true)}>
        {buttonText}
      </button>
      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Створити {entity}</h2>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder={`Назва ${entity}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
                if (e.key === 'Escape') setIsOpen(false);
              }}
              autoFocus
            />
            <div className="color-picker">
              <p>Оберіть колір:</p>
              <div className="colors">
                {colorOptions.map((colorDesk) => (
                  <button
                    key={colorDesk}
                    className={`color-circle ${color === colorDesk ? 'selected' : ''}`}
                    style={{ background: colorDesk }}
                    onClick={() => setColor(colorDesk)}
                  />
                ))}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className={colorPickerClass}
                  title={`Обрати колір ${entity}`}
                />
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            <div className="modal-actions">
              <button onClick={handleSubmit}>Створити</button>
              <button onClick={() => setIsOpen(false)}>Скасувати</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateModalEntity;
