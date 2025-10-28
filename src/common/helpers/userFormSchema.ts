import { z } from 'zod';
export const userForm = z
  .object({
    userEmail: z
      .string()
      .min(1, 'Електронна пошта обов’язкова')
      .email('Невірний формат електронної пошти')
      .refine((email) => email.trim().length > 0, 'Електронна пошта не може бути порожньою'),
    password: z.string().min(6, 'Пароль занадто короткий').max(20, 'Пароль занадто довгий'),
    passwordConfirmation: z.string().min(6, 'Пароль занадто короткий').max(20, 'Пароль занадто довгий'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Паролі не збігаються',
    path: ['passwordConfirmation'],
  });

export type UserSignupData = z.infer<typeof userForm>;
