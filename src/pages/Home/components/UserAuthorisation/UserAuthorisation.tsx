/* eslint-disable no-console */
import './userAuthorisation.scss';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useState } from 'react';
import { loginUser } from '../../../../common/services/userServices';
import CustomButton from '../../../../common/customButton/CustomButton';
import { userLoginForm, UserLoginData } from '../../../../common/helpers/userFormSchema';

export const UserAuthorisation = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginData>({
    resolver: zodResolver(userLoginForm),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('from') || '/';

  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: UserLoginData) => {
    try {
      const res = await loginUser(data.email, data.password);

      if (res.result === 'Authorized') {
        toast.success('Авторизація успішна!');
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate(redirectTo);
        }, 1500);
      } else {
        toast.error('Невірні дані для входу');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.message === 'Unauthorized (401)') {
        toast.error('Неправильний логін або пароль');
      } else {
        toast.error('Помилка під час авторизації');
      }
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="title">Авторизація</h2>

        <div className="inputGroup">
          <label htmlFor="email" className="label">
            Email:
          </label>
          <input
            id="email"
            type="text"
            className={`input ${errors.email ? 'error' : ''}`}
            placeholder="Введіть email"
            {...register('email')}
          />
          {errors.email && <p className="errorMessage">{errors.email.message}</p>}
        </div>

        <div className="inputGroup">
          <label htmlFor="password" className="label">
            Пароль:
          </label>
          <input
            id="password"
            type="password"
            className={`input ${errors.password ? 'error' : ''}`}
            placeholder="Введіть пароль"
            {...register('password')}
          />
          {errors.password && <p className="errorMessage">{errors.password.message}</p>}
        </div>

        <CustomButton className="button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Вхід...' : 'Увійти'}
        </CustomButton>

        {success && <p className="successMessage">✅ Вхід успішний!</p>}

        <p className="loginLink">
          Немає акаунта? <Link to="/user">Зареєструватися</Link>
        </p>
      </form>
    </div>
  );
};
