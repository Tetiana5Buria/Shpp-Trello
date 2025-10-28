/* eslint-disable no-console */
import './userRegistration.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { userForm, UserSignupData } from '../../../../common/helpers/userFormSchema';
import { calculatePasswordStrength, getStrengthLabel } from '../../../../common/helpers/passwordStrengthHelper';
export interface SignupFormProps {
  onClose?: () => void;
}

export default function SignupForm({ onClose }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserSignupData>({
    resolver: zodResolver(userForm),
  });

  const [success, setSuccess] = useState(false);
  const password = watch('password') || '';
  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);
  const { label, color } = getStrengthLabel(passwordStrength);

  const onSubmit = async (data: UserSignupData) => {
    try {
      const { passwordConfirmation, ...userData } = data;
      let storedUsers: UserSignupData[] = [];
      try {
        const storedData = localStorage.getItem('users');
        storedUsers = storedData ? JSON.parse(storedData) : [];
        if (!Array.isArray(storedUsers)) {
          storedUsers = [];
        }
      } catch (error) {
        toast.error('Не вдалося отримати доступ до сховища');
        return;
      }
      if (storedUsers.some((u) => u.userEmail === userData.userEmail)) {
        toast.error('Користувач з такою поштою вже існує!');
        return;
      }

      const updatedUsers = [...storedUsers, userData];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('✅ Користувача збережено в localStorage:', userData);
      setSuccess(true);
      reset();
      setTimeout(() => {
        setSuccess(false);
        onClose?.();
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error('Щось пішло не так: ' + err.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h2 className="title">Реєстрація</h2>
        <div className="inputGroup">
          <label htmlFor="userEmail" className="label">
            Email
          </label>
          <input id="userEmail" className={`input ${errors.userEmail ? 'error' : ''}`} {...register('userEmail')} />
          {errors.userEmail && <p className="error errorMessage">{errors.userEmail.message}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="password" className="label">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            className={`input ${errors.password ? 'error' : ''}`}
            {...register('password')}
          />
          {errors.password && <p className="errorMessage">{errors.password.message}</p>}

          {password && (
            <div className="strengthContainer">
              <div className="strengthBar">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="strengthSegment"
                    style={{
                      backgroundColor: i < passwordStrength ? color : '#4F4F',
                    }}
                  />
                ))}
              </div>
              <p className="strengthLabel" style={{ color }}>
                {label}
              </p>
            </div>
          )}
        </div>

        <div className="inputGroup">
          <label htmlFor="passwordConfirmation" className="label">
            Повторити пароль
          </label>
          <input
            id="passwordConfirmation"
            type="password"
            className={`input ${errors.passwordConfirmation ? 'error' : ''}`}
            {...register('passwordConfirmation')}
          />
          {errors.passwordConfirmation && <p className="errorMessage">{errors.passwordConfirmation.message}</p>}
        </div>

        <button className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
        </button>

        {success && <p className="successMessage">✅ Реєстрація успішна!</p>}

        <p className="loginLink">
          Уже маєте акаунт? <a href="/login">Увійти</a>
        </p>
      </form>
    </div>
  );
}
