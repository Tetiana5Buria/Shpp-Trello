import { useState } from 'react';
import './passwordInput.scss';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  label?: string;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any; // обов’язковий для інтеграції з react-hook-form
  placeholder?: string;
}

export default function PasswordInput({ label, error, register, placeholder }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      {label && <label className="label">{label}</label>}

      <div className="password-wrapper">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`input ${error ? 'error' : ''}`}
          {...register}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label="Показати або приховати пароль"
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      {error && <p className="errorMessage">{error}</p>}
    </div>
  );
}
