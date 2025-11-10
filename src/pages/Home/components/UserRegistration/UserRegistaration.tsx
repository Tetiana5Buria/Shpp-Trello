/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import './userRegistration.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { userForm, UserSignupData } from '../../../../common/helpers/userFormSchema';
import { calculatePasswordStrength, getStrengthLabel } from '../../../../common/helpers/passwordStrengthHelper';
import { checkExistingUser, registerUser } from '../../../../common/services/userServices';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../PasswordInput/PasswordInput';
import CustomButton from '../../../../common/customButton/CustomButton';

export default function SignupForm() {
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
  const navigate = useNavigate();

  const onSubmit = async (data: UserSignupData) => {
    try {
      const { passwordConfirmation, ...payload } = data;

      const exists = await checkExistingUser(payload.email);
      if (exists) {
        toast.error('Користувач із таким email вже існує!');
        return;
      }

      const res = await registerUser(payload.email, payload.password);
      if (res.result === 'Created') {
        toast.success('Реєстрація успішна!');

        setSuccess(true);
        navigate('/login');
        reset();
      } else {
        toast.error('Неочікувана відповідь сервера');
      }
    } catch (error) {
      console.log(`Помилка: ${(error as any).message ?? 'Невідома помилка'}`);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <h2 className="title">Реєстрація</h2>

        <div className="inputGroup">
          <label htmlFor="email" className="label">
            Email:
          </label>
          <input
            id="email"
            className={`input ${errors.email ? 'error' : ''}`}
            {...register('email')}
            placeholder="Введіть електронну адресу"
          />
          {errors.email && <p className="error errorMessage">{errors.email.message}</p>}
        </div>

        <div className="inputGroup">
          <PasswordInput label="Пароль:" register={register('password')} placeholder={'Введіть пароль'} />
          {errors.password && <p className="errorMessage">{errors.password.message}</p>}

          {password && (
            <div className="strengthContainer">
              <div className="strengthBar">
                {[...Array(4)].map((_, i) => (
                  <span
                    key={i}
                    className="strengthSegment"
                    style={{
                      backgroundColor: i < passwordStrength ? color : '#FFF',
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
          <PasswordInput
            label="Повторити пароль:"
            register={register('passwordConfirmation')}
            placeholder={'Повторіть пароль'}
          />
          {errors.passwordConfirmation && <p className="errorMessage">{errors.passwordConfirmation.message}</p>}
        </div>
        <CustomButton className="button" type="submit" loading={isSubmitting}>
          {isSubmitting ? 'Реєстрація...' : 'Зареєструватися'}
        </CustomButton>
        {success && <p className="successMessage">✅ Реєстрація успішна!</p>}

        <p className="loginLink">
          Вже є акаунт? <Link to="/login">Увійти</Link>
        </p>
      </form>
    </div>
  );
}
