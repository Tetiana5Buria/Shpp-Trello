export const validateTitle = (title: string): { isValid: boolean; errorMessage: string | null } => {
  const validation = /^[a-zA-Zа-щА-ЩЬьЮюЯяЇїІіЄєҐґ0-9\s\-._]+$/;

  if (!title.trim()) {
    return { isValid: false, errorMessage: 'Назва не може бути порожньою' };
  }

  if (!validation.test(title)) {
    return {
      isValid: false,
      errorMessage: 'Назва може містити лише літери, цифри, пробіли, тире, крапки та нижні підкреслення',
    };
  }
  if (title.length > 150) {
    return {
      isValid: false,
      errorMessage: 'Назва не може бути більшою за 50 симмволів',
    };
  }

  return { isValid: true, errorMessage: null };
};
