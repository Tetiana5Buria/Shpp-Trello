/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import './userRegistration.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { userForm, UserSignupData } from '../../../../common/helpers/userFormSchema';
import { calculatePasswordStrength, getStrengthLabel } from '../../../../common/helpers/passwordStrengthHelper';
import api from '../../../../api/request';

interface RegisterResponse {
  result: string;
  id: number;
}

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
      const { passwordConfirmation, ...payload } = data;

      const existingUsers = await api.get('/user', {
        params: { emailOrUsername: payload.userEmail },
      });

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        toast.error('Користувач із таким email вже існує!');
        return;
      }

      const registerResponse = await api.post<RegisterResponse>('/user', {
        email: payload.userEmail,
        password: payload.password,
      });

      if (registerResponse) {
        toast.success('Реєстрація успішна!');
        setSuccess(true);
        reset();

        setTimeout(() => {
          setSuccess(false);
          onClose?.();
        }, 2000);
      } else {
        toast.error('Неочікувана відповідь сервера');
      }
    } catch (error: any) {
      toast.error('Помилка при реєстрації');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h2 className="title">Реєстрація</h2>

        <div className="inputGroup">
          <label htmlFor="userEmail" className="label">
            Email:
          </label>
          <input id="userEmail" className={`input ${errors.userEmail ? 'error' : ''}`} {...register('userEmail')} />
          {errors.userEmail && <p className="error errorMessage">{errors.userEmail.message}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="password" className="label">
            Пароль:
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
            Повторити пароль:
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
